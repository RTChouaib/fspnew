import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '@/lib/db';
import { upsertSubscriptionFromPolar, markPolarSubscriptionExpired } from '@/lib/progress';

export const runtime = 'nodejs';

function signingKeys(secret: string): Buffer[] {
  // Polar's SDK signs with the UTF-8 bytes of the *entire* secret string
  // (including the `polar_whs_` prefix). Fall back to a base64-decoded key
  // (standard-webhooks style) so either secret format verifies.
  const keys = [Buffer.from(secret, 'utf8')];
  const remainder = secret.replace(/^(polar_whs_|whsec_)/, '');
  const decoded = Buffer.from(remainder, 'base64');
  if (decoded.length && !decoded.equals(keys[0])) keys.push(decoded);
  return keys;
}

function verifyPolarSignature(rawBody: string, req: Request, secret: string): boolean {
  const id = req.headers.get('webhook-id');
  const timestamp = req.headers.get('webhook-timestamp');
  const signatureHeader = req.headers.get('webhook-signature');
  if (!id || !timestamp || !signatureHeader || !secret) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const signed = `${id}.${timestamp}.${rawBody}`;
  const expectedList = signingKeys(secret).map((key) => Buffer.from(createHmac('sha256', key).update(signed).digest('base64')));
  return signatureHeader.split(' ').some((entry) => {
    const [version, supplied] = entry.split(',', 2);
    if (version !== 'v1' || !supplied) return false;
    const b = Buffer.from(supplied);
    return expectedList.some((a) => a.length === b.length && timingSafeEqual(a, b));
  });
}

function planForProduct(productId: string): 'weekly' | 'monthly' | 'quarterly' | null {
  if (productId && productId === process.env.POLAR_PRODUCT_WEEKLY) return 'weekly';
  if (productId && productId === process.env.POLAR_PRODUCT_MONTHLY) return 'monthly';
  if (productId && productId === process.env.POLAR_PRODUCT_QUARTERLY) return 'quarterly';
  return null;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret || !verifyPolarSignature(rawBody, req, secret)) {
    console.error('[polar webhook] signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try { event = JSON.parse(rawBody); } catch { return new Response('Invalid JSON', { status: 400 }); }
  const data = event.data;
  if (!data || typeof event.type !== 'string') return new Response('Invalid event', { status: 400 });

  try {
    if (event.type.startsWith('subscription.')) {
      const customer = data.customer as Record<string, unknown> | undefined;
      const metadata = (data.metadata && typeof data.metadata === 'object' ? data.metadata : {}) as Record<string, unknown>;
      let userId = typeof metadata.userId === 'string' ? metadata.userId
        : typeof customer?.external_id === 'string' ? customer.external_id : null;
      // Last-resort mapping: match the Polar customer's email to our user.
      if (!userId && typeof customer?.email === 'string') {
        const byEmail = await db.user.findUnique({ where: { email: customer.email.trim().toLowerCase() }, select: { id: true } });
        userId = byEmail?.id ?? null;
      }
      const subscriptionId = typeof data.id === 'string' ? data.id : null;
      if (!subscriptionId) return new Response('Missing subscription ID', { status: 422 });

      if (event.type === 'subscription.revoked' || event.type === 'subscription.canceled') {
        const end = typeof data.current_period_end === 'string' ? new Date(data.current_period_end) : null;
        const stillPaid = event.type === 'subscription.canceled' && end && end.getTime() > Date.now();
        if (!stillPaid) await markPolarSubscriptionExpired(subscriptionId);
        else if (userId) {
          const productId = typeof data.product_id === 'string' ? data.product_id : '';
          const plan = planForProduct(productId);
          if (plan && typeof data.customer_id === 'string') await upsertSubscriptionFromPolar({
            userId, status: 'active', plan, polarCustomerId: data.customer_id, polarSubscriptionId: subscriptionId,
            currentPeriodEnd: end!, cancelAtPeriodEnd: true,
          });
        }
        return new Response('OK', { status: 200 });
      }

      if (event.type === 'subscription.active' || event.type === 'subscription.uncanceled' || event.type === 'subscription.updated') {
        const status = data.status === 'active' || data.status === 'trialing' ? 'active' : 'expired';
        if (status === 'expired' && event.type === 'subscription.updated') return new Response('OK', { status: 200 });
        if (!userId) {
          console.error('[polar webhook] Subscription event missing metadata.userId/external customer ID', subscriptionId);
          return new Response('Missing user mapping', { status: 422 });
        }
        const productId = typeof data.product_id === 'string' ? data.product_id : '';
        const plan = planForProduct(productId);
        const customerId = typeof data.customer_id === 'string' ? data.customer_id : null;
        const periodEnd = typeof data.current_period_end === 'string' ? new Date(data.current_period_end) : null;
        if (!plan || !customerId || !periodEnd || Number.isNaN(periodEnd.getTime())) {
          console.error('[polar webhook] Missing or unknown product/customer/period fields', subscriptionId, productId);
          return new Response('Invalid subscription data', { status: 422 });
        }
        await upsertSubscriptionFromPolar({
          userId, status: 'active', plan, polarCustomerId: customerId, polarSubscriptionId: subscriptionId,
          currentPeriodEnd: periodEnd, cancelAtPeriodEnd: data.cancel_at_period_end === true,
        });
      }
    }
  } catch (error) {
    console.error('[polar webhook] Handler failed', error);
    return new Response('Webhook handler error', { status: 500 });
  }
  return new Response('OK', { status: 200 });
}
