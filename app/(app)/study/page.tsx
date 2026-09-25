import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { AppIcon } from '@/components/AppIcon';
import { buildStudyPlan } from '@/lib/learning';

export default async function StudyPage() {
  const userId = (await getCurrentUserId())!;
  const plan = await buildStudyPlan(userId);
  return <>
    <div className="page-header">
      <div><div className="page-kicker">Heute</div><h1 className="page-title">Dein FSP-Training</h1><p className="page-subtitle">Eine geführte Einheit, die sich an deinem aktuellen Lernstand orientiert.</p></div>
      <span className="study-duration"><AppIcon name="clock" size={15}/> ca. {plan.estimatedMinutes} Min</span>
    </div>

    <section className="study-hero app-card">
      <div className="study-hero-copy"><div className="learn-overline">HEUTIGER FOKUS</div><h2>{plan.focusCategory}</h2><p>Heute verbindest du Wiederholung, neues Wissen und Anwendung. Deine Fehler und dein Lernstand bestimmen, was zuerst kommt.</p></div>
      <div className="study-focus-term"><span>Beispielbegriff</span><strong>{plan.focusTerm.medicalTerm}</strong><small>{plan.focusTerm.patientTerms.join(' / ')}</small></div>
    </section>

    <div className="study-tasks">
      <div className="study-task"><div className="study-task-num">01</div><div className="study-task-icon"><AppIcon name="book"/></div><div className="study-task-copy"><b>Wiederholen</b><span>{plan.reviewTerms.length} fällige Begriffe aus {plan.focusCategory}</span></div><Link href="/practice" className="app-btn app-btn-secondary">Starten <AppIcon name="arrow" size={15}/></Link></div>
      <div className="study-task"><div className="study-task-num">02</div><div className="study-task-icon"><AppIcon name="target"/></div><div className="study-task-copy"><b>Neu lernen</b><span>{plan.newTerms.length ? `${plan.newTerms.length} neue Begriffe mit Patientensprache und Arztbrief` : 'Keine neuen Begriffe in diesem Schwerpunkt — weiter üben.'}</span></div><Link href={plan.newTerms.length ? `/term/${plan.newTerms[0].id}` : '/practice'} className="app-btn app-btn-secondary">Lernen <AppIcon name="arrow" size={15}/></Link></div>
      <div className="study-task"><div className="study-task-num">03</div><div className="study-task-icon"><AppIcon name="stethoscope"/></div><div className="study-task-copy"><b>Anwenden</b><span>Nutze dein Wissen in einem echten Patientengespräch.</span></div><Link href="/cases" className="app-btn app-btn-primary">Gespräch <AppIcon name="arrow" size={15}/></Link></div>
      <div className="study-task"><div className="study-task-num">04</div><div className="study-task-icon"><AppIcon name="clipboard"/></div><div className="study-task-copy"><b>Check</b><span>Teste, ob du die Begriffe im Kontext sicher abrufen kannst.</span></div><Link href="/test" className="app-btn app-btn-secondary">Test <AppIcon name="arrow" size={15}/></Link></div>
      {plan.mistakes.length > 0 && <div className="study-task"><div className="study-task-num">05</div><div className="study-task-icon"><AppIcon name="alert"/></div><div className="study-task-copy"><b>Fehler schließen</b><span>{plan.mistakes.length} persönliche Fehler warten auf Wiederholung.</span></div><Link href="/practice?mode=mistakes" className="app-btn app-btn-secondary">Fehler <AppIcon name="arrow" size={15}/></Link></div>}
    </div>

    <section className="study-principle app-card"><div className="study-principle-icon"><AppIcon name="chart"/></div><div><b>Warum diese Reihenfolge?</b><p>Du lernst zuerst die Sprache, rufst sie aktiv ab und setzt sie danach im Patientengespräch ein. Feedback und Fehler fließen in deine nächste Einheit zurück.</p></div></section>
  </>;
}
