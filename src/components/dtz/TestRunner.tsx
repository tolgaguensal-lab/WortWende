"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface TestRunnerProps {
  testId: string;
  test: {
    id: string;
    name: string;
    level: string;
    skill: string;
    questions: Question[];
    timeLimit: number;
  };
  onComplete: (results: any) => void;
}

export function TestRunner({ testId, test, onComplete }: TestRunnerProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60);
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = typeof test.questions === "string" ? JSON.parse(test.questions) : test.questions;

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const result = await fetch("/api/dtz-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        answers: questions.map((q: Question, i: number) => ({
          answer: answers[i],
          isCorrect: answers[i] === q.correctAnswer,
        })),
        timeSpent: test.timeLimit * 60 - timeLeft,
      }),
    }).then((r) => r.json());

    onComplete(result);
  };

  if (showResult) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header with Timer */}
      <div className="flex items-center justify-between">
        <div>
          <Badge className={`bg-gradient-to-r ${test.level === "A2" ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} border-0 mb-2`}>
            {test.level}
          </Badge>
          <h1 className="text-2xl font-display font-bold">{test.skill}</h1>
        </div>
        <div className={`text-3xl font-mono font-bold ${timeLeft < 300 ? "text-destructive" : "text-primary"}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fortschritt</span>
          <span className="font-medium">{currentQuestion + 1} / {questions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Frage {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentQ.text}</p>

          {currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, i) => (
                <Button
                  key={i}
                  variant={answers[currentQuestion] === option ? "default" : "outline"}
                  onClick={() => handleAnswer(option)}
                  className="w-full justify-start text-left h-auto py-4 px-6 text-base"
                  disabled={answers[currentQuestion] !== undefined}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              ← Zurück
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answers.some((a) => a === undefined)}
                className="bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-700"
              >
                Test beenden →
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={answers[currentQuestion] === undefined}
              >
                Weiter →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
