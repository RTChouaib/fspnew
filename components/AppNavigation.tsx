'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AppIcon } from '@/components/AppIcon';

type IconName = 'home' | 'book' | 'stethoscope' | 'clipboard' | 'alert' | 'target' | 'search' | 'user' | 'chart';
type NavItem = { href: string; icon: IconName; label: string; short?: string };

// Primary navigation: the daily loop first.
const PRIMARY: NavItem[] = [
  { href: '/dashboard', icon: 'home', label: 'Dashboard', short: 'Start' },
  { href: '/study', icon: 'target', label: 'Heute lernen', short: 'Heute' },
  { href: '/learn', icon: 'book', label: 'Lernplan' },
  { href: '/cases', icon: 'stethoscope', label: 'Patientengespräch', short: 'Gespräche' },
  { href: '/test', icon: 'clipboard', label: 'Tests' },
  { href: '/mistakes', icon: 'alert', label: 'Fehler' },
];

const SECONDARY: NavItem[] = [
  { href: '/categories', icon: 'chart', label: 'Kategorien' },
  { href: '/search', icon: 'search', label: 'Suche' },
  { href: '/account', icon: 'user', label: 'Konto' },
];

// Mobile tab bar: four primary destinations plus a "Mehr" sheet for everything else.
const MOBILE_TABS = PRIMARY.filter((i) => ['/dashboard', '/study', '/learn', '/cases'].includes(i.href));
const MORE_ITEMS: NavItem[] = [PRIMARY[4], PRIMARY[5], ...SECONDARY];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
}

export function AppNavigation() {
  const pathname = usePathname();
  // The sheet is open only for the path it was opened on, so it closes automatically on navigation.
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const moreOpen = openForPath === pathname;
  const setMoreOpen = (open: boolean | ((v: boolean) => boolean)) => {
    const next = typeof open === 'function' ? open(moreOpen) : open;
    setOpenForPath(next ? pathname : null);
  };
  const sheetRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const firstLink = sheetRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreOpen]);

  const moreActive = MORE_ITEMS.some((i) => isActive(pathname, i.href));

  return (
    <>
      <aside className="app-sidebar">
        <Link href="/dashboard" className="app-brand">
          <span className="brand-mark">F</span>
          <span>
            FSP <b>Terminology</b>
          </span>
        </Link>
        <div className="sidebar-label">DEIN TRAINING</div>
        <nav className="side-nav" aria-label="Hauptnavigation">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className={`side-link${isActive(pathname, item.href) ? ' is-active' : ''}`}
            >
              <AppIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <nav className="side-nav side-nav-secondary" aria-label="Weitere Navigation">
          {SECONDARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className={`side-link${isActive(pathname, item.href) ? ' is-active' : ''}`}
            >
              <AppIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="status-dot" /> FSP Vorbereitung
          <br />
          <small>Dein Training, Schritt für Schritt.</small>
        </div>
      </aside>

      <header className="mobile-app-header">
        <Link href="/dashboard" className="app-brand">
          <span className="brand-mark">F</span>
          <span>
            FSP <b>Terminology</b>
          </span>
        </Link>
        <Link href="/account" className="icon-button" aria-label="Konto">
          <AppIcon name="user" />
        </Link>
      </header>

      {moreOpen && (
        <div className="more-backdrop" onClick={() => setMoreOpen(false)}>
          <div
            ref={sheetRef}
            id="more-sheet"
            className="more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Weitere Bereiche"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="more-sheet-handle" aria-hidden="true" />
            <nav aria-label="Weitere Bereiche">
              {MORE_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={`more-link${isActive(pathname, item.href) ? ' is-active' : ''}`}
                >
                  <AppIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <nav className="mobile-tabbar" aria-label="Mobile Navigation">
        {MOBILE_TABS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
            className={`mobile-tab${isActive(pathname, item.href) ? ' is-active' : ''}`}
          >
            <AppIcon name={item.icon} />
            <span>{item.short ?? item.label}</span>
          </Link>
        ))}
        <button
          ref={moreButtonRef}
          type="button"
          className={`mobile-tab${moreActive || moreOpen ? ' is-active' : ''}`}
          aria-expanded={moreOpen}
          aria-controls="more-sheet"
          aria-haspopup="dialog"
          onClick={() => setMoreOpen((v) => !v)}
        >
          <AppIcon name="chart" />
          <span>Mehr</span>
        </button>
      </nav>
    </>
  );
}
