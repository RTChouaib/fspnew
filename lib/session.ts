import { cookies } from 'next/headers';
import { db } from './db';

const COOKIE_NAME = 'uid';
const EMAIL_COOKIE_NAME = 'user-email';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
};

export function reconcileUserSession({
  uid,
  email,
  userByEmail,
}: {
  uid: string | null;
  email: string | null;
  userByEmail: Record<string, string>;
}): string | null {
  if (!email) return uid ?? null;
  const userIdFromEmail = userByEmail[email];
  return userIdFromEmail ?? uid ?? null;
}

// Next.js only allows cookie writes from a Server Action or Route Handler —
// never during a Server Component's render, even though cookies() is
// readable everywhere. getCurrentUserId() is called from both kinds of
// places (plain page/layout components AND actions/handlers). The writes
// below are a self-healing convenience (fixing a stale cookie once we've
// already resolved the correct user from the DB), not something the
// identity check depends on, so it's safe to just skip the write — and
// keep the correct return value — when the runtime forbids it.
function tryWriteCookie(fn: () => void) {
  try {
    fn();
  } catch {
    // Called from a Server Component render — cookie writes aren't
    // permitted here. The resolved user id is still correct; the cookie
    // will simply get reconciled next time this runs from an action or
    // route handler instead.
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  const uid = store.get(COOKIE_NAME)?.value ?? null;
  const email = store.get(EMAIL_COOKIE_NAME)?.value ?? null;

  if (!uid && !email) return null;

  // Never trust a client-supplied uid by itself. Verify it against the DB.
  if (uid) {
    const user = await db.user.findUnique({ where: { id: uid } });
    if (user) {
      if (email && email !== user.email) {
        tryWriteCookie(() => store.set(EMAIL_COOKIE_NAME, user.email, cookieOptions));
      }
      return user.id;
    }
    tryWriteCookie(() => store.delete(COOKIE_NAME));
  }

  if (email) {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      tryWriteCookie(() => store.set(COOKIE_NAME, user.id, cookieOptions));
      tryWriteCookie(() => store.set(EMAIL_COOKIE_NAME, user.email, cookieOptions));
      return user.id;
    }
    tryWriteCookie(() => store.delete(EMAIL_COOKIE_NAME));
  }

  return null;
}

export async function setSession(userId: string, email?: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, cookieOptions);

  if (email) {
    store.set(EMAIL_COOKIE_NAME, email, cookieOptions);
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(EMAIL_COOKIE_NAME);
}
