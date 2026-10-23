// Fails loudly and immediately with a clear message when required
// configuration is missing, instead of surfacing as a confusing downstream
// error (a mysterious Prisma/payment-provider failure three layers deep). Call the
// relevant function from any module that depends on that config, as early
// as possible (module load time, not inside a request handler).

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local (or your ` +
        `Vercel/host environment settings) — see .env.example for the full list.`
    );
  }
  return value;
}

export function assertPolarEnv() {
  requireEnv('POLAR_ACCESS_TOKEN');
  requireEnv('POLAR_WEBHOOK_SECRET');
  requireEnv('POLAR_PRODUCT_WEEKLY');
  requireEnv('POLAR_PRODUCT_MONTHLY');
  requireEnv('POLAR_PRODUCT_QUARTERLY');
}

// Set POLAR_SERVER=sandbox to use sandbox-api.polar.sh (sandbox tokens/products
// do NOT work against production and vice versa).
export function polarApiBase() {
  return process.env.POLAR_SERVER === 'sandbox' ? 'https://sandbox-api.polar.sh' : 'https://api.polar.sh';
}

// Public site URL with a scheme and no trailing slash, even if NEXT_PUBLIC_APP_URL
// was entered as just "fsp.by-rtc.com".
export function appBaseUrl() {
  let url = (process.env.NEXT_PUBLIC_APP_URL || '').trim() || 'https://fsp.by-rtc.com';
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url.replace(/\/+$/, '');
}

export function assertDatabaseEnv() {
  requireEnv('DATABASE_URL');
}

export function assertAIEnv() {
  requireEnv('DEEPSEEK_API_KEY');
}
