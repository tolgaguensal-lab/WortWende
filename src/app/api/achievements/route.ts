import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({ where: { userId } });
  const unlocked = new Set(userAchievements.map((ua) => ua.achievementId));
  return NextResponse.json({
    achievements: achievements.map((a) => ({
      ...a,
      unlocked: unlocked.has(a.id),
      unlockedAt: userAchievements.find((ua) => ua.achievementId === a.id)?.unlockedAt,
    })),
  });
}
