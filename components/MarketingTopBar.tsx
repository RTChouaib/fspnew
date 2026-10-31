import Link from 'next/link';
import { MarketingMobileMenu } from '@/components/MarketingMobileMenu';

export function MarketingTopBar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="logo">
          <span className="dot"></span>FSP Terminology
        </Link>
        <nav className="nav-links" aria-label="Hauptnavigation">
          <Link href="/#how" className="nav-link nav-hide-mobile">
            So funktioniert&apos;s
          </Link>
          <Link href="/pricing" className="nav-link nav-hide-mobile">
            Preise
          </Link>
          <Link href="/login" className="nav-link nav-login">
            Login
          </Link>
          <Link href="/demo" className="btn btn-sm btn-blue nav-hide-mobile">
            5 Aufgaben testen
          </Link>
          <MarketingMobileMenu />
        </nav>
      </div>
    </header>
  );
}
