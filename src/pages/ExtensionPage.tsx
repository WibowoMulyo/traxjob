import { Check, Download, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/PublicHeader";

const SUPPORTED_SITES = [
  "LinkedIn",
  "JobStreet",
  "Glints",
  "MagangHub",
  "Kalibrr",
  "Indeed",
  "Pintarnya",
  "Dealls",
];

const HOW_IT_WORKS = [
  "Open a supported job detail page.",
  "Click the TraxJob Importer extension.",
  "Log in, review the preview, and edit anything needed.",
  "Click Save to add it to your application tracker.",
];

const INSTALL_STEPS = [
  "Download the extension ZIP.",
  "Extract the ZIP into a folder.",
  "Open chrome://extensions in Chrome.",
  "Turn on Developer mode.",
  "Click Load unpacked and select the extracted folder.",
];

export function ExtensionPage() {
  const downloadUrl = import.meta.env.VITE_EXTENSION_DOWNLOAD_URL?.trim();

  return (
    <div className="flex min-h-svh flex-col bg-md-bg">
      <PublicHeader />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-16 sm:px-6 md:py-24">
        <section className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-md-md bg-md-secondary-container text-md-on-secondary-container">
            <Puzzle className="size-7" />
          </div>
          <h1 className="mt-6 text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem]">
            Save job postings to TraxJob in seconds
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-md-muted">
            The TraxJob browser extension reads the job page you are viewing,
            lets you review and edit the details, then saves the application to
            your TraxJob account.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {downloadUrl ? (
              <Button asChild size="lg">
                <a href={downloadUrl} download>
                  Download Extension
                  <Download />
                </a>
              </Button>
            ) : (
              <p className="rounded-full bg-md-secondary-container px-4 py-2 text-sm font-medium text-md-on-secondary-container">
                Extension download is being prepared.
              </p>
            )}
            <Button asChild variant="outline" size="lg">
              <Link to="/privacy">Read privacy policy</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 grid gap-5 border-t border-md-border pt-16 md:grid-cols-2">
          <div className="rounded-md-lg bg-md-surface-container p-6 shadow-elev-1">
            <h2 className="text-lg font-medium">How it works</h2>
            <ol className="mt-5 grid gap-4 text-sm text-md-muted">
              {HOW_IT_WORKS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-md-primary text-xs font-semibold text-md-on-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-md-lg bg-md-surface-container p-6 shadow-elev-1">
            <h2 className="text-lg font-medium">Supported websites</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {SUPPORTED_SITES.map((site) => (
                <li
                  key={site}
                  className="flex items-center gap-2 rounded-full bg-md-secondary-container px-4 py-2.5 text-sm font-medium text-md-on-secondary-container"
                >
                  <Check className="size-4 shrink-0 text-md-primary" />
                  {site}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md-lg bg-md-surface-container p-6 shadow-elev-1 md:col-span-2">
            <h2 className="text-lg font-medium">Install the extension</h2>
            <ol className="mt-5 grid gap-3 text-sm text-md-muted sm:grid-cols-2">
              {INSTALL_STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-md-primary text-xs font-semibold text-md-on-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
