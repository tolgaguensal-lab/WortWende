import de from "@/content/de.json";

type ContentKey = keyof typeof de;

/**
 * Holt einen deutschen UI-String aus der zentralen JSON-Content-Datei.
 * JSON ist immer UTF-8 → keine Encoding-Korruption mehr.
 *
 * @param key - Der Content-Key (z.B. "landing.hero.title")
 * @param fallback - Fallback-Text falls Key nicht existiert
 */
export function t(key: ContentKey, fallback?: string): string {
  return (de as Record<string, string>)[key] || fallback || key;
}

/**
 * Alle Content-Strings als flaches Objekt (für serverseitige Nutzung)
 */
export function getAllContent(): Record<string, string> {
  return de as Record<string, string>;
}
