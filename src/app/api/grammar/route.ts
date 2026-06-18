import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") as "A1" | "A2" | "B1" | "B2" | "C1" | null;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const skip = (page - 1) * limit;

  try {
    const where: any = { isPublished: true };
    if (level) where.level = level;

    const [grammarTopics, total] = await Promise.all([
      prisma.grammarTopic.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ level: "asc" }, { order: "asc" }],
      }),
      prisma.grammarTopic.count({ where }),
    ]);

    return NextResponse.json({
      grammarTopics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + grammarTopics.length < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Laden der Grammatik", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
