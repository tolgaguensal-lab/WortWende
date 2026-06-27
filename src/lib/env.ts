const REQUIRED_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "DEEPSEEK_API_KEY",
] as const;

const OPTIONAL_VARS = [
  "AUTH_SECURE_COOKIES",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "LANGUAGE_TOOL_API_URL",
  "TATOEBA_API_URL",
  "WIKTIONARY_API_URL",
  "LIBRETRANSLATE_URL",
  "TRANSLATION_PROVIDER",
  "NEXT_PUBLIC_APP_VERSION",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join("\n  ")}\n\n` +
        "Check .env or zimaos.env for these values."
    );
  }

  // DATABASE_URL sollte connection_limit und pool_timeout haben
  const dbUrl = process.env.DATABASE_URL!;
  if (!dbUrl.includes("connection_limit=")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        '⚠️  DATABASE_URL ohne connection_limit — empfehle "&connection_limit=10&pool_timeout=10"'
      );
    }
  }

  // NEXTAUTH_SECRET sollte nicht der Default-Wert sein
  const secret = process.env.NEXTAUTH_SECRET!;
  if (
    secret === "your-secret-here-change-in-production" ||
    secret.length < 32
  ) {
    throw new Error(
      "NEXTAUTH_SECRET ist zu kurz oder noch der Default-Wert. " +
        "Generiere einen mit: openssl rand -base64 32"
    );
  }
}

export function envSummary() {
  const vars: Record<string, string> = {};
  for (const key of [...REQUIRED_VARS, ...OPTIONAL_VARS]) {
    const val = process.env[key];
    if (val) {
      vars[key] = key.includes("SECRET") || key.includes("PASSWORD")
        ? "[REDACTED]"
        : val;
    }
  }
  return vars;
}
