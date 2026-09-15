'use client';

import { useEffect, useState } from 'react';

interface PaddleCheckoutOptions {
  items: { priceId: string; quantity: number }[];
  customer: { email: string };
  customData: Record<string, unknown>;
  settings: { successUrl: string };
}

interface PaddleInstance {
  Environment: { set: (env: 'production' | 'sandbox') => void };
  Setup: (config: { token: string }) => void;
  Checkout: { open: (options: PaddleCheckoutOptions) => void };
}

declare global {
  interface Window {
    Paddle?: PaddleInstance;
  }
}

export function CheckoutButton({
  priceId,
  userEmail,
  userId,
  label,
}: {
  priceId: string;
  userEmail: string;
  userId: string;
  label: string;
}) {
  // Lazy initializer runs during render, not as a side effect — avoids a
  // synchronous setState inside the effect body below for the case where
  // Paddle.js is already loaded (e.g. from a previous checkout attempt).
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.Paddle);
  const [checking, setChecking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (window.Paddle) return; // already covered by the lazy initial state above
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      window.Paddle!.Environment.set(
        process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'production' : 'sandbox'
      );
      window.Paddle!.Setup({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN! });
      setReady(true);
    };
    document.body.appendChild(script);
  }, []);

  async function openCheckout() {
    if (!window.Paddle) return;
    // Re-verify right before opening the overlay — the plan/session state on
    // this page can go stale (e.g. subscribed in another tab a minute ago),
    // and this is the last checkpoint before Paddle would actually charge.
    setChecking(true);
    try {
      const res = await fetch('/api/account/status');
      const data = await res.json().catch(() => null);
      if (data?.status === 'active') {
        setBlocked(true);
        return;
      }
    } catch {
      // If the status check itself fails, fall through and let Paddle's own
      // checkout proceed rather than blocking a legitimate purchase on a
      // network hiccup.
    } finally {
      setChecking(false);
    }

    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { userId }, // this is what comes back on the webhook to identify the user
      settings: {
        successUrl: `${window.location.origin}/onboarding`,
      },
    });
  }

  if (blocked) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px' }}>
          Für <strong>{userEmail}</strong> läuft bereits ein aktives Abo. Eine erneute Zahlung
          ist nicht nötig.
        </p>
        <a href="/account" className="btn btn-blue btn-block">
          Zum Konto
        </a>
      </div>
    );
  }

  return (
    <button className="btn btn-blue btn-block" disabled={!ready || checking} onClick={openCheckout}>
      {checking ? 'Einen Moment…' : ready ? label : 'Lädt…'}
    </button>
  );
}
