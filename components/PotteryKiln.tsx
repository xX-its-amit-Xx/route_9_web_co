"use client";
import { useEffect, useRef, useState } from "react";

// ── geometry ──────────────────────────────────────────────────────────────────
const W = 1280, H = 520;
const GY   = 462;           // ground y
const HZ   = 288;           // horizon y

// kiln — round bottle kiln, colonial brick
const KCX  = 740;           // kiln center x
const KBASE = GY - 20;      // 442  — base of kiln
const KBOT_W = 154;         // half-width at base
const KMID_W = 96;          // half-width at shoulder
const KTOP_W = 36;          // half-width at neck opening
const KBOT_Y = KBASE;       // 442
const KMID_Y = KBASE - 168; // 274  — shoulder
const KTOP_Y = KBASE - 260; // 182  — neck top
const KFIRE_W = 44;         // firebox opening half-width
const KFIRE_H = 46;         // firebox opening height
const KFIRE_Y = KBASE - 0;  // 442

// potter's wheel + potter  (left side)
const WCX  = 264;           // wheel center x
const WCY  = GY - 62;       // 400 — wheel top surface
const WR   = 56;            // wheel radius
const WTH  = 14;            // wheel thickness (side view)
const FLY_R = 32;           // flywheel radius
const FLY_Y = WCY + WTH + 28; // 442

// potter sits behind wheel
const POTY  = GY;           // 462
const POTX  = WCX + 28;     // 292

// shelf unit (back wall)
const SHF_X = 90;
const SHF_W = 310;
const SHF_YS = [GY - 260, GY - 200, GY - 140, GY - 80] as const; // 4 shelf heights

// wood pile (right of kiln)
const WP_X  = 902;
const WP_Y  = KBASE;

// smoke stack opening at top of kiln
const SMOKE_CX = KCX;
const SMOKE_Y  = KTOP_Y;

// ── pots on shelves ───────────────────────────────────────────────────────────
type Pot3 = [number, number, number]; // [x, y, scale]
const SHELF_POTS: Pot3[] = (() => {
  const arr: Pot3[] = [];
  const shapeOffsets = [0, 22, 44, 66, 88, 110];
  SHF_YS.forEach((sy, si) => {
    for (let pi = 0; pi < 5; pi++) {
      const px = SHF_X + 26 + pi * 58;
      const sc = 0.72 + (si % 3) * 0.12;
      arr.push([px, sy, sc]);
    }
  });
  return arr;
})();

// drying pots on floor
const FLOOR_POTS: Pot3[] = [
  [420, GY, 1.0], [460, GY, 1.0], [500, GY, 1.0],
  [540, GY, 0.88], [574, GY, 0.88],
];

// smoke puffs
type SP4 = [number, number, number, number]; // [x, yStart, xDrift, phase]
const SMOKES: SP4[] = (() => {
  const arr: SP4[] = [];
  for (let i = 0; i < 10; i++) {
    const xd = ((i * 137) % 24) - 12;
    arr.push([SMOKE_CX + xd * 0.3, SMOKE_Y - i * 28, xd, i * 0.6]);
  }
  return arr;
})();

// ember sparks from firebox
type EB3 = [number, number, number]; // [xOff, phase, speed]
const EMBERS: EB3[] = (() => {
  const arr: EB3[] = [];
  for (let i = 0; i < 14; i++) {
    arr.push([
      ((i * 53) % 60) - 30,
      i * 0.44,
      0.6 + (i % 4) * 0.28,
    ]);
  }
  return arr;
})();

// firebox flame layers
type FL4 = [number, number, number, number]; // [hw, fh, sway, phase]
const FLAMES: FL4[] = [
  [38, 52, -2, 0.0],
  [28, 62, 3,  0.4],
  [18, 72, -4, 0.8],
  [12, 54, 1,  1.2],
];

// wood log positions in pile
type LOG4 = [number, number, number, number]; // [x, y, angle, len]
const LOGS: LOG4[] = [
  [WP_X,      WP_Y - 10, -6,  82],
  [WP_X + 14, WP_Y - 18, 5,   74],
  [WP_X - 8,  WP_Y - 18, -12, 66],
  [WP_X + 6,  WP_Y - 28, 3,   70],
  [WP_X - 4,  WP_Y - 28, -8,  62],
];

// foot treadle pedal
const TREAD_X = WCX - 60;
const TREAD_Y = FLY_Y + 26;

// flying birds
type BIRD3 = [number, number, number]; // [x, y, phase]
const BIRDS: BIRD3[] = [
  [160, 148, 0.0], [188, 138, 0.8], [214, 152, 1.6],
  [390, 122, 2.4], [416, 134, 3.2],
];

// ── helper: pot silhouette path ───────────────────────────────────────────────
// cx, base_y, scale → SVG path string (centered at cx, base at by)
const potPath = (cx: number, by: number, sc: number, variant: number): string => {
  const v = variant % 4;
  if (v === 0) {
    // round jug
    const w = 22 * sc, h = 36 * sc, nw = 8 * sc;
    return `M${cx - nw / 2},${by - h} Q${cx - w},${by - h * 0.5} ${cx - w},${by - h * 0.2} Q${cx - w},${by} ${cx},${by} Q${cx + w},${by} ${cx + w},${by - h * 0.2} Q${cx + w},${by - h * 0.5} ${cx + nw / 2},${by - h} Z`;
  } else if (v === 1) {
    // tall vase
    const w = 16 * sc, h = 44 * sc, bw = 18 * sc, nw = 7 * sc;
    return `M${cx - nw / 2},${by - h} Q${cx - w * 1.1},${by - h * 0.6} ${cx - bw},${by - h * 0.15} L${cx - bw},${by} L${cx + bw},${by} L${cx + bw},${by - h * 0.15} Q${cx + w * 1.1},${by - h * 0.6} ${cx + nw / 2},${by - h} Z`;
  } else if (v === 2) {
    // squat bowl
    const w = 26 * sc, h = 20 * sc;
    return `M${cx - w},${by} Q${cx - w - 4 * sc},${by - h * 0.6} ${cx},${by - h} Q${cx + w + 4 * sc},${by - h * 0.6} ${cx + w},${by} Z`;
  } else {
    // handled mug
    const w = 18 * sc, h = 30 * sc;
    return `M${cx - w / 2},${by} L${cx - w / 2},${by - h} Q${cx},${by - h - 6 * sc} ${cx + w / 2},${by - h} L${cx + w / 2},${by} Z`;
  }
};

// ── component ─────────────────────────────────────────────────────────────────
export function PotteryKiln() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVis(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  // ── animation values ──
  const wheelAngle  = (phase * 140) % 360;
  const flywheelAng = (phase * 110) % 360;
  const treadAngle  = Math.sin(phase * 2.2) * 18;
  // potter arm: left hand shapes clay (circles), right hand stabilises
  const armLAng = Math.sin(phase * 2.2) * 20 - 10;   // elbow angle
  // clay lump height on wheel (rises then spreads)
  const clayH   = 28 + Math.sin(phase * 2.2) * 8;
  const clayW   = 18 - Math.sin(phase * 2.2) * 4;
  // smoke
  const smokeOp  = 0.55 + Math.sin(phase * 0.8) * 0.2;
  // flames
  const ff       = Math.sin(phase * 4.6);
  const fs       = Math.cos(phase * 3.1);
  // kiln glow pulse
  const glowR    = 0.55 + Math.sin(phase * 1.8) * 0.2;

  const FBASE_Y = KBASE - 2; // base of firebox flames

  const flamePath = (hw: number, fh: number, sw: number): string => {
    const bl = KCX - hw;
    const br = KCX + hw;
    return `M${bl},${FBASE_Y} Q${KCX + sw - hw * 0.4},${FBASE_Y - fh * 0.5} ${KCX + sw},${FBASE_Y - fh} Q${KCX + sw + hw * 0.4},${FBASE_Y - fh * 0.5} ${br},${FBASE_Y} Z`;
  };

  return (
    <div
      ref={ref}
      style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#1a120a" }}
      className="w-full overflow-hidden"
      aria-label="Colonial pottery kiln and potter's workshop"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          {/* sky gradient */}
          <linearGradient id="pk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a120a" />
            <stop offset="42%" stopColor="#3a2010" />
            <stop offset="72%" stopColor="#5a3218" />
            <stop offset="100%" stopColor="#7a4820" />
          </linearGradient>
          {/* kiln brick fill */}
          <linearGradient id="pk-kiln" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a3c18" />
            <stop offset="50%" stopColor="#9a5028" />
            <stop offset="100%" stopColor="#6a3010" />
          </linearGradient>
          {/* kiln interior glow */}
          <radialGradient id="pk-glow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#ff9020" stopOpacity={glowR} />
            <stop offset="100%" stopColor="#ff9020" stopOpacity="0" />
          </radialGradient>
          {/* floor */}
          <linearGradient id="pk-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a18" />
            <stop offset="100%" stopColor="#2a1a0c" />
          </linearGradient>
          {/* flame clip */}
          <clipPath id="pk-fclip">
            <rect x={KCX - KFIRE_W} y={KFIRE_Y - KFIRE_H} width={KFIRE_W * 2} height={KFIRE_H + 4} />
          </clipPath>
        </defs>

        {/* ── sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#pk-sky)" />

        {/* ── ground/floor ── */}
        <rect x="0" y={HZ} width={W} height={H - HZ} fill="url(#pk-floor)" />
        <rect x="0" y={GY} width={W} height={H - GY} fill="#1e1208" />

        {/* ── distant kiln yard fence ── */}
        {[880, 940, 1000, 1060, 1120, 1180].map((fx, fi) => (
          <g key={fi}>
            <line x1={fx} y1={HZ + 8} x2={fx} y2={HZ + 36} stroke="#3a2810" strokeWidth="3" />
            <line x1={fx} y1={HZ + 14} x2={(fx + ([880, 940, 1000, 1060, 1120, 1180][fi + 1] ?? fx + 60))} y2={HZ + 14} stroke="#3a2810" strokeWidth="2" />
            <line x1={fx} y1={HZ + 26} x2={(fx + ([880, 940, 1000, 1060, 1120, 1180][fi + 1] ?? fx + 60))} y2={HZ + 26} stroke="#3a2810" strokeWidth="2" />
          </g>
        ))}

        {/* ── back wall (mud brick) ── */}
        <rect x="0" y={HZ - 10} width={W} height={GY - HZ + 10} fill="#2a1c0e" />
        {/* brick courses on back wall */}
        {[0, 1, 2, 3, 4].map(row => {
          const ry = HZ - 2 + row * 28;
          return (
            <g key={row}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(col => {
                const rx = col * 118 + (row % 2 === 0 ? 0 : 59);
                return <rect key={col} x={rx} y={ry} width="112" height="24" rx="1" fill="none" stroke="#3a2810" strokeWidth="0.8" opacity="0.5" />;
              })}
            </g>
          );
        })}

        {/* ── shelf unit (back wall left) ── */}
        {/* shelf uprights */}
        <rect x={SHF_X}           y={GY - 270} width="8" height={270} fill="#5a3c1c" />
        <rect x={SHF_X + SHF_W}   y={GY - 270} width="8" height={270} fill="#4a3018" />
        <rect x={SHF_X + SHF_W / 2 - 4} y={GY - 270} width="8" height={270} fill="#4a3018" />
        {/* shelf boards */}
        {SHF_YS.map((sy, si) => (
          <rect key={si} x={SHF_X - 6} y={sy - 8} width={SHF_W + 12} height="10" rx="1" fill="#6a4820" />
        ))}
        {/* pots on shelves */}
        {SHELF_POTS.map(([px, sy, sc], pi) => (
          <path
            key={pi}
            d={potPath(px, sy - 2, sc, pi)}
            fill={["#a06030", "#c07840", "#884820", "#b86838", "#986030"][pi % 5] ?? "#a06030"}
            stroke="#5a3010"
            strokeWidth="0.8"
          />
        ))}

        {/* ── potter's wheel ── */}
        {/* wheel stand */}
        <rect x={WCX - 12} y={WCY + WTH} width="24" height={GY - WCY - WTH} fill="#4a3010" />
        {/* flywheel axle */}
        <rect x={WCX - 6} y={FLY_Y - WTH} width="12" height={WTH * 2 + 12} fill="#3a2808" />
        {/* flywheel (ellipse, angled) */}
        <ellipse cx={WCX} cy={FLY_Y} rx={FLY_R} ry={FLY_R * 0.32} fill="#6a4010" stroke="#4a2c08" strokeWidth="2" />
        {/* wheel top surface (spinning) */}
        <g transform={`rotate(${wheelAngle}, ${WCX}, ${WCY})`}>
          <ellipse cx={WCX} cy={WCY} rx={WR} ry={WR * 0.28} fill="#7a4c18" stroke="#5a3410" strokeWidth="1.5" />
          <line x1={WCX - WR + 4} y1={WCY} x2={WCX + WR - 4} y2={WCY} stroke="#5a3410" strokeWidth="1" opacity="0.7" />
          <line x1={WCX} y1={WCY - WR * 0.22} x2={WCX} y2={WCY + WR * 0.22} stroke="#5a3410" strokeWidth="1" opacity="0.7" />
        </g>
        {/* wheel rim */}
        <ellipse cx={WCX} cy={WCY} rx={WR} ry={WR * 0.28} fill="none" stroke="#8a5c28" strokeWidth="3" />
        {/* clay lump on wheel */}
        <ellipse
          cx={WCX}
          cy={WCY - clayH * 0.14}
          rx={clayW}
          ry={clayH * 0.28}
          fill="#b07840"
          stroke="#8a5830"
          strokeWidth="1"
        />
        {/* clay spiral lines */}
        <ellipse cx={WCX} cy={WCY - 4} rx={clayW * 0.75} ry={3} fill="none" stroke="#8a5830" strokeWidth="0.8" opacity="0.6" />
        <ellipse cx={WCX} cy={WCY - 10} rx={clayW * 0.55} ry={2.5} fill="none" stroke="#8a5830" strokeWidth="0.7" opacity="0.5" />

        {/* foot treadle */}
        <g transform={`rotate(${treadAngle}, ${TREAD_X}, ${TREAD_Y})`}>
          <rect x={TREAD_X - 28} y={TREAD_Y - 4} width="56" height="10" rx="3" fill="#5a3810" stroke="#3a2808" strokeWidth="1.5" />
        </g>
        {/* treadle connecting rod */}
        <line
          x1={TREAD_X}
          y1={TREAD_Y - 4 + Math.sin(treadAngle * Math.PI / 180) * 18}
          x2={WCX}
          y2={FLY_Y}
          stroke="#3a2808"
          strokeWidth="2"
        />

        {/* ── potter (seated, side view) ── */}
        {/* stool */}
        <rect x={POTX - 18} y={POTY - 44} width="36" height="8" rx="2" fill="#5a3810" />
        <line x1={POTX - 14} y1={POTY - 36} x2={POTX - 18} y2={POTY} stroke="#4a2c08" strokeWidth="3" />
        <line x1={POTX + 14} y1={POTY - 36} x2={POTX + 18} y2={POTY} stroke="#4a2c08" strokeWidth="3" />
        {/* legs */}
        <line x1={POTX - 10} y1={POTY - 44} x2={POTX - 26} y2={POTY} stroke="#4a3020" strokeWidth="5" strokeLinecap="round" />
        <line x1={POTX + 6}  y1={POTY - 44} x2={POTX + 12} y2={POTY} stroke="#4a3020" strokeWidth="5" strokeLinecap="round" />
        {/* foot on treadle */}
        <ellipse cx={TREAD_X - 10} cy={TREAD_Y + 4 + Math.sin(treadAngle * Math.PI / 180) * 10} rx="9" ry="5" fill="#4a3020" />
        {/* torso */}
        <rect x={POTX - 16} y={POTY - 100} width="32" height="58" rx="6" fill="#4878a0" />
        {/* apron */}
        <rect x={POTX - 14} y={POTY - 96} width="28" height="52" rx="4" fill="#c4a060" opacity="0.85" />
        {/* head */}
        <ellipse cx={POTX + 8} cy={POTY - 116} rx="14" ry="16" fill="#c0896a" />
        {/* hair */}
        <ellipse cx={POTX + 8} cy={POTY - 128} rx="14" ry="8" fill="#3a2010" />
        {/* right arm (near wheel) */}
        <g transform={`rotate(${armLAng}, ${POTX + 16}, ${POTY - 90})`}>
          <line x1={POTX + 16} y1={POTY - 90} x2={WCX - 8} y2={WCY - clayH * 0.28 + 2} stroke="#c0896a" strokeWidth="6" strokeLinecap="round" />
        </g>
        {/* left arm */}
        <line x1={POTX - 16} y1={POTY - 88} x2={WCX + 8} y2={WCY - clayH * 0.28} stroke="#c0896a" strokeWidth="6" strokeLinecap="round" />

        {/* ── floor drying pots ── */}
        {FLOOR_POTS.map(([px, py, sc], pi) => (
          <path key={pi} d={potPath(px, py, sc, (pi + 2) % 4)} fill="#b06838" stroke="#7a4018" strokeWidth="1" />
        ))}

        {/* ── kiln structure ── */}
        {/* kiln glow behind */}
        <ellipse cx={KCX} cy={KBASE - 60} rx={KBOT_W * 0.8} ry={120} fill="url(#pk-glow)" />

        {/* kiln body shape — bottle form */}
        <path
          d={`M${KCX - KBOT_W},${KBOT_Y} Q${KCX - KBOT_W - 12},${KMID_Y + 60} ${KCX - KMID_W},${KMID_Y} Q${KCX - KTOP_W - 4},${KMID_Y - 60} ${KCX - KTOP_W},${KTOP_Y} L${KCX + KTOP_W},${KTOP_Y} Q${KCX + KTOP_W + 4},${KMID_Y - 60} ${KCX + KMID_W},${KMID_Y} Q${KCX + KBOT_W + 12},${KMID_Y + 60} ${KCX + KBOT_W},${KBOT_Y} Z`}
          fill="url(#pk-kiln)"
          stroke="#5a2c10"
          strokeWidth="2"
        />

        {/* brick course lines on kiln */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(row => {
          const ry = KBASE - 24 - row * 26;
          const t = Math.max(0, Math.min(1, (KBASE - ry - 0) / (KBASE - KTOP_Y)));
          const hw = KBOT_W * (1 - t) * (1 - t) + KMID_W * 2 * t * (1 - t) + KTOP_W * t * t;
          return (
            <line key={row}
              x1={KCX - hw - 8} y1={ry} x2={KCX + hw + 8} y2={ry}
              stroke="#5a2c10" strokeWidth="1.2" opacity="0.5"
            />
          );
        })}

        {/* vertical mortar lines on kiln */}
        {[-3, -1, 1, 3].map((xf, xi) => (
          <line key={xi}
            x1={KCX + xf * 28} y1={KTOP_Y} x2={KCX + xf * 28} y2={KBASE}
            stroke="#5a2c10" strokeWidth="0.8" opacity="0.35"
          />
        ))}

        {/* firebox opening arch */}
        <path
          d={`M${KCX - KFIRE_W},${KFIRE_Y} L${KCX - KFIRE_W},${KFIRE_Y - KFIRE_H * 0.55} Q${KCX},${KFIRE_Y - KFIRE_H} ${KCX + KFIRE_W},${KFIRE_Y - KFIRE_H * 0.55} L${KCX + KFIRE_W},${KFIRE_Y} Z`}
          fill="#0e0704"
          stroke="#3a1c08"
          strokeWidth="1.5"
        />

        {/* flames inside firebox (clipped) */}
        <g clipPath="url(#pk-fclip)">
          {FLAMES.map(([hw, fh, sw, ph], fi) => {
            const fhAnim = fh + ff * (4 + fi * 2.5);
            const fsAnim = sw + fs * (2 + fi * 1.2);
            const cols = ["#ff8c00", "#ffa020", "#ffcc40", "#ffe060"];
            return (
              <path
                key={fi}
                d={flamePath(hw, fhAnim, fsAnim)}
                fill={cols[fi] ?? "#ff8c00"}
                opacity={0.85 + fi * 0.04}
              />
            );
          })}
        </g>

        {/* embers rising from firebox */}
        {vis && EMBERS.map(([xoff, eph, spd], ei) => {
          const t = ((phase * spd + eph) % 2.8) / 2.8;
          const ex = KCX + xoff + Math.sin(t * Math.PI * 2.5) * 8;
          const ey = KFIRE_Y - t * 70;
          const eop = t < 0.2 ? t * 5 : t > 0.8 ? (1 - t) * 5 : 1;
          return (
            <circle key={ei} cx={ex} cy={ey} r={1.8} fill="#ffaa00" opacity={eop * 0.9} />
          );
        })}

        {/* kiln top cap */}
        <ellipse cx={KCX} cy={KTOP_Y} rx={KTOP_W + 8} ry="7" fill="#6a3818" stroke="#4a2810" strokeWidth="1.5" />
        <ellipse cx={KCX} cy={KTOP_Y - 4} rx={KTOP_W + 2} ry="5" fill="#3a1c08" />

        {/* ── smoke from kiln top ── */}
        {vis && SMOKES.map(([sx, sy, xd, sph], si) => {
          const t = ((phase * 0.22 + sph) % 1.0);
          const ssy = sy - t * 40;
          const ssx = sx + xd * t;
          const sr = 12 + t * 18;
          const sop = (1 - t) * smokeOp;
          return (
            <circle key={si} cx={ssx} cy={ssy} r={sr} fill="#8a6040" opacity={sop * 0.5} />
          );
        })}

        {/* ── wood pile ── */}
        {LOGS.map(([lx, ly, ang, len], li) => {
          const aRad = ang * Math.PI / 180;
          const dx = Math.cos(aRad) * len / 2;
          const dy = Math.sin(aRad) * len / 2;
          // ring end circles
          return (
            <g key={li}>
              <line x1={lx - dx} y1={ly - dy} x2={lx + dx} y2={ly + dy} stroke="#6a4018" strokeWidth="14" strokeLinecap="round" />
              <line x1={lx - dx} y1={ly - dy} x2={lx + dx} y2={ly + dy} stroke="#4a2c0e" strokeWidth="10" strokeLinecap="round" />
              <ellipse cx={lx + dx} cy={ly + dy} rx="7" ry="4.5" fill="#7a4c20" stroke="#4a2c0e" strokeWidth="1" />
              <ellipse cx={lx + dx} cy={ly + dy} rx="4" ry="2.5" fill="#5a3010" />
              <ellipse cx={lx + dx} cy={ly + dy} rx="2" ry="1.2" fill="#3a1c08" />
            </g>
          );
        })}
        <rect x={WP_X - 48} y={WP_Y - 36} width="96" height="8" rx="2" fill="#4a2c10" opacity="0.5" />

        {/* ── kiln master standing (right of kiln) ── */}
        {(() => {
          const mx = KCX + KBOT_W + 52;
          const my = GY;
          // clipboard / notes angle
          const clipAng = Math.sin(phase * 1.1) * 8;
          return (
            <g>
              {/* legs */}
              <line x1={mx - 6} y1={my - 56} x2={mx - 8} y2={my} stroke="#2a1c6a" strokeWidth="8" strokeLinecap="round" />
              <line x1={mx + 6} y1={my - 56} x2={mx + 4} y2={my} stroke="#2a1c6a" strokeWidth="8" strokeLinecap="round" />
              {/* boots */}
              <ellipse cx={mx - 8} cy={my} rx="9" ry="5" fill="#1a1208" />
              <ellipse cx={mx + 4} cy={my} rx="9" ry="5" fill="#1a1208" />
              {/* body */}
              <rect x={mx - 18} y={my - 110} width="36" height="56" rx="5" fill="#8a2818" />
              {/* apron (leather) */}
              <rect x={mx - 14} y={my - 106} width="28" height="52} " rx="3" fill="#7a5018" opacity="0.9" />
              {/* head */}
              <ellipse cx={mx} cy={my - 126} rx="14" ry="16" fill="#b87850" />
              {/* cap */}
              <ellipse cx={mx} cy={my - 138} rx="15" ry="6" fill="#2a1c10" />
              <rect x={mx - 12} y={my - 152} width="24" height="18" rx="3" fill="#2a1c10" />
              {/* arm with clipboard */}
              <line x1={mx + 18} y1={my - 98} x2={mx + 34} y2={my - 76} stroke="#b87850" strokeWidth="6" strokeLinecap="round" />
              {/* clipboard */}
              <g transform={`rotate(${clipAng}, ${mx + 34}, ${my - 76})`}>
                <rect x={mx + 26} y={my - 94} width="22" height="30" rx="2" fill="#d4b870" stroke="#8a6030" strokeWidth="1" />
                <rect x={mx + 30} y={my - 90} width="14" height="2" rx="1" fill="#3a2810" />
                <rect x={mx + 30} y={my - 86} width="10" height="2" rx="1" fill="#3a2810" />
                <rect x={mx + 30} y={my - 82} width="12" height="2" rx="1" fill="#3a2810" />
                <rect x={mx + 34} y={my - 98} width="10" height="5" rx="1.5" fill="#7a4820" />
              </g>
            </g>
          );
        })()}

        {/* ── flying birds (distant) ── */}
        {BIRDS.map(([bx, by, bph], bi) => {
          const flap = Math.sin(phase * 2.8 + bph) * 5;
          return (
            <g key={bi}>
              <path
                d={`M${bx},${by} Q${bx - 8},${by - flap} ${bx - 16},${by} Q${bx - 8},${by + flap * 0.5} ${bx},${by}`}
                fill="none" stroke="#4a3420" strokeWidth="1.5"
              />
              <path
                d={`M${bx},${by} Q${bx + 8},${by - flap} ${bx + 16},${by} Q${bx + 8},${by + flap * 0.5} ${bx},${by}`}
                fill="none" stroke="#4a3420" strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* ── window in back wall (glowing orange from kiln) ── */}
        <rect x={KCX - 38} y={HZ + 20} width="76" height="52" rx="4" fill="#0e0806" stroke="#4a2c10" strokeWidth="2" />
        <rect x={KCX - 34} y={HZ + 24} width="68" height="44" rx="2" fill="#ff8800" opacity={0.15 + glowR * 0.2} />
        <line x1={KCX} y1={HZ + 20} x2={KCX} y2={HZ + 72} stroke="#4a2c10" strokeWidth="2" />
        <line x1={KCX - 38} y1={HZ + 46} x2={KCX + 38} y2={HZ + 46} stroke="#4a2c10" strokeWidth="2" />

        {/* ── ground shadow under kiln ── */}
        <ellipse cx={KCX} cy={GY + 8} rx={KBOT_W + 20} ry="14" fill="#0e0806" opacity="0.6" />

        {/* ── caption ── */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', serif"
          fontSize="13"
          letterSpacing="3"
          fill="#7a5028"
          opacity="0.9"
        >
          SHREWSBURY POTTERY · COLONIAL BOTTLE KILN · EST. 1748
        </text>
      </svg>
    </div>
  );
}
