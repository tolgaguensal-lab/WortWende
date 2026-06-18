"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Zap, RefreshCw, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface VocabItem {
  id: string;
  word: string;
  article: string | null;
  translationEn: string;
  translationTr: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  pos: string;
  level: string;
}

interface ReviewItem {
  id: string;
  vocabularyId: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  vocabulary: VocabItem | null;
}

type Quality = "perfect" | "good" | "hard" | "blackout";

const qualityLabels: Record<Quality, { label: string; shortcut: string; color: string }> = {
  perfect: { label: "Perfekt", shortcut: "1", color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  good: { label: "Gut", shortcut: "2", color: "bg-sky-500 hover:bg-sky-600 text-white" },
  hard: { label: "Schwer", shortcut: "3", color: "bg-amber-500 hover:bg-amber-600 text-white" },
  blackout: { label: "Vergessen", shortcut: "4", color: "bg-rose-500 hover:bg-rose-600 text-white" },
};

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, perfect: 0, good: 0, hard: 0, blackout: 0, xpEarned: 0 });
  const [complete, setComplete] = useState(false);

  const fetchDue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/review/due");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setItems(data.items);
      }
    } catch (e) {
      setError("Wiederholungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDue(); }, [fetchDue]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (complete || items.length === 0) return;
      if (!flipped) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(true); } return; }
      const map: Record<string, Quality> = { "1": "perfect", "2": "good", "3": "hard", "4": "blackout" };
      if (map[e.key]) handleRate(map[e.key]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipped, currentIdx, items, complete]);

  const handleRate = async (quality: Quality) => {
    const item = items[currentIdx];
    if (!item) return;
    try {
      const res = await fetch("/api/review/due", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewItemId: item.id, quality }),
      });
      const data = await res.json();
      setSessionStats(s => ({
        ...s,
        reviewed: s.reviewed + 1,
        [quality]: s[quality] + 1,
        xpEarned: s.xpEarned + (data.xpEarned || 0),
      }));
    } catch { /* non-critical */ }
    if (currentIdx + 1 < items.length) {
      setCurrentIdx(currentIdx + 1);
      setFlipped(false);
    } else {
      setComplete(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-64 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-5 md:p-8 max-w-2xl mx-auto text-center">
        <Card className="card-premium p-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Fehler beim Laden</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDue}><RefreshCw size={16} className="mr-2" />Erneut versuchen</Button>
        </Card>
      </div>
    );
  }

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div className="p-5 md:p-8 max-w-2xl mx-auto">
        <Card className="card-premium p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Alles geschafft!</h1>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Keine Wiederholungen fällig. Gut gemacht – du bist auf dem neuesten Stand.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/learn"><Button className="shadow-lg shadow-primary/20">Neue Lektionen lernen <ArrowRight size={16} className="ml-2" /></Button></a>
            <a href="/dashboard"><Button variant="outline">Zum Dashboard</Button></a>
          </div>
        </Card>
      </div>
    );
  }

  // Completion state
  if (complete) {
    return (
      <div className="p-5 md:p-8 max-w-2xl mx-auto">
        <Card className="card-premium p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Session abgeschlossen!</h1>
          <p className="text-muted-foreground mb-6">
            {sessionStats.reviewed} Karten wiederholt · +{sessionStats.xpEarned} XP
          </p>
          <div className="grid grid-cols-4 gap-3 mb-8 max-w-xs mx-auto">
            {(["perfect","good","hard","blackout"] as Quality[]).map(q => (
              <div key={q} className="text-center p-3 rounded-xl bg-secondary/60">
                <div className="text-lg font-bold text-foreground">{sessionStats[q]}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{qualityLabels[q].label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => { setItems([]); fetchDue(); setCurrentIdx(0); setFlipped(false); setComplete(false); setSessionStats({ reviewed: 0, perfect: 0, good: 0, hard: 0, blackout: 0, xpEarned: 0 }); }} className="shadow-lg shadow-primary/20">
              <RefreshCw size={16} className="mr-2" />Weitere laden
            </Button>
            <a href="/learn"><Button variant="outline">Neue Lektionen <ArrowRight size={16} className="ml-2" /></Button></a>
          </div>
        </Card>
      </div>
    );
  }

  // Main review card
  const current = items[currentIdx];
  const progress = ((currentIdx) / items.length) * 100;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Wiederholung</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {currentIdx + 1} von {items.length} Karten
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground"><CheckCircle2 size={14} className="text-emerald-500" /> {sessionStats.reviewed}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><Zap size={14} className="text-amber-500" /> +{sessionStats.xpEarned}</span>
        </div>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* Flashcard */}
      <Card className="card-premium overflow-hidden cursor-pointer select-none min-h-[320px]" onClick={() => !flipped && setFlipped(true)}>
        <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center min-h-[320px]">
          {!flipped ? (
            <div className="text-center space-y-4 animate-fade-in-up">
              <span className="badge-premium bg-primary/10 text-primary border-primary/20 mb-2">{current.vocabulary?.level} · {current.vocabulary?.pos}</span>
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                {current.vocabulary?.article && <span className="text-primary/70 text-2xl">{current.vocabulary.article} </span>}
                {current.vocabulary?.word || "..."}
              </div>
              <p className="text-muted-foreground text-sm">Tippen oder Leertaste zum Aufdecken</p>
            </div>
          ) : (
            <div className="text-center space-y-5 animate-fade-in-up w-full">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {current.vocabulary?.translationEn}
              </div>
              {current.vocabulary?.translationTr && (
                <div className="text-lg text-muted-foreground">{current.vocabulary.translationTr}</div>
              )}
              {current.vocabulary?.exampleSentence && (
                <div className="p-4 rounded-xl bg-secondary/60 border border-border/60 max-w-md mx-auto mt-4">
                  <p className="text-sm text-foreground italic">&ldquo;{current.vocabulary.exampleSentence}&rdquo;</p>
                  {current.vocabulary.exampleTranslation && (
                    <p className="text-xs text-muted-foreground mt-1">{current.vocabulary.exampleTranslation}</p>
                  )}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                Wiederholung #{current.repetitions + 1} · Intervall: {current.interval}d
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(qualityLabels) as [Quality, typeof qualityLabels[Quality]][]).map(([key, q]) => (
            <button
              key={key}
              onClick={() => handleRate(key)}
              className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm ${q.color}`}
            >
              <span className="block">{q.label}</span>
              <span className="text-[10px] opacity-70">[{q.shortcut}]</span>
            </button>
          ))}
        </div>
      )}

      {!flipped && (
        <div className="flex justify-center gap-4">
          <button onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => setFlipped(true)}
            className="text-muted-foreground text-sm">Aufdecken</button>
          <button onClick={() => currentIdx < items.length - 1 && setCurrentIdx(currentIdx + 1)} disabled={currentIdx === items.length - 1}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
