/**
 * Language Door Illustration — offene Tür mit warmem Licht,
 * Treppenstufen, Sprachblasen, Pflanzentopf.
 * Symbolik: Sprache öffnet Türen.
 */
export function LanguageDoorIllustration({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 240 200" fill="none" className={className} aria-label="Sprache öffnet Türen">
      {/* Ground line */}
      <line x1="20" y1="175" x2="220" y2="175" stroke="#EADFCC" strokeWidth="2" />

      {/* Door frame */}
      <rect x="85" y="55" width="70" height="120" rx="6" fill="#0D2B45" />
      {/* Open door — right side */}
      <path d="M155 55 L200 65 L200 170 L155 175 Z" fill="#153656" />
      {/* Warm light from door */}
      <ellipse cx="120" cy="115" rx="20" ry="40" fill="#FFC24D" opacity="0.3" />
      <ellipse cx="120" cy="115" rx="10" ry="30" fill="#FFC24D" opacity="0.5" />

      {/* Steps */}
      <rect x="75" y="175" width="30" height="5" rx="2" fill="#EADFCC" />
      <rect x="65" y="180" width="50" height="5" rx="2" fill="#EADFCC" />

      {/* Plant pot left */}
      <path d="M40 175 L35 155 L65 155 L60 175 Z" fill="#FF6B4A" />
      <circle cx="50" cy="148" r="12" fill="#2EAD6B" />
      <line x1="50" y1="148" x2="38" y2="130" stroke="#2EAD6B" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="148" x2="62" y2="128" stroke="#2EAD6B" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="148" x2="50" y2="130" stroke="#2EAD6B" strokeWidth="2" strokeLinecap="round" />

      {/* Speech bubbles */}
      <g transform="translate(170, 40)">
        <rect x="0" y="0" width="60" height="24" rx="12" fill="#FFF5E6" stroke="#EADFCC" strokeWidth="1.5" />
        <text x="30" y="16" textAnchor="middle" fontSize="9" fill="#102033" fontWeight="600" fontFamily="sans-serif">Hallo!</text>
      </g>
      <g transform="translate(180, 80)">
        <rect x="0" y="0" width="60" height="24" rx="12" fill="#FFFFFF" stroke="#EADFCC" strokeWidth="1.5" />
        <text x="30" y="16" textAnchor="middle" fontSize="9" fill="#102033" fontWeight="600" fontFamily="sans-serif">Wie geht&apos;s?</text>
      </g>
      <g transform="translate(175, 120)">
        <rect x="0" y="0" width="60" height="24" rx="12" fill="#FFF5E6" stroke="#EADFCC" strokeWidth="1.5" />
        <text x="30" y="16" textAnchor="middle" fontSize="9" fill="#102033" fontWeight="600" fontFamily="sans-serif">Guten Tag!</text>
      </g>

      {/* Decorative plus signs */}
      <text x="20" y="50" fontSize="12" fill="#FFC24D" opacity="0.5" fontWeight="bold">+</text>
      <text x="210" y="55" fontSize="10" fill="#FF6B4A" opacity="0.4" fontWeight="bold">+</text>
      <text x="30" y="100" fontSize="8" fill="#0D2B45" opacity="0.2" fontWeight="bold">+</text>

      {/* Decorative dots */}
      <circle cx="210" cy="30" r="2" fill="#FFC24D" opacity="0.4" />
      <circle cx="20" cy="130" r="2" fill="#FFC24D" opacity="0.4" />
      <circle cx="220" cy="100" r="1.5" fill="#FFC24D" opacity="0.3" />
    </svg>
  );
}
