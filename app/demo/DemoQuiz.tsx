'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/lib/quiz';

export function DemoQuiz({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [done, setDone] = useState<{ correct: number; total: number } | null>(null);

  const q = questions[index];

  function choose(opt: string) {
    if (chosen) return;
    setChosen(opt);
    const isCorrect = opt === q.correct;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrect(nextCorrect);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone({ correct: nextCorrect, total: questions.length });
      } else {
        setIndex((i) => i + 1);
        setChosen(null);
      }
    }, 700);
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 20 }}>
        <div className="eyebrow">Deine ersten Ergebnisse</div>
        <h2>
          {done.correct}/{done.total} richtig
        </h2>
        <p>
          Du hast jetzt einen ersten Eindruck davon, wo dir medizinische Fachsprache leichtfällt —
          und wo du noch gezielt trainieren kannst.
        </p>
        <div className="card" style={{ margin: '26px 0', textAlign: 'left' }}>
          <h3 style={{ fontSize: 16 }}>Aktives Training statt passives Auswendiglernen</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Alle Kategorien, unbegrenztes Training, Spaced Repetition, Fehlertraining, Tests und
            dein vollständiger Fortschritt.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pricing" className="btn btn-blue">
            FSP-Training beginnen
          </Link>
          <Link href="/#how" className="btn btn-outline">
            So funktioniert&apos;s
          </Link>
        </div>
      </div>
    );
  }

  const pct = Math.round((index / questions.length) * 100);

  return (
    <div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="question-card">
        <div className="question-kicker">
          {q.kicker} · Frage {index + 1}/{questions.length}
        </div>
        <div className="question-term">{q.prompt}</div>
        <div className="question-sub">Wähle die passende Übersetzung</div>
        <div className="options">
          {q.options.map((o, i) => {
            let cls = 'option-btn';
            if (chosen) {
              if (o === q.correct) cls += ' correct';
              else if (o === chosen) cls += ' wrong';
            }
            return (
              <button
                key={`${index}-${i}`}
                className={cls}
                disabled={!!chosen}
                onClick={(e) => {
                  choose(o);
                  e.currentTarget.blur();
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
