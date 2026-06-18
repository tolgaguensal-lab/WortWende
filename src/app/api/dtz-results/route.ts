import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { testId, answers, timeSpent } = body;

    if (!testId || !answers || timeSpent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const test = await prisma.dTZTest.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const questions = JSON.parse(test.questions);
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 60;

    const feedback = questions.map((q: any, i: number) => ({
      questionId: i,
      userAnswer: answers[i]?.answer,
      isCorrect: answers[i]?.isCorrect,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    const result = await prisma.dTZTestResult.create({
      data: {
        userId: session.user.id,
        testId,
        score,
        passed,
        timeSpent,
        feedback: JSON.stringify(feedback),
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions,
        feedback,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    const where: any = { userId: session.user.id };
    if (testId) where.testId = testId;

    const results = await prisma.dTZTestResult.findMany({
      where,
      include: { test: true },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
