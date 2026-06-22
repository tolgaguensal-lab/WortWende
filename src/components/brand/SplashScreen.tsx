"use client";

import { AppIcon } from "./LogoMark";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export function SplashScreen({ onFinish, duration = 2500 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D2B45] overflow-hidden">
      {/* Background decoration — subtle dots/stars */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#FFF5E6]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated door/light glow at bottom */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#FFC24D]/10 to-transparent" />
      <div className="absolute bottom-16 w-24 h-40 bg-[#FFC24D]/20 blur-3xl rounded-full" />

      {/* Logo */}
      <div className="animate-scale-in mb-8">
        <AppIcon size={120} />
      </div>

      {/* Brand name */}
      <h1 className="font-display font-extrabold text-4xl text-[#FFF5E6] mb-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        WortHeld
      </h1>

      {/* Slogan */}
      <p className="font-body text-lg text-[#FFF5E6]/70 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        Deutsch lernen, bis es{" "}
        <span className="text-[#FF6B4A] font-bold">Klick</span> macht.
      </p>

      {/* Loading indicator */}
      <div className="absolute bottom-12 w-12 h-1 bg-[#FFF5E6]/20 rounded-full overflow-hidden">
        <div className="h-full bg-[#FF6B4A] rounded-full animate-[loading_2.5s_ease-in-out]" style={{ width: "100%" }} />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
