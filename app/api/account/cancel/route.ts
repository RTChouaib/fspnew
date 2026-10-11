import { getCurrentUserId } from '@/lib/session';
import { polarApiBase } from '@/lib/env';
import { getSubscription, markPolarCancelPending } from '@/lib/progress';

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const subscription = await getSubscription(userId);
  if (!subscription?.polarSubscriptionId) return new Response('No Polar subscription found', { status: 400 });
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) return new Response('Payment provider is not configured', { status: 503 });

  const response = await fetch(`${polarApiBase()}/v1/subscriptions/${encodeURIComponent(subscription.polarSubscriptionId)}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ cancel_at_period_end: true }),
    cache: 'no-store',
  });
  if (!response.ok) {
    console.error('[polar cancel] API request failed', response.status, await response.text().catch(() => ''));
    return new Response('Could not cancel subscription with Polar', { status: 502 });
  }
  await markPolarCancelPending(userId);
  return Response.json({ ok: true, currentPeriodEnd: subscription.currentPeriodEnd });
}
