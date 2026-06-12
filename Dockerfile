# =============================================================================
# WortHeld (DeutschQuest) — Multi-Stage Docker Build
# =============================================================================
# Build:
#   docker build --build-arg APP_VERSION=1.0.0 \
#     -t ghcr.io/tolgaguensal-lab/orthheld:latest .
#
# Run with docker-compose (empfohlen):
#   docker compose -f deploy/zimaos-compose.yml up -d
# =============================================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

ARG APP_VERSION=0.0.0
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

# Prisma Client generieren
RUN npx prisma generate

# Next.js Standalone-Build
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

ARG APP_VERSION=0.0.0
ENV APP_VERSION=${APP_VERSION}
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 1. Standalone-App (server.js + node_modules + .next/server)
COPY --from=builder /app/.next/standalone ./

# 2. Static Assets (CSS, JS chunks)
COPY --from=builder /app/.next/static ./.next/static

# 3. Public Assets (Bilder, Icons)
COPY --from=builder /app/public ./public

# 4. Prisma Schema + generierter Client (für DB-Migrationen)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 5. Startup-Script: Prisma-Migration → Next.js starten
RUN { \
      echo '#!/bin/sh'; \
      echo 'set -e'; \
      echo ''; \
      echo 'echo "========================================="'; \
      echo "echo \"  WortHeld v${APP_VERSION}\""; \
      echo 'echo "========================================="'; \
      echo 'echo ""'; \
      echo ''; \
      echo 'echo "→ Datenbank-Migration...";'; \
      echo 'if npx prisma migrate deploy 2>/dev/null; then'; \
      echo '  echo "✅ Migration erfolgreich"'; \
      echo 'else'; \
      echo '  echo "⚠️  Migration übersprungen (kein DB-Zugang oder Tabellen vorhanden)"'; \
      echo 'fi'; \
      echo 'echo ""'; \
      echo ''; \
      echo 'exec node server.js'; \
    } > /start.sh && \
    chmod +x /start.sh

# Besitzer setzen
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000 || exit 1

CMD ["/start.sh"]
