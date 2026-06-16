"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GrammarTopic {
  id: string;
  name: string;
  description: string;
  level: string;
  explanation: string;
  examples: string;
  tips: string | null;
}

export default function GrammarPage() {
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrammar = async () => {
      const params = new URLSearchParams({ limit: "100" });
      if (level) params.append("level", level);
      
      const res = await fetch(`/api/grammar?${params}`);
      const data = await res.json();
      
      setGrammarTopics(data.grammarTopics || []);
      setLoading(false);
    };

    fetchGrammar();
  }, [level]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const levelCounts = {
    A1: grammarTopics.filter(g => g.level === "A1").length,
    A2: grammarTopics.filter(g => g.level === "A2").length,
    B1: grammarTopics.filter(g => g.level === "B1").length,
    B2: grammarTopics.filter(g => g.level === "B2").length,
    C1: grammarTopics.filter(g => g.level === "C1").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold gradient-text">Grammatiktrainer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {grammarTopics.length} Grammatikthemen für systematisches Lernen
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex justify-center">
        <Select value={level || ""} onValueChange={(val) => setLevel(val || null)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alle Niveaus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Alle Niveaus ({grammarTopics.length})</SelectItem>
            {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
              <SelectItem key={lvl} value={lvl}>{lvl} ({levelCounts[lvl as keyof typeof levelCounts] || 0})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Gesamt", value: grammarTopics.length, icon: "📚", color: "from-purple-500 to-pink-600" },
          { label: "Anfänger (A1-A2)", value: (levelCounts.A1 || 0) + (levelCounts.A2 || 0), icon: "🌱", color: "from-green-500 to-emerald-600" },
          { label: "Fortgeschrittene (B1-C1)", value: (levelCounts.B1 || 0) + (levelCounts.B2 || 0) + (levelCounts.C1 || 0), icon: "🎓", color: "from-blue-500 to-indigo-600" },
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

      {/* Grammar Topics */}
      <div className="rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <h2 className="text-2xl font-display font-bold text-white">Grammatikthemen</h2>
        </div>
        <CardContent className="p-6">
          {grammarTopics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-6">📖</div>
              <p className="text-xl font-semibold mb-2">Noch keine Grammatikthemen</p>
              <p className="text-muted-foreground mb-6">Bald gibt es hier Grammatikerklärungen!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grammarTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-6 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-primary">{topic.name}</h3>
                      <p className="text-muted-foreground">{topic.description}</p>
                    </div>
                    <Badge className="text-base px-4 py-1">{topic.level}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                      <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-2">ERKLÄRUNG</h4>
                      <p className="text-slate-700 dark:text-slate-300">{topic.explanation}</p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-2">BEISPIELE</h4>
                      <p className="text-amber-900 dark:text-amber-200 italic">{topic.examples}</p>
                    </div>
                    
                    {topic.tips && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">💡 TIPP</h4>
                        <p className="text-blue-900 dark:text-blue-200">{topic.tips}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
