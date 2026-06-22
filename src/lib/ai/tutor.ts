/**
 * WortHeld AI Tutor — Core Library
 *
 * - System prompt defining the tutor personality (BAMF-aligned, CEFR-aware)
 * - RAG: Retrieves relevant vocabulary, grammar, sentences from Prisma
 * - Streaming: Calls DeepSeek V4 Flash API with prompt caching + SSE
 *
 * Kosten-Optimierungen:
 *  - Prompt Caching (DeepSeek): System-Prompt nur beim ersten Mal berechnet
 *  - History Trimming: max. 15 Nachrichten im Kontext
 *  - Reduzierte max_tokens (512 statt 1024)
 *  - Schlanker RAG-Context-Block
 */

import { prisma } from "@/lib/db";
import type { CEFRLevel } from "@prisma/client";

// ── System Prompt (optimiert: ~500 Tokens, -37% vs. Original) ──────────────

const SYSTEM_PROMPT = `Du bist der Deutsch-Tutor von WortHeld – klar, motivierend, geduldig.

## REGELN
1. SPRACHE: Immer Deutsch. Niveau an den Lernenden anpassen (A1 = einfache Sätze, C1 = komplex).
2. KÜRZE: 2-4 Sätze pro Antwort. Nur Grammatik-Erklärungen dürfen länger sein.
3. TON: Warm, ermutigend. Fehler nie bloßstellen. Fortschritte feiern. 🎯
4. KEINE Eigenwerbung. Keine Meta-Kommentare ("als KI kann ich...").
5. HTML: <strong>fett</strong> für Schlüsselwörter, <em>kursiv</em> für Beispiele.

## SESSION-MODUS
Wenn [SESSION_START: Thema] kommt:
1. 📖 ERKLÄRUNG (2-3 Sätze, einfache Sprache)
2. 💡 BEISPIEL (1-2 Alltagsbeispiele)
3. 🎯 ÜBUNG – EINE Aufgabe, dann auf Antwort warten
4. ✅ FEEDBACK – sanft korrigieren, erklären warum
5. 🔄 Wiederholung oder ➡️ Nächstes Thema

## ÜBUNGS-FORMATE
- [ÜBUNG:MC] Frage? | A) Opt1 | B) Opt2 | C) Opt3 | Lösung: X [/ÜBUNG]
- [ÜBUNG:LÜCKE] Satz mit ___ Lücke | Lösung: Wort [/ÜBUNG]
- [ÜBUNG:SATZ] Bilde Satz mit: W1, W2 | Bsp-Lösung [/ÜBUNG]

## BAMF & ALLTAG
Du kennst: Einkaufen, Wohnung, Arbeit, Arzt, Behörden, DTZ-Prüfung, GER/CEFR.
Kontext (Niveau, Vokabeln, Grammatik) kommt mit jeder Nachricht.

## ABSCHLUSS
Session-Ende markieren mit: [SESSION_ENDE: +XP]
XP = 5 (kurz) bis 25 (lange Session).`;

// ── RAG: Context Retrieval ─────────────────────────────────────────────────

interface TutorContext {
  userLevel: CEFRLevel;
  recentVocabulary?: { word: string; article?: string; translation: string; example?: string }[];
  relevantGrammar?: { name: string; explanation: string; examples: string }[];
  relevantSentences?: { text: string; translation: string }[];
  userProgress?: { totalXp: number; streak: number; lessonsCompleted: number };
}

export async function buildTutorContext(
  userId: string,
  query: string
): Promise<TutorContext> {
  // Get user profile for level
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const userLevel = (profile?.currentLevel ?? "A1") as CEFRLevel;

  // Search vocabulary matching query words
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const vocabulary = queryWords.length > 0
    ? await prisma.vocabulary.findMany({
        where: {
          level: userLevel,
          OR: queryWords.flatMap(w => [
            { word: { contains: w, mode: "insensitive" as const } },
            { translationEn: { contains: w, mode: "insensitive" as const } },
          ]),
        },
        take: 5,
        select: { word: true, article: true, translationEn: true, exampleSentence: true },
      })
    : [];

  // Search grammar topics
  const grammar = await prisma.grammarTopic.findMany({
    where: {
      level: userLevel,
      OR: queryWords.flatMap(w => [
        { name: { contains: w, mode: "insensitive" as const } },
        { explanation: { contains: w, mode: "insensitive" as const } },
      ]),
    },
    take: 3,
    select: { name: true, explanation: true, examples: true },
  });

  // Get recent sentences at user level
  const sentences = await prisma.sentence.findMany({
    where: { level: userLevel },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { text: true, translationEn: true },
  });

  // Get progress summary
  const progress = await prisma.userProgress.count({ where: { userId } });
  const streakCount = await prisma.streak.count({ where: { userId } });

  return {
    userLevel,
    recentVocabulary: vocabulary.map(v => ({
      word: v.word,
      article: v.article ?? undefined,
      translation: v.translationEn,
      example: v.exampleSentence ?? undefined,
    })),
    relevantGrammar: grammar.map(g => ({
      name: g.name,
      explanation: g.explanation,
      examples: g.examples,
    })),
    relevantSentences: sentences.map(s => ({
      text: s.text,
      translation: s.translationEn,
    })),
    userProgress: {
      totalXp: profile?.totalXp ?? 0,
      streak: streakCount,
      lessonsCompleted: progress,
    },
  };
}

// ── Streaming Chat (Kosten-optimiert) ──────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** Maximum conversation history to keep (limits input tokens) */
const MAX_HISTORY = 15;

export async function* streamTutorChat(
  messages: ChatMessage[],
  context: TutorContext,
  apiKey: string
): AsyncGenerator<string> {
  // Optimierter RAG-Context-Block (schlanker, weniger Tokens)
  const parts: string[] = [];
  parts.push(`[Niveau: ${context.userLevel}]`);

  if (context.relevantGrammar?.length) {
    parts.push(`[Grammatik: ${context.relevantGrammar.map(g => g.name).join(", ")}]`);
  }

  if (context.recentVocabulary?.length) {
    parts.push(`[Vokabeln: ${context.recentVocabulary.map(v =>
      `${v.article ? v.article + " " : ""}${v.word}`
    ).join(", ")}]`);
  }

  const contextBlock = parts.join(" ");

  const systemMessage: ChatMessage = {
    role: "system",
    content: SYSTEM_PROMPT + "\n" + contextBlock,
  };

  // History trimming: nur die letzten N Nachrichten
  const trimmedMessages = messages.slice(-MAX_HISTORY);
  const allMessages = [systemMessage, ...trimmedMessages];

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Prompt Caching: System-Prompt wird gecached → 50x billigerer Input
      "DeepSeek-Cache": "enabled",
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",   // deepseek-chat deprecated 2026-07-24
      messages: allMessages,
      stream: true,
      max_tokens: 512,               // Tutor-Antworten selten >300 Tokens
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip unparseable chunks
      }
    }
  }
}
