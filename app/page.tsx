import type { Metadata } from 'next';
import Link from 'next/link';
import { TERMS, CATEGORIES, termById } from '@/data/terms';
import { PLANS } from '@/lib/pricing';
import { appBaseUrl } from '@/lib/env';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';
import { ProductShot } from '@/components/ProductShot';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const FAQ_ITEMS: [string, string][] = [
  [
    'Was ist die FSP?',
    'Die Fachsprachprüfung (FSP) ist eine Prüfung für internationale Ärztinnen und Ärzte, in der medizinische Fachsprache und die Kommunikation mit Patient:innen auf Deutsch eine zentrale Rolle spielen.',
  ],
  [
    'Was wird in der FSP geprüft?',
    'In der Regel geht es um ein Anamnesegespräch mit einer Patientin oder einem Patienten, um die ärztliche Dokumentation (zum Beispiel einen Arztbrief) und um ein Gespräch mit Kolleg:innen. Die genauen Abläufe unterscheiden sich je nach Ärztekammer und Bundesland. Bitte informiere dich dazu bei deiner zuständigen Ärztekammer.',
  ],
  [
    'Was deckt die App ab und was nicht?',
    'Die App trainiert medizinische Fachsprache, Patientensprache und das Anamnesegespräch. Zu jedem Begriff gibt es außerdem Beispiele für Arztfragen und Arztbrief-Sätze. Sie ersetzt keinen vollständigen Prüfungskurs und garantiert kein Bestehen der Prüfung.',
  ],
  [
    'Was sind Patientengespräche?',
    'Simulierte Anamnesegespräche mit einer virtuellen Patientin oder einem virtuellen Patienten. Du stellst Fragen auf Deutsch, bekommst Antworten und erhältst anschließend strukturiertes Trainingsfeedback.',
  ],
  [
    'Wie zuverlässig sind der virtuelle Patient und das Feedback?',
    'Beides wird mit Hilfe künstlicher Intelligenz erzeugt. Antworten und Bewertungen können Fehler oder Lücken enthalten und sind Trainingshinweise, keine medizinische Beratung. Bitte gib in Freitextfeldern keine echten Patientendaten ein.',
  ],
  [
    'Brauche ich ein Konto, um die App zu testen?',
    'Nein. Die 5 Demo-Aufgaben kannst du ohne Konto und ohne Zahlungsdaten ausprobieren.',
  ],
  [
    'Für wen ist die App?',
    'Für internationale Mediziner:innen, die sich gezielt auf die FSP vorbereiten, nicht für allgemeines Deutschlernen.',
  ],
  [
    'Ist die App ein offizieller FSP-Kurs?',
    'Nein. FSP Terminology ist ein unabhängiges Lernangebot und kein offizielles Produkt einer Ärztekammer oder Prüfungsbehörde.',
  ],
  ['Kann ich jederzeit kündigen?', 'Ja. Die Kündigung ist im Konto-Bereich möglich.'],
  [
    'Wie läuft die Bezahlung und was passiert bei Problemen?',
    'Die Zahlung wird über Polar abgewickelt. Bei einem wesentlichen technischen Problem, das den Zugriff verhindert, prüfen wir eine Rückerstattung. Alle Details und deine gesetzlichen Verbraucherrechte findest du in der Rückerstattungsrichtlinie.',
  ],
  [
    'Was ist im Abo enthalten?',
    'Zugriff auf alle Begriffe, geführtes Training, Fehlertraining, Tests, Patientengespräche und deinen persönlichen Lernfortschritt.',
  ],
];

function Faq() {
  return (
    <>
      {FAQ_ITEMS.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </>
  );
}

function JsonLd({ data }: { data: unknown }) {
  // "<" is escaped so the JSON can never close the script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export default function LandingPage() {
  const t = termById('t001')!;
  const baseUrl = appBaseUrl();
  const focusCategory = CATEGORIES.includes('Herz & Kreislauf') ? 'Herz & Kreislauf' : CATEGORIES[0];
  const cheapest = PLANS[0];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'FSP Terminology', url: baseUrl },
      { '@type': 'WebSite', name: 'FSP Terminology', url: baseUrl, inLanguage: 'de' },
    ],
  };

  return (
    <div className="marketing-page">
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />
      <MarketingTopBar />
      <main>
        <section className="marketing-hero">
          <div className="marketing-wrap marketing-hero-grid">
            <div className="marketing-hero-copy">
              <div className="eyebrow">FSP-Vorbereitung für internationale Ärzt:innen</div>
              <h1>
                Dein FSP-Training. <em>Schritt für Schritt.</em>
              </h1>
              <p className="lead">
                Patient:innen sagen „Atemnot“, im Arztbrief steht „Dyspnoe“. Die FSP verlangt beides. Hier lernst du
                Fachsprache und Patientensprache zusammen, übst in simulierten Patientengesprächen und siehst, wo du
                dich verbessern kannst.
              </p>
              <div className="hero-cta">
                <Link href="/demo" className="btn btn-blue">
                  5 Aufgaben kostenlos testen
                </Link>
                <Link href="/pricing" className="arrow-link">
                  Preise ansehen <span className="arr">↗</span>
                </Link>
              </div>
              <p className="price-teaser">
                Ohne Konto testen · danach ab {cheapest.price} {cheapest.period} · jederzeit kündbar ·{' '}
                <Link href="#pricing-preview">Preise</Link>
              </p>
              <div className="marketing-proof-row">
                <span>{TERMS.length} Begriffe</span>
                <span>{CATEGORIES.length} Kategorien</span>
                <span>Patientengespräche</span>
                <span>Fehlertraining</span>
              </div>
            </div>
            <ProductShot name="hero.png" alt="Das tägliche Training in FSP Terminology" width={1200} height={900}>
              <div className="marketing-product-preview">
                <span className="example-badge">Beispielansicht</span>
                <div className="preview-top">
                  <span>HEUTIGES TRAINING</span>
                </div>
                <div className="preview-focus">
                  <div>
                    <small>FOKUS</small>
                    <strong>{focusCategory}</strong>
                    <p>Wiederholen → Lernen → Patientengespräch → Check</p>
                  </div>
                </div>
                <div className="preview-term">
                  <div>
                    <small>BEGRIFF</small>
                    <strong>{t.medicalTerm}</strong>
                  </div>
                  <span>→</span>
                  <div>
                    <small>PATIENTENSPRACHE</small>
                    <strong>{t.patientTerms[0]}</strong>
                  </div>
                </div>
                <div className="preview-case">
                  <div className="preview-case-icon">+</div>
                  <div>
                    <small>NÄCHSTER SCHRITT</small>
                    <strong>Anamnese mit virtuellem Patienten</strong>
                    <span>Feedback nach dem Gespräch</span>
                  </div>
                  <span>›</span>
                </div>
              </div>
            </ProductShot>
          </div>
        </section>

        <section className="marketing-section marketing-loop-section" id="how">
          <div className="marketing-wrap">
            <div className="marketing-section-head">
              <div className="section-num">01 / DAS LERNSYSTEM</div>
              <h2>
                Nicht Features sammeln. <em>Gezielt lernen.</em>
              </h2>
              <p>Die App führt dich durch einen Lernkreislauf, statt dich mit einzelnen Werkzeugen allein zu lassen.</p>
            </div>
            <div className="learning-loop">
              {[
                ['01', 'Lernen', 'Medizinische Begriffe verstehen', '▤'],
                ['02', 'Üben', 'Aktiv abrufen und Patientensprache trainieren', '◎'],
                ['03', 'Anwenden', 'Im Patientengespräch kommunizieren', '✚'],
                ['04', 'Verbessern', 'Feedback, Fehler und nächste Einheit', '↗'],
              ].map(([n, title, desc, icon]) => (
                <div className="loop-card" key={n}>
                  <div className="loop-number">{n}</div>
                  <div className="loop-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-section">
          <div className="marketing-wrap marketing-two-col">
            <div className="marketing-section-head">
              <div className="section-num">02 / DEIN LERNPLAN</div>
              <h2>
                Du öffnest die App und weißt, <em>was als Nächstes kommt.</em>
              </h2>
              <p>
                Dein Dashboard priorisiert fällige Begriffe, neue Inhalte, Fehler und Patientengespräche. Du kannst
                trotzdem jederzeit frei trainieren.
              </p>
              <Link href="/demo" className="arrow-link">
                Training ansehen <span className="arr">↗</span>
              </Link>
            </div>
            <ProductShot name="study.png" alt="Der tägliche Lernplan" width={1200} height={900}>
              <div className="plan-preview">
                <span className="example-badge">Beispielansicht</span>
                <div className="plan-preview-header">
                  <div>
                    <small>HEUTE</small>
                    <strong>Dein FSP-Training</strong>
                  </div>
                </div>
                <div className="plan-row done">
                  <i>01</i>
                  <div>
                    <b>Wiederholen</b>
                    <span>Fällige Begriffe aus deinem Lernstand</span>
                  </div>
                  <strong>✓</strong>
                </div>
                <div className="plan-row active">
                  <i>02</i>
                  <div>
                    <b>Neu lernen</b>
                    <span>Neue Begriffe mit Patientensprache</span>
                  </div>
                  <strong>→</strong>
                </div>
                <div className="plan-row">
                  <i>03</i>
                  <div>
                    <b>Patientengespräch</b>
                    <span>Anamnese mit virtuellem Patienten</span>
                  </div>
                  <strong>›</strong>
                </div>
                <div className="plan-row">
                  <i>04</i>
                  <div>
                    <b>Check</b>
                    <span>Wissen im Kontext testen</span>
                  </div>
                  <strong>›</strong>
                </div>
              </div>
            </ProductShot>
          </div>
        </section>

        <section className="marketing-section marketing-blue-section">
          <div className="marketing-wrap">
            <div className="marketing-section-head">
              <div className="section-num">03 / PATIENTENGESPRÄCH</div>
              <h2>
                Was du lernst, <em>wendest du an.</em>
              </h2>
              <p>
                Deine Terminologie wird nicht isoliert gelernt. Du bringst sie direkt in realistische Anamnesegespräche
                ein.
              </p>
            </div>
            <ProductShot name="chat.png" alt="Ein Patientengespräch mit Feedback" width={1200} height={900}>
              <div className="conversation-preview">
                <span className="example-badge">Beispielgespräch</span>
                <div className="chat-patient">
                  <small>PATIENT</small>
                  <p>„Ich habe seit einer Stunde starke Schmerzen in der Brust.“</p>
                </div>
                <div className="chat-doctor">
                  <small>DU</small>
                  <p>„Wo genau sind die Schmerzen und strahlen sie irgendwohin aus?“</p>
                </div>
                <div className="feedback-preview">
                  <span>FEEDBACK</span>
                  <b>Strukturiertes Feedback nach dem Gespräch</b>
                  <p>Du siehst, welche Fragen fehlten und welche Begriffe du wiederholen solltest.</p>
                </div>
              </div>
            </ProductShot>
          </div>
        </section>

        <section className="marketing-section">
          <div className="marketing-wrap">
            <div className="marketing-section-head">
              <div className="section-num">04 / DEINE BEGRIFFE</div>
              <h2>Ein Begriff ist mehr als eine Übersetzung.</h2>
              <p>
                Die Begriffe enthalten Fachsprache, Patientensprache, Arztfragen, Arztbrief-Beispiele, typische Fehler
                und verwandte Begriffe.
              </p>
            </div>
            <div className="term-showcase">
              <div className="term-showcase-main">
                <small>FACHBEGRIFF</small>
                <h3>{t.medicalTerm}</h3>
                <div className="term-pills">
                  {t.patientTerms.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
              </div>
              <div className="term-showcase-detail">
                <div>
                  <small>ARZTFRAGE</small>
                  <p>„{t.exampleDoctorQuestion}“</p>
                </div>
                <div>
                  <small>ARZTBRIEF</small>
                  <p>{t.exampleArztbriefSentence}</p>
                </div>
                <div>
                  <small>ERKLÄRUNG</small>
                  <p>{t.explanation}</p>
                </div>
              </div>
            </div>
            <div className="cat-grid marketing-cat-grid">
              {CATEGORIES.slice(0, 9).map((c) => (
                <div className="cat-pill" key={c}>
                  {c}
                </div>
              ))}
              <div className="cat-pill">+ weitere Kategorien</div>
            </div>
          </div>
        </section>

        <section className="marketing-section">
          <div className="marketing-wrap marketing-two-col reverse-mobile">
            <div className="checklist-card">
              <span className="example-badge">Nach jedem Gespräch</span>
              <ul>
                <li>
                  <i>✓</i>
                  <div>
                    <b>Strukturiertes Feedback</b>
                    <span>Was gut lief und woran du noch arbeiten kannst.</span>
                  </div>
                </li>
                <li>
                  <i>✓</i>
                  <div>
                    <b>Begriffe zum Wiederholen</b>
                    <span>Unsichere Begriffe fließen in deinen nächsten Lernplan ein.</span>
                  </div>
                </li>
                <li>
                  <i>✓</i>
                  <div>
                    <b>Deine Schwachstellen im Blick</b>
                    <span>Dein Dashboard zeigt, welche Bereiche du als Nächstes üben solltest.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="marketing-section-head">
              <div className="section-num">05 / FEEDBACK</div>
              <h2>
                Deine Fehler bestimmen, <em>was du als Nächstes übst.</em>
              </h2>
              <p>
                Nach Übungen und Patientengesprächen werden Schwachstellen sichtbar. Relevante Begriffe können wieder in
                deine nächste Einheit einfließen.
              </p>
            </div>
          </div>
        </section>

        <section className="marketing-section" id="about">
          <div className="marketing-wrap">
            <div className="marketing-section-head">
              <div className="section-num">06 / ÜBER DIE APP</div>
              <h2>
                Von einem Arzt, <em>der Deutsch selbst gelernt hat.</em>
              </h2>
            </div>
            <div className="about-grid">
              <div className="about-card">
                <p>
                  Ich bin Arzt und habe mir Deutsch selbst beigebracht. Ich weiß, wie schwer es ist, medizinische
                  Fachsprache zu lernen, wenn Patient:innen ganz anders sprechen als in den Lehrbüchern.
                </p>
                <p>
                  Deshalb habe ich FSP Terminology gebaut: Fachbegriffe und Patientensprache gehören hier zusammen, und
                  du übst sie direkt im Gespräch. Die App soll dir helfen, dich sicherer auf die FSP vorzubereiten.
                </p>
                <p>
                  Die App ist neu und wird laufend verbessert. Erfahrungsberichte gibt es deshalb noch nicht. Darum
                  kannst du vor dem Kauf 5 echte Aufgaben ohne Konto ausprobieren und dir selbst ein Bild machen.
                </p>
                <p className="about-sign">
                  Gründer von FSP Terminology
                  <span>Arzt</span>
                </p>
              </div>
              <div className="honest-card">
                <h3>Das kann die App</h3>
                <ul>
                  <li>
                    {TERMS.length} Begriffe in {CATEGORIES.length} Kategorien mit Patientensprache
                  </li>
                  <li>Tägliches, geführtes Training mit Wiederholung</li>
                  <li>Simulierte Anamnesegespräche mit Feedback</li>
                  <li>Fehlertraining und Tests</li>
                </ul>
                <h3>Das kann sie nicht</h3>
                <ul>
                  <li>Einen vollständigen Prüfungskurs oder Unterricht ersetzen</li>
                  <li>Das Bestehen der FSP garantieren</li>
                  <li>Medizinische Beratung geben (KI-Antworten können Fehler enthalten)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section" id="pricing-preview">
          <div className="marketing-wrap">
            <div className="marketing-section-head">
              <div className="section-num">07 / PREISE</div>
              <h2>
                Einfaches Training, <em>flexibles Abo.</em>
              </h2>
              <p>Wähle den Zeitraum, in dem du dich intensiv vorbereiten möchtest.</p>
            </div>
            <PricingCards />
          </div>
        </section>
        <section className="marketing-section" id="faq">
          <div className="marketing-wrap marketing-narrow">
            <div className="marketing-section-head">
              <div className="section-num">08 / FAQ</div>
              <h2>Häufige Fragen</h2>
            </div>
            <Faq />
          </div>
        </section>
        <section className="marketing-section marketing-final">
          <div className="marketing-wrap marketing-narrow">
            <div className="section-num">09 / LOS GEHT&apos;S</div>
            <h2>
              Starte dein <em>FSP-Training.</em>
            </h2>
            <p>Teste echte Aufgaben ohne Konto und entdecke, wie das Training funktioniert.</p>
            <Link href="/demo" className="btn btn-blue">
              5 Aufgaben kostenlos testen
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
