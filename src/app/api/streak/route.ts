import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  return NextResponse.json({ streak: profile?.streak ?? 0, longestStreak: profile?.longestStreak ?? 0 });
}
