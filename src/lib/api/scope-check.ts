/**
 * Prüft, ob ein API-Key den benötigten Scope hat.
 * Scopes werden komma-getrennt gespeichert: "read:vocabulary,read:grammar,write:progress"
 * Admin-Scope überschreibt alle anderen.
 */
export function hasScope(keyScopes: string, requiredScope: string): boolean {
  const scopes = keyScopes.split(",").map((s) => s.trim());

  // Admin darf alles
  if (scopes.includes("admin")) return true;

  // Exakter Scope-Check
  if (scopes.includes(requiredScope)) return true;

  // Wildcard: "read" erlaubt "read:vocabulary", "read:grammar", etc.
  const [category] = requiredScope.split(":");
  if (category && scopes.includes(category)) return true;

  return false;
}
