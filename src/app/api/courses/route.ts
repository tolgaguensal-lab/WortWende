import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      units: {
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  const result = courses.map((c) => ({
    id: c.id,
    level: c.level,
    name: c.name,
    description: c.description,
    order: c.order,
    totalLessons: c.units.reduce((sum, u) => sum + u._count.lessons, 0),
    totalUnits: c.units.length,
  }));

  return NextResponse.json(result);
}
