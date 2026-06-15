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
  interview: number;
  offer: number;
  rejected: number;
  wishlist: number;
}

/** Apply search + filters and sort, returning a new array. */
export function filterAndSort(jobs: Job[], f: JobFilters): Job[] {
  const q = f.query.trim().toLowerCase();

  const rows = jobs.filter((j) => {
    if (f.status && j.status !== f.status) return false;
    if (f.source && (j.source || "") !== f.source) return false;
    if (q) {
      const hay = [j.company, j.role, j.source, j.applyVia, j.contact, j.notes]
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
    return 0;
  });

  return rows;
}

export function computeStats(jobs: Job[]): StatCounts {
  const counts: StatCounts = {
    total: jobs.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    wishlist: 0,
  };
  for (const j of jobs) {
    if (j.status in counts) {
      counts[j.status] += 1;
    }
  }
  return counts;
}

/** Distinct, sorted source names present in the data. */
export function uniqueSources(jobs: Job[]): string[] {
  return [...new Set(jobs.map((j) => j.source).filter(Boolean))].sort();
}
