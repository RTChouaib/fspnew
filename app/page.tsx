import Link from 'next/link';
import { TERMS, CATEGORIES, termById } from '@/data/terms';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';

function Faq() {
  const items: [string, string][] = [
    ['Was ist die FSP?', 'Die Fachsprachprüfung (FSP) ist eine Prüfung für internationale Ärztinnen und Ärzte, in der die medizinische Fachsprache und die Kommunikation mit Patient:innen auf Deutsch nachgewiesen werden muss.'],
    ['Was sind FSP Fälle?', 'Simulierte Anamnesegespräche mit einer virtuellen Patientin oder einem virtuellen Patienten. Du stellst Fragen auf Deutsch, bekommst natürliche Antworten und am Ende eine detaillierte Trainingsauswertung — kein offizielles FSP-Ergebnis, sondern gezieltes Übungsfeedback.'],
    ['Für wen ist die App?', 'Für internationale Mediziner:innen, die sich gezielt auf die FSP vorbereiten — nicht für allgemeines Deutschlernen.'],
    ['Brauche ich Deutsch auf B2-Niveau?', 'B2 ist eine gute Grundlage, da der Schwerpunkt auf medizinischer Fachsprache und klinischer Kommunikation liegt.'],
    ['Ist FSP Terminology ein offizieller FSP-Kurs?', 'Nein. FSP Terminology ist ein unabhängiges Lernangebot zur Sprachvorbereitung und kein offizielles Produkt einer Ärztekammer oder Prüfungsbehörde.'],
    ['Kann ich jederzeit kündigen?', 'Ja. Die Kündigung ist jederzeit im Konto-Bereich mit einem Klick möglich, ohne Rückfragen oder Fristen.'],
    ['Was bekomme ich mit dem Abo?', 'Zugriff auf alle Begriffe, unbegrenztes Training, alle Lernmodi, Tests, Fehlertraining und deinen vollständigen Fortschritt.'],
    ['Gibt es eine kostenlose Probe?', 'Ja, du kannst 5 echte FSP-Aufgaben kostenlos und ohne Registrierung ausprobieren.'],
  ];
  return (
    <>
      {items.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </>
  );
}

export default function LandingPage() {
  const t = termById('t001')!;

  return (
    <>
      <MarketingTopBar />

      <div className="wrap hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Für internationale Ärztinnen und Ärzte</div>
            <h1>
              Bereite dich auf die FSP vor — im <em>echten Gespräch.</em>
            </h1>
            <p className="lead">
              Führe simulierte Patientengespräche auf Deutsch, erhalte sofortiges persönliches
              Feedback zu Anamnese, Patientensprache und Fachsprache — und trainiere gezielt
              genau das, was dir noch fehlt.
            </p>
            <div className="hero-cta">
              <Link href="/demo" className="btn btn-blue">5 Aufgaben kostenlos testen</Link>
              <Link href="/pricing" className="arrow-link">
                Preise ansehen <span className="arr">↗</span>
              </Link>
            </div>
            <div className="coords">
              B2–C1 · PATIENTENGESPRÄCHE · FACHSPRACHE · SOFORTIGES FEEDBACK
            </div>
          </div>
          <div className="transform-card">
            <div className="transform-row">
              <div className="t-label">Fachbegriff</div>
              <div className="t-value term">{t.medicalTerm}</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Patientensprache</div>
              <div className="t-value">{t.patientTerms.join(' / ')}</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Patientenfrage</div>
              <div className="t-value quote">„{t.exampleDoctorQuestion}&quot;</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Arztbrief</div>
              <div className="t-value quote">{t.exampleArztbriefSentence}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">01 / FSP FÄLLE</div>
            <h2>
              Kein Vokabeltest. <em>Ein echtes Gespräch.</em>
            </h2>
            <p>
              Führe ein simuliertes Anamnesegespräch mit einer virtuellen Patientin oder einem
              virtuellen Patienten — auf Deutsch, wie in der Prüfung. Am Ende erhältst du eine
              detaillierte Auswertung: Was hast du gut gemacht, was hast du übersehen, und wie
              hättest du es sprachlich besser formulieren können.
            </p>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <h3>Realistische Fälle</h3>
              <p>
                Thoraxschmerzen, Dyspnoe, Bauchschmerzen und mehr — Fälle aus verschiedenen
                Fachgebieten, wie sie in der FSP vorkommen.
              </p>
            </div>
            <div className="feature-card">
              <h3>Sofortiges Feedback</h3>
              <p>
                Nach jedem Gespräch: Stärken, fehlende Informationen und konkrete sprachliche
                Verbesserungsvorschläge — deine Formulierung neben der besseren Alternative.
              </p>
            </div>
            <div className="feature-card">
              <h3>Gezieltes Training</h3>
              <p>
                Deine Schwachstellen aus den Gesprächen fließen direkt in dein
                Begriffs-Training ein — du übst genau das, was dir noch fehlt.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">02 / DAS PROBLEM</div>
            <h2>
              Du kennst die Medizin — aber findest im Gespräch nicht immer die{' '}
              <em>richtigen</em> deutschen Worte?
            </h2>
            <p>
              Die FSP prüft nicht dein Fachwissen, sondern deine Kommunikation. Genau dafür
              ist dieses Training gemacht.
            </p>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <h3>Fachbegriff → Patientensprache</h3>
              <p>
                Übersetze medizinische Termini spontan in verständliche Alltagssprache —
                genau wie im Patientengespräch gefordert.
              </p>
            </div>
            <div className="feature-card">
              <h3>Patientensprache → Fachbegriff</h3>
              <p>Erkenne, welcher Fachbegriff hinter dem beschreibt, was Patient:innen dir erzählen.</p>
            </div>
            <div className="feature-card">
              <h3>FSP-Situationen & Arztbrief</h3>
              <p>
                Übe realistische Prüfungsszenarien: von der Anamnese bis zur schriftlichen
                Arztbrief-Formulierung.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">03 / DIE LÖSUNG</div>
            <h2>
              Nicht noch eine <em>Vokabel-App.</em>
            </h2>
            <p>
              Generisches Deutschlernen bringt dich nicht durch die FSP. Diese Plattform
              trainiert ausschließlich das, was in der Prüfung zählt: die Brücke zwischen
              Fachsprache und Patientenkommunikation, mit spaced repetition und gezieltem
              Fehlertraining.
            </p>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <h3>Gezielte Wiederholung</h3>
              <p>
                Ein einfacher Spaced-Repetition-Algorithmus zeigt dir Begriffe genau dann,
                wenn du sie sonst vergessen würdest.
              </p>
            </div>
            <div className="feature-card">
              <h3>Fehlertraining</h3>
              <p>
                Jeder falsch beantwortete Begriff landet automatisch in „Meine Fehler&quot; —
                bis du ihn sicher beherrschst.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">04 / SO TRAINIERST DU</div>
            <h2>
              Kurze Einheiten. <em>Aktiver Abruf.</em>
            </h2>
            <p>
              Kurze Trainingseinheiten helfen dir, medizinische Formulierungen aktiv abzurufen —
              nicht nur wiederzuerkennen.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>Aufgabe lösen</h3>
              <p>Du bearbeitest eine realistische FSP-Aufgabe — Fachsprache, Patientensprache oder Arztbrief.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>Antwort prüfen</h3>
              <p>Du siehst sofort, ob deine Formulierung stimmt, und warum.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>Fehler verstehen</h3>
              <p>Typische Verwechslungen und Fehlerquellen werden dir direkt erklärt.</p>
            </div>
            <div className="step-card">
              <div className="step-num">04</div>
              <h3>Schwachstellen wiederholen</h3>
              <p>Falsch beantwortete Begriffe kommen gezielt zurück, bis du sie sicher beherrschst.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">05 / KATEGORIEN</div>
            <h2>
              Nach Fachgebiet <em>geordnet.</em>
            </h2>
            <p>Über {TERMS.length} FSP-relevante Begriffe, strukturiert nach klinischen Fachgebieten.</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <div className="cat-pill" key={c}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">06 / FORTSCHRITT</div>
            <h2>
              Dein Fortschritt <em>im Blick.</em>
            </h2>
            <p>
              Gelernte Begriffe, Trefferquote, Streak und Schwachstellen je Kategorie — alles
              an einem Ort.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap narrow habit-banner">
          <div className="eyebrow">Tägliche Routine</div>
          <h2>
            10 Minuten täglich. <em>Aktiv trainieren.</em>
          </h2>
          <p>
            Kleine, regelmäßige Trainingseinheiten statt stundenlanges Durcharbeiten von
            Vokabellisten. Eine sinnvolle Ergänzung zu Kursen und Unterricht — kein Ersatz für
            eine bestandene Prüfung garantiert dies allein.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">07 / FÜR WEN</div>
            <h2>
              Für wen ist <em>FSP Terminology?</em>
            </h2>
            <p>
              Du kennst die Medizin — aber dir fehlen manchmal die richtigen deutschen
              Formulierungen? Genau auf diese sprachliche Lücke konzentriert sich dieses Training.
            </p>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <h3>Du bereitest dich auf die FSP vor</h3>
              <p>Du möchtest medizinisches Deutsch regelmäßig und gezielt trainieren.</p>
            </div>
            <div className="feature-card">
              <h3>Du bist etwa auf B2/C1-Niveau</h3>
              <p>
                Du kennst die medizinischen Inhalte, brauchst aber mehr Sicherheit bei
                Fachsprache und klinischen Formulierungen.
              </p>
            </div>
            <div className="feature-card">
              <h3>Du übst selbstständig zwischen Kursen</h3>
              <p>Kurze Einheiten eignen sich als zusätzliches Training neben FSP-Kursen und Unterricht.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section" id="pricing-preview">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">08 / PREISE</div>
            <h2>
              Wähle deinen <em>Zeitrahmen.</em>
            </h2>
            <p>Flexibel für kurze, intensive Vorbereitung oder über mehrere Wochen.</p>
          </div>
          <PricingCards />
        </div>
      </div>

      <div className="section">
        <div className="wrap narrow">
          <div className="section-head">
            <div className="section-num">09 / FAQ</div>
            <h2>Häufige Fragen</h2>
          </div>
          <Faq />
        </div>
      </div>

      <div className="section">
        <div className="wrap narrow" style={{ textAlign: 'center' }}>
          <div className="section-num">10 / LOS GEHT&apos;S</div>
          <h2>
            FSP-Training <em>starten.</em>
          </h2>
          <Link href="/demo" className="btn btn-blue">5 Aufgaben kostenlos testen</Link>
        </div>
      </div>

      <MarketingFooter />
    </>
  );
}
