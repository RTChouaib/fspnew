import Link from 'next/link';
import { TERMS, CATEGORIES, termById } from '@/data/terms';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';

function Faq() {
  const items: [string, string][] = [
    ['Was ist die FSP?', 'Die Fachsprachprüfung (FSP) ist eine Prüfung für internationale Ärztinnen und Ärzte, in der medizinische Fachsprache und die Kommunikation mit Patient:innen auf Deutsch eine zentrale Rolle spielen.'],
    ['Was sind Patientengespräche?', 'Simulierte Anamnesegespräche mit einer virtuellen Patientin oder einem virtuellen Patienten. Du stellst Fragen auf Deutsch, bekommst Antworten und erhältst anschließend strukturiertes Trainingsfeedback.'],
    ['Für wen ist die App?', 'Für internationale Mediziner:innen, die sich gezielt auf die FSP vorbereiten — nicht für allgemeines Deutschlernen.'],
    ['Ist die App ein offizieller FSP-Kurs?', 'Nein. FSP Terminology ist ein unabhängiges Lernangebot und kein offizielles Produkt einer Ärztekammer oder Prüfungsbehörde.'],
    ['Kann ich jederzeit kündigen?', 'Ja. Die Kündigung ist im Konto-Bereich möglich.'],
    ['Was ist im Abo enthalten?', 'Zugriff auf die vorhandenen Begriffe, geführtes Training, Fehlertraining, Tests, Patientengespräche und deinen persönlichen Lernfortschritt.'],
  ];
  return <>{items.map(([q,a])=><details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</>;
}

export default function LandingPage() {
  const t = termById('t001')!;
  return <div className="marketing-page">
    <MarketingTopBar />
    <main>
      <section className="marketing-hero">
        <div className="marketing-wrap marketing-hero-grid">
          <div className="marketing-hero-copy">
            <div className="eyebrow">FSP-Vorbereitung für internationale Ärzt:innen</div>
            <h1>Dein FSP-Training. <em>Schritt für Schritt.</em></h1>
            <p className="lead">Lerne medizinische Fachsprache, übe Patientensprache, führe simulierte Patientengespräche und bekomme gezieltes Feedback zu deinen Schwachstellen.</p>
            <div className="hero-cta"><Link href="/demo" className="btn btn-blue">5 Aufgaben kostenlos testen</Link><Link href="/pricing" className="arrow-link">Preise ansehen <span className="arr">↗</span></Link></div>
            <div className="marketing-proof-row"><span>300+ Begriffe</span><span>Patientengespräche</span><span>Fehlertraining</span></div>
          </div>
          <div className="marketing-product-preview">
            <div className="preview-top"><span>HEUTIGES TRAINING</span><b>ca. 30 Min</b></div>
            <div className="preview-focus"><div><small>FOKUS</small><strong>Herz &amp; Kreislauf</strong><p>Wiederholen → Lernen → Patientengespräch → Check</p></div><div className="preview-progress">72%</div></div>
            <div className="preview-term"><div><small>BEGRIFF</small><strong>{t.medicalTerm}</strong></div><span>→</span><div><small>PATIENTENSPRACHE</small><strong>{t.patientTerms[0]}</strong></div></div>
            <div className="preview-case"><div className="preview-case-icon">+</div><div><small>NÄCHSTER SCHRITT</small><strong>Thoraxschmerzen · Patientengespräch</strong><span>Feedback nach dem Gespräch</span></div><span>›</span></div>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-loop-section">
        <div className="marketing-wrap">
          <div className="marketing-section-head"><div className="section-num">01 / DAS LERNSYSTEM</div><h2>Nicht Features sammeln. <em>Gezielt lernen.</em></h2><p>Die App führt dich durch einen Lernkreislauf, statt dich mit einzelnen Werkzeugen allein zu lassen.</p></div>
          <div className="learning-loop">
            {[['01','Lernen','Medizinische Begriffe verstehen','book'],['02','Üben','Aktiv abrufen und Patientensprache trainieren','target'],['03','Anwenden','Im Patientengespräch kommunizieren','stethoscope'],['04','Verbessern','Feedback, Fehler und nächste Einheit','chart']].map(([n,title,desc,icon])=><div className="loop-card" key={n}><div className="loop-number">{n}</div><div className="loop-icon">{icon === 'stethoscope' ? '✚' : icon === 'target' ? '◎' : icon === 'chart' ? '↗' : '▤'}</div><h3>{title}</h3><p>{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-wrap marketing-two-col">
          <div className="marketing-section-head"><div className="section-num">02 / DEIN LERNPLAN</div><h2>Du öffnest die App und weißt, <em>was als Nächstes kommt.</em></h2><p>Dein Dashboard priorisiert fällige Begriffe, neue Inhalte, Fehler und Patientengespräche. Du kannst trotzdem jederzeit frei trainieren.</p><Link href="/demo" className="arrow-link">Training ansehen <span className="arr">↗</span></Link></div>
          <div className="plan-preview">
            <div className="plan-preview-header"><div><small>HEUTE</small><strong>Dein FSP-Training</strong></div><span>30 Min</span></div>
            <div className="plan-row done"><i>01</i><div><b>Wiederholen</b><span>12 fällige Begriffe</span></div><strong>✓</strong></div>
            <div className="plan-row active"><i>02</i><div><b>Neu lernen</b><span>8 Begriffe · Patientensprache</span></div><strong>→</strong></div>
            <div className="plan-row"><i>03</i><div><b>Patientengespräch</b><span>Thoraxschmerzen · 12 Min</span></div><strong>›</strong></div>
            <div className="plan-row"><i>04</i><div><b>Check</b><span>Wissen im Kontext testen</span></div><strong>›</strong></div>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-blue-section">
        <div className="marketing-wrap">
          <div className="marketing-section-head"><div className="section-num">03 / PATIENTENGESPRÄCH</div><h2>Was du lernst, <em>wendest du an.</em></h2><p>Deine Terminologie wird nicht isoliert gelernt. Du bringst sie direkt in realistische Anamnesegespräche ein.</p></div>
          <div className="conversation-preview"><div className="chat-patient"><small>PATIENT</small><p>„Ich habe seit einer Stunde starke Schmerzen in der Brust.“</p></div><div className="chat-doctor"><small>DU</small><p>„Wo genau sind die Schmerzen und strahlen sie irgendwohin aus?“</p></div><div className="feedback-preview"><span>FEEDBACK</span><b>Gute Anamnese</b><p>Übe zusätzlich: Ausstrahlung · Belastungsabhängigkeit · Palpitationen</p></div></div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-wrap">
          <div className="marketing-section-head"><div className="section-num">04 / DEINE BEGRIFFE</div><h2>Ein Begriff ist mehr als eine Übersetzung.</h2><p>Die vorhandenen Begriffe enthalten Fachsprache, Patientensprache, Arztfragen, Arztbrief-Beispiele, typische Fehler und verwandte Begriffe.</p></div>
          <div className="term-showcase"><div className="term-showcase-main"><small>FACHBEGRIFF</small><h3>{t.medicalTerm}</h3><div className="term-pills">{t.patientTerms.map(x=><span key={x}>{x}</span>)}</div></div><div className="term-showcase-detail"><div><small>ARZTFRAGE</small><p>„{t.exampleDoctorQuestion}“</p></div><div><small>ARZTBRIEF</small><p>{t.exampleArztbriefSentence}</p></div><div><small>ERKLÄRUNG</small><p>{t.explanation}</p></div></div></div>
          <div className="cat-grid marketing-cat-grid">{CATEGORIES.slice(0,9).map(c=><div className="cat-pill" key={c}>{c}</div>)}<div className="cat-pill">+ weitere Kategorien</div></div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-wrap marketing-two-col reverse-mobile">
          <div className="skill-preview"><div className="skill-preview-head"><span>DEINE SKILLS</span><b>PERSONALISIERT</b></div>{[['Terminologie',78],['Patientensprache',64],['Anamnese',71],['Patientengespräch',58]].map(([name,val])=><div className="marketing-skill" key={name}><div><span>{name}</span><b>{val}%</b></div><div><i style={{width:`${val}%`}} /></div></div>)}</div>
          <div className="marketing-section-head"><div className="section-num">05 / FEEDBACK</div><h2>Deine Fehler bestimmen, <em>was du als Nächstes übst.</em></h2><p>Nach Übungen und Patientengesprächen werden Schwachstellen sichtbar. Relevante Begriffe können wieder in deine nächste Einheit einfließen.</p></div>
        </div>
      </section>

      <section className="marketing-section" id="pricing-preview"><div className="marketing-wrap"><div className="marketing-section-head"><div className="section-num">06 / PREISE</div><h2>Einfaches Training, <em>flexibles Abo.</em></h2><p>Wähle den Zeitraum, in dem du dich intensiv vorbereiten möchtest.</p></div><PricingCards /></div></section>
      <section className="marketing-section"><div className="marketing-wrap marketing-narrow"><div className="marketing-section-head"><div className="section-num">07 / FAQ</div><h2>Häufige Fragen</h2></div><Faq /></div></section>
      <section className="marketing-section marketing-final"><div className="marketing-wrap marketing-narrow"><div className="section-num">08 / LOS GEHT&apos;S</div><h2>Starte dein <em>FSP-Training.</em></h2><p>Teste echte Aufgaben und entdecke, wie das Training funktioniert.</p><Link href="/demo" className="btn btn-blue">5 Aufgaben kostenlos testen</Link></div></section>
    </main>
    <MarketingFooter />
  </div>;
}
