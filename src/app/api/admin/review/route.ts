import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Kein Admin" }, { status: 403 });

  const items = await prisma.reviewQueue.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Kein Admin" }, { status: 403 });

  const { itemId, action } = await req.json();
  if (!itemId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const item = await prisma.reviewQueue.findUnique({ where: { id: itemId } });
  if (!item) return NextResponse.json({ error: "Eintrag nicht gefunden" }, { status: 404 });

  const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

  await prisma.reviewQueue.update({
    where: { id: itemId },
       data: { status: newStatus, reviewerId: session.user.id, reviewedAt: new Date() },
  });

  // Auto-publish approved content
  if (action === "approve") {
    if (item.contentType === "vocabulary") {
      await prisma.vocabulary.updateMany({
        where: { id: item.contentId },
        data: { reviewedByAdmin: true, isPublished: true },
      });
    } else if (item.contentType === "grammar") {
      await prisma.grammarTopic.updateMany({
        where: { id: item.contentId },
        data: { reviewedByAdmin: true, isPublished: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}
