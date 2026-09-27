import { db } from './db';
import type { TranscriptEntry } from './ai/patient';
import type { Evaluation } from './ai/schemas';

export async function createSession(userId: string, caseId: string, openingStatement: string) {
  const initialTranscript: TranscriptEntry[] = [{ role: 'patient', content: openingStatement }];
  return db.caseSession.create({
    data: {
      userId,
      caseId,
      transcript: initialTranscript as object,
      messageCount: 1,
    },
  });
}

/**
 * The only way any route should read a session. Returns null if the
 * session doesn't exist OR belongs to someone else — callers should treat
 * both cases identically (404), never distinguish them in the response.
 */
export async function getSessionForUser(sessionId: string, userId: string) {
  const session = await db.caseSession.findUnique({
    where: { id: sessionId },
    include: {
      case: {
        select: {
          id: true,
          title: true,
          patientName: true,
          patientAge: true,
          patientSex: true,
          estimatedMinutes: true,
        },
      },
    },
  });
  if (!session || session.userId !== userId) return null;
  return session;
}

export async function appendTurn(
  sessionId: string,
  updatedTranscript: TranscriptEntry[]
) {
  return db.caseSession.update({
    where: { id: sessionId },
    data: {
      transcript: updatedTranscript as object,
      messageCount: updatedTranscript.length,
    },
  });
}

export async function completeSession(
  sessionId: string,
  evaluation: Evaluation,
  durationSeconds: number,
  reviewTermIds: string[] = []
) {
  return db.caseSession.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      durationSeconds,
      evaluation: evaluation as object,
      overallScore: evaluation.overallScore,
      anamnesisScore: evaluation.scores.anamnesis,
      languageScore: evaluation.scores.languageAccuracy,
      communicationScore: evaluation.scores.communication,
      reviewTermIds,
    },
  });
}

/** Exponential moving average so one bad/lucky case doesn't swing a skill wildly. */
export async function updateUserSkills(
  userId: string,
  skillResults: Evaluation['skillResults']
) {
  for (const skill of skillResults) {
    const existing = await db.userSkill.findUnique({
      where: { userId_skillKey: { userId, skillKey: skill.skillKey } },
    });
    const newScore = existing
      ? Math.round(existing.score * 0.7 + skill.score * 0.3)
      : skill.score;

    await db.userSkill.upsert({
      where: { userId_skillKey: { userId, skillKey: skill.skillKey } },
      update: {
        score: newScore,
        attempts: { increment: 1 },
        successes: { increment: skill.score >= 70 ? 1 : 0 },
        lastPracticed: new Date(),
      },
      create: {
        userId,
        skillKey: skill.skillKey,
        score: skill.score,
        attempts: 1,
        successes: skill.score >= 70 ? 1 : 0,
        lastPracticed: new Date(),
      },
    });
  }
}

/** Weakest skills first — for the dashboard's "Deine Schwachstellen" card.
 *  Only returns skills with at least one attempt (a fresh account has none). */
export async function getWeakestSkills(userId: string, limit = 4) {
  return db.userSkill.findMany({
    where: { userId },
    orderBy: { score: 'asc' },
    take: limit,
  });
}

/** Most recently completed simulations — for "Zuletzt trainiert". */
export async function getRecentSessions(userId: string, limit = 3) {
  return db.caseSession.findMany({
    where: { userId, status: 'completed' },
    orderBy: { completedAt: 'desc' },
    take: limit,
    include: { case: { select: { title: true } } },
  });
}

/** Average of the last 10 completed sessions' overall scores, or null if none yet. */
export async function getTrainingStandScore(userId: string): Promise<number | null> {
  const sessions = await db.caseSession.findMany({
    where: { userId, status: 'completed', overallScore: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 10,
    select: { overallScore: true },
  });
  if (sessions.length === 0) return null;
  const sum = sessions.reduce((s, x) => s + (x.overallScore ?? 0), 0);
  return Math.round(sum / sessions.length);
}

/** Convert evaluator feedback into reviewable existing terminology without inventing terms. */
export async function queueEvaluationWeaknesses(userId: string, evaluation: Evaluation) {
  const { TERMS } = await import('@/data/terms');
  const feedback = [
    ...evaluation.missingInformation,
    ...evaluation.strengths.filter(() => false),
    ...evaluation.languageCorrections.map((c) => `${c.original} ${c.better}`),
  ].join(' ').toLowerCase();

  const candidates = TERMS.map((term) => {
    const aliases = [
      term.medicalTerm,
      ...term.patientTerms,
      ...(term.synonyms ?? []),
      ...(term.relatedTerms ?? []),
      ...(term.commonMistakes ?? []),
      term.explanation,
    ].map((x) => x.toLowerCase());
    const hits = aliases.reduce((n, alias) => {
      const normalized = alias.replace(/[^a-zäöüß0-9 ]/gi, ' ').trim();
      if (!normalized || normalized.length < 4) return n;
      return feedback.includes(normalized) ? n + 1 : n;
    }, 0);
    return { termId: term.id, hits };
  }).filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, 8);

  if (!candidates.length) return [];
  await db.$transaction(
    candidates.map(({ termId }) => db.mistake.upsert({
      where: { userId_termId: { userId, termId } },
      update: {},
      create: { userId, termId },
    }))
  );
  return candidates.map((x) => x.termId);
}
