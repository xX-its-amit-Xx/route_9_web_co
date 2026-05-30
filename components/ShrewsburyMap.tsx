"use client";

/**
 * Enhanced hand-illustrated aerial map of the Route 9 corridor.
 *
 * Improvements over the original:
 *  - 3-D perspective tilt on the container (looks down at the map)
 *  - Multi-layer paper: base gradient + fiber + grain + full-edge vignette
 *  - Double-rule ornamental inner border with corner diamond fleurons
 *  - Age-spot foxing, coffee-stain ring, fold crease, folded corner
 *  - Terrain coloring (muted green) north and south of the road
 *  - Lake Quinsigamond: irregular shape, deep gradient, shore highlight,
 *    five ripple lines, specular glint, depth overlay
 *  - Route 9: shoulder → asphalt → surface → orange highlight → center dash
 *  - Shrewsbury Center: pitched-roof buildings + church steeple + cross
 *  - Shop pins: 3-D radial gradient + glint arc + shadow ellipse + label pill
 *  - Two-tier conifer tree silhouettes scattered around terrain
 *  - Title cartouche: backing oval, double rules, diamond fleurons
 *  - Compass rose: 8-point, cardinal labels, jewel center
 *  - Alternating black/white scale bar with tick marks
 *  - Legend box: pin icon + road sample
 */
export function ShrewsburyMap() {
  const ROAD = "M 28 196 Q 170 172 350 190 Q 500 204 550 186";

  const PINS: Array<{
    x: number; y: number; label: string; align: "above" | "below"; labelW: number;
  }> = [
    { x: 118, y: 184, label: "Pizzeria", align: "above", labelW: 52 },
    { x: 242, y: 162, label: "Barber",   align: "above", labelW: 44 },
    { x: 358, y: 196, label: "Bakery",   align: "below", labelW: 44 },
    { x: 452, y: 168, label: "Café",     align: "above", labelW: 34 },
    { x: 502, y: 186, label: "Salon",    align: "above", labelW: 40 },
  ];

  // [x, y, scale]
  const TREES: Array<[number, number, number]> = [
    [55, 145, 1.00], [80, 252, 0.85], [175, 265, 0.90],
    [210, 140, 1.10], [398, 78, 0.85], [420, 265, 0.90],
    [478, 268, 1.00], [542, 140, 0.95], [688, 56, 0.75],
    [708, 288, 0.80], [36, 298, 0.90], [148, 308, 0.85],
    [518, 92, 0.88], [533, 80, 0.72], [506, 106, 0.80],
  ];

  // Pre-computed 8-point compass tick segments
  // [x1, y1, x2, y2] in local space, inner r=20 outer r=24
  const CTICKS: Array<[number, number, number, number]> = [
    [0, -20, 0, -24],
    [14, -14, 17, -17],
    [20, 0, 24, 0],
    [14, 14, 17, 17],
    [0, 20, 0, 24],
    [-14, 14, -17, 17],
    [-20, 0, -24, 0],
    [-14, -14, -17, -17],
  ];

  return (
    <div
      aria-hidden
      className="shrewsbury-map relative w-full select-none"
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        transform: "perspective(1400px) rotateX(4deg) rotateZ(-0.4deg) scale(1.01)",
        transformOrigin: "center 60%",
        filter:
          "drop-shadow(0 18px 44px rgba(28,18,9,0.40)) " +
          "drop-shadow(0 5px 12px rgba(28,18,9,0.26))",
      }}
    >
      <svg
        viewBox="0 0 760 362"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          {/* ── Paper ── */}
          <linearGradient id="sm-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F8EED6" />
            <stop offset="28%"  stopColor="#F1E0B6" />
            <stop offset="62%"  stopColor="#E8CF9A" />
            <stop offset="100%" stopColor="#D9BC7E" />
          </linearGradient>

          <radialGradient id="sm-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="50%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(48,20,4,0.44)" />
          </radialGradient>

          <pattern id="sm-fiber" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
            <circle cx="0.9" cy="0.9" r="0.30" fill="rgba(128,68,14,0.15)" />
            <circle cx="2.6" cy="2.5" r="0.22" fill="rgba(128,68,14,0.09)" />
          </pattern>

          <pattern id="sm-grain" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.14" fill="rgba(88,44,8,0.09)" />
          </pattern>

          {/* ── Lake ── */}
          <radialGradient id="sm-lake" cx="42%" cy="32%" r="75%">
            <stop offset="0%"   stopColor="#88CCC8" />
            <stop offset="40%"  stopColor="#4FA09C" />
            <stop offset="72%"  stopColor="#2E7C7A" />
            <stop offset="100%" stopColor="#185A58" />
          </radialGradient>

          <linearGradient id="sm-lake-d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(195,242,240,0.28)" />
            <stop offset="100%" stopColor="rgba(12,48,46,0.18)" />
          </linearGradient>

          {/* ── Pin ── */}
          <radialGradient id="sm-pin" cx="33%" cy="25%" r="65%">
            <stop offset="0%"   stopColor="#EE8855" />
            <stop offset="55%"  stopColor="#D4682A" />
            <stop offset="100%" stopColor="#8A2E08" />
          </radialGradient>

          {/* ── Terrain ── */}
          <linearGradient id="sm-tn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(105,142,68,0.20)" />
            <stop offset="100%" stopColor="rgba(82,112,50,0.06)" />
          </linearGradient>
          <linearGradient id="sm-ts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(88,124,56,0.13)" />
            <stop offset="100%" stopColor="rgba(68,98,42,0.04)" />
          </linearGradient>

          {/* ── Drop-shadow filter ── */}
          <filter id="sm-dsm" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="rgba(0,0,0,0.28)" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════
            PAPER BASE
        ══════════════════════════════════════════════ */}
        <rect x="2" y="2" width="756" height="358" rx="8"
          fill="url(#sm-paper)" stroke="rgba(128,68,14,0.55)" strokeWidth="1" />
        <rect x="2" y="2" width="756" height="358" rx="8"
          fill="url(#sm-fiber)" opacity="0.65" />
        <rect x="2" y="2" width="756" height="358" rx="8"
          fill="url(#sm-grain)" opacity="0.85" />
        {/* Vignette */}
        <rect x="2" y="2" width="756" height="358" rx="8"
          fill="url(#sm-vignette)" />

        {/* ══════════════════════════════════════════════
            DECORATIVE INNER BORDER
        ══════════════════════════════════════════════ */}
        <rect x="12" y="12" width="736" height="338" rx="5"
          fill="none" stroke="rgba(128,68,14,0.38)" strokeWidth="0.9" />
        <rect x="16" y="16" width="728" height="330" rx="4"
          fill="none" stroke="rgba(128,68,14,0.18)" strokeWidth="0.4" />

        {/* Corner diamonds */}
        <path d="M 18 22 l 4-4 l 4 4 l-4 4 Z"  fill="rgba(168,72,24,0.50)" />
        <path d="M 742 22 l-4-4 l-4 4 l 4 4 Z" fill="rgba(168,72,24,0.50)" />
        <path d="M 18 340 l 4-4 l 4 4 l-4 4 Z" fill="rgba(168,72,24,0.50)" />
        <path d="M 742 340 l-4-4 l-4 4 l 4 4 Z" fill="rgba(168,72,24,0.50)" />

        {/* ══════════════════════════════════════════════
            PAPER AGING
        ══════════════════════════════════════════════ */}
        {/* Foxing spots */}
        <circle cx="92"  cy="44"  r="14" fill="rgba(128,68,14,0.07)" />
        <circle cx="700" cy="38"  r="10" fill="rgba(128,68,14,0.05)" />
        <circle cx="42"  cy="318" r="16" fill="rgba(128,68,14,0.07)" />

        {/* Coffee ring – bottom right, clear of legend */}
        <circle cx="668" cy="312" r="28"
          fill="none" stroke="rgba(128,68,14,0.40)" strokeWidth="1.4" opacity="0.60" />
        <circle cx="668" cy="312" r="28" fill="rgba(128,68,14,0.05)" />
        <circle cx="663" cy="308" r="20"
          fill="none" stroke="rgba(128,68,14,0.16)" strokeWidth="0.7" opacity="0.55" />

        {/* Fold crease */}
        <line x1="12" y1="182" x2="748" y2="182"
          stroke="rgba(88,44,8,0.05)" strokeWidth="1.8" strokeDasharray="5 8" />

        {/* Folded corner – top right */}
        <path d="M 736 2 L 758 24 L 736 24 Z"
          fill="rgba(88,44,8,0.24)" stroke="rgba(88,44,8,0.38)" strokeWidth="0.5" />
        <line x1="736" y1="2" x2="758" y2="24"
          stroke="rgba(88,44,8,0.30)" strokeWidth="0.7" />

        {/* ══════════════════════════════════════════════
            TERRAIN
        ══════════════════════════════════════════════ */}
        {/* North (above road) */}
        <path
          d="M 12 94 Q 80 82 158 95 Q 232 108 312 88 Q 386 70 448 95 Q 506 116 555 100 L 555 218 Q 500 207 445 218 Q 360 230 280 214 Q 200 200 130 216 Q 80 224 12 218 Z"
          fill="url(#sm-tn)" />
        {/* South (below road) */}
        <path
          d="M 12 220 Q 86 234 160 226 Q 246 216 356 230 Q 446 240 555 224 L 555 350 L 12 350 Z"
          fill="url(#sm-ts)" />

        {/* ══════════════════════════════════════════════
            LAKE QUINSIGAMOND
        ══════════════════════════════════════════════ */}
        {/* Shadow */}
        <path
          d="M 582 96 Q 630 78 678 99 Q 714 120 720 158 Q 726 198 712 230 Q 696 260 662 274 Q 626 282 592 268 Q 562 252 556 220 Q 548 186 554 150 Q 558 116 582 96 Z"
          fill="rgba(0,0,0,0.18)" transform="translate(4,5)" />
        {/* Body */}
        <path
          d="M 582 96 Q 630 78 678 99 Q 714 120 720 158 Q 726 198 712 230 Q 696 260 662 274 Q 626 282 592 268 Q 562 252 556 220 Q 548 186 554 150 Q 558 116 582 96 Z"
          fill="url(#sm-lake)" stroke="rgba(20,10,4,0.55)" strokeWidth="1.1" />
        {/* Depth overlay */}
        <path
          d="M 582 96 Q 630 78 678 99 Q 714 120 720 158 Q 726 198 712 230 Q 696 260 662 274 Q 626 282 592 268 Q 562 252 556 220 Q 548 186 554 150 Q 558 116 582 96 Z"
          fill="url(#sm-lake-d)" />
        {/* Shore highlight arc */}
        <path d="M 582 96 Q 628 82 668 102 Q 705 122 718 156"
          stroke="rgba(205,242,240,0.52)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Ripple lines */}
        <path d="M 572 150 q 26-6 50 0 q 26 6 38-2"  stroke="rgba(255,255,255,0.50)" strokeWidth="0.65" fill="none" />
        <path d="M 566 172 q 28-5 54 1 q 28 6 40-2"  stroke="rgba(255,255,255,0.42)" strokeWidth="0.58" fill="none" />
        <path d="M 568 194 q 26-4 50 1 q 26 5 38-2"  stroke="rgba(255,255,255,0.36)" strokeWidth="0.52" fill="none" />
        <path d="M 570 216 q 24-3 46 1 q 24 4 36-1"  stroke="rgba(255,255,255,0.28)" strokeWidth="0.46" fill="none" />
        <path d="M 575 238 q 20-2 38 1 q 20 3 30-1"  stroke="rgba(255,255,255,0.22)" strokeWidth="0.40" fill="none" />
        {/* Specular glint */}
        <ellipse cx="600" cy="122" rx="20" ry="8"
          fill="rgba(215,248,245,0.22)" transform="rotate(-15 600 122)" />
        {/* Lake label */}
        <text x="638" y="190" textAnchor="middle"
          fontFamily="Georgia, serif" fontStyle="italic"
          fontSize="10.5" fontWeight="700" fill="rgba(10,32,30,0.86)"
          transform="rotate(-10 638 190)" letterSpacing="0.04em">
          Lake Quinsigamond
        </text>

        {/* ══════════════════════════════════════════════
            ROUTE 9 ROAD  (painted back → front)
        ══════════════════════════════════════════════ */}
        {/* Drop shadow */}
        <path d={ROAD} stroke="rgba(0,0,0,0.30)" strokeWidth="28"
          fill="none" strokeLinecap="round" transform="translate(0,5)" />
        {/* Road shoulder (dirt/gravel strip) */}
        <path d={ROAD} stroke="#B09A78" strokeWidth="23"
          fill="none" strokeLinecap="round" />
        {/* Asphalt body */}
        <path d={ROAD} stroke="#1C1008" strokeWidth="18"
          fill="none" strokeLinecap="round" />
        {/* Surface tone */}
        <path d={ROAD} stroke="#2C1C0E" strokeWidth="15"
          fill="none" strokeLinecap="round" />
        {/* Brand orange overlay */}
        <path d={ROAD} stroke="#D4682A" strokeWidth="10.5"
          fill="none" strokeLinecap="round" opacity="0.92" />
        {/* Centre dashed line */}
        <path d={ROAD} stroke="rgba(255,224,140,0.90)" strokeWidth="1.5"
          fill="none" strokeDasharray="10 7" />
        {/* Top sheen */}
        <path d={ROAD} stroke="rgba(255,215,165,0.15)" strokeWidth="4"
          fill="none" strokeLinecap="round" />

        {/* ══════════════════════════════════════════════
            MA·9 HIGHWAY SHIELD
        ══════════════════════════════════════════════ */}
        <g transform="translate(172 165)" filter="url(#sm-dsm)">
          <rect x="-21" y="-14" width="42" height="27" rx="3"
            fill="#F8EED6" stroke="#1C1209" strokeWidth="1.5" />
          <text x="0" y="-3" textAnchor="middle"
            fontSize="6.5" fontFamily="monospace" fontWeight="800"
            fill="#1C1209" letterSpacing="0.12em">MASS</text>
          <text x="0" y="10" textAnchor="middle"
            fontSize="14" fontFamily="Georgia, serif"
            fontStyle="italic" fontWeight="900" fill="#A84818">9</text>
        </g>

        {/* ══════════════════════════════════════════════
            SHREWSBURY CENTER CLUSTER
        ══════════════════════════════════════════════ */}
        <g transform="translate(308 128)">
          {/* Ground shadow */}
          <ellipse cx="2" cy="8" rx="28" ry="8" fill="rgba(0,0,0,0.14)" />
          {/* Common green */}
          <ellipse cx="0" cy="0" rx="30" ry="18"
            fill="rgba(85,122,56,0.42)" stroke="rgba(28,18,9,0.48)" strokeWidth="0.7" />
          {/* Building 1 */}
          <rect x="-21" y="-12" width="8"  height="10" fill="#C86838" stroke="#1C1209" strokeWidth="0.5" />
          <path d="M -21 -12 L -17 -17 L -13 -12 Z"   fill="#983018" stroke="#1C1209" strokeWidth="0.5" />
          {/* Building 2 */}
          <rect x="-11" y="-14" width="8"  height="12" fill="#985838" stroke="#1C1209" strokeWidth="0.5" />
          <path d="M -11 -14 L -7  -19 L -3  -14 Z"   fill="#782010" stroke="#1C1209" strokeWidth="0.4" />
          {/* Building 3 */}
          <rect x="2"   y="-12" width="8"  height="10" fill="#C86838" stroke="#1C1209" strokeWidth="0.5" />
          <path d="M 2   -12 L 6  -17 L 10  -12 Z"    fill="#983018" stroke="#1C1209" strokeWidth="0.5" />
          {/* Building 4 */}
          <rect x="13"  y="-13" width="7"  height="11" fill="#985838" stroke="#1C1209" strokeWidth="0.5" />
          <path d="M 13  -13 L 16.5-17 L 20  -13 Z"   fill="#782010" stroke="#1C1209" strokeWidth="0.4" />
          {/* Church body */}
          <rect x="-5" y="-16" width="10" height="10" fill="#C86838" stroke="#1C1209" strokeWidth="0.5" />
          {/* Steeple */}
          <path d="M -4 -16 L 0 -29 L 4 -16 Z"
            fill="#A84818" stroke="#1C1209" strokeWidth="0.6" />
          {/* Cross */}
          <line x1="0" y1="-28" x2="0"  y2="-19" stroke="#F5E8C8" strokeWidth="0.95" />
          <line x1="-3" y1="-25" x2="3" y2="-25" stroke="#F5E8C8" strokeWidth="0.95" />
          {/* Label */}
          <text x="0" y="32" textAnchor="middle"
            fontFamily="Georgia, serif" fontStyle="italic"
            fontWeight="700" fontSize="9" fill="#1C1209" letterSpacing="0.04em">
            Shrewsbury Center
          </text>
        </g>

        {/* ══════════════════════════════════════════════
            SHOP PINS
        ══════════════════════════════════════════════ */}
        {PINS.map((p) => (
          <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
            {/* Ground shadow */}
            <ellipse cx="1" cy="20" rx="8" ry="3.5" fill="rgba(0,0,0,0.22)" />
            {/* Body */}
            <path
              d="M 0 -16 C 9 -16 14 -8 14 -1 C 14 8 0 24 0 24 C 0 24 -14 8 -14 -1 C -14 -8 -9 -16 0 -16 Z"
              fill="url(#sm-pin)" stroke="#7A2808" strokeWidth="1.1" />
            {/* Glint highlight */}
            <path d="M -6 -14 Q -1 -18 5 -13"
              stroke="rgba(255,215,165,0.62)" strokeWidth="1.7" fill="none" strokeLinecap="round" />
            {/* Centre dot */}
            <circle r="4.5"
              fill="rgba(255,242,215,0.92)" stroke="rgba(115,48,8,0.42)" strokeWidth="0.7" />
            {/* Label pill */}
            <rect
              x={-Math.round(p.labelW / 2) - 2}
              y={p.align === "above" ? -39 : 29}
              width={p.labelW + 4}
              height={15}
              rx="4"
              fill="rgba(248,238,215,0.92)"
              stroke="rgba(128,68,14,0.35)"
              strokeWidth="0.55"
            />
            <text
              x="0"
              y={p.align === "above" ? -28 : 40}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fontWeight="700"
              fontSize="9.5"
              fill="#1C1209"
              letterSpacing="0.04em"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* ══════════════════════════════════════════════
            TREE SILHOUETTES
        ══════════════════════════════════════════════ */}
        {TREES.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-1.5" y="0" width="3" height="7" fill="#2A0E04" opacity="0.62" />
            <path d="M -6  0 l 6 -10 l 6 10 Z" fill="#3A5022" opacity="0.62" />
            <path d="M -4 -6 l 4 -9  l 4 9  Z" fill="#4D6432" opacity="0.56" />
          </g>
        ))}

        {/* ══════════════════════════════════════════════
            TITLE CARTOUCHE
        ══════════════════════════════════════════════ */}
        <g transform="translate(300 52)">
          {/* Backing oval */}
          <ellipse rx="162" ry="36"
            fill="rgba(248,238,215,0.78)" stroke="rgba(128,68,14,0.48)" strokeWidth="1.0" />
          <ellipse rx="158" ry="32"
            fill="none" stroke="rgba(128,68,14,0.22)" strokeWidth="0.45" />
          {/* Ornamental rules */}
          <line x1="-152" y1="-8" x2="-72" y2="-8" stroke="#A84818" strokeWidth="0.82" />
          <line x1=" 72"  y1="-8" x2="152" y2="-8" stroke="#A84818" strokeWidth="0.82" />
          <line x1="-152" y1="-11" x2="-72" y2="-11" stroke="#A84818" strokeWidth="0.30" opacity="0.45" />
          <line x1=" 72"  y1="-11" x2="152" y2="-11" stroke="#A84818" strokeWidth="0.30" opacity="0.45" />
          {/* Diamond fleurons */}
          <path d="M -72 -8 l -6 -6 l -6 6 l 6 6 Z" fill="#A84818" />
          <path d="M  72 -8 l  6 -6 l  6 6 l -6 6 Z" fill="#A84818" />
          {/* Main title */}
          <text x="0" y="-10" textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic" fontWeight="900" fontSize="27"
            fill="#1C1209" letterSpacing="0.07em">
            Route 9 Corridor
          </text>
          {/* Subtitle */}
          <text x="0" y="17" textAnchor="middle"
            fontFamily="monospace" fontSize="8.5" fontWeight="700"
            fill="rgba(28,18,9,0.62)" letterSpacing="0.44em">
            SHREWSBURY · MASSACHUSETTS
          </text>
        </g>

        {/* ══════════════════════════════════════════════
            COMPASS ROSE
        ══════════════════════════════════════════════ */}
        <g transform="translate(52 296)">
          <circle r="30" fill="rgba(248,238,215,0.70)" stroke="#A84818" strokeWidth="1.0" />
          <circle r="24" fill="none" stroke="#A84818"  strokeWidth="0.48" />
          <circle r="18" fill="none" stroke="rgba(168,72,24,0.28)" strokeWidth="0.35" />
          {/* 8-point tick marks */}
          {CTICKS.map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(168,72,24,0.38)" strokeWidth="0.65" />
          ))}
          {/* N fletch — orange + white */}
          <path d="M 0 -22 L 5.5 0 L 0 -3.5 Z" fill="#A84818" stroke="#1C1209" strokeWidth="0.65" />
          <path d="M 0 -22 L -5.5 0 L 0 -3.5 Z" fill="#F8EED6" stroke="#1C1209" strokeWidth="0.65" />
          {/* S */}
          <path d="M 0 22 L  5.5 0 L  0 3.5 Z" fill="#F8EED6" stroke="#1C1209" strokeWidth="0.55" />
          <path d="M 0 22 L -5.5 0 L  0 3.5 Z" fill="#F8EED6" stroke="#1C1209" strokeWidth="0.55" />
          {/* E */}
          <path d="M 22 0 L 0 -5.5 L 3.5 0 L 0 5.5 Z" fill="#F8EED6" stroke="#1C1209" strokeWidth="0.55" />
          {/* W */}
          <path d="M -22 0 L 0 -5.5 L -3.5 0 L 0 5.5 Z" fill="#F8EED6" stroke="#1C1209" strokeWidth="0.55" />
          {/* Cardinal labels */}
          <text x="0"   y="-35" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="9.5" fill="#1C1209">N</text>
          <text x="0"   y=" 43" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="9.5" fill="#1C1209">S</text>
          <text x=" 38" y="3.5" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="9.5" fill="#1C1209">E</text>
          <text x="-38" y="3.5" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="9.5" fill="#1C1209">W</text>
          {/* Centre jewel */}
          <circle r="4"   fill="#A84818" stroke="#F8EED6" strokeWidth="0.9" />
          <circle r="2"   fill="#F8EED6" />
        </g>

        {/* ══════════════════════════════════════════════
            SCALE BAR
        ══════════════════════════════════════════════ */}
        <g transform="translate(548 308)">
          <text x="37" y="-10" textAnchor="middle"
            fontFamily="monospace" fontSize="7.5" fontWeight="700"
            fill="rgba(28,18,9,0.62)" letterSpacing="0.18em">
            SCALE · 1 MILE
          </text>
          {/* Alternating black/white segments */}
          <rect x="0"  y="0" width="25" height="7" fill="#1C1209" />
          <rect x="25" y="0" width="25" height="7"
            fill="#F8EED6" stroke="#1C1209" strokeWidth="0.7" />
          <rect x="50" y="0" width="25" height="7" fill="#1C1209" />
          {/* Tick marks */}
          <line x1="0"  y1="-3" x2="0"  y2="10" stroke="#1C1209" strokeWidth="1.3" />
          <line x1="25" y1="-2" x2="25" y2="9"  stroke="#1C1209" strokeWidth="1.0" />
          <line x1="50" y1="-2" x2="50" y2="9"  stroke="#1C1209" strokeWidth="1.0" />
          <line x1="75" y1="-3" x2="75" y2="10" stroke="#1C1209" strokeWidth="1.3" />
          {/* Distance labels */}
          <text x="0"  y="19" textAnchor="middle"
            fontFamily="monospace" fontSize="6.5" fill="rgba(28,18,9,0.55)">0</text>
          <text x="75" y="19" textAnchor="middle"
            fontFamily="monospace" fontSize="6.5" fill="rgba(28,18,9,0.55)">1</text>
        </g>

        {/* ══════════════════════════════════════════════
            LEGEND BOX
        ══════════════════════════════════════════════ */}
        <g transform="translate(548 222)">
          <rect x="0" y="0" width="96" height="68" rx="4"
            fill="rgba(248,238,215,0.80)" stroke="rgba(128,68,14,0.38)" strokeWidth="0.82" />
          <text x="48" y="14" textAnchor="middle"
            fontFamily="monospace" fontSize="7" fontWeight="700"
            fill="rgba(28,18,9,0.62)" letterSpacing="0.22em">LEGEND</text>
          <line x1="8" y1="19" x2="88" y2="19"
            stroke="rgba(128,68,14,0.24)" strokeWidth="0.5" />
          {/* Pin icon */}
          <g transform="translate(18 38)">
            <ellipse cx="0" cy="11" rx="4.5" ry="2" fill="rgba(0,0,0,0.16)" />
            <path
              d="M 0 -9 C 5.5 -9 8 -4.5 8 -1 C 8 4 0 14 0 14 C 0 14 -8 4 -8 -1 C -8 -4.5 -5.5 -9 0 -9 Z"
              fill="#D4682A" stroke="#7A2808" strokeWidth="0.8" />
            <circle r="2.8" fill="rgba(255,235,200,0.90)" />
          </g>
          <text x="32" y="41" fontFamily="Georgia, serif" fontStyle="italic"
            fontSize="8.5" fill="rgba(28,18,9,0.72)">Route 9 Shop</text>
          {/* Road icon */}
          <g transform="translate(10 57)">
            <line x1="0" y1="0" x2="22" y2="0"
              stroke="#D4682A" strokeWidth="5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="22" y2="0"
              stroke="rgba(255,224,140,0.90)" strokeWidth="1.2" strokeDasharray="4 5" />
          </g>
          <text x="38" y="61" fontFamily="Georgia, serif" fontStyle="italic"
            fontSize="8.5" fill="rgba(28,18,9,0.72)">Route 9</text>
        </g>

        {/* ══════════════════════════════════════════════
            CARTOGRAPHER'S MARK
        ══════════════════════════════════════════════ */}
        <text x="746" y="352" textAnchor="end"
          fontFamily="Georgia, serif" fontStyle="italic"
          fontSize="7.5" fontWeight="700" fill="rgba(28,18,9,0.40)"
          letterSpacing="0.06em">
          — drawn by hand · spring 2026
        </text>
      </svg>
    </div>
  );
}
