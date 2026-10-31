'use client';

import { useId, useMemo, useState } from 'react';

export type FinderTerm = {
  medical: string;
  patient: string[];
  question: string;
  letter: string;
  explanation: string;
  category: string;
};

const EXAMPLES = ['Atemnot', 'Herzrasen', 'Schwindel', 'Durchfall'];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** "Headline you can type": the visitor types what a patient says and gets the doctor's term. */
export function TermFinder({ terms, total }: { terms: FinderTerm[]; total: number }) {
  const [value, setValue] = useState('Atemnot');
  const id = useId();
  const match = useMemo(() => {
    const q = normalize(value);
    if (q.length < 2) return null;
    return (
      terms.find((t) => t.patient.some((p) => normalize(p) === q)) ??
      terms.find((t) => t.patient.some((p) => normalize(p).includes(q)) || normalize(t.medical).includes(q)) ??
      null
    );
  }, [value, terms]);

  return (
    <div className="finder">
      <label htmlFor={id} className="sr-only">
        Was sagt der Patient?
      </label>
      <div data-ui className="finder-input-wrap">
        <input
          id={id}
          className="finder-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          maxLength={40}
          aria-describedby={`${id}-out`}
        />
      </div>
      <div className="finder-examples" role="group" aria-label="Beispiele">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="chip" onClick={() => setValue(ex)}>
            {ex}
          </button>
        ))}
      </div>
      <div id={`${id}-out`} aria-live="polite" className="finder-out">
        {match ? (
          <div data-ui className="finder-card">
            <p className="finder-caption">Im Arztbrief steht</p>
            <p className="finder-term">{match.medical}</p>
            <dl className="finder-facts">
              <div>
                <dt>Patient:innen sagen</dt>
                <dd>{match.patient.join(', ')}</dd>
              </div>
              <div>
                <dt>Arztfrage</dt>
                <dd>„{match.question}“</dd>
              </div>
              <div>
                <dt>Arztbrief</dt>
                <dd>{match.letter}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div data-ui className="finder-card finder-empty">
            <p className="finder-term">Kein Treffer in dieser Vorschau.</p>
            <p>Die App enthält {total} Begriffe. Probiere eines der Beispiele oben.</p>
          </div>
        )}
      </div>
    </div>
  );
}
