// Constants shared by browser and server code. Nothing secret lives here.
// The Pixel ID is public by design (it is visible in every page's network calls).
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1866116664750968';

// Charged amounts in EUR, used as the Purchase value sent to Meta.
// Keep in sync with the prices configured in Polar (see lib/pricing.ts for display copy).
export const PLAN_VALUES = {
  weekly: 4.99,
  monthly: 14.99,
  quarterly: 29.99,
} as const;

export type MetaPlan = keyof typeof PLAN_VALUES;

export function isMetaPlan(value: unknown): value is MetaPlan {
  return typeof value === 'string' && Object.hasOwn(PLAN_VALUES, value);
}

// Event IDs are generated server-side at checkout creation, passed to the browser
// via the success URL, and to the webhook via checkout metadata. Meta uses the
// matching ID to count the browser event and the server event as ONE purchase.
export const META_EVENT_ID_PATTERN = /^fsp_[a-f0-9]{32}$/;
