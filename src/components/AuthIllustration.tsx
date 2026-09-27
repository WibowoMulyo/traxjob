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
              r="140"
              fill="url(#authGradient)"
              opacity="0.08"
              className="animate-pulse"
            />
            
            <rect
              x="120"
              y="160"
              width="160"
              height="120"
              rx="16"
              fill="url(#authGradient)"
              opacity="0.9"
            />
            
            <rect
              x="150"
              y="140"
              width="100"
              height="24"
              rx="12"
              fill="url(#authGradient)"
            />
            
            <circle cx="170" cy="210" r="8" fill="white" opacity="0.3" />
            <circle cx="200" cy="210" r="8" fill="white" opacity="0.3" />
            <circle cx="230" cy="210" r="8" fill="white" opacity="0.3" />
            
            <path
              d="M 160 240 L 240 240"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 160 260 L 210 260"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
            />
          </>
        ) : (
          <>
            <circle
              cx="200"
              cy="200"
              r="140"
              fill="url(#authGradient)"
              opacity="0.08"
              className="animate-pulse"
            />
            
            <rect
              x="130"
              y="170"
              width="140"
              height="100"
              rx="16"
              fill="url(#authGradient)"
              opacity="0.9"
            />
            
            <rect
              x="170"
              y="150"
              width="60"
              height="24"
              rx="12"
              fill="url(#authGradient)"
            />
            
            <circle
              cx="200"
              cy="220"
              r="35"
              fill="white"
              opacity="0.2"
            />
            
            <path
              d="M 175 220 L 190 235 L 225 200"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
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
