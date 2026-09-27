'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { recordAnswerAction, completeStudyStepAction } from '@/lib/actions';
import type { Term } from '@/data/terms';

export function PracticeSession({ initialQueue, mode, heading, nextHref, nextLabel, studyStep }: { initialQueue: Term[]; mode?: string; heading?: string; nextHref?: string; nextLabel?: string; studyStep?: string }) {
  const [queue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const term = queue[index];

  const finish = useCallback(async () => {
    setFinished(true);
    if (studyStep) {
      setFinishing(true);
      await completeStudyStepAction(studyStep);
      setFinishing(false);
    }
  }, [studyStep]);

  useEffect(() => {
    if (queue.length === 0 && studyStep) void finish();
  }, [queue.length, studyStep, finish]);

  const judge = useCallback(
    async (correct: boolean) => {
      if (!term) return;
      await recordAnswerAction(term.id, correct);
      if (index + 1 >= queue.length) {
        await finish();
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    },
    [term, index, queue.length, finish]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!term || finished) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!revealed) setRevealed(true);
      }
      if (revealed) {
        if (e.key === '1') void judge(false);
        if (e.key === '2') void judge(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [term, revealed, judge, finished]);

  if (queue.length === 0) {
    return <div className="empty-state">
      <div className="es-emoji">🎉</div>
      <h3>{mode === 'new' ? 'Keine neuen Begriffe' : mode === 'mistakes' ? 'Keine offenen Fehler' : 'Alles erledigt!'}</h3>
      <p>{mode === 'new' ? 'In diesem Schwerpunkt gibt es aktuell keine neuen Begriffe.' : 'Dieser Abschnitt ist für heute bereits erledigt.'}</p>
      {nextHref && <Link href={nextHref} className="app-btn app-btn-primary">{nextLabel ?? 'Weiter'} </Link>}
    </div>;
  }

  if (finished || !term) {
    return <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
      <div className="study-complete-inline app-card">
        <div className="study-start-icon"><span style={{fontSize:22}}>✓</span></div>
        <div><div className="learn-overline">ABSCHNITT ABGESCHLOSSEN</div><h2>{heading ?? 'Training'} fertig</h2><p>{queue.length} Begriffe bearbeitet. Der nächste Abschnitt wartet bereits.</p></div>
      </div>
      {nextHref && <Link href={nextHref} className="app-btn app-btn-primary" style={{marginTop:16}} aria-disabled={finishing}>{finishing ? 'Speichern…' : nextLabel ?? 'Weiter'} <span>→</span></Link>}
    </div>;
  }

  const pct = Math.round((index / queue.length) * 100);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-kicker">{heading ?? 'Begriffe trainieren'}</div>
      <h1 className="page-title" style={{marginBottom:18}}>{mode === 'new' ? 'Neue Begriffe' : mode === 'mistakes' ? 'Meine Fehler' : 'Aktive Wiederholung'}</h1>
      <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
      <div className="app-card flash-card">
        <div className="question-kicker">Begriff {index + 1}/{queue.length}</div>
        <div className="flash-term">{term.medicalTerm}</div>
        {!revealed ? (
          <>
            <div className="flash-hint">Versuche zuerst, die Patientensprache selbst zu nennen.</div>
            <button className="app-btn app-btn-secondary" style={{ marginTop: 20 }} onClick={() => setRevealed(true)}>Antwort anzeigen</button>
          </>
        ) : (
          <>
            <div className="flash-answer">
              <div className="a-label">Patientensprache</div>
              <div className="a-val">{term.patientTerms.join(' / ')}</div>
              <div className="a-label">Ärztliche Frage</div>
              <div className="a-val">„{term.exampleDoctorQuestion}&quot;</div>
              <div className="a-label">Arztbrief</div>
              <div className="a-val">{term.exampleArztbriefSentence}</div>
              <div className="a-label">Erklärung</div>
              <div className="a-val">{term.explanation}</div>
            </div>
            <div className="judge-row">
              <button className="app-btn app-btn-secondary judge-btn judge-wrong" onClick={() => void judge(false)}>✗ Nicht gewusst <span className="small-muted">(1)</span></button>
              <button className="app-btn app-btn-primary judge-btn judge-right" onClick={() => void judge(true)}>✓ Gewusst <span className="small-muted">(2)</span></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
