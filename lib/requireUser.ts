import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';

/**
 * Returns the signed-in user's id, or redirects to /login.
 * Use in authenticated pages instead of `(await getCurrentUserId())!`.
 * (The (app) layout already gates access; this removes the unsafe non-null assertion.)
 */
export async function requireUser(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  return userId;
}
