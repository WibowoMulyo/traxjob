import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { Logo } from "@/components/Logo";
import { PublicHeader } from "@/components/PublicHeader";
import { useReveal } from "@/hooks/useReveal";
import { useSpotlight } from "@/hooks/useSpotlight";
import type { JobStatus } from "@/jobs/jobs.types";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { BentoFeatures } from "@/components/BentoFeatures";
import { AnimatedStats } from "@/components/AnimatedStats";

const EXTENSION_SITES = [
  "LinkedIn",
  "JobStreet",
  "Glints",
  "MagangHub",
  "Kalibrr",
  "Indeed",
  "Pintarnya",
  "Dealls",
];

const PIPELINE: { status: JobStatus; title: string; body: string }[] = [
  {
    status: "wishlist",
    title: "Wishlist",
    body: "Save roles worth a shot before you apply.",
  },
  {
    status: "applied",
    title: "Applied",
    body: "Log where and when you sent each application.",
  },
  {
    status: "interview",
    title: "Interview",
    body: "Track every round and keep notes on the conversation.",
  },
  {
    status: "offer",
    title: "Offer",
    body: "See what is on the table before you decide.",
  },
];

const STAGE_DOT: Record<JobStatus, string> = {
  wishlist: "bg-md-wishlist",
  applied: "bg-md-applied",
  screening: "bg-md-applied",
  psychological_test: "bg-md-interview",
  technical_test: "bg-md-interview",
  interview: "bg-md-interview",
  interview_hr: "bg-md-interview",
  interview_user: "bg-md-interview",
  final_interview: "bg-md-interview",
  offer: "bg-md-offer",
  accepted: "bg-md-offer",
  rejected: "bg-md-rejected",
  withdrawn: "bg-md-rejected",
};

function LandingBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="floating absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-md-primary opacity-[0.07] blur-[120px]" />
      <div className="floating absolute bottom-[-12rem] left-[-10%] h-[34rem] w-[34rem] rounded-full bg-md-tertiary opacity-[0.06] blur-[120px] [animation-delay:1s]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-md-bg/50" />
    </div>
  );
}



function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-12 md:py-24">
        <div>
          <span className="landing-enter inline-flex items-center gap-2 rounded-full border border-md-primary/25 bg-md-primary/5 px-3.5 py-1.5 text-xs font-medium text-md-primary backdrop-blur-sm">
            <ShieldCheck className="size-3.5" aria-hidden />
            No ads, no trackers
          </span>
          <h1 className="landing-enter mt-6 text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] [animation-delay:60ms] sm:text-[2.6rem] md:text-[3.25rem]">
            Keep your <span className="gradient-text">job search</span> organized, from application to offer.
          </h1>
          <p className="landing-enter mt-6 max-w-xl text-lg leading-relaxed text-md-muted [animation-delay:120ms]">
            Save every application, track its progress, and know what to follow
            up on, without spreadsheets.
          </p>
          <div className="landing-enter mt-8 flex flex-wrap items-center gap-3 [animation-delay:180ms]">
            {user ? (
              <Button asChild size="lg" className="group pulse-glow text-base">
                <Link to="/app">
                  Open TraxJob
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="group pulse-glow text-base">
                  <Link to="/register">
                    Start tracking for free
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base backdrop-blur-sm">
                  <Link to="/login">Log in</Link>
                </Button>
              </>
            )}
          </div>
          {!user && (
            <p className="landing-enter mt-4 text-sm text-md-muted [animation-delay:240ms]">
              Free to use. No credit card required.
            </p>
          )}
        </div>

        <div className="landing-enter relative [animation-delay:300ms]">
          <InteractiveDemo />
        </div>
      </div>

      <Link
        to="/#features"
        aria-label="Scroll to features"
        className="landing-enter absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full p-3 text-md-muted outline-none transition-all duration-300 hover:scale-110 hover:text-md-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary [animation-delay:600ms]"
      >
        <ChevronDown className="size-5 animate-bounce" />
      </Link>
    </section>
  );
}



function Pipeline() {
  const { ref, visible } = useReveal();
  return (
    <section
      id="how"
      className="scroll-mt-16 border-t border-md-border bg-md-secondary-container/25 px-4 py-20 sm:px-6 md:py-28"
    >
      <div
        ref={ref}
        className="mx-auto w-full max-w-[1100px]"
      >
        <div
          className={`mx-auto max-w-2xl text-center ${visible ? "landing-reveal" : "opacity-0"}`}
        >
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            From wishlist to offer
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            TraxJob mirrors how a real search moves. Each stage keeps its own
            notes, dates, and contacts.
          </p>
        </div>

        <ol
          className={`mt-12 grid gap-8 text-center md:grid-cols-4 md:gap-6 ${
            visible ? "landing-reveal [animation-delay:90ms]" : "opacity-0"
          }`}
        >
          {PIPELINE.map((stage, i) => (
            <li
              key={stage.status}
              className="group relative rounded-md-lg p-4 transition-[transform,background-color,box-shadow] duration-300 ease-md hover:-translate-y-1 hover:bg-md-surface-container hover:shadow-elev-1"
            >
              <div className="flex items-center justify-center gap-3">
                <span
                  className={`size-3 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${STAGE_DOT[stage.status]}`}
                  aria-hidden
                />
                {i < PIPELINE.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden h-px flex-1 border-t border-dashed border-md-outline/50 md:block"
                  />
                )}
              </div>
              {i < PIPELINE.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-9 bottom-[-2rem] border-l border-dashed border-md-outline/50 md:hidden"
                />
              )}
              <h3 className="mt-4 text-lg font-medium">{stage.title}</h3>
              <p className="mx-auto mt-1 max-w-[22ch] text-sm leading-relaxed text-md-muted">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Extension() {
  const { ref, visible } = useReveal();
  const onSpotlight = useSpotlight<HTMLDivElement>();
  return (
    <section className="scroll-mt-16 border-t border-md-border px-4 py-20 sm:px-6 md:py-28">
      <div ref={ref} className="mx-auto w-full max-w-[1100px]">
        <div
          className={`mx-auto max-w-2xl text-center ${visible ? "landing-reveal" : "opacity-0"}`}
        >
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            Grab a posting while you browse
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            The browser extension reads the job page you are viewing, and saves
            it to your tracker with one click. Works on the boards you already
            use.
          </p>
        </div>
        <div
          className={`mx-auto mt-12 max-w-2xl ${
            visible ? "landing-reveal [animation-delay:90ms]" : "opacity-0"
          }`}
        >
          <div
            onMouseMove={onSpotlight}
            className="spotlight rounded-md-xl border border-md-border bg-md-surface-container p-6 shadow-elev-1 transition-[transform,box-shadow] duration-300 ease-md hover:-translate-y-1 hover:shadow-elev-3"
          >
            <h3 className="text-center text-sm font-medium text-md-muted">
              Save from these job boards
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {EXTENSION_SITES.map((site) => (
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
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="outline" className="group">
              <Link to="/extension">
                See how the extension works
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { user } = useAuth();
  const { ref, visible } = useReveal();
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28">
      <div
        ref={ref}
        className={`relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-md-primary to-md-tertiary px-6 py-14 shadow-elev-3 sm:px-12 ${visible ? "landing-reveal" : "opacity-0"}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-md-on-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 right-[-8rem] h-64 w-64 rounded-full bg-md-on-primary/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-md-on-primary sm:text-4xl">
            Take control of your job search.
          </h2>
          <p className="mt-4 text-lg text-md-on-primary/90">
            Track every application in one clear, private workspace.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="pulse-glow bg-md-bg text-base text-md-primary transition-transform duration-300 hover:scale-105 hover:bg-md-bg/90"
            >
              {user ? (
                <Link to="/app">Open TraxJob</Link>
              ) : (
                <Link to="/register">Start tracking for free</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-md-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo className="size-7" />
          <span className="font-medium">TraxJob</span>
          <span className="text-sm text-md-muted">
            Track your job search, calmly.
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-md-muted">
          <Link to="/extension" className="transition-colors hover:text-md-text">
            Extension
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-md-text">
            Privacy
          </Link>
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
      <PublicHeader />
      <main className="flex-1">
        <Hero />
        <BentoFeatures />
        <AnimatedStats />
        <Pipeline />
        <Extension />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
