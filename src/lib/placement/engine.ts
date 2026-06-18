import { CEFRLevel } from "@prisma/client";
import { CEFR_STANDARDS } from "../curriculum/standards";

export type PlacementAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  level: CEFRLevel;
  skill: "VOCABULARY" | "GRAMMAR" | "READING" | "LISTENING";
};

export type PlacementResult = {
  recommendedLevel: CEFRLevel;
  scorePercentage: number;
  strengths: CEFRLevel[];
  weaknesses: CEFRLevel[];
  confidence: number; // 0 to 1
};

/**
 * Production-grade scoring engine for the German Placement Test.
 * Analyzes answers across different levels to find the "ceiling" of the learner's knowledge.
 */
export function calculatePlacementLevel(answers: PlacementAnswer[]): PlacementResult {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];
  const results: Record<CEFRLevel, { correct: number; total: number }> = {
    A1: { correct: 0, total: 0 },
    A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 },
    B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 },
  };

  // 1. Aggregate scores per level
  answers.forEach((ans) => {
    results[ans.level].correct += ans.isCorrect ? 1 : 0;
    results[ans.level].total += 1;
  });

  // 2. Find the highest level where the user scored above a threshold (e.g., 60%)
  let recommendedLevel: CEFRLevel = "A1";
  let maxScore = 0;

  for (const level of levels) {
    const res = results[level];
    if (res.total > 0) {
      const score = res.correct / res.total;
      if (score >= 0.6) {
        recommendedLevel = level;
      }
    }
  }

  // 3. Analyze strengths and weaknesses
  const strengths: CEFRLevel[] = [];
  const weaknesses: CEFRLevel[] = [];

  levels.forEach((level) => {
    const res = results[level];
    if (res.total === 0) return;
    
    const score = res.correct / res.total;
    if (score >= 0.8) strengths.push(level);
    if (score < 0.4) weaknesses.push(level);
  });

  // 4. Calculate overall confidence based on the stability of the result
  // If they fail A1 but pass B2, confidence is low.
  const successRate = answers.filter(a => a.isCorrect).length / answers.length;

  return {
    recommendedLevel,
    scorePercentage: Math.round(successRate * 100),
    strengths,
    weaknesses,
    confidence: successRate,
  };
}

/**
 * Generates a personalized learning plan based on placement results.
 */
export function generateLearningPlan(result: PlacementResult) {
  const { recommendedLevel, weaknesses } = result;
  
  const plan = {
    startLevel: recommendedLevel,
    focusAreas: weaknesses.length > 0 
      ? `Focus on reinforcing ${weaknesses.join(", ")} fundamentals.` 
      : `Proceed directly to ${recommendedLevel} modules.`,
    durationOptions: {
      intensive: "4 weeks (10h/week)",
      standard: "8 weeks (5h/week)",
      relaxed: "12 weeks (2h/week)",
    },
    milestones: CEFR_STANDARDS[recommendedLevel].canDoStatements.slice(0, 3).map(s => s.statement),
  };

  return plan;
}
