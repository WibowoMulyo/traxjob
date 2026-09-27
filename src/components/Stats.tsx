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
      className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      {summary.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-md-surface-container to-md-surface-low p-5 shadow-elev-1 transition-all duration-300 hover:shadow-elev-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-0">
              <div className={`inline-flex rounded-lg ${item.bgColor} p-2 mb-3`}>
                <Icon className={`size-4 ${item.color}`} strokeWidth={2} />
              </div>
              <div className={`text-3xl font-semibold tabular-nums tracking-tight ${item.color}`}>
                <AnimatedNumber value={item.num} visible={visible} />
              </div>
              <div className="mt-1.5 text-xs font-medium text-md-muted">
                {item.label}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
