"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { TestRunner } from "@/components/dtz/TestRunner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Test {
  id: string;
  name: string;
  level: string;
  skill: string;
  questions: any;
  timeLimit: number;
}

export default function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/dtz-tests?id=${testId}`)
      .then((r) => r.json())
      .then((data) => {
        setTest(data);
        setResult(null);
      })
      .finally(() => setLoading(false));
  }, [testId]);

  const handleComplete = (data: any) => {
    setResult(data);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted rounded" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-xl">Test nicht gefunden</p>
        <Button onClick={() => router.push("/dtz")} className="mt-4">
          Zurück zu DTZ
        </Button>
      </div>
    );
  }

  return result ? (
    <Card className="max-w-2xl mx-auto mt-8 shadow-2xl">
      <CardContent className="p-8 text-center space-y-6">
        <div className="text-6xl">{result.passed ? "🎉" : "📚"}</div>
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">
            {result.passed ? "Test bestanden!" : "Test nicht bestanden"}
          </h2>
          <p className="text-muted-foreground">
            Du hast {result.correctAnswers} von {result.totalQuestions} Fragen richtig beantwortet
          </p>
        </div>
        <div className="text-5xl font-bold font-mono text-primary">{result.score}%</div>
        <p className="text-sm text-muted-foreground">
          Benötigt: 60% zum Bestehen
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => router.push("/dtz")} variant="outline">
            Zu allen Tests
          </Button>
          <Button onClick={() => setResult(null)}>
            Test wiederholen
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <TestRunner
      testId={testId}
      test={test}
      onComplete={handleComplete}
    />
  );
}
