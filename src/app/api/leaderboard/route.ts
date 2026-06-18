import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const profiles = await prisma.userProfile.findMany({
    orderBy: { totalXp: "desc" },
    take: 50,
    include: { user: { select: { name: true, image: true } } },
  });
  return NextResponse.json({
    rankings: profiles.map((p, i) => ({
      rank: i + 1,
      name: p.user.name ?? "Anonym",
      xp: p.totalXp,
      level: p.level,
      avatar: p.user.image,
    })),
  });
}
