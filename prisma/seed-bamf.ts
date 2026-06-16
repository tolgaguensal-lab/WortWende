import { PrismaClient, LifeSituationCategory, ProviderType, LessonStepType, CEFRLevel } from "@prisma/client";

const prisma = new PrismaClient();

const lifeSituations = [
  { id: "ls-amt", name: "Amt & Behörde", description: "Formulare ausfüllen, Termine bei Ämtern, Briefe von Behörden verstehen", category: LifeSituationCategory.BEHOERDEN, iconUrl: "/icons/amt.svg", order: 1 },
  { id: "ls-arzt", name: "Arzt & Gesundheit", description: "Termin vereinbaren, Symptome beschreiben, Rezepte verstehen", category: LifeSituationCategory.GESUNDHEIT, iconUrl: "/icons/arzt.svg", order: 2 },
  { id: "ls-arbeit", name: "Arbeit & Beruf", description: "Bewerbung, Vorstellungsgespräch, Arbeitsvertrag, Kollegen", category: LifeSituationCategory.ARBEIT, iconUrl: "/icons/arbeit.svg", order: 3 },
  { id: "ls-schule", name: "Schule & Bildung", description: "Anmeldung, Gespräche mit Lehrern, Zeugnisse", category: LifeSituationCategory.BILDUNG, iconUrl: "/icons/schule.svg", order: 4 },
  { id: "ls-kita", name: "Kita & Familie", description: "Kita-Anmeldung, Elterngespräche, Betreuungsgeld", category: LifeSituationCategory.KINDER, iconUrl: "/icons/kita.svg", order: 5 },
  { id: "ls-wohnen", name: "Wohnen & Umzug", description: "Wohnungssuche, Mietvertrag, Nebenkosten, Umzug", category: LifeSituationCategory.WOHNEN, iconUrl: "/icons/wohnen.svg", order: 6 },
  { id: "ls-einkaufen", name: "Einkaufen", description: "Supermarkt, Kleidung, Online-Shopping, Reklamation", category: LifeSituationCategory.EINKAUFEN, iconUrl: "/icons/einkaufen.svg", order: 7 },
  { id: "ls-verkehr", name: "Verkehr & Mobilität", description: "Bus & Bahn, Fahrplan, Ticket kaufen, Führerschein", category: LifeSituationCategory.VERKEHR, iconUrl: "/icons/verkehr.svg", order: 8 },
  { id: "ls-bank", name: "Bank & Finanzen", description: "Konto eröffnen, Überweisung, Kredit, Versicherung", category: LifeSituationCategory.BANK, iconUrl: "/icons/bank.svg", order: 9 },
  { id: "ls-versicherung", name: "Versicherung", description: "Krankenversicherung, Haftpflicht, Schadensmeldung", category: LifeSituationCategory.VERSICHERUNG, iconUrl: "/icons/versicherung.svg", order: 10 },
];

/**
 * Generate 12 LessonSteps for a lesson based on its level and name.
 * Each lesson gets: WORTSCHATZ × 2, GRAMMATIK, HOEREN, LESEN × 2, SCHREIBEN, SPRECHEN, MINI_GAME, TEST, WIEDERHOLUNG
 */
function generateLessonSteps(lessonId: string, lessonName: string, level: CEFRLevel, unitIdx: number) {
  const steps = [
    { stepType: LessonStepType.WORTSCHATZ, title: `Wichtige Wörter: ${lessonName}`,
      content: JSON.stringify([
        { word: level === "A1" ? "der Termin" : level === "A2" ? "die Bewerbung" : level === "B1" ? "die Voraussetzung" : "die Qualifikation",
          translation: level === "A1" ? "appointment" : level === "A2" ? "application" : level === "B1" ? "requirement" : "qualification" },
        { word: level === "A1" ? "der Arzt" : level === "A2" ? "das Gespräch" : level === "B1" ? "die Erfahrung" : "die Kompetenz",
          translation: level === "A1" ? "doctor" : level === "A2" ? "conversation" : level === "B1" ? "experience" : "competence" },
      ]), order: 1, xpReward: 10 },
    { stepType: LessonStepType.WORTSCHATZ, title: "Weitere Vokabeln", content: JSON.stringify([]), order: 2, xpReward: 10 },
    { stepType: LessonStepType.GRAMMATIK, title: "Grammatik verstehen",
      content: JSON.stringify([{
        rule: level === "A1" ? "Bestimmter Artikel" : level === "A2" ? "Präteritum" : level === "B1" ? "Nebensätze" : level === "B2" ? "Passiv" : "Konjunktiv II",
        explanation: `Diese Grammatikregel ist wichtig für das Niveau ${level}.`,
        examples: ["Beispiel 1", "Beispiel 2"],
      }]), order: 3, xpReward: 15 },
    { stepType: LessonStepType.GRAMMATIK, title: "Grammatik üben", content: JSON.stringify([]), order: 4, xpReward: 15 },
    { stepType: LessonStepType.HOEREN, title: "Hörverstehen", content: JSON.stringify({ text: "Hörtext wird vorbereitet...", questions: [] }), order: 5, xpReward: 15 },
    { stepType: LessonStepType.LESEN, title: "Text lesen", content: JSON.stringify([{ text: `Lesetext zum Thema "${lessonName}" wird vorbereitet...`, questions: [{ q: "Was ist das Hauptthema?", a: lessonName }] }]), order: 6, xpReward: 15 },
    { stepType: LessonStepType.LESEN, title: "Text verstehen", content: JSON.stringify([]), order: 7, xpReward: 15 },
    { stepType: LessonStepType.SCHREIBEN, title: "Schreibübung", content: JSON.stringify([{ prompt: `Schreibe einen kurzen Text zum Thema "${lessonName}".`, hints: ["Schreibe 3-5 Sätze"], minWords: 30 }]), order: 8, xpReward: 20 },
    { stepType: LessonStepType.SPRECHEN, title: "Sprechübung", content: JSON.stringify({ prompt: "Spreche über das Thema.", tips: ["Nimm dich auf und hör zu"] }), order: 9, xpReward: 20 },
    { stepType: LessonStepType.MINI_GAME, title: "Mini-Spiel: Vokabeln zuordnen", content: JSON.stringify({ type: "match", pairs: [] }), order: 10, xpReward: 10 },
    { stepType: LessonStepType.TEST, title: "Lektions-Test", content: JSON.stringify([
      { question: `Was hast du zum Thema "${lessonName}" gelernt?`, options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 },
      { question: "Welches Wort passt?", options: ["Wort 1", "Wort 2", "Wort 3", "Wort 4"], correct: 1 },
    ]), order: 11, xpReward: 25 },
    { stepType: LessonStepType.WIEDERHOLUNG, title: "Wiederholung", content: JSON.stringify([
      { question: "Welche Vokabeln waren neu?", answer: "Alle Vokabeln dieser Lektion" },
      { question: "Welche Grammatik hast du gelernt?", answer: "Die Grammatikregel aus dieser Lektion" },
    ]), order: 12, xpReward: 10 },
  ];
  return steps;
}

async function main() {
  console.log("\n=== BAMF-Ergänzungs-Seed ===");

  // 1. Life Situations
  console.log("🏛️  Erstelle Lebenssituationen...");
  for (const ls of lifeSituations) {
    await prisma.lifeSituation.upsert({
      where: { id: ls.id },
      update: { name: ls.name, description: ls.description, category: ls.category, iconUrl: ls.iconUrl, order: ls.order },
      create: ls,
    });
  }
  console.log(`  ✅ ${lifeSituations.length} Lebenssituationen`);

  // 2. TranslationProvider
  console.log("🌐 Erstelle Übersetzungsanbieter...");
  await prisma.translationProvider.upsert({
    where: { id: "provider-libretranslate" },
    update: { isActive: true },
    create: {
      id: "provider-libretranslate",
      name: "LibreTranslate",
      type: ProviderType.LIBRETRANSLATE,
      endpoint: process.env.LIBRETRANSLATE_URL || "http://localhost:5001",
      isActive: true,
    },
  });
  await prisma.translationProvider.upsert({
    where: { id: "provider-mock" },
    update: { isActive: false },
    create: {
      id: "provider-mock",
      name: "Mock-Übersetzungen (Offline)",
      type: ProviderType.MOCK,
      isActive: false,
    },
  });
  console.log("  ✅ Übersetzungsanbieter");

  // 3. PlacementTest
  console.log("📝 Erstelle Einstufungstest...");
  await prisma.placementTest.upsert({
    where: { id: "placement-default" },
    update: {},
    create: {
      id: "placement-default",
      title: "Einstufungstest A1-C1",
      description: "20 Fragen zu Grammatik, Wortschatz und Leseverstehen. Dauer: ca. 10 Minuten.",
      cefrLevel: CEFRLevel.C1,
      questions: JSON.stringify([]),
    },
  });
  console.log("  ✅ Einstufungstest");

  // 4. LessonSteps for first few lessons (A1 demo)
  console.log("📋 Erstelle LessonSteps für Beispiel-Lektionen...");
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    take: 5,
    orderBy: { createdAt: "asc" },
  });

  let stepCount = 0;
  for (const lesson of lessons) {
    const unit = await prisma.unit.findUnique({ where: { id: lesson.unitId } });
    const unitIdx = unit?.order ?? 0;
    const steps = generateLessonSteps(lesson.id, lesson.name, lesson.skillCategory ? CEFRLevel.A1 : CEFRLevel.A1, unitIdx - 1);
    for (const step of steps) {
      const stepId = `step-${lesson.id}-${step.order}`;
      await prisma.lessonStep.upsert({
        where: { id: stepId },
        update: { title: step.title, content: step.content, stepType: step.stepType, xpReward: step.xpReward },
        create: {
          id: stepId,
          lessonId: lesson.id,
          stepType: step.stepType,
          title: step.title,
          content: step.content,
          order: step.order,
          xpReward: step.xpReward,
        },
      });
      stepCount++;
    }
  }
  console.log(`  ✅ ${stepCount} LessonSteps für ${lessons.length} Lektionen`);

  // 5. Link life situations to lessons
  console.log("🔗 Verknüpfe Lebenssituationen mit Lektionen...");
  const allLessons = await prisma.lesson.findMany({ take: 50, orderBy: { createdAt: "asc" } });
  for (let i = 0; i < allLessons.length; i++) {
    const lsId = lifeSituations[i % lifeSituations.length].id;
    await prisma.lesson.update({
      where: { id: allLessons[i].id },
      data: { lifeSituationId: lsId },
    });
  }
  console.log(`  ✅ ${allLessons.length} Lektionen verknüpft`);

  console.log("\n=== BAMF-Seed abgeschlossen! ===");
}

main().catch(console.error).finally(() => prisma.$disconnect());
