import { getCurrentUserId } from '@/lib/session';
import { getSessionForUser, completeSession, updateUserSkills } from '@/lib/simulation';
import { getCaseWithRubric } from '@/lib/cases';
import { evaluatePatientSimulation } from '@/lib/ai/evaluator';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import type { TranscriptEntry } from '@/lib/ai/patient';

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const userId = await getCurrentUserId();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  if (!checkRateLimit(`sim-complete:${userId}`)) {
    return new Response('Zu viele Anfragen — bitte kurz warten.', { status: 429 });
  }

  const session = await getSessionForUser(sessionId, userId);
  if (!session) return new Response('Not found', { status: 404 });

  // Idempotent: never re-run (and re-bill) an evaluation for an already
  // completed session, even if the client double-submits.
  if (session.status === 'completed') {
    return Response.json({ ok: true, alreadyCompleted: true });
  }

  const transcript = session.transcript as unknown as TranscriptEntry[];
  if (transcript.filter((t) => t.role === 'doctor').length === 0) {
    return new Response('Stelle zuerst mindestens eine Frage.', { status: 400 });
  }

  const caseRecord = await getCaseWithRubric(session.caseId);
  if (!caseRecord) return new Response('Case not found', { status: 404 });

  let evaluation;
  try {
    evaluation = await evaluatePatientSimulation({
      caseTitle: caseRecord.title,
      caseData: caseRecord.caseData as Record<string, unknown>,
      rubric: caseRecord.rubric as Record<string, unknown>,
      transcript,
    });
  } catch (err) {
    console.error('[simulation/complete] evaluation failed', err);
    return new Response('Die Auswertung ist fehlgeschlagen. Bitte versuche es erneut.', {
      status: 502,
    });
  }

  const durationSeconds = Math.round((Date.now() - session.startedAt.getTime()) / 1000);
  await completeSession(sessionId, evaluation, durationSeconds);
  await updateUserSkills(userId, evaluation.skillResults);

  return Response.json({ ok: true });
}
