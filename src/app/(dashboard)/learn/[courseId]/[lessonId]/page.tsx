"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LessonDetail {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  exercises: unknown[];
  unit: { name: string; course: { id: string; name: string; level: string } };
}

export default function LessonStartPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { courseId, lessonId } = params;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => setLesson(data))
      .finally(() => setLoading(false));
  }, [lessonId]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href={`/learn/${courseId}`} className="text-primary hover:underline text-sm mb-4 inline-block">
        ← Zurück zum Kurs
      </Link>

      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
              <div className="h-6 w-48 bg-muted rounded mx-auto" />
              <div className="h-4 w-32 bg-muted rounded mx-auto" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <div className="text-6xl mb-4">📖</div>
            <CardTitle className="text-2xl font-display">{lesson?.name || "Lektion"}</CardTitle>
            <p className="text-muted-foreground">{lesson?.description || "Inhalt wird geladen..."}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div>
                <span className="text-lg">📝</span>
                <br />
                {lesson?.exercises?.length || "..."} Übungen
              </div>
              <div>
                <span className="text-lg">⚡</span>
                <br />+{lesson?.xpReward || "..."} XP
              </div>
            </div>
            <Link href={`/exercise/${lessonId}`}>
              <Button size="lg" className="w-full text-lg py-6">
                Lektion starten
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
