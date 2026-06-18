import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, ChevronRight, GraduationCap, BookOpen, Headphones, MessageSquare, BarChart3, Globe } from "lucide-react";
import { Animated, Stagger, AnimatedStat, HoverCard } from "@/components/shared/Animated";

const features = [
  { icon: GraduationCap, title: "CEFR-Strukturiert", desc: "A1 bis C1 – ausgerichtet am Gemeinsamen Europaischen Referenzrahmen fur transparente Lernziele." },
  { icon: BookOpen, title: "Alltagsorientiert", desc: "Lebensnahe Themen: Arbeit, Wohnungssuche, Arztbesuche, Behordengange – was wirklich relevant ist." },
  { icon: Headphones, title: "Horen & Verstehen", desc: "Authentisches Horverstehen mit Dialogen, Ansagen und Nachrichten auf jedem Niveau." },
  { icon: MessageSquare, title: "Sprechen trainieren", desc: "Interaktive Sprechubungen mit Spracherkennung fur Aussprache und fließende Kommunikation." },
  { icon: BarChart3, title: "Fortschritt sichtbar", desc: "Detaillierte Statistiken, Lernserien und personalisierte Wiederholungen fur nachhaltigen Erfolg." },
  { icon: Globe, title: "Mehrsprachig", desc: "Erklarungen auf Turkisch, Russisch, Arabisch, Englisch und weiteren Sprachen – barrierefrei." },
];

const levels = [
  { code: "A1", name: "Anfanger", desc: "Erste Satze, sich vorstellen", colors: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" },
  { code: "A2", name: "Grundkenntnisse", desc: "Alltagssituationen bewaltigen", colors: "border-sky-500/30 bg-sky-500/5 text-sky-600" },
  { code: "B1", name: "Selbstandig", desc: "DTZ-Prufung, Arbeitsplatz", colors: "border-amber-500/30 bg-amber-500/5 text-amber-600" },
  { code: "B2", name: "Fortgeschritten", desc: "Komplexe Gesprache fuhren", colors: "border-orange-500/30 bg-orange-500/5 text-orange-600" },
  { code: "C1", name: "Kompetent", desc: "Akademisches Niveau", colors: "border-rose-500/30 bg-rose-500/5 text-rose-600" },
];

const faqItems = [
  { q: "Ist der Einstufungstest kostenlos?", a: "Ja, der Einstufungstest ist komplett kostenlos und dauert nur etwa 10 Minuten." },
  { q: "Welches Niveau kann ich erreichen?", a: "Unser Kurs deckt die Niveaus A1 bis C1 nach dem GER/CEFR ab." },
  { q: "Gibt es eine mobile App?", a: "Die Web-App ist vollstandig responsive und funktioniert auf allen Geraten." },
  { q: "Wie viel kostet ein Sprachniveau?", a: "Basislektionen sind kostenlos. Fur die vollstandigen Niveaus gibt es flexible Kauf- und Abo-Optionen." },
];

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md">
              <img src="/logo.png" alt="Echo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-display font-bold text-foreground tracking-tight">Echo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-all text-sm">
                Anmelden
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="bg-primary text-primary-foreground font-semibold text-sm px-5 h-9">
                Kostenlos starten
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-28">
        <div className="relative text-center max-w-4xl mx-auto">
          <Animated type="fadeUp" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-muted text-primary text-xs font-medium mb-8">
              <Sparkles size={12} />
              BAMF-konforme Integrationskurse – A1 bis C1
            </div>
          </Animated>
          
          <Animated type="fadeUp" delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
              Deutsch fur
              <br />
              <span className="text-primary">Alltag, Beruf &amp; Integration</span>
            </h1>
          </Animated>
          
          <Animated type="fadeUp" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body">
              Systematischer Lernpfad nach dem Gemeinsamen Europaischen Referenzrahmen.
              Entwickelt fur Integrationskurse, Berufsvorbereitung und die DTZ-Prufung.
            </p>
          </Animated>
          
          <Animated type="fadeUp" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register">
                <Button size="lg" variant="primary" className="bg-primary text-primary-foreground text-base px-8 py-6 h-auto shadow-lg font-semibold group">
                  Kostenlos starten
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/placement-test">
                <Button size="lg" variant="outline" className="text-foreground border-border bg-background text-base px-8 py-6 h-auto">
                  Einstufungstest machen
                </Button>
              </Link>
            </div>
          </Animated>

          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Vokabeln pro Niveau" },
              { value: "65+", label: "Grammatikthemen" },
              { value: "5", label: "Sprachniveaus (A1-C1)" },
              { value: "10+", label: "Erklarungssprachen" },
            ].map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} />
            ))}
          </Stagger>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Warum Echo?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Ein durchdachtes Lernsystem, das dich von null auf sicher begleitet.</p>
        </Animated>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card key={i} variant="default" className="p-6 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center mb-4 text-primary">
                <f.icon size={20} />
              </div>
              <h3 className="text-foreground font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </Stagger>
      </section>

      {/* Levels Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Deine Niveaustufen</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Vom Anfanger bis zur beruflichen Sprachkompetenz.</p>
        </Animated>
        <Stagger className="grid md:grid-cols-5 gap-4">
          {levels.map((l) => (
            <HoverCard key={l.code} className={`rounded-xl border ${l.colors} p-5 text-center`}>
              <div className={`text-3xl font-display font-bold ${l.colors.split(" ")[2]} mb-1`}>{l.code}</div>
              <div className="text-foreground text-sm font-medium mb-2">{l.name}</div>
              <div className="text-muted-foreground text-xs leading-relaxed">{l.desc}</div>
            </HoverCard>
          ))}
        </Stagger>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Haufige Fragen</h2>
        </Animated>
        <Stagger className="space-y-4">
          {faqItems.map((item, i) => (
            <Card key={i} variant="outline" className="p-5">
              <h3 className="text-foreground font-semibold mb-1">{item.q}</h3>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </Card>
          ))}
        </Stagger>
      </section>

      {/* Bottom CTA */}
      <Animated type="scaleIn" className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <Card variant="elevated" className="p-10 md:p-16 text-center bg-primary-muted/30 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Bereit, Deutsch zu lernen?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">Starte kostenlos mit dem Einstufungstest und erhalte einen personalisierten Lernplan.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary" className="bg-primary text-primary-foreground text-base px-8 py-6 h-auto shadow-lg font-semibold">
                Kostenlos starten <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
            <Link href="/placement-test">
              <Button size="lg" variant="outline" className="text-foreground border-border bg-background text-base px-8 py-6 h-auto">
                Einstufungstest machen
              </Button>
            </Link>
          </div>
        </Card>
      </Animated>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md overflow-hidden">
              <img src="/logo.png" alt="Echo" className="w-full h-full object-cover" />
            </div>
            <span className="text-muted-foreground text-sm">Echo &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/datenschutz" className="text-muted-foreground hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="text-muted-foreground hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/agb" className="text-muted-foreground hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
