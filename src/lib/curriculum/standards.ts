import { CEFRLevel } from "@prisma/client";

export type CanDoStatement = {
  id: string;
  statement: string;
  skill: "LESEN" | "HOEREN" | "SCHREIBEN" | "SPRECHEN" | "GRAMMATIK" | "WORTSCHATZ";
};

export type LevelStandard = {
  level: CEFRLevel;
  description: string;
  overallGoal: string;
  canDoStatements: CanDoStatement[];
  targetVocabularyCount: number;
};

export const CEFR_STANDARDS: Record<CEFRLevel, LevelStandard> = {
  A1: {
    level: "A1",
    description: "Breakthrough / Anfänger",
    overallGoal: "Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type.",
    canDoStatements: [
      { id: "A1_S1", statement: "Kann einfache persönliche Informationen geben (Name, Wohnort, Beruf).", skill: "SPRECHEN" },
      { id: "A1_S2", statement: "Kann einfache Fragen stellen und beantworten (Wo wohnst du? Wie alt bist du?).", skill: "SPRECHEN" },
      { id: "A1_S3", statement: "Kann kurze, einfache Texte lesen und verstehen (Schilder, Kataloge).", skill: "LESEN" },
      { id: "A1_S4", statement: "Kann kurze formlose Nachrichten schreiben (SMS, E-Mail).", skill: "SCHREIBEN" },
      { id: "A1_S5", statement: "Versteht langsam gesprochene, einfache Sätze in Alltagssituationen.", skill: "HOEREN" },
      { id: "A1_S6", statement: "Kann die Artikel der, die, das in einfachen Kontexten korrekt verwenden.", skill: "GRAMMATIK" },
    ],
    targetVocabularyCount: 500,
  },
  A2: {
    level: "A2",
    description: "Waystage / Grundlegende Kenntnisse",
    overallGoal: "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters.",
    canDoStatements: [
      { id: "A2_S1", statement: "Kann einfache Gespräche über Gesundheit und Arzttermine führen.", skill: "SPRECHEN" },
      { id: "A2_S2", statement: "Kann kurze Alltagstexte (Briefe, Anzeigen) verstehen.", skill: "LESEN" },
      { id: "A2_S3", statement: "Kann einfache Beschreibungen über die eigene Familie und das Arbeitsumfeld schreiben.", skill: "SCHREIBEN" },
      { id: "A2_S4", statement: "Versteht die Hauptpunkte in kurzen, klaren Mitteilungen.", skill: "HOEREN" },
      { id: "A2_S5", statement: "Kann das Perfekt zur Beschreibung vergangener Ereignisse nutzen.", skill: "GRAMMATIK" },
    ],
    targetVocabularyCount: 1000,
  },
  B1: {
    level: "B1",
    description: "Threshold / Fortgeschrittene Sprachverwendung",
    overallGoal: "Can maintain a conversation and deal with most situations likely to arise while travelling in an area where the language is spoken.",
    canDoStatements: [
      { id: "B1_S1", statement: "Kann an Diskussionen teilnehmen und die eigene Meinung begründen.", skill: "SPRECHEN" },
      { id: "B1_S2", statement: "Kann längere Texte zu vertrauten Themen verstehen.", skill: "LESEN" },
      { id: "B1_S3", statement: "Kann zusammenhängende Texte über Themen von persönlichem Interesse schreiben.", skill: "SCHREIBEN" },
      { id: "B1_S4", statement: "Versteht die Hauptpunkte eines Radio- oder Fernsehprogramms zu vertrauten Themen.", skill: "HOEREN" },
      { id: "B1_S5", statement: "Kann Nebensätze (weil, dass, obwohl) korrekt anwenden.", skill: "GRAMMATIK" },
    ],
    targetVocabularyCount: 2000,
  },
  B2: {
    level: "B2",
    description: "Vantage / Selbstständige Sprachverwendung",
    overallGoal: "Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.",
    canDoStatements: [
      { id: "B2_S1", statement: "Kann komplexe Diskussionen führen und detaillierte Argumente vorbringen.", skill: "SPRECHEN" },
      { id: "B2_S2", statement: "Kann anspruchsvollere Fachtexte und Berichte verstehen.", skill: "LESEN" },
      { id: "B2_S3", statement: "Kann detaillierte Texte zu einer Vielzahl von Themen schreiben.", skill: "SCHREIBEN" },
      { id: "B2_S4", statement: "Versteht Standard-Sprache komplexer Inhalte in beruflichem Kontext.", skill: "HOEREN" },
      { id: "B2_S5", statement: "Kann Passivformen und Nominalisierung sicher verwenden.", skill: "GRAMMATIK" },
    ],
    targetVocabularyCount: 4000,
  },
  C1: {
    level: "C1",
    description: "Effective Operational Proficiency / Kompetente Sprachverwendung",
    overallGoal: "Can understand a wide range of demanding, longer texts, and recognize implicit meaning.",
    canDoStatements: [
      { id: "C1_S1", statement: "Kann sich spontan und fließend ausdrücken, ohne öfter nach Worten suchen zu müssen.", skill: "SPRECHEN" },
      { id: "C1_S2", statement: "Kann komplexe, längere Texte, auch solche mit impliziten Bedeutungen, verstehen.", skill: "LESEN" },
      { id: "C1_S3", statement: "Kann gut strukturierte Texte über komplexe Themen schreiben.", skill: "SCHREIBEN" },
      { id: "C1_S4", statement: "Versteht anspruchsvolle Radio- und Fernsehsendungen ohne große Anstrengung.", skill: "HOEREN" },
      { id: "C1_S5", statement: "Beherrscht Stilregister und differenzierte Ausdrucksweisen.", skill: "GRAMMATIK" },
    ],
    targetVocabularyCount: 8000,
  },
};
