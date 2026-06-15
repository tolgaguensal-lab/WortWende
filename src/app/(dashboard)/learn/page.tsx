"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const levelMeta: Record<string, { label: string; color: string; icon: string }> = {
  A1: { label: "Anfänger", color: "from-green-400 to-green-600", icon: "🌱" },
  A2: { label: "Grundlagen", color: "from-blue-400 to-blue-600", icon: "🏙️" },
  B1: { label: "Fortgeschritten", color: "from-orange-400 to-orange-600", icon: "💼" },
  B2: { label: "Selbstständig", color: "from-purple-400 to-purple-600", icon: "🎓" },
  C1: { label: "Experte", color: "from-red-400 to-red-600", icon: "👑" },
};

interface Course {
  id: string;
  level: string;
  name: string;
  description: string;
  totalLessons: number;
  totalUnits: number;
}

export default function LearnPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get("level");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const placementLevel = (queryLevel || (session?.user as any)?.placementLevel) as string | null;

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-36 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-2">Lernpfad</h1>
      <p className="text-muted-foreground mb-8">Wähle einen Kurs und starte deine Deutschreise</p>

      {placementLevel ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              Empfohlenes Niveau: <strong>{placementLevel}</strong> &mdash;{" "}
              {levelMeta[placementLevel]?.label || placementLevel}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Du kannst jedes Niveau wählen, das am besten zu dir passt.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Noch kein Einstufungstest gemacht
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Mach den Test, um dein empfohlenes Startniveau zu erfahren.
            </p>
          </div>
          <Link href="/placement-test">
            <Button variant="outline" size="sm">Test starten</Button>
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {courses.map((course) => {
          const meta = levelMeta[course.level] || { label: course.level, color: "from-gray-400 to-gray-600", icon: "📚" };
          const isRecommended = placementLevel === course.level;
          return (
            <Card key={course.id} className={`overflow-hidden transition-all hover:shadow-lg ${isRecommended ? "ring-2 ring-blue-500" : ""}`}>
              <div className={`bg-gradient-to-r ${meta.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{meta.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-white/20 text-white border-0">{course.level}</Badge>
                        {isRecommended && (
                          <Badge className="bg-blue-500 text-white border-0 text-xs">Empfohlen</Badge>
                        )}
                      </div>
                      <h2 className="text-2xl font-display font-bold">{course.name}</h2>
                      <p className="text-white/80">{course.description}</p>
                    </div>
                  </div>
                  <Link href={`/learn/${course.id}`}>
                    <Button className="bg-white text-gray-900 hover:bg-white/90">Starten</Button>
                  </Link>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{course.totalUnits} Einheiten</span>
                  <span>&middot;</span>
                  <span>{course.totalLessons} Lektionen</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
