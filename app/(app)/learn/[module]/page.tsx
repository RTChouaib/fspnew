import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/requireUser';
import { getModuleProgress, LEARNING_MODULES, termsForModule } from '@/lib/learning';
import { getProgressMap } from '@/lib/progress';
import { AppIcon } from '@/components/AppIcon';

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: id } = await params;
  const learningModule = LEARNING_MODULES.find((m) => m.id === id);
  if (!learningModule) notFound();
  const userId = await requireUser();
  const [progress, stats] = await Promise.all([getProgressMap(userId), getModuleProgress(userId, learningModule)]);
  const terms = termsForModule(learningModule);
  const subcategories = [...new Set(terms.map((t) => t.subcategory))];
  return (
    <>
      <Link href="/learn" className="back-link">
        ← Lernplan
      </Link>
      <div className="page-header learningModule-page-header">
        <div>
          <div className="page-kicker">Modul {learningModule.id}</div>
          <h1 className="page-title">{learningModule.title}</h1>
          <p className="page-subtitle">{learningModule.description}</p>
        </div>
        <Link href="/practice" className="app-btn app-btn-primary">
          Modul üben <AppIcon name="arrow" size={16} />
        </Link>
      </div>
      <section className="app-card learningModule-hero">
        <div>
          <div className="learn-overline">FORTSCHRITT</div>
          <strong>
            {stats.learned} / {stats.terms} Begriffe sicher
          </strong>
          <div className="app-progress">
            <span style={{ width: `${stats.pct}%` }} />
          </div>
        </div>
        <div className="learningModule-hero-number">{stats.pct}%</div>
      </section>
      <div className="learningModule-subcats">
        {subcategories.map((sub) => (
          <span key={sub}>{sub}</span>
        ))}
      </div>
      <div className="section-heading-row" style={{ marginTop: 28 }}>
        <div>
          <div className="section-title-app">Lerninhalte</div>
          <p className="small-muted">Jeder Begriff enthält Fachsprache, Patientensprache, Arztfrage und Kontext.</p>
        </div>
      </div>
      <div className="learningModule-term-list">
        {terms.map((t) => {
          const p = progress[t.id];
          const status = p?.confidence >= 3 ? 'Sicher' : p ? 'In Arbeit' : 'Neu';
          return (
            <Link
              href={`/term/${t.id}?module=${learningModule.id}`}
              key={t.id}
              className="learningModule-term app-card"
            >
              <div>
                <div className="learningModule-term-name">{t.medicalTerm}</div>
                <div className="learningModule-term-patient">{t.patientTerms.join(' / ')}</div>
              </div>
              <div className="learningModule-term-context">
                <span>{t.subcategory}</span>
                <span
                  className={`learningModule-status ${status === 'Sicher' ? 'is-done' : status === 'In Arbeit' ? 'is-progress' : ''}`}
                >
                  {status}
                </span>
              </div>
              <AppIcon name="chevron" size={16} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
