import { memo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import { Briefcase, CheckCircle, Clock, FolderOpen, Star, XCircle } from "lucide-react";
import type { StatCounts } from "@/jobs/selectors";

interface StatItem {
  num: number;
  label: string;
  color: string;
  bgColor: string;
  icon: typeof Briefcase;
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
    { num: counts.total, label: "Total", color: "text-md-text", bgColor: "bg-md-primary/10", icon: Briefcase },
    { num: counts.wishlist, label: "Saved", color: "text-md-wishlist", bgColor: "bg-md-wishlist/10", icon: Star },
    { num: inProgress, label: "In Progress", color: "text-md-applied", bgColor: "bg-md-applied/10", icon: Clock },
    { num: counts.offer, label: "Offers", color: "text-md-offer", bgColor: "bg-md-offer/10", icon: CheckCircle },
    { num: counts.accepted, label: "Accepted", color: "text-md-offer", bgColor: "bg-md-offer/10", icon: FolderOpen },
    { num: closed, label: "Closed", color: "text-md-rejected", bgColor: "bg-md-rejected/10", icon: XCircle },
  ];
  
  return (
    <div
      ref={ref}
      className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      {summary.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="group overflow-hidden rounded-2xl border border-md-outline/5 bg-md-surface-container shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-md dark:ring-white/5"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${item.bgColor} p-2`}>
                  <Icon className={`size-4 ${item.color}`} strokeWidth={2.5} />
                </div>
              </div>
              <div className={`mt-4 text-2xl font-bold tabular-nums tracking-tight ${item.color}`}>
                <AnimatedNumber value={item.num} visible={visible} />
              </div>
              <div className="mt-1 text-xs font-medium text-md-muted">
                {item.label}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
