export type PlanId = 'weekly' | 'monthly' | 'quarterly';

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  note: string;
  badge: string | null;
  featured: boolean;
  features: string[];
}

// Display copy only. The actual Polar product IDs this maps to at checkout
// live in server-side env vars (POLAR_PRODUCT_WEEKLY, etc.) and are selected
// by app/api/checkout/route.ts. Changing display copy here does not change
// what Polar charges; update the product price in Polar and the matching env var.
const SHARED_FEATURES = [
  'Interaktive Patientengespräche (FSP Fälle)',
  'Sofortiges, persönliches Feedback',
  'Patientensprache & Fachsprache',
  'Alle Begriffe & Kategorien',
  'Spaced Repetition & Fehlertraining',
];

export const PLANS: PlanConfig[] = [
  {
    id: 'weekly',
    name: 'Wochenplan',
    price: '4,99 €',
    period: 'pro Woche',
    note: 'Für kurzfristiges Training',
    badge: null,
    featured: false,
    features: [...SHARED_FEATURES, 'Jederzeit kündbar'],
  },
  {
    id: 'monthly',
    name: 'Monatsplan',
    price: '14,99 €',
    period: 'pro Monat',
    note: 'Für regelmäßiges Training · ≈ 3,46 € / Woche',
    badge: null,
    featured: false,
    features: [...SHARED_FEATURES, 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
  },
  {
    id: 'quarterly',
    name: 'FSP Intensiv — 3 Monate',
    price: '29,99 €',
    period: 'für 3 Monate',
    note: 'Für die gezielte Vorbereitung über mehrere Monate · ≈ 2,31 € / Woche',
    badge: 'Beste Wahl',
    featured: true,
    features: [...SHARED_FEATURES, 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
  },
];

export function getPlan(id: string | undefined): PlanConfig {
  return PLANS.find((p) => p.id === id) ?? PLANS.find((p) => p.id === 'monthly')!;
}
