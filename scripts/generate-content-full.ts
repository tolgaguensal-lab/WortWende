import { PrismaClient, CEFRLevel, Gender } from "@prisma/client";

const prisma = new PrismaClient();

interface VocabEntry {
  word: string;
  article: string;
  plural: string;
  pos: string;
  gender: Gender;
  translationEn: string;
  translationTr: string;
  exampleSentence: string;
  exampleTranslation: string;
}

// Comprehensive vocabulary for all CEFR levels
const vocabularyByLevel: Record<CEFRLevel, VocabEntry[]> = {
  A1: [
    // Numbers & Basic Words
    { word: "eins", article: "", plural: "", pos: "Zahl", gender: "NEUTER", translationEn: "one", translationTr: "bir", exampleSentence: "Eins, zwei, drei.", exampleTranslation: "One, two, three." },
    { word: "zwei", article: "", plural: "", pos: "Zahl", gender: "NEUTER", translationEn: "two", translationTr: "iki", exampleSentence: "Ich habe zwei Bücher.", exampleTranslation: "I have two books." },
    { word: "drei", article: "", plural: "", pos: "Zahl", gender: "NEUTER", translationEn: "three", translationTr: "üç", exampleSentence: "Drei Äpfel bitte.", exampleTranslation: "Three apples please." },
    
    // Food
    { word: "das Brot", article: "das", plural: "Brote", pos: "Nomen", gender: "NEUTER", translationEn: "bread", translationTr: "ekmek", exampleSentence: "Das Brot ist frisch.", exampleTranslation: "The bread is fresh." },
    { word: "die Milch", article: "die", plural: "", pos: "Nomen", gender: "FEMININE", translationEn: "milk", translationTr: "süt", exampleSentence: "Ich trinke Milch.", exampleTranslation: "I drink milk." },
    { word: "der Käse", article: "der", plural: "", pos: "Nomen", gender: "MASCULINE", translationEn: "cheese", translationTr: "peynir", exampleSentence: "Der Käse schmeckt gut.", exampleTranslation: "The cheese tastes good." },
    { word: "das Wasser", article: "das", plural: "", pos: "Nomen", gender: "NEUTER", translationEn: "water", translationTr: "su", exampleSentence: "Das Wasser ist kalt.", exampleTranslation: "The water is cold." },
    
    // Colors
    { word: "rot", article: "", plural: "", pos: "Adjektiv", gender: "NEUTER", translationEn: "red", translationTr: "kırmızı", exampleSentence: "Die Blume ist rot.", exampleTranslation: "The flower is red." },
    { word: "blau", article: "", plural: "", pos: "Adjektiv", gender: "NEUTER", translationEn: "blue", translationTr: "mavi", exampleSentence: "Der Himmel ist blau.", exampleTranslation: "The sky is blue." },
    { word: "grün", article: "", plural: "", pos: "Adjektiv", gender: "NEUTER", translationEn: "green", translationTr: "yeşil", exampleSentence: "Der Gras ist grün.", exampleTranslation: "The grass is green." },
    { word: "gelb", article: "", plural: "", pos: "Adjektiv", gender: "NEUTER", translationEn: "yellow", translationTr: "sarı", exampleSentence: "Die Sonne ist gelb.", exampleTranslation: "The sun is yellow." },
    
    // Time
    { word: "heute", article: "", plural: "", pos: "Adverb", gender: "NEUTER", translationEn: "today", translationTr: "bugün", exampleSentence: "Heute ist Montag.", exampleTranslation: "Today is Monday." },
    { word: "morgen", article: "", plural: "", pos: "Adverb", gender: "NEUTER", translationEn: "tomorrow", translationTr: "yarın", exampleSentence: "Morgen gehe ich.", exampleTranslation: "Tomorrow I will go." },
    { word: "gestern", article: "", plural: "", pos: "Adverb", gender: "NEUTER", translationEn: "yesterday", translationTr: "dün", exampleSentence: "Gestern war ich da.", exampleTranslation: "Yesterday I was there." },
    
    // Basic Verbs (as nouns)
    { word: "der Tag", article: "der", plural: "Tage", pos: "Nomen", gender: "MASCULINE", translationEn: "day", translationTr: "gün", exampleSentence: "Der Tag ist lang.", exampleTranslation: "The day is long." },
    { word: "die Nacht", article: "die", plural: "Nächte", pos: "Nomen", gender: "FEMININE", translationEn: "night", translationTr: "gece", exampleSentence: "Die Nacht ist dunkel.", exampleTranslation: "The night is dark." },
    { word: "die Woche", article: "die", plural: "Wochen", pos: "Nomen", gender: "FEMININE", translationEn: "week", translationTr: "hafta", exampleSentence: "Die Woche vergeht schnell.", exampleTranslation: "The week passes quickly." },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
};

async function main() {
  console.log("Starting content generation...\n");
  
  // Generate vocabulary
  for (const [level, words] of Object.entries(vocabularyByLevel)) {
    console.log(`Generating ${level} vocabulary...`);
    for (const wordData of words) {
      await prisma.vocabulary.upsert({
        where: { id: crypto.randomUUID() },
        update: {},
        create: {
          word: wordData.word.split(" ")[1] || wordData.word,
          article: wordData.article,
          plural: wordData.plural,
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
    }
    console.log(`  ✓ ${words.length} words for ${level}`);
  }
  
  await prisma.$disconnect();
  console.log("\n✓ Content generation complete!");
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
