"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (res.ok) router.push("/login?registered=true");
      else {
        const data = await res.json();
        setError(data.error || "Registrierung fehlgeschlagen");
      }
    } catch {
      setError("Ein Fehler ist aufgetreten");
    }
    setLoading(false);
  }

  return (
    <Card className="card-premium">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-display font-bold">Konto erstellen</CardTitle>
            <CardDescription className="text-sm">Starte deine Deutsch-Lern-Reise</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <Input id="name" placeholder="Dein Name" className="pl-9 h-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">E-Mail</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <Input id="email" type="email" placeholder="name@beispiel.de" className="pl-9 h-11" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Passwort</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <Input id="password" type={showPw ? "text" : "password"} placeholder="Mindestens 8 Zeichen" className="pl-9 pr-9 h-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Passwort wiederholen</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <Input id="confirmPassword" type={showPw ? "text" : "password"} placeholder="Passwort wiederholen" className="pl-9 h-11" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </div>
              {error && <p className="text-sm text-destructive flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />{error}</p>}
              <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Wird registriert..." : "Kostenlos starten"}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6 pt-2">
            <p className="text-sm text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">Anmelden</Link>
            </p>
          </CardFooter>
    </Card>
  );
}
