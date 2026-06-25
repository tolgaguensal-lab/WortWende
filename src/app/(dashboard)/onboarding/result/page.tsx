"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Trophy, Target, AlertCircle, Loader2 } from "lucide-react";

interface PlacementResult {
  level: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  plan: { week: number; goal: string; focus: string }[];
}

function generatePlan(level: string, weaknesses: string[]) {
  const g = weaknesses.some(w => /dativ|akkusativ|grammatik|artikel/i.test(w));
  const v = weaknesses.some(w => /wortschatz|vokabel/i.test(w));
  const s = weaknesses.some(w => /sprechen|aussprache/i.test(w));
  const plans: Record<string, { week: number; goal: string; focus: string }[]> = {
    A1: [
      { week: 1, goal: "Begruessung und Vorstellung", focus: "Sprechen" },
      { week: 2, goal: "Bestimmte Artikel (der/die/das)", focus: "Grammatik" },
      { week: 3, goal: "Zahlen, Uhrzeit und Alltag", focus: "Wortschatz" },
      { week: 4, goal: "Einfache Saetze bilden", focus: "Satzbau" },
    ],
    A2: [
      { week: 1, goal: g ? "Dativ und Akkusativ trainieren" : "Berufliche Vorstellung", focus: g ? "Grammatik" : "Sprechen" },
      { week: 2, goal: v ? "Berufsvokabeln aufbauen" : "Perfekt und Vergangenheit", focus: v ? "Wortschatz" : "Grammatik" },
      { week: 3, goal: s ? "Dialoge im Alltag ueben" : "Texte lesen und verstehen", focus: s ? "Sprechen" : "Lesen" },
      { week: 4, goal: "Weil/dass-Saetze und Konnektoren", focus: "Satzbau" },
    ],
    B1: [
      { week: 1, goal: "Konjunktiv II und hoefliche Bitten", focus: "Grammatik" },
      { week: 2, goal: "Meinung aeussern und diskutieren", focus: "Sprechen" },
      { week: 3, goal: "Bewerbung und Lebenslauf", focus: "Schreiben" },
      { week: 4, goal: "Nachrichten und Artikel verstehen", focus: "Lesen" },
    ],
    B2: [
      { week: 1, goal: "Passiv und Nominalstil", focus: "Grammatik" },
      { week: 2, goal: "Presentationen halten", focus: "Sprechen" },
      { week: 3, goal: "Fachtexte und Berichte", focus: "Lesen" },
      { week: 4, goal: "Argumentation und Essay", focus: "Schreiben" },
    ],
    C1: [
      { week: 1, goal: "Nuancierte Ausdrucksweise", focus: "Wortschatz" },
      { week: 2, goal: "Spontane Debatten fuehren", focus: "Sprechen" },
      { week: 3, goal: "Wissenschaftliche Texte", focus: "Lesen" },
      { week: 4, goal: "Stilistik und Registerwechsel", focus: "Schreiben" },
    ],
  };
  return plans[level.split(".")[0]] || plans["A2"];
}

export default function PlacementResultPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (session?.user) {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const profile = await res.json();
            if (profile.placementLevel) {
              const lvl = profile.placementLevel;
              const str = profile.strengths || [];
              const weak = profile.weaknesses || [];
              const map: Record<string, string> = { A1: "Anfaenger", A2: "Grundkenntnisse", B1: "Fortgeschritten", B2: "Selbstaendig", C1: "Fliessend" };
              setResult({
                level: lvl,
                score: profile.score || 68,
                strengths: str.length > 0 ? str : ["Grundwortschatz", "Einfache Saetze"],
                weaknesses: weak.length > 0 ? weak : ["Komplexe Grammatik", "Hoerverstaendnis"],
                recommendation: `Starte mit ${lvl} Modul 1 - ${map[lvl.split(".")[0]] || "Grundkenntnisse"}.`,
                plan: generatePlan(lvl, weak),
              });
              setLoading(false);
              return;
            }
          }
        }
        const stored = localStorage.getItem("placementAnswers");
        if (stored) {
          const answers = JSON.parse(stored);
          const correct = answers.filter((a: any) => a.isCorrect).length;
          const score = Math.round((correct / answers.length) * 100);
          const lvl = score >= 80 ? "B2.1" : score >= 60 ? "B1.1" : score >= 40 ? "A2.1" : "A1.1";
          setResult({
            level: lvl,
            score,
            strengths: score >= 60 ? ["Wortschatz", "Grundgrammatik"] : ["Grundwortschatz"],
            weaknesses: score < 60 ? ["Grammatik", "Hoerverstaendnis"] : ["Komplexe Strukturen"],
            recommendation: `Starte mit ${lvl} - Lernpfad bereit.`,
            plan: generatePlan(lvl, []),
          });
          localStorage.removeItem("placementAnswers");
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setResult({
        level: "A2.1",
        score: 68,
        strengths: ["Grundwortschatz", "Einfache Saetze"],
        weaknesses: ["Dativ", "Unregelmaessige Verben"],
        recommendation: "Starte mit A2 Modul 1.",
        plan: generatePlan("A2", []),
      });
      setLoading(false);
    })();
  }, [session]);

  if (loading || !result) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  const labelMap: Record<string, string> = {
    A1: "Anfaenger", A2: "Grundkenntnisse", B1: "Fortgeschritten", B2: "Selbstaendig", C1: "Fliessend",
  };
  const levelLabel = labelMap[result.level.split(".")[0]] || "Grundkenntnisse";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Dein Analysebericht</h1>
          <p className="text-muted-foreground">Basierend auf deinem Einstufungstest</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy size={80} /></div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-medium opacity-90">Dein Niveau</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <div className="text-7xl font-black mb-4 tracking-tighter">{result.level}</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-widest">{levelLabel}</div>
              </CardContent>
              <CardFooter className="p-6 pt-0 text-center flex-col">
                <div className="w-full bg-blue-800 rounded-full h-4 overflow-hidden">
                  <div className="bg-card h-full rounded-full" style={{ width: result.score + "%" }} />
                </div>
                <p className="text-xs mt-2 text-blue-200">{result.score}% Gesamtpunktzahl</p>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="text-primary" size={20} /> Lernziel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.recommendation}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Staerken und Schwaechen</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-green-700 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={16} /> Staerken
                  </h2>
                  {result.strengths.map((s, i) => (
                    <div key={i} className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-100 dark:border-green-800/50">{s}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={16} /> Potenzial
                  </h2>
                  {result.weaknesses.map((w, i) => (
                    <div key={i} className="text-sm text-muted-foreground bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-100 dark:border-red-800/50">{w}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Dein 4-Wochen-Plan</CardTitle>
                <CardDescription>Strukturierter Start in dein neues Niveau</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.plan.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      {"W" + (i + 1)}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-semibold text-foreground">{item.goal}</span>
                      <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">{item.focus}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button onClick={() => router.push("/learn")} className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-primary to-primary/80 font-semibold">
                  Jetzt mit Modul 1 starten <ArrowRight className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
