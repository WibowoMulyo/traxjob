import { memo, useMemo } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import type { Job, JobStatus } from "@/jobs/jobs.types";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onStatusChange: (jobId: string, newStatus: JobStatus) => void;
}

const KANBAN_STATUSES: JobStatus[] = [
  "wishlist",
  "applied",
  "screening",
  "interview",
  "offer",
];

export const KanbanView = memo(function KanbanView({
  jobs,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(onStatusChange);

  const columnData = useMemo(() => {
    return KANBAN_STATUSES.map((status) => ({
      status,
      jobs: jobs.filter((job) => job.status === status),
      count: jobs.filter((job) => job.status === status).length,
    }));
  }, [jobs]);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {columnData.map(({ status, jobs: columnJobs, count }) => (
          <div key={status} className="w-80">
            <KanbanColumn
              status={status}
              jobs={columnJobs}
              count={count}
              isDragOver={dragOverColumn === status}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver(status)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop(status)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
