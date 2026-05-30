"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 580;

// ─── Scene geometry ─────────────────────────────────────────────────────────────
const GROUND_Y   = H - 80;          // top of platform
const TRACK_Y    = GROUND_Y + 22;   // rail surface
const HORIZON_Y  = 248;

// ─── Locomotive dimensions ─────────────────────────────────────────────────────
// Train enters from the right, comes to rest with nose at ~x=480
const LOCO_NOSE_X  = 468;
const LOCO_RAIL_Y  = TRACK_Y;
const LOCO_H       = 128;           // height of boiler from rail
const LOCO_BOILER_Y = LOCO_RAIL_Y - LOCO_H;
const LOCO_W       = 340;           // total locomotive length
const LOCO_BOILER_W = 260;

// Drive wheels: 3 large + 2 leading
const DRIVE_R   = 46;
const LEAD_R    = 26;
const DRIVE_XS  = [LOCO_NOSE_X + 88, LOCO_NOSE_X + 178, LOCO_NOSE_X + 268] as const;
const LEAD_XS   = [LOCO_NOSE_X + 28, LOCO_NOSE_X + 58] as const;

// Tender behind loco
const TENDER_X  = LOCO_NOSE_X + LOCO_W + 8;
const TENDER_W  = 148;
const TENDER_H  = 88;

// Passenger car behind tender
const CAR1_X    = TENDER_X + TENDER_W + 12;
const CAR_W     = 220;
const CAR_H     = 96;

// ─── Station building ─────────────────────────────────────────────────────────
const DEPOT_X   = 28;
const DEPOT_Y   = GROUND_Y - 188;
const DEPOT_W   = 290;
const DEPOT_H   = 188;

// ─── Platform canopy ──────────────────────────────────────────────────────────
const CANOPY_X   = DEPOT_X + DEPOT_W;
const CANOPY_Y   = GROUND_Y - 88;
const CANOPY_W   = 480;
const CANOPY_H   = 18;

// ─── Departure board ─────────────────────────────────────────────────────────
const BOARD_X  = DEPOT_X + DEPOT_W * 0.12;
const BOARD_Y  = DEPOT_Y + 28;
const BOARD_W  = 162;
const BOARD_H  = 80;

// Departures (cycling on solari board)
const DEPARTURES = [
  { dest: "WORCESTER",  time: "10:14", track: "1" },
  { dest: "BOSTON",     time: "10:32", track: "2" },
  { dest: "ALBANY",     time: "11:08", track: "1" },
  { dest: "SPRINGFIELD",time: "11:22", track: "3" },
  { dest: "FITCHBURG",  time: "12:00", track: "2" },
];

// ─── Station clock ────────────────────────────────────────────────────────────
const CLOCK_X = DEPOT_X + DEPOT_W / 2;
const CLOCK_Y = DEPOT_Y - 22;
const CLOCK_R = 22;

// ─── Passengers on platform ───────────────────────────────────────────────────
type Passenger = { x: number; color: string; hat: string; luggage: boolean; facing: number };
const PASSENGERS: Passenger[] = [
  { x: CANOPY_X + 28,  color: "#1a2a4a", hat: "#2a1a0a", luggage: true,  facing:  1 },
  { x: CANOPY_X + 72,  color: "#c83228", hat: "#1a1a1a", luggage: false, facing: -1 },
  { x: CANOPY_X + 120, color: "#2a5a30", hat: "#3a2010", luggage: true,  facing:  1 },
  { x: CANOPY_X + 168, color: "#8b2a8b", hat: "#1a1a1a", luggage: false, facing:  1 },
  { x: CANOPY_X + 218, color: "#c87828", hat: "#2a1a0a", luggage: true,  facing: -1 },
  { x: CANOPY_X + 268, color: "#2a1a6a", hat: "#3a2010", luggage: false, facing:  1 },
  { x: CANOPY_X + 320, color: "#5a1818", hat: "#1a1a1a", luggage: true,  facing:  1 },
  { x: CANOPY_X + 368, color: "#1a3a1a", hat: "#2a1a0a", luggage: false, facing: -1 },
];

// ─── Signal lamp posts ────────────────────────────────────────────────────────
const SIGNAL_X = LOCO_NOSE_X - 48;

// ─── Background: rolling hills + small town ───────────────────────────────────
const FAR_BUILDINGS = [
  { x: 820,  w: 38, h: 68, shade: "#2a2e38" },
  { x: 870,  w: 52, h: 88, shade: "#22262e" },
  { x: 934,  w: 34, h: 56, shade: "#2e3240" },
  { x: 980,  w: 44, h: 74, shade: "#262a32" },
  { x: 1038, w: 58, h: 92, shade: "#1e2228" },
  { x: 1110, w: 36, h: 64, shade: "#2a2e38" },
  { x: 1158, w: 48, h: 80, shade: "#22262e" },
];

// ─── Coal in tender ───────────────────────────────────────────────────────────
const COAL_LUMPS = Array.from({ length: 18 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  return {
    cx: TENDER_X + TENDER_W * 0.5 + Math.cos(ang) * 38 * Math.sqrt(i / 18),
    cy: LOCO_RAIL_Y - TENDER_H * 0.55 + Math.sin(ang) * 12 * Math.sqrt(i / 18),
    r:  5 + (i % 4) * 2,
  };
});

// ─── Steam puff segments ──────────────────────────────────────────────────────
const STACK_X = LOCO_NOSE_X + 28;
const STACK_Y = LOCO_BOILER_Y - 16;
const PUFF_COUNT = 8;

export function TrainDepot() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]     = useState(false);
  const [phase, setPhase]       = useState(0);
  const [boardRow, setBoardRow] = useState(0);  // solari flip row

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let t = 0;
    let nextFlip = 6.0;
    const tick = setInterval(() => {
      t += 0.033;
      setPhase(t);
      if (t >= nextFlip) {
        setBoardRow(r => (r + 1) % DEPARTURES.length);
        nextFlip = t + 5.5 + (Math.floor(t * 3) % 4) * 1.2;
      }
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  // Drive wheel rotation
  const wheelRot = phase * 180;    // degrees — continuous spin
  // But train is stopped (arrived), so wheels spin then stop
  const arrivalDuration = 3.0;
  const spinFraction = Math.max(0, 1 - phase / arrivalDuration);
  const effectiveWheelRot = phase < arrivalDuration
    ? phase * 180 * spinFraction
    : phase * 0;   // stopped
  void effectiveWheelRot;
  // Use a simpler approach: spin freely at constant rate while phase < arrival, then freeze
  const wheelAngle = phase < arrivalDuration
    ? (phase * 380) % 360
    : (arrivalDuration * 380) % 360;

  // Steam puff positions (rising, fading)
  const puffs = Array.from({ length: PUFF_COUNT }, (_, i) => {
    const age = ((phase * 1.4 + i * (1 / PUFF_COUNT)) % 1);
    return {
      cx: STACK_X + Math.sin(age * Math.PI * 1.2 + i) * 18,
      cy: STACK_Y - age * 110,
      r:  8 + age * 44,
      opacity: Math.max(0, 0.55 - age * 0.6),
      drift: Math.sin(age * Math.PI + i * 0.7) * 22,
    };
  });

  // Cylinder exhaust puff (smaller, between wheels)
  const cylPuffs = Array.from({ length: 4 }, (_, i) => {
    const age = ((phase * 1.8 + i * 0.25) % 1);
    return {
      cx: DRIVE_XS[0]! - 28 + (i % 2) * 16,
      cy: LOCO_BOILER_Y + 28 - age * 24,
      r:  4 + age * 10,
      opacity: Math.max(0, 0.4 - age * 0.4) * (phase < arrivalDuration ? 1 : 0.2),
    };
  });

  // Clock hands
  const clockMinAngle = (phase * 0.8) % 360;     // minutes hand sweeps slowly
  const clockHourAngle = clockMinAngle / 12;

  // Passenger subtle sway
  const passengerSway = (i: number) =>
    Math.sin(phase * 0.6 + i * 0.9) * 1.5;

  // Signal lamp flicker
  const signalGreen = Math.sin(phase * 0.3) > -0.3;

  return (
    <section style={{ background: "#10141c", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes td-steam-drift {
          from { transform: translateX(0); }
          to   { transform: translateX(-28px); }
        }
        @keyframes td-window-flicker {
          0%,100% { opacity: 0.88; }
          30%     { opacity: 0.72; }
          65%     { opacity: 0.92; }
        }
        @keyframes td-board-flip {
          0%    { transform: scaleY(1); }
          40%   { transform: scaleY(0); }
          41%   { transform: scaleY(0); }
          80%   { transform: scaleY(1); }
        }
        .td-car-window { animation: td-window-flicker 4.5s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 340 }}
        aria-label="Route 9 era steam train pulling into Shrewsbury depot — locomotive with spinning wheels and steam plume, passengers on platform, departures board, station clock"
        role="img"
      >
        <defs>
          <linearGradient id="td-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0c1020" />
            <stop offset="35%"  stopColor="#18202e" />
            <stop offset="70%"  stopColor="#283048" />
            <stop offset="100%" stopColor="#384868" />
          </linearGradient>
          <linearGradient id="td-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a2e3a" />
            <stop offset="100%" stopColor="#1a1e28" />
          </linearGradient>
          <linearGradient id="td-platform" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3e4a" />
            <stop offset="100%" stopColor="#282c38" />
          </linearGradient>
          <linearGradient id="td-loco" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1a1a1a" />
            <stop offset="60%"  stopColor="#222222" />
            <stop offset="100%" stopColor="#181818" />
          </linearGradient>
          <linearGradient id="td-depot-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8b890" />
            <stop offset="100%" stopColor="#b0a078" />
          </linearGradient>
          <radialGradient id="td-headlamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8f8a0" stopOpacity="0.95" />
            <stop offset="50%"  stopColor="#f0c840" stopOpacity="0.5"  />
            <stop offset="100%" stopColor="#e08010" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="td-firebox" cx="50%" cy="80%" r="50%">
            <stop offset="0%"   stopColor="#ff9820" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cc3010" stopOpacity="0"   />
          </radialGradient>
          <radialGradient id="td-signal-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#40ff60" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10a020" stopOpacity="0"   />
          </radialGradient>
          <radialGradient id="td-signal-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff3020" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a01010" stopOpacity="0"   />
          </radialGradient>
          <filter id="td-blur-sm">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="td-blur-md">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="td-blur-lg">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <clipPath id="td-scene">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#td-sky)" />

        {/* ── Distant hills + town silhouette ── */}
        <g style={{ opacity: active ? 0.75 : 0, transition: tr(0.05) }}>
          {/* Rolling hills */}
          <path
            d={`M0,${HORIZON_Y + 28} Q240,${HORIZON_Y - 18} 480,${HORIZON_Y + 8} Q720,${HORIZON_Y + 30} 960,${HORIZON_Y - 8} Q1200,${HORIZON_Y - 28} 1440,${HORIZON_Y + 14} L1440,${GROUND_Y} L0,${GROUND_Y} Z`}
            fill="#22283a" opacity="0.7"
          />
          {/* Far buildings */}
          {FAR_BUILDINGS.map((fb, i) => (
            <g key={i}>
              <rect x={fb.x} y={HORIZON_Y + 8 - fb.h} width={fb.w} height={fb.h}
                fill={fb.shade} />
              {/* Roof */}
              <polygon
                points={`${fb.x - 3},${HORIZON_Y + 8 - fb.h} ${fb.x + fb.w / 2},${HORIZON_Y + 8 - fb.h - 18} ${fb.x + fb.w + 3},${HORIZON_Y + 8 - fb.h}`}
                fill={fb.shade}
              />
              {/* Window glow */}
              <rect x={fb.x + fb.w * 0.25} y={HORIZON_Y + 8 - fb.h * 0.55}
                width={fb.w * 0.22} height={fb.h * 0.2}
                fill="#f8c840" opacity="0.28" />
            </g>
          ))}
          {/* Church steeple far right */}
          <rect x={1280} y={HORIZON_Y - 38} width={22} height={54} fill="#1e2230" />
          <polygon points={`1277,${HORIZON_Y - 38} 1291,${HORIZON_Y - 74} 1305,${HORIZON_Y - 38}`}
            fill="#1a1e28" />
          <line x1={1291} y1={HORIZON_Y - 74} x2={1291} y2={HORIZON_Y - 86}
            stroke="#1a1e28" strokeWidth="2" />
        </g>

        {/* ── Ground / rail yard ── */}
        <rect x="0" y={GROUND_Y} width={W} height={H - GROUND_Y}
          fill="url(#td-ground)" />
        {/* Gravel texture */}
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse key={i}
            cx={100 + i * 72} cy={GROUND_Y + 14 + (i % 4) * 8}
            rx={18 + i % 8} ry={4}
            fill="#3a3e48" opacity="0.4"
          />
        ))}

        {/* ── Railroad tracks ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          {/* Rails */}
          {[-14, 14].map((off, ri) => (
            <line key={ri}
              x1="0" y1={TRACK_Y + off * 0.3}
              x2={W}  y2={TRACK_Y + off * 0.3}
              stroke="#5a5050" strokeWidth="5" />
          ))}
          {/* Ties (cross-members) */}
          {Array.from({ length: 32 }, (_, i) => (
            <rect key={i}
              x={i * 46 - 4} y={TRACK_Y - 18}
              width={38} height={10}
              rx="1" fill="#3a2a18" />
          ))}
        </g>

        {/* ── Platform ── */}
        <rect x={DEPOT_X + DEPOT_W} y={GROUND_Y - 14}
          width={CANOPY_W + 80} height={14}
          fill="url(#td-platform)"
        />
        {/* Platform edge bricks */}
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i}
            x={CANOPY_X + i * 26} y={GROUND_Y - 14}
            width={24} height={6}
            rx="1" fill="#4a4850" stroke="#2a2830" strokeWidth="0.5"
          />
        ))}

        {/* ── Station building ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {/* Wall */}
          <rect x={DEPOT_X} y={DEPOT_Y} width={DEPOT_W} height={DEPOT_H}
            fill="url(#td-depot-wall)" />
          {/* Stone base */}
          <rect x={DEPOT_X} y={DEPOT_Y + DEPOT_H - 30} width={DEPOT_W} height={30}
            fill="#8a7850" />
          {/* Gable roof */}
          <polygon
            points={`${DEPOT_X - 6},${DEPOT_Y} ${DEPOT_X + DEPOT_W / 2},${DEPOT_Y - 52} ${DEPOT_X + DEPOT_W + 6},${DEPOT_Y}`}
            fill="#5a4020"
          />
          {/* Roof tiles */}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i}
              x1={DEPOT_X + i * (DEPOT_W / 10)} y1={DEPOT_Y}
              x2={DEPOT_X + DEPOT_W / 2} y2={DEPOT_Y - 52}
              stroke="#4a3018" strokeWidth="1.5" opacity="0.5"
            />
          ))}
          {/* Windows */}
          {[0.18, 0.48, 0.78].map((wx, wi) => (
            <g key={wi}>
              <rect x={DEPOT_X + DEPOT_W * wx - 16} y={DEPOT_Y + 32}
                width={32} height={44} rx="2"
                fill="#f8d060" opacity="0.75" className="td-car-window"
                style={{ animationDelay: `${wi * 0.8}s` }}
              />
              {/* Window cross-bar */}
              <line x1={DEPOT_X + DEPOT_W * wx} y1={DEPOT_Y + 32}
                x2={DEPOT_X + DEPOT_W * wx} y2={DEPOT_Y + 76}
                stroke="#a08840" strokeWidth="2" />
              <line x1={DEPOT_X + DEPOT_W * wx - 16} y1={DEPOT_Y + 54}
                x2={DEPOT_X + DEPOT_W * wx + 16} y2={DEPOT_Y + 54}
                stroke="#a08840" strokeWidth="2" />
            </g>
          ))}
          {/* Door */}
          <rect x={DEPOT_X + DEPOT_W * 0.38 - 16} y={DEPOT_Y + DEPOT_H - 68}
            width={32} height={68}
            rx="2" fill="#5a3810" stroke="#3a2008" strokeWidth="2" />
          {/* Door knob */}
          <circle cx={DEPOT_X + DEPOT_W * 0.38 + 10} cy={DEPOT_Y + DEPOT_H - 34}
            r={3} fill="#c8a840" />
          {/* Chimney */}
          <rect x={DEPOT_X + DEPOT_W * 0.68} y={DEPOT_Y - 80}
            width={20} height={88}
            fill="#6a5030" />
          <rect x={DEPOT_X + DEPOT_W * 0.68 - 4} y={DEPOT_Y - 82}
            width={28} height={7}
            fill="#7a6038" />
          {/* Station sign */}
          <rect x={DEPOT_X + DEPOT_W * 0.14} y={DEPOT_Y + 4}
            width={DEPOT_W * 0.72} height={20}
            rx="2" fill="#1a3a6a" />
          <text x={DEPOT_X + DEPOT_W / 2} y={DEPOT_Y + 18}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fontWeight="bold"
            fill="#f8e090" letterSpacing="2">SHREWSBURY DEPOT · EST. 1871</text>
        </g>

        {/* ── Platform canopy ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          {/* Canopy roof */}
          <rect x={CANOPY_X - 4} y={CANOPY_Y} width={CANOPY_W + 8} height={CANOPY_H}
            fill="#5a4020" />
          {/* Canopy soffit */}
          <rect x={CANOPY_X} y={CANOPY_Y + CANOPY_H} width={CANOPY_W} height={6}
            fill="#3a2810" opacity="0.7" />
          {/* Support columns */}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i}
              x1={CANOPY_X + i * (CANOPY_W / 6)} y1={CANOPY_Y + CANOPY_H}
              x2={CANOPY_X + i * (CANOPY_W / 6)} y2={GROUND_Y - 14}
              stroke="#4a3010" strokeWidth="6" />
          ))}
          {/* Decorative valance (scalloped edge) */}
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i}
              d={`M${CANOPY_X + i * (CANOPY_W / 24)},${CANOPY_Y + CANOPY_H + 6} Q${CANOPY_X + i * (CANOPY_W / 24) + (CANOPY_W / 48)},${CANOPY_Y + CANOPY_H + 18} ${CANOPY_X + (i + 1) * (CANOPY_W / 24)},${CANOPY_Y + CANOPY_H + 6}`}
              fill="none" stroke="#5a3010" strokeWidth="2.5"
            />
          ))}
        </g>

        {/* ── Departures board ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <rect x={BOARD_X} y={BOARD_Y} width={BOARD_W} height={BOARD_H}
            rx="3" fill="#0a0c10" stroke="#2a2a3a" strokeWidth="2" />
          <text x={BOARD_X + BOARD_W / 2} y={BOARD_Y + 14}
            textAnchor="middle" fontFamily="monospace" fontSize="9"
            fill="#f8c840" letterSpacing="1">DEPARTURES</text>
          {/* Header */}
          <line x1={BOARD_X + 4} y1={BOARD_Y + 18} x2={BOARD_X + BOARD_W - 4} y2={BOARD_Y + 18}
            stroke="#2a2a3a" strokeWidth="1" />
          {/* Rows */}
          {DEPARTURES.slice(0, 4).map((dep, i) => {
            const isActive = i === boardRow % DEPARTURES.length;
            return (
              <g key={i}>
                <rect x={BOARD_X + 4} y={BOARD_Y + 20 + i * 14}
                  width={BOARD_W - 8} height={13}
                  fill={isActive ? "#1a2850" : "transparent"}
                  rx="1"
                />
                <text x={BOARD_X + 8} y={BOARD_Y + 30 + i * 14}
                  fontFamily="monospace" fontSize="8"
                  fill={isActive ? "#f8f0a0" : "#8090a0"}>
                  {dep.dest.slice(0, 10).padEnd(10)}
                </text>
                <text x={BOARD_X + BOARD_W - 44} y={BOARD_Y + 30 + i * 14}
                  fontFamily="monospace" fontSize="8"
                  fill={isActive ? "#f8f0a0" : "#6070a0"}>
                  {dep.time}
                </text>
                <text x={BOARD_X + BOARD_W - 10} y={BOARD_Y + 30 + i * 14}
                  textAnchor="end" fontFamily="monospace" fontSize="8"
                  fill={isActive ? "#40c860" : "#405040"}>
                  {dep.track}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Station clock ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}>
          {/* Clock housing */}
          <circle cx={CLOCK_X} cy={CLOCK_Y} r={CLOCK_R + 5} fill="#6a5028" />
          <circle cx={CLOCK_X} cy={CLOCK_Y} r={CLOCK_R + 2} fill="#1a1408" />
          {/* Clock face */}
          <circle cx={CLOCK_X} cy={CLOCK_Y} r={CLOCK_R} fill="#f8f0d8" />
          {/* Hour marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const a2 = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={i}
                x1={CLOCK_X + Math.cos(a2) * (CLOCK_R - 4)}
                y1={CLOCK_Y + Math.sin(a2) * (CLOCK_R - 4)}
                x2={CLOCK_X + Math.cos(a2) * (CLOCK_R - 1)}
                y2={CLOCK_Y + Math.sin(a2) * (CLOCK_R - 1)}
                stroke="#2a1a0a" strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
              />
            );
          })}
          {/* Hour hand */}
          <line
            x1={CLOCK_X} y1={CLOCK_Y}
            x2={CLOCK_X + Math.cos(clockHourAngle * Math.PI / 180 - Math.PI / 2) * (CLOCK_R * 0.6)}
            y2={CLOCK_Y + Math.sin(clockHourAngle * Math.PI / 180 - Math.PI / 2) * (CLOCK_R * 0.6)}
            stroke="#2a1a0a" strokeWidth="2.5" strokeLinecap="round"
            style={{ transition: "none" }}
          />
          {/* Minute hand */}
          <line
            x1={CLOCK_X} y1={CLOCK_Y}
            x2={CLOCK_X + Math.cos(clockMinAngle * Math.PI / 180 - Math.PI / 2) * (CLOCK_R * 0.85)}
            y2={CLOCK_Y + Math.sin(clockMinAngle * Math.PI / 180 - Math.PI / 2) * (CLOCK_R * 0.85)}
            stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"
            style={{ transition: "none" }}
          />
          <circle cx={CLOCK_X} cy={CLOCK_Y} r={2.5} fill="#1a1a1a" />
          {/* Clock chain */}
          <line x1={CLOCK_X} y1={CLOCK_Y + CLOCK_R + 5}
            x2={CLOCK_X} y2={DEPOT_Y - 14}
            stroke="#3a2a18" strokeWidth="2" />
        </g>

        {/* ── Signal lamp ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          <line x1={SIGNAL_X} y1={GROUND_Y} x2={SIGNAL_X} y2={GROUND_Y - 128}
            stroke="#2a2a2a" strokeWidth="6" />
          <rect x={SIGNAL_X - 10} y={GROUND_Y - 148} width={20} height={34}
            rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1.5" />
          {/* Red light */}
          <circle cx={SIGNAL_X} cy={GROUND_Y - 138} r={6}
            fill={signalGreen ? "#3a0808" : "url(#td-signal-red)"}
          />
          {/* Green light */}
          <circle cx={SIGNAL_X} cy={GROUND_Y - 122} r={6}
            fill={signalGreen ? "url(#td-signal-green)" : "#083a08"}
          />
          {/* Glow */}
          <circle cx={SIGNAL_X} cy={signalGreen ? GROUND_Y - 122 : GROUND_Y - 138}
            r={16} fill={signalGreen ? "#20ff40" : "#ff2010"}
            filter="url(#td-blur-md)" opacity="0.35"
          />
        </g>

        {/* ── Steam puffs from stack ── */}
        {puffs.map((p, i) => (
          <ellipse key={i}
            cx={p.cx + p.drift} cy={p.cy}
            rx={p.r} ry={p.r * 0.7}
            fill="white" opacity={p.opacity}
            style={{ filter: "blur(4px)", transition: "none" }}
          />
        ))}
        {/* Cylinder exhaust */}
        {cylPuffs.map((p, i) => (
          <ellipse key={i}
            cx={p.cx} cy={p.cy}
            rx={p.r} ry={p.r * 0.6}
            fill="white" opacity={p.opacity}
            style={{ filter: "blur(2px)", transition: "none" }}
          />
        ))}

        {/* ── Locomotive ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateX(0)" : "translateX(120px)",
          transition: tr(0.08),
        }}>
          {/* Headlamp glow on ground */}
          <ellipse cx={LOCO_NOSE_X - 60} cy={TRACK_Y + 8} rx={88} ry={22}
            fill="#f8d060" filter="url(#td-blur-lg)" opacity="0.25"
          />
          {/* Main boiler body */}
          <rect x={LOCO_NOSE_X} y={LOCO_BOILER_Y} width={LOCO_BOILER_W} height={LOCO_H}
            rx="8" fill="url(#td-loco)"
          />
          {/* Boiler rivets */}
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i}
              cx={LOCO_NOSE_X + 24 + i * 20} cy={LOCO_BOILER_Y + 12}
              r={3} fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1"
            />
          ))}
          {/* Boiler barrel bands */}
          {[0.3, 0.55, 0.78].map((t, bi) => (
            <line key={bi}
              x1={LOCO_NOSE_X + LOCO_BOILER_W * t} y1={LOCO_BOILER_Y}
              x2={LOCO_NOSE_X + LOCO_BOILER_W * t} y2={LOCO_BOILER_Y + LOCO_H}
              stroke="#3a3a3a" strokeWidth="4"
            />
          ))}
          {/* Smokebox (front) */}
          <rect x={LOCO_NOSE_X} y={LOCO_BOILER_Y + 14} width={52} height={LOCO_H - 14}
            rx="4" fill="#141414"
          />
          {/* Smokestack */}
          <rect x={STACK_X - 10} y={STACK_Y - 32} width={20} height={32}
            rx="3" fill="#0e0e0e"
          />
          {/* Stack flared top */}
          <ellipse cx={STACK_X} cy={STACK_Y - 32} rx={14} ry={6} fill="#141414" />
          <ellipse cx={STACK_X} cy={STACK_Y - 36} rx={11} ry={5} fill="#0a0a0a" />
          {/* Dome and safety valves */}
          <ellipse cx={LOCO_NOSE_X + 120} cy={LOCO_BOILER_Y}
            rx={22} ry={10} fill="#181818" />
          <rect x={LOCO_NOSE_X + 158} y={LOCO_BOILER_Y - 14}
            width={8} height={16} rx="2" fill="#1a1a1a" />
          <rect x={LOCO_NOSE_X + 172} y={LOCO_BOILER_Y - 12}
            width={6} height={14} rx="2" fill="#1a1a1a" />
          {/* Cab */}
          <rect x={LOCO_NOSE_X + LOCO_BOILER_W - 8} y={LOCO_BOILER_Y - 14}
            width={72} height={LOCO_H + 14}
            rx="4" fill="#141414"
          />
          {/* Cab windows */}
          {[0.2, 0.6].map((wy, wi) => (
            <rect key={wi}
              x={LOCO_NOSE_X + LOCO_BOILER_W + 8} y={LOCO_BOILER_Y + LOCO_H * wy}
              width={24} height={20}
              rx="2" fill="#f8a020" opacity="0.7"
              className="td-car-window"
              style={{ animationDelay: `${wi * 0.5}s` }}
            />
          ))}
          {/* Firebox glow */}
          <ellipse
            cx={LOCO_NOSE_X + LOCO_BOILER_W + 6}
            cy={LOCO_BOILER_Y + LOCO_H}
            rx={32} ry={16}
            fill="url(#td-firebox)"
            opacity={0.5 + Math.sin(phase * 3.4) * 0.15}
            filter="url(#td-blur-sm)"
            style={{ transition: "none" }}
          />
          {/* Headlamp */}
          <circle cx={LOCO_NOSE_X + 10} cy={LOCO_BOILER_Y + LOCO_H * 0.4}
            r={14} fill="#181818"
          />
          <circle cx={LOCO_NOSE_X + 10} cy={LOCO_BOILER_Y + LOCO_H * 0.4}
            r={10} fill="url(#td-headlamp)"
          />
          {/* Cow-catcher (pilot) */}
          <polygon
            points={`${LOCO_NOSE_X},${LOCO_RAIL_Y - 28} ${LOCO_NOSE_X - 36},${LOCO_RAIL_Y} ${LOCO_NOSE_X},${LOCO_RAIL_Y}`}
            fill="#1a1a1a"
          />
          {/* Pilot struts */}
          {[-24, -12, 0, 12].map((ox, oi) => (
            <line key={oi}
              x1={LOCO_NOSE_X + ox * 0.8} y1={LOCO_RAIL_Y - 28}
              x2={LOCO_NOSE_X + ox * 0.8 - 36 + (oi * 12)} y2={LOCO_RAIL_Y}
              stroke="#3a3a3a" strokeWidth="2.5"
            />
          ))}
          {/* Running board */}
          <rect x={LOCO_NOSE_X + 12} y={LOCO_BOILER_Y + LOCO_H - 12}
            width={LOCO_BOILER_W - 18} height={8}
            fill="#222222"
          />

          {/* ─ Driving wheels (3 large — animated rotation) ─ */}
          {DRIVE_XS.map((wx, wi) => (
            <g key={wi}>
              {/* Wheel shadow */}
              <ellipse cx={wx} cy={LOCO_RAIL_Y + 4} rx={DRIVE_R} ry={8}
                fill="#0a0a0a" opacity="0.4" style={{ filter: "blur(3px)" }}
              />
              {/* Outer rim */}
              <circle cx={wx} cy={LOCO_RAIL_Y} r={DRIVE_R}
                fill="#141414" stroke="#3a3a3a" strokeWidth="5"
              />
              {/* Tire */}
              <circle cx={wx} cy={LOCO_RAIL_Y} r={DRIVE_R - 2}
                fill="none" stroke="#5a5050" strokeWidth="4"
              />
              {/* Spokes (rotating) */}
              <g transform={`rotate(${wheelAngle + wi * 28}, ${wx}, ${LOCO_RAIL_Y})`}
                style={{ transition: "none" }}>
                {Array.from({ length: 8 }, (_, si) => {
                  const sa = (si / 8) * Math.PI * 2;
                  return (
                    <line key={si}
                      x1={wx} y1={LOCO_RAIL_Y}
                      x2={wx + Math.cos(sa) * (DRIVE_R - 6)}
                      y2={LOCO_RAIL_Y + Math.sin(sa) * (DRIVE_R - 6)}
                      stroke="#2a2a2a" strokeWidth="3.5"
                    />
                  );
                })}
                {/* Crank pin */}
                <circle cx={wx + DRIVE_R * 0.58} cy={LOCO_RAIL_Y}
                  r={5} fill="#3a3a3a"
                />
              </g>
              {/* Hub */}
              <circle cx={wx} cy={LOCO_RAIL_Y} r={7}
                fill="#2a2a2a" stroke="#4a4a4a" strokeWidth="2"
              />
            </g>
          ))}

          {/* ─ Leading wheels (2 small) ─ */}
          {LEAD_XS.map((wx, wi) => (
            <g key={wi}>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={LEAD_R}
                fill="#141414" stroke="#3a3a3a" strokeWidth="3.5"
              />
              <g transform={`rotate(${wheelAngle * 1.5 + wi * 45}, ${wx}, ${LOCO_RAIL_Y})`}
                style={{ transition: "none" }}>
                {Array.from({ length: 6 }, (_, si) => {
                  const sa = (si / 6) * Math.PI * 2;
                  return (
                    <line key={si}
                      x1={wx} y1={LOCO_RAIL_Y}
                      x2={wx + Math.cos(sa) * (LEAD_R - 5)}
                      y2={LOCO_RAIL_Y + Math.sin(sa) * (LEAD_R - 5)}
                      stroke="#2a2a2a" strokeWidth="2.5"
                    />
                  );
                })}
              </g>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={5} fill="#2a2a2a" />
            </g>
          ))}

          {/* ─ Main rod + side rods (connecting DRIVE_XS[0] and DRIVE_XS[1]) ─ */}
          <g transform={`rotate(${wheelAngle}, ${DRIVE_XS[0]}, ${LOCO_RAIL_Y})`}
            style={{ transition: "none" }}>
            <line
              x1={DRIVE_XS[0]! + DRIVE_R * 0.58} y1={LOCO_RAIL_Y}
              x2={DRIVE_XS[1]! + DRIVE_R * 0.58} y2={LOCO_RAIL_Y + Math.sin(wheelAngle * Math.PI / 180) * 6}
              stroke="#3a3a3a" strokeWidth="7" strokeLinecap="round"
            />
          </g>
        </g>

        {/* ── Tender ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}>
          <rect x={TENDER_X} y={LOCO_RAIL_Y - TENDER_H}
            width={TENDER_W} height={TENDER_H}
            rx="3" fill="#181818" stroke="#2a2a2a" strokeWidth="2"
          />
          {/* Coal load */}
          {COAL_LUMPS.map((cl, i) => (
            <ellipse key={i} cx={cl.cx} cy={cl.cy} rx={cl.r} ry={cl.r * 0.65}
              fill={i % 2 === 0 ? "#1a1a1a" : "#242424"}
            />
          ))}
          {/* Tender wheels */}
          {[TENDER_X + 28, TENDER_X + TENDER_W - 28].map((wx, wi) => (
            <g key={wi}>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={22}
                fill="#141414" stroke="#3a3a3a" strokeWidth="3"
              />
              <g transform={`rotate(${wheelAngle * 0.9}, ${wx}, ${LOCO_RAIL_Y})`}
                style={{ transition: "none" }}>
                {Array.from({ length: 6 }, (_, si) => {
                  const sa = (si / 6) * Math.PI * 2;
                  return (
                    <line key={si}
                      x1={wx} y1={LOCO_RAIL_Y}
                      x2={wx + Math.cos(sa) * 17}
                      y2={LOCO_RAIL_Y + Math.sin(sa) * 17}
                      stroke="#2a2a2a" strokeWidth="2.5"
                    />
                  );
                })}
              </g>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={5} fill="#2a2a2a" />
            </g>
          ))}
        </g>

        {/* ── Passenger car ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          <rect x={CAR1_X} y={LOCO_RAIL_Y - CAR_H}
            width={CAR_W} height={CAR_H}
            rx="5" fill="#2a2030" stroke="#1a1828" strokeWidth="2"
          />
          {/* Yellow stripe */}
          <rect x={CAR1_X} y={LOCO_RAIL_Y - CAR_H * 0.32}
            width={CAR_W} height={6}
            fill="#c8a830"
          />
          {/* Car windows */}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i}
              x={CAR1_X + 18 + i * 34} y={LOCO_RAIL_Y - CAR_H + 16}
              width={22} height={30}
              rx="2"
              fill="#f8c840" opacity={0.45 + (i % 3) * 0.12}
              className="td-car-window"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
          {/* Car wheels */}
          {[CAR1_X + 32, CAR1_X + CAR_W - 32].map((wx, wi) => (
            <g key={wi}>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={22}
                fill="#141414" stroke="#3a3a3a" strokeWidth="3"
              />
              <g transform={`rotate(${wheelAngle * 0.85}, ${wx}, ${LOCO_RAIL_Y})`}
                style={{ transition: "none" }}>
                {Array.from({ length: 6 }, (_, si) => {
                  const sa = (si / 6) * Math.PI * 2;
                  return (
                    <line key={si}
                      x1={wx} y1={LOCO_RAIL_Y}
                      x2={wx + Math.cos(sa) * 17}
                      y2={LOCO_RAIL_Y + Math.sin(sa) * 17}
                      stroke="#2a2a2a" strokeWidth="2.5"
                    />
                  );
                })}
              </g>
              <circle cx={wx} cy={LOCO_RAIL_Y} r={5} fill="#2a2a2a" />
            </g>
          ))}
        </g>

        {/* ── Passengers on platform ── */}
        {PASSENGERS.map((ps, i) => (
          <g key={i} style={{
            opacity: active ? 1 : 0,
            transform: `translateY(${passengerSway(i)}px)`,
            transition: active ? "none" : tr(0.18 + i * 0.03),
          }}>
            {/* Body */}
            <rect x={ps.x - 10} y={GROUND_Y - 58} width={20} height={44}
              rx="4" fill={ps.color}
            />
            {/* Head */}
            <circle cx={ps.x + (ps.facing > 0 ? 3 : -3)} cy={GROUND_Y - 68} r={11}
              fill="#d4a878"
            />
            {/* Hat */}
            <ellipse cx={ps.x + (ps.facing > 0 ? 3 : -3)} cy={GROUND_Y - 78} rx={12} ry={4}
              fill={ps.hat}
            />
            <rect x={ps.x - 4 + (ps.facing > 0 ? 3 : -3)} y={GROUND_Y - 90}
              width={14} height={13}
              rx="2" fill={ps.hat}
            />
            {/* Luggage */}
            {ps.luggage && (
              <g>
                <rect x={ps.x + ps.facing * 12} y={GROUND_Y - 32}
                  width={18} height={22}
                  rx="2" fill="#7a5020" stroke="#5a3810" strokeWidth="1.5"
                />
                {/* Luggage straps */}
                <line x1={ps.x + ps.facing * 12} y1={GROUND_Y - 21}
                  x2={ps.x + ps.facing * 30} y2={GROUND_Y - 21}
                  stroke="#3a2010" strokeWidth="1.5"
                />
              </g>
            )}
            {/* Conductor uniform (passenger 0) */}
            {i === 0 && (
              <g>
                {/* Cap badge */}
                <rect x={ps.x - 4} y={GROUND_Y - 93} width={8} height={5}
                  rx="1" fill="#c8a830"
                />
              </g>
            )}
          </g>
        ))}

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#c8b880"
            letterSpacing="3" opacity="0.6">
            SHREWSBURY DEPOT · ROUTE 9 RAIL LINE · CIRCA 1895
          </text>
        </g>
      </svg>
    </section>
  );
}
