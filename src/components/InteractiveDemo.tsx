import { useState } from "react";
import { Search } from "lucide-react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useSpotlight } from "@/hooks/useSpotlight";
import { StatusBadge } from "@/components/StatusBadge";
import { Logo } from "@/components/Logo";
import type { JobStatus } from "@/jobs/jobs.types";

const SEARCH_EXAMPLES = [
  "Search by company name...",
  "backend engineer",
  "Tokopedia",
  "product designer",
];

const DEMO_JOBS = [
  { company: "Northgate", role: "Product Designer", status: "offer" as JobStatus, id: 1 },
  { company: "Lumen Studio", role: "Backend Engineer", status: "interview" as JobStatus, id: 2 },
  { company: "Brightline", role: "Data Analyst", status: "applied" as JobStatus, id: 3 },
  { company: "Harborview", role: "UX Researcher", status: "wishlist" as JobStatus, id: 4 },
];

const STATUS_FILTERS: JobStatus[] = ["wishlist", "applied", "interview", "offer"];

export function InteractiveDemo() {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const typingText = useTypingEffect(SEARCH_EXAMPLES, 100, 50, 1500);
  const onSpotlight = useSpotlight<HTMLDivElement>();

  const filteredJobs = selectedStatus
    ? DEMO_JOBS.filter((job) => job.status === selectedStatus)
    : DEMO_JOBS;

  const handleStatusClick = (status: JobStatus) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  return (
    <div
      onMouseMove={onSpotlight}
      className="spotlight noise-texture rounded-md-xl border border-md-border bg-md-surface-container shadow-elev-3"
    >
      <div className="relative flex items-center gap-3 rounded-t-xl border-b border-md-border bg-md-surface-low/50 px-4 py-3">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-md-rejected" />
          <span aria-hidden className="size-2.5 rounded-full bg-md-interview" />
          <span aria-hidden className="size-2.5 rounded-full bg-md-offer" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-xs text-md-muted">
          <Logo className="size-4" />
          TraxJob
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1 rounded-full border border-md-border px-2 py-0.5 text-[11px] font-medium text-md-muted sm:flex">
            {filteredJobs.length} applications
          </span>
          <span className="shimmer rounded-full bg-md-primary px-2.5 py-0.5 text-[11px] font-medium text-md-on-primary">
            + Add
          </span>
        </span>
      </div>

      <div className="overflow-hidden rounded-b-xl p-4">
        <div className="glass-morph mx-auto flex max-w-2xl items-center gap-2 rounded-full border border-md-border px-4 py-2.5 shadow-elev-1">
          <Search className="size-4 shrink-0 text-md-primary" />
          <span className="min-w-0 flex-1 text-sm text-md-text">
            {typingText}
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-md-primary" />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`transition-all duration-200 ${
                selectedStatus === status
                  ? "scale-105 shadow-elev-1"
                  : "hover:scale-105"
              }`}
            >
              <StatusBadge status={status} />
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-md-lg border border-md-border">
          {filteredJobs.map((job, i) => (
            <div
              key={job.id}
              onMouseEnter={() => setHoveredRow(job.id)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                i !== filteredJobs.length - 1 ? "border-b border-md-border" : ""
              } ${
                hoveredRow === job.id ? "bg-md-secondary-container/30" : ""
              }`}
              style={{
                animationDelay: `${360 + i * 90}ms`,
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{job.company}</div>
                <div className="truncate text-xs text-md-muted">{job.role}</div>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
