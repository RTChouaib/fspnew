import Link from 'next/link';
import { CookieSettingsLink } from './CookieSettingsLink';

export function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <p className="site-footer-note">
            Kein medizinisches oder amtliches Prüfungsprodukt. FSP Terminology ist ein unabhängiges Lernangebot zur
            Sprachvorbereitung.
          </p>
          <nav className="site-footer-links" aria-label="Rechtliches">
            <Link href="/legal/impressum">Impressum</Link>
            <Link href="/legal/datenschutz">Datenschutz</Link>
            <Link href="/legal/agb">AGB</Link>
            <Link href="/legal/refund">Rückerstattung</Link>
            <CookieSettingsLink />
          </nav>
        </div>
        <p className="site-footer-name" aria-hidden="true">
          FSP Terminology
        </p>
        <p className="site-footer-copy">© {new Date().getFullYear()} FSP Terminology</p>
      </div>
    </footer>
  );
}
