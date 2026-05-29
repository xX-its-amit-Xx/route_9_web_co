// Lighthouse ─────────────────────────────────────────────────────────────────
//
// Hand-illustrated New England lighthouse on Lake Quinsigamond at night.
// Pure SVG server component — animated rotating beam via <animateTransform>,
// animated water ripples via <animate>. Placed between NightSky and About.

const LHX = 680; // lighthouse x-center
const BEAM_Y = 162; // lantern center y

const STARS: [number, number, number, number][] = Array.from(
  { length: 62 },
  (_, i) => [
    (i * 1789 + 439) % 1440,
    (i * 1123 + 271) % 265,
    0.7 + (i % 4) * 0.45,
    0.18 + (i % 7) * 0.07,
  ] as [number, number, number, number]
);

const TREES: [number, number, number][] = [
  [55, 285, 32], [140, 278, 42], [250, 282, 28], [355, 276, 38],
  [470, 280, 35], [590, 283, 26], [820, 279, 40], [960, 281, 30],
  [1070, 277, 44], [1190, 283, 34], [1310, 280, 38], [1410, 285, 25],
];

const GALLERY_POSTS: number[] = [-14, -7, 0, 7, 14];
const WINDOW_PAIRS: [number, number][] = [[LHX + 30, 258], [LHX + 62, 258]];
const DOCK_PLANKS: number[] = [882, 902, 922, 942, 962, 982, 1002, 1022, 1042];
const WATER_RIPPLES: [number, number, number][] = [
  [30, 2.4, 0], [55, 1.8, 0.4], [82, 1.4, 0.8], [112, 1.2, 1.2],
];
const GROUND_RIPPLES: [number, number, number][] = [
  [40, 1.6, 0], [70, 1.2, 0.5], [100, 0.9, 1.0], [132, 0.7, 1.5],
];

export function Lighthouse() {
  return (
    <div aria-hidden style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Lighthouse on Lake Quinsigamond at night, beam sweeping across the water"
      >
        <defs>
          <linearGradient id="lh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010306" />
            <stop offset="55%"  stopColor="#060f1e" />
            <stop offset="100%" stopColor="#0c1c2e" />
          </linearGradient>
          <linearGradient id="lh-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#06141e" />
            <stop offset="100%" stopColor="#030c14" />
          </linearGradient>
          <linearGradient id="lh-tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#b8b0a0" />
            <stop offset="45%"  stopColor="#e0d8c8" />
            <stop offset="100%" stopColor="#a8a090" />
          </linearGradient>
          <linearGradient id="lh-house" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#221a10" />
            <stop offset="100%" stopColor="#160e08" />
          </linearGradient>
          <radialGradient id="lh-moon-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(245,235,175,0.32)" />
            <stop offset="100%" stopColor="rgba(245,235,175,0)" />
          </radialGradient>
          <radialGradient id="lh-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,242,160,0.95)" />
            <stop offset="35%"  stopColor="rgba(255,220,100,0.55)" />
            <stop offset="100%" stopColor="rgba(255,200,60,0)" />
          </radialGradient>
          <radialGradient id="lh-water-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(245,235,165,0.18)" />
            <stop offset="100%" stopColor="rgba(245,235,165,0)" />
          </radialGradient>
        </defs>

        {/* ── SKY ── */}
        <rect width="1440" height="460" fill="url(#lh-sky)" />

        {/* Stars */}
        {STARS.map(([sx, sy, sr, sop], i) => (
          <circle key={i} cx={sx} cy={sy} r={sr} fill="white" opacity={sop} />
        ))}

        {/* Moon */}
        <circle cx="260" cy="82" r="62" fill="url(#lh-moon-halo)" />
        <circle cx="260" cy="82" r="26" fill="#f5eab5" opacity="0.78" />
        <circle cx="252" cy="76" r="5"  fill="rgba(170,148,90,0.22)" />
        <circle cx="269" cy="90" r="3"  fill="rgba(170,148,90,0.18)" />

        {/* Distant tree line */}
        {TREES.map(([tx, ty, th], i) => (
          <ellipse key={i} cx={tx} cy={ty} rx={16 + (i % 5) * 4} ry={th / 2}
            fill="#060c12" opacity="0.88" />
        ))}

        {/* ── ROTATING BEAM ── */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${LHX} ${BEAM_Y}`}
            to={`360 ${LHX} ${BEAM_Y}`}
            dur="5.5s"
            repeatCount="indefinite"
          />
          {/* Primary beam — long narrow triangle */}
          <polygon
            points={`${LHX},${BEAM_Y} ${LHX + 800},${BEAM_Y - 160} ${LHX + 800},${BEAM_Y + 160}`}
            fill="rgba(255,242,140,0.11)"
          />
          {/* Bright center streak */}
          <polygon
            points={`${LHX},${BEAM_Y} ${LHX + 820},${BEAM_Y - 32} ${LHX + 820},${BEAM_Y + 32}`}
            fill="rgba(255,248,180,0.07)"
          />
          {/* Opposing beam (180°) */}
          <polygon
            points={`${LHX},${BEAM_Y} ${LHX - 800},${BEAM_Y - 160} ${LHX - 800},${BEAM_Y + 160}`}
            fill="rgba(255,242,140,0.07)"
          />
        </g>

        {/* Lantern ambient glow (static, always on) */}
        <circle cx={LHX} cy={BEAM_Y} r="52" fill="url(#lh-lantern-glow)" opacity="0.65" />

        {/* ── WATER ── */}
        <rect x="0" y="293" width="1440" height="167" fill="url(#lh-water)" />

        {/* Water surface shimmer */}
        {WATER_RIPPLES.map(([rx, ry, rdelay], i) => (
          <ellipse key={i}
            cx={LHX} cy="298" rx={rx * 8} ry={ry}
            stroke="rgba(255,255,255,0.032)" strokeWidth="0.7" fill="none"
          >
            <animate attributeName="opacity" values="0.5;1;0.5"
              dur="3s" begin={`${rdelay}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {/* Moon reflection on water */}
        <ellipse cx="260" cy="370" rx="14" ry="55" fill="url(#lh-water-moon)" />
        {GROUND_RIPPLES.map(([gr, gry, gdelay], i) => (
          <ellipse key={i} cx="260" cy="350" rx={gr * 7} ry={gry}
            stroke="rgba(245,235,160,0.04)" strokeWidth="0.6" fill="none"
          >
            <animate attributeName="opacity" values="1;0.4;1"
              dur="4s" begin={`${gdelay}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {/* Lighthouse beam reflection on water */}
        <rect x={LHX - 3} y="298" width="6" height="80"
          fill="rgba(255,240,130,0.08)" />
        <ellipse cx={LHX} cy="380" rx="10" ry="5"
          fill="rgba(255,240,130,0.06)" />

        {/* ── ROCKY PROMONTORY ── */}
        <ellipse cx={LHX} cy="299" rx="98" ry="20" fill="#100c08" />
        <ellipse cx={LHX} cy="294" rx="82" ry="14" fill="#1a1208" />
        <line x1={LHX - 62} y1="298" x2={LHX - 28} y2="292"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1={LHX + 22} y1="300" x2={LHX + 58} y2="294"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1" />

        {/* ── LIGHTHOUSE TOWER ── */}
        {/* Stone foundation */}
        <rect x={LHX - 30} y="276" width="60" height="22" rx="3" fill="#221c14" />
        {/* Tower body — tapered */}
        <polygon
          points={`${LHX - 23},276 ${LHX + 23},276 ${LHX + 15},172 ${LHX - 15},172`}
          fill="url(#lh-tower)"
        />
        {/* Red band stripes */}
        <polygon
          points={`${LHX - 20},252 ${LHX + 20},252 ${LHX + 18},234 ${LHX - 18},234`}
          fill="#be1e0e" opacity="0.72"
        />
        <polygon
          points={`${LHX - 16},217 ${LHX + 16},217 ${LHX + 15},202 ${LHX - 15},202`}
          fill="#be1e0e" opacity="0.62"
        />
        {/* Mortar lines */}
        {[244, 230, 218, 206, 195, 185].map(y => (
          <line key={y}
            x1={LHX - 21 + (276 - y) * 0.37} y1={y}
            x2={LHX + 21 - (276 - y) * 0.37} y2={y}
            stroke="rgba(0,0,0,0.14)" strokeWidth="0.8"
          />
        ))}

        {/* Gallery deck */}
        <rect x={LHX - 20} y="169" width="40" height="5" rx="1" fill="#807868" />
        {/* Railing posts */}
        {GALLERY_POSTS.map(dx => (
          <line key={dx} x1={LHX + dx} y1="169" x2={LHX + dx} y2="162"
            stroke="#807868" strokeWidth="0.9" />
        ))}
        <line x1={LHX - 18} y1="162" x2={LHX + 18} y2="162"
          stroke="#807868" strokeWidth="0.8" />

        {/* Lantern room */}
        <polygon
          points={`${LHX - 15},169 ${LHX + 15},169 ${LHX + 13},147 ${LHX - 13},147`}
          fill="#1a1612" stroke="#504838" strokeWidth="0.8"
        />
        {/* Glass panels (lit amber) */}
        {[-9, -3, 3, 9].map(dx => (
          <rect key={dx} x={LHX + dx - 2.5} y="150" width="4.5" height="16" rx="0.5"
            fill="rgba(255,230,110,0.22)" stroke="#504838" strokeWidth="0.4"
          />
        ))}
        {/* Lantern lens bright center */}
        <circle cx={LHX} cy={BEAM_Y} r="6" fill="rgba(255,248,200,0.98)" />

        {/* Roof dome */}
        <polygon
          points={`${LHX - 13},147 ${LHX + 13},147 ${LHX},134`}
          fill="#807868"
        />
        {/* Weather vane */}
        <line x1={LHX} y1="134" x2={LHX} y2="126"
          stroke="#807868" strokeWidth="1.2" />
        <circle cx={LHX} cy="125" r="2.2" fill="#807868" />

        {/* ── KEEPER'S HOUSE ── */}
        <rect x={LHX + 23} y="246" width="82" height="52" rx="1" fill="url(#lh-house)" />
        {/* Roof */}
        <polygon
          points={`${LHX + 23},246 ${LHX + 105},246 ${LHX + 88},226 ${LHX + 40},226`}
          fill="#201810"
        />
        {/* Windows — warm amber glow */}
        {WINDOW_PAIRS.map(([wx, wy], i) => (
          <rect key={i} x={wx} y={wy} width="18" height="14" rx="1"
            fill="rgba(232,160,40,0.65)"
          >
            <animate attributeName="opacity" values="0.65;0.55;0.65"
              dur="4s" begin={`${i * 1.4}s`} repeatCount="indefinite" />
          </rect>
        ))}
        {/* Door */}
        <rect x={LHX + 56} y="270" width="13" height="28" rx="1"
          fill="#0c0804" />

        {/* ── DOCK ── */}
        <rect x="858" y="290" width="196" height="7" rx="2" fill="#28180a" opacity="0.92" />
        {DOCK_PLANKS.map(px => (
          <rect key={px} x={px} y="297" width="5" height="32" rx="0.5"
            fill="#20120602" opacity="0.85" />
        ))}
        <rect x="860" y="283" width="5" height="22" rx="1" fill="#28180a" />
        <rect x="1046" y="283" width="5" height="22" rx="1" fill="#28180a" />

        {/* Rowboat */}
        <path d="M 898,298 Q 928,308 958,298"
          stroke="#3c2610" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 898,298 Q 928,294 958,298"
          stroke="#4e3418" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Oar */}
        <line x1="928" y1="296" x2="918" y2="280"
          stroke="#4e3418" strokeWidth="1.5" strokeLinecap="round" />

        {/* Rope mooring line */}
        <path d="M 860,287 Q 880,290 898,296"
          stroke="rgba(120,90,50,0.4)" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* ── CAPTION ── */}
        <text x="1430" y="452" textAnchor="end"
          fill="rgba(255,255,255,0.12)" fontSize="8.5"
          fontFamily="monospace" letterSpacing="0.14em"
        >
          LAKE QUINSIGAMOND · SHREWSBURY, MA
        </text>
      </svg>
    </div>
  );
}
