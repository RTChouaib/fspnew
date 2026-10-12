// Legacy endpoint kept as an inert stub. Billing moved to Polar
// (see /api/webhooks/polar). This file has no imports on purpose so a stale
// copy of the old Paddle handler can never break the build.
// You can delete this whole folder once the Paddle webhook is removed.
export async function POST() {
  return new Response('Gone: billing moved to Polar', { status: 410 });
}
