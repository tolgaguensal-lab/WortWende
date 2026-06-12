import { authOptions } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-white">DeutschQuest</h1>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="ghost" className="text-white hover:bg-white/20">Anmelden</Button></Link>
          <Link href="/register"><Button className="bg-white text-blue-600 hover:bg-white/90">Kostenlos starten</Button></Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <section className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Deutsch lernen<br />war noch nie so einfach
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Von A1 bis C1 - spielerisch, effektiv und spaßig. Mit XP, Streaks und personalisierten Lernpfaden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"><Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg px-10 py-6 shadow-xl">Kostenlos starten</Button></Link>
            <Link href="/login"><Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white/20 text-lg px-10 py-6">Ich habe bereits ein Konto</Button></Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: "🎮", title: "Spielerisch lernen", desc: "XP, Level, Streaks und Belohnungen motivieren dich täglich" },
            { icon: "📚", title: "Strukturiert nach CEFR", desc: "Von A1 bis C1, systematisch und nachweisbar" },
            { icon: "🎯", title: "Alle Fähigkeiten", desc: "Lesen, Schreiben, Hören und Sprechen trainieren" },
            { icon: "🔄", title: "Wiederholungssystem", desc: "Intelligente Spaced Repetition für nachhaltiges Lernen" },
            { icon: "📊", title: "Fortschritt verfolgen", desc: "Detaillierte Analyse deiner Lernfortschritte" },
            { icon: "📱", title: "Überall lernen", desc: "Als Webapp auf jedem Gerät, bald auch als App" },
          ].map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-white/70">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">Finde dein Level</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["A1", "A2", "B1", "B2", "C1"].map((level, i) => (
              <div key={level} className="bg-white/15 backdrop-blur-sm rounded-xl px-8 py-4 text-white">
                <span className="text-2xl font-display font-bold">{level}</span>
                <span className="block text-sm text-white/60 mt-1">
                  {["Anfänger", "Grundkenntnisse", "Mittelstufe", "Oberstufe", "Fortgeschritten"][i]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black/20 text-white/60 py-8 px-6 text-center text-sm">
        <p>DeutschQuest &copy; {new Date().getFullYear()} | Datenschutz | Impressum | AGB</p>
      </footer>
    </div>
  );
}
