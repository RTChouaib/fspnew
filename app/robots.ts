import type { MetadataRoute } from 'next';
import { appBaseUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = appBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout',
          '/login',
          '/onboarding',
          '/dashboard',
          '/study',
          '/learn',
          '/practice',
          '/test',
          '/cases',
          '/simulation',
          '/mistakes',
          '/search',
          '/categories',
          '/account',
          '/term/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
