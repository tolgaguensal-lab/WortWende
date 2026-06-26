#!/bin/bash
# ─── Wortwende Deploy Helper ─────────────────────────────────────────────
# Zieht das neueste Image und startet den Container mit allen benötigten Env-Vars.
# Usage: bash scripts/deploy.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Lade .env falls vorhanden
[ -f .env ] && source .env

# Defaults
NETWORK="${DOCKER_NETWORK:-wortwende-internal}"
PORT="${APP_PORT:-3035}"
IMAGE="ghcr.io/tolgaguensal-lab/wortwende:latest"

echo ""
echo -e "${GREEN}━━━ Wortwende Deploy ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Prüfe kritische Env-Vars
MISSING=""
[ -z "$DATABASE_URL" ] && MISSING="$MISSING DATABASE_URL"
[ -z "$NEXTAUTH_SECRET" ] && MISSING="$MISSING NEXTAUTH_SECRET"
[ -z "$NEXTAUTH_URL" ] && MISSING="$MISSING NEXTAUTH_URL"

if [ -n "$MISSING" ]; then
  echo -e "${RED}❌ Fehlende Env-Vars:${NC}$MISSING"
  echo "   Bitte in .env setzen oder als Umgebungsvariable exportieren."
  exit 1
fi

if [ -z "$DEEPSEEK_API_KEY" ]; then
  echo -e "${RED}⚠️  DEEPSEEK_API_KEY nicht gesetzt – KI-Tutor wird nicht funktionieren.${NC}"
fi

# Pull latest
echo "📥 Pulling $IMAGE ..."
docker pull "$IMAGE" 2>&1 | tail -1

# Stop and remove old container
echo "🔄 Restarting wortwende-app ..."
docker rm -f wortwende-app 2>/dev/null || true

# Start new container
docker run -d --name wortwende-app \
  --network "$NETWORK" \
  -p "$PORT:3000" \
  -e DATABASE_URL \
  -e NEXTAUTH_URL \
  -e NEXTAUTH_SECRET \
  -e DEEPSEEK_API_KEY \
  -e GOOGLE_CLIENT_ID \
  -e GOOGLE_CLIENT_SECRET \
  -e AUTH_SECURE_COOKIES="${AUTH_SECURE_COOKIES:-false}" \
  -e AUTH_TRUST_HOST="${AUTH_TRUST_HOST:-true}" \
  --restart unless-stopped \
  "$IMAGE"

sleep 5

# Health check
if curl -sf "http://localhost:$PORT/api/v1/health" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Deploy erfolgreich – App läuft auf Port $PORT${NC}"
else
  echo -e "${RED}❌ App antwortet nicht – Logs checken: docker logs wortwende-app${NC}"
  exit 1
fi

# DB Push
echo "🗄️  DB Schema prüfen ..."
docker exec wortwende-app npx prisma db push --skip-generate 2>&1 | tail -3

# Smoke Test
echo ""
echo "🔍 Smoke Test ..."
bash "$(dirname "$0")/smoke-test.sh" "http://localhost:$PORT" 2>&1 | tail -5
