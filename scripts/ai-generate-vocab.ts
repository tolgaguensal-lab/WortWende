import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';

/**
 * VocabularyEntry Interface
 * Based on the project's schema requirements.
 */
interface VocabularyEntry {
  word: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  theme: string;
  tags: string[];
}

/**
 * LLM Client Wrapper
 * Users should replace the implementation of callLLM with their actual API client (OpenAI, Anthropic, etc.)
 */
async function callLLM(prompt: string): Promise<string> {
  console.log('--- Sending prompt to LLM ---');
  console.log(prompt);
  console.log('--- End of prompt ---\n');

  // PLACEHOLDER: Replace this block with your actual API call
  // Example for OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4-turbo-preview',
  //   messages: [{ role: 'user', content: prompt }],
  //   response_format: { type: 'json_object' },
  // });
  // return response.choices[0].message.content || '';

  throw new Error('LLM API client not implemented. Please replace the callLLM function with your API logic.');
}

async function main() {
  const program = new Command();

  program
    .option('-l, --level <level>', 'CEFR level (A1, A2, B1, B2, C1, C2)', 'A1')
    .option('-t, --theme <theme>', 'Theme for vocabulary (e.g., Travel, Academic)', 'General')
    .option('-c, --count <count>', 'Number of words to generate', '30')
    .option('--dry-run', 'Print entries to console instead of writing to file', false)
    .parse(process.argv);

  const options = program.opts();
  const level = options.level as VocabularyEntry['level'];
  const theme = options.theme;
  const count = parseInt(options.count);
  const dryRun = options.dryRun;

  const schema = {
    word: 'The target language word',
    translation: 'The translation in English',
    exampleSentence: 'A simple sentence using the word in the target language',
    exampleTranslation: 'The English translation of the example sentence',
    level: 'The CEFR level',
    theme: 'The theme of the word',
    tags: 'An array of related tags',
  };

  const prompt = `
Generate ${count} vocabulary entries for the level ${level} with the theme "${theme}".
The output must be a JSON object with a key "vocabulary" containing an array of entries.
Each entry must follow this schema:
${JSON.stringify(schema, null, 2)}

Requirements:
- Use language: German (Target) and English (Translation).
- Ensure the words are appropriate for level ${level}.
- Provide natural and common example sentences.
- Return ONLY valid JSON.
`;

  try {
    const response = await callLLM(prompt);
    const data = JSON.parse(response);
    const entries: VocabularyEntry[] = data.vocabulary;

    if (!Array.isArray(entries)) {
      throw new Error('LLM response does not contain a "vocabulary" array.');
    }

    // Basic Validation
    entries.forEach((entry, index) => {
      const requiredKeys: keyof VocabularyEntry = ['word', 'translation', 'exampleSentence', 'exampleTranslation', 'level', 'theme', 'tags'];
      requiredKeys.forEach(key => {
        if (!entry[key]) throw new Error(`Entry ${index} is missing required field: ${key}`);
      });
    });

    if (dryRun) {
      console.log('Dry-run mode enabled. Generated entries:');
      console.dir(entries, { depth: null });
      return;
    }

    const filePath = path.join('/home/tolga/Dokumente/Projekte/WortHeld/prisma/seed-data', `vocabulary-${level.toLowerCase()}.ts`);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let fileContent = '';
    if (fs.existsSync(filePath)) {
      fileContent = fs.readFileSync(filePath, 'utf8');
    } else {
      fileContent = `export const vocabulary${level} = [\n];\n`;
    }

    const arrayRegex = new RegExp(`(export const vocabulary${level} = \\[)([\\s\\S]*?)(\\];\\n?)`);
    const match = fileContent.match(arrayRegex);

    if (!match) {
      throw new Error(`Could not find the vocabulary${level} array in ${filePath}`);
    }

    const [fullMatch, prefix, existingEntries, suffix] = match;
    
    // Format new entries to TypeScript objects
    const formattedEntries = entries.map(e => `  {
    word: "${e.word}",
    translation: "${e.translation}",
    exampleSentence: "${e.exampleSentence}",
    exampleTranslation: "${e.exampleTranslation}",
    level: "${e.level}",
    theme: "${e.theme}",
    tags: ${JSON.stringify(e.tags)},
  }`).join(',\n');

    const updatedEntries = existingEntries.trim();
    const newContent = updatedEntries 
      ? `${prefix}\n${updatedEntries},\n${formattedEntries}\n${suffix}`
      : `${prefix}\n${formattedEntries}\n${suffix}`;

    fs.writeFileSync(filePath, fileContent.replace(fullMatch, newContent));
    console.log(`Successfully added ${entries.length} entries to ${filePath}`);

  } catch (error: any) {
    console.error('Error generating vocabulary:', error.message);
    process.exit(1);
  }
}

main();
