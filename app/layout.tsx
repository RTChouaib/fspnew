import type { Metadata } from 'next';
import { DM_Serif_Display, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
    <html
      lang="de"
      className={`${dmSerifDisplay.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <footer
          style={{
            padding: '1rem 1.25rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#6b7280',
            borderTop: '1px solid #e5e7eb',
            marginTop: '2rem',
          }}
        >
          For any issues contact <a href="mailto:chouaib@by-rtc.com">chouaib@by-rtc.com</a>
        </footer>
      </body>
    </html>
  );
}
