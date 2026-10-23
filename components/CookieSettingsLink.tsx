'use client';

import { setConsent } from '@/lib/consent';

// Footer link that re-opens the consent banner so a choice can be changed at any time.
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => setConsent('unset')}
      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--blue-dark)', textDecoration: 'underline', cursor: 'pointer' }}
    >
      Cookie-Einstellungen
    </button>
  );
}
