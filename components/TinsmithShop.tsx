"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY   = 462;
const CEIL = 56;

// ── forge ─────────────────────────────────────────────────────────────────────
const FRG_CX = 148;
const FRG_X1 = 74;
const FRG_X2 = 222;
const FRG_BOT = GY - 14;   // 448
const FRG_TOP = GY - 112;  // 350

// firebox opening inside forge
const FOX = FRG_CX - 30;
const FOW = 60;
const FOH = 44;
const FOB = FRG_BOT - 8;   // 440

// ── worktable ─────────────────────────────────────────────────────────────────
const TBL_X1 = 288;
const TBL_X2 = 712;
const TBL_Y  = GY - 88;    // 374  (table surface)

// ── anvil + tinsmith ──────────────────────────────────────────────────────────
const ANV_CX = TBL_X1 + 126;  // 414
const ANV_Y  = TBL_Y;          // on table

const TS_X   = ANV_CX + 22;   // 436
const TS_Y   = GY;
const SH_X   = TS_X + 18;     // 454 — right shoulder
const SH_Y   = TS_Y - 112;    // 350

// ── shelf unit ────────────────────────────────────────────────────────────────
const SHF_X1 = 800;
const SHF_X2 = 1240;
const SHF_YS = [GY - 294, GY - 220, GY - 146, GY - 72] as const;

// ── window ────────────────────────────────────────────────────────────────────
const WIN_X = 1036;
const WIN_Y = CEIL + 70;
const WIN_W = 162;
const WIN_H = 184;

// ── ceiling beam x positions ──────────────────────────────────────────────────
const BEAMS = [190, 390, 590, 790, 990] as const;

// ── forge flame data ──────────────────────────────────────────────────────────
type FL4 = [number, number, number, number]; // hw, fh, sw, phase
const FLAMES: FL4[] = [
  [24, 40, -2, 0.0],[17, 52, 3, 0.45],[11, 60, -4, 0.9],[7, 46, 2, 1.35],
];

// ── forge embers ─────────────────────────────────────────────────────────────
type EB3 = [number, number, number]; // xOff, phase, speed
const EMBERS: EB3[] = [];
for (let i = 0; i < 12; i++) {
  EMBERS.push([(i * 41) % 56 - 28, i * 0.38, 0.5 + (i % 4) * 0.28]);
}

// ── hammer sparks ─────────────────────────────────────────────────────────────
type SK2 = [number, number]; // angle (°), speed
const SPARKS: SK2[] = [
  [-15, 1.0],[20, 1.25],[52, 0.9],[80, 1.1],
  [-48, 0.85],[112, 0.75],[148, 1.0],[-82, 0.95],
];

// ── tin items on shelves ──────────────────────────────────────────────────────
// type: 0=lantern, 1=coffeepot, 2=candle mold, 3=cup, 4=plate, 5=template
type TIN3 = [number, number, number]; // x, shelfRow, type
const TIN_ITEMS: TIN3[] = [
  [SHF_X1+22, 0,0],[SHF_X1+78, 0,1],[SHF_X1+136,0,2],[SHF_X1+180,0,0],[SHF_X1+236,0,3],
  [SHF_X1+286,0,4],[SHF_X1+338,0,5],[SHF_X1+392,0,0],
  [SHF_X1+20, 1,3],[SHF_X1+70, 1,0],[SHF_X1+124,1,2],[SHF_X1+178,1,1],[SHF_X1+232,1,3],
  [SHF_X1+284,1,0],[SHF_X1+338,1,4],[SHF_X1+390,1,5],
  [SHF_X1+24, 2,1],[SHF_X1+80, 2,0],[SHF_X1+132,2,3],[SHF_X1+184,2,2],[SHF_X1+238,2,0],
  [SHF_X1+18, 3,4],[SHF_X1+70, 3,3],[SHF_X1+124,3,0],[SHF_X1+178,3,5],
];

// ── tin scrap on floor ────────────────────────────────────────────────────────
type SC3 = [number, number, number]; // x, w, angle
const SCRAPS: SC3[] = [];
for (let i = 0; i < 12; i++) {
  SCRAPS.push([
    TBL_X1 + 20 + (i * 37) % (TBL_X2 - TBL_X1 - 40),
    14 + (i * 5) % 22,
    (i * 23) % 40 - 20,
  ]);
}

// ── tool pegs on back wall ────────────────────────────────────────────────────
const PEG_XS = [SHF_X1 + 46, SHF_X1 + 108, SHF_X1 + 172, SHF_X1 + 234, SHF_X1 + 298, SHF_X1 + 360] as const;

// flame path helper (fires from forge opening)
const FORGE_FLAME_BASE = FOB;
const flamePath = (hw: number, fh: number, sw: number): string => {
  const bl = FRG_CX - hw, br = FRG_CX + hw;
  return `M${bl},${FORGE_FLAME_BASE} Q${FRG_CX + sw - hw * 0.4},${FORGE_FLAME_BASE - fh * 0.5} ${FRG_CX + sw},${FORGE_FLAME_BASE - fh} Q${FRG_CX + sw + hw * 0.4},${FORGE_FLAME_BASE - fh * 0.5} ${br},${FORGE_FLAME_BASE} Z`;
};

export function TinsmithShop() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVis(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  // hammer: -80° (raised) → 128° (strike) via cosine
  const hammerAng  = 24 - Math.cos(phase * 2.8) * 104;   // -80° to 128°
  const hRad       = hammerAng * Math.PI / 180;
  const elbX       = SH_X + Math.cos(hRad) * 46;
  const elbY       = SH_Y + Math.sin(hRad) * 46;
  const fRad       = hRad + 0.55;                           // forearm angle
  const hhX        = elbX + Math.cos(fRad) * 40;            // hammer handle tip
  const hhY        = elbY + Math.sin(fRad) * 40;
  const perpX      = -Math.sin(fRad) * 13;
  const perpY      = Math.cos(fRad) * 13;
  const sparksOn   = hammerAng > 100;                        // near bottom of stroke

  const ff         = Math.sin(phase * 4.8);
  const fs         = Math.cos(phase * 3.2);
  const glowR      = 0.55 + Math.sin(phase * 2.1) * 0.22;
  const lanternGlw = 0.5 + Math.sin(phase * 1.8 + 0.6) * 0.25;

  return (
    <div ref={ref}
      style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#1a1008" }}
      className="w-full overflow-hidden"
      aria-label="Colonial tinsmith shop — Shrewsbury Est. 1764"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <linearGradient id="ts-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1c0c" />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          <linearGradient id="ts-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2c14" />
            <stop offset="100%" stopColor="#2a1c0c" />
          </linearGradient>
          <radialGradient id="ts-forge" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#ff8010" stopOpacity={glowR} />
            <stop offset="100%" stopColor="#ff8010" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ts-winlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a8c8f0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a8c8f0" stopOpacity="0"    />
          </radialGradient>
          <clipPath id="ts-forgeclip">
            <rect x={FOX} y={FOB - FOH} width={FOW} height={FOH + 4} />
          </clipPath>
        </defs>

        {/* ── back wall (plank boards) ── */}
        <rect x="0" y={CEIL} width={W} height={GY - CEIL} fill="url(#ts-wall)" />
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <line key={i} x1={i * 118} y1={CEIL} x2={i * 118} y2={GY} stroke="#2e2010" strokeWidth="2" opacity="0.55" />
        ))}
        {/* horizontal board joints */}
        {[120, 200, 280, 360].map((hy, hi) => (
          <line key={hi} x1="0" y1={hy} x2={W} y2={hy} stroke="#2e2010" strokeWidth="1" opacity="0.3" />
        ))}

        {/* ── floor ── */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#ts-floor)" />
        {[0, 128, 256, 384, 512, 640, 768, 896, 1024, 1152].map((fx, fi) => (
          <line key={fi} x1={fx} y1={GY} x2={fx} y2={H} stroke="#2a1c08" strokeWidth="2" opacity="0.5" />
        ))}

        {/* ── ceiling beams ── */}
        <rect x="0" y={CEIL - 8} width={W} height="20" fill="#1e1408" />
        {BEAMS.map((bx, bi) => (
          <g key={bi}>
            <rect x={bx - 14} y={CEIL} width="28" height={GY - CEIL} fill="#241808" opacity="0.5" />
            <rect x={bx - 14} y={CEIL} width="28" height="12" fill="#2e2010" />
          </g>
        ))}

        {/* ── forge glow aura ── */}
        <ellipse cx={FRG_CX} cy={FRG_TOP + 20} rx="140" ry="180"
          fill="url(#ts-forge)" opacity={glowR * 0.8} />

        {/* ── forge structure ── */}
        {/* brick body */}
        <path d={`M${FRG_X1},${FRG_BOT} L${FRG_X1 - 10},${FRG_TOP} L${FRG_X2 + 10},${FRG_TOP} L${FRG_X2},${FRG_BOT} Z`}
          fill="#7a3c18" stroke="#5a2c10" strokeWidth="2" />
        {/* brick course lines */}
        {[0,1,2,3,4,5].map(row => {
          const ry = FRG_BOT - 16 - row * 18;
          return <line key={row} x1={FRG_X1 - 6} y1={ry} x2={FRG_X2 + 6} y2={ry} stroke="#5a2c10" strokeWidth="1.2" opacity="0.5" />;
        })}
        {/* forge top / chimney hood */}
        <path d={`M${FRG_X1 - 14},${FRG_TOP} L${FRG_CX - 18},${FRG_TOP - 56} L${FRG_CX + 18},${FRG_TOP - 56} L${FRG_X2 + 14},${FRG_TOP}`}
          fill="#5a2c10" stroke="#3a1c08" strokeWidth="2" />
        <rect x={FRG_CX - 18} y={CEIL} width="36" height={FRG_TOP - 56 - CEIL} fill="#3a1c08" stroke="#2a1408" strokeWidth="1.5" />

        {/* firebox arch opening */}
        <path d={`M${FOX},${FOB} L${FOX},${FOB - FOH * 0.55} Q${FRG_CX},${FOB - FOH} ${FOX + FOW},${FOB - FOH * 0.55} L${FOX + FOW},${FOB} Z`}
          fill="#0e0804" stroke="#3a1c08" strokeWidth="1.5" />

        {/* forge flames (clipped to firebox) */}
        <g clipPath="url(#ts-forgeclip)">
          {FLAMES.map(([hw, fh, sw, ph], fi) => {
            const fhA = fh + ff * (3 + fi * 2);
            const fsA = sw + fs * (1.5 + fi);
            const cols = ["#ff8800","#ffaa18","#ffcc40","#ffe868"] as const;
            return (
              <path key={fi} d={flamePath(hw, fhA, fsA)}
                fill={cols[fi] ?? "#ff8800"} opacity={0.82 + fi * 0.04} />
            );
          })}
        </g>

        {/* forge embers */}
        {vis && EMBERS.map(([xo, eph, sp], ei) => {
          const t   = ((phase * sp + eph) % 2.2) / 2.2;
          const ex  = FRG_CX + xo + Math.sin(t * Math.PI * 2.4) * 8;
          const ey  = FOB - t * 80;
          const eop = t < 0.18 ? t * 5.5 : t > 0.8 ? (1 - t) * 5 : 1;
          return <circle key={ei} cx={ex} cy={ey} r="1.8" fill="#ffaa00" opacity={eop * 0.88} />;
        })}

        {/* forge grate (coal bed) */}
        <rect x={FOX + 4} y={FOB - 8} width={FOW - 8} height="10" rx="1" fill="#1a0c06" />
        {[0,1,2,3,4].map(ci => (
          <ellipse key={ci} cx={FOX + 8 + ci * 11} cy={FOB - 4} rx="4" ry="3"
            fill={ci % 2 === 0 ? "#e04810" : "#c03008"} opacity="0.7" />
        ))}

        {/* ── worktable ── */}
        {/* legs */}
        {[TBL_X1 + 16, TBL_X1 + 86, TBL_X2 - 86, TBL_X2 - 16].map((lx, li) => (
          <rect key={li} x={lx - 6} y={TBL_Y + 18} width="12" height={GY - TBL_Y - 18} fill="#4a3010" />
        ))}
        {/* shelf under table */}
        <rect x={TBL_X1 + 8} y={GY - 44} width={TBL_X2 - TBL_X1 - 16} height="8" rx="1" fill="#5a3c14" />
        {/* tabletop */}
        <rect x={TBL_X1} y={TBL_Y} width={TBL_X2 - TBL_X1} height="18" rx="2" fill="#6a4820" stroke="#4a3010" strokeWidth="1.5" />
        {/* plank lines on table */}
        {[TBL_X1 + 80, TBL_X1 + 160, TBL_X1 + 240, TBL_X2 - 80].map((px, pi) => (
          <line key={pi} x1={px} y1={TBL_Y} x2={px} y2={TBL_Y + 18} stroke="#4a3010" strokeWidth="1" opacity="0.5" />
        ))}
        {/* work in progress: sheet tin on table */}
        <rect x={TBL_X1 + 220} y={TBL_Y - 3} width="128" height="6" rx="1" fill="#b8c8d4" stroke="#8090a0" strokeWidth="1" />
        <rect x={TBL_X1 + 348} y={TBL_Y - 5} width="96" height="8" rx="1" fill="#a8b8c4" opacity="0.8" />

        {/* ── anvil block ── */}
        {/* wooden block */}
        <rect x={ANV_CX - 20} y={TBL_Y - 32} width="40" height="32" rx="2" fill="#3a2408" stroke="#2a1808" strokeWidth="1.5" />
        {/* anvil iron body */}
        <path d={`M${ANV_CX - 22},${TBL_Y - 32} L${ANV_CX - 18},${TBL_Y - 54} L${ANV_CX + 18},${TBL_Y - 54} L${ANV_CX + 22},${TBL_Y - 32} Z`}
          fill="#6a7080" stroke="#404858" strokeWidth="1.5" />
        {/* anvil horn */}
        <path d={`M${ANV_CX - 22},${TBL_Y - 44} Q${ANV_CX - 48},${TBL_Y - 48} ${ANV_CX - 54},${TBL_Y - 38}`}
          fill="none" stroke="#6a7080" strokeWidth="8" strokeLinecap="round" />
        {/* anvil face (flat top) */}
        <rect x={ANV_CX - 20} y={TBL_Y - 56} width="40" height="6" rx="1" fill="#7a8090" />
        {/* anvil strike marks */}
        <ellipse cx={ANV_CX - 2} cy={TBL_Y - 54} rx="8" ry="3" fill="#8090a0" opacity="0.6" />

        {/* ── tinsmith figure ── */}
        {(() => {
          const tx = TS_X, ty = TS_Y;
          // left arm (resting on table)
          const leftArmEndX = ANV_CX - 30;
          const leftArmEndY = TBL_Y - 2;
          return (
            <g>
              {/* legs */}
              <line x1={tx - 8} y1={ty - 56} x2={tx - 9}  y2={ty} stroke="#1a1840" strokeWidth="8" strokeLinecap="round" />
              <line x1={tx + 8} y1={ty - 56} x2={tx + 10} y2={ty} stroke="#1a1840" strokeWidth="8" strokeLinecap="round" />
              {/* body/torso */}
              <rect x={tx - 16} y={ty - 112} width="32" height="58" rx="5" fill="#8a2410" />
              {/* leather apron */}
              <path d={`M${tx - 14},${ty - 106} L${tx - 12},${ty - 44} L${tx + 12},${ty - 44} L${tx + 14},${ty - 106}`}
                fill="#6a4018" opacity="0.9" />
              {/* apron strings */}
              <line x1={tx - 14} y1={ty - 106} x2={tx - 8} y2={ty - 114} stroke="#7a5020" strokeWidth="2" />
              <line x1={tx + 14} y1={ty - 106} x2={tx + 8} y2={ty - 114} stroke="#7a5020" strokeWidth="2" />
              {/* left arm on table */}
              <line x1={tx - 16} y1={ty - 96} x2={leftArmEndX} y2={leftArmEndY} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              {/* right arm (hammer arm) — upper arm */}
              <line x1={SH_X} y1={SH_Y} x2={elbX} y2={elbY} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              {/* forearm */}
              <line x1={elbX} y1={elbY} x2={hhX} y2={hhY} stroke="#c09060" strokeWidth="6" strokeLinecap="round" />
              {/* hammer handle */}
              <line x1={hhX - perpX * 0.5} y1={hhY - perpY * 0.5}
                    x2={hhX + perpX * 2.5} y2={hhY + perpY * 2.5}
                    stroke="#8a5820" strokeWidth="5" strokeLinecap="round" />
              {/* hammer head */}
              <rect
                x={hhX + perpX * 1.5 - Math.cos(fRad) * 18}
                y={hhY + perpY * 1.5 - Math.sin(fRad) * 18}
                width="22" height="13" rx="2"
                fill="#7a8090" stroke="#505860" strokeWidth="1.5"
                transform={`rotate(${hammerAng + 90}, ${hhX + perpX * 1.5}, ${hhY + perpY * 1.5})`}
              />
              {/* head */}
              <ellipse cx={tx - 2} cy={ty - 128} rx="13" ry="15" fill="#c09060" />
              {/* working cap */}
              <ellipse cx={tx - 2} cy={ty - 142} rx="15" ry="5.5" fill="#5a3820" />
              <rect x={tx - 13} y={ty - 157} width="22" height="18" rx="3" fill="#5a3820" />
              {/* chin */}
              <ellipse cx={tx - 2} cy={ty - 115} rx="6" ry="4" fill="#b87850" />
            </g>
          );
        })()}

        {/* ── hammer sparks ── */}
        {vis && sparksOn && SPARKS.map(([sang, spd], si) => {
          const t   = ((phase * 3.8 + si * 0.18) % 0.9) / 0.9;
          const sRad = sang * Math.PI / 180;
          const sx  = ANV_CX + Math.cos(sRad) * t * 28 * spd;
          const sy2 = ANV_Y - 54 - Math.sin(sRad) * t * 28 * spd - t * t * 16;
          const sop = (1 - t) * 0.95;
          return <circle key={si} cx={sx} cy={sy2} r="2.2" fill="#ffcc20" opacity={sop} />;
        })}

        {/* ── tin scrap on floor ── */}
        {SCRAPS.map(([sx, sw2, sang], sci) => (
          <rect key={sci}
            x={sx} y={GY - 4} width={sw2} height={4 + (sci % 3) * 2} rx="1"
            fill="#a0b0bc" opacity="0.55"
            transform={`rotate(${sang}, ${sx + sw2 / 2}, ${GY - 2})`}
          />
        ))}

        {/* ── shelf unit ── */}
        {/* uprights */}
        <rect x={SHF_X1}          y={CEIL + 20} width="10" height={GY - CEIL - 20} fill="#4a3010" />
        <rect x={SHF_X2 - 10}     y={CEIL + 20} width="10" height={GY - CEIL - 20} fill="#4a3010" />
        <rect x={(SHF_X1 + SHF_X2) / 2 - 5} y={CEIL + 20} width="10" height={GY - CEIL - 20} fill="#3a2808" />
        {/* shelf boards */}
        {SHF_YS.map((sy, si) => (
          <rect key={si} x={SHF_X1 - 8} y={sy - 10} width={SHF_X2 - SHF_X1 + 16} height="10" rx="1" fill="#6a4820" />
        ))}

        {/* peg hooks on back wall above shelves */}
        {PEG_XS.map((px, pi) => (
          <g key={pi}>
            <circle cx={px} cy={CEIL + 42} r="5" fill="#8a6020" />
            <line x1={px} y1={CEIL + 42} x2={px} y2={CEIL + 60} stroke="#6a4818" strokeWidth="4" strokeLinecap="round" />
            {/* tin template hanging on peg */}
            {pi < 4 && (
              <g>
                <line x1={px} y1={CEIL + 60} x2={px} y2={CEIL + 90} stroke="#9a9090" strokeWidth="2" />
                <path d={pi % 2 === 0
                  ? `M${px - 12},${CEIL + 90} L${px},${CEIL + 68} L${px + 12},${CEIL + 90} Z`
                  : `M${px - 10},${CEIL + 72} L${px + 10},${CEIL + 72} L${px + 12},${CEIL + 92} L${px - 12},${CEIL + 92} Z`}
                  fill="#a8b8c4" stroke="#6880a0" strokeWidth="1.2" opacity="0.8" />
              </g>
            )}
          </g>
        ))}

        {/* ── tin items on shelves ── */}
        {TIN_ITEMS.map(([ix, iSh, iType], ii) => {
          const sy  = SHF_YS[iSh] ?? GY - 294;
          const tin = "#b0c0cc";
          const tinD = "#8090a0";
          const glw  = 0.4 + Math.sin(phase * 1.8 + ii * 0.4) * 0.18;
          return (
            <g key={ii}>
              {iType === 0 && (
                // lantern
                <g>
                  <rect x={ix - 8}  y={sy - 36} width="16" height="26" rx="2" fill={tin} stroke={tinD} strokeWidth="1" />
                  <rect x={ix - 10} y={sy - 10} width="20" height="4"  rx="1" fill={tinD} />
                  <rect x={ix - 10} y={sy - 40} width="20" height="4"  rx="1" fill={tinD} />
                  <path d={`M${ix - 4},${sy - 42} L${ix},${sy - 52} L${ix + 4},${sy - 42}`} fill={tinD} strokeWidth="1" />
                  {/* perforated dots */}
                  {[-3, 0, 3].map(dx => ([-4, -1].map((dy, di2) => (
                    <circle key={`${dx}-${di2}`} cx={ix + dx} cy={sy - 22 + dy * 6} r="1.2"
                      fill="#ff9820" opacity={glw} />
                  ))))}
                </g>
              )}
              {iType === 1 && (
                // coffee pot
                <g>
                  <path d={`M${ix - 9},${sy} L${ix - 11},${sy - 34} L${ix + 11},${sy - 34} L${ix + 9},${sy} Z`}
                    fill={tin} stroke={tinD} strokeWidth="1" />
                  {/* domed lid */}
                  <path d={`M${ix - 10},${sy - 34} Q${ix},${sy - 46} ${ix + 10},${sy - 34}`} fill={tinD} />
                  <circle cx={ix} cy={sy - 46} r="3" fill={tin} />
                  {/* spout */}
                  <path d={`M${ix - 11},${sy - 26} Q${ix - 28},${sy - 30} ${ix - 26},${sy - 18}`}
                    fill="none" stroke={tin} strokeWidth="5" strokeLinecap="round" />
                  {/* handle */}
                  <path d={`M${ix + 11},${sy - 28} Q${ix + 24},${sy - 22} ${ix + 11},${sy - 10}`}
                    fill="none" stroke={tinD} strokeWidth="3" />
                </g>
              )}
              {iType === 2 && (
                // candle molds (3 cylinders)
                <g>
                  {[-10, 0, 10].map((dx, di) => (
                    <g key={di}>
                      <rect x={ix + dx - 4} y={sy - 40} width="8" height="40" rx="2" fill={tin} stroke={tinD} strokeWidth="0.8" />
                      <ellipse cx={ix + dx} cy={sy - 40} rx="4" ry="2.5" fill={tinD} />
                    </g>
                  ))}
                </g>
              )}
              {iType === 3 && (
                // tin cup
                <path d={`M${ix - 9},${sy} L${ix - 7},${sy - 22} L${ix + 7},${sy - 22} L${ix + 9},${sy} Z`}
                  fill={tin} stroke={tinD} strokeWidth="1" />
              )}
              {iType === 4 && (
                // plate
                <ellipse cx={ix} cy={sy - 4} rx="16" ry="5.5" fill={tin} stroke={tinD} strokeWidth="1" />
              )}
              {iType === 5 && (
                // pattern template (flat shape on wall)
                <path d={`M${ix - 12},${sy - 2} L${ix},${sy - 18} L${ix + 12},${sy - 2} Z`}
                  fill={tin} stroke={tinD} strokeWidth="1" opacity="0.7" />
              )}
            </g>
          );
        })}

        {/* ── lantern glow on shelf items ── */}
        {[SHF_X1 + 22, SHF_X1 + 180, SHF_X1 + 70].map((lx, li) => {
          const lsy = SHF_YS[li] ?? GY - 294;
          return (
            <ellipse key={li} cx={lx} cy={lsy - 20} rx="22" ry="28"
              fill="#ff9820" opacity={lanternGlw * 0.18} />
          );
        })}

        {/* ── window with daylight shaft ── */}
        <rect x={WIN_X} y={WIN_Y} width={WIN_W} height={WIN_H} fill="#0e0c14" rx="4" />
        {/* window panes */}
        <rect x={WIN_X + 4} y={WIN_Y + 4} width={WIN_W - 8} height={WIN_H - 8} rx="2"
          fill="#88aacc" opacity="0.6" />
        <line x1={WIN_X + WIN_W / 2} y1={WIN_Y} x2={WIN_X + WIN_W / 2} y2={WIN_Y + WIN_H}
          stroke="#6a5030" strokeWidth="3" />
        <line x1={WIN_X} y1={WIN_Y + WIN_H / 2} x2={WIN_X + WIN_W} y2={WIN_Y + WIN_H / 2}
          stroke="#6a5030" strokeWidth="3" />
        {/* window frame */}
        <rect x={WIN_X} y={WIN_Y} width={WIN_W} height={WIN_H} fill="none"
          stroke="#7a5830" strokeWidth="6" rx="4" />
        {/* daylight shaft */}
        <path d={`M${WIN_X + 18},${WIN_Y + WIN_H} L${WIN_X + WIN_W - 18},${WIN_Y + WIN_H} L${WIN_X + WIN_W + 48},${GY} L${WIN_X - 48},${GY} Z`}
          fill="url(#ts-winlight)" opacity="0.22" />

        {/* ── ambient glow from forge on floor ── */}
        <ellipse cx={FRG_CX} cy={GY + 10} rx="160" ry="20" fill="#ff6010" opacity={glowR * 0.25} />

        {/* caption */}
        <text x={W / 2} y={H - 14} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="13" letterSpacing="3"
          fill="#8a6030" opacity="0.9">
          SHREWSBURY TINSMITH · J. HOWE &amp; SON · EST. 1764
        </text>
      </svg>
    </div>
  );
}
