"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const levelColors: Record<string, string> = {
  A1: "from-green-400 to-green-600",
  A2: "from-blue-400 to-blue-600",
  B1: "from-orange-400 to-orange-600",
  B2: "from-purple-400 to-purple-600",
  C1: "from-red-400 to-red-600",
};

const levelIcons: Record<string, string> = {
  A1: "🌱", A2: "🏙️", B1: "💼", B2: "🎓", C1: "👑",
};

interface LessonData {
  id: string;
  name: string;
  order: number;
  xpReward: number;
  isLocked: boolean;
  isCurrent: boolean;
  progress: { completed: boolean; score: number; xpEarned: number } | null;
}

interface UnitData {
  id: string;
  name: string;
  description: string;
  order: number;
  themeColor: string | null;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  level: string;
  name: string;
  description: string;
  units: UnitData[];
}

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((data) => setCourse(data))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-xl" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">Kurs nicht gefunden.</p>
        <Link href="/learn" className="text-primary hover:underline mt-4 inline-block">← Zurück zum Lernpfad</Link>
      </div>
    );
  }

  const gradient = levelColors[course.level] || "from-gray-400 to-gray-600";
  const icon = levelIcons[course.level] || "📚";
  const allLessons = course.units.flatMap((u) => u.lessons);
  const completedCount = allLessons.filter((l) => l.progress?.completed).length;
  const totalCount = allLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/learn" className="text-primary hover:underline text-sm mb-4 inline-block">
        ← Zurück zum Lernpfad
      </Link>

      {/* Course Header */}
      <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-6 md:p-8 text-white mb-8`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white/20 text-white border-0">{course.level}</Badge>
              <span className="text-white/70 text-sm">
                {completedCount}/{totalCount} Lektionen abgeschlossen
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold">{course.name}</h1>
            <p className="text-white/80 mt-1">{course.description}</p>

            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-8">
        {course.units.map((unit) => (
          <div key={unit.id}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: unit.themeColor || "#888" }}
              >
                {unit.order}
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold">{unit.name}</h2>
                <p className="text-sm text-muted-foreground">{unit.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 ml-5">
              {unit.lessons.map((lesson, li) => {
                const isLast = li === unit.lessons.length - 1;
                const isLocked = lesson.isLocked && !lesson.isCurrent && !lesson.progress?.completed;
                return (
                  <div key={lesson.id} className="relative">
                    {!isLast && (
                      <div className="absolute top-8 left-1/2 w-4 h-0.5 bg-border z-0 hidden md:block" />
                    )}

                    {isLocked ? (
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl cursor-not-allowed">
                          🔒
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground w-16 truncate">
                          {lesson.xpReward} XP
                        </p>
                      </div>
                    ) : lesson.progress?.completed ? (
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                          ✅
                        </div>
                        <p className="text-[10px] text-center text-green-600 dark:text-green-400 w-16 truncate">
                          {lesson.progress.score}%
                        </p>
                      </div>
                    ) : (
                      <Link href={`/exercise/${lesson.id}`} className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer shadow-md hover:shadow-lg">
                          📖
                        </div>
                        <p className="text-[10px] text-center text-primary w-16 truncate">
                          {lesson.xpReward} XP
                        </p>
                      </Link>
                    )}

                    <p className="text-[10px] text-center text-muted-foreground w-16 truncate mt-0.5">
                      {lesson.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Horizontal connector line for smaller screens */}
            <div className="mt-2 ml-14 h-px bg-border/50 md:hidden" />
          </div>
        ))}
      </div>

      {allLessons.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🛠️</p>
          <p className="text-muted-foreground">Dieser Kurs hat noch keine Lektionen.</p>
        </div>
      )}
    </div>
  );
}
