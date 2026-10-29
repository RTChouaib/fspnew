'use client';

import { useEffect } from 'react';
import type { Question } from '@/lib/quiz';

type Props = {
  question: Question;
  index: number;
  total: number;
  chosen: string | null;
  onChoose: (option: string) => void;
  onNext: () => void;
  isLast: boolean;
  nextBusy?: boolean;
  notice?: string | null;
};

/**
 * One multiple-choice question with explicit feedback.
 * - Correct/wrong is shown with an icon and text, not colour alone.
 * - After answering, the learner reads the explanation and continues with "Weiter" (no auto-advance).
 * - Keyboard: 1–4 select an option, Enter continues.
 */
export function QuizQuestion({ question, index, total, chosen, onChoose, onNext, isLast, nextBusy, notice }: Props) {
  const answered = chosen !== null;
  const isCorrect = answered && chosen === question.correct;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!answered) {
        const n = Number(e.key);
        if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
          e.preventDefault();
          onChoose(question.options[n - 1]);
        }
      } else if (e.key === 'Enter' && !nextBusy) {
        // Let a focused button handle its own Enter press (avoids a double activation).
        if (target && target.tagName === 'BUTTON') return;
        e.preventDefault();
        onNext();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answered, nextBusy, onChoose, onNext, question.options]);

  return (
    <div className="app-card question-card">
      <div className="question-kicker">
        {question.kicker} · Frage {index + 1}/{total}
      </div>
      <div className="question-term" id={`q-${index}`}>
        {question.prompt}
      </div>
      <div className="question-sub">
        Wähle die passende Antwort<span className="kbd-hint"> (Tasten 1–{question.options.length})</span>
      </div>

      <div className="options" role="group" aria-labelledby={`q-${index}`}>
        {question.options.map((option, i) => {
          const isRight = answered && option === question.correct;
          const isWrong = answered && option === chosen && option !== question.correct;
          return (
            <button
              key={`${index}-${i}-${option}`}
              type="button"
              className={`option-btn${isRight ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
              disabled={answered}
              onClick={() => onChoose(option)}
            >
              <span className="option-key" aria-hidden="true">
                {i + 1}
              </span>
              <span className="option-text">{option}</span>
              {isRight && <span className="option-flag">✓ Richtig</span>}
              {isWrong && <span className="option-flag">✗ Deine Antwort</span>}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {answered && (
          <div className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
            <strong>{isCorrect ? '✓ Richtig.' : `✗ Nicht ganz. Richtig ist: ${question.correct}`}</strong>
            {question.explanation && <p>{question.explanation}</p>}
            {notice && <p className="quiz-notice">{notice}</p>}
            <button type="button" className="app-btn app-btn-primary quiz-next" onClick={onNext} disabled={nextBusy}>
              {nextBusy ? 'Speichern…' : isLast ? 'Ergebnis anzeigen' : 'Weiter'} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizProgress({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return (
    <div
      className="progress-bar-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
