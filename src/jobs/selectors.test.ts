import assert from "node:assert/strict";
import test from "node:test";
import type { Job } from "./jobs.types.js";
import { filterAndSort } from "./selectors.js";

function job(id: string, dateApplied: string, createdAt: string): Job {
  return {
    id,
    createdAt,
    company: id,
    role: "Developer",
    url: "",
    source: "",
    applyVia: "",
    status: "applied",
    dateApplied,
    contact: "",
    notes: "",
  };
}

test("default date sorting keeps newest applications first", () => {
  const sorted = filterAndSort(
    [
      job("old-date", "2026-01-01", "2026-01-01T08:00:00.000Z"),
      job("new-date", "2026-02-01", "2026-02-01T08:00:00.000Z"),
      job("same-old", "2026-02-01", "2026-02-01T07:00:00.000Z"),
      job("same-new", "2026-02-01", "2026-02-02T08:00:00.000Z"),
      job("undated-old", "", "2026-01-01T08:00:00.000Z"),
      job("undated-new", "", "2026-02-03T08:00:00.000Z"),
    ],
    { query: "", status: "", source: "", sortKey: "dateApplied", sortDir: -1 },
  );

  assert.deepEqual(sorted.map((item) => item.id), [
    "same-new",
    "new-date",
    "same-old",
    "old-date",
    "undated-new",
    "undated-old",
  ]);
});
