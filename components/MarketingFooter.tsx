import Link from 'next/link';
import { CookieSettingsLink } from './CookieSettingsLink';

export function MarketingFooter() {
  return (
    <div className="footer">
      <div className="wrap">
        <div className="footer-links">
          <Link href="/legal/impressum">Impressum</Link>
          <Link href="/legal/datenschutz">Datenschutz</Link>
          <Link href="/legal/agb">AGB</Link>
          <Link href="/legal/refund">Rückerstattung</Link>
          <CookieSettingsLink />
          <span className="small-muted">
            © {new Date().getFullYear()} FSP Terminology. Kein medizinisches oder amtliches
            Prüfungsprodukt; unabhängiges Lernangebot zur Sprachvorbereitung.
          </span>
        </div>
      </div>
    </div>
  );
}
