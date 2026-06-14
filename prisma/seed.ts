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

  console.log("\n=== Seed abgeschlossen! ===");
  console.log(`Gesamt: ${courses.length} Kurse, ${totalUnits} Units, ${totalLessons} Lektionen, ${totalVocab} Vokabeln, ${grammarRules.length} Grammatikthemen, ${totalExercises} Übungen, ${achievements.length} Errungenschaften`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
