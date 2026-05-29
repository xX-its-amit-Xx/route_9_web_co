"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY   = 462;
const CEIL  = 50;

// Evaporator arch dimensions
const AX   = 486;
const AW   = 320;
const ACX  = AX + AW / 2;      // 646
const ATOP = GY - 194;          // 268
const ABOT = GY - 24;           // 438

// Firebox opening
const FOW   = 90;
const FOH   = 72;
const FBASE = ABOT - 6;         // 432
const FOCX  = ACX;              // 646
const FOL   = FOCX - FOW / 2;  // 601
const FOR_  = FOCX + FOW / 2;  // 691

// Pan dimensions
const P1X = AX + 10;   // 496
const P2X = AX + 168;  // 654
const PW  = 148;
const PH  = 26;
const PY  = ATOP;

// Sugar maker position
const SM_X = AX + AW + 40;              // 846
const SM_Y = GY;
const SKIM_X = (P2X + PW / 2) - SM_X;  // −118
const SKIM_Y = ATOP - SM_Y + PH / 2;   // −181

// Flame path helper
const flamePath = (hw: number, fh: number, sw: number): string => {
  const bl = FOCX - hw;
  const br = FOCX + hw;
  return `M${bl},${FBASE} Q${FOCX + sw - hw * 0.45},${FBASE - fh * 0.52} ${FOCX + sw},${FBASE - fh} Q${FOCX + sw + hw * 0.45},${FBASE - fh * 0.52} ${br},${FBASE} Z`;
};

// Steam puffs: [x, phase, speed, driftX]
type SP4 = [number, number, number, number];
const STEAM: SP4[] = [
  [506, 0.0, 1.05, -3], [524, 0.5, 0.94, 4],  [544, 1.0, 1.12, -4], [562, 1.5, 0.98, 2],
  [580, 2.0, 1.08, -2], [600, 2.5, 0.96, 3],  [620, 3.0, 1.14, -3], [638, 3.5, 1.01, 1],
  [660, 0.3, 0.97, -2], [680, 0.9, 1.10, 3],  [700, 1.5, 1.04, -3], [718, 2.1, 0.94, 2],
  [738, 2.7, 1.07, -4], [756, 3.3, 0.99, 3],  [774, 3.9, 1.13, -1], [790, 4.5, 1.02, -2],
];

// Embers: [x offset from FOCX, phase, speed]
type EB3 = [number, number, number];
const EMBERS: EB3[] = [
  [-28, 0.0, 0.85], [-14, 0.6, 1.05], [0,  1.2, 0.95], [18,  1.8, 1.10],
  [30,  2.4, 0.90], [-8,  3.0, 1.15], [8,  3.6, 0.88], [-20, 4.2, 1.02],
  [24,  0.4, 0.92], [-4,  1.0, 1.08], [14, 1.6, 0.96], [-18, 2.2, 1.05],
];

// Sap bubbles: [x offset from pan center, phase]
type BUB2 = [number, number];
const BUBBLES: BUB2[] = [
  [-42, 0.0], [-26, 0.7], [-10, 1.4], [6, 2.1], [22, 2.8], [38, 3.5],
  [-36, 0.4], [-20, 1.1], [-4, 1.8], [12, 2.5], [28, 3.2], [44, 3.9],
];

const RAFTER_XS = [185, 400, 880, 1095] as const;
const CAN_COLS = ["#c86010", "#b05008", "#c86010", "#a84808", "#c06010"] as const;

// Wall boards
const BOARDS: number[] = [];
for (let wx = 60; wx < W - 50; wx += 50) BOARDS.push(wx);

// Floor planks
const FLOOR_YS: number[] = [];
for (let fy = GY; fy < H + 2; fy += 16) FLOOR_YS.push(fy);

export function MapleEvaporator() {
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
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

  const fs  = Math.sin(phase * 4.9) * 9;
  const fh  = 54 + Math.sin(phase * 6.8) * 14 + Math.sin(phase * 11.2) * 8;
  const ff  = 0.84 + Math.sin(phase * 7.3) * 0.12 + Math.sin(phase * 12.8) * 0.05;
  const sapShimmer = Math.sin(phase * 3.8) * 1.4;
  const skimAng = Math.sin(phase * 1.35) * 22 - 8;
  const skimWobY = Math.sin(phase * 2.1) * 4;

  return (
    <section className="w-full overflow-hidden bg-[#2a1808]">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ display: "block" }}
        aria-label="Shrewsbury maple sugar house interior — evaporator arch with animated fire, boiling sap pans, rising steam, sugar maker skimming"
      >
        <defs>
          <linearGradient id="me-room" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#221206" />
            <stop offset="100%" stopColor="#3c2610" />
          </linearGradient>
          <linearGradient id="me-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4e3414" />
            <stop offset="100%" stopColor="#2e1a08" />
          </linearGradient>
          <linearGradient id="me-sap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8a820" />
            <stop offset="100%" stopColor="#c07808" />
          </linearGradient>
          <linearGradient id="me-syrup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a85808" />
            <stop offset="100%" stopColor="#783208" />
          </linearGradient>
          <linearGradient id="me-arch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#525244" />
            <stop offset="100%" stopColor="#2c2a1e" />
          </linearGradient>
          <radialGradient id="me-glow" cx="50%" cy="75%" r="50%">
            <stop offset="0%"   stopColor="#f07010" stopOpacity="0.52" />
            <stop offset="55%"  stopColor="#f07010" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#f07010" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="me-glow2" cx="50%" cy="88%" r="42%">
            <stop offset="0%"   stopColor="#f8c040" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#f8c040" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Room ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#me-room)" />

        {/* Wall boards */}
        {BOARDS.map((wx, wi) => (
          <line key={wi} x1={wx} y1={CEIL} x2={wx} y2={GY}
            stroke="#5a3c18" strokeWidth="1" opacity="0.30" />
        ))}
        {[145, 248, 350].map((hy, hi) => (
          <line key={hi} x1="0" y1={hy} x2={W} y2={hy}
            stroke="#5a3c18" strokeWidth="0.8" opacity="0.18" />
        ))}
        {/* Wainscot rail */}
        <rect x="0" y={CEIL + 102} width={W} height="5" fill="#6a4820" opacity="0.45" />

        {/* ── Ceiling ── */}
        <rect x="0" y="0" width={W} height={CEIL} fill="#1c0e06" />
        {/* Ridge vent (steam escaping) */}
        <rect x="556" y="0" width="168" height={CEIL} fill="#160a04" />
        {Array.from({ length: 9 }, (_, li) => (
          <line key={li} x1={562 + li * 18} y1="3" x2={562 + li * 18} y2={CEIL - 3}
            stroke="#2e1e0c" strokeWidth="3" />
        ))}
        {/* Vent steam wisps */}
        {[0, 1, 2, 3].map(vi => {
          const vAge = ((phase * 0.78 + vi * 0.72) % (Math.PI * 2)) / (Math.PI * 2);
          const vx = 598 + vi * 22 + Math.sin(vAge * Math.PI * 2) * 5;
          const vy = -vAge * 28;
          const vo = vAge < 0.3 ? vAge / 0.3 : 1 - (vAge - 0.3) / 0.7;
          return (
            <ellipse key={vi} cx={vx} cy={vy} rx={6 + vAge * 10} ry={4 + vAge * 7}
              fill="#c0c8c0" opacity={vo * 0.32} />
          );
        })}

        {/* ── Rafters ── */}
        {RAFTER_XS.map((rx, ri) => (
          <g key={ri}>
            <rect x={rx - 12} y={CEIL} width="24" height={GY - CEIL} rx="5"
              fill="#4a3010" opacity="0.28" />
            <rect x={rx - 11} y={CEIL} width="22" height="5" fill="#604018" opacity="0.5" />
          </g>
        ))}

        {/* ── Floor ── */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#me-floor)" />
        {FLOOR_YS.map((py, pi) => (
          <line key={pi} x1="0" y1={py} x2={W} y2={py}
            stroke="#2e1a08" strokeWidth="1.2" opacity="0.55" />
        ))}
        {[175, 415, 685, 945, 1155].map((kx, ki) => (
          <ellipse key={ki} cx={kx} cy={GY + 10} rx="9" ry="4" fill="#2e1a08" opacity="0.38" />
        ))}

        {/* ── Fire glow overlays ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#me-glow)"  opacity={ff} />
        <rect x="0" y="0" width={W} height={H} fill="url(#me-glow2)" opacity={ff * 0.65} />

        {/* ── Sap collection barrel (left) ── */}
        <g>
          <rect x="156" y={GY - 98} width="74" height="98" rx="6" fill="#7a5028" />
          {[168, 186, 204, 220].map((bx, bi) => (
            <line key={bi} x1={bx} y1={GY - 96} x2={bx} y2={GY - 2}
              stroke="#5a3818" strokeWidth="1.5" opacity="0.48" />
          ))}
          {[GY - 90, GY - 52, GY - 14].map((hy, hi) => (
            <rect key={hi} x="152" y={hy} width="82" height="6" rx="3" fill="#4e2e10" />
          ))}
          <ellipse cx="193" cy={GY - 98} rx="39" ry="10" fill="#8a5830" />
          <ellipse cx="193" cy={GY - 98} rx="24" ry="6" fill="#d8a028" opacity="0.55" />
          <text x="193" y={GY - 56} textAnchor="middle" fontSize="9" fill="#d0a040"
            fontFamily="Georgia,serif" opacity="0.55">SAP</text>
        </g>
        {/* Sap feed line */}
        <path
          d={`M232,${GY - 66} Q320,${GY - 70} ${AX + 2},${ATOP + 14}`}
          fill="none" stroke="#5880a0" strokeWidth="3" strokeLinecap="round" opacity="0.72"
        />

        {/* ── Log pile (left of firebox) ── */}
        {[
          { cx: AX - 50, cy: ABOT - 12, r: 12 },
          { cx: AX - 70, cy: ABOT - 28, r: 11 },
          { cx: AX - 46, cy: ABOT - 34, r: 10 },
          { cx: AX - 66, cy: ABOT - 48, r: 9  },
          { cx: AX - 42, cy: ABOT - 54, r: 10 },
        ].map((log, li) => (
          <g key={li}>
            <circle cx={log.cx} cy={log.cy} r={log.r} fill="#542e10" />
            <circle cx={log.cx} cy={log.cy} r={log.r * 0.65} fill="none"
              stroke="#7a4420" strokeWidth="1" opacity="0.65" />
            <circle cx={log.cx} cy={log.cy} r={log.r * 0.30} fill="none"
              stroke="#7a4420" strokeWidth="0.8" opacity="0.45" />
            <circle cx={log.cx} cy={log.cy} r="2" fill="#8a5028" opacity="0.55" />
          </g>
        ))}

        {/* ── Evaporator arch ── */}
        <rect x={AX} y={ATOP + PH} width={AW} height={ABOT - ATOP - PH} rx="4"
          fill="url(#me-arch)" />
        {/* Top flange */}
        <rect x={AX - 10} y={ATOP + PH - 5} width={AW + 20} height="9" rx="2" fill="#5a5a4c" />
        {/* Rivets */}
        {Array.from({ length: 8 }, (_, ri) => (
          <circle key={ri} cx={AX + 18 + ri * 38} cy={ATOP + PH + 20}
            r="3" fill="#64644c" />
        ))}
        {/* Arch smoke box at top */}
        <rect x={AX + 4} y={ATOP + PH + 4} width={AW - 8} height="20" rx="2" fill="#3a3828" />

        {/* Firebox opening */}
        <path
          d={`M${FOL},${FBASE} L${FOL},${FBASE - FOH + 14} Q${FOL},${FBASE - FOH} ${FOL + 14},${FBASE - FOH} L${FOR_ - 14},${FBASE - FOH} Q${FOR_},${FBASE - FOH} ${FOR_},${FBASE - FOH + 14} L${FOR_},${FBASE} Z`}
          fill="#100c08"
        />
        {/* Coal bed */}
        <ellipse cx={FOCX} cy={FBASE + 2} rx={FOW / 2 - 5} ry="6" fill="#1e180c" />
        <ellipse cx={FOCX - 10} cy={FBASE}     rx="9" ry="4" fill="#d84018" opacity="0.48" />
        <ellipse cx={FOCX + 14} cy={FBASE - 2} rx="7" ry="3" fill="#e85020" opacity="0.42" />

        {/* Animated flames (clipped to opening) */}
        <clipPath id="me-fclip">
          <path d={`M${FOL},${FBASE} L${FOL},${FBASE - FOH + 14} Q${FOL},${FBASE - FOH} ${FOL + 14},${FBASE - FOH} L${FOR_ - 14},${FBASE - FOH} Q${FOR_},${FBASE - FOH} ${FOR_},${FBASE - FOH + 14} L${FOR_},${FBASE} Z`} />
        </clipPath>
        <g clipPath="url(#me-fclip)">
          <path d={flamePath(44, fh * 0.90, fs * 0.35)} fill="#e03808" opacity={ff * 0.92} />
          <path d={flamePath(32, fh * 0.76, fs * 0.56)} fill="#f06012" opacity={ff * 0.86} />
          <path d={flamePath(20, fh * 0.58, fs * 0.78)} fill="#f8a022" opacity={ff * 0.80} />
          <path d={flamePath(10, fh * 0.38, fs)}        fill="#fcd042" opacity={ff * 0.75} />
        </g>
        {/* Fire glow from opening */}
        <ellipse cx={FOCX} cy={FBASE - FOH * 0.4} rx="85" ry="65"
          fill="#f06010" opacity={ff * 0.16} />

        {/* Rising embers */}
        {EMBERS.map(([ex, eph, esp], ei) => {
          const age = ((phase * esp + eph) % (Math.PI * 2)) / (Math.PI * 2);
          const emx = FOCX + ex + Math.sin(age * Math.PI * 4) * 6;
          const emy = FBASE - age * (FOH + 44);
          const eo  = age < 0.22 ? age / 0.22 : age > 0.72 ? 1 - (age - 0.72) / 0.28 : 1;
          const ecl = ["#f8c020", "#f09010", "#e06010"][ei % 3] ?? "#f8c020";
          return (
            <circle key={ei} cx={emx} cy={emy} r={1.8 - age * 0.9}
              fill={ecl} opacity={eo * 0.88} />
          );
        })}

        {/* ── Pans atop arch ── */}
        {/* Pan frame / divider wall */}
        <rect x={AX + 4} y={ATOP} width={AW - 8} height={PH + 8} rx="2" fill="#5a5a48" />
        <rect x={ACX - 3} y={ATOP - 2} width="6" height={PH + 10} fill="#484838" />

        {/* Pan 1 — dark syrup */}
        <rect x={P1X} y={PY}     width={PW} height={PH} rx="2" fill="#484838" />
        <rect x={P1X + 3} y={PY + 4} width={PW - 6} height={PH - 6} rx="1"
          fill="url(#me-syrup)" />
        <path
          d={`M${P1X + 3},${PY + PH * 0.55 + sapShimmer} Q${P1X + PW * 0.35},${PY + PH * 0.45 - sapShimmer * 0.6} ${P1X + PW * 0.7},${PY + PH * 0.55 + sapShimmer * 0.8} Q${P1X + PW - 5},${PY + PH * 0.45} ${P1X + PW - 3},${PY + PH * 0.55 - sapShimmer}`}
          fill="none" stroke="#f0c060" strokeWidth="1" opacity="0.38"
        />
        <text x={P1X + PW / 2} y={PY + 17} textAnchor="middle" fontSize="8"
          fill="#f8e060" fontFamily="Georgia,serif" opacity="0.58">SYRUP</text>

        {/* Pan 2 — clear sap, boiling */}
        <rect x={P2X} y={PY}     width={PW} height={PH} rx="2" fill="#484838" />
        <rect x={P2X + 3} y={PY + 4} width={PW - 6} height={PH - 6} rx="1"
          fill="url(#me-sap)" />
        <path
          d={`M${P2X + 3},${PY + PH * 0.45 - sapShimmer * 0.7} Q${P2X + PW * 0.3},${PY + PH * 0.55 + sapShimmer} ${P2X + PW * 0.6},${PY + PH * 0.45 - sapShimmer * 0.5} Q${P2X + PW * 0.85},${PY + PH * 0.55 + sapShimmer * 0.8} ${P2X + PW - 3},${PY + PH * 0.45}`}
          fill="none" stroke="#f8e080" strokeWidth="1" opacity="0.32"
        />
        <text x={P2X + PW / 2} y={PY + 17} textAnchor="middle" fontSize="8"
          fill="#f8f060" fontFamily="Georgia,serif" opacity="0.52">SAP</text>

        {/* Sap bubbles in pan 2 */}
        {BUBBLES.map(([bx, bph], bi) => {
          const bAge = ((phase * 1.4 + bph) % (Math.PI * 2)) / (Math.PI * 2);
          const by   = PY + PH - 5 - bAge * (PH - 7);
          const bo   = bAge < 0.2 ? bAge / 0.2 : bAge > 0.82 ? 1 - (bAge - 0.82) / 0.18 : 1;
          return (
            <circle key={bi} cx={P2X + PW / 2 + bx} cy={by}
              r="1.6" fill="#f8e860" opacity={bo * 0.68} />
          );
        })}

        {/* ── Steam from pans ── */}
        {STEAM.map(([sx2, sph, ssp, sdx], sti) => {
          const age = ((phase * ssp + sph) % (Math.PI * 2)) / (Math.PI * 2);
          const sx3 = sx2 + sdx * age * 5 + Math.sin(age * Math.PI * 3 + sph) * 4;
          const sy  = ATOP - 4 - age * (ATOP - CEIL - 12);
          const so  = age < 0.18 ? age / 0.18 : age > 0.65 ? 1 - (age - 0.65) / 0.35 : 1;
          const sr  = 5 + age * 22;
          return (
            <ellipse key={sti} cx={sx3} cy={sy} rx={sr} ry={sr * 0.76}
              fill="#d0d8d0" opacity={so * 0.36} />
          );
        })}

        {/* Steam haze near ceiling */}
        <rect x="0" y={CEIL} width={W} height="75" fill="#c8d0c8" opacity="0.06" />

        {/* ── Hydrometer in pan 1 ── */}
        <rect x={ACX - 20} y={PY + 3}  width="3" height={PH - 6} rx="1"
          fill="#c0ccd8" opacity="0.75" />
        <ellipse cx={ACX - 19} cy={PY + PH - 7} rx="5" ry="5"
          fill="#98aaba" opacity="0.85" />

        {/* ── Thermometer on arch side ── */}
        <g transform={`translate(${AX + AW - 22},${ATOP + 52})`}>
          <rect x="-2" y="-32" width="4" height="44" rx="2" fill="#c0ccd8" opacity="0.78" />
          <ellipse cx="0" cy="14" rx="6" ry="6" fill="#e02818" opacity="0.90" />
          <rect x="-1" y="-12" width="2" height="26" rx="1" fill="#e02818" opacity="0.80" />
          {[-4, -14, -24].map((ty, ti) => (
            <line key={ti} x1="2" y1={ty} x2="7" y2={ty}
              stroke="#808080" strokeWidth="1" opacity="0.65" />
          ))}
        </g>

        {/* ── Sugar maker ── */}
        {(() => {
          const armTipX = 20 + Math.cos(skimAng * Math.PI / 180) * 10;
          const armTipY = -100 + Math.sin(skimAng * Math.PI / 180) * 10;
          return (
            <g transform={`translate(${SM_X},${SM_Y})`}>
              {/* Legs */}
              <rect x="-10" y="-44" width="9" height="44" rx="4" fill="#3a2810" />
              <rect x="2"   y="-44" width="9" height="44" rx="4" fill="#3a2810" />
              {/* Boots */}
              <rect x="-12" y="-5" width="12" height="8" rx="3" fill="#242018" />
              <rect x="1"   y="-5" width="12" height="8" rx="3" fill="#242018" />
              {/* Apron */}
              <rect x="-14" y="-110" width="28" height="68" rx="5" fill="#c0a038" opacity="0.88" />
              {/* Apron tie strings */}
              <path d="M-14,-58 Q-22,-50 -14,-44" fill="none" stroke="#a88028" strokeWidth="1.8" />
              <path d="M14,-58 Q22,-50 14,-44"   fill="none" stroke="#a88028" strokeWidth="1.8" />
              {/* Body */}
              <rect x="-12" y="-110" width="24" height="68" rx="5" fill="#5a3818" />
              {/* Left arm at side */}
              <rect x="-22" y="-106" width="10" height="8" rx="4" fill="#5a3818"
                transform="rotate(-8,-17,-102)" />
              {/* Right arm — skimming */}
              <rect x="12" y="-102" width="12" height="8" rx="4" fill="#5a3818"
                transform={`rotate(${skimAng},18,-98)`} />
              {/* Skimmer handle */}
              <line x1={armTipX} y1={armTipY}
                x2={SKIM_X} y2={SKIM_Y + skimWobY}
                stroke="#a87030" strokeWidth="3.5" strokeLinecap="round"
              />
              {/* Skimmer head */}
              <ellipse cx={SKIM_X} cy={SKIM_Y + skimWobY}
                rx="18" ry="6" fill="#8a8870" />
              {/* Holes in skimmer */}
              {[-10, -2, 6].map((hx, hi) => (
                <circle key={hi} cx={SKIM_X + hx} cy={SKIM_Y + skimWobY}
                  r="2.5" fill="#484838" />
              ))}
              {/* Head */}
              <circle cx="0" cy="-124" r="14" fill="#f0c890" />
              {/* Cap */}
              <rect x="-14" y="-142" width="28" height="20" rx="6" fill="#7a5020" />
              <rect x="-16" y="-136" width="32" height="6" rx="3" fill="#6a4018" />
              {/* Eyes */}
              <circle cx="-5" cy="-126" r="2.5" fill="#3a2010" />
              <circle cx="5"  cy="-126" r="2.5" fill="#3a2010" />
            </g>
          );
        })()}

        {/* ── Syrup cans on right shelf ── */}
        <g>
          <rect x="1040" y={GY - 172} width="204" height="12" rx="3" fill="#8a5828" />
          <rect x="1042" y={GY - 172} width="200" height="5" fill="#aa7038" opacity="0.55" />
          {/* Brackets */}
          <path d={`M1042,${GY - 172} L1042,${GY - 148} L1062,${GY - 160} Z`} fill="#784e28" />
          <path d={`M1240,${GY - 172} L1240,${GY - 148} L1220,${GY - 160} Z`} fill="#784e28" />
          {CAN_COLS.map((col, ci) => (
            <g key={ci} transform={`translate(${1060 + ci * 38},${GY - 172})`}>
              <rect x="-12" y="-46" width="24" height="46" rx="3" fill={col} />
              <ellipse cx="0" cy="-46" rx="12" ry="5"
                fill={ci % 2 === 0 ? "#deb046" : "#ae6028"} />
              <rect x="-8" y="-34" width="16" height="15" rx="2" fill="#f0e8c0" opacity="0.80" />
              <text x="0" y="-24" textAnchor="middle" fontSize="5.5" fill="#5a3010"
                fontFamily="Georgia,serif" fontWeight="bold">MAPLE</text>
              <text x="0" y="-17" textAnchor="middle" fontSize="4.5" fill="#5a3010"
                fontFamily="Georgia,serif">SYRUP</text>
            </g>
          ))}
        </g>

        {/* Drip catcher below pan 1 */}
        <rect x={P1X - 4} y={ATOP + PH + 8} width={PW + 8} height="6" rx="2"
          fill="#585848" opacity="0.7" />

        {/* ── Windows (steamed) ── */}
        <g>
          <rect x="62" y="138" width="82" height="62" rx="4"
            fill="#3e2810" stroke="#664820" strokeWidth="3" />
          <rect x="68" y="144" width="70" height="50" rx="2" fill="#8090888" opacity="0.4" />
          <line x1="62" y1="169" x2="144" y2="169" stroke="#664820" strokeWidth="3" />
          <line x1="103" y1="138" x2="103" y2="200" stroke="#664820" strokeWidth="3" />
          <rect x="68" y="144" width="70" height="50" rx="2" fill="#e0e8de" opacity="0.12" />
        </g>
        <g>
          <rect x="1136" y="132" width="82" height="62" rx="4"
            fill="#3e2810" stroke="#664820" strokeWidth="3" />
          <rect x="1142" y="138" width="70" height="50" rx="2" fill="#809088" opacity="0.4" />
          <line x1="1136" y1="163" x2="1218" y2="163" stroke="#664820" strokeWidth="3" />
          <line x1="1177" y1="132" x2="1177" y2="194" stroke="#664820" strokeWidth="3" />
          <rect x="1142" y="138" width="70" height="50" rx="2" fill="#e0e8de" opacity="0.10" />
        </g>

        {/* Caption */}
        <text x="640" y={H - 10} textAnchor="middle" fontSize="12" fill="#d0a050"
          fontFamily="Georgia,serif" opacity="0.65" letterSpacing="1">
          SHREWSBURY SUGAR HOUSE · MAPLE EVAPORATOR · LATE MARCH
        </text>
      </svg>
    </section>
  );
}
