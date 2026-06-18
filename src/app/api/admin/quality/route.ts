import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Kein Admin" }, { status: 403 });

  const lessons = await prisma.lesson.findMany({
    include: {
      lessonSteps: { select: { id: true } },
      exercises: { select: { id: true } },
      learningObjectives: { select: { id: true } },
    },
    orderBy: [{ unitId: "asc" }, { order: "asc" }],
    take: 100,
  });

  const reports = lessons.map((lesson) => {
    const stepCount = lesson.lessonSteps.length;
    const exerciseCount = lesson.exercises.length;
    const hasLearningObjective = lesson.learningObjectives.length > 0;

    let score = 0;
    if (stepCount >= 12) score += 40;
    else if (stepCount >= 6) score += 25;
    else if (stepCount > 0) score += 10;
    if (exerciseCount >= 5) score += 30;
    else if (exerciseCount >= 3) score += 15;
    else if (exerciseCount > 0) score += 5;
    if (hasLearningObjective) score += 15;
    if (lesson.isPublished) score += 15;

    return {
      lessonId: lesson.id,
      lessonName: lesson.name,
      level: lesson.skillCategory || "A1",
      hasSteps: stepCount > 0,
      stepCount,
      exerciseCount,
      hasLearningObjective,
      isPublished: lesson.isPublished,
      completeness: Math.min(100, score),
    };
  });

  return NextResponse.json({ reports });
}
