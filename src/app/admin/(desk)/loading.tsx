/** Shown the instant an admin link is clicked; the shell stays mounted around it. */
export default function AdminLoading() {
  const bar = "animate-pulse rounded-md bg-border/70";
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="mb-6 space-y-2">
        <div className={`${bar} h-8 w-56`} />
        <div className={`${bar} h-4 w-80 max-w-full`} />
      </div>
      <div className="bo-card space-y-3 p-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`${bar} h-10 w-full`} />
        ))}
      </div>
    </div>
  );
}
