# Leistungsbeschreibung WortWende

**Stand:** 25.06.2026  
**Anbieter:** Tolga Günsal, [Adresse folgt]  
**Web:** https://wortwende.guenlab.de  
**Kontakt:** hallo@guenlab.de

---

## 1. Allgemeine Beschreibung

WortWende ist eine KI-gestützte Lernplattform für Deutsch als Fremdsprache (DaF). 
Die App kombiniert einen **KI-Sprachtutor („Leo")** mit strukturierten Lernpfaden 
von **A1 bis C1** nach dem Gemeinsamen Europäischen Referenzrahmen (GER/CEFR). 
Der KI-Tutor kommuniziert mit den Lernenden in **10 Muttersprachen** und bietet 
24/7 personalisierte Deutsch-Übungen per Chat.

---

## 2. Kernfunktionen

### 2.1 KI-Tutor „Leo"
| Funktion | Beschreibung |
|---|---|
| **24/7 Verfügbarkeit** | Der KI-Tutor ist rund um die Uhr erreichbar |
| **Chat-Modus** | Freie Fragen zu Deutsch (Grammatik, Wortschatz, Aussprache) |
| **Session-Modus** | Geführte Lernsessions zu 9 Themen (Dativ, Akkusativ, Perfekt, Präpositionen, Artikel, Satzbau, Alltag, Beruf, Rollenspiel) |
| **10 Muttersprachen** | Deutsch, Englisch, Türkisch, Russisch, Arabisch, Polnisch, Rumänisch, Ukrainisch, Albanisch, Kurdisch, Italienisch |
| **Spracheingabe** | Mikrofon-Eingabe via Web Speech API (Deutsch) |
| **Sprachausgabe** | Text-to-Speech der Tutor-Antworten (Deutsch) |
| **Echtzeit-Feedback** | Grammatik- und Rechtschreibkorrektur während der Konversation |
| **Übungsaufgaben** | Inline-Übungen: Multiple-Choice, Lückentexte, Satzbildung |
| **Session-XP** | Erfahrungspunkte für abgeschlossene Lernsessions |
| **Rate Limiting** | 10 kostenlose Sessions/Monat, 100 (Plus), 300 (Premium) |

### 2.2 Lernpfad (CEFR A1–C1)
| Funktion | Beschreibung |
|---|---|
| **5 Niveaustufen** | A1 (Anfänger) bis C1 (Fortgeschritten) |
| **Kurse & Lektionen** | Strukturierte Kurse mit Units, Lektionen und Übungen |
| **Fortschrittsverfolgung** | Visuelle Fortschrittsanzeige pro Kurs und Lektion |
| **Sequenzielles Freischalten** | Lektionen werden nacheinander freigeschaltet |

### 2.3 Einstufungstest
| Funktion | Beschreibung |
|---|---|
| **10 Fragen** | Über 5 CEFR-Level (A1–C1), je 2 pro Level |
| **2 Kompetenzen** | Wortschatz + Grammatik |
| **Ergebnis** | Empfohlenes Einstiegslevel mit Stärken/Schwächen-Analyse |
| **Ohne Anmeldung** | Test auch ohne Konto möglich, Ergebnisse werden gespeichert |

### 2.4 Vokabeltrainer
| Funktion | Beschreibung |
|---|---|
| **Level-Filter** | Vokabeln nach A1–C1 Niveau |
| **Suchfunktion** | Freitextsuche in der Vokabeldatenbank |
| **Mehrsprachige Übersetzung** | Übersetzungen in 10+ Sprachen |
| **Statistiken** | Gesamt, A1-A2, B1-C1 |

### 2.5 Grammatiktrainer
| Funktion | Beschreibung |
|---|---|
| **85+ Grammatikthemen** | Von Artikeln bis Konjunktiv II |
| **Erklärungen & Beispiele** | Jedes Thema mit deutscher Erklärung und Beispielsätzen |
| **Tipps** | Praktische Merkhilfen |

### 2.6 DTZ-Prüfungsvorbereitung
| Funktion | Beschreibung |
|---|---|
| **4 Kompetenzen** | Lesen, Hören, Schreiben, Sprechen |
| **2 Niveaustufen** | A2 und B1 |
| **Timer-basierte Tests** | Realistische Prüfungssimulation mit Zeitlimit |
| **Automatische Auswertung** | Sofortiges Ergebnis nach Testende |

### 2.7 Spaced Repetition (Karteikarten)
| Funktion | Beschreibung |
|---|---|
| **SM-2 Algorithmus** | Wissenschaftlich fundierte Wiederholungslogik |
| **Karteikarten** | Vorderseite/Rückseite mit Flip-Animation |
| **4 Bewertungsstufen** | Perfekt, Gut, Schwer, Vergessen |
| **Tastatur-Shortcuts** | Bedienung komplett per Tastatur möglich |

### 2.8 Gamification
| Funktion | Beschreibung |
|---|---|
| **20 Level** | 0–9.500 XP, von Anfänger bis Legende |
| **Tagesziel** | 50 XP pro Tag |
| **Streak (Serie)** | Tägliche Lernserie mit Bonus-Multiplikator |
| **Herzen-System** | 5 Herzen, Regeneration alle 30 Minuten |
| **Leaderboard** | Rangliste nach XP (Woche/Monat/Gesamt) |

---

## 3. Technische Spezifikation

| Merkmal | Details |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Datenbank** | PostgreSQL 16 |
| **KI-API** | DeepSeek V4 (konfigurierbar) |
| **Sprachprüfung** | LanguageTool (selbst gehostet) |
| **Übersetzung** | LibreTranslate (selbst gehostet) |
| **Authentifizierung** | NextAuth.js v5 (E-Mail + Google OAuth) |
| **Hosting** | Docker auf ZimaOS (eigene Infrastruktur) |
| **Verfügbarkeit** | 99% uptime (angestrebt) |
| **Verschlüsselung** | TLS 1.3 via Cloudflare Tunnel |
| **Datenschutz** | DSGVO-konform, Server in Deutschland |

---

## 4. Datenschutz & Sicherheit

| Merkmal | Details |
|---|---|
| **DSGVO-Konformität** | Vollständige Umsetzung der EU-DSGVO |
| **Auftragsverarbeitung** | AVV mit DeepSeek (Art. 28 DSGVO) |
| **Datenexport** | JSON-Export aller Nutzerdaten (Art. 20 DSGVO) |
| **Kontolöschung** | Vollständige Datenlöschung (Art. 17 DSGVO) |
| **Cookie-Freiheit** | Nur technisch notwendige Cookies |
| **Content Security Policy** | Strikte CSP-Header |
| **CORS** | Separater API-Host mit CORS-Schutz |
| **API-Key-Authentifizierung** | Scope-basierte API-Keys (read/write/admin) |

---

## 5. Preise & Tarife

| Tarif | Sessions/Monat | Preis |
|---|---|---|
| **Kostenlos** | 10 Sessions | 0 € |
| **Plus** | 100 Sessions | 8,99 €/Monat |
| **Premium** | 300 Sessions | 12,99 €/Monat |
| **Premium Jahres** | 300 Sessions/Monat | 99,99 €/Jahr |

---

## 6. Unterstützte Sprachen

Deutsch (Zielsprache), Englisch, Türkçe, Русский, العربية, Polski, Română, 
Українська, Shqip, Kurdî (Kurmancî), Italiano

---

## 7. Systemvoraussetzungen

| Plattform | Anforderung |
|---|---|
| **Web** | Moderner Browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+) |
| **Mikrofon** | Für Spracheingabe erforderlich |
| **Internet** | Breitbandverbindung empfohlen |

---

## 8. Support

| Kanal | Erreichbarkeit |
|---|---|
| **E-Mail** | hallo@guenlab.de |
| **Antwortzeit** | Innerhalb von 48 Stunden (werktags) |

---

*Diese Leistungsbeschreibung kann ohne vorherige Ankündigung aktualisiert werden.*
*Die aktuelle Version ist stets unter https://wortwende.guenlab.de einsehbar.*
