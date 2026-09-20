import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getProgressMap, getMistakeTermIds } from '@/lib/progress';
import { getWeakestSkills, getRecentSessions, getTrainingStandScore } from '@/lib/simulation';
import { getRecommendedCase } from '@/lib/cases';
import { TERMS } from '@/data/terms';

export default async function DashboardPage() {
  const userId = (await getCurrentUserId())!; // layout guarantees this is set

  const [progress, mistakeIds, trainingScore, weakSkills, recentSessions, recommendedCase] =
    await Promise.all([
      getProgressMap(userId),
      getMistakeTermIds(userId),
      getTrainingStandScore(userId),
      getWeakestSkills(userId),
      getRecentSessions(userId),
      getRecommendedCase(userId),
    ]);

  const total = TERMS.length;
  const learned = Object.values(progress).filter((p) => p.confidence >= 3).length;

  return (
    <>
      <div className="section-num">FSP VORBEREITUNG</div>
      <h2 style={{ marginBottom: 6 }}>Dein Trainingsstand</h2>

      {trainingScore !== null ? (
        <div style={{ marginBottom: 22 }}>
          <div className="progress-bar-track" style={{ maxWidth: 320 }}>
            <div className="progress-bar-fill" style={{ width: `${trainingScore}%` }} />
          </div>
          <p className="small-muted" style={{ marginTop: 6 }}>
            {trainingScore}% — Durchschnitt deiner letzten Patientengespräche
          </p>
        </div>
      ) : (
        <p className="small-muted" style={{ marginBottom: 22 }}>
          Noch kein Fall abgeschlossen — starte dein erstes Patientengespräch.
        </p>
      )}

      {recommendedCase && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <div className="question-kicker" style={{ marginBottom: 4 }}>
              HEUTE
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{recommendedCase.title}</h3>
            <p style={{ margin: 0, fontSize: 13.5 }}>
              {recommendedCase.patientName} · {recommendedCase.specialty} ·{' '}
              {recommendedCase.estimatedMinutes} Min
            </p>
          </div>
          <Link href={`/cases/${recommendedCase.slug}`} className="btn btn-blue">
            Fall starten
          </Link>
        </div>
      )}

      {weakSkills.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Deine Schwachstellen</h3>
          <div className="card-flat" style={{ padding: 4 }}>
            {weakSkills.map((skill, i) => (
              <Link
                key={skill.id}
                href={`/categories/${encodeURIComponent(skill.skillKey)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: i < weakSkills.length - 1 ? '1px solid var(--line)' : 'none',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>{skill.skillKey}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{skill.score}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentSessions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Zuletzt trainiert</h3>
          <div className="card-flat" style={{ padding: 4 }}>
            {recentSessions.map((s, i) => (
              <Link
                key={s.id}
                href={`/simulation/${s.id}/results`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: i < recentSessions.length - 1 ? '1px solid var(--line)' : 'none',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>{s.case.title}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.overallScore}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card-flat" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Begriffe</h3>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            {learned}/{total} gelernt · {mistakeIds.length} Fehler offen
          </p>
          <Link href="/practice" className="btn btn-outline btn-sm">
            Begriffe wiederholen
          </Link>
        </div>
        <div className="card-flat" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>FSP Kurztest</h3>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            15 Fragen, gemischte Typen, mit Auswertung am Ende.
          </p>
          <Link href="/test" className="btn btn-outline btn-sm">
            Test starten
          </Link>
        </div>
      </div>

      <Link href="/cases" className="btn btn-outline btn-block">
        Alle Fälle ansehen
      </Link>
    </>
  );
}
