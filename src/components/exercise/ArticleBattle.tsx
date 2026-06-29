"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  question: string;
  words: { word: string; article: string }[];
  onAnswer: (score: number) => void;
}

export function ArticleBattle({ question, words, onAnswer }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const scoreRef = useRef(0);
  const onAnswerRef = useRef(onAnswer);
  onAnswerRef.current = onAnswer;

  const articles = ["der", "die", "das"];
  const current = words[currentIdx];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onAnswerRef.current(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function handleSelect(article: string) {
    if (selected || timeLeft === 0) return;
    setSelected(article);
    const correct = article === current.article;

    if (correct) {
      const newScore = score + 10 + streak * 2;
      setScore(newScore);
      scoreRef.current = newScore;
      setStreak((s) => s + 1);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      setCurrentIdx((i) => (i + 1) % words.length);
    }, 600);
  }

  if (timeLeft === 0) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-primary">{score}</div>
        <p className="text-muted-foreground">Punkte</p>
        <p className="text-sm">Längester Streak: {streak}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-semibold">{question}</h2>
        <div className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500" : "text-muted-foreground"}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold font-display py-8">{current?.word}</div>
      </div>

      <div className="flex justify-center gap-4">
        {articles.map((art) => (
          <button
            key={art}
            onClick={() => handleSelect(art)}
            disabled={!!selected}
            className={`w-20 h-20 rounded-2xl text-2xl font-bold font-display transition-all active:scale-95 ${
              feedback === "correct" && art === current.article
                ? "bg-success text-white scale-110"
                : feedback === "wrong" && art === selected
                ? "bg-red-500 text-white"
                : art === "der"
                ? "bg-blue-100 border-2 border-blue-300 text-blue-800 hover:bg-blue-200"
                : art === "die"
                ? "bg-pink-100 border-2 border-pink-300 text-pink-800 hover:bg-pink-200"
                : "bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200"
            }`}
          >
            {art}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-sm">
        <span className="font-bold text-primary">{score} XP</span>
        <span className="text-muted-foreground">Streak: {streak} 🔥</span>
      </div>
    </div>
  );
}
