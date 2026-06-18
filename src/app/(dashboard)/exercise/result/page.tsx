"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, RotateCcw, Home, Trophy, CheckCircle2, Zap, AlertCircle } from "lucide-react";

function ResultContent() {
  const params = useSearchParams();
  const score = parseInt(params.get("score") ?? "0");
  const total = parseInt(params.get("total") ?? "10");
  const percentage = Math.round((score / total) * 100);
  const xpEarned = score * 5;
  const courseId = params.get("courseId") || "";
  const lessonId = params.get("lessonId") || "";
  const backLink = courseId ? `/learn/${courseId}` : "/learn";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md card-premium text-center">
        <div className="h-1.5 bg-gradient-to-r from-[hsl(235,45%,55%)] to-[hsl(38,92%,50%)]" />
        <CardContent className="p-8 space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            {percentage >= 80 ? <Trophy size={40} className="text-amber-500" /> :
             percentage >= 50 ? <CheckCircle2 size={40} className="text-emerald-500" /> :
             <AlertCircle size={40} className="text-primary" />}
          </div>
          
          <h1 className="text-2xl font-display font-bold text-foreground">
            {percentage >= 80 ? "Ausgezeichnet!" : percentage >= 50 ? "Gut gemacht!" : "Weiter uben!"}
          </h1>
          
          <div className="text-5xl font-display font-bold text-primary">{percentage}%</div>
          <p className="text-muted-foreground text-sm">{score} von {total} richtig</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
              <Zap size={16} className="text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">+{xpEarned}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
              <CheckCircle2 size={16} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{score}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Richtig</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
              <AlertCircle size={16} className="text-rose-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{total - score}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Falsch</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {lessonId ? (
              <Link href={`/exercise/${lessonId}`}>
                <Button className="w-full shadow-lg shadow-primary/20 group">
                  <RotateCcw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Nochmal uben
                </Button>
              </Link>
            ) : (
              <Link href={backLink}>
                <Button className="w-full shadow-lg shadow-primary/20">
                  <RotateCcw size={16} className="mr-2" />Weiter uben
                </Button>
              </Link>
            )}
            <Link href={backLink}>
              <Button variant="outline" className="w-full group">
                <ArrowRight size={16} className="mr-2 group-hover:translate-x-0.5 transition-transform" />
                {courseId ? "Zuruck zum Kurs" : "Weiter lernen"}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full text-muted-foreground">
                <Home size={16} className="mr-2" />Zum Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResultPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}><ResultContent /></Suspense>;
}
