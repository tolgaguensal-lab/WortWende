/**
 * Content Enricher — Fills vocabulary & sentences via DeepSeek V4 API
 *
 * Usage:
 *   npx tsx scripts/enrich-content.ts --level A1 --theme "Essen & Trinken" --count 50
 *   npx tsx scripts/enrich-content.ts --level all --count 100
 *
 * Requires: DEEPSEEK_API_KEY in .env
 */

import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";

// ── Types ───────────────────────────────────────────────────────────────────

interface VocabEntry {
  word: string;
  article?: string;
  pos: string;
  translationEn: string;
  translationTr: string;
  translationAr: string;
  translationRu: string;
  translationPl: string;
  translationRo: string;
  translationUk: string;
  translationSq: string;
  translationKu: string;
  translationIt: string;
  exampleSentence: string;
  exampleTranslation: string;
}

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

const THEMES: Record<CEFRLevel, string[]> = {
  A1: [
    "Essen & Trinken", "Familie & Menschen", "Körper & Gesundheit", "Begrüßung & Höflichkeit",
    "Zahlen & Zeit", "Farben & Formen", "Wohnen & Möbel", "Kleidung", "Wetter & Jahreszeiten",
    "Einkaufen & Preise", "Hobbys & Freizeit", "Arbeit & Berufe (einfach)",
  ],
  A2: [
    "Reisen & Transport", "Bank & Geld", "Post & Pakete", "Medien & Kommunikation",
    "Behörden & Formulare", "Wohnungssuche", "Schule & Ausbildung", "Feste & Traditionen",
    "Umwelt & Natur", "Technik & Handy", "Gefühle & Eigenschaften",
  ],
  B1: [
    "Arbeit & Bewerbung", "Gesundheit & Arztbesuche", "Politik & Gesellschaft",
    "Kultur & Medien", "Bildung & Weiterbildung", "Mobilität & Verkehr",
    "Nachhaltigkeit", "Freundschaft & Beziehungen", "Wohnen & Nachbarschaft",
  ],
  B2: [
    "Beruf & Karriere", "Wirtschaft & Finanzen", "Wissenschaft & Technik",
    "Kunst & Literatur", "Geschichte & Politik", "Recht & Gesetze",
    "Psychologie & Soziales", "Digitalisierung", "Globalisierung", "Migration & Integration",
  ],
  C1: [
    "Philosophie & Ethik", "Fachsprache Wirtschaft", "Fachsprache Medizin",
    "Fachsprache Jura", "Fachsprache Technik", "Literatur & Textanalyse",
    "Gesellschaftskritik", "Abstrakte Konzepte", "Idiome & Redewendungen",
    "Nuancen & Stilistik", "Diskurs & Argumentation",
  ],
};

// ── DeepSeek API ────────────────────────────────────────────────────────────

async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing in environment");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a German language expert. You only output valid JSON. No explanations, no markdown." },
        { role: "user", content: prompt },
      ],
      max_tokens: 8192,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

// ── Generation ──────────────────────────────────────────────────────────────

function buildPrompt(level: CEFRLevel, theme: string, count: number): string {
  return `Generate ${count} German vocabulary entries for CEFR level ${level}, theme "${theme}".

Each entry must follow this exact TypeScript interface:
{
  word: string;           // German word (Nomen mit Artikel, z.B. "der Tisch")
  article?: string;       // "der", "die", "das" - only for nouns
  pos: string;            // "noun", "verb", "adjective", "adverb", "preposition", "conjunction", "phrase", "interjection"
  translationEn: string;  // English translation
  translationTr: string;  // Turkish
  translationAr: string;  // Arabic
  translationRu: string;  // Russian
  translationPl: string;  // Polish
  translationRo: string;  // Romanian
  translationUk: string;  // Ukrainian
  translationSq: string;  // Albanian
  translationKu: string;  // Kurdish
  translationIt: string;  // Italian
  exampleSentence: string;      // Simple German sentence using the word
  exampleTranslation: string;   // English translation of the example
}

Requirements:
- Words MUST be appropriate for level ${level} (A1=beginner, C1=advanced)
- For nouns, ALWAYS include the article in the word field like "der Tisch" or "die Lampe"
- Example sentences should be simple and practical
- ALL translations must be accurate
- Output a JSON object: { "vocabulary": [...] }

Return ONLY valid JSON. No markdown, no explanation.`;
}

async function generateBatch(level: CEFRLevel, theme: string, count: number): Promise<VocabEntry[]> {
  console.log(`  Generating ${count} ${level} words for "${theme}"...`);
  const prompt = buildPrompt(level, theme, count);
  
  let retries = 3;
  while (retries > 0) {
    try {
      const response = await callDeepSeek(prompt);
      // Clean markdown if any
      const clean = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const data = JSON.parse(clean);
      if (!data.vocabulary || !Array.isArray(data.vocabulary)) {
        throw new Error("No vocabulary array in response");
      }
      console.log(`  ✓ Got ${data.vocabulary.length} entries`);
      return data.vocabulary;
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      console.log(`  ⚠ Retry ${3 - retries}/3...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return [];
}

// ── File I/O ────────────────────────────────────────────────────────────────

function formatEntry(e: VocabEntry): string {
  const article = e.article ? `"${e.article}"` : "undefined";
  return `  { word: "${e.word}", article: ${article}, pos: "${e.pos}", translationEn: "${e.translationEn}", translationTr: "${e.translationTr}", translationAr: "${e.translationAr}", translationRu: "${e.translationRu}", translationPl: "${e.translationPl}", translationRo: "${e.translationRo}", translationUk: "${e.translationUk}", translationSq: "${e.translationSq}", translationKu: "${e.translationKu}", translationIt: "${e.translationIt}", exampleSentence: "${e.exampleSentence}", exampleTranslation: "${e.exampleTranslation}" }`;
}

function getFilePath(level: CEFRLevel): string {
  return path.join(process.cwd(), "prisma", "seed-data", `vocabulary-${level.toLowerCase()}.ts`);
}

function countExisting(filePath: string): number {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(/\{ word:/g);
  return matches ? matches.length : 0;
}

async function appendToFile(level: CEFRLevel, entries: VocabEntry[]): Promise<void> {
  const filePath = getFilePath(level);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(filePath)) {
    // Create new file
    const capitalized = level.charAt(0) + level.slice(1).toLowerCase();
    const header = `export const vocabulary${level} = [\n`;
    const body = entries.map(formatEntry).join(",\n");
    const footer = `\n];\n`;
    fs.writeFileSync(filePath, header + body + footer, "utf8");
    console.log(`  📄 Created ${filePath} with ${entries.length} entries`);
  } else {
    // Append to existing file - insert before closing ];
    let content = fs.readFileSync(filePath, "utf8");
    const closingIndex = content.lastIndexOf("];");
    if (closingIndex === -1) {
      console.error(`  ⚠ Could not find closing ]; in ${filePath}`);
      return;
    }
    const newEntries = entries.map(formatEntry).join(",\n");
    content = content.slice(0, closingIndex) + ",\n" + newEntries + "\n];\n";
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  📄 Appended ${entries.length} entries to ${filePath}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const program = new Command();
  program
    .option("-l, --level <level>", "CEFR level (A1-C1 or 'all')", "A1")
    .option("-t, --theme <theme>", "Theme", "")
    .option("-c, --count <count>", "Words per batch", "50")
    .option("--target <target>", "Target total per level", "500")
    .parse(process.argv);

  const opts = program.opts();
  const count = parseInt(opts.count);
  const target = parseInt(opts.target);
  const levels = opts.level === "all" ? LEVELS : [opts.level.toUpperCase() as CEFRLevel];

  console.log(`🚀 Wortwende Content Enricher`);
  console.log(`   Target: ${target} words/level, ${count} per batch\n`);

  for (const level of levels) {
    const filePath = getFilePath(level);
    const existing = countExisting(filePath);
    const needed = Math.max(0, target - existing);

    console.log(`\n📚 Level ${level}: ${existing} existing → need ${needed} more`);

    if (needed === 0) {
      console.log(`  ✅ Already at target!`);
      continue;
    }

    const themes = THEMES[level];
    const wordsPerTheme = Math.ceil(needed / themes.length);
    let totalGenerated = 0;

    for (const theme of themes) {
      if (totalGenerated >= needed) break;
      const batchCount = Math.min(count, Math.ceil(wordsPerTheme), needed - totalGenerated);
      if (batchCount <= 0) continue;

      try {
        const entries = await generateBatch(level, theme, batchCount);
        if (entries.length > 0) {
          await appendToFile(level, entries);
          totalGenerated += entries.length;
        }
      } catch (e) {
        console.error(`  ❌ Failed for "${theme}": ${e instanceof Error ? e.message : e}`);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    }

    const final = countExisting(filePath);
    console.log(`  🎯 Level ${level}: ${existing} → ${final} (target: ${target})`);
  }

  console.log("\n✅ Content enrichment complete!");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
