"use client";

/**
 * Classic spinning barbershop pole, reskinned to the Route 9 palette
 * (brand-orange + cream + dark warm-brown instead of red/white/blue).
 *
 *   - Chrome glass dome on top with a small finial
 *   - Glass cylinder in the middle with diagonal stripes that
 *     continuously rise (the iconic "spinning" illusion is produced by
 *     animating a repeating-linear-gradient vertically)
 *   - Chrome base ring + mounting bolts on the side
 *
 * Pure SVG + CSS. Decorative (aria-hidden, pointer-events:none).
 * Reduced-motion freezes the stripe animation in place.
 */
export function BarberPole({ height = 280 }: { height?: number }) {
  // 80 × 280 by default; the stripe gradient is sized to viewport so it
  // can animate via background-position on a real DOM element below the
  // SVG, layered behind a clipped rectangle inside the SVG.
  const width = Math.round(height * (80 / 280));

  return (
    <div
      aria-hidden
      className="barber-pole-root inline-block select-none"
      style={{
        width,
        height,
        position: "relative",
        filter:
          "drop-shadow(0 6px 14px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
      }}
    >
      {/* The animated stripes — a regular DOM element so we can drive
          background-position from CSS (SVG patterns don't accept CSS
          background animations). Clipped to a pill shape so it reads
          as glass tubing. */}
      <div
        className="barber-stripes"
        style={{
          position: "absolute",
          top: "14%",
          left: "16%",
          right: "16%",
          bottom: "14%",
          borderRadius: "999px",
          background:
            "repeating-linear-gradient(155deg," +
            "#D4682A 0,#D4682A 12px," +
            "#FAF0DC 12px,#FAF0DC 24px," +
            "#2A1810 24px,#2A1810 36px," +
            "#FAF0DC 36px,#FAF0DC 48px)",
          backgroundSize: "100% 96px",
          // Inner shadow + subtle glass tint
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.35), inset 0 0 14px rgba(0,0,0,0.4), inset 6px 0 12px rgba(255,255,255,0.18), inset -6px 0 12px rgba(0,0,0,0.25)",
        }}
      />

      {/* Glass-cylinder highlight — vertical sheen down the middle-left */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "14%",
          left: "22%",
          bottom: "14%",
          width: "10%",
          borderRadius: "999px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0.04) 70%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* SVG chrome — dome top, base ring, and mounting hardware */}
      <svg
        viewBox="0 0 80 280"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {/* Chrome metal gradient */}
          <linearGradient id="bp-chrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#2A1810" />
            <stop offset="25%"  stopColor="#9B7860" />
            <stop offset="50%"  stopColor="#F0E0C8" />
            <stop offset="75%"  stopColor="#9B7860" />
            <stop offset="100%" stopColor="#2A1810" />
          </linearGradient>
          {/* Glass-dome gradient — top transparent → bottom-warm */}
          <linearGradient id="bp-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.85)" />
            <stop offset="40%"  stopColor="rgba(255,200,140,0.55)" />
            <stop offset="100%" stopColor="rgba(168,72,24,0.7)" />
          </linearGradient>
          {/* Finial gradient */}
          <radialGradient id="bp-finial" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#FFE0A0" />
            <stop offset="55%"  stopColor="#D4682A" />
            <stop offset="100%" stopColor="#5E2208" />
          </radialGradient>
        </defs>

        {/* ── Top finial (decorative ball) ── */}
        <g>
          <line x1="40" y1="0" x2="40" y2="8" stroke="#2A1810" strokeWidth="1.5" />
          <circle cx="40" cy="10" r="6" fill="url(#bp-finial)" stroke="#2A1810" strokeWidth="0.8" />
          <circle cx="38" cy="8" r="1.6" fill="rgba(255,225,170,0.85)" />
        </g>

        {/* ── Top chrome cap ── */}
        <rect x="6" y="16"  width="68" height="6"  rx="2" fill="url(#bp-chrome)" />
        <rect x="10" y="22" width="60" height="4"  rx="1.5" fill="url(#bp-chrome)" />
        <rect x="6" y="26"  width="68" height="14" rx="3" fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
        {/* Top dome over the stripe cylinder */}
        <path
          d="M 12 40 Q 40 22 68 40 L 68 44 L 12 44 Z"
          fill="url(#bp-dome)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />

        {/* ── Bottom chrome cap (mirror of top) ── */}
        <path
          d="M 12 240 Q 40 258 68 240 L 68 236 L 12 236 Z"
          fill="url(#bp-dome)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
        <rect x="6"  y="240" width="68" height="14" rx="3"  fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
        <rect x="10" y="254" width="60" height="4"  rx="1.5" fill="url(#bp-chrome)" />
        <rect x="6"  y="258" width="68" height="6"  rx="2"  fill="url(#bp-chrome)" />

        {/* ── Side mounting bracket ── */}
        <g>
          {/* Strap arms reaching to the wall (right side) */}
          <path
            d="M 74 70 L 88 64 L 88 76 L 74 82 Z"
            fill="url(#bp-chrome)"
            stroke="#2A1810"
            strokeWidth="0.6"
          />
          <path
            d="M 74 198 L 88 192 L 88 204 L 74 210 Z"
            fill="url(#bp-chrome)"
            stroke="#2A1810"
            strokeWidth="0.6"
          />
          {/* Wall plate */}
          <rect x="86" y="60" width="6" height="150" fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
          {/* Mounting screws */}
          <circle cx="89" cy="70"  r="1.4" fill="#2A1810" />
          <circle cx="89" cy="140" r="1.4" fill="#2A1810" />
          <circle cx="89" cy="200" r="1.4" fill="#2A1810" />
        </g>

        {/* ── Tiny "BARBER" label on the top cap, etched ── */}
        <text
          x="40" y="36"
          textAnchor="middle"
          fontSize="4.2"
          fontFamily="Georgia, serif"
          fontWeight="800"
          letterSpacing="1.4"
          fill="#1C1209"
          opacity="0.7"
        >
          BARBER
        </text>
      </svg>
    </div>
  );
}
