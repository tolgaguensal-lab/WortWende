import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "Profil nicht gefunden" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  const userId = session.user.id;
  const body = await req.json();
  const profile = await prisma.userProfile.update({ where: { userId }, data: body });
  return NextResponse.json(profile);
}
