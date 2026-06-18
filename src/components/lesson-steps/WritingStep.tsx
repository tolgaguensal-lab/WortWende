"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine, CheckCircle2, AlertCircle, Hash, FileText } from "lucide-react";

interface Props {
  content: string;
  title: string;
  onComplete: () => void;
}

interface WritingPrompt {
  prompt: string;
  hints?: string[];
  minWords?: number;
}

export function WritingStep({ content, onComplete }: Props) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  let prompts: WritingPrompt[] = [];
  try { prompts = JSON.parse(content); } catch { prompts = [{ prompt: content || "Schreibe einen kurzen Text zu diesem Thema...", hints: ["Satzanfang: ..."] }]; }
  const prompt = prompts[0];
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const uniqueRatio = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 0;
  const meetsMinWords = !prompt.minWords || wordCount >= prompt.minWords;

  const getFeedback = () => {
    const feedback: string[] = [];
    if (wordCount === 0) feedback.push("Du hast noch keinen Text geschrieben.");
    else if (wordCount < 3) feedback.push("Versuche, einen etwas langere Antwort zu schreiben.");
    else feedback.push(`Dein Text enthalt ${wordCount} Worter.`);

    if (prompt.minWords && wordCount < prompt.minWords)
      feedback.push(`Ziel waren mindestens ${prompt.minWords} Worter — versuche es beim nachsten Mal langer.`);
    else if (wordCount >= 5 && uniqueRatio >= 70)
      feedback.push("Toller Wortschatz! Du verwendest viele verschiedene Worter.");
    else if (wordCount >= 5)
      feedback.push("Du konntest noch mehr unterschiedliche Worter einbauen.");

    return feedback;
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl border border-border/60 bg-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <PenLine size={14} className="text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">{prompt.prompt}</h3>
        </div>
        {prompt.hints && prompt.hints.length > 0 && (
          <div className="space-y-1 ml-10">
            {prompt.hints.map((h, i) => (
              <p key={i} className="text-xs text-muted-foreground">&bull; {h}</p>
            ))}
          </div>
        )}
        {prompt.minWords && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 ml-10">
            <Hash size={12} />Mindestens {prompt.minWords} Worter
          </p>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
        placeholder="Schreibe deinen Text hier..."
        rows={7}
        className="w-full p-4 rounded-xl border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><FileText size={12} />{wordCount} Worter</span>
          {wordCount > 0 && <span className="flex items-center gap-1"><Hash size={12} />{uniqueWords.size} verschiedene</span>}
        </div>
        {!submitted ? (
          <Button onClick={() => setSubmitted(true)} disabled={text.trim().length < 3} size="lg" className="shadow-lg shadow-primary/20">
            <CheckCircle2 size={16} className="mr-2" />Abschicken
          </Button>
        ) : (
          <Button onClick={onComplete} size="lg" className="shadow-lg shadow-primary/20 group">
            Weiter <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </div>

      {submitted && (
        <div className={`p-4 rounded-xl border ${meetsMinWords ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/30" : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30"} space-y-2`}>
          <div className="flex items-center gap-2">
            {meetsMinWords ? (
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
            )}
            <span className="font-medium text-sm text-foreground">Feedback zu deinem Text</span>
          </div>
          <ul className="space-y-1">
            {getFeedback().map((fb, i) => (
              <li key={i} className="text-xs text-muted-foreground">&bull; {fb}</li>
            ))}
          </ul>
          {wordCount > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-background border border-border/40">
              <p className="text-xs text-muted-foreground italic whitespace-pre-line">&ldquo;{text}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
