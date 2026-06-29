/**
 * POST /api/tutor/chat — Streaming AI Tutor Chat mit Tool-Execution (v2)
 *
 * Der Tutor ist jetzt ein PROAKTIVER AGENT:
 * - Analysiert Fehlermuster aus UserErrorProfile
 * - Führt Tools aus (Vokabeln speichern, Lektionen vorschlagen…)
 * - Streamt die Antwort, extrahiert und executed Tool-Calls danach
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { buildTutorContext, streamTutorChat, parseToolCalls, ChatMessage } from "@/lib/ai/tutor";
import { executeTool } from "@/lib/ai/tutor-tools";
import { prisma } from "@/lib/db";
import { getHighestPurchasedLevel, LEVEL_TIERS } from "@/lib/auth/entitlements";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Rate Limiting (pro User, pro Tag, Level-basiert) ────────────────────

async function getUserRateInfo(userId: string): Promise<{ maxSessions: number; isAdmin: boolean }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role === UserRole.ADMIN) {
      return { maxSessions: Infinity, isAdmin: true };
    }

    const level = await getHighestPurchasedLevel(userId);
    const config = LEVEL_TIERS[level] ?? LEVEL_TIERS.A1;
    return { maxSessions: config.sessionsPerDay, isAdmin: false };
  } catch {
    return { maxSessions: LEVEL_TIERS.A1.sessionsPerDay, isAdmin: false };
  }
}

async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const { maxSessions, isAdmin } = await getUserRateInfo(userId);

  if (isAdmin) {
    return { allowed: true, remaining: 9999 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.tutorRequestLog.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return { allowed: count < maxSessions, remaining: Math.max(0, maxSessions - count - 1) };
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
  let body: { messages?: { role: string; content: string }[]; personality?: string; mode?: string };
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
        error: "Tageslimit erreicht. Upgrade für mehr KI-Sessions mit Leo.",
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

  // Stream response with tool execution
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      try {
        const chatMessages: ChatMessage[] = messages.map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        // Inject personality as system instruction
        const personality = body.personality || "locker";
        const personalityInstructions: Record<string, string> = {
          streng: "[SYSTEM] Du bist STRENG. Korrigiere JEDEN Fehler direkt. Zeige: [KORREKTUR:falscher Text|korrigierter Text|kurze Erklärung]. Sei präzise und direkt. Kein Smalltalk.",
          locker: "[SYSTEM] Du bist LOCKER. Ermutige den Lernenden. Korrigiere Fehler sanft mit [KORREKTUR:...|...|...]. Fehler sind okay – lobe zuerst, dann korrigiere.",
          lustig: "[SYSTEM] Du bist LUSTIG. Verwende Emojis und Humor. Korrigiere Fehler mit [KORREKTUR:...|...|...] aber mach einen Witz dabei. Halte die Stimmung leicht.",
        };
        chatMessages.unshift({
          role: "system",
          content: personalityInstructions[personality] || personalityInstructions.locker,
        });

        for await (const chunk of streamTutorChat(chatMessages, context, apiKey)) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }

        // Parse and execute tool calls from the full response
        const toolCalls = parseToolCalls(fullResponse);
        if (toolCalls.length > 0) {
          for (const call of toolCalls) {
            try {
              const result = await executeTool(call.toolName, call.params, session.user.id);
              if (result.success && result.message) {
                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({ toolResult: { tool: call.toolName, message: result.message, data: result.data } })}\n\n`
                ));
              }
            } catch (toolError) {
              console.error(`Tool execution error (${call.toolName}):`, toolError);
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
      } finally {
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
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
