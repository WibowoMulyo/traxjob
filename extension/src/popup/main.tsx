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
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
    <main>
      <header className="app-header">
        <div className="brand">
          <img className="brand-mark" src="icon128.png" alt="" />
          <div>
            <strong>TraxJob Importer</strong>
            <small>Save jobs without the copy-paste</small>
          </div>
        </div>
        <div className="account-state">
          <span className={"status-dot " + (connected ? "is-connected" : "")} />
          <span>{connected ? "Connected" : "Not connected"}</span>
          {connected && (
            <button
              className="link-button"
              type="button"
              onClick={() => void disconnect()}
              disabled={busy}
            >
              Disconnect
            </button>
          )}
        </div>
      </header>

      {privacyConsent === null && <p className="message">{message}</p>}

      {privacyConsent === false ? (
        <section className="consent panel">
          <span className="eyebrow">Privacy first</span>
          <h1>Review before you save</h1>
          <p>
            TraxJob Importer reads the job page you choose, shows the detected
            details for your review, and sends the application to your TraxJob
            account only when you save it.
          </p>
          <a
            href="https://www.traxjob.my.id/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the privacy policy
          </a>
          <button
            className="primary full"
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
              <p className={successMessage ? "success" : "message"} role="status">
                {message}
              </p>
            )}

            {!connected ? (
              <section className="login-card panel">
                <span className="eyebrow">Almost there</span>
                <h1>Connect your TraxJob account</h1>
                <p>
                  Log in once to save this job and keep your applications in
                  sync.
                </p>
                <button className="primary full" onClick={login} disabled={busy}>
                  Login to TraxJob
                </button>
              </section>
            ) : (
              <form
                className="job-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
              >
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Imported job</span>
                      <h1>Review details</h1>
                    </div>
                    {form.source && <span className="source-badge">{form.source}</span>}
                  </div>
                  <div className="grid">
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
                  <Field
                    label="Job posting URL"
                    type="url"
                    value={form.url}
                    onChange={(value) => update("url", value)}
                  />
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Your tracker</span>
                      <h1>Application details</h1>
                    </div>
                  </div>
                  <div className="grid">
                    <Field
                      label="Source"
                      value={form.source}
                      onChange={(value) => update("source", value)}
                    />
                    <label className="field">
                      <span>Applied via</span>
                      <select
                        value={form.applyVia}
                        onChange={(event) => update("applyVia", event.target.value)}
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
                  <div className="grid">
                    <label className="field">
                      <span>Status</span>
                      <select
                        value={form.status}
                        onChange={(event) => update("status", event.target.value)}
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
                  <label className="field">
                    <span>Notes</span>
                    <textarea
                      value={form.notes}
                      onChange={(event) => update("notes", event.target.value)}
                      placeholder="Add context, salary, or follow-up notes…"
                    />
                  </label>
                </section>

                {duplicate && (
                  <p className="warning" role="alert">
                    This job is already saved. Do you want to save it again?
                  </p>
                )}
                <div className="actions">
                  {duplicate && (
                    <button
                      type="button"
                      onClick={() => void save(true)}
                      disabled={busy}
                    >
                      Save anyway
                    </button>
                  )}
                  <button type="submit" className="primary" disabled={busy}>
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
