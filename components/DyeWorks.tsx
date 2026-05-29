"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1400, H = 520;

/* ── Drying lines ────────────────────────────────────────── */
const HL1 = 66, HL2 = 148;

/* ── Vat geometry ────────────────────────────────────────── */
const VAT_TW  = 98;                       // top half-width
const VAT_BW  = 76;                       // bottom half-width
const VAT_TOP = 260;                      // rim Y
const VAT_BOT = 426;                      // bottom Y
const VAT_LIQ = VAT_TOP + 14;            // liquid surface Y
const LIQ_HW  = VAT_TW - 7;             // 91
const FB_TOP  = VAT_BOT;                 // firebox top
const FB_BOT  = 452;                     // firebox base / floor

/* ── Vat cx used in animation ────────────────────────────── */
const V0_CX = 196;   // indigo — stir here
const V1_CX = 506;   // madder — cloth dunk here

/* ── Vat data ────────────────────────────────────────────── */
type VT4 = [number, string, string, string]; // cx, liquid, deep, label
const VATS: VT4[] = [
  [V0_CX, "#1e32ac", "#0c1662", "INDIGO"],
  [V1_CX, "#c02020", "#7c0c0c", "MADDER"],
  [816,   "#c49808", "#7a5a00", "WELD"],
  [1126,  "#523412", "#2e1808", "OAK GALL"],
];

/* ── Hanging cloth strips ────────────────────────────────── */
type CL3 = [number, string, number]; // x, color, lineY
const CLOTHS: CL3[] = [
  [58,   "#1a2c9c", HL1],
  [208,  "#c41c1c", HL2],
  [358,  "#c4980c", HL1],
  [508,  "#6c20aa", HL2],
  [658,  "#1c8838", HL1],
  [808,  "#d85c0c", HL2],
  [958,  "#1e3cb8", HL1],
  [1108, "#8a4010", HL2],
];
const CL_W = 82, CL_H = 124;

/* ── Smoke particles per vat ─────────────────────────────── */
type SM3 = [number, number, number]; // phaseOff, xDrift, speed
const SMOKES: SM3[] = [
  [0,    0,  0.022],
  [1.08, 7,  0.017],
  [2.22,-5,  0.028],
];

/* ── Dyemaster ───────────────────────────────────────────── */
const DM_X  = 104, DM_SY = 338, DM_HY = 252;
const DM_SX = DM_X + 20;
const DM_UAL = 38, DM_FAL = 30;

/* ── Palette ─────────────────────────────────────────────── */
const OAK   = "#7a5828";
const DOAK  = "#4a2e0e";
const BRICK = "#8a3a18";
const BRKD  = "#5e2210";

/* ── Vat trapezoid path ──────────────────────────────────── */
function vatPath(cx: number): string {
  return `M ${cx - VAT_TW} ${VAT_TOP} L ${cx + VAT_TW} ${VAT_TOP} `
    + `L ${cx + VAT_BW} ${VAT_BOT} L ${cx - VAT_BW} ${VAT_BOT} Z`;
}

/* ── Stave lines on vat ──────────────────────────────────── */
function vatStaves(cx: number): React.ReactNode {
  const out: React.ReactNode[] = [];
  for (let s = 0; s < 9; s++) {
    const t  = s / 8;
    const tx = cx - VAT_TW + t * VAT_TW * 2;
    const bx = cx - VAT_BW + t * VAT_BW * 2;
    out.push(<line key={s} x1={tx} y1={VAT_TOP} x2={bx} y2={VAT_BOT}
      stroke="#3a1c08" strokeWidth="1.3" strokeOpacity="0.4" />);
  }
  return <>{out}</>;
}

export function DyeWorks() {
  const [phase, setPhase]     = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setPhase(p => p + 1), 16);
    return () => clearInterval(id);
  }, [visible]);

  /* ── Animation ─────────────────────────────────────────── */
  const stirAng  = phase * 0.052;
  const stirTipX = V0_CX + Math.sin(stirAng) * 30;
  const stirTipY = VAT_LIQ + (VAT_BOT - VAT_LIQ) * 0.76;

  /* Dyemaster right-arm IK to pole top ~60px above surface */
  const poleTopX = V0_CX + Math.sin(stirAng) * 12;
  const poleTopY = VAT_TOP - 52;
  const dmDx   = poleTopX - DM_SX;
  const dmDy   = poleTopY - (DM_SY + 8);
  const dmUAAng = Math.atan2(dmDy, dmDx) * 180 / Math.PI - 14;
  const dmFAAng = dmUAAng + 32;
  const dmUARad = dmUAAng * Math.PI / 180;
  const dmFARad = dmFAAng * Math.PI / 180;
  const dmElX  = DM_SX + Math.cos(dmUARad) * DM_UAL;
  const dmElY  = DM_SY + 8 + Math.sin(dmUARad) * DM_UAL;
  const dmWrX  = dmElX + Math.cos(dmFARad) * DM_FAL;
  const dmWrY  = dmElY + Math.sin(dmFARad) * DM_FAL;

  /* Cloth dunking at vat 1 (madder) */
  const dunkY = VAT_LIQ - 28 + Math.sin(phase * 0.029) * 54;

  /* Cloth sway */
  function clothSway(i: number): number {
    return Math.sin(phase * 0.019 + i * 0.72) * 5;
  }

  /* Flame height per vat×flame: vi=vat index, fi=flame index 0-2 */
  function flameH(vi: number, fi: number): number {
    return 22 + Math.sin(phase * (0.19 + vi * 0.05 + fi * 0.07) + vi * 1.3 + fi * 0.9) * 9;
  }
  function flameH2(vi: number, fi: number): number {
    return 14 + Math.sin(phase * (0.31 + vi * 0.06 + fi * 0.09) + vi * 2.1 + fi * 1.6) * 6;
  }

  /* Smoke particle */
  function smokePos(vcx: number, vi: number, si: number,
                    phOff: number, xDr: number, spd: number
  ): [number, number, number] {
    const t = ((phase * spd + phOff + vi * 0.8) % (Math.PI * 2)) / (Math.PI * 2);
    const sy = VAT_LIQ - 8 - t * 110;
    const sx = vcx + xDr * Math.sin(t * Math.PI * 2);
    const op = t < 0.4 ? t * 2 * 0.28 : (1 - t) * 1.4 * 0.28;
    void si;
    return [sx, sy, Math.max(0, op)];
  }

  return (
    <section style={{ background: "#160c04", padding: "2.5rem 0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Colonial dye works with four vats of indigo, madder, weld, and oak gall"
      >
        <defs>
          {VATS.map(([vcx, liq], vi) => (
            <radialGradient key={vi} id={`dw-liq${vi}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={liq} stopOpacity="0.95" />
              <stop offset="100%" stopColor={VATS[vi]?.[2] ?? "#111"} stopOpacity="1" />
            </radialGradient>
          ))}
          <radialGradient id="dw-glow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ff9020" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff4000" stopOpacity="0" />
          </radialGradient>
          <filter id="dw-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ── Dark workshop background ───────────────────── */}
        <rect width={W} height={H} fill="#160c04" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={0} y={i * 66} width={W} height={62}
            fill={i % 2 === 0 ? "#160c04" : "#1c1006"} />
        ))}
        {/* Floor */}
        <rect x={0} y={452} width={W} height={H - 452} fill="#2a1608" />

        {/* ── Drying lines (ceiling strings) ────────────── */}
        <line x1={40}  y1={HL1} x2={W - 40} y2={HL1} stroke={DOAK} strokeWidth="2.5" />
        <line x1={40}  y1={HL2} x2={W - 40} y2={HL2} stroke={DOAK} strokeWidth="2.5" />
        {/* End posts */}
        <rect x={38} y={HL1 - 4} width={8} height={HL2 - HL1 + 8}
          fill={OAK} />
        <rect x={W - 46} y={HL1 - 4} width={8} height={HL2 - HL1 + 8}
          fill={OAK} />

        {/* ── Hanging dyed cloth ────────────────────────── */}
        {CLOTHS.map(([cx, col, ly]: CL3, i) => {
          const sw = clothSway(i);
          return (
            <g key={i} transform={`translate(${sw}, 0)`}>
              {/* clip string */}
              <line x1={cx + CL_W / 2} y1={ly}
                x2={cx + CL_W / 2} y2={ly + 8}
                stroke={DOAK} strokeWidth="1.5" />
              {/* cloth */}
              <rect x={cx} y={ly + 8}
                width={CL_W} height={CL_H}
                fill={col} rx="2" />
              {/* cloth texture — faint horizontal weft lines */}
              {Array.from({ length: 8 }, (_, row) => (
                <line key={row}
                  x1={cx + 4} y1={ly + 8 + row * 16}
                  x2={cx + CL_W - 4} y2={ly + 8 + row * 16}
                  stroke="#ffffff" strokeWidth="1" strokeOpacity="0.12" />
              ))}
              {/* damp sheen */}
              <rect x={cx + 6} y={ly + 8} width={12} height={CL_H}
                fill="#ffffff" opacity="0.08" rx="2" />
            </g>
          );
        })}

        {/* ── Vats ──────────────────────────────────────── */}
        {VATS.map(([vcx, liq, , lbl]: VT4, vi) => {
          const fh1a = flameH(vi, 0);
          const fh1b = flameH(vi, 1);
          const fh1c = flameH(vi, 2);
          const fh2a = flameH2(vi, 0);
          const fh2b = flameH2(vi, 1);
          const fh2c = flameH2(vi, 2);

          return (
            <g key={vi}>
              {/* Firebox / brick base */}
              <rect x={vcx - VAT_BW - 4} y={FB_TOP}
                width={(VAT_BW + 4) * 2} height={FB_BOT - FB_TOP}
                fill={BRICK} />
              {/* Brick courses */}
              {Array.from({ length: 3 }, (_, r) => (
                <rect key={r}
                  x={vcx - VAT_BW - 4} y={FB_TOP + r * 9}
                  width={(VAT_BW + 4) * 2} height={1}
                  fill={BRKD} />
              ))}
              {/* Fire arch opening */}
              <path d={`M ${vcx - 30} ${FB_BOT} L ${vcx - 30} ${FB_TOP + 6} `
                + `Q ${vcx} ${FB_TOP - 8} ${vcx + 30} ${FB_TOP + 6} `
                + `L ${vcx + 30} ${FB_BOT} Z`}
                fill="#1a0802" />
              {/* Fire glow bloom */}
              <ellipse cx={vcx} cy={FB_TOP + 4}
                rx={40} ry={22}
                fill="url(#dw-glow)" />
              {/* Base flames */}
              {[
                [vcx - 14, fh1a, "#ff6010"],
                [vcx,      fh1b, "#ff8020"],
                [vcx + 14, fh1c, "#ff6010"],
              ].map(([fx, fh, fc], fi) => (
                <path key={fi}
                  d={`M ${fx as number - 8} ${FB_TOP + 4} `
                    + `C ${fx as number - 10} ${FB_TOP + 4 - (fh as number) * 0.5} `
                    + `${fx as number + 10} ${FB_TOP + 4 - (fh as number) * 0.6} `
                    + `${fx as number} ${FB_TOP + 4 - (fh as number)}`}
                  fill={fc as string} opacity="0.88" />
              ))}
              {/* Inner hotter flames */}
              {[
                [vcx - 8,  fh2a, "#ffcc40"],
                [vcx + 4,  fh2b, "#ffe060"],
                [vcx + 18, fh2c, "#ffcc40"],
              ].map(([fx, fh, fc], fi) => (
                <path key={fi}
                  d={`M ${fx as number - 5} ${FB_TOP + 4} `
                    + `C ${fx as number - 6} ${FB_TOP + 4 - (fh as number) * 0.45} `
                    + `${fx as number + 6} ${FB_TOP + 4 - (fh as number) * 0.55} `
                    + `${fx as number} ${FB_TOP + 4 - (fh as number)}`}
                  fill={fc as string} opacity="0.8" />
              ))}

              {/* Vat body (oak staved tub) */}
              <path d={vatPath(vcx)} fill={OAK} />
              {vatStaves(vcx)}
              {/* Iron hoops */}
              {[0.1, 0.5, 0.9].map((ht, hi) => {
                const hy   = VAT_TOP + ht * (VAT_BOT - VAT_TOP);
                const hhw  = VAT_BW + (VAT_TW - VAT_BW) * (1 - ht);
                return (
                  <ellipse key={hi} cx={vcx} cy={hy} rx={hhw} ry={7}
                    fill="none" stroke="#3a3a42" strokeWidth="5" />
                );
              })}
              {/* Rim cap */}
              <ellipse cx={vcx} cy={VAT_TOP} rx={VAT_TW} ry={8}
                fill={DOAK} />

              {/* Liquid surface */}
              <ellipse cx={vcx} cy={VAT_LIQ} rx={LIQ_HW} ry={10}
                fill={`url(#dw-liq${vi})`} opacity="0.92" />
              {/* Surface sheen */}
              <ellipse cx={vcx - 18} cy={VAT_LIQ - 2} rx={22} ry={4}
                fill="#ffffff" opacity="0.14" />

              {/* Smoke rising */}
              {SMOKES.map(([phOff, xDr, spd]: SM3, si) => {
                const [sx, sy, sop] = smokePos(vcx, vi, si, phOff, xDr, spd);
                return (
                  <circle key={si} cx={sx} cy={sy}
                    r={6 + si * 3}
                    fill="#8a7060" opacity={sop}
                    filter="url(#dw-sm)" />
                );
              })}

              {/* Vat label plaque */}
              <rect x={vcx - 32} y={VAT_TOP + 28}
                width={64} height={18} rx="3"
                fill="#1a1208" stroke="#c8a028" strokeWidth="1.2" />
              <text x={vcx} y={VAT_TOP + 41}
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="8.5" fill="#c8a028" letterSpacing="1">
                {lbl}
              </text>
            </g>
          );
        })}

        {/* ── Stirring pole at vat 0 (indigo) ───────────── */}
        <line x1={dmWrX} y1={dmWrY}
          x2={stirTipX} y2={stirTipY}
          stroke={DOAK} strokeWidth="7" strokeLinecap="round" />
        {/* ripple at stir point */}
        <ellipse cx={stirTipX} cy={VAT_LIQ} rx={14} ry={4}
          fill="none" stroke="#4060c8" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* ── Cloth being dunked at vat 1 (madder) ──────── */}
        {dunkY < VAT_LIQ && (
          <rect x={V1_CX - 22} y={dunkY}
            width={44} height={VAT_LIQ - dunkY + 8}
            fill="#c41c1c" opacity="0.85" rx="3" />
        )}
        {/* cloth tail above vat when dunking */}
        <rect x={V1_CX - 22} y={Math.min(dunkY, VAT_LIQ - 60)}
          width={44} height={60}
          fill="#e8d8c0" opacity={dunkY < VAT_LIQ ? 0.9 : 0.6} rx="3" />
        {/* helper hand holding cloth */}
        <circle cx={V1_CX} cy={Math.min(dunkY, VAT_LIQ - 66)}
          r={9} fill="#c89050" />

        {/* ── Dyemaster Figure ──────────────────────────── */}
        {/* body */}
        <rect x={DM_X - 22} y={DM_SY} width={44} height={72}
          fill="#3a2a10" rx="8" />
        {/* stained apron */}
        <rect x={DM_X - 16} y={DM_SY + 18} width={32} height={52}
          fill="#1c2060" opacity="0.75" rx="3" />
        {/* indigo stain splotches on apron */}
        <ellipse cx={DM_X - 4} cy={DM_SY + 34} rx={7} ry={5}
          fill="#1e30a0" opacity="0.6" />
        <ellipse cx={DM_X + 8} cy={DM_SY + 52} rx={5} ry={4}
          fill="#c82020" opacity="0.5" />
        {/* left arm bracing */}
        <line x1={DM_X - 22} y1={DM_SY + 14}
          x2={DM_X - 50} y2={DM_SY + 44}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={DM_X - 50} y1={DM_SY + 44}
          x2={DM_X - 62} y2={DM_SY + 50}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* right arm (IK to pole) */}
        <line x1={DM_SX} y1={DM_SY + 10}
          x2={dmElX} y2={dmElY}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={dmElX} y1={dmElY}
          x2={dmWrX} y2={dmWrY}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* legs */}
        <line x1={DM_X - 10} y1={DM_SY + 72}
          x2={DM_X - 10}     y2={FB_BOT}
          stroke="#3a2a10" strokeWidth="14" strokeLinecap="round" />
        <line x1={DM_X + 8}  y1={DM_SY + 72}
          x2={DM_X + 8}      y2={FB_BOT}
          stroke="#3a2a10" strokeWidth="14" strokeLinecap="round" />
        {/* head */}
        <circle cx={DM_X} cy={DM_HY} r={22} fill="#d4a060" />
        {/* mob cap */}
        <path d={`M ${DM_X - 25} ${DM_HY - 1}`
          + ` C ${DM_X - 28} ${DM_HY - 36} ${DM_X + 28} ${DM_HY - 36} ${DM_X + 25} ${DM_HY - 1}`
          + ` C ${DM_X + 18} ${DM_HY - 16} ${DM_X - 18} ${DM_HY - 16} ${DM_X - 25} ${DM_HY - 1}`}
          fill="#e8e0d0" />
        {/* kerchief tied at throat */}
        <path d={`M ${DM_X - 12} ${DM_HY + 16} L ${DM_X} ${DM_HY + 28} L ${DM_X + 12} ${DM_HY + 16}`}
          fill="#d4c8a8" />

        {/* ── Ingredient shelf (right wall) ─────────────── */}
        <rect x={1258} y={236} width={116} height={10} fill={OAK} rx="2" />
        <rect x={1258} y={246} width={4}   height={94} fill={OAK} />
        <rect x={1370} y={246} width={4}   height={94} fill={OAK} />
        {/* Ingredient bundles: indigo ball, madder root, weld, oak bark */}
        {[
          [1272, "#1c308a", "WOAD"],
          [1306, "#c02020", "MADDER"],
          [1340, "#c4a010", "WELD"],
        ].map(([bx, bc, bl], bi) => (
          <g key={bi}>
            <ellipse cx={bx as number} cy={228}
              rx={12} ry={9}
              fill={bc as string} opacity="0.9" />
            <line x1={(bx as number) - 10} y1={236}
              x2={(bx as number) + 10}  y2={236}
              stroke={bc as string} strokeWidth="3" strokeOpacity="0.5" />
            <text x={bx as number} y={258}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="7" fill="#b09060" letterSpacing="0.5">
              {bl}
            </text>
          </g>
        ))}

        {/* Mordant pots on lower shelf */}
        <rect x={1258} y={334} width={116} height={10} fill={OAK} rx="2" />
        {[1276, 1316, 1356].map((px, pi) => (
          <g key={pi}>
            <rect x={px - 14} y={298} width={28} height={36} rx="4"
              fill={pi === 0 ? "#d8d0b8" : pi === 1 ? "#3a3030" : "#b88040"} />
            <ellipse cx={px} cy={298} rx={14} ry={5}
              fill={pi === 0 ? "#c8c0a8" : pi === 1 ? "#282020" : "#a86c28"} />
            <text x={px} y={322} textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="7" fill="#f0e8d0">
              {pi === 0 ? "ALUM" : pi === 1 ? "IRON" : "TANNIN"}
            </text>
          </g>
        ))}

        {/* ── Sign ─────────────────────────────────────────── */}
        <rect x={584} y={66} width={232} height={38} rx="4"
          fill="#1a0c04" stroke="#c8a028" strokeWidth="2" />
        <text x={700} y={83} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="10"
          fill="#c8a028" letterSpacing="2">SHREWSBURY DYE WORKS</text>
        <text x={700} y={97} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="8"
          fill="#9a7820" letterSpacing="1">ESTABLISHED 1784</text>

        {/* ── Caption ──────────────────────────────────────── */}
        <text x={W / 2} y={494}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13" fill="#c8a050" letterSpacing="2.5">
          SHREWSBURY DYE WORKS · INDIGO · MADDER · WELD · OAK GALL · EST. 1784
        </text>
      </svg>
    </section>
  );
}
