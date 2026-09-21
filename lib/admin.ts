import { db } from './db';
import { getCurrentUserId } from './session';

/*
 * This file is the ONLY place manual (non-Paddle) subscription writes
 * happen. It intentionally does not touch lib/progress.ts, whose header
 * comment reserves subscription writes there for the signature-verified
 * Paddle webhook. Keeping this separate means:
 *   - a manual grant can never be mistaken for a real Paddle purchase
 *   - if a real Paddle webhook later arrives for the same user, it just
 *     overwrites this row via the normal upsert-by-userId behavior
 */

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function adminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminAllowlist().includes(email.trim().toLowerCase());
}

/**
 * Resolves the current session to an email, but ONLY if that email is on
 * the admin allowlist. Returns null for anyone else (including logged-out
 * visitors and ordinary paying customers) — safe to use both for page
 * gating and, critically, re-checked at the top of every admin server
 * action below, since actions can be invoked directly over the network.
 */
export async function getSessionAdminEmail(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user || !isAdminEmail(user.email)) return null;
  return user.email;
}

export async function listUsersForAdmin() {
  return db.user.findMany({
    include: { subscription: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function adminGrantAccess(rawEmail: string, days: number) {
  const admin = await getSessionAdminEmail();
  if (!admin) throw new Error('Not authorized.');

  const email = normalizeEmail(rawEmail);
  if (!email || !email.includes('@')) throw new Error('Ungültige E-Mail-Adresse.');
  if (!Number.isFinite(days) || days <= 0) throw new Error('Ungültige Anzahl Tage.');

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  await db.subscription.upsert({
    where: { userId: user.id },
    update: {
      status: 'active',
      plan: 'manual',
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
    create: {
      userId: user.id,
      status: 'active',
      plan: 'manual',
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
  });

  return { email };
}

export async function adminRevokeAccess(rawEmail: string) {
  const admin = await getSessionAdminEmail();
  if (!admin) throw new Error('Not authorized.');

  const email = normalizeEmail(rawEmail);
  const user = await db.user.findUnique({ where: { email }, include: { subscription: true } });
  if (!user || !user.subscription) return { email };

  await db.subscription.update({
    where: { userId: user.id },
    data: { status: 'expired' },
  });

  return { email };
}
