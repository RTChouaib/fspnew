'use client';

import { useSyncExternalStore } from 'react';

// Marketing consent (Meta Pixel + Conversions API). Stored in a first-party cookie so
// the server can also see it when a checkout is created. Nothing marketing-related
// runs unless this is 'granted'.
export const CONSENT_COOKIE = 'fsp_consent';
const CHANGE_EVENT = 'fsp-consent-change';

export type ConsentState = 'granted' | 'denied' | 'unset';

function readCookie(): ConsentState {
  if (typeof document === 'undefined') return 'unset';
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.split('=')[1];
  return value === 'granted' || value === 'denied' ? value : 'unset';
}

export function setConsent(value: ConsentState) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  if (value === 'unset') {
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  } else {
    document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

// 'server' is only returned during server rendering / hydration so nothing flashes.
export function useConsent(): ConsentState | 'server' {
  return useSyncExternalStore(subscribe, readCookie, () => 'server' as const);
}
