"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    if (step < PLACEMENT_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/placement-test/result", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) router.push("/onboarding/result");
      else alert("Fehler beim Speichern.");
    } catch { alert("Netzwerkfehler."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">Einstufungstest</h1>
          <p className="text-muted-foreground mt-1">Finde dein perfektes Sprachniveau</p>
        </div>

        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Fortschritt</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 0 && (
          <Card className="border-0 shadow-xl">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <GraduationCap size={32} />
              </div>
              <CardTitle className="text-2xl font-display">Willkommen zum Test</CardTitle>
              <CardDescription className="text-base">
                Dieser Test analysiert dein Wissen von A1 bis C1.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <ul className="text-left max-w-xs mx-auto space-y-3 text-muted-foreground text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> 10 gezielte Fragen</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Grammatik & Wortschatz</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Sofortige Niveaustufung</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" onClick={() => setStep(1)}>
                Jetzt starten <ChevronRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step > 0 && step <= PLACEMENT_QUESTIONS.length && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {PLACEMENT_QUESTIONS[step-1].level} • {PLACEMENT_QUESTIONS[step-1].skill}
                </span>
                <span className="text-xs text-muted-foreground">Frage {step} von {PLACEMENT_QUESTIONS.length}</span>
              </div>
              <CardTitle className="text-xl font-display leading-relaxed">
                {PLACEMENT_QUESTIONS[step-1].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PLACEMENT_QUESTIONS[step-1].options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4 hover:bg-primary/5 hover:border-primary transition-all rounded-xl text-left"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center mr-3 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between py-4 border-t border-border">
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1} className="text-muted-foreground">
                <ChevronLeft size={16} className="mr-2" /> Zurück
              </Button>
            </CardFooter>
          </Card>
        )}

        {step > PLACEMENT_QUESTIONS.length && (
          <Card className="border-0 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} />
              </div>
              <CardTitle className="text-2xl font-display">Test abgeschlossen!</CardTitle>
              <CardDescription className="text-base">
                Wir analysieren deine Antworten.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-sm mb-6">
                Du hast alle {PLACEMENT_QUESTIONS.length} Fragen beantwortet.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button size="lg" className="px-12 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" onClick={submitResults} disabled={isSubmitting}>
                {isSubmitting ? "Analysiere..." : "Ergebnis anzeigen"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
