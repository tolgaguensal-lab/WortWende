/**
 * WortHeld Logo — Icon only (stylized W).
 * Left: Deep Blue, Right: Coral, Arrow: Coral, Dots: Amber.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-label="WortHeld">
      {/* Left W stroke — Deep Blue */}
      <path d="M18 22 L28 58 L40 38 L40 58" stroke="#0D2B45" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right W stroke — Coral */}
      <path d="M40 58 L40 38 L52 58 L62 22" stroke="#FF6B4A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Arrow arc above — Coral */}
      <path d="M28 16 Q40 6 52 16" stroke="#FF6B4A" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M50 20 L52 16 L48 14" stroke="#FF6B4A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Three dots — Amber */}
      <circle cx="33" cy="16" r="2.5" fill="#FFC24D" />
      <circle cx="40" cy="14" r="2.5" fill="#FFC24D" />
      <circle cx="47" cy="16" r="2.5" fill="#FFC24D" />
    </svg>
  );
}

/** WortHeld Logo — Icon + Wordmark */
export function LogoFull({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display font-extrabold text-2xl text-primary tracking-tight">WortHeld</span>
    </div>
  );
}

/** WortHeld App Icon — square, rounded, on dark bg */
export function AppIcon({ size = 128, className = "" }: { size?: number; className?: string }) {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className} aria-label="WortHeld App">
      <rect width="128" height="128" rx={r} fill="#0D2B45" />
      {/* Left W — White/Cream */}
      <path d="M28 36 L44 92 L62 62 L62 92" stroke="#FFF5E6" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right W — Coral */}
      <path d="M62 92 L62 62 L80 92 L98 36" stroke="#FF6B4A" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Arrow — Coral */}
      <path d="M44 26 Q62 8 82 26" stroke="#FF6B4A" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M79 30 L82 26 L76 24" stroke="#FF6B4A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Dots — Amber */}
      <circle cx="52" cy="26" r="4" fill="#FFC24D" />
      <circle cx="63" cy="23" r="4" fill="#FFC24D" />
      <circle cx="74" cy="26" r="4" fill="#FFC24D" />
    </svg>
  );
}
