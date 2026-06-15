export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface Job {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  source: string;
  applyVia: string;
  status: JobStatus;
  dateApplied: string;
  contact: string;
  notes: string;
}

/** The editable fields of a job (everything except identity/metadata). */
export type JobInput = Omit<Job, "id" | "createdAt">;

/** Columns that the table can sort by. */
export type SortKey = "company" | "source" | "applyVia" | "status" | "dateApplied";
