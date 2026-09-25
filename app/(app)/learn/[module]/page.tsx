import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getModuleProgress, LEARNING_MODULES, termsForModule } from '@/lib/learning';
import { getProgressMap } from '@/lib/progress';
import { AppIcon } from '@/components/AppIcon';

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: id } = await params;
  const module = LEARNING_MODULES.find((m) => m.id === id);
  if (!module) notFound();
  const userId = (await getCurrentUserId())!;
  const [progress, stats] = await Promise.all([getProgressMap(userId), getModuleProgress(userId, module)]);
  const terms = termsForModule(module);
  const subcategories = [...new Set(terms.map((t) => t.subcategory))];
  return <>
    <Link href="/learn" className="back-link">← Lernplan</Link>
    <div className="page-header module-page-header"><div><div className="page-kicker">Modul {module.id}</div><h1 className="page-title">{module.title}</h1><p className="page-subtitle">{module.description}</p></div><Link href="/practice" className="app-btn app-btn-primary">Modul üben <AppIcon name="arrow" size={16}/></Link></div>
    <section className="app-card module-hero"><div><div className="learn-overline">FORTSCHRITT</div><strong>{stats.learned} / {stats.terms} Begriffe sicher</strong><div className="app-progress"><span style={{width:`${stats.pct}%`}}/></div></div><div className="module-hero-number">{stats.pct}%</div></section>
    <div className="module-subcats">{subcategories.map((sub) => <span key={sub}>{sub}</span>)}</div>
    <div className="section-heading-row" style={{marginTop:28}}><div><div className="section-title-app">Lerninhalte</div><p className="small-muted">Jeder Begriff enthält Fachsprache, Patientensprache, Arztfrage und Kontext.</p></div></div>
    <div className="module-term-list">{terms.map((t) => { const p=progress[t.id]; const status=p?.confidence>=3?'Sicher':p?'In Arbeit':'Neu'; return <Link href={`/term/${t.id}`} key={t.id} className="module-term app-card"><div><div className="module-term-name">{t.medicalTerm}</div><div className="module-term-patient">{t.patientTerms.join(' / ')}</div></div><div className="module-term-context"><span>{t.subcategory}</span><span className={`module-status ${status==='Sicher'?'is-done':status==='In Arbeit'?'is-progress':''}`}>{status}</span></div><AppIcon name="chevron" size={16}/></Link> })}</div>
  </>;
}
