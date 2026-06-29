import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Wortwende \u2013 Dein KI-Tutor f\u00fcr Deutsch",
  description: "Lerne Deutsch mit Leo, deinem pers\u00f6nlichen KI-Tutor. 24/7 verf\u00fcgbar, personalisiert, ab 0 \u20ac.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.png", apple: "/favicon.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Wortwende" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0D2B45",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          Zum Hauptinhalt springen
        </a>
        <div id="main-content">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
