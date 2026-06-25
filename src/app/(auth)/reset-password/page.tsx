"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Fehler beim Zurücksetzen. Der Link ist möglicherweise abgelaufen.");
      }
    } catch {
      setError("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Ungültiger oder fehlender Token.</p>
            <Link href="/forgot-password" className="text-primary hover:underline text-sm mt-2 block">
              Neuen Link anfordern
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">
            {done ? "Passwort geändert" : "Neues Passwort"}
          </CardTitle>
          <CardDescription>
            {done ? "Dein Passwort wurde erfolgreich geändert. Du wirst zur Anmeldung weitergeleitet." : "Gib dein neues Passwort ein."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 size={48} className="text-green-500" />
              <Link href="/login" className="text-primary hover:underline">Zur Anmeldung</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Neues Passwort</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="Mindestens 8 Zeichen" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required minLength={8} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Passwort wiederholen</label>
                <Input type="password" placeholder="Passwort wiederholen" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird gespeichert..." : "Passwort ändern"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
