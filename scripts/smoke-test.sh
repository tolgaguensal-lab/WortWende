#!/bin/bash
# ─── Wortwende Smoke Test ───────────────────────────────────────────────
# Testet alle kritischen Endpunkte nach einem Deploy
# Usage: bash scripts/smoke-test.sh [BASE_URL]
#
# Exit-Codes: 0 = alle Tests bestanden, 1 = Fehler

BASE="${1:-http://192.168.178.91:3035}"
PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

check() {
  local name="$1" url="$2" expected="$3" method="${4:-GET}"
  local code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" 2>/dev/null)
  if echo "$code" | grep -qE "$expected"; then
    echo -e "  ${GREEN}✓${NC} $name ($code)"
    ((PASS++))
  else
    echo -e "  ${RED}✗${NC} $name (expected $expected, got $code)"
    ((FAIL++))
  fi
}

check_content() {
  local name="$1" url="$2" pattern="$3"
  local body=$(curl -s "$url" 2>/dev/null)
  if echo "$body" | grep -q "$pattern"; then
    echo -e "  ${GREEN}✓${NC} $name"
    ((PASS++))
  else
    echo -e "  ${RED}✗${NC} $name (pattern '$pattern' not found)"
    ((FAIL++))
  fi
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Wortwende Smoke Test — $(date '+%Y-%m-%d %H:%M')"
echo "  Target: $BASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📄 PUBLIC PAGES"
check "Landing (/)              " "$BASE/" "200"
check "Login (/login)           " "$BASE/login" "200"
check "Register (/register)     " "$BASE/register" "200"
check "Pricing (/pricing)       " "$BASE/pricing" "200"
check "Methode (/methode)       " "$BASE/methode" "200"
check "Placement (/placement)   " "$BASE/placement-test" "200"
check "AGB (/agb)               " "$BASE/agb" "200"
check "Datenschutz (/datenschutz)" "$BASE/datenschutz" "200"
check "Impressum (/impressum)   " "$BASE/impressum" "200"
check "Offline (/offline)        " "$BASE/offline" "200"
check "404 (/nonexistent)       " "$BASE/nonexistent-page" "404"

echo ""
echo "🔒 PROTECTED PAGES (load but require auth)"
check "Dashboard (/dashboard)   " "$BASE/dashboard" "200"
check "Admin (/admin)           " "$BASE/admin" "200"

echo ""
echo "🔧 API ENDPOINTS"
check "Health API               " "$BASE/api/v1/health" "200"
check "API Docs (/docs)         " "$BASE/api/v1/docs" "200"
check "OpenAPI JSON             " "$BASE/api/v1/openapi.json" "200"
check "Content API (strings)    " "$BASE/api/content/strings" "200"
check "API 404                  " "$BASE/api/v1/nonexistent" "404"

echo ""
echo "🎨 STATIC ASSETS"
check "Favicon SVG              " "$BASE/favicon.svg" "200"
check "Favicon PNG              " "$BASE/favicon.png" "200"
check "Logo PNG                 " "$BASE/logo.png" "200"
check "Manifest JSON            " "$BASE/manifest.json" "200"
check "Robots TXT               " "$BASE/robots.txt" "200"

echo ""
echo "🛡️ SECURITY HEADERS"
check "CSP Header               " "$BASE/" "200" && \
  content_has_csp=$(curl -sI "$BASE/" 2>/dev/null | grep -ci "content-security-policy")
  if [ "$content_has_csp" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} CSP present"
    ((PASS++))
  else
    echo -e "  ${RED}✗${NC} CSP missing"
    ((FAIL++))
  fi

echo ""
echo "📦 CONTENT CHECKS"
check_content "Landing H1              " "$BASE/" "KI-Tutor"
check_content "Login form              " "$BASE/login" "Anmelden"
check_content "Pricing FAQ             " "$BASE/pricing" "günstig"
check_content "Favicon SVG valid       " "$BASE/favicon.svg" "</svg>"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((PASS + FAIL))
echo "  Results: ${PASS}/${TOTAL} passed"
if [ $FAIL -eq 0 ]; then
  echo -e "  ${GREEN}✓ ALL CHECKS PASSED${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo -e "  ${RED}✗ $FAIL CHECKS FAILED${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
