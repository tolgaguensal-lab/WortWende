import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CEFRLevel } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  try {
    const userId = (session.user as any).id;
    const { score, level, answers } = await req.json();

    if (score === undefined || score === null || !level) {
      return NextResponse.json({ error: "Ergebnis und Niveau erforderlich" }, { status: 400 });
    }

    const validLevels = Object.values(CEFRLevel);
    if (!validLevels.includes(level as CEFRLevel)) {
      return NextResponse.json({ error: "Ungültiges Niveau" }, { status: 400 });
    }

    let placementTest = await prisma.placementTest.findFirst({
      where: { title: "Einstufungstest" },
    });
    if (!placementTest) {
      placementTest = await prisma.placementTest.create({
        data: {
          title: "Einstufungstest",
          description: "Automatischer Einstufungstest A1-B2",
          cefrLevel: "B2",
          questions: JSON.stringify([]),
        },
      });
    }

    const result = await prisma.placementTestResult.create({
      data: {
        userId,
        testId: placementTest.id,
        score,
        level: level as CEFRLevel,
      },
    });

    await prisma.userProfile.update({
      where: { userId },
      data: { placementLevel: level as CEFRLevel, currentLevel: level as CEFRLevel },
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Placement test result error:", error);
    return NextResponse.json({ error: "Ergebnis konnte nicht gespeichert werden" }, { status: 500 });
  }
}
