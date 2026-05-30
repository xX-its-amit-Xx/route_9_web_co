"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 580;

// ─── Room geometry ─────────────────────────────────────────────────────────────
const FLOOR_Y  = H - 80;
const WALL_Y   = 52;
const STAGE_Y  = FLOOR_Y - 68;    // stage platform top
const STAGE_X  = 180;
const STAGE_W  = 420;
const STAGE_H  = 68;

// ─── Rafters / ceiling beams ──────────────────────────────────────────────────
const BEAMS = Array.from({ length: 8 }, (_, i) => ({
  x: i * (W / 7) - 20,
  width: 28,
}));

// ─── Hanging kerosene lanterns ────────────────────────────────────────────────
type Lantern = { cx: number; ropeY: number; swayAmp: number; swayOffset: number };
const LANTERNS: Lantern[] = [
  { cx: 260,  ropeY: WALL_Y + 18, swayAmp: 5,  swayOffset: 0    },
  { cx: 500,  ropeY: WALL_Y + 24, swayAmp: 7,  swayOffset: 1.1  },
  { cx: 740,  ropeY: WALL_Y + 20, swayAmp: 6,  swayOffset: 2.2  },
  { cx: 980,  ropeY: WALL_Y + 22, swayAmp: 8,  swayOffset: 0.7  },
  { cx: 1220, ropeY: WALL_Y + 18, swayAmp: 5,  swayOffset: 1.8  },
];
const LANTERN_ROPE_LEN = 88;
const LANTERN_H = 46;
const LANTERN_W = 26;

// ─── Bunting strands ─────────────────────────────────────────────────────────
// Each strand: from point A to point B, N flags
type BuntingStrand = { x1: number; y1: number; x2: number; y2: number; flags: number };
const BUNTING: BuntingStrand[] = [
  { x1: 0,    y1: WALL_Y + 8,  x2: 380,  y2: WALL_Y + 48, flags: 8 },
  { x1: 380,  y1: WALL_Y + 48, x2: 720,  y2: WALL_Y + 18, flags: 7 },
  { x1: 720,  y1: WALL_Y + 18, x2: 1060, y2: WALL_Y + 52, flags: 8 },
  { x1: 1060, y1: WALL_Y + 52, x2: 1440, y2: WALL_Y + 12, flags: 7 },
];
const FLAG_COLORS = ["#c83228", "#e8a020", "#1a3a6a", "#2a6838", "#8b2a8b", "#c87828"];

// ─── Fiddler (center stage) ────────────────────────────────────────────────────
const FID_X = STAGE_X + STAGE_W * 0.5;
const FID_Y = STAGE_Y;            // feet level

// ─── Square dancers (couples on the floor) ────────────────────────────────────
type Dancer = {
  cx: number; cy: number;
  dress: string; shirt: string;
  poseAngle: number;    // spin phase offset
  partner: number;      // index of partner (for arm connection)
};

const DANCERS: Dancer[] = [
  { cx: 720,  cy: FLOOR_Y - 26, dress: "#c83228", shirt: "#1a3a6a", poseAngle: 0,    partner: 1 },
  { cx: 780,  cy: FLOOR_Y - 26, dress: "#f0e8d0", shirt: "#2a6838", poseAngle: 0.2,  partner: 0 },
  { cx: 870,  cy: FLOOR_Y - 28, dress: "#8b2a8b", shirt: "#c87828", poseAngle: 1.05, partner: 3 },
  { cx: 940,  cy: FLOOR_Y - 26, dress: "#f0e8d0", shirt: "#c83228", poseAngle: 1.25, partner: 2 },
  { cx: 1020, cy: FLOOR_Y - 26, dress: "#1a3a6a", shirt: "#2a1a0a", poseAngle: 2.09, partner: 5 },
  { cx: 1090, cy: FLOOR_Y - 28, dress: "#f0e8d0", shirt: "#1a3a6a", poseAngle: 2.29, partner: 4 },
  { cx: 1160, cy: FLOOR_Y - 26, dress: "#c87828", shirt: "#6a2818", poseAngle: 3.14, partner: 7 },
  { cx: 1230, cy: FLOOR_Y - 26, dress: "#f8f0d8", shirt: "#c87828", poseAngle: 3.34, partner: 6 },
];

// ─── Audience silhouettes (seated in chairs left of stage) ───────────────────
type Spectator = { x: number; y: number; h: number; shade: string };
const SPECTATORS: Spectator[] = Array.from({ length: 18 }, (_, i) => ({
  x:     680 + (i % 6) * 62,
  y:     FLOOR_Y - 8 - Math.floor(i / 6) * 14,
  h:     32 + (i % 4) * 4,
  shade: ["#2a1a0a", "#1a2a3a", "#3a1a08", "#2a2a1a"][i % 4] ?? "#2a1a0a",
}));

// ─── Floating music notes ─────────────────────────────────────────────────────
type MusicNote = { x: number; baseY: number; phase: number; char: string; size: number };
const MUSIC_NOTES: MusicNote[] = [
  { x: FID_X - 18, baseY: FID_Y - 120, phase: 0,    char: "♩", size: 18 },
  { x: FID_X + 24, baseY: FID_Y - 138, phase: 0.7,  char: "♪", size: 22 },
  { x: FID_X - 8,  baseY: FID_Y - 158, phase: 1.4,  char: "♫", size: 16 },
  { x: FID_X + 40, baseY: FID_Y - 112, phase: 2.1,  char: "♩", size: 14 },
  { x: FID_X - 38, baseY: FID_Y - 145, phase: 2.8,  char: "♪", size: 20 },
  { x: FID_X + 10, baseY: FID_Y - 172, phase: 3.5,  char: "♫", size: 15 },
];

// ─── Caller / MC on stage right ───────────────────────────────────────────────
const CALLER_X = STAGE_X + STAGE_W * 0.82;
const CALLER_Y = STAGE_Y;

// ─── Banjo player (stage left) ────────────────────────────────────────────────
const BANJO_X = STAGE_X + STAGE_W * 0.18;
const BANJO_Y = STAGE_Y;

// ─── Hay bales stacked stage-right wall ───────────────────────────────────────
type HayBale = { x: number; y: number; w: number; h: number };
const HAY_BALES: HayBale[] = [
  { x: 68,  y: FLOOR_Y - 48, w: 72, h: 44 },
  { x: 68,  y: FLOOR_Y - 88, w: 72, h: 44 },
  { x: 148, y: FLOOR_Y - 48, w: 64, h: 44 },
  { x: W - 140, y: FLOOR_Y - 48, w: 72, h: 44 },
  { x: W - 140, y: FLOOR_Y - 88, w: 72, h: 44 },
  { x: W - 72,  y: FLOOR_Y - 48, w: 58, h: 44 },
];

// ─── Barn board wall pattern (vertical planks) ────────────────────────────────
const PLANK_W = 52;

export function FiddleContest() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]     = useState(false);
  const [phase, setPhase]       = useState(0);    // master beat phase

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
    const tick = setInterval(() => {
      t += 0.045;
      setPhase(t);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  // ── Bow arm angle (fiddle stroke back/forth) ──
  const bowAngle = Math.sin(phase * 4.8) * 28;

  // ── Lantern sway ──
  const lanternSwings = LANTERNS.map(l =>
    Math.sin(phase * 1.4 + l.swayOffset) * l.swayAmp
  );

  // ── Dancer spin offsets (each couple rotates around each other) ──
  // Each dancer has a circular orbit offset
  const dancerOffsets = DANCERS.map((d, i) => {
    const beatSpin = phase * 1.8 + d.poseAngle;
    const orbitR = 22;
    return {
      dx: Math.cos(beatSpin) * orbitR - orbitR * 0.5,
      dy: Math.sin(beatSpin * 0.5) * 8,
      rot: Math.sin(beatSpin) * 18,
    };
  });

  // ── Music note float ──
  const noteOffsets = MUSIC_NOTES.map(n => {
    const t2 = (phase * 0.7 + n.phase) % (Math.PI * 2);
    return {
      dx: Math.sin(t2 * 1.3) * 12,
      dy: -((phase * 18 + n.phase * 22) % 80),
      opacity: Math.max(0, Math.sin(t2 * 0.6 + 0.3) * 0.85),
    };
  });

  return (
    <section style={{ background: "#1a0e08", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes fc-flag-wave {
          0%,100% { transform: skewX(0deg) scaleY(1); }
          40%     { transform: skewX(-10deg) scaleY(0.92); }
          70%     { transform: skewX(6deg) scaleY(1.04); }
        }
        @keyframes fc-floor-glow {
          0%,100% { opacity: 0.18; }
          50%     { opacity: 0.28; }
        }
        @keyframes fc-stage-light {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.72; }
        }
        .fc-flag  { animation: fc-flag-wave 2.2s ease-in-out infinite; transform-origin: left top; }
        .fc-glow  { animation: fc-floor-glow 3s ease-in-out infinite; }
        .fc-spot  { animation: fc-stage-light 2.5s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 340 }}
        aria-label="New England village hall fiddle contest and barn dance — fiddler on stage, square dancers, bunting, kerosene lanterns"
        role="img"
      >
        <defs>
          <linearGradient id="fc-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1e14" />
            <stop offset="100%" stopColor="#1e160e" />
          </linearGradient>
          <linearGradient id="fc-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a5028" />
            <stop offset="100%" stopColor="#5a3818" />
          </linearGradient>
          <linearGradient id="fc-stage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a6030" />
            <stop offset="100%" stopColor="#6a4820" />
          </linearGradient>
          <radialGradient id="fc-lantern-glow" cx="50%" cy="60%" r="50%">
            <stop offset="0%"   stopColor="#f8c840" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e08020" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="fc-stage-spot" cx="50%" cy="0%" r="80%">
            <stop offset="0%"   stopColor="#f8e090" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e0a020" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="fc-hay-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f0b820" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c07010" stopOpacity="0"    />
          </radialGradient>
          <filter id="fc-blur-sm">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="fc-blur-md">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <clipPath id="fc-wall-clip">
            <rect x="0" y={WALL_Y} width={W} height={FLOOR_Y - WALL_Y} />
          </clipPath>
        </defs>

        {/* ── Barn-board wall ── */}
        <rect x="0" y={WALL_Y} width={W} height={FLOOR_Y - WALL_Y} fill="url(#fc-wall)" />
        {Array.from({ length: Math.ceil(W / PLANK_W) + 1 }, (_, i) => (
          <line key={i}
            x1={i * PLANK_W} y1={WALL_Y} x2={i * PLANK_W} y2={FLOOR_Y}
            stroke="#3a2818" strokeWidth="2" opacity="0.45"
          />
        ))}
        {/* Horizontal board breaks */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i}
            x1="0" y1={WALL_Y + 80 + i * 70} x2={W} y2={WALL_Y + 80 + i * 70}
            stroke="#3a2818" strokeWidth="1" opacity="0.2"
          />
        ))}

        {/* ── Ceiling beams ── */}
        {BEAMS.map((b, i) => (
          <rect key={i} x={b.x} y={WALL_Y - 8} width={b.width} height={FLOOR_Y - WALL_Y + 8}
            fill="#2a1a0c" opacity="0.7" />
        ))}

        {/* ── Hardwood floor ── */}
        <rect x="0" y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#fc-floor)" />
        {Array.from({ length: 32 }, (_, i) => (
          <line key={i}
            x1={i * 46} y1={FLOOR_Y} x2={i * 46} y2={H}
            stroke="#4a2e10" strokeWidth="1" opacity="0.4"
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i}
            x1="0" y1={FLOOR_Y + 24 + i * 18} x2={W} y2={FLOOR_Y + 24 + i * 18}
            stroke="#4a2e10" strokeWidth="0.7" opacity="0.22"
          />
        ))}

        {/* ── Stage platform ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          <rect x={STAGE_X} y={STAGE_Y} width={STAGE_W} height={STAGE_H}
            fill="url(#fc-stage)" />
          {/* Stage front edge shadow */}
          <rect x={STAGE_X} y={STAGE_Y} width={STAGE_W} height={6} rx="1"
            fill="#3a2010" />
          {/* Stage floor planks */}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i}
              x1={STAGE_X + i * (STAGE_W / 10)} y1={STAGE_Y}
              x2={STAGE_X + i * (STAGE_W / 10)} y2={STAGE_Y + STAGE_H}
              stroke="#5a3818" strokeWidth="1.5" opacity="0.35"
            />
          ))}
          {/* Stage risers */}
          {Array.from({ length: 3 }, (_, i) => (
            <rect key={i}
              x={STAGE_X + 14 + i * 12} y={STAGE_Y + STAGE_H - 2}
              width={10} height={FLOOR_Y - STAGE_Y - STAGE_H + 4}
              fill="#5a3010" />
          ))}
          <rect x={STAGE_X + STAGE_W - 46} y={STAGE_Y + STAGE_H - 2}
            width={10} height={FLOOR_Y - STAGE_Y - STAGE_H + 4}
            fill="#5a3010" />
          <rect x={STAGE_X + STAGE_W - 26} y={STAGE_Y + STAGE_H - 2}
            width={10} height={FLOOR_Y - STAGE_Y - STAGE_H + 4}
            fill="#5a3010" />
          {/* Steps */}
          <rect x={STAGE_X + STAGE_W - 60} y={STAGE_Y + STAGE_H}
            width={58} height={FLOOR_Y - STAGE_Y - STAGE_H}
            rx="1" fill="#6a4020" />
        </g>

        {/* ── Stage spotlight cone ── */}
        <path
          d={`M${STAGE_X + STAGE_W * 0.3},${WALL_Y} L${STAGE_X + STAGE_W * 0.7},${WALL_Y} L${FID_X + 80},${STAGE_Y} L${FID_X - 80},${STAGE_Y} Z`}
          fill="url(#fc-stage-spot)" className="fc-spot"
        />

        {/* ── Hay bales ── */}
        {HAY_BALES.map((hb, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.08 + i * 0.03) }}>
            {/* Glow */}
            <ellipse cx={hb.x + hb.w / 2} cy={hb.y + hb.h}
              rx={hb.w * 0.7} ry={12}
              fill="url(#fc-hay-glow)" style={{ filter: "blur(4px)" }}
            />
            {/* Bale */}
            <rect x={hb.x} y={hb.y} width={hb.w} height={hb.h}
              rx="6" fill="#c89830" />
            {/* Binding twine */}
            {[0.28, 0.72].map((tx, ti) => (
              <line key={ti}
                x1={hb.x + hb.w * tx} y1={hb.y}
                x2={hb.x + hb.w * tx} y2={hb.y + hb.h}
                stroke="#8a6010" strokeWidth="3" />
            ))}
            {/* Straw texture strokes */}
            {Array.from({ length: 8 }, (_, si) => (
              <line key={si}
                x1={hb.x + 4 + si * (hb.w / 8)} y1={hb.y + 8}
                x2={hb.x + 8 + si * (hb.w / 8)} y2={hb.y + hb.h - 8}
                stroke="#e0b040" strokeWidth="1.5" opacity="0.5"
              />
            ))}
          </g>
        ))}

        {/* ── Bunting (festoon flags) ── */}
        {BUNTING.map((strand, si) => {
          const dx = strand.x2 - strand.x1;
          const dy = strand.y2 - strand.y1;
          return (
            <g key={si}>
              {/* Catenary rope */}
              <path
                d={`M${strand.x1},${strand.y1} Q${(strand.x1 + strand.x2) / 2},${Math.max(strand.y1, strand.y2) + 22} ${strand.x2},${strand.y2}`}
                fill="none" stroke="#8a7050" strokeWidth="1.5" opacity="0.6"
              />
              {/* Flags */}
              {Array.from({ length: strand.flags }, (_, fi) => {
                const t = (fi + 0.5) / strand.flags;
                const px = strand.x1 + dx * t;
                // catenary sag
                const sag = 22 * Math.sin(t * Math.PI);
                const py = strand.y1 + dy * t + sag;
                const col = FLAG_COLORS[(si * 3 + fi) % FLAG_COLORS.length] ?? "#c83228";
                return (
                  <polygon key={fi}
                    points={`${px},${py} ${px + 14},${py} ${px + 7},${py + 18}`}
                    fill={col}
                    className="fc-flag"
                    style={{ animationDelay: `${(si * 0.3 + fi * 0.1) % 1.8}s` }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── Hanging lanterns ── */}
        {LANTERNS.map((ln, i) => {
          const swing = lanternSwings[i] ?? 0;
          const lx = ln.cx + swing;
          const lyTop = ln.ropeY;
          const lyBot = lyTop + LANTERN_ROPE_LEN;
          return (
            <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.1 + i * 0.04) }}>
              {/* Glow pool on floor */}
              <ellipse cx={lx} cy={FLOOR_Y + 8} rx={62} ry={16}
                fill="#f8c840" className="fc-glow"
                style={{ animationDelay: `${i * 0.4}s`, filter: "blur(10px)" }}
                opacity="0.18"
              />
              {/* Wide glow halo */}
              <ellipse cx={lx} cy={lyBot + LANTERN_H / 2} rx={88} ry={66}
                fill="url(#fc-lantern-glow)" filter="url(#fc-blur-md)" opacity="0.55"
              />
              {/* Rope */}
              <line x1={ln.cx} y1={lyTop} x2={lx} y2={lyBot}
                stroke="#5a3818" strokeWidth="1.5" />
              {/* Lantern body */}
              <rect x={lx - LANTERN_W / 2} y={lyBot}
                width={LANTERN_W} height={LANTERN_H}
                rx="4" fill="#2a1a08" stroke="#5a3818" strokeWidth="1.5"
              />
              {/* Glass panels (amber glow) */}
              {[-1, 1].map(side => (
                <rect key={side}
                  x={lx + side * (LANTERN_W / 2 - 6)} y={lyBot + 6}
                  width={8} height={LANTERN_H - 12}
                  rx="2"
                  fill="#f8c840" opacity="0.65"
                />
              ))}
              <rect x={lx - LANTERN_W / 2 + 3} y={lyBot + 6}
                width={LANTERN_W - 6} height={LANTERN_H - 12}
                rx="2" fill="#f8c840" opacity="0.35"
              />
              {/* Cap */}
              <polygon
                points={`${lx - LANTERN_W / 2 - 4},${lyBot} ${lx + LANTERN_W / 2 + 4},${lyBot} ${lx},${lyBot - 12}`}
                fill="#3a2010"
              />
              {/* Hook */}
              <line x1={lx} y1={lyBot - 12} x2={lx} y2={lyBot - 2}
                stroke="#5a3818" strokeWidth="3" />
            </g>
          );
        })}

        {/* ── Fiddler (center stage) ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(18px)",
          transition: tr(0.14),
        }}>
          {/* Feet + boots */}
          <ellipse cx={FID_X - 7} cy={FID_Y - 2} rx={7} ry={4} fill="#1a1008" />
          <ellipse cx={FID_X + 9} cy={FID_Y - 2} rx={7} ry={4} fill="#1a1008" />
          {/* Trousers */}
          <rect x={FID_X - 12} y={FID_Y - 52} width={24} height={52}
            rx="4" fill="#1a2a3a" />
          {/* Braces (suspenders) */}
          <line x1={FID_X - 6} y1={FID_Y - 52} x2={FID_X - 2} y2={FID_Y - 92}
            stroke="#c83228" strokeWidth="3" opacity="0.8" />
          <line x1={FID_X + 6} y1={FID_Y - 52} x2={FID_X + 2} y2={FID_Y - 92}
            stroke="#c83228" strokeWidth="3" opacity="0.8" />
          {/* Shirt */}
          <rect x={FID_X - 14} y={FID_Y - 96} width={28} height={46}
            rx="4" fill="#f0e8d0" />
          {/* Left arm holding fiddle (static) */}
          <path d={`M${FID_X - 14},${FID_Y - 82} Q${FID_X - 32},${FID_Y - 78} ${FID_X - 44},${FID_Y - 62}`}
            fill="none" stroke="#f0e8d0" strokeWidth="12" strokeLinecap="round" />
          {/* Fiddle body */}
          <ellipse cx={FID_X - 50} cy={FID_Y - 60} rx={14} ry={10}
            fill="#8b4513" transform={`rotate(-22, ${FID_X - 50}, ${FID_Y - 60})`} />
          <ellipse cx={FID_X - 42} cy={FID_Y - 52} rx={12} ry={9}
            fill="#a05020" transform={`rotate(-22, ${FID_X - 42}, ${FID_Y - 52})`} />
          {/* F-holes */}
          <text x={FID_X - 48} y={FID_Y - 54} fontSize="7" fill="#5a2808"
            transform={`rotate(-22, ${FID_X - 48}, ${FID_Y - 54})`}>𝄐</text>
          {/* Strings */}
          {[-3, -1, 1, 3].map(sx => (
            <line key={sx}
              x1={FID_X - 56 + sx} y1={FID_Y - 70}
              x2={FID_X - 40 + sx} y2={FID_Y - 46}
              stroke="#c8c0a0" strokeWidth="0.7" opacity="0.8"
              transform={`rotate(-22, ${FID_X - 50}, ${FID_Y - 60})`}
            />
          ))}
          {/* Right arm (BOW ARM — animated) */}
          <g style={{
            transform: `rotate(${bowAngle}deg)`,
            transformOrigin: `${FID_X + 14}px ${FID_Y - 82}px`,
            transition: "none",
          }}>
            <path d={`M${FID_X + 14},${FID_Y - 82} Q${FID_X + 36},${FID_Y - 72} ${FID_X + 52},${FID_Y - 60}`}
              fill="none" stroke="#f0e8d0" strokeWidth="12" strokeLinecap="round" />
            {/* Bow stick */}
            <line x1={FID_X + 28} y1={FID_Y - 72}
              x2={FID_X + 88} y2={FID_Y - 48}
              stroke="#5a3010" strokeWidth="3" strokeLinecap="round" />
            {/* Bow hair */}
            <line x1={FID_X + 30} y1={FID_Y - 70}
              x2={FID_X + 86} y2={FID_Y - 50}
              stroke="#d8d0c0" strokeWidth="1.5" opacity="0.8" />
          </g>
          {/* Head */}
          <circle cx={FID_X} cy={FID_Y - 114} r={14} fill="#d4a878" />
          {/* Hair */}
          <ellipse cx={FID_X} cy={FID_Y - 122} rx={13} ry={8} fill="#2a1a0a" />
          {/* Bow tie */}
          <path d={`M${FID_X - 6},${FID_Y - 98} L${FID_X},${FID_Y - 94} L${FID_X + 6},${FID_Y - 98} L${FID_X + 6},${FID_Y - 92} L${FID_X},${FID_Y - 96} L${FID_X - 6},${FID_Y - 92} Z`}
            fill="#c83228" />
        </g>

        {/* ── Banjo player (stage left) ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(16px)",
          transition: tr(0.18),
        }}>
          <ellipse cx={BANJO_X - 6} cy={BANJO_Y - 2} rx={6} ry={4} fill="#1a1008" />
          <ellipse cx={BANJO_X + 8} cy={BANJO_Y - 2} rx={6} ry={4} fill="#1a1008" />
          <rect x={BANJO_X - 11} y={BANJO_Y - 48} width={22} height={48}
            rx="4" fill="#2a3a1a" />
          <rect x={BANJO_X - 13} y={BANJO_Y - 90} width={26} height={44}
            rx="4" fill="#c87828" />
          {/* Banjo body */}
          <circle cx={BANJO_X + 34} cy={BANJO_Y - 68} r={18} fill="#8b4513" />
          <circle cx={BANJO_X + 34} cy={BANJO_Y - 68} r={12} fill="#1a1008" opacity="0.7" />
          {/* Neck */}
          <rect x={BANJO_X + 14} y={BANJO_Y - 78} width={6} height={36}
            rx="2" fill="#6a3810"
            transform={`rotate(-18, ${BANJO_X + 14}, ${BANJO_Y - 78})`} />
          {/* Arms */}
          <path d={`M${BANJO_X - 13},${BANJO_Y - 76} Q${BANJO_X + 8},${BANJO_Y - 70} ${BANJO_X + 18},${BANJO_Y - 62}`}
            fill="none" stroke="#c87828" strokeWidth="11" strokeLinecap="round" />
          <path d={`M${BANJO_X + 13},${BANJO_Y - 74} Q${BANJO_X + 28},${BANJO_Y - 68} ${BANJO_X + 34},${BANJO_Y - 52}`}
            fill="none" stroke="#c87828" strokeWidth="10" strokeLinecap="round" />
          <circle cx={BANJO_X} cy={BANJO_Y - 106} r={12} fill="#d4a878" />
          <ellipse cx={BANJO_X - 2} cy={BANJO_Y - 113} rx={11} ry={7} fill="#5a3820" />
        </g>

        {/* ── Caller / MC (stage right, mouth open) ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(16px)",
          transition: tr(0.2),
        }}>
          <ellipse cx={CALLER_X - 6} cy={CALLER_Y - 2} rx={6} ry={4} fill="#1a1008" />
          <ellipse cx={CALLER_X + 8} cy={CALLER_Y - 2} rx={6} ry={4} fill="#1a1008" />
          <rect x={CALLER_X - 11} y={CALLER_Y - 48} width={22} height={48}
            rx="4" fill="#1a3a6a" />
          <rect x={CALLER_X - 13} y={CALLER_Y - 90} width={26} height={44}
            rx="4" fill="#f0e8d0" />
          <circle cx={CALLER_X} cy={CALLER_Y - 106} r={13} fill="#d4a878" />
          <ellipse cx={CALLER_X} cy={CALLER_Y - 113} rx={12} ry={7} fill="#3a2010" />
          {/* Mouth open calling */}
          <ellipse cx={CALLER_X + 2} cy={CALLER_Y - 102} rx={4} ry={3} fill="#8b2010" />
          {/* Raised arm (calling gesture) */}
          <path d={`M${CALLER_X - 13},${CALLER_Y - 78} Q${CALLER_X - 28},${CALLER_Y - 94} ${CALLER_X - 24},${CALLER_Y - 110}`}
            fill="none" stroke="#f0e8d0" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* ── Square dancers ── */}
        {DANCERS.map((d, i) => {
          const off = dancerOffsets[i];
          if (!off) return null;
          const isDress = i % 2 === 0;
          return (
            <g key={i} style={{
              opacity: active ? 1 : 0,
              transform: active
                ? `translate(${off.dx}px, ${off.dy}px)`
                : "translateY(14px)",
              transition: active ? "none" : tr(0.24 + i * 0.03),
            }}>
              {/* Feet */}
              <ellipse cx={d.cx - 5} cy={d.cy + 2} rx={5} ry={3} fill="#1a1008" />
              <ellipse cx={d.cx + 7} cy={d.cy + 2} rx={5} ry={3} fill="#1a1008" />
              {isDress ? (
                // Woman — full skirt (spinning ellipse)
                <>
                  <ellipse cx={d.cx} cy={d.cy - 14}
                    rx={22 + Math.abs(off.rot) * 0.3} ry={30}
                    fill={d.dress} opacity="0.92"
                  />
                  <ellipse cx={d.cx} cy={d.cy - 12}
                    rx={18} ry={20}
                    fill={d.shirt}
                  />
                  {/* Petticoat hem visible during spin */}
                  <ellipse cx={d.cx} cy={d.cy - 14}
                    rx={24 + Math.abs(off.rot) * 0.4} ry={4}
                    fill="#f8f0e0" opacity="0.6"
                  />
                </>
              ) : (
                // Man — trousers + shirt
                <>
                  <rect x={d.cx - 10} y={d.cy - 44} width={20} height={44}
                    rx="4" fill={d.shirt} />
                  <rect x={d.cx - 12} y={d.cy - 52} width={24} height={30}
                    rx="4" fill={d.dress} />
                </>
              )}
              {/* Arms reaching to partner */}
              <line x1={d.cx + (isDress ? -14 : 14)} y1={d.cy - 32}
                x2={d.cx + (isDress ? -36 : 36)} y2={d.cy - 24}
                stroke={isDress ? d.shirt : d.dress} strokeWidth="8" strokeLinecap="round"
              />
              {/* Head */}
              <circle cx={d.cx} cy={d.cy - 62} r={10} fill="#d4a878" />
              <ellipse cx={d.cx} cy={d.cy - 70} rx={9} ry={6}
                fill={isDress ? "#3a2010" : "#2a1a0a"} />
            </g>
          );
        })}

        {/* ── Floating music notes ── */}
        {MUSIC_NOTES.map((n, i) => {
          const off = noteOffsets[i];
          if (!off) return null;
          return (
            <text key={i}
              x={n.x + off.dx}
              y={n.baseY + off.dy}
              fontSize={n.size}
              fill="#f8c840"
              fontFamily="serif"
              opacity={off.opacity}
              style={{ transition: "none", pointerEvents: "none" }}
            >
              {n.char}
            </text>
          );
        })}

        {/* ── Audience silhouettes ── */}
        {SPECTATORS.map((sp, i) => (
          <g key={i} style={{ opacity: active ? 0.7 : 0, transition: tr(0.3 + i * 0.02) }}>
            {/* Body */}
            <rect x={sp.x - 9} y={sp.y - sp.h} width={18} height={sp.h}
              rx="4" fill={sp.shade} />
            {/* Head */}
            <circle cx={sp.x} cy={sp.y - sp.h - 9} r={9} fill={sp.shade} />
          </g>
        ))}

        {/* ── Decorative banner on stage back wall ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          <rect x={STAGE_X + 40} y={STAGE_Y - 58} width={STAGE_W - 80} height={40}
            rx="4" fill="#1a3a6a" stroke="#2a5a9a" strokeWidth="2" />
          <text
            x={STAGE_X + STAGE_W / 2} y={STAGE_Y - 32}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="15" fontWeight="bold"
            fill="#f8e090" letterSpacing="3"
          >
            SHREWSBURY GRANGE HALL
          </text>
          <text
            x={STAGE_X + STAGE_W / 2} y={STAGE_Y - 16}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="10"
            fill="#c8d0f0" letterSpacing="2" opacity="0.75"
          >
            ANNUAL FIDDLE CONTEST · 1894
          </text>
        </g>

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 12} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#d4b060"
            letterSpacing="3" opacity="0.6">
            SHREWSBURY · GRANGE HALL BARN DANCE · ROUTE 9
          </text>
        </g>
      </svg>
    </section>
  );
}
