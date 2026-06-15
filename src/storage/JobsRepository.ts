import type { Job } from "../jobs/jobs.types";

/**
 * Persistence boundary for jobs. Everything above this interface (the
 * `useJobs` hook, components) is unaware of *how* data is stored.
 *
 * Today the only implementation is `LocalStorageRepository`. When cloud sync
 * is added, a `SupabaseRepository` (or similar) implements this same contract
 * and is swapped in at one place — no component changes required. Methods are
 * async so that swap doesn't ripple network latency through the call sites.
 */
export interface JobsRepository {
  getAll(): Promise<Job[]>;
  save(job: Job): Promise<void>;
  remove(id: string): Promise<void>;
  /** Replace the entire collection (used by import / bulk operations). */
  saveAll(jobs: Job[]): Promise<void>;
}
