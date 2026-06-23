import { PublicTopBar } from "@/components/shared/PublicTopBar";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicTopBar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-primary hover:underline text-sm mb-6 inline-block">← Zurück zur Startseite</a>
        <h1 className="text-4xl font-display font-bold mb-8">Impressum</h1>
        <div className="space-y-6 text-muted-foreground">
          <h2 className="text-xl font-display font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <p><strong>Wortwende</strong><br />Tolga Günsal<br />{/* TODO_LEGAL_REQUIRED: Straße und Hausnummer eintragen */}TODO_LEGAL_REQUIRED: Straße, Hausnummer<br />{/* TODO_LEGAL_REQUIRED: PLZ und Stadt eintragen */}TODO_LEGAL_REQUIRED: PLZ, Stadt<br />Deutschland<br /><br />E-Mail: hallo@guenlab.de</p>

          <h2 className="text-xl font-display font-semibold text-foreground">Kontakt</h2>
          <p>E-Mail: hallo@guenlab.de</p>

          <h2 className="text-xl font-display font-semibold text-foreground">Verantwortlich für den Inhalt</h2>
          <p>Tolga Günsal</p>

          <h2 className="text-xl font-display font-semibold text-foreground">EU-Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/</p>
        </div>
      </div>
    </div>
  );
}
