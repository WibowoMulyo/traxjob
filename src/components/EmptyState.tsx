import { useReveal } from "@/hooks/useReveal";
import { Button } from "@/components/ui/button";
import { JobIllustration } from "./JobIllustration";
import { Plus, Puzzle, FileInput } from "lucide-react";

interface Props {
  onAddJob: () => void;
  onOpenExtension: () => void;
  onImport: () => void;
}

export function EmptyState({ onAddJob, onOpenExtension, onImport }: Props) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`mx-auto flex max-w-2xl flex-col items-center py-16 text-center ${
        visible ? "landing-reveal" : "opacity-0"
      }`}
    >
      <div className={`${visible ? "landing-reveal [animation-delay:100ms]" : "opacity-0"}`}>
        <JobIllustration />
      </div>

      <h2
        className={`mt-8 text-2xl font-bold tracking-[-0.01em] ${
          visible ? "landing-reveal [animation-delay:200ms]" : "opacity-0"
        }`}
      >
        No applications yet
      </h2>
      
      <p
        className={`mt-3 max-w-md text-lg text-md-muted ${
          visible ? "landing-reveal [animation-delay:300ms]" : "opacity-0"
        }`}
      >
        Start tracking your job search journey. Add your first application manually or import from your browser.
      </p>

      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row ${
          visible ? "landing-reveal [animation-delay:400ms]" : "opacity-0"
        }`}
      >
        <Button
          size="lg"
          onClick={onAddJob}
          className="group"
        >
          <Plus className="transition-transform duration-200 group-hover:rotate-90" />
          Add Application
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={onOpenExtension}
          className="group"
        >
          <Puzzle className="transition-transform duration-200 group-hover:scale-110" />
          Get Browser Extension
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onImport}
          className="group"
        >
          <FileInput className="transition-transform duration-200 group-hover:translate-y-0.5" />
          Import Data
        </Button>
      </div>

      <div
        className={`mt-12 grid gap-4 sm:grid-cols-3 ${
          visible ? "landing-reveal [animation-delay:500ms]" : "opacity-0"
        }`}
      >
        <div className="rounded-md-lg bg-md-surface-container p-5 text-left">
          <div className="text-3xl">🔍</div>
          <h3 className="mt-3 font-semibold">Track Everything</h3>
          <p className="mt-1 text-sm text-md-muted">
            Company, role, status, dates, and notes in one place.
          </p>
        </div>
        
        <div className="rounded-md-lg bg-md-surface-container p-5 text-left">
          <div className="text-3xl">⚡</div>
          <h3 className="mt-3 font-semibold">Browser Extension</h3>
          <p className="mt-1 text-sm text-md-muted">
            Save jobs from LinkedIn, JobStreet, and 6 other boards.
          </p>
        </div>
        
        <div className="rounded-md-lg bg-md-surface-container p-5 text-left">
          <div className="text-3xl">📊</div>
          <h3 className="mt-3 font-semibold">Stay Organized</h3>
          <p className="mt-1 text-sm text-md-muted">
            Pipeline view, filters, search, and export anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
