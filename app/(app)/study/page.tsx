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
    { id: 'review', number: '01', title: 'Wiederholen', description: `${plan.reviewTerms.length} fällige Begriffe aus ${plan.focusCategory}`, duration: 'ca. 6 Min', href: `/practice?mode=review&category=${encodeURIComponent(plan.focusCategory)}&studyStep=review`, icon: 'book' as const, available: plan.reviewTerms.length > 0 },
    { id: 'learn', number: '02', title: 'Neu lernen', description: plan.newTerms.length ? `${plan.newTerms.length} neue Begriffe mit Patientensprache und Arztbrief` : 'Keine neuen Begriffe in diesem Schwerpunkt — weiter üben.', duration: 'ca. 8 Min', href: plan.newTerms.length ? `/practice?mode=new&category=${encodeURIComponent(plan.focusCategory)}&studyStep=learn` : `/practice?mode=review&category=${encodeURIComponent(plan.focusCategory)}&studyStep=learn`, icon: 'target' as const, available: true },
    { id: 'conversation', number: '03', title: 'Patientengespräch', description: recommendedCase ? `${recommendedCase.title} · ${recommendedCase.patientName} · echte interaktive Anamnese` : 'Ein interaktives Patientengespräch mit einem KI-Patienten.', duration: recommendedCase ? `ca. ${recommendedCase.estimatedMinutes} Min` : 'ca. 12 Min', href: recommendedCase ? `/cases/${recommendedCase.slug}?from=study&studyStep=conversation` : '/cases?from=study&studyStep=conversation', icon: 'stethoscope' as const, available: !!recommendedCase },
    { id: 'check', number: '04', title: 'Check', description: 'Teste, ob du die Begriffe im Kontext sicher abrufen kannst.', duration: 'ca. 5 Min', href: '/test?studyStep=check', icon: 'clipboard' as const, available: true },
    { id: 'mistakes', number: '05', title: 'Fehler schließen', description: plan.mistakes.length ? `${plan.mistakes.length} persönliche Fehler warten auf Wiederholung.` : 'Keine offenen Fehler — dieser Schritt wird automatisch übersprungen.', duration: 'ca. 3 Min', href: '/practice?mode=mistakes&studyStep=mistakes', icon: 'alert' as const, available: plan.mistakes.length > 0 },
  ];

  return <>
    <div className="page-header">
      <div><div className="page-kicker">Heute</div><h1 className="page-title">Dein FSP-Training</h1><p className="page-subtitle">Eine geführte Einheit, die dich von Wiederholung bis Anwendung führt.</p></div>
      <span className="study-duration"><AppIcon name="clock" size={15}/> ca. {plan.estimatedMinutes} Min</span>
    </div>

    <section className="study-hero app-card">
      <div className="study-hero-copy"><div className="learn-overline">HEUTIGER FOKUS</div><h2>{plan.focusCategory}</h2><p>Arbeite die Schritte der Reihe nach durch. Nach jedem abgeschlossenen Abschnitt führt dich der nächste Button direkt weiter.</p></div>
      <div className="study-focus-term"><span>Beispielbegriff</span><strong>{plan.focusTerm.medicalTerm}</strong><small>{plan.focusTerm.patientTerms.join(' / ')}</small></div>
    </section>

    <StudySession steps={steps} sessionId={persisted.id} currentStep={persisted.currentStep} completedSteps={persisted.completedSteps} status={persisted.status} />

    <section className="study-tasks">
      {steps.map((step) => {
        const done = persisted.completedSteps.includes(step.id) || !step.available;
        return <div key={step.id} className={`study-task ${done ? 'is-done' : ''}`}>
          <div className="study-task-num">{done ? <span className="study-task-check"><AppIcon name="check" size={13}/></span> : step.number}</div><div className="study-task-icon"><AppIcon name={step.icon}/></div>
          <div className="study-task-copy"><b>{step.title}</b><span>{done && !step.available ? 'Übersprungen' : step.description}</span></div>
          <Link href={step.href} className="app-btn app-btn-secondary">{done ? 'Noch einmal' : 'Starten'} <AppIcon name="arrow" size={15}/></Link>
        </div>;
      })}
    </section>

    <section className="study-principle app-card"><div className="study-principle-icon"><AppIcon name="chart"/></div><div><b>Die Einheit ist ein echter Lernfluss</b><p>Wiederholen → neu lernen → Patientengespräch → Check → Fehler. Ein Schritt wird erst nach der tatsächlichen Übung als erledigt markiert.</p></div></section>
  </>;
}
