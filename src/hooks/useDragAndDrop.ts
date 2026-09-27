import { useState, useCallback } from "react";
import type { Job, JobStatus } from "@/jobs/jobs.types";

export function useDragAndDrop(onStatusChange: (jobId: string, newStatus: JobStatus) => void) {
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobStatus | null>(null);

  const handleDragStart = useCallback((job: Job) => (e: React.DragEvent) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", job.id);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedJob(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((status: JobStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((status: JobStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedJob && draggedJob.status !== status) {
      onStatusChange(draggedJob.id, status);
    }
    
    setDraggedJob(null);
    setDragOverColumn(null);
  }, [draggedJob, onStatusChange]);

  return {
    draggedJob,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
