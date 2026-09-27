import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SECTION_LINKS = [
  { id: "features", label: "Features", to: "/#features" },
  { id: "how", label: "How it works", to: "/#how" },
];

const PAGE_LINKS = [{ to: "/extension", label: "Extension" }];

export function PublicHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(
    pathname === "/" ? SECTION_LINKS.map((s) => s.id) : [],
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = (isActive: boolean) =>
    cn(
      "nav-item hidden min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors sm:inline-flex",
      isActive
        ? "is-active text-md-text"
        : "text-md-muted hover:bg-md-surface-low hover:text-md-text",
    );

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-md-border bg-md-bg/90 shadow-elev-1 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="size-8" />
          <span className="text-xl font-medium tracking-[-0.01em]">TraxJob</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTION_LINKS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              aria-current={pathname === "/" && active === s.id ? "true" : undefined}
              className={linkClass(pathname === "/" && active === s.id)}
            >
              {s.label}
              <span aria-hidden className="nav-underline" />
            </Link>
          ))}
          {PAGE_LINKS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              aria-current={pathname === p.to ? "page" : undefined}
              className={linkClass(pathname === p.to)}
            >
              {p.label}
              <span aria-hidden className="nav-underline" />
            </Link>
          ))}

          {user ? (
            <Button asChild className="hidden min-h-11 sm:inline-flex">
              <Link to="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden min-h-11 sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="hidden min-h-11 sm:inline-flex">
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 sm:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X /> : <Menu />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              {SECTION_LINKS.map((s) => (
                <DropdownMenuItem key={s.to} asChild>
                  <Link to={s.to}>{s.label}</Link>
                </DropdownMenuItem>
              ))}
              {PAGE_LINKS.map((p) => (
                <DropdownMenuItem key={p.to} asChild>
                  <Link to={p.to}>{p.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link to={user ? "/app" : "/login"}>
                  {user ? "Open app" : "Log in"}
                </Link>
              </DropdownMenuItem>
              {!user && (
                <DropdownMenuItem asChild>
                  <Link to="/register">Sign up</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}