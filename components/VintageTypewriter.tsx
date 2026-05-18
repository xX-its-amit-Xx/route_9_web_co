"use client";

/**
 * Hand-illustrated vintage manual typewriter — the kind you'd find on a
 * journalist's desk. Black-enamel body with a curved housing, a fan of
 * round keys, a platen roll, a sheet of paper rolled in and rising up
 * with the brand wordmark typed on it, and a return lever on the side.
 *
 * Subtle "carriage return ding" animation: a small bell at the top-right
 * pings gently every few seconds. Reduced-motion freezes the bell.
 *
 * Decorative (aria-hidden). Pure SVG, no external assets.
 */
export function VintageTypewriter({ size = 240 }: { size?: number }) {
  const width = Math.round(size * (240 / 220));
  return (
    <div
      aria-hidden
      className="vintage-typewriter inline-block select-none"
      style={{
        width,
        height: size,
        transform: "rotate(-2deg)",
        filter:
          "drop-shadow(0 12px 24px rgba(28,18,9,0.32)) drop-shadow(0 4px 8px rgba(28,18,9,0.22))",
      }}
    >
      <svg
        viewBox="0 0 240 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Body — black enamel, multi-tone */}
          <linearGradient id="tw-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3A2818" />
            <stop offset="40%"  stopColor="#1A0E08" />
            <stop offset="100%" stopColor="#0E0805" />
          </linearGradient>
          {/* Body top sheen */}
          <linearGradient id="tw-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,225,170,0.25)" />
            <stop offset="100%" stopColor="rgba(255,225,170,0)" />
          </linearGradient>
          {/* Keys — round, ivory tops */}
          <radialGradient id="tw-key" cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#F8EDD2" />
            <stop offset="60%"  stopColor="#C9A872" />
            <stop offset="100%" stopColor="#5A3818" />
          </radialGradient>
          {/* Paper */}
          <linearGradient id="tw-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FDF5DE" />
            <stop offset="100%" stopColor="#EFD9A6" />
          </linearGradient>
          {/* Platen rubber */}
          <linearGradient id="tw-platen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2A1810" />
            <stop offset="50%"  stopColor="#1C0E04" />
            <stop offset="100%" stopColor="#3A2818" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="120" cy="208" rx="92" ry="5" fill="rgba(0,0,0,0.45)" />

        {/* ── Sheet of paper rolled up out of the platen ── */}
        <g>
          {/* Paper back-curl shadow */}
          <path
            d="M 70 76 Q 70 18 76 12 L 164 12 Q 170 18 170 76 Z"
            fill="rgba(0,0,0,0.35)"
            transform="translate(2 2)"
          />
          {/* Paper itself */}
          <path
            d="M 70 76 Q 70 18 76 12 L 164 12 Q 170 18 170 76 Z"
            fill="url(#tw-paper)"
            stroke="#A84818"
            strokeWidth="0.7"
          />
          {/* Faint ruled lines */}
          {[28, 36, 44, 52, 60, 68].map((y) => (
            <line key={y} x1="80" y1={y} x2="160" y2={y}
              stroke="rgba(168,72,24,0.18)" strokeWidth="0.4" />
          ))}
          {/* The typed brand wordmark on the paper */}
          <text x="120" y="32" textAnchor="middle"
            fontFamily="Courier New, monospace"
            fontWeight="800"
            fontSize="9"
            fill="#1C0E04"
            letterSpacing="0.4em">
            ROUTE 9
          </text>
          <text x="120" y="44" textAnchor="middle"
            fontFamily="Courier New, monospace"
            fontWeight="700"
            fontSize="7"
            fill="rgba(28,14,4,0.78)"
            letterSpacing="0.32em">
            WEB CO.
          </text>
          {/* "Hand-built websites since 2026" typed sentence */}
          <text x="120" y="64" textAnchor="middle"
            fontFamily="Courier New, monospace"
            fontSize="5.5"
            fill="rgba(28,14,4,0.72)"
            letterSpacing="0.18em">
            HAND-BUILT WEBSITES · 2026
          </text>
          {/* Paper top edge highlight */}
          <path d="M 76 12 L 164 12" stroke="rgba(255,255,255,0.55)" strokeWidth="0.4" />
        </g>

        {/* ── Platen / paper roll ── */}
        <g>
          <rect x="50" y="74" width="140" height="14" rx="6" fill="url(#tw-platen)" stroke="#000" strokeWidth="0.8" />
          {/* Knobs on either side */}
          <circle cx="48" cy="81" r="9" fill="url(#tw-body)" stroke="#000" strokeWidth="0.8" />
          <circle cx="192" cy="81" r="9" fill="url(#tw-body)" stroke="#000" strokeWidth="0.8" />
          {/* Knob notch lines */}
          {[
            [48, 81],
            [192, 81],
          ].map(([cx, cy]) =>
            [...Array(8)].map((_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              const x1 = (cx as number) + Math.cos(a) * 5;
              const y1 = (cy as number) + Math.sin(a) * 5;
              const x2 = (cx as number) + Math.cos(a) * 8;
              const y2 = (cy as number) + Math.sin(a) * 8;
              return (
                <line key={`${cx}-${i}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(255,225,170,0.55)" strokeWidth="0.5"
                />
              );
            })
          )}
          {/* Highlight strip across the platen */}
          <line x1="56" y1="78" x2="184" y2="78" stroke="rgba(255,225,170,0.18)" strokeWidth="1" />
        </g>

        {/* ── Return lever on the right ── */}
        <g>
          <line x1="195" y1="80" x2="222" y2="58" stroke="#1C0E04" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="222" cy="58" r="3.6" fill="url(#tw-key)" stroke="#1C0E04" strokeWidth="0.6" />
        </g>

        {/* ── Bell on top-right (rings on carriage return) ── */}
        <g className="tw-bell" style={{ transformOrigin: "208px 96px" }}>
          <circle cx="208" cy="96" r="5" fill="url(#tw-key)" stroke="#1C0E04" strokeWidth="0.7" />
          <circle cx="208" cy="96" r="2" fill="#1C0E04" />
        </g>

        {/* ── Main body shell ── */}
        <g>
          {/* Drop shadow under shell */}
          <path
            d="M 26 200 L 22 124 Q 22 92 50 92 L 190 92 Q 218 92 218 124 L 214 200 Z"
            fill="rgba(0,0,0,0.4)"
            transform="translate(2 4)"
          />
          {/* Shell body */}
          <path
            d="M 26 200 L 22 124 Q 22 92 50 92 L 190 92 Q 218 92 218 124 L 214 200 Z"
            fill="url(#tw-body)"
            stroke="#000"
            strokeWidth="1.2"
          />
          {/* Top sheen */}
          <path
            d="M 30 124 Q 30 96 52 96 L 188 96 Q 210 96 210 124 L 210 130 L 30 130 Z"
            fill="url(#tw-sheen)"
            opacity="0.7"
          />

          {/* Front face plate / nameplate */}
          <rect x="92" y="182" width="56" height="14" rx="2" fill="#0E0805" stroke="rgba(212,104,42,0.6)" strokeWidth="0.7" />
          <text x="120" y="192" textAnchor="middle"
            fontFamily="Georgia, serif" fontStyle="italic"
            fontWeight="900" fontSize="9"
            fill="#FFE0A0" letterSpacing="0.18em">
            R9
          </text>

          {/* Decorative line accents */}
          <line x1="26" y1="200" x2="214" y2="200" stroke="rgba(212,104,42,0.18)" strokeWidth="0.5" />
        </g>

        {/* ── Keys — three staggered rows ── */}
        <g>
          {/* Row 1 (top) — 10 keys */}
          {[...Array(10)].map((_, i) => {
            const x = 36 + i * 17;
            return (
              <circle key={`r1-${i}`} cx={x} cy="142" r="6"
                fill="url(#tw-key)" stroke="#000" strokeWidth="0.6" />
            );
          })}
          {/* Row 2 (middle) — 9 keys, offset half */}
          {[...Array(9)].map((_, i) => {
            const x = 44.5 + i * 17;
            return (
              <circle key={`r2-${i}`} cx={x} cy="158" r="6"
                fill="url(#tw-key)" stroke="#000" strokeWidth="0.6" />
            );
          })}
          {/* Row 3 (bottom) — 8 keys */}
          {[...Array(8)].map((_, i) => {
            const x = 53 + i * 17;
            return (
              <circle key={`r3-${i}`} cx={x} cy="174" r="6"
                fill="url(#tw-key)" stroke="#000" strokeWidth="0.6" />
            );
          })}

          {/* Tiny key-top letters in the top row */}
          {["Q","W","E","R","T","Y","U","I","O","P"].map((ch, i) => {
            const x = 36 + i * 17;
            return (
              <text key={`l1-${i}`} x={x} y={144.5} textAnchor="middle"
                fontFamily="monospace" fontWeight="800" fontSize="4.5"
                fill="#1C0E04">
                {ch}
              </text>
            );
          })}
        </g>

        {/* ── Type bars rising from the platen area ── */}
        <g stroke="#1C0E04" strokeWidth="0.6" fill="none" opacity="0.75">
          <path d="M 100 130 Q 110 110 116 90" />
          <path d="M 116 130 Q 118 108 120 90" />
          <path d="M 132 130 Q 128 110 124 90" />
        </g>
      </svg>
    </div>
  );
}
