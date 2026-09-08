import { Badge } from "@/components/reui/badge";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/jobs/jobs.types";
import { STATUS_LABEL } from "@/jobs/constants";

const STYLES: Record<JobStatus, string> = {
  wishlist: "bg-md-wishlist-container text-md-on-wishlist-container",
  applied: "bg-md-applied-container text-md-on-applied-container",
  screening: "bg-md-applied-container text-md-on-applied-container",
  psychological_test: "bg-md-interview-container text-md-on-interview-container",
  technical_test: "bg-md-interview-container text-md-on-interview-container",
  interview: "bg-md-interview-container text-md-on-interview-container",
  interview_hr: "bg-md-interview-container text-md-on-interview-container",
  interview_user: "bg-md-interview-container text-md-on-interview-container",
  final_interview: "bg-md-interview-container text-md-on-interview-container",
  offer: "bg-md-offer-container text-md-on-offer-container",
  accepted: "bg-md-offer-container text-md-on-offer-container",
  rejected: "bg-md-rejected-container text-md-on-rejected-container",
  withdrawn: "bg-md-rejected-container text-md-on-rejected-container",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge
      radius="full"
      className={cn("h-auto border-transparent px-3 py-1 text-xs", STYLES[status])}
    >
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
