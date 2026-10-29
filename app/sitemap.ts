import type { MetadataRoute } from 'next';
import { appBaseUrl } from '@/lib/env';

// Public marketing and legal pages only. App, checkout, login and API routes are excluded on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = appBaseUrl();
  const pages = [
    { path: '', priority: 1 },
    { path: '/demo', priority: 0.8 },
    { path: '/pricing', priority: 0.8 },
    { path: '/legal/impressum', priority: 0.2 },
    { path: '/legal/datenschutz', priority: 0.2 },
    { path: '/legal/agb', priority: 0.2 },
    { path: '/legal/refund', priority: 0.2 },
  ];
  return pages.map((p) => ({ url: `${base}${p.path}`, priority: p.priority }));
}
