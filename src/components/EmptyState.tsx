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
      className={`mx-auto flex max-w-xl flex-col items-center py-20 text-center ${
        visible ? "landing-reveal" : "opacity-0"
      }`}
    >
      <div className={`${visible ? "landing-reveal [animation-delay:100ms]" : "opacity-0"}`}>
        <JobIllustration />
      </div>

      <h2
        className={`mt-10 text-3xl font-bold tracking-tight ${
          visible ? "landing-reveal [animation-delay:200ms]" : "opacity-0"
        }`}
      >
        Ready to get <span className="gradient-text">organized</span>?
      </h2>
      
      <p
        className={`mt-4 text-base text-md-muted ${
          visible ? "landing-reveal [animation-delay:300ms]" : "opacity-0"
        }`}
      >
        Start tracking your applications and land your dream job.
      </p>

      <div
        className={`mt-10 flex flex-wrap justify-center gap-3 ${
          visible ? "landing-reveal [animation-delay:400ms]" : "opacity-0"
        }`}
      >
        <Button
          size="lg"
          onClick={onAddJob}
          className="group shadow-lg"
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
          Extension
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onImport}
          className="group"
        >
          <FileInput className="transition-transform duration-200 group-hover:translate-y-0.5" />
          Import
        </Button>
      </div>
    </div>
  );
}
