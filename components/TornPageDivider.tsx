"use client";

// ── Organic torn paper edge divider ─────────────────────────────────────────
//
// The hero's dark background (#0E0905) is extended by an SVG paper body that
// terminates with an irregular torn edge. A warm amber glow bleeds through the
// crack, echoing a "crack of dawn light" — on-brand with the Route 9 amber palette.
//
// Path layout:
//   - viewBox: 0 0 1440 80
//   - Paper body: M0,0 … torn edge … L1440,0 Z  (fills hero bg above tear)
//   - Torn edge: same vertices, no fill, used for glow + fiber overlay
//   - Fibers: small hanging strokes at the deepest torn points
//
// preserveAspectRatio="none" lets the tear stretch full-width at any viewport.

// 72 control points × 20px = 1440px wide.
// Y values in range 40–66 create a convincing organic tear silhouette.
const PTS: [number, number][] = [
  [0,   52], [20,  46], [40,  60], [60,  44], [80,  58], [100, 42],
  [120, 64], [140, 48], [160, 56], [180, 44], [200, 62], [220, 46],
  [240, 54], [260, 40], [280, 64], [300, 48], [320, 56], [340, 44],
  [360, 60], [380, 46], [400, 54], [420, 40], [440, 62], [460, 48],
  [480, 56], [500, 44], [520, 64], [540, 46], [560, 58], [580, 42],
  [600, 56], [620, 44], [640, 62], [660, 46], [680, 58], [700, 40],
  [720, 54], [740, 48], [760, 64], [780, 44], [800, 58], [820, 46],
  [840, 56], [860, 42], [880, 64], [900, 48], [920, 56], [940, 44],
  [960, 62], [980, 46], [1000,58], [1020,40], [1040,56], [1060,44],
  [1080,62], [1100,46], [1120,60], [1140,42], [1160,56], [1180,44],
  [1200,64], [1220,46], [1240,58], [1260,42], [1280,56], [1300,46],
  [1320,62], [1340,44], [1360,58], [1380,46], [1400,60], [1420,44],
  [1440,54],
];

// Filled paper body path — dark hero color above the torn edge
const TORN_D: string = [
  "M0,0",
  "L0,52",
  ...PTS.slice(1).map(([x, y]) => `L${x},${y}`),
  "L1440,0",
  "Z",
].join(" ");

// Edge-only path for glow + fiber overlay
const EDGE_D: string = PTS.map(([x, y], i) =>
  (i === 0 ? `M${x},${y}` : `L${x},${y}`)
).join(" ");

// Paper fibers hang at the deepest torn points (y ≥ 62)
// Each fiber is a short angled stroke simulating a torn cellulose fiber
const FIBERS: { x: number; y: number; dx: number; len: number }[] = [
  { x: 120,  y: 64, dx:  2, len:  9 },
  { x: 280,  y: 64, dx: -3, len: 11 },
  { x: 440,  y: 62, dx:  1, len:  8 },
  { x: 522,  y: 64, dx: -2, len: 10 },
  { x: 640,  y: 62, dx:  3, len:  9 },
  { x: 762,  y: 64, dx: -1, len: 12 },
  { x: 880,  y: 64, dx:  2, len:  9 },
  { x: 960,  y: 62, dx: -2, len:  8 },
  { x: 1082, y: 62, dx:  1, len: 10 },
  { x: 1202, y: 64, dx: -3, len: 11 },
  { x: 1320, y: 62, dx:  2, len:  9 },
  // Secondary fibers — slightly shorter, offset a few px from the deep points
  { x: 133,  y: 60, dx: -1, len:  6 },
  { x: 497,  y: 60, dx:  2, len:  7 },
  { x: 898,  y: 60, dx: -1, len:  6 },
  { x: 1215, y: 60, dx:  1, len:  7 },
];

// Amber ember sparks scattered near the deepest points
const SPARKS: { x: number; y: number; r: number; d: string }[] = [
  { x: 125,  y: 72, r: 1.0, d: "0s"    },
  { x: 285,  y: 74, r: 0.7, d: "0.4s"  },
  { x: 528,  y: 72, r: 1.2, d: "0.8s"  },
  { x: 770,  y: 74, r: 0.8, d: "0.2s"  },
  { x: 886,  y: 72, r: 1.0, d: "1.0s"  },
  { x: 966,  y: 72, r: 0.6, d: "0.6s"  },
  { x: 1210, y: 74, r: 1.1, d: "0.35s" },
  { x: 1330, y: 72, r: 0.8, d: "0.9s"  },
];

export function TornPageDivider() {
  return (
    <div
      aria-hidden
      className="relative pointer-events-none"
      style={{
        height    : "80px",
        marginTop : "-1px",
        zIndex    : 10,
        overflow  : "visible",
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
      >
        {/* ── 1. Wide diffuse amber glow (below the tear) ── */}
        <path
          d={EDGE_D}
          stroke="rgba(212,104,42,0.14)"
          strokeWidth="18"
          strokeLinecap="round"
          style={{ filter: "blur(5px)" }}
        />

        {/* ── 2. Medium glow halo ── */}
        <path
          d={EDGE_D}
          stroke="rgba(212,104,42,0.22)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: "blur(2.5px)" }}
        />

        {/* ── 3. Paper fiber strands ── */}
        {FIBERS.map(({ x, y, dx, len }, i) => (
          <line
            key={i}
            x1={x}         y1={y}
            x2={x + dx}    y2={y + len}
            stroke="rgba(243,233,213,0.11)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        ))}

        {/* ── 4. Ember sparks at the deepest torn points ── */}
        {SPARKS.map(({ x, y, r, d }, i) => (
          <circle
            key={i}
            cx={x} cy={y} r={r}
            fill="rgba(212,104,42,0.65)"
            className="torn-spark"
            style={{ animationDelay: d } as React.CSSProperties}
          />
        ))}

        {/* ── 5. Crisp amber edge line ── */}
        <path
          d={EDGE_D}
          stroke="rgba(212,104,42,0.50)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* ── 6. Thin bright highlight (exposed paper cross-section) ── */}
        <path
          d={EDGE_D}
          stroke="rgba(255,215,130,0.24)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* ── 7. Paper body — extends hero background above the tear ── */}
        <path d={TORN_D} fill="#0E0905" />
      </svg>
    </div>
  );
}
