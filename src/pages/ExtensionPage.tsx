import { ArrowLeft, Check, Download, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

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

export function ExtensionPage() {
  const downloadUrl = import.meta.env.VITE_EXTENSION_DOWNLOAD_URL?.trim();

  return (
    <div className="min-h-svh bg-md-bg">
      <header className="border-b border-md-border bg-md-bg/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="text-xl font-medium">TraxJob</span>
          </Link>
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft />
              Back to TraxJob
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 md:py-20">
        <section className="rounded-md-xl bg-md-surface-container p-6 shadow-elev-2 sm:p-10">
          <div className="flex size-14 items-center justify-center rounded-md-md bg-md-secondary-container text-md-on-secondary-container">
            <Puzzle className="size-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Save job postings to TraxJob in seconds
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-md-muted">
            The TraxJob browser extension reads the job page you are viewing,
            lets you review and edit the details, then saves the application to
            your TraxJob account.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
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

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-md-lg bg-md-surface-container p-6 shadow-elev-1">
            <h2 className="text-xl font-semibold">How it works</h2>
            <ol className="mt-5 grid gap-4 text-sm text-md-muted">
              {[
                "Open a supported job detail page.",
                "Click the TraxJob Importer extension.",
                "Log in, review the preview, and edit anything needed.",
                "Click Save to add it to your application tracker.",
              ].map((step, index) => (
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
            <h2 className="text-xl font-semibold">Supported websites</h2>
            <ul className="mt-5 grid gap-3 text-sm text-md-muted sm:grid-cols-2">
              {SUPPORTED_SITES.map((site) => (
                <li key={site} className="flex items-center gap-2">
                  <Check className="size-4 text-md-primary" />
                  {site}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md-lg bg-md-surface-container p-6 shadow-elev-1 md:col-span-2">
            <h2 className="text-xl font-semibold">Install the extension</h2>
            <ol className="mt-5 grid gap-3 text-sm text-md-muted sm:grid-cols-2">
              {[
                "Download the extension ZIP.",
                "Extract the ZIP into a folder.",
                "Open chrome://extensions in Chrome.",
                "Turn on Developer mode.",
                "Click Load unpacked and select the extracted folder.",
              ].map((step, index) => (
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
