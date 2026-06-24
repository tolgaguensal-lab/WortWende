#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🔒 WortWende Security & Penetration Test Suite
# ═══════════════════════════════════════════════════════════════
# Usage:
#   chmod +x scripts/security-audit.sh
#   ./scripts/security-audit.sh [TARGET_URL]
#
# Default TARGET: http://192.168.178.91:3035
# ═══════════════════════════════════════════════════════════════

TARGET="${1:-http://192.168.178.91:3035}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

check() {
    local name="$1"
    local result="$2"
    local expected="$3"
    if echo "$result" | grep -qi "$expected"; then
        echo -e "  ${GREEN}✅ PASS${NC} $name"
        ((PASS++))
    else
        echo -e "  ${RED}❌ FAIL${NC} $name"
        echo "     Expected: $expected"
        echo "     Got:      ${result:0:200}"
        ((FAIL++))
    fi
}

echo "═" $(printf '%.0s═' {1..58})
echo "🔒 WORTWENDE SECURITY AUDIT"
echo "═" $(printf '%.0s═' {1..58})
echo "Target: $TARGET"
echo ""

# ─── 1. SECURITY HEADERS ─────────────────────────────────────
echo "📋 1. Security Headers"
HEADERS=$(curl -sI -L "$TARGET" 2>/dev/null)

check "Strict-Transport-Security (HSTS)"  "$HEADERS" "Strict-Transport-Security"
check "X-Frame-Options (Clickjacking)"     "$HEADERS" "X-Frame-Options"
check "X-Content-Type-Options (MIME sniff)" "$HEADERS" "X-Content-Type-Options"
check "Referrer-Policy"                    "$HEADERS" "Referrer-Policy"
check "Content-Security-Policy"            "$HEADERS" "Content-Security-Policy"
echo ""

# ─── 2. AUTHENTICATION TESTS ─────────────────────────────────
echo "📋 2. Authentication"

# Test: Login without credentials (302 = redirect, 401 = unauthorized, both OK)
RESULT=$(curl -s -X POST "$TARGET/api/auth/callback/credentials" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=&password=" -o /dev/null -w "%{http_code}")
check "Login ohne Credentials → Redirect/Unauth" "$RESULT" "30[0-9]|40[13]"

# Test: Access protected route without auth
RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET/dashboard")
check "Dashboard ohne Auth → Redirect/401" "$RESULT" "30[0-9]|401"

# Test: CSRF endpoint exists
RESULT=$(curl -s "$TARGET/api/auth/csrf")
check "CSRF-Token Endpoint" "$RESULT" "csrfToken"

# Test: Rate limiting on register
echo "     Testing rate limit (5 rapid requests)..."
RATE_LIMIT_HIT=0
for i in {1..6}; do
    CODE=$(curl -s -X POST "$TARGET/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"name":"bot","email":"bot@spam.de","password":"testtest123"}' \
        -o /dev/null -w "%{http_code}")
    if [ "$CODE" = "429" ]; then
        RATE_LIMIT_HIT=1
        break
    fi
done
if [ "$RATE_LIMIT_HIT" = "1" ]; then
    echo -e "  ${GREEN}✅ PASS${NC} Rate-Limiting aktiv (429)"
    ((PASS++))
else
    echo -e "  ${YELLOW}⚠️  WARN${NC} Kein 429 nach 6 Requests – Rate-Limiting prüfen"
fi
echo ""

# ─── 3. INPUT VALIDATION ─────────────────────────────────────
echo "📋 3. Input Validation"

# SQL Injection
RESULT=$(curl -s -X POST "$TARGET/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"\x27 OR 1=1--","password":"testtest123"}' \
    -o /dev/null -w "%{http_code}")
check "SQL Injection abgewehrt" "$RESULT" "40[0-9]|429"

# XSS 
RESULT=$(curl -s -X POST "$TARGET/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"<script>alert(1)</script>","email":"xss@test.de","password":"testtest123"}' \
    -o /dev/null -w "%{http_code}")
check "XSS abgewehrt" "$RESULT" "40[0-9]|429"

# Oversized input
RESULT=$(curl -s -X POST "$TARGET/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$(python3 -c 'print("A"*10000)')\",\"email\":\"big@test.de\",\"password\":\"testtest123\"}" \
    -o /dev/null -w "%{http_code}")
check "Oversized Input abgelehnt" "$RESULT" "4[01][0-9]"
echo ""

# ─── 4. INFORMATION DISCLOSURE ───────────────────────────────
echo "📋 4. Information Disclosure"

# Test: Kein Stack-Trace im Error
RESULT=$(curl -s "$TARGET/api/auth/callback/credentials" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "csrfToken=invalid&email=x&password=x")
check "Keine Stack-Traces im Error" "$RESULT" "^((?!stack).)*$"
check "Keine DB-Fehler exposed" "$RESULT" "^((?!prisma|database|postgres).)*$"

# Test: Keine Versions-Header
check "Kein X-Powered-By" "$HEADERS" "^((?!X-Powered-By).)*$"
echo ""

# ─── 5. TLS / HTTPS ──────────────────────────────────────────
echo "📋 5. TLS / HTTPS"
RESULT=$(curl -sI -o /dev/null -w "%{http_code}" "https://orthheld.guenlab.de/" 2>/dev/null)
check "HTTPS erreichbar" "$RESULT" "20[0-9]"
echo ""

# ─── 6. LEGAL PAGES ──────────────────────────────────────────
echo "📋 6. Rechtliche Seiten"
for page in impressum datenschutz agb; do
    RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET/$page")
    check "/$page erreichbar (200)" "$RESULT" "200"
done
echo ""

# ─── SUMMARY ─────────────────────────────────────────────────
echo "═" $(printf '%.0s═' {1..58})
TOTAL=$((PASS + FAIL))
echo -e "📊 ${GREEN}$PASS PASS${NC} / ${RED}$FAIL FAIL${NC} / $TOTAL TOTAL"
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ALLE CHECKS BESTANDEN${NC}"
else
    echo -e "${RED}⚠️  $FAIL CHECKS FEHLGESCHLAGEN${NC}"
fi
echo "═" $(printf '%.0s═' {1..58})
