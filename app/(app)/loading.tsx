export default function Loading() {
  return (
    <div className="skeleton-page" role="status" aria-label="Wird geladen">
      <div className="skeleton skeleton-line skeleton-kicker" />
      <div className="skeleton skeleton-line skeleton-title" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton-card skeleton-card-sm" />
        <div className="skeleton skeleton-card skeleton-card-sm" />
        <div className="skeleton skeleton-card skeleton-card-sm" />
      </div>
      <span className="sr-only">Inhalte werden geladen…</span>
    </div>
  );
}
