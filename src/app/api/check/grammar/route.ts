import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const { text } = await req.json();
  const url = `${process.env.LANGUAGE_TOOL_API_URL ?? "https://api.languagetool.org"}/v2/check`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `text=${encodeURIComponent(text)}&language=de-DE`,
    });
    if (!res.ok) return NextResponse.json({ matches: [] });
    const data = await res.json();
    return NextResponse.json({
      matches: (data?.matches ?? []).map((m: any) => ({
        message: m.message,
        offset: m.offset,
        length: m.length,
        suggestions: (m.replacements ?? []).slice(0, 3).map((r: any) => r.value),
        rule: m.rule?.id,
      })),
    });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}
