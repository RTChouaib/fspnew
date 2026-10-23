'use client';

import { META_PIXEL_ID } from './metaShared';

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

// Loads Meta's script and initialises the pixel. Safe to call repeatedly.
// Must only be called after the visitor has granted marketing consent.
export function ensurePixel() {
  if (typeof window === 'undefined' || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', META_PIXEL_ID);
}

// No-op unless the pixel was loaded (which only happens after consent).
export function trackMeta(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (eventId) window.fbq('track', event, params ?? {}, { eventID: eventId });
  else window.fbq('track', event, params ?? {});
}

export function revokePixel() {
  if (typeof window === 'undefined') return;
  window.fbq?.('consent', 'revoke');
  for (const name of ['_fbp', '_fbc']) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${location.hostname}`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname.replace(/^www\./, '')}`;
  }
}
