"use client";
import { useEffect, useRef, useState } from "react";

// Pass 59: New England town meeting hall interior — heavy timber trusses, perspective pews, arched windows, podium

const W = 1440, H = 580;

// ─── Vanishing point (one-point perspective) ────────────────────────────
const VP_X = 720, VP_Y = 226;

// ─── Floor ──────────────────────────────────────────────────────────────
const FLOOR_Y = 544;  // bottom of visible floor
const FLOOR_NEAR_L = 0, FLOOR_NEAR_R = W;
// Floor plank vanishing lines
const FLOOR_PLANK_XS = Array.from({ length: 13 }, (_, i) =>
  Math.round(80 + i * (W - 160) / 12)
);

// ─── Ceiling (barrel-vaulted, arched) ───────────────────────────────────
const CEIL_Y_CENTER = 42;   // apex of ceiling vault
const CEIL_Y_SIDES  = 148;  // where ceiling meets walls at sides

// ─── Walls ──────────────────────────────────────────────────────────────
const WALL_LEFT_X  = 0;
const WALL_RIGHT_X = W;
const WAINSCOT_H   = 120; // wainscoting height from floor

// ─── Windows (arched, tall — both side walls, in perspective) ───────────
// Left-wall windows: recede to VP
type ArchWin = {
  nearX: number; farX: number;
  nearTop: number; farTop: number;
  nearBot: number; farBot: number;
  nearW: number;  farW: number;
};

// Left side windows (4 windows receding into distance)
const L_WINDOWS: ArchWin[] = [
  { nearX: 62,  farX: 132, nearTop: 188, farTop: 208, nearBot: 438, farBot: 404, nearW: 72,  farW: 60  },
  { nearX: 162, farX: 212, nearTop: 196, farTop: 210, nearBot: 420, farBot: 398, nearW: 58,  farW: 48  },
  { nearX: 248, farX: 286, nearTop: 202, farTop: 212, nearBot: 406, farBot: 390, nearW: 46,  farW: 38  },
  { nearX: 318, farX: 348, nearTop: 206, farTop: 214, nearBot: 394, farBot: 382, nearW: 38,  farW: 32  },
];
// Right side windows (mirrored)
const R_WINDOWS: ArchWin[] = L_WINDOWS.map(w => ({
  nearX:  W - w.nearX - w.nearW,
  farX:   W - w.farX  - w.farW,
  nearTop: w.nearTop, farTop: w.farTop,
  nearBot: w.nearBot, farBot: w.farBot,
  nearW:  w.nearW, farW: w.farW,
}));

// ─── Timber king-post trusses ────────────────────────────────────────────
// Each truss: tie beam (horizontal), two rafters, vertical king post, two struts
type Truss = {
  y:      number;  // tie-beam height (floor perspective projection)
  lx:     number;  // left x at this depth
  rx:     number;  // right x
  apex_x: number;  // should equal VP_X (king post top)
  apex_y: number;  // rafter apex y
};

function makeTruss(t: number): Truss {
  // t = 0 (near) → 1 (far)
  const lx  = Math.round(VP_X + (FLOOR_NEAR_L - VP_X) * (1 - t * 0.72));
  const rx  = Math.round(VP_X + (FLOOR_NEAR_R - VP_X) * (1 - t * 0.72));
  const y   = Math.round(FLOOR_Y - (FLOOR_Y - CEIL_Y_SIDES) * (0.28 + t * 0.58));
  const apy = Math.round(CEIL_Y_CENTER + (CEIL_Y_SIDES - CEIL_Y_CENTER) * (1 - t));
  return { y, lx, rx, apex_x: VP_X, apex_y: apy };
}

const TRUSSES: Truss[] = Array.from({ length: 6 }, (_, i) =>
  makeTruss(i / 5)
);

// ─── Pews (rows receding to VP) ────────────────────────────────────────
type PewRow = {
  leftX: number; rightX: number;
  frontY: number; backY: number;
  seatH: number;
};

function makePew(t: number): PewRow {
  const scale = 1 - t * 0.64;
  const halfW = 420 * scale;
  const frontY = Math.round(VP_Y + (FLOOR_Y - VP_Y) * (0.14 + t * 0.76));
  return {
    leftX:  Math.round(VP_X - halfW),
    rightX: Math.round(VP_X + halfW),
    frontY,
    backY:  Math.round(frontY - 18 * scale),
    seatH:  Math.round(24 * scale),
  };
}

const PEW_ROWS: PewRow[] = Array.from({ length: 10 }, (_, i) =>
  makePew(i / 9)
);

// ─── Aisle (center gap between pew sections) ────────────────────────────
const AISLE_W_NEAR = 92, AISLE_W_FAR = 18;

// ─── Podium / pulpit at far end ─────────────────────────────────────────
const POD_CX = VP_X;
const POD_Y1 = 296, POD_Y2 = 420; // top and bottom of podium face
const POD_W  = 148, POD_H = 124;
const POD_X1 = POD_CX - POD_W / 2, POD_X2 = POD_CX + POD_W / 2;

// Podium panel details
const POD_PANEL_INSET = 10;

// Shrewsbury town seal on podium (simplified heraldic circle)
const SEAL_CX = POD_CX, SEAL_CY = POD_Y1 + (POD_H / 2) + 4;
const SEAL_R  = 36;

// ─── American flag (on staff next to podium) ────────────────────────────
const FLAG_X = POD_X2 + 22, FLAG_Y = 228;
const FLAG_W = 68, FLAG_H = 42;
const FLAG_STAFF_Y2 = 440;

// Flag stripes
const FLAG_STRIPE_H = FLAG_H / 13;

// ─── Balcony rail at rear ────────────────────────────────────────────────
// (rear wall / balcony face at far distance — very subtle)
const BAL_Y = Math.round(VP_Y + (FLOOR_Y - VP_Y) * 0.08);
const BAL_H = 32;

// ─── Hanging oil lamps ───────────────────────────────────────────────────
type OilLamp = { cx: number; cy: number; ropeY: number; r: number };
const OIL_LAMPS: OilLamp[] = [
  { cx: VP_X - 224, cy: 198, ropeY: 112, r: 12 },
  { cx: VP_X,       cy: 182, ropeY: 96,  r: 14 },
  { cx: VP_X + 224, cy: 198, ropeY: 112, r: 12 },
  { cx: VP_X - 112, cy: 188, ropeY: 102, r: 12 },
  { cx: VP_X + 112, cy: 188, ropeY: 102, r: 12 },
];

// ─── Route 9 Web Co. banner above podium ─────────────────────────────────
const BANNER_X = POD_CX - 98, BANNER_Y = 244;
const BANNER_W = 196, BANNER_H = 28;

export function TownMeetingHall() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section
      aria-label="New England town meeting hall interior with timber trusses and pews"
      style={{ background: "#1a140a", overflow: "hidden" }}
    >
      <style>{`
        @keyframes tmh-flicker {
          0%,100% { opacity: 0.82; }
          30%      { opacity: 1;    }
          60%      { opacity: 0.70; }
        }
        @keyframes tmh-glow {
          0%,100% { opacity: 0.44; }
          50%      { opacity: 0.62; }
        }
        .tmh-lamp  { animation: ${active ? "tmh-flicker 2.2s ease-in-out infinite" : "none"}; }
        .tmh-glow  { animation: ${active ? "tmh-glow 2.8s ease-in-out infinite" : "none"}; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 580 }}
      >
        <defs>
          {/* Wall plaster — warm cream */}
          <linearGradient id="tmh-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4c8a8" />
            <stop offset="60%"  stopColor="#c8bc98" />
            <stop offset="100%" stopColor="#b8a888" />
          </linearGradient>
          {/* Wainscoting — dark walnut */}
          <linearGradient id="tmh-wainscot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3418" />
            <stop offset="100%" stopColor="#2e2010" />
          </linearGradient>
          {/* Floor — wide-plank pine */}
          <linearGradient id="tmh-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a87840" />
            <stop offset="100%" stopColor="#7a5420" />
          </linearGradient>
          {/* Ceiling — pale plaster */}
          <linearGradient id="tmh-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8e0c8" />
            <stop offset="100%" stopColor="#d0c8a8" />
          </linearGradient>
          {/* Heavy timber — dark oak */}
          <linearGradient id="tmh-timber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#5a3e20" />
            <stop offset="100%" stopColor="#3a2810" />
          </linearGradient>
          {/* Pew wood */}
          <linearGradient id="tmh-pew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a4a22" />
            <stop offset="100%" stopColor="#4a3010" />
          </linearGradient>
          {/* Window golden morning light */}
          <linearGradient id="tmh-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8e8b0" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#f0d090" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#e0b060" stopOpacity="0.5" />
          </linearGradient>
          {/* Podium */}
          <linearGradient id="tmh-podium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a5828" />
            <stop offset="100%" stopColor="#4a3010" />
          </linearGradient>
          {/* Lamp glow */}
          <radialGradient id="tmh-lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#f0a030" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c06010" stopOpacity="0"   />
          </radialGradient>
          {/* Overall warm room glow */}
          <radialGradient id="tmh-room-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#f0c060" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c08020" stopOpacity="0"   />
          </radialGradient>
          {/* Blur for lamp halos */}
          <filter id="tmh-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <filter id="tmh-blur-sm">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* ─── CEILING ─── */}
        {/* Barrel vault shape */}
        <path
          d={`M ${WALL_LEFT_X},${CEIL_Y_SIDES} Q ${VP_X},${CEIL_Y_CENTER} ${WALL_RIGHT_X},${CEIL_Y_SIDES} L ${WALL_RIGHT_X},0 L ${WALL_LEFT_X},0 Z`}
          fill="url(#tmh-ceil)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        />
        {/* Barrel vault ribs (arching lines) */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 8;
          const lx = Math.round(WALL_LEFT_X + t * (VP_X - WALL_LEFT_X) * 0.88);
          const rx = Math.round(WALL_RIGHT_X - t * (WALL_RIGHT_X - VP_X) * 0.88);
          const apY = Math.round(CEIL_Y_CENTER + (CEIL_Y_SIDES - CEIL_Y_CENTER) * (1 - t * 0.7));
          return (
            <path key={i}
              d={`M ${lx},${CEIL_Y_SIDES} Q ${VP_X},${apY} ${rx},${CEIL_Y_SIDES}`}
              fill="none" stroke="#c0b898" strokeWidth={1.5} opacity={0.4}
              style={{ opacity: active ? 0.4 : 0, transition: tr(0.06) }}
            />
          );
        })}

        {/* ─── WALLS (left + right side) ─── */}
        {/* Left wall */}
        <polygon
          points={`${WALL_LEFT_X},0 ${WALL_LEFT_X},${H} ${VP_X},${VP_Y} `}
          fill="url(#tmh-wall)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        />
        {/* Right wall */}
        <polygon
          points={`${WALL_RIGHT_X},0 ${WALL_RIGHT_X},${H} ${VP_X},${VP_Y}`}
          fill="url(#tmh-wall)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        />

        {/* ─── WINDOWS ─── */}
        {/* Left windows */}
        {L_WINDOWS.map((win, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.1 + i * 0.04) }}>
            {/* Window opening */}
            <path
              d={`M ${win.nearX},${win.nearBot} L ${win.nearX},${win.nearTop + 20} Q ${win.nearX + win.nearW / 2},${win.nearTop - 12} ${win.nearX + win.nearW},${win.nearTop + 20} L ${win.nearX + win.nearW},${win.nearBot} Z`}
              fill="url(#tmh-window)"
            />
            {/* Window frame */}
            <path
              d={`M ${win.nearX},${win.nearBot} L ${win.nearX},${win.nearTop + 20} Q ${win.nearX + win.nearW / 2},${win.nearTop - 12} ${win.nearX + win.nearW},${win.nearTop + 20} L ${win.nearX + win.nearW},${win.nearBot}`}
              fill="none" stroke="#5a4018" strokeWidth={4}
            />
            {/* Muntin cross */}
            <line x1={win.nearX + win.nearW / 2} y1={win.nearTop + 14}
              x2={win.nearX + win.nearW / 2} y2={win.nearBot}
              stroke="#5a4018" strokeWidth={2} />
            <line x1={win.nearX} y1={win.nearTop + (win.nearBot - win.nearTop) / 2}
              x2={win.nearX + win.nearW} y2={win.nearTop + (win.nearBot - win.nearTop) / 2}
              stroke="#5a4018" strokeWidth={2} />
            {/* Window glow on wall */}
            <ellipse cx={win.nearX + win.nearW / 2}
              cy={win.nearTop + (win.nearBot - win.nearTop) / 2}
              rx={win.nearW * 0.8} ry={(win.nearBot - win.nearTop) * 0.35}
              fill="#f8d060" opacity={0.08}
              filter="url(#tmh-blur)"
              className="tmh-glow"
            />
          </g>
        ))}
        {/* Right windows (mirrored) */}
        {R_WINDOWS.map((win, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.1 + i * 0.04) }}>
            <path
              d={`M ${win.nearX},${win.nearBot} L ${win.nearX},${win.nearTop + 20} Q ${win.nearX + win.nearW / 2},${win.nearTop - 12} ${win.nearX + win.nearW},${win.nearTop + 20} L ${win.nearX + win.nearW},${win.nearBot} Z`}
              fill="url(#tmh-window)"
            />
            <path
              d={`M ${win.nearX},${win.nearBot} L ${win.nearX},${win.nearTop + 20} Q ${win.nearX + win.nearW / 2},${win.nearTop - 12} ${win.nearX + win.nearW},${win.nearTop + 20} L ${win.nearX + win.nearW},${win.nearBot}`}
              fill="none" stroke="#5a4018" strokeWidth={4}
            />
            <line x1={win.nearX + win.nearW / 2} y1={win.nearTop + 14}
              x2={win.nearX + win.nearW / 2} y2={win.nearBot}
              stroke="#5a4018" strokeWidth={2} />
            <line x1={win.nearX} y1={win.nearTop + (win.nearBot - win.nearTop) / 2}
              x2={win.nearX + win.nearW} y2={win.nearTop + (win.nearBot - win.nearTop) / 2}
              stroke="#5a4018" strokeWidth={2} />
            <ellipse cx={win.nearX + win.nearW / 2}
              cy={win.nearTop + (win.nearBot - win.nearTop) / 2}
              rx={win.nearW * 0.8} ry={(win.nearBot - win.nearTop) * 0.35}
              fill="#f8d060" opacity={0.08}
              filter="url(#tmh-blur)"
              className="tmh-glow"
            />
          </g>
        ))}

        {/* ─── WAINSCOTING (lower wall panels) ─── */}
        {/* Left wall wainscot */}
        <polygon
          points={`${WALL_LEFT_X},${H} ${WALL_LEFT_X},${H - WAINSCOT_H} ${VP_X},${VP_Y + (FLOOR_Y - VP_Y) * 0.18} ${VP_X},${FLOOR_Y}`}
          fill="url(#tmh-wainscot)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}
        />
        {/* Right wall wainscot */}
        <polygon
          points={`${WALL_RIGHT_X},${H} ${WALL_RIGHT_X},${H - WAINSCOT_H} ${VP_X},${VP_Y + (FLOOR_Y - VP_Y) * 0.18} ${VP_X},${FLOOR_Y}`}
          fill="url(#tmh-wainscot)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}
        />
        {/* Wainscot cap rail */}
        <line x1={WALL_LEFT_X} y1={H - WAINSCOT_H}
          x2={VP_X} y2={VP_Y + (FLOOR_Y - VP_Y) * 0.18}
          stroke="#7a5830" strokeWidth={5}
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}
        />
        <line x1={WALL_RIGHT_X} y1={H - WAINSCOT_H}
          x2={VP_X} y2={VP_Y + (FLOOR_Y - VP_Y) * 0.18}
          stroke="#7a5830" strokeWidth={5}
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}
        />

        {/* ─── FLOOR ─── */}
        <polygon
          points={`${FLOOR_NEAR_L},${H} ${FLOOR_NEAR_R},${H} ${VP_X},${FLOOR_Y}`}
          fill="url(#tmh-floor)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}
        />
        {/* Floor plank lines (perspective) */}
        {FLOOR_PLANK_XS.map((fx, i) => (
          <line key={i}
            x1={fx} y1={H}
            x2={VP_X} y2={FLOOR_Y}
            stroke="#6a4018" strokeWidth={1.5} opacity={0.3}
            style={{ opacity: active ? 0.3 : 0, transition: tr(0.07) }}
          />
        ))}
        {/* Floor cross lines (depth spacing) */}
        {Array.from({ length: 8 }, (_, i) => {
          const t  = (i + 1) / 9;
          const lx = Math.round(VP_X + (FLOOR_NEAR_L - VP_X) * t);
          const rx = Math.round(VP_X + (FLOOR_NEAR_R - VP_X) * t);
          const fy = Math.round(FLOOR_Y + (H - FLOOR_Y) * t);
          return (
            <line key={i} x1={lx} y1={fy} x2={rx} y2={fy}
              stroke="#6a4018" strokeWidth={1} opacity={0.2}
              style={{ opacity: active ? 0.2 : 0, transition: tr(0.07) }}
            />
          );
        })}

        {/* ─── ROOM GLOW OVERLAY ─── */}
        <rect x={0} y={0} width={W} height={H}
          fill="url(#tmh-room-glow)"
          className="tmh-glow"
          style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}
        />

        {/* ─── TIMBER KING-POST TRUSSES ─── */}
        {TRUSSES.map((tr2, ti) => {
          const tw = Math.max(5 - ti * 0.6, 1.5);
          const kpW = Math.max(8 - ti, 2);
          return (
            <g key={ti}
              style={{ opacity: active ? 1 : 0, transition: tr(0.12 + ti * 0.04) }}
            >
              {/* Tie beam (horizontal) */}
              <line x1={tr2.lx} y1={tr2.y} x2={tr2.rx} y2={tr2.y}
                stroke="url(#tmh-timber)" strokeWidth={tw + 2}
              />
              {/* Left rafter */}
              <line x1={tr2.lx} y1={tr2.y} x2={tr2.apex_x} y2={tr2.apex_y}
                stroke="url(#tmh-timber)" strokeWidth={tw}
              />
              {/* Right rafter */}
              <line x1={tr2.rx} y1={tr2.y} x2={tr2.apex_x} y2={tr2.apex_y}
                stroke="url(#tmh-timber)" strokeWidth={tw}
              />
              {/* King post (vertical center) */}
              <line x1={tr2.apex_x} y1={tr2.apex_y}
                x2={tr2.apex_x} y2={tr2.y}
                stroke="url(#tmh-timber)" strokeWidth={kpW}
              />
              {/* Left strut (queen post brace) */}
              <line
                x1={Math.round(tr2.apex_x + (tr2.lx - tr2.apex_x) * 0.36)}
                y1={Math.round(tr2.y - (tr2.y - tr2.apex_y) * 0.18)}
                x2={Math.round(tr2.apex_x + (tr2.lx - tr2.apex_x) * 0.68)}
                y2={tr2.y}
                stroke="url(#tmh-timber)" strokeWidth={Math.max(tw - 1, 1)}
              />
              {/* Right strut */}
              <line
                x1={Math.round(tr2.apex_x + (tr2.rx - tr2.apex_x) * 0.36)}
                y1={Math.round(tr2.y - (tr2.y - tr2.apex_y) * 0.18)}
                x2={Math.round(tr2.apex_x + (tr2.rx - tr2.apex_x) * 0.68)}
                y2={tr2.y}
                stroke="url(#tmh-timber)" strokeWidth={Math.max(tw - 1, 1)}
              />
            </g>
          );
        })}

        {/* ─── PEWS ─── */}
        {PEW_ROWS.map((pew, pi) => {
          const scale  = 1 - (pi / 9) * 0.64;
          const aisleNear = AISLE_W_NEAR * scale;
          const aisleFar  = AISLE_W_FAR  * scale;
          const leftPewR  = VP_X - aisleNear / 2;
          const rightPewL = VP_X + aisleNear / 2;
          void aisleFar;
          return (
            <g key={pi}
              style={{ opacity: active ? 0.92 : 0, transition: tr(0.18 + pi * 0.04) }}
            >
              {/* Left pew section — seat top */}
              <rect
                x={pew.leftX} y={pew.backY}
                width={leftPewR - pew.leftX}
                height={pew.seatH}
                fill="url(#tmh-pew)" rx={1}
              />
              {/* Left pew — back rest */}
              <rect
                x={pew.leftX} y={pew.backY - Math.round(14 * scale)}
                width={leftPewR - pew.leftX}
                height={Math.round(6 * scale)}
                fill="#5a3818"
              />
              {/* Right pew section */}
              <rect
                x={rightPewL} y={pew.backY}
                width={pew.rightX - rightPewL}
                height={pew.seatH}
                fill="url(#tmh-pew)" rx={1}
              />
              <rect
                x={rightPewL} y={pew.backY - Math.round(14 * scale)}
                width={pew.rightX - rightPewL}
                height={Math.round(6 * scale)}
                fill="#5a3818"
              />
            </g>
          );
        })}

        {/* ─── FLAG ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.3) }}>
          {/* Staff */}
          <line x1={FLAG_X} y1={FLAG_Y - 8} x2={FLAG_X} y2={FLAG_STAFF_Y2}
            stroke="#5a3818" strokeWidth={3} />
          {/* Stripes */}
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i}
              x={FLAG_X + 4} y={Math.round(FLAG_Y + i * FLAG_STRIPE_H)}
              width={FLAG_W} height={Math.ceil(FLAG_STRIPE_H)}
              fill={i % 2 === 0 ? "#c82020" : "#f0f0e8"}
            />
          ))}
          {/* Blue canton */}
          <rect x={FLAG_X + 4} y={FLAG_Y} width={Math.round(FLAG_W * 0.4)} height={Math.round(FLAG_H * 7 / 13)}
            fill="#1830a0" />
          {/* Stars (simplified grid) */}
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 6 }, (__, col) => (
              <circle key={`s${row}-${col}`}
                cx={Math.round(FLAG_X + 4 + 6 + col * 8)}
                cy={Math.round(FLAG_Y + 5 + row * 7)}
                r={1.5} fill="#f0f0e8"
              />
            ))
          )}
          {/* Flag finial */}
          <circle cx={FLAG_X} cy={FLAG_Y - 8} r={5} fill="#c8a030" />
        </g>

        {/* ─── PODIUM ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}>
          {/* Podium body */}
          <rect x={POD_X1} y={POD_Y1} width={POD_W} height={POD_H}
            fill="url(#tmh-podium)" rx={3} />
          {/* Raised panel inset */}
          <rect
            x={POD_X1 + POD_PANEL_INSET} y={POD_Y1 + POD_PANEL_INSET}
            width={POD_W - POD_PANEL_INSET * 2} height={POD_H - POD_PANEL_INSET * 2}
            fill="none" stroke="#7a6030" strokeWidth={2} rx={2}
          />
          {/* Podium top surface */}
          <rect x={POD_X1 - 8} y={POD_Y1 - 10} width={POD_W + 16} height={14}
            fill="#8a6030" rx={2} />
          {/* Lectern slope */}
          <polygon
            points={`${POD_X1 + 16},${POD_Y1 - 10} ${POD_X2 - 16},${POD_Y1 - 10} ${POD_X2 - 6},${POD_Y1 + 12} ${POD_X1 + 6},${POD_Y1 + 12}`}
            fill="#6a4820"
          />
          {/* Notes / paper on lectern */}
          <rect x={POD_CX - 22} y={POD_Y1 - 6} width={44} height={14}
            fill="#f0e8c8" opacity={0.7} rx={1} />

          {/* ─── SHREWSBURY TOWN SEAL ─── */}
          {/* Seal ring */}
          <circle cx={SEAL_CX} cy={SEAL_CY} r={SEAL_R}
            fill="#c8a040" opacity={0.9} />
          <circle cx={SEAL_CX} cy={SEAL_CY} r={SEAL_R - 4}
            fill="#d4b050" />
          <circle cx={SEAL_CX} cy={SEAL_CY} r={SEAL_R - 8}
            fill="#2a1808" />
          {/* Seal inner emblem — simplified: star + text ring */}
          <circle cx={SEAL_CX} cy={SEAL_CY} r={14}
            fill="none" stroke="#c8a040" strokeWidth={1.5} />
          {/* Star at center */}
          {Array.from({ length: 5 }, (_, i) => {
            const ao = (i * 72 - 90) * Math.PI / 180;
            const ai = (i * 72 - 90 + 36) * Math.PI / 180;
            const ox = (SEAL_CX + 10 * Math.cos(ao)).toFixed(1);
            const oy = (SEAL_CY + 10 * Math.sin(ao)).toFixed(1);
            const ix = (SEAL_CX + 4.5 * Math.cos(ai)).toFixed(1);
            const iy = (SEAL_CY + 4.5 * Math.sin(ai)).toFixed(1);
            return i === 0
              ? `M ${ox},${oy}`
              : `L ${ix},${iy} L ${ox},${oy}`;
          }).join(" ") && (
            <path
              d={Array.from({ length: 5 }, (_, i) => {
                const ao = (i * 72 - 90) * Math.PI / 180;
                const ai = (i * 72 - 90 + 36) * Math.PI / 180;
                const ox = (SEAL_CX + 10 * Math.cos(ao)).toFixed(1);
                const oy = (SEAL_CY + 10 * Math.sin(ao)).toFixed(1);
                const ix = (SEAL_CX + 4.5 * Math.cos(ai)).toFixed(1);
                const iy = (SEAL_CY + 4.5 * Math.sin(ai)).toFixed(1);
                return `${i === 0 ? "M" : "L"} ${ox},${oy} L ${ix},${iy}`;
              }).join(" ") + " Z"}
              fill="#c8a040"
            />
          )}
          {/* "SHREWSBURY · EST. 1727" ring text (approximated as arcs of dots) */}
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i * 20 - 90) * Math.PI / 180;
            return (
              <circle key={i}
                cx={SEAL_CX + (SEAL_R - 6) * Math.cos(a)}
                cy={SEAL_CY + (SEAL_R - 6) * Math.sin(a)}
                r={1.2} fill="#c8a040"
              />
            );
          })}
        </g>

        {/* ─── BANNER above podium ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.4) }}>
          <rect x={BANNER_X} y={BANNER_Y} width={BANNER_W} height={BANNER_H}
            fill="#1a3060" rx={2} />
          <rect x={BANNER_X + 3} y={BANNER_Y + 3} width={BANNER_W - 6} height={BANNER_H - 6}
            fill="none" stroke="#c8a040" strokeWidth={1.5} rx={1} />
          <text
            x={VP_X} y={BANNER_Y + 19}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={13} fontWeight="700"
            fill="#c8a040" letterSpacing={3}
          >ROUTE 9 WEB CO.</text>
        </g>

        {/* ─── OIL LAMPS ─── */}
        {OIL_LAMPS.map((lamp, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.25 + i * 0.05) }}>
            {/* Glow halo */}
            <ellipse cx={lamp.cx} cy={lamp.cy} rx={lamp.r * 4} ry={lamp.r * 3}
              fill="url(#tmh-lamp-glow)"
              filter="url(#tmh-blur)"
              className="tmh-glow"
            />
            {/* Rope/chain */}
            <line x1={lamp.cx} y1={lamp.ropeY}
              x2={lamp.cx} y2={lamp.cy - lamp.r}
              stroke="#5a4020" strokeWidth={1.5}
            />
            {/* Lamp body */}
            <ellipse cx={lamp.cx} cy={lamp.cy} rx={lamp.r} ry={lamp.r * 1.4}
              fill="#f0b830" className="tmh-lamp"
            />
            <ellipse cx={lamp.cx} cy={lamp.cy + lamp.r * 0.6} rx={lamp.r * 0.8} ry={lamp.r * 0.5}
              fill="#c07820" className="tmh-lamp"
            />
            {/* Lamp shade */}
            <path
              d={`M ${lamp.cx - lamp.r * 1.4},${lamp.cy - lamp.r} L ${lamp.cx - lamp.r * 0.8},${lamp.cy - lamp.r * 2.2} L ${lamp.cx + lamp.r * 0.8},${lamp.cy - lamp.r * 2.2} L ${lamp.cx + lamp.r * 1.4},${lamp.cy - lamp.r} Z`}
              fill="#2a1e10"
            />
          </g>
        ))}

        {/* ─── CAPTION ─── */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#8a7050"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.1) }}
        >
          SHREWSBURY TOWN MEETING HALL · EST. 1727 · ROUTE 9, MA
        </text>
      </svg>
    </section>
  );
}
