import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type JobForm = {
  company: string;
  role: string;
  url: string;
  source: string;
  applyVia: string;
  status: string;
  dateApplied: string;
  contact: string;
  notes: string;
};

const emptyForm: JobForm = {
  company: "",
  role: "",
  url: "",
  source: "",
  applyVia: "",
  status: "wishlist",
  dateApplied: "",
  contact: "",
  notes: "",
};
const CONSENT_KEY = "traxjob.extension.privacy-consent";

function send<T>(message: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: T & { error?: string }) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (response?.error) {
        reject(new Error(response.error));
        return;
      }
      resolve(response);
    });
  });
}

function Field({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  [key: string]: unknown;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-md-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-md-border bg-md-surface-container px-3 py-2 text-sm text-md-text outline-none transition-all focus:border-md-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)]"
        {...props}
      />
    </label>
  );
}

function App() {
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [connected, setConnected] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Loading extension…");
  const [busy, setBusy] = useState(false);

  const update = (key: keyof JobForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const loadJob = async () => {
    const result = await send<{ job: JobForm }>({ type: "get-job" });
    setForm({ ...emptyForm, ...result.job });
    setMessage("");
  };

  const initialize = async () => {
    const session = await send<{ user: unknown }>({ type: "session" });
    setConnected(Boolean(session.user));
    await loadJob();
  };

  useEffect(() => {
    chrome.storage.local
      .get(CONSENT_KEY)
      .then((result: Record<string, unknown>) => {
        const consented = Boolean(result[CONSENT_KEY]);
        setPrivacyConsent(consented);
        if (consented) return initialize();
        setMessage("Review the data policy before continuing.");
      })
      .catch((error: unknown) =>
        setMessage(error instanceof Error ? error.message : String(error)),
      );
  }, []);

  const acceptPrivacy = async () => {
    setBusy(true);
    try {
      await chrome.storage.local.set({ [CONSENT_KEY]: true });
      setPrivacyConsent(true);
      await initialize();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const login = async () => {
    setBusy(true);
    setMessage("Opening TraxJob login…");
    try {
      await send({ type: "connect" });
      setConnected(true);
      await loadJob();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    setBusy(true);
    try {
      await send({ type: "disconnect" });
      setConnected(false);
      setDuplicate(false);
      setMessage("Disconnected from TraxJob.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const save = async (force = false) => {
    if (!form.company.trim() || !form.role.trim()) {
      setMessage("Company and Role are required.");
      return;
    }
    setBusy(true);
    setMessage("Saving…");
    try {
      const result = await send<{ duplicate?: boolean }>({
        type: "save-job",
        job: form,
        force,
      });
      if (result.duplicate) {
        setDuplicate(true);
        setMessage("This job URL is already in TraxJob.");
      } else {
        setDuplicate(false);
        setMessage("Saved to TraxJob.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const successMessage =
    message.startsWith("Saved") || message.startsWith("Disconnected");

  return (
    <main className="min-h-screen bg-gradient-to-br from-md-bg to-md-surface-low p-4">
      <header className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-md-surface-container/50 p-3 shadow-sm backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-2.5">
          <img className="size-9 rounded-xl shadow-md" src="icon128.png" alt="" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-md-text">TraxJob</div>
            <div className="truncate text-xs text-md-muted">Extension</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`size-2 rounded-full ${connected ? "bg-md-primary shadow-[0_0_0_3px_rgba(15,110,86,0.12)]" : "bg-md-muted"}`} />
          <span className="text-xs text-md-muted">{connected ? "Connected" : "Disconnected"}</span>
          {connected && (
            <button
              className="ml-1 text-xs font-semibold text-md-primary transition-colors hover:text-md-primary-hover"
              type="button"
              onClick={() => void disconnect()}
              disabled={busy}
            >
              Disconnect
            </button>
          )}
        </div>
      </header>

      {privacyConsent === null && (
        <div className="rounded-xl bg-md-surface-container/50 p-4 text-sm text-md-muted backdrop-blur-sm">
          {message}
        </div>
      )}

      {privacyConsent === false ? (
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-md-surface-container to-md-surface-low p-6 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-md-primary">Privacy first</span>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-md-text">Review before you save</h1>
          <p className="mt-3 text-sm leading-relaxed text-md-muted">
            TraxJob Importer reads the job page you choose, shows the detected
            details for your review, and sends the application to your TraxJob
            account only when you save it.
          </p>
          <a
            href="https://www.traxjob.my.id/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-md-primary hover:text-md-primary-hover"
          >
            Read the privacy policy →
          </a>
          <button
            className="mt-4 w-full rounded-xl bg-md-primary px-4 py-3 text-sm font-semibold text-md-on-primary shadow-md transition-all hover:bg-md-primary-hover hover:shadow-lg active:scale-[0.98]"
            onClick={() => void acceptPrivacy()}
            disabled={busy}
          >
            Continue and review data
          </button>
        </section>
      ) : (
        privacyConsent === true && (
          <>
            {message && (
              <div className={`mb-4 rounded-xl p-3 text-sm ${successMessage ? "bg-md-offer/10 text-md-offer" : "bg-md-surface-container/50 text-md-muted backdrop-blur-sm"}`} role="status">
                {message}
              </div>
            )}

            {!connected ? (
              <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-md-surface-container to-md-surface-low p-6 shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-md-primary">Almost there</span>
                <h1 className="mt-2 text-xl font-bold tracking-tight text-md-text">Connect your account</h1>
                <p className="mt-3 text-sm leading-relaxed text-md-muted">
                  Log in once to save this job and keep your applications in sync.
                </p>
                <button 
                  className="mt-4 w-full rounded-xl bg-md-primary px-4 py-3 text-sm font-semibold text-md-on-primary shadow-md transition-all hover:bg-md-primary-hover hover:shadow-lg active:scale-[0.98]" 
                  onClick={login} 
                  disabled={busy}
                >
                  Login to TraxJob
                </button>
              </section>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
              >
                <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-md-surface-container to-md-surface-low p-5 shadow-md">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-md-primary">Imported job</span>
                      <h2 className="mt-1 text-lg font-bold tracking-tight text-md-text">Review details</h2>
                    </div>
                    {form.source && (
                      <span className="rounded-full bg-md-primary/10 px-3 py-1 text-xs font-bold text-md-primary">
                        {form.source}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Company *"
                      value={form.company}
                      onChange={(value) => update("company", value)}
                    />
                    <Field
                      label="Role *"
                      value={form.role}
                      onChange={(value) => update("role", value)}
                    />
                  </div>
                  <div className="mt-3">
                    <Field
                      label="Job posting URL"
                      type="url"
                      value={form.url}
                      onChange={(value) => update("url", value)}
                    />
                  </div>
                </section>

                <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-md-surface-container to-md-surface-low p-5 shadow-md">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-md-primary">Your tracker</span>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-md-text">Application details</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Source"
                        value={form.source}
                        onChange={(value) => update("source", value)}
                      />
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-md-muted">Applied via</span>
                        <select
                          value={form.applyVia}
                          onChange={(event) => update("applyVia", event.target.value)}
                          className="rounded-lg border border-md-border bg-md-surface-container px-3 py-2 text-sm text-md-text outline-none transition-all focus:border-md-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)]"
                        >
                          <option value="">Not applied yet</option>
                          <option>Email</option>
                          <option>LinkedIn</option>
                          <option>Glints</option>
                          <option>Indeed</option>
                          <option>JobStreet</option>
                          <option>MagangHub</option>
                          <option>Kalibrr</option>
                          <option>Pintarnya</option>
                          <option>Dealls</option>
                          <option>Company Profile / Website</option>
                          <option>Other</option>
                        </select>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-md-muted">Status</span>
                        <select
                          value={form.status}
                          onChange={(event) => update("status", event.target.value)}
                          className="rounded-lg border border-md-border bg-md-surface-container px-3 py-2 text-sm text-md-text outline-none transition-all focus:border-md-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)]"
                        >
                          <option value="wishlist">Wishlist</option>
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="psychological_test">Psychological Test</option>
                          <option value="technical_test">Technical Test</option>
                          <option value="interview">Interview (General)</option>
                          <option value="interview_hr">Interview HR</option>
                          <option value="interview_user">Interview User</option>
                          <option value="final_interview">Final Interview</option>
                          <option value="offer">Offer</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                      </label>
                      <Field
                        label="Date applied"
                        type="date"
                        value={form.dateApplied}
                        onChange={(value) => update("dateApplied", value)}
                      />
                    </div>
                    <Field
                      label="Contact link"
                      value={form.contact}
                      onChange={(value) => update("contact", value)}
                    />
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-md-muted">Notes</span>
                      <textarea
                        value={form.notes}
                        onChange={(event) => update("notes", event.target.value)}
                        placeholder="Add context, salary, or follow-up notes…"
                        className="min-h-[80px] resize-y rounded-lg border border-md-border bg-md-surface-container px-3 py-2 text-sm text-md-text outline-none transition-all focus:border-md-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)]"
                      />
                    </label>
                  </div>
                </section>

                {duplicate && (
                  <div className="rounded-xl bg-md-rejected/10 p-3 text-sm text-md-rejected" role="alert">
                    This job is already saved. Do you want to save it again?
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  {duplicate && (
                    <button
                      type="button"
                      onClick={() => void save(true)}
                      disabled={busy}
                      className="rounded-lg border border-md-border bg-md-surface-container px-4 py-2 text-sm font-semibold text-md-text transition-all hover:bg-md-surface-low hover:shadow-sm active:scale-[0.98]"
                    >
                      Save anyway
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="rounded-lg bg-md-primary px-4 py-2 text-sm font-semibold text-md-on-primary shadow-md transition-all hover:bg-md-primary-hover hover:shadow-lg active:scale-[0.98]" 
                    disabled={busy}
                  >
                    {busy ? "Saving…" : "Save application"}
                  </button>
                </div>
              </form>
            )}
          </>
        )
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
