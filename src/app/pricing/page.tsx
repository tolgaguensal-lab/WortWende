"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicTopBar } from "@/components/shared/PublicTopBar";
import { CheckCircle2, ArrowRight, Bot, Infinity, Mic, Globe, BookOpen, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Animated, Stagger } from "@/components/shared/Animated";

const plans = [
  {
    name: "A1 Starter",
    level: "A1",
    price: "0 €",
    period: "für immer",
    description: "Für immer kostenlos",
    cta: "Kostenlos starten",
    href: "/register",
    popular: false,
    sessions: 10,
    features: [
      { text: "KI-Tutor Leo: 10 Sessions/Tag", included: true },
      { text: "Vokabeltrainer (SM-2)", included: true },
      { text: "Grammatik-Erklärungen", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: false },
      { text: "Grammatik-Prüfung", included: false },
    ],
    color: "border-border",
  },
  {
    name: "A2 Alltag",
    level: "A2",
    price: "4,99 €",
    period: "pro Monat",
    description: "100 Sessions/Tag",
    cta: "A2 freischalten",
    href: "/register?plan=a2",
    popular: false,
    sessions: 100,
    features: [
      { text: "KI-Tutor Leo: 100 Sessions/Tag", included: true },
      { text: "Vokabeltrainer (SM-2)", included: true },
      { text: "Grammatik-Erklärungen", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: false },
      { text: "Grammatik-Prüfung", included: false },
    ],
    color: "border-primary/50",
  },
  {
    name: "B1 Fortgeschritten",
    level: "B1",
    price: "8,99 €",
    period: "pro Monat",
    description: "200 Sessions/Tag",
    cta: "B1 freischalten",
    href: "/register?plan=b1",
    popular: false,
    sessions: 200,
    features: [
      { text: "KI-Tutor Leo: 200 Sessions/Tag", included: true },
      { text: "Vokabeltrainer (SM-2)", included: true },
      { text: "Grammatik-Erklärungen", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Grammatik-Prüfung", included: true },
    ],
    color: "border-primary",
  },
  {
    name: "B2 Selbstständig",
    level: "B2",
    price: "12,99 €",
    period: "pro Monat",
    description: "300 Sessions/Tag",
    cta: "B2 freischalten",
    href: "/register?plan=b2",
    popular: true,
    sessions: 300,
    features: [
      { text: "KI-Tutor Leo: 300 Sessions/Tag", included: true },
      { text: "Vokabeltrainer (SM-2)", included: true },
      { text: "Grammatik-Erklärungen", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Grammatik-Prüfung", included: true },
    ],
    color: "border-accent",
  },
  {
    name: "C1 Experte",
    level: "C1",
    price: "14,99 €",
    period: "pro Monat",
    description: "500 Sessions/Tag",
    cta: "C1 freischalten",
    href: "/register?plan=c1",
    popular: false,
    sessions: 500,
    features: [
      { text: "KI-Tutor Leo: 500 Sessions/Tag", included: true },
      { text: "Vokabeltrainer (SM-2)", included: true },
      { text: "Grammatik-Erklärungen", included: true },
      { text: "10 Muttersprachen", included: true },
      { text: "Sprach-Eingabe (Mikrofon)", included: true },
      { text: "Grammatik-Prüfung", included: true },
    ],
    color: "border-primary/50",
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
            Lerne auf <span className="text-accent">deinem Level.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4">
            Jedes CEFR-Level ist ein eigener Plan. Je höher das Level, desto mehr KI-Sessions pro Tag.
          </p>
        </Animated>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="sr-only">Unsere Preispläne</h2>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative rounded-[28px] overflow-hidden border-2 ${plan.color} ${plan.popular ? "shadow-xl shadow-accent/10 scale-[1.03]" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                  Beliebteste Wahl
                </div>
              )}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-display font-bold text-foreground">{plan.name}</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{plan.level}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-1">
                  <span className="text-4xl font-display font-extrabold text-foreground">{plan.price}</span>
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
            { q: "Warum Level-basierte Preise?", a: "Deutsch lernen folgt dem CEFR-Rahmen (A1–C1). Jedes Level erfordert mehr Übung — darum bekommst du mit jedem Level mehr KI-Sessions. Du bezahlst nur für das, was du brauchst. Kein unnötiges Premium-Gepäck." },
            { q: "Was enthält ein höheres Level?", a: "Jedes Level enthält alle darunter liegenden Level. B1 enthält also A1 + A2 + B1. Du verlierst keinen Zugang — du erweiterst ihn." },
            { q: "Warum ist WortWende so günstig?", a: "Wir nutzen DeepSeek V4 Flash — eines der günstigsten und leistungsfähigsten KI-Modelle der Welt (20x günstiger als GPT-4). Eigene Server (ZimaOS), Open-Source-Tools. Keine Investoren, keine Marketing-Budgets." },
            { q: "Kann ich jederzeit kündigen?", a: "Ja. Monatsabo: jederzeit kündbar. Keine versteckten Kosten, keine Mindestlaufzeit." },
            { q: "Welche Sprachen unterstützt der KI-Tutor?", a: "Der Tutor lehrt Deutsch als Zielsprache. Du kannst in 10 Sprachen mit ihm kommunizieren: Türkisch, Arabisch, Russisch, Polnisch, Rumänisch, Ukrainisch, Albanisch, Kurdisch, Italienisch und Englisch." },
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
