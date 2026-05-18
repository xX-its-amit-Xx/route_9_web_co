"use client";

/**
 * Vintage branded matchbook — the kind of paper matchbook you'd grab off
 * a ma-and-pa shop counter. Folded paper cover with the Route 9 Web Co.
 * wordmark on the front, abrasive strike-strip at the bottom, and an
 * inside flap visible at a slight angle showing matchsticks behind.
 *
 * Pure SVG — no animations. Decorative (aria-hidden). Subtle drop-shadow
 * filter gives the paper its cast shadow.
 */
export function Matchbook({ size = 180 }: { size?: number }) {
  // Aspect ratio ~ 0.78 (taller than wide). The viewBox is 140 × 180.
  const width = Math.round(size * (140 / 180));

  return (
    <div
      aria-hidden
      className="matchbook-root inline-block select-none"
      style={{
        width,
        height: size,
        transform: "rotate(-3deg)",
        filter:
          "drop-shadow(0 10px 22px rgba(28,18,9,0.32)) drop-shadow(0 3px 6px rgba(28,18,9,0.22))",
      }}
    >
      <svg
        viewBox="0 0 140 180"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Cover paper gradient — warm brand orange */}
          <linearGradient id="mb-cover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#E07838" />
            <stop offset="55%"  stopColor="#C05A20" />
            <stop offset="100%" stopColor="#7A2810" />
          </linearGradient>
          {/* Cover inside gradient — slightly different so the fold reads */}
          <linearGradient id="mb-cover-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#A84818" />
            <stop offset="100%" stopColor="#5A1E08" />
          </linearGradient>
          {/* Matchstick wood */}
          <linearGradient id="mb-stick" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#E8C99A" />
            <stop offset="100%" stopColor="#7A5028" />
          </linearGradient>
          {/* Strike-strip abrasive texture — three-tone repeating */}
          <pattern id="mb-strike" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="#2A1810" />
            <circle cx="0.8" cy="0.8" r="0.4" fill="#7A5028" opacity="0.8" />
            <circle cx="2.2" cy="2.0" r="0.3" fill="#FAE0B0" opacity="0.5" />
          </pattern>
          {/* Subtle paper grain */}
          <pattern id="mb-grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>

        {/* ── Inside flap (peeking out behind, tilted slightly) ── */}
        <g transform="rotate(-6 70 40)">
          <rect x="14" y="6" width="112" height="50" rx="3" fill="url(#mb-cover-back)" stroke="#3A1408" strokeWidth="0.6" />
          {/* Matchsticks inside */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <g key={i} transform={`translate(${22 + i * 9.5} 14)`}>
              {/* Stick */}
              <rect x="0" y="0" width="2.6" height="22" rx="0.5" fill="url(#mb-stick)" />
              {/* Tip — varied red/orange */}
              <circle cx="1.3" cy="-1" r="2" fill={i % 3 === 0 ? "#FFE0A0" : i % 3 === 1 ? "#E07838" : "#A04010"} stroke="#1C0E04" strokeWidth="0.3" />
            </g>
          ))}
        </g>

        {/* ── Cover (the main "front") ── */}
        <g>
          {/* Drop ring under the cover */}
          <rect x="6" y="36" width="128" height="138" rx="4" fill="rgba(0,0,0,0.35)" />
          {/* Cover body */}
          <rect x="4" y="34" width="128" height="138" rx="4" fill="url(#mb-cover)" stroke="#3A1408" strokeWidth="0.8" />
          {/* Paper grain over the cover */}
          <rect x="4" y="34" width="128" height="138" rx="4" fill="url(#mb-grain)" opacity="0.55" />
          {/* Top fold crease line */}
          <line x1="6" y1="40" x2="130" y2="40" stroke="rgba(255,220,160,0.18)" strokeWidth="0.8" />
          <line x1="6" y1="42" x2="130" y2="42" stroke="rgba(0,0,0,0.25)" strokeWidth="0.4" />
          {/* Inner border decoration */}
          <rect x="12" y="48" width="112" height="100" fill="none" stroke="rgba(255,220,160,0.45)" strokeWidth="0.7" />
          <rect x="14" y="50" width="108" height="96" fill="none" stroke="rgba(255,220,160,0.22)" strokeWidth="0.35" />

          {/* Tiny corner ornaments — four-pointed stars */}
          {[
            [18, 54], [118, 54], [18, 142], [118, 142],
          ].map(([x, y]) => (
            <path
              key={`${x},${y}`}
              d={`M ${x} ${y - 3} l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z`}
              fill="rgba(255,220,160,0.7)"
            />
          ))}

          {/* "EST. 2026" eyebrow */}
          <text
            x="68" y="68" textAnchor="middle"
            fontFamily="monospace" fontSize="7" fontWeight="800"
            fill="rgba(255,220,160,0.7)"
            letterSpacing="0.28em"
          >
            EST · 2026
          </text>

          {/* "ROUTE 9" wordmark */}
          <text
            x="68" y="96" textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="22"
            fill="#FFE0A0"
            letterSpacing="0.03em"
            stroke="#1C0E04"
            strokeWidth="0.6"
            paintOrder="stroke fill"
          >
            Route 9
          </text>

          {/* Decorative rule + flourish */}
          <line x1="32" y1="106" x2="60" y2="106" stroke="rgba(255,220,160,0.7)" strokeWidth="1" strokeLinecap="round" />
          <line x1="76" y1="106" x2="104" y2="106" stroke="rgba(255,220,160,0.7)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="68" cy="106" r="1.8" fill="#FFE0A0" />

          {/* "WEB CO." subtitle */}
          <text
            x="68" y="124" textAnchor="middle"
            fontFamily="monospace" fontWeight="800"
            fontSize="10"
            fill="#FFE0A0"
            letterSpacing="0.42em"
            opacity="0.9"
          >
            WEB CO.
          </text>

          {/* "Shrewsbury, Mass" curved cartouche feel */}
          <text
            x="68" y="138" textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontSize="9"
            fill="rgba(255,220,160,0.8)"
            letterSpacing="0.08em"
          >
            Shrewsbury, Mass
          </text>

          {/* "CLOSE COVER BEFORE STRIKING" warning printed near the bottom */}
          <text
            x="68" y="158" textAnchor="middle"
            fontFamily="monospace" fontSize="5" fontWeight="800"
            fill="rgba(255,220,160,0.55)"
            letterSpacing="0.18em"
          >
            CLOSE COVER BEFORE STRIKING
          </text>
        </g>

        {/* ── Strike strip at the bottom of the cover ── */}
        <g>
          <rect x="4" y="168" width="128" height="14" rx="0.5" fill="url(#mb-strike)" stroke="#1C0E04" strokeWidth="0.4" />
          {/* A few visible strike marks — diagonal scuffs */}
          <line x1="18" y1="180" x2="32" y2="172" stroke="rgba(212,104,42,0.6)" strokeWidth="0.6" strokeLinecap="round" />
          <line x1="52" y1="179" x2="64" y2="172" stroke="rgba(212,104,42,0.5)" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="84" y1="180" x2="98" y2="172" stroke="rgba(212,104,42,0.55)" strokeWidth="0.6" strokeLinecap="round" />
        </g>

        {/* Subtle corner curl on the cover bottom-right */}
        <path
          d="M 124 162 q 6 2 8 8 q -8 -2 -10 -4 Z"
          fill="#5A1E08"
          stroke="#3A1408" strokeWidth="0.4"
        />
      </svg>
    </div>
  );
}
