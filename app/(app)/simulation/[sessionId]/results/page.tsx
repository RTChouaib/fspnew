import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getSessionForUser } from '@/lib/simulation';
import type { Evaluation } from '@/lib/ai/schemas';

const SCORE_LABEL: Record<string, string> = {
  anamnesis: 'Anamnese',
  communication: 'Kommunikation',
  patientLanguage: 'Patientensprache',
  medicalTerminology: 'Fachsprache',
  completeness: 'Vollständigkeit',
  languageAccuracy: 'Sprachliche Genauigkeit',
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = (await getCurrentUserId())!;
  const session = await getSessionForUser(sessionId, userId);
  if (!session || session.status !== 'completed' || !session.evaluation) notFound();

  const evaluation = session.evaluation as unknown as Evaluation;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="eyebrow">Trainingsauswertung — {session.case.title}</div>
      <h2>{evaluation.overallScore}/100</h2>
      <p className="small-muted">
        Dies ist eine Trainingsbewertung zu Übungszwecken und entspricht keinem offiziellen
        FSP-Ergebnis.
      </p>

      <div className="stat-row" style={{ marginTop: 18 }}>
        {Object.entries(evaluation.scores).map(([key, value]) => (
          <div className="stat-card" key={key}>
            <div className="stat-num">{value}%</div>
            <div className="stat-label">{SCORE_LABEL[key] ?? key}</div>
          </div>
        ))}
      </div>

      {evaluation.strengths.length > 0 && (
        <div className="card" style={{ margin: '20px 0' }}>
          <h3 style={{ fontSize: 15 }}>Stärken</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {evaluation.strengths.map((s, i) => (
              <li key={i} style={{ fontSize: 13.5, marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.missingInformation.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15 }}>Fehlende Informationen</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {evaluation.missingInformation.map((s, i) => (
              <li key={i} style={{ fontSize: 13.5, marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.languageCorrections.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15 }}>Sprachliche Verbesserungen</h3>
          {evaluation.languageCorrections.map((c, i) => (
            <div
              key={i}
              style={{
                marginBottom: 14,
                paddingBottom: 14,
                borderBottom:
                  i < evaluation.languageCorrections.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Deine Formulierung
              </div>
              <p style={{ margin: '2px 0 8px', fontSize: 13.5 }}>„{c.original}&quot;</p>
              <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Bessere Formulierung
              </div>
              <p style={{ margin: '2px 0 8px', fontSize: 13.5, color: 'var(--blue-dark)' }}>
                „{c.better}&quot;
              </p>
              <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Warum?
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 13.5 }}>{c.reason}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15 }}>Zusammenfassung</h3>
        <p style={{ fontSize: 13.5, margin: 0 }}>{evaluation.summary}</p>
      </div>

      <Link href="/cases" className="btn btn-blue btn-block">
        Weiteren Fall üben
      </Link>
      <Link href="/practice" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
        Begriffe wiederholen
      </Link>
    </div>
  );
}
