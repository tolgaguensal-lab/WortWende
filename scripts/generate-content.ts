import { PrismaClient, CEFRLevel, Gender } from "@prisma/client";

const prisma = new PrismaClient();

// German vocabulary by CEFR level
const vocabularyData: Record<CEFRLevel, Array<{
  word: string;
  article: string;
  plural: string;
  pos: string;
  gender: Gender;
  translationEn: string;
  translationTr: string;
  exampleSentence: string;
  exampleTranslation: string;
}>> = {
  A1: [
    { word: "der Apfel", article: "der", plural: "Äpfel", pos: "Nomen", gender: "MASCULINE", translationEn: "apple", translationTr: "elma", exampleSentence: "Ich esse einen Apfel.", exampleTranslation: "I am eating an apple." },
    { word: "die Banane", article: "die", plural: "Bananen", pos: "Nomen", gender: "FEMININE", translationEn: "banana", translationTr: "muz", exampleSentence: "Die Banane ist gelb.", exampleTranslation: "The banana is yellow." },
    { word: "der Hund", article: "der", plural: "Hunde", pos: "Nomen", gender: "MASCULINE", translationEn: "dog", translationTr: "köpek", exampleSentence: "Der Hund bellt.", exampleTranslation: "The dog is barking." },
    { word: "die Katze", article: "die", plural: "Katzen", pos: "Nomen", gender: "FEMININE", translationEn: "cat", translationTr: "kedi", exampleSentence: "Die Katze schläft.", exampleTranslation: "The cat is sleeping." },
    { word: "das Haus", article: "das", plural: "Häuser", pos: "Nomen", gender: "NEUTER", translationEn: "house", translationTr: "ev", exampleSentence: "Das Haus ist groß.", exampleTranslation: "The house is big." },
    { word: "die Schule", article: "die", plural: "Schulen", pos: "Nomen", gender: "FEMININE", translationEn: "school", translationTr: "okul", exampleSentence: "Die Schule ist nah.", exampleTranslation: "The school is near." },
    { word: "der Lehrer", article: "der", plural: "Lehrer", pos: "Nomen", gender: "MASCULINE", translationEn: "teacher", translationTr: "öğretmen", exampleSentence: "Der Lehrer erklärt.", exampleTranslation: "The teacher is explaining." },
    { word: "die Schülerin", article: "die", plural: "Schülerinnen", pos: "Nomen", gender: "FEMININE", translationEn: "female student", translationTr: "öğrenci", exampleSentence: "Die Schülerin lernt.", exampleTranslation: "The female student is learning." },
    { word: "das Buch", article: "das", plural: "Bücher", pos: "Nomen", gender: "NEUTER", translationEn: "book", translationTr: "kitap", exampleSentence: "Das Buch ist interessant.", exampleTranslation: "The book is interesting." },
    { word: "der Stuhl", article: "der", plural: "Stühle", pos: "Nomen", gender: "MASCULINE", translationEn: "chair", translationTr: "sandalye", exampleSentence: "Der Stuhl ist bequem.", exampleTranslation: "The chair is comfortable." },
    { word: "der Tisch", article: "der", plural: "Tische", pos: "Nomen", gender: "MASCULINE", translationEn: "table", translationTr: "masa", exampleSentence: "Der Tisch ist klein.", exampleTranslation: "The table is small." },
    { word: "die Lampe", article: "die", plural: "Lampen", pos: "Nomen", gender: "FEMININE", translationEn: "lamp", translationTr: "lamba", exampleSentence: "Die Lampe leuchtet.", exampleTranslation: "The lamp is shining." },
    { word: "das Fenster", article: "das", plural: "Fenster", pos: "Nomen", gender: "NEUTER", translationEn: "window", translationTr: "pencere", exampleSentence: "Das Fenster ist offen.", exampleTranslation: "The window is open." },
    { word: "die Tür", article: "die", plural: "Türen", pos: "Nomen", gender: "FEMININE", translationEn: "door", translationTr: "kapı", exampleSentence: "Die Tür ist geschlossen.", exampleTranslation: "The door is closed." },
    { word: "die Familie", article: "die", plural: "Familien", pos: "Nomen", gender: "FEMININE", translationEn: "family", translationTr: "aile", exampleSentence: "Die Familie ist groß.", exampleTranslation: "The family is big." },
    { word: "der Vater", article: "der", plural: "Väter", pos: "Nomen", gender: "MASCULINE", translationEn: "father", translationTr: "baba", exampleSentence: "Der Vater arbeitet.", exampleTranslation: "The father is working." },
    { word: "die Mutter", article: "die", plural: "Mütter", pos: "Nomen", gender: "FEMININE", translationEn: "mother", translationTr: "anne", exampleSentence: "Die Mutter kocht.", exampleTranslation: "The mother is cooking." },
    { word: "der Bruder", article: "der", plural: "Brüder", pos: "Nomen", gender: "MASCULINE", translationEn: "brother", translationTr: "kardeş", exampleSentence: "Der Bruder ist jung.", exampleTranslation: "The brother is young." },
    { word: "die Schwester", article: "die", plural: "Schwestern", pos: "Nomen", gender: "FEMININE", translationEn: "sister", translationTr: "kardeş", exampleSentence: "Die Schwester liest.", exampleTranslation: "The sister is reading." },
    { word: "der Freund", article: "der", plural: "Freunde", pos: "Nomen", gender: "MASCULINE", translationEn: "friend", translationTr: "arkadaş", exampleSentence: "Der Freund kommt.", exampleTranslation: "The friend is coming." },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
};

async function generateVocabulary() {
  console.log("Generating vocabulary...");
  
  for (const [level, words] of Object.entries(vocabularyData)) {
    for (const wordData of words) {
      await prisma.vocabulary.create({
        data: {
          word: wordData.word.split(" ")[1], // Remove article
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
  }
  
  console.log("Vocabulary generated!");
}

generateVocabulary();
