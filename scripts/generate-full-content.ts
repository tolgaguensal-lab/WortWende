import { PrismaClient, CEFRLevel, Gender } from "@prisma/client";

const prisma = new PrismaClient();

interface VocabEntry {
  word: string;
  article?: string;
  plural?: string;
  pos: string;
  gender: Gender;
  translationEn: string;
  translationTr: string;
  exampleSentence: string;
  exampleTranslation: string;
}

// Complete vocabulary for all levels
const vocabularyByLevel: Record<CEFRLevel, VocabEntry[]> = {
  A1: [
    // Numbers
    { word: "eins", pos: "Zahl", gender: "NEUTER", translationEn: "one", translationTr: "bir", exampleSentence: "Eins, zwei, drei.", exampleTranslation: "One, two, three." },
    { word: "zwei", pos: "Zahl", gender: "NEUTER", translationEn: "two", translationTr: "iki", exampleSentence: "Ich habe zwei Äpfel.", exampleTranslation: "I have two apples." },
    { word: "drei", pos: "Zahl", gender: "NEUTER", translationEn: "three", translationTr: "üç", exampleSentence: "Wir sind drei.", exampleTranslation: "We are three." },
    
    // Family
    { word: "der Vater", article: "der", plural: "Väter", pos: "Nomen", gender: "MASCULINE", translationEn: "father", translationTr: "baba", exampleSentence: "Mein Vater ist groß.", exampleTranslation: "My father is tall." },
    { word: "die Mutter", article: "die", plural: "Mütter", pos: "Nomen", gender: "FEMININE", translationEn: "mother", translationTr: "anne", exampleSentence: "Meine Mutter kocht.", exampleTranslation: "My mother cooks." },
    { word: "der Bruder", article: "der", plural: "Brüder", pos: "Nomen", gender: "MASCULINE", translationEn: "brother", translationTr: "erkek kardeş", exampleSentence: "Mein Bruder ist jung.", exampleTranslation: "My brother is young." },
    { word: "die Schwester", article: "die", plural: "Schwestern", pos: "Nomen", gender: "FEMININE", translationEn: "sister", translationTr: "kız kardeş", exampleSentence: "Meine Schwester liest.", exampleTranslation: "My sister is reading." },
    
    // Food
    { word: "das Brot", article: "das", plural: "Brote", pos: "Nomen", gender: "NEUTER", translationEn: "bread", translationTr: "ekmek", exampleSentence: "Das Brot ist frisch.", exampleTranslation: "The bread is fresh." },
    { word: "die Milch", article: "die", plural: "", pos: "Nomen", gender: "FEMININE", translationEn: "milk", translationTr: "süt", exampleSentence: "Ich trinke Milch.", exampleTranslation: "I drink milk." },
    { word: "der Apfel", article: "der", plural: "Äpfel", pos: "Nomen", gender: "MASCULINE", translationEn: "apple", translationTr: "elma", exampleSentence: "Der Apfel ist rot.", exampleTranslation: "The apple is red." },
    { word: "die Banane", article: "die", plural: "Bananen", pos: "Nomen", gender: "FEMININE", translationEn: "banana", translationTr: "muz", exampleSentence: "Die Banane ist gelb.", exampleTranslation: "The banana is yellow." },
    
    // Colors
    { word: "rot", pos: "Adjektiv", gender: "NEUTER", translationEn: "red", translationTr: "kırmızı", exampleSentence: "Die Blume ist rot.", exampleTranslation: "The flower is red." },
    { word: "blau", pos: "Adjektiv", gender: "NEUTER", translationEn: "blue", translationTr: "mavi", exampleSentence: "Der Himmel ist blau.", exampleTranslation: "The sky is blue." },
    { word: "grün", pos: "Adjektiv", gender: "NEUTER", translationEn: "green", translationTr: "yeşil", exampleSentence: "Das Gras ist grün.", exampleTranslation: "The grass is green." },
    { word: "gelb", pos: "Adjektiv", gender: "NEUTER", translationEn: "yellow", translationTr: "sarı", exampleSentence: "Die Sonne ist gelb.", exampleTranslation: "The sun is yellow." },
    { word: "schwarz", pos: "Adjektiv", gender: "NEUTER", translationEn: "black", translationTr: "siyah", exampleSentence: "Die Katze ist schwarz.", exampleTranslation: "The cat is black." },
    { word: "weiß", pos: "Adjektiv", gender: "NEUTER", translationEn: "white", translationTr: "beyaz", exampleSentence: "Das Papier ist weiß.", exampleTranslation: "The paper is white." },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
};

interface GrammarEntry {
  name: string;
  description: string;
  level: CEFRLevel;
  explanation: string;
  examples: string;
  tips?: string;
  order: number;
}

const grammarByLevel: Record<CEFRLevel, GrammarEntry[]> = {
  A1: [
    {
      name: "Der, Die, Das - Artikel",
      description: "Die deutschen Artikel",
      level: "A1" as CEFRLevel,
      order: 1,
      explanation: "Im Deutschen gibt es drei Artikel: der (maskulin), die (feminin), das (neutral). Der Artikel zeigt das Geschlecht eines Nomens.",
      examples: "der Mann, die Frau, das Kind. Im Plural: die Männer, die Frauen, die Kinder",
      tips: "Lerne immer den Artikel mit dem Nomen zusammen!"
    },
    {
      name: "Sein - Konjugation",
      description: "Das Verb 'sein' im Präsens",
      level: "A1" as CEFRLevel,
      order: 2,
      explanation: "'Sein' ist ein unregelmäßiges Verb. Ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
      examples: "Ich bin Lehrer. Du bist Schüler. Wir sind Freunde.",
      tips: "Dies ist das wichtigste Verb im Deutschen!"
    },
    {
      name: "Haben - Konjugation",
      description: "Das Verb 'haben' im Präsens",
      level: "A1" as CEFRLevel,
      order: 3,
      explanation: "'Haben' bedeutet 'to have'. Ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben.",
      examples: "Ich habe ein Auto. Du hast ein Buch. Wir haben Zeit.",
      tips: "Wichtig für Besitz und viele zusammengesetzte Zeiten!"
    },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
};

async function main() {
  console.log("🚀 Starting content generation...\n");
  
  // Generate vocabulary
  console.log("📚 Generating vocabulary...");
  for (const [level, words] of Object.entries(vocabularyByLevel)) {
    let count = 0;
    for (const wordData of words) {
      const cleanWord = wordData.word.split(" ").pop() || wordData.word;
      
      await prisma.vocabulary.create({
        data: {
          word: cleanWord,
          article: wordData.article,
          plural: wordData.plural || "",
          pos: wordData.pos,
          level: level as CEFRLevel,
          gender: wordData.gender,
          translationEn: wordData.translationEn,
          translationTr: wordData.translationTr,
          exampleSentence: wordData.exampleSentence,
          exampleTranslation: wordData.exampleTranslation,
          isPublished: true,
        },
      });
      count++;
    }
    console.log(`  ✓ ${level}: ${count} words`);
  }
  
  // Generate grammar
  console.log("\n📖 Generating grammar topics...");
  for (const [level, topics] of Object.entries(grammarByLevel)) {
    for (const topic of topics) {
      await prisma.grammarTopic.create({
        data: {
          name: topic.name,
          description: topic.description,
          level: topic.level,
          order: topic.order,
          explanation: topic.explanation,
          examples: topic.examples,
          tips: topic.tips,
          isPublished: true,
        },
      });
    }
    console.log(`  ✓ ${level}: ${topics.length} topics`);
  }
  
  // Get final counts
  const [vocabTotal, grammarTotal] = await Promise.all([
    prisma.vocabulary.count({ where: { isPublished: true } }),
    prisma.grammarTopic.count({ where: { isPublished: true } }),
  ]);
  
  console.log(`\n✅ Generation complete!`);
  console.log(`   Vocabulary: ${vocabTotal} entries`);
  console.log(`   Grammar: ${grammarTotal} topics`);
  
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
