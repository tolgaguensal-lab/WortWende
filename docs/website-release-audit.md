# Website Release Audit – Wortwende

**Datum:** 2026-06-23
**Status:** 🟡 Mit P1-Mängeln

## Page-Status

| Seite | Status | Issues |
|---|---|---|
| `/` Landing | ✅ | SEO fehlt |
| `/pricing` | ✅ | Hardcoded |
| `/placement-test` | ✅ | - |
| `/login` | ✅ | SEO fehlt |
| `/register` | ✅ | SEO fehlt |
| `/dashboard` | 🟡 | Hardcoded Stats |
| `/learn` | ✅ | - |
| `/review` | ✅ | - |
| `/vocabulary` | ✅ | - |
| `/grammar` | ✅ | - |
| `/tutor` | ✅ | - |
| `/profile` | 🔴 | Hardcoded Demo-Daten |
| `/settings` | ✅ | Delete+Export funktional |
| `/leaderboard` | 🔴 | Hardcoded |
| `/writing` | 🔴 | Platzhalter |
| `/onboarding/result` | 🔴 | Mock-Daten |
| `/admin/*` | ✅ | - |
| `/datenschutz` | 🟡 | Google OAuth ergänzt |
| `/impressum` | 🟡 | TODO_LEGAL_REQUIRED |
| `/agb` | 🟡 | - |
| `/konto-loeschen` | ✅ | Neu erstellt |
| `/offline` | ✅ | - |
| `/bamf` | ✅ | - |
| `/speaking` | ✅ | - |

## Fehlend
- 404-Seite (global-error.tsx)
- Error Boundaries pro Route
- Loading States auf allen Seiten
- robots.txt → ✅ erstellt
- sitemap.xml → ✅ erstellt
