'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TranscriptEntry } from '@/lib/ai/patient';

export function SimulationChat({
  sessionId,
  caseTitle,
  patientName,
  patientAge,
  initialTranscript,
}: {
  sessionId: string;
  caseTitle: string;
  patientName: string;
  patientAge: number;
  initialTranscript: TranscriptEntry[];
}) {
  const router = useRouter();
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(initialTranscript);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  async function send() {
    const message = input.trim();
    if (!message || sending || ending) return;

    setSending(true);
    setError('');
    setTranscript((t) => [...t, { role: 'doctor', content: message }]);
    setInput('');

    try {
      const res = await fetch(`/api/simulation/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.');
        // Roll back the optimistic message so the user can retry without duplicating it.
        setTranscript((t) => t.slice(0, -1));
        setInput(message);
        return;
      }

      const data = await res.json();
      setTranscript((t) => [...t, { role: 'patient', content: data.message }]);
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
      setTranscript((t) => t.slice(0, -1));
      setInput(message);
    } finally {
      setSending(false);
    }
  }

  async function endSimulation() {
    if (ending || sending) return;
    setEnding(true);
    setError('');
    try {
      const res = await fetch(`/api/simulation/${sessionId}/complete`, { method: 'POST' });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Die Auswertung ist fehlgeschlagen. Bitte versuche es erneut.');
        setEnding(false);
        return;
      }
      router.push(`/simulation/${sessionId}/results`);
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
      setEnding(false);
    }
  }

  const doctorTurns = transcript.filter((t) => t.role === 'doctor').length;

  return (
    <div className="simulation-shell">
      <div className="question-kicker">
        {caseTitle} · {patientName}, {patientAge} Jahre
      </div>

<div className="simulation-transcript">
        {transcript.map((entry, i) => (
<div key={i} className={`simulation-bubble ${entry.role}`}>
            {entry.content}
          </div>
        ))}
<>{sending && (
          <div className="small-muted" style={{ fontStyle: 'italic' }}>
            {patientName} antwortet…
          </div>
        )}</>
        <div ref={bottomRef} />
      </div>

      {error && <p className="err-text">{error}</p>}

      <div className="simulation-composer">
        <input
          className="search-input"
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ihre Frage an den Patienten…"
          disabled={sending || ending}
          maxLength={1000}
        />
        <button className="btn btn-blue" onClick={send} disabled={sending || ending || !input.trim()}>
          {sending ? '…' : 'Senden'}
        </button>
      </div>

      <button
        className="btn btn-outline"
        style={{ marginTop: 10 }}
        onClick={endSimulation}
        disabled={ending || sending || doctorTurns === 0}
        title={doctorTurns === 0 ? 'Stelle zuerst mindestens eine Frage' : undefined}
      >
        {ending ? 'Wird ausgewertet…' : 'Gespräch beenden & auswerten'}
      </button>
    </div>
  );
}
