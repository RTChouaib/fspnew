import Link from 'next/link';

export function MarketingTopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="logo">
          <span className="dot"></span>FSP Terminology
        </Link>
        <div className="nav-links">
          <Link href="/#how" className="nav-link nav-hide-mobile">SO FUNKTIONIERT&apos;S</Link>
          <Link href="/pricing" className="nav-link nav-hide-mobile">PREISE</Link>
          <Link href="/login" className="nav-link nav-login">LOGIN</Link>
          <Link href="/demo" className="btn btn-sm btn-blue nav-hide-mobile">5 Aufgaben testen</Link>
        </div>
      </div>
    </div>
  );
}
