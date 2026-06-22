import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { BookOpen, Headphones, MessageSquare, PenLine, Sigma, Building2, Heart, Briefcase, GraduationCap, Baby, Home, ShoppingCart, Bus, Landmark, Shield } from "lucide-react";

const bamfModules = [
  {
    level: "A1",
    color: "text-primary border-primary/30 bg-primary/5",
    modules: [
      { name: "Ich und die anderen", topics: ["Begrüßung", "Familie", "Freunde", "Hobbys"], lessons: 12, hours: 50 },
      { name: "Einkaufen & Alltag", topics: ["Supermarkt", "Preise", "Öffnungszeiten", "Kleidung"], lessons: 10, hours: 45 },
      { name: "Wohnen", topics: ["Wohnungssuche", "Möbel", "Mietvertrag", "Nachbarn"], lessons: 10, hours: 45 },
      { name: "Gesundheit", topics: ["Arzttermin", "Apotheke", "Körperteile", "Symptome"], lessons: 8, hours: 35 },
      { name: "Arbeit & Beruf", topics: ["Berufe", "Tagesablauf", "Arbeitsplatz", "Kollegen"], lessons: 8, hours: 35 },
      { name: "Behörden & Formulare", topics: ["Anmeldung", "Formulare", "Personalausweis", "Termine"], lessons: 8, hours: 35 },
    ],
  },
  {
    level: "A2",
    color: "text-sky-600 border-sky-500/30 bg-sky-500/5",
    modules: [
      { name: "Kommunikation im Alltag", topics: ["Telefonate", "E-Mails", "Small Talk", "Einladungen"], lessons: 10, hours: 45 },
      { name: "Arbeitssuche", topics: ["Bewerbung", "Lebenslauf", "Vorstellungsgespräch", "Arbeitsvertrag"], lessons: 12, hours: 55 },
      { name: "Schule & Bildung", topics: ["Schulsystem", "Elternabend", "Zeugnisse", "Ausbildung"], lessons: 10, hours: 45 },
      { name: "Mobilität", topics: ["Bus & Bahn", "Fahrplan", "Führerschein", "Auto"], lessons: 8, hours: 35 },
      { name: "Bank & Versicherung", topics: ["Kontoeröffnung", "Überweisung", "Krankenversicherung", "Haftpflicht"], lessons: 8, hours: 35 },
    ],
  },
  {
    level: "B1",
    color: "text-amber-600 border-amber-500/30 bg-amber-500/5",
    modules: [
      { name: "Gesellschaft & Politik", topics: ["Wahlsystem", "Grundgesetz", "Rechte", "Pflichten"], lessons: 10, hours: 50 },
      { name: "Berufliche Kommunikation", topics: ["Meetings", "Präsentationen", "Berichte", "Konflikte"], lessons: 10, hours: 50 },
      { name: "Medien & Digitales", topics: ["Internet", "Online-Formulare", "E-Government", "Datenschutz"], lessons: 8, hours: 40 },
      { name: "Kultur & Freizeit", topics: ["Vereine", "Feste", "Traditionen", "Ehrenamt"], lessons: 8, hours: 40 },
      { name: "DTZ-Vorbereitung", topics: ["Leseverstehen", "Hörverstehen", "Schreiben", "Sprechen"], lessons: 12, hours: 60 },
    ],
  },
];

const lifeSituationMap = [
  { icon: Building2, label: "Amt & Behörde", lessons: 18, color: "text-blue-600 bg-blue-50" },
  { icon: Heart, label: "Arzt & Gesundheit", lessons: 14, color: "text-red-600 bg-red-50" },
  { icon: Briefcase, label: "Arbeit & Beruf", lessons: 22, color: "text-indigo-600 bg-indigo-50" },
  { icon: GraduationCap, label: "Schule & Bildung", lessons: 12, color: "text-purple-600 bg-purple-50" },
  { icon: Baby, label: "Kita & Familie", lessons: 8, color: "text-pink-600 bg-pink-50" },
  { icon: Home, label: "Wohnen & Umzug", lessons: 14, color: "text-amber-600 bg-amber-50" },
  { icon: ShoppingCart, label: "Einkaufen", lessons: 10, color: "text-success bg-success-muted" },
  { icon: Bus, label: "Verkehr & Mobilität", lessons: 10, color: "text-cyan-600 bg-cyan-50" },
  { icon: Landmark, label: "Bank & Finanzen", lessons: 8, color: "text-slate-600 bg-slate-50" },
  { icon: Shield, label: "Versicherung", lessons: 6, color: "text-orange-600 bg-orange-50" },
];

const dtzkills = [
  { skill: "Leseverstehen", icon: BookOpen, parts: 3, duration: "25 Min.", desc: "Briefe, Anzeigen, Artikel verstehen" },
  { skill: "Hörverstehen", icon: Headphones, parts: 3, duration: "20 Min.", desc: "Durchsagen, Gespräche, Nachrichten" },
  { skill: "Schreiben", icon: PenLine, parts: 2, duration: "30 Min.", desc: "Formulare ausfüllen, Brief schreiben" },
  { skill: "Sprechen", icon: MessageSquare, parts: 3, duration: "15 Min.", desc: "Sich vorstellen, Thema präsentieren, gemeinsam planen" },
];

export default function BAMFMappingPage() {
  const totalLessons = bamfModules.reduce((sum, level) => sum + level.modules.reduce((s, m) => s + m.lessons, 0), 0);
  const totalHours = bamfModules.reduce((sum, level) => sum + level.modules.reduce((s, m) => s + m.hours, 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <PageHeader
        title="BAMF-Rahmencurriculum"
        description="Unsere Lerninhalte sind vollständig am Rahmencurriculum für Integrationskurse des BAMF ausgerichtet — vom ersten Wort bis zur DTZ-Prüfung."
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "A1–B1", label: "Niveaustufen", icon: GraduationCap },
          { value: totalLessons.toString(), label: "Lektionen", icon: BookOpen },
          { value: totalHours.toString(), label: "Unterrichtsstunden", icon: Sigma },
          { value: "10", label: "Lebensbereiche", icon: Building2 },
        ].map((stat) => (
          <Card key={stat.label} variant="elevated" className="p-4 text-center">
            <stat.icon size={20} className="mx-auto mb-2 text-primary/60" />
            <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* CEFR Level Modules */}
      {bamfModules.map((level) => (
        <section key={level.level}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${level.color} flex items-center justify-center`}>
              <span className="font-display font-bold text-lg">{level.level}</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground">
                {level.level === "A1" ? "Elementare Sprachverwendung" : level.level === "A2" ? "Grundlegende Kenntnisse" : "Selbstständige Sprachverwendung"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {level.modules.length} Module · {level.modules.reduce((s, m) => s + m.lessons, 0)} Lektionen · {level.modules.reduce((s, m) => s + m.hours, 0)} Stunden
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {level.modules.map((mod) => (
              <Card key={mod.name} variant="outline" className="p-4">
                <h4 className="font-semibold text-foreground mb-2">{mod.name}</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {mod.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{mod.lessons} Lektionen</span>
                  <span>{mod.hours} UE</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Life Situations */}
      <section>
        <h3 className="text-xl font-display font-semibold text-foreground mb-4">Lebensbereiche nach BAMF</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {lifeSituationMap.map((ls) => (
            <Card key={ls.label} variant="default" className="p-3 text-center">
              <div className={`w-8 h-8 rounded-lg ${ls.color} flex items-center justify-center mx-auto mb-2`}>
                <ls.icon size={16} />
              </div>
              <div className="text-xs font-medium text-foreground leading-tight">{ls.label}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{ls.lessons} Lektionen</div>
            </Card>
          ))}
        </div>
      </section>

      {/* DTZ Exam Structure */}
      <section>
        <h3 className="text-xl font-display font-semibold text-foreground mb-4">DTZ-Prüfung (Deutsch-Test für Zuwanderer)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Der DTZ ist die Abschlussprüfung des Integrationskurses. Er prüft alle vier Fertigkeiten auf den Niveaus A2–B1.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dtzkills.map((skill) => (
            <Card key={skill.skill} variant="elevated" className="p-4">
              <skill.icon size={22} className="text-primary mb-3" />
              <h4 className="font-semibold text-foreground text-sm mb-1">{skill.skill}</h4>
              <p className="text-xs text-muted-foreground mb-2">{skill.desc}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{skill.parts} Teile</span>
                <span>{skill.duration}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* BAMF Approval Note */}
      <Card variant="outline" className="p-6 bg-primary-muted/10 border-primary/20">
        <div className="flex items-start gap-3">
          <GraduationCap size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">BAMF-Ausrichtung</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Wortwende orientiert sich am Rahmencurriculum für Integrationskurse des Bundesamts für Migration und Flüchtlinge (BAMF).
              Unsere Inhalte decken die 10 Lebensbereiche, alle vier Sprachfertigkeiten und die DTZ-Prüfungsformate ab.
              Die Lektionen folgen dem handlungsorientierten Ansatz des Gemeinsamen Europäischen Referenzrahmens (GER/CEFR).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
