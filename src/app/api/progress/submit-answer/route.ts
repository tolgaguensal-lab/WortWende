import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const userId = session.user.id;
  const { exerciseId, answer, timeSpent } = await req.json();

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return NextResponse.json({ error: "Übung nicht gefunden" }, { status: 404 });

  const isCorrect = answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
  const xpEarned = isCorrect ? exercise.xpValue : 0;

  await prisma.userAnswer.create({ data: { userId, exerciseId, answer, isCorrect, timeSpent } });
  if (isCorrect) {
    await prisma.userProfile.upsert({
      where: { userId },
      update: { totalXp: { increment: xpEarned } },
      create: { userId, totalXp: xpEarned },
    });
  }

  return NextResponse.json({ isCorrect, correctAnswer: exercise.correctAnswer, explanation: exercise.explanation, xpEarned });
}
