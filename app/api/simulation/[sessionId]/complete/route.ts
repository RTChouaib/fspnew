import { getCurrentUserId } from '@/lib/session';
import { db } from '@/lib/db';
import { getSessionForUser, completeSession, updateUserSkills } from '@/lib/simulation';
import { getCaseWithRubric } from '@/lib/cases';
import { evaluatePatientSimulation } from '@/lib/ai/evaluator';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import type { TranscriptEntry } from '@/lib/ai/patient';
import { getSubscription, canAccess } from '@/lib/progress';
import { queueEvaluationWeaknesses } from '@/lib/simulation';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const userId = await getCurrentUserId();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const subscription = await getSubscription(userId);
  if (!canAccess(subscription, 'full')) return new Response('Subscription required', { status: 402 });

  if (!checkRateLimit(`sim-complete:${userId}`)) {
    return new Response('Zu viele Anfragen — bitte kurz warten.', { status: 429 });
  }

  const session = await getSessionForUser(sessionId, userId);
  if (!session) return new Response('Not found', { status: 404 });

  if (session.status === 'completed') return Response.json({ ok: true, alreadyCompleted: true });

  const transcript = session.transcript as unknown as TranscriptEntry[];
  if (transcript.filter((t) => t.role === 'doctor').length === 0) {
    return new Response('Stelle zuerst mindestens eine Frage.', { status: 400 });
  }

  const caseRecord = await getCaseWithRubric(session.caseId);
  if (!caseRecord) return new Response('Case not found', { status: 404 });

  // Claim the session before the expensive AI call so double submits cannot
  // trigger two evaluations. If evaluation fails, the session is released.
  const claimed = await db.caseSession.updateMany({ where: { id: sessionId, userId, status: 'in_progress' }, data: { status: 'evaluating' } });
  if (claimed.count === 0) return Response.json({ ok: true, alreadyEvaluating: true });

  let evaluation;
  try {
    evaluation = await evaluatePatientSimulation({
      caseTitle: caseRecord.title,
      caseData: caseRecord.caseData as Record<string, unknown>,
      rubric: caseRecord.rubric as Record<string, unknown>,
      transcript,
    });
  } catch (err) {
    await db.caseSession.updateMany({ where: { id: sessionId, userId, status: 'evaluating' }, data: { status: 'in_progress' } });
    console.error('[simulation/complete] evaluation failed', err);
    return new Response('Die Auswertung ist fehlgeschlagen. Bitte versuche es erneut.', {
      status: 502,
    });
  }

  const durationSeconds = Math.round((Date.now() - session.startedAt.getTime()) / 1000);
  const reviewTermIds = await queueEvaluationWeaknesses(userId, evaluation);
  await completeSession(sessionId, evaluation, durationSeconds, reviewTermIds);
  await updateUserSkills(userId, evaluation.skillResults);
  await trackEvent('case_evaluation_completed', userId, { sessionId, overallScore: evaluation.overallScore, reviewTermCount: reviewTermIds.length });

  return Response.json({ ok: true, reviewTermIds });
}
