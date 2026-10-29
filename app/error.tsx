'use client';

import Link from 'next/link';

export default function RootError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="wrap narrow state-page" role="alert">
      <h1 className="state-title">Etwas ist schiefgelaufen</h1>
      <p className="state-text">Die Seite konnte nicht geladen werden. Bitte versuche es noch einmal.</p>
      <div className="state-actions">
        <button type="button" className="btn btn-blue" onClick={() => retry()}>
          Erneut versuchen
        </button>
        <Link href="/" className="btn btn-outline">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
