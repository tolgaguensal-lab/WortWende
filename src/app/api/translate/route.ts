import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { translateText, translateBatch, detectLanguage, getSupportedLanguages } from "@/lib/translation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  try {
    const { text, texts, sourceLang, targetLang } = await req.json();

    if (texts && Array.isArray(texts)) {
      const results = await translateBatch(texts, sourceLang ?? "de", targetLang ?? "en");
      return NextResponse.json({ results });
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text ist erforderlich" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "Text zu lang (max. 5000 Zeichen)" }, { status: 413 });
    }

    const translated = await translateText(text, sourceLang ?? "de", targetLang ?? "en");
    return NextResponse.json({ translatedText: translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Übersetzung fehlgeschlagen" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "languages") {
    const languages = await getSupportedLanguages();
    return NextResponse.json({ languages });
  }

  if (action === "detect") {
    const text = searchParams.get("text");
    if (!text) {
      return NextResponse.json({ error: "Text erforderlich" }, { status: 400 });
    }
    const lang = await detectLanguage(text);
    return NextResponse.json({ language: lang });
  }

  return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
}
