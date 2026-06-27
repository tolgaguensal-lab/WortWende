"use client";

import { useEffect, useState, use } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const levelColors: Record<string, string> = {
  A1: "from-primary to-primary-hover",
  A2: "from-blue-400 to-blue-600",
  B1: "from-orange-400 to-orange-600",
  B2: "from-primary to-primary/80",
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
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
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
      <div className="p-6 max-w-6xl mx-auto animate-pulse space-y-8">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-2xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-12 w-64 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl font-semibold mb-4">Kurs nicht gefunden</p>
        <Link href="/learn" className="text-primary hover:underline text-lg">← Zurück zum Lernpfad</Link>
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
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <Link href="/learn" className="inline-flex items-center gap-2 text-primary hover:text-blue-700 transition-colors text-sm font-medium group">
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        <span>Zurück zum Lernpfad</span>
      </Link>

      {/* Course Header */}
      <div className={`relative bg-gradient-to-r ${gradient} rounded-3xl p-8 md:p-12 text-primary-foreground shadow-2xl overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBWMGg2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiByZWY9IiNhIi8+PC9zdmc+')]"></div>
        </div>
        
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-primary-muted/50 flex items-center justify-center text-6xl shadow-2xl">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-primary-muted text-primary-foreground border-0 text-base px-4 py-1">{course.level}</Badge>
              <div className="text-primary-foreground/80 text-sm">
                <span className="font-semibold">{completedCount}</span>/{totalCount} Lektionen abgeschlossen
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">{course.name}</h1>
            <p className="text-primary-foreground/90 text-lg mt-2 max-w-3xl">{course.description}</p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Fortschritt</span>
                <span className="font-bold text-xl">{progressPct}%</span>
              </div>
              <div className="bg-primary-muted/50 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-white to-blue-100 h-full rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-12">
        {course.units.map((unit, ui) => (
          <div key={unit.id} className="animate-fade-in" style={{ animationDelay: `${ui * 100}ms` }}>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shrink-0"
                style={{
                  background: unit.themeColor
                    ? `linear-gradient(135deg, ${unit.themeColor}, ${unit.themeColor}dd)`
                    : "linear-gradient(135deg, #666, #555)",
                }}
              >
                {unit.order}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">{unit.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{unit.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 ml-5">
              {unit.lessons.map((lesson, li) => {
                const isLast = li === unit.lessons.length - 1;
                const isLocked = false; // Level-based access now, not lesson-based
                return (
                  <div key={lesson.id} className="relative">
                    {!isLast && (
                      <div className="absolute top-20 left-1/2 w-6 h-0.5 bg-gray-300 dark:bg-gray-700 z-0 hidden md:block rounded-full" />
                    )}

                    {isLocked ? (
                      <div className="relative z-10 flex flex-col items-center gap-2 opacity-60">
                        <div className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl cursor-not-allowed shadow-md">
                          🔒
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20 truncate">
                            {lesson.xpReward} XP
                          </p>
                        </div>
                      </div>
                    ) : lesson.progress?.completed ? (
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-3xl shadow-lg transform hover:scale-105 transition-transform">
                          ✅
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-success w-20">
                            {lesson.progress.score}%
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 w-20 truncate mt-0.5">
                            {lesson.name.split(" ").slice(0, 2).join(" ")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/exercise/${lesson.id}`}
                        className="relative z-10 flex flex-col items-center gap-2 group"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:shadow-xl transition-all cursor-pointer">
                          📖
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 w-20">
                            {lesson.xpReward} XP
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 w-20 truncate mt-0.5">
                            {lesson.name.split(" ").slice(0, 2).join(" ")}
                          </p>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Horizontal connector line for smaller screens */}
            <div className="mt-4 ml-16 h-px bg-gradient-to-r from-gray-300 to-transparent md:hidden" />
          </div>
        ))}
      </div>

      {allLessons.length === 0 && (
        <div className="text-center py-24">
          <div className="text-7xl mb-6">🛠️</div>
          <p className="text-2xl font-semibold mb-2">Dieser Kurs hat noch keine Lektionen</p>
          <p className="text-muted-foreground">Bald gibt es hier spannende Inhalte!</p>
        </div>
      )}
    </div>
  );
}
