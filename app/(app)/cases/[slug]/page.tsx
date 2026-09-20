import { notFound } from 'next/navigation';
import { getCaseSummaryBySlug } from '@/lib/cases';
import { StartCaseButton } from './StartCaseButton';

const DIFFICULTY_LABEL: Record<number, string> = { 1: 'Leicht', 2: 'Mittel', 3: 'Schwer' };

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCaseSummaryBySlug(slug);
  if (!c) notFound();

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="badge badge-cat">{c.specialty}</div>
      <h2 style={{ marginTop: 10 }}>{c.title}</h2>
      <p className="small-muted">
        {c.patientName}, {c.patientAge} Jahre · {DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty} · ca.{' '}
        {c.estimatedMinutes} Minuten
      </p>
      <div className="card" style={{ margin: '16px 0' }}>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Eröffnungssatz des Patienten
        </div>
        <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>„{c.openingStatement}&quot;</p>
      </div>
      <p className="small-muted" style={{ marginBottom: 16 }}>
        Führe ein Anamnesegespräch auf Deutsch. Am Ende erhältst du eine detaillierte Auswertung —
        das ist eine Trainingsbewertung, kein offizielles FSP-Ergebnis.
      </p>
      <StartCaseButton caseId={c.id} />
    </div>
  );
}
