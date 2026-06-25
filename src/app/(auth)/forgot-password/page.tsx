"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Fehler beim Senden.");
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">
            {sent ? "E-Mail gesendet" : "Passwort vergessen?"}
          </CardTitle>
          <CardDescription>
            {sent
              ? "Wir haben dir einen Link zum Zurücksetzen deines Passworts gesendet. Bitte prüfe dein Postfach."
              : "Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 size={48} className="text-green-500" />
              <Link href="/login" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Zurück zur Anmeldung
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@beispiel.de"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird gesendet..." : "Link senden"}
              </Button>
              <Link href="/login" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 justify-center">
                <ArrowLeft size={12} /> Zurück zur Anmeldung
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
