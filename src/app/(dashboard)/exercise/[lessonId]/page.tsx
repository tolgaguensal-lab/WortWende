"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonStepRenderer } from "@/components/lesson-steps/LessonStepRenderer";

interface Step {
  id: string;
  stepType: string;
  title: string;
  content: string;
  order: number;
  xpReward: number;
}

interface Exercise {
  id: string;
  type: string;
  question: string;
  content: string;
  correctAnswer: string;
  explanation: string | null;
  xpValue: number;
  difficulty: string;
  order: number;
  options: { id: string; text: string; isCorrect: boolean; order: number }[];
}

interface Lesson {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  lessonSteps: Step[];
  exercises: Exercise[];
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"steps" | "exercises" | "complete">("steps");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => { setLesson(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const exercise = lesson?.exercises[current];
  const progress = lesson ? ((current) / lesson.exercises.length) * 100 : 0;

  function handleStepsComplete() {
    setPhase("exercises");
  }

  function handleCheck() {
    if (!exercise) return;
    let isCorrect = false;
    if (exercise.options.length > 0 && selected !== null) {
      isCorrect = exercise.options[selected]?.isCorrect === true;
    } else {
      isCorrect = textInput.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    }
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    if (!lesson || current + 1 >= lesson.exercises.length) {
      setPhase("complete");
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setTextInput("");
    setChecked(false);
    setCorrect(null);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">Lektion nicht gefunden.</p>
        <Button onClick={() => router.push("/learn")}>Zurück zum Lernpfad</Button>
      </div>
    );
  }

  // Phase 1: Lesson Steps
  if (phase === "steps" && lesson.lessonSteps.length > 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/learn")}
            className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
          >
            ← Zurück
          </button>
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold">{lesson.name}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>
          <LessonStepRenderer steps={lesson.lessonSteps} onComplete={handleStepsComplete} />
        </div>
      </div>
    );
  }

  // Phase 2: Exercises
  if (phase === "exercises" && exercise) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>✕</Button>
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">Übung {current + 1}/{lesson!.exercises.length}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-lg">
            <CardContent className="p-8">
              <h2 className="text-xl font-display font-semibold mb-6 text-center">{exercise.question}</h2>

              {exercise.options.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {exercise.options.map((opt, i) => (
                    <button
                      key={opt.id}
                      onClick={() => !checked && setSelected(i)}
                      className={`p-4 rounded-xl border-2 text-left transition-all font-medium ${
                        checked
                          ? opt.isCorrect
                            ? "border-success bg-success-muted text-success dark:bg-success/10 dark:text-success"
                            : i === selected
                            ? "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "border-border opacity-50"
                          : selected === i
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}

              {exercise.options.length === 0 && (
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Deine Antwort..."
                  disabled={checked}
                  className="w-full p-4 border-2 rounded-xl text-lg text-center font-medium focus:outline-none focus:border-primary disabled:opacity-50"
                />
              )}

              {checked && (
                <div className="mt-4 space-y-2">
                  <div className={`p-4 rounded-xl text-center ${correct ? "bg-success-muted text-success dark:bg-success/10 dark:text-success" : "bg-destructive-muted text-destructive dark:bg-destructive/10 dark:text-destructive"}`}>
                    {correct ? "Richtig! 🎉" : "Leider falsch!"}
                  </div>
                  {exercise.explanation && (
                    <div className="p-3 rounded-xl bg-muted text-sm text-muted-foreground">
                      {exercise.explanation}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="p-4 border-t bg-card">
          <div className="max-w-lg mx-auto">
            {!checked ? (
              <Button onClick={handleCheck} disabled={exercise.options.length > 0 ? selected === null : textInput.trim() === ""} className="w-full">
                Prüfen
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full">
                {current + 1 >= lesson.exercises.length ? "Ergebnis ansehen" : "Weiter"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Complete
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-display font-bold mb-2">Lektion abgeschlossen!</h2>
          <p className="text-muted-foreground mb-2">
            {score} von {lesson.exercises.length} Übungen richtig
          </p>
          <p className="text-3xl font-bold text-primary mb-6">+{lesson.xpReward + score * 5} XP</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/learn")} size="lg">
              Zum Lernpfad
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Zum Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
