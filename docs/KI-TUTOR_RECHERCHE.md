# 🤖 KI-Tutor: Modell-Recherche, Kostenanalyse & Prompt-Engineering

> Stand: 22. Juni 2026 – Preise in USD pro 1M Tokens

---

## 📊 1. Modell-Vergleich (Kosten pro 1M Tokens)

| Rang | Provider | Modell | Input $ | Output $ | Typische Chat-Kosten¹ | Free Tier |
|:----:|----------|--------|--------:|---------:|----------------------:|:---------:|
| 🥇 | **Google** | Gemini 2.5 Flash-Lite | $0.10 | $0.40 | ~$0.50 | ✅ Ja² |
| 🥈 | **Google** | Gemini 2.5 Flash-Lite Preview | $0.10 | $0.40 | ~$0.50 | ✅ Ja² |
| 🥉 | **DeepSeek** | V4 Flash (mit Cache) | $0.0028 | $0.28 | ~$0.28 | ❌ |
| 4 | **DeepSeek** | V4 Flash (ohne Cache) | $0.14 | $0.28 | ~$0.42 | ❌ |
| 5 | **Google** | Gemini 2.5 Flash | $0.30 | $2.50 | ~$2.80 | ✅ Ja² |
| 6 | **DeepSeek** | V4 Pro | $0.435 | $0.87 | ~$1.30 | ❌ |
| 7 | **OpenAI** | GPT-5.4 mini | $0.75 | $4.50 | ~$5.25 | ❌ |
| 8 | **Anthropic** | Claude Haiku 4.5 | $1.00 | $5.00 | ~$6.00 | ❌ |
| 9 | **OpenAI** | GPT-5.4 | $2.50 | $15.00 | ~$17.50 | ❌ |
| 10 | **Anthropic** | Claude Sonnet 4.6 | $3.00 | $15.00 | ~$18.00 | ❌ |

> ¹ Typische Chat-Kosten = 3.000 Input + 300 Output Tokens (Tutor-Session)
> ² Google Free Tier: begrenztes Kontingent, Daten werden für Training verwendet

---

## 🔍 2. Deep-Dive: Jeder Provider im Detail

### 🥇 Google Gemini 2.5 Flash-Lite (Empfehlung für Kosten-Sensitivität)

```
Input:  $0.10/M  |  Output: $0.40/M  |  Free Tier: JA
```

**Vorteile:**
- Billigster Paid-Provider (neben DeepSeek)
- **Kostenloser Free Tier** für Entwicklung & kleine Projekte
- OpenAI-kompatible API → minimale Code-Änderung
- 1M Token Kontextfenster
- Context Caching: $0.01/M Input (10x Ersparnis)
- Batch API: 50% Rabatt bei asynchroner Verarbeitung

**Nachteile:**
- Free Tier: Daten werden für Training verwendet
- Deutsche Ausgabe etwas weniger nuanciert als Claude
- Weniger „warm/persönlich" im Ton

**Migration von DeepSeek → Gemini:**
```typescript
// API Endpoint ändern
const endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
// Header: Authorization: Bearer <GEMINI_API_KEY>
// Model: "gemini-2.5-flash-lite"
// Rest ist identisch (OpenAI-kompatibel)
```

**Monatskosten-Schätzung (1.000 aktive Nutzer, je 5 Sessions/Tag):**
- 5.000 Requests/Tag × 30 Tage = 150.000 Requests
- ~3.000 Tokens/Request = 450M Tokens
- Kosten: 450 × $0.10 (Input) + 450 × $0.40 (Output) ÷ 5 (Output-Anteil)
- ≈ **$45-80/Monat** (Paid) oder **$0** (Free Tier, mit Limits)

---

### 🥉 DeepSeek V4 Flash (aktueller Provider – OPTIMIERUNG NÖTIG)

```
Input:  $0.14/M (ohne Cache) → $0.0028/M (mit Cache!)  |  Output: $0.28/M
```

**⚠️ KRITISCH: `deepseek-chat` wird am 24.07.2026 DEPRECATED! → Auf `deepseek-v4-flash` migrieren!**

**Vorteile:**
- Günstigster Output-Preis ($0.28/M)
- **Prompt Caching: 50x billigerer Input** ($0.0028/M)
- 1M Token Kontextfenster
- Gute deutsche Sprachqualität (in China trainiert, mehrsprachig)
- OpenAI-kompatibel (keine Code-Änderung nötig)

**Nachteile:**
- Caching ist MANUELL zu implementieren (nicht automatisch)
- Kein Free Tier
- Keine EU-Server (Datenschutz-Frage für DSGVO)
- Deprecation von `deepseek-chat` am 24.07.2026

**❗ SOFORT-MASSNAHME:**
```typescript
// ALT (deprecated):
model: "deepseek-chat"
// NEU:
model: "deepseek-v4-flash"
```

**Prompt-Caching-Implementierung (größte Kostenersparnis):**
```typescript
// System-Prompt cached → 50x billigerer Input
const response = await fetch("https://api.deepseek.com/chat/completions", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // DeepSeek Caching: markiere den System-Prompt als cacheable
    "DeepSeek-Cache": "enabled",
  },
  body: JSON.stringify({
    model: "deepseek-v4-flash",
    messages: [
      { role: "system", content: CACHED_SYSTEM_PROMPT }, // ← wird gecached
      ...conversationHistory,
    ],
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  }),
});
```

**Monatskosten-Schätzung (gleiche Annahme):**
- Ohne Cache: ≈ **$50-90/Monat**
- Mit Cache: ≈ **$15-30/Monat** (3-6x günstiger!)

---

### OpenAI GPT-5.4 mini (Premium, teuer)

```
Input: $0.75/M  |  Output: $4.50/M
```

**Vorteile:** Beste deutsche Textqualität, EU-Server verfügbar (DSGVO)
**Nachteile:** 10-20x teurer als DeepSeek/Gemini. Geschätzt **$200-500/Monat**
**Fazit:** Nur sinnvoll wenn Google/DeepSeek qualitativ nicht ausreichen.

---

### Anthropic Claude Haiku 4.5 (Premium)

```
Input: $1.00/M  |  Output: $5.00/M
```

**Vorteile:** Warmherzigster, persönlichster Ton – ideal für Tutoren-Persona
**Nachteile:** 10x teurer, kein Free Tier. Geschätzt **$300-700/Monat**
**Fazit:** Beste UX, aber zu teuer für Scale. Nur für Premium-Tier.

---

## 📝 3. Prompt-Engineering für den Deutsch-Tutor

### 3.1 Optimierter System-Prompt (DeepSeek/Gemini)

Der aktuelle Prompt ist ~60 Zeilen (~800 Tokens). Hier die optimierte Version:

```markdown
## SYSTEM-PROMPT (v3 – kosteneffizient)

Du bist der Deutsch-Tutor von Wortwende. Deine Aufgabe: Lernenden (A1-C1) 
Deutsch beibringen – klar, motivierend, geduldig.

## REGELN
1. SPRACHE: Immer Deutsch. Niveau an den Lernenden anpassen.
2. KÜRZE: 2-4 Sätze pro Antwort. Nur Grammatik-Erklärungen dürfen länger sein.
3. TON: Warm, ermutigend. Fehler nie bloßstellen. Fortschritte feiern. 🎯
4. KEINE Eigenwerbung. Keine Meta-Kommentare ("als KI kann ich...").
5. HTML: <strong>fett</strong> für Schlüsselwörter, <em>kursiv</em> für Beispiele.

## SESSION-MODUS
Wenn [SESSION_START: Thema] kommt:
1. 📖 ERKLÄRUNG (2-3 Sätze)
2. 💡 BEISPIEL (1-2 Alltagsbeispiele)
3. 🎯 ÜBUNG – EINE Aufgabe, dann auf Antwort warten
4. ✅ FEEDBACK – sanft korrigieren, erklären warum

## ÜBUNGS-FORMATE
- [ÜBUNG:MC] Frage? | A) Opt1 | B) Opt2 | C) Opt3 | Lösung: X [/ÜBUNG]
- [ÜBUNG:LÜCKE] Satz mit ___ Lücke | Lösung: Wort [/ÜBUNG]  
- [ÜBUNG:SATZ] Bilde Satz mit: W1, W2 | Bsp-Lösung [/ÜBUNG]

## BAMF & ALLTAG
Du kannst: Einkaufen, Wohnung, Arbeit, Arzt, Behörden, DTZ-Prüfung.
Kontext (Niveau, Vokabeln, Grammatik) kommt mit jeder Nachricht.

## SITZUNGSENDE
Abschluss mit: [SESSION_ENDE: +XP]
XP = 5 (kurz) bis 25 (lange Session).
```

**Optimierungen gegenüber Original:**
- Von ~800 auf ~500 Tokens reduziert (37% weniger → spart 37% Input-Kosten)
- Klare nummerierte Regeln (bessere Instruction-Following)
- Entfernt: redundante Persönlichkeitsbeschreibung („nahbar, modern")
- Hinzugefügt: Anti-Halluzination-Regel (keine Meta-Kommentare)

---

### 3.2 RAG-Context-Block (optimiert)

```typescript
// Aktuell: ~400 Tokens → Optimiert: ~200 Tokens
function formatContextBlock(ctx: TutorContext): string {
  const parts: string[] = [];
  
  // Minimal: Nur was der Tutor wirklich braucht
  parts.push(`Niveau: ${ctx.userLevel}`);
  
  if (ctx.relevantGrammar?.length) {
    parts.push(`Grammatik: ${ctx.relevantGrammar.map(g => g.name).join(", ")}`);
  }
  
  if (ctx.recentVocabulary?.length) {
    parts.push(`Vokabeln: ${ctx.recentVocabulary.map(v => 
      `${v.article ? v.article + " " : ""}${v.word}`
    ).join(", ")}`);
  }
  
  return parts.join(" | "); // Kein JSON, kein Format-Overhead
}
```

---

### 3.3 Prompt-Templates für Session-Themen

Jedes Thema bekommt einen maßgeschneiderten Session-Start:

| Thema | Session-Start-Prompt |
|-------|---------------------|
| **Dativ** | `[SESSION_START: Dativ] Erkläre den Dativ mit der Frage "Wem?". Gib 2 Beispiele aus dem Alltag und eine Übung.` |
| **Akkusativ** | `[SESSION_START: Akkusativ] Erkläre den Akkusativ mit "Wen oder was?". Zeige den Unterschied zu Dativ.` |
| **Perfekt** | `[SESSION_START: Perfekt] Erkläre die Perfekt-Bildung mit haben/sein. Wann verwendet man welches Hilfsverb?` |
| **Präpositionen** | `[SESSION_START: Präpositionen] Erkläre Wechselpräpositionen (in, an, auf). Dativ vs. Akkusativ.` |
| **Artikel** | `[SESSION_START: Artikel] Erkläre die Regeln für der/die/das. Gib Eselsbrücken und eine Übung.` |
| **Satzbau** | `[SESSION_START: Satzbau] Erkläre Hauptsatz und Nebensatz. Wo steht das Verb im Nebensatz?` |
| **Alltag** | `[SESSION_START: Alltag] Übe Dialoge: Einkaufen, Arzttermin, Fahrkartenkauf. Rollenspiel-Modus.` |
| **Beruf** | `[SESSION_START: Beruf] Übe: Bewerbungsgespräch, Smalltalk mit Kollegen, Telefonate.` |

---

## 💰 4. Kostenprognose & Break-Even

### Szenario: WortWende mit 1.000 täglich aktiven Nutzern

| Annahme | Wert |
|---------|------|
| Aktive Nutzer/Tag | 1.000 |
| Sessions/Nutzer/Tag | 3 |
| Requests/Session | 8 (Hin-und-her) |
| Tokens/Request (Input) | 2.500 (Prompt + Kontext + History) |
| Tokens/Request (Output) | 350 (max_tokens=1024, tatsächlich ~350) |
| Tage/Monat | 30 |

### Monatskosten nach Provider:

| Provider | Modell | Cache | Kosten/Monat |
|----------|--------|-------|-------------|
| **Google** | 2.5 Flash-Lite | Free Tier | **$0** |
| **DeepSeek** | V4 Flash | MIT Cache | **~$18** |
| **DeepSeek** | V4 Flash | OHNE Cache | **~$68** |
| **Google** | 2.5 Flash-Lite | Paid | **~$55** |
| **Google** | 2.5 Flash | Paid | **~$310** |
| **OpenAI** | GPT-5.4 mini | - | **~$580** |
| **Anthropic** | Haiku 4.5 | - | **~$660** |

### Empfehlung nach Wachstumsphase:

| Phase | Nutzer | Empfohlenes Modell | Kosten/Monat |
|-------|--------|-------------------|-------------|
| Alpha | <100 | Google Flash-Lite Free | $0 |
| Beta | 100-500 | DeepSeek V4 Flash + Cache | $5-15 |
| Launch | 500-2.000 | DeepSeek V4 Flash + Cache | $15-50 |
| Growth | 2.000-10.000 | Gemini Flash-Lite Paid | $50-200 |
| Scale | 10.000+ | Hybrid: Gemini + eigener Server | $200-500 |

---

## 🛡️ 5. Anti-Kostenexplosions-Strategien

### 5.1 Prompt Caching (SOFORT – 3-6x günstiger)
```typescript
// System-Prompt ist bei jeder Anfrage identisch → perfekt für Caching
// DeepSeek: Setze "DeepSeek-Cache: enabled" Header
// Gemini: Automatisch, wenn Prompt-Teil unverändert bleibt
// Ersparnis: System-Prompt (500 Tokens) × 0.14$ → 0.0028$ = 98% günstiger
```

### 5.2 Rate Limiting pro User (SOFORT)
```typescript
// Im aktuellen Code NICHT vorhanden – muss ergänzt werden!
const DAILY_LIMIT_FREE = 10;    // Free: 10 Requests/Tag
const DAILY_LIMIT_PLUS = 50;    // Plus: 50 Requests/Tag
const DAILY_LIMIT_PREMIUM = Infinity; // Premium: unbegrenzt

// Check in /api/tutor/chat/route.ts VOR dem API-Call
// Spart Kosten und entspricht dem Pricing-Modell aus pricing/page.tsx
```

### 5.3 Session-Länge begrenzen
```typescript
// Max. 15 Nachrichten pro Session (History kürzen)
const MAX_HISTORY = 15;
const trimmedMessages = messages.slice(-MAX_HISTORY);
// Spart Input-Tokens, hält Kontext überschaubar
```

### 5.4 max_tokens reduzieren
```typescript
// Aktuell: max_tokens: 1024 → reduzierbar auf 512
// Deutsche Tutor-Antworten sind selten >300 Tokens
// Ersparnis: ~50% weniger Output-Kosten
max_tokens: 512,
```

### 5.5 Fallback-Ketten (Graceful Degradation)
```typescript
const MODELS = [
  { name: "deepseek-v4-flash",    cost: "niedrig",  priority: 1 },
  { name: "gemini-2.5-flash-lite", cost: "niedrig",  priority: 2 },
  { name: "deepseek-v4-flash",    cost: "niedrig",  priority: 1 }, // retry
];

async function tryModels(messages, context) {
  for (const model of MODELS) {
    try {
      return await callModel(model.name, messages, context);
    } catch (e) {
      console.warn(`Model ${model.name} failed, trying next...`);
    }
  }
  throw new Error("All models failed");
}
```

---

## 🚨 6. Kritische TODOs (SOFORT)

| Prio | Aufgabe | Grund |
|:----:|---------|------|
| 🔴 | **`deepseek-chat` → `deepseek-v4-flash` migrieren** | Deprecated am 24.07.2026! |
| 🔴 | **Rate Limiting implementieren** | Entspricht Pricing-Tiers, verhindert Kostenexplosion |
| 🔴 | **Prompt Caching aktivieren** | 3-6x Kostenersparnis bei DeepSeek |
| 🟡 | System-Prompt optimieren (800→500 Tokens) | 37% weniger Input-Kosten |
| 🟡 | `max_tokens` von 1024 auf 512 reduzieren | 50% weniger Output-Kosten |
| 🟡 | History auf max. 15 Nachrichten begrenzen | Spart Input-Tokens |
| 🟢 | Google Gemini als Fallback einbauen | Ausfallsicherheit + Free Tier Option |
| 🟢 | Kosten-Tracking/Logging einbauen | Transparenz über tatsächliche Kosten |

---

## 📋 7. Prompt-Bibliothek (Fertige Templates)

### 7.1 Freies Chatten
```
User: Was ist der Unterschied zwischen "seit" und "seitdem"?
User: Kannst du mir den Satz "Ich gehe zum Arzt" im Perfekt bilden?
User: Warum heißt es "dem Mann" und nicht "den Mann"?
```

### 7.2 Korrektur-Modus
```
User: Korrigiere bitte: "Ich habe gestern in die Stadt gehen."
User: Ist dieser Satz richtig? "Der Frau kauft ein Brot."
```

### 7.3 DTZ-Prüfungsvorbereitung
```
User: [SESSION_START: DTZ] Ich mache bald die DTZ-Prüfung. 
      Kannst du mit mir eine typische mündliche Prüfung simulieren?
```

### 7.4 Grammatik-Deep-Dive
```
User: [SESSION_START: Nebensätze] Erkläre mir Nebensätze mit "weil", 
      "dass" und "wenn". Wo steht das Verb?
```

### 7.5 Alltags-Rollenspiel
```
User: [SESSION_START: Alltag] Simuliere: Ich bin beim Arzt und muss 
      meine Symptome beschreiben. Du bist der Arzt.
```
