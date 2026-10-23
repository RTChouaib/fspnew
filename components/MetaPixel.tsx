'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/lib/consent';
import { ensurePixel, revokePixel, trackMeta } from '@/lib/metaClient';

// Loads the Meta Pixel ONLY after marketing consent and reports page views
// (including client-side navigations). Renders nothing.
export function MetaPixel() {
  const consent = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent === 'granted') {
      ensurePixel();
      trackMeta('PageView');
    } else if (consent === 'denied') {
      revokePixel();
    }
  }, [consent, pathname]);

  return null;
}
