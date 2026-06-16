"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vocabulary {
  id: string;
  word: string;
  article: string | null;
  plural: string | null;
  pos: string;
  level: string;
  translationEn: string;
  exampleSentence: string | null;
}

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, hasMore: false });

  useEffect(() => {
    const fetchVocabulary = async () => {
      const params = new URLSearchParams({ limit: "100" });
      if (level) params.append("level", level);
      
      const res = await fetch(`/api/vocabulary?${params}`);
      const data = await res.json();
      
      setVocabulary(data.vocabulary || []);
      setPagination(data.pagination || { total: 0, totalPages: 0, hasMore: false });
      setLoading(false);
    };

    fetchVocabulary();
  }, [level]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const levelCounts = {
    A1: vocabulary.filter(v => v.level === "A1").length,
    A2: vocabulary.filter(v => v.level === "A2").length,
    B1: vocabulary.filter(v => v.level === "B1").length,
    B2: vocabulary.filter(v => v.level === "B2").length,
    C1: vocabulary.filter(v => v.level === "C1").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold gradient-text">Vokabeltrainer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {vocabulary.length} Vokabeln in deiner Sammlung
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex justify-center">
        <Select value={level || ""} onValueChange={(val) => setLevel(val || null)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alle Niveaus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Alle Niveaus ({vocabulary.length})</SelectItem>
            {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
              <SelectItem key={lvl} value={lvl}>{lvl} ({levelCounts[lvl as keyof typeof levelCounts] || 0})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Gesamt", value: vocabulary.length, icon: "📚", color: "from-blue-500 to-indigo-600" },
          { label: "A1-A2", value: (levelCounts.A1 || 0) + (levelCounts.A2 || 0), icon: "🌱", color: "from-green-500 to-emerald-600" },
          { label: "B1-C1", value: (levelCounts.B1 || 0) + (levelCounts.B2 || 0) + (levelCounts.C1 || 0), icon: "🎓", color: "from-purple-500 to-pink-600" },
        ].map((s, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color}`} />
            <CardContent className="p-8 text-center relative z-10 text-white">
              <div className="text-6xl mb-3">{s.icon}</div>
              <p className="text-5xl font-display font-bold">{s.value}</p>
              <p className="text-white/90 font-medium mt-2">{s.label}</p>
            </CardContent>
          </div>
        ))}
      </div>

      {/* Vocabulary List */}
      <div className="rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h2 className="text-2xl font-display font-bold text-white">Meine Vokabeln</h2>
        </div>
        <CardContent className="p-6">
          {vocabulary.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-6">📖</div>
              <p className="text-xl font-semibold mb-2">Noch keine Vokabeln</p>
              <p className="text-muted-foreground mb-6">Starte eine Lektion, um Vokabeln zu lernen!</p>
              <a href="/learn">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Erste Lektion starten →
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {vocabulary.map((vocab) => (
                <div key={vocab.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {vocab.article ? `${vocab.article} ${vocab.word}` : vocab.word}
                        </span>
                        <Badge variant="outline" className="text-xs">{vocab.level}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{vocab.translationEn}</p>
                      {vocab.plural && <p className="text-xs text-muted-foreground mt-1">Plural: {vocab.plural}</p>}
                    </div>
                    <span className="text-2xl">{vocab.pos === "Adjektiv" ? "🏳️" : vocab.pos === "Zahl" ? "🔢" : "📝"}</span>
                  </div>
                  {vocab.exampleSentence && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg text-sm">
                      <p className="text-slate-700 dark:text-slate-300 italic">{`"${vocab.exampleSentence}"`}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
