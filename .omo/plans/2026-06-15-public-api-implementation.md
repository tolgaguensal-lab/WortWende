# Public API Implementation Plan

**Source Spec:** `docs/superpowers/specs/2026-06-15-public-api-design.md`

## Phase 1: Foundation

### Step 1.1: Prisma Modelle hinzufügen
- `ApiKey` und `ApiRequestLog` Modelle in `prisma/schema.prisma`
- Migration generieren und anwenden (`npx prisma migrate dev --name add_api_keys`)

### Step 1.2: API-Helper erstellen
- `src/lib/api/key-generator.ts` → `generateApiKey()` → `{ fullKey, prefix, hash }`
- `src/lib/api/scope-check.ts` → `hasScope(keyScopes, requiredScope): boolean`
- `src/lib/api/rate-limiter.ts` → In-Memory Sliding Window Counter
- `src/lib/api/api-errors.ts` → `ApiError` Klasse + `errorResponse()` Helfer
- `src/lib/api/api-key-middleware.ts` → `validateApiKey(req): ApiKey` Funktion

### Step 1.3: Middleware erweitern
- `src/middleware.ts` → API-Key-Prüfung auf `/api/v1/*` Pfade einbauen
- Meta-Endpoints (`/health`, `/openapi.json`, `/docs`) ohne Key erlauben
- CORS-Header setzen
- Rate-Limiting + Request-Logging

## Phase 2: API-Key Management

### Step 2.1: API-Key Admin-Frontend
- Seite: `src/app/(dashboard)/admin/api-keys/page.tsx`
- Tabelle aller Keys (Prefix, Name, Scopes, Status, letzte Nutzung)
- Button "Neuen Key erstellen" → Modal mit Scope-Auswahl
- Nach Erstellung: Voll-Key einmalig anzeigen (Copy-Button)
- Deaktivieren/Löschen per Button

### Step 2.2: API-Key Admin-Endpoints
- `POST /api/v1/admin/api-keys` → Key erstellen (body: name, scopes, rateLimit)
- `GET /api/v1/admin/api-keys` → Alle Keys auflisten
- `DELETE /api/v1/admin/api-keys/[id]` → Key deaktivieren

## Phase 3: Endpoints migrieren + erweitern

### Step 3.1: Bestehende Public-Endpoints migrieren
- `api/public/vocabulary` → `api/v1/vocabulary`
- `api/public/grammar` → `api/v1/grammar`
- `api/public/sentences` → `api/v1/sentences`
- `api/public/exercises` → `api/v1/exercises`
- Alt-Routen bleiben bestehen

### Step 3.2: Neue Read-Endpoints
- `GET /api/v1/vocabulary/[id]`
- `GET /api/v1/grammar/[id]`
- `GET /api/v1/sentences/[id]`
- `GET /api/v1/lessons` + `GET /api/v1/lessons/[id]`
- `GET /api/v1/courses`
- `GET /api/v1/life-situations`
- `GET /api/v1/placement-tests`
- `GET /api/v1/translate`

### Step 3.3: Neue Write-Endpoints
- `POST /api/v1/placement-test/result`
- `POST /api/v1/progress/lesson`
- `POST /api/v1/progress/answer`
- `POST /api/v1/user/profile`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/health`

## Phase 4: OpenAPI-Dokumentation

### Step 4.1: OpenAPI Spec
- `src/lib/api/openapi.json` — komplette Spec aller Endpoints
- Inkl. Request/Response-Schemata, Error-Formaten, Scope-Angaben

### Step 4.2: Swagger UI + Spec-Endpoint
- `GET /api/v1/openapi.json` → JSON-Spec ausliefern
- `GET /api/v1/docs` → Swagger UI HTML (CDN)

## Phase 5: Deployment

### Step 5.1: Prüfung
- Build testen: `npx next build`
- Prisma generate check
- Alte + neue Routes nebeneinander testen

### Step 5.2: Commit & Push
- Alles committen
- GitHub Actions baut und deployed automatisch
- Watchtower updated auf ZimaOS

## Abhängigkeiten
- Phase 1 muss vor Phase 2-4 abgeschlossen sein
- Phase 2-4 können teils parallel (Admin-Frontend + Endpoints)
- Phase 5 ist der Abschluss
