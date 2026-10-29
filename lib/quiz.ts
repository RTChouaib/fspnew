import type { Term } from '@/data/terms';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function randomTerms(terms: Term[], n: number, excludeIds: string[] = []): Term[] {
  const pool = terms.filter((t) => !excludeIds.includes(t.id));
  return shuffle(pool).slice(0, n);
}

export type QuestionMode = 'medToPatient' | 'patToMed' | 'context';

export interface Question {
  termId: string;
  mode: QuestionMode;
  prompt: string;
  kicker: string;
  options: string[];
  correct: string;
  /** Short explanation shown after answering (from the term data). */
  explanation: string;
  /** Category of the term, used for "weak categories" without shipping the whole dataset to the client. */
  category: string;
}

/** Picks up to `count` distractors, never repeating the correct answer or each other. */
function pickDistractors(pool: Term[], pick: (t: Term) => string, correct: string, count = 3): string[] {
  const seen = new Set<string>([correct]);
  const out: string[] = [];
  for (const t of shuffle(pool)) {
    const value = pick(t);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length === count) break;
  }
  return out;
}

export function buildQuestion(term: Term, mode: QuestionMode, allTerms: Term[]): Question {
  const others = allTerms.filter((t) => t.id !== term.id);
  const base = { termId: term.id, mode, explanation: term.explanation, category: term.category };

  if (mode === 'medToPatient') {
    const correct = term.patientTerms[0];
    const distractors = pickDistractors(others, (t) => t.patientTerms[0], correct);
    return {
      ...base,
      prompt: term.medicalTerm,
      kicker: 'Fachbegriff → Patientensprache',
      options: shuffle([correct, ...distractors]),
      correct,
    };
  }

  if (mode === 'patToMed') {
    const correct = term.medicalTerm;
    const distractors = pickDistractors(others, (t) => t.medicalTerm, correct);
    return {
      ...base,
      prompt: term.patientTerms[0],
      kicker: 'Patientensprache → Fachbegriff',
      options: shuffle([correct, ...distractors]),
      correct,
    };
  }

  // context: prefer distractors from the same category so the question is not trivial
  const correct = term.medicalTerm;
  const sameCategory = pickDistractors(
    others.filter((t) => t.category === term.category),
    (t) => t.medicalTerm,
    correct
  );
  const distractors = sameCategory.length === 3 ? sameCategory : pickDistractors(others, (t) => t.medicalTerm, correct);
  return {
    ...base,
    prompt: term.exampleDoctorQuestion,
    kicker: 'FSP-Situation — welcher Fachbegriff passt?',
    options: shuffle([correct, ...distractors]),
    correct,
  };
}
