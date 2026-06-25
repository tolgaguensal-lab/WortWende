"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicTopBar } from "@/components/shared/PublicTopBar";
import { CheckCircle2, ArrowRight, Bot, Infinity, Mic, Globe, BookOpen, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Animated, Stagger } from "@/components/shared/Animated";

const plans = [
  {
    name: "Kostenlos",
    price: "0 €",
    period: "für immer",
    description: "Reinschnuppern & testen",
    cta: "Kostenlos starten",
    href: "/register",
    popular: false,
    features: [
      { text: "KI-Tutor Leo: 10 Sessions/Tag", included: true },
      { text: "Alle CEFR-Level A1–C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: false },
      { text: "Rollenspiele mit Leo", included: false },
      { text: "Offline-Modus", included: false },
      { text: "Grammatik-Prüfung", included: false },
    ],
    color: "border-border",
  },
  {
    name: "Plus",
    price: "8,99 €",
    period: "pro Monat",
    description: "Mehr KI-Power für Viel-Lerner",
    cta: "Plus starten",
    href: "/register?plan=plus",
    popular: false,
    features: [
      { text: "KI-Tutor Leo: 100 Sessions/Tag", included: true },
      { text: "Alle CEFR-Level A1–C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Rollenspiele mit Leo", included: true },
      { text: "Grammatik-Prüfung (LanguageTool)", included: true },
      { text: "Keine Werbung, kein Tracking", included: true },
    ],
    color: "border-primary",
  },
  {
    name: "Premium",
    price: "12,99 €",
    period: "pro Monat",
    description: "300 Sessions/Tag – für Power-Lerner",
    cta: "Premium starten",
    href: "/register?plan=premium",
    popular: true,
    features: [
      { text: "KI-Tutor Leo: <strong>300 Sessions/Tag</strong>", included: true },
      { text: "Alle CEFR-Level A1–C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Rollenspiele mit Leo", included: true },
      { text: "Grammatik-Prüfung (LanguageTool)", included: true },
      { text: "Priority-KI (schnellere Antworten)", included: true },
    ],
    color: "border-accent",
  },
  {
    name: "Premium Jahres",
    price: "99,99 €",
    period: "pro Jahr (8,33 €/Monat)",
    description: "36% sparen – unsere Empfehlung",
    cta: "Jahresabo starten",
    href: "/register?plan=premium-yearly",
    popular: false,
    features: [
      { text: "KI-Tutor Leo: <strong>300 Sessions/Tag</strong>", included: true },
      { text: "Alle CEFR-Level A1–C1", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Vokabeltrainer + Grammatik", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Rollenspiele mit Leo", included: true },
      { text: "Grammatik-Prüfung (LanguageTool)", included: true },
      { text: "36% günstiger als Monatsabo", included: true },
    ],
    color: "border-primary",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicTopBar />
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <Animated type="fadeUp">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-wider mb-6">
            <Bot size={14} />Transparente Preise
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Einfach. Fair. <span className="text-accent">Günstig.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4">
            Ein Preis. Alle Features. Kein Kleingedrucktes.
          </p>
        </Animated>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="sr-only">Unsere Preispläne</h2>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Animated type="fadeUp" className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground mb-2">Häufige Fragen</h2>
        </Animated>
        <div className="space-y-4">
          {[
            { q: "Warum ist Wortwende so günstig?", a: "Wir nutzen DeepSeek V4 Flash – eines der günstigsten und leistungsfähigsten KI-Modelle der Welt (20x günstiger als GPT-4). Eigene Server (ZimaOS), Open-Source-Tools. Keine Investoren, keine Marketing-Budgets." },
            { q: "Was passiert nach der kostenlosen Phase?", a: "Nichts. Der kostenlose Tarif bleibt für immer kostenlos. Du kannst jederzeit upgraden, aber wir drängen dich nicht." },
            { q: "Kann ich jederzeit kündigen?", a: "Ja. Monatsabo: jederzeit kündbar. Jahresabo: 14 Tage Widerrufsrecht. Keine versteckten Kosten." },
            { q: "Funktioniert der KI-Tutor auch offline?", a: "Im Premium-Tarif ja. Vokabeln, Grammatik und gespeicherte Lektionen sind offline verfügbar. Der KI-Tutor braucht Internet." },
            { q: "Welche Sprachen unterstützt der KI-Tutor?", a: "Der Tutor spricht Deutsch als Zielsprache. Du kannst in 10 Sprachen mit ihm kommunizieren: Türkisch, Arabisch, Russisch, Polnisch, Rumänisch, Ukrainisch, Albanisch, Kurdisch, Italienisch und Englisch." },
          ].map((faq, i) => (
            <Card key={i} className="p-5 rounded-2xl border-border">
              <h3 className="font-semibold text-foreground text-sm mb-1">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3">Bereit für deinen KI-Tutor?</h2>
          <p className="text-white/60 mb-8">Starte kostenlos. Upgrade, wenn es dir gefällt. Kein Risiko.</p>
          <Link href="/register"><Button variant="accent" size="lg" className="text-base px-8 py-6 h-auto font-extrabold"><Bot size={18} className="mr-2" />Kostenlos starten <ArrowRight size={16} className="ml-2" /></Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          Alle Preise inkl. MwSt. · 14 Tage Widerrufsrecht · <Link href="/agb" className="underline">AGB</Link> · <Link href="/datenschutz" className="underline">Datenschutz</Link>
        </div>
      </footer>
    </div>
  );
}
