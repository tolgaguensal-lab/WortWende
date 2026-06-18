import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { Animated, Stagger, AnimatedStat, HoverCard } from "@/components/shared/Animated";

const features = [
  { icon: "GraduationCap", title: "CEFR-Strukturiert", desc: "A1 bis C1 – ausgerichtet am Gemeinsamen Europaischen Referenzrahmen fur transparente Lernziele." },
  { icon: "BookOpen", title: "Alltagsorientiert", desc: "Lebensnahe Themen: Arbeit, Wohnungssuche, Arztbesuche, Behordengange – was wirklich relevant ist." },
  { icon: "Headphones", title: "Horen & Verstehen", desc: "Authentisches Horverstehen mit Dialogen, Ansagen und Nachrichten auf jedem Niveau." },
  { icon: "MessageSquare", title: "Sprechen trainieren", desc: "Interaktive Sprechubungen mit Spracherkennung fur Aussprache und fließende Kommunikation." },
  { icon: "BarChart3", title: "Fortschritt sichtbar", desc: "Detaillierte Statistiken, Lernserien und personalisierte Wiederholungen fur nachhaltigen Erfolg." },
  { icon: "Globe", title: "Mehrsprachig", desc: "Erklarungen auf Turkisch, Russisch, Arabisch, Englisch und weiteren Sprachen – barrierefrei." },
];

const levels = [
  { code: "A1", name: "Anfanger", desc: "Erste Satze, sich vorstellen", colors: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" },
  { code: "A2", name: "Grundkenntnisse", desc: "Alltagssituationen bewaltigen", colors: "border-sky-500/30 bg-sky-500/5 text-sky-400" },
  { code: "B1", name: "Selbstandig", desc: "DTZ-Prufung, Arbeitsplatz", colors: "border-amber-500/30 bg-amber-500/5 text-amber-400" },
  { code: "B2", name: "Fortgeschritten", desc: "Komplexe Gesprache fuhren", colors: "border-orange-500/30 bg-orange-500/5 text-orange-400" },
  { code: "C1", name: "Kompetent", desc: "Akademisches Niveau", colors: "border-rose-500/30 bg-rose-500/5 text-rose-400" },
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
    <div className="min-h-screen bg-gradient-to-b from-[hsl(235,45%,8%)] via-[hsl(235,40%,12%)] to-[hsl(235,45%,8%)]">
      <Animated type="fadeIn" className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(235,45%,55%)] to-[hsl(235,45%,40%)] flex items-center justify-center shadow-lg shadow-[hsl(235,45%,40%)/30]">
            <span className="text-white font-display font-bold text-lg">W</span>
          </div>
          <span className="text-xl font-display font-bold text-white tracking-tight">WortHeld</span>
          <span className="hidden sm:inline text-[11px] text-white/30 font-medium uppercase tracking-[0.15em] ml-2">Deutsch lernen</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm">Anmelden</Button></Link>
          <Link href="/register"><Button className="bg-white text-[hsl(235,45%,15%)] hover:bg-white/90 shadow-lg shadow-white/10 font-semibold text-sm px-5 h-9">Kostenlos starten</Button></Link>
        </div>
      </Animated>

      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[hsl(235,45%,55%)]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[hsl(38,92%,50%)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative text-center max-w-4xl mx-auto">
          <Animated type="fadeUp" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-8 backdrop-blur-sm">
              <Sparkles size={12} className="text-[hsl(38,92%,54%)]" />
              BAMF-konforme Integrationskurse – A1 bis C1
            </div>
          </Animated>
          
          <Animated type="fadeUp" delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Deutsch fur
              <br />
              <span className="text-gradient-accent">Alltag, Beruf &amp; Integration</span>
            </h1>
          </Animated>
          
          <Animated type="fadeUp" delay={0.3}>
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-body">
              Systematischer Lernpfad nach dem Gemeinsamen Europaischen Referenzrahmen.
              Entwickelt fur Integrationskurse, Berufsvorbereitung und die DTZ-Prufung.
            </p>
          </Animated>
          
          <Animated type="fadeUp" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register">
                <Button size="lg" className="bg-white text-[hsl(235,45%,12%)] hover:bg-white/90 text-base px-8 py-6 h-auto shadow-2xl shadow-white/10 font-semibold group">
                  Kostenlos starten
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/placement-test">
                <Button size="lg" variant="outline" className="border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 text-base px-8 py-6 h-auto">
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

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Warum WortHeld?</h2>
          <p className="text-white/40 max-w-xl mx-auto">Ein durchdachtes Lernsystem, das dich von null auf sicher begleitet.</p>
        </Animated>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <HoverCard key={i} className="card-premium !bg-white/[0.04] !border-white/[0.08] hover:!bg-white/[0.07] p-6">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <div className="w-5 h-5 rounded-sm bg-white/20" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </HoverCard>
          ))}
        </Stagger>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Deine Niveaustufen</h2>
          <p className="text-white/40 max-w-xl mx-auto">Vom Anfanger bis zur beruflichen Sprachkompetenz.</p>
        </Animated>
        <Stagger className="grid md:grid-cols-5 gap-4">
          {levels.map((l) => (
            <HoverCard key={l.code} className={`rounded-xl border ${l.colors} p-5 text-center`}>
              <div className={`text-3xl font-display font-bold ${l.colors.split(" ")[2]} mb-1`}>{l.code}</div>
              <div className="text-white/70 text-sm font-medium mb-2">{l.name}</div>
              <div className="text-white/30 text-xs leading-relaxed">{l.desc}</div>
            </HoverCard>
          ))}
        </Stagger>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Haufige Fragen</h2>
        </Animated>
        <Stagger className="space-y-4">
          {faqItems.map((item, i) => (
            <Animated key={i} type="fadeUp" className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5">
              <h3 className="text-white font-semibold mb-1">{item.q}</h3>
              <p className="text-white/40 text-sm">{item.a}</p>
            </Animated>
          ))}
        </Stagger>
      </section>

      <Animated type="scaleIn" className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="rounded-2xl bg-gradient-to-br from-[hsl(235,45%,55%)]/20 to-[hsl(235,45%,30%)]/10 border border-[hsl(235,45%,55%)]/20 p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Bereit, Deutsch zu lernen?</h2>
          <p className="text-white/40 max-w-md mx-auto mb-8">Starte kostenlos mit dem Einstufungstest und erhalte einen personalisierten Lernplan.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"><Button size="lg" className="bg-white text-[hsl(235,45%,12%)] hover:bg-white/90 text-base px-8 py-6 h-auto shadow-2xl shadow-white/10 font-semibold">Kostenlos starten <ChevronRight size={18} className="ml-1" /></Button></Link>
            <Link href="/placement-test"><Button size="lg" variant="outline" className="border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 text-base px-8 py-6 h-auto">Einstufungstest machen</Button></Link>
          </div>
        </div>
      </Animated>

      <Animated type="fadeIn" className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[hsl(235,45%,55%)] to-[hsl(235,45%,40%)] flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">W</span>
            </div>
            <span className="text-white/30 text-sm">WortHeld &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/datenschutz" className="text-white/30 hover:text-white/60 transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="text-white/30 hover:text-white/60 transition-colors">Impressum</Link>
            <Link href="/agb" className="text-white/30 hover:text-white/60 transition-colors">AGB</Link>
          </div>
        </div>
      </Animated>
    </div>
  );
}
