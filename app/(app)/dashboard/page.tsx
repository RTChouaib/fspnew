import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getProgressMap, getMistakeTermIds } from '@/lib/progress';
import { getWeakestSkills, getRecentSessions, getTrainingStandScore } from '@/lib/simulation';
import { getRecommendedCase } from '@/lib/cases';
import { TERMS } from '@/data/terms';
import { AppIcon } from '@/components/AppIcon';

export default async function DashboardPage() {
  const userId = (await getCurrentUserId())!;
  const [progress, mistakeIds, trainingScore, weakSkills, recentSessions, recommendedCase] = await Promise.all([
    getProgressMap(userId), getMistakeTermIds(userId), getTrainingStandScore(userId), getWeakestSkills(userId), getRecentSessions(userId), getRecommendedCase(userId),
  ]);
  const total = TERMS.length;
  const learned = Object.values(progress).filter((p) => p.confidence >= 3).length;
  const learnedPct = total ? Math.round((learned / total) * 100) : 0;

  return <>
    <div className="page-header">
      <div><div className="page-kicker">FSP Vorbereitung</div><h1 className="page-title">Dein Training</h1><p className="page-subtitle">Konzentriere dich auf den nächsten Schritt — und baue deine FSP-Sicherheit systematisch auf.</p></div>
      <Link href="/practice" className="app-btn app-btn-secondary"><AppIcon name="book" size={16}/> Übung starten</Link>
    </div>

    {recommendedCase && <section className="app-card recommend-card">
      <div className="recommend-inner"><div>
        <div className="recommend-label">Empfohlen als Nächstes</div>
        <div className="recommend-title">{recommendedCase.title}</div>
        <p className="recommend-meta">{recommendedCase.patientName} · {recommendedCase.specialty}</p>
        <div className="mini-meta" style={{marginTop:12}}><span className="meta-pill"><AppIcon name="clock" size={13}/>{recommendedCase.estimatedMinutes} Min</span><span className="meta-pill">Patientengespräch</span></div>
      </div><Link href={`/cases/${recommendedCase.slug}`} className="app-btn app-btn-primary">Fall starten <AppIcon name="arrow" size={16}/></Link></div>
    </section>}

    <section className="app-section">
      <div className="section-title-app">Dein Überblick</div>
      <div className="app-grid app-grid-4">
        <div className="app-card app-stat"><div className="app-stat-label">BEGRIFFE GELERNT</div><div className="app-stat-value">{learned}<span style={{fontSize:13,color:'#98a2b3'}}> / {total}</span></div><div className="app-stat-note">{learnedPct}% deines Wortschatzes</div></div>
        <div className="app-card app-stat"><div className="app-stat-label">OFFENE FEHLER</div><div className="app-stat-value">{mistakeIds.length}</div><div className="app-stat-note">Begriffe zum Wiederholen</div></div>
        <div className="app-card app-stat"><div className="app-stat-label">PATIENTENGESPRÄCHE</div><div className="app-stat-value">{recentSessions.length}</div><div className="app-stat-note">Abgeschlossene Sessions</div></div>
        <div className="app-card app-stat"><div className="app-stat-label">TRAININGSSTAND</div><div className="app-stat-value">{trainingScore === null ? '—' : `${trainingScore}%`}</div><div className="app-stat-note">Aus deinen Gesprächen</div></div>
      </div>
    </section>

    <section className="app-section app-grid app-grid-2">
      <div className="app-card app-card-pad"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><div className="section-title-app" style={{margin:0}}>Schwachstellen</div><AppIcon name="target" size={18}/></div>
        {weakSkills.length ? weakSkills.slice(0,4).map((skill)=><Link key={skill.id} href={`/categories/${encodeURIComponent(skill.skillKey)}`} style={{textDecoration:'none',color:'inherit'}}><div className="skill-row"><div className="skill-head"><span>{skill.skillKey}</span><span className="skill-score">{skill.score}%</span></div><div className="progress-row"><div className="app-progress"><span style={{width:`${skill.score}%`}}/></div></div></div></Link>) : <p className="small-muted">Noch keine Schwachstellen erkannt. Starte eine Übung oder ein Patientengespräch.</p>}
      </div>
      <div className="app-card app-card-pad"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><div className="section-title-app" style={{margin:0}}>Zuletzt trainiert</div><AppIcon name="chart" size={18}/></div>
        {recentSessions.length ? recentSessions.slice(0,4).map((s)=><Link key={s.id} href={`/simulation/${s.id}/results`} className="activity-row"><div className="activity-icon"><AppIcon name="stethoscope" size={16}/></div><div className="activity-main"><div className="activity-title">{s.case.title}</div><div className="activity-meta">Patientengespräch</div></div><div className="activity-score">{s.overallScore}%</div><AppIcon name="chevron" size={15}/></Link>) : <p className="small-muted">Deine abgeschlossenen Patientengespräche erscheinen hier.</p>}
      </div>
    </section>

    <section className="app-section"><div className="section-title-app">Schnellzugriff</div><div className="app-grid app-grid-3">
      <Link href="/practice?mode=mistakes" className="app-card quick-card"><div className="quick-icon"><AppIcon name="alert"/></div><div><div className="quick-title">Fehler wiederholen</div><div className="quick-desc">Gezielt schwierige Begriffe trainieren</div></div><AppIcon name="chevron" size={16}/></Link>
      <Link href="/test" className="app-card quick-card"><div className="quick-icon"><AppIcon name="clipboard"/></div><div><div className="quick-title">Kurztest</div><div className="quick-desc">15 Fragen mit Auswertung</div></div><AppIcon name="chevron" size={16}/></Link>
      <Link href="/cases" className="app-card quick-card"><div className="quick-icon"><AppIcon name="stethoscope"/></div><div><div className="quick-title">Fälle entdecken</div><div className="quick-desc">Anamnesegespräche simulieren</div></div><AppIcon name="chevron" size={16}/></Link>
    </div></section>
  </>;
}
