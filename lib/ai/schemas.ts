import { z } from 'zod';

// ============================================================
// Shared limits. Enforced in patient.ts/evaluator.ts (input side)
// and by the API route layer (per-session/per-user request frequency —
// that needs session context these pure functions don't have).
// ============================================================
export const MAX_USER_MESSAGE_LENGTH = 1000;
export const MAX_TRANSCRIPT_MESSAGES = 40; // 20 doctor turns + 20 patient turns

// ============================================================
// Patient response — what the "patient" AI returns for one turn.
// ============================================================
export const PatientResponseSchema = z.object({
  message: z.string().min(1).max(2000),
  emotion: z.enum(['neutral', 'worried', 'pain', 'relieved', 'frustrated', 'scared', 'calm']),
  informationRevealed: z.array(z.string().max(200)).max(20),
});
export type PatientResponse = z.infer<typeof PatientResponseSchema>;

// ============================================================
// Evaluation — the structured assessment after a session completes.
// ============================================================
const ScoreSchema = z.number().min(0).max(100);

export const LanguageCorrectionSchema = z.object({
  original: z.string().max(500),
  better: z.string().max(500),
  reason: z.string().max(500),
});

export const SkillResultSchema = z.object({
  skillKey: z.string().max(100),
  score: ScoreSchema,
  evidence: z.string().max(500),
});

export const EvaluationSchema = z.object({
  overallScore: ScoreSchema,
  scores: z.object({
    anamnesis: ScoreSchema,
    communication: ScoreSchema,
    patientLanguage: ScoreSchema,
    medicalTerminology: ScoreSchema,
    completeness: ScoreSchema,
    languageAccuracy: ScoreSchema,
  }),
  strengths: z.array(z.string().max(300)).max(10),
  missingInformation: z.array(z.string().max(300)).max(15),
  languageCorrections: z.array(LanguageCorrectionSchema).max(15),
  skillResults: z.array(SkillResultSchema).max(10),
  summary: z.string().max(1500),
});
export type Evaluation = z.infer<typeof EvaluationSchema>;
