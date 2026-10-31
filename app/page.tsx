import type { Metadata } from 'next';
import Link from 'next/link';
import { TERMS, CATEGORIES, termById } from '@/data/terms';
import { PLANS } from '@/lib/pricing';
import { appBaseUrl } from '@/lib/env';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';
import { Reveal } from '@/components/Reveal';
import { TermFinder, type FinderTerm } from '@/components/TermFinder';
import { StageSlider } from '@/components/StageSlider';

export const metadata: Metadata = {
  title: { absolute: 'FSP Terminology: Fachsprachprüfung für Ärzte trainieren' },
  description:
    'Medizinisches Deutsch für die Fachsprachprüfung: Fachbegriffe und Patientensprache lernen, Patientengespräche üben, Feedback erhalten. 5 Aufgaben kostenlos testen.',
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
    'Wie zuverlässig sind Patient und Feedback?',
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
    'Wie läuft die Bezahlung?',
    'Die Zahlung wird über Polar abgewickelt. Bei einem wesentlichen technischen Problem, das den Zugriff verhindert, prüfen wir eine Rückerstattung. Alle Details und deine gesetzlichen Verbraucherrechte findest du in der Rückerstattungsrichtlinie.',
  ],
  [
    'Was ist im Abo enthalten?',
    'Zugriff auf alle Begriffe, geführtes Training, Fehlertraining, Tests, Patientengespräche und deinen persönlichen Lernfortschritt.',
  ],
];

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
  const cheapest = PLANS[0];
  const shared = PLANS[PLANS.length - 1].features;

  const finderTerms: FinderTerm[] = TERMS.filter(
    (x, i) => i % 9 === 0 || ['t001', 't002', 't004', 't013', 't022', 't012', 't089'].includes(x.id)
  ).map((x) => ({
    medical: x.medicalTerm,
    patient: x.patientTerms,
    question: x.exampleDoctorQuestion,
    letter: x.exampleArztbriefSentence,
    explanation: x.explanation,
    category: x.category,
  }));
  const stageData = {
    term: { medical: t.medicalTerm, patient: t.patientTerms, explanation: t.explanation },
    options: [t.patientTerms[0], 'Impfungen', 'geschwächtes Abwehrsystem', 'fiebersenkendes Medikament'],
    review: ['t012', 't013', 't004'].map((id) => termById(id)?.medicalTerm).filter(Boolean) as string[],
  };

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
    <div className="site-page">
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />
      <MarketingTopBar />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span className="eyebrow-mark" /> Medizinisches Deutsch. Gezielt für die FSP.</p>
            <h1 id="hero-title" className="hero-title">
            <span className="hero-word">Atemnot</span> <span className="sr-only">oder</span>
            <span className="hero-frame" data-ui aria-hidden="true">
              <span className="hero-frame-row">
                <small>Patient</small>
                <b>{t.patientTerms[0]}</b>
              </span>
              <span className="hero-frame-row">
                <small>Arzt</small>
                <b>{t.medicalTerm}</b>
              </span>
            </span>{' '}
            <span className="hero-word">Dyspnoe?</span>
            </h1>
          </div>
          <div className="hero-sub">
            <p className="hero-lead">
              Die Fachsprachprüfung verlangt beides: die Worte der Patient:innen und die Fachsprache im Arztbrief. Lerne
              medizinisches Deutsch, übe in simulierten Patientengesprächen und sieh, wo du dich verbessern kannst.
            </p>
            <div className="hero-actions">
              <Link href="/demo" className="btn btn-blue btn-lg">
                5 Aufgaben kostenlos testen
              </Link>
              <Link href="/pricing" className="text-link">
                Preise ansehen
              </Link>
            </div>
            <p className="hero-meta">
              Ohne Konto testen. Danach ab {cheapest.price} {cheapest.period}, jederzeit kündbar (
              <Link href="#pricing-preview">Preise</Link>). {TERMS.length} Begriffe in {CATEGORIES.length} Kategorien.
            </p>
          </div>
          <div className="hero-proofline" aria-label="Was dich erwartet">
            <span><b>{TERMS.length}+</b> medizinische Begriffe</span><i />
            <span><b>{CATEGORIES.length}</b> Fachbereiche</span><i />
            <span><b>5</b> Demo-Aufgaben ohne Anmeldung</span>
          </div>
        </section>

        <section className="band band-split" id="how" aria-labelledby="how-title">
          <h2 id="how-title" className="sr-only">
            So funktioniert das Training
          </h2>
          <StageSlider data={stageData} />
        </section>

        <section className="section section-finder" aria-labelledby="finder-title">
          <div className="grid">
            <Reveal className="head-row">
              <h2 id="finder-title" className="statement">
                Was sagt der Patient?
              </h2>
            </Reveal>
            <Reveal className="col-head">
              <p className="lead">
                Tippe ein Wort aus dem Mund einer Patientin und sieh, was im Arztbrief steht. Das ist der Kern der App,
                in {TERMS.length} Begriffen.
              </p>
            </Reveal>
            <Reveal className="col-body" delay={80}>
              <TermFinder terms={finderTerms} total={TERMS.length} />
              <p className="small-note">Kategorien: {CATEGORIES.join(', ')}.</p>
            </Reveal>
          </div>
        </section>

        <section className="section section-chat" aria-labelledby="chat-title">
          <div className="grid">
            <Reveal className="head-row">
              <h2 id="chat-title" className="statement">
                Was du lernst, wendest du an.
              </h2>
            </Reveal>
            <Reveal className="col-body col-first">
              <div data-ui className="ui-chat">
                <p className="ui-caption">Patientengespräch · Beispiel</p>
                <p className="ui-bubble ui-patient">
                  <span>Patient</span>Ich habe seit einer Stunde starke Schmerzen in der Brust.
                </p>
                <p className="ui-bubble ui-doctor">
                  <span>Du</span>Wo genau sind die Schmerzen und strahlen sie irgendwohin aus?
                </p>
                <div className="ui-feedback">
                  <p className="ui-caption">Feedback</p>
                  <p>Du siehst, welche Fragen fehlten und welche Begriffe du wiederholen solltest.</p>
                </div>
              </div>
            </Reveal>

            <Reveal className="col-head" delay={80}>
              <p className="lead">
                Du führst realistische Anamnesegespräche mit einer virtuellen Patientin. Danach bekommst du
                strukturiertes Feedback.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section section-plan" aria-labelledby="plan-title">
          <div className="grid">
            <Reveal className="head-row">
              <h2 id="plan-title" className="statement">
                Du weißt, was als Nächstes kommt.
              </h2>
            </Reveal>
            <Reveal className="col-head">
              <p className="lead">
                Dein Dashboard priorisiert fällige Begriffe, neue Inhalte, Fehler und Patientengespräche. Deine Fehler
                bestimmen, was du als Nächstes übst. Frei trainieren kannst du trotzdem jederzeit.
              </p>
            </Reveal>
            <Reveal className="col-body" delay={80}>
              <div data-ui className="ui-plan">
                <p className="ui-caption">Heute · Beispiel</p>
                <ol>
                  <li className="is-done">
                    <b>Wiederholen</b>
                    <span>Fällige Begriffe aus deinem Lernstand</span>
                  </li>
                  <li className="is-now">
                    <b>Neu lernen</b>
                    <span>Neue Begriffe mit Patientensprache</span>
                  </li>
                  <li>
                    <b>Patientengespräch</b>
                    <span>Anamnese mit virtuellem Patienten</span>
                  </li>
                  <li>
                    <b>Check</b>
                    <span>Wissen im Kontext testen</span>
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-about" id="about" aria-labelledby="about-title">
          <div className="grid">
            <Reveal className="about-text">
              <h2 id="about-title" className="about-heading">
                Entwickelt für die sprachliche Realität im Klinikalltag
              </h2>
              <p className="about-statement">
                In der FSP reicht es nicht, medizinische Begriffe auswendig zu kennen. Du musst verstehen, wie
                Patient:innen Beschwerden beschreiben – und diese anschließend präzise in ärztlicher Fachsprache
                wiedergeben. Genau diese Verbindung steht im Mittelpunkt von FSP Terminology.
              </p>
              <p className="about-more">
                Die App ist neu und wird laufend verbessert. Erfahrungsberichte gibt es deshalb noch nicht. Darum kannst
                du vor dem Kauf 5 echte Aufgaben ohne Konto ausprobieren und dir selbst ein Bild machen.
              </p>
            </Reveal>
            <Reveal className="honest" delay={80}>
              <div className="honest-col">
                <h3>Das kann die App</h3>
                <ul>
                  <li>
                    {TERMS.length} Begriffe in {CATEGORIES.length} Kategorien mit Patientensprache
                  </li>
                  <li>Tägliches, geführtes Training mit Wiederholung</li>
                  <li>Simulierte Anamnesegespräche mit Feedback</li>
                  <li>Fehlertraining und Tests</li>
                </ul>
              </div>
              <div className="honest-col">
                <h3>Das kann sie nicht</h3>
                <ul>
                  <li>Einen vollständigen Prüfungskurs oder Unterricht ersetzen</li>
                  <li>Das Bestehen der FSP garantieren</li>
                  <li>Medizinische Beratung geben (KI-Antworten können Fehler enthalten)</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-pricing" id="pricing-preview" aria-labelledby="pricing-title">
          <div className="grid">
            <Reveal className="head-row">
              <h2 id="pricing-title" className="statement">
                Ab {cheapest.price} {cheapest.period}. Jederzeit kündbar.
              </h2>
            </Reveal>
            <Reveal className="col-head">
              <p className="lead">Wähle den Zeitraum, in dem du dich intensiv vorbereiten möchtest.</p>
              <p className="small-note">In allen Plänen enthalten: {shared.join(', ')}.</p>
            </Reveal>
            <Reveal className="col-body" delay={80}>
              <div className="pricing-rows">
                <PricingCards />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-faq" id="faq" aria-labelledby="faq-title">
          <div className="grid">
            <Reveal className="head-row">
              <h2 id="faq-title" className="statement">
                Häufige Fragen
              </h2>
            </Reveal>
            <div className="faq-list">
              {FAQ_ITEMS.map(([q, a]) => (
                <Reveal key={q} className="faq-row">
                  <h3>{q}</h3>
                  <p>{a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-title">
          <h2 id="cta-title" className="cta-title">
            Erst testen, dann starten?
          </h2>
          <div className="cta-actions">
            <Link href="/demo" className="btn btn-blue btn-lg">
              5 Aufgaben kostenlos testen
            </Link>
            <span className="cta-or">oder</span>
            <Link href="/pricing" className="btn btn-light btn-lg">
              Preise ansehen
            </Link>
          </div>
          <p className="cta-note">Die Demo braucht kein Konto und keine Zahlungsdaten.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
