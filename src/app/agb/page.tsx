export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-primary hover:underline text-sm mb-6 inline-block">← Zurück zur Startseite</a>
        <h1 className="text-4xl font-display font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
        <div className="space-y-6 text-muted-foreground">
          <h2 className="text-xl font-display font-semibold text-foreground">§ 1 Geltungsbereich</h2>
          <p>Diese AGB gelten für die Nutzung der Lernplattform Wortwende. Durch die Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 2 Leistungsbeschreibung</h2>
          <p>Wortwende bietet eine interaktive Lernplattform zum Erlernen der deutschen Sprache von Niveau A1 bis C1. Der Service umfasst Lektionen, Übungen, Vokabeltrainer und Fortschrittsverfolgung.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 3 Registrierung</h2>
          <p>Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 4 Nutzungsrechte</h2>
          <p>Sie erhalten ein nicht-exklusives, nicht übertragbares Recht zur Nutzung der Plattform für persönliche Lernzwecke. Kommerzielle Nutzung ist ohne Genehmigung nicht gestattet.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 5 Haftungsausschluss</h2>
          <p>Wir übernehmen keine Haftung für die Richtigkeit der Lerninhalte oder für Ausfallzeiten der Plattform.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 6 Kündigung</h2>
          <p>Sie können Ihr Konto jederzeit über die Einstellungen löschen. Wir behalten uns das Recht vor, Konten bei Verstößen zu sperren.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">§ 7 Schlussbestimmungen</h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist [Ort].</p>
        </div>
      </div>
    </div>
  );
}
