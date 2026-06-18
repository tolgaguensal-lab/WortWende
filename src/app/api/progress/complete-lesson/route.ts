import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const userId = session.user.id;
  const { lessonId, score, timeSpent } = await req.json();

  const progress = await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { score, timeSpent, completed: true, completedAt: new Date() },
    create: { userId, lessonId, score, timeSpent, completed: true, completedAt: new Date() },
  });

  return NextResponse.json({ completed: true, score, progressId: progress.id });
}
