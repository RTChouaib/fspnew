// Skill keys come from two places: the AI evaluator (which uses the term category names directly,
// e.g. "Herz & Kreislauf") and older records that use snake_case keys. Map them to readable German.
const LEGACY_LABELS: Record<string, string> = {
  anamnesis: 'Anamnese',
  anamnese: 'Anamnese',
  patient_language: 'Patientensprache',
  patientlanguage: 'Patientensprache',
  terminology: 'Fachbegriffe',
  medical_terminology: 'Fachbegriffe',
  communication: 'Kommunikation',
  completeness: 'Vollständigkeit',
  language_accuracy: 'Sprachliche Genauigkeit',
  languageaccuracy: 'Sprachliche Genauigkeit',
};

export function skillLabel(key: string): string {
  const normalized = key.trim();
  const legacy = LEGACY_LABELS[normalized.toLowerCase()];
  if (legacy) return legacy;
  // Already a readable category name (or something unexpected): show it with underscores removed.
  return normalized.replace(/_/g, ' ');
}
