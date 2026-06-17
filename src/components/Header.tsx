import { Link } from "react-router-dom";
import { ArrowDownUp, Download, LogOut, Moon, Plus, Sun, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth/AuthContext";
import { Logo } from "./Logo";
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
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-md-border bg-md-bg/70 px-4 py-3.5 backdrop-blur-md sm:px-6">
      <h1 className="m-0 flex min-w-0 items-center gap-2.5 text-xl font-medium tracking-[-0.01em]">
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

      <div className="flex shrink-0 items-center gap-2">
        <Button onClick={onAdd}>
          <Plus />
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add Application</span>
        </Button>

        {/* Import / export */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" aria-label="Import and export data">
              <ArrowDownUp />
              <span className="hidden sm:inline">Data</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download />
                Export
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={onExport}>JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={onCsv}>CSV</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={onImport}>
              <Upload />
              Import JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account: profile, theme, log out */}
        {user && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <span className="grid size-8 place-items-center rounded-full bg-md-secondary-container text-sm font-medium text-md-on-secondary-container">
                  {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <div className="truncate text-sm font-medium">
                  {user.name ?? "Account"}
                </div>
                <div className="max-w-[200px] truncate text-xs text-md-muted">
                  {user.email}
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
        )}
      </div>
    </header>
  );
}
