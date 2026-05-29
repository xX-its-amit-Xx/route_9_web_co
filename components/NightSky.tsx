// ── NightSky ───────────────────────────────────────────────────────────────
//
// Full-width atmospheric night-sky scene (SVG viewBox 1440×380).
// Purely decorative — aria-hidden. Placed between ShrewsburyClockTower and
// About as a cinematic transition into the personal section.
//
// Layers from back to front:
//   1. Deep-space sky gradient
//   2. Milky Way band (Gaussian-blur path)
//   3. 70 deterministic stars with staggered SVG animate twinkle
//   4. 4 shooting stars (animateTransform + opacity)
//   5. Rolling hills silhouette + pine tree clusters + building shapes
//   6. Window lights with slow pulse
//   7. Route 9 road faint-glow strip at bottom edge
//
// All positions are deterministic (no Math.random) — LCG-style formulas.
// No new CSS classes needed; all animation is SVG-native.

// 70 stars: (x,y,r,opacity,twinkle delay,twinkle dur)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x:   ((i * 1789 + 439)  % 1440),
  y:   ((i * 1373 + 197)  %  290),
  r:   i % 7 === 0 ? 2.3 : i % 3 === 0 ? 1.6 : 1.0,
  op:  0.45 + ((i * 17) % 12) * 0.038,
  del: `${((i * 37) % 43) * 0.11}s`,
  dur: `${2.1 + ((i * 13) % 22) * 0.088}s`,
  big: i % 7 === 0,
}));

// Shooting stars: [fromX, fromY, toX, toY, beginDelay, cycleDur]
// Each line starts offscreen and crosses diagonally.
const SHOOTERS: [number, number, number, number, string, string][] = [
  [  -30,  -8, 1470, 390, "1.5s", "14s" ],
  [ -30,  -8, 1470, 390, "7s",  "19s" ],
  [ -30,  -8, 1470, 390, "13s", "23s" ],
  [ -30,  -8, 1470, 390, "20s", "17s" ],
];

// Shooter tail length (px, at travel angle ≈28°)
const TAIL_X = 38;
const TAIL_Y = 18;

// Window lights [x, y, w, h, blinkDur]
const WINDOWS: [number, number, number, number, string][] = [
  [352, 324, 6, 5, "4.1s"],
  [362, 324, 6, 5, "5.3s"],
  [378, 320, 5, 4, "3.8s"],
  [760, 288, 5, 4, "4.7s"],
  [770, 288, 5, 4, "6.2s"],
  [1098, 307, 6, 5, "3.9s"],
  [1108, 307, 6, 5, "5.1s"],
  [1120, 313, 5, 4, "4.5s"],
];

// Pine tree groups [cx, cy, scale]
const PINES: [number, number, number][] = [
  // Left cluster
  [154, 310, 1.0], [175, 296, 1.2], [196, 312, 0.9], [218, 302, 1.0],
  // Center cluster
  [648, 290], [670, 276], [692, 294],
  // Right cluster
  [1210, 297, 1.0], [1232, 284, 1.2], [1255, 300, 0.9], [1278, 290, 1.0],
].map(([x, y, s = 1]) => [x, y, s] as [number, number, number]);

export function NightSky() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg,#020912 0%,#050E26 55%,#07121C 100%)",
        lineHeight: 0,
        overflow: "hidden",
        padding: 0,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 380"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="ns-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010710" />
            <stop offset="50%"  stopColor="#040D22" />
            <stop offset="80%"  stopColor="#091428" />
            <stop offset="100%" stopColor="#060A18" />
          </linearGradient>

          {/* Milky Way soft blur */}
          <filter id="ns-mw" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          {/* Large-star glow bloom */}
          <filter id="ns-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shooting-star gradient stroke */}
          <linearGradient id="ns-tail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
          </linearGradient>
        </defs>

        {/* ── SKY BASE ── */}
        <rect x="0" y="0" width="1440" height="380" fill="url(#ns-sky)" />

        {/* ── MILKY WAY ── */}
        <path
          d="M -80,265 Q 360,148 720,200 Q 1080,252 1520,132"
          stroke="rgba(210,218,255,0.10)" strokeWidth="140" fill="none"
          filter="url(#ns-mw)" />
        <path
          d="M -80,265 Q 360,148 720,200 Q 1080,252 1520,132"
          stroke="rgba(220,224,255,0.07)" strokeWidth="60" fill="none"
          filter="url(#ns-mw)" />

        {/* ── STARS ── */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r}
            fill={`rgba(218,228,255,${s.op.toFixed(2)})`}
            filter={s.big ? "url(#ns-glow)" : undefined}>
            <animate
              attributeName="opacity"
              values={`${s.op.toFixed(2)};${Math.min(1, s.op + 0.38).toFixed(2)};${s.op.toFixed(2)}`}
              dur={s.dur}
              begin={s.del}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── SHOOTING STARS ── */}
        {SHOOTERS.map(([x1, y1, x2, y2, begin, dur], i) => (
          <g key={i}>
            <line
              x1={0} y1={0} x2={TAIL_X} y2={TAIL_Y}
              stroke="url(#ns-tail)" strokeWidth={1.4} strokeLinecap="round">
              <animateTransform
                attributeName="transform" type="translate"
                values={`${x1},${y1}; ${x2},${y2}`}
                dur={dur} begin={begin}
                repeatCount="indefinite"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0;0;0.92;0.92;0;0"
                keyTimes="0;0.06;0.07;0.14;0.15;1"
                dur={dur} begin={begin}
                repeatCount="indefinite"
              />
            </line>
          </g>
        ))}

        {/* ── LANDSCAPE SILHOUETTE ── */}
        {/* Rolling hills / distant ground */}
        <path
          d="M 0,320 Q 190,292 370,310 Q 530,328 640,304 Q 760,280 900,300 Q 1060,322 1200,302 Q 1330,280 1440,308 L 1440,380 L 0,380 Z"
          fill="#050B18" />

        {/* Pine trees */}
        {PINES.map(([tx, ty, sc], i) => (
          <g key={i} transform={`translate(${tx},${ty}) scale(${sc})`}>
            {/* Lower canopy */}
            <polygon points="0,-26 13,0 -13,0" fill="#030912" />
            {/* Middle canopy */}
            <polygon points="0,-18 9,0 -9,0" fill="#040B14" />
            {/* Upper canopy */}
            <polygon points="0,-10 5,2 -5,2" fill="#030912" />
            {/* Trunk */}
            <rect x="-2.5" y="0" width="5" height="9" fill="#020710" />
          </g>
        ))}

        {/* Left building group */}
        <rect x="330" y="308" width="58" height="52" fill="#030912" />
        <polygon points="330,308 359,288 388,308" fill="#040B14" />
        {/* Chimney */}
        <rect x="374" y="280" width="7" height="16" fill="#030912" />

        {/* Center building */}
        <rect x="738" y="280" width="44" height="44" fill="#030912" />
        <polygon points="738,280 760,264 782,280" fill="#040B14" />

        {/* Right building */}
        <rect x="1088" y="298" width="52" height="44" fill="#030912" />
        <polygon points="1088,298 1114,282 1140,298" fill="#040B14" />
        <rect x="1096" y="278" width="7" height="18" fill="#030912" />

        {/* Window lights */}
        {WINDOWS.map(([wx, wy, ww, wh, wdur], i) => (
          <rect key={i} x={wx} y={wy} width={ww} height={wh} rx="1"
            fill="rgba(255,228,100,0.68)">
            <animate
              attributeName="opacity"
              values="0.52;0.75;0.52"
              dur={wdur}
              begin={`${i * 0.62}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}

        {/* ── FOREGROUND GROUND ── */}
        <path
          d="M 0,348 Q 360,336 720,342 Q 1080,348 1440,338 L 1440,380 L 0,380 Z"
          fill="#030810" />

        {/* Route 9 faint warm road glow at base */}
        <line x1="0" y1="360" x2="1440" y2="356"
          stroke="rgba(210,150,50,0.055)" strokeWidth="4" />

        {/* Very bottom ground strip */}
        <rect x="0" y="368" width="1440" height="12" fill="#020710" />
      </svg>
    </section>
  );
}
