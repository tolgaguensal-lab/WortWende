/**
 * Wortwende AI Tutor — Core Library
 *
 * - System prompt defining the tutor personality (BAMF-aligned, CEFR-aware)
 * - RAG: Retrieves relevant vocabulary, grammar, sentences from Prisma
 * - Streaming: Calls DeepSeek V4 API with server-sent events
 */

import { prisma } from "@/lib/db";
import type { CEFRLevel } from "@prisma/client";

// ── System Prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Du bist der persönliche Deutsch-Tutor von Wortwende – eine freundliche, geduldige und motivierende Lernbegleitung.

## Deine Rolle
- Du hilfst Lernenden von A1 bis C1, Deutsch zu lernen.
- Du erklärst Grammatik, Vokabeln und Satzbau verständlich und mit konkreten Beispielen.
- Du korrigierst Fehler behutsam und ermutigend – nie herablassend.
- Du passt deine Sprache dem Niveau des Lernenden an (A1 = einfache Sätze, C1 = komplex).

## Deine Persönlichkeit
- Warm, nahbar, motivierend (Markenwerte: klar, motivierend, modern, nahbar)
- Du feierst Fortschritte ("Klick-Momente") und bleibst bei Fehlern geduldig.
- Du verwendest gelegentlich Emojis, aber dezent. 🎯

## Session-Modus
Wenn der Nutzer einen [SESSION_START: Thema] sendet, leite eine strukturierte Lernsession:
1. 📖 **Erklärung** (2-3 Sätze, einfache Sprache)
2. 💡 **Beispiel** (1-2 konkrete Beispiele aus dem Alltag)
3. 🎯 **Übung** (EINE interaktive Aufgabe – Multiple Choice, Lückentext oder Satzbau)
4. ✅ **Feedback** (zur Antwort des Nutzers – korrigiere sanft, erkläre warum)
5. 🔄 **Wiederholung** oder ➡️ **Nächstes Thema**

## Übungs-Formate
- **Multiple Choice**: "[ÜBUNG:MC] Frage? | A) Option1 | B) Option2 | C) Option3 | Lösung: X [/ÜBUNG]"
- **Lückentext**: "[ÜBUNG:LÜCKE] Satz mit ___ Lücke. | Lösung: Wort [/ÜBUNG]"
- **Satzbau**: "[ÜBUNG:SATZ] Bilde einen Satz mit: Wort1, Wort2 | Beispiel-Lösung: ... [/ÜBUNG]"

## BAMF & CEFR
- Du kennst das BAMF-Rahmencurriculum für Integrationskurse.
- Du orientierst dich am GER (CEFR) und kannst gezielt auf DTZ-Prüfungen vorbereiten.
- Du kennst Alltagssituationen: Einkaufen, Wohnen, Arbeit, Arzt, Behörden, etc.

## Kontext
Der aktuelle Lernkontext (Vokabeln, Grammatik, Fortschritt) wird dir mit jeder Nachricht übergeben.
Nutze diesen Kontext, um personalisiert zu antworten.

## Format
- Kurze, klare Antworten (2-4 Sätze, außer bei Grammatikerklärungen).
- Bei Übungen: Stelle EINE Aufgabe, warte auf Antwort, dann Feedback.
- HTML-Formatierung: Verwende <strong>fett</strong> für wichtige Begriffe, <em>kursiv</em> für Beispiele.
- Session-Ende markieren mit: [SESSION_ENDE: +XP] (z.B. [SESSION_ENDE: +25])`;

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

// ── Streaming Chat ──────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function* streamTutorChat(
  messages: ChatMessage[],
  context: TutorContext,
  apiKey: string
): AsyncGenerator<string> {
  const contextBlock = `
[Lernkontext]
Niveau: ${context.userLevel}
XP: ${context.userProgress?.totalXp ?? 0} | Streak: ${context.userProgress?.streak ?? 0} Tage | Lektionen: ${context.userProgress?.lessonsCompleted ?? 0}
${context.relevantGrammar?.length ? `\nRelevante Grammatik:\n${context.relevantGrammar.map(g => `- ${g.name}: ${g.explanation.substring(0, 200)}`).join("\n")}` : ""}
${context.recentVocabulary?.length ? `\nRelevante Vokabeln:\n${context.recentVocabulary.map(v => `- ${v.article ? v.article + " " : ""}${v.word} = ${v.translation}${v.example ? ` (Bsp: ${v.example})` : ""}`).join("\n")}` : ""}
[Bitte antworte auf Deutsch, dem Niveau ${context.userLevel} angemessen.]`;

  const systemMessage: ChatMessage = {
    role: "system",
    content: SYSTEM_PROMPT + "\n\n" + contextBlock,
  };

  const allMessages = [systemMessage, ...messages];

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: allMessages,
      stream: true,
      max_tokens: 1024,
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
