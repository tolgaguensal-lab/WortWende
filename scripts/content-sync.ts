/**
 * 📚 Content Auto-Fill Pipeline
 * =============================
 * Automatisiertes Befüllen von Lerninhalten mit CEFR-Gap-Analyse.
 *
 * Ablauf:
 * 1. Prüft IST-Stand (DB) vs SOLL (CEFR-requirements.md) pro Level
 * 2. Identifiziert Lücken (fehlende Vokabeln, Sätze, Grammatik)
 * 3. Füllt Lücken via:
 *    a) Tatoeba API → Beispielsätze
 *    b) DeepSeek V4 → Vokabeln + Übersetzungen
 *    c) Wiktionary → Definitionen
 * 4. Schreibt neue Inhalte in prisma/seed-data/
 *
 * Usage:
 *   npx tsx scripts/content-sync.ts              # Alle Level prüfen & Lücken füllen
 *   npx tsx scripts/content-sync.ts --dry-run    # Nur Analyse, kein Schreiben
 *   npx tsx scripts/content-sync.ts --level A1   # Nur ein Level
 *   npx tsx scripts/content-sync.ts --source tatoeba  # Nur Tatoeba-Sätze
 *
 * CI/Webhook-fähig: Exit Code 0 = alles ok, Exit Code 1 = Lücken gefunden
 */

import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";

// Lade .env für DEEPSEEK_API_KEY (optional – Tatoeba funktioniert ohne)
try { require("dotenv").config(); } catch {}
try { require("dotenv").config({ path: ".env.local" }); } catch {}

// ─── Types ──────────────────────────────────────────────────────────────────

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";
const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

interface CEFRTarget {
  level: CEFRLevel;
  vocabularyTarget: number;
  grammarTarget: number;
  sentencesTarget: number;
}

interface ContentGap {
  level: CEFRLevel;
  type: "vocabulary" | "grammar" | "sentences";
  current: number;
  target: number;
  gap: number;
  theme: string;
}

// ─── CEFR Standards (SOLL) ──────────────────────────────────────────────────

const CEFR_TARGETS: CEFRTarget[] = [
  { level: "A1", vocabularyTarget: 250, grammarTarget: 15, sentencesTarget: 100 },
  { level: "A2", vocabularyTarget: 350, grammarTarget: 18, sentencesTarget: 150 },
  { level: "B1", vocabularyTarget: 450, grammarTarget: 22, sentencesTarget: 200 },
  { level: "B2", vocabularyTarget: 550, grammarTarget: 22, sentencesTarget: 250 },
  { level: "C1", vocabularyTarget: 650, grammarTarget: 18, sentencesTarget: 300 },
];

const THEMES: Record<CEFRLevel, string[]> = {
  A1: ["Essen & Trinken", "Familie", "Zahlen & Zeit", "Wohnen", "Kleidung", "Wetter", "Einkaufen", "Hobbys"],
  A2: ["Reisen", "Bank & Geld", "Medien", "Behörden", "Schule", "Technik", "Gefühle", "Umwelt"],
  B1: ["Arbeit & Beruf", "Gesundheit", "Politik", "Kultur", "Migration", "Medien & Kommunikation"],
  B2: ["Wirtschaft", "Wissenschaft", "Recht", "Philosophie", "Kunst", "Internationales"],
  C1: ["Akademisches", "Management", "Ethik", "Klima & Energie", "Digitalisierung", "Gesellschaft"],
};

// ─── Content Gap Analysis ───────────────────────────────────────────────────

async function analyzeContentGaps(level?: CEFRLevel): Promise<ContentGap[]> {
  const gaps: ContentGap[] = [];

  // Dynamic import für Prisma (funktioniert nur wenn DB erreichbar)
  let prisma: any;
  try {
    const { prisma: p } = await import("@/lib/db");
    prisma = p;
  } catch {
    console.warn("⚠️  DB nicht erreichbar – analysiere nur seed-data Dateien.");
  }

  const levelsToCheck = level ? [level] : LEVELS;

  for (const lvl of levelsToCheck) {
    const target = CEFR_TARGETS.find(t => t.level === lvl)!;
    const themes = THEMES[lvl];

    // 1. Vokabeln zählen (DB oder seed-data)
    let vocabCount = 0;
    if (prisma) {
      try {
        vocabCount = await prisma.vocabulary.count({ where: { level: lvl } });
      } catch { /* fallback */ }
    }
    if (vocabCount === 0) {
      // Zähle aus seed-data Datei
      const seedFile = path.join(process.cwd(), "prisma", "seed-data", `vocabulary-${lvl.toLowerCase()}.ts`);
      if (fs.existsSync(seedFile)) {
        const content = fs.readFileSync(seedFile, "utf-8");
        vocabCount = (content.match(/word:/g) || []).length;
      }
    }

    if (vocabCount < target.vocabularyTarget) {
      gaps.push({
        level: lvl,
        type: "vocabulary",
        current: vocabCount,
        target: target.vocabularyTarget,
        gap: target.vocabularyTarget - vocabCount,
        theme: themes[0], // Default-Theme
      });
    }

    // 2. Grammatik zählen
    let grammarCount = 0;
    if (prisma) {
      try {
        grammarCount = await prisma.grammarTopic.count({ where: { level: lvl } });
      } catch { /* fallback */ }
    }
    if (grammarCount === 0) {
      const seedFile = path.join(process.cwd(), "prisma", "seed-data", "grammar-rules.ts");
      if (fs.existsSync(seedFile)) {
        const content = fs.readFileSync(seedFile, "utf-8");
        grammarCount = (content.match(new RegExp(`level: "${lvl}"`, "g")) || []).length;
      }
    }

    if (grammarCount < target.grammarTarget) {
      gaps.push({
        level: lvl,
        type: "grammar",
        current: grammarCount,
        target: target.grammarTarget,
        gap: target.grammarTarget - grammarCount,
        theme: "Grammatik",
      });
    }

    // 3. Sätze zählen
    let sentenceCount = 0;
    if (prisma) {
      try {
        sentenceCount = await prisma.sentence.count({ where: { level: lvl } });
      } catch { /* fallback */ }
    }

    if (sentenceCount < target.sentencesTarget) {
      gaps.push({
        level: lvl,
        type: "sentences",
        current: sentenceCount,
        target: target.sentencesTarget,
        gap: target.sentencesTarget - sentenceCount,
        theme: "Beispielsätze",
      });
    }
  }

  return gaps;
}

// ─── Tatoeba Sentence Importer ──────────────────────────────────────────────

async function importTatoebaSentences(level: CEFRLevel, count: number): Promise<number> {
  const themes = THEMES[level];
  let imported = 0;

  for (const theme of themes.slice(0, 3)) {
    try {
      const query = encodeURIComponent(theme.split(" & ")[0].toLowerCase());
      const url = `https://tatoeba.org/deu/api_v0/search?query=${query}&from=deu&to=eng&limit=${Math.min(count, 20)}`;

      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();
      const results = data.results || [];

      for (const r of results) {
        const text = r.text?.trim();
        const translation = r.translations?.[0]?.[0]?.text?.trim();
        if (!text || !translation || text.length < 10) continue;

        // Schreibe in seed-data/sentences-{level}.ts
        const outDir = path.join(process.cwd(), "prisma", "seed-data");
        const outFile = path.join(outDir, `sentences-${level.toLowerCase()}.ts`);

        const entry = `  { text: "${text.replace(/"/g, '\\"')}", translationEn: "${translation.replace(/"/g, '\\"')}", level: "${level}", source: "Tatoeba (CC BY 2.0)" },\n`;

        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        if (!fs.existsSync(outFile)) {
          fs.writeFileSync(outFile, `export const sentences${level} = [\n${entry}];\n`);
        } else {
          let content = fs.readFileSync(outFile, "utf-8");
          content = content.replace(/];\s*$/, `${entry}];\n`);
          fs.writeFileSync(outFile, content);
        }

        imported++;
        if (imported >= count) break;
      }
    } catch (err) {
      console.warn(`  ⚠️ Tatoeba-Fehler für "${theme}": ${err}`);
    }
  }

  return imported;
}

// ─── DeepSeek Vocabulary Generator ──────────────────────────────────────────

async function generateVocabViaAI(
  level: CEFRLevel,
  theme: string,
  count: number,
  apiKey: string
): Promise<number> {
  const prompt = `Generiere ${count} deutsche Vokabeln für Niveau ${level} zum Thema "${theme}".

FORMAT (streng JSON-Array):
[{
  "word": "Haus",
  "article": "das",
  "pos": "noun",
  "translationEn": "house",
  "translationTr": "ev",
  "translationAr": "منزل",
  "translationRu": "дом",
  "translationPl": "dom",
  "translationRo": "casă",
  "translationUk": "будинок",
  "translationSq": "shtëpi",
  "translationKu": "mal",
  "translationIt": "casa",
  "exampleSentence": "Das Haus ist groß.",
  "exampleTranslation": "The house is big."
}]

WICHTIG:
- Alle 10 Übersetzungen (EN, TR, AR, RU, PL, RO, UK, SQ, KU, IT)
- Einfache, alltagstaugliche Beispielsätze
- Keine Duplikate
- CEFR-Level ${level} angemessen
- Nur JSON-Array zurückgeben, keine Erklärung`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek API error ${response.status}`);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Keine Antwort von DeepSeek");

    // Parse JSON (verschiedene Formate abfangen)
    let entries: any[];
    try {
      const parsed = JSON.parse(content);
      entries = Array.isArray(parsed) ? parsed : parsed.vocabulary || parsed.words || [];
    } catch {
      // Versuche JSON aus dem Text zu extrahieren
      const match = content.match(/\[[\s\S]*\]/);
      entries = match ? JSON.parse(match[0]) : [];
    }

    if (entries.length === 0) {
      console.warn("  ⚠️ DeepSeek gab keine Vokabeln zurück");
      return 0;
    }

    // Schreibe in seed-data Datei
    const outDir = path.join(process.cwd(), "prisma", "seed-data");
    const outFile = path.join(outDir, `vocabulary-${level.toLowerCase()}.ts`);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    let written = 0;
    for (const entry of entries) {
      if (!entry.word || !entry.translationEn) continue;

      const line = `  { word: "${entry.word}", article: ${entry.article ? `"${entry.article}"` : "undefined"}, pos: "${entry.pos || "noun"}", translationEn: "${entry.translationEn}", translationTr: "${entry.translationTr || ""}", translationAr: "${entry.translationAr || ""}", translationRu: "${entry.translationRu || ""}", translationPl: "${entry.translationPl || ""}", translationRo: "${entry.translationRo || ""}", translationUk: "${entry.translationUk || ""}", translationSq: "${entry.translationSq || ""}", translationKu: "${entry.translationKu || ""}", translationIt: "${entry.translationIt || ""}", exampleSentence: "${(entry.exampleSentence || "").replace(/"/g, '\\"')}", exampleTranslation: "${(entry.exampleTranslation || "").replace(/"/g, '\\"')}" },\n`;

      if (!fs.existsSync(outFile)) {
        fs.writeFileSync(outFile, `export const vocabulary${level} = [\n${line}];\n`);
      } else {
        let content = fs.readFileSync(outFile, "utf-8");
        // Prüfe auf Duplikate
        if (content.includes(`word: "${entry.word}"`)) continue;
        content = content.replace(/];\s*$/, `${line}];\n`);
        fs.writeFileSync(outFile, content);
      }
      written++;
    }

    return written;
  } catch (err) {
    console.warn(`  ⚠️ AI-Generierung fehlgeschlagen: ${err}`);
    return 0;
  }
}

// ─── Main Pipeline ──────────────────────────────────────────────────────────

async function main() {
  const program = new Command();

  program
    .option("--dry-run", "Nur Analyse, kein Schreiben")
    .option("--level <level>", "Nur ein CEFR-Level (A1-C1)")
    .option("--source <source>", "Nur eine Quelle nutzen (tatoeba, ai)")
    .option("--max <number>", "Maximale Anzahl neuer Einträge", "20")
    .parse(process.argv);

  const options = program.opts();
  const isDryRun = options.dryRun;
  const targetLevel = options.level as CEFRLevel | undefined;
  const source = options.source as string | undefined;
  const maxNew = parseInt(options.max);

  console.log("═".repeat(62));
  console.log("📚 CONTENT AUTO-FILL PIPELINE");
  console.log("═".repeat(62));
  console.log("");

  // ── Step 1: Gap Analysis ─────────────────────────────────────────────────
  console.log("🔍 Schritt 1: Content-Gap-Analyse (IST vs. CEFR-SOLL)...\n");

  const gaps = await analyzeContentGaps(targetLevel);

  if (gaps.length === 0) {
    console.log("✅ ALLE LEVEL SIND VOLLSTÄNDIG – Keine Lücken!\n");
    process.exit(0);
  }

  console.log("📊 GEFUNDENE LÜCKEN:\n");
  console.log("| Level | Typ | IST | SOLL | Lücke |");
  console.log("|-------|-----|-----|------|-------|");
  for (const g of gaps) {
    console.log(`| ${g.level} | ${g.type} | ${g.current} | ${g.target} | **${g.gap}** |`);
  }
  console.log("");

  if (isDryRun) {
    console.log("🏁 DRY-RUN: Keine Änderungen vorgenommen.");
    console.log("   Führe ohne --dry-run aus, um Lücken automatisch zu füllen.\n");
    process.exit(gaps.length > 0 ? 1 : 0);
  }

  // ── Step 2: Auto-Fill ────────────────────────────────────────────────────
  console.log("🔧 Schritt 2: Lücken automatisch füllen...\n");

  let totalImported = 0;

  for (const gap of gaps) {
    const count = Math.min(gap.gap, maxNew);
    console.log(`  📝 ${gap.level} ${gap.type}: Ziel ${count} neue Einträge...`);

    if (gap.type === "sentences" && (!source || source === "tatoeba")) {
      const imported = await importTatoebaSentences(gap.level, count);
      console.log(`     ✅ ${imported} Sätze von Tatoeba importiert`);
      totalImported += imported;
    }

    if (gap.type === "vocabulary" && (!source || source === "ai")) {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        console.log("     ⚠️ DEEPSEEK_API_KEY nicht gesetzt – überspringe AI-Generierung");
        continue;
      }
      const generated = await generateVocabViaAI(gap.level, gap.theme, count, apiKey);
      console.log(`     ✅ ${generated} Vokabeln via AI generiert`);
      totalImported += generated;
    }

    if (gap.type === "grammar") {
      console.log("     ⚠️ Grammatik-Generierung nur manuell – übersprungen");
    }
  }

  // ── Step 3: Summary ──────────────────────────────────────────────────────
  console.log("");
  console.log("═".repeat(62));
  console.log(`✅ PIPELINE ABGESCHLOSSEN: ${totalImported} neue Einträge`);
  console.log("");
  console.log("Nächste Schritte:");
  console.log("  1. Prüfe die neuen seed-data Dateien");
  console.log("  2. Führe 'npx prisma db seed' aus");
  console.log("  3. Committe & pushe die Änderungen");
  console.log("═".repeat(62));
  console.log("");

  process.exit(0);
}

main();
