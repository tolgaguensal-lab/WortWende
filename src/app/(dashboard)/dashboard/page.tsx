"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, Zap, Flame, Heart, Target, BookOpen, Trophy, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Willkommen zurück!</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Weiter so mit deinem Lernpfad.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-premium bg-primary/10 text-primary border border-primary/20">
            Level A1
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Level", value: "A1", icon: Target, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 text-emerald-600", darkBg: "dark:bg-emerald-950/30" },
          { label: "XP heute", value: "0", icon: Zap, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 text-amber-600", darkBg: "dark:bg-amber-950/30" },
          { label: "Serie", value: "0", icon: Flame, color: "from-orange-500 to-red-600", bg: "bg-orange-50 text-orange-600", darkBg: "dark:bg-orange-950/30" },
          { label: "Herzen", value: "5", icon: Heart, color: "from-rose-500 to-pink-600", bg: "bg-rose-50 text-rose-600", darkBg: "dark:bg-rose-950/30" },
        ].map((stat, i) => (
          <Card key={i} className="card-premium hover-lift">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon size={18} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Goal */}
      <Card className="card-premium overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(235,45%,55%)] to-[hsl(235,40%,45%)]" />
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Target size={20} className="text-white/80" />
                  Tagesziel
                </h2>
                <p className="text-white/60 text-sm mt-0.5">Erreiche 50 XP, um deine Serie zu behalten</p>
              </div>
              <div className="text-3xl font-display font-bold text-white/90">0%</div>
            </div>
            <div className="mt-5">
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <Progress value={0} className="h-full bg-white/80" />
              </div>
              <p className="text-white/50 text-xs mt-1.5">0 / 50 XP heute</p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="card-premium hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Nächste Lektion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border/60">
              <p className="font-semibold text-foreground">Hallo! Begrüßungen</p>
              <p className="text-sm text-muted-foreground mt-0.5">Lerne die Grundlagen der Begrüßung</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="badge-premium bg-secondary text-muted-foreground border-border/60">Einheit 1</span>
              <span className="text-muted-foreground">~5 Min</span>
              <span className="badge-premium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
                +15 XP
              </span>
            </div>
            <Link href="/learn">
              <Button className="w-full mt-2 group">
                Weiterlernen <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <RefreshCw size={18} className="text-primary" />
              Wiederholungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-emerald-50/40 border border-emerald-200/50 dark:from-emerald-950/20 dark:border-emerald-800/30">
              <p className="font-semibold text-foreground">Keine Wiederholungen fällig</p>
              <p className="text-sm text-muted-foreground mt-0.5">Du bist auf dem neuesten Stand!</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Nächste: Heute 18:00 Uhr</span>
            </div>
            <Link href="/review">
              <Button variant="outline" className="w-full mt-2 group">
                Jetzt wiederholen <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Activity / Empty State */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display">Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border/60 flex items-center justify-center mx-auto mb-4">
              <Trophy size={28} className="text-muted-foreground/60" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">Bereit zu starten?</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Starte deine erste Lektion und beginne deine Deutsch-Lern-Reise!
            </p>
            <Link href="/learn">
              <Button size="lg" className="font-semibold shadow-lg shadow-primary/20">
                Erste Lektion starten <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
