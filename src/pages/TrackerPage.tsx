import { useCallback, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Job, JobInput, JobStatus, SortKey } from "@/jobs/jobs.types";
import { useJobs } from "@/jobs/useJobs";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useConfirm } from "@/components/confirm";
import { computeStats, filterAndSort, uniqueSources } from "@/jobs/selectors";
import { exportCsv, exportJson, parseImportFile } from "@/lib/exportImport";
import { Backdrop } from "@/components/Backdrop";
import { Header } from "@/components/Header";
import { Stats } from "@/components/Stats";
import { Toolbar } from "@/components/Toolbar";
import { JobTable } from "@/components/JobTable";
import { JobModal } from "@/components/JobModal";

export function TrackerPage() {
  const { jobs, loading, addJob, updateJob, removeJob, importJobs } = useJobs();
  const { theme, toggle } = useTheme();
  const confirm = useConfirm();

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

  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) setSortDir((d) => (d * -1) as 1 | -1);
      else {
        setSortKey(key);
        setSortDir(1);
      }
    },
    [sortKey],
  );

  const handleEdit = useCallback((job: Job) => setEditing(job), []);

  const handleSubmit = (data: JobInput) => {
    if (editing) updateJob(editing.id, data);
    else addJob(data);
    setEditing(undefined);
  };

  const handleDelete = useCallback(
    async (job: Job) => {
      const ok = await confirm({
        title: "Delete application?",
        description: `"${job.company} — ${job.role}" will be permanently removed.`,
        confirmText: "Delete",
        destructive: true,
      });
      if (!ok) return;
      try {
        await removeJob(job.id);
        toast.success("Application deleted.");
      } catch {
        toast.error("Couldn't delete the application. Please try again.");
      }
    },
    [confirm, removeJob],
  );

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const imported = await parseImportFile(file);
      const plural = imported.length === 1 ? "" : "s";
      const ok = await confirm({
        title: "Import applications?",
        description: `${imported.length} application${plural} will be merged with your existing data.`,
        confirmText: "Import",
      });
      if (!ok) return;
      await importJobs(imported);
      toast.success(`Imported ${imported.length} application${plural}.`);
    } catch (err) {
      toast.error(
        `Import failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
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

        <div className="mx-auto max-w-[1200px] px-4 pb-2 pt-6 sm:px-6 sm:pt-8">
          {loading ? (
            <div className="grid place-items-center py-24">
              <Loader2 className="size-8 animate-spin text-md-primary" />
            </div>
          ) : (
            <>
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>

        <footer className="px-5 py-8 text-center text-xs text-md-muted">
          Your applications are saved to your account. Export anytime to keep a
          backup.
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
