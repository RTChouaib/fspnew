'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppIcon } from '@/components/AppIcon';

type NavItem = { href: string; icon: 'home' | 'book' | 'stethoscope' | 'clipboard' | 'alert' | 'target' | 'search' | 'user'; label: string };

const NAV: NavItem[] = [
  { href: '/dashboard', icon: 'home', label: 'Dashboard' },
  { href: '/learn', icon: 'book', label: 'Lernplan' },
  { href: '/cases', icon: 'stethoscope', label: 'Patientengespräch' },
  { href: '/test', icon: 'clipboard', label: 'Tests' },
  { href: '/mistakes', icon: 'alert', label: 'Fehler' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
}

export function AppNavigation() {
  const pathname = usePathname();
  return <>
    <aside className="app-sidebar">
      <Link href="/dashboard" className="app-brand"><span className="brand-mark">F</span><span>FSP <b>Terminology</b></span></Link>
      <div className="sidebar-label">DEIN TRAINING</div>
      <nav className="side-nav" aria-label="Hauptnavigation">
        {NAV.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined} className={`side-link${isActive(pathname, item.href) ? ' is-active' : ''}`}><AppIcon name={item.icon}/><span>{item.label}</span></Link>)}
      </nav>
      <div className="sidebar-spacer" />
      <nav className="side-nav side-nav-secondary" aria-label="Weitere Navigation">
        <Link href="/study" aria-current={pathname === '/study' ? 'page' : undefined} className={`side-link${pathname === '/study' ? ' is-active' : ''}`}><AppIcon name="target"/><span>Heute lernen</span></Link>
        <Link href="/search" aria-current={pathname === '/search' ? 'page' : undefined} className={`side-link${pathname === '/search' ? ' is-active' : ''}`}><AppIcon name="search"/><span>Suche</span></Link>
        <Link href="/account" aria-current={pathname === '/account' ? 'page' : undefined} className={`side-link${pathname === '/account' ? ' is-active' : ''}`}><AppIcon name="user"/><span>Konto</span></Link>
      </nav>
      <div className="sidebar-note"><span className="status-dot"/> FSP Vorbereitung<br/><small>Dein Training, Schritt für Schritt.</small></div>
    </aside>
    <header className="mobile-app-header">
      <Link href="/dashboard" className="app-brand"><span className="brand-mark">F</span><span>FSP <b>Terminology</b></span></Link>
      <Link href="/account" className="icon-button" aria-label="Konto"><AppIcon name="user"/></Link>
    </header>
    <nav className="mobile-tabbar" aria-label="Mobile Navigation">
      {NAV.slice(0,4).map((item) => <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined} className={`mobile-tab${isActive(pathname, item.href) ? ' is-active' : ''}`}><AppIcon name={item.icon}/><span>{item.label === 'Patientengespräch' ? 'Gespräche' : item.label}</span></Link>)}
      <Link href="/search" aria-current={pathname === '/search' ? 'page' : undefined} className={`mobile-tab${pathname === '/search' ? ' is-active' : ''}`}><AppIcon name="search"/><span>Suche</span></Link>
    </nav>
  </>;
}
