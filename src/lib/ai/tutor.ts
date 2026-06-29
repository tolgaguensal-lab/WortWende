/**
 * Wortwende AI Tutor — KI-Agent (v2)
 *
 * Was uns vom Markt abhebt:
 *  1. PROAKTIVER Agent – nicht nur Chatbot, sondern LEHRER der HANDELT
 *  2. TOOL-USE – Tutor kann Vokabeln speichern, Lektionen vorschlagen, Fehler tracken
 *  3. ERROR PATTERNS – Erkennt wiederholte Fehler und passt Unterricht an
 *  4. ROLLENSPIELE – Immersive Sprachpraxis (Arzt, Restaurant, Amt…)
 *  5. VOICE-FIRST ready – Optimiert für Sprach-Interaktion
 *  6. ADAPTIV – Lernpfad passt sich automatisch an Nutzer-Fortschritt an
 */

import { prisma } from "@/lib/db";
import type { CEFRLevel } from "@prisma/client";
import { TOOL_SYSTEM_PROMPT } from "@/lib/ai/tutor-tools";
import { buildErrorContext } from "@/lib/ai/error-patterns";
import { getHighestPurchasedLevel } from "@/lib/auth/entitlements";

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT — Der KI-Agent (Leo)
// ═══════════════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Du bist der Deutsch-Tutor von Wortwende – ein PROAKTIVER KI-LEHRER, kein passiver Chatbot.

## DEINE PERSÖNLICHKEIT
- Du heißt "Leo" und bist ein geduldiger, motivierender Deutsch-Lehrer.
- Du UNTERRICHTEST – du wartest nicht nur auf Fragen, sondern führst den Lernenden.
- Du erkennst Fehlermuster und sprichst sie direkt an: "Ich sehe, du hast Schwierigkeiten mit dem Dativ. Lass uns das gezielt üben."
- Du feierst Fortschritte enthusiastisch: "🌟🌟🌟 Perfekt! Drei Sätze hintereinander richtig!"
- Du schlägst VON SELBST Übungen vor, speicherst wichtige Wörter und empfiehlst die nächste Lektion.

## REGELN
1. SPRACHE: Immer Deutsch. Niveau strikt anpassen (A1 = einfache Sätze, C1 = komplex mit Nebensätzen).
2. KÜRZE: 2-5 Sätze pro Antwort. Grammatik-Erklärungen maximal 8 Sätze.
3. TON: Warm, ermutigend, GEDULDIG. Fehler als Lernchancen feiern. NIEMALS bloßstellen.
4. HTML: <strong>fett</strong> für Schlüsselwörter, <em>kursiv</em> für Beispiele. Emojis sparsam.
5. KEINE Meta-Kommentare ("Als KI kann ich…"). DU bist Leo, der Deutsch-Lehrer.

## UNTERRICHTS-METHODE
1. 📖 ERKLÄRUNG – 2-3 Sätze, einfach
2. 💡 BEISPIELE – 2 Alltagsbeispiele
3. 🎯 ÜBUNG – EINE Aufgabe, warte auf Antwort
4. ✅ FEEDBACK – Korrigieren, erklären WARUM
5. 🔄 NÄCHSTER SCHRITT – Vertiefung oder neues Thema

## ÜBUNGS-FORMATE
- [ÜBUNG:MC] Frage? | A) Opt1 | B) Opt2 | C) Opt3 | Lösung: X [/ÜBUNG]
- [ÜBUNG:LÜCKE] Satz mit ___ Lücke | Lösung: Wort [/ÜBUNG]
- [ÜBUNG:SATZ] Bilde Satz mit: W1, W2 | Bsp-Lösung [/ÜBUNG]

## ROLLENSPIELE (proaktiv anbieten!)
Biete Rollenspiele an, sobald Nutzer Grundlagen beherrscht:
"Lass uns eine echte Situation üben! Ich bin der Arzt, du der Patient…"
Szenarien: Arzt, Restaurant, Amt, Einkaufen, Vorstellung, Wohnung, Reise, Notfall.
Nach 2-3 Wechseln: konstruktives Feedback geben.

## FEHLER-ANALYSE
- Muster erkennen: "Das ist das 3. Mal mit dem Dativ – lass uns das gezielt üben."
- Nach 2 gleichen Fehlern: [TOOL:record_error_pattern] nutzen
- Neue Wörter: [TOOL:add_vocabulary_to_review] nutzen

## BAMF & ALLTAG
Du kennst: Einkaufen, Wohnung, Arbeit, Arzt, Behörden, DTZ-Prüfung, GER/CEFR.

## ABSCHLUSS
Session-Ende markieren: [SESSION_ENDE: +XP]
XP = 5 (kurz) bis 30 (lange, erfolgreiche Session).`;

// ═══════════════════════════════════════════════════════════════════════════
// RAG: Context Retrieval
// ═══════════════════════════════════════════════════════════════════════════

export interface TutorContext {
  userLevel: CEFRLevel;
  userName?: string;
  nativeLanguage?: string;
  recentVocabulary?: { word: string; article?: string; translation: string; example?: string }[];
  relevantGrammar?: { name: string; explanation: string; examples: string }[];
  relevantSentences?: { text: string; translation: string }[];
  errorContext?: string;
  userProgress?: { totalXp: number; streak: number; lessonsCompleted: number; currentGoal?: string };
}

export async function buildTutorContext(
  userId: string,
  query: string
): Promise<TutorContext> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { totalXp: true, nativeLanguage: true, targetGoal: true },
  });
  const userLevel = await getHighestPurchasedLevel(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

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

  const sentences = await prisma.sentence.findMany({
    where: { level: userLevel },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { text: true, translationEn: true },
  });

  const progress = await prisma.userProgress.count({ where: { userId } });
  const streakCount = await prisma.streak.count({ where: { userId } });
  const errorContext = await buildErrorContext(userId);

  return {
    userLevel,
    userName: user?.name ?? undefined,
    nativeLanguage: profile?.nativeLanguage ?? undefined,
    recentVocabulary: vocabulary.map(v => ({
      word: v.word, article: v.article ?? undefined,
      translation: v.translationEn, example: v.exampleSentence ?? undefined,
    })),
    relevantGrammar: grammar.map(g => ({
      name: g.name, explanation: g.explanation, examples: g.examples,
    })),
    relevantSentences: sentences.map(s => ({
      text: s.text, translation: s.translationEn,
    })),
    errorContext,
    userProgress: {
      totalXp: profile?.totalXp ?? 0,
      streak: streakCount,
      lessonsCompleted: progress,
      currentGoal: profile?.targetGoal ?? undefined,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Tool Call Parser
// ═══════════════════════════════════════════════════════════════════════════

export interface ParsedToolCall {
  toolName: string;
  params: Record<string, string>;
  rawMatch: string;
}

export function parseToolCalls(content: string): ParsedToolCall[] {
  const toolRegex = /\[TOOL:(\w+)\]\s*(\{[^}]+\})/g;
  const calls: ParsedToolCall[] = [];
  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    try {
      calls.push({ toolName: match[1], params: JSON.parse(match[2]), rawMatch: match[0] });
    } catch { /* skip invalid */ }
  }
  return calls;
}

// ═══════════════════════════════════════════════════════════════════════════
// Streaming Chat
// ═══════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const MAX_HISTORY = 15;

export async function* streamTutorChat(
  messages: ChatMessage[],
  context: TutorContext,
  apiKey: string
): AsyncGenerator<string> {
  const parts: string[] = [];
  parts.push(`[Schüler: ${context.userName || "Lernender"} | Niveau: ${context.userLevel}${context.nativeLanguage ? ` | Muttersprache: ${context.nativeLanguage}` : ""}]`);
  if (context.errorContext) parts.push(context.errorContext);
  if (context.relevantGrammar?.length) parts.push(`[Grammatik: ${context.relevantGrammar.map(g => g.name).join(", ")}]`);
  if (context.recentVocabulary?.length) parts.push(`[Vokabeln: ${context.recentVocabulary.map(v => `${v.article ? v.article + " " : ""}${v.word}`).join(", ")}]`);
  if (context.userProgress) parts.push(`[Fortschritt: ${context.userProgress.totalXp} XP | Streak: ${context.userProgress.streak} | ${context.userProgress.lessonsCompleted} Lektionen${context.userProgress.currentGoal ? ` | Ziel: ${context.userProgress.currentGoal}` : ""}]`);

  const contextBlock = parts.join(" ");
  const systemMessage: ChatMessage = { role: "system", content: SYSTEM_PROMPT + "\n" + TOOL_SYSTEM_PROMPT + "\n" + contextBlock };
  const trimmedMessages = messages.slice(-MAX_HISTORY);
  const allMessages = [systemMessage, ...trimmedMessages];

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "DeepSeek-Cache": "enabled" },
    body: JSON.stringify({ model: "deepseek-v4-flash", messages: allMessages, stream: true, max_tokens: 512, temperature: 0.7 }),
  });

  if (!response.ok) { const err = await response.text(); throw new Error(`DeepSeek API error ${response.status}: ${err}`); }
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
      try { const parsed = JSON.parse(data); const content = parsed.choices?.[0]?.delta?.content; if (content) yield content; } catch { /* skip */ }
    }
  }
}
