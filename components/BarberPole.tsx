"use client";

/**
 * Classic spinning barbershop pole, reskinned to the Route 9 palette
 * (brand-orange + cream + dark warm-brown instead of red/white/blue).
 *
 *   - Chrome glass dome on top with a small finial
 *   - Glass cylinder in the middle with diagonal stripes that
 *     continuously rise (the iconic "spinning" illusion is produced by
 *     animating a repeating-linear-gradient vertically)
 *   - Genuine glass-tube read: cylindrical curvature shading + a static
 *     vertical specular sweep layered OVER the spinning stripes, plus a
 *     thin counter-rim light on the right edge
 *   - Mirror-polished chrome caps (multi-stop chrome bands, banded cap
 *     faces, rim lights, occlusion shadows where glass meets metal,
 *     visible screws with specular dots)
 *   - Chrome wall bracket with mounting screws and a cast shadow under
 *     each strap arm
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

      {/* Cylindrical curvature shading — static gradient OVER the moving
          stripes models the glass tube's roundness: dark falloff at both
          silhouette edges, open in the middle. */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "14%",
          left: "16%",
          right: "16%",
          bottom: "14%",
          borderRadius: "999px",
          background:
            "linear-gradient(90deg," +
            "rgba(20,8,2,0.42) 0%," +
            "rgba(20,8,2,0.14) 11%," +
            "rgba(20,8,2,0) 28%," +
            "rgba(20,8,2,0) 58%," +
            "rgba(20,8,2,0.16) 80%," +
            "rgba(20,8,2,0.46) 100%)",
        }}
      />

      {/* Glass-cylinder specular sweep — bright vertical sheen down the
          left third (light source upper-left), with a hot narrow core. */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "14%",
          left: "22%",
          bottom: "14%",
          width: "13%",
          borderRadius: "999px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.55) 58%, rgba(255,255,255,0) 100%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.14) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0) 100%)",
          backgroundBlendMode: "screen",
          mixBlendMode: "screen",
          opacity: 0.75,
        }}
      />

      {/* Counter rim light — thin cool reflection on the right edge of
          the tube so the dark falloff doesn't read as flat paint. */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "17%",
          right: "19.5%",
          bottom: "17%",
          width: "3%",
          borderRadius: "999px",
          background:
            "linear-gradient(180deg, rgba(255,240,215,0) 0%, rgba(255,240,215,0.38) 22%, rgba(255,240,215,0.18) 55%, rgba(255,240,215,0.34) 82%, rgba(255,240,215,0) 100%)",
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
          {/* Chrome metal gradient — mirror bands: deep shadow, warm
              mid-reflection, hot specular core just left of center */}
          <linearGradient id="bp-chrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#190D05" />
            <stop offset="10%"  stopColor="#5E3E26" />
            <stop offset="26%"  stopColor="#CBAE86" />
            <stop offset="40%"  stopColor="#FFF9EA" />
            <stop offset="50%"  stopColor="#F5E6C9" />
            <stop offset="63%"  stopColor="#A87E58" />
            <stop offset="82%"  stopColor="#4A2E1A" />
            <stop offset="93%"  stopColor="#2A1810" />
            <stop offset="100%" stopColor="#190D05" />
          </linearGradient>
          {/* Vertical band shading laid over each cap face — light top
              edge catching the light, ambient-occluded lower edge */}
          <linearGradient id="bp-cap-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,250,235,0.45)" />
            <stop offset="30%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="78%"  stopColor="rgba(0,0,0,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
          </linearGradient>
          {/* Occlusion shadow cast by the top cap onto the glass */}
          <linearGradient id="bp-occ-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(10,4,1,0.45)" />
            <stop offset="100%" stopColor="rgba(10,4,1,0)" />
          </linearGradient>
          {/* Occlusion shadow rising from the bottom cap */}
          <linearGradient id="bp-occ-bot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(10,4,1,0)" />
            <stop offset="100%" stopColor="rgba(10,4,1,0.42)" />
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
          {/* Specular catch + lower-right rim bounce */}
          <circle cx="38" cy="8" r="1.6" fill="rgba(255,225,170,0.9)" />
          <path d="M 43.6 12.6 A 6 6 0 0 0 44.8 8.4" stroke="rgba(255,210,150,0.45)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Occlusion where the finial stem meets the cap */}
          <ellipse cx="40" cy="16.4" rx="4.5" ry="1.2" fill="rgba(10,4,1,0.35)" />
        </g>

        {/* ── Top chrome cap ── */}
        <rect x="6" y="16"  width="68" height="6"  rx="2" fill="url(#bp-chrome)" />
        <rect x="6" y="16"  width="68" height="6"  rx="2" fill="url(#bp-cap-face)" />
        <rect x="10" y="22" width="60" height="4"  rx="1.5" fill="url(#bp-chrome)" />
        <rect x="10" y="22" width="60" height="4"  rx="1.5" fill="url(#bp-cap-face)" opacity="0.8" />
        {/* Neck occlusion — the narrow ring sits recessed under the lid */}
        <rect x="10" y="22" width="60" height="1.4" fill="rgba(10,4,1,0.35)" />
        <rect x="6" y="26"  width="68" height="14" rx="3" fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
        <rect x="6" y="26"  width="68" height="14" rx="3" fill="url(#bp-cap-face)" opacity="0.9" />
        {/* Rim lights — bright machined edges on each cap tier */}
        <line x1="8"  y1="16.7" x2="72" y2="16.7" stroke="rgba(255,250,235,0.6)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="8"  y1="26.7" x2="72" y2="26.7" stroke="rgba(255,250,235,0.5)" strokeWidth="0.7" strokeLinecap="round" />
        {/* Cap screws with specular dots */}
        <circle cx="13.5" cy="33" r="1.5" fill="#1C0E04" stroke="rgba(255,240,215,0.35)" strokeWidth="0.4" />
        <circle cx="13.1" cy="32.5" r="0.5" fill="rgba(255,240,215,0.7)" />
        <circle cx="66.5" cy="33" r="1.5" fill="#1C0E04" stroke="rgba(255,240,215,0.25)" strokeWidth="0.4" />
        <circle cx="66.1" cy="32.5" r="0.5" fill="rgba(255,240,215,0.55)" />
        {/* Top dome over the stripe cylinder */}
        <path
          d="M 12 40 Q 40 22 68 40 L 68 44 L 12 44 Z"
          fill="url(#bp-dome)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
        {/* Dome specular arc — small hot reflection upper-left */}
        <path d="M 20 37 Q 30 30 42 30" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        {/* Occlusion: cap assembly shades the top of the glass tube */}
        <rect x="13" y="42" width="54" height="7" fill="url(#bp-occ-top)" />

        {/* ── Bottom chrome cap (mirror of top) ── */}
        {/* Occlusion: glass darkens as it seats into the base collar */}
        <rect x="13" y="230" width="54" height="7" fill="url(#bp-occ-bot)" />
        <path
          d="M 12 240 Q 40 258 68 240 L 68 236 L 12 236 Z"
          fill="url(#bp-dome)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
        <rect x="6"  y="240" width="68" height="14" rx="3"  fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
        <rect x="6"  y="240" width="68" height="14" rx="3"  fill="url(#bp-cap-face)" opacity="0.9" />
        <rect x="10" y="254" width="60" height="4"  rx="1.5" fill="url(#bp-chrome)" />
        <rect x="10" y="254" width="60" height="4"  rx="1.5" fill="url(#bp-cap-face)" opacity="0.8" />
        <rect x="10" y="254" width="60" height="1.2" fill="rgba(10,4,1,0.35)" />
        <rect x="6"  y="258" width="68" height="6"  rx="2"  fill="url(#bp-chrome)" />
        <rect x="6"  y="258" width="68" height="6"  rx="2"  fill="url(#bp-cap-face)" />
        {/* Rim lights on the base tiers */}
        <line x1="8" y1="240.7" x2="72" y2="240.7" stroke="rgba(255,250,235,0.55)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="8" y1="258.7" x2="72" y2="258.7" stroke="rgba(255,250,235,0.4)" strokeWidth="0.7" strokeLinecap="round" />
        {/* Base screws */}
        <circle cx="13.5" cy="247" r="1.5" fill="#1C0E04" stroke="rgba(255,240,215,0.35)" strokeWidth="0.4" />
        <circle cx="13.1" cy="246.5" r="0.5" fill="rgba(255,240,215,0.7)" />
        <circle cx="66.5" cy="247" r="1.5" fill="#1C0E04" stroke="rgba(255,240,215,0.25)" strokeWidth="0.4" />
        <circle cx="66.1" cy="246.5" r="0.5" fill="rgba(255,240,215,0.55)" />
        {/* Soft contact shadow under the whole base */}
        <ellipse cx="40" cy="266.5" rx="33" ry="3" fill="rgba(10,4,1,0.28)" />
        <ellipse cx="40" cy="266.5" rx="20" ry="1.8" fill="rgba(10,4,1,0.22)" />

        {/* ── Side mounting bracket ── */}
        <g>
          {/* Cast shadows the strap arms throw down onto the wall plate */}
          <path d="M 74 82 L 88 76 L 88 80 L 74 86 Z" fill="rgba(10,4,1,0.32)" />
          <path d="M 74 210 L 88 204 L 88 208 L 74 214 Z" fill="rgba(10,4,1,0.32)" />
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
          {/* Top-edge rim light on each strap arm */}
          <path d="M 74 70 L 88 64" stroke="rgba(255,250,235,0.55)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
          <path d="M 74 198 L 88 192" stroke="rgba(255,250,235,0.5)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
          {/* Wall plate */}
          <rect x="86" y="60" width="6" height="150" fill="url(#bp-chrome)" stroke="#2A1810" strokeWidth="0.6" />
          {/* Wall-plate left-edge rim light */}
          <line x1="86.7" y1="61.5" x2="86.7" y2="208.5" stroke="rgba(255,250,235,0.4)" strokeWidth="0.6" strokeLinecap="round" />
          {/* Mounting screws — heads with specular catch */}
          <circle cx="89" cy="70"  r="1.4" fill="#1C0E04" stroke="rgba(255,240,215,0.3)" strokeWidth="0.35" />
          <circle cx="88.6" cy="69.6" r="0.45" fill="rgba(255,240,215,0.65)" />
          <circle cx="89" cy="140" r="1.4" fill="#1C0E04" stroke="rgba(255,240,215,0.3)" strokeWidth="0.35" />
          <circle cx="88.6" cy="139.6" r="0.45" fill="rgba(255,240,215,0.65)" />
          <circle cx="89" cy="200" r="1.4" fill="#1C0E04" stroke="rgba(255,240,215,0.3)" strokeWidth="0.35" />
          <circle cx="88.6" cy="199.6" r="0.45" fill="rgba(255,240,215,0.65)" />
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
        {/* Etched-letter light kick just below the engraving */}
        <text
          x="40" y="36.7"
          textAnchor="middle"
          fontSize="4.2"
          fontFamily="Georgia, serif"
          fontWeight="800"
          letterSpacing="1.4"
          fill="rgba(255,245,225,0.35)"
        >
          BARBER
        </text>
      </svg>
    </div>
  );
}
