"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Languages, Target, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/translation/provider";

const languages = SUPPORTED_LANGUAGES.filter((l) => l.code !== "de");
const langEmojis: Record<string, string> = { tr: "🇹🇷", ru: "🇷🇺", ar: "🇸🇦", pl: "🇵🇱", en: "🇬🇧", ro: "🇷🇴", uk: "🇺🇦", sq: "🇦🇱", ku: "🏳️", it: "🇮🇹" };

const goals = [
  { id: "alltag", title: "Alltag", desc: "Einkaufen, Arzttermine, Wohnungssuche, Behorden", emoji: "🏠" },
  { id: "integration", title: "Integration", desc: "Integrationskurs, DTZ-Prufung", emoji: "🇩🇪" },
  { id: "beruf", title: "Beruf", desc: "Arbeitsplatz, Bewerbung, E-Mails", emoji: "💼" },
  { id: "pruefung", title: "Prufung", desc: "Goethe-/telc-Zertifikat", emoji: "🎓" },
];

const dailyTimes = [
  { value: 5, label: "5 Min", desc: "Kleine Happen" },
  { value: 10, label: "10 Min", desc: "Kurze Sessions" },
  { value: 20, label: "20 Min", desc: "Effektiv lernen" },
  { value: 30, label: "30+ Min", desc: "Intensiv" },
];

type Step = "language" | "goal" | "time" | "placement";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = async (lang: string) => {
    setLoading(true); setError(null);
    try {
      await fetch("/api/user/language", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language: lang }) });
      setSelectedLanguage(lang);
      setStep("goal");
    } catch { setError("Sprache konnte nicht gespeichert werden."); }
    finally { setLoading(false); }
  };

  const handleGoalSelect = async (goal: string) => {
    setLoading(true); setError(null);
    try {
      await fetch("/api/user/goal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal }) });
      setSelectedGoal(goal);
      setStep("time");
    } catch { setError("Ziel konnte nicht gespeichert werden."); }
    finally { setLoading(false); }
  };

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
    setStep("placement");
  };

  const steps = ["language", "goal", "time", "placement"];
  const currentStepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStepIdx ? "w-8 bg-primary" : "w-4 bg-muted"}`} />
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
        )}

        {step === "language" && (
          <Card className="card-premium p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Languages size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">Willkommen bei WortHeld</h1>
            <p className="text-muted-foreground text-sm mb-8">Wahle deine Muttersprache fur Hilfestellungen.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {languages.map((lang) => (
                <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} disabled={loading}
                  className="p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-center disabled:opacity-50">
                  <span className="text-xl block mb-1">{langEmojis[lang.code] || "🌐"}</span>
                  <span className="text-xs font-medium text-foreground">{lang.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => handleLanguageSelect("de")} className="text-primary text-sm hover:underline">
              Deutsch als Muttersprache
            </button>
          </Card>
        )}

        {step === "goal" && (
          <Card className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("language")} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Was ist dein Ziel?</h2>
                <p className="text-sm text-muted-foreground">Wir passen den Kurs an deine Bedurfnisse an.</p>
              </div>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <button key={goal.id} onClick={() => handleGoalSelect(goal.id)} disabled={loading}
                  className="w-full text-left p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-4 disabled:opacity-50">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <div className="font-semibold text-foreground">{goal.title}</div>
                    <div className="text-sm text-muted-foreground">{goal.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === "time" && (
          <Card className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("goal")} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Wie viel Zeit hast du?</h2>
                <p className="text-sm text-muted-foreground">Taglich realistisch fur dich.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dailyTimes.map((t) => (
                <button key={t.value} onClick={() => handleTimeSelect(t.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${selectedTime === t.value ? "border-primary bg-primary/5" : "border-border/60 bg-card hover:border-primary/40"}`}>
                  <div className="text-xl font-display font-bold text-foreground">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === "placement" && (
          <Card className="card-premium overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-accent/60" />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Target size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Dein Niveau bestimmen</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                Mach einen kurzen Einstufungstest (ca. 5 Min), damit wir genau wissen, wo du starten solltest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push("/placement-test")} size="lg" className="shadow-lg shadow-primary/20 group">
                  Einstufungstest starten <ArrowRight size={18} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/learn")} size="lg">
                  Uberspringen <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
