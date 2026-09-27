'use client';

import { useState } from 'react';
import { startCaseSession } from '@/lib/actions';

export function StartCaseButton({ caseId, returnTo, studyStep }: { caseId: string; returnTo?: string; studyStep?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await startCaseSession(caseId, returnTo, studyStep); // redirects server-side on success
    } catch {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-blue btn-block" disabled={loading} onClick={handleClick}>
      {loading ? 'Wird gestartet…' : 'Fall starten'}
    </button>
  );
}
