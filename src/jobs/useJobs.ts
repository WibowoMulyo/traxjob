import { useCallback, useEffect, useMemo, useState } from "react";
import type { Job, JobInput } from "./jobs.types";
import { uid } from "../lib/format";
import { LocalStorageRepository } from "../storage/LocalStorageRepository";
import type { JobsRepository } from "../storage/JobsRepository";

/**
 * Owns all job state and CRUD logic. Components call these actions and never
 * touch storage directly. Swap the repository here (e.g. for cloud sync) and
 * nothing downstream changes.
 */
export function useJobs(repository?: JobsRepository) {
  const repo = useMemo(
    () => repository ?? new LocalStorageRepository(),
    [repository],
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    repo.getAll().then((data) => {
      if (active) {
        setJobs(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [repo]);

  const addJob = useCallback(
    async (data: JobInput) => {
      const job: Job = { id: uid(), createdAt: new Date().toISOString(), ...data };
      await repo.save(job);
      setJobs((prev) => [...prev, job]);
    },
    [repo],
  );

  const updateJob = useCallback(
    async (id: string, data: JobInput) => {
      let updated: Job | null = null;
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== id) return j;
          updated = { ...j, ...data };
          return updated;
        }),
      );
      if (updated) await repo.save(updated);
    },
    [repo],
  );

  const removeJob = useCallback(
    async (id: string) => {
      await repo.remove(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    },
    [repo],
  );

  /** Merge imported jobs, regenerating ids that are missing or collide. */
  const importJobs = useCallback(
    async (incoming: Job[]) => {
      let merged: Job[] = [];
      setJobs((prev) => {
        const ids = new Set(prev.map((j) => j.id));
        merged = [...prev];
        for (const j of incoming) {
          const job = !j.id || ids.has(j.id) ? { ...j, id: uid() } : j;
          ids.add(job.id);
          merged.push(job);
        }
        return merged;
      });
      await repo.saveAll(merged);
    },
    [repo],
  );

  return { jobs, loading, addJob, updateJob, removeJob, importJobs };
}
