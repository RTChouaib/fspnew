'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { QuizProgress, QuizQuestion } from '@/components/QuizQuestion';
import type { Question } from '@/lib/quiz';

export function DemoQuiz({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [done, setDone] = useState<{ correct: number; total: number } | null>(null);

  const q = questions[index];

  const choose = useCallback(
    (opt: string) => {
      if (chosen) return;
      setChosen(opt);
      if (opt === q.correct) setCorrect((c) => c + 1);
    },
    [chosen, q]
  );

  const next = useCallback(() => {
    if (!chosen) return;
    if (index + 1 >= questions.length) {
      setDone({ correct, total: questions.length });
    } else {
      setIndex((i) => i + 1);
      setChosen(null);
    }
  }, [chosen, correct, index, questions.length]);

  if (done) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 20 }}>
        <div className="page-intro">Deine ersten Ergebnisse</div>
        <h2>
          {done.correct}/{done.total} richtig
        </h2>
        <p>
          Du hast jetzt einen ersten Eindruck davon, wo dir medizinische Fachsprache leichtfällt, und wo du noch gezielt
          trainieren kannst.
        </p>
        <div className="card" style={{ margin: '26px 0', textAlign: 'left' }}>
          <h3 style={{ fontSize: 16 }}>Aktives Training statt passives Auswendiglernen</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Alle Kategorien, unbegrenztes Training, Spaced Repetition, Fehlertraining, Tests und dein vollständiger
            Fortschritt.
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

  return (
    <div>
      <QuizProgress current={index + (chosen ? 1 : 0)} total={questions.length} label="Fortschritt der Demo" />
      <QuizQuestion
        question={q}
        index={index}
        total={questions.length}
        chosen={chosen}
        onChoose={choose}
        onNext={next}
        isLast={index + 1 >= questions.length}
      />
    </div>
  );
}
