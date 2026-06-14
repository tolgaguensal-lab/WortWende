import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");
    const lang = searchParams.get("lang") || "en";
    const search = searchParams.get("search") || "";
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
        { word: { contains: search, mode: "insensitive" } },
        { translationEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { word: "asc" },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    const mapped = items.map((v) => ({
      id: v.id,
      word: v.word,
      article: v.article,
      pos: v.pos,
      level: v.level,
      translation: (v as Record<string, unknown>)[`translation${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || v.translationEn,
      exampleSentence: v.exampleSentence,
      exampleTranslation: v.exampleTranslation,
    }));

    return NextResponse.json({ items: mapped, total, limit, offset });
  } catch (error) {
    console.error("Vocabulary API error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
