import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateNextReview } from "@/lib/spaced-repetition";
import { ReviewQuality } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const items = await prisma.reviewItem.findMany({
    where: { userId, nextReview: { lte: new Date() } },
    include: { vocabulary: true },
    orderBy: { nextReview: "asc" },
    take: 20,
  });
  return NextResponse.json({ items, totalDue: items.length });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const { reviewItemId, quality } = await req.json();
  const item = await prisma.reviewItem.findUnique({ where: { id: reviewItemId } });
  if (!item) return NextResponse.json({ error: "Element nicht gefunden" }, { status: 404 });

  const q = quality === "perfect" ? ReviewQuality.PERFECT : quality === "good" ? ReviewQuality.GOOD : quality === "hard" ? ReviewQuality.HARD : ReviewQuality.BLACKOUT;
  const result = calculateNextReview(q, item.interval, item.easeFactor, item.repetitions);

  await prisma.reviewItem.update({
    where: { id: reviewItemId },
    data: { interval: result.nextInterval, easeFactor: result.nextEaseFactor, repetitions: result.nextRepetitions, nextReview: result.nextReviewDate, lastReview: new Date() },
  });

  const xp = q === ReviewQuality.PERFECT ? 10 : q === ReviewQuality.GOOD ? 5 : q === ReviewQuality.HARD ? 2 : 0;
  return NextResponse.json({ nextInterval: result.nextInterval, nextReview: result.nextReviewDate, xpEarned: xp });
}
