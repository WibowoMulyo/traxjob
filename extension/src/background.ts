import { hasJobMetadata, sourceFromUrl, type ExtractedJob } from "./parsers/index.js";
import { shouldInjectContentScript } from "./contentBridge.js";

const API_BASE_URL = (import.meta.env.VITE_TRAXJOB_URL ?? "https://traxjob.vercel.app").replace(/\/$/, "");
const TOKEN_KEY = "traxjob.extension.token";
const REDIRECT_PATH = "traxjob-callback";

type StoredAuth = { token: string; expiresAt: string; user: unknown };
type SaveJob = ExtractedJob & {
  applyVia: string;
  status: string;
  dateApplied: string;
  contact: string;
  notes: string;
};

async function storedAuth(): Promise<StoredAuth | null> {
  const result = await chrome.storage.local.get(TOKEN_KEY);
  const auth = result[TOKEN_KEY] as StoredAuth | undefined;
  if (!auth || Date.parse(auth.expiresAt) <= Date.now()) {
    await chrome.storage.local.remove(TOKEN_KEY);
    return null;
  }
  return auth;
}

async function api<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}/api${path}`, { ...init, headers });
  const body = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`);
  return body as T;
}

async function connect(): Promise<StoredAuth> {
  const state = crypto.randomUUID();
  const redirectUri = chrome.identity.getRedirectURL(REDIRECT_PATH);
  const authorize = new URL(`${API_BASE_URL}/api/auth/extension/authorize`);
  authorize.searchParams.set("redirectUri", redirectUri);
  authorize.searchParams.set("state", state);
  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authorize.toString(),
    interactive: true,
  });
  if (!responseUrl) throw new Error("Login was cancelled");
  const callback = new URL(responseUrl);
  if (callback.searchParams.get("state") !== state) throw new Error("Invalid login state");
  const auth = await api<StoredAuth>("/auth/extension/token", {
    method: "POST",
    body: JSON.stringify({ code: callback.searchParams.get("code"), redirectUri }),
  });
  await chrome.storage.local.set({ [TOKEN_KEY]: auth });
  return auth;
}

async function requireAuth(): Promise<StoredAuth> {
  const auth = await storedAuth();
  if (!auth) return connect();
  try {
    await api("/auth/me", undefined, auth.token);
    return auth;
  } catch {
    await chrome.storage.local.remove(TOKEN_KEY);
    return connect();
  }
}

async function activeJob(): Promise<ExtractedJob> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !sourceFromUrl(tab.url ?? "")) {
    throw new Error("Open a supported job detail page first");
  }
  try {
    const job = await chrome.tabs.sendMessage(tab.id, { type: "extract-job" });
    if (!hasJobMetadata(job)) {
      throw new Error("No job metadata found on this page. Open a job detail page.");
    }
    return job;
  } catch (error) {
    if (!shouldInjectContentScript(error)) throw error;
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    const job = await chrome.tabs.sendMessage(tab.id, { type: "extract-job" });
    if (!hasJobMetadata(job)) {
      throw new Error("No job metadata found on this page. Open a job detail page.");
    }
    return job;
  }
}

async function saveJob(job: SaveJob, force = false): Promise<{ duplicate?: boolean }> {
  const auth = await requireAuth();
  const existing = await api<{ jobs: Array<{ url: string }> }>("/jobs", undefined, auth.token);
  const normalized = job.url.trim().replace(/#.*$/, "");
  const duplicate = Boolean(normalized && existing.jobs.some((item) => item.url.trim().replace(/#.*$/, "") === normalized));
  if (duplicate && !force) return { duplicate: true };
  await api(`/jobs/${crypto.randomUUID()}`, {
    method: "PUT",
    body: JSON.stringify({ ...job, url: normalized, createdAt: new Date().toISOString() }),
  }, auth.token);
  return {};
}

chrome.runtime.onMessage.addListener((message: { type?: string; job?: SaveJob; force?: boolean }, _sender: unknown, sendResponse: (value: unknown) => void) => {
  (async () => {
    switch (message.type) {
      case "get-job":
        return { job: await activeJob() };
      case "connect":
        return { user: (await connect()).user };
      case "session":
        return { user: (await storedAuth())?.user ?? null };
      case "save-job":
        return saveJob(message.job!, message.force);
      case "disconnect": {
        const auth = await storedAuth();
        if (auth) await api("/auth/extension/revoke", { method: "POST" }, auth.token).catch(() => undefined);
        await chrome.storage.local.remove(TOKEN_KEY);
        return {};
      }
      default:
        throw new Error("Unknown extension message");
    }
  })().then(sendResponse).catch((error: unknown) => sendResponse({ error: error instanceof Error ? error.message : String(error) }));
  return true;
});
