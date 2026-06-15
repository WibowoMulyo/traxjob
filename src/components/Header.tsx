import { Link } from "react-router-dom";
import { Download, FileText, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import type { Theme } from "@/hooks/useTheme";

interface Props {
  count: number;
  theme: Theme;
  onToggleTheme: () => void;
  onAdd: () => void;
  onExport: () => void;
  onImport: () => void;
  onCsv: () => void;
}

export function Header({
  count,
  theme,
  onToggleTheme,
  onAdd,
  onExport,
  onImport,
  onCsv,
}: Props) {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-md-border bg-md-bg/70 px-4 py-3 backdrop-blur-md sm:px-7 sm:py-[18px]">
      <h1 className="m-0 flex items-center gap-2.5 text-xl font-medium tracking-[-0.01em] sm:text-2xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          title="Back to home"
        >
          <Logo className="size-8" />
          TraxJob
        </Link>
        {count > 0 && (
          <small className="hidden text-[0.8125rem] font-normal text-md-muted sm:inline">
            · {count} applications
          </small>
        )}
      </h1>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Button
          variant="ghost"
          onClick={onExport}
          title="Download all data as a JSON file"
          aria-label="Export"
        >
          <Download />
          <span className="hidden md:inline">Export</span>
        </Button>
        <Button
          variant="ghost"
          onClick={onImport}
          title="Load data from a JSON file"
          aria-label="Import"
        >
          <Upload />
          <span className="hidden md:inline">Import</span>
        </Button>
        <Button
          variant="ghost"
          onClick={onCsv}
          title="Download as CSV (open in Excel/Sheets)"
          aria-label="Export CSV"
        >
          <FileText />
          <span className="hidden md:inline">CSV</span>
        </Button>
        <Button onClick={onAdd}>
          <Plus />
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add Application</span>
        </Button>
      </div>
    </header>
  );
}
