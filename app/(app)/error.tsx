'use client';

import Link from 'next/link';

export default function AppError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="app-card app-card-pad state-card" role="alert">
      <h1 className="page-title">Das hat leider nicht geklappt</h1>
      <p className="page-subtitle">
        Beim Laden dieser Seite ist ein Fehler aufgetreten. Dein Fortschritt ist nicht verloren. Versuche es bitte noch
        einmal.
      </p>
      <div className="state-actions">
        <button type="button" className="app-btn app-btn-primary" onClick={() => retry()}>
          Erneut versuchen
        </button>
        <Link href="/dashboard" className="app-btn app-btn-secondary">
          Zum Dashboard
        </Link>
      </div>
    </div>
  );
}
