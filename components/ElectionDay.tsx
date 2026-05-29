"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const FLOOR_Y = H - 58;

// ── Town Hall ─────────────────────────────────────────────────────────────
const HALL_X = 118, HALL_W = 372, HALL_H = 272;
const HALL_Y = FLOOR_Y - HALL_H;

// ── Polling table ─────────────────────────────────────────────────────────
const TABLE_X = 562, TABLE_W = 130, TABLE_Y = FLOOR_Y - 55;

// ── Voter queue ───────────────────────────────────────────────────────────
const VOTERS = Array.from({ length: 7 }, (_, i) => ({
  x: TABLE_X + TABLE_W + 18 + i * 50,
  ph: i * 0.72,
}));

// ── Campaign bunting ──────────────────────────────────────────────────────
const POST_L = 498, POST_R = 992, BUNTING_Y = FLOOR_Y - 232;

// ── Elm trees ─────────────────────────────────────────────────────────────
const ELMS = [
  { x: 64,  h: 200, r: 88, fill: "#c87820", light: "#f0a820" },
  { x: 154, h: 182, r: 76, fill: "#b86818", light: "#d89020" },
  { x: 244, h: 170, r: 70, fill: "#c87820", light: "#e09828" },
] as const;

// ── Falling leaves ────────────────────────────────────────────────────────
const LEAVES = Array.from({ length: 28 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  return {
    x:     36 + ((Math.cos(a) + 1) / 2) * 545,
    baseY: 55 + ((Math.sin(a) + 1) / 2) * (FLOOR_Y - 160),
    ph:    i  * 0.44,
    spd:   0.30 + (i % 4) * 0.08,
    size:  5   + (i % 3) * 2.5,
    hue:   20  + (i % 4) * 8,
  };
});

// ── Far buildings ─────────────────────────────────────────────────────────
const FAR_BLDGS = [
  { x: 908,  w: 120, h: 144, fill: "#c8b898" },
  { x: 1038, w: 100, h: 114, fill: "#b8a888" },
  { x: 1146, w: 86,  h: 94,  fill: "#c4b494" },
  { x: 1240, w: 68,  h: 74,  fill: "#b8a880" },
] as const;

const BUNTING_COLORS = ["#c82020", "#f0f0e0", "#2050a8"] as const;
const VOTER_COATS    = ["#2a2a2a", "#3a2818", "#1a2838", "#2a1818", "#383020", "#1a2a1a", "#302020"] as const;
const HAT_COLORS     = ["#1a1a1a", "#2a2010", "#1a1a1a", "#2a1a1a", "#1a1a1a", "#382818", "#1a1a1a"] as const;
const N_COLS = 4;

export function ElectionDay() {
  const [active, setActive] = useState(false);
  const [phase,  setPhase]  = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [active]);

  const bellAngle = Math.sin(phase * 4.8) * 28;
  const flagWave  = Math.sin(phase * 3.2) * 6;

  const buntY = (x: number): number => {
    const t = (x - POST_L) / (POST_R - POST_L);
    return BUNTING_Y + 62 * 4 * t * (1 - t);
  };
  const ropeY = (x: number): number =>
    buntY(x) + Math.sin((x / 178) * Math.PI * 2 + phase * 1.8) * 4;

  return (
    <section style={{ background: "#b0bcc8", overflow: "hidden" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="Shrewsbury Town Square Election Day 1876 — voters queue at polling table, town crier with bell, Greek-revival town hall, autumn elm trees, Hayes vs Tilden campaign bunting"
        role="img"
      >
        <defs>
          <linearGradient id="ed-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8898a8" />
            <stop offset="55%"  stopColor="#a8b8c4" />
            <stop offset="100%" stopColor="#bcccd0" />
          </linearGradient>
          <linearGradient id="ed-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a8478" />
            <stop offset="100%" stopColor="#706a60" />
          </linearGradient>
          <radialGradient id="ed-hall-glow" cx="50%" cy="0%" r="70%">
            <stop offset="0%"   stopColor="#fff8e0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff8e0" stopOpacity="0"   />
          </radialGradient>
          <filter id="ed-shadow">
            <feDropShadow dx="3" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ── Sky & clouds ─────────────────────────────────────────────── */}
        <rect width={W} height={FLOOR_Y + 8} fill="url(#ed-sky)" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i}
            cx={105 + i * 208 + Math.sin(phase * 0.04 + i * 1.1) * 8}
            cy={50  + (i % 3) * 26}
            rx={160 + (i % 3) * 48}
            ry={18  + (i % 2) * 8}
            fill="#c0cccc" opacity={0.38 + (i % 3) * 0.06}
          />
        ))}

        {/* ── Cobblestone ground ───────────────────────────────────────── */}
        <rect x="0" y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#ed-ground)" />
        {Array.from({ length: 12 }, (_, ri) =>
          Array.from({ length: 30 }, (_, ci) => {
            const cx = ci * 44 + (ri % 2) * 22;
            const cy = FLOOR_Y + 6 + ri * 15;
            if (cy > H - 3) return null;
            return (
              <ellipse key={`${ri}-${ci}`}
                cx={cx} cy={cy} rx={17} ry={5.5}
                fill={`hsl(28,${10 + (ri + ci) % 3 * 4}%,${36 + (ri + ci) % 4 * 4}%)`}
                stroke="#585048" strokeWidth="0.8"
              />
            );
          })
        )}

        {/* ── Far background buildings ──────────────────────────────────── */}
        {FAR_BLDGS.map((b, bi) => (
          <g key={bi}>
            <rect x={b.x} y={FLOOR_Y - b.h} width={b.w} height={b.h} fill={b.fill} />
            <rect x={b.x} y={FLOOR_Y - b.h - 9} width={b.w} height={11} fill="#8a7868" />
            {Array.from({ length: Math.floor(b.w / 28) }, (_, wi) => (
              <rect key={wi}
                x={b.x + 10 + wi * 28} y={FLOOR_Y - b.h + 18}
                width={14} height={20}
                fill="#6a7888" stroke="#9a9888" strokeWidth="1" rx="1"
              />
            ))}
          </g>
        ))}

        {/* ── Elm trees (autumn gold) ───────────────────────────────────── */}
        {ELMS.map((el, ei) => {
          const sw = Math.sin(phase * 0.9 + ei * 0.6) * 1.6;
          return (
            <g key={ei} transform={`translate(${el.x}, 0)`}>
              <rect x="-11" y={FLOOR_Y - el.h + 44} width="22" height={Math.round(el.h * 0.44)}
                fill="#4a3018" rx="5" />
              <ellipse cx="0" cy={FLOOR_Y - el.h} rx={el.r} ry={Math.round(el.r * 0.74)}
                fill={el.fill} transform={`rotate(${sw})`} />
              <ellipse cx={Math.round(-el.r * 0.3)} cy={FLOOR_Y - el.h + 22}
                rx={Math.round(el.r * 0.7)} ry={Math.round(el.r * 0.56)}
                fill={el.fill} opacity="0.82" />
              <ellipse cx={Math.round(el.r * 0.28)} cy={FLOOR_Y - el.h + 18}
                rx={Math.round(el.r * 0.6)} ry={Math.round(el.r * 0.5)}
                fill={el.fill} opacity="0.78" />
              <ellipse cx="0" cy={FLOOR_Y - el.h - 8}
                rx={Math.round(el.r * 0.34)} ry={Math.round(el.r * 0.27)}
                fill={el.light} opacity="0.44" />
            </g>
          );
        })}

        {/* ── Falling leaves ────────────────────────────────────────────── */}
        {LEAVES.map((lf, li) => {
          const roomH = FLOOR_Y - 60;
          const rawY  = lf.baseY - ((phase * lf.spd * 14 + lf.ph * 24) % roomH);
          const leafY = ((rawY % roomH) + roomH) % roomH + 60;
          const leafX = lf.x + Math.sin(phase * lf.spd * 1.8 + lf.ph) * 14;
          const rot   = lf.hue + phase * lf.spd * 90;
          return (
            <ellipse key={li}
              cx={leafX} cy={leafY}
              rx={lf.size} ry={Math.round(lf.size * 0.55)}
              fill={`hsl(${lf.hue},70%,48%)`}
              transform={`rotate(${rot}, ${leafX}, ${leafY})`}
              opacity="0.82"
            />
          );
        })}

        {/* ── Town Hall ─────────────────────────────────────────────────── */}
        <g filter="url(#ed-shadow)">
          <rect x={HALL_X} y={HALL_Y} width={HALL_W} height={HALL_H} fill="#f0ece0" />
          <rect x={HALL_X} y={HALL_Y} width={HALL_W} height={HALL_H} fill="url(#ed-hall-glow)" />
          {/* Pediment */}
          <polygon
            points={`${HALL_X - 12},${HALL_Y + 5} ${HALL_X + HALL_W / 2},${HALL_Y - 55} ${HALL_X + HALL_W + 12},${HALL_Y + 5}`}
            fill="#e8e4d8"
          />
          <polygon
            points={`${HALL_X + 2},${HALL_Y + 5} ${HALL_X + HALL_W / 2},${HALL_Y - 46} ${HALL_X + HALL_W - 2},${HALL_Y + 5}`}
            fill="#f0ece0"
          />
          {/* Entablature band */}
          <rect x={HALL_X - 8} y={HALL_Y + 5} width={HALL_W + 16} height={26} fill="#e0dcd0" />
          {/* Doric columns */}
          {Array.from({ length: N_COLS }, (_, ci) => {
            const colX = HALL_X + 20 + ci * Math.round((HALL_W - 40) / (N_COLS - 1));
            const colH = Math.round(HALL_H * 0.62);
            return (
              <g key={ci}>
                <rect x={colX - 9} y={HALL_Y + 31} width={18} height={colH} fill="#e8e4d8" rx="4" />
                {[-3, 0, 3].map((fx, fi) => (
                  <line key={fi}
                    x1={colX + fx} y1={HALL_Y + 31}
                    x2={colX + fx} y2={HALL_Y + 31 + colH}
                    stroke="#d4d0c4" strokeWidth="0.8" opacity="0.5"
                  />
                ))}
                <rect x={colX - 11} y={HALL_Y + 26} width={22} height={8} fill="#d8d4c8" rx="1" />
                <rect x={colX - 11} y={HALL_Y + 31 + colH} width={22} height={6} fill="#d0ccc0" />
              </g>
            );
          })}
          {/* Windows */}
          {[0.22, 0.5, 0.78].map((f, wi) => (
            <g key={wi}>
              <rect
                x={HALL_X + Math.round(HALL_W * f) - 16}
                y={HALL_Y + Math.round(HALL_H * 0.3)}
                width={32} height={52}
                fill="#7a90a0" stroke="#c0bcb0" strokeWidth="2" rx="2"
              />
              <line
                x1={HALL_X + Math.round(HALL_W * f)}
                y1={HALL_Y + Math.round(HALL_H * 0.3)}
                x2={HALL_X + Math.round(HALL_W * f)}
                y2={HALL_Y + Math.round(HALL_H * 0.3) + 52}
                stroke="#c0bcb0" strokeWidth="1.5"
              />
            </g>
          ))}
          {/* Hall name */}
          <text x={HALL_X + HALL_W / 2} y={HALL_Y + Math.round(HALL_H * 0.77)}
            textAnchor="middle" fontSize="13" fill="#8a8070"
            fontFamily="Georgia, serif" letterSpacing="2.5">
            SHREWSBURY TOWN HALL
          </text>
          <text x={HALL_X + HALL_W / 2} y={HALL_Y + Math.round(HALL_H * 0.87)}
            textAnchor="middle" fontSize="10" fill="#a09880"
            fontFamily="Georgia, serif" letterSpacing="1.5">
            EST. 1840
          </text>
          {/* Steps */}
          <rect x={HALL_X + 32} y={FLOOR_Y - 24} width={HALL_W - 64} height={11} fill="#d8d4c8" />
          <rect x={HALL_X + 20} y={FLOOR_Y - 13} width={HALL_W - 40} height={15} fill="#e0dcd0" />
        </g>

        {/* ── American flag on roof ─────────────────────────────────────── */}
        <g transform={`translate(${HALL_X + HALL_W / 2 - 4}, ${HALL_Y - 55})`}>
          <line x1="0" y1="0" x2="0" y2="-68" stroke="#aaa" strokeWidth="2.5" />
          <path
            d={`M0,-68 L48,-68 Q${44 + flagWave},-61 48,-55 Q${44 + flagWave * 0.6},-48 48,-41 L0,-41 Z`}
            fill="#c82020"
          />
          {[5, 10, 15, 20].map((dy, si) => (
            <path key={si}
              d={`M0,${-68 + dy} L48,${-68 + dy} Q${44 + flagWave * (1 - si * 0.18)},${-68 + dy + 3} 48,${-68 + dy + 5} L0,${-68 + dy + 5} Z`}
              fill="#f0f0e0" opacity="0.88"
            />
          ))}
          <rect x="0" y="-68" width="22" height="16" fill="#2050a8" />
          {[3, 7, 11, 15, 19].map((sx, si) => (
            <circle key={si} cx={sx} cy={-68 + 4 + (si % 2) * 4} r="1.1" fill="white" />
          ))}
          {[4, 10, 16, 20].map((sx, si) => (
            <circle key={si} cx={sx} cy="-57" r="1" fill="white" />
          ))}
        </g>

        {/* ── Banner posts ──────────────────────────────────────────────── */}
        <line x1={POST_L} y1={BUNTING_Y} x2={POST_L} y2={FLOOR_Y} stroke="#5a4020" strokeWidth="5" />
        <line x1={POST_R} y1={BUNTING_Y} x2={POST_R} y2={FLOOR_Y} stroke="#5a4020" strokeWidth="5" />

        {/* Campaign signs on posts */}
        <g transform={`translate(${POST_L - 44}, ${BUNTING_Y + 108})`}>
          <rect x="0" y="0" width="82" height="44" fill="#c82020" rx="3" />
          <text x="41" y="16" textAnchor="middle" fontSize="9.5" fill="white"
            fontFamily="Georgia, serif" letterSpacing="1.2">VOTE FOR</text>
          <text x="41" y="32" textAnchor="middle" fontSize="14" fill="#ffe880"
            fontFamily="Georgia, serif" fontWeight="bold">HAYES</text>
        </g>
        <g transform={`translate(${POST_R - 38}, ${BUNTING_Y + 108})`}>
          <rect x="0" y="0" width="82" height="44" fill="#2050a8" rx="3" />
          <text x="41" y="16" textAnchor="middle" fontSize="9.5" fill="white"
            fontFamily="Georgia, serif" letterSpacing="1.2">VOTE FOR</text>
          <text x="41" y="32" textAnchor="middle" fontSize="14" fill="#ffe880"
            fontFamily="Georgia, serif" fontWeight="bold">TILDEN</text>
        </g>

        {/* ── Bunting catenary ──────────────────────────────────────────── */}
        <path
          d={`M${POST_L},${BUNTING_Y} Q${(POST_L + POST_R) / 2},${BUNTING_Y + 62 + Math.sin(phase * 1.8) * 5} ${POST_R},${BUNTING_Y}`}
          fill="none" stroke="#8a6830" strokeWidth="2.2"
        />
        {Array.from({ length: 19 }, (_, i) => {
          const t     = (i + 0.5) / 19;
          const px    = POST_L + t * (POST_R - POST_L);
          const py    = ropeY(px);
          const color = BUNTING_COLORS[i % 3] ?? "#c82020";
          const sway  = Math.sin(phase * 3.4 + i * 0.7) * 5;
          return (
            <polygon key={i}
              points={`${px - 9},${py} ${px + 9},${py} ${px + sway},${py + 22}`}
              fill={color}
            />
          );
        })}
        {/* Main banner */}
        <g transform={`translate(${(POST_L + POST_R) / 2}, ${BUNTING_Y + 68})`}>
          <rect x="-152" y="0" width="304" height="34" fill="#1a2a6a" rx="3" />
          <rect x="-148" y="3" width="296" height="28"
            fill="none" stroke="#c8a020" strokeWidth="1.5" rx="2" />
          <text x="0" y="21"
            textAnchor="middle" fontSize="14.5"
            fill="#f0d060" fontFamily="Georgia, serif" letterSpacing="2">
            ELECTION DAY · NOV. 2, 1876
          </text>
        </g>

        {/* ── Polling table ─────────────────────────────────────────────── */}
        <rect x={TABLE_X} y={TABLE_Y} width={TABLE_W} height={14} fill="#8a6840" rx="2" />
        <line x1={TABLE_X + 12} y1={TABLE_Y + 12} x2={TABLE_X + 8} y2={FLOOR_Y}
          stroke="#6a5030" strokeWidth="4" />
        <line x1={TABLE_X + TABLE_W - 12} y1={TABLE_Y + 12} x2={TABLE_X + TABLE_W - 8} y2={FLOOR_Y}
          stroke="#6a5030" strokeWidth="4" />
        <rect x={TABLE_X - 4} y={TABLE_Y + 12} width={TABLE_W + 8} height={8}
          fill="#2050a8" opacity="0.68" />
        {/* Papers on table */}
        <rect x={TABLE_X + 10} y={TABLE_Y - 7} width={30} height={9}
          fill="#f0e8d0" stroke="#c0b898" strokeWidth="0.8" />
        <rect x={TABLE_X + 12} y={TABLE_Y - 9} width={28} height={9}
          fill="#f0e8d0" stroke="#c0b898" strokeWidth="0.8"
          transform={`rotate(-4, ${TABLE_X + 26}, ${TABLE_Y - 4})`} />
        <ellipse cx={TABLE_X + TABLE_W - 22} cy={TABLE_Y + 4} rx="7" ry="5" fill="#1a1a1a" />
        <ellipse cx={TABLE_X + TABLE_W - 22} cy={TABLE_Y + 2} rx="5" ry="3.5" fill="#2a2a2a" />
        {/* VOTE HERE sign */}
        <rect x={TABLE_X + TABLE_W / 2 - 40} y={TABLE_Y - 42} width={80} height={28}
          fill="#c82020" rx="3" />
        <text x={TABLE_X + TABLE_W / 2} y={TABLE_Y - 23}
          textAnchor="middle" fontSize="12.5"
          fill="white" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="1">
          VOTE HERE
        </text>

        {/* ── Registrar seated at table ─────────────────────────────────── */}
        <g transform={`translate(${TABLE_X + 38}, ${FLOOR_Y})`}>
          <rect x="-8" y="-74" width="16" height="30" fill="#2a2018" rx="3" />
          <rect x="-12" y="-44" width="24" height="20" fill="#2a2018" rx="2" />
          <ellipse cx="0" cy="-80" rx="9" ry="10" fill="#d4906a" />
          <ellipse cx="0" cy="-89" rx="11" ry="4" fill="#1a1a1a" />
          <rect x="-8" y="-107" width="16" height="20" fill="#1a1a1a" rx="1" />
          {/* Writing arm */}
          <line x1="8" y1="-68" x2="26" y2="-58" stroke="#d4906a" strokeWidth="4" strokeLinecap="round" />
          <line x1="26" y1="-58" x2="38" y2="-48" stroke="#e8e0b0" strokeWidth="2" strokeLinecap="round" />
          {/* Glasses */}
          <circle cx="-4" cy="-79" r="4" fill="none" stroke="#888" strokeWidth="1.2" />
          <circle cx="5"  cy="-79" r="4" fill="none" stroke="#888" strokeWidth="1.2" />
          <line x1="-8" y1="-79" x2="-10" y2="-78" stroke="#888" strokeWidth="1.2" />
        </g>

        {/* ── Voter queue ───────────────────────────────────────────────── */}
        {VOTERS.map((v, vi) => {
          const sway = Math.sin(phase * 0.85 + v.ph) * 1.8;
          const coat = VOTER_COATS[vi % 7] ?? "#2a2a2a";
          const hat  = HAT_COLORS [vi % 7] ?? "#1a1a1a";
          return (
            <g key={vi} transform={`translate(${v.x}, ${FLOOR_Y + sway})`}>
              {/* Coat body */}
              <rect x="-9" y="-80" width="18" height="34" fill={coat} rx="3" />
              {/* Coat lapels */}
              <path d="M-4,-80 L-2,-62 M4,-80 L2,-62"
                fill="none" stroke="#4a3a20" strokeWidth="1.4" opacity="0.45" />
              {/* Trousers */}
              <line x1="-5" y1="-46" x2="-6" y2="-10"
                stroke={coat} strokeWidth="6" strokeLinecap="round" />
              <line x1="5"  y1="-46" x2="6"  y2="-10"
                stroke={coat} strokeWidth="6" strokeLinecap="round" />
              {/* Shoes */}
              <ellipse cx="-5" cy="-5" rx="7" ry="3.5" fill="#1a1410" />
              <ellipse cx="6"  cy="-5" rx="7" ry="3.5" fill="#1a1410" />
              {/* Head */}
              <ellipse cx={vi === 0 ? 4 : 0} cy="-88" rx="9" ry="10" fill="#c8906a" />
              {/* Top hat */}
              <ellipse cx={vi === 0 ? 4 : 0} cy="-97" rx="11" ry="4" fill={hat} />
              <rect x={vi === 0 ? -4 : -8} y="-115" width="16" height="20" fill={hat} rx="1" />
              {/* First voter reaches toward table */}
              {vi === 0 && (
                <line x1="-9" y1="-72" x2="-42" y2="-62"
                  stroke="#c8906a" strokeWidth="4" strokeLinecap="round" />
              )}
              {/* Second voter holds ballot paper */}
              {vi === 1 && (
                <g transform="rotate(8, -14, -58)">
                  <rect x="-22" y="-68" width="14" height="18"
                    fill="#f0e8d0" stroke="#c0b090" strokeWidth="0.8" />
                  <line x1="-22" y1="-62" x2="-8" y2="-62" stroke="#8a7858" strokeWidth="0.8" />
                  <line x1="-22" y1="-56" x2="-8" y2="-56" stroke="#8a7858" strokeWidth="0.8" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── Town crier (left of table) ────────────────────────────────── */}
        <g transform={`translate(514, ${FLOOR_Y})`}>
          {/* Red coat body */}
          <rect x="-10" y="-90" width="20" height="38" fill="#8a2020" rx="3" />
          {/* Coat skirts */}
          <path d="M-14,-52 L-20,-20 L-10,-20 Z" fill="#8a2020" />
          <path d="M14,-52 L20,-20 L10,-20 Z"  fill="#8a2020" />
          {/* Gold trim */}
          <line x1="-10" y1="-88" x2="-10" y2="-52" stroke="#c8a020" strokeWidth="2" />
          <line x1="10"  y1="-88" x2="10"  y2="-52" stroke="#c8a020" strokeWidth="2" />
          {/* Trousers */}
          <line x1="-5" y1="-52" x2="-6" y2="-8" stroke="#2a2040" strokeWidth="7" strokeLinecap="round" />
          <line x1="5"  y1="-52" x2="6"  y2="-8" stroke="#2a2040" strokeWidth="7" strokeLinecap="round" />
          {/* Buckle shoes */}
          <ellipse cx="-5" cy="-4" rx="7" ry="3.5" fill="#1a1a1a" />
          <ellipse cx="6"  cy="-4" rx="7" ry="3.5" fill="#1a1a1a" />
          {/* Buckle */}
          <rect cx="-5" cy="-3" x="-7" y="-7" width="5" height="4" fill="#c8a820" opacity="0" />
          {/* Head */}
          <ellipse cx="0" cy="-98" rx="10" ry="11" fill="#d4906a" />
          {/* Tricorn hat */}
          <ellipse cx="0" cy="-108" rx="14" ry="5" fill="#1a1a1a" />
          <polygon points="-12,-108 0,-124 12,-108" fill="#1a1a1a" />
          {/* Animated bell arm */}
          <g transform={`rotate(${bellAngle}, -10, -82)`}>
            <line x1="-10" y1="-82" x2="-10" y2="-44"
              stroke="#d4906a" strokeWidth="5" strokeLinecap="round" />
            <path d="M-18,-42 Q-10,-30 -2,-42 Z" fill="#c8a820" />
            <ellipse cx="-10" cy="-42" rx="8" ry="4" fill="#c8a820" />
            <circle cx="-10" cy="-36" r="2" fill="#8a6810" />
          </g>
          {/* Scroll in right hand */}
          <line x1="10" y1="-82" x2="18" y2="-54" stroke="#d4906a" strokeWidth="5" strokeLinecap="round" />
          <rect x="14" y="-54" width="20" height="28" fill="#f0e8d0" rx="2" />
          {["HEAR", "YE!", "POLLS", "OPEN"].map((word, wi) => (
            <text key={wi} x="24" y={-50 + wi * 7}
              textAnchor="middle" fontSize="5"
              fill="#5a4830" fontFamily="Georgia, serif">
              {word}
            </text>
          ))}
        </g>

        {/* ── Horse and carriage (right bg) ─────────────────────────────── */}
        <g transform={`translate(1086, ${FLOOR_Y})`}>
          {/* Carriage */}
          <rect x="-56" y="-80" width="112" height="60" fill="#2a1808" rx="6" />
          <rect x="-50" y="-76" width="100" height="52" fill="#381e0a" rx="4" />
          <rect x="-36" y="-70" width="30" height="28" fill="#5a7888" rx="2" />
          <rect x="8"   y="-70" width="30" height="28" fill="#5a7888" rx="2" />
          <rect x="-58" y="-86" width="116" height="10" fill="#3a2010" rx="3" />
          {/* Wheels */}
          {[-40, 40].map((wx, wi) => (
            <g key={wi}>
              <circle cx={wx} cy="0" r="25" fill="none" stroke="#4a3010" strokeWidth="5" />
              <circle cx={wx} cy="0" r="6" fill="#4a3010" />
              {[0, 51, 102, 153, 204, 255, 306].map((ang, si) => (
                <line key={si}
                  x1={wx} y1="0"
                  x2={wx + Math.round(Math.cos(ang * Math.PI / 180) * 20)}
                  y2={Math.round(Math.sin(ang * Math.PI / 180) * 20)}
                  stroke="#5a4020" strokeWidth="2.5"
                />
              ))}
            </g>
          ))}
          {/* Horse */}
          <g transform="translate(-94, -50)">
            <ellipse cx="0" cy="0" rx="42" ry="18" fill="#6a4820" />
            <path d="M40,-15 Q60,-24 62,-34 Q64,-44 54,-46 Q44,-48 42,-38 Q40,-28 40,-15"
              fill="#6a4820" />
            <line x1="-26" y1="14" x2="-28" y2="50" stroke="#5a3818" strokeWidth="6" strokeLinecap="round" />
            <line x1="-8"  y1="14" x2="-8"  y2="50" stroke="#5a3818" strokeWidth="6" strokeLinecap="round" />
            <line x1="10"  y1="14" x2="12"  y2="50" stroke="#5a3818" strokeWidth="6" strokeLinecap="round" />
            <line x1="26"  y1="14" x2="24"  y2="50" stroke="#5a3818" strokeWidth="6" strokeLinecap="round" />
            <path d={`M-42,4 Q-60,12 ${Math.round(-54 + Math.sin(phase * 2.2) * 8)},28`}
              fill="none" stroke="#4a3010" strokeWidth="5" strokeLinecap="round" />
            <circle cx="54" cy="-40" r="3" fill="#1a1008" />
          </g>
        </g>

        {/* Scene caption */}
        <text x={W / 2} y={H - 10}
          textAnchor="middle" fontSize="12"
          fill="#3a3028" fontFamily="Georgia, serif" opacity="0.65" letterSpacing="0.5">
          Shrewsbury Town Square · Election Day · November 2, 1876 · Hayes vs. Tilden
        </text>

        {/* Reveal overlay */}
        <rect width={W} height={H} fill="#b0bcc8"
          style={{ opacity: active ? 0 : 1, transition: "opacity 1.2s ease", pointerEvents: "none" }}
        />
      </svg>
    </section>
  );
}
