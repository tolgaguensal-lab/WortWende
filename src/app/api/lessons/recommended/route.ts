import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const lessons = await prisma.lesson.findMany({
    where: { isLocked: false },
    include: { unit: { include: { course: true } } },
    orderBy: { order: "asc" },
    take: 5,
  });
  return NextResponse.json(lessons);
}
