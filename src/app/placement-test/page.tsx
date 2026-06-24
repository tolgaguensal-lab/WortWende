"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PublicTopBar } from "@/components/shared/PublicTopBar";
import { ChevronRight, ChevronLeft, CheckCircle2, GraduationCap } from "lucide-react";

const PLACEMENT_QUESTIONS = [
  { id: "q1", level: "A1", skill: "Wortschatz", question: "Wie heißt du?", options: ["Ich bin 20 Jahre alt.", "Ich heiße Max.", "Ich komme aus Berlin.", "Ich wohne hier."], correctOption: "Ich heiße Max." },
  { id: "q2", level: "A1", skill: "Grammatik", question: "___ ist meine Mutter.", options: ["Das", "Der", "Die", "Den"], correctOption: "Das" },
  { id: "q3", level: "A2", skill: "Grammatik", question: "Ich habe gestern ein Buch ___.", options: ["gelesen", "lesen", "gelesen haben", "lese"], correctOption: "gelesen" },
  { id: "q4", level: "A2", skill: "Wortschatz", question: "Wo kann man Medikamente kaufen?", options: ["Im Kino", "In der Apotheke", "Im Supermarkt", "Im Park"], correctOption: "In der Apotheke" },
  { id: "q5", level: "B1", skill: "Grammatik", question: "Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.", options: ["dass", "obwohl", "weil", "wenn"], correctOption: "weil" },
  { id: "q6", level: "B1", skill: "Wortschatz", question: "Was bedeutet 'verantwortungsbewusst'?", options: ["Sehr schnell", "Zuverlässig", "Unfreundlich", "Laut"], correctOption: "Zuverlässig" },
  { id: "q7", level: "B2", skill: "Grammatik", question: "Trotz ___ starken Regens gingen sie spazieren.", options: ["des", "dem", "den", "der"], correctOption: "des" },
  { id: "q8", level: "B2", skill: "Wortschatz", question: "Welches Wort ist ein Synonym für 'effizient'?", options: ["langsam", "wirkungsvoll", "kompliziert", "teuer"], correctOption: "wirkungsvoll" },
  { id: "q9", level: "C1", skill: "Grammatik", question: "Hätte er mehr gelernt, ___ die Prüfung bestanden.", options: ["würde er", "hätte er", "hatte er", "wäre er"], correctOption: "hätte er" },
  { id: "q10", level: "C1", skill: "Wortschatz", question: "Was bedeutet 'ambivalent'?", options: ["Eindeutig", "Zweideutig", "Sehr stark", "Unwichtig"], correctOption: "Zweideutig" },
];

const levelColors: Record<string, string> = {
  A1: "bg-primary-muted text-primary border-primary/30 dark:bg-primary/20 dark:text-primary-foreground/80 dark:border-primary/40",
  A2: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800",
  B1: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  B2: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
  C1: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
};

export default function PlacementTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progress = (step / (PLACEMENT_QUESTIONS.length + 1)) * 100;

  const handleAnswer = (option: string) => {
    const q = PLACEMENT_QUESTIONS[step - 1];
    const newAnswers = [...answers, { questionId: q.id, selectedOptionId: option, isCorrect: option === q.correctOption, level: q.level, skill: q.skill }];
    setAnswers(newAnswers);
    if (step < PLACEMENT_QUESTIONS.length) setStep(step + 1);
    else setStep(step + 1);
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/placement-test/result", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
      if (res.ok) {
        router.push("/onboarding/result");
      } else if (res.status === 401) {
        // Nicht eingeloggt → Ergebnisse in localStorage speichern + zum Login
        localStorage.setItem("placementAnswers", JSON.stringify(answers));
        router.push("/login?callbackUrl=/onboarding/result&placement=pending");
      } else {
        alert("Fehler beim Speichern. Bitte versuche es erneut.");
      }
    } catch { alert("Netzwerkfehler. Bitte prüfe deine Verbindung."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicTopBar />
      <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="sr-only">Einstufungstest – Deutsch-Sprachniveau ermitteln</h1>
        {step === 0 && (
          <Card className="card-premium overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-accent/60" />
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <GraduationCap size={30} className="text-primary" />
              </div>
              <CardTitle className="text-2xl font-display font-bold">Einstufungstest</CardTitle>
              <CardDescription className="text-sm mt-1 max-w-sm mx-auto">
                In wenigen Minuten ermitteln wir dein Sprachniveau (A1-C1).
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6 px-8">
              <ul className="text-left max-w-xs mx-auto space-y-3 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>10 gezielte Fragen</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Grammatik &amp; Wortschatz</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Sofortige Niveaustufung (GER/CEFR)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button size="lg" className="rounded-xl px-8 py-5 h-auto font-semibold shadow-lg shadow-primary/20" onClick={() => setStep(1)}>
                Jetzt starten <ChevronRight size={18} className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step > 0 && step <= PLACEMENT_QUESTIONS.length && (
          <>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Frage {step} von {PLACEMENT_QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            <Card className="card-premium">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-3">
                  <span className={`badge-premium ${levelColors[PLACEMENT_QUESTIONS[step-1].level]}`}>
                    {PLACEMENT_QUESTIONS[step-1].level} • {PLACEMENT_QUESTIONS[step-1].skill}
                  </span>
                </div>
                <CardTitle className="text-xl font-display leading-relaxed">
                  {PLACEMENT_QUESTIONS[step-1].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {PLACEMENT_QUESTIONS[step-1].options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start h-auto py-3.5 px-4 hover:bg-primary/5 hover:border-primary/40 transition-all rounded-xl text-left font-normal"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="w-7 h-7 rounded-lg bg-secondary text-muted-foreground text-xs font-semibold flex items-center justify-center mr-3 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </Button>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between pt-2 pb-4 px-6">
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1} className="text-muted-foreground text-sm">
                  <ChevronLeft size={15} className="mr-1" /> Zurück
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {step > PLACEMENT_QUESTIONS.length && (
          <Card className="card-premium text-center">
            <CardHeader className="pt-8">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-success-muted flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-success" />
              </div>
              <CardTitle className="text-2xl font-display font-bold">Test abgeschlossen!</CardTitle>
              <CardDescription className="text-sm mt-1">
                Wir analysieren deine Antworten.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <p className="text-muted-foreground text-sm">
                Du hast alle {PLACEMENT_QUESTIONS.length} Fragen beantwortet.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button size="lg" className="rounded-xl px-10 py-5 h-auto font-semibold shadow-lg shadow-primary/20" onClick={submitResults} disabled={isSubmitting}>
                {isSubmitting ? "Analysiere..." : "Ergebnis anzeigen"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}
