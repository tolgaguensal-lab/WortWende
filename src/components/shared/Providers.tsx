"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { UpdateBanner } from "./UpdateBanner";
import { LanguageProvider } from "./LanguageSelector";
import { CookieConsent } from "./CookieConsent";
import { ErrorTracker } from "./ErrorTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          {children}
          <ErrorTracker />
          <UpdateBanner />
          <CookieConsent />
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
