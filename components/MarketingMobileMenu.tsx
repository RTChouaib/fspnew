'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '/#how', label: "So funktioniert's" },
  { href: '/#about', label: 'Über die App' },
  { href: '/pricing', label: 'Preise' },
  { href: '/#faq', label: 'Häufige Fragen' },
];

/** Hamburger menu for small screens; the desktop links are hidden below 760px. */
export function MarketingMobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="menu-wrap">
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="marketing-menu"
        aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      {open && (
        <div id="marketing-menu" ref={panelRef} className="menu-panel">
          <nav aria-label="Menü">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="menu-link" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/demo" className="btn btn-blue menu-cta" onClick={() => setOpen(false)}>
              5 Aufgaben kostenlos testen
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
