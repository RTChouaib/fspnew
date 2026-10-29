'use client';

import Link from 'next/link';
import { setConsent, useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const consent = useConsent();
  if (consent !== 'unset') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        maxHeight: '60dvh',
        overflowY: 'auto',
        zIndex: 100,
        maxWidth: 720,
        margin: '0 auto',
        background: 'var(--card)',
        border: '1px solid var(--line-strong)',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(22,35,46,.18)',
        padding: 16,
      }}
    >
      <p style={{ margin: '0 0 4px', color: 'var(--ink)', fontWeight: 600, fontSize: 14 }}>Cookies und Werbemessung</p>
      <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.45 }}>
        Mit deiner Einwilligung nutzen wir das Meta Pixel und die Meta Conversions API, um zu messen, welche
        Werbeanzeigen zu Anmeldungen und Käufen führen. Dabei werden Daten an Meta Platforms Ireland übermittelt (auch
        in die USA). Ohne Einwilligung wird nichts davon geladen. Du kannst jederzeit über „Cookie-Einstellungen“ im
        Seitenfuß widerrufen. Details in der <Link href="/legal/datenschutz">Datenschutzerklärung</Link>.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-sm btn-outline" onClick={() => setConsent('denied')}>
          Ablehnen
        </button>
        <button className="btn btn-sm btn-outline" onClick={() => setConsent('granted')}>
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
