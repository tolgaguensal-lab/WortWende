import { PublicTopBar } from "@/components/shared/PublicTopBar";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicTopBar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-primary hover:underline text-sm mb-6 inline-block">← Zurück zur Startseite</a>
        <h1 className="text-4xl font-display font-bold mb-8">Datenschutzerklärung</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-xl font-display font-semibold text-foreground">1. Verantwortlicher</h2>
          <p>Verantwortlicher für die Datenverarbeitung auf dieser Website ist:<br />Tolga Günsal<br />E-Mail: hallo@guenlab.de</p>

          <h2 className="text-xl font-display font-semibold text-foreground">2. Hosting &amp; Server-Standort</h2>
          <p>Die Wortwende-Plattform wird auf eigenen Servern (ZimaOS, Deutschland) betrieben. Es findet kein Hosting durch Drittanbieter statt. Server-Logs (IP-Adresse, Zeitstempel, angeforderte URL) werden für maximal 30 Tage zur Missbrauchsabwehr gespeichert.</p>

          <h2 className="text-xl font-display font-semibold text-foreground">3. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung unserer Dienste erforderlich ist. Dazu gehören: Name, E-Mail-Adresse, Lernfortschritte, Nutzungsstatistiken.</p>
          <p><strong>Google OAuth:</strong> Du kannst dich mit deinem Google-Konto anmelden. Dabei werden dein Name und deine E-Mail-Adresse von Google an uns übermittelt. Google erhält die Information, dass du unsere App nutzt. Die Datenschutzerklärung von Google gilt zusätzlich: <a href="https://policies.google.com/privacy" className="text-primary hover:underline">policies.google.com/privacy</a>.</p>

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

          <h2 className="text-xl font-display font-semibold text-foreground">10. KI-Tutor (DeepSeek V4 Flash)</h2>
          <p>Unser KI-Tutor &bdquo;Leo&ldquo; nutzt die DeepSeek V4 Flash API (Anbieter: DeepSeek, Hangzhou, China). Dabei gilt:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Daten&uuml;bermittlung:</strong> Deine Chat-Nachrichten werden an die DeepSeek-API gesendet, um eine KI-Antwort zu generieren. Es werden keine personenbezogenen Daten (Name, E-Mail) mitgesendet – nur der Chat-Verlauf und dein CEFR-Sprachniveau.</li>
            <li><strong>Kein Training:</strong> DeepSeek speichert oder verwendet die API-Anfragen nicht zum Training ihrer Modelle (Zero Data Retention).</li>
            <li><strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und zur Erf&uuml;llung unseres Leistungsvertrags (Art. 6 Abs. 1 lit. b DSGVO). Du kannst den KI-Tutor jederzeit nicht nutzen – alle anderen Funktionen bleiben verf&uuml;gbar.</li>
            <li><strong>Prompt Caching:</strong> Der System-Prompt (Tutor-Pers&ouml;nlichkeit) wird bei DeepSeek gecached, um Kosten zu sparen. Der Cache enth&auml;lt keine personenbezogenen Daten.</li>
          </ul>

          <h2 className="text-xl font-display font-semibold text-foreground">11. Deine Rechte im Detail</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datenexport (Art. 20 DSGVO):</strong> In den Einstellungen kannst du jederzeit alle deine Daten als JSON-Datei exportieren.</li>
            <li><strong>L&ouml;schung (Art. 17 DSGVO):</strong> In den Einstellungen kannst du dein Konto und alle deine Daten endg&uuml;ltig l&ouml;schen. Alternativ per E-Mail an hallo@guenlab.de.</li>
            <li><strong>Widerspruch (Art. 21 DSGVO):</strong> Du kannst der Verarbeitung deiner Daten jederzeit widersprechen.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
