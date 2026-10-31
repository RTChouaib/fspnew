'use client';

import { useState } from 'react';

export type StageData = {
  term: { medical: string; patient: string[]; explanation: string };
  options: string[];
  review: string[];
};

const STAGES = [
  { name: 'Lernen', clause: 'Zuerst Begriffe verstehen.' },
  { name: 'Üben', clause: 'Dann aktiv abrufen.' },
  { name: 'Anwenden', clause: 'Danach im Gespräch anwenden.' },
  { name: 'Verbessern', clause: 'Zuletzt aus Fehlern lernen.' },
];

/** "Drag through the stages": one slider drives the clause and the product fragment. */
export function StageSlider({ data }: { data: StageData }) {
  const [i, setI] = useState(0);
  const stage = STAGES[i];

  return (
    <div className="stages">
      <div className="stages-fragment">
        <div data-ui className="ui-panel" key={i}>
          {i === 0 && (
            <>
              <p className="ui-caption">Fachbegriff</p>
              <p className="ui-term">{data.term.medical}</p>
              <p className="ui-line">
                <span>Patient:innen sagen</span> {data.term.patient.join(', ')}
              </p>
              <p className="ui-note">{data.term.explanation}</p>
            </>
          )}
          {i === 1 && (
            <>
              <p className="ui-caption">Fachbegriff → Patientensprache</p>
              <p className="ui-term">{data.term.medical}</p>
              <ul className="ui-options">
                {data.options.map((o) => (
                  <li key={o} className={o === data.term.patient[0] ? 'is-right' : ''}>
                    {o}
                    {o === data.term.patient[0] && <b>Richtig</b>}
                  </li>
                ))}
              </ul>
            </>
          )}
          {i === 2 && (
            <>
              <p className="ui-caption">Patientengespräch · Beispiel</p>
              <p className="ui-bubble ui-patient">
                <span>Patient</span>Ich habe seit einer Stunde starke Schmerzen in der Brust.
              </p>
              <p className="ui-bubble ui-doctor">
                <span>Du</span>Wo genau sind die Schmerzen und strahlen sie irgendwohin aus?
              </p>
            </>
          )}
          {i === 3 && (
            <>
              <p className="ui-caption">Nach dem Gespräch · Beispiel</p>
              <p className="ui-term">Zum Wiederholen</p>
              <ul className="ui-review">
                {data.review.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="ui-note">Diese Begriffe kommen in deiner nächsten Einheit wieder.</p>
            </>
          )}
        </div>
      </div>
      <div className="stages-control">
        <p className="stages-clause" aria-live="polite">
          {stage.clause}
        </p>
        <label className="sr-only" htmlFor="stage-range">
          Lernschritt wählen
        </label>
        <input
          id="stage-range"
          className="stages-range"
          type="range"
          min={0}
          max={3}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-valuetext={stage.name}
        />
        <div className="stages-names" role="group" aria-label="Lernschritte">
          {STAGES.map((s, n) => (
            <button
              key={s.name}
              type="button"
              className={`stages-name${n === i ? ' is-on' : ''}`}
              aria-pressed={n === i}
              onClick={() => setI(n)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
