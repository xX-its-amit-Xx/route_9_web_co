// CoveredBridge ──────────────────────────────────────────────────────────────
//
// Full-width New England covered bridge scene (SVG viewBox 1440×380).
// Purely decorative — aria-hidden. Dusk / golden-hour lighting.
// Placed between Route9Scene and ShrewsburyClockTower as a cinematic
// section divider evoking the Route 9 / Shrewsbury landscape.
//
// Layers (back to front):
//   1. Dusk sky gradient + sun glow
//   2. Distant hill silhouettes
//   3. Background tree line
//   4. Sun disc at the horizon
//   5. Covered bridge (gable roof, X-brace lattice walls, stone abutments)
//   6. "ROUTE 9" sign on portal gable
//   7. Road approaches (left & right)
//   8. Stream / river with animated shimmer & bridge reflection
//   9. Near foreground trees
//  10. Ground strip + grass tufts

// All tree / rock / tuft positions are deterministic (no Math.random).

const BG_TREES_LEFT: [number, number, number][] = [
  [40, 196, 38], [82, 182, 50], [128, 194, 40], [174, 180, 54],
  [220, 192, 44], [58, 206, 32], [104, 202, 36], [150, 208, 30],
];

const BG_TREES_RIGHT: [number, number, number][] = [
  [1400, 196, 38], [1358, 182, 50], [1312, 194, 40], [1266, 180, 54],
  [1220, 192, 44], [1382, 206, 32], [1336, 202, 36], [1290, 208, 30],
];

const FG_TREES_LEFT: [number, number, number][] = [
  [24,  238, 72], [68,  222, 90], [118, 234, 70],
  [28,  242, 52], [82,  240, 48], [144, 244, 40],
];

const FG_TREES_RIGHT: [number, number, number][] = [
  [1416, 238, 72], [1372, 222, 90], [1322, 234, 70],
  [1412, 242, 52], [1358, 240, 48], [1296, 244, 40],
];

const ROCKS: [number, number, number, number][] = [
  [160, 272,  22, 10], [540, 284,  14,  7],
  [820, 278,  18,  8], [1110, 276, 20,  9],
  [1280, 280, 14,  6],
];

const RIPPLE_ROWS: number[] = [256, 265, 274, 283, 292, 301, 310, 318];

const GRASS_X: number[] = [68, 188, 380, 780, 1060, 1260, 1392];

// Roof boards – left slope and right slope
const ROOF_BOARDS_L: [number, number][] = Array.from({ length: 23 }, (_, k) => {
  const frac = k / 22;
  return [300 + frac * (720 - 300), 80 + frac * (136 - 80)] as [number, number];
});
const ROOF_BOARDS_R: [number, number][] = Array.from({ length: 23 }, (_, k) => {
  const frac = k / 22;
  return [720 + frac * (1140 - 720), 80 + frac * (136 - 80)] as [number, number];
});

// Wall X-brace cells: 12 bays from x=336 to x=1104 (width=64 each)
const BRACE_BAYS: number[] = Array.from({ length: 12 }, (_, k) => 336 + k * 64);

// Abutment stone lines
const LEFT_ABUTMENT_V: number[] = [270, 278, 286, 294, 302];
const LEFT_ABUTMENT_H: number[] = [232, 242, 252, 262, 272];
const RIGHT_ABUTMENT_V: number[] = [1150, 1158, 1166, 1174];
const RIGHT_ABUTMENT_H: number[] = [232, 242, 252, 262, 272];

export function CoveredBridge() {
  return (
    <section
      aria-hidden="true"
      style={{ lineHeight: 0, overflow: "hidden" }}
    >
      <svg
        viewBox="0 0 1440 380"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#06021a" />
            <stop offset="28%"  stopColor="#280c00" />
            <stop offset="58%"  stopColor="#883000" />
            <stop offset="80%"  stopColor="#c85800" />
            <stop offset="100%" stopColor="#de7210" />
          </linearGradient>

          <radialGradient id="cb-sun-sky" cx="73%" cy="65%" r="42%">
            <stop offset="0%"   stopColor="rgba(255,178,50,0.52)" />
            <stop offset="40%"  stopColor="rgba(210,88,8,0.24)" />
            <stop offset="100%" stopColor="rgba(180,48,0,0)" />
          </radialGradient>

          <linearGradient id="cb-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#102840" />
            <stop offset="100%" stopColor="#060e18" />
          </linearGradient>

          <radialGradient id="cb-sun-reflect" cx="73%" cy="0%" r="80%">
            <stop offset="0%"   stopColor="rgba(255,150,30,0.28)" />
            <stop offset="100%" stopColor="rgba(255,80,0,0)" />
          </radialGradient>

          <filter id="cb-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* ── SKY ── */}
        <rect x="0" y="0" width="1440" height="380" fill="url(#cb-sky)" />
        <rect x="0" y="0" width="1440" height="380" fill="url(#cb-sun-sky)" />

        {/* ── SUN AT HORIZON ── */}
        <circle cx="1050" cy="242" r="36" fill="#ffb030" opacity="0.50" />
        <circle cx="1050" cy="242" r="24" fill="#ffc850" opacity="0.65" />
        <circle cx="1050" cy="242" r="14" fill="#ffe070" opacity="0.80" />
        {/* Sun corona rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 1050 + Math.cos(rad) * 55;
          const y2 = 242 + Math.sin(rad) * 55;
          return (
            <line key={i} x1="1050" y1="242" x2={x2.toFixed(1)} y2={y2.toFixed(1)}
              stroke="rgba(255,190,60,0.12)" strokeWidth="2">
              <animate attributeName="opacity" values="0.12;0.22;0.12"
                dur={`${3.2 + i * 0.38}s`} begin={`${i * 0.25}s`} repeatCount="indefinite"/>
            </line>
          );
        })}

        {/* ── DISTANT HILLS ── */}
        <path
          d="M 0,198 Q 180,170 360,184 Q 540,198 720,164 Q 900,130 1080,152 Q 1260,174 1440,157 L 1440,380 L 0,380 Z"
          fill="#080215" opacity="0.90"
        />

        {/* ── BACKGROUND TREES ── */}
        {BG_TREES_LEFT.map(([tx, ty, th], i) => (
          <ellipse key={i} cx={tx} cy={ty - th / 2} rx={th * 0.44} ry={th / 2}
            fill="#050115" opacity="0.85" />
        ))}
        {BG_TREES_RIGHT.map(([tx, ty, th], i) => (
          <ellipse key={i} cx={tx} cy={ty - th / 2} rx={th * 0.44} ry={th / 2}
            fill="#050115" opacity="0.85" />
        ))}

        {/* ════════════════ COVERED BRIDGE ════════════════ */}

        {/* Stone abutments */}
        <rect x="258" y="226" width="46" height="58" fill="#2c2018" />
        {LEFT_ABUTMENT_V.map(x => (
          <line key={x} x1={x} y1="226" x2={x} y2="284"
            stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
        ))}
        {LEFT_ABUTMENT_H.map(y => (
          <line key={y} x1="258" y1={y} x2="304" y2={y}
            stroke="rgba(0,0,0,0.16)" strokeWidth="0.8" />
        ))}
        <rect x="1136" y="226" width="46" height="58" fill="#2c2018" />
        {RIGHT_ABUTMENT_V.map(x => (
          <line key={x} x1={x} y1="226" x2={x} y2="284"
            stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
        ))}
        {RIGHT_ABUTMENT_H.map(y => (
          <line key={y} x1="1136" y1={y} x2="1182" y2={y}
            stroke="rgba(0,0,0,0.16)" strokeWidth="0.8" />
        ))}

        {/* ── ROOF ── */}
        {/* Main roof surface (two faces) */}
        <polygon points="292,136 720,80 1148,136 1148,144 292,144" fill="#38140a" />
        {/* Left slope face (slightly lighter) */}
        <polygon points="292,136 720,80 720,88 292,144" fill="#481e10" />
        {/* Ridge beam */}
        <line x1="292" y1="136" x2="720" y2="80" stroke="#1a0804" strokeWidth="3" />
        <line x1="720" y1="80" x2="1148" y2="136" stroke="#1a0804" strokeWidth="3" />
        {/* Eave overhang */}
        <rect x="284" y="132" width="872" height="14" rx="1" fill="#280e06" opacity="0.85" />
        {/* Roof boards — left slope */}
        {ROOF_BOARDS_L.map(([bx, by], k) => (
          <line key={k} x1={bx} y1={by} x2={bx} y2={144}
            stroke="rgba(0,0,0,0.20)" strokeWidth="1" />
        ))}
        {/* Roof boards — right slope */}
        {ROOF_BOARDS_R.map(([bx, by], k) => (
          <line key={k} x1={bx} y1={by} x2={bx} y2={144}
            stroke="rgba(0,0,0,0.20)" strokeWidth="1" />
        ))}

        {/* ── BRIDGE WALLS ── */}
        {/* Near wall rectangle */}
        <rect x="304" y="144" width="832" height="90" fill="#5a2a0c" />

        {/* X-brace lattice */}
        {BRACE_BAYS.map((x0, k) => (
          <g key={k}>
            <line x1={x0}      y1="146" x2={x0 + 64} y2="232"
              stroke="#301608" strokeWidth="2.2" />
            <line x1={x0 + 64} y1="146" x2={x0}      y2="232"
              stroke="#301608" strokeWidth="2.2" />
          </g>
        ))}

        {/* Horizontal top and bottom rails */}
        <rect x="304" y="144" width="832" height="7" fill="#381806" />
        <rect x="304" y="227" width="832" height="7" fill="#381806" />

        {/* Warm daylight leaking through wall gaps */}
        {Array.from({ length: 8 }, (_, k) => (
          <rect key={k} x={318 + k * 100} y="154" width="16" height="68"
            fill="rgba(255,150,40,0.035)" />
        ))}

        {/* ── LEFT PORTAL ── */}
        {/* Portal opening (dark tunnel entrance) */}
        <rect x="304" y="144" width="50" height="92" fill="#100806" />
        <rect x="344" y="154" width="10" height="80" fill="rgba(255,120,30,0.06)" />
        {/* Portal frame trim */}
        <rect x="300" y="142" width="5"  height="94" fill="#2e1408" />
        <rect x="350" y="142" width="5"  height="94" fill="#2e1408" />
        <rect x="298" y="140" width="62" height="7"  fill="#2e1408" />

        {/* ── RIGHT PORTAL ── */}
        <rect x="1086" y="144" width="50" height="92" fill="#0c0604" />
        {/* Warm sun glow visible at far end */}
        <rect x="1086" y="154" width="14" height="80" fill="rgba(255,120,30,0.09)" />
        <rect x="1096" y="160" width="30" height="68" fill="rgba(255,100,20,0.06)" />
        {/* Portal frame trim */}
        <rect x="1082" y="142" width="5"  height="94" fill="#2e1408" />
        <rect x="1132" y="142" width="5"  height="94" fill="#2e1408" />
        <rect x="1080" y="140" width="62" height="7"  fill="#2e1408" />

        {/* Interior tunnel floor strip */}
        <rect x="354" y="228" width="732" height="8" fill="#18100a" />

        {/* ── "ROUTE 9" SIGN on left gable ── */}
        <rect x="297" y="112" width="66" height="22" rx="2" fill="#1c0a04" stroke="rgba(255,180,80,0.2)" strokeWidth="0.8"/>
        <text x="330" y="127" textAnchor="middle"
          fill="rgba(255,195,90,0.72)" fontSize="9.5"
          fontFamily="monospace" fontWeight="bold" letterSpacing="1.2">
          ROUTE 9
        </text>

        {/* ── ROAD APPROACHES ── */}
        {/* Left dirt road */}
        <path d="M 0,238 L 258,232 L 258,244 L 0,252 Z" fill="#1c1208" />
        <line x1="0" y1="240" x2="258" y2="234" stroke="rgba(0,0,0,0.28)" strokeWidth="2"/>
        <line x1="0" y1="246" x2="258" y2="240" stroke="rgba(0,0,0,0.22)" strokeWidth="2"/>
        {/* Right dirt road */}
        <path d="M 1182,232 L 1440,238 L 1440,252 L 1182,244 Z" fill="#1c1208" />
        <line x1="1182" y1="234" x2="1440" y2="240" stroke="rgba(0,0,0,0.28)" strokeWidth="2"/>
        <line x1="1182" y1="240" x2="1440" y2="246" stroke="rgba(0,0,0,0.22)" strokeWidth="2"/>

        {/* ════════════════ STREAM / RIVER ════════════════ */}
        <rect x="0" y="250" width="1440" height="90" fill="url(#cb-water)" />

        {/* Sun reflection on water */}
        <ellipse cx="1050" cy="278" rx="200" ry="22" fill="rgba(255,140,28,0.14)" />
        <ellipse cx="1050" cy="272" rx="90"  ry="9"  fill="rgba(255,160,48,0.20)" />
        <rect x="0" y="250" width="1440" height="90" fill="url(#cb-sun-reflect)" />

        {/* Water ripples */}
        {RIPPLE_ROWS.map((wy, i) => (
          <path key={i}
            d={`M ${i * 200 - 40},${wy} Q ${i * 200 + 80},${wy - 4} ${i * 200 + 200},${wy}`}
            stroke="rgba(255,255,255,0.052)" strokeWidth="1.2" fill="none">
            <animate attributeName="opacity" values="0.35;0.65;0.35"
              dur={`${2.6 + i * 0.42}s`} begin={`${i * 0.38}s`} repeatCount="indefinite"/>
          </path>
        ))}

        {/* Bridge reflection in water */}
        <path d="M 288,250 L 1152,250 L 1152,296 Q 720,306 288,296 Z"
          fill="#060210" opacity="0.50" />

        {/* Rocks in stream */}
        {ROCKS.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#141010" />
        ))}

        {/* ── NEAR FOREGROUND TREES ── */}
        {FG_TREES_LEFT.map(([tx, ty, th], i) => (
          <g key={i} transform={`translate(${tx},${ty})`}>
            <rect x="-3" y="0" width="6" height={th * 0.2} fill="#0a0608" />
            <ellipse cx="0" cy={-th * 0.44} rx={th * 0.44} ry={th * 0.50}
              fill="#050110" />
          </g>
        ))}
        {FG_TREES_RIGHT.map(([tx, ty, th], i) => (
          <g key={i} transform={`translate(${tx},${ty})`}>
            <rect x="-3" y="0" width="6" height={th * 0.2} fill="#0a0608" />
            <ellipse cx="0" cy={-th * 0.44} rx={th * 0.44} ry={th * 0.50}
              fill="#050110" />
          </g>
        ))}

        {/* ── FOREGROUND GROUND ── */}
        <path
          d="M 0,304 Q 360,294 720,299 Q 1080,304 1440,296 L 1440,380 L 0,380 Z"
          fill="#040112"
        />

        {/* Grass tufts */}
        {GRASS_X.map((gx, i) => (
          <g key={i} transform={`translate(${gx},304)`}>
            <line x1="0" y1="0" x2="-5" y2="-13" stroke="#060218" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="0" x2="0"  y2="-15" stroke="#080220" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="0" x2="6"  y2="-12" stroke="#060218" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        ))}

        {/* Bottom strip */}
        <rect x="0" y="350" width="1440" height="30" fill="#030110" />
      </svg>
    </section>
  );
}
