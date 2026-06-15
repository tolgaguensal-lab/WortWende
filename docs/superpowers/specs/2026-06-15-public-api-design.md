# WortHeld Public API — Design-Dokument

**Datum:** 2026-06-15
**Status:** Entwurf
**Ansatz:** Next.js API Routes + API-Key Auth (Ansatz 3)

## 1. Ziel

Eine produktionsreife Public REST API für externe Drittanbieter, die über `api.wortheld.guenlab.de` erreichbar ist. Die API exponiert WortHeld-Daten (Vokabeln, Grammatik, Sätze, Übungen, Lektionen) sowie Schreibzugriff auf Lernfortschritt und User-Management — mit API-Key-Authentifizierung, Rate-Limiting, Request-Logging und OpenAPI-Dokumentation.

## 2. Prisma-Modelle

### ApiKey

```prisma
model ApiKey {
  id          String   @id @default(uuid())
  name        String
  keyPrefix   String
  keyHash     String   @unique
  userId      String?
  scopes      String   @default("read")
  rateLimit   Int      @default(100)
  expiresAt   DateTime?
  lastUsedAt  DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  requests    ApiRequestLog[]
}
```

### ApiRequestLog

```prisma
model ApiRequestLog {
  id         String   @id @default(uuid())
  apiKeyId   String
  endpoint   String
  method     String
  statusCode Int
  ip         String?
  userAgent  String?
  duration   Int?
  createdAt  DateTime @default(now())
  apiKey     ApiKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)

  @@index([apiKeyId, createdAt])
  @@index([createdAt])
}
```

## 3. API-Endpoints

Basis-URL: `https://api.wortheld.guenlab.de/api/v1`

Alle Endpoints benötigen `X-API-Key` Header (Ausnahme: `/health`, `/openapi.json`, `/docs`).

### Lesen (Read)

| Methode | Endpoint | Scope | Beschreibung |
|---------|----------|-------|-------------|
| GET | `/api/v1/vocabulary` | `read:vocabulary` | Vokabeln mit level/search/lang/limit/offset |
| GET | `/api/v1/vocabulary/:id` | `read:vocabulary` | Einzelne Vokabel |
| GET | `/api/v1/grammar` | `read:grammar` | Grammatik-Themen |
| GET | `/api/v1/grammar/:id` | `read:grammar` | Einzelnes Thema |
| GET | `/api/v1/sentences` | `read:sentences` | Beispielsätze |
| GET | `/api/v1/sentences/:id` | `read:sentences` | Einzelner Satz |
| GET | `/api/v1/exercises` | `read:exercises` | Generierte Übungen |
| GET | `/api/v1/lessons` | `read:lessons` | Lektionen |
| GET | `/api/v1/lessons/:id` | `read:lessons` | Lektion mit Steps + Exercises |
| GET | `/api/v1/courses` | `read:courses` | Kurse mit Units |
| GET | `/api/v1/life-situations` | `read:life-situations` | BAMF-Lebenssituationen |
| GET | `/api/v1/placement-tests` | `read:placement` | Einstufungstests |
| GET | `/api/v1/translate` | `read:translate` | Übersetzung (→ LibreTranslate) |

### Schreiben (Write)

| Methode | Endpoint | Scope | Beschreibung |
|---------|----------|-------|-------------|
| POST | `/api/v1/placement-test/result` | `write:progress` | Testergebnis speichern |
| POST | `/api/v1/progress/lesson` | `write:progress` | Lektion abschließen |
| POST | `/api/v1/progress/answer` | `write:progress` | Antwort einreichen |
| POST | `/api/v1/user/profile` | `write:user` | Profil aktualisieren |
| POST | `/api/v1/auth/register` | `write:user` | User registrieren |
| POST | `/api/v1/auth/login` | `write:user` | User-Login |

### Admin

| Methode | Endpoint | Scope | Beschreibung |
|---------|----------|-------|-------------|
| POST | `/api/v1/admin/review` | `admin` | Content freigeben/ablehnen |
| GET | `/api/v1/admin/quality` | `admin` | Qualitätsreport |
| POST | `/api/v1/admin/api-keys` | `admin` | API-Key erstellen |
| GET | `/api/v1/admin/api-keys` | `admin` | Keys verwalten |
| DELETE | `/api/v1/admin/api-keys/:id` | `admin` | Key löschen/deaktivieren |

### Meta

| Methode | Endpoint | Scope | Beschreibung |
|---------|----------|-------|-------------|
| GET | `/api/v1/health` | — | Healthcheck |
| GET | `/api/v1/openapi.json` | — | OpenAPI-Spec |
| GET | `/api/v1/docs` | — | Swagger UI |

## 4. Authentifizierung & Middleware

### API-Key-Format

`wh_live_<20 Hex-Zeichen>` → z.B. `wh_live_a1b2c3d4e5f6a7b8c9d0`

In der DB werden nur `keyPrefix` (`wh_live_a1b2`) und `keyHash` (bcrypt) gespeichert. Der Voll-Key wird einmalig bei Erstellung angezeigt.

### Middleware-Flow

```
Request → /api/v1/*
  ├─ Meta-Endpoint? → durchlassen
  ├─ X-API-Key Header vorhanden?
  │   ├─ Nein → 401 { error: "X-API-Key header erforderlich", code: "INVALID_KEY" }
  │   └─ Ja → Key-Hash mit DB abgleichen
  │       ├─ Key ungültig/deaktiviert → 401
  │       ├─ Key abgelaufen → 401 { error: "API-Key abgelaufen", code: "EXPIRED_KEY" }
  │       └─ Gültig → Scope-Check
  │           ├─ Scope unzureichend → 403 { error: "Scope nicht ausreichend", code: "INSUFFICIENT_SCOPE" }
  │           └─ Scope ok → Rate-Limiting
  │               ├─ Limit erreicht → 429 { error: "Rate limit erreicht", code: "RATE_LIMITED", retryAfter: 42 }
  │               └─ OK → Request loggen → Route ausführen
```

### Rate-Limiting

- **Standard**: 100 Requests/Minute pro Key (konfigurierbar via `ApiKey.rateLimit`)
- **Speicher**: In-Memory `Map<string, SlidingWindowCounter>`
- **Response Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### CORS

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: X-API-Key, Content-Type
```

### Einheitliches Error-Format

```json
{
  "error": "Kurze Fehlermeldung",
  "code": "RATE_LIMITED",
  "details": {}
}
```

Fehler-Codes: `INVALID_KEY`, `EXPIRED_KEY`, `INSUFFICIENT_SCOPE`, `RATE_LIMITED`, `NOT_FOUND`, `VALIDATION_ERROR`, `INTERNAL_ERROR`

## 5. OpenAPI-Dokumentation

- **Spec-Format**: OpenAPI 3.0 als `src/lib/api/openapi.json`
- **Inhalt**: Alle Endpoints mit Parametern, Request/Response-Schemata, Error-Formaten, Scope-Angaben
- **Swagger UI**: CDN-basierte HTML-Seite unter `GET /api/v1/docs`
- **Version**: Synchronisiert mit package.json version

## 6. Implementierungs-Phasen

### Phase 1 — Foundation
- Prisma `ApiKey` + `ApiRequestLog` Modelle → `prisma/schema.prisma`
- Migration erstellen/anwenden
- `src/lib/api/` Helper:
  - `key-generator.ts` → `generateApiKey()` gibt `{ fullKey, prefix, hash }` zurück
  - `scope-check.ts` → `hasScope(keyScopes: string, requiredScope: string): boolean`
  - `rate-limiter.ts` → In-Memory Sliding Window
  - `api-errors.ts` → `ApiError` Klasse + Error-Response-Helfer
- `src/middleware.ts` erweitern: API-Key-Check für `/api/v1/*` Pfade

### Phase 2 — API-Key Management
- `src/app/api/v1/admin/api-keys/route.ts` → POST (erstellen), GET (auflisten)
- `src/app/api/v1/admin/api-keys/[id]/route.ts` → DELETE (deaktivieren)
- Admin UI: `src/app/(dashboard)/admin/api-keys/page.tsx` — Tabelle mit Keys, Erstellen-Formular

### Phase 3 — Endpoints migrieren + erweitern
- Bestehende `src/app/api/public/*` → nach `src/app/api/v1/*` verschieben
- Neue Endpoints:
  - `src/app/api/v1/placement-test/result/route.ts`
  - `src/app/api/v1/progress/lesson/route.ts`
  - `src/app/api/v1/progress/answer/route.ts`
  - `src/app/api/v1/user/profile/route.ts`
  - `src/app/api/v1/auth/register/route.ts`
  - `src/app/api/v1/auth/login/route.ts`
  - `src/app/api/v1/health/route.ts`
- Bestehende `api/public/` Routen als Redirect/Deprecation behalten

### Phase 4 — OpenAPI-Dokumentation
- `src/lib/api/openapi.json` — vollständige OpenAPI 3.0 Spec
- `src/app/api/v1/docs/route.ts` — Swagger UI HTML-Seite
- `src/app/api/v1/openapi.json/route.ts` — JSON-Endpoint

### Phase 5 — Deployment
- `deploy/zimaos.env` um ggf. fehlende Envs ergänzen
- Bei Bedarf: Pangolin-Konfiguration für Subdomain `api.wortheld.guenlab.de`
- Watchtower deployt automatisch via GitHub Actions

## 7. Offene Fragen (geklärt)

- **API-Keys**: Generische App-Keys (ohne User-Verknüpfung). Der Dashboard-Gedanke (Usage-Charts) ist nice-to-have für später.
- **Auth/Login**: Gibt einen JWT zurück (keine Session-Cookies) — API-Consumer können damit User-Kontext authentifizieren.
- **api/public/* Alt-Routen**: Bleiben bestehen (kein Redirect) für Abwärtskompatibilität. Neue Clients nutzen `/api/v1/*`.
- **Pangolin**: Wird vom User konfiguriert, sobald die App öffentlich erreichbar sein soll. Kein API-spezifischer Eingriff nötig.
