import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FSP Terminology — Medizinisches Deutsch für die Fachsprachprüfung',
  description:
    'Medizinisches Deutsch für internationale Ärztinnen und Ärzte: Fachsprache, Patientensprache und FSP-Aufgaben gezielt trainieren. 5 Aufgaben kostenlos testen.',
  openGraph: {
    title: 'FSP Terminology',
    description:
      'Medizinisches Deutsch für die Fachsprachprüfung — Fachsprache, Patientensprache, Anamnese und Arztbrief aktiv trainieren.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
