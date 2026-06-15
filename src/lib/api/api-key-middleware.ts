import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashApiKey } from "./key-generator";
import { hasScope } from "./scope-check";
import { errorResponse, type ErrorCode } from "./api-errors";
import { createRateLimiter } from "./rate-limiter";

type ApiHandler = (
  req: NextRequest,
  context: { apiKeyId: string; keyName: string; scopes: string },
) => Promise<NextResponse>;

// Meta-Endpoints ohne API-Key
const META_PATHS = ["/api/v1/health", "/api/v1/openapi.json", "/api/v1/docs"];

// Pro-Key Rate-Limiter (100/min default, überschreibbar pro Route)
const rateLimiters = new Map<string, ReturnType<typeof createRateLimiter>>();

function getRateLimiter(key: string, maxRequests: number): ReturnType<typeof createRateLimiter> {
  const existing = rateLimiters.get(`${key}:${maxRequests}`);
  if (existing) return existing;
  const limiter = createRateLimiter(maxRequests, 60000);
  rateLimiters.set(`${key}:${maxRequests}`, limiter);
  return limiter;
}

/**
 * Wrapper für API-Routes: Validiert API-Key, prüft Scope, zählt Rate-Limiting.
 */
export function withApiKey(handler: ApiHandler, requiredScope: string) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const path = req.nextUrl.pathname;

    // Meta-Endpoints immer erlauben
    if (META_PATHS.some((p) => path.startsWith(p))) {
      return handler(req, { apiKeyId: "meta", keyName: "meta", scopes: "*" });
    }

    // API-Key aus Header lesen
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return errorResponse(401, "INVALID_KEY", "X-API-Key header erforderlich");
    }

    // Key hashen und in DB suchen
    const keyHash = hashApiKey(apiKey);

    let keyRecord;
    try {
      keyRecord = await prisma.apiKey.findUnique({
        where: { keyHash },
      });
    } catch {
      return errorResponse(500, "INTERNAL_ERROR", "Datenbankfehler bei Key-Prüfung");
    }

    if (!keyRecord) {
      return errorResponse(401, "INVALID_KEY", "Ungültiger API-Key");
    }

    if (!keyRecord.isActive) {
      return errorResponse(401, "INVALID_KEY", "API-Key wurde deaktiviert");
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      return errorResponse(401, "EXPIRED_KEY", "API-Key ist abgelaufen");
    }

    // Scope prüfen
    if (!hasScope(keyRecord.scopes, requiredScope)) {
      return errorResponse(403, "INSUFFICIENT_SCOPE",
        `Scope '${requiredScope}' erforderlich. Vorhanden: ${keyRecord.scopes}`);
    }

    // Rate-Limiting
    const limiter = getRateLimiter(keyRecord.id, keyRecord.rateLimit);
    const allowed = limiter(keyRecord.id);
    if (!allowed) {
      return errorResponse(429, "RATE_LIMITED",
        `Rate-Limit von ${keyRecord.rateLimit} Requests/Minute erreicht`, undefined,
        { "X-RateLimit-Limit": String(keyRecord.rateLimit), "X-RateLimit-Remaining": "0" });
    }

    // Letzte Nutzung aktualisieren (fire & forget)
    prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});

    // Request loggen (fire & forget)
    const start = Date.now();
    try {
      const response = await handler(req, {
        apiKeyId: keyRecord.id,
        keyName: keyRecord.name,
        scopes: keyRecord.scopes,
      });

      // Log asynchron
      prisma.apiRequestLog.create({
        data: {
          apiKeyId: keyRecord.id,
          endpoint: path,
          method: req.method,
          statusCode: response.status,
          ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
          userAgent: req.headers.get("user-agent") || undefined,
          duration: Date.now() - start,
        },
      }).catch(() => {});

      return response;
    } catch (error) {
      // Auch Fehler loggen
      prisma.apiRequestLog.create({
        data: {
          apiKeyId: keyRecord.id,
          endpoint: path,
          method: req.method,
          statusCode: 500,
          ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
          userAgent: req.headers.get("user-agent") || undefined,
          duration: Date.now() - start,
        },
      }).catch(() => {});

      console.error(`API Error [${keyRecord.name}]:`, error);
      return errorResponse(500, "INTERNAL_ERROR", "Interner Serverfehler");
    }
  };
}
