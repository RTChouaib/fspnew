import Link from 'next/link';
import { getPublishedCases } from '@/lib/cases';

const DIFFICULTY_LABEL: Record<number, string> = { 1: 'Leicht', 2: 'Mittel', 3: 'Schwer' };

export default async function CasesPage() {
  const cases = await getPublishedCases();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="section-num">FSP FÄLLE</div>
      <h2>Patientengespräche üben</h2>
      <p className="small-muted" style={{ marginBottom: 20 }}>
        Simulierte Anamnesegespräche mit sofortigem, persönlichem Feedback.
      </p>
      {cases.map((c) => (
        <Link key={c.id} href={`/cases/${c.slug}`} className="term-row" style={{ display: 'block' }}>
          <div className="tr-main">{c.title}</div>
          <div className="tr-sub">
            {c.patientName}, {c.patientAge} Jahre · <span className="badge badge-cat">{c.specialty}</span>{' '}
            · {DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty} · {c.estimatedMinutes} Min
          </div>
        </Link>
      ))}
      {cases.length === 0 && (
        <div className="empty-state">
          <p>Noch keine Fälle veröffentlicht.</p>
        </div>
      )}
    </div>
  );
}
