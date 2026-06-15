"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "📖", label: "Lektionen", value: "7" },
          { icon: "📝", label: "Vokabeln", value: "20" },
          { icon: "✏️", label: "Übungen", value: "15" },
          { icon: "👥", label: "Nutzer", value: "0" },
        ].map((s, i) => (
          <Card key={i} className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-display">Inhalte verwalten</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/content"><Button variant="outline" className="w-full justify-start">📖 Lektionen verwalten</Button></Link>
            <Link href="/admin/import"><Button variant="outline" className="w-full justify-start">📥 Inhalte importieren</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-display">API</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/api-keys"><Button variant="outline" className="w-full justify-start">🔑 API-Keys verwalten</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-display">Qualität</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/review"><Button variant="outline" className="w-full justify-start">🔍 Qualitätskontrolle</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
