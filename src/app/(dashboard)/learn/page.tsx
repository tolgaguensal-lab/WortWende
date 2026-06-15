"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const courses = [
  { id: "a1", level: "A1", name: "Dorfleben", desc: "Grundlagen im Alltag", color: "from-green-400 to-green-600", icon: "🏘️", lessons: 7 },
  { id: "a2", level: "A2", name: "Stadt", desc: "Im Alltag zurechtkommen", color: "from-blue-400 to-blue-600", icon: "🏙️", lessons: 8 },
  { id: "b1", level: "B1", name: "Arbeitsplatz", desc: "Beruf und Karriere", color: "from-orange-400 to-orange-600", icon: "💼", lessons: 8 },
  { id: "b2", level: "B2", name: "Universität", desc: "Studium und Forschung", color: "from-purple-400 to-purple-600", icon: "🎓", lessons: 8 },
  { id: "c1", level: "C1", name: "Meisterklasse", desc: "Fortgeschrittenes Deutsch", color: "from-red-400 to-red-600", icon: "👑", lessons: 8 },
];

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    A1: "Anfänger",
    A2: "Grundlagen",
    B1: "Fortgeschritten",
    B2: "Selbstständig",
    C1: "Experte",
  };
  return labels[level] || level;
}

export default function LearnPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get("level");

  const placementLevel = (queryLevel || (session?.user as any)?.placementLevel) as string | null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-2">Lernpfad</h1>
      <p className="text-muted-foreground mb-8">Wähle ein Kurs und starte deine Deutschreise</p>

      {placementLevel ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              Empfohlenes Niveau: <strong>{placementLevel}</strong> &mdash; {getLevelLabel(placementLevel)}
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
          const isRecommended = placementLevel === course.level;
          return (
            <Card key={course.id} className={`overflow-hidden transition-all hover:shadow-lg ${isRecommended ? "ring-2 ring-blue-500" : ""}`}>
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{course.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-white/20 text-white border-0">{course.level}</Badge>
                        {isRecommended && (
                          <Badge className="bg-blue-500 text-white border-0 text-xs">Empfohlen</Badge>
                        )}
                      </div>
                      <h2 className="text-2xl font-display font-bold">{course.name}</h2>
                      <p className="text-white/80">{course.desc}</p>
                    </div>
                  </div>
                  <Link href={`/learn/${course.id}`}>
                    <Button className="bg-white text-gray-900 hover:bg-white/90">Starten</Button>
                  </Link>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{course.lessons} Lektionen</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
