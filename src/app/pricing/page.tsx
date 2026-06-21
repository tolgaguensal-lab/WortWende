"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Bot, Infinity, Mic, Globe, BookOpen, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Animated, Stagger } from "@/components/shared/Animated";

const plans = [
  {
    name: "Kostenlos",
    price: "0 &euro;",
    period: "f&uuml;r immer",
    description: "Perfekt zum Reinschnuppern",
    cta: "Kostenlos starten",
    href: "/register",
    popular: false,
    features: [
      { text: "KI-Tutor: 10 Sessions/Tag", included: true },
      { text: "Alle CEFR-Level A1&ndash;C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: false },
      { text: "Unbegrenzte KI-Sessions", included: false },
      { text: "Offline-Modus", included: false },
      { text: "Grammatik-Pr&uuml;fung", included: false },
    ],
    color: "border-border",
  },
  {
    name: "Premium",
    price: "7,99 &euro;",
    period: "pro Monat",
    description: "Alles freischalten &ndash; unbegrenzt lernen",
    cta: "Premium starten",
    href: "/register?plan=premium",
    popular: true,
    features: [
      { text: "KI-Tutor: <strong>unbegrenzt</strong>", included: true },
      { text: "Alle CEFR-Level A1&ndash;C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Grammatik-Pr&uuml;fung (LanguageTool)", included: true },
      { text: "Offline-Modus", included: true },
      { text: "Keine Werbung, kein Tracking", included: true },
    ],
    color: "border-accent",
  },
  {
    name: "Premium Jahres",
    price: "59,99 &euro;",
    period: "pro Jahr (4,99 &euro;/Monat)",
    description: "38% sparen &ndash; unsere Empfehlung",
    cta: "Jahresabo starten",
    href: "/register?plan=premium-yearly",
    popular: false,
    features: [
      { text: "KI-Tutor: <strong>unbegrenzt</strong>", included: true },
      { text: "Alle CEFR-Level A1&ndash;C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Grammatik-Pr&uuml;fung (LanguageTool)", included: true },
      { text: "Offline-Modus", included: true },
      { text: "38% g&uuml;nstiger als Monatsabo", included: true },
    ],
    color: "border-primary",
  },
];

const competitors = [
  { name: "Duolingo Max (mit KI)", price: "29,99 &euro;/Monat", ai: "GPT-4", note: "Nur Englisch/Spanisch" },
  { name: "Babbel Live", price: "49,99 &euro;/Monat", ai: "Keine KI", note: "Live-Tutoren, teuer" },
  { name: "Busuu Premium", price: "9,99 &euro;/Monat", ai: "Keine KI", note: "Community-Korrekturen" },
  { name: "Wortwende Premium", price: "7,99 &euro;/Monat", ai: "DeepSeek V4", note: "KI-Tutor 24/7, 10 Sprachen" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <Animated type="fadeUp">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-wider mb-6">
            <Bot size={14} />Transparente Preise
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Einfach. Fair. <span className="text-accent">G&uuml;nstig.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4">
            Ein Preis. Alle Features. Kein Kleingedrucktes.
          </p>
        </Animated>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <Stagger className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative rounded-[28px] overflow-hidden border-2 ${plan.color} ${plan.popular ? "shadow-xl shadow-accent/10 scale-[1.03]" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                  Beliebteste Wahl
                </div>
              )}
              <div className="p-7">
                <h3 className="text-lg font-display font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-1">
                  <span className="text-4xl font-display font-extrabold text-foreground" dangerouslySetInnerHTML={{ __html: plan.price }} />
                </div>
                <p className="text-xs text-muted-foreground mb-6">{plan.period}</p>
                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? "accent" : "outline"}
                    className="w-full mb-6 rounded-xl font-bold"
                  >
                    {plan.cta} <ArrowRight size={15} className="ml-2" />
                  </Button>
                </Link>
                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 text-xs ${f.included ? "text-foreground" : "text-muted-foreground/40 line-through"}`}>
                      <CheckCircle2 size={12} className={`shrink-0 mt-0.5 ${f.included ? "text-success" : "text-border"}`} />
                      <span dangerouslySetInnerHTML={{ __html: f.text }} />
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </Stagger>
      </section>

      {/* Comparison Table */}
      <section className="bg-card-highlight py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Animated type="fadeUp" className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground mb-2">Im Vergleich zur Konkurrenz</h2>
            <p className="text-muted-foreground text-sm">KI-Tutor zum besten Preis.</p>
          </Animated>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Anbieter</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Preis</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">KI-Tutor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Besonderheit</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={i} className={`border-b border-border/50 ${c.name.startsWith("Wortwende") ? "bg-accent/5 font-semibold" : ""}`}>
                    <td className="py-3 px-4 text-foreground">{c.name}</td>
                    <td className="py-3 px-4">{c.price}</td>
                    <td className="py-3 px-4">{c.ai}</td>
                    <td className="py-3 px-4 text-muted-foreground">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Animated type="fadeUp" className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground mb-2">HÃ¤ufige Fragen</h2>
        </Animated>
        <div className="space-y-4">
          {[
            { q: "Warum ist Wortwende so gÃ¼nstig?", a: "Wir betreiben unsere eigenen Server (ZimaOS), nutzen Open-Source-Tools (LanguageTool, LibreTranslate) und zahlen nur die DeepSeek-API. Keine Investoren, keine Marketing-Budgets â€“ der Preis geht direkt an dich." },
            { q: "Was passiert nach der kostenlosen Phase?", a: "Nichts. Der kostenlose Tarif bleibt fÃ¼r immer kostenlos. Du kannst jederzeit upgraden, aber wir drÃ¤ngen dich nicht." },
            { q: "Kann ich jederzeit kÃ¼ndigen?", a: "Ja. Monatsabo: jederzeit kÃ¼ndbar. Jahresabo: 14 Tage Widerrufsrecht. Keine versteckten Kosten." },
            { q: "Funktioniert der KI-Tutor auch offline?", a: "Im Premium-Tarif ja. Vokabeln, Grammatik und gespeicherte Lektionen sind offline verfÃ¼gbar. Der KI-Tutor braucht Internet." },
            { q: "Welche Sprachen unterstÃ¼tzt der KI-Tutor?", a: "Der Tutor spricht Deutsch als Zielsprache. Du kannst in 10 Sprachen mit ihm kommunizieren: TÃ¼rkisch, Arabisch, Russisch, Polnisch, RumÃ¤nisch, Ukrainisch, Albanisch, Kurdisch, Italienisch und Englisch." },
          ].map((faq, i) => (
            <Card key={i} className="p-5 rounded-2xl border-border">
              <h3 className="font-semibold text-foreground text-sm mb-1">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3">Bereit f&uuml;r deinen KI-Tutor?</h2>
          <p className="text-white/60 mb-8">Starte kostenlos. Upgrade, wenn es dir gef&auml;llt. Kein Risiko.</p>
          <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold"><Bot size={18} className="mr-2" />Kostenlos starten <ArrowRight size={16} className="ml-2" /></Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          Alle Preise inkl. MwSt. &middot; 14 Tage Widerrufsrecht &middot; <Link href="/agb" className="underline">AGB</Link> &middot; <Link href="/datenschutz" className="underline">Datenschutz</Link>
        </div>
      </footer>
    </div>
  );
}
    price: "34,99 â‚¬",
    period: "einmalig",
    description: "Akademisches und berufliches Expertenniveau",
    features: ["Akademische Sprache", "Formelle Kommunikation", "Prasentationen", "Komplexe Grammatik", "Fachsprache", "8000+ Vokabeln", "70+ Grammatikthemen"],
    popular: false,
    color: "rose",
  },
];

const bundlePrice = "79,99 â‚¬";
const bundleSaved = "25,00 â‚¬";

