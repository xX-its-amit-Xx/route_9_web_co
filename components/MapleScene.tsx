"use client";

// ── MapleScene ─────────────────────────────────────────────────────────────
//
// Full-width dusk landscape (viewBox 1440×300): amber sky, Route 9 road in
// perspective, autumn maple/oak silhouettes, scattered ground leaves.
// 16 CSS-animated falling maple leaves overlay the scene continuously.
// All leaf positions and timings are deterministic (no Math.random).
// Placed as an atmospheric divider between QualityPillars and HighwayMileageSign.

// Three leaf SVG paths, centered at 0,0, ~22px across
const LEAF_PATHS = [
  // Maple star — 8 points
  "M0,-17 L3.5,-8 L13,-12 L8,-4 L17,0 L8,4 L13,12 L3.5,8 L0,17 L-3.5,8 L-13,12 L-8,4 L-17,0 L-8,-4 L-13,-12 L-3.5,-8 Z",
  // 5-lobe oak
  "M0,-20 L4.5,-10 L15,-14 L9,-4 L19,2 L11,6 L9,19 L0,11 L-9,19 L-11,6 L-19,2 L-9,-4 L-15,-14 L-4.5,-10 Z",
  // Simple teardrop-ish
  "M0,-18 C8,-18 17,-10 17,0 C17,10 9,18 0,20 C-9,18 -17,10 -17,0 C-17,-10 -8,-18 0,-18 Z",
] as const;

type Leaf = {
  x: number; delay: number; dur: number;
  drift: number; spin: number; scale: number;
  color: string; shape: 0 | 1 | 2;
};

const LEAVES: Leaf[] = [
  { x:  4, delay: 0.0, dur: 7.2, drift:  44, spin:  258, scale: 0.90, color: "#D4621A", shape: 0 },
  { x: 11, delay: 1.1, dur: 6.1, drift: -38, spin: -312, scale: 1.10, color: "#C41E1E", shape: 1 },
  { x: 19, delay: 2.3, dur: 8.0, drift:  58, spin:  182, scale: 0.70, color: "#E8A020", shape: 2 },
  { x: 30, delay: 0.4, dur: 6.8, drift: -29, spin:  242, scale: 1.00, color: "#8B3A0A", shape: 0 },
  { x: 37, delay: 3.2, dur: 7.4, drift:  34, spin: -198, scale: 0.80, color: "#D4621A", shape: 1 },
  { x: 46, delay: 1.7, dur: 5.9, drift:  52, spin:  322, scale: 1.20, color: "#E8A020", shape: 2 },
  { x: 54, delay: 0.9, dur: 7.8, drift: -53, spin: -274, scale: 0.75, color: "#C41E1E", shape: 0 },
  { x: 62, delay: 2.8, dur: 6.5, drift:  42, spin:  192, scale: 1.00, color: "#D4621A", shape: 1 },
  { x: 70, delay: 0.2, dur: 8.2, drift: -44, spin:  348, scale: 0.85, color: "#8B3A0A", shape: 2 },
  { x: 78, delay: 1.5, dur: 6.9, drift:  31, spin: -228, scale: 0.90, color: "#E8A020", shape: 0 },
  { x: 85, delay: 3.6, dur: 7.0, drift:  54, spin:  282, scale: 1.10, color: "#C41E1E", shape: 1 },
  { x: 92, delay: 0.6, dur: 6.3, drift: -33, spin: -192, scale: 0.80, color: "#D4621A", shape: 2 },
  { x:  7, delay: 4.2, dur: 7.5, drift:  42, spin:  222, scale: 0.95, color: "#E8A020", shape: 1 },
  { x: 24, delay: 5.1, dur: 6.7, drift: -48, spin:  302, scale: 0.70, color: "#C41E1E", shape: 0 },
  { x: 58, delay: 4.8, dur: 7.1, drift:  34, spin: -262, scale: 1.00, color: "#D4621A", shape: 2 },
  { x: 74, delay: 5.5, dur: 8.0, drift:  44, spin:  174, scale: 0.85, color: "#8B3A0A", shape: 1 },
];

// Road center-line dashes: 6 perspective-scaled rectangles from horizon to foreground
const ROAD_DASHES = [0, 1, 2, 3, 4, 5].map(i => {
  const t0 = i / 6;
  const t1 = (i + 0.38) / 6;
  const y0 = 300 - t0 * 108;
  const y1 = 300 - t1 * 108;
  const w0 = 7 * (1 - t0) + 1;
  const w1 = 7 * (1 - t1) + 1;
  return { i, y0, y1, w0, w1 };
});

// Ground leaf accents: deterministic positions + sizes
const GROUND_LEAVES = [
  { cx: 102, cy: 272, rx: 7, ry: 3, color: "#C84B15", rot: -18 },
  { cx: 228, cy: 278, rx: 5, ry: 2, color: "#E8A020", rot:  24 },
  { cx: 355, cy: 270, rx: 8, ry: 3, color: "#C41E1E", rot: -10 },
  { cx: 486, cy: 275, rx: 6, ry: 2, color: "#D4621A", rot:  32 },
  { cx: 830, cy: 268, rx: 7, ry: 3, color: "#E8A020", rot: -22 },
  { cx: 962, cy: 274, rx: 5, ry: 2, color: "#C84B15", rot:  15 },
  { cx:1090, cy: 271, rx: 8, ry: 3, color: "#C41E1E", rot: -28 },
  { cx:1215, cy: 276, rx: 6, ry: 2, color: "#D4621A", rot:  40 },
  { cx:1342, cy: 270, rx: 7, ry: 3, color: "#E8A020", rot: -12 },
];

export function MapleScene() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        lineHeight: 0,
        background: "#0A0402",
      }}
      aria-hidden="true"
    >
      {/* ── LANDSCAPE SVG ── */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <defs>
          {/* Dusk sky — amber top fading to near-black */}
          <linearGradient id="ms-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8B2602" />
            <stop offset="30%"  stopColor="#C84808" />
            <stop offset="60%"  stopColor="#B84010" />
            <stop offset="82%"  stopColor="#6A2808" />
            <stop offset="100%" stopColor="#1E0A04" />
          </linearGradient>
          {/* Horizon sun-glow radial */}
          <radialGradient id="ms-glow" cx="50%" cy="63%" r="38%">
            <stop offset="0%"   stopColor="rgba(255,150,20,0.50)" />
            <stop offset="60%"  stopColor="rgba(220,80,10,0.20)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Road asphalt gradient */}
          <linearGradient id="ms-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#261408" />
            <stop offset="100%" stopColor="#120804" />
          </linearGradient>
        </defs>

        {/* Sky fill */}
        <rect x="0" y="0" width="1440" height="300" fill="url(#ms-sky)" />
        {/* Horizon glow */}
        <rect x="0" y="0" width="1440" height="300" fill="url(#ms-glow)" />

        {/* Distant rolling hills */}
        <path
          d="M0,215 Q180,168 360,185 Q540,202 720,178 Q900,154 1080,182 Q1260,210 1440,190 L1440,300 L0,300 Z"
          fill="#1C0C06" opacity="0.75"
        />

        {/* ── ROAD ── */}
        {/* Asphalt surface — perspective trapezoid */}
        <polygon points="170,300 1270,300 788,188 652,188" fill="url(#ms-road)" />
        {/* Shoulder lines */}
        <line x1="170" y1="300" x2="652" y2="188"
          stroke="rgba(255,140,40,0.22)" strokeWidth="2.5" />
        <line x1="1270" y1="300" x2="788" y2="188"
          stroke="rgba(255,140,40,0.22)" strokeWidth="2.5" />

        {/* Centre-line dashes */}
        {ROAD_DASHES.map(({ i, y0, y1, w0, w1 }) => (
          <polygon key={i}
            points={`${720 - w0 / 2},${y0} ${720 + w0 / 2},${y0} ${720 + w1 / 2},${y1} ${720 - w1 / 2},${y1}`}
            fill="rgba(255,190,80,0.38)"
          />
        ))}

        {/* ── LEFT TREE CLUSTER ── */}
        {/* Background small trees */}
        <g opacity="0.55">
          <ellipse cx="52"  cy="168" rx="28" ry="32" fill="#7A2808" />
          <ellipse cx="38"  cy="152" rx="20" ry="24" fill="#8B3A0A" />
        </g>
        <rect x="47"  y="196" width="10" height="68" fill="#2A1004" />

        {/* Large primary left tree */}
        <ellipse cx="150" cy="122" rx="66" ry="60" fill="#A83408" />
        <ellipse cx="120" cy="106" rx="50" ry="54" fill="#C44A14" />
        <ellipse cx="176" cy="110" rx="46" ry="48" fill="#D2601A" />
        <ellipse cx="150" cy="88"  rx="36" ry="40" fill="#DE7818" opacity="0.85" />
        <ellipse cx="133" cy="80"  rx="24" ry="28" fill="#E8A020" opacity="0.60" />
        <rect x="140" y="174" width="20" height="90" fill="#2A1004" />

        {/* Second left tree */}
        <ellipse cx="282" cy="142" rx="54" ry="52" fill="#BE3E10" />
        <ellipse cx="258" cy="126" rx="42" ry="46" fill="#D2601A" />
        <ellipse cx="306" cy="128" rx="38" ry="40" fill="#C44A14" />
        <ellipse cx="280" cy="105" rx="30" ry="34" fill="#E8A020" opacity="0.70" />
        <rect x="274" y="186" width="16" height="78" fill="#2A1004" />

        {/* Foreground ground shadow */}
        <ellipse cx="85"  cy="254" rx="62" ry="24" fill="#130804" opacity="0.9" />
        <ellipse cx="200" cy="260" rx="76" ry="22" fill="#130804" opacity="0.85" />

        {/* ── RIGHT TREE CLUSTER ── */}
        {/* Background small trees */}
        <g opacity="0.55">
          <ellipse cx="1392" cy="162" rx="26" ry="30" fill="#7A2808" />
          <ellipse cx="1408" cy="148" rx="18" ry="22" fill="#8B3A0A" />
        </g>
        <rect x="1386" y="190" width="10" height="66" fill="#2A1004" />

        {/* Large primary right tree */}
        <ellipse cx="1292" cy="120" rx="68" ry="62" fill="#A83408" />
        <ellipse cx="1264" cy="104" rx="52" ry="56" fill="#C44A14" />
        <ellipse cx="1318" cy="108" rx="48" ry="50" fill="#D2601A" />
        <ellipse cx="1292" cy="85"  rx="38" ry="42" fill="#DE7818" opacity="0.85" />
        <ellipse cx="1310" cy="78"  rx="26" ry="30" fill="#E8A020" opacity="0.62" />
        <rect x="1282" y="174" width="20" height="88" fill="#2A1004" />

        {/* Second right tree */}
        <ellipse cx="1166" cy="140" rx="56" ry="54" fill="#BE3E10" />
        <ellipse cx="1142" cy="124" rx="44" ry="48" fill="#D2601A" />
        <ellipse cx="1190" cy="126" rx="40" ry="42" fill="#C44A14" />
        <ellipse cx="1165" cy="102" rx="32" ry="36" fill="#E8A020" opacity="0.70" />
        <rect x="1158" y="186" width="16" height="76" fill="#2A1004" />

        {/* Foreground ground shadow */}
        <ellipse cx="1360" cy="252" rx="62" ry="24" fill="#130804" opacity="0.9" />
        <ellipse cx="1244" cy="258" rx="76" ry="22" fill="#130804" opacity="0.85" />

        {/* ── GROUND PLANE ── */}
        <path
          d="M0,262 Q360,252 720,257 Q1080,262 1440,255 L1440,300 L0,300 Z"
          fill="#130804"
        />

        {/* Ground leaf accents */}
        {GROUND_LEAVES.map(({ cx, cy, rx, ry, color, rot }) => (
          <ellipse key={cx}
            cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity="0.65"
            transform={`rotate(${rot},${cx},${cy})`}
          />
        ))}
      </svg>

      {/* ── FALLING LEAVES ── */}
      <div
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {LEAVES.map((leaf, i) => (
          <span
            key={i}
            className="maple-leaf"
            style={Object.assign(
              { left: `${leaf.x}%`, color: leaf.color },
              {
                "--lf-dur":   `${leaf.dur}s`,
                "--lf-delay": `${leaf.delay}s`,
                "--lf-drift": `${leaf.drift}px`,
                "--lf-spin":  `${leaf.spin}deg`,
                "--lf-scale": String(leaf.scale),
              }
            ) as React.CSSProperties}
          >
            <svg width="22" height="22" viewBox="-18 -18 36 36"
              style={{ display: "block" }} aria-hidden="true">
              <path d={LEAF_PATHS[leaf.shape] ?? LEAF_PATHS[0]} fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
