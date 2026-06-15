import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Job, JobInput, JobStatus } from "@/jobs/jobs.types";
import {
  APPLY_VIA_OPTIONS,
  SOURCE_SUGGESTIONS,
  STATUS_LABEL,
  STATUS_OPTIONS,
} from "@/jobs/constants";
import { dateToISO, formatDateDisplay, isoToDate, todayStr } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  /** The job being edited, or null when adding a new one. */
  job: Job | null;
  onClose: () => void;
  onSubmit: (data: JobInput) => void;
}

const emptyForm = (): JobInput => ({
  company: "",
  role: "",
  source: "",
  applyVia: "Email",
  status: "applied",
  dateApplied: todayStr(),
  contact: "",
  notes: "",
});

export function JobModal({ open, job, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<JobInput>(emptyForm);
  const [dateOpen, setDateOpen] = useState(false);

  // Repopulate the form whenever the modal opens (add) or the target changes.
  useEffect(() => {
    if (!open) return;
    setForm(
      job
        ? {
            company: job.company,
            role: job.role,
            source: job.source,
            applyVia: job.applyVia,
            status: job.status,
            dateApplied: job.dateApplied,
            contact: job.contact,
            notes: job.notes,
          }
        : emptyForm(),
    );
  }, [open, job]);

  const set = <K extends keyof JobInput>(key: K, value: JobInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      source: form.source.trim(),
      contact: form.contact.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-md-xl border-0 bg-md-surface-container sm:max-w-[600px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-medium tracking-[-0.01em]">
            {job ? "Edit Application" : "Add Application"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Job application details form
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="f-company">Company *</Label>
              <Input
                id="f-company"
                required
                autoFocus
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Qiscus"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-role">Role *</Label>
              <Input
                id="f-role"
                required
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="e.g. Backend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="f-source">Source</Label>
              <Input
                id="f-source"
                list="source-list"
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="e.g. LinkedIn, Glints, referral"
              />
              <datalist id="source-list">
                {SOURCE_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-applyVia">Applied via</Label>
              <Select
                value={form.applyVia}
                onValueChange={(v) => set("applyVia", v)}
              >
                <SelectTrigger id="f-applyVia" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLY_VIA_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="f-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as JobStatus)}
              >
                <SelectTrigger id="f-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-date">Date applied</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="f-date"
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-md font-normal"
                  >
                    <CalendarIcon className="size-4 text-md-muted" />
                    {form.dateApplied ? (
                      formatDateDisplay(form.dateApplied)
                    ) : (
                      <span className="text-md-muted">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={isoToDate(form.dateApplied)}
                    onSelect={(d) => {
                      set("dateApplied", d ? dateToISO(d) : "");
                      setDateOpen(false);
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="f-contact">Contact / Link</Label>
            <Input
              id="f-contact"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
              placeholder="email or job posting URL"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="f-notes">Notes</Label>
            <Textarea
              id="f-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Salary, recruiter name, deadline, follow-up, etc."
              className="min-h-[72px]"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
