import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicTopBar } from "@/components/shared/PublicTopBar";
import { Bot, Brain, Globe, Shield, Zap, Mic, MessageSquare, Target, ArrowRight, CheckCircle2, Server, BookOpen, Users, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Methode – Wortwende",
  description: "Wie Wortwende funktioniert: KI-Tutor Leo, CEFR-Lernpfad A1-C1, 10 Muttersprachen, DSGVO-konform auf eigenen Servern.",
};

const features = [
  {
    icon: Brain,
    title: "KI-Tutor Leo – Dein persönlicher Lehrer",
    desc: "Leo ist kein Chatbot. Er ist ein proaktiver Tutor, der deine Fehler analysiert, Übungen anpasst und dich Schritt für Schritt zum nächsten Level führt. 24/7 verfügbar, unendlich geduldig.",
    points: ["Echtzeit-Feedback bei Grammatik und Aussprache", "Passt sich deinem Lerntempo an", "Erklärt auf Deutsch oder in deiner Muttersprache"],
  },
  {
    icon: Target,
    title: "CEFR-Lernpfad von A1 bis C1",
    desc: "Unser Lehrplan folgt dem Gemeinsamen Europäischen Referenzrahmen (GER). Vom ersten Wort bis zur fließenden Kommunikation – strukturiert in 5 Niveaustufen.",
    points: ["A1: Grundlagen – erste Wörter und einfache Sätze", "A2: Alltag – verstehen und reagieren", "B1: Sicher kommunizieren im Alltag", "B2: Beruf, Meinung und Diskussion", "C1: Präzise, frei und selbstbewusst"],
  },
  {
    icon: Globe,
    title: "10 Muttersprachen – Lerne aus deiner Sprache",
    desc: "Der Tutor spricht deine Sprache. Egal ob Türkisch, Arabisch, Russisch oder Polnisch – Leo erklärt Grammatik in deiner Muttersprache. So verstehst du nicht nur das Was, sondern auch das Warum.",
    points: ["Türkisch, Arabisch, Russisch, Polnisch", "Rumänisch, Ukrainisch, Albanisch, Kurdisch", "Italienisch und Englisch"],
  },
  {
    icon: Mic,
    title: "Sprechen, Hören, Schreiben – Alles in einem",
    desc: "Sprach-Eingabe per Mikrofon, Text-to-Speech für die Tutor-Antworten, und ein Schreib-Trainer mit Grammatik-Prüfung. Du übst genau die Fähigkeiten, die du im echten Leben brauchst.",
    points: ["Sprich mit dem Tutor – er versteht dich", "Hör die korrekte Aussprache", "Schreib Texte und lass sie korrigieren"],
  },
  {
    icon: Shield,
    title: "DSGVO-konform – Deine Daten bleiben bei dir",
    desc: "Keine US-Cloud, kein Tracking, keine Werbung. WortWende läuft auf eigenen Servern in Deutschland. Der KI-Tutor nutzt DeepSeek mit Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO.",
    points: ["Server-Standort Deutschland (ZimaOS)", "AVV mit KI-Anbieter", "Datenexport und -löschung per Knopfdruck", "Keine Cookies von Drittanbietern"],
  },
  {
    icon: Zap,
    title: "Immer verfügbar – Ohne Termin, ohne Druck",
    desc: "Kein fester Stundenplan, keine peinlichen Momente. Übe wann und wo du willst. Der Tutor ist immer da, korrigiert dich sanft und merkt sich deinen Fortschritt.",
    points: ["24/7 verfügbar", "Kein Termin nötig", "Druckfreie Lernumgebung", "Lern in deinem eigenen Tempo"],
  },
];

const stats = [
  { value: "1.200+", label: "Vokabeln" },
  { value: "85+", label: "Grammatikthemen" },
  { value: "10", label: "Muttersprachen" },
  { value: "5", label: "CEFR-Niveaus" },
];

export default function MethodePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicTopBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-wider mb-6">
            <Zap size={14} /> Unsere Methode
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Deutsch lernen, <span className="text-accent">wie es wirklich funktioniert</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kein stures Vokabelpauken. Kein veralteter Lehrplan. Sondern ein KI-Tutor, der dich versteht – in deiner Sprache, auf deinem Niveau, zu deiner Zeit.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-accent">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        {features.map((f, i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center`}>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <f.icon size={14} /> {f.title.split("–")[0].trim()}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">{f.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
              <ul className="space-y-2">
                {f.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <f.icon size={80} className="text-primary/30" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Bereit für deinen Durchbruch?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Starte jetzt kostenlos. Dein KI-Tutor Leo wartet schon auf dich.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-base px-8 py-6 h-auto font-extrabold">
                <Bot size={20} className="mr-2" />Kostenlos starten <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/placement-test">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10">
                Einstufungstest machen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
