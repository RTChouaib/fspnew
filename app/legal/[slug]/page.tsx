import { notFound } from 'next/navigation';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';

const CONTENT: Record<string, { title: string; intro?: string; sections: { heading: string; body: string[] }[] }> = {
  impressum: {
    title: 'Impressum',
    intro: 'Anbieterinformationen für FSP Terminology',
    sections: [
      {
        heading: 'Anbieter',
        body: [
          'FSP Terminology',
          'Jnen El Bey, Annaba, Algerien',
          'E-Mail: chouaib@by-rtc.com',
        ],
      },
      {
        heading: 'Hinweise',
        body: [
          'FSP Terminology ist ein unabhängiges digitales Lernangebot zur Vorbereitung auf medizinische Fachsprache und Kommunikation im Zusammenhang mit der Fachsprachprüfung (FSP). Das Angebot ist weder eine amtliche Prüfung noch ein Angebot einer Ärztekammer oder einer staatlichen Stelle.',
          'Es wird keine medizinische Behandlung oder individuelle medizinische Beratung angeboten.',
        ],
      },
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    intro: 'Stand: 29. September 2026',
    sections: [
      {
        heading: '1. Verantwortlicher',
        body: [
          'Verantwortlicher für die Verarbeitung personenbezogener Daten im Rahmen von FSP Terminology ist FSP Terminology, Jnen El Bey, Annaba, Algerien.',
          'Kontakt: chouaib@by-rtc.com',
        ],
      },
      {
        heading: '2. Welche Daten wir verarbeiten',
        body: [
          'Bei der Nutzung des Dienstes können insbesondere Ihre E-Mail-Adresse, Login-Daten, Lernfortschritt, Fehler- und Testergebnisse, Angaben zu abgeschlossenen Lerneinheiten sowie Daten zu Patientengesprächen und deren Auswertungen verarbeitet werden.',
          'Für die Anmeldung wird ein zeitlich begrenzter Login-Code verwendet. Zahlungsdaten werden nicht von FSP Terminology gespeichert; die Zahlungsabwicklung erfolgt über Paddle als Merchant of Record.',
        ],
      },
      {
        heading: '3. Zwecke und Rechtsgrundlagen',
        body: [
          'Die Daten werden zur Bereitstellung des Kontos, zur Authentifizierung, zur Speicherung des Lernfortschritts, zur Durchführung und Auswertung von Lernübungen und Patientengesprächen, zur Verwaltung von Abonnements sowie zur Beantwortung von Supportanfragen verarbeitet.',
          'Soweit die DSGVO anwendbar ist, erfolgt die Verarbeitung insbesondere zur Vertragserfüllung, zur Erfüllung gesetzlicher Pflichten sowie – soweit erforderlich und zulässig – aufgrund berechtigter Interessen. Wo eine Einwilligung erforderlich ist, wird diese eingeholt.',
        ],
      },
      {
        heading: '4. Patientengespräche und KI',
        body: [
          'Wenn Sie ein interaktives Patientengespräch verwenden, wird der von Ihnen eingegebene Gesprächsinhalt zur Erzeugung der Patientenantwort und zur anschließenden Auswertung an den eingesetzten KI-Dienst DeepSeek übertragen. Die Anwendung speichert die Gesprächsverläufe und Auswertungen, damit Sie Ihre Ergebnisse und Lernfortschritte nachvollziehen können.',
          'Bitte geben Sie in freien Texteingaben keine echten Namen, Kontaktdaten oder sonstigen personenbezogenen Daten realer Patienten ein. Verwenden Sie ausschließlich die im Lernkontext vorgesehenen fiktiven Fallinformationen.',
          'DeepSeek weist in seiner Datenschutzerklärung darauf hin, dass personenbezogene Daten unter anderem in China verarbeitet bzw. gespeichert werden können. Für internationale Datenübermittlungen werden die jeweils anwendbaren rechtlichen Anforderungen berücksichtigt.',
        ],
      },
      {
        heading: '5. E-Mail-Versand',
        body: [
          'Für den Versand von Login-E-Mails kann Resend eingesetzt werden. Dabei werden die für den Versand erforderliche E-Mail-Adresse sowie die erforderlichen Nachrichten- und technischen Metadaten an Resend übermittelt.',
          'Resend gibt an, E-Mail- und Logdaten grundsätzlich für 30 Tage auf seinen Free-, Pro- und Scale-Plänen aufzubewahren; die konkrete Aufbewahrung kann vom eingesetzten Resend-Konto abhängen.',
        ],
      },
      {
        heading: '6. Hosting und Analytics',
        body: [
          'Die Anwendung kann über Vercel bereitgestellt werden. Dabei können technische Daten wie IP-Adresse, Geräte- und Nutzungsinformationen sowie Server- und Telemetriedaten verarbeitet werden, soweit dies für Betrieb, Sicherheit und Analyse erforderlich ist.',
          'FSP Terminology verwendet Vercel Web Analytics zur Messung von Seitenaufrufen und aggregierten Nutzungsdaten. Vercel beschreibt Web Analytics als datenschutzfreundliche, erstanbieterbasierte Analyse ohne websiteübergreifendes Tracking.',
        ],
      },
      {
        heading: '7. Zahlungsabwicklung',
        body: [
          'Zahlungen und Abonnements werden über Paddle abgewickelt. Paddle tritt als Merchant of Record bzw. autorisierter Wiederverkäufer auf und verarbeitet Zahlungs- und Transaktionsdaten. FSP Terminology erhält insbesondere die für die Zuordnung des Abonnements erforderlichen Informationen, nicht die vollständigen Kartendaten.',
          'Für Fragen zu einer Zahlung, Kündigung oder einer Rückerstattung können Sie die von Paddle bereitgestellten Support- und Customer-Portal-Funktionen nutzen; bei produktbezogenen Problemen können Sie zusätzlich FSP Terminology unter chouaib@by-rtc.com kontaktieren.',
        ],
      },
      {
        heading: '8. Cookies und lokale Speicherung',
        body: [
          'Die Anwendung verwendet technisch notwendige Cookies bzw. lokale Sitzungsinformationen, um den Login-Status und den sicheren Zugriff auf geschützte Bereiche zu ermöglichen. Diese Funktionen sind für den Betrieb des Dienstes erforderlich.',
        ],
      },
      {
        heading: '9. Speicherdauer',
        body: [
          'Daten werden grundsätzlich so lange gespeichert, wie sie für die jeweiligen Zwecke erforderlich sind, insbesondere solange ein Nutzerkonto besteht oder gesetzliche Aufbewahrungspflichten bestehen. Nach einer Kontolöschung werden die damit verbundenen Anwendungsdaten gelöscht, soweit keine gesetzliche Pflicht oder ein berechtigter Grund für eine weitere Aufbewahrung besteht.',
          'Kurzlebige Login-Codes werden nach Ablauf bzw. Verwendung ungültig.',
        ],
      },
      {
        heading: '10. Ihre Rechte',
        body: [
          'Soweit die DSGVO oder andere anwendbare Datenschutzgesetze Ihnen entsprechende Rechte gewähren, können Sie insbesondere Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und – soweit die Verarbeitung darauf beruht – Widerspruch bzw. Widerruf einer Einwilligung verlangen.',
          'Für Datenschutzanfragen kontaktieren Sie uns unter chouaib@by-rtc.com. Sie haben außerdem das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren, soweit dies gesetzlich vorgesehen ist.',
        ],
      },
      {
        heading: '11. Änderungen',
        body: [
          'Diese Datenschutzerklärung kann angepasst werden, wenn sich der Dienst, die eingesetzten Anbieter oder die rechtlichen Anforderungen ändern. Die jeweils aktuelle Fassung wird auf dieser Seite veröffentlicht.',
        ],
      },
    ],
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    intro: 'Stand: 29. September 2026',
    sections: [
      {
        heading: '1. Anbieter und Geltungsbereich',
        body: [
          'Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung und den Kauf des digitalen Lernangebots FSP Terminology.',
          'Anbieter: FSP Terminology, Jnen El Bey, Annaba, Algerien. Kontakt: chouaib@by-rtc.com.',
        ],
      },
      {
        heading: '2. Leistungsumfang',
        body: [
          'FSP Terminology stellt ein digitales Lernangebot zur Verfügung, das unter anderem medizinische Fachbegriffe, Patientensprache, strukturierte Lerneinheiten, Tests, Fehlertraining und interaktive Patientengespräche umfasst.',
          'Die Inhalte dienen der sprachlichen und kommunikativen Vorbereitung. FSP Terminology ist kein amtliches Prüfungsprodukt und garantiert weder das Bestehen einer Prüfung noch eine bestimmte Prüfungskommission oder ein bestimmtes Prüfungsergebnis.',
        ],
      },
      {
        heading: '3. Abonnement und Preise',
        body: [
          'Die aktuell angebotenen Abonnements werden auf der Preisseite vor dem Kauf angezeigt. Derzeit werden unter anderem ein Wochenplan für 4,99 € pro Woche, ein Monatsplan für 14,99 € pro Monat und ein 3-Monats-Plan für 29,99 € für drei Monate angeboten.',
          'Ein Abonnement verlängert sich entsprechend seiner jeweiligen Laufzeit, bis es gekündigt wird. Der konkrete Preis und Abrechnungszeitraum werden vor Abschluss der Zahlung angezeigt.',
        ],
      },
      {
        heading: '4. Zahlungsabwicklung',
        body: [
          'Unser Bestellvorgang wird über Paddle.com abgewickelt. Paddle.com handelt als Merchant of Record für unsere Bestellungen und übernimmt die Zahlungsabwicklung sowie die damit verbundenen Kundenservice- und Rückerstattungsprozesse.',
          'Wir speichern keine vollständigen Zahlungs- oder Kartendaten.',
        ],
      },
      {
        heading: '5. Kündigung',
        body: [
          'Ein Abonnement kann jederzeit gekündigt werden. Die Kündigung verhindert weitere Verlängerungen und wird grundsätzlich zum Ende des bereits bezahlten Abrechnungszeitraums wirksam, sofern nicht zwingende gesetzliche Rechte etwas anderes vorsehen.',
          'Die Kündigung kann über das von Paddle bereitgestellte Kundenportal bzw. über den entsprechenden Link in der Zahlungs- oder Bestätigungs-E-Mail erfolgen.',
        ],
      },
      {
        heading: '6. Rückerstattungen und Probleme',
        body: [
          'Wir möchten Probleme zunächst schnell beheben. Wenn ein wesentlicher technischer Fehler oder ein anhaltendes Zugangsproblem dazu führt, dass die gekaufte Leistung nicht wie beschrieben genutzt werden kann und der Fehler nicht innerhalb angemessener Zeit behoben werden kann, kann eine Rückerstattung für die betroffene Zahlung veranlasst werden.',
          'Auch bei einer fehlerhaften oder doppelten Belastung können Sie sich an uns oder direkt an Paddle wenden. Paddle kann vollständige oder teilweise Rückerstattungen bearbeiten.',
          'Darüber hinaus bleiben alle zwingenden gesetzlichen Verbraucherrechte unberührt. Die jeweils geltende Paddle Refund Policy gilt für die über Paddle abgewickelte Transaktion.',
        ],
      },
      {
        heading: '7. Widerruf und Verbraucherrechte',
        body: [
          'Soweit für einen Käufer gesetzliche Widerrufs- oder Rücktrittsrechte gelten, bleiben diese unberührt. Bei digitalen Leistungen können besondere gesetzliche Voraussetzungen gelten, insbesondere wenn die Leistung unmittelbar nach dem Kauf beginnt.',
          'Die für die konkrete Transaktion geltenden Rechte und Verfahren ergeben sich ergänzend aus der Paddle Refund Policy und den anwendbaren Verbraucherschutzvorschriften.',
        ],
      },
      {
        heading: '8. KI-Funktionen',
        body: [
          'Patientengespräche und Auswertungen können mit Hilfe künstlicher Intelligenz erzeugt werden. KI-Antworten und Bewertungen können fehlerhaft oder unvollständig sein und stellen keine medizinische Beratung dar.',
          'Nutzer sollen keine echten Patientendaten oder sonstige vertrauliche personenbezogene Daten in freie Texteingaben eingeben.',
        ],
      },
      {
        heading: '9. Verfügbarkeit und technische Änderungen',
        body: [
          'Wir bemühen uns um eine zuverlässige Verfügbarkeit des Dienstes, können jedoch keine ununterbrochene Verfügbarkeit garantieren. Wartungen, technische Störungen, Ausfälle von Drittanbietern oder Ereignisse außerhalb unseres Einflussbereichs können die Verfügbarkeit vorübergehend beeinträchtigen.',
          'Funktionen, Lerninhalte und technische Komponenten können weiterentwickelt oder geändert werden, solange der wesentliche Vertragszweck nicht unangemessen beeinträchtigt wird.',
        ],
      },
      {
        heading: '10. Nutzerkonto und zulässige Nutzung',
        body: [
          'Ein Nutzerkonto ist persönlich zu verwenden. Zugangsdaten und Login-Codes dürfen nicht an andere Personen weitergegeben werden.',
          'Die Inhalte dürfen nicht ohne Zustimmung kopiert, weiterverkauft, öffentlich verbreitet oder zum Aufbau eines konkurrierenden Dienstes verwendet werden, soweit dies nicht gesetzlich erlaubt ist.',
        ],
      },
      {
        heading: '11. Haftung',
        body: [
          'FSP Terminology ersetzt keine ärztliche Ausbildung, Prüfungsvorbereitung durch eine offizielle Stelle oder medizinische Beratung. Nutzer bleiben für die Verwendung der Lerninhalte und insbesondere für medizinische Entscheidungen außerhalb der Lernumgebung selbst verantwortlich.',
          'Zwingende gesetzliche Haftungsregeln bleiben unberührt.',
        ],
      },
      {
        heading: '12. Änderungen dieser Bedingungen',
        body: [
          'Diese Bedingungen können angepasst werden, wenn dies aufgrund von Änderungen des Dienstes, der Zahlungsabwicklung oder gesetzlicher Anforderungen erforderlich ist. Bei wesentlichen Änderungen werden Nutzer angemessen informiert.',
        ],
      },
      {
        heading: '13. Anwendbares Recht',
        body: [
          'Es gilt das jeweils anwendbare Recht. Zwingende Verbraucherschutzvorschriften des Staates, in dem ein Verbraucher seinen gewöhnlichen Aufenthalt hat, bleiben unberührt, soweit sie anwendbar sind.',
        ],
      },
    ],
  },
  refund: {
    title: 'Rückerstattungsrichtlinie',
    intro: 'Stand: 29. September 2026',
    sections: [
      {
        heading: 'Grundsatz',
        body: [
          'Wir möchten, dass FSP Terminology wie beschrieben funktioniert. Wenn es ein wesentliches technisches Problem gibt, das den Zugriff auf die gekaufte Leistung verhindert oder wesentlich beeinträchtigt und nicht innerhalb angemessener Zeit behoben werden kann, prüfen wir eine Rückerstattung der betroffenen Zahlung.',
          'Zwingende gesetzliche Verbraucherrechte bleiben vollständig unberührt.',
        ],
      },
      {
        heading: 'Wann Sie uns kontaktieren sollten',
        body: [
          'Bitte schreiben Sie an chouaib@by-rtc.com und beschreiben Sie das Problem möglichst konkret. Wenn möglich, fügen Sie die E-Mail-Adresse des Kontos, den betroffenen Bereich und einen Screenshot oder eine kurze Fehlerbeschreibung bei. Bitte senden Sie keine echten Patientendaten.',
        ],
      },
      {
        heading: 'Zahlungen über Paddle',
        body: [
          'Paddle ist Merchant of Record für die über Paddle abgewickelten Käufe. Refund-Anträge können über Paddle.net oder über den Link in Ihrer Zahlungsbestätigung gestellt werden. Paddle entscheidet die Erstattung entsprechend seiner Refund Policy und den anwendbaren gesetzlichen Rechten.',
          'Wenn ein Anspruch wegen eines technischen oder produktbezogenen Mangels besteht, kann Paddle eine Rückerstattung nach Prüfung des Problems vornehmen.',
        ],
      },
      {
        heading: 'Kündigung',
        body: [
          'Sie können Ihr Abonnement jederzeit kündigen, um weitere Verlängerungen zu verhindern. Die Kündigung wirkt grundsätzlich zum Ende des laufenden Abrechnungszeitraums. Eine Kündigung allein bedeutet nicht automatisch eine Rückerstattung für bereits bezahlte Zeiträume, soweit kein gesetzlicher oder vertraglicher Erstattungsgrund besteht.',
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CONTENT).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = CONTENT[slug];
  if (!entry) notFound();

  return (
    <>
      <MarketingTopBar />
      <main className="wrap narrow" style={{ paddingTop: 36, paddingBottom: 56 }}>
        <h2>{entry.title}</h2>
        {entry.intro && <p className="small-muted">{entry.intro}</p>}
        {entry.sections.map((section) => (
          <section key={section.heading} style={{ marginTop: 28 }}>
            <h3 style={{ marginBottom: 10 }}>{section.heading}</h3>
            {section.body.map((p, i) => (
              <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
            ))}
          </section>
        ))}
      </main>
      <MarketingFooter />
    </>
  );
}
