"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Check, EyeOff, PartyPopper } from "lucide-react";

interface ReviewDueItem {
  id: string;
  vocabularyId: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string | null;
  vocabulary: {
    word: string;
    article: string | null;
    translationEn: string;
    level: string;
    exampleSentence?: string | null;
  } | null;
}

export default function VocabularyPage() {
  const [items, setItems] = useState<ReviewDueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const fetchDueReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/review/due");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDueReviews();
  }, [fetchDueReviews]);

  const handleReview = async (itemId: string, quality: "perfect" | "good" | "hard") => {
    setReviewing(itemId);
    try {
      await fetch("/api/review/due", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewItemId: itemId, quality }),
      });
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch {
      // silent
    } finally {
      setReviewing(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-muted rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const masteredCount = items.filter(i => i.repetitions >= 3).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-display font-bold text-foreground flex items-center justify-center gap-2">
          <Brain className="text-primary" size={36} />
          Wiederholungen
        </h1>
        <p className="text-muted-foreground">
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? "Vokabel" : "Vokabeln"} zur Wiederholung fällig`
            : "Alle Vokabeln im Griff!"}
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="border-2 border-dashed border-border/60">
          <CardContent className="p-12 text-center space-y-4">
            <div className="text-6xl">
              <PartyPopper size={48} className="mx-auto text-primary opacity-60" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Keine Wiederholungen fällig</h2>
              <p className="text-muted-foreground mt-1">
                Du hast alle fälligen Vokabeln gemeistert. Komm später wieder oder lerne neue Wörter mit Leo.
              </p>
            </div>
            <Link href="/tutor">
              <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20">
                <Sparkles size={14} className="mr-2" />
                Neue Vokabeln lernen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-card border border-border/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{items.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Fällig</p>
          </div>
          <div className="bg-card border border-border/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-accent">{masteredCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Fast gemeistert</p>
          </div>
          <div className="bg-card border border-border/40 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">
              {items.reduce((max, i) => Math.max(max, i.interval), 0)}d
            </p>
            <p className="text-xs text-muted-foreground mt-1">Max. Intervall</p>
          </div>
        </div>
      )}

      {/* Review Items */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-foreground">
                      {item.vocabulary?.article ? `${item.vocabulary.article} ` : ""}
                      {item.vocabulary?.word ?? "Unbekanntes Wort"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.vocabulary?.level ?? "?"}
                    </Badge>
                  </div>
                  {item.vocabulary?.translationEn && (
                    <p className="text-sm text-muted-foreground">{item.vocabulary.translationEn}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Int: {item.interval}d</span>
                    <span>EF: {item.easeFactor.toFixed(1)}</span>
                    <span>#{item.repetitions}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(item.id, "hard")}
                    disabled={reviewing === item.id}
                    className="text-xs h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <EyeOff size={12} className="mr-1" />
                    Schwer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(item.id, "good")}
                    disabled={reviewing === item.id}
                    className="text-xs h-8 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Check size={12} className="mr-1" />
                    Gut
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(item.id, "perfect")}
                    disabled={reviewing === item.id}
                    className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Sparkles size={12} className="mr-1" />
                    Perfekt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
