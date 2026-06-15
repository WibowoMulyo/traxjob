/** Decorative organic blur shapes — signature Material You atmosphere. */
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <div className="absolute -top-44 -right-36 h-[540px] w-[540px] rounded-full bg-md-primary opacity-[0.18] blur-[80px] mix-blend-multiply dark:opacity-30 dark:mix-blend-screen" />
      <div className="absolute -bottom-40 -left-28 h-[460px] w-[460px] rounded-[100px_100px_100px_20px] bg-md-tertiary opacity-[0.18] blur-[80px] mix-blend-multiply dark:opacity-30 dark:mix-blend-screen" />
      <div className="absolute left-[55%] top-[40%] h-[380px] w-[380px] rounded-full bg-md-secondary-container opacity-[0.18] blur-[80px] mix-blend-multiply dark:opacity-30 dark:mix-blend-screen" />
    </div>
  );
}
