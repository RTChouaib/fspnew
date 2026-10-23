'use client';

import { useEffect } from 'react';
import { useConsent } from '@/lib/consent';
import { ensurePixel, trackMeta } from '@/lib/metaClient';
import { META_EVENT_ID_PATTERN, PLAN_VALUES, isMetaPlan } from '@/lib/metaShared';

// Fires the browser-side Purchase on the checkout success page, with the same event ID
// the server sends from the Polar webhook, so Meta counts it once. Renders nothing.
export function MetaPurchaseTracker({ eventId, plan }: { eventId?: string; plan?: string }) {
  const consent = useConsent();

  useEffect(() => {
    if (consent !== 'granted') return;
    if (!eventId || !META_EVENT_ID_PATTERN.test(eventId) || !isMetaPlan(plan)) return;
    const key = `fsp_purchase_${eventId}`;
    try {
      if (sessionStorage.getItem(key)) return; // page refresh: do not fire twice
      sessionStorage.setItem(key, '1');
    } catch { /* storage unavailable: still fire once per load */ }
    ensurePixel();
    trackMeta('Purchase', { value: PLAN_VALUES[plan], currency: 'EUR', content_name: plan, content_type: 'product' }, eventId);
  }, [consent, eventId, plan]);

  return null;
}
