import { useCallback, useEffect, useMemo, useState } from "react";
import type { Job, JobInput } from "./jobs.types";
import { ApiRepository } from "../storage/ApiRepository";
import type { JobsRepository } from "../storage/JobsRepository";

const LEGACY_KEY = "jobTracker.v1";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readLegacyJobs(): Job[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Job[]) : [];
  } catch {
    return [];
  }
}

/* Ensure a job has a DB-valid UUID and a createdAt (regenerating on missing,
   duplicate, or non-UUID ids — e.g. legacy localStorage / imported data). */
function withValidId(job: Job, taken: Set<string>): Job {
  const ok =
    typeof job.id === "string" && UUID_RE.test(job.id) && !taken.has(job.id);
  return {
    ...job,
    id: ok ? job.id : crypto.randomUUID(),
    createdAt: job.createdAt || new Date().toISOString(),
  };
}

/**
 * Owns all job state and CRUD logic against the API. Components call these
 * actions and never touch storage directly. Pass a different repository to
 * swap the backend (e.g. localStorage in tests).
 */
export function useJobs(repository?: JobsRepository) {
  const repo = useMemo(() => repository ?? new ApiRepository(), [repository]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let data = await repo.getAll();
        /* One-time migration: lift any jobs still in localStorage up to the
           account the first time the server has none. */
        if (data.length === 0) {
          const legacy = readLegacyJobs();
          if (legacy.length > 0) {
            const taken = new Set<string>();
            const migrated = legacy.map((j) => {
              const job = withValidId(j, taken);
              taken.add(job.id);
              return job;
            });
            await repo.saveAll(migrated);
            localStorage.removeItem(LEGACY_KEY);
            data = migrated;
          }
        }
        if (active) setJobs(data);
      } catch (err) {
        console.error("[TraxJob] Failed to load jobs:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [repo]);

  const addJob = useCallback(
    async (data: JobInput) => {
      const job: Job = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      setJobs((prev) => [...prev, job]);
      await repo.save(job);
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

  const importJobs = useCallback(
    async (incoming: Job[]) => {
      let merged: Job[] = [];
      setJobs((prev) => {
        const taken = new Set(prev.map((j) => j.id));
        merged = [...prev];
        for (const j of incoming) {
          const job = withValidId(j, taken);
          taken.add(job.id);
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
