import { Link } from "react-router-dom";
import { ArrowDownUp, Download, LayoutGrid, LogOut, Moon, Plus, Puzzle, Sun, Table as TableIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth/AuthContext";
import { Logo } from "./Logo";
import type { Theme } from "@/hooks/useTheme";

interface Props {
  count: number;
  theme: Theme;
  view?: "table" | "kanban";
  onToggleTheme: () => void;
  onToggleView?: () => void;
  onAdd: () => void;
  onExport: () => void;
  onImport: () => void;
  onCsv: () => void;
}

export function Header({
  count,
  theme,
  view,
  onToggleTheme,
  onToggleView,
  onAdd,
  onExport,
  onImport,
  onCsv,
}: Props) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-md-border bg-md-bg/95 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-all hover:opacity-70"
            title="Back to home"
          >
            <Logo className="size-8 shrink-0" />
            <span className="text-xl font-semibold tracking-tight">TraxJob</span>
          </Link>
          {count > 0 && (
            <span className="hidden text-sm text-md-muted sm:inline">
              {count} {count === 1 ? 'application' : 'applications'}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={onAdd} size="default" className="shadow-lg">
            <Plus />
            <span className="hidden sm:inline">Add Application</span>
          </Button>

          {onToggleView && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleView}
              aria-label={view === "table" ? "Switch to kanban" : "Switch to table"}
            >
              {view === "table" ? <LayoutGrid /> : <TableIcon />}
            </Button>
          )}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <ArrowDownUp />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { onImport(); }}>
                <Upload />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCsv}>
                <Download />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/extension">
                  <Puzzle />
                  Extension
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <span className="grid size-8 place-items-center rounded-full bg-md-primary text-sm font-medium text-md-on-primary">
                  {user ? (user.name?.[0] ?? user.email[0]).toUpperCase() : 'U'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <div className="truncate text-sm font-medium">
                  {user?.name ?? "Account"}
                </div>
                <div className="max-w-[200px] truncate text-xs text-md-muted">
                  {user?.email}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onToggleTheme();
                }}
              >
                {theme === "dark" ? <Sun /> : <Moon />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  void logout();
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
