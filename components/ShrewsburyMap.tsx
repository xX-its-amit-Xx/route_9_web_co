"use client";

/**
 * Hand-illustrated aerial map of the Route 9 corridor through Shrewsbury.
 * Drawn as a single SVG on aged-paper background: Lake Quinsigamond to
 * the east, Route 9 as a thick brand-orange road cutting across, the
 * Shrewsbury town-common cluster, a handful of "client" pins along the
 * route, a small compass rose, and a decorative title cartouche at the top.
 *
 * Decorative (aria-hidden). No animations to worry about under
 * prefers-reduced-motion.
 */
export function ShrewsburyMap() {
  // Five shop pins with hand-written labels positioned along the route.
  const PINS = [
    { x: 130, y: 178, label: "Pizzeria",  align: "above" },
    { x: 250, y: 154, label: "Barber",    align: "above" },
    { x: 360, y: 188, label: "Bakery",    align: "below" },
    { x: 480, y: 162, label: "Café",      align: "above" },
    { x: 590, y: 186, label: "Salon",     align: "below" },
  ];

  return (
    <div
      aria-hidden
      className="shrewsbury-map relative w-full select-none"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        transform: "rotate(-0.6deg)",
        filter:
          "drop-shadow(0 10px 22px rgba(28,18,9,0.22)) drop-shadow(0 3px 6px rgba(28,18,9,0.18))",
      }}
    >
      <svg
        viewBox="0 0 720 320"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          {/* Aged paper */}
          <linearGradient id="sm-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#FAF0D8" />
            <stop offset="100%" stopColor="#E8CFA0" />
          </linearGradient>
          {/* Paper fiber texture */}
          <pattern id="sm-fiber" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.32" fill="rgba(168,72,24,0.13)" />
          </pattern>
          {/* Coffee-stain ring */}
          <radialGradient id="sm-stain" cx="50%" cy="50%" r="50%">
            <stop offset="80%"  stopColor="rgba(168,72,24,0)" />
            <stop offset="100%" stopColor="rgba(168,72,24,0.45)" />
          </radialGradient>
          {/* Lake water radial */}
          <radialGradient id="sm-lake" cx="50%" cy="40%" r="80%">
            <stop offset="0%"   stopColor="#A4C5C0" />
            <stop offset="60%"  stopColor="#6E9C9A" />
            <stop offset="100%" stopColor="#3F6862" />
          </radialGradient>
        </defs>

        {/* ── Paper body ── */}
        <rect x="2" y="2" width="716" height="316" rx="6" fill="url(#sm-paper)" stroke="rgba(168,72,24,0.5)" strokeWidth="0.8" />
        <rect x="2" y="2" width="716" height="316" rx="6" fill="url(#sm-fiber)" opacity="0.55" />
        {/* Coffee-stain ring bottom-right */}
        <circle cx="640" cy="280" r="28" fill="none" stroke="rgba(168,72,24,0.45)" strokeWidth="1.2" opacity="0.6" />
        <circle cx="640" cy="280" r="28" fill="rgba(168,72,24,0.08)" />
        {/* Folded corner top-right */}
        <path d="M 706 2 L 718 2 L 718 14 Z" fill="rgba(168,72,24,0.18)" stroke="rgba(168,72,24,0.4)" strokeWidth="0.5" />

        {/* ── Title cartouche (top center) ── */}
        <g transform="translate(360 38)">
          {/* Ornamental rules either side */}
          <line x1="-150" y1="0" x2="-50" y2="0" stroke="#A84818" strokeWidth="0.7" />
          <line x1="50" y1="0" x2="150" y2="0" stroke="#A84818" strokeWidth="0.7" />
          {/* Side diamond fleurons */}
          <path d="M -52 0 l -4 -4 l -4 4 l 4 4 z" fill="#A84818" />
          <path d="M 52 0 l 4 -4 l 4 4 l -4 4 z" fill="#A84818" />
          {/* Title */}
          <text x="0" y="-2" textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="22"
            fill="#1C1209"
            letterSpacing="0.1em">
            Route 9 Corridor
          </text>
          {/* Subtitle */}
          <text x="0" y="14" textAnchor="middle"
            fontFamily="monospace"
            fontSize="8"
            fontWeight="700"
            fill="rgba(28,18,9,0.7)"
            letterSpacing="0.4em">
            SHREWSBURY · MASSACHUSETTS
          </text>
        </g>

        {/* ── Lake Quinsigamond ── eastern body of water */}
        <g>
          <path
            d="M 580 110 Q 620 100 660 120 Q 690 140 685 180 Q 680 220 650 240 Q 610 250 580 235 Q 560 220 565 180 Q 565 130 580 110 Z"
            fill="url(#sm-lake)"
            stroke="#1C1209"
            strokeWidth="0.9"
            opacity="0.92"
          />
          {/* Ripple lines */}
          <path d="M 595 150 q 20 -4 40 0 q 20 4 30 0" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" fill="none" />
          <path d="M 595 170 q 20 -3 40 1 q 20 4 30 -1" stroke="rgba(255,255,255,0.45)" strokeWidth="0.45" fill="none" />
          <path d="M 595 192 q 20 -3 40 1 q 20 4 30 -1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" fill="none" />
          <path d="M 595 214 q 20 -3 40 1 q 20 3 30 -1" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" fill="none" />
          {/* Lake label — angled across the water */}
          <text x="620" y="180" textAnchor="middle"
            fontFamily="Georgia, serif" fontStyle="italic"
            fontSize="11" fontWeight="700" fill="#1C1209"
            opacity="0.88"
            transform="rotate(-12 620 180)"
            letterSpacing="0.06em">
            Lake Quinsigamond
          </text>
        </g>

        {/* ── Side streets ── */}
        <g stroke="rgba(94,34,8,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 2.5">
          <path d="M 130 178 L 120 240" />
          <path d="M 250 154 L 240 90" />
          <path d="M 360 188 L 380 270" />
          <path d="M 360 188 L 320 250" />
          <path d="M 480 162 L 510 100" />
        </g>

        {/* ── Route 9 main road ── */}
        <g>
          {/* Asphalt body */}
          <path
            d="M 30 190 Q 180 168 360 184 Q 530 198 580 174"
            stroke="#1C1209"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Warm orange highlight stripe (the brand color) */}
          <path
            d="M 30 190 Q 180 168 360 184 Q 530 198 580 174"
            stroke="#D4682A"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.92"
          />
          {/* Center yellow dashed line */}
          <path
            d="M 30 190 Q 180 168 360 184 Q 530 198 580 174"
            stroke="rgba(255,220,140,0.92)"
            strokeWidth="1.3"
            fill="none"
            strokeDasharray="9 6"
          />
        </g>

        {/* ── MA-9 highway shield mid-road ── */}
        <g transform="translate(180 162)">
          <rect x="-18" y="-12" width="36" height="22" rx="2" fill="#FAF0D8" stroke="#1C1209" strokeWidth="1.2" />
          <text x="0" y="-2" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="800" fill="#1C1209" letterSpacing="0.1em">MASS</text>
          <text x="0" y="8" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="900" fill="#A84818">9</text>
        </g>

        {/* ── Shrewsbury town-common cluster ── */}
        <g transform="translate(310 130)">
          {/* Common green */}
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="rgba(110,138,82,0.4)" stroke="#1C1209" strokeWidth="0.8" />
          {/* A few buildings */}
          <rect x="-16" y="-8" width="6" height="6" fill="#A84818" stroke="#1C1209" strokeWidth="0.4" />
          <rect x="-7" y="-9" width="6" height="7" fill="#7A4818" stroke="#1C1209" strokeWidth="0.4" />
          <rect x="2" y="-8" width="6" height="6" fill="#A84818" stroke="#1C1209" strokeWidth="0.4" />
          <rect x="10" y="-9" width="6" height="7" fill="#7A4818" stroke="#1C1209" strokeWidth="0.4" />
          {/* Small church spire */}
          <path d="M -2 -14 L 0 -22 L 2 -14 Z" fill="#A84818" stroke="#1C1209" strokeWidth="0.4" />
          {/* Label */}
          <text x="0" y="26" textAnchor="middle"
            fontFamily="Georgia, serif" fontStyle="italic"
            fontWeight="700" fontSize="8"
            fill="#1C1209"
            letterSpacing="0.04em">
            Shrewsbury Center
          </text>
        </g>

        {/* ── Shop pins ── */}
        {PINS.map((p) => (
          <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
            {/* Pin shape */}
            <path
              d="M 0 -10 C 5 -10 8 -6 8 -2 C 8 4 0 14 0 14 C 0 14 -8 4 -8 -2 C -8 -6 -5 -10 0 -10 Z"
              fill="#D4682A"
              stroke="#1C1209"
              strokeWidth="0.9"
            />
            {/* Pin dot center */}
            <circle r="2" fill="#FFE0A0" stroke="#1C1209" strokeWidth="0.4" />
            {/* Label */}
            <text
              x="0" y={p.align === "above" ? -16 : 26}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fontWeight="700"
              fontSize="9"
              fill="#1C1209"
              letterSpacing="0.04em"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* ── Compass rose (top-left corner) ── */}
        <g transform="translate(48 268)">
          <circle r="22" fill="rgba(168,72,24,0.08)" stroke="#A84818" strokeWidth="0.8" />
          <circle r="17" fill="none" stroke="#A84818" strokeWidth="0.4" />
          {/* North fletch */}
          <path d="M 0 -16 L 4 0 L 0 -2 Z" fill="#A84818" stroke="#1C1209" strokeWidth="0.5" />
          <path d="M 0 -16 L -4 0 L 0 -2 Z" fill="#FAF0D8" stroke="#1C1209" strokeWidth="0.5" />
          {/* South */}
          <path d="M 0 16 L 4 0 L 0 2 Z" fill="#FAF0D8" stroke="#1C1209" strokeWidth="0.4" />
          <path d="M 0 16 L -4 0 L 0 2 Z" fill="#FAF0D8" stroke="#1C1209" strokeWidth="0.4" />
          {/* East / West */}
          <path d="M 16 0 L 0 -4 L 2 0 L 0 4 Z" fill="#FAF0D8" stroke="#1C1209" strokeWidth="0.4" />
          <path d="M -16 0 L 0 -4 L -2 0 L 0 4 Z" fill="#FAF0D8" stroke="#1C1209" strokeWidth="0.4" />
          {/* Labels */}
          <text x="0" y="-26" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="8" fill="#1C1209">N</text>
          <text x="0" y="32" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="8" fill="#1C1209">S</text>
          <text x="28" y="3" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="8" fill="#1C1209">E</text>
          <text x="-28" y="3" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="8" fill="#1C1209">W</text>
          {/* Center pivot */}
          <circle r="1.5" fill="#1C1209" />
        </g>

        {/* ── Scale legend (bottom-right) ── */}
        <g transform="translate(540 280)">
          <text x="0" y="-6" textAnchor="start"
            fontFamily="monospace" fontSize="7"
            fontWeight="700" fill="rgba(28,18,9,0.7)"
            letterSpacing="0.18em">
            SCALE · 1 MILE
          </text>
          <line x1="0" y1="0" x2="50" y2="0" stroke="#1C1209" strokeWidth="1.4" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#1C1209" strokeWidth="1.2" />
          <line x1="25" y1="-2" x2="25" y2="2" stroke="#1C1209" strokeWidth="1" />
          <line x1="50" y1="-3" x2="50" y2="3" stroke="#1C1209" strokeWidth="1.2" />
        </g>

        {/* ── Decorative scribbles for vintage authenticity ── */}
        {/* Tiny tree silhouettes scattered */}
        {[
          [70, 130], [95, 250], [200, 260], [330, 80],
          [430, 250], [490, 260], [550, 130], [690, 60],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-3" stroke="#3A1408" strokeWidth="0.5" />
            <path d={`M -2 -3 l 2 -5 l 2 5 z`} fill="#3A1408" opacity="0.65" />
          </g>
        ))}

        {/* Cartographer's mark / signature in the corner */}
        <text x="700" y="306" textAnchor="end"
          fontFamily="Georgia, serif" fontStyle="italic"
          fontSize="8" fontWeight="700"
          fill="rgba(28,18,9,0.5)"
          letterSpacing="0.06em">
          — drawn by hand · spring 2026
        </text>
      </svg>
    </div>
  );
}
