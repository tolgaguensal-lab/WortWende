import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "WortHeld - Deutsch für Alltag, Beruf & Integration",
  description: "BAMF-konformer Deutschkurs von A1 bis C1. Integrationskurse, Berufsvorbereitung und DTZ-Prüfung – mehrsprachig erklärt.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DQ" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
