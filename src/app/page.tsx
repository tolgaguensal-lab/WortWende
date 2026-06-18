import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoFull } from "@/components/brand/LogoMark";
import { LanguageDoorIllustration } from "@/components/brand/LanguageDoorIllustration";
import { ArrowRight, Sparkles, BookOpen, MessageSquare, Target, Heart, Zap } from "lucide-react";
import { Animated, Stagger, HoverCard } from "@/components/shared/Animated";

const features = [
  { icon: BookOpen, title: "ECHTE SPRACHE", desc: "Alltagstauglich und praxisnah lernen — vom ersten Wort bis zur Unterhaltung." },
  { icon: Target, title: "DEIN FORTSCHRITT", desc: "Kleine Schritte, große Wirkung. Von A1 bis C1 mit klaren Lernzielen." },
  { icon: Zap, title: "KLICK-MOMENTE", desc: "Verstehen, bis es Klick macht. Aha-Momente, die motivieren und bleiben." },
  { icon: Heart, title: "FÜR DICH DA", desc: "Persönlich, empathisch und motivierend — mit echten Alltagssituationen." },
];

const levels = [
  { code: "A1", name: "Grundlagen", desc: "Erste Wörter und einfache Sätze", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" },
  { code: "A2", name: "Alltag", desc: "Alltag verstehen und reagieren", color: "border-sky-500/30 bg-sky-500/5 text-sky-600" },
  { code: "B1", name: "Sicher sprechen", desc: "Sicher kommunizieren im Alltag", color: "border-amber-500/30 bg-amber-500/5 text-amber-600" },
  { code: "B2", name: "Beruf & Diskussion", desc: "Beruf, Meinung und Diskussion", color: "border-orange-500/30 bg-orange-500/5 text-orange-600" },
  { code: "C1", name: "Frei sprechen", desc: "Präzise, frei und selbstbewusst", color: "border-rose-500/30 bg-rose-500/5 text-rose-600" },
];

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoFull size={32} />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/learn" className="hover:text-foreground transition-colors">Lernen</Link>
            <Link href="/placement-test" className="hover:text-foreground transition-colors">Einstufungstest</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Preise</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" className="text-muted-foreground">Anmelden</Button></Link>
            <Link href="/register"><Button variant="accent">Kostenlos starten</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Animated type="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-muted text-amber text-xs font-extrabold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              BAMF-konform — A1 bis C1
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight mb-6">
              Deutsch lernen, bis es{" "}
              <span className="text-accent">Klick</span> macht.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Von A1 bis C1: echte Sprache für Alltag, Beruf, Integration und Prüfung. Schritt für Schritt zum Erfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold shadow-lg shadow-accent/25">Kostenlos starten <ArrowRight size={18} className="ml-2" /></Button></Link>
              <Link href="/placement-test"><Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-border">Einstufungstest machen</Button></Link>
            </div>
          </Animated>
          <Animated type="scaleIn" delay={0.2} className="hidden lg:flex justify-center">
            <LanguageDoorIllustration size={280} />
          </Animated>
        </div>

        {/* Stats */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20">
          {[{ value: "500+", label: "Vokabeln pro Niveau" }, { value: "65+", label: "Grammatikthemen" }, { value: "5", label: "Sprachniveaus" }, { value: "10+", label: "Erklärungssprachen" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-display font-extrabold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </Stagger>
      </section>

      {/* Features */}
      <section className="bg-card-highlight py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Animated type="fadeUp" className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-4">Was Wortwende besonders macht</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Vier Prinzipien, die dein Deutschlernen verändern.</p>
          </Animated>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Card key={i} variant="default" className="p-6 border-border rounded-[28px] text-center shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary-muted flex items-center justify-center mx-auto mb-4">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Levels */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-4">Dein Weg von A1 bis C1</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Vom ersten Wort zur selbstbewussten Kommunikation.</p>
        </Animated>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {levels.map((l) => (
            <HoverCard key={l.code} className={`rounded-[28px] bg-card border ${l.color} p-6 text-center`}>
              <div className={`text-4xl font-display font-extrabold mb-1 ${l.color.split(" ")[2]}`}>{l.code}</div>
              <div className="text-foreground font-bold text-sm mb-1">{l.name}</div>
              <div className="text-muted-foreground text-xs leading-relaxed">{l.desc}</div>
            </HoverCard>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24">
        <Animated type="scaleIn" className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">Bereit für deinen Klick-Moment?</h2>
          <p className="text-white/60 max-w-md mx-auto mb-8 text-lg">Starte kostenlos mit dem Einstufungstest und entdecke deinen persönlichen Lernpfad.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold">Kostenlos starten <ArrowRight size={18} className="ml-2" /></Button></Link>
            <Link href="/placement-test"><Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-white/20 text-white hover:bg-white/10">Einstufungstest machen</Button></Link>
          </div>
        </Animated>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoFull size={24} />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
