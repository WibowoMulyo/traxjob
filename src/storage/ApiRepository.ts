import { apiRequest } from "@/lib/api";
import type { Job } from "@/jobs/jobs.types";
import type { JobsRepository } from "./JobsRepository";

/* Talks to the per-user /api/jobs endpoints. The client owns each job's UUID,
   so `save` is an idempotent PUT (create or update). */
export class ApiRepository implements JobsRepository {
  async getAll(): Promise<Job[]> {
    const { jobs } = await apiRequest<{ jobs: Job[] }>("/jobs");
    return jobs;
  }

  async save(job: Job): Promise<void> {
    await apiRequest(`/jobs/${job.id}`, {
      method: "PUT",
      body: JSON.stringify(job),
    });
  }

  async remove(id: string): Promise<void> {
    await apiRequest(`/jobs/${id}`, { method: "DELETE" });
  }

  async saveAll(jobs: Job[]): Promise<void> {
    await apiRequest("/jobs", { method: "PUT", body: JSON.stringify({ jobs }) });
  }
}
