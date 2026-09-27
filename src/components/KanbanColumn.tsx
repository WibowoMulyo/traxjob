import { memo } from "react";
import { StatusBadge } from "./StatusBadge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job, JobStatus } from "@/jobs/jobs.types";

interface Props {
  status: JobStatus;
  jobs: Job[];
  count: number;
  isDragOver: boolean;
  onDragStart: (job: Job) => (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export const KanbanColumn = memo(function KanbanColumn({
  status,
  jobs,
  count,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex h-full flex-col rounded-md-lg bg-md-surface-low">
      <div className="flex items-center justify-between border-b border-md-border px-4 py-3">
        <StatusBadge status={status} />
        <span className="text-sm font-medium tabular-nums text-md-muted">
          {count}
        </span>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex-1 space-y-3 p-3 transition-all duration-300 ${
          isDragOver ? "bg-md-primary/5 ring-2 ring-md-primary/20 ring-inset" : ""
        }`}
      >
        {jobs.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-md-md border-2 border-dashed border-md-outline/30 text-sm text-md-muted">
            {isDragOver ? "Drop here" : "No applications"}
          </div>
        )}

        {jobs.map((job) => (
          <div
            key={job.id}
            draggable
            onDragStart={onDragStart(job)}
            onDragEnd={onDragEnd}
            className="group cursor-grab rounded-lg border border-md-border bg-md-surface-container p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:cursor-grabbing active:scale-95 active:shadow-lg"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-snug">{job.company}</h3>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(job);
                  }}
                  aria-label="Edit"
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(job);
                  }}
                  aria-label="Delete"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            <p className="text-sm text-md-muted">{job.role}</p>
            {job.dateApplied && (
              <p className="mt-2 text-xs text-md-muted">
                {new Date(job.dateApplied).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
