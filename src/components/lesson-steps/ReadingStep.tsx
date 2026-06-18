"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Eye } from "lucide-react";

interface Props {
  content: string;
  title: string;
  onComplete: () => void;
}

interface ReadingBlock {
  text: string;
  questions: { q: string; a: string }[];
}

export function ReadingStep({ content, onComplete }: Props) {
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showText, setShowText] = useState(false);

  let blocks: ReadingBlock[] = [];
  try { blocks = JSON.parse(content); } catch { blocks = [{ text: content || "Text wird vorbereitet...", questions: [] }]; }
  const block = blocks[0];

  function checkAnswer(user: string, expected: string): boolean {
    if (!user || !expected) return false;
    const u = user.toLowerCase().replace(/[.,!?;:]/g, "").trim();
    const e = expected.toLowerCase().replace(/[.,!?;:]/g, "").trim();
    if (u === e) return true;
    const uWords = new Set(u.split(/\s+/));
    const eWords = e.split(/\s+/);
    const matchCount = eWords.filter(w => uWords.has(w)).length;
    return eWords.length > 0 && matchCount >= Math.ceil(eWords.length * 0.6);
  }

  return (
    <div className="space-y-5">
      {!showQuestions ? (
        <div>
          <div className="p-5 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen size={14} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Lesetext</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{block.text}</p>
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => setShowQuestions(true)} size="lg" className="shadow-lg shadow-primary/20">
              Text gelesen &mdash; Fragen beantworten
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Fragen zum Text</h3>
            <button onClick={() => setShowText(!showText)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Eye size={14} />{showText ? "Text ausblenden" : "Text zeigen"}
            </button>
          </div>

          {showText && (
            <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 mb-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto">
              {block.text}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {block.questions.map((q, idx) => {
              const userAnswer = answers[q.q] || "";
              const isCorrect = submitted ? checkAnswer(userAnswer, q.a) : null;
              return (
                <div key={idx} className="p-4 rounded-xl border border-border/60 bg-card">
                  <p className="font-medium text-foreground text-sm mb-3">{q.q}</p>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setAnswers({ ...answers, [q.q]: e.target.value })}
                    disabled={submitted}
                    placeholder="Deine Antwort..."
                    className="w-full p-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {submitted && (
                    <div className={`mt-3 flex items-start gap-2 text-sm ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                      {isCorrect ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
                      <span>Richtige Antwort: <span className="font-medium">{q.a}</span></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <div className="text-center">
              <Button onClick={() => setSubmitted(true)} size="lg" className="shadow-lg shadow-primary/20">
                Antworten prufen
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button onClick={onComplete} size="lg" className="shadow-lg shadow-primary/20 group">
                Weiter <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
