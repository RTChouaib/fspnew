import { getCurrentUserId } from '@/lib/session';
import { db } from '@/lib/db';
import { polarApiBase } from '@/lib/env';

export const runtime = 'nodejs';

const PRODUCT_ENV_BY_PLAN = {
  weekly: 'POLAR_PRODUCT_WEEKLY',
  monthly: 'POLAR_PRODUCT_MONTHLY',
  quarterly: 'POLAR_PRODUCT_QUARTERLY',
} as const;

type Plan = keyof typeof PRODUCT_ENV_BY_PLAN;

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return Response.json({ error: 'Bitte zuerst Ihre E-Mail bestätigen oder anmelden.' }, { status: 401 });

  let body: { plan?: unknown };
  try { body = await req.json(); } catch { return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 }); }
  const plan = body.plan;
  if (typeof plan !== 'string' || !Object.hasOwn(PRODUCT_ENV_BY_PLAN, plan)) {
    return Response.json({ error: 'Ungültiger Tarif.' }, { status: 400 });
  }
  const typedPlan = plan as Plan;
  const productId = process.env[PRODUCT_ENV_BY_PLAN[typedPlan]];
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!productId || !accessToken) {
    console.error('[polar checkout] Missing POLAR_ACCESS_TOKEN or product ID environment variable.');
    return Response.json({ error: 'Zahlung ist noch nicht vollständig konfiguriert. Bitte später erneut versuchen.' }, { status: 503 });
  }

  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return Response.json({ error: 'Konto nicht gefunden.' }, { status: 404 });
  const existing = await db.subscription.findUnique({ where: { userId } });
  if (existing?.status === 'active' || existing?.status === 'trial') {
    return Response.json({ error: 'Für dieses Konto besteht bereits ein aktives Abo.' }, { status: 409 });
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://fsp.by-rtc.com').replace(/\/$/, '');
  const response = await fetch(`${polarApiBase()}/v1/checkouts/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      products: [productId],
      customer_email: user.email,
      external_customer_id: userId,
      metadata: { userId, plan: typedPlan },
      success_url: `${appUrl}/checkout/success?checkout_id={CHECKOUT_ID}`,
      return_url: `${appUrl}/pricing`,
    }),
    cache: 'no-store',
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.url !== 'string') {
    console.error('[polar checkout] API request failed', response.status, result);
    return Response.json({ error: 'Polar konnte den Checkout nicht erstellen. Bitte versuchen Sie es erneut.' }, { status: 502 });
  }
  return Response.json({ url: result.url });
}
