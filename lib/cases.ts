import { db } from './db';

// Safe for the case library — no caseData, no rubric.
export async function getPublishedCases() {
  return db.clinicalCase.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      specialty: true,
      difficulty: true,
      estimatedMinutes: true,
      patientName: true,
      patientAge: true,
      patientSex: true,
    },
    orderBy: { difficulty: 'asc' },
  });
}

// Safe for the case detail/preview page — adds openingStatement, still no
// caseData, no rubric.
export async function getCaseSummaryBySlug(slug: string) {
  return db.clinicalCase.findUnique({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      specialty: true,
      difficulty: true,
      estimatedMinutes: true,
      patientName: true,
      patientAge: true,
      patientSex: true,
      openingStatement: true,
    },
  });
}

/**
 * Server-only. Includes caseData (the patient's own facts — legitimate for
 * the patient persona to "know"). Call this ONLY from the message API route
 * when building the patient's context — never return this object to a
 * client component, never spread it into a response.
 */
export async function getCaseForSimulation(id: string) {
  return db.clinicalCase.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      patientName: true,
      patientAge: true,
      patientSex: true,
      openingStatement: true,
      caseData: true,
    },
  });
}

/**
 * Server-only. Includes the rubric — the actual secret. Call this ONLY from
 * the complete/evaluate API route, after the simulation has ended.
 */
export async function getCaseWithRubric(id: string) {
  return db.clinicalCase.findUnique({
    where: { id },
    select: { id: true, title: true, caseData: true, rubric: true },
  });
}

/**
 * One suggestion for "Heute" on the dashboard: prefer a case the user
 * hasn't attempted yet (easiest difficulty first); once everything has been
 * attempted at least once, fall back to the easiest published case.
 */
export async function getRecommendedCase(userId: string) {
  const attempted = await db.caseSession.findMany({
    where: { userId },
    select: { caseId: true },
    distinct: ['caseId'],
  });
  const attemptedIds = attempted.map((s) => s.caseId);

  const unattempted = await db.clinicalCase.findFirst({
    where: { isPublished: true, id: { notIn: attemptedIds } },
    orderBy: { difficulty: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      specialty: true,
      estimatedMinutes: true,
      patientName: true,
    },
  });
  if (unattempted) return unattempted;

  return db.clinicalCase.findFirst({
    where: { isPublished: true },
    orderBy: { difficulty: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      specialty: true,
      estimatedMinutes: true,
      patientName: true,
    },
  });
}
