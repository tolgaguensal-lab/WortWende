import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") as "A1" | "A2" | "B1" | "B2" | "C1" | null;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const skip = (page - 1) * limit;

  try {
    const where: any = { isPublished: true };
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { word: { contains: search, mode: "insensitive" } },
        { translationEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [vocabulary, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { word: "asc" },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    return NextResponse.json({
      vocabulary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + vocabulary.length < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Laden der Vokabeln", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
