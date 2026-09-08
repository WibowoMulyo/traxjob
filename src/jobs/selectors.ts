import type { Job, JobStatus, SortKey } from "./jobs.types";

export interface JobFilters {
  query: string;
  status: JobStatus | "";
  source: string;
  sortKey: SortKey;
  sortDir: 1 | -1;
}

export interface StatCounts {
  total: number;
  applied: number;
  screening: number;
  psychological_test: number;
  technical_test: number;
  interview: number;
  interview_hr: number;
  interview_user: number;
  final_interview: number;
  offer: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  wishlist: number;
}

export function filterAndSort(jobs: Job[], f: JobFilters): Job[] {
  const q = f.query.trim().toLowerCase();

  const rows = jobs.filter((j) => {
    if (f.status && j.status !== f.status) return false;
    if (f.source && (j.source || "") !== f.source) return false;
    if (q) {
      const hay = [j.company, j.role, j.url, j.source, j.applyVia, j.contact, j.notes]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  rows.sort((a, b) => {
    const va = (a[f.sortKey] || "").toString().toLowerCase();
    const vb = (b[f.sortKey] || "").toString().toLowerCase();
    if (va < vb) return -1 * f.sortDir;
    if (va > vb) return 1 * f.sortDir;

    /* Keep newest records first when application dates match or are empty. */
    if (f.sortKey === "dateApplied") {
      const ca = a.createdAt.toLowerCase();
      const cb = b.createdAt.toLowerCase();
      if (ca < cb) return -1 * f.sortDir;
      if (ca > cb) return 1 * f.sortDir;
    }

    return 0;
  });

  return rows;
}

export function computeStats(jobs: Job[]): StatCounts {
  const counts: StatCounts = {
    total: jobs.length,
    applied: 0,
    screening: 0,
    psychological_test: 0,
    technical_test: 0,
    interview: 0,
    interview_hr: 0,
    interview_user: 0,
    final_interview: 0,
    offer: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
    wishlist: 0,
  };
  for (const j of jobs) {
    if (j.status in counts) {
      counts[j.status] += 1;
    }
  }
  return counts;
}

export function uniqueSources(jobs: Job[]): string[] {
  return [...new Set(jobs.map((j) => j.source).filter(Boolean))].sort();
}
