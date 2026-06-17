import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-80"
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
          <p className="mt-6 text-center text-sm text-md-muted">{footer}</p>
        )}
      </div>
    </div>
  );
}
