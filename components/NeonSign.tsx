"use client";

/**
 * Vintage Americana neon storefront sign — a full-width decorative band
 * featuring a hand-drawn brick wall, hanging metal sign housing, and
 * "ROUTE 9 / WEB CO." rendered as glowing neon tubes. Includes:
 *   - Multi-layer SVG glow filter for realistic neon halo
 *   - Subtle flicker animation on the neon (covered under reduced-motion)
 *   - A small "OPEN" badge in the corner that pulses
 *   - Mounting chains and bolts so the sign reads as a real object
 *
 * Pure SVG → ships in the build, no network fetch. Decorative only
 * (aria-hidden, pointer-events:none).
 */
export function NeonSign() {
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden select-none pointer-events-none"
      style={{
        height: "clamp(220px, 26vw, 340px)",
        background:
          "radial-gradient(ellipse at 50% 0%, #2A1308 0%, #170B05 55%, #0A0604 100%)",
        borderTop: "1px solid rgba(212,104,42,0.14)",
        borderBottom: "1px solid rgba(212,104,42,0.14)",
      }}
    >
      {/* Slow-drifting warm ambient orbs — make the neon appear to breathe */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "clamp(320px, 32vw, 520px)",
          height: "clamp(200px, 22vw, 360px)",
          left: "22%",
          top: "5%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(212,104,42,0.2) 0%, transparent 70%)",
          filter: "blur(32px)",
          animation: "neon-orb-a 11s ease-in-out infinite",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "clamp(200px, 24vw, 400px)",
          height: "clamp(140px, 16vw, 260px)",
          right: "18%",
          top: "15%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(170,65,10,0.15) 0%, transparent 70%)",
          filter: "blur(28px)",
          animation: "neon-orb-b 15s ease-in-out infinite 2s",
          zIndex: 1,
        }}
      />

      {/* Brick wall texture — repeating pattern of staggered rectangles */}
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Neon glow filter — three blurred copies stacked for thick halo */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="g1" />
            <feGaussianBlur stdDeviation="4"   result="g2" in="SourceGraphic" />
            <feGaussianBlur stdDeviation="10"  result="g3" in="SourceGraphic" />
            <feGaussianBlur stdDeviation="22"  result="g4" in="SourceGraphic" />
            <feMerge>
              <feMergeNode in="g4" />
              <feMergeNode in="g3" />
              <feMergeNode in="g2" />
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* OPEN-badge glow filter (cooler, more amber) */}
          <filter id="open-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b1" />
            <feGaussianBlur stdDeviation="6" result="b2" in="SourceGraphic" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Single brick — 36×14 with rounded corners */}
          <pattern id="brick" x="0" y="0" width="74" height="28" patternUnits="userSpaceOnUse">
            <rect width="74" height="28" fill="#1A0D06" />
            {/* Row 1 */}
            <rect x="0"  y="0"  width="34" height="12" rx="1.5" fill="#2C1810" />
            <rect x="36" y="0"  width="34" height="12" rx="1.5" fill="#2C1810" />
            {/* Row 2 — offset half-brick */}
            <rect x="-18" y="15" width="34" height="12" rx="1.5" fill="#2C1810" />
            <rect x="18"  y="15" width="34" height="12" rx="1.5" fill="#2C1810" />
            <rect x="54"  y="15" width="34" height="12" rx="1.5" fill="#2C1810" />
            {/* Highlights — subtle top-edge glints */}
            <line x1="0"  y1="0"  x2="34" y2="0"  stroke="rgba(212,104,42,0.06)" strokeWidth="0.5" />
            <line x1="36" y1="0"  x2="70" y2="0"  stroke="rgba(212,104,42,0.06)" strokeWidth="0.5" />
            <line x1="18" y1="15" x2="52" y2="15" stroke="rgba(212,104,42,0.04)" strokeWidth="0.5" />
          </pattern>

          {/* Subtle vignette */}
          <radialGradient id="brick-vignette" cx="50%" cy="50%" r="65%">
            <stop offset="60%"  stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.62)" />
          </radialGradient>
        </defs>

        {/* Brick wall fill + vignette */}
        <rect width="1440" height="340" fill="url(#brick)" opacity="0.85" />
        <rect width="1440" height="340" fill="url(#brick-vignette)" />

        {/* ── Mounting hardware: chains hanging from above ── */}
        <g stroke="#1C1209" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
          {/* Left chain */}
          <g transform="translate(560 0)">
            <line x1="0" y1="0" x2="0" y2="42" />
            {[8, 18, 28, 38].map((y) => (
              <ellipse key={y} cx="0" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.6" />
            ))}
          </g>
          {/* Right chain */}
          <g transform="translate(880 0)">
            <line x1="0" y1="0" x2="0" y2="42" />
            {[8, 18, 28, 38].map((y) => (
              <ellipse key={y} cx="0" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.6" />
            ))}
          </g>
        </g>

        {/* ── Sign housing: rusted metal panel with bolts ── */}
        <g transform="translate(720 170)" textAnchor="middle">
          {/* Drop shadow */}
          <rect x="-260" y="-118" width="520" height="220" rx="14" fill="#000" opacity="0.55" transform="translate(4 8)" />
          {/* Outer frame */}
          <rect x="-260" y="-118" width="520" height="220" rx="14"
            fill="#0F0805"
            stroke="#3A2415"
            strokeWidth="3" />
          {/* Inner bevel highlight */}
          <rect x="-256" y="-114" width="512" height="212" rx="11"
            fill="none"
            stroke="rgba(212,104,42,0.16)"
            strokeWidth="1" />
          {/* Subtle gradient overlay for metal sheen */}
          <rect x="-260" y="-118" width="520" height="220" rx="14"
            fill="url(#brick-vignette)" opacity="0.4" />
          {/* Corner bolts */}
          {[
            [-244, -100], [244, -100], [-244, 80], [244, 80],
          ].map(([x, y]) => (
            <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
              <circle r="6" fill="#1C1209" stroke="#3A2415" strokeWidth="1.2" />
              <path d="M-3 0 L3 0 M0 -3 L0 3" stroke="#5A3E2C" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))}

          {/* ── Neon: "ROUTE 9" (the big one) ── */}
          <g style={{ filter: "url(#neon-glow)" }} className="neon-flicker">
            <text
              x="0"
              y="-30"
              fontSize="92"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="700"
              fill="#FFC580"
              stroke="#D4682A"
              strokeWidth="2"
              letterSpacing="0.04em"
            >
              Route 9
            </text>
          </g>

          {/* ── Neon: "WEB CO." subtitle ── */}
          <g style={{ filter: "url(#neon-glow)" }} className="neon-flicker neon-flicker-slow">
            <text
              x="0"
              y="20"
              fontSize="28"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="600"
              fill="#FFE0A0"
              stroke="#D4682A"
              strokeWidth="1.2"
              letterSpacing="0.34em"
            >
              WEB CO.
            </text>
          </g>

          {/* ── Decorative horizontal flourish ── */}
          <g style={{ filter: "url(#neon-glow)" }} opacity="0.92">
            <line x1="-110" y1="42" x2="-30" y2="42" stroke="#D4682A" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="-15" cy="42" r="2.5" fill="#FFC580" />
            <line x1="30" y1="42" x2="110" y2="42" stroke="#D4682A" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="15" cy="42" r="2.5" fill="#FFC580" />
          </g>

          {/* ── "EST. 2026" footer ── */}
          <text
            x="0"
            y="76"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="700"
            fill="#9B6840"
            letterSpacing="0.32em"
          >
            EST. 2026  ·  SHREWSBURY, MA
          </text>
        </g>

        {/* ── "OPEN" badge — small flickering neon in corner ── */}
        <g transform="translate(1240 240)">
          {/* Sign frame */}
          <rect x="-50" y="-26" width="100" height="52" rx="6"
            fill="#0F0805" stroke="#3A2415" strokeWidth="2" />
          {/* Mounting bolts */}
          <circle cx="-42" cy="-18" r="2.5" fill="#3A2415" />
          <circle cx="42"  cy="-18" r="2.5" fill="#3A2415" />
          <circle cx="-42" cy="18"  r="2.5" fill="#3A2415" />
          <circle cx="42"  cy="18"  r="2.5" fill="#3A2415" />
          {/* OPEN text */}
          <g style={{ filter: "url(#open-glow)" }} className="open-pulse">
            <text
              x="0" y="6"
              textAnchor="middle"
              fontSize="22"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fontWeight="700"
              fill="#FFE8B8"
              stroke="#D4682A"
              strokeWidth="1.2"
              letterSpacing="0.08em"
            >
              OPEN
            </text>
          </g>
        </g>

        {/* ── Floating ambient warm dust motes ── */}
        {[
          { cx: 180,  cy: 60,  r: 1.5, o: 0.25 },
          { cx: 320,  cy: 200, r: 1,   o: 0.18 },
          { cx: 1080, cy: 80,  r: 1.5, o: 0.22 },
          { cx: 1180, cy: 290, r: 1,   o: 0.16 },
          { cx: 90,   cy: 280, r: 1,   o: 0.2  },
          { cx: 1340, cy: 160, r: 1.5, o: 0.18 },
        ].map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="#FFC580"
            opacity={d.o}
            className="neon-mote"
            style={{ animationDelay: `${(i * 0.7).toFixed(2)}s` }}
          />
        ))}

        {/* Top fade to blend with section above */}
        <rect x="0" y="0" width="1440" height="38" fill="url(#fade-top)" />
        <defs>
          <linearGradient id="fade-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fade-bot" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"  stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Bottom fade */}
        <rect x="0" y="302" width="1440" height="38" fill="url(#fade-bot)" />
      </svg>
    </div>
  );
}
