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
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        >
          <div className="floating absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-md-primary opacity-20 blur-[100px]" />
          <div className="floating absolute right-[15%] bottom-[25%] h-48 w-48 rounded-full bg-md-tertiary opacity-20 blur-[80px] [animation-delay:1.5s]" />
        </div>

        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 hover:opacity-80 lg:justify-start"
          >
            <Logo className="size-9" />
            <span className="text-2xl font-medium tracking-[-0.01em]">TraxJob</span>
          </Link>

          <div className="group relative rounded-2xl bg-md-surface-container p-8 shadow-elev-3 ring-1 ring-md-outline/10 transition-all duration-300 hover:shadow-elev-4 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-md-primary/5 to-md-tertiary/5" />
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.02em]">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-base text-md-muted">{subtitle}</p>
            )}
            <div className="mt-8">{children}</div>
          </div>

          {footer && (
            <p className="mt-6 text-center text-sm text-md-muted lg:text-left">
              {footer}
            </p>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-md-primary/8 via-md-secondary-container/10 to-md-tertiary/8 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="floating absolute right-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-md-primary opacity-[0.08] blur-[160px]" />
          <div className="floating absolute left-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-md-tertiary opacity-[0.06] blur-[140px] [animation-delay:2s]" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-lg px-12 text-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-md-primary/20 to-md-tertiary/20 blur-3xl"
            />
            <AuthIllustration variant={variant} />
          </div>
          
          <h2 className="mt-16 text-4xl font-bold tracking-tight">
            Your job search, <span className="gradient-text">organized</span>
          </h2>
          
          <p className="mt-6 text-xl leading-relaxed text-md-muted">
            Track applications, manage interviews, and land your dream job.
          </p>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-md-muted">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-md-primary animate-pulse" />
              <span>Real-time sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-md-primary animate-pulse [animation-delay:0.5s]" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-md-primary animate-pulse [animation-delay:1s]" />
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
