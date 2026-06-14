"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/lib/translation/provider";

const languages = SUPPORTED_LANGUAGES.filter((l) => l.code !== "de");

const goals = [
  { id: "alltag", title: "Alltag", description: "Einkaufen, Arzttermine, Wohnungssuche, Behörden", emoji: "🏠" },
  { id: "integration", title: "Integration", description: "Integrationskurs, DTZ-Prüfung, Leben in Deutschland", emoji: "🇩🇪" },
  { id: "beruf", title: "Beruf", description: "Arbeitsplatz, Bewerbung, E-Mails, Meetings", emoji: "💼" },
  { id: "pruefung", title: "Prüfung", description: "Goethe-/telc-/ÖSD-Zertifikat, Studienkolleg", emoji: "🎓" },
];

const langEmojis: Record<string, string> = {
  tr: "🇹🇷", ru: "🇷🇺", ar: "🇸🇦", pl: "🇵🇱", en: "🇬🇧",
  ro: "🇷🇴", uk: "🇺🇦", sq: "🇦🇱", ku: "🏳️", it: "🇮🇹",
};

type Step = "language" | "goal" | "placement";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = async (lang: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSelectedLanguage(lang);
      setStep("goal");
    } catch (err) {
      setError("Sprache konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSelect = async (goal: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSelectedGoal(goal);
      setStep("placement");
    } catch (err) {
      setError("Ziel konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Language Selection */}
        {step === "language" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">
                Willkommen bei WortHeld
              </h1>
              <p className="text-muted-foreground">
                Wähle deine Muttersprache, damit wir dir helfen können.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  disabled={loading}
                  className={`h-24 rounded-xl border-2 transition-all text-center p-2 flex flex-col items-center justify-center cursor-pointer ${
                    loading
                      ? "opacity-50 cursor-not-allowed border-gray-200"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="text-2xl mb-1">
                    {langEmojis[lang.code] || "🌐"}
                  </span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Deine Sprache ist nicht dabei?
              </p>
              <button
                onClick={() => handleLanguageSelect("de")}
                className="text-blue-600 hover:underline text-sm"
              >
                Trotzdem mit Deutsch weitermachen
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === "goal" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-display font-bold mb-2">Was ist dein Ziel?</h2>
            <p className="text-muted-foreground mb-6">
              Wir passen den Kurs an deine Bedürfnisse an.
            </p>

            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  disabled={loading}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    loading
                      ? "opacity-50 cursor-not-allowed border-gray-200"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <div className="font-semibold text-lg">{goal.title}</div>
                      <div className="text-sm text-muted-foreground">{goal.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Placement Test CTA */}
        {step === "placement" && (
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-2xl font-display font-bold mb-2">
              Dein Niveau bestimmen
            </h2>
            <p className="text-white/80 mb-6">
              Mach einen kurzen Einstufungstest (ca. 10 Minuten), damit wir genau wissen, wo du anfangen solltest.
            </p>
            <button
              onClick={() => router.push("/placement-test")}
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Einstufungstest starten
            </button>
            <div className="mt-4">
              <button
                onClick={() => router.push("/learn")}
                className="text-white/70 hover:text-white underline text-sm"
              >
                Überspringen — direkt zu den Lektionen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
