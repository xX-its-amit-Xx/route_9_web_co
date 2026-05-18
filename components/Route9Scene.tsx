"use client";

import { useEffect, useRef } from "react";

/**
 * Hand-drawn vintage Americana roadside scene — a decorative parallax band
 * that evokes a New England Route 9 morning: warm sunrise sky, layered hills,
 * a winding road with mile-marker, three storefront silhouettes (pizzeria,
 * barber, café), telephone poles in perspective, and a tiny 1950s car
 * driving along the road.
 *
 * Each layer parallaxes at a different speed on scroll. Under reduced-motion
 * the layers stay put but the illustration still renders.
 */
export function Route9Scene() {
  const root = useRef<HTMLDivElement>(null);
  const skyRef = useRef<SVGGElement>(null);
  const hillsFar = useRef<SVGGElement>(null);
  const hillsMid = useRef<SVGGElement>(null);
  const treesRef = useRef<SVGGElement>(null);
  const buildingsRef = useRef<SVGGElement>(null);
  const polesRef = useRef<SVGGElement>(null);

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
        // Normalize scroll progress through the band: -1 = above viewport,
        // 0 = centered, +1 = below viewport
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const p = Math.max(-1.2, Math.min(1.2, progress));

        // Each layer moves at its own rate. Slower = farther away.
        if (skyRef.current)        skyRef.current.style.transform        = `translate3d(${p * -6}px, 0, 0)`;
        if (hillsFar.current)      hillsFar.current.style.transform      = `translate3d(${p * -18}px, 0, 0)`;
        if (hillsMid.current)      hillsMid.current.style.transform      = `translate3d(${p * -38}px, ${p * -4}px, 0)`;
        if (treesRef.current)      treesRef.current.style.transform      = `translate3d(${p * -62}px, 0, 0)`;
        if (buildingsRef.current)  buildingsRef.current.style.transform  = `translate3d(${p * -92}px, 0, 0)`;
        if (polesRef.current)      polesRef.current.style.transform      = `translate3d(${p * -130}px, 0, 0)`;
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
        height: "clamp(180px, 22vw, 280px)",
        background: "linear-gradient(180deg, #2a1308 0%, #1C1209 100%)",
        borderTop: "1px solid rgba(212,104,42,0.12)",
        borderBottom: "1px solid rgba(212,104,42,0.12)",
      }}
    >
      <svg
        viewBox="0 0 1440 280"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Warm dawn sky gradient */}
          <linearGradient id="r9-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1A0F08" />
            <stop offset="35%"  stopColor="#3A1C0E" />
            <stop offset="70%"  stopColor="#A04818" />
            <stop offset="92%"  stopColor="#E8A050" />
            <stop offset="100%" stopColor="#FFD080" />
          </linearGradient>

          {/* Sun glow */}
          <radialGradient id="r9-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(255,220,140,0.95)" />
            <stop offset="40%" stopColor="rgba(240,160,80,0.55)" />
            <stop offset="100%" stopColor="rgba(212,104,42,0)" />
          </radialGradient>

          {/* Road perspective fade */}
          <linearGradient id="r9-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1C1209" stopOpacity="0.4" />
            <stop offset="40%"  stopColor="#0E0905" stopOpacity="1" />
            <stop offset="100%" stopColor="#0E0905" />
          </linearGradient>

          {/* Soft haze on distant layers */}
          <linearGradient id="r9-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(58,28,14,0)" />
            <stop offset="100%" stopColor="rgba(58,28,14,0.55)" />
          </linearGradient>
        </defs>

        {/* ── Sky layer ── */}
        <g ref={skyRef} style={{ willChange: "transform" }}>
          <rect x="-100" y="0" width="1640" height="220" fill="url(#r9-sky)" />
          {/* Sun, sitting on horizon */}
          <circle cx="1120" cy="178" r="42" fill="url(#r9-sun)" />
          <circle cx="1120" cy="178" r="14" fill="#FFE0A0" opacity="0.9" />
          {/* Tiny birds */}
          <path d="M210 70 q4 -4 8 0 q4 -4 8 0" stroke="#1C1209" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round" />
          <path d="M240 84 q3 -3 6 0 q3 -3 6 0" stroke="#1C1209" strokeWidth="1" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M285 62 q3 -3 6 0 q3 -3 6 0" stroke="#1C1209" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round" />
        </g>

        {/* ── Distant hills ── */}
        <g ref={hillsFar} style={{ willChange: "transform" }}>
          <path
            d="M-100 220 L-100 175 C100 158 220 168 380 162 C520 156 640 172 780 168 C920 164 1080 156 1240 164 C1360 170 1480 165 1540 168 L1540 220 Z"
            fill="#2A1A0E"
            opacity="0.88"
          />
          <rect x="-100" y="160" width="1640" height="60" fill="url(#r9-haze)" />
        </g>

        {/* ── Mid hills with maple silhouettes ── */}
        <g ref={hillsMid} style={{ willChange: "transform" }}>
          <path
            d="M-100 220 L-100 195 C80 184 200 198 340 192 C460 188 580 200 720 195 C860 190 1000 200 1140 196 C1280 192 1420 198 1540 200 L1540 220 Z"
            fill="#3D2415"
          />
          {/* Maple silhouettes on the hill */}
          {[120, 280, 460, 700, 880, 1080, 1290].map((x, i) => {
            const h = 18 + ((i * 37) % 12);
            return (
              <g key={x} transform={`translate(${x} ${195 - h})`}>
                <path
                  d={`M0 ${h} L0 4 M-7 6 q3 -8 7 -2 q4 -6 7 2 M-9 12 q4 -8 9 -3 q5 -5 9 3`}
                  stroke="#1C1209"
                  strokeWidth="1.3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.92"
                />
                <ellipse cx="0" cy={h - 10} rx="9" ry="7" fill="#1C1209" opacity="0.95" />
              </g>
            );
          })}
        </g>

        {/* ── Foreground trees ── */}
        <g ref={treesRef} style={{ willChange: "transform" }}>
          {[40, 180, 320, 500, 1180, 1320].map((x, i) => {
            const h = 50 + ((i * 17) % 18);
            return (
              <g key={x} transform={`translate(${x} ${215 - h})`}>
                <line x1="0" y1={h} x2="0" y2={h - 6} stroke="#0E0905" strokeWidth="2.5" />
                <path
                  d={`M-${h * 0.34} ${h - 4} q${h * 0.34} -${h * 0.95} ${h * 0.68} 0 z`}
                  fill="#0E0905"
                />
                {/* Pine layered tiers */}
                <path
                  d={`M-${h * 0.28} ${h - 18} q${h * 0.28} -${h * 0.75} ${h * 0.56} 0 z`}
                  fill="#0E0905"
                />
                <path
                  d={`M-${h * 0.22} ${h - 32} q${h * 0.22} -${h * 0.55} ${h * 0.44} 0 z`}
                  fill="#0E0905"
                />
              </g>
            );
          })}
        </g>

        {/* ── Storefronts (ma-and-pa shop silhouettes) ── */}
        <g ref={buildingsRef} style={{ willChange: "transform" }}>
          {/* Pizzeria — pitched roof + sign */}
          <g transform="translate(540 162)">
            <path d="M0 50 L0 16 L34 0 L68 16 L68 50 Z" fill="#0B0604" />
            <rect x="10" y="22" width="48" height="3" fill="#D4682A" opacity="0.85" />
            <rect x="14" y="30" width="10" height="14" fill="#3A1C0E" />
            <rect x="44" y="30" width="10" height="14" fill="#3A1C0E" />
            {/* Window glow */}
            <rect x="14" y="30" width="10" height="14" fill="#FFC580" opacity="0.5" />
            <rect x="44" y="30" width="10" height="14" fill="#FFC580" opacity="0.5" />
          </g>

          {/* Barber — flat roof + barber pole */}
          <g transform="translate(680 168)">
            <rect x="0" y="6" width="58" height="44" fill="#0B0604" />
            <rect x="-3" y="2" width="64" height="6" fill="#1C1209" />
            <rect x="8" y="18" width="14" height="16" fill="#FFC580" opacity="0.5" />
            <rect x="34" y="18" width="14" height="16" fill="#FFC580" opacity="0.5" />
            <rect x="26" y="38" width="6" height="12" fill="#3A1C0E" />
            {/* Barber pole */}
            <rect x="55" y="18" width="3.5" height="22" fill="#FAFAFA" opacity="0.85" />
            <path d="M55 22 L58.5 19 M55 28 L58.5 25 M55 34 L58.5 31" stroke="#D4682A" strokeWidth="1.2" />
          </g>

          {/* Café — rounded awning */}
          <g transform="translate(820 170)">
            <rect x="0" y="10" width="52" height="40" fill="#0B0604" />
            <path d="M-4 14 q26 -12 60 0 L52 18 L-4 18 Z" fill="#D4682A" opacity="0.78" />
            <path d="M2 14 L4 18 M10 13 L11 18 M18 12 L19 18 M26 12 L27 18 M34 12 L35 18 M42 13 L43 18 M48 14 L49 18" stroke="#0E0905" strokeWidth="0.7" opacity="0.5" />
            <rect x="6" y="26" width="40" height="14" fill="#FFC580" opacity="0.45" />
            <rect x="22" y="40" width="8" height="10" fill="#3A1C0E" />
          </g>

          {/* Tiny mile marker on the roadside */}
          <g transform="translate(420 178)">
            <rect x="0" y="0" width="14" height="20" rx="1.5" fill="#0E0905" stroke="#D4682A" strokeWidth="1" />
            <text x="7" y="9" textAnchor="middle" fontSize="5" fill="#D4682A" fontFamily="monospace" fontWeight="700">MA</text>
            <text x="7" y="16" textAnchor="middle" fontSize="7" fill="#D4682A" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700">9</text>
          </g>
        </g>

        {/* ── Telephone poles in perspective ── */}
        <g ref={polesRef} style={{ willChange: "transform" }}>
          {[
            { x: 100, h: 60 },
            { x: 340, h: 56 },
            { x: 580, h: 52 },
            { x: 820, h: 50 },
            { x: 1060, h: 50 },
            { x: 1300, h: 52 },
          ].map(({ x, h }) => (
            <g key={x} transform={`translate(${x} ${220 - h})`}>
              <line x1="0" y1="0" x2="0" y2={h} stroke="#0B0604" strokeWidth="1.6" />
              <line x1="-8" y1="6" x2="8" y2="6" stroke="#0B0604" strokeWidth="1.4" />
              <line x1="-8" y1="11" x2="8" y2="11" stroke="#0B0604" strokeWidth="1.2" />
              {/* Insulators */}
              <circle cx="-6" cy="6" r="1" fill="#3A1C0E" />
              <circle cx="6" cy="6" r="1" fill="#3A1C0E" />
            </g>
          ))}
          {/* Connecting wires — gentle sag */}
          <path
            d="M100 166 q120 6 240 0 q120 -2 240 4 q120 4 240 0 q120 -4 240 0 q120 4 240 0"
            stroke="#0B0604"
            strokeWidth="0.6"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M100 171 q120 8 240 -2 q120 -4 240 6 q120 4 240 0 q120 -4 240 2 q120 4 240 0"
            stroke="#0B0604"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* ── Road (anchor layer, no parallax) ── */}
        <g>
          {/* Asphalt receding to vanishing point */}
          <path d="M-100 280 L-100 220 L720 200 L1540 220 L1540 280 Z" fill="url(#r9-road)" />
          {/* Center dashed yellow line — perspective */}
          <path
            d="M-60 280 L680 210 L760 210 L1500 280"
            stroke="rgba(255,200,100,0.7)"
            strokeWidth="1.4"
            strokeDasharray="20 14"
            fill="none"
          />
          {/* Edge lines */}
          <path d="M-100 252 L720 208 L1540 252" stroke="rgba(243,233,213,0.18)" strokeWidth="0.8" fill="none" />
        </g>

        {/* ── A small car driving down Route 9 ── */}
        <g className="r9-car-drive">
          <g transform="translate(0 0)">
            {/* Car body — silhouette */}
            <g className="r9-car-body">
              <ellipse cx="0" cy="2" rx="14" ry="3" fill="#000" opacity="0.45" />
              <path d="M-12 0 L-9 -8 L9 -8 L12 0 Z" fill="#1C1209" />
              <path d="M-10 -1 L-7 -6 L7 -6 L10 -1 Z" fill="#3A1C0E" />
              {/* Headlight glow */}
              <circle cx="12" cy="-2" r="2.4" fill="rgba(255,220,140,0.95)" />
              <circle cx="12" cy="-2" r="5" fill="rgba(255,200,100,0.35)" />
              {/* Tail light */}
              <circle cx="-11" cy="-2" r="1" fill="#D4682A" />
            </g>
          </g>
        </g>

        {/* ── Subtle ground fog ── */}
        <rect x="-100" y="200" width="1640" height="30" fill="rgba(243,233,213,0.03)" />
      </svg>

      {/* Top fade so the band hands off smoothly to the section above */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-6 pointer-events-none"
        style={{ background: "linear-gradient(180deg, var(--bg), transparent)" }}
      />
      {/* Bottom fade into the section below */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-6 pointer-events-none"
        style={{ background: "linear-gradient(0deg, var(--bg), transparent)" }}
      />
    </div>
  );
}
