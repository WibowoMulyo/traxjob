import { useMemo, useRef, useState } from "react";
import type { Job, JobInput, JobStatus, SortKey } from "@/jobs/jobs.types";
import { useJobs } from "@/jobs/useJobs";
import { useTheme } from "@/hooks/useTheme";
import { computeStats, filterAndSort, uniqueSources } from "@/jobs/selectors";
import { exportCsv, exportJson, parseImportFile } from "@/lib/exportImport";
import { Backdrop } from "@/components/Backdrop";
import { Header } from "@/components/Header";
import { Stats } from "@/components/Stats";
import { Toolbar } from "@/components/Toolbar";
import { JobTable } from "@/components/JobTable";
import { JobModal } from "@/components/JobModal";

export function TrackerPage() {
  const { jobs, addJob, updateJob, removeJob, importJobs } = useJobs();
  const { theme, toggle } = useTheme();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [source, setSource] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dateApplied");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  /* Modal state: undefined = closed, null = adding, Job = editing */
  const [editing, setEditing] = useState<Job | null | undefined>(undefined);
  const modalOpen = editing !== undefined;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sources = useMemo(() => uniqueSources(jobs), [jobs]);
  const stats = useMemo(() => computeStats(jobs), [jobs]);
  const rows = useMemo(
    () => filterAndSort(jobs, { query, status, source, sortKey, sortDir }),
    [jobs, query, status, source, sortKey, sortDir],
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d * -1) as 1 | -1);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const handleSubmit = (data: JobInput) => {
    if (editing) updateJob(editing.id, data);
    else addJob(data);
    setEditing(undefined);
  };

  const handleDelete = (job: Job) => {
    if (confirm(`Delete application "${job.company} - ${job.role}"?`)) {
      removeJob(job.id);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const imported = await parseImportFile(file);
      if (
        confirm(
          `Import ${imported.length} applications? They will be merged with your existing data.`,
        )
      ) {
        importJobs(imported);
      }
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : err}`);
    }
  };

  return (
    <>
      <Backdrop />
      <div className="relative z-10">
        <Header
          count={jobs.length}
          theme={theme}
          onToggleTheme={toggle}
          onAdd={() => setEditing(null)}
          onExport={() => exportJson(jobs)}
          onImport={() => fileInputRef.current?.click()}
          onCsv={() => exportCsv(jobs)}
        />

        <div className="mx-auto max-w-[1200px] px-6 pb-2 pt-8">
          <Stats counts={stats} />
          <Toolbar
            query={query}
            status={status}
            source={source}
            sources={sources}
            onQuery={setQuery}
            onStatus={setStatus}
            onSource={setSource}
          />
          <JobTable
            jobs={rows}
            isEmpty={jobs.length === 0}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={(job) => setEditing(job)}
            onDelete={handleDelete}
          />
        </div>

        <footer className="px-5 py-8 text-center text-xs text-md-muted">
          Your data is saved automatically in this browser (localStorage).
          Export periodically to back it up.
        </footer>
      </div>

      <JobModal
        open={modalOpen}
        job={editing ?? null}
        onClose={() => setEditing(undefined)}
        onSubmit={handleSubmit}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />
    </>
  );
}
