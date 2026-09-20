import Link from 'next/link';
import { PLANS } from '@/lib/pricing';

export function PricingCards() {
  return (
    <div className="pricing-grid">
      {PLANS.map((p) => (
        <div key={p.id} className={`plan ${p.featured ? 'featured' : ''}`}>
          {p.badge && <div className="plan-badge">{p.badge}</div>}
          <div className="plan-name">{p.name}</div>
          <div className="plan-price">{p.price}</div>
          <div className="plan-period">{p.period}</div>
          <div className="plan-weekly-equiv">{p.note}</div>
          <ul className="plan-features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link
            href={`/checkout?plan=${p.id}`}
            className={`btn btn-block ${p.featured ? 'btn-blue' : 'btn-outline'}`}
          >
            Wählen
          </Link>
        </div>
      ))}
    </div>
  );
}
