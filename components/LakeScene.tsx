"use client";

import { useEffect, useRef } from "react";

/**
 * Hand-drawn Lake Quinsigamond at dusk — a decorative parallax band that
 * complements <Route9Scene/> across the page. One SVG, multiple layers:
 *
 *   - Warm dusk sky gradient (pink → lavender → indigo)
 *   - Setting sun with rippled reflection in the water
 *   - Distant treelined opposite shore (silhouette)
 *   - Animated lake ripples (concentric arcs sliding outward)
 *   - A small sailboat silhouette gliding across the horizon
 *   - Floating lily pads / leaves on the surface
 *   - Lapping water along the foreground shoreline
 *
 * Layers parallax at their own rates as the band scrolls through the
 * viewport (rAF-throttled). Under prefers-reduced-motion the parallax
 * stops, the sailboat hides, and ripples freeze.
 */
export function LakeScene() {
  const root = useRef<HTMLDivElement>(null);
  const skyRef = useRef<SVGGElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const farShore = useRef<SVGGElement>(null);
  const lilyRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const el = root.current;
    if (!el) return;

    let rafQueued = false;
    const onScroll = () => {
      if (rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(() => {
        rafQueued = false;
        const rect = el.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const p = Math.max(-1.2, Math.min(1.2, progress));

        if (skyRef.current)   skyRef.current.style.transform   = `translate3d(${p * -4}px, 0, 0)`;
        if (sunRef.current)   sunRef.current.style.transform   = `translate3d(${p * -12}px, 0, 0)`;
        if (farShore.current) farShore.current.style.transform = `translate3d(${p * -34}px, 0, 0)`;
        if (lilyRef.current)  lilyRef.current.style.transform  = `translate3d(${p * -84}px, ${p * -3}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="relative w-full overflow-hidden select-none pointer-events-none"
      style={{
        height: "clamp(200px, 24vw, 320px)",
        background: "linear-gradient(180deg, #1A0F08 0%, #2A1308 100%)",
        borderTop: "1px solid rgba(212,104,42,0.12)",
        borderBottom: "1px solid rgba(212,104,42,0.12)",
      }}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Dusk sky — pink to lavender to deep amber at horizon */}
          <linearGradient id="lake-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2A1432" />
            <stop offset="25%"  stopColor="#5A2440" />
            <stop offset="55%"  stopColor="#B85040" />
            <stop offset="80%"  stopColor="#E8923A" />
            <stop offset="100%" stopColor="#FFC078" />
          </linearGradient>

          {/* Water reflection — mirror of the sky but darker + cooler */}
          <linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFB060" stopOpacity="0.85" />
            <stop offset="15%"  stopColor="#A04020" stopOpacity="0.92" />
            <stop offset="45%"  stopColor="#3A1820" stopOpacity="1" />
            <stop offset="100%" stopColor="#150A12" />
          </linearGradient>

          {/* Sun radial */}
          <radialGradient id="lake-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(255,235,170,1)" />
            <stop offset="35%" stopColor="rgba(255,180,90,0.7)" />
            <stop offset="100%" stopColor="rgba(232,146,58,0)" />
          </radialGradient>

          {/* Sun reflection on water — vertical stretched glow */}
          <linearGradient id="sun-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,200,120,0.7)" />
            <stop offset="100%" stopColor="rgba(255,200,120,0)" />
          </linearGradient>

          {/* Ripple "shimmer" gradient — for animated horizontal stripes */}
          <linearGradient id="ripple-stripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(255,200,120,0)" />
            <stop offset="50%" stopColor="rgba(255,200,120,0.55)" />
            <stop offset="100%" stopColor="rgba(255,200,120,0)" />
          </linearGradient>
        </defs>

        {/* ── Sky ── */}
        <g ref={skyRef} style={{ willChange: "transform" }}>
          <rect x="-100" y="0" width="1640" height="170" fill="url(#lake-sky)" />
          {/* Tiny stars dotted across the upper sky */}
          {[
            { x: 120,  y: 22, r: 0.8 },
            { x: 280,  y: 14, r: 0.6 },
            { x: 450,  y: 34, r: 0.7 },
            { x: 1020, y: 20, r: 0.9 },
            { x: 1230, y: 30, r: 0.6 },
            { x: 1360, y: 16, r: 0.8 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFE0A0" opacity="0.85" />
          ))}
          {/* Wispy cloud streaks */}
          <path d="M180 78 q60 -10 140 0 q60 6 120 -2" stroke="rgba(255,210,150,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M880 96 q80 -8 180 0 q60 4 140 -4" stroke="rgba(255,210,150,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* ── Sun + its reflection ── */}
        <g ref={sunRef} style={{ willChange: "transform" }}>
          {/* The sun itself, sitting on horizon */}
          <circle cx="780" cy="158" r="46" fill="url(#lake-sun)" />
          <circle cx="780" cy="158" r="18" fill="#FFE0A0" opacity="0.92" />
          {/* Reflection in water — stretched vertical column */}
          <ellipse cx="780" cy="172" rx="22" ry="6" fill="url(#sun-reflect)" />
          <rect x="770" y="170" width="20" height="120" fill="url(#sun-reflect)" opacity="0.55" />
          <ellipse cx="780" cy="180" rx="14" ry="3" fill="#FFE0A0" opacity="0.75" />
        </g>

        {/* ── Distant treed shore ── */}
        <g ref={farShore} style={{ willChange: "transform" }}>
          {/* Shore strip */}
          <path
            d="M-100 170 L-100 156 C100 152 240 158 380 154 C520 150 640 158 780 154 C920 150 1060 156 1240 152 C1360 150 1480 154 1540 154 L1540 170 Z"
            fill="#1C0E16"
            opacity="0.95"
          />
          {/* Distant pine silhouettes */}
          {[80, 200, 340, 500, 620, 920, 1060, 1200, 1340].map((x, i) => {
            const h = 12 + ((i * 7) % 9);
            return (
              <g key={x} transform={`translate(${x} ${154 - h})`}>
                <line x1="0" y1={h} x2="0" y2={h - 2} stroke="#0E0810" strokeWidth="1" />
                <path d={`M-${h * 0.35} ${h - 1} l${h * 0.35} -${h} l${h * 0.35} ${h} z`} fill="#0E0810" />
              </g>
            );
          })}
          {/* Subtle haze over far shore */}
          <rect x="-100" y="148" width="1640" height="26" fill="rgba(58,28,14,0.32)" />
        </g>

        {/* ── Lake water ── */}
        <g>
          <rect x="-100" y="170" width="1640" height="150" fill="url(#lake-water)" />

          {/* Mirror-image of treed shore (faint) — reflection */}
          <path
            d="M-100 170 L-100 184 C100 188 240 182 380 186 C520 190 640 182 780 186 C920 190 1060 184 1240 188 C1360 190 1480 186 1540 186 L1540 170 Z"
            fill="#150A12"
            opacity="0.55"
          />

          {/* Animated water ripples — three horizontal "sheen" stripes
              sliding rightward at staggered offsets */}
          <g>
            <rect x="-1440" y="200" width="1440" height="1.5"
              fill="url(#ripple-stripe)" className="lake-ripple lake-ripple-1" />
            <rect x="-1440" y="240" width="1440" height="1.2"
              fill="url(#ripple-stripe)" className="lake-ripple lake-ripple-2" />
            <rect x="-1440" y="278" width="1440" height="1"
              fill="url(#ripple-stripe)" className="lake-ripple lake-ripple-3" />
          </g>

          {/* Static ripple arcs around the sun-reflection — concentric ellipses */}
          {[10, 18, 26, 34, 42, 52].map((r, i) => (
            <ellipse
              key={r}
              cx="780"
              cy={210 + i * 8}
              rx={r * 2.4}
              ry={r * 0.45}
              fill="none"
              stroke="rgba(255,200,120,0.18)"
              strokeWidth="0.9"
              opacity={1 - i * 0.13}
            />
          ))}
        </g>

        {/* ── Sailboat gliding across the horizon ── */}
        <g className="lake-sailboat">
          <g transform="translate(0 0)">
            {/* Hull */}
            <path d="M-12 4 q12 6 24 0 L18 8 L-6 8 Z" fill="#0E0810" />
            {/* Mast */}
            <line x1="0" y1="4" x2="0" y2="-22" stroke="#0E0810" strokeWidth="1.4" />
            {/* Main sail (triangle) */}
            <path d="M0 -22 L0 0 L-12 0 Z" fill="#3A1820" opacity="0.92" />
            {/* Jib (small front sail) */}
            <path d="M0 -22 L0 -4 L8 -2 Z" fill="#5A2A30" opacity="0.85" />
            {/* Tiny reflection in water */}
            <ellipse cx="0" cy="12" rx="14" ry="1.2" fill="#0E0810" opacity="0.45" />
          </g>
        </g>

        {/* ── Floating lily pads near the foreground ── */}
        <g ref={lilyRef} style={{ willChange: "transform" }}>
          {[
            { x: 120,  y: 268, s: 1   },
            { x: 240,  y: 290, s: 0.85 },
            { x: 1180, y: 274, s: 1.1  },
            { x: 1300, y: 296, s: 0.9 },
          ].map(({ x, y, s }, i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} className="lily-bob" style={{ animationDelay: `${i * 0.6}s` }}>
              {/* Pad ellipse with a notch cut out */}
              <ellipse cx="0" cy="0" rx="14" ry="6" fill="#0F1810" opacity="0.85" />
              <path d="M-4 -2 L0 0 L-4 4 Z" fill="#1A0E10" />
              {/* Tiny lily flower */}
              <circle cx="6" cy="-2" r="2" fill="#E8C0A0" opacity="0.85" />
              <circle cx="6" cy="-2" r="0.8" fill="#FFE0B0" />
              {/* Pad reflection ring */}
              <ellipse cx="0" cy="2" rx="14" ry="1" fill="rgba(255,200,120,0.18)" />
            </g>
          ))}
        </g>

        {/* Foreground shoreline — subtle dark band at the bottom edge */}
        <path d="M-100 320 L-100 304 q200 -8 400 0 q200 8 400 -4 q200 -8 400 4 q200 6 440 -2 L1540 320 Z"
          fill="#0E0810" opacity="0.92" />

        {/* Lake fog over the water (subtle) */}
        <rect x="-100" y="200" width="1640" height="30" fill="rgba(255,200,120,0.025)" />

        {/* Top/bottom edge fades into surrounding sections */}
        <rect x="0" y="0" width="1440" height="20" fill="url(#lake-fade-top)" />
        <rect x="0" y="300" width="1440" height="20" fill="url(#lake-fade-bot)" />
        <defs>
          <linearGradient id="lake-fade-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--bg)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lake-fade-bot" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"  stopColor="var(--bg)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Tiny label — "Lake Quinsigamond" in monospace */}
        <text
          x="50" y="46"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="700"
          fill="rgba(255,220,160,0.4)"
          letterSpacing="2.6"
        >
          LAKE QUINSIGAMOND · SHREWSBURY MA
        </text>
      </svg>
    </div>
  );
}
