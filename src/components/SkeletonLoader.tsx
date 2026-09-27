export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-md-lg bg-md-surface-container"
          />
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="h-10 flex-1 rounded-full bg-md-surface-container" />
        <div className="h-10 w-32 rounded-full bg-md-surface-container" />
        <div className="h-10 w-32 rounded-full bg-md-surface-container" />
      </div>

      <div className="space-y-2 rounded-md-lg bg-md-surface-container p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-md-md bg-md-surface-low" />
        ))}
      </div>
    </div>
  );
}
