'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { saveStudySessionProgress } from '@/lib/actions';

type Step = {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  href: string;
  icon: 'book' | 'target' | 'stethoscope' | 'clipboard' | 'alert';
  available: boolean;
};

export function StudySession({ steps, sessionId, currentStep: initialStep, completedSteps: initialCompleted, status }: {
  steps: Step[];
  sessionId: string;
  currentStep: number;
  completedSteps: string[];
  status: string;
}) {
  const [current, setCurrent] = useState(Math.min(initialStep, Math.max(steps.length - 1, 0)));
  const [started, setStarted] = useState(initialCompleted.length > 0 || status === 'completed');
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const active = steps[current];
  const progress = Math.round((completed.length / Math.max(steps.length, 1)) * 100);

  async function persist(nextCurrent: number, nextCompleted: string[]) {
    setSaving(true);
    setError('');
    try {
      const result = await saveStudySessionProgress({ sessionId, currentStep: nextCurrent, completedSteps: nextCompleted, totalSteps: steps.length });
      if (!result) throw new Error('Session konnte nicht gespeichert werden.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Session konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  }

  function begin() {
    setStarted(true);
    void persist(0, completed);
  }

  async function selectStep(index: number) {
    if (!steps[index]?.available || saving) return;
    setCurrent(index);
    await persist(index, completed);
  }

  const firstAvailable = steps.findIndex((step) => step.available && !completed.includes(step.id));
  const activeIndex = current < steps.length && steps[current]?.available ? current : Math.max(firstAvailable, 0);

  if (!started && status !== 'completed') {
    return <section id="start" className="study-start-card app-card">
      <div className="study-start-icon"><AppIcon name="play" size={22} /></div>
      <div className="study-start-copy"><div className="learn-overline">BEREIT?</div><h2>Starte deine heutige Einheit</h2><p>Du arbeitest Schritt für Schritt. Nach jedem Abschnitt kannst du direkt mit dem nächsten weitermachen.</p></div>
      <button className="app-btn app-btn-primary study-start-button" onClick={begin} disabled={saving}>Training starten <AppIcon name="arrow" size={16} /></button>
      {error && <p className="err-text">{error}</p>}
    </section>;
  }

  if (status === 'completed' || completed.length >= steps.filter((s) => s.available).length) {
    return <section className="study-complete-card app-card">
      <div className="study-start-icon"><AppIcon name="check" size={22} /></div>
      <div><div className="learn-overline">EINHEIT ABGESCHLOSSEN</div><h2>Stark. Deine heutige Einheit ist fertig.</h2><p>Deine Wiederholungen, Fehler und Patientengespräche fließen in zukünftige Trainingseinheiten ein.</p></div>
      <Link href="/dashboard" className="app-btn app-btn-primary">Zum Dashboard <AppIcon name="arrow" size={16}/></Link>
    </section>;
  }

  const shownStep = steps[activeIndex];
  const shownProgress = Math.round((completed.length / Math.max(steps.filter((s) => s.available).length, 1)) * 100);

  return <section className="study-runner app-card">
    <div className="study-step-rail" aria-label="Fortschritt der heutigen Einheit">
      {steps.map((step, index) => {
        const done = completed.includes(step.id);
        const isActive = index === activeIndex;
        return <button
          key={step.id}
          className={`study-step-pill ${done ? 'is-done' : ''} ${isActive ? 'is-active' : ''} ${!step.available ? 'is-disabled' : ''}`}
          onClick={() => void selectStep(index)}
          disabled={!step.available || saving}
        >
          <span className="study-step-pill-icon">{done ? <AppIcon name="check" size={13}/> : <span>{step.number}</span>}</span>
          <span>{step.title}</span>
        </button>;
      })}
    </div>

    <div className="study-runner-head"><div><div className="learn-overline">HEUTIGE EINHEIT</div><div className="study-runner-progress-text">{completed.length} von {steps.filter((s) => s.available).length} abgeschlossen</div></div><span className="study-duration"><AppIcon name="clock" size={14}/>{shownStep?.duration}</span></div>
    <div className="app-progress study-runner-progress"><span style={{ width: `${shownProgress}%` }} /></div>
    {shownStep && <>
      <div className="study-runner-main"><div className="study-runner-icon"><AppIcon name={shownStep.icon} size={22}/></div><div><div className="study-task-num">{shownStep.number}</div><h2>{shownStep.title}</h2><p>{shownStep.description}</p></div></div>
      <div className="study-runner-actions">
        <Link className="app-btn app-btn-primary" href={shownStep.href}>Jetzt starten <AppIcon name="arrow" size={16}/></Link>
        {activeIndex > 0 && <button className="app-btn app-btn-secondary" onClick={() => void selectStep(Math.max(0, activeIndex - 1))} disabled={saving}>Zurück</button>}
      </div>
    </>}
    {error && <p className="err-text">{error}</p>}
    <div className="study-runner-hint">Ein Abschnitt wird erst als abgeschlossen markiert, wenn du ihn wirklich beendet hast.</div>
  </section>;
}
