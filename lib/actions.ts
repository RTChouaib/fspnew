'use server';

import { getOrCreateUser, getSubscription, recordAnswer, saveTestResult } from '@/lib/progress';
import { getCurrentUserId, setSession, clearSession } from '@/lib/session';

export async function startCheckoutSession(email: string) {
  const user = await getOrCreateUser(email);
  await setSession(user.id, user.email);
  const subscription = await getSubscription(user.id);
  return { userId: user.id, email: user.email, alreadyActive: subscription?.status === 'active' };
}

export async function recordAnswerAction(termId: string, correct: boolean) {
  const userId = await getCurrentUserId();
  if (!userId) return; // demo mode (logged-out) never persists progress server-side
  await recordAnswer(userId, termId, correct);
}

export async function saveTestResultAction(result: {
  score: number;
  total: number;
  weakCategories: string[];
  wrongTermIds: string[];
}) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  await saveTestResult(userId, result);
}

export async function logout() {
  await clearSession();
}
