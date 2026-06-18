"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Trophy, Target, AlertCircle } from "lucide-react";

export default function PlacementResultPage() {
  const router = useRouter();
  const mockResult = {
    level: "A2.1",
    score: 68,
    strengths: ["Basic Vocabulary", "Present Tense", "Daily Greetings"],
    weaknesses: ["Dative Case", "Irregular Verbs", "Listening Comprehension"],
    recommendation: "Starte mit A2 Modul 1: 'Arbeit und Beruf'.",
    plan: [
      { week: 1, goal: "Dativ-Prapositionen meistern", focus: "Grammatik" },
      { week: 2, goal: "Berufliche Vorstellung", focus: "Sprechen" },
      { week: 3, goal: "Alltag im Beruf lesen", focus: "Lesen" },
      { week: 4, goal: "Burovokabeln", focus: "Wortschatz" },
    ]
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-display font-bold text-foreground">Dein Analysebericht</h1>
          <p className="text-muted-foreground">Basierend auf deinem Einstufungstest</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy size={80} /></div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-display font-medium opacity-90">Dein Niveau</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <div className="text-7xl font-black font-display mb-4 tracking-tighter">{mockResult.level}</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-widest">Grundkenntnisse (A2)</div>
              </CardContent>
              <CardFooter className="p-6 pt-0 text-center flex-col">
                <div className="w-full bg-blue-800 rounded-full h-4 overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: mockResult.score + "%" }} />
                </div>
                <p className="text-xs mt-2 text-blue-200">{mockResult.score}% Gesamtpunktzahl</p>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Target className="text-primary" size={20} /> Lernziel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{mockResult.recommendation}</p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-bold text-foreground">Starken & Schwachen</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={16} /> Starken
                  </h3>
                  {mockResult.strengths.map((s, i) => (
                    <div key={i} className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-100">{s}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={16} /> Potenzial
                  </h3>
                  {mockResult.weaknesses.map((w, i) => (
                    <div key={i} className="text-sm text-muted-foreground bg-red-50 p-3 rounded-lg border border-red-100">{w}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-bold text-foreground">Dein 4-Wochen-Plan</CardTitle>
                <CardDescription>Strukturierter Start in dein neues Niveau</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockResult.plan.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 font-display">W{i+1}</div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-semibold text-foreground">{item.goal}</span>
                      <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">{item.focus}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button onClick={() => router.push("/learn")} className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold">
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
