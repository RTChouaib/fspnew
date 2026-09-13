// Fails loudly and immediately with a clear message when required
// configuration is missing, instead of surfacing as a confusing downstream
// error (a mysterious Prisma/Paddle failure three layers deep). Call the
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

export function assertPaddleEnv() {
  requireEnv('PAYMENT_PROVIDER_KEY');
  requireEnv('PAYMENT_WEBHOOK_SECRET');
  requireEnv('PRICE_WEEKLY');
  requireEnv('PRICE_MONTHLY');
  requireEnv('PRICE_QUARTERLY');
}

export function assertDatabaseEnv() {
  requireEnv('DATABASE_URL');
}
