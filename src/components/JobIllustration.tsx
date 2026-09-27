import { memo } from "react";

export const JobIllustration = memo(function JobIllustration() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="h-48 w-48 sm:h-64 sm:w-64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="jobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:var(--md-primary)]" />
          <stop offset="100%" className="[stop-color:var(--md-tertiary)]" />
        </linearGradient>
      </defs>
      
      <rect
        x="80"
        y="100"
        width="140"
        height="160"
        rx="16"
        fill="url(#jobGradient)"
        opacity="0.15"
      />
      <rect
        x="70"
        y="90"
        width="140"
        height="160"
        rx="16"
        fill="url(#jobGradient)"
        opacity="0.3"
      />
      <rect
        x="60"
        y="80"
        width="140"
        height="160"
        rx="16"
        fill="url(#jobGradient)"
        opacity="0.6"
      />
      
      <circle
        cx="150"
        cy="160"
        r="40"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-md-on-primary"
        opacity="0.8"
      />
      <line
        x1="180"
        y1="190"
        x2="200"
        y2="210"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-md-on-primary"
        opacity="0.8"
      />
      
      <circle
        cx="240"
        cy="80"
        r="20"
        fill="url(#jobGradient)"
        opacity="0.2"
        className="animate-pulse"
      />
      <circle
        cx="50"
        cy="240"
        r="15"
        fill="url(#jobGradient)"
        opacity="0.2"
        className="animate-pulse [animation-delay:1s]"
      />
    </svg>
  );
});
