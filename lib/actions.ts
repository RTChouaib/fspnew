'use server';

import { redirect } from 'next/navigation';
import { getOrCreateUser, getSubscription, recordAnswer, saveTestResult } from '@/lib/progress';
import { getCurrentUserId, setSession, clearSession } from '@/lib/session';
import { db } from '@/lib/db';
import { createSession } from '@/lib/simulation';
import { updateStudySession } from '@/lib/learning';
import { canAccess } from '@/lib/progress';
import { trackEvent } from '@/lib/analytics';

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
  const subscription = await getSubscription(userId);
  if (!canAccess(subscription, 'full')) redirect('/pricing?reason=paid');

  const existing = await db.caseSession.findFirst({ where: { userId, caseId, status: 'in_progress' } });
  if (existing) redirect(`/simulation/${existing.id}`);

  const caseRecord = await db.clinicalCase.findUnique({
    where: { id: caseId, isPublished: true },
    select: { id: true, openingStatement: true },
  });
  if (!caseRecord) throw new Error('Case not found or not published');

  const session = await createSession(userId, caseRecord.id, caseRecord.openingStatement);
  await trackEvent('case_started', userId, { caseId: caseRecord.id });
  redirect(`/simulation/${session.id}`);
}


export async function saveStudySessionProgress(input: {
  sessionId: string;
  currentStep: number;
  completedSteps: string[];
  totalSteps: number;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const result = await updateStudySession(userId, input.sessionId, input.currentStep, input.completedSteps, input.totalSteps);
  if (result) await trackEvent(input.completedSteps.length ? 'study_step_completed' : 'study_started', userId, { sessionId: input.sessionId, currentStep: input.currentStep });
  return result;
}

export async function deleteAccountAction() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  const subscription = await getSubscription(userId);
  if (subscription && (subscription.status === 'active' || subscription.status === 'trial')) {
    throw new Error('Bitte kündige dein Abo und warte bis zum Ende der laufenden Periode, bevor du dein Konto löschst.');
  }
  await db.user.delete({ where: { id: userId } });
  await clearSession();
  redirect('/?accountDeleted=1');
}
