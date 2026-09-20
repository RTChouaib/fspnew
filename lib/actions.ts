'use server';

import { redirect } from 'next/navigation';
import { getOrCreateUser, getSubscription, recordAnswer, saveTestResult } from '@/lib/progress';
import { getCurrentUserId, setSession, clearSession } from '@/lib/session';
import { db } from '@/lib/db';
import { createSession } from '@/lib/simulation';

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

export async function startCaseSession(caseId: string) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/pricing?reason=auth');

  const caseRecord = await db.clinicalCase.findUnique({
    where: { id: caseId, isPublished: true },
    select: { id: true, openingStatement: true },
  });
  if (!caseRecord) throw new Error('Case not found or not published');

  const session = await createSession(userId, caseRecord.id, caseRecord.openingStatement);
  redirect(`/simulation/${session.id}`);
}
