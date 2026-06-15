import { Link } from "react-router-dom";
import { Download, FileText, MoreVertical, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-md-border bg-md-bg/70 px-4 py-3 backdrop-blur-md sm:px-7 sm:py-4.5">
      <h1 className="m-0 flex min-w-0 items-center gap-2.5 text-xl font-medium tracking-[-0.01em] sm:text-2xl">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          title="Back to home"
        >
          <Logo className="size-8 shrink-0" />
          <span className="truncate">TraxJob</span>
        </Link>
        {count > 0 && (
          <small className="hidden shrink-0 text-[0.8125rem] font-normal text-md-muted sm:inline">
            · {count} applications
          </small>
        )}
      </h1>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {/* md+: data actions inline */}
        <div className="hidden items-center gap-2 md:flex">
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
        </div>

        {/* below md: data actions collapse into an overflow menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="More actions"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImport}>
              <Upload />
              Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCsv}>
              <FileText />
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAdd}>
          <Plus />
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add Application</span>
        </Button>
      </div>
    </header>
  );
}
