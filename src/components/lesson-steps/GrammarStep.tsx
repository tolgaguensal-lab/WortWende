"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";

interface Props {
  content: string;
  title: string;
  onComplete: () => void;
}

interface GrammarBlock {
  rule: string;
  explanation: string;
  examples: string[];
}

export function GrammarStep({ content, title, onComplete }: Props) {
  const [readTime, setReadTime] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  let blocks: GrammarBlock[] = [];
  try {
    blocks = JSON.parse(content);
  } catch {
    blocks = [{ rule: title || "Grammatikregel", explanation: content || "Inhalt wird vorbereitet...", examples: ["Beispiel 1", "Beispiel 2"] }];
  }

  useEffect(() => {
    const timer = setInterval(() => setReadTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleBlock = (idx: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => (
        <div key={idx} className="rounded-xl border border-border/60 bg-card overflow-hidden transition-all">
          <button
            onClick={() => toggleBlock(idx)}
            className="w-full p-5 flex items-start justify-between gap-3 text-left hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{idx + 1}</span>
              </div>
              <h3 className="font-semibold text-foreground">{block.rule}</h3>
            </div>
            <span className={`text-muted-foreground/60 text-xs transition-transform ${expanded.has(idx) ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {expanded.has(idx) && (
            <div className="px-5 pb-5 pt-0 space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground leading-relaxed">{block.explanation}</p>
              {block.examples.length > 0 && (
                <div className="space-y-2">
                  {block.examples.map((ex, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/40 text-sm italic text-foreground/80">
                      &ldquo;{ex}&rdquo;
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>Lesezeit: {readTime}s</span>
        </div>
        <Button onClick={onComplete} size="lg" className="shadow-lg shadow-primary/20 group">
          <CheckCircle2 size={16} className="mr-2" />Verstanden &amp; Weiter
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
