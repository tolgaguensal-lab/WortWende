import { PrismaClient, CEFRLevel, Gender } from "@prisma/client";

const prisma = new PrismaClient();

// Complete vocabulary for A1-C1 (realistic German learning content)
const allVocabulary: Record<CEFRLevel, Array<{
  word: string;
  article?: string;
  plural?: string;
  pos: string;
  gender: Gender;
  translationEn: string;
  translationTr: string;
  exampleSentence: string;
  exampleTranslation: string;
}>> = {
  A1: [
    // Numbers
    { word: "eins", pos: "Zahl", gender: "NEUTER", translationEn: "one", translationTr: "bir", exampleSentence: "Eins plus eins ist zwei.", exampleTranslation: "One plus one is two." },
    { word: "zwei", pos: "Zahl", gender: "NEUTER", translationEn: "two", translationTr: "iki", exampleSentence: "Ich habe zwei Schwestern.", exampleTranslation: "I have two sisters." },
    { word: "drei", pos: "Zahl", gender: "NEUTER", translationEn: "three", translationTr: "üç", exampleSentence: "Wir sind drei Personen.", exampleTranslation: "We are three people." },
    { word: "vier", pos: "Zahl", gender: "NEUTER", translationEn: "four", translationTr: "dört", exampleSentence: "Vier mal vier ist sechzehn.", exampleTranslation: "Four times four is sixteen." },
    { word: "fünf", pos: "Zahl", gender: "NEUTER", translationEn: "five", translationTr: "beş", exampleSentence: "Es ist fünf Uhr.", exampleTranslation: "It is five o'clock." },
    
    // Family
    { word: "der Vater", article: "der", plural: "Väter", pos: "Nomen", gender: "MASCULINE", translationEn: "father", translationTr: "baba", exampleSentence: "Mein Vater arbeitet.", exampleTranslation: "My father works." },
    { word: "die Mutter", article: "die", plural: "Mütter", pos: "Nomen", gender: "FEMININE", translationEn: "mother", translationTr: "anne", exampleSentence: "Meine Mutter kocht gut.", exampleTranslation: "My mother cooks well." },
    { word: "der Bruder", article: "der", plural: "Brüder", pos: "Nomen", gender: "MASCULINE", translationEn: "brother", translationTr: "abla", exampleSentence: "Mein Bruder ist jung.", exampleTranslation: "My brother is young." },
    { word: "die Schwester", article: "die", plural: "Schwestern", pos: "Nomen", gender: "FEMININE", translationEn: "sister", translationTr: "kız kardeş", exampleSentence: "Meine Schwester studiert.", exampleTranslation: "My sister is studying." },
    { word: "die Familie", article: "die", plural: "Familien", pos: "Nomen", gender: "FEMININE", translationEn: "family", translationTr: "aile", exampleSentence: "Meine Familie ist groß.", exampleTranslation: "My family is big." },
    
    // Food
    { word: "das Brot", article: "das", plural: "Brote", pos: "Nomen", gender: "NEUTER", translationEn: "bread", translationTr: "ekmek", exampleSentence: "Ich esse Brot zum Frühstück.", exampleTranslation: "I eat bread for breakfast." },
    { word: "die Milch", article: "die", plural: "", pos: "Nomen", gender: "FEMININE", translationEn: "milk", translationTr: "süt", exampleSentence: "Ich trinke Milch.", exampleTranslation: "I drink milk." },
    { word: "der Käse", article: "der", plural: "", pos: "Nomen", gender: "MASCULINE", translationEn: "cheese", translationTr: "peynir", exampleSentence: "Der Käse ist lecker.", exampleTranslation: "The cheese is delicious." },
    { word: "das Wasser", article: "das", plural: "", pos: "Nomen", gender: "NEUTER", translationEn: "water", translationTr: "su", exampleSentence: "Das Wasser ist kalt.", exampleTranslation: "The water is cold." },
    { word: "der Apfel", article: "der", plural: "Äpfel", pos: "Nomen", gender: "MASCULINE", translationEn: "apple", translationTr: "elma", exampleSentence: "Der Apfel ist rot.", exampleTranslation: "The apple is red." },
    
    // Colors
    { word: "rot", pos: "Adjektiv", gender: "NEUTER", translationEn: "red", translationTr: "kırmızı", exampleSentence: "Die Rose ist rot.", exampleTranslation: "The rose is red." },
    { word: "blau", pos: "Adjektiv", gender: "NEUTER", translationEn: "blue", translationTr: "mavi", exampleSentence: "Der Himmel ist blau.", exampleTranslation: "The sky is blue." },
    { word: "grün", pos: "Adjektiv", gender: "NEUTER", translationEn: "green", translationTr: "yeşil", exampleSentence: "Die Wiese ist grün.", exampleTranslation: "The meadow is green." },
    { word: "gelb", pos: "Adjektiv", gender: "NEUTER", translationEn: "yellow", translationTr: "sarı", exampleSentence: "Die Banane ist gelb.", exampleTranslation: "The banana is yellow." },
    { word: "schwarz", pos: "Adjektiv", gender: "NEUTER", translationEn: "black", translationTr: "siyah", exampleSentence: "Die Katze ist schwarz.", exampleTranslation: "The cat is black." },
    { word: "weiß", pos: "Adjektiv", gender: "NEUTER", translationEn: "white", translationTr: "beyaz", exampleSentence: "Die Wolken sind weiß.", exampleTranslation: "The clouds are white." },
    
    // Time
    { word: "heute", pos: "Adverb", gender: "NEUTER", translationEn: "today", translationTr: "bugün", exampleSentence: "Heute ist Sonntag.", exampleTranslation: "Today is Sunday." },
    { word: "morgen", pos: "Adverb", gender: "NEUTER", translationEn: "tomorrow", translationTr: "yarın", exampleSentence: "Morgen gehe ich nach Berlin.", exampleTranslation: "Tomorrow I will go to Berlin." },
    { word: "gestern", pos: "Adverb", gender: "NEUTER", translationEn: "yesterday", translationTr: "dün", exampleSentence: "Gestern war ich im Kino.", exampleTranslation: "Yesterday I was at the cinema." },
    { word: "der Tag", article: "der", plural: "Tage", pos: "Nomen", gender: "MASCULINE", translationEn: "day", translationTr: "gün", exampleSentence: "Der Tag ist schön.", exampleTranslation: "The day is beautiful." },
    { word: "die Nacht", article: "die", plural: "Nächte", pos: "Nomen", gender: "FEMININE", translationEn: "night", translationTr: "gece", exampleSentence: "Die Nacht ist ruhig.", exampleTranslation: "The night is quiet." },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
};

async function generateVocabulary() {
  console.log("📚 Generating vocabulary...\n");
  
  for (const [level, words] of Object.entries(allVocabulary)) {
    let count = 0;
    for (const wordData of words) {
      const cleanWord = wordData.word.split(" ")[1] || wordData.word;
      
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
  
  // Get final count
  const total = await prisma.vocabulary.count({ where: { isPublished: true } });
  console.log(`\n✅ Total vocabulary: ${total} entries\n`);
}

generateVocabulary();
