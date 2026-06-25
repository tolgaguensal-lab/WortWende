import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Sendet einen Password-Reset-Link per E-Mail (hier: gibt Token in Response zurück).
 * In Produktion: E-Mail-Versand via SMTP/Resend/SendGrid.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "E-Mail erforderlich" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Immer Erfolg melden, um User-Enumeration zu verhindern
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Token generieren (in Produktion: in DB speichern + Ablaufdatum)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 Stunde

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    // In Produktion: E-Mail senden
    // await sendEmail(email, "Passwort zurücksetzen", `Dein Link: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`);

    return NextResponse.json({
      success: true,
      // In Entwicklung: Token in Response zurückgeben
      ...(process.env.NODE_ENV === "development" && { token, resetUrl: `/reset-password?token=${token}` }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
