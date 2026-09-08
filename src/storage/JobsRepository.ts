import type { Job } from "../jobs/jobs.types";

export interface JobsRepository {
  getAll(): Promise<Job[]>;
  save(job: Job): Promise<void>;
  remove(id: string): Promise<void>;
  saveAll(jobs: Job[]): Promise<void>;
}
