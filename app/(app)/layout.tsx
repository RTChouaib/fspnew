import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getSubscription, canAccess } from '@/lib/progress';
import { AppIcon } from '@/components/AppIcon';

const NAV = [
  { href: '/dashboard', icon: 'home' as const, label: 'Dashboard' },
  { href: '/practice', icon: 'book' as const, label: 'Üben' },
  { href: '/cases', icon: 'stethoscope' as const, label: 'Fälle' },
  { href: '/test', icon: 'clipboard' as const, label: 'Kurztest' },
  { href: '/mistakes', icon: 'alert' as const, label: 'Fehler' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  const subscription = await getSubscription(userId);
  if (!canAccess(subscription, 'full')) redirect('/pricing?reason=paid');

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <Link href="/dashboard" className="app-brand"><span className="brand-mark">F</span><span>FSP <b>Terminology</b></span></Link>
        <div className="sidebar-label">TRAINING</div>
        <nav className="side-nav">
          {NAV.map((item) => <Link key={item.href} href={item.href} className="side-link"><AppIcon name={item.icon}/><span>{item.label}</span></Link>)}
        </nav>
        <div className="sidebar-spacer" />
        <nav className="side-nav side-nav-secondary">
          <Link href="/search" className="side-link"><AppIcon name="search"/><span>Suche</span></Link>
          <Link href="/account" className="side-link"><AppIcon name="user"/><span>Konto</span></Link>
        </nav>
        <div className="sidebar-note"><span className="status-dot"/> FSP Vorbereitung<br/><small>Dein Training, Schritt für Schritt.</small></div>
      </aside>

      <main className="app-main">
        <header className="mobile-app-header">
          <Link href="/dashboard" className="app-brand"><span className="brand-mark">F</span><span>FSP <b>Terminology</b></span></Link>
          <Link href="/account" className="icon-button" aria-label="Konto"><AppIcon name="user"/></Link>
        </header>
        <div className="app-content">{children}</div>
      </main>

      <nav className="mobile-tabbar">
        {NAV.slice(0,4).map((item) => <Link key={item.href} href={item.href} className="mobile-tab"><AppIcon name={item.icon}/><span>{item.label}</span></Link>)}
        <Link href="/search" className="mobile-tab"><AppIcon name="search"/><span>Mehr</span></Link>
      </nav>
    </div>
  );
}
