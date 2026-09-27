import { PublicHeader } from "@/components/PublicHeader";

export function PrivacyPage() {
  return (
    <div className="min-h-svh bg-md-bg">
      <PublicHeader />

      <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 md:py-16">
        <article className="rounded-md-xl bg-md-surface-container p-6 shadow-elev-1 sm:p-10">
          <p className="text-sm font-medium text-md-primary">Last updated: 8 September 2026</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em]">TraxJob Extension Privacy Policy</h1>
          <p className="mt-5 leading-relaxed text-md-muted">
            This policy explains how the TraxJob browser extension handles data
            when you use it to save job postings to your TraxJob account.
          </p>

          <div className="mt-10 grid gap-8 text-sm leading-relaxed text-md-muted">
            <section>
              <h2 className="text-lg font-semibold text-md-text">Data we handle</h2>
              <p className="mt-2">
                The extension reads job metadata from the supported page you
                choose to import, such as company, role, URL, source, and job
                description. It also handles the TraxJob account identity and
                the application fields you review or enter, including notes,
                status, date, and contact information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-md-text">How we use data</h2>
              <p className="mt-2">
                We use this data only to provide the extension&apos;s single
                purpose: importing and saving job applications to your TraxJob
                account. Page metadata is sent to TraxJob only when you save
                the reviewed application. We do not sell data, use it for
                advertising, or use it to build browsing profiles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-md-text">Authentication and storage</h2>
              <p className="mt-2">
                The extension stores its session token in the browser&apos;s
                extension storage and sends it over HTTPS when communicating
                with TraxJob. Disconnecting the extension revokes the token.
                Applications are stored in your TraxJob account and can be
                edited or deleted from the TraxJob dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-md-text">Sharing and retention</h2>
              <p className="mt-2">
                Data is shared only with TraxJob services needed to provide the
                import and tracking feature. We do not share it with advertisers
                or data brokers. Application data remains in your account until
                you delete it or request account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-md-text">Limited Use</h2>
              <p className="mt-2">
                TraxJob&apos;s use of information received from the extension
                complies with the Chrome Web Store User Data Policy, including
                the Limited Use requirements. Data is used only to provide the
                user-facing import and job-tracking functionality.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-md-text">Contact</h2>
              <p className="mt-2">
                Questions or privacy requests can be sent to{" "}
                <a className="font-medium text-md-primary hover:underline" href="mailto:traxjobofficial@gmail.com">
                  traxjobofficial@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
