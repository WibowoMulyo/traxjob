import { memo, useEffect, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import { isEmail, isUrl } from "@/lib/format";
import type { Job, SortKey } from "@/jobs/jobs.types";

interface Props {
  jobs: Job[];
  isEmpty: boolean;
  sortKey: SortKey;
  sortDir: 1 | -1;
  onSort: (key: SortKey) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onAddJob: () => void;
  onOpenExtension: () => void;
  onImport: () => void;
}

interface Column {
  key?: SortKey;
  label: string;
}

const COLUMNS: Column[] = [
  { key: "company", label: "Company / Role" },
  { key: "source", label: "Source" },
  { key: "applyVia", label: "Applied via" },
  { key: "status", label: "Status" },
  { key: "dateApplied", label: "Date" },
  { label: "Contact / Link" },
  { label: "" },
];

const headLabelCls =
  "text-[0.6875rem] font-medium uppercase tracking-[0.07em] text-md-muted";
const PAGE_SIZE = 10;

function ContactCell({ contact, url }: { contact: string; url: string }) {
  if (!contact && !url) return <span className="text-md-muted">—</span>;
  return (
    <div className="grid gap-1">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 font-medium text-md-primary hover:underline"
        >
          Job posting <ExternalLink className="size-3.5" />
        </a>
      )}
      {isUrl(contact) ? (
        <a
          href={contact}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 font-medium text-md-primary hover:underline"
        >
          Link <ExternalLink className="size-3.5" />
        </a>
      ) : isEmail(contact) ? (
        <a
          href={`mailto:${contact}`}
          className="font-medium text-md-primary hover:underline"
        >
          {contact}
        </a>
      ) : (
        contact && <span>{contact}</span>
      )}
    </div>
  );
}

function SourceChip({ source }: { source: string }) {
  if (!source) return <span className="text-md-muted">—</span>;
  return (
    <span className="rounded-full bg-md-source-container px-3 py-1 text-xs font-medium text-md-on-source-container">
      {source}
    </span>
  );
}

function RowActions({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Application actions"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(job)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(job)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className={headLabelCls}>{label}</dt>
      <dd className="mt-1 truncate">{children}</dd>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-md-border/60 px-4 py-3">
      <span className="text-xs text-md-muted">
        Showing {firstItem}–{lastItem} of {totalItems}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="min-w-20 text-center text-xs text-md-muted">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function JobCard({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  return (
    <div className="rounded-md-lg bg-md-surface-container p-4 shadow-elev-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{job.company}</div>
          <div className="text-sm text-md-muted">{job.role}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={job.status} />
          <RowActions job={job} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
      {job.notes && (
        <div className="mt-2 text-xs text-md-muted">📝 {job.notes}</div>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <CardField label="Source">
          <SourceChip source={job.source} />
        </CardField>
        <CardField label="Applied via">
          {job.applyVia || <span className="text-md-muted">—</span>}
        </CardField>
        <CardField label="Date">
          <span className="text-md-muted">{job.dateApplied || "—"}</span>
        </CardField>
        <CardField label="Contact">
          <ContactCell contact={job.contact} url={job.url} />
        </CardField>
      </dl>
    </div>
  );
}

export const JobTable = memo(function JobTable({
  jobs,
  isEmpty,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  onAddJob,
  onOpenExtension,
  onImport,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visibleJobs = jobs.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [jobs]);

  /* Render one layout to avoid duplicating rows and menus in the DOM. */
  if (!isDesktop) {
    return (
      <div className="space-y-3">
        {visibleJobs.length === 0 && isEmpty ? (
          <EmptyState
            onAddJob={onAddJob}
            onOpenExtension={onOpenExtension}
            onImport={onImport}
          />
        ) : visibleJobs.length === 0 ? (
          <div className="rounded-md-lg bg-md-surface-container px-6 py-12 text-center text-md-muted shadow-elev-1">
            No results for this filter.
          </div>
        ) : (
          visibleJobs.map((j) => (
            <JobCard key={j.id} job={j} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
        <Pagination
          page={activePage}
          totalPages={totalPages}
          totalItems={jobs.length}
          onPageChange={setPage}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md-lg bg-md-surface-container shadow-elev-1">
      <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {COLUMNS.map((col, i) => (
                <TableHead key={col.key ?? `c${i}`} className="h-auto px-4 py-4">
                  {col.key ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key!)}
                      className={`inline-flex items-center gap-1 ${headLabelCls} cursor-pointer transition-colors hover:text-md-primary`}
                    >
                      {col.label}
                      {sortKey === col.key &&
                        (sortDir === 1 ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </button>
                  ) : (
                    <span className={headLabelCls}>{col.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleJobs.length === 0 && isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMNS.length} className="py-0">
                  <EmptyState
                    onAddJob={onAddJob}
                    onOpenExtension={onOpenExtension}
                    onImport={onImport}
                  />
                </TableCell>
              </TableRow>
            ) : visibleJobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={COLUMNS.length}
                  className="px-6 py-16 text-center text-md-muted"
                >
                  No results for this filter.
                </TableCell>
              </TableRow>
            ) : (
              visibleJobs.map((j) => (
                <TableRow key={j.id} className="table-row-enhanced hover:bg-md-primary/[0.07]">
                  <TableCell className="px-4 py-4 align-top whitespace-normal">
                    <div className="text-[0.95rem] font-medium">{j.company}</div>
                    <div className="text-[0.8125rem] text-md-muted">
                      {j.role}
                    </div>
                    {j.notes && (
                      <div className="mt-1 text-xs text-md-muted">
                        📝 {j.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    <SourceChip source={j.source} />
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    {j.applyVia || <span className="text-md-muted">—</span>}
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    <StatusBadge status={j.status} />
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle text-md-muted">
                    {j.dateApplied || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    <ContactCell contact={j.contact} url={j.url} />
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    <RowActions job={j} onEdit={onEdit} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          page={activePage}
          totalPages={totalPages}
          totalItems={jobs.length}
          onPageChange={setPage}
        />
      </div>
  );
});
