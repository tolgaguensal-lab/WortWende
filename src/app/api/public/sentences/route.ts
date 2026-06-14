import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");
    const search = searchParams.get("search") || "";
    const lang = searchParams.get("lang") || "en";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {
      isPublished: true,
      reviewedByAdmin: true,
    };

    if (level && ["A1", "A2", "B1", "B2", "C1"].includes(level)) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { translationEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.sentence.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { text: "asc" },
      }),
      prisma.sentence.count({ where }),
    ]);

    const mapped = items.map((s) => ({
      id: s.id,
      text: s.text,
      translation: s.translationEn,
      level: s.level,
      sourceName: s.sourceName,
    }));

    return NextResponse.json({ items: mapped, total, limit, offset });
  } catch (error) {
    console.error("Sentences API error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
