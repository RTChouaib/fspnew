import { db } from '@/lib/db';

// Hit this once after every deploy to confirm the database and required
// config are actually wired up correctly, instead of discovering a problem
// three steps deep in the checkout funnel. Not linked anywhere in the UI —
// visit it directly at /api/health.
export async function GET() {
  const checks: Record<string, string> = {};

  try {
    await db.user.count();
    checks.database = 'ok';
  } catch (err) {
    checks.database = `FAILED: ${err instanceof Error ? err.message : String(err)}`;
  }

  const requiredEnvVars = [
    'DATABASE_URL',
    'PAYMENT_PROVIDER_KEY',
    'PAYMENT_WEBHOOK_SECRET',
    'PRICE_WEEKLY',
    'PRICE_MONTHLY',
    'PRICE_QUARTERLY',
    'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN',
    'NEXT_PUBLIC_PRICE_WEEKLY',
    'NEXT_PUBLIC_PRICE_MONTHLY',
    'NEXT_PUBLIC_PRICE_QUARTERLY',
  ];
  for (const name of requiredEnvVars) {
    checks[`env:${name}`] = process.env[name] ? 'set' : 'MISSING';
  }

  const allOk = Object.values(checks).every((v) => v === 'ok' || v === 'set');

  return Response.json({ healthy: allOk, checks }, { status: allOk ? 200 : 500 });
}
