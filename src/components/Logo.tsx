interface LogoProps {
  className?: string;
  title?: string;
}

/**
 * TraxJob brand mark — three progress nodes along a path ending in a checked
 * circle, on a teal rounded square. Recreated as SVG so it stays crisp at any
 * size and works on any background. (Original raster lives at public/logo.png.)
 */
export function Logo({ className, title = "TraxJob" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="96" height="96" rx="26" fill="#0f6e56" />
      <path d="M30 72 L68 33" stroke="#fff" strokeWidth="11" strokeLinecap="round" />
      <circle cx="30" cy="72" r="8.5" fill="#fff" />
      <circle cx="47" cy="54" r="12.5" fill="#fff" />
      <circle cx="69" cy="32" r="16.5" fill="#fff" />
      <path
        d="M61 33 L67 40 L79 26"
        fill="none"
        stroke="#0f6e56"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
