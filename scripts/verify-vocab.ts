import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';

/**
 * VocabularyEntry Interface
 * Reflects the structure found in prisma/seed-data/vocabulary-*.ts
 */
interface VocabularyEntry {
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

interface VerificationResult {
  status: 'Pass' | 'Fail' | 'Warning';
  reason?: string;
  suggestedCorrection?: any;
}

/**
 * LLM Client Wrapper
 * Consistent with the ai-generate-vocab.ts pattern.
 */
async function callLLM(prompt: string): Promise<string> {
  console.log('--- Sending prompt to LLM ---');
  // console.log(prompt); // Disabled by default to avoid flooding console in large seeds
  console.log('--- End of prompt ---\n');

  // PLACEHOLDER: Replace this block with actual API call logic
  // Example for OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4-turbo-preview',
  //   messages: [{ role: 'user', content: prompt }],
  //   response_format: { type: 'json_object' },
  // });
  // return response.choices[0].message.content || '';

  throw new Error('LLM API client not implemented. Please replace the callLLM function with your API logic in verify-vocab.ts');
}

async function verifyEntry(entry: VocabularyEntry, level: string): Promise<VerificationResult> {
  const prompt = `
You are a linguistic expert and CEFR specialist. Verify the following vocabulary entry for the ${level} level.

Entry:
- Word: ${entry.word}
- POS: ${entry.pos}
- Translations: 
  EN: ${entry.translationEn}, TR: ${entry.translationTr}, AR: ${entry.translationAr}, 
  RU: ${entry.translationRu}, PL: ${entry.translationPl}, RO: ${entry.translationRo}, 
  UK: ${entry.translationUk}, SQ: ${entry.translationSq}, KU: ${entry.translationKu}, IT: ${entry.translationIt}
- Example Sentence: ${entry.exampleSentence}
- Example Translation: ${entry.exampleTranslation}

Verification Criteria:
1. Is the word/phrase appropriate for CEFR level ${level}?
2. Are all 10 translations correct and consistent with the meaning of the word in the target language?
3. Is the example sentence natural, grammatically correct, and appropriate for level ${level}?

Return ONLY a JSON object with the following structure:
{
  "status": "Pass" | "Fail" | "Warning",
  "reason": "Specific reason for Fail or Warning, otherwise empty",
  "suggestedCorrection": {
    "word": "corrected word if needed",
    "translations": { "en": "...", "tr": "...", ... },
    "exampleSentence": "...",
    "exampleTranslation": "..."
  } or null
}
`;

  try {
    const response = await callLLM(prompt);
    return JSON.parse(response) as VerificationResult;
  } catch (error) {
    console.error(`Error verifying entry ${entry.word}:`, error);
    return { status: 'Warning', reason: `Verification failed due to error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

async function main() {
  const program = new Command();

  program
    .argument('<level>', 'CEFR level to verify (A1, A2, B1, B2, C1)')
    .option('--json', 'Output results in JSON format', false)
    .parse(process.argv);

  const level = program.args[0].toUpperCase();
  const options = program.opts();

  const filePath = path.join('/home/tolga/Dokumente/Projekte/WortHeld/prisma/seed-data', `vocabulary-${level.toLowerCase()}.ts`);

  if (!fs.existsSync(filePath)) {
    console.error(`Seed file not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Crude extraction of the array from the TS file. 
  // In a production environment, a TS parser or importing the module would be safer.
  const arrayMatch = content.match(/export const vocabulary[A-Z0-9]+ = \[(.*)\];?\s*$/s);
  if (!arrayMatch) {
    console.error(`Could not find vocabulary array in ${filePath}`);
    process.exit(1);
  }

  const arrayContent = arrayMatch[1];
  // We use a simple trick to convert the TS array string to JSON
  // Note: This assumes the array contains plain objects.
  try {
    // This is a very rough way to parse TS objects. 
    // For a real implementation, we would use a proper JS parser or `eval` in a VM.
    // Here we'll simulate a basic parse by replacing TS-isms.
    const jsonLike = arrayContent
      .replace(/undefined/g, 'null')
      .replace(/,\s*}/g, '}') // remove trailing commas
      .replace(/(\w+):/g, '"$1":') // quote keys
      .replace(/'/g, '"'); // replace single quotes with double quotes

    // Since the above regex is fragile, we'll use a more robust (but still simple) 
    // approach if the array is exported. Since we are in a script, we can't easily 'import' 
    // a file that might have syntax errors.
    
    // For the sake of this implementation, we'll assume we are processing the 
    // entries by finding the object blocks.
    const entries: VocabularyEntry[] = [];
    const objectRegex = /\{\s*([^}]*)\s*\}/g;
    let match;
    while ((match = objectRegex.exec(arrayContent)) !== null) {
        const objStr = match[0];
        // Basic conversion of "key: value" to JSON
        const processedObj = objStr
            .replace(/(\w+):/g, '"$1":')
            .replace(/undefined/g, 'null')
            .replace(/'/g, '"')
            .replace(/,\s*}/g, '}');
        try {
            entries.push(JSON.parse(processedObj));
        } catch (e) {
            console.warn(`Failed to parse entry: ${objStr.substring(0, 50)}...`);
        }
    }
  } catch (e) {
    console.error('Failed to parse vocabulary file.');
    process.exit(1);
  }

  console.log(`Verifying ${entries.length} entries for level ${level}...`);

  const report: { word: string; result: VerificationResult }[] = [];

  for (const entry of entries) {
    process.stdout.write(`Verifying ${entry.word}... `);
    const result = await verifyEntry(entry, level);
    console.log(`${result.status}`);
    report.push({ word: entry.word, result });
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n--- Verification Report ---');
    report.forEach(item => {
      if (item.result.status !== 'Pass') {
        console.log(`[${item.result.status}] ${item.word}: ${item.result.reason}`);
        if (item.result.suggestedCorrection) {
          console.log(`  Suggested: ${JSON.stringify(item.result.suggestedCorrection)}`);
        }
      }
    });
    
    const failures = report.filter(i => i.result.status === 'Fail').length;
    const warnings = report.filter(i => i.result.status === 'Warning').length;
    console.log(`\nSummary: ${failures} Failures, ${warnings} Warnings, ${report.length - failures - warnings} Passed`);

    if (failures > 0) {
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
