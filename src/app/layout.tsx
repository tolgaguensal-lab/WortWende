import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Wortwende — Deutsch lernen, bis es Klick macht",
  description: "Von A1 bis C1: echte Sprache für Alltag, Beruf, Integration und Prüfung. BAMF-konformer Deutschkurs.",
  manifest: "/manifest.json",
  icons: { icon: "/logo.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Wortwende" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0D2B45",
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
