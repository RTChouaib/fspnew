import Link from 'next/link';

const PLANS = [
  {
    name: 'Wochenplan',
    price: '4,99 €',
    period: 'pro Woche',
    note: 'Für kurzfristiges Training',
    badge: null,
    featured: false,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Jederzeit kündbar'],
    plan: 'weekly',
  },
  {
    name: 'Monatsplan',
    price: '14,99 €',
    period: 'pro Monat',
    note: 'Für regelmäßiges Training · ≈ 3,46 € / Woche',
    badge: null,
    featured: false,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
    plan: 'monthly',
  },
  {
    name: 'FSP Intensiv — 3 Monate',
    price: '29,99 €',
    period: 'für 3 Monate',
    note: 'Für die gezielte Vorbereitung über mehrere Monate · ≈ 2,31 € / Woche',
    badge: 'Beste Wahl',
    featured: true,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
    plan: 'quarterly',
  },
] as const;

export function PricingCards() {
  return (
    <div className="pricing-grid">
      {PLANS.map((p) => (
        <div key={p.plan} className={`plan ${p.featured ? 'featured' : ''}`}>
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
            href={`/checkout?plan=${p.plan}`}
            className={`btn btn-block ${p.featured ? 'btn-blue' : 'btn-outline'}`}
          >
            Wählen
          </Link>
        </div>
      ))}
    </div>
  );
}
