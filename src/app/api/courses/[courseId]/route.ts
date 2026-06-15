import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Fetch user progress for all lessons in this course
  const lessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id));
  let progressMap: Record<string, { completed: boolean; score: number; xpEarned: number }> = {};

  if (userId && lessonIds.length > 0) {
    const progress = await prisma.userProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
    });
    for (const p of progress) {
      progressMap[p.lessonId] = { completed: p.completed, score: p.score, xpEarned: p.xpEarned };
    }
  }

  // Determine which lesson is unlocked next (first incomplete)
  let firstIncompleteId: string | null = null;
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      const prog = progressMap[lesson.id];
      if (!prog?.completed) {
        firstIncompleteId = lesson.id;
        break;
      }
    }
    if (firstIncompleteId) break;
  }
  // If all completed, last lesson is current
  if (!firstIncompleteId && lessonIds.length > 0) {
    firstIncompleteId = lessonIds[lessonIds.length - 1];
  }

  const result = {
    id: course.id,
    level: course.level,
    name: course.name,
    description: course.description,
    units: course.units.map((u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
      order: u.order,
      themeColor: u.themeColor,
      lessons: u.lessons.map((l) => ({
        id: l.id,
        name: l.name,
        description: l.description,
        order: l.order,
        xpReward: l.xpReward,
        requiredXp: l.requiredXp,
        isLocked: l.isLocked,
        progress: progressMap[l.id] || null,
        isCurrent: l.id === firstIncompleteId,
      })),
    })),
  };

  return NextResponse.json(result);
}
