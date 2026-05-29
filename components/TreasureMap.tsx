"use client";

import { useEffect, useRef } from "react";

// ── TreasureMap ─────────────────────────────────────────────────────────────
//
// Hand-drawn cartographic illustration (SVG viewBox 900×520) of the Route 9
// corridor in Shrewsbury, MA. Aged parchment with fractal-noise texture, ink
// double-border, winding Route 9 road in perspective, Lake Quinsigamond, a
// compass rose, an ornate cartouche, and 7 business-type markers with
// hand-drawn icons placed above/below the road.
//
// Placed between WhoIWorkWith and StorefrontParade.

// Business type markers: position, two-line label, icon index (0-6)
const MARKERS = [
  { x: 128, y: 238, l1: "Restaurants",  l2: "& Pizzerias",  icon: 0 },
  { x: 250, y: 300, l1: "Corner Delis", l2: "& Cafés",       icon: 1 },
  { x: 352, y: 234, l1: "Salons &",     l2: "Barbers",        icon: 2 },
  { x: 452, y: 308, l1: "Auto &",       l2: "Hardware",       icon: 3 },
  { x: 554, y: 244, l1: "Flower &",     l2: "Gift Shops",     icon: 4 },
  { x: 656, y: 224, l1: "Boutiques &",  l2: "Retail",         icon: 5 },
  { x: 760, y: 300, l1: "Health &",     l2: "Wellness",       icon: 6 },
] as const;

// Simple icon SVG paths centered at 0,0 (radius ≈ 10px), drawn in ink
const ICON_PATHS = [
  "M0,-10 L9,5 L-9,5 Z",                                                  // 0 pizza slice
  "M-7,-5 L-7,7 L7,7 L7,-5 Z M7,0 Q12,0 12,2 Q12,4 7,4",                // 1 coffee cup+handle
  "M-9,-9 L9,9 M9,-9 L-9,9 M-12,-12 Q-8,-15 -4,-12 Q0,-9 -4,-6 Q-8,-3 -12,-6 Q-15,-9 -12,-12 Z M12,12 Q8,15 4,12 Q0,9 4,6 Q8,3 12,6 Q15,9 12,12 Z", // 2 scissors
  "M-9,-9 Q-13,-3 -9,9 L-1,1 L9,9 M-1,1 L9,-9",                          // 3 wrench
  "M0,-11 L0,11 M-11,0 L11,0 M-8,-8 L8,8 M8,-8 L-8,8",                   // 4 asterisk/flower
  "M0,-9 Q3,-9 3,-7 Q3,-5 0,-4 L9,6 L-9,6",                               // 5 hanger
  "M-9,-4 Q-9,-11 0,-7 Q9,-11 9,-4 Q9,4 0,11 Q-9,4 -9,-4 Z",             // 6 heart
];

const INK  = "#3A2408";
const INK2 = "rgba(58,36,8,0.40)";
const PARCH = "#F0E2A8";
const ROAD_Y = 272;  // approximate y-center of Route 9

// Compass rose center position
const CR_X = 72;
const CR_Y = 452;

// Decorative tree groups [cx, cy] — simplified pine/maple silhouettes
const TREES = [
  [96, 160], [132, 148], [168, 165],       // upper-left cluster
  [820, 175], [852, 164], [868, 188],      // upper-right cluster
  [338, 426], [362, 412], [388, 430],      // lower-mid cluster
];

export function TreasureMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("tmap-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{ background: "#0D0804", padding: "80px 0 68px" }}
      aria-label="Route 9 corridor — hand-drawn map of businesses served"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Pill label */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
          <span className="label-pill">The Territory</span>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 900 520"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Hand-illustrated map of Route 9 corridor, Shrewsbury Massachusetts, showing types of local businesses"
          className="tmap"
        >
          <defs>
            {/* Parchment grain */}
            <filter id="tm-parch" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed="7" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="gray" />
              <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
            </filter>
            {/* Edge vignette — simulates aging/burning at paper edge */}
            <radialGradient id="tm-vig" cx="50%" cy="50%" r="66%">
              <stop offset="0%"   stopColor="transparent" />
              <stop offset="72%"  stopColor="rgba(58,24,0,0.08)" />
              <stop offset="100%" stopColor="rgba(28,10,0,0.48)" />
            </radialGradient>
            {/* Lake water fill */}
            <linearGradient id="tm-water" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%"   stopColor="rgba(128,168,194,0.55)" />
              <stop offset="100%" stopColor="rgba(98,138,170,0.30)" />
            </linearGradient>
          </defs>

          {/* ── PARCHMENT BASE ── */}
          <rect x="0" y="0" width="900" height="520" fill={PARCH} />
          <rect x="0" y="0" width="900" height="520" fill={PARCH}
            filter="url(#tm-parch)" opacity="0.55" />

          {/* ── DOUBLE-LINE BORDER ── */}
          <rect x="12" y="12" width="876" height="496" rx="2" fill="none"
            stroke={INK} strokeWidth="2.5" />
          <rect x="19" y="19" width="862" height="482" rx="1" fill="none"
            stroke={INK} strokeWidth="0.9" />
          {/* Corner ornament diamonds */}
          {([[12,12],[888,12],[12,508],[888,508]] as [number,number][]).map(([ox,oy],i) => (
            <rect key={i} x={ox-4} y={oy-4} width="8" height="8"
              fill={INK} transform={`rotate(45,${ox},${oy})`} />
          ))}

          {/* ── TERRAIN TINTS (subtle field colouring) ── */}
          <ellipse cx="195" cy="385" rx="165" ry="88" fill="rgba(120,138,72,0.11)" />
          <ellipse cx="706" cy="135" rx="175" ry="78" fill="rgba(120,138,72,0.09)" />
          <ellipse cx="450" cy="425" rx="225" ry="68" fill="rgba(148,118,68,0.08)" />

          {/* ── LAKE QUINSIGAMOND ── */}
          <path
            d="M 724,352 C 748,328 786,328 806,354 C 830,382 836,418 818,444 C 800,470 758,476 732,458 C 706,440 698,414 712,388 C 716,370 720,358 724,352 Z"
            fill="url(#tm-water)" stroke="rgba(96,138,168,0.58)" strokeWidth="1.5" />
          <text x="768" y="408" textAnchor="middle"
            fill="rgba(66,108,140,0.72)" fontSize="9.5" letterSpacing="0.3"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            Lake
          </text>
          <text x="768" y="421" textAnchor="middle"
            fill="rgba(66,108,140,0.72)" fontSize="9.5" letterSpacing="0.3"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            Quinsigamond
          </text>
          {/* Wave marks */}
          {[734, 756, 778, 800].map(wx => (
            <path key={wx} d={`M${wx},452 Q${wx+5},449 ${wx+10},452`}
              stroke="rgba(96,138,168,0.48)" strokeWidth="0.9" fill="none" />
          ))}

          {/* ── MINOR ROADS (dotted) ── */}
          <line x1="452" y1="26" x2="452" y2="494"
            stroke={INK2} strokeWidth="1.4" strokeDasharray="7,6" />
          <path d="M 195,26 Q 248,148 265,270"
            stroke={INK2} strokeWidth="1.4" strokeDasharray="7,6" fill="none" />

          {/* ── ROUTE 9 MAIN ROAD ── */}
          {/* Shadow pass */}
          <path
            d="M 20,274 C 104,286 165,256 270,271 C 375,286 415,312 517,290 C 619,268 698,256 800,274 C 848,282 884,268 900,264"
            stroke="rgba(58,36,8,0.18)" strokeWidth="12" strokeLinecap="round" />
          {/* Road surface */}
          <path
            d="M 20,273 C 104,285 165,255 270,270 C 375,285 415,311 517,289 C 619,267 698,255 800,273 C 848,281 884,267 900,263"
            stroke="rgba(136,108,68,0.72)" strokeWidth="9" strokeLinecap="round" />
          {/* Centre dashes */}
          <path
            d="M 20,273 C 104,285 165,255 270,270 C 375,285 415,311 517,289 C 619,267 698,255 800,273 C 848,281 884,267 900,263"
            stroke={PARCH} strokeWidth="1.8" strokeDasharray="20,14"
            strokeLinecap="round" />
          {/* Road label */}
          <text x="450" y="320" textAnchor="middle"
            fill={INK2} fontSize="10" letterSpacing="5"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            · · ·  ROUTE  9  · · ·
          </text>

          {/* ── ROUTE 9 SHIELD BADGE ── */}
          <g transform="translate(452,252)">
            <path d="M-14,-18 L14,-18 L14,4 Q14,16 0,20 Q-14,16 -14,4 Z"
              fill={INK} opacity="0.88" />
            <path d="M-10,-14 L10,-14 L10,3 Q10,12 0,16 Q-10,12 -10,3 Z"
              fill={PARCH} opacity="0.92" />
            <text x="0" y="7" textAnchor="middle"
              fill={INK} fontSize="12" fontWeight="800"
              fontFamily="'Palatino Linotype', Palatino, Georgia, serif">9</text>
          </g>

          {/* ── BUSINESS TYPE MARKERS ── */}
          {MARKERS.map(({ x, y, l1, l2, icon }) => {
            const aboveRoad = y < ROAD_Y;
            const label1Y   = aboveRoad ? y - 36 : y + 30;
            const label2Y   = aboveRoad ? y - 23 : y + 42;
            const lineY1    = aboveRoad ? y + 15 : y - 15;
            const iPath     = ICON_PATHS[icon] ?? "M-8,-8 L8,8 M8,-8 L-8,8";
            return (
              <g key={`${x}-${y}`}>
                {/* Dotted connector to road */}
                <line x1={x} y1={lineY1} x2={x} y2={ROAD_Y}
                  stroke={INK2} strokeWidth="0.8" strokeDasharray="3,3" />
                {/* Circle shadow */}
                <circle cx={x+1} cy={y+1} r="15" fill="rgba(0,0,0,0.10)" />
                {/* Circle */}
                <circle cx={x} cy={y} r="15"
                  fill={PARCH} stroke={INK} strokeWidth="1.8" />
                {/* Icon */}
                <path d={iPath}
                  stroke={INK} strokeWidth="1.4" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  transform={`translate(${x},${y})`} />
                {/* Label */}
                <text x={x} y={label1Y} textAnchor="middle"
                  fill={INK} fontSize="9.5" letterSpacing="0.2"
                  fontFamily="'Palatino Linotype', Palatino, Georgia, serif"
                  fontWeight="700">
                  {l1}
                </text>
                <text x={x} y={label2Y} textAnchor="middle"
                  fill={INK} fontSize="9.5" letterSpacing="0.2"
                  fontFamily="'Palatino Linotype', Palatino, Georgia, serif">
                  {l2}
                </text>
              </g>
            );
          })}

          {/* ── PLACE NAME LABELS ── */}
          <text x="60" y="262" textAnchor="middle"
            fill={INK2} fontSize="8.5" letterSpacing="0.8"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            Worcester
          </text>
          <text x="452" y="196" textAnchor="middle"
            fill={INK} fontSize="12.5" letterSpacing="1.5"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontWeight="700">
            SHREWSBURY
          </text>
          <text x="452" y="211" textAnchor="middle"
            fill={INK2} fontSize="8" letterSpacing="3.5"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif">
            est. 1727
          </text>
          <text x="860" y="262" textAnchor="middle"
            fill={INK2} fontSize="8.5" letterSpacing="0.8"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            Framingham
          </text>

          {/* ── TREE SYMBOLS ── */}
          {TREES.map(([tx, ty], i) => (
            <g key={i} transform={`translate(${tx ?? 0},${ty ?? 0})`}>
              <line x1="0" y1="8" x2="0" y2="15"
                stroke={INK} strokeWidth="1.2" />
              <polygon points="0,-13 10,8 -10,8"
                fill={INK} fillOpacity="0.17" stroke={INK} strokeWidth="0.8" />
              <polygon points="0,-7 7,8 -7,8"
                fill={INK} fillOpacity="0.28" />
            </g>
          ))}

          {/* ── CARTOUCHE (top-right) ── */}
          <rect x="596" y="28" width="284" height="120" rx="4"
            fill="rgba(240,226,164,0.90)" stroke={INK} strokeWidth="2" />
          <rect x="604" y="36" width="268" height="104" rx="3" fill="none"
            stroke={INK} strokeWidth="0.8" strokeDasharray="4,3" />
          {/* Cartouche corner ornaments */}
          {([[600,32],[876,32],[600,144],[876,144]] as [number,number][]).map(([ox,oy],i) => (
            <rect key={i} x={ox-3.5} y={oy-3.5} width="7" height="7"
              fill={INK} transform={`rotate(45,${ox},${oy})`} />
          ))}
          {/* Cartouche title */}
          <text x="738" y="54" textAnchor="middle"
            fill={INK} fontSize="13.5" letterSpacing="2"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontWeight="700">
            ROUTE 9 CORRIDOR
          </text>
          <text x="738" y="72" textAnchor="middle"
            fill={INK2} fontSize="9.5" letterSpacing="3"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic">
            Shrewsbury · Massachusetts
          </text>
          <line x1="628" y1="82" x2="848" y2="82" stroke={INK} strokeWidth="1.2" />
          <line x1="628" y1="85.5" x2="848" y2="85.5" stroke={INK} strokeWidth="0.5" />
          <text x="738" y="102" textAnchor="middle"
            fill={INK} fontSize="9" letterSpacing="0.4"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif">
            Here be good websites, hand-crafted
          </text>
          <text x="738" y="115" textAnchor="middle"
            fill={INK} fontSize="9" letterSpacing="0.4"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif">
            for the shops that make this town great.
          </text>

          {/* ── COMPASS ROSE (bottom-left) ── */}
          <g transform={`translate(${CR_X},${CR_Y})`}>
            <circle r="30" fill="rgba(240,226,148,0.65)" stroke={INK} strokeWidth="1.2" />
            <circle r="22" fill="none" stroke={INK2} strokeWidth="0.6" />
            {/* N-S diamond (full size, ink) */}
            <polygon points="0,-29 4,-4 0,3 -4,-4" fill={INK} />
            <polygon points="0,29 4,4 0,-3 -4,4" fill={INK} opacity="0.55" />
            {/* E-W diamond */}
            <polygon points="29,0 4,4 -3,0 4,-4" fill={INK} opacity="0.55" />
            <polygon points="-29,0 -4,4 3,0 -4,-4" fill={INK} opacity="0.55" />
            {/* Intercardinal small arrows */}
            {([[1,1],[1,-1],[-1,-1],[-1,1]] as [number,number][]).map(([dx,dy],i) => (
              <polygon key={i}
                points={`${dx*16},${dy*16} ${dx*5},${dy*7} ${-dy*2},${dx*2} ${dy*2},${-dx*2}`}
                fill={INK} opacity="0.32" />
            ))}
            {/* Center */}
            <circle r="5.5" fill={INK} />
            <circle r="2.5" fill={PARCH} />
            {/* Cardinal labels */}
            <text y="-34" textAnchor="middle"
              fill={INK} fontSize="9.5" fontWeight="700"
              fontFamily="'Palatino Linotype', Palatino, Georgia, serif">N</text>
            <text y="47" textAnchor="middle"
              fill={INK} fontSize="9.5"
              fontFamily="'Palatino Linotype', Palatino, Georgia, serif">S</text>
            <text x="40" y="3.5" textAnchor="middle"
              fill={INK} fontSize="9.5"
              fontFamily="'Palatino Linotype', Palatino, Georgia, serif">E</text>
            <text x="-40" y="3.5" textAnchor="middle"
              fill={INK} fontSize="9.5"
              fontFamily="'Palatino Linotype', Palatino, Georgia, serif">W</text>
          </g>

          {/* ── WATERMARK ── */}
          <text x="232" y="464" textAnchor="middle"
            fill={INK2} fontSize="9" letterSpacing="5"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif" fontStyle="italic"
            opacity="0.45" transform="rotate(-7,232,464)">
            HERE  ·  BE  ·  GOOD  ·  WEBSITES
          </text>

          {/* ── EDGE VIGNETTE (aging effect) ── */}
          <rect x="0" y="0" width="900" height="520" fill="url(#tm-vig)" />
        </svg>
      </div>
    </section>
  );
}
