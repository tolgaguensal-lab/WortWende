import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      lessonSteps: { orderBy: { order: "asc" } },
      exercises: { 
        orderBy: { order: "asc" },
        select: {
          id: true,
          type: true,
          question: true,
          content: true,
          xpValue: true,
          difficulty: true,
          order: true,
          // correctAnswer is omitted for security
        }
      },
      unit: { include: { course: true } },
    },
  });
  if (!lesson) return NextResponse.json({ error: "Lektion nicht gefunden" }, { status: 404 });
  return NextResponse.json(lesson);
}
