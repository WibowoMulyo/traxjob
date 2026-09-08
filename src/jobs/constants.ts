import type { JobStatus } from "./jobs.types";

export const STATUS_LABEL: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  screening: "Screening",
  psychological_test: "Psychological Test",
  technical_test: "Technical Test",
  interview: "Interview (General)",
  interview_hr: "Interview HR",
  interview_user: "Interview User",
  final_interview: "Final Interview",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_OPTIONS: JobStatus[] = [
  "wishlist",
  "applied",
  "screening",
  "psychological_test",
  "technical_test",
  "interview",
  "interview_hr",
  "interview_user",
  "final_interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

export const APPLY_VIA_OPTIONS = [
  "Email",
  "LinkedIn",
  "Glints",
  "Indeed",
  "JobStreet",
  "MagangHub",
  "Kalibrr",
  "Pintarnya",
  "Dealls",
  "Company Profile / Website",
  "Other",
];

export const SOURCE_SUGGESTIONS = [
  "LinkedIn",
  "Glints",
  "Indeed",
  "Threads",
  "JobStreet",
  "MagangHub",
  "Kalibrr",
  "Pintarnya",
  "Dealls",
  "Referral",
  "Company Website",
];
