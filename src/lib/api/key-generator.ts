import crypto from "crypto";

const KEY_PREFIX = "wh_live";

export function generateApiKey(): { fullKey: string; prefix: string; hash: string } {
  const randomBytes = crypto.randomBytes(20);
  const hex = randomBytes.toString("hex");
  const fullKey = `${KEY_PREFIX}_${hex}`;
  const prefix = fullKey.slice(0, 14);
  const hash = crypto.createHash("sha256").update(fullKey).digest("hex");
  return { fullKey, prefix, hash };
}

export function hashApiKey(fullKey: string): string {
  return crypto.createHash("sha256").update(fullKey).digest("hex");
}
