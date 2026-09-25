import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getProgressMap, getMistakeTermIds } from '@/lib/progress';
import { getWeakestSkills, getRecentSessions, getTrainingStandScore } from '@/lib/simulation';
import { getRecommendedCase } from '@/lib/cases';
import { buildStudyPlan } from '@/lib/learning';
import { TERMS } from '@/data/terms';
import { AppIcon } from '@/components/AppIcon';

export default async function DashboardPage() {
  const userId = (await getCurrentUserId())!;
  const [progress, mistakeIds, trainingScore, weakSkills, recentSessions, recommendedCase, studyPlan] = await Promise.all([
    getProgressMap(userId), getMistakeTermIds(userId), getTrainingStandScore(userId), getWeakestSkills(userId), getRecentSessions(userId), getRecommendedCase(userId), buildStudyPlan(userId),
  ]);
  const total = TERMS.length;
  const learned = Object.values(progress).filter((p) => p.confidence >= 3).length;
  const learnedPct = total ? Math.round((learned / total) * 100) : 0;

  return <>
    <div className="dashboard-greeting">
      <div><div className="page-kicker">FSP Vorbereitung</div><h1 className="page-title">Was lernst du heute?</h1><p className="page-subtitle">Dein Training passt sich an deinen Lernstand, deine Fehler und deine Patientengespräche an.</p></div>
      <Link href="/study" className="app-btn app-btn-primary"><AppIcon name="arrow" size={16}/> Heutiges Training</Link>
    </div>

    <section className="daily-plan-card app-card">
      <div className="daily-plan-top"><div><div className="learn-overline">HEUTIGER FOKUS</div><h2>{studyPlan.focusCategory}</h2><p>Deine Einheit verbindet Wiederholung, neue Begriffe, Anwendung und einen FSP-Check.</p></div><div className="daily-plan-time"><AppIcon name="clock" size={15}/> ca. {studyPlan.estimatedMinutes} Min</div></div>
      <div className="daily-steps"><span><b>01</b> Wiederholen</span><span><b>02</b> Lernen</span><span><b>03</b> Patientengespräch</span><span><b>04</b> Check</span></div>
      <div className="daily-plan-bottom"><div className="daily-focus-term"><span>Heute im Fokus</span><b>{studyPlan.focusTerm.medicalTerm}</b><small>{studyPlan.focusTerm.patientTerms.join(' / ')}</small></div><Link href="/study" className="app-btn app-btn-primary">Training starten <AppIcon name="arrow" size={16}/></Link></div>
    </section>

    <section className="app-section"><div className="section-title-app">Dein Fortschritt</div><div className="app-grid app-grid-4">
      <div className="app-card app-stat"><div className="app-stat-label">BEGRIFFE SICHER</div><div className="app-stat-value">{learned}<span style={{fontSize:13,color:'#98a2b3'}}> / {total}</span></div><div className="app-stat-note">{learnedPct}% des Wortschatzes</div></div>
      <div className="app-card app-stat"><div className="app-stat-label">FÄLLIG HEUTE</div><div className="app-stat-value">{studyPlan.reviewTerms.length}</div><div className="app-stat-note">für deine Wiederholung</div></div>
      <div className="app-card app-stat"><div className="app-stat-label">OFFENE FEHLER</div><div className="app-stat-value">{mistakeIds.length}</div><div className="app-stat-note">gezielt wiederholen</div></div>
      <div className="app-card app-stat"><div className="app-stat-label">PATIENTENGESPRÄCHE</div><div className="app-stat-value">{recentSessions.length}</div><div className="app-stat-note">abgeschlossene Sessions</div></div>
    </div></section>

    <section className="app-section app-grid app-grid-2">
      <div className="app-card app-card-pad"><div className="section-heading-row"><div><div className="section-title-app" style={{margin:0}}>Deine Skills</div><p className="small-muted">Was du im Gespräch sicher anwenden kannst.</p></div><Link href="/learn" className="section-link">Lernplan</Link></div>
        {weakSkills.length ? weakSkills.slice(0,4).map((skill)=><div key={skill.id} className="skill-row"><div className="skill-head"><span>{skill.skillKey}</span><span className="skill-score">{skill.score}%</span></div><div className="progress-row"><div className="app-progress"><span style={{width:`${skill.score}%`}}/></div></div></div>) : <p className="small-muted">Noch keine Skills bewertet. Starte dein erstes Patientengespräch.</p>}
      </div>
      <div className="app-card app-card-pad"><div className="section-heading-row"><div><div className="section-title-app" style={{margin:0}}>Zuletzt trainiert</div><p className="small-muted">Deine letzten Gespräche.</p></div><Link href="/cases" className="section-link">Alle Fälle</Link></div>
        {recentSessions.length ? recentSessions.slice(0,4).map((s)=><Link key={s.id} href={`/simulation/${s.id}/results`} className="activity-row"><div className="activity-icon"><AppIcon name="stethoscope" size={16}/></div><div className="activity-main"><div className="activity-title">{s.case.title}</div><div className="activity-meta">Patientengespräch</div></div><div className="activity-score">{s.overallScore}%</div><AppIcon name="chevron" size={15}/></Link>) : <p className="small-muted">Deine abgeschlossenen Patientengespräche erscheinen hier.</p>}
      </div>
    </section>

    {recommendedCase && <section className="app-section"><div className="section-heading-row"><div><div className="section-title-app" style={{margin:0}}>Als Nächstes anwenden</div><p className="small-muted">Setze deinen heutigen Schwerpunkt direkt im Gespräch ein.</p></div></div><div className="app-card case-recommend-inline"><div><div className="recommend-label">PATIENTENGESPRÄCH</div><div className="recommend-title">{recommendedCase.title}</div><p className="recommend-meta">{recommendedCase.patientName} · {recommendedCase.specialty} · {recommendedCase.estimatedMinutes} Min</p></div><Link href={`/cases/${recommendedCase.slug}`} className="app-btn app-btn-primary">Gespräch starten <AppIcon name="arrow" size={16}/></Link></div></section>}

    <section className="app-section"><div className="section-title-app">Freies Training</div><div className="app-grid app-grid-3">
      <Link href="/practice" className="app-card quick-card"><div className="quick-icon"><AppIcon name="book"/></div><div><div className="quick-title">Begriffe üben</div><div className="quick-desc">Spaced Repetition und Patientensprache</div></div><AppIcon name="chevron" size={16}/></Link>
      <Link href="/practice?mode=mistakes" className="app-card quick-card"><div className="quick-icon"><AppIcon name="alert"/></div><div><div className="quick-title">Fehler wiederholen</div><div className="quick-desc">Deine persönlichen Schwachstellen</div></div><AppIcon name="chevron" size={16}/></Link>
      <Link href="/test" className="app-card quick-card"><div className="quick-icon"><AppIcon name="clipboard"/></div><div><div className="quick-title">FSP-Test</div><div className="quick-desc">Wissen im Kontext überprüfen</div></div><AppIcon name="chevron" size={16}/></Link>
    </div></section>
  </>;
}
