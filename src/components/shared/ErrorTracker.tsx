"use client";

import { useEffect } from "react";

/**
 * Client-Side Error Tracker
 * 
 * Fängt unhandled JS errors und Promise rejections und sendet sie
 * an den /api/error-log Endpunkt (nur in Produktion).
 * 
 * In Entwicklung: console.error
 */
export function ErrorTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    function reportError(message: string, stack?: string, type = "unhandled") {
      // In Produktion: an API senden
      if (process.env.NODE_ENV === "production") {
        fetch("/api/error-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            stack: stack?.substring(0, 1000),
            type,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // Silent fail – kein Loop
        });
      } else {
        console.error(`[ErrorTracker] ${type}:`, message);
      }
    }

    // Global error handler
    const onError = (event: ErrorEvent) => {
      reportError(event.message, event.error?.stack, "error");
    };

    // Unhandled Promise rejections
    const onRejection = (event: PromiseRejectionEvent) => {
      reportError(
        event.reason?.message || String(event.reason),
        event.reason?.stack,
        "rejection"
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null; // Rendert nichts
}
