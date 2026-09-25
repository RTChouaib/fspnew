import { TERMS, type Term } from '@/data/terms';
import { getDueTermIds, getMistakeTermIds, getProgressMap } from '@/lib/progress';
import { getWeakestSkills } from '@/lib/simulation';

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  icon: 'book' | 'stethoscope' | 'clipboard' | 'target';
};

export const LEARNING_MODULES: LearningModule[] = [
  { id: 'grundlagen', title: 'Grundlagen & Anamnese', description: 'Baue die Sprache für strukturierte Anamnesen auf.', categories: ['Anamnese', 'Allgemeine Symptome'], icon: 'book' },
  { id: 'herz', title: 'Herz & Kreislauf', description: 'Leitsymptome, Diagnosen und Patientensprache rund ums Herz.', categories: ['Herz & Kreislauf'], icon: 'stethoscope' },
  { id: 'atmung', title: 'Atmung', description: 'Atemwegsbegriffe, Befunde und typische Gesprächssituationen.', categories: ['Atmung'], icon: 'stethoscope' },
  { id: 'gastro', title: 'Gastroenterologie', description: 'Bauchbeschwerden, Alarmsymptome und relevante Diagnosen.', categories: ['Gastroenterologie'], icon: 'stethoscope' },
  { id: 'neuro', title: 'Neurologie', description: 'Neurologische Leitsymptome und Notfallbegriffe sicher anwenden.', categories: ['Neurologie'], icon: 'stethoscope' },
  { id: 'uro', title: 'Urologie', description: 'Typische urologische Beschwerden und Fachbegriffe.', categories: ['Urologie'], icon: 'stethoscope' },
  { id: 'gyn', title: 'Gynäkologie', description: 'Gynäkologische Anamnese und zentrale Fachsprache.', categories: ['Gynäkologie'], icon: 'stethoscope' },
  { id: 'ortho', title: 'Orthopädie', description: 'Schmerz, Trauma und klinische Untersuchungsbefunde.', categories: ['Orthopädie'], icon: 'stethoscope' },
  { id: 'endo', title: 'Endokrinologie', description: 'Diabetes, Schilddrüse und Stoffwechselbegriffe.', categories: ['Endokrinologie'], icon: 'stethoscope' },
  { id: 'infekt', title: 'Infektiologie', description: 'Infektiöse Leitsymptome, Diagnosen und Anamnese.', categories: ['Infektiologie'], icon: 'stethoscope' },
  { id: 'notfall', title: 'Notfallmedizin', description: 'Vitalfunktionen, Notfälle und erste Maßnahmen.', categories: ['Notfallmedizin'], icon: 'stethoscope' },
  { id: 'diagnostik', title: 'Diagnostik', description: 'Bildgebung, Labor und Funktionsdiagnostik.', categories: ['Diagnostik'], icon: 'clipboard' },
  { id: 'medikamente', title: 'Medikamente', description: 'Wirkstoffgruppen und sichere Kommunikation über Medikamente.', categories: ['Medikamente'], icon: 'book' },
  { id: 'eingriffe', title: 'Untersuchungen & Eingriffe', description: 'Prozeduren und Endoskopie patientengerecht erklären.', categories: ['Untersuchungen & Eingriffe'], icon: 'clipboard' },
];

export function termsForModule(module: LearningModule): Term[] {
  return TERMS.filter((term) => module.categories.includes(term.category));
}

export async function getModuleProgress(userId: string, module: LearningModule) {
  const progress = await getProgressMap(userId);
  const terms = termsForModule(module);
  const learned = terms.filter((t) => progress[t.id]?.confidence >= 3).length;
  const mastered = terms.filter((t) => progress[t.id]?.confidence >= 5).length;
  const pct = terms.length ? Math.round((learned / terms.length) * 100) : 0;
  return { terms: terms.length, learned, mastered, pct };
}

export async function getLearningOverview(userId: string) {
  const [progress, mistakes, dueIds, weakSkills] = await Promise.all([
    getProgressMap(userId),
    getMistakeTermIds(userId),
    getDueTermIds(userId, TERMS.map((t) => t.id)),
    getWeakestSkills(userId, 5),
  ]);
  const total = TERMS.length;
  const learned = Object.values(progress).filter((p) => p.confidence >= 3).length;
  return {
    total,
    learned,
    learnedPct: total ? Math.round((learned / total) * 100) : 0,
    dueCount: dueIds.length,
    mistakeCount: mistakes.length,
    weakSkills,
  };
}

export async function buildStudyPlan(userId: string) {
  const [progress, dueIds, mistakeIds, weakSkills] = await Promise.all([
    getProgressMap(userId),
    getDueTermIds(userId, TERMS.map((t) => t.id)),
    getMistakeTermIds(userId),
    getWeakestSkills(userId, 3),
  ]);

  const weakSkillKeys = new Set(weakSkills.map((s) => s.skillKey.toLowerCase()));
  const candidateTerms = dueIds.map((id) => TERMS.find((t) => t.id === id)).filter(Boolean) as Term[];
  const focusTerm = candidateTerms.find((t) => weakSkillKeys.has('terminology') || weakSkillKeys.has('patient_language'))
    ?? candidateTerms[0]
    ?? TERMS.find((t) => !progress[t.id])
    ?? TERMS[0];

  const focusCategory = focusTerm.category;
  const focusTerms = TERMS.filter((t) => t.category === focusCategory);
  const newTerms = focusTerms.filter((t) => !progress[t.id]).slice(0, 8);
  const reviewTerms = candidateTerms.filter((t) => t.category === focusCategory).slice(0, 12);
  const mistakes = mistakeIds.map((id) => TERMS.find((t) => t.id === id)).filter(Boolean) as Term[];

  return {
    focusCategory,
    focusTerm,
    newTerms,
    reviewTerms: reviewTerms.length ? reviewTerms : candidateTerms.slice(0, 12),
    mistakes: mistakes.slice(0, 6),
    weakSkills,
    estimatedMinutes: Math.min(40, 6 + newTerms.length + 5 + 12 + Math.min(3, mistakes.length)),
  };
}
