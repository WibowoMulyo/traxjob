import { Card, CardContent } from "@/components/ui/card";
import type { StatCounts } from "@/jobs/selectors";

interface StatItem {
  num: number;
  label: string;
  /** Tailwind text-color class for the number. */
  color: string;
}

interface Props {
  counts: StatCounts;
}

export function Stats({ counts }: Props) {
  const items: StatItem[] = [
    { num: counts.total, label: "Total", color: "text-md-text" },
    { num: counts.applied, label: "Applied", color: "text-md-applied" },
    { num: counts.interview, label: "Interview", color: "text-md-interview" },
    { num: counts.offer, label: "Offer", color: "text-md-offer" },
    { num: counts.rejected, label: "Rejected", color: "text-md-rejected" },
    { num: counts.wishlist, label: "Wishlist", color: "text-md-wishlist" },
  ];

  return (
    <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
      {items.map((it) => (
        <Card
          key={it.label}
          className="gap-0 rounded-md-lg border-0 bg-md-surface-container py-0 shadow-elev-1 transition-[box-shadow,transform] duration-300 ease-md hover:-translate-y-0.5 hover:shadow-elev-2"
        >
          <CardContent className="px-5 py-5">
            <div className={`text-[2rem] font-medium leading-tight ${it.color}`}>
              {it.num}
            </div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em] text-md-muted">
              {it.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
