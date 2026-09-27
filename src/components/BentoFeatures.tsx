import {
  ArrowDownWideNarrow,
  CalendarClock,
  Download,
  ListChecks,
  Palette,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { useCardTilt } from "@/hooks/useCardTilt";
import { useReveal } from "@/hooks/useReveal";

const FLAGSHIP = {
  icon: Search,
  title: "Find any application in a second",
  body: "Search across company, role, and source, then filter by status or sort by date applied. No digging through old email threads.",
};

const FEATURES = [
  {
    icon: ListChecks,
    title: "Clear status pipeline",
    body: "Move applications through stages, see exactly where each one stands.",
    span: "row-span-1",
  },
  {
    icon: Download,
    title: "Export & import",
    body: "Your data is never locked in. Export to JSON or CSV any time.",
    span: "row-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    body: "Your own account, modern password hashing. Your data stays yours.",
    span: "row-span-1",
  },
  {
    icon: CalendarClock,
    title: "Notes & follow-ups",
    body: "Track recruiter names, salary ranges, and deadlines.",
    span: "row-span-1",
  },
  {
    icon: Palette,
    title: "Light & dark themes",
    body: "Calm Material You interface with polished light and dark modes.",
    span: "sm:col-span-2",
  },
];

const SORTED_BY_DATE = [
  { company: "Lumen Studio", date: "Sep 24" },
  { company: "Brightline", date: "Sep 21" },
  { company: "Harborview", date: "Sep 17" },
];

function FlagshipCard({ visible }: { visible: boolean }) {
  const FlagshipIcon = FLAGSHIP.icon;
  const tilt = useCardTilt(6);

  return (
    <div
      {...tilt}
      style={tilt.style}
      className={`group col-span-full overflow-hidden rounded-md-xl border border-md-border bg-gradient-to-br from-md-secondary-container/40 to-md-surface-container p-6 shadow-elev-2 transition-shadow duration-300 hover:shadow-elev-3 sm:p-8 lg:col-span-2 lg:row-span-2 ${
        visible ? "landing-reveal" : "opacity-0"
      }`}
    >
      <div className="noise-texture flex h-full flex-col gap-6 lg:gap-8">
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <div className="flex size-14 items-center justify-center rounded-md-lg bg-md-primary/15 text-md-primary transition-transform duration-300 group-hover:scale-110">
            <FlagshipIcon className="size-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{FLAGSHIP.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-md-muted">
              {FLAGSHIP.body}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="glass-morph overflow-hidden rounded-md-lg border border-md-border shadow-elev-1">
            {SORTED_BY_DATE.map((row, i) => (
              <div
                key={row.company}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-md-surface-container/50 ${
                  i !== SORTED_BY_DATE.length - 1 ? "border-b border-md-border" : ""
                }`}
              >
                <ArrowDownWideNarrow
                  className={`size-4 shrink-0 ${
                    i === 0 ? "text-md-primary" : "text-md-muted"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {row.company}
                </span>
                <span className="text-xs text-md-muted tabular-nums">{row.date}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-md-muted lg:text-left">
            Sorted by date applied, newest first
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
  visible,
  getDelay,
}: {
  feature: typeof FEATURES[0];
  index: number;
  visible: boolean;
  getDelay: (index: number) => string;
}) {
  const Icon = feature.icon;
  const tilt = useCardTilt(4);

  return (
    <div
      {...tilt}
      style={{
        ...tilt.style,
        animationDelay: getDelay(index + 1),
      }}
      className={`group flex flex-col gap-4 rounded-md-lg border border-md-border bg-md-surface-container p-5 shadow-elev-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev-2 ${
        feature.span
      } ${visible ? "staggered-item" : "opacity-0"}`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-md-md bg-md-secondary-container/80 text-md-on-secondary-container transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold leading-snug">{feature.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-md-muted">{feature.body}</p>
      </div>
    </div>
  );
}

export function BentoFeatures() {
  const { ref: titleRef, visible: titleVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible, getDelay } = useStaggeredReveal(FEATURES.length + 1, 80);

  return (
    <section
      id="features"
      className="scroll-mt-16 border-t border-md-border px-4 py-20 sm:px-6 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div
          ref={titleRef}
          className={`mx-auto max-w-2xl text-center ${
            titleVisible ? "landing-reveal" : "opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            Everything you need to run the search
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            Purpose-built for job seekers, nothing more, nothing in the way.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3"
        >
          <FlagshipCard visible={gridVisible} />
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              visible={gridVisible}
              getDelay={getDelay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
