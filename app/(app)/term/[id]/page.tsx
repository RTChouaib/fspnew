import Link from 'next/link';
import { termById, TERMS } from '@/data/terms';
import { LEARNING_MODULES, termsForModule } from '@/lib/learning';

export default async function TermDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ module?: string }> }) {
  const { id } = await params;
  const { module: moduleId } = await searchParams;
  const t = termById(id);

  if (!t) return <div style={{ paddingTop: 60 }}>Begriff nicht gefunden.</div>;

  const module = moduleId ? LEARNING_MODULES.find((m) => m.id === moduleId) : undefined;
  const contextTerms = module ? termsForModule(module) : TERMS;
  const index = contextTerms.findIndex((x) => x.id === t.id);
  const previous = index > 0 ? contextTerms[index - 1] : null;
  const next = index >= 0 && index < contextTerms.length - 1 ? contextTerms[index + 1] : null;
  const backHref = module ? `/learn/${module.id}` : '/learn';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <Link href={backHref} className="app-btn app-btn-secondary">← {module ? module.title : 'Lernplan'}</Link>
        {index >= 0 && <span className="small-muted">Begriff {index + 1} / {contextTerms.length}</span>}
      </div>
      <div className="badge badge-cat">{t.category}{t.subcategory ? ` · ${t.subcategory}` : ''}</div>
      <h1 style={{ marginTop: 10 }}>{t.medicalTerm} <span className="small-muted">({t.article})</span></h1>
      <p><strong>Patientensprache:</strong> {t.patientTerms.join(' / ')}</p>
      <p><strong>Englisch:</strong> {t.englishMeaning}</p>
      <div className="card" style={{ margin: '16px 0' }}>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Patientensatz</div>
        <p style={{ margin: '4px 0 12px' }}>„{t.examplePatientSentence}&quot;</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Ärztliche Frage</div>
        <p style={{ margin: '4px 0 12px' }}>„{t.exampleDoctorQuestion}&quot;</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Arztbrief</div>
        <p style={{ margin: '4px 0 12px' }}>{t.exampleArztbriefSentence}</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Erklärung</div>
        <p style={{ margin: '4px 0 0' }}>{t.explanation}</p>
      </div>
      {t.commonMistakes.length > 0 && (
        <div className="locked-banner" style={{ background: 'var(--clay-tint)', borderColor: 'var(--clay)', color: 'var(--clay)' }}>
          <strong>Typischer Fehler:</strong> {t.commonMistakes.join(' ')}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
        {previous ? <Link href={`/term/${previous.id}${module ? `?module=${module.id}` : ''}`} className="app-btn app-btn-secondary">← Vorheriger Begriff</Link> : <span />}
        {next ? <Link href={`/term/${next.id}${module ? `?module=${module.id}` : ''}`} className="app-btn app-btn-primary">Nächster Begriff →</Link> : <Link href={backHref} className="app-btn app-btn-primary">Lernplan abschließen →</Link>}
      </div>
    </div>
  );
}
