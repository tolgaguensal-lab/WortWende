# Reverse Engineering: KI-Implementierung der Wettbewerber

> **Rechtlicher Hinweis:** Diese Analyse basiert ausschließlich auf öffentlich zugänglichen
> Informationen (Websites, App Store, Dokumentation). Es wurde kein Code dekompiliert oder
> auf geschützte Systeme zugegriffen. Alle Erkenntnisse sind durch Beobachtung und
> allgemeines Fachwissen gewonnen.

---

## 1. Praktika.ai – Architektur-Analyse

### 1.1 System Prompt Engineering (rekonstruiert)
```
Du bist [Tutor-Name], ein [Persönlichkeit]-Deutschlehrer.
Deine Muttersprache ist [User-Language]. 
Antworte IMMER zuerst auf [User-Language], dann auf Deutsch.

Bei Fehlern:
1. Zeige den falschen Text durchgestrichen
2. Zeige die Korrektur in Grün
3. Gib eine kurze Erklärung in [User-Language]

Tone: [Soft|Balanced|Strict]
- Soft: "Fast richtig! Ein kleiner Tipp..."
- Balanced: "Gut, aber hier ist die korrekte Version:"
- Strict: "Falsch. Richtig wäre:"
```

### 1.2 Multi-Avatar System
- **6 verschiedene System-Prompts** mit unterschiedlichen:
  - Begrüßungstexten
  - Korrektur-Stilen
  - Emoji-Nutzung
  - Humor-Level
- **Kein separater Model-Fine-Tune** – alles Prompt-Engineering
- Avatar-Bilder sind statisch (kein Video/Animation)

### 1.3 Korrektur-Pipeline (rekonstruiert)
```
User-Input → [Language Detection] → [Grammar Check] → [Spell Check] → [Style Check]
                                              ↓
                              AI generiert strukturierte Korrektur:
                              {
                                original: "Ich bin nerveus",
                                corrected: "Ich bin nervös",
                                explanation: "„nerveus" ist eine Falschschreibung...",
                                type: "spelling"
                              }
                                              ↓
                              Frontend rendert: ~~nerveus~~ → nervös + Erklärung
```

### 1.4 API-Stack (vermutet)
- **LLM:** GPT-4o oder Claude (basierend auf Antwortqualität und Latenz)
- **Speech Recognition:** Native iOS/Android Speech API
- **TTS:** ElevenLabs oder Azure TTS (natürliche Stimmen)
- **Backend:** Wahrscheinlich Node.js/TypeScript (Startup-Stack)
- **Real-time:** Kein WebSocket – einfache REST/SSE

---

## 2. TalkPal.ai – Architektur-Analyse

### 2.1 Multi-Mode System
TalkPal's 7 Modi sind alle **Prompt-Varianten**, nicht separate Modelle:

| Modus | System-Prompt-Template |
|---|---|
| Chat | Freies Gespräch, Korrektur bei Fehlern |
| Call Mode | Simuliert Telefonat, Voice-only, kürzere Antworten |
| Roleplays | Vordefinierte Szenarien (Arzt, Restaurant, Bewerbung) |
| Characters | Historische/fiktive Charaktere als Gesprächspartner |
| Debates | Pro/Contra-Debatten zu Themen |
| Photo Mode | Bildbeschreibung und Diskussion |
| Sentence Mode | Einzelsatz-Übung mit Korrektur |

### 2.2 Call Mode – technische Umsetzung
```
User-Sprache → [STT: Whisper API / Native] → Text
    → [LLM: GPT-4o mit Call-Prompt] → Antwort-Text
    → [TTS: ElevenLabs / Azure] → Audio-Output
```
- Wahrscheinlich **WebRTC** für geringe Latenz
- Keine echte Telefonie – nur Simulation im App-UI

### 2.3 130+ Sprachen – technische Umsetzung
- **Nicht** 130 separate Modelle
- Wahrscheinlich **GPT-4o mit Sprach-Prompt**: "You are a [language] teacher..."
- Spracherkennung: Whisper API (unterstützt 99 Sprachen)

---

## 3. ELSA Speak – Architektur-Analyse

### 3.1 Pronunciation Scoring (Patent-geschützt!)
ELSA's Kern-IP ist der **Pronunciation Score Algorithmus**:
- Vergleicht Nutzer-Audio mit native speaker Referenz
- Bewertet: Phoneme, Intonation, Rhythmus, Wortbetonung
- **Patentierte Technologie** – NICHT kopierbar!

### 3.2 Interactive Avatars
- **Vordefinierte Szenarien** (Workplace, Interview, Dating, Meeting, Presentation)
- Avatar ist **animiertes PNG/Video** – kein Echtzeit-Rendering
- KI-generierte Dialoge innerhalb des Szenario-Rahmens

### 3.3 Technischer Stack
- **Proprietäre Speech Recognition** (nicht Standard-API)
- **Eigenes LLM-Fine-Tuning** für Aussprache-Bewertung
- Wahrscheinlich **PyTorch/TensorFlow** Modelle im Backend

---

## 4. Univerbal – Architektur-Analyse

### 4.1 CEFR-Integration
```
System Prompt enthält:
"Der Nutzer ist auf Level [A1-C2].
Verwende NUR Vokabular und Grammatik dieses Levels.
Bei A1-A2: Kurze Sätze, Präsens, Grundwortschatz
Bei B1-B2: Nebensätze, Perfekt, erweiterter Wortschatz
Bei C1-C2: Komplexe Strukturen, Konjunktiv, Fachwortschatz"
```

### 4.2 Custom Conversation Prompts
- Nutzer definiert eigenes Szenario ("Taxifahrer in Berlin")
- Wird als **System Prompt Injection** verwendet
- Gefiltert durch Moderation API

### 4.3 Schweizer Tech-Stack (DSGVO-konform)
- Y Combinator Startup → wahrscheinlich **GPT-4o via Azure EU**
- Azure Switzerland North Region für DSGVO-Compliance
- Kein US-Hosting

---

## 5. Übertragbare Erkenntnisse für WortWende

### 5.1 Prompt-Struktur (von allen übernommen)
```
System: Du bist Leo, ein Deutsch-Tutor. Der Nutzer spricht [Sprache].
        Erkläre Grammatik auf [Sprache], Beispiele auf Deutsch.
        Korrektur-Format: [KORREKTUR:original|korrigiert|erklärung]
        CEFR-Level: {level}
        Persönlichkeit: {personality}
```

### 5.2 Korrektur-Pipeline (von Praktika/Univerbal)
```
Eingabe → LanguageTool (lokal) → DeepSeek API → Strukturierte Korrektur → UI
```
- **Vorteil:** LanguageTool fängt 80% der Fehler lokal ab
- **DeepSeek** nur für semantische/Kontext-Fehler
- Spart API-Kosten und verbessert Latenz

### 5.3 Multi-Personality (von Praktika)
- 3 Persönlichkeiten als Prompt-Variante
- Kein separater API-Key oder Model
- Nutzer wählt im UI → wird als Parameter an API gesendet

### 5.4 Szenario-basiertes Lernen (von Unveribal/TalkPal)
- DTZ-Rollenspiele bereits vorhanden
- Ausbaubar: Alltagsszenarien, Berufsszenarien, Prüfungssimulation

---

## 6. Konkrete Prompt-Verbesserungen für WortWende

### Bisher (vereinfacht):
```
Du bist ein Deutsch-Tutor. Hilf dem Nutzer.
```

### Verbessert (nach Wettbewerber-Analyse):
```
Du bist Leo, ein persönlicher Deutsch-Tutor für [Niveau].

## SPRACHE
- Erklärungen: auf [Muttersprache]
- Beispiele: auf Deutsch mit Übersetzung

## KORREKTUREN (bei Fehlern antworten mit):
[KORREKTUR:original|korrigiert|erklärung]

## PERSÖNLICHKEIT: {streng|locker|lustig}
- Streng: Direkte Korrektur, Fokus auf Genauigkeit
- Locker: Ermutigend, Fehler sind okay
- Lustig: Humorvoll, mit Emojis und Witzen

## UNTERRICHT
1. Stelle eine Frage oder Übungsaufgabe
2. Warte auf Antwort
3. Korrigiere oder lobe
4. Gib eine kurze Erklärung
5. Nächste Frage
```

---

*Erstellt am 25.06.2026 – Nur für interne Verwendung*
