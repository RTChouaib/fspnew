import { db } from './db';

export async function getPublishedCases() {
  return db.clinicalCase.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true, title: true, specialty: true, difficulty: true, estimatedMinutes: true, patientName: true, patientAge: true, patientSex: true },
    orderBy: { difficulty: 'asc' },
  });
}

export async function getCaseSummaryBySlug(slug: string) {
  return db.clinicalCase.findUnique({
    where: { slug, isPublished: true },
    select: { id: true, slug: true, title: true, specialty: true, difficulty: true, estimatedMinutes: true, patientName: true, patientAge: true, patientSex: true, openingStatement: true },
  });
}

export async function getCaseForSimulation(id: string) {
  return db.clinicalCase.findUnique({
    where: { id },
    select: { id: true, title: true, patientName: true, patientAge: true, patientSex: true, openingStatement: true, caseData: true },
  });
}

export async function getCaseWithRubric(id: string) {
  return db.clinicalCase.findUnique({
    where: { id },
    select: { id: true, title: true, caseData: true, rubric: true },
  });
}

export async function getRecommendedCase(userId: string) {
  const inProgress = await db.caseSession.findFirst({
    where: { userId, status: 'in_progress' },
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      case: { select: { id: true, slug: true, title: true, specialty: true, estimatedMinutes: true, patientName: true } },
    },
  });
  if (inProgress) return { ...inProgress.case, sessionId: inProgress.id, resume: true };

  const attempted = await db.caseSession.findMany({
    where: { userId },
    select: { caseId: true },
    distinct: ['caseId'],
  });
  const attemptedIds = attempted.map((s) => s.caseId);

  const select = { id: true, slug: true, title: true, specialty: true, estimatedMinutes: true, patientName: true } as const;
  const unattempted = await db.clinicalCase.findFirst({
    where: { isPublished: true, id: { notIn: attemptedIds } },
    orderBy: { difficulty: 'asc' },
    select,
  });
  if (unattempted) return { ...unattempted, sessionId: null, resume: false };

  const fallback = await db.clinicalCase.findFirst({ where: { isPublished: true }, orderBy: { difficulty: 'asc' }, select });
  return fallback ? { ...fallback, sessionId: null, resume: false } : null;
}
