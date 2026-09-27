import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { AppIcon } from '@/components/AppIcon';
import { buildStudyPlan } from '@/lib/learning';
import { getRecommendedCase } from '@/lib/cases';
import { StudySession } from './StudySession';
import { getOrCreateTodayStudySession } from '@/lib/learning';

export default async function StudyPage() {
  const userId = (await getCurrentUserId())!;
  const [plan, recommendedCase] = await Promise.all([buildStudyPlan(userId), getRecommendedCase(userId)]);
  const persisted = await getOrCreateTodayStudySession(userId, plan.focusCategory);

  const steps = [
    { id: 'review', number: '01', title: 'Wiederholen', description: `${plan.reviewTerms.length} fällige Begriffe aus ${plan.focusCategory}`, duration: 'ca. 6 Min', href: '/practice', icon: 'book' as const },
    { id: 'learn', number: '02', title: 'Neu lernen', description: plan.newTerms.length ? `${plan.newTerms.length} neue Begriffe mit Patientensprache und Arztbrief` : 'Keine neuen Begriffe in diesem Schwerpunkt — weiter üben.', duration: 'ca. 8 Min', href: plan.newTerms.length ? `/term/${plan.newTerms[0].id}` : '/practice', icon: 'target' as const },
    { id: 'conversation', number: '03', title: 'Patientengespräch', description: recommendedCase ? `${recommendedCase.title} · ${recommendedCase.patientName} · echte interaktive Anamnese` : 'Ein interaktives Patientengespräch mit einem KI-Patienten.', duration: recommendedCase ? `ca. ${recommendedCase.estimatedMinutes} Min` : 'ca. 12 Min', href: recommendedCase ? `/cases/${recommendedCase.slug}` : '/cases', icon: 'stethoscope' as const },
    { id: 'check', number: '04', title: 'Check', description: 'Teste, ob du die Begriffe im Kontext sicher abrufen kannst.', duration: 'ca. 5 Min', href: '/test', icon: 'clipboard' as const },
    { id: 'mistakes', number: '05', title: 'Fehler schließen', description: plan.mistakes.length ? `${plan.mistakes.length} persönliche Fehler warten auf Wiederholung.` : 'Keine offenen Fehler — dieser Schritt kann übersprungen werden.', duration: 'ca. 3 Min', href: '/practice?mode=mistakes', icon: 'alert' as const },
  ];

  return <>
    <div className="page-header">
      <div><div className="page-kicker">Heute</div><h1 className="page-title">Dein FSP-Training</h1><p className="page-subtitle">Eine geführte Einheit, die sich an deinem aktuellen Lernstand orientiert.</p></div>
      <span className="study-duration"><AppIcon name="clock" size={15}/> ca. {plan.estimatedMinutes} Min</span>
    </div>

    <section className="study-hero app-card">
      <div className="study-hero-copy"><div className="learn-overline">HEUTIGER FOKUS</div><h2>{plan.focusCategory}</h2><p>Heute verbindest du Wiederholung, neues Wissen und Anwendung. Deine Fehler und dein Lernstand bestimmen, was zuerst kommt.</p></div>
      <div className="study-focus-term"><span>Beispielbegriff</span><strong>{plan.focusTerm.medicalTerm}</strong><small>{plan.focusTerm.patientTerms.join(' / ')}</small></div>
    </section>

    <StudySession steps={steps} sessionId={persisted.id} currentStep={persisted.currentStep} completedSteps={persisted.completedSteps} status={persisted.status} />

    <section className="study-tasks">
      {steps.map((step) => (
        <div key={step.id} className="study-task">
          <div className="study-task-num">{step.number}</div><div className="study-task-icon"><AppIcon name={step.icon}/></div>
          <div className="study-task-copy"><b>{step.title}</b><span>{step.description}</span></div>
          <Link href={step.href} className="app-btn app-btn-secondary">Direkt öffnen <AppIcon name="arrow" size={15}/></Link>
        </div>
      ))}
    </section>

    <section className="study-principle app-card"><div className="study-principle-icon"><AppIcon name="chart"/></div><div><b>Warum diese Reihenfolge?</b><p>Du lernst zuerst die Sprache, rufst sie aktiv ab und setzt sie danach im Patientengespräch ein. Feedback und Fehler fließen in deine nächste Einheit zurück.</p></div></section>
  </>;
}
