"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, BookOpen, ArrowRight } from "lucide-react";
import { speak } from "@/lib/tts";

interface Props {
  content: string;
  title: string;
  onComplete: () => void;
}

interface VocabItem {
  word: string;
  translation: string;
  example?: string;
}

export function VocabStep({ content, onComplete }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  let items: VocabItem[] = [];
  try {
    items = JSON.parse(content);
  } catch {
    items = content.split("\n").filter(Boolean).map((line) => {
      const [word, translation, ...rest] = line.split("|");
      return { word: word?.trim() || "", translation: translation?.trim() || "", example: rest.join("|").trim() };
    });
  }
  if (items.length === 0) items = [{ word: "hallo", translation: "hello" }, { word: "danke", translation: "thanks" }, { word: "tschüss", translation: "bye" }];

  function reveal(idx: number) {
    const next = new Set(revealed);
    next.add(idx);
    setRevealed(next);
    if (next.size === items.length) setAllRevealed(true);
  }

  function playAudio(idx: number, word: string) {
    setPlayingIdx(idx);
    speak(word, "de-DE");
    setTimeout(() => setPlayingIdx(null), 1200);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen size={14} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          Lerne die neuen Vokabeln. Klicke auf eine Karte fur die Ubersetzung, auf das Lautsprechersymbol fur die Aussprache.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              revealed.has(idx)
                ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700"
                : "border-border/60 bg-card hover:border-primary/30"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <button onClick={() => reveal(idx)} className="flex-1 text-left min-h-[60px]">
                <div className="font-semibold text-foreground">{item.word}</div>
                {revealed.has(idx) ? (
                  <div className="mt-2 space-y-1 animate-fade-in">
                    <div className="text-sm text-muted-foreground">{item.translation}</div>
                    {item.example && <div className="text-xs text-muted-foreground/70 italic">&ldquo;{item.example}&rdquo;</div>}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground/40 mt-2">Zum Anzeigen klicken</div>
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(idx, item.word); }}
                className={`p-2 rounded-lg transition-all shrink-0 ${
                  playingIdx === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                }`}
                title="Aussprache anhoren"
              >
                {playingIdx === idx ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {allRevealed && (
        <div className="text-center pt-2">
          <Button onClick={onComplete} size="lg" className="shadow-lg shadow-primary/20 group">
            Weiter zu Grammatik <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
