import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Download,
  ListChecks,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import type { JobStatus } from "@/jobs/jobs.types";

const FEATURES = [
  {
    icon: ListChecks,
    title: "A clear status pipeline",
    body: "Move every application through Wishlist → Applied → Interview → Offer, and see exactly where each one stands.",
  },
  {
    icon: Search,
    title: "Search, filter & sort",
    body: "Find any role in a second by company, source, or status — and sort by the date you applied.",
  },
  {
    icon: Download,
    title: "Export & import",
    body: "Your data is portable. Download everything as JSON or CSV, and import it back anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "No accounts, no servers. Everything is stored locally in your browser — your job search stays yours.",
  },
  {
    icon: CalendarClock,
    title: "Notes & follow-ups",
    body: "Jot down recruiter names, salary ranges, and deadlines so you never miss a follow-up.",
  },
  {
    icon: Palette,
    title: "Light & dark, your way",
    body: "A calm Material You interface in the TraxJob palette, with a polished light and dark theme.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Add an application",
    body: "Capture the company, role, source, and how you applied in seconds.",
  },
  {
    n: "2",
    title: "Track its progress",
    body: "Update the status as you hear back and keep notes on every conversation.",
  },
  {
    n: "3",
    title: "Stay on top of it",
    body: "Search, filter, and review your pipeline at a glance — then export to back up.",
  },
];

const PREVIEW_ROWS: { company: string; role: string; status: JobStatus }[] = [
  { company: "Qiscus", role: "Backend Engineer", status: "interview" },
  { company: "Acme Corp", role: "Frontend Engineer", status: "applied" },
  { company: "Globex", role: "Product Designer", status: "offer" },
  { company: "Initech", role: "Data Analyst", status: "wishlist" },
];

function LandingBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* little-dots texture across the entire page */}
      <div className="landing-grid absolute inset-0 text-md-outline opacity-50" />

      {/* soft, diffuse ambient color (kept very subtle) across every section */}
      <div className="absolute -top-24 -right-24 h-[34rem] w-[34rem] animate-[blob-drift-a_24s_ease-in-out_infinite_alternate] rounded-full bg-md-primary opacity-[0.12] blur-[110px]" />
      <div className="absolute top-[12%] -left-28 h-[30rem] w-[30rem] animate-[blob-drift-b_30s_ease-in-out_infinite_alternate] rounded-full bg-md-tertiary opacity-[0.1] blur-[110px]" />
      <div className="absolute top-[32%] -right-28 h-[32rem] w-[32rem] animate-[blob-drift-c_26s_ease-in-out_infinite_alternate] rounded-full bg-md-secondary-container opacity-[0.16] blur-[120px]" />
      <div className="absolute top-[50%] -left-24 h-[30rem] w-[30rem] animate-[blob-drift-a_28s_ease-in-out_infinite_alternate] rounded-full bg-md-primary opacity-[0.1] blur-[110px] [animation-delay:-8s]" />
      <div className="absolute top-[70%] -right-24 h-[30rem] w-[30rem] animate-[blob-drift-b_32s_ease-in-out_infinite_alternate] rounded-full bg-md-tertiary opacity-[0.11] blur-[110px] [animation-delay:-6s]" />
      <div className="absolute top-[88%] -left-20 h-[28rem] w-[28rem] animate-[blob-drift-c_30s_ease-in-out_infinite_alternate] rounded-full bg-md-primary opacity-[0.1] blur-[110px] [animation-delay:-12s]" />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-md-border bg-md-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="size-8" />
          <span className="text-xl font-medium tracking-[-0.01em]">TraxJob</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#features"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-md-muted transition-colors hover:text-md-text sm:inline-block"
          >
            Features
          </a>
          <a
            href="#how"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-md-muted transition-colors hover:text-md-text sm:inline-block"
          >
            How it works
          </a>
          <Button asChild>
            <Link to="/app">Open app</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-69px)] items-center overflow-hidden">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-md-secondary-container px-3.5 py-1.5 text-xs font-medium text-md-on-secondary-container">
            <Sparkles className="size-3.5" />
            Free · Private · Offline-first
          </span>
          <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[3.25rem]">
            Track every job application in one calm place.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-md-muted">
            TraxJob keeps your job search organized — log applications, move them
            through clear stages, and follow up on time. No spreadsheets, no
            sign-up, your data stays in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="text-base">
              <Link to="/app">
                Open TraxJob
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <a href="#features">See features</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-md-muted">
            No account needed — opens instantly in your browser.
          </p>
        </div>

        {/* Product preview mock */}
        <div className="relative">
          <div className="rounded-md-xl border border-md-border bg-md-surface-container p-5 shadow-elev-3">
            <div className="mb-4 flex items-center gap-2.5">
              <Logo className="size-7" />
              <span className="font-medium">TraxJob</span>
              <span className="ml-auto rounded-full bg-md-primary px-3 py-1 text-xs font-medium text-md-on-primary">
                + Add
              </span>
            </div>
            <div className="overflow-hidden rounded-md-lg border border-md-border">
              {PREVIEW_ROWS.map((r, i) => (
                <div
                  key={r.company}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i !== PREVIEW_ROWS.length - 1
                      ? "border-b border-md-border"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {r.company}
                    </div>
                    <div className="truncate text-xs text-md-muted">
                      {r.role}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 bg-gradient-to-b from-md-surface-container/70 to-md-surface-container/20 px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            Everything your job search needs
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            Purpose-built for job seekers — nothing more, nothing in the way.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-md-lg bg-md-surface-container p-6 shadow-elev-1 transition-[box-shadow,transform] duration-300 ease-md hover:-translate-y-1 hover:shadow-elev-2"
            >
              <div className="flex size-12 items-center justify-center rounded-md-md bg-md-secondary-container text-md-on-secondary-container transition-transform duration-300 ease-md group-hover:scale-105">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-md-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-20 bg-md-secondary-container/25 px-6 py-16 md:py-24"
    >
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[2rem] bg-md-surface-container px-6 py-14 shadow-elev-1 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-md-primary opacity-[0.08] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-md-tertiary opacity-[0.08] blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            Get organized in three steps
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            From first application to offer — without the spreadsheet chaos.
          </p>
        </div>
        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-md-primary text-2xl font-bold text-md-on-primary shadow-elev-2">
                {s.n}
              </div>
              <h3 className="mt-5 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-md-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[2rem] bg-md-primary px-6 py-16 text-center shadow-elev-3 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <h2 className="text-3xl font-bold tracking-[-0.01em] text-md-on-primary sm:text-4xl">
          Ready to get organized?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-md-on-primary/85">
          Start tracking your applications in seconds. It's free, private, and
          works right in your browser.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-md-bg text-base text-md-primary hover:bg-md-bg/90"
          >
            <Link to="/app">
              Open TraxJob
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-md-border px-6 py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo className="size-7" />
          <span className="font-medium">TraxJob</span>
          <span className="text-sm text-md-muted">
            · Track your job search, calmly.
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-md-muted">
          <a
            href="https://github.com/WibowoMulyo/traxjob"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 transition-colors hover:text-md-text"
          >
            GitHub
            <ArrowUpRight className="size-4" />
          </a>
          <span>© {new Date().getFullYear()} TraxJob</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="relative z-10 flex min-h-svh flex-col">
      <LandingBackdrop />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
