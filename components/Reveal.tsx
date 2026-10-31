'use client';

import { useEffect, useRef } from 'react';

/**
 * Entrance for one part of a section (heading, text, picture). Content is visible by default;
 * it is only hidden while the script runs, and shown again once it scrolls into view.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'p' | 'li' | 'section';
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('reveal-armed');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(() => el.classList.add('reveal-in'), delay);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    // Failsafe: never leave content hidden.
    const t = window.setTimeout(() => el.classList.add('reveal-in'), 2500 + delay);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);

  const T = Tag as React.ElementType;
  return (
    <T ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </T>
  );
}
