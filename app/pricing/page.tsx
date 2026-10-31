import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';
import { PLANS } from '@/lib/pricing';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Preise',
  description: 'Wochen-, Monats- und 3-Monats-Plan für dein FSP-Training. Jederzeit kündbar.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow wide" style={{ paddingTop: 44 }}>
        {reason && (
          <div className="locked-banner">
            {reason === 'paid'
              ? 'Dieser Bereich ist für zahlende Mitglieder. Wähle einen Plan, um weiterzumachen.'
              : 'Bitte wähle zunächst einen Plan, um dein Konto einzurichten.'}
          </div>
        )}
        <Reveal>
          <h1 className="page-display page-xl">Vorbereitung starten</h1>
          <p className="page-lead">
            Wähle den Plan, der zu deiner Prüfungsvorbereitung passt. Keine langfristige Bindung, jederzeit kündbar.
          </p>
          <p className="small-note">In allen Plänen enthalten: {PLANS[PLANS.length - 1].features.join(', ')}.</p>
        </Reveal>
        <Reveal delay={100}>
          <PricingCards />
        </Reveal>
        <p className="small-muted" style={{ marginTop: 18 }}>
          Alle Preise inkl. gesetzlicher MwSt. Zahlungsabwicklung erfolgt sicher über unseren Zahlungsanbieter. Wir
          speichern keine Kartendaten. Noch unsicher? <Link href="/demo">5 Aufgaben kostenlos testen</Link>.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
