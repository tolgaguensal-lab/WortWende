# ─── Wortwende – Deployment Guide ────────────────────────────────────────
# Letzte Aktualisierung: 2026-06-26

## Schnellstart (ZimaOS / Docker)

```bash
# 1. Docker Netzwerk erstellen
docker network create wortwende-internal

# 2. Postgres starten
docker run -d --name wortwende-postgres \
  --network wortwende-internal \
  -e POSTGRES_USER=wortheld \
  -e POSTGRES_PASSWORD=DEIN_PASSWORT \
  -e POSTGRES_DB=wortheld \
  -v wortwende-pgdata:/var/lib/postgresql/data \
  postgres:16-alpine

# 3. LanguageTool starten (optional, für Grammatik-Prüfung)
docker run -d --name wortwende-languagetool \
  --network wortwende-internal \
  erikvl87/languagetool:latest

# 4. App starten
docker run -d --name wortwende-app \
  --network wortwende-internal \
  -p 3035:3000 \
  -e DATABASE_URL="postgresql://wortheld:DEIN_PASSWORT@wortwende-postgres:5432/wortheld?schema=public" \
  -e NEXTAUTH_URL="https://wortwende.guenlab.de" \
  -e NEXTAUTH_SECRET="DEIN_64_ZEICHEN_SECRET" \
  -e DEEPSEEK_API_KEY="sk-..." \
  --restart unless-stopped \
  ghcr.io/tolgaguensal-lab/wortwende:latest

# 5. DB Schema pushen
docker exec wortwende-app npx prisma db push --skip-generate
```

## Env-Variablen

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL Connection String |
| `NEXTAUTH_URL` | ✅ | Öffentliche URL der App |
| `NEXTAUTH_SECRET` | ✅ | Min. 32 Zeichen (`openssl rand -base64 32`) |
| `DEEPSEEK_API_KEY` | ✅ | KI-Tutor API Key |
| `AUTH_SECURE_COOKIES` | ⚠️ | `false` bei HTTP, `true` bei HTTPS |
| `AUTH_TRUST_HOST` | ⚠️ | `true` bei lokalen IPs |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth Login |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth Login |

## Nach jedem Deploy prüfen

```bash
# Smoke Test
bash scripts/smoke-test.sh https://wortwende.guenlab.de

# Logs checken
docker logs wortwende-app --tail 20
```

## Backup

```bash
# DB Backup
docker exec wortwende-postgres pg_dump -U wortheld wortheld > backup.sql
```
