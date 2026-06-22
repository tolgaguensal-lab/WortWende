/**
 * POST /api/tutor/chat — Streaming AI Tutor Chat (Kosten-optimiert)
 *
 * Expects: { messages: [{ role, content }] }
 * Returns: text/event-stream (SSE)
 *
 * Auth required via NextAuth session cookie.
 * Rate-limited per user based on subscription tier.
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { buildTutorContext, streamTutorChat } from "@/lib/ai/tutor";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Rate Limiting (pro User, pro Tag) ──────────────────────────────────────

const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  plus: 50,
  premium: Infinity,
};

async function getUserTier(userId: string): Promise<"free" | "plus" | "premium"> {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { planId: true, status: true },
    });
    if (sub && sub.status === "active") {
      if (sub.planId.includes("premium")) return "premium";
      if (sub.planId.includes("plus")) return "plus";
    }
    return "free";
  } catch {
    return "free";
  }
}

async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const tier = await getUserTier(userId);
  const limit = DAILY_LIMITS[tier] ?? DAILY_LIMITS.free;
  if (limit === Infinity) return { allowed: true, remaining: Infinity };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.tutorRequestLog.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return { allowed: count < limit, remaining: Math.max(0, limit - count - 1) };
}

async function logRequest(userId: string): Promise<void> {
  try {
    await prisma.tutorRequestLog.create({ data: { userId } });
  } catch { /* non-blocking */ }
}

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Nicht authentifiziert" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse request
  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiges JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array erforderlich" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Rate Limit Check ──────────────────────────────────────────────────
  const { allowed, remaining } = await checkRateLimit(session.user.id);
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "Tageslimit erreicht. Upgrade für unbegrenzten KI-Tutor.",
        code: "RATE_LIMITED",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY nicht konfiguriert" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Build RAG context from user's last message
  const messages = body.messages;
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
  const query = lastUserMessage?.content ?? "";
  const context = await buildTutorContext(session.user.id, query);

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chatMessages = messages.map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        for await (const chunk of streamTutorChat(chatMessages, context, apiKey)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
      } finally {
        // Log request for rate limiting (non-blocking)
        logRequest(session.user.id);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
