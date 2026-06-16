import { PrismaClient, CEFRLevel, ExerciseType, DifficultyLevel, SkillCategory } from "@prisma/client";
import { vocabularyA1 } from "./seed-data/vocabulary-a1";
import { vocabularyA2 } from "./seed-data/vocabulary-a2";
import { vocabularyB1 } from "./seed-data/vocabulary-b1";
import { vocabularyB2 } from "./seed-data/vocabulary-b2";
import { vocabularyC1 } from "./seed-data/vocabulary-c1";
import { grammarRules } from "./seed-data/grammar-rules";

const prisma = new PrismaClient();

interface VocabEntry {
  word: string;
  article?: string;
  pos: string;
  translationEn: string;
  translationTr?: string;
  translationAr?: string;
  translationRu?: string;
  translationPl?: string;
  translationRo?: string;
  translationUk?: string;
  translationSq?: string;
  translationKu?: string;
  translationIt?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  baseForm?: string;
}

const courses = [
  { id: "course-a1", name: "Deutsch im Alltag", description: "Grundlagen des Deutschen für Anfänger – Begrüßungen, Zahlen, Familie, Einkaufen und mehr.", level: CEFRLevel.A1, order: 1 },
  { id: "course-a2", name: "Deutsch im Beruf", description: "Berufliche Kommunikation – Bewerbung, Büro, Alltag im Job und Kollegen.", level: CEFRLevel.A2, order: 2 },
  { id: "course-b1", name: "Deutsch in der Gesellschaft", description: "Gesellschaftliche Teilhabe – Politik, Kultur, Gesundheit und Medien.", level: CEFRLevel.B1, order: 3 },
  { id: "course-b2", name: "Deutsch für Academic", description: "Akademisches Deutsch – Wissenschaft, Forschung, Philosophie und Recht.", level: CEFRLevel.B2, order: 4 },
  { id: "course-c1", name: "Deutsch für Experten", description: "Fortgeschrittenes Deutsch – Diplomatie, Kultur, Ethik und komplexe Grammatik.", level: CEFRLevel.C1, order: 5 },
];

const unitsByCourse: Record<string, { name: string; description: string; themeColor: string; lessons: string[] }[]> = {
  "course-a1": [
    { name: "Begrüßung & Vorstellung", description: "Begrüßen, sich vorstellen, Höflichkeit", themeColor: "#22c55e", lessons: ["Hallo! Begrüßungen", "Wie heißt du?", "Woher kommst du?", "Wie alt bist du?", "Telefonnummern"] },
    { name: "Zahlen & Zeit", description: "Zahlen, Uhrzeit, Wochentage", themeColor: "#3b82f6", lessons: ["Zahlen von 1-20", "Zahlen von 21-100", "Uhrzeit sagen", "Wochentage & Monate", "Datum & Kalender"] },
    { name: "Familie & Menschen", description: "Familienmitglieder, Körper, Farben", themeColor: "#f59e0b", lessons: ["Meine Familie", "Körperteile", "Farben", "Charakter & Persönlichkeit", "Freunde & Bekannte"] },
    { name: "Essen & Trinken", description: "Im Restaurant, Bestellen, Lebensmittel", themeColor: "#ef4444", lessons: ["Im Restaurant", "Getränke bestellen", "Lebensmittel", "Frühstück, Mittag, Abend", "Geschmack & Kochen"] },
    { name: "Wohnen & Umgebung", description: "Wohnung, Möbel, Nachbarschaft", themeColor: "#8b5cf6", lessons: ["Meine Wohnung", "Möbel & Einrichtung", "In der Nachbarschaft", "Reparaturen", "Post & Pakete"] },
    { name: "Kleidung & Einkaufen", description: "Kleidung, Farben, Im Supermarkt", themeColor: "#ec4899", lessons: ["Kleidung & Mode", "Im Supermarkt", "Preise & Angebote", "Kasse & Bezahlung", "Reklamation"] },
    { name: "Wetter & Natur", description: "Wetter, Jahreszeiten, Natur", themeColor: "#14b8a6", lessons: ["Das Wetter", "Jahreszeiten", "Natur & Landschaft", "Tiere", "Wettervorhersage"] },
    { name: "Freizeit & Hobbys", description: "Sport, Musik, Kino, Vereine", themeColor: "#f97316", lessons: ["Sport & Bewegung", "Musik & Tanzen", "Kino & Theater", "Hobbys & Interessen", "Im Verein"] },
    { name: "Verkehr & Reisen", description: "ÖPNV, Auto, Fliegen, Hotels", themeColor: "#06b6d4", lessons: ["Mit dem Bus", "U-Bahn & Straßenbahn", "Auto & Fahrrad", "Am Flughafen", "Im Hotel"] },
    { name: "Körper & Gesundheit", description: "Krankheit, Arzt, Apotheke", themeColor: "#dc2626", lessons: ["Krankheiten", "Beim Arzt", "Medikamente", "Gesund leben", "Im Krankenhaus"] },
  ],
  "course-a2": [
    { name: "Arbeit & Beruf", description: "Bewerbung, Büro, Kollegen", themeColor: "#22c55e", lessons: ["Bewerbung & Lebenslauf", "Im Büro", "Telefonieren", "Meetings", "Feiertage & Urlaub"] },
    { name: "Gesundheit & Medizin", description: "Arztbesuch, Diagnose, Behandlung", themeColor: "#ef4444", lessons: ["Beim Facharzt", "Diagnose & Behandlung", "Impfungen", "Ernährung", "Sport & Fitness"] },
    { name: "Bildung & Weiterbildung", description: "Schule, Universität, Prüfungen", themeColor: "#3b82f6", lessons: ["In der Schule", "An der Universität", "Prüfungen & Noten", "Hausaufgaben", "Fernunterricht"] },
    { name: "Gesellschaft & Politik", description: "Wahlen, Gesetze, Bürgerrechte", themeColor: "#8b5cf6", lessons: ["Die Demokratie", "Wahlen & Parteien", "Gesetze & Rechte", "Bürger & Pflichten", "Meinung äußern"] },
    { name: "Reisen & Kultur", description: "Sehenswürdigkeiten, Traditionen", themeColor: "#f59e0b", lessons: ["Sehenswürdigkeiten", "Museen & Galerien", "Feste & Traditionen", "Reise planen", "Fotografieren"] },
    { name: "Medien & Kommunikation", description: "Zeitungen, Internet, soziale Medien", themeColor: "#06b6d4", lessons: ["Zeitungen & Zeitschriften", "Internet & Apps", "Soziale Medien", "Nachrichten", "Fernsehen & Radio"] },
    { name: "Umwelt & Nachhaltigkeit", description: "Klimawandel, Recycling, Natur", themeColor: "#14b8a6", lessons: ["Klimawandel", "Recycling & Müll", "Erneuerbare Energien", "Umweltschutz", "Natur schützen"] },
    { name: "Alltag & Lebenssituationen", description: "Routinen, Gewohnheiten, Herausforderungen", themeColor: "#ec4899", lessons: ["Tagesablauf", "Gewohnheiten", "Herausforderungen", "Zeitmanagement", "Organisation"] },
    { name: "Emotionen & Beziehungen", description: "Gefühle, Freundschaft, Liebe", themeColor: "#f97316", lessons: ["Gefühle ausdrücken", "Freundschaft", "Liebe & Beziehung", "Vertrauen", "Konflikte lösen"] },
    { name: "Technologie & Digitalisierung", description: "Computer, Internet, Apps", themeColor: "#6366f1", lessons: ["Computer & Laptop", "Internet & Sicherheit", "Apps & Software", "Digitalisierung", "Zukunftstechnologien"] },
  ],
  "course-b1": [
    { name: "Arbeit & Karriere", description: "Bewerbung, Gehalt, Weiterbildung", themeColor: "#22c55e", lessons: ["Bewerbungsanschreiben", "Vorstellungsgespräch", "Gehalt & Vertrag", "Weiterbildung", "Selbstständigkeit"] },
    { name: "Bildung & Forschung", description: "Universität, Studium, Forschung", themeColor: "#3b82f6", lessons: ["Studium planen", "Forschungsmethoden", "Hausarbeit schreiben", "Präsentation", "Wissenschaftlich arbeiten"] },
    { name: "Gesellschaft & Politik", description: "Demokratie, Wahlen, Gesetze", themeColor: "#8b5cf6", lessons: ["Demokratie verstehen", "Wahlen & Abstimmung", "Gesetze & Verordnungen", "Bürgerrechte", "Politik diskutieren"] },
    { name: "Gesundheit & Medizin", description: "Diagnose, Behandlung, Ernährung", themeColor: "#ef4444", lessons: ["Diagnose verstehen", "Behandlung & Therapie", "Impfungen & Vorsorge", "Ernährung & Gesundheit", "Mentale Gesundheit"] },
    { name: "Umwelt & Natur", description: "Klimawandel, Nachhaltigkeit, Natur", themeColor: "#14b8a6", lessons: ["Klimawandel verstehen", "Nachhaltigkeit", "Erneuerbare Energien", "Natur schützen", "Umwelt & Politik"] },
    { name: "Medien & Kommunikation", description: "Nachrichten, soziale Medien, Propaganda", themeColor: "#06b6d4", lessons: ["Nachrichten analysieren", "Soziale Medien", "Desinformation erkennen", "Medienkompetenz", "Journalismus"] },
    { name: "Reisen & Kultur", description: "Kulturen, Traditionen, Identität", themeColor: "#f59e0b", lessons: ["Kulturen verstehen", "Traditionen & Feste", "Identität & Herkunft", "Kulturelle Unterschiede", "Reise & Kultur"] },
    { name: "Emotionen & Psychologie", description: "Gefühle, Beziehungen, Psychologie", themeColor: "#ec4899", lessons: ["Gefühle verstehen", "Beziehungen stärken", "Psychologie des Lernens", "Stress bewältigen", "Selbstreflexion"] },
    { name: "Migration & Integration", description: "Integration, Diversität, Identität", themeColor: "#f97316", lessons: ["Integration verstehen", "Diversität & Kultur", "Identität & Zugehörigkeit", "Sprache & Kultur", "Teilhabe & Partizipation"] },
    { name: "Technologie & Innovation", description: "KI, Digitalisierung, Zukunft", themeColor: "#6366f1", lessons: ["Künstliche Intelligenz", "Digitalisierung", "Robotik & Automation", "Cloud & Daten", "Zukunftstechnologien"] },
  ],
  "course-b2": [
    { name: "Wissenschaft & Forschung", description: "Methoden, Studien, Publikationen", themeColor: "#22c55e", lessons: ["Forschungsmethoden", "Studien analysieren", "Wissenschaftlich publizieren", "Statistik & Analyse", "Ethik in der Forschung"] },
    { name: "Wirtschaft & Finanzen", description: "Inflation, Investitionen, Aktien", themeColor: "#3b82f6", lessons: ["Makroökonomie", "Finanzmärkte", "Investitionen", "Steuern & Finanzen", "Unternehmensstrategie"] },
    { name: "Recht & Gesellschaft", description: "Verfassung, Verträge, Gerichte", themeColor: "#8b5cf6", lessons: ["Verfassungsrecht", "Verträge & Vereinbarungen", "Gerichtsverfahren", "Strafrecht & Zivilrecht", "Rechtsphilosophie"] },
    { name: "Philosophie & Ethik", description: "Moral, Werte, Gerechtigkeit", themeColor: "#f59e0b", lessons: ["Moral & Ethik", "Gerechtigkeit", "Tugenden & Werte", "Philosophische Strömungen", "Ethik in der Praxis"] },
    { name: "Psychologie & Verhalten", description: "Kognition, Emotionen, Bias", themeColor: "#ec4899", lessons: ["Kognitive Psychologie", "Emotionen & Verhalten", "Bias & Wahrnehmung", "Motivation & Gewohnheiten", "Sozialpsychologie"] },
    { name: "Kunst & Literatur", description: "Literatur, Lyrik, Symbolik", themeColor: "#f97316", lessons: ["Literatur analysieren", "Lyrik & Metrik", "Symbolik & Allegorie", "Moderne Literatur", "Literatur & Gesellschaft"] },
    { name: "Internationale Beziehungen", description: "Diplomatie, UNO, Konflikte", themeColor: "#06b6d4", lessons: ["Diplomatie", "Internationale Organisationen", "Konflikte & Lösungen", "Geopolitik", "Friedenspolitik"] },
    { name: "Energie & Nachhaltigkeit", description: "Klimapolitik, Energiewende", themeColor: "#14b8a6", lessons: ["Klimapolitik", "Energiewende", "Nachhaltige Entwicklung", "Biodiversität", "Ressourcenschutz"] },
    { name: "Migration & Identität", description: "Kulturelle Identität, Integration", themeColor: "#dc2626", lessons: ["Migration & Globalisierung", "Kulturelle Identität", "Diaspora & Herkunft", "Integration & Teilhabe", "Multikulturalität"] },
    { name: "Digitalisierung & Gesellschaft", description: "KI, Robotik, Privatsphäre", themeColor: "#6366f1", lessons: ["Künstliche Intelligenz", "Robotik & Automation", "Privatsphäre & Überwachung", "Cloud & Daten", "Digitale Transformation"] },
  ],
  "course-c1": [
    { name: "Akademisches Deutsch", description: "Dissertation, Publikationen, Methodik", themeColor: "#22c55e", lessons: ["Wissenschaftlich schreiben", "Publikationen", "Dissertation & These", "Methodik & Analyse", "Zitation & Belege"] },
    { name: "Politik & Diplomatie", description: "Geopolitik, Außenpolitik, Resolutionen", themeColor: "#3b82f6", lessons: ["Geopolitik", "Außenpolitik", "Internationale Organisationen", "Diplomatie & Verhandlungen", "Friedenspolitik"] },
    { name: "Wirtschaft & Management", description: "Unternehmensstrategie, Governance", themeColor: "#8b5cf6", lessons: ["Unternehmensstrategie", "Governance & Transparenz", "Innovation & Disruption", "Nachhaltiges Management", "Globale Märkte"] },
    { name: "Kultur & Identität", description: "Globalisierung, Diaspora, Hybridität", themeColor: "#f59e0b", lessons: ["Globalisierung & Kultur", "Diaspora & Identität", "Hybridität & Akkulturation", "Kulturelle Praxis", "Kulturelle Differenz"] },
    { name: "Wissenschaft & Ethik", description: "Forschungsethik, Methodik, Integrität", themeColor: "#ef4444", lessons: ["Forschungsethik", "Methodik & Validität", "Wissenschaftliche Integrität", "Diskursanalyse", "Hermeneutik"] },
    { name: "Recht & Justiz", description: "Verfassungsrecht, Gewaltenteilung", themeColor: "#dc2626", lessons: ["Verfassungsrecht", "Rechtsprechung", "Gewaltenteilung", "Rechtsstaatlichkeit", "Rechtsphilosophie"] },
    { name: "Philosophie & Geisteswissenschaften", description: "Epistemologie, Ontologie, Ästhetik", themeColor: "#ec4899", lessons: ["Epistemologie & Ontologie", "Ästhetik & Hermeneutik", "Dialektik & Logik", "Erkenntnistheorie", "Sprachphilosophie"] },
    { name: "Umwelt & Klimapolitik", description: "Klimawissenschaft, Resilienz, Biodiversität", themeColor: "#14b8a6", lessons: ["Klimapolitik", "Klimawissenschaft", "Resilienz & Anpassung", "Biodiversität", "Klimagerechtigkeit"] },
    { name: "Technologie & Gesellschaft", description: "Technikfolgenabschätzung, Robotik, Privatsphäre", themeColor: "#6366f1", lessons: ["Technikfolgenabschätzung", "Robotik & KI", "Privatsphäre & Überwachung", "Cloud & Blockchain", "Digitale Transformation"] },
    { name: "Medien & Öffentlichkeit", description: "Medienkompetenz, Pressefreiheit, Desinformation", themeColor: "#06b6d4", lessons: ["Medienkompetenz", "Pressefreiheit & Zensur", "Desinformation erkennen", "Journalismus & Ethik", "Öffentlichkeit & Diskurs"] },
  ],
};

const achievements = [
  { name: "Erste Schritte", description: "Schließe deine erste Lektion ab", category: "lessons", requirement: 1, xpReward: 10 },
  { name: "Wörter-Sammler", description: "Lerne 50 Wörter", category: "vocabulary", requirement: 50, xpReward: 25 },
  { name: "Grammatik-Guru", description: "Schließe 10 Grammatikübungen ab", category: "grammar", requirement: 10, xpReward: 20 },
  { name: "Streng-König", description: "7 Tage in Folge lernen", category: "streak", requirement: 7, xpReward: 50 },
  { name: "Monats-Lerner", description: "30 Tage in Folge lernen", category: "streak", requirement: 30, xpReward: 200 },
  { name: "A1 Meister", description: "Schließe alle A1-Lektionen ab", category: "level", requirement: 1, xpReward: 100 },
  { name: "Perfektionist", description: "Erreiche 100% in 5 Lektionen", category: "perfect", requirement: 5, xpReward: 75 },
  { name: "Speed-Lerner", description: "Schließe eine Lektion unter 2 Minuten ab", category: "speed", requirement: 1, xpReward: 30 },
  { name: "Nachteule", description: "Lerne nach 22 Uhr", category: "special", requirement: 1, xpReward: 15 },
  { name: "Frühaufsteher", description: "Lerne vor 7 Uhr", category: "special", requirement: 1, xpReward: 15 },
  { name: "XP-Jäger", description: "Verdiene 1000 XP", category: "xp", requirement: 1000, xpReward: 100 },
  { name: "Vokabel-Held", description: "Lerne 200 Wörter", category: "vocabulary", requirement: 200, xpReward: 100 },
  { name: "Schreib-Meister", description: "Schließe 20 Schreibübungen ab", category: "writing", requirement: 20, xpReward: 50 },
  { name: "Hör-Profi", description: "Schließe 20 Hörverstehen ab", category: "listening", requirement: 20, xpReward: 50 },
  { name: "Soziale Biene", description: "Lade einen Freund ein", category: "social", requirement: 1, xpReward: 25 },
];

const vocabByLevel: Record<string, VocabEntry[]> = {
  A1: vocabularyA1 as VocabEntry[],
  A2: vocabularyA2 as VocabEntry[],
  B1: vocabularyB1 as VocabEntry[],
  B2: vocabularyB2 as VocabEntry[],
  C1: vocabularyC1 as VocabEntry[],
};

const exerciseTypes = [
  ExerciseType.MULTIPLE_CHOICE,
  ExerciseType.FILL_BLANK,
  ExerciseType.ARTICLE_TRAINING,
  ExerciseType.VERB_CONJUGATION,
  ExerciseType.SENTENCE_ORDER,
  ExerciseType.TRANSLATION,
];

function generateExercisesForLesson(lessonName: string, level: CEFRLevel, unitIdx: number, lessonIdx: number) {
  const vocabs = vocabByLevel[level] || [];
  const exercises = [];
  const startIdx = (unitIdx * 5 + lessonIdx) * 3;
  const selectedVocabs = vocabs.slice(startIdx, startIdx + 3);

  for (let i = 0; i < 10; i++) {
    const vocab = selectedVocabs[i % selectedVocabs.length] || vocabs[i % vocabs.length];
    if (!vocab) continue;

    const type = exerciseTypes[i % exerciseTypes.length];
    let question = "";
    let correctAnswer = "";

    switch (type) {
      case ExerciseType.MULTIPLE_CHOICE:
        question = `Was bedeutet "${vocab.word}"?`;
        correctAnswer = vocab.translationEn;
        break;
      case ExerciseType.FILL_BLANK:
        question = `Fülle die Lücke: "${vocab.exampleSentence?.replace(vocab.word, "______") || "Das ist ______."}"`;
        correctAnswer = vocab.word;
        break;
      case ExerciseType.ARTICLE_TRAINING:
        if (vocab.article) {
          question = `Welcher Artikel gehört zu "${vocab.word.replace(/^(der|die|das)\s+/, "")}"?`;
          correctAnswer = vocab.article;
        } else {
          question = `Was bedeutet "${vocab.word}"?`;
          correctAnswer = vocab.translationEn;
        }
        break;
      case ExerciseType.VERB_CONJUGATION:
        if (vocab.pos === "verb") {
          question = `Konjugiere "${vocab.word}" für "ich"`;
          correctAnswer = vocab.baseForm || vocab.word;
        } else {
          question = `Was bedeutet "${vocab.word}"?`;
          correctAnswer = vocab.translationEn;
        }
        break;
      case ExerciseType.SENTENCE_ORDER:
        question = `Ordne die Wörter: ${vocab.word} – ${vocab.translationEn}`;
        correctAnswer = vocab.word;
        break;
      case ExerciseType.TRANSLATION:
        question = `Übersetze: "${vocab.translationEn}"`;
        correctAnswer = vocab.word;
        break;
    }

    exercises.push({
      id: `ex-${unitIdx}-${lessonIdx}-${i}`,
      type,
      question,
      content: JSON.stringify({ vocabulary: vocab }),
      correctAnswer,
      xpValue: level === "A1" ? 5 : level === "A2" ? 7 : level === "B1" ? 10 : level === "B2" ? 12 : 15,
      difficulty: level === "A1" ? DifficultyLevel.EASY : level === "A2" ? DifficultyLevel.EASY : level === "B1" ? DifficultyLevel.MEDIUM : DifficultyLevel.HARD,
      order: i + 1,
    });
  }
  return exercises;
}

async function main() {
  console.log("=== WortHeld Master Seed ===");
  console.log("Starte Seed...\n");

  // 1. Courses
  console.log("📚 Erstelle Kurse...");
  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: { name: c.name, description: c.description, level: c.level, order: c.order },
      create: c,
    });
  }
  console.log(`  ✅ ${courses.length} Kurse erstellt`);

  // 2. Units, Lessons, Exercises
  let totalUnits = 0;
  let totalLessons = 0;
  let totalExercises = 0;

  for (const course of courses) {
    const units = unitsByCourse[course.id] || [];
    let requiredXp = 0;

    for (let uIdx = 0; uIdx < units.length; uIdx++) {
      const u = units[uIdx];
      const unitId = `unit-${course.id}-${uIdx}`;
      totalUnits++;

      await prisma.unit.upsert({
        where: { id: unitId },
        update: { name: u.name, description: u.description, order: uIdx + 1, themeColor: u.themeColor },
        create: { id: unitId, courseId: course.id, name: u.name, description: u.description, order: uIdx + 1, themeColor: u.themeColor },
      });

      for (let lIdx = 0; lIdx < u.lessons.length; lIdx++) {
        const lessonName = u.lessons[lIdx];
        const lessonId = `lesson-${course.id}-${uIdx}-${lIdx}`;
        totalLessons++;

        const lessonXp = 15 + uIdx * 5;
        await prisma.lesson.upsert({
          where: { id: lessonId },
          update: { name: lessonName, description: `${lessonName} – ${u.description}`, order: lIdx + 1, xpReward: lessonXp, requiredXp },
          create: {
            id: lessonId, unitId, name: lessonName,
            description: `${lessonName} – ${u.description}`,
            order: lIdx + 1, xpReward: lessonXp,
            isLocked: uIdx === 0 && lIdx === 0 ? false : true,
            isPublished: true,
            requiredXp,
            skillCategory: lIdx % 2 === 0 ? SkillCategory.WORTSCHATZ : SkillCategory.GRAMMATIK,
          },
        });

        const exercises = generateExercisesForLesson(lessonName, course.level, uIdx, lIdx);
        for (const ex of exercises) {
          await prisma.exercise.upsert({
            where: { id: ex.id },
            update: { question: ex.question, correctAnswer: ex.correctAnswer },
            create: { ...ex, lessonId },
          });
          totalExercises++;
        }

        requiredXp += lessonXp;
      }
    }
  }
  console.log(`  ✅ ${totalUnits} Units, ${totalLessons} Lektionen, ${totalExercises} Übungen erstellt`);

  // 3. Vocabulary
  console.log("📖 Erstelle Vokabeln...");
  let totalVocab = 0;
  for (const [level, vocabs] of Object.entries(vocabByLevel)) {
    for (const v of vocabs) {
      const id = `vocab-${level}-${v.word.replace(/\s+/g, "-").toLowerCase()}`;
      await prisma.vocabulary.upsert({
        where: { id },
        update: {},
        create: {
          id, word: v.word, article: v.article || null, pos: v.pos,
          level: level as CEFRLevel, baseForm: v.baseForm || null,
          translationEn: v.translationEn,
          translationTr: v.translationTr || null,
          translationAr: v.translationAr || null,
          translationRu: v.translationRu || null,
          translationPl: v.translationPl || null,
          translationRo: v.translationRo || null,
          translationUk: v.translationUk || null,
          translationSq: v.translationSq || null,
          translationKu: v.translationKu || null,
          translationIt: v.translationIt || null,
          exampleSentence: v.exampleSentence || null,
          exampleTranslation: v.exampleTranslation || null,
          reviewedByAdmin: true, isPublished: true,
        },
      });
      totalVocab++;
    }
  }
  console.log(`  ✅ ${totalVocab} Vokabeln erstellt`);

  // 4. Grammar Topics
  console.log("📐 Erstelle Grammatikthemen...");
  for (const rule of grammarRules) {
    await prisma.grammarTopic.upsert({
      where: { id: rule.id },
      update: { name: rule.name, description: rule.description, explanation: rule.explanation, examples: rule.examples },
      create: {
        id: rule.id, name: rule.name, description: rule.description,
        level: rule.level as CEFRLevel, explanation: rule.explanation,
        examples: rule.examples, tips: rule.tips || null, order: rule.order,
        reviewedByAdmin: true, isPublished: true,
      },
    });
  }
  console.log(`  ✅ ${grammarRules.length} Grammatikthemen erstellt`);

  // 5. Achievements
  console.log("🏆 Erstelle Errungenschaften...");
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: `ach-${a.name}` },
      update: { name: a.name, description: a.description, category: a.category, requirement: a.requirement, xpReward: a.xpReward },
      create: { id: `ach-${a.name}`, ...a },
    });
  }
  console.log(`  ✅ ${achievements.length} Errungenschaften erstellt`);

  // 6. Import Sources
  console.log("🔗 Erstelle Importquellen...");
  await prisma.aPIImportSource.upsert({ where: { id: "src-tatoeba" }, update: {}, create: { id: "src-tatoeba", name: "Tatoeba", url: "https://tatoeba.org/api" } });
  await prisma.aPIImportSource.upsert({ where: { id: "src-wiktionary" }, update: {}, create: { id: "src-wiktionary", name: "Wiktionary", url: "https://en.wiktionary.org/api" } });
  console.log("  ✅ Importquellen erstellt");

  // 7. DTZ Tests (4 skills × 2 levels = 8 tests)
  console.log("📝 Erstelle DTZ-Tests...");

  const dtzTests = [
    // A2 Level Tests
    {
      id: "dtz-a2-lesen",
      name: "DTZ A2 - Leseverstehen",
      level: CEFRLevel.A2,
      skill: SkillCategory.LESEN,
      timeLimit: 25,
      xpReward: 50,
      questions: JSON.stringify([
        { id: 0, text: "Was steht auf dem Zettel?", options: ["Der Laden ist geschlossen", "Wir öffnen morgen um 9 Uhr", "Heute haben wir frei", "Der Shop ist um 18 Uhr zu"], correctAnswer: "Der Laden ist um 18 Uhr zu", explanation: "Der Text sagt: 'Heute geöffnet bis 18 Uhr'" },
        { id: 1, text: "Wo arbeitet Thomas Müller?", options: ["In einer Bank", "In einem Restaurant", "In einem Hotel", "In einem Supermarkt"], correctAnswer: "In einem Restaurant", explanation: "Thomas ist Koch im Restaurant 'Zur goldenen Gans'" },
        { id: 2, text: "Wann ist die Bibliothek geschlossen?", options: ["Montags", "Dienstags", "Freitags", "Samstags"], correctAnswer: "Montags", explanation: "Öffnungszeiten: Di-Fr 10-18 Uhr" },
        { id: 3, text: "Was muss Frau Schmidt tun?", options: ["Einen Termin vereinbaren", "Das Formular ausfüllen", "Geld überweisen", "Ein Dokument einreichen"], correctAnswer: "Einen Termin vereinbaren", explanation: "Bitte vereinbaren Sie vorher einen Termin" },
        { id: 4, text: "Wie viel kostet die Fahrkarte?", options: ["8 Euro", "12 Euro", "15 Euro", "20 Euro"], correctAnswer: "12 Euro", explanation: "Einzelfahrkarte: 12 Euro" },
      ]),
    },
    {
      id: "dtz-a2-hoeren",
      name: "DTZ A2 - Hörverstehen",
      level: CEFRLevel.A2,
      skill: SkillCategory.HOEREN,
      timeLimit: 25,
      xpReward: 50,
      questions: JSON.stringify([
        { id: 0, text: "Was sagt der Arzt?", options: ["Sie müssen ins Krankenhaus", "Sie brauchen eine Pause", "Sie dürfen weiterarbeiten", "Sie müssen zum Facharzt"], correctAnswer: "Sie brauchen eine Pause", explanation: "Der Arzt empfiehlt eine einwöchige Pause" },
        { id: 1, text: "Wo wohnt Herr Becker jetzt?", options: ["In Berlin", "In München", "In Hamburg", "In Frankfurt"], correctAnswer: "In Hamburg", explanation: "Er ist nach Hamburg gezogen" },
        { id: 2, text: "Was bestellt die Frau?", options: ["Ein Steak", "Eine Pizza", "Ein Schnitzel", "Ein Currywurst"], correctAnswer: "Ein Schnitzel", explanation: "Ich nehme das Wiener Schnitzel" },
        { id: 3, text: "Um wie viel Uhr beginnt der Kurs?", options: ["18:00 Uhr", "19:00 Uhr", "20:00 Uhr", "21:00 Uhr"], correctAnswer: "19:00 Uhr", explanation: "Der Kurs startet um 19 Uhr" },
        { id: 4, text: "Was ist das Wetter heute?", options: ["Sonnig", "Regnerisch", "Schnee", "Stürmisch"], correctAnswer: "Regnerisch", explanation: "Heute regnet es den ganzen Tag" },
      ]),
    },
    {
      id: "dtz-a2-schreiben",
      name: "DTZ A2 - Schreiben",
      level: CEFRLevel.A2,
      skill: SkillCategory.SCHREIBEN,
      timeLimit: 25,
      xpReward: 50,
      questions: JSON.stringify([
        { id: 0, text: "Schreibe eine E-Mail an deinen Chef. Du bist krank.", options: ["Hallo Chef, ich komme nicht.", "Sehr geehrter Herr Müller, ich bin krank und bleibe zuhause.", "Lieber Chef, ich habe Fieber.", "Guten Tag, ich bin krank."], correctAnswer: "Sehr geehrter Herr Müller, ich bin krank und bleibe zuhause.", explanation: "Formelle Anrede und klare Information" },
        { id: 1, text: "Schreibe einen kurzen Text über deinen Tag.", options: ["Ich stehe auf. Ich esse. Ich arbeite.", "Mein Tag beginnt um 7 Uhr. Dann frühstücke ich und gehe zur Arbeit.", "Ich mache alles.", "Tag ist gut."], correctAnswer: "Mein Tag beginnt um 7 Uhr. Dann frühstücke ich und gehe zur Arbeit.", explanation: "Klare Abfolge mit Zeitangaben" },
        { id: 2, text: "Was möchtest du am Wochenende machen?", options: ["Ich gehe ins Kino.", "Am Wochenende möchte ich ins Kino gehen und Freunde treffen.", "Wochenende Kino.", "Ich mache Kino."], correctAnswer: "Am Wochenende möchte ich ins Kino gehen und Freunde treffen.", explanation: "Kompletter Satz mit Modalverb" },
        { id: 3, text: "Beschreibe deine Wohnung.", options: ["Ich habe eine Wohnung.", "Ich wohne in einer kleinen Wohnung mit einem Schlafzimmer.", "Wohnung ist klein.", "Meine Wohnung."], correctAnswer: "Ich wohne in einer kleinen Wohnung mit einem Schlafzimmer.", explanation: "Ausführliche Beschreibung" },
        { id: 4, text: "Schreibe über deine Hobbys.", options: ["Ich mache Sport.", "Meine Hobbys sind Fußball und Lesen. Ich spiele jeden Samstag Fußball.", "Hobbys sind gut.", "Sport und Bücher."], correctAnswer: "Meine Hobbys sind Fußball und Lesen. Ich spiele jeden Samstag Fußball.", explanation: "Mehrere Hobbys mit Details" },
      ]),
    },
    {
      id: "dtz-a2-sprechen",
      name: "DTZ A2 - Sprechen",
      level: CEFRLevel.A2,
      skill: SkillCategory.SPRECHEN,
      timeLimit: 25,
      xpReward: 50,
      questions: JSON.stringify([
        { id: 0, text: "Stelle dich vor.", options: ["Hallo.", "Ich heiße Maria Schmidt und komme aus Polen.", "Ich bin Maria.", "Polen."], correctAnswer: "Ich heiße Maria Schmidt und komme aus Polen.", explanation: "Vollständiger Satz mit Namen und Herkunft" },
        { id: 1, text: "Was machst du beruflich?", options: ["Ich arbeite.", "Ich bin Krankenschwester in einem Krankenhaus in Berlin.", "Krankenhaus.", "Arbeit gut."], correctAnswer: "Ich bin Krankenschwester in einem Krankenhaus in Berlin.", explanation: "Beruf und Arbeitsplatz genannt" },
        { id: 2, text: "Woher kommst du?", options: ["Ich komme aus Istanbul.", "Istanbul.", "Türkei.", "Asien."], correctAnswer: "Ich komme aus Istanbul.", explanation: "Kompletter Satz mit Stadt" },
        { id: 3, text: "Was machst du in deiner Freizeit?", options: ["Sport.", "In meiner Freizeit spiele ich Tennis und lese Bücher.", "Tennis.", "Ich mache Sport."], correctAnswer: "In meiner Freizeit spiele ich Tennis und lese Bücher.", explanation: "Mehrere Aktivitäten genannt" },
        { id: 4, text: "Beschreibe deine Familie.", options: ["Ich habe Familie.", "Ich habe einen Bruder und eine Schwester. Wir wohnen zusammen.", "Bruder, Schwester.", "Familie ist gut."], correctAnswer: "Ich habe einen Bruder und eine Schwester. Wir wohnen zusammen.", explanation: "Familienmitglieder beschrieben" },
      ]),
    },
    // B1 Level Tests
    {
      id: "dtz-b1-lesen",
      name: "DTZ B1 - Leseverstehen",
      level: CEFRLevel.B1,
      skill: SkillCategory.LESEN,
      timeLimit: 25,
      xpReward: 75,
      questions: JSON.stringify([
        { id: 0, text: "Was ist das Hauptproblem im Text?", options: ["Mangel an Fachkräften", "Zu hohe Gehälter", "Schlechte Arbeitsbedingungen", "Fehlende Weiterbildung"], correctAnswer: "Mangel an Fachkräften", explanation: "Der Text beschreibt den Fachkräftemangel" },
        { id: 1, text: "Welche Lösung wird vorgeschlagen?", options: ["Mehr Steuern", "Bildung fördern", "Arbeitszeiten verkürzen", "Gehälter senken"], correctAnswer: "Bildung fördern", explanation: "Investition in Bildung wird empfohlen" },
        { id: 2, text: "Was bedeutet 'nachhaltig' in diesem Kontext?", options: ["Umweltfreundlich", "Langfristig tragfähig", "Billig", "Schnell"], correctAnswer: "Langfristig tragfähig", explanation: "Nachhaltig = langfristig stabil" },
        { id: 3, text: "Wie sieht die Zukunft aus?", options: ["Negativ", "Positiv mit Herausforderungen", "Unverändert", "Ganz negativ"], correctAnswer: "Positiv mit Herausforderungen", explanation: "Optimistisch aber realistisch" },
        { id: 4, text: "Was ist die Hauptbotschaft?", options: ["Alles wird gut", "Wir müssen handeln", "Nichts ändern", "Abwarten"], correctAnswer: "Wir müssen handeln", explanation: "Aktiv werden statt warten" },
      ]),
    },
    {
      id: "dtz-b1-hoeren",
      name: "DTZ B1 - Hörverstehen",
      level: CEFRLevel.B1,
      skill: SkillCategory.HOEREN,
      timeLimit: 25,
      xpReward: 75,
      questions: JSON.stringify([
        { id: 0, text: "Was besprechen die Kollegen?", options: ["Ein neues Projekt", "Urlaubsplanung", "Gehaltsverhandlung", "Kündigung"], correctAnswer: "Ein neues Projekt", explanation: "Projektstart wird geplant" },
        { id: 1, text: "Welches Problem gibt es?", options: ["Zeitdruck", "Mangel an Personal", "Fehlendes Budget", "Technische Probleme"], correctAnswer: "Zeitdruck", explanation: "Deadline ist sehr nah" },
        { id: 2, text: "Was wird entschieden?", options: ["Projekt absagen", "Mehr Zeit nehmen", "Ressourcen erhöhen", "Team vergrößern"], correctAnswer: "Ressourcen erhöhen", explanation: "Mehr Budget bewilligt" },
        { id: 3, text: "Wer ist verantwortlich?", options: ["Herr Müller", "Frau Schmidt", "Der Projektleiter", "Das ganze Team"], correctAnswer: "Der Projektleiter", explanation: "Herr Weber ist Projektleiter" },
        { id: 4, text: "Was ist das Ergebnis?", options: ["Erfolg", "Misserfolg", "Unentschieden", "Noch offen"], correctAnswer: "Erfolg", explanation: "Projekt war erfolgreich" },
      ]),
    },
    {
      id: "dtz-b1-schreiben",
      name: "DTZ B1 - Schreiben",
      level: CEFRLevel.B1,
      skill: SkillCategory.SCHREIBEN,
      timeLimit: 25,
      xpReward: 75,
      questions: JSON.stringify([
        { id: 0, text: "Schreibe eine formelle E-Mail mit Beschwerde.", options: ["Hallo, das ist schlecht.", "Sehr geehrte Damen und Herren, leider muss ich mich beschweren.", "Liebe Leute, ich bin sauer.", "Guten Tag, Problem."], correctAnswer: "Sehr geehrte Damen und Herren, leider muss ich mich beschweren.", explanation: "Formelle Anrede und höflicher Ton" },
        { id: 1, text: "Erkläre ein Problem und schlage eine Lösung vor.", options: ["Problem: Zu wenig Zeit. Lösung: Mehr arbeiten.", "Das Problem ist der Zeitdruck. Ich schlage vor, die Aufgaben besser zu planen.", "Zu wenig Zeit.", "Problem."], correctAnswer: "Das Problem ist der Zeitdruck. Ich schlage vor, die Aufgaben besser zu planen.", explanation: "Klare Problembeschreibung mit Lösung" },
        { id: 2, text: "Schreibe eine Meinung zu einem Thema.", options: ["Ich finde das gut.", "Ich bin der Meinung, dass Digitalisierung wichtig ist.", "Gut oder schlecht.", "Meinung: Digitalisierung."], correctAnswer: "Ich bin der Meinung, dass Digitalisierung wichtig ist.", explanation: "Klare Meinungsäußerung mit Begründung" },
        { id: 3, text: "Vergleiche zwei Optionen.", options: ["Option A ist besser.", "Option A ist günstiger, aber Option B ist qualitativ besser.", "A oder B?", "Keine Ahnung."], correctAnswer: "Option A ist günstiger, aber Option B ist qualitativ besser.", explanation: "Ausgewogener Vergleich mit Vor- und Nachteilen" },
        { id: 4, text: "Beschreibe einen Prozess.", options: ["Zuerst das, dann das.", "Zuerst werden die Daten gesammelt, dann analysiert und schließlich wird ein Bericht erstellt.", "Prozess: sammeln, analysieren.", "Daten."], correctAnswer: "Zuerst werden die Daten gesammelt, dann analysiert und schließlich wird ein Bericht erstellt.", explanation: "Klare Abfolge mit Zeitangaben" },
      ]),
    },
    {
      id: "dtz-b1-sprechen",
      name: "DTZ B1 - Sprechen",
      level: CEFRLevel.B1,
      skill: SkillCategory.SPRECHEN,
      timeLimit: 25,
      xpReward: 75,
      questions: JSON.stringify([
        { id: 0, text: "Erzähle von deinen Plänen für die Zukunft.", options: ["Ich will arbeiten.", "In fünf Jahren möchte ich eine eigene Firma gründen und international arbeiten.", "Zukunft: Firma.", "Pläne: Arbeiten."], correctAnswer: "In fünf Jahren möchte ich eine eigene Firma gründen und international arbeiten.", explanation: "Konkrete Zukunftsplanung mit Details" },
        { id: 1, text: "Beschreibe eine Herausforderung und wie du sie gelöst hast.", options: ["Problem war schwer. Ich habe es gelöst.", "Eine Herausforderung war der Sprachkurs. Ich habe jeden Tag geübt und jetzt spreche ich gut Deutsch.", "Schwer.", "Gelöst."], correctAnswer: "Eine Herausforderung war der Sprachkurs. Ich habe jeden Tag geübt und jetzt spreche ich gut Deutsch.", explanation: "Problem und Lösung beschrieben" },
        { id: 2, text: "Vergleiche zwei Städte.", options: ["Berlin ist besser als München.", "Berlin ist größer und lebendiger, München ist traditioneller und ruhiger.", "Berlin oder München?", "Keine Ahnung."], correctAnswer: "Berlin ist größer und lebendiger, München ist traditioneller und ruhiger.", explanation: "Ausgewogener Vergleich mit Adjektiven" },
        { id: 3, text: "Erkläre ein Thema aus deinem Beruf.", options: ["Ich bin Lehrer.", "Als Lehrer erkläre ich Schülern komplexe Themen einfach und verständlich.", "Lehren.", "Schule."], correctAnswer: "Als Lehrer erkläre ich Schülern komplexe Themen einfach und verständlich.", explanation: "Berufstätigkeit erklärt" },
        { id: 4, text: "Äußere eine Meinung und begründe sie.", options: ["Ich finde das gut.", "Ich bin dafür, weil es die Umwelt schützt und langfristig Geld spart.", "Gut.", "Umwelt."], correctAnswer: "Ich bin dafür, weil es die Umwelt schützt und langfristig Geld spart.", explanation: "Meinung mit zwei Gründen" },
      ]),
    },
  ];

  for (const test of dtzTests) {
    await prisma.dTZTest.upsert({
      where: { id: test.id },
      update: { name: test.name, level: test.level, skill: test.skill, questions: test.questions },
       create: { ...test, isActive: true, order: dtzTests.indexOf(test) },
    });
  }
  console.log(`  ✅ ${dtzTests.length} DTZ-Tests erstellt`);

  console.log("\n=== Seed abgeschlossen! ===");
  console.log(`Gesamt: ${courses.length} Kurse, ${totalUnits} Units, ${totalLessons} Lektionen, ${totalVocab} Vokabeln, ${grammarRules.length} Grammatikthemen, ${totalExercises} Übungen, ${achievements.length} Errungenschaften, ${dtzTests.length} DTZ-Tests`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
