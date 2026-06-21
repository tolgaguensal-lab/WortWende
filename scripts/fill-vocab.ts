/**
 * Quick Content Filler — Generates vocabulary via DeepSeek API
 * Usage: npx tsx scripts/fill-vocab.ts
 * Requires: DEEPSEEK_API_KEY in .env
 */

const BATCH_SIZE = 30;
const TARGET = 500; // target per level

const THEMES: Record<string, string[]> = {
  A1: ["Familie", "Essen", "Wohnen", "Kleidung", "Körper", "Arbeit", "Einkaufen", "Freizeit", "Wetter", "Verkehr", "Zahlen", "Farben"],
  A2: ["Reisen", "Gesundheit", "Bank", "Post", "Medien", "Behörden", "Schule", "Feste", "Umwelt", "Gefühle"],
  B1: ["Bewerbung", "Arzt", "Politik", "Kultur", "Bildung", "Mobilität", "Nachhaltigkeit", "Beziehungen"],
  B2: ["Karriere", "Wirtschaft", "Wissenschaft", "Kunst", "Geschichte", "Recht", "Psychologie", "Digitalisierung"],
  C1: ["Philosophie", "Fachsprache", "Literatur", "Gesellschaft", "Abstrakt", "Idiome", "Nuancen", "Diskurs"],
};

async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 8192, temperature: 0.7, response_format: { type: "json_object" } }),
  });
  const data = await res.json() as any;
  return data.choices[0].message.content;
}

async function genBatch(level: string, theme: string, count: number): Promise<string[]> {
  const prompt = `Generate ${count} German vocabulary entries for level ${level}, theme "${theme}". Output as JSON: { "entries": [ { "line": "  { word: \\"der Tisch\\", article: \\"der\\", pos: \\"noun\\", translationEn: \\"table\\", translationTr: \\"masa\\", translationAr: \\"طاولة\\", translationRu: \\"стол\\", translationPl: \\"stół\\", translationRo: \\"masă\\", translationUk: \\"стіл\\", translationSq: \\"tavolinë\\", translationKu: \\"mase\\", translationIt: \\"tavolo\\", exampleSentence: \\"Der Tisch ist groß.\\", exampleTranslation: \\"The table is big.\\" }" } ] }. Each entry is ONE line of valid TypeScript array element. Nouns MUST have article. Generate ONLY the JSON, no markdown.`;
  
  console.log(`  ${level}/${theme}...`);
  const resp = await callDeepSeek(prompt);
  const clean = resp.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const data = JSON.parse(clean);
  return data.entries.map((e: any) => e.line);
}

async function main() {
  const fs = require("fs");
  const path = require("path");
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  
  for (const level of levels) {
    const filePath = path.join(process.cwd(), "prisma", "seed-data", `vocabulary-${level.toLowerCase()}.ts`);
    let content = fs.readFileSync(filePath, "utf8");
    const current = (content.match(/\{ word:/g) || []).length;
    const needed = Math.max(0, TARGET - current);
    
    console.log(`\n📚 ${level}: ${current} → target ${TARGET} (need ${needed})`);
    if (needed === 0) continue;
    
    let added = 0;
    for (const theme of THEMES[level]) {
      if (added >= needed) break;
      const count = Math.min(BATCH_SIZE, needed - added);
      try {
        const lines = await genBatch(level, theme, count);
        // Insert before closing ];
        const idx = content.lastIndexOf("];");
        content = content.slice(0, idx) + ",\n" + lines.join(",\n") + "\n];\n";
        added += lines.length;
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`  ✓ +${lines.length} (total: ${(content.match(/\{ word:/g) || []).length})`);
      } catch (e: any) {
        console.log(`  ⚠ ${theme}: ${e.message?.slice(0, 80)}`);
      }
      await new Promise(r => setTimeout(r, 1500)); // rate limit
    }
  }
  console.log("\n✅ Done!");
}

main().catch(e => { console.error(e); process.exit(1); });
