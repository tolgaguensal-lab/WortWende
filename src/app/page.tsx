import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoFull } from "@/components/brand/LogoMark";
import { LanguageDoorIllustration } from "@/components/brand/LanguageDoorIllustration";
import { ArrowRight, Sparkles, Bot, MessageSquare, Mic, Globe, Brain, Zap, Target, Heart, BookOpen } from "lucide-react";
import { Animated, Stagger, HoverCard } from "@/components/shared/Animated";

export const metadata: Metadata = {
  title: "Wortwende – Deutsch lernen mit KI-Tutor Leo",
  description: "Lerne Deutsch von A1 bis C1 mit deinem persönlichen KI-Tutor Leo. 24/7 verfügbar, 10 Muttersprachen, BAMF-orientiert. Jetzt kostenlos starten.",
  openGraph: {
    title: "Wortwende – Deutsch lernen mit KI-Tutor",
    description: "Dein persönlicher KI-Tutor für Deutsch. 24/7. Persönlich. Kostenlos starten.",
    type: "website",
  },
};

const tutorFeatures = [
  { icon: Brain, title: "KI-TUTOR 24/7", desc: "Dein pers&ouml;nlicher Deutsch-Lehrer – jederzeit verf&uuml;gbar, unendlich geduldig." },
  { icon: MessageSquare, title: "THEMEN-SESSIONS", desc: "Dativ? Perfekt? W&auml;hle ein Thema – der Tutor f&uuml;hrt dich Schritt f&uuml;r Schritt." },
  { icon: Mic, title: "SPRECHEN & H&Ouml;REN", desc: "Sprich mit dem Tutor &uuml;ber dein Mikrofon – er versteht dich und antwortet." },
  { icon: Globe, title: "10 MUTTERSPRACHEN", desc: "Lerne Deutsch aus deiner Sprache – T&uuml;rkisch, Arabisch, Russisch und mehr." },
];

const levels = [
  { code: "A1", name: "Grundlagen", desc: "Erste W&ouml;rter und einfache S&auml;tze", color: "border-primary/30 bg-primary/5 text-primary" },
  { code: "A2", name: "Alltag", desc: "Alltag verstehen und reagieren", color: "border-sky-500/30 bg-sky-500/5 text-sky-600" },
  { code: "B1", name: "Sicher sprechen", desc: "Sicher kommunizieren im Alltag", color: "border-amber-500/30 bg-amber-500/5 text-amber-600" },
  { code: "B2", name: "Beruf &amp; Diskussion", desc: "Beruf, Meinung und Diskussion", color: "border-orange-500/30 bg-orange-500/5 text-orange-600" },
  { code: "C1", name: "Frei sprechen", desc: "Pr&auml;zise, frei und selbstbewusst", color: "border-rose-500/30 bg-rose-500/5 text-rose-600" },
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
          <div className="hidden md:flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/tutor" className="text-accent font-bold hover:text-accent-hover transition-colors flex items-center gap-1"><Bot size={14} />KI-Tutor</Link>
            <Link href="/learn" className="hover:text-foreground transition-colors">Lernen</Link>
            <Link href="/placement-test" className="hover:text-foreground transition-colors">Einstufungstest</Link>
            <Link href="/pricing" className="text-amber-500 font-bold hover:text-amber-600 transition-colors flex items-center gap-1"><Zap size={13} />Preise</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login"><Button variant="ghost" size="sm" className="text-muted-foreground text-xs md:text-sm">Anmelden</Button></Link>
            <Link href="/register"><Button variant="accent" size="sm" className="text-xs md:text-sm">Kostenlos starten</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero — KI-Tutor Fokus */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Animated type="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-wider mb-6">
              <Bot size={14} />
              NEU: KI-Tutor
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight mb-6">
              Dein <span className="text-accent">KI-Tutor</span> f&uuml;r Deutsch.
              <br />
              <span className="text-muted-foreground/40">24/7. Pers&ouml;nlich. Kostenlos.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Lerne Deutsch im Gespr&auml;ch mit einer KI, die dich versteht. Grammatik, Vokabeln, Aussprache &ndash; dein Tutor erkl&auml;rt, &uuml;bt und korrigiert dich. In deiner Sprache.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold shadow-lg shadow-accent/25">
                <Bot size={20} className="mr-2" />Jetzt mit KI-Tutor lernen <ArrowRight size={18} className="ml-2" />
              </Button></Link>
              <Link href="/placement-test"><Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-border">Einstufungstest machen</Button></Link>
            </div>
          </Animated>
          <Animated type="scaleIn" delay={0.2} className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-72 h-96 rounded-[40px] bg-gradient-to-br from-primary to-primary-hover p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[36px] bg-card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Bot size={14} className="text-white" /></div>
                    <div><div className="text-xs font-bold">Leo – KI-Tutor</div><div className="text-[10px] text-muted-foreground">Online &middot; 24/7 verfügbar</div></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="p-2.5 rounded-2xl bg-primary/5 border border-primary/10 text-xs">Hallo! &#128075; Ich bin <strong>Leo</strong>, dein Deutsch-Tutor. Sollen wir den <strong>Dativ</strong> &uuml;ben?</div>
                    <div className="p-2.5 rounded-2xl bg-accent text-white text-xs ml-auto">Ja, los geht&apos;s!</div>
                    <div className="p-2.5 rounded-2xl bg-primary/5 border border-primary/10 text-xs">&#127919; <strong>&Uuml;bung:</strong> Er schenkt ___ Kind ein Buch. Was passt?</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-xl bg-muted/50 flex items-center px-3 text-[10px] text-muted-foreground">Deine Antwort...</div>
                    <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center"><ArrowRight size={12} className="text-white" /></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-amber/20 flex items-center justify-center text-2xl shadow-lg">&#127942;</div>
            </div>
          </Animated>
        </div>

        {/* Stats */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20">
          {[{ value: "KI", label: "24/7 Tutor", icon: Bot }, { value: "1.200+", label: "Vokabeln", icon: BookOpen }, { value: "85+", label: "Grammatikthemen", icon: Brain }, { value: "10", label: "Muttersprachen", icon: Globe }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-display font-extrabold text-foreground flex items-center justify-center gap-1.5">
                <s.icon size={22} className="text-accent" />{s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </Stagger>
      </section>

      {/* KI-Tutor Features */}
      <section className="bg-card-highlight py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Animated type="fadeUp" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-wider mb-4">
              <Sparkles size={13} /> Revolution&auml;res Lernen
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-4">Dein KI-Tutor kann das</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Kein langweiliges Vokabelpauken. Echter Dialog. Echte Fortschritte.</p>
          </Animated>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tutorFeatures.map((f, i) => (
              <Card key={i} variant="default" className="p-6 border-border rounded-[28px] text-center shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon size={22} className="text-accent" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: f.desc }} />
              </Card>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Animated type="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-4">So einfach geht&apos;s</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">In 3 Schritten zum ersten Klick-Moment.</p>
        </Animated>
        <Stagger className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { step: "1", icon: Globe, title: "Sprache w&auml;hlen", desc: "T&uuml;rkisch, Arabisch, Russisch &ndash; lerne Deutsch aus deiner Muttersprache." },
            { step: "2", icon: Bot, title: "Thema aussuchen", desc: "Dativ, Perfekt, Bewerbung &ndash; der Tutor passt sich deinem Niveau an." },
            { step: "3", icon: MessageSquare, title: "Loslegen", desc: "Sprich oder tippe &ndash; der Tutor erkl&auml;rt, &uuml;bt und korrigiert live." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-white text-2xl font-extrabold shadow-lg">{s.step}</div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3"><s.icon size={18} className="text-accent" /></div>
              <h3 className="font-bold text-foreground mb-1" dangerouslySetInnerHTML={{ __html: s.title }} />
              <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.desc }} />
            </div>
          ))}
        </Stagger>
      </section>

      {/* Levels */}
      <section className="bg-card-highlight py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Animated type="fadeUp" className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-4">Dein Weg von A1 bis C1</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Vom ersten Wort zur selbstbewussten Kommunikation &ndash; mit deinem KI-Tutor an der Seite.</p>
          </Animated>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {levels.map((l) => (
              <HoverCard key={l.code} className={`rounded-[28px] bg-card border ${l.color} p-6 text-center`}>
                <div className={`text-4xl font-display font-extrabold mb-1 ${l.color.split(" ")[2]}`}>{l.code}</div>
                <div className="text-foreground font-bold text-sm mb-1" dangerouslySetInnerHTML={{ __html: l.name }} />
                <div className="text-muted-foreground text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: l.desc }} />
              </HoverCard>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-24">
        <Animated type="scaleIn" className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-extrabold uppercase tracking-wider mb-6">
            <Bot size={14} />Kein Risiko &middot; komplett kostenlos
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">Bereit f&uuml;r deinen pers&ouml;nlichen KI-Tutor?</h2>
          <p className="text-white/60 max-w-md mx-auto mb-8 text-lg">Starte jetzt &ndash; dein Deutsch-Tutor wartet schon auf dich.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold">
              <Bot size={20} className="mr-2" />Kostenlos mit KI lernen <ArrowRight size={18} className="ml-2" />
            </Button></Link>
            <Link href="/placement-test"><Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-white/20 text-white hover:bg-white/10">Einstufungstest machen</Button></Link>
          </div>
        </Animated>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoFull size={24} />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="text-amber-500 font-bold hover:text-amber-600 transition-colors">Preise</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
