"use client";

/**
 * Hand-drawn vintage compass rose — an 8-point star with cardinal /
 * intercardinal markers wrapped in a circular cartouche carrying the
 * "ROUTE 9 · SHREWSBURY · MA" + "WORCESTER COUNTY · NEW ENGLAND" rings.
 *
 * Built as a single SVG: gradient-filled rose, hand-stamp grain over the
 * ring, curved <textPath> bands, and a small pulsing needle indicating
 * the home direction. Pure decoration (aria-hidden).
 *
 * The needle pulses slowly under normal motion; reduced-motion freezes it
 * via the global animation override.
 */
export function CompassRose({ size = 280 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="compass-rose-root inline-block select-none"
      style={{
        width: size,
        height: size,
        filter:
          "drop-shadow(0 8px 22px rgba(212,104,42,0.18)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Outer ring text paths */}
          <path id="cr-outer-top" d="M 100 100 m -84 0 a 84 84 0 1 1 168 0" fill="none" />
          <path id="cr-outer-bot" d="M 100 100 m -78 0 a 78 78 0 1 0 156 0" fill="none" />

          {/* Rose body gradient — warm brass */}
          <radialGradient id="cr-body" cx="35%" cy="32%" r="80%">
            <stop offset="0%"   stopColor="#FFE0A0" />
            <stop offset="35%"  stopColor="#D4682A" />
            <stop offset="100%" stopColor="#5E2208" />
          </radialGradient>

          {/* Needle gradient — half red(orange), half cream */}
          <linearGradient id="cr-needle-n" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFC480" />
            <stop offset="100%" stopColor="#A84818" />
          </linearGradient>
          <linearGradient id="cr-needle-s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F0E0C8" />
            <stop offset="100%" stopColor="#9B7860" />
          </linearGradient>

          {/* Halftone grain over the ring */}
          <pattern id="cr-grain" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.42" fill="rgba(212,104,42,0.32)" />
          </pattern>
        </defs>

        {/* ── Outermost ring ── */}
        <circle cx="100" cy="100" r="94" fill="none" stroke="#D4682A" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#D4682A" strokeWidth="0.6" opacity="0.7" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#D4682A" strokeWidth="0.9" />

        {/* Outer ring grain (masked between r=84 and r=94 visually via stroke) */}
        <circle cx="100" cy="100" r="89" fill="none" stroke="url(#cr-grain)" strokeWidth="4" opacity="0.6" />

        {/* Top curved label */}
        <text fontSize="9" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="3.6" fill="#D4682A">
          <textPath href="#cr-outer-top" startOffset="50%" textAnchor="middle">
            ROUTE 9 · SHREWSBURY · MASS
          </textPath>
        </text>

        {/* Bottom curved label */}
        <text fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="2.8" fill="#D4682A" opacity="0.78">
          <textPath href="#cr-outer-bot" startOffset="50%" textAnchor="middle">
            WORCESTER COUNTY · NEW ENGLAND
          </textPath>
        </text>

        {/* Inner ring */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="#D4682A" strokeWidth="0.9" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#D4682A" strokeWidth="0.5" opacity="0.65" />

        {/* Tick marks every 22.5° between the two inner rings */}
        {[...Array(32)].map((_, i) => {
          const a = (i * 11.25 * Math.PI) / 180;
          const x1 = 100 + Math.cos(a) * 58;
          const y1 = 100 + Math.sin(a) * 58;
          const x2 = 100 + Math.cos(a) * 62;
          const y2 = 100 + Math.sin(a) * 62;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#D4682A"
              strokeWidth={i % 4 === 0 ? 1.2 : 0.5}
              opacity={i % 4 === 0 ? 0.95 : 0.6}
            />
          );
        })}

        {/* ── 8-point compass star ── */}
        <g>
          {/* Long axis points (N/S/E/W) — outer cream petals */}
          <path d="M 100 18 L 110 100 L 100 56 L 90 100 Z" fill="url(#cr-needle-s)" stroke="#1C1209" strokeWidth="0.6" />
          <path d="M 182 100 L 100 110 L 144 100 L 100 90 Z" fill="url(#cr-needle-s)" stroke="#1C1209" strokeWidth="0.6" />
          <path d="M 100 182 L 90 100 L 100 144 L 110 100 Z" fill="url(#cr-needle-s)" stroke="#1C1209" strokeWidth="0.6" />
          <path d="M 18 100 L 100 90 L 56 100 L 100 110 Z" fill="url(#cr-needle-s)" stroke="#1C1209" strokeWidth="0.6" />

          {/* Short axis points (NE/SE/SW/NW) — warm brass petals */}
          <path d="M 158 42 L 108 92 L 132 76 L 124 84 Z M 158 42 L 92 108 L 76 132 L 84 124 Z" fill="url(#cr-body)" opacity="0.85" stroke="#1C1209" strokeWidth="0.4" />
          <path d="M 158 158 L 92 92 L 132 124 L 124 116 Z M 158 158 L 108 108 L 76 68 L 84 76 Z" fill="url(#cr-body)" opacity="0.85" stroke="#1C1209" strokeWidth="0.4" />

          {/* Bright north fletch — darker fill so it's visually distinct as the "this way" point */}
          <path d="M 100 18 L 100 56 L 110 100 Z" fill="#A84818" stroke="#1C1209" strokeWidth="0.6" />
        </g>

        {/* Cardinal letters */}
        <g fontFamily="Georgia, serif" fontWeight="800" fill="#1C1209">
          <text x="100" y="14" textAnchor="middle" fontSize="11">N</text>
          <text x="190" y="103" textAnchor="middle" fontSize="11">E</text>
          <text x="100" y="194" textAnchor="middle" fontSize="11">S</text>
          <text x="10"  y="103" textAnchor="middle" fontSize="11">W</text>
        </g>

        {/* Intercardinal small letters */}
        <g fontFamily="monospace" fontWeight="700" fill="#A84818" fontSize="6.5">
          <text x="153" y="48" textAnchor="middle">NE</text>
          <text x="153" y="160" textAnchor="middle">SE</text>
          <text x="47"  y="160" textAnchor="middle">SW</text>
          <text x="47"  y="48" textAnchor="middle">NW</text>
        </g>

        {/* Decorative corner fleurons — small starbursts at 45° offsets */}
        {[42, 158].flatMap((y) => [42, 158].map((x) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <path d="M 0 -2.4 L 0.8 -0.8 L 2.4 0 L 0.8 0.8 L 0 2.4 L -0.8 0.8 L -2.4 0 L -0.8 -0.8 Z" fill="#D4682A" />
          </g>
        )))}

        {/* ── Center hub ── */}
        <g>
          {/* Hub plate */}
          <circle cx="100" cy="100" r="14" fill="#1C1209" stroke="#D4682A" strokeWidth="1.4" />
          <circle cx="100" cy="100" r="11" fill="none" stroke="rgba(212,104,42,0.45)" strokeWidth="0.6" />

          {/* Small pulsing needle pivot — the "you are here" indicator */}
          <circle cx="100" cy="100" r="3" fill="url(#cr-body)" className="compass-needle" />

          {/* Center monogram */}
          <text
            x="100" y="103.5"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="800"
            fontSize="9"
            fill="#FFC480"
            letterSpacing="0.04em"
          >
            R9
          </text>
        </g>

        {/* Tiny ink-stamp specks for hand-drawn texture */}
        <circle cx="40"  cy="60"  r="0.7" fill="#1C1209" opacity="0.6" />
        <circle cx="156" cy="142" r="0.8" fill="#1C1209" opacity="0.55" />
        <circle cx="62"  cy="142" r="0.5" fill="#1C1209" opacity="0.4" />
        <circle cx="140" cy="58"  r="0.6" fill="#1C1209" opacity="0.5" />
      </svg>
    </div>
  );
}
