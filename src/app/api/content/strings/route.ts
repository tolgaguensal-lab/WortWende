import { NextResponse } from "next/server";
import { getAllContent } from "@/lib/content";

/**
 * GET /api/content/strings
 * Liefert alle deutschen UI-Texte als JSON.
 * UTF-8-safe – keine Encoding-Korruption möglich.
 *
 * Cache: 1 Stunde (CDN-freundlich)
 */
export async function GET() {
  const content = getAllContent();
  return NextResponse.json(content, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
