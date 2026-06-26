import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/error-log
 * Empfängt Client-Side Errors für Monitoring.
 * In Produktion: an Logging-Service (Sentry, Logtail, etc.) weiterleiten.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log to console (in production: send to external logging service)
    console.error(
      `[CLIENT-ERROR] ${body.type || "error"} | ${body.url || "?"} | ${body.message?.substring(0, 200)}`
    );

    // Optional: An externen Service senden
    // if (process.env.SENTRY_DSN) { ... }

    return NextResponse.json({ received: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
