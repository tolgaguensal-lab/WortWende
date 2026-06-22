export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-primary hover:underline text-sm mb-6 inline-block">← Zurück zur Startseite</a>
        <h1 className="text-4xl font-display font-bold mb-8">Datenschutzerklärung</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-xl font-display font-semibold text-foreground">1. Verantwortlicher</h2>
          <p>Verantwortlicher für die Datenverarbeitung auf dieser Website ist:<br />Tolga Günsal<br />E-Mail: hallo@guenlab.de</p>

          <h2 className="text-xl font-display font-semibold text-foreground">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung unserer Dienste erforderlich ist. Dazu gehören: Name, E-Mail-Adresse, Lernfortschritte, Nutzungsstatistiken.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">3. Zweck der Datenverarbeitung</h2>
          <p>Ihre Daten werden ausschließlich zur Bereitstellung und Verbesserung unseres Lernangebots verwendet, einschließlich: Personalisierung des Lernfortschritts, Bereitstellung von Statistiken, Versenden von Lernerinnerungen.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">4. Rechtsgrundlage (Art. 6 DSGVO)</h2>
          <p>Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und zur Erfüllung unseres Leistungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).</p>

          <h2 className="text-xl font-display font-semibold text-foreground">5. Speicherdauer</h2>
          <p>Ihre Daten werden nur so lange gespeichert, wie es für die Zwecke der Datenverarbeitung erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">6. Ihre Rechte</h2>
          <p>Sie haben das Recht auf: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einspruch (Art. 21 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO).</p>

          <h2 className="text-xl font-display font-semibold text-foreground">7. Kontakt</h2>
          <p>Bei Datenschutzanfragen wenden Sie sich bitte an: hallo@guenlab.de</p>

          <h2 className="text-xl font-display font-semibold text-foreground">8. Mobile App (iOS &amp; Android)</h2>
          <p>Die Wortwende-App ist als Progressive Web App (PWA) sowie als native App f&uuml;r iOS und Android verf&uuml;gbar. Zus&auml;tzlich zur Website-Nutzung gilt:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mikrofon:</strong> Wird ausschlie&szlig;lich f&uuml;r die Sprach-Eingabe im KI-Tutor verwendet. Keine Aufzeichnung, keine Speicherung.</li>
            <li><strong>Push-Benachrichtigungen:</strong> Optionale Lernerinnerungen. K&ouml;nnen in den Ger&auml;te-Einstellungen deaktiviert werden.</li>
            <li><strong>Offline-Daten:</strong> Die App speichert keine personenbezogenen Daten lokal. Alle Daten liegen auf unseren Servern in Deutschland.</li>
            <li><strong>Tracking:</strong> Keine Werbe-Tracker. Keine Analyse-Tools. Keine Weitergabe an Dritte.</li>
          </ul>

          <h2 className="text-xl font-display font-semibold text-foreground">9. Kinder &amp; Jugendschutz</h2>
          <p>Wortwende ist f&uuml;r Lernende jeden Alters geeignet. Wir erf&uuml;llen die Anforderungen der DSGVO f&uuml;r Minderj&auml;hrige.</p>
        </div>
      </div>
    </div>
  );
}
