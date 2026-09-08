export type JobStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "psychological_test"
  | "technical_test"
  | "interview"
  | "interview_hr"
  | "interview_user"
  | "final_interview"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Job {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  url: string;
  source: string;
  applyVia: string;
  status: JobStatus;
  dateApplied: string;
  contact: string;
  notes: string;
}

export type JobInput = Omit<Job, "id" | "createdAt">;

export type SortKey = "company" | "source" | "applyVia" | "status" | "dateApplied";
