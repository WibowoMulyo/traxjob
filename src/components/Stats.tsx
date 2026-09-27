import { memo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import type { StatCounts } from "@/jobs/selectors";

interface StatItem {
  num: number;
  label: string;
  color: string;
}

interface Props {
  counts: StatCounts;
}

function AnimatedNumber({ value, visible }: { value: number; visible: boolean }) {
  const { count, startCounting } = useCountUp(value, 1200, 0);
  
  useEffect(() => {
    if (visible) {
      startCounting();
    }
  }, [visible, startCounting]);
  
  return <>{count}</>;
}

export const Stats = memo(function Stats({ counts }: Props) {
  const { ref, visible } = useReveal();
  
  const inProgress =
    counts.applied +
    counts.screening +
    counts.psychological_test +
    counts.technical_test +
    counts.interview +
    counts.interview_hr +
    counts.interview_user +
    counts.final_interview;
  const closed = counts.rejected + counts.withdrawn;
  const summary: StatItem[] = [
    { num: counts.total, label: "Total", color: "text-md-text" },
    { num: counts.wishlist, label: "Saved", color: "text-md-wishlist" },
    { num: inProgress, label: "In Progress", color: "text-md-applied" },
    { num: counts.offer, label: "Offers", color: "text-md-offer" },
    { num: counts.accepted, label: "Accepted", color: "text-md-offer" },
    { num: closed, label: "Closed", color: "text-md-rejected" },
  ];
  
  return (
    <div
      ref={ref}
      className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:gap-4"
    >
      {summary.map((item) => (
        <Card
          key={item.label}
          className="gap-0 rounded-md-lg border-0 bg-md-surface-container py-0 shadow-elev-1 transition-[box-shadow,transform] duration-300 ease-md hover:-translate-y-0.5 hover:shadow-elev-2"
        >
          <CardContent className="px-5 py-5">
            <div className={`text-[2rem] font-medium leading-tight tabular-nums ${item.color}`}>
              <AnimatedNumber value={item.num} visible={visible} />
            </div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em] text-md-muted">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
