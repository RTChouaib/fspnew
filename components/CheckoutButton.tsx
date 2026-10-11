'use client';

import { useState } from 'react';

export function CheckoutButton({
  plan,
  userEmail,
  label,
}: {
  plan: 'weekly' | 'monthly' | 'quarterly';
  userEmail: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function openCheckout() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.url !== 'string') {
        throw new Error(result?.error || 'Checkout konnte nicht gestartet werden. Bitte erneut versuchen.');
      }
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout konnte nicht gestartet werden.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="btn btn-blue btn-block" disabled={loading} onClick={openCheckout}>
        {loading ? 'Checkout wird geöffnet…' : label}
      </button>
      {error && <p className="err-text" role="alert">{error}</p>}
      <p className="small-muted" style={{ marginTop: 8, textAlign: 'center' }}>
        Zahlung wird sicher über Polar abgewickelt für {userEmail}.
      </p>
    </div>
  );
}
