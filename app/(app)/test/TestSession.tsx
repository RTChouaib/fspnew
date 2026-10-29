'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { recordAnswerAction, saveTestResultAction, completeStudyStepAction } from '@/lib/actions';
import { QuizProgress, QuizQuestion } from '@/components/QuizQuestion';
import type { Question } from '@/lib/quiz';

export function TestSession({ questions, studyStep }: { questions: Question[]; studyStep?: string }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ termId: string; correct: boolean; category: string }[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; weakCategories: string[] } | null>(null);
  const [continuing, setContinuing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const q = questions[index];

  const choose = useCallback(
    async (opt: string) => {
      if (chosen) return;
      setChosen(opt);
      setNotice(null);
      const isCorrect = opt === q.correct;
      setAnswers((prev) => [...prev, { termId: q.termId, correct: isCorrect, category: q.category }]);
      try {
        await recordAnswerAction(q.termId, isCorrect);
      } catch {
        setNotice('Deine Antwort konnte nicht gespeichert werden. Der Test läuft trotzdem weiter.');
      }
    },
    [chosen, q]
  );

  const finish = useCallback(async () => {
    const catCounts: Record<string, number> = {};
    answers.forEach((a) => {
      if (!a.correct) catCounts[a.category] = (catCounts[a.category] || 0) + 1;
    });
    const weak = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((e) => e[0]);
    const finalScore = answers.filter((a) => a.correct).length;

    setSaving(true);
    setSaveError(null);
    try {
      await saveTestResultAction({
        score: finalScore,
        total: questions.length,
        weakCategories: weak,
        wrongTermIds: answers.filter((a) => !a.correct).map((a) => a.termId),
      });
      setResult({ score: finalScore, total: questions.length, weakCategories: weak });
    } catch {
      setSaveError('Das Ergebnis konnte nicht gespeichert werden. Bitte versuche es noch einmal.');
    } finally {
      setSaving(false);
    }
  }, [answers, questions.length]);

  const next = useCallback(() => {
    if (!chosen) return;
    if (index + 1 >= questions.length) {
      void finish();
    } else {
      setIndex((i) => i + 1);
      setChosen(null);
      setNotice(null);
    }
  }, [chosen, finish, index, questions.length]);

  if (result) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', paddingTop: 20 }}>
        <div className="eyebrow">FSP Kurztest — Ergebnis</div>
        <h2>
          {result.score}/{result.total} richtig
        </h2>
        <div className="card" style={{ textAlign: 'left', margin: '20px 0' }}>
          <h3 style={{ fontSize: 15 }}>Schwachstellen</h3>
          {result.weakCategories.length ? (
            <p style={{ fontSize: 13.5 }}>{result.weakCategories.join(', ')}</p>
          ) : (
            <p style={{ fontSize: 13.5 }}>Keine besonderen Schwachstellen in diesem Test.</p>
          )}
        </div>
        {studyStep === 'check' ? (
          <button
            className="btn btn-blue btn-block"
            disabled={continuing}
            onClick={async () => {
              setContinuing(true);
              await completeStudyStepAction('check');
              window.location.href = '/practice?mode=mistakes&studyStep=mistakes';
            }}
          >
            {continuing ? 'Speichern…' : 'Weiter: Fehler schließen →'}
          </button>
        ) : (
          <Link href="/mistakes" className="btn btn-blue btn-block">
            Fehler wiederholen
          </Link>
        )}
        <Link href="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
          Zurück zum Start
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-kicker">FSP Kurztest</div>
      <h1 className="page-title" style={{ marginBottom: 18 }}>
        Wissen prüfen
      </h1>
      <QuizProgress current={index + (chosen ? 1 : 0)} total={questions.length} label="Testfortschritt" />
      <QuizQuestion
        question={q}
        index={index}
        total={questions.length}
        chosen={chosen}
        onChoose={choose}
        onNext={next}
        isLast={index + 1 >= questions.length}
        nextBusy={saving}
        notice={notice}
      />
      {saveError && (
        <p className="err-text" role="alert">
          {saveError}
        </p>
      )}
    </div>
  );
}
