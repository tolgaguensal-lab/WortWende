# Cross-Platform Architecture – Wortwende

**Datum:** 2026-06-23

## Architektur-Übersicht

Wortwende ist eine Cross-Platform-Deutschlern-App mit **vier Release-Kanälen**:

```
┌─────────────────────────────────────────────────┐
│                  Nutzer                          │
├──────────┬──────────┬──────────┬────────────────┤
│ Website  │ Android  │   iOS    │   API (v1)     │
│ (Next.js)│ (Capacitor)│(Capacitor)│ (Public)    │
├──────────┴──────────┴──────────┴────────────────┤
│              Next.js Backend                     │
│    Auth • API • Prisma • KI-Tutor • Content      │
├─────────────────────────────────────────────────┤
│           PostgreSQL + DeepSeek API              │
└─────────────────────────────────────────────────┘
```

## Platform-Strategie

| Aspekt | Website | Android | iOS |
|---|---|---|---|
| **Typ** | Next.js SSR/SSG | Capacitor WebView | Capacitor WebView |
| **Rendering** | Server + Client | Client-only WebView | Client-only WebView |
| **Assets** | Server-gerendert | Remote URL (wortwende.guenlab.de) | Remote URL |
| **Auth** | NextAuth Session | Session Cookie | Session Cookie |
| **API** | Direkt | Über HTTPS | Über HTTPS |
| **Offline** | PWA (SW) | PWA (SW) | PWA (SW) |
| **Push** | Browser | Capacitor Plugin | Capacitor Plugin |
| **Microphone** | Web Speech API | Android Permission | iOS Permission |

## Capacitor Remote-Shell-Architektur

Die aktuelle Architektur nutzt Capacitor als **Remote-URL-Shell**:
- `server.url: "https://wortwende.guenlab.de"` in Production
- Die App lädt die Website in einer WebView
- Keine lokalen gebündelten Assets
- Vorteil: Immer aktuell, kein App-Update nötig
- Nachteil: Keine Offline-Funktionalität ohne PWA-SW, Store-Review-Risiko

## Datenfluss

| Datenkategorie | Lokal (Client) | Remote (Server) |
|---|---|---|
| Auth-Token | Session Cookie | DB |
| Lernfortschritt | - | PostgreSQL |
| Vokabeln/Wiederholungen | - | PostgreSQL |
| KI-Tutor-Chat | - | DeepSeek API |
| Einstellungen | localStorage | UserProfile |
| Offline-Cache | Service Worker | - |

## API-Endpunkte

| Kanal | Authentifizierung | Rate Limit |
|---|---|---|
| `/api/*` | NextAuth Session | Variiert |
| `/api/v1/*` | API Key (X-API-Key) | Per-Key |
| `/api/auth/*` | Public | 5/min (Register) |
| `/api/public/*` | Public | Keines |

## Features pro Plattform

| Feature | Website | Android | iOS | Backend |
|---|---|---|---|---|
| Landingpage | ✅ | ✅ | ✅ | - |
| Login/Register | ✅ | ✅ | ✅ | ✅ |
| KI-Tutor Leo | ✅ | ✅ | ✅ | ✅ |
| Spaced Repetition | ✅ | ✅ | ✅ | ✅ |
| Vokabeltrainer | ✅ | ✅ | ✅ | ✅ |
| Grammatiktrainer | ✅ | ✅ | ✅ | ✅ |
| Einstufungstest | ✅ | ✅ | ✅ | ✅ |
| DTZ-Training | ✅ | ✅ | ✅ | ✅ |
| Sprach-Eingabe | ✅ | ✅ | ✅ | - |
| Push Notifications | - | ✅ | ✅ | ✅ |
| Offline-Modus | ✅ | ✅ | ✅ | - |
| Account löschen | ✅ | ✅ | ✅ | ✅ |
| Datenexport | ✅ | ✅ | ✅ | ✅ |

## Risiken

1. **Store-Review:** Remote-Shell-Apps können abgelehnt werden
2. **Offline:** Ohne Netzwerk ist die App nur mit SW-Cache nutzbar
3. **Performance:** WebView ist langsamer als native UI
