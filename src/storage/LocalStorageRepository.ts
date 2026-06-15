import type { Job } from "../jobs/jobs.types";
import type { JobsRepository } from "./JobsRepository";

const STORE_KEY = "jobTracker.v1";

/** Browser localStorage implementation of {@link JobsRepository}. */
export class LocalStorageRepository implements JobsRepository {
  private read(): Job[] {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]") as Job[];
    } catch {
      return [];
    }
  }

  private write(jobs: Job[]): void {
    localStorage.setItem(STORE_KEY, JSON.stringify(jobs));
  }

  async getAll(): Promise<Job[]> {
    return this.read();
  }

  async save(job: Job): Promise<void> {
    const all = this.read();
    const i = all.findIndex((j) => j.id === job.id);
    if (i >= 0) all[i] = job;
    else all.push(job);
    this.write(all);
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((j) => j.id !== id));
  }

  async saveAll(jobs: Job[]): Promise<void> {
    this.write(jobs);
  }
}
