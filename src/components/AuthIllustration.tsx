import { memo } from "react";

interface Props {
  variant: "login" | "register";
}

export const AuthIllustration = memo(function AuthIllustration({ variant }: Props) {
  return (
    <div className="relative flex items-center justify-center p-8">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full max-w-md"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="authGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:var(--md-primary)]" />
            <stop offset="100%" className="[stop-color:var(--md-tertiary)]" />
          </linearGradient>
        </defs>
        
        {variant === "login" ? (
          <>
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="url(#authGradient)"
              opacity="0.1"
              className="animate-pulse"
            />
            <rect
              x="150"
              y="150"
              width="100"
              height="120"
              rx="12"
              fill="url(#authGradient)"
              opacity="0.8"
            />
            <circle
              cx="200"
              cy="130"
              r="30"
              fill="url(#authGradient)"
            />
            <path
              d="M 180 200 Q 200 185 220 200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-md-on-primary"
            />
          </>
        ) : (
          <>
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="url(#authGradient)"
              opacity="0.1"
              className="animate-pulse"
            />
            <rect
              x="140"
              y="180"
              width="120"
              height="80"
              rx="12"
              fill="url(#authGradient)"
              opacity="0.8"
            />
            <circle
              cx="200"
              cy="150"
              r="35"
              fill="url(#authGradient)"
            />
            <path
              d="M 165 210 L 190 230 L 235 185"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="text-md-on-primary"
            />
          </>
        )}
      </svg>
      
      <div className="floating absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-md-primary opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-md-tertiary opacity-10 blur-3xl [animation-delay:1s]" />
      </div>
    </div>
  );
});
