import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CheckoutForm } from './CheckoutForm';
import { getPlan } from '@/lib/pricing';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: rawPlan } = await searchParams;
  const plan = (rawPlan as 'weekly' | 'monthly' | 'quarterly') || 'monthly';
  const info = getPlan(plan);

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 44 }}>
        <div className="eyebrow">Checkout</div>
        <h2>
          Plan: {info.name} — {info.price} {info.period}
        </h2>
        <CheckoutForm plan={plan} />
        <p className="small-muted" style={{ marginTop: 10, textAlign: 'center' }}>
          Wir speichern keine Zahlungsdaten. Kündigung jederzeit im Konto möglich.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
