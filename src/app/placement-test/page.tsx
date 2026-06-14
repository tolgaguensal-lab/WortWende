"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  level: string;
  type: "grammar" | "vocabulary" | "reading" | "listening";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const allQuestions: Question[] = [
  // ===== A1 (25 Fragen) =====
  { id: 1, level: "A1", type: "grammar", question: '"Ich ___ aus der Türkei."', options: ["komme", "kommst", "kommt", "kommen"], correctAnswer: 0, explanation: "Konjugation: ich komme" },
  { id: 2, level: "A1", type: "vocabulary", question: 'Was bedeutet "Tisch"?', options: ["chair", "table", "door", "window"], correctAnswer: 1 },
  { id: 3, level: "A1", type: "grammar", question: '"Das ist ___ Frau."', options: ["ein", "eine", "einer", "eines"], correctAnswer: 1, explanation: "Frau ist feminin → eine" },
  { id: 4, level: "A1", type: "reading", question: '"Hallo, ich heiße Maria. Ich wohne in Berlin." Wer wohnt in Berlin?', options: ["Hallo", "Maria", "Berlin", "Ich"], correctAnswer: 1 },
  { id: 5, level: "A1", type: "vocabulary", question: 'Welcher Tag kommt nach "Mittwoch"?', options: ["Dienstag", "Donnerstag", "Freitag", "Montag"], correctAnswer: 1 },
  { id: 6, level: "A1", type: "grammar", question: '"Ich ___ nicht." (nicht/kein)', options: ["nicht", "kein", "keine", "keinen"], correctAnswer: 0, explanation: "'nicht' verneint Verben" },
  { id: 7, level: "A1", type: "vocabulary", question: 'Was bedeutet "das Buch"?', options: ["the pen", "the book", "the bag", "the phone"], correctAnswer: 1 },
  { id: 8, level: "A1", type: "grammar", question: '"___ ist das?" – "Das ist mein Auto."', options: ["Wer", "Was", "Wo", "Wie"], correctAnswer: 1 },
  { id: 9, level: "A1", type: "reading", question: '"Ich habe Hunger." Was möchte die Person?', options: ["schlafen", "essen", "arbeiten", "gehen"], correctAnswer: 1 },
  { id: 10, level: "A1", type: "vocabulary", question: 'Was bedeutet "groß"?', options: ["small", "big", "fast", "good"], correctAnswer: 1 },
  { id: 11, level: "A1", type: "grammar", question: '"Wir ___ im Park."', options: ["spiele", "spielst", "spielen", "spielt"], correctAnswer: 2 },
  { id: 12, level: "A1", type: "vocabulary", question: 'Was bedeutet "die Katze"?', options: ["dog", "cat", "bird", "fish"], correctAnswer: 1 },
  { id: 13, level: "A1", type: "grammar", question: '"Er ___ einen neuen Hut."', options: ["haben", "hat", "habe", "hatte"], correctAnswer: 1 },
  { id: 14, level: "A1", type: "reading", question: '"Der Zug fährt um 10 Uhr." Wann fährt der Zug?', options: ["9 Uhr", "10 Uhr", "11 Uhr", "12 Uhr"], correctAnswer: 1 },
  { id: 15, level: "A1", type: "vocabulary", question: 'Was bedeutet "die Milch"?', options: ["water", "juice", "milk", "coffee"], correctAnswer: 2 },
  { id: 16, level: "A1", type: "grammar", question: '"Ich gehe ___ Supermarkt."', options: ["der", "die", "den", "dem"], correctAnswer: 2, explanation: "Akkusativ: den Supermarkt" },
  { id: 17, level: "A1", type: "vocabulary", question: 'Was bedeutet "guten Morgen"?', options: ["good evening", "good morning", "good night", "goodbye"], correctAnswer: 1 },
  { id: 18, level: "A1", type: "grammar", question: '"___ ist dein Name?" – "Ich heiße Ali."', options: ["Wer", "Was", "Wo", "Wie"], correctAnswer: 0 },
  { id: 19, level: "A1", type: "reading", question: '"Bitte öffnen Sie das Fenster." Was soll man tun?', options: ["sitzen", "das Fenster öffnen", "essen", "schlafen"], correctAnswer: 1 },
  { id: 20, level: "A1", type: "vocabulary", question: 'Was bedeutet "das Wasser"?', options: ["the bread", "the water", "the milk", "the juice"], correctAnswer: 1 },
  { id: 21, level: "A1", type: "grammar", question: '"Ich bin ___ Jahre alt."', options: ["gut", "groß", "fünf", "hier"], correctAnswer: 2 },
  { id: 22, level: "A1", type: "vocabulary", question: 'Was bedeutet "danke"?', options: ["hello", "goodbye", "thank you", "please"], correctAnswer: 2 },
  { id: 23, level: "A1", type: "grammar", question: '"Sie ___ eine Ärztin."', options: ["bin", "bist", "ist", "sind"], correctAnswer: 3 },
  { id: 24, level: "A1", type: "reading", question: '"Kaffee oder Tee?" – "Kaffee, bitte." Was bestellt die Person?', options: ["Kaffee", "Tee", "Wasser", "Milch"], correctAnswer: 0 },
  { id: 25, level: "A1", type: "vocabulary", question: 'Was bedeutet "der Stuhl"?', options: ["table", "chair", "bed", "sofa"], correctAnswer: 1 },

  // ===== A2 (25 Fragen) =====
  { id: 26, level: "A2", type: "grammar", question: '"Gestern ___ ich im Kino."', options: ["bin", "war", "habe", "hatte"], correctAnswer: 1, explanation: "Plusquamperfekt: war" },
  { id: 27, level: "A2", type: "vocabulary", question: 'Was bedeutet "der Termin"?', options: ["the train", "the appointment", "the money", "the letter"], correctAnswer: 1 },
  { id: 28, level: "A2", type: "grammar", question: '"Ich möchte ___ Arzttermin vereinbaren."', options: ["einen", "eine", "einem", "einer"], correctAnswer: 0 },
  { id: 29, level: "A2", type: "reading", question: '"Die Wohnung hat 3 Zimmer, eine Küche und ein Bad. Die Miete ist 850 Euro warm." Wie viele Zimmer hat die Wohnung?', options: ["2", "3", "4", "5"], correctAnswer: 1 },
  { id: 30, level: "A2", type: "grammar", question: '"Kannst du mir ___ helfen?"', options: ["bitte", "mal", "danke", "auch"], correctAnswer: 0 },
  { id: 31, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Fahrkarte"?', options: ["the car", "the ticket", "the bicycle", "the road"], correctAnswer: 1 },
  { id: 32, level: "A2", type: "grammar", question: '"Ich ___ nach Berlin gefahren."', options: ["bin", "habe", "war", "hatte"], correctAnswer: 0, explanation: "Perfekt mit sein: Bewegungsverben" },
  { id: 33, level: "A2", type: "reading", question: '"Der Supermarkt hat heute von 8 bis 20 Uhr geöffnet." Wann schließt der Supermarkt?', options: ["8 Uhr", "18 Uhr", "20 Uhr", "22 Uhr"], correctAnswer: 2 },
  { id: 34, level: "A2", type: "grammar", question: '"Er ist ___ als ich."', options: ["groß", "größer", "am größten", "größte"], correctAnswer: 1, explanation: "Komparativ: größer als" },
  { id: 35, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Übersetzung"?', options: ["the conversation", "the translation", "the explanation", "the discussion"], correctAnswer: 1 },
  { id: 36, level: "A2", type: "grammar", question: '"Wir ___ uns auf den Urlaub."', options: ["freuen", "freut", "freue", "freut euch"], correctAnswer: 0, explanation: "Reflexiv: wir freuen uns" },
  { id: 37, level: "A2", type: "reading", question: '"Bitte bringen Sie Ihren Reisepass zum Termin mit." Was muss man mitbringen?', options: ["den Führerschein", "den Reisepass", "das Geld", "den Schlüssel"], correctAnswer: 1 },
  { id: 38, level: "A2", type: "grammar", question: '"Das Buch ist ___ dem Regal."', options: ["in", "auf", "unter", "neben"], correctAnswer: 1 },
  { id: 39, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Krankenkasse"?', options: ["the hospital", "the health insurance", "the pharmacy", "the doctor"], correctAnswer: 1 },
  { id: 40, level: "A2", type: "grammar", question: '"Ich habe ___ als 100 Euro."', options: ["weniger", "wenig", "wenigstens", "wenigerer"], correctAnswer: 0 },
  { id: 41, level: "A2", type: "reading", question: '"Der Zug hat 20 Minuten Verspätung." Was ist los?', options: ["Der Zug kommt pünktlich", "Der Zug kommt später", "Der Zug fährt nicht", "Der Zug ist weg"], correctAnswer: 1 },
  { id: 42, level: "A2", type: "grammar", question: '"Wenn ich reich ___, würde ich reisen."', options: ["bin", "wäre", "war", "werde"], correctAnswer: 1, explanation: "Konjunktiv II: wäre" },
  { id: 43, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Bewerbung"?', options: ["the application", "the invitation", "the application letter", "the application form"], correctAnswer: 0 },
  { id: 44, level: "A2", type: "grammar", question: '"Ich habe ein ___ Buch gelesen."', options: ["gut", "gutes", "guten", "guter"], correctAnswer: 1 },
  { id: 45, level: "A2", type: "reading", question: '"Der Film beginnt um 20 Uhr. Bitte kommen Sie 15 Minuten früher." Wann sollte man kommen?', options: ["19:45", "20:00", "20:15", "20:30"], correctAnswer: 0 },
  { id: 46, level: "A2", type: "grammar", question: '"Das ist das Auto ___ Nachbarn."', options: ["von", "aus", "bei", "mit"], correctAnswer: 0 },
  { id: 47, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Bescheinigung"?', options: ["the certificate", "the visit", "the inspection", "the confirmation"], correctAnswer: 0 },
  { id: 48, level: "A2", type: "grammar", question: '"Wir fahren ___ dem Auto."', options: ["mit", "in", "auf", "bei"], correctAnswer: 0 },
  { id: 49, level: "A2", type: "reading", question: '"Bitte füllen Sie das Formular aus und bringen Sie es zumorrow mit." Was soll man tun?', options: ["Das Formular ausfüllen", "Das Formular morgen bringen", "Das Formular ausfüllen und morgen bringen", "Nichts tun"], correctAnswer: 2 },
  { id: 50, level: "A2", type: "vocabulary", question: 'Was bedeutet "die Kündigung"?', options: ["the termination", "the application", "the confirmation", "the invitation"], correctAnswer: 0 },

  // ===== B1 (25 Fragen) =====
  { id: 51, level: "B1", type: "grammar", question: '"Wenn ich Zeit ___, würde ich mehr Deutsch lernen."', options: ["habe", "hätte", "hatte", "haben"], correctAnswer: 1, explanation: "Konjunktiv II: hätte" },
  { id: 52, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Arbeitserlaubnis"?', options: ["the working hours", "the work permit", "the job interview", "the salary"], correctAnswer: 1 },
  { id: 53, level: "B1", type: "grammar", question: '"Der Mann, ___ gestern angerufen hat, war mein Chef."', options: ["der", "den", "dem", "dessen"], correctAnswer: 0 },
  { id: 54, level: "B1", type: "reading", question: '"Sehr geehrte Damen und Herren, hiermit bewerbe ich mich um die Stelle als Verkäufer." Das ist ein ___.', options: ["Vertrag", "Brief", "Antrag", "Formular"], correctAnswer: 1 },
  { id: 55, level: "B1", type: "grammar", question: '"Ich habe mich ___ die Stelle beworben."', options: ["für", "um", "auf", "über"], correctAnswer: 1 },
  { id: 56, level: "B1", type: "vocabulary", question: 'Was bedeutet "die AufenthaltsGenehmigung"?', options: ["the residence permit", "the hotel reservation", "the travel visa", "the passport"], correctAnswer: 0 },
  { id: 57, level: "B1", type: "grammar", question: '"Obwohl es regnet, ___ ich zur Arbeit."', options: ["gehe", "ging", "gegangen", "würde gehen"], correctAnswer: 0 },
  { id: 58, level: "B1", type: "reading", question: '"Der Vertrag läuft zwei Jahre und kann danach verlängert werden." Wie lange gilt der Vertrag?', options: ["1 Jahr", "2 Jahre", "3 Jahre", "Unbegrenzt"], correctAnswer: 1 },
  { id: 59, level: "B1", type: "grammar", question: '"Ich finde, dass du mehr ___ solltest."', options: ["lernst", "lernen", "gelernt", "lernst"], correctAnswer: 1 },
  { id: 60, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Steuererklärung"?', options: ["the tax return", "the tax rate", "the tax office", "the tax form"], correctAnswer: 0 },
  { id: 61, level: "B1", type: "grammar", question: '"Das Buch, ___ ich gestern gelesen habe, war spannend."', options: ["das", "die", "den", "dem"], correctAnswer: 0 },
  { id: 62, level: "B1", type: "reading", question: '"Die Besprechung wurde auf nächsten Dienstag verschoben." Was ist passiert?', options: ["Die Besprechung findet heute statt", "Die Besprechung wurde abgesagt", "Die Besprechung wurde verschoben", "Die Besprechung wurde abgehlossen"], correctAnswer: 2 },
  { id: 63, level: "B1", type: "grammar", question: '"Ich würde gern ___ Amerika fliegen."', options: ["in", "nach", "zu", "auf"], correctAnswer: 1 },
  { id: 64, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Weiterbildung"?', options: ["the further education", "the continuing education", "the further training", "the continuing training"], correctAnswer: 1 },
  { id: 65, level: "B1", type: "grammar", question: '"Er hat gesagt, er ___ morgen kommen."', options: ["wird", "würde", "werde", "wäre"], correctAnswer: 2, explanation: "Konjunktiv I: werde" },
  { id: 66, level: "B1", type: "reading", question: '"Bitte beachten Sie, dass die Unterlagen bis zum 15. Mai eingereicht werden müssen." Was ist die Frist?', options: ["15. April", "15. Mai", "15. Juni", "15. Juli"], correctAnswer: 1 },
  { id: 67, level: "B1", type: "grammar", question: '"Ich bin ___ als ich gedacht habe."', options: ["spät", "später", "am spätesten", "spätestens"], correctAnswer: 1 },
  { id: 68, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Zeugenaussage"?', options: ["the testimonial", "the witness statement", "the recommendation", "the certificate"], correctAnswer: 1 },
  { id: 69, level: "B1", type: "grammar", question: '"Das Projekt wurde ___ drei Monaten abgeschlossen."', options: ["in", "nach", "vor", "während"], correctAnswer: 1 },
  { id: 70, level: "B1", type: "reading", question: '"Die Mieter werden gebeten, den Lärm nach 22 Uhr zu vermeiden." Was sollen die Mieter tun?', options: ["Lärm machen", "Lärm nach 22 Uhr vermeiden", "Lärm vermeiden", "Gar nichts tun"], correctAnswer: 1 },
  { id: 71, level: "B1", type: "grammar", question: '"Die Firma sucht einen Mitarbeiter ___ guten Deutschkenntnissen."', options: ["mit", "bei", "durch", "für"], correctAnswer: 0 },
  { id: 72, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Grundausstattung"?', options: ["the basic equipment", "the basic furniture", "the basic needs", "the basic requirements"], correctAnswer: 0 },
  { id: 73, level: "B1", type: "grammar", question: '"___ du mir bitte helfen?"', options: ["Kannst", "Würdest", "Solltest", "Möchtest"], correctAnswer: 1 },
  { id: 74, level: "B1", type: "reading", question: '"Der Arzt hat empfohlen, drei Monate lang Tabletten zu nehmen." Was hat der Arzt empfohlen?', options: ["Zwei Monate lang Tabletten nehmen", "Drei Monate lang Tabletten nehmen", "Vier Monate lang Tabletten nehmen", "Fünf Monate lang Tabletten nehmen"], correctAnswer: 1 },
  { id: 75, level: "B1", type: "vocabulary", question: 'Was bedeutet "die Nachzahlung"?', options: ["the prepayment", "the back payment", "the payment in advance", "the partial payment"], correctAnswer: 1 },

  // ===== B2 (25 Fragen) =====
  { id: 76, level: "B2", type: "grammar", question: '"Der Vertrag, ___ wir gestern unterschrieben haben, ist gültig."', options: ["der", "den", "dem", "dessen"], correctAnswer: 1 },
  { id: 77, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Kündigungsfrist"?', options: ["the notice period", "the termination letter", "the contract clause", "the severance pay"], correctAnswer: 0 },
  { id: 78, level: "B2", type: "grammar", question: '"Es wird erwartet, dass ___ pünktlich erscheint."', options: ["man", "er", "wer", "jemand"], correctAnswer: 0 },
  { id: 79, level: "B2", type: "reading", question: '"Laut Geschäftsbericht konnte das Unternehmen seinen Umsatz im letzten Quartal um 15% steigern." Was ist passiert?', options: ["Der Umsatz ist gefallen", "Der Umsatz ist gestiegen", "Der Umsatz ist gleich", "Das Unternehmen ist pleite"], correctAnswer: 1 },
  { id: 80, level: "B2", type: "grammar", question: '"Die Ergebnisse wurden ___ dem Experiment analysiert."', options: ["während", "nach", "bevor", "seit"], correctAnswer: 1 },
  { id: 81, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Haftungsbeschränkung"?', options: ["the liability limitation", "the insurance policy", "the security deposit", "the damage compensation"], correctAnswer: 0 },
  { id: 82, level: "B2", type: "grammar", question: '"Er hätte das Problem ___, wenn er mehr Zeit gehabt hätte."', options: ["lösen", "gelöst", "zu lösen", "lösen können"], correctAnswer: 1 },
  { id: 83, level: "B2", type: "reading", question: '"Die Studie kommt zu dem Schluss, dass regelmäßiges Sporttreiben das Risiko von Herz-Kreislauf-Erkrankungen um 30% senkt." Was ist das Ergebnis?', options: ["Sport ist gefährlich", "Sport senkt das Risiko", "Sport erhöht das Risiko", "Sport hat keinen Einfluss"], correctAnswer: 1 },
  { id: 84, level: "B2", type: "grammar", question: '"Der Bericht, ___ gestern vorgelegt wurde, enthält wichtige Informationen."', options: ["der", "den", "dem", "dessen"], correctAnswer: 1 },
  { id: 85, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Betriebskosten"?', options: ["the operating costs", "the startup costs", "the maintenance costs", "the overhead costs"], correctAnswer: 0 },
  { id: 86, level: "B2", type: "grammar", question: '"___ der Schwierigkeiten haben wir das Projekt abgeschlossen."', options: ["Trotz", "Wegen", "Während", "Statt"], correctAnswer: 0 },
  { id: 87, level: "B2", type: "reading", question: '"Die Regierung hat neue Maßnahmen zum Klimaschutz angekündigt." Was hat die Regierung getan?', options: ["Neue Maßnahmen abgeschafft", "Neue Maßnahmen angekündigt", "Alte Maßnahmen beibehalten", "Nichts getan"], correctAnswer: 1 },
  { id: 88, level: "B2", type: "grammar", question: '"Man geht davon aus, dass die Preise ___ werden."', options: ["steigen", "steigend", "gestiegen", "steigend sein"], correctAnswer: 0 },
  { id: 89, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Leistungskontrolle"?', options: ["the performance review", "the performance test", "the performance improvement", "the performance management"], correctAnswer: 0 },
  { id: 90, level: "B2", type: "grammar", question: '"Das Verfahren, ___ das Unternehmen angewendet hat, ist nicht ungewöhnlich."', options: ["das", "die", "den", "dem"], correctAnswer: 0 },
  { id: 91, level: "B2", type: "reading", question: '"Die Fachleute warnen davor, die Ergebnisse zu überinterpretieren." Was sollen die Leser nicht tun?', options: ["Die Ergebnisse ignorieren", "Die Ergebnisse überinterpretieren", "Die Ergebnisse akzeptieren", "Die Ergebnisse anzweifeln"], correctAnswer: 1 },
  { id: 92, level: "B2", type: "grammar", question: '"Es ist unklar, ob die Maßnahmen ___ ausreichend sein werden."', options: ["sich als", "als", "von", "auf"], correctAnswer: 0 },
  { id: 93, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Rechtsgrundlage"?', options: ["the legal basis", "the legal document", "the legal procedure", "the legal consequence"], correctAnswer: 0 },
  { id: 94, level: "B2", type: "grammar", question: '"Die Firma hat den Vertrag ___, weil die Bedingungen nicht erfüllt wurden."', options: ["aufgelöst", "aufgelöst hat", "aufzulösen", "zu lösen"], correctAnswer: 0 },
  { id: 95, level: "B2", type: "reading", question: '"Das Urteil des Gerichts wurde von beiden Parteien akzeptiert." Was ist passiert?', options: ["Das Urteil wurde abgelehnt", "Das Urteil wurde akzeptiert", "Das Urteil wurde angefochten", "Das Urteil wurde aufgehoben"], correctAnswer: 1 },
  { id: 96, level: "B2", type: "grammar", question: '"Hinsichtlich der Kosten ___ wir einen Kompromiss schließen."', options: ["müssen", "muss", "mussten", "musste"], correctAnswer: 0 },
  { id: 97, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Verhandlungsführer"?', options: ["the negotiator", "the negotiation leader", "the negotiation team", "the negotiation chair"], correctAnswer: 1 },
  { id: 98, level: "B2", type: "grammar", question: '"Das Dokument, ___ die Basis für unsere Entscheidung bildet, ist umfangreich."', options: ["das", "die", "den", "dem"], correctAnswer: 0 },
  { id: 99, level: "B2", type: "reading", question: '"Die Analyse zeigt, dass die Maßnahmen die erwarteten Ergebnisse erzielt haben." Was ist das Ergebnis?', options: ["Die Maßnahmen waren wirkungslos", "Die Maßnahmen waren erfolgreich", "Die Maßnahmen waren teilweise erfolgreich", "Die Maßnahmen waren negativ"], correctAnswer: 1 },
  { id: 100, level: "B2", type: "vocabulary", question: 'Was bedeutet "die Grundsatzentscheidung"?', options: ["the basic decision", "the fundamental decision", "the primary decision", "the main decision"], correctAnswer: 1 },

  // ===== C1 (25 Fragen) =====
  { id: 101, level: "C1", type: "grammar", question: '"Die Ergebnisse der Studie ___ in mehreren Publikationen veröffentlicht."', options: ["wurden", "worden", "waren", "haben"], correctAnswer: 0 },
  { id: 102, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Grundsatzdebatte"?', options: ["the basic debate", "the fundamental debate", "the primary discussion", "the main argument"], correctAnswer: 1 },
  { id: 103, level: "C1", type: "grammar", question: '"Abgesehen von den Kosten ___ das Projekt sehr erfolgreich."', options: ["war", "waren", "wurde", "wurden"], correctAnswer: 0 },
  { id: 104, level: "C1", type: "reading", question: '"Die Experten empfehlen, die Maßnahmen fortzusetzen, da die bisherigen Ergebnisse vielversprechend sind." Was ist die Empfehlung?', options: ["Maßnahmen einstellen", "Maßnahmen fortsetzen", "Maßnahmen ändern", "Maßnahmen überprüfen"], correctAnswer: 1 },
  { id: 105, level: "C1", type: "grammar", question: '"Nicht nur ___ die Kosten gestiegen, sondern auch die Qualität hat zugenommen."', options: ["sind", "haben", "ist", "hat"], correctAnswer: 0 },
  { id: 106, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Zweckmäßigkeit"?', options: ["the expediency", "the usefulness", "the suitability", "the appropriateness"], correctAnswer: 2 },
  { id: 107, level: "C1", type: "grammar", question: '"Die Verhandlungen, ___ vor Monaten begannen, sind noch immer nicht abgeschlossen."', options: ["die", "den", "dem", "deren"], correctAnswer: 0 },
  { id: 108, level: "C1", type: "reading", question: '"Die Umweltorganisation fordert, den CO2-Ausstoß bis 2030 um 50% zu reduzieren." Was ist das Ziel?', options: ["CO2-Ausstoß erhöhen", "CO2-Ausstoß um 50% reduzieren", "CO2-Ausstoß beibehalten", "CO2-Ausstoß komplett stoppen"], correctAnswer: 1 },
  { id: 109, level: "C1", type: "grammar", question: '"Hätte ich die Möglichkeit, würde ich das Angebot ___."', options: ["angenommen", "annehmen", "angenommen haben", "zu nehmen"], correctAnswer: 2 },
  { id: 110, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Zwischenbilanz"?', options: ["the interim balance", "the final balance", "the preliminary result", "the preliminary assessment"], correctAnswer: 3 },
  { id: 111, level: "C1", type: "grammar", question: '"Infolgedessen ___ die Verantwortlichen die Strategie angepasst."', options: ["haben", "hat", "wurden", "wurde"], correctAnswer: 0 },
  { id: 112, level: "C1", type: "reading", question: '"Die Kommission kam zu dem Ergebnis, dass die bestehenden Regelungen ausreichend sind." Was ist das Ergebnis?', options: ["Neue Regelungen nötig", "Bestehende Regelungen ausreichend", "Regelungen abschaffen", "Regelungen verschärfen"], correctAnswer: 1 },
  { id: 113, level: "C1", type: "grammar", question: '"Das Projekt, ___ Kosten sich als höher als erwartet herausstellen, wird fortgesetzt."', options: ["dessen", "deren", "dem", "den"], correctAnswer: 0 },
  { id: 114, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Gesamtverantwortung"?', options: ["the partial responsibility", "the overall responsibility", "the joint responsibility", "the legal responsibility"], correctAnswer: 1 },
  { id: 115, level: "C1", type: "grammar", question: '"Die Daten, ___ die Forscher gesammelt haben, bestätigen die Hypothese."', options: ["die", "den", "dem", "deren"], correctAnswer: 0 },
  { id: 116, level: "C1", type: "reading", question: '"Der Bericht weist darauf hin, dass die Umsetzung der Empfehlungen noch drei Jahre dauern wird." Was steht im Bericht?', options: ["Empfehlungen sofort umsetzen", "Umsetzung dauert noch drei Jahre", "Empfehlungen sind irrelevant", "Umsetzung ist abgeschlossen"], correctAnswer: 1 },
  { id: 117, level: "C1", type: "grammar", question: '"Trotz der Schwierigkeiten ___ das Team das Ziel erreicht."', options: ["hat", "haben", "wurde", "wurden"], correctAnswer: 0 },
  { id: 118, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Leistungsbereitschaft"?', options: ["the willingness to perform", "the ability to perform", "the need to perform", "the chance to perform"], correctAnswer: 0 },
  { id: 119, level: "C1", type: "grammar", question: '"Man kann davon ausgehen, dass die Maßnahmen ___ nachhaltig sind."', options: ["sich als", "von", "auf", "für"], correctAnswer: 0 },
  { id: 120, level: "C1", type: "reading", question: '"Die Ergebnisse der Studie wurden in mehreren internationalen Fachzeitschriften veröffentlicht." Was ist passiert?', options: ["Studie wurde abgeschlossen", "Ergebnisse wurden veröffentlicht", "Studie wurde abgelehnt", "Ergebnisse wurden ignoriert"], correctAnswer: 1 },
  { id: 121, level: "C1", type: "grammar", question: '"Nichtsdestotrotz ___ die Dringlichkeit der Situation besteht unverändert."', options: ["besteht", "bestehen", "bestand", "bestanden"], correctAnswer: 0 },
  { id: 122, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Fortschreibung"?', options: ["the correction", "the update", "the continuation", "the revision"], correctAnswer: 1 },
  { id: 123, level: "C1", type: "grammar", question: '"Gleichwohl ___ die Entscheidung nicht unwesentlich."', options: ["ist", "sind", "war", "waren"], correctAnswer: 0 },
  { id: 124, level: "C1", type: "reading", question: '"Die Kommission betont die Notwendigkeit einer einheitlichen Vorgehensweise." Was ist wichtig?', options: ["Individuelle Vorgehensweise", "Einheitliche Vorgehensweise", "Verschiedene Vorgehensweisen", "Keine Vorgehensweise"], correctAnswer: 1 },
  { id: 125, level: "C1", type: "vocabulary", question: 'Was bedeutet "die Gesamtverantwortung"?', options: ["the partial responsibility", "the overall responsibility", "the joint responsibility", "the legal responsibility"], correctAnswer: 1 },
];

const MAX_QUESTIONS = 30;
const MIN_QUESTIONS = 25;
const CORRECT_STREAK_UP = 3;
const WRONG_STREAK_DOWN = 2;
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

function getLevelIndex(level: string): number {
  return LEVELS.indexOf(level);
}

function buildAdaptiveTest(): Question[] {
  const selected: Question[] = [];
  const usedIds = new Set<number>();
  let currentLevelIdx = 0;
  let correctStreak = 0;
  let wrongStreak = 0;

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const level = LEVELS[currentLevelIdx];
    const available = allQuestions.filter((q) => q.level === level && !usedIds.has(q.id));

    if (available.length === 0) {
      const fallback = allQuestions.filter((q) => !usedIds.has(q.id));
      if (fallback.length === 0) break;
      const pick = fallback[Math.floor(Math.random() * fallback.length)];
      selected.push(pick);
      usedIds.add(pick.id);
      continue;
    }

    const pick = available[Math.floor(Math.random() * available.length)];
    selected.push(pick);
    usedIds.add(pick.id);

    if (i < MIN_QUESTIONS - 1) continue;

    const correct = selected[selected.length - 1].correctAnswer === selected[selected.length - 1].correctAnswer;

    if (correct) {
      correctStreak++;
      wrongStreak = 0;
      if (correctStreak >= CORRECT_STREAK_UP && currentLevelIdx < LEVELS.length - 1) {
        currentLevelIdx++;
        correctStreak = 0;
      }
    } else {
      wrongStreak++;
      correctStreak = 0;
      if (wrongStreak >= WRONG_STREAK_DOWN && currentLevelIdx > 0) {
        currentLevelIdx--;
        wrongStreak = 0;
      }
    }
  }

  return selected;
}

function calculateResult(questions: Question[], answers: number[]): string {
  const levelScores: Record<string, { correct: number; total: number }> = {};
  for (const l of LEVELS) levelScores[l] = { correct: 0, total: 0 };

  questions.forEach((q, i) => {
    if (!levelScores[q.level]) levelScores[q.level] = { correct: 0, total: 0 };
    levelScores[q.level].total++;
    if (answers[i] === q.correctAnswer) {
      levelScores[q.level].correct++;
    }
  });

  let recommendedLevel = "A1";
  for (const level of LEVELS) {
    const s = levelScores[level];
    if (s && s.total > 0 && s.correct / s.total >= 0.6) {
      recommendedLevel = level;
    }
  }

  if (recommendedLevel === "B2" && levelScores["B2"] && levelScores["B2"].total > 0 && levelScores["B2"].correct / levelScores["B2"].total >= 0.8) {
    recommendedLevel = "C1";
  }

  return recommendedLevel;
}

export default function PlacementTestPage() {
  const router = useRouter();
  const [questions] = useState<Question[]>(() => buildAdaptiveTest());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const q = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const saveResult = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    const level = calculateResult(questions, answers);
    try {
      const res = await fetch("/api/placement-test/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: answers.filter((a, i) => a === questions[i].correctAnswer).length, level, answers }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      setSaved(true);
    } catch {
      setSaveError("Ergebnis konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  }, [questions, answers]);

  useEffect(() => {
    if (!isComplete || saved || saving) return;
    saveResult();
  }, [isComplete, saved, saving, saveResult]);

  const handleAnswer = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const result = calculateResult(questions, answers);
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const levelScores: Record<string, { correct: number; total: number }> = {};
    for (const l of LEVELS) levelScores[l] = { correct: 0, total: 0 };
    questions.forEach((q, i) => {
      levelScores[q.level].total++;
      if (answers[i] === q.correctAnswer) levelScores[q.level].correct++;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold mb-2">Dein Ergebnis</h1>
            <p className="text-muted-foreground mb-4">Basierend auf {questions.length} Fragen</p>

            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-5xl font-bold py-6 rounded-xl mb-4">
              {result}
            </div>

            <div className="flex justify-center gap-4 mb-6 text-sm text-muted-foreground">
              <span>{score}/{questions.length} richtig</span>
              <span>{minutes}:{seconds.toString().padStart(2, "0")} Minuten</span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {LEVELS.map((l) => {
                const s = levelScores[l];
                const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={l} className={`text-center p-2 rounded-lg ${l === result ? "bg-blue-100 dark:bg-blue-900/30 font-bold" : "bg-gray-50 dark:bg-gray-800"}`}>
                    <div className="text-xs font-medium">{l}</div>
                    <div className="text-lg font-bold">{pct}%</div>
                    <div className="text-xs text-muted-foreground">{s?.correct}/{s?.total}</div>
                  </div>
                );
              })}
            </div>

            {saving && <div className="text-sm text-muted-foreground mb-4 animate-pulse">Speichere Ergebnis...</div>}
            {saveError && <div className="text-sm text-red-500 mb-4">{saveError}</div>}

            <p className="text-sm text-muted-foreground mb-6">
              {result === "A1" && "Du bist Anfänger. Starte mit den Grundlagen."}
              {result === "A2" && "Du hast grundlegende Kenntnisse. Baue sie aus."}
              {result === "B1" && "Gut! Du kannst dich im Alltag verständigen."}
              {result === "B2" && "Sehr gut! Du bist bereit für komplexe Themen."}
              {result === "C1" && "Hervorragend! Du hast fortgeschrittene Kenntnisse."}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push(`/learn?level=${result}`)} className="w-full text-lg py-6" disabled={saving}>
                Kurs auf Niveau {result} starten
              </Button>
              <button onClick={() => router.push("/onboarding")} className="text-sm text-muted-foreground hover:underline">
                Ergebnisse überspringen, Sprache wählen
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Frage {currentQuestion + 1} von {questions.length}</span>
              <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-4 flex gap-2">
            <Badge variant="secondary">{q.type === "grammar" ? "Grammatik" : q.type === "vocabulary" ? "Wortschatz" : q.type === "reading" ? "Lesen" : "Hören"}</Badge>
            <Badge variant="outline">{q.level}</Badge>
          </div>

          <h2 className="text-xl font-semibold mb-6">{q.question}</h2>

          <div className="space-y-3 mb-8">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedOption === idx
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>

          <Button onClick={handleAnswer} disabled={selectedOption === null} className="w-full py-6 text-lg">
            {currentQuestion + 1 < questions.length ? "Weiter" : "Ergebnis anzeigen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
