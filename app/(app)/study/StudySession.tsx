'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
};

export function StudySession({ steps, sessionId, currentStep: initialStep, completedSteps: initialCompleted, status }: {
  steps: Step[];
  sessionId: string;
  currentStep: number;
  completedSteps: string[];
  status: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(Math.min(initialStep, Math.max(steps.length - 1, 0)));
  const [started, setStarted] = useState(initialCompleted.length > 0 || status === 'completed');
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const active = steps[current];
  const progress = useMemo(() => Math.round((completed.length / Math.max(steps.length, 1)) * 100), [completed.length, steps.length]);

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
    if (!completed.length) void persist(0, []);
  }

  async function markComplete(nextHref?: string) {
    if (!active) return;
    const nextCompleted = completed.includes(active.id) ? completed : [...completed, active.id];
    const nextCurrent = Math.min(current + 1, steps.length);
    setCompleted(nextCompleted);
    setCurrent(Math.min(nextCurrent, Math.max(steps.length - 1, 0)));
    await persist(nextCurrent, nextCompleted);
    if (nextHref) router.push(nextHref);
  }

  if (!started && status !== 'completed') {
    return <section id="start" className="study-start-card app-card">
      <div className="study-start-icon"><AppIcon name="play" size={22} /></div>
      <div className="study-start-copy"><div className="learn-overline">BEREIT?</div><h2>Starte deine heutige Einheit</h2><p>Wir führen dich Schritt für Schritt durch dein Training. Dein Fortschritt wird gespeichert, damit du später genau hier weitermachen kannst.</p></div>
      <button className="app-btn app-btn-primary study-start-button" onClick={begin} disabled={saving}>Training starten <AppIcon name="arrow" size={16} /></button>
      {error && <p className="err-text">{error}</p>}
    </section>;
  }

  if (status === 'completed' || completed.length >= steps.length || !active) {
    return <section className="study-complete-card app-card">
      <div className="study-start-icon"><AppIcon name="check" size={22} /></div>
      <div><div className="learn-overline">EINHEIT ABGESCHLOSSEN</div><h2>Stark. Deine heutige Einheit ist fertig.</h2><p>Deine Wiederholungen, Fehler und Patientengespräche fließen in zukünftige Trainingseinheiten ein.</p></div>
      <Link href="/dashboard" className="app-btn app-btn-primary">Zum Dashboard <AppIcon name="arrow" size={16}/></Link>
    </section>;
  }

  return <section className="study-runner app-card">
    <div className="study-runner-head"><div><div className="learn-overline">HEUTIGE EINHEIT</div><div className="study-runner-progress-text">Schritt {current + 1} von {steps.length} · {completed.length} abgeschlossen</div></div><span className="study-duration"><AppIcon name="clock" size={14}/>{active.duration}</span></div>
    <div className="app-progress study-runner-progress"><span style={{ width: `${Math.max(progress, Math.round((current / steps.length) * 100))}%` }} /></div>
    <div className="study-runner-main"><div className="study-runner-icon"><AppIcon name={active.icon} size={22}/></div><div><div className="study-task-num">{active.number}</div><h2>{active.title}</h2><p>{active.description}</p></div></div>
    <div className="study-runner-actions"><button className="app-btn app-btn-primary" onClick={() => void markComplete(active.href)} disabled={saving}>Jetzt öffnen <AppIcon name="arrow" size={16}/></button>{current < steps.length - 1 && <button className="app-btn app-btn-secondary" onClick={() => void markComplete()} disabled={saving}>Überspringen</button>}</div>
    {error && <p className="err-text">{error}</p>}
    <div className="study-runner-hint">Dein Fortschritt wird automatisch gespeichert. Du kannst später fortsetzen.</div>
  </section>;
}
