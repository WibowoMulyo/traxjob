import type { Job } from "../jobs/jobs.types";
import { todayStr } from "./format";

const CSV_COLS: (keyof Job)[] = [
  "company",
  "role",
  "source",
  "applyVia",
  "status",
  "dateApplied",
  "contact",
  "notes",
];

function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportJson(jobs: Job[]): void {
  const blob = new Blob([JSON.stringify(jobs, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `job-tracker-${todayStr()}.json`);
}

export function exportCsv(jobs: Job[]): void {
  const head = CSV_COLS.join(",");
  const body = jobs
    .map((j) => CSV_COLS.map((c) => csvCell(j[c])).join(","))
    .join("\n");
  // Leading BOM so Excel/Sheets reads UTF-8 correctly.
  const blob = new Blob(["﻿" + head + "\n" + body], {
    type: "text/csv;charset=utf-8",
  });
  downloadBlob(blob, `job-tracker-${todayStr()}.csv`);
}

/** Read and parse a user-selected JSON file into a list of jobs. */
export function parseImportFile(file: File): Promise<Job[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("Invalid format");
        resolve(data as Job[]);
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
