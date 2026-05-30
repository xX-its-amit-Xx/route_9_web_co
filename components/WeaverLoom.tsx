"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1400, H = 520;

/* ── Loom frame ─────────────────────────────────────────── */
const LM_X1  = 188,  LM_X2  = 1058;
const LM_YT  = 64,   LM_YB  = 454;
const POST_W = 16;

/* ── Key X positions ────────────────────────────────────── */
const WARP_BX = 1014;   // warp beam (back/right)
const CLTH_BX = 256;    // cloth beam (front/left)
const BEAT_HX = 406;    // beater hinge X (from castle)
const HED1_X  = 572;    // front heddle frame
const HED2_X  = 634;    // back heddle frame

/* ── Warp geometry ──────────────────────────────────────── */
const WRP_Y1  = 200;
const WRP_Y2  = 358;
const WRP_MID = (WRP_Y1 + WRP_Y2) / 2;   // 279
const NWARP   = 22;
const SHED_A  = 32;

/* ── Shuttle travel ─────────────────────────────────────── */
const SH_X1 = CLTH_BX + 24;              // 280
const SH_X2 = HED1_X  - 18;             // 554
const SH_MX = (SH_X1 + SH_X2) / 2;     // 417
const SH_HX = (SH_X2 - SH_X1) / 2;     // 137

/* ── Beater ─────────────────────────────────────────────── */
const BEAT_LEN = WRP_MID - LM_YT - 2;   // 213

/* ── Heddle frames ──────────────────────────────────────── */
const HED_YR = WRP_MID;
const HED_HH = 78;
const HED_W  = 22;

/* ── Weaver figure ──────────────────────────────────────── */
const WVR_X  = 110;
const WVR_SY = 300;
const WVR_HY = 216;
const WVR_SX = WVR_X + 16;
const UA_LEN = 36;
const FA_LEN = 29;

/* ── Treadles ───────────────────────────────────────────── */
const TR_X1 = LM_X1 + 14;
const TR_X2 = CLTH_BX - 14;
const TR_Y  = LM_YB - 8;

/* ── Cycle ──────────────────────────────────────────────── */
const CYCLE = 268;

/* ── Spool data ─────────────────────────────────────────── */
type SP2 = [number, string];
const SPOOLS: SP2[] = [
  [1124, "#c84040"],
  [1174, "#3860c8"],
  [1224, "#d89828"],
  [1274, "#3a9852"],
  [1324, "#8840a0"],
];

/* ── Palette ────────────────────────────────────────────── */
const OAK  = "#8b6535";
const DOAK = "#5a3e1a";
const WARP = "#d4b480";
const WARP2 = "#c8a060";

export function WeaverLoom() {
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
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 1); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [visible]);

  /* ── Animation values ──────────────────────────────────── */
  const shedOsc   = Math.sin(phase * Math.PI * 2 / CYCLE);
  const shttlOsc  = Math.cos(phase * Math.PI * 2 / CYCLE);
  const cosD      = Math.cos(phase * Math.PI * 4 / CYCLE);
  const beatForce = Math.max(0, (cosD - 0.5) / 0.5);

  const beatAng  = -8 + beatForce * 24;
  const beatRad  = beatAng * Math.PI / 180;
  const beatBotX = BEAT_HX + Math.sin(beatRad) * BEAT_LEN;
  void beatBotX; // computed for reference; used implicitly via rotation

  const shttlX = SH_MX + shttlOsc * SH_HX;

  const hed1Off = -shedOsc * SHED_A * 0.8;
  const hed2Off =  shedOsc * SHED_A * 0.8;

  /* weaver throwing arm */
  const throwT = Math.max(0, shttlOsc);
  const uaAng  = 54 - throwT * 46;
  const faAng  = uaAng + 38 + throwT * 16;
  const uaRad  = uaAng * Math.PI / 180;
  const faRad  = faAng * Math.PI / 180;
  const elX    = WVR_SX + Math.cos(uaRad) * UA_LEN;
  const elY    = WVR_SY + 8 + Math.sin(uaRad) * UA_LEN;
  const wrX    = elX + Math.cos(faRad) * FA_LEN;
  const wrY    = elY + Math.sin(faRad) * FA_LEN;

  /* treadle press */
  const tLdown = shedOsc > 0 ? 9 : 0;
  const tRdown = shedOsc < 0 ? 9 : 0;

  /* ── Warp thread paths ─────────────────────────────────── */
  function warpPath(i: number): string {
    const t  = NWARP > 1 ? i / (NWARP - 1) : 0;
    const wy = WRP_Y1 + (WRP_Y2 - WRP_Y1) * t;
    const off = (i % 2 === 0) ? -shedOsc * SHED_A : shedOsc * SHED_A;
    return `M ${WARP_BX} ${wy} L ${HED1_X + 4} ${wy + off} L ${CLTH_BX} ${wy}`;
  }

  /* ── Cloth weave rows ──────────────────────────────────── */
  function clothRows(): React.ReactNode {
    const rows: React.ReactNode[] = [];
    for (let r = 0; r < 14; r++) {
      const wy  = WRP_Y1 + (r / 13) * (WRP_Y2 - WRP_Y1);
      const col = r % 2 === 0 ? "#b83a10" : "#1c3888";
      rows.push(
        <line key={r}
          x1={CLTH_BX - 36} y1={wy}
          x2={CLTH_BX + 4}  y2={wy}
          stroke={col} strokeWidth="3.5" />
      );
    }
    return <>{rows}</>;
  }

  return (
    <section style={{ background: "#f2e4c4", padding: "2.5rem 0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Colonial weaver at a hand loom"
      >
        <defs>
          <radialGradient id="wl-win" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#dff0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a0c8e8" stopOpacity="0.1" />
          </radialGradient>
          <filter id="wl-sd" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* background wall boards */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={0} y={i * 58} width={W} height={55}
            fill={i % 2 === 0 ? "#f4e8c8" : "#eedfc0"} />
        ))}
        {/* wood floor */}
        <rect x={0} y={440} width={W} height={H - 440} fill="#c48840" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i}
            x1={i * 158} y1={440} x2={i * 158 + 98} y2={H}
            stroke="#b07030" strokeWidth="2" />
        ))}
        {/* window */}
        <rect x={1112} y={76} width={180} height={244} rx="3" fill="url(#wl-win)" />
        <rect x={1112} y={76} width={180} height={244} rx="3"
          fill="none" stroke={OAK} strokeWidth="6" />
        <line x1={1202} y1={76} x2={1202} y2={320} stroke={OAK} strokeWidth="4" />
        <line x1={1112} y1={198} x2={1292} y2={198} stroke={OAK} strokeWidth="4" />

        {/* ── Loom frame uprights ─────────────────────────── */}
        <rect x={LM_X1} y={LM_YT} width={POST_W} height={LM_YB - LM_YT}
          fill={OAK} filter="url(#wl-sd)" />
        <rect x={LM_X2 - POST_W} y={LM_YT} width={POST_W} height={LM_YB - LM_YT}
          fill={OAK} filter="url(#wl-sd)" />
        {/* castle beam */}
        <rect x={LM_X1} y={LM_YT} width={LM_X2 - LM_X1} height={14} fill={DOAK} />
        {/* floor beam */}
        <rect x={LM_X1} y={LM_YB - 14} width={LM_X2 - LM_X1} height={14} fill={DOAK} />
        {/* breast beam (weaver side) */}
        <rect x={CLTH_BX - 12} y={WRP_Y2 + 14} width={82} height={13} fill={OAK} rx="2" />

        {/* ── Warp beam (right/back) cylinder ─────────────── */}
        <rect x={WARP_BX - 9} y={WRP_Y1 - 24} width={22}
          height={WRP_Y2 - WRP_Y1 + 48} fill={OAK} rx="3" />
        <ellipse cx={WARP_BX + 2} cy={WRP_Y1 - 26} rx={14} ry={7} fill={DOAK} />
        <ellipse cx={WARP_BX + 2} cy={WRP_Y2 + 26} rx={14} ry={7} fill={DOAK} />
        {/* wound warp on beam */}
        <ellipse cx={WARP_BX + 2} cy={WRP_MID} rx={30}
          ry={(WRP_Y2 - WRP_Y1) / 2 + 8} fill={WARP} opacity="0.55" />

        {/* ── Cloth beam (left/front) cylinder ────────────── */}
        <rect x={CLTH_BX - 9} y={WRP_Y1 - 24} width={22}
          height={WRP_Y2 - WRP_Y1 + 48} fill={OAK} rx="3" />
        <ellipse cx={CLTH_BX + 2} cy={WRP_Y1 - 26} rx={14} ry={7} fill={DOAK} />
        <ellipse cx={CLTH_BX + 2} cy={WRP_Y2 + 26} rx={14} ry={7} fill={DOAK} />
        {/* woven cloth roll */}
        <rect x={CLTH_BX - 38} y={WRP_Y1} width={34}
          height={WRP_Y2 - WRP_Y1} fill="#e8d8b8" stroke="#c4a870" strokeWidth="1" />
        {clothRows()}

        {/* ── Warp threads ────────────────────────────────── */}
        {Array.from({ length: NWARP }, (_, i) => (
          <path key={i} d={warpPath(i)}
            stroke={i % 2 === 0 ? WARP : WARP2}
            strokeWidth="1.5" fill="none" />
        ))}

        {/* ── Heddle frame A ──────────────────────────────── */}
        <g transform={`translate(0, ${hed1Off})`}>
          <rect x={HED1_X - HED_W / 2} y={HED_YR - HED_HH}
            width={HED_W} height={HED_HH * 2}
            fill="none" stroke={OAK} strokeWidth="5" rx="2" />
          {Array.from({ length: 12 }, (_, j) => {
            const ey = HED_YR - HED_HH + 8 + j * 12;
            return (
              <rect key={j}
                x={HED1_X - HED_W / 2 + 2} y={ey}
                width={HED_W - 4} height={4}
                fill={WARP} rx="1" />
            );
          })}
        </g>

        {/* ── Heddle frame B ──────────────────────────────── */}
        <g transform={`translate(0, ${hed2Off})`}>
          <rect x={HED2_X - HED_W / 2} y={HED_YR - HED_HH}
            width={HED_W} height={HED_HH * 2}
            fill="none" stroke={OAK} strokeWidth="5" rx="2" />
          {Array.from({ length: 12 }, (_, j) => {
            const ey = HED_YR - HED_HH + 8 + j * 12;
            return (
              <rect key={j}
                x={HED2_X - HED_W / 2 + 2} y={ey}
                width={HED_W - 4} height={4}
                fill={WARP} rx="1" />
            );
          })}
        </g>

        {/* heddle suspension strings */}
        <line x1={HED1_X} y1={LM_YT + 14} x2={HED1_X}
          y2={HED_YR - HED_HH + hed1Off}
          stroke={DOAK} strokeWidth="2" strokeOpacity="0.45" />
        <line x1={HED2_X} y1={LM_YT + 14} x2={HED2_X}
          y2={HED_YR - HED_HH + hed2Off}
          stroke={DOAK} strokeWidth="2" strokeOpacity="0.45" />
        {/* heddle to treadle strings */}
        <line x1={HED1_X} y1={HED_YR + HED_HH + hed1Off}
          x2={TR_X1 + 18} y2={TR_Y - 6}
          stroke={DOAK} strokeWidth="2" strokeOpacity="0.45" />
        <line x1={HED2_X} y1={HED_YR + HED_HH + hed2Off}
          x2={TR_X1 + 34} y2={TR_Y - 6}
          stroke={DOAK} strokeWidth="2" strokeOpacity="0.45" />

        {/* ── Beater / Reed ────────────────────────────────── */}
        <g transform={`rotate(${beatAng}, ${BEAT_HX - 52}, ${LM_YT + 8})`}>
          <line x1={BEAT_HX - 52} y1={LM_YT + 8}
            x2={BEAT_HX - 52} y2={LM_YT + 8 + BEAT_LEN + 16}
            stroke={DOAK} strokeWidth="9" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${beatAng}, ${BEAT_HX + 52}, ${LM_YT + 8})`}>
          <line x1={BEAT_HX + 52} y1={LM_YT + 8}
            x2={BEAT_HX + 52} y2={LM_YT + 8 + BEAT_LEN + 16}
            stroke={DOAK} strokeWidth="9" strokeLinecap="round" />
        </g>
        {/* reed frame rotates around midpoint */}
        <g transform={`rotate(${beatAng}, ${BEAT_HX}, ${LM_YT + 8})`}>
          <line x1={BEAT_HX - 56} y1={WRP_Y1 - 18}
            x2={BEAT_HX + 56} y2={WRP_Y1 - 18}
            stroke={OAK} strokeWidth="8" />
          <line x1={BEAT_HX - 56} y1={WRP_Y2 + 18}
            x2={BEAT_HX + 56} y2={WRP_Y2 + 18}
            stroke={OAK} strokeWidth="8" />
          {Array.from({ length: 22 }, (_, d) => {
            const dx = BEAT_HX - 50 + d * 100 / 21;
            return (
              <line key={d}
                x1={dx} y1={WRP_Y1 - 12}
                x2={dx} y2={WRP_Y2 + 12}
                stroke={WARP2} strokeWidth="1.5" strokeOpacity="0.55" />
            );
          })}
        </g>
        {/* beater hinge pins */}
        <circle cx={BEAT_HX - 52} cy={LM_YT + 8} r={7} fill={DOAK} />
        <circle cx={BEAT_HX + 52} cy={LM_YT + 8} r={7} fill={DOAK} />

        {/* ── Flying Shuttle ──────────────────────────────── */}
        <g transform={`translate(${shttlX}, ${WRP_MID})`}>
          <path d="M -34 0 C -26 -7 26 -7 34 0 C 26 7 -26 7 -34 0 Z"
            fill="#7a4e14" />
          <ellipse cx="0" cy="-1" rx="16" ry="4" fill="#c07820" opacity="0.85" />
          <rect x="-10" y="-3" width="20" height="6" rx="3" fill="#c83020" />
          {/* trailing weft thread back to cloth beam */}
          <line x1="-34" y1="0"
            x2={CLTH_BX - shttlX} y2={0}
            stroke="#c83020" strokeWidth="1.5" strokeOpacity="0.5"
            strokeDasharray="5 3" />
        </g>

        {/* ── Treadles ────────────────────────────────────── */}
        <line x1={TR_X1} y1={TR_Y}
          x2={TR_X2} y2={TR_Y + tLdown}
          stroke={OAK} strokeWidth="9" strokeLinecap="round" />
        <line x1={TR_X1} y1={TR_Y + 20}
          x2={TR_X2} y2={TR_Y + 20 + tRdown}
          stroke={OAK} strokeWidth="9" strokeLinecap="round" />
        <circle cx={TR_X1} cy={TR_Y}      r={6} fill={DOAK} />
        <circle cx={TR_X1} cy={TR_Y + 20} r={6} fill={DOAK} />

        {/* ── Weaver Figure ───────────────────────────────── */}
        {/* bench */}
        <rect x={WVR_X - 46} y={WVR_SY + 64} width={92} height={11}
          fill={OAK} rx="2" filter="url(#wl-sd)" />
        <rect x={WVR_X - 36} y={WVR_SY + 74} width={12} height={34} fill={OAK} />
        <rect x={WVR_X + 24} y={WVR_SY + 74} width={12} height={34} fill={OAK} />
        {/* legs */}
        <line x1={WVR_X - 14} y1={WVR_SY + 72}
          x2={WVR_X - 14} y2={TR_Y + tLdown}
          stroke="#2a4060" strokeWidth="12" strokeLinecap="round" />
        <line x1={WVR_X + 10} y1={WVR_SY + 72}
          x2={WVR_X + 10} y2={TR_Y + 20 + tRdown}
          stroke="#2a4060" strokeWidth="12" strokeLinecap="round" />
        {/* feet */}
        <ellipse cx={WVR_X - 14} cy={TR_Y + tLdown}      rx="13" ry="5" fill="#2a4060" />
        <ellipse cx={WVR_X + 10} cy={TR_Y + 20 + tRdown} rx="13" ry="5" fill="#2a4060" />
        {/* body */}
        <rect x={WVR_X - 20} y={WVR_SY} width={40} height={66}
          fill="#2a4060" rx="8" />
        {/* apron */}
        <rect x={WVR_X - 16} y={WVR_SY + 26} width={32} height={38}
          fill="#e8e0c4" rx="3" />
        {/* left arm resting on beam */}
        <line x1={WVR_X - 16} y1={WVR_SY + 14}
          x2={WVR_X - 46} y2={WVR_SY + 42}
          stroke="#d4a870" strokeWidth="11" strokeLinecap="round" />
        <line x1={WVR_X - 46} y1={WVR_SY + 42}
          x2={WVR_X - 60} y2={WVR_SY + 54}
          stroke="#d4a870" strokeWidth="9" strokeLinecap="round" />
        {/* throwing arm */}
        <line x1={WVR_SX} y1={WVR_SY + 10}
          x2={elX} y2={elY}
          stroke="#d4a870" strokeWidth="11" strokeLinecap="round" />
        <line x1={elX} y1={elY}
          x2={wrX} y2={wrY}
          stroke="#d4a870" strokeWidth="9" strokeLinecap="round" />
        {/* head */}
        <circle cx={WVR_X} cy={WVR_HY} r={23} fill="#e8b882" />
        {/* mob cap */}
        <path d={`M ${WVR_X - 26} ${WVR_HY - 2}`
          + ` C ${WVR_X - 30} ${WVR_HY - 38} ${WVR_X + 30} ${WVR_HY - 38} ${WVR_X + 26} ${WVR_HY - 2}`
          + ` C ${WVR_X + 20} ${WVR_HY - 18} ${WVR_X - 20} ${WVR_HY - 18} ${WVR_X - 26} ${WVR_HY - 2}`}
          fill="#f2ece0" />
        {/* kerchief */}
        <path d={`M ${WVR_X - 22} ${WVR_HY + 16} L ${WVR_X} ${WVR_HY + 30} L ${WVR_X + 22} ${WVR_HY + 16}`}
          fill="#e8d4b4" />

        {/* ── Thread spool rack (right) ────────────────────── */}
        <rect x={1104} y={340} width={262} height={12} fill={OAK} rx="2" />
        <rect x={1104} y={352} width={6}   height={82} fill={OAK} />
        <rect x={1360} y={352} width={6}   height={82} fill={OAK} />
        {SPOOLS.map(([sx, col]: SP2) => (
          <g key={sx}>
            <rect x={sx - 15} y={308} width={30} height={32} rx="5" fill={col} />
            <ellipse cx={sx} cy={308} rx={15} ry={6} fill={col} />
            <ellipse cx={sx} cy={340} rx={15} ry={6} fill={col} />
            <ellipse cx={sx} cy={324} rx={9}  ry={3} fill="#f0e8d8" opacity="0.8" />
          </g>
        ))}

        {/* warping board on wall (right of window) */}
        <rect x={1114} y={336} width={176} height={96} rx="4"
          fill="#e8d8b0" stroke={OAK} strokeWidth="4" />
        <text x={1202} y={356} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="9" fill={DOAK} letterSpacing="1">
          WARPING BOARD
        </text>
        {/* pegs */}
        {Array.from({ length: 6 }, (_, p) => {
          const px = 1128 + p * 30;
          return (
            <g key={p}>
              <circle cx={px} cy={372} r={5} fill={OAK} />
              <circle cx={px} cy={412} r={5} fill={OAK} />
            </g>
          );
        })}
        {/* warp wound around pegs */}
        {Array.from({ length: 5 }, (_, p) => {
          const px = 1128 + p * 30;
          return (
            <line key={p}
              x1={px + 5} y1={372} x2={px + 35} y2={412}
              stroke={WARP} strokeWidth="1.5" strokeOpacity="0.7" />
          );
        })}

        {/* ── Caption ──────────────────────────────────────── */}
        <text x={W / 2} y={492}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13" fill={DOAK} letterSpacing="2.5">
          SHREWSBURY WOOLEN WORKS · HAND-LOOM WEAVING · EST. 1793
        </text>
      </svg>
    </section>
  );
}
