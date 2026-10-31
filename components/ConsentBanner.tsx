'use client';

import Link from 'next/link';
import { setConsent, useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const consent = useConsent();
  if (consent !== 'unset') return null;

  return (
    <div role="region" aria-label="Cookie-Einstellungen" className="consent-bar">
      <div className="consent-inner">
        <p className="consent-title">Cookies und Werbemessung</p>
        <p className="consent-text">
          Mit deiner Einwilligung nutzen wir das Meta Pixel und die Meta Conversions API, um zu messen, welche
          Werbeanzeigen zu Anmeldungen und Käufen führen. Dabei werden Daten an Meta Platforms Ireland übermittelt (auch
          in die USA). Ohne Einwilligung wird nichts davon geladen. Du kannst jederzeit über „Cookie-Einstellungen“ im
          Seitenfuß widerrufen. Details in der <Link href="/legal/datenschutz">Datenschutzerklärung</Link>.
        </p>
        <div className="consent-actions">
          <button className="btn btn-sm btn-light" onClick={() => setConsent('denied')}>
            Ablehnen
          </button>
          <button className="btn btn-sm btn-light" onClick={() => setConsent('granted')}>
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
