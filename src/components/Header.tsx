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
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3.5 border-b border-md-border bg-md-bg/70 px-7 py-[18px] backdrop-blur-md">
      <h1 className="m-0 flex items-center gap-2.5 text-2xl font-medium tracking-[-0.01em]">
        <Logo className="size-8" />
        TraxJob
        {count > 0 && (
          <small className="text-[0.8125rem] font-normal text-md-muted">
            · {count} applications
          </small>
        )}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Button
          variant="ghost"
          onClick={onExport}
          title="Download all data as a JSON file"
        >
          <Download />
          Export
        </Button>
        <Button
          variant="ghost"
          onClick={onImport}
          title="Load data from a JSON file"
        >
          <Upload />
          Import
        </Button>
        <Button
          variant="ghost"
          onClick={onCsv}
          title="Download as CSV (open in Excel/Sheets)"
        >
          <FileText />
          CSV
        </Button>
        <Button onClick={onAdd}>
          <Plus />
          Add Application
        </Button>
      </div>
    </header>
  );
}
