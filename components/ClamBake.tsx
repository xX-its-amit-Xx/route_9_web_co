"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const HORIZON_Y = 225;
const BEACH_Y = H - 85;
const PIT_CX = 400, PIT_CY = BEACH_Y - 34, PIT_R = 56;
const LH_X = 1085, LH_BASE_Y = HORIZON_Y - 28, LH_H = 142;
const LH_LAN_Y = LH_BASE_Y - 28 - LH_H + 10;

const STONES = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2;
  const pr = PIT_R + 2 + (i % 3) * 2;
  return {
    cx: PIT_CX + Math.cos(a) * pr,
    cy: PIT_CY + Math.sin(a) * pr * 0.45,
    rx: 11 + (i % 4) * 3,
    ry: 7 + (i % 3) * 2,
    shade: 25 + (i % 5) * 5,
  };
});

const COALS = Array.from({ length: 44 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  const rad = 6 + (i % 5) * 9;
  return {
    cx: PIT_CX + Math.cos(a) * rad,
    cy: PIT_CY + Math.sin(a) * rad * 0.38,
    r: 3 + (i % 3) * 2,
    ph: i * 0.31,
  };
});

const EMBERS = Array.from({ length: 30 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  return {
    ax: PIT_CX + Math.cos(a) * (4 + (i % 5) * 7),
    baseY: PIT_CY - 28 - (i % 5) * 14,
    r: 1.5 + (i % 3) * 0.7,
    ph: i * 0.38,
    spd: 0.65 + (i % 4) * 0.22,
  };
});

const GULLS = Array.from({ length: 6 }, (_, i) => ({
  ax: 190 + i * 172,
  ay: HORIZON_Y - 42 - (i % 3) * 22,
  r: 30 + (i % 3) * 14,
  ph: i * 1.08,
  spd: 0.55 + (i % 3) * 0.15,
}));

const ROCKS = [
  { x: 80,   y: BEACH_Y + 10, rx: 32, ry: 15 },
  { x: 148,  y: BEACH_Y + 20, rx: 22, ry: 11 },
  { x: 1185, y: BEACH_Y + 14, rx: 28, ry: 13 },
  { x: 1236, y: BEACH_Y + 22, rx: 20, ry: 10 },
  { x: 542,  y: BEACH_Y + 24, rx: 18, ry: 9  },
] as const;

const TABLES = [
  { x: 648, w: 148, people: 4 },
  { x: 842, w: 142, people: 3 },
] as const;

const SHIRT_COLORS = ["#c84820", "#2a5e8c", "#4a8a2a", "#8a2a4a"] as const;

const LOGS = [
  { x1: PIT_CX - 96, y1: PIT_CY + 4,  x2: PIT_CX - 18, y2: PIT_CY - 16, r: 7 },
  { x1: PIT_CX + 18, y1: PIT_CY - 12, x2: PIT_CX + 98, y2: PIT_CY + 7,  r: 7 },
  { x1: PIT_CX - 30, y1: PIT_CY + 10, x2: PIT_CX + 36, y2: PIT_CY - 32, r: 6 },
] as const;

export function ClamBake() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
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
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [active]);

  const flameH    = 60 + Math.sin(phase * 6.9) * 16 + Math.sin(phase * 11.5) * 9;
  const flameSway = Math.sin(phase * 5.1) * 9;
  const beaconRad = phase * 48 * Math.PI / 180;
  const waveOff   = phase * 1.18;
  const fireOp    = 0.82 + Math.sin(phase * 7.1) * 0.12;

  const wavePath = (y: number, off: number, amp: number): string =>
    Array.from({ length: 33 }, (_, i) => {
      const x = i * (W / 32);
      const wy = y + Math.sin((i / 9) * Math.PI * 2 + waveOff + off) * amp;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${wy.toFixed(1)}`;
    }).join(" ");

  return (
    <section style={{ background: "#08060e", overflow: "hidden" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="New England coastal clambake at dusk — stone fire pit, lobsters, lighthouse beacon"
        role="img"
      >
        <defs>
          <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#180428" />
            <stop offset="32%"  stopColor="#680e38" />
            <stop offset="60%"  stopColor="#c84018" />
            <stop offset="82%"  stopColor="#f07828" />
            <stop offset="100%" stopColor="#f8b040" />
          </linearGradient>
          <linearGradient id="cb-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0c1635" />
            <stop offset="100%" stopColor="#1e2848" />
          </linearGradient>
          <radialGradient id="cb-firepit" cx="50%" cy="55%" r="50%">
            <stop offset="0%"   stopColor="#ff6600" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#ff3300" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="cb-coal" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff4400" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c82000" stopOpacity="0"   />
          </radialGradient>
          <linearGradient id="cb-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8a870" />
            <stop offset="100%" stopColor="#a88850" />
          </linearGradient>
          <filter id="cb-glow">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Sky ─────────────────────────────────────────────────────── */}
        <rect width={W} height={HORIZON_Y + 8} fill="url(#cb-sky)" />

        {/* Stars */}
        {Array.from({ length: 52 }, (_, i) => {
          const a = i * 137.508 * Math.PI / 180;
          const sx = ((Math.cos(a) + 1) / 2) * W;
          const sy = ((Math.sin(a) + 1) / 2) * (HORIZON_Y * 0.78);
          const twk = 0.22 + Math.sin(phase * 1.6 + i * 0.74) * 0.28;
          return <circle key={i} cx={sx} cy={sy} r={0.8 + (i % 3) * 0.4} fill="white" opacity={twk} />;
        })}

        {/* Horizon glow */}
        <rect x="0" y={HORIZON_Y - 4} width={W} height={20} fill="#f8a828" opacity="0.17" />

        {/* ── Ocean ───────────────────────────────────────────────────── */}
        <rect x="0" y={HORIZON_Y} width={W} height={BEACH_Y - HORIZON_Y} fill="url(#cb-sea)" />
        <ellipse cx={PIT_CX} cy={BEACH_Y + 2} rx={110} ry={22}
          fill="#ff5500" opacity={0.06 + Math.sin(phase * 6.9) * 0.03} />

        {/* Waves */}
        {Array.from({ length: 4 }, (_, wi) => (
          <g key={wi}>
            <path d={wavePath(HORIZON_Y + 14 + wi * 24, wi * Math.PI * 0.52, 3.5 + wi * 1.2)}
              fill="none" stroke="#3a5880" strokeWidth={1.1 - wi * 0.18} opacity={0.55 - wi * 0.1} />
            <path d={wavePath(HORIZON_Y + 13 + wi * 24, wi * Math.PI * 0.52, 3.5 + wi * 1.2)}
              fill="none" stroke="#b0c8e0" strokeWidth="0.7" opacity={0.24 - wi * 0.04} />
          </g>
        ))}

        {/* ── Headland silhouette ─────────────────────────────────────── */}
        <path
          d={`M780,${HORIZON_Y + 6} Q858,${HORIZON_Y - 30} 936,${HORIZON_Y - 10} Q998,${HORIZON_Y - 52} 1058,${HORIZON_Y - 6} L1058,${HORIZON_Y + 6} Z`}
          fill="#1a0825" opacity="0.88"
        />

        {/* ── Lighthouse ──────────────────────────────────────────────── */}
        <g transform={`translate(${LH_X}, 0)`}>
          <rect x="-26" y={LH_BASE_Y - 32} width={52} height={32} fill="#28183a" />
          <polygon points={`-28,${LH_BASE_Y - 32} 0,${LH_BASE_Y - 52} 28,${LH_BASE_Y - 32}`} fill="#1e1028" />
          <rect x="-8" y={LH_BASE_Y - 26} width={10} height={10}
            fill="#f0c870" rx="1" opacity={0.45 + Math.sin(phase * 1.8) * 0.22} />
          <polygon
            points={`-13,${LH_BASE_Y - 30} -9,${LH_LAN_Y + 24} 9,${LH_LAN_Y + 24} 13,${LH_BASE_Y - 30}`}
            fill="#1e1030"
          />
          {[0.28, 0.56, 0.82].map((f, si) => {
            const sy = LH_BASE_Y - 30 - (LH_H - 28) * f;
            const hw = 9 + (1 - f) * 3;
            return <rect key={si} x={-hw} y={sy} width={hw * 2} height={7} fill="#c01818" opacity="0.7" />;
          })}
          <polygon
            points={`-11,${LH_LAN_Y + 24} 11,${LH_LAN_Y + 24} 9,${LH_LAN_Y + 8} -9,${LH_LAN_Y + 8}`}
            fill="#0a1020"
          />
          <rect x="-11" y={LH_LAN_Y} width={22} height={10} fill="#c89818" />
          <circle cx="0" cy={LH_LAN_Y + 5} r="7" fill="#fff8c0" filter="url(#cb-glow)"
            opacity={0.55 + Math.sin(phase * 2.2) * 0.3} />
          <path
            d={`M0,${LH_LAN_Y + 5} L${(Math.cos(beaconRad) * 320).toFixed(1)},${(LH_LAN_Y + 5 + Math.sin(beaconRad) * 80).toFixed(1)} L${(Math.cos(beaconRad + 0.18) * 320).toFixed(1)},${(LH_LAN_Y + 5 + Math.sin(beaconRad + 0.18) * 80).toFixed(1)} Z`}
            fill="#fff8c0" opacity="0.2"
          />
          <rect x="-14" y={LH_LAN_Y + 22} width={28} height={3} fill="#666" />
        </g>

        {/* ── Beach ───────────────────────────────────────────────────── */}
        <rect x="0" y={BEACH_Y} width={W} height={H - BEACH_Y} fill="url(#cb-sand)" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i}
            d={`M${i * 148},${BEACH_Y + 10 + i * 5} Q${i * 148 + 74},${BEACH_Y + 6 + i * 5} ${i * 148 + 148},${BEACH_Y + 12 + i * 5}`}
            fill="none" stroke="#b09060" strokeWidth="1" opacity="0.33"
          />
        ))}

        {ROCKS.map((rock, ri) => (
          <ellipse key={ri} cx={rock.x} cy={rock.y} rx={rock.rx} ry={rock.ry}
            fill={`hsl(${22 + ri * 7}, 14%, ${26 + ri * 4}%)`} />
        ))}

        {/* Fire glow on ground */}
        <ellipse cx={PIT_CX} cy={PIT_CY + 22} rx={PIT_R * 2.4} ry={PIT_R}
          fill="url(#cb-firepit)" opacity={0.78 + Math.sin(phase * 6.9) * 0.18} />

        {/* Coal bed */}
        <ellipse cx={PIT_CX} cy={PIT_CY} rx={PIT_R - 10} ry={(PIT_R - 10) * 0.42}
          fill="url(#cb-coal)" opacity={0.65 + Math.sin(phase * 4.5) * 0.22} />

        {COALS.map((c, ci) => {
          const glow = 0.48 + Math.sin(phase * 4.2 + c.ph) * 0.42;
          const rv = Math.floor(200 + Math.sin(phase * 3.5 + c.ph) * 32);
          return (
            <circle key={ci} cx={c.cx} cy={c.cy} r={c.r}
              fill={`rgb(${rv},${Math.floor(rv * 0.25)},0)`} opacity={glow} />
          );
        })}

        {/* Driftwood logs */}
        {LOGS.map((log, li) => {
          const dx = log.x2 - log.x1;
          const dy = log.y2 - log.y1;
          const ang = Math.atan2(dy, dx) * 180 / Math.PI;
          const len = Math.sqrt(dx * dx + dy * dy);
          const mx = (log.x1 + log.x2) / 2;
          const my = (log.y1 + log.y2) / 2;
          return (
            <g key={li} transform={`translate(${mx}, ${my}) rotate(${ang})`}>
              <rect x={-len / 2} y={-log.r} width={len} height={log.r * 2} fill="#5a3a18" rx={log.r} />
              {[-len * 0.3, 0, len * 0.3].map((ox, gi) => (
                <line key={gi} x1={ox} y1={-log.r + 2} x2={ox} y2={log.r - 2}
                  stroke="#3a2010" strokeWidth="1" opacity="0.4" />
              ))}
              <circle cx={-len / 2} cy="0" r={log.r + 1} fill="#200c04" />
              <circle cx={len / 2}  cy="0" r={log.r + 1} fill="#200c04" />
            </g>
          );
        })}

        {/* Seaweed mound */}
        <ellipse cx={PIT_CX} cy={PIT_CY - 10} rx={PIT_R - 8} ry={(PIT_R - 8) * 0.48}
          fill="#1a3a18" opacity="0.88" />
        {Array.from({ length: 13 }, (_, i) => {
          const a = i * 137.508 * Math.PI / 180;
          const rad = 10 + (i % 4) * 10;
          return (
            <ellipse key={i}
              cx={PIT_CX + Math.cos(a) * rad} cy={PIT_CY - 10 + Math.sin(a) * rad * 0.4}
              rx={8 + (i % 3) * 4} ry={4 + (i % 2) * 2}
              fill="#223c1e" opacity="0.82"
            />
          );
        })}

        {/* Stone ring */}
        {STONES.map((s, si) => (
          <ellipse key={si} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
            fill={`hsl(28,17%,${s.shade}%)`} stroke="#180e06" strokeWidth="0.8" />
        ))}

        {/* ── Flames ──────────────────────────────────────────────────── */}
        <g filter="url(#cb-glow)">
          <path
            d={`M${PIT_CX - 30},${PIT_CY - 8} C${PIT_CX - 36 + flameSway * 0.6},${PIT_CY - flameH * 0.48} ${PIT_CX - 8 + flameSway},${PIT_CY - flameH * 0.86} ${PIT_CX},${PIT_CY - flameH} C${PIT_CX + 8 + flameSway},${PIT_CY - flameH * 0.86} ${PIT_CX + 36 - flameSway * 0.6},${PIT_CY - flameH * 0.48} ${PIT_CX + 30},${PIT_CY - 8} Z`}
            fill="#ff3e00" opacity={fireOp}
          />
          <path
            d={`M${PIT_CX - 20},${PIT_CY - 10} C${PIT_CX - 22 + flameSway},${PIT_CY - flameH * 0.62} ${PIT_CX - 5 + flameSway * 1.3},${PIT_CY - flameH * 0.97} ${PIT_CX},${PIT_CY - flameH * 1.08} C${PIT_CX + 5 + flameSway},${PIT_CY - flameH * 0.97} ${PIT_CX + 22 - flameSway},${PIT_CY - flameH * 0.62} ${PIT_CX + 20},${PIT_CY - 10} Z`}
            fill="#ff8000" opacity="0.92"
          />
          <path
            d={`M${PIT_CX - 12},${PIT_CY - 14} C${PIT_CX - 9 + flameSway * 0.8},${PIT_CY - flameH * 0.72} ${PIT_CX - 2 + flameSway},${PIT_CY - flameH * 1.02} ${PIT_CX},${PIT_CY - flameH * 1.14} C${PIT_CX + 2 + flameSway},${PIT_CY - flameH * 1.02} ${PIT_CX + 9 - flameSway * 0.8},${PIT_CY - flameH * 0.72} ${PIT_CX + 12},${PIT_CY - 14} Z`}
            fill="#ffc800" opacity="0.96"
          />
          <path
            d={`M${PIT_CX - 6},${PIT_CY - 14} C${PIT_CX - 3},${PIT_CY - flameH * 0.8} ${PIT_CX + 3},${PIT_CY - flameH * 0.8} ${PIT_CX + 6},${PIT_CY - 14} Z`}
            fill="white" opacity="0.7"
          />
        </g>

        {/* Steam wisps from seaweed */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = i * 137.508 * Math.PI / 180;
          const rad = 8 + (i % 4) * 11;
          const age = ((phase * 0.62 + i * 0.68) % 2.7);
          const ops = age < 0.3 ? (age / 0.3) * 0.36 :
                      age > 1.9 ? ((2.7 - age) / 0.8) * 0.36 : 0.36;
          const sx = PIT_CX + Math.cos(a) * rad + Math.sin(age * 2.4 + i) * 5;
          const sy = PIT_CY - 12 - age * 26;
          return <ellipse key={i} cx={sx} cy={sy} rx={4 + age * 5} ry={3 + age * 3} fill="#b0b0c8" opacity={ops} />;
        })}

        {/* Floating embers */}
        {EMBERS.map((em, ei) => {
          const ageE = ((phase * em.spd + em.ph) % 3.4);
          const ops = ageE < 0.4 ? (ageE / 0.4) * 0.92 :
                      ageE > 2.5 ? ((3.4 - ageE) / 0.9) * 0.92 : 0.92;
          const ex = em.ax + Math.sin(ageE * 2.5 + ei * 0.44) * 9;
          const ey = em.baseY - ageE * 20;
          return <circle key={ei} cx={ex} cy={ey} r={em.r}
            fill={ageE < 1.6 ? "#ff8000" : "#ff3800"} opacity={ops} />;
        })}

        {/* ── Lobsters ────────────────────────────────────────────────── */}
        {[
          { x: PIT_CX + PIT_R + 30, y: PIT_CY + 22, f:  1 },
          { x: PIT_CX - PIT_R - 16, y: PIT_CY + 26, f: -1 },
          { x: PIT_CX + 18,         y: PIT_CY + 34, f:  1 },
        ].map((lb, li) => (
          <g key={li} transform={`translate(${lb.x}, ${lb.y}) scale(${lb.f}, 1)`}>
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#c82e18" />
            {[-10, -4, 2, 8, 14].map((bx, bi) => (
              <line key={bi} x1={bx} y1="-9" x2={bx} y2="9" stroke="#a82010" strokeWidth="1" opacity="0.5" />
            ))}
            <path d="M-20,0 Q-33,5 -30,14 Q-24,9 -20,0" fill="#a02010" />
            <path d="M-20,0 Q-32,-4 -28,-13 Q-22,-7 -20,0" fill="#a02010" />
            <path d="M-18,0 Q-28,0 -24,-15 Q-17,-9 -18,0" fill="#901c0c" opacity="0.7" />
            <path d="M18,0 Q28,6 26,15 Q20,10 18,0" fill="#c82e18" />
            <path d="M18,0 Q30,-4 28,-13 Q20,-7 18,0" fill="#a02010" />
            <ellipse cx="26" cy="11" rx="8" ry="6" fill="#c82e18" />
            <ellipse cx="28" cy="-12" rx="7" ry="5" fill="#a02010" />
            <line x1="18" y1="-6" x2="42" y2="-20" stroke="#901c0c" strokeWidth="1.5" />
            <line x1="16" y1="-3" x2="40" y2="-9"  stroke="#901c0c" strokeWidth="1.5" />
            {[-10, -4, 2, 8].map((lx, i) => (
              <line key={i} x1={lx} y1="8" x2={lx - 5} y2={17 + (i % 2) * 4}
                stroke="#a02010" strokeWidth="1.4" />
            ))}
          </g>
        ))}

        {/* Burlap sacks */}
        {[
          { x: PIT_CX + PIT_R + 72, y: BEACH_Y - 30 },
          { x: PIT_CX - PIT_R - 76, y: BEACH_Y - 30 },
        ].map((sk, si) => (
          <g key={si}>
            <ellipse cx={sk.x} cy={sk.y} rx={28} ry={22} fill="#c8b068" />
            <ellipse cx={sk.x} cy={sk.y - 18} rx={18} ry={11} fill="#b8a058" />
            <ellipse cx={sk.x} cy={sk.y - 28} rx={8} ry={4}
              fill="none" stroke="#8a6828" strokeWidth="2" />
            {[-16, -6, 4, 14].map((ox, wi) => (
              <line key={wi}
                x1={sk.x + ox} y1={sk.y - 17} x2={sk.x + ox} y2={sk.y + 16}
                stroke="#a09048" strokeWidth="1" opacity="0.44"
              />
            ))}
          </g>
        ))}

        {/* ── Picnic tables ───────────────────────────────────────────── */}
        {TABLES.map((t, ti) => {
          const ty = BEACH_Y - 52;
          return (
            <g key={ti}>
              <rect x={t.x} y={ty} width={t.w} height={14} fill="#5a3818" rx="2" />
              {[0.25, 0.5, 0.75].map((f, pi) => (
                <line key={pi}
                  x1={t.x + Math.round(t.w * f)} y1={ty}
                  x2={t.x + Math.round(t.w * f)} y2={ty + 14}
                  stroke="#3a2010" strokeWidth="1.5" opacity="0.5"
                />
              ))}
              <line x1={t.x + 18} y1={ty + 12} x2={t.x + 10} y2={BEACH_Y} stroke="#4a2c10" strokeWidth="5" />
              <line x1={t.x + t.w - 18} y1={ty + 12} x2={t.x + t.w - 10} y2={BEACH_Y} stroke="#4a2c10" strokeWidth="5" />
              <rect x={t.x - 12} y={ty + 22} width={t.w + 24} height={7} fill="#6a4820" rx="2" />
              {Array.from({ length: t.people }, (_, pi) => {
                const px = t.x + 18 + pi * Math.round((t.w - 28) / Math.max(t.people - 1, 1));
                const bob = Math.sin(phase * 1.55 + ti * 1.5 + pi) * 1.4;
                const sc = SHIRT_COLORS[pi % 4] ?? "#c84820";
                return (
                  <g key={pi} transform={`translate(${px}, ${ty - 38 + bob})`}>
                    <rect x="-7" y="-22" width="14" height="20" fill={sc} rx="3" />
                    <ellipse cx="0" cy="-28" rx="8" ry="9" fill="#d4916a" />
                    <ellipse cx="0" cy="-36" rx="11" ry="4" fill="#8a6030" />
                    <rect x="-6" y="-44" width="12" height="9" fill="#8a6030" rx="2" />
                    {pi % 2 === 0 && (
                      <g transform="translate(10,-24)">
                        <path d="M-7,0 L7,0 L4,10 Q0,14 -4,10 Z" fill="#e8d8b8" />
                        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#d8c8a8" />
                      </g>
                    )}
                  </g>
                );
              })}
              {[0.28, 0.55, 0.78].map((f, bi) => (
                <g key={bi} transform={`translate(${t.x + Math.round(t.w * f)}, ${ty + 3})`}>
                  <path d="M-8,0 L8,0 L5,10 Q0,13 -5,10 Z" fill="#e8d0b0" />
                  <ellipse cx="0" cy="0" rx="8" ry="3.5" fill="#d8c0a0" />
                  {[-3, 3].map((ox, ci) => (
                    <ellipse key={ci} cx={ox} cy="-1" rx="3.5" ry="2.5"
                      fill="#c0b090" stroke="#a89070" strokeWidth="0.8" />
                  ))}
                </g>
              ))}
            </g>
          );
        })}

        {/* Cooler */}
        <g transform={`translate(${PIT_CX + PIT_R + 148}, ${BEACH_Y - 36})`}>
          <rect x="0" y="0" width="58" height="36" fill="#a81818" rx="5" />
          <rect x="2" y="2" width="54" height="10" fill="#c82020" rx="3" />
          <rect x="-3" y="14" width="64" height="5" fill="#881010" rx="3" />
          <text x="29" y="30" textAnchor="middle" fontSize="7.5"
            fill="white" fontFamily="sans-serif" opacity="0.6">COLD</text>
        </g>

        {/* ── Seagulls ────────────────────────────────────────────────── */}
        {GULLS.map((g, gi) => {
          const gx = g.ax + Math.cos(phase * g.spd + g.ph) * g.r;
          const gy2 = g.ay + Math.sin(phase * g.spd + g.ph) * g.r * 0.38;
          const wf = Math.sin(phase * 6.2 + g.ph) * 8;
          return (
            <g key={gi} transform={`translate(${gx}, ${gy2})`} opacity="0.68">
              <path d={`M-13,${-wf} Q0,-5 13,${-wf}`}
                fill="none" stroke="#c0d0e0" strokeWidth="2" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Firelight on sand */}
        <ellipse cx={PIT_CX} cy={BEACH_Y + 10} rx={200} ry={22}
          fill="#ff5500" opacity={0.05 + Math.sin(phase * 6.9) * 0.02} />

        {/* Caption */}
        <text x={W / 2} y={H - 10}
          textAnchor="middle" fontSize="12"
          fill="#f0b870" fontFamily="Georgia, serif" opacity="0.65" letterSpacing="0.5">
          New England Coastal Clambake · Dusk · The Lobsters Are Ready
        </text>

        {/* Reveal */}
        <rect width={W} height={H} fill="#08060e"
          style={{ opacity: active ? 0 : 1, transition: "opacity 1.4s ease", pointerEvents: "none" }}
        />
      </svg>
    </section>
  );
}
