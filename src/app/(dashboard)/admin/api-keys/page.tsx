"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Trash2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

type ApiKeyRecord = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string;
  rateLimit: number;
  isActive: boolean;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  _count: { requests: number };
};

const SCOPE_OPTIONS = [
  { value: "read", label: "Nur Lesen (alle)" },
  { value: "read:vocabulary,read:grammar,read:sentences,read:exercises,read:lessons", label: "Nur Lese-Endpoints" },
  { value: "read,write:progress", label: "Lesen + Fortschritt" },
  { value: "read,write:progress,write:user", label: "Lesen + Fortschritt + User" },
  { value: "read,write:progress,write:user,read:translate", label: "Lesen + Schreiben + Übersetzung" },
  { value: "admin", label: "Admin (voller Zugriff)" },
];

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", scopes: "read", rateLimit: 100, expiresInDays: "" });
  const [error, setError] = useState("");
  const [keyInput, setKeyInput] = useState("");

  const loadKeys = async () => {
    const savedKey = localStorage.getItem("admin_api_key");
    if (!savedKey) { setLoading(false); return; }
    const res = await fetch("/api/v1/admin/api-keys", {
      headers: { "X-API-Key": savedKey },
    });
    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys);
    }
    setLoading(false);
  };

  useEffect(() => { loadKeys(); }, []);

  const saveAdminKey = () => {
    if (keyInput.trim()) {
      localStorage.setItem("admin_api_key", keyInput.trim());
      setLoading(true);
      loadKeys();
    }
  };

  const createKey = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name erforderlich"); return; }
    const savedKey = localStorage.getItem("admin_api_key");
    if (!savedKey) { setError("Kein Admin-API-Key hinterlegt"); return; }

    const res = await fetch("/api/v1/admin/api-keys", {
      method: "POST",
      headers: { "X-API-Key": savedKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        scopes: form.scopes,
        rateLimit: form.rateLimit,
        expiresInDays: form.expiresInDays ? parseInt(form.expiresInDays) : undefined,
      }),
    });

    if (!res.ok) { const err = await res.json(); setError(err.error || "Fehler"); return; }

    const data = await res.json();
    setShowKey(data.key);
    setShowForm(false);
    setForm({ name: "", scopes: "read", rateLimit: 100, expiresInDays: "" });
    loadKeys();
  };

  const deactivateKey = async (id: string) => {
    const savedKey = localStorage.getItem("admin_api_key");
    if (!savedKey || !confirm("API-Key deaktivieren?")) return;
    await fetch(`/api/v1/admin/api-keys/${id}`, {
      method: "DELETE",
      headers: { "X-API-Key": savedKey },
    });
    loadKeys();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6 text-center text-muted-foreground">Lade Keys...</div>;

  const savedKey = typeof window !== "undefined" ? localStorage.getItem("admin_api_key") : null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">API-Keys verwalten</h1>
        {savedKey && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" /> Neuer Key
          </Button>
        )}
      </div>

      {/* Admin-Key-Eingabe */}
      {!savedKey && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center gap-3 flex-wrap">
            <Key className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200 flex-1">
              Hinterlege deinen Admin-API-Key, um Keys zu verwalten.
            </p>
            <Input
              placeholder="wh_live_..."
              className="max-w-xs"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <Button onClick={saveAdminKey}>Speichern</Button>
          </CardContent>
        </Card>
      )}

      {/* Create-Formular */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="font-display">Neuen API-Key erstellen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={onChange} placeholder="z.B. Drittanbieter-App" />
            </div>
            <div>
              <Label htmlFor="scopes">Berechtigungen (Scopes)</Label>
              <select id="scopes" name="scopes" value={form.scopes} onChange={onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {SCOPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rateLimit">Rate-Limit (req/min)</Label>
                <Input id="rateLimit" name="rateLimit" type="number" value={form.rateLimit} onChange={onChange} />
              </div>
              <div>
                <Label htmlFor="expiresInDays">Läuft ab in (Tagen)</Label>
                <Input id="expiresInDays" name="expiresInDays" type="number" value={form.expiresInDays} onChange={onChange} placeholder="nie" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <div className="flex gap-2">
              <Button onClick={createKey}>Erstellen</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Abbrechen</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Neuer Key wurde erstellt */}
      {showKey && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">API-Key erstellt!</span>
            </div>
            <p className="text-sm text-muted-foreground">Dieser Schlüssel wird nur einmal angezeigt:</p>
            <div className="flex items-center gap-2 bg-background rounded-md border p-3 font-mono text-sm">
              <code className="flex-1 break-all">{showKey}</code>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(showKey)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowKey(null)}>Schließen</Button>
          </CardContent>
        </Card>
      )}

      {/* Key-Tabelle */}
      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Vorhandene API-Keys</CardTitle></CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Noch keine API-Keys vorhanden.</p>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{k.name}</span>
                      <Badge variant={k.isActive ? "default" : "secondary"} className="text-xs">
                        {k.isActive ? "Aktiv" : "Deaktiviert"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{k.keyPrefix}...</span>
                      <span>Scopes: {k.scopes}</span>
                      <span>{k.rateLimit} req/min</span>
                      <span>{k._count.requests} Requests</span>
                      {k.lastUsedAt && <span>Zuletzt: {new Date(k.lastUsedAt).toLocaleDateString()}</span>}
                      {k.expiresAt && <span>Läuft ab: {new Date(k.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  {k.isActive && (
                    <Button variant="ghost" size="sm" onClick={() => deactivateKey(k.id)} className="text-destructive shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
