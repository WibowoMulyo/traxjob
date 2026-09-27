import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { AuthIllustration } from "./AuthIllustration";

interface Props {
  variant: "login" | "register";
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthSplitLayout({
  variant,
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <div className="flex min-h-svh">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-80 lg:justify-start"
          >
            <Logo className="size-9" />
            <span className="text-2xl font-medium tracking-[-0.01em]">TraxJob</span>
          </Link>

          <div className="rounded-md-xl bg-md-surface-container p-6 shadow-elev-2 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-md-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>

          {footer && (
            <p className="mt-6 text-center text-sm text-md-muted lg:text-left">{footer}</p>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-md-primary/5 to-md-tertiary/5 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="floating absolute right-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-md-primary opacity-[0.06] blur-[140px]" />
        </div>

        <div className="max-w-lg px-12 text-center">
          <AuthIllustration variant={variant} />
          
          <h2 className="mt-12 text-3xl font-bold tracking-tight">
            Your job search, <span className="gradient-text">organized</span>
          </h2>
          
          <p className="mt-4 text-lg text-md-muted">
            Track applications, manage interviews, and land your dream job.
          </p>
        </div>
      </div>
    </div>
  );
}
