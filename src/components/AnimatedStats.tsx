import { useEffect } from "react";
import { Briefcase, Globe, Shield } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";

const STATS = [
  { icon: Briefcase, value: 500, suffix: "+", label: "Applications Tracked" },
  { icon: Globe, value: 8, suffix: "", label: "Job Boards Supported" },
  { icon: Shield, value: 100, suffix: "%", label: "Free Forever" },
];

function StatCard({ icon: Icon, value, suffix, label, visible }: typeof STATS[0] & { visible: boolean }) {
  const { count, startCounting } = useCountUp(value, 2000, 0);

  useEffect(() => {
    if (visible) {
      startCounting();
    }
  }, [visible, startCounting]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-md-lg bg-md-surface-container p-6 text-center shadow-elev-1">
      <div className="flex size-14 items-center justify-center rounded-md-md bg-md-primary/10 text-md-primary">
        <Icon className="size-7" />
      </div>
      <div className="text-4xl font-bold tabular-nums tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-md-muted">{label}</div>
    </div>
  );
}

export function AnimatedStats() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref}
      className="border-t border-md-border bg-md-secondary-container/15 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div
          className={`mx-auto max-w-2xl text-center ${visible ? "landing-reveal" : "opacity-0"}`}
        >
          <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
            Trusted by job seekers
          </h2>
          <p className="mt-4 text-lg text-md-muted">
            Built for real people managing real job searches.
          </p>
        </div>

        <div
          className={`mt-12 grid gap-6 sm:grid-cols-3 ${
            visible ? "landing-reveal [animation-delay:120ms]" : "opacity-0"
          }`}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
