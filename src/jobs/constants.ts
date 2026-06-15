import type { JobStatus } from "./jobs.types";

export const STATUS_LABEL: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_OPTIONS: JobStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export const APPLY_VIA_OPTIONS = [
  "Email",
  "LinkedIn",
  "Glints",
  "Indeed",
  "JobStreet",
  "Company Profile / Website",
  "Other",
];

export const SOURCE_SUGGESTIONS = [
  "LinkedIn",
  "Glints",
  "Indeed",
  "Threads",
  "JobStreet",
  "Kalibrr",
  "Referral",
  "Company Website",
];
