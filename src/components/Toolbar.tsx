import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobStatus } from "@/jobs/jobs.types";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/jobs/constants";

interface Props {
  query: string;
  status: JobStatus | "";
  source: string;
  sources: string[];
  onQuery: (v: string) => void;
  onStatus: (v: JobStatus | "") => void;
  onSource: (v: string) => void;
}

// Radix Select forbids an empty-string item value, so we use "all" as the
// sentinel for the unfiltered option and translate it back to "".
const ALL = "all";

const triggerCls =
  "min-w-0 flex-1 rounded-full border-0 bg-md-surface-low px-4 shadow-none data-[size=default]:h-11 focus-visible:ring-0 lg:w-[160px] lg:flex-none";

export function Toolbar({
  query,
  status,
  source,
  sources,
  onQuery,
  onStatus,
  onSource,
}: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative w-full lg:w-auto lg:flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-md-muted" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search company, role, source..."
          className="h-11 rounded-full border-0 bg-md-surface-low pl-11 text-[0.95rem] shadow-none focus-visible:ring-0"
        />
      </div>

      <Select
        value={status || ALL}
        onValueChange={(v) => onStatus(v === ALL ? "" : (v as JobStatus))}
      >
        <SelectTrigger className={triggerCls} aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Statuses</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={source || ALL}
        onValueChange={(v) => onSource(v === ALL ? "" : v)}
      >
        <SelectTrigger className={triggerCls} aria-label="Filter by source">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Sources</SelectItem>
          {sources.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
