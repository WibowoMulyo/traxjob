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
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export function AuthSplitLayout({
  variant,
  title,
  subtitle,
  children,
  footer,
  testimonial = {
    quote: "TraxJob transformed how I manage my job search. I finally feel organized and in control.",
    author: "Sarah Chen",
    role: "Product Designer"
  }
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

      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-md-secondary-container/30 to-md-surface-container lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="floating absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-md-primary opacity-10 blur-[100px]" />
          <div className="floating absolute -left-20 bottom-1/4 h-64 w-64 rounded-full bg-md-tertiary opacity-10 blur-[100px] [animation-delay:1.5s]" />
        </div>

        <div className="max-w-lg px-12">
          <AuthIllustration variant={variant} />
          
          {testimonial && (
            <figure className="mt-12 rounded-md-lg bg-md-surface-container/50 p-6 backdrop-blur-sm">
              <blockquote className="text-lg leading-relaxed text-md-text">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-md-primary text-sm font-medium text-md-on-primary">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-md-muted">{testimonial.role}</div>
                </div>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}
