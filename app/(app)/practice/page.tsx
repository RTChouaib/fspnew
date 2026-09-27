import { getCurrentUserId } from '@/lib/session';
import { getDueTermIds, getMistakeTermIds, getProgressMap } from '@/lib/progress';
import { TERMS, termById, type Term } from '@/data/terms';
import { PracticeSession } from './PracticeSession';
import { getRecommendedCase } from '@/lib/cases';

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; category?: string; studyStep?: string }>;
}) {
  const { mode, category, studyStep } = await searchParams;
  const userId = (await getCurrentUserId())!;
  const recommendedCase = mode === 'new' && studyStep ? await getRecommendedCase(userId) : null;

  let queue: Term[] = [];
  if (mode === 'mistakes') {
    const ids = await getMistakeTermIds(userId);
    queue = ids.map((id) => termById(id)).filter((t): t is Term => !!t);
  } else if (mode === 'new') {
    const progress = await getProgressMap(userId);
    queue = TERMS.filter((t) => (!category || t.category === category) && !progress[t.id]).slice(0, 8);
  } else if (mode === 'review') {
    const due = await getDueTermIds(userId, TERMS.map((t) => t.id));
    queue = due.map((id) => termById(id)).filter((t): t is Term => !!t).filter((t) => !category || t.category === category).slice(0, 12);
  } else {
    const ids = (await getDueTermIds(userId, TERMS.map((t) => t.id))).slice(0, 10);
    queue = ids.map((id) => termById(id)).filter((t): t is Term => !!t);
  }

  const nextHref = mode === 'review' ? (category ? `/practice?mode=new&category=${encodeURIComponent(category)}&studyStep=learn` : '/practice?mode=new&studyStep=learn') : mode === 'new' ? (recommendedCase ? `/cases/${recommendedCase.slug}?from=study&studyStep=conversation` : '/cases') : mode === 'mistakes' ? '/study' : '/dashboard';
  const nextLabel = mode === 'review' ? 'Weiter: Neu lernen' : mode === 'new' ? 'Weiter: Patientengespräch' : mode === 'mistakes' ? 'Einheit abschließen' : 'Zum Dashboard';
  const heading = mode === 'new' ? 'Neue Begriffe' : mode === 'mistakes' ? 'Fehler wiederholen' : 'Aktive Wiederholung';

  return <PracticeSession initialQueue={queue} mode={mode} heading={heading} nextHref={nextHref} nextLabel={nextLabel} studyStep={studyStep} />;
}
