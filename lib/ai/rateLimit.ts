/**
 * Best-effort in-memory rate limiter for AI-backed endpoints.
 *
 * HONEST LIMITATION: this works reliably on a single long-running Node
 * process (local dev, a traditional always-on host). On Vercel's
 * serverless functions, memory is NOT guaranteed to persist or be shared
 * across invocations — a burst of requests can hit different instances,
 * each with its own empty bucket, so this is a soft/best-effort limit
 * there, not a hard guarantee.
 *
 * For a real guarantee in production, replace this with a shared store —
 * Upstash Redis has a free tier and is the standard pairing with Vercel
 * for exactly this. Swap the implementation here; callers don't change.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);
  return true;
}
