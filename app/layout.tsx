import type { Metadata, Viewport } from 'next';
import { appBaseUrl } from '@/lib/env';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/marketing.css';
import '../styles/app-shell.css';
import '../styles/dashboard.css';
import '../styles/learn.css';
import '../styles/study.css';
import '../styles/quiz.css';
import '../styles/simulation.css';
import '../styles/site.css';
import '../styles/landing-refresh.css';
import { Analytics } from '@vercel/analytics/next';
import { ConsentBanner } from '@/components/ConsentBanner';
import { MetaPixel } from '@/components/MetaPixel';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl()),
  title: {
    default: 'FSP Terminology: Fachsprachprüfung für Ärzte trainieren',
    template: '%s · FSP Terminology',
  },
  description:
    'Medizinisches Deutsch für internationale Ärztinnen und Ärzte: Fachsprache, Patientensprache und FSP-Aufgaben gezielt trainieren. 5 Aufgaben kostenlos testen.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'FSP Terminology',
    title: 'FSP Terminology',
    description:
      'Medizinisches Deutsch für die Fachsprachprüfung: Fachsprache, Patientensprache, Anamnese und Arztbrief aktiv trainieren.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${dmSerifDisplay.variable} ${manrope.variable}`}>
      <body>
        <ConsentBanner />
        {children}
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  );
}
