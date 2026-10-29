import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap narrow state-page">
      <h1 className="state-title">Seite nicht gefunden</h1>
      <p className="state-text">Diese Seite gibt es nicht (mehr). Vielleicht hilft einer dieser Links weiter.</p>
      <div className="state-actions">
        <Link href="/" className="btn btn-blue">
          Zur Startseite
        </Link>
        <Link href="/dashboard" className="btn btn-outline">
          Zum Dashboard
        </Link>
      </div>
    </main>
  );
}
