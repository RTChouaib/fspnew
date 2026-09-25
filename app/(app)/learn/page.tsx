import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { AppIcon } from '@/components/AppIcon';
import { LEARNING_MODULES, getModuleProgress, getLearningOverview } from '@/lib/learning';

export default async function LearnPage() {
  const userId = (await getCurrentUserId())!;
  const [overview, modules] = await Promise.all([
    getLearningOverview(userId),
    Promise.all(LEARNING_MODULES.map(async (module) => ({ module, progress: await getModuleProgress(userId, module) }))),
  ]);
  return <>
    <div className="page-header">
      <div>
        <div className="page-kicker">Dein Lernplan</div>
        <h1 className="page-title">FSP Vorbereitung</h1>
        <p className="page-subtitle">Arbeite dich Schritt für Schritt durch die medizinische Fachsprache und wende sie anschließend im Patientengespräch an.</p>
      </div>
      <Link href="/study" className="app-btn app-btn-primary"><AppIcon name="arrow" size={16}/> Heutiges Training</Link>
    </div>

    <section className="learn-overview app-card">
      <div><div className="learn-overline">GESAMTFORTSCHRITT</div><div className="learn-progress-title">{overview.learned} von {overview.total} Begriffen sicher</div><p className="small-muted">Das ist nur ein Teil deiner Vorbereitung. Entscheidend ist, wie sicher du Begriffe im Gespräch anwenden kannst.</p></div>
      <div className="learn-progress-number">{overview.learnedPct}%</div>
      <div className="learn-progress-track"><span style={{width:`${overview.learnedPct}%`}} /></div>
      <div className="learn-mini-stats"><span><b>{overview.dueCount}</b> fällig</span><span><b>{overview.mistakeCount}</b> Fehler</span><span><b>{overview.weakSkills.length}</b> Skills erfasst</span></div>
    </section>

    <div className="learn-section-heading"><div><div className="section-title-app">Dein Curriculum</div><p className="small-muted">Die Module nutzen direkt die vorhandenen Begriffe, Patientensätze, Arztfragen und Arztbrief-Beispiele.</p></div></div>
    <div className="learn-module-list">
      {modules.map(({module, progress}, index) => <Link key={module.id} href={`/learn/${module.id}`} className="learn-module app-card">
        <div className="learn-module-number">{String(index + 1).padStart(2,'0')}</div>
        <div className="learn-module-icon"><AppIcon name={module.icon} size={19}/></div>
        <div className="learn-module-main"><div className="learn-module-title">{module.title}</div><div className="learn-module-desc">{module.description}</div><div className="learn-module-progress"><div className="app-progress"><span style={{width:`${progress.pct}%`}}/></div><span>{progress.pct}%</span></div></div>
        <div className="learn-module-meta"><b>{progress.learned}/{progress.terms}</b><span>Begriffe</span></div><AppIcon name="chevron" size={17}/>
      </Link>)}
    </div>
  </>;
}
