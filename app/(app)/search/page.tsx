import Link from 'next/link';
import { TERMS } from '@/data/terms';
import { AppIcon } from '@/components/AppIcon';

export const metadata = { title: 'Begriffe suchen' };

const MAX_RESULTS = 50;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase().slice(0, 80);

  // Runs on the server, so the full term dataset is never shipped to the browser.
  const matches = query
    ? TERMS.filter(
        (t) =>
          t.medicalTerm.toLowerCase().includes(query) ||
          t.patientTerms.some((x) => x.toLowerCase().includes(query)) ||
          t.synonyms.some((x) => x.toLowerCase().includes(query)) ||
          t.englishMeaning.toLowerCase().includes(query)
      )
    : [];
  const results = matches.slice(0, MAX_RESULTS);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-kicker">Wörterbuch</div>
          <h1 className="page-title">Begriffe suchen</h1>
          <p className="page-subtitle">
            Durchsuche Fachbegriffe, Patientensprache, Synonyme und englische Bedeutungen.
          </p>
        </div>
      </div>

      <form method="get" role="search" className="search-form">
        <AppIcon name="search" size={19} className="search-form-icon" />
        <input
          className="search-input search-form-input"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="z. B. Dyspnoe, Atemnot…"
          aria-label="Begriff suchen"
          autoComplete="off"
          autoFocus
        />
        <button type="submit" className="app-btn app-btn-primary search-form-submit">
          Suchen
        </button>
      </form>

      <div className="search-results">
        {!query && (
          <div className="app-card app-card-pad search-hint">
            Tippe einen Begriff ein, um in {TERMS.length} Einträgen zu suchen.
          </div>
        )}
        {query && results.length === 0 && (
          <div className="empty-state app-card">
            <p>Kein Treffer für „{q.trim()}“.</p>
            <p className="small-muted">Versuche ein Synonym, die Patientensprache oder die englische Bedeutung.</p>
          </div>
        )}
        {query && results.length > 0 && (
          <p className="small-muted" aria-live="polite">
            {matches.length} Treffer
            {matches.length > MAX_RESULTS ? ` (die ersten ${MAX_RESULTS} werden angezeigt)` : ''}
          </p>
        )}
        {results.map((t) => (
          <Link key={t.id} href={`/term/${t.id}`} className="app-card activity-row search-result">
            <div className="activity-icon">
              <AppIcon name="book" size={16} />
            </div>
            <div className="activity-main">
              <div className="activity-title">{t.medicalTerm}</div>
              <div className="activity-meta">
                {t.patientTerms.join(' / ')} · {t.category}
              </div>
            </div>
            <AppIcon name="chevron" size={16} />
          </Link>
        ))}
      </div>
    </>
  );
}
