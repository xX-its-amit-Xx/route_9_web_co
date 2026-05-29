"use client";
import { useEffect, useRef, useState } from "react";

// Pass 60: 1890s New England country general store interior — perspective, pot-bellied stove, display case, shelves

const W = 1440, H = 560;
const VP_X = 720, VP_Y = 198;
const FLOOR_Y = 520;
const CEIL_Y  = 72;

// ─── Floor planks (perspective) ─────────────────────────────────────────
const FLOOR_PLANK_XS = Array.from({ length: 15 }, (_, i) =>
  Math.round(0 + i * W / 14)
);
// Cross-plank depth lines
const FLOOR_DEPTH_TS = [0.12, 0.24, 0.38, 0.54, 0.72, 0.90];

// ─── Ceiling beams (perspective) ────────────────────────────────────────
const CEIL_BEAMS = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6;
  const x = Math.round(0 + t * W);
  return { x, topY: CEIL_Y, botY: CEIL_Y + 18 };
});

// ─── LEFT WALL — shelving + goods ────────────────────────────────────────
const LW_X  = 0;
const LW_FAR = Math.round(VP_X + (LW_X - VP_X) * 0.08); // where wall meets far wall

// Left wall shelf rows (3 rows, receding)
type ShelfRow = { x: number; y: number; w: number };
const L_SHELVES: ShelfRow[] = [
  { x: LW_X, y: 180, w: Math.round(VP_X * 0.52) },
  { x: LW_X, y: 272, w: Math.round(VP_X * 0.52) },
  { x: LW_X, y: 364, w: Math.round(VP_X * 0.52) },
];

// Jars / tins on shelves (x, y, w, h, color, label)
type JarItem = [number, number, number, number, string, string];
const SHELF1_ITEMS: JarItem[] = [
  [12,  148, 28, 32, "#4a7a28", "PICKLES"],
  [46,  150, 24, 30, "#d04818", "PEPPERS"],
  [76,  148, 22, 32, "#8a3a10", "JELLY"],
  [104, 150, 26, 30, "#5a7a18", "HERBS"],
  [136, 148, 20, 32, "#c87820", "HONEY"],
  [162, 152, 18, 28, "#6a3818", "TEA"],
  [186, 150, 22, 30, "#3a5a2a", "OLIVES"],
  [214, 148, 24, 32, "#b84818", "SAUCE"],
  [244, 150, 20, 30, "#8a6828", "MUSTARD"],
  [270, 148, 22, 32, "#3a4a6a", "INK"],
];
const SHELF2_ITEMS: JarItem[] = [
  [12,  240, 32, 28, "#8a6428", "FLOUR"],
  [50,  242, 28, 26, "#c8a040", "SUGAR"],
  [84,  240, 30, 28, "#6a3a18", "COFFEE"],
  [120, 242, 26, 26, "#4a3828", "TEA"],
  [152, 240, 28, 28, "#9a7830", "OATS"],
  [186, 242, 22, 26, "#7a5020", "BRAN"],
  [214, 240, 28, 28, "#c07820", "SYRUP"],
  [248, 242, 24, 26, "#5a4020", "SPICE"],
];
const SHELF3_ITEMS: JarItem[] = [
  [12,  332, 26, 24, "#6a4828", "NAILS"],
  [44,  334, 22, 22, "#4a6838", "TWINE"],
  [72,  332, 28, 24, "#8a4818", "LAMP OIL"],
  [106, 334, 24, 22, "#5a3a18", "PITCH"],
  [136, 332, 26, 24, "#7a6830", "WAX"],
  [168, 334, 20, 22, "#3a5a4a", "BLUING"],
];

// ─── RIGHT WALL — display case + calendar ────────────────────────────────
const RW_X = W;
// Glass display case (right side, receding)
const DC_X  = Math.round(W - W * 0.38);
const DC_W  = Math.round(W * 0.38);
const DC_Y1 = 248, DC_Y2 = FLOOR_Y - 18;
const DC_TOP_Y = 220;

// Display case items (candy jars, tobacco tins, etc.)
type DCItem = [number, number, number, string];
const DC_ITEMS: DCItem[] = [
  [DC_X + 12,  DC_Y1 + 18, 22, "#c84828"], // candy
  [DC_X + 40,  DC_Y1 + 18, 20, "#4a6a28"], // tobacco
  [DC_X + 66,  DC_Y1 + 18, 24, "#c89020"], // cookies
  [DC_X + 96,  DC_Y1 + 18, 20, "#8a3818"], // soap
  [DC_X + 122, DC_Y1 + 18, 22, "#5a4020"], // licorice
  [DC_X + 148, DC_Y1 + 18, 18, "#c8a020"], // mints
  [DC_X + 12,  DC_Y1 + 64, 28, "#7a5a28"], // tin
  [DC_X + 46,  DC_Y1 + 64, 24, "#4a3828"], // tin
  [DC_X + 76,  DC_Y1 + 64, 26, "#9a6428"], // jar
  [DC_X + 108, DC_Y1 + 64, 22, "#6a4018"], // jar
  [DC_X + 136, DC_Y1 + 64, 24, "#8a5820"], // tin
];

// Calendar on right wall
const CAL_X = Math.round(W - 148), CAL_Y = 118, CAL_W = 108, CAL_H = 82;

// ─── FAR WALL ────────────────────────────────────────────────────────────
// Window in far wall (Route 9 Web Co. sign visible through it)
const FAR_WIN_X = VP_X - 64, FAR_WIN_W = 128;
const FAR_WIN_Y = VP_Y + 28, FAR_WIN_H = 108;
const FAR_WIN_ARCH_Y = FAR_WIN_Y + 22; // arch apex

// Far wall door (left of center)
const FAR_DOOR_X = VP_X - 178, FAR_DOOR_W = 52;
const FAR_DOOR_Y = FAR_WIN_Y + 20, FAR_DOOR_H = 88;

// ─── POT-BELLIED STOVE ────────────────────────────────────────────────────
const STK_CX = 312, STK_CY = 380;
const STK_R_TOP = 28, STK_R_MID = 34, STK_R_BOT = 28;
const STK_LEG_H = 22;
// Stove pipe
const PIPE_X1 = STK_CX, PIPE_Y1 = STK_CY - STK_R_TOP - 4;
const PIPE_X2 = STK_CX + 22, PIPE_Y2 = CEIL_Y + 18;

// ─── COUNTER / CASH REGISTER AREA ────────────────────────────────────────
const CTR_X  = 360, CTR_W = 280, CTR_H = 14;
const CTR_Y  = 376;
const CTR_LEG_H = FLOOR_Y - CTR_Y - CTR_H;

// Counter items
const REG_X = CTR_X + 156, REG_Y = CTR_Y - 52;  // cash register

// ─── CRACKER BARREL ──────────────────────────────────────────────────────
const CRK_CX = 692, CRK_CY = FLOOR_Y - 36;
const CRK_W = 52, CRK_H = 52;

// ─── HANGING ITEMS (from ceiling) ─────────────────────────────────────────
type HangItem = { x: number; y: number; label: string; w: number; h: number; color: string };
const HANG_ITEMS: HangItem[] = [
  { x: 480, y: 148, label: "PAILS",    w: 28, h: 32, color: "#7a6830" },
  { x: 528, y: 162, label: "LANTERNS", w: 18, h: 36, color: "#8a7028" },
  { x: 576, y: 152, label: "BROOMS",   w: 10, h: 52, color: "#9a7038" },
  { x: 612, y: 168, label: "BASKETS",  w: 32, h: 28, color: "#b88840" },
  { x: 808, y: 148, label: "ROPE",     w: 14, h: 44, color: "#8a6828" },
  { x: 852, y: 158, label: "TACK",     w: 28, h: 32, color: "#5a4020" },
];

// ─── OIL LAMP on counter ─────────────────────────────────────────────────
const OL_X = CTR_X + 52, OL_Y = CTR_Y - 32;

export function CountryGeneralStore() {
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
    active ? `opacity 0.65s ease ${d}s, transform 0.65s ease ${d}s` : "none";

  return (
    <section
      aria-label="1890s New England country general store interior"
      style={{ background: "#1a1208", overflow: "hidden" }}
    >
      <style>{`
        @keyframes cgs-stove {
          0%,100% { opacity: 0.72; }
          35%      { opacity: 0.96; }
          65%      { opacity: 0.60; }
        }
        @keyframes cgs-lamp {
          0%,100% { opacity: 0.85; }
          40%      { opacity: 1;    }
          70%      { opacity: 0.72; }
        }
        @keyframes cgs-dust {
          0%,100% { opacity: 0.12; transform: translateY(0);  }
          50%      { opacity: 0.06; transform: translateY(6px); }
        }
        .cgs-stove { animation: ${active ? "cgs-stove 3.1s ease-in-out infinite" : "none"}; }
        .cgs-lamp  { animation: ${active ? "cgs-lamp 2.6s ease-in-out infinite"  : "none"}; }
        .cgs-dust  { animation: ${active ? "cgs-dust 8s ease-in-out infinite"   : "none"}; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 560 }}
      >
        <defs>
          {/* Wall plaster, warm amber */}
          <linearGradient id="cgs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8a860" />
            <stop offset="100%" stopColor="#a88840" />
          </linearGradient>
          {/* Far wall */}
          <linearGradient id="cgs-far-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b89848" />
            <stop offset="100%" stopColor="#987838" />
          </linearGradient>
          {/* Floor pine */}
          <linearGradient id="cgs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b88040" />
            <stop offset="100%" stopColor="#7a5020" />
          </linearGradient>
          {/* Ceiling */}
          <linearGradient id="cgs-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4bc80" />
            <stop offset="100%" stopColor="#b89850" />
          </linearGradient>
          {/* Counter wood */}
          <linearGradient id="cgs-counter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a5820" />
            <stop offset="100%" stopColor="#5a3810" />
          </linearGradient>
          {/* Display case glass */}
          <linearGradient id="cgs-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a8c8d0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8ab0b8" stopOpacity="0.2"  />
          </linearGradient>
          {/* Stove iron */}
          <radialGradient id="cgs-stove-body" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#5a5450" />
            <stop offset="100%" stopColor="#2a2824" />
          </radialGradient>
          {/* Stove glow */}
          <radialGradient id="cgs-stove-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff6600" stopOpacity="0.7" />
            <stop offset="40%"  stopColor="#cc3300" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#880000" stopOpacity="0"   />
          </radialGradient>
          {/* Window light */}
          <linearGradient id="cgs-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8e0b0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d0c880" stopOpacity="0.6" />
          </linearGradient>
          {/* Room warm glow */}
          <radialGradient id="cgs-room-glow" cx="28%" cy="72%" r="52%">
            <stop offset="0%"   stopColor="#f07820" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c04010" stopOpacity="0"   />
          </radialGradient>
          {/* Lamp halo */}
          <radialGradient id="cgs-lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e08030" stopOpacity="0"   />
          </radialGradient>
          <filter id="cgs-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <filter id="cgs-blur-sm">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* ─── CEILING ─── */}
        <rect x={0} y={0} width={W} height={CEIL_Y + 18} fill="url(#cgs-ceil)" />
        {/* Ceiling beams */}
        {CEIL_BEAMS.map((b, i) => (
          <rect key={i} x={b.x - 8} y={b.topY} width={16} height={b.botY - b.topY}
            fill="#6a4820"
            style={{ opacity: active ? 1 : 0, transition: tr(0.05 + i * 0.02) }}
          />
        ))}
        {/* Ceiling cross boards */}
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={0} y={CEIL_Y + 4 + i * 4} width={W} height={2}
            fill="#7a5828" opacity={0.3}
          />
        ))}

        {/* ─── FAR WALL ─── */}
        <rect x={VP_X - 360} y={VP_Y - 18} width={720} height={FLOOR_Y - VP_Y + 18}
          fill="url(#cgs-far-wall)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}
        />
        {/* Wainscoting on far wall */}
        <rect x={VP_X - 340} y={FLOOR_Y - 96} width={680} height={96}
          fill="#5a3818" opacity={0.7}
        />
        <line x1={VP_X - 340} y1={FLOOR_Y - 96} x2={VP_X + 340} y2={FLOOR_Y - 96}
          stroke="#7a5028" strokeWidth={3} />

        {/* ─── SIDE WALLS ─── */}
        {/* Left wall */}
        <polygon
          points={`0,${CEIL_Y + 18} ${VP_X},${VP_Y - 18} ${VP_X},${FLOOR_Y} 0,${FLOOR_Y}`}
          fill="url(#cgs-wall)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        />
        {/* Right wall */}
        <polygon
          points={`${W},${CEIL_Y + 18} ${VP_X},${VP_Y - 18} ${VP_X},${FLOOR_Y} ${W},${FLOOR_Y}`}
          fill="url(#cgs-wall)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        />

        {/* ─── FLOOR ─── */}
        <rect x={0} y={FLOOR_Y - 2} width={W} height={H - FLOOR_Y + 2} fill="url(#cgs-floor)" />
        {/* Plank lines */}
        {FLOOR_PLANK_XS.map((fx, i) => (
          <line key={i}
            x1={fx} y1={FLOOR_Y} x2={VP_X} y2={FLOOR_Y}
            stroke="#7a4818" strokeWidth={1.2} opacity={0.25}
            style={{ opacity: active ? 0.25 : 0, transition: tr(0.07) }}
          />
        ))}
        {/* Depth cross lines */}
        {FLOOR_DEPTH_TS.map((t, i) => {
          const lx = Math.round(VP_X + (0  - VP_X) * t);
          const rx = Math.round(VP_X + (W  - VP_X) * t);
          const fy = Math.round(VP_Y + (FLOOR_Y - VP_Y) * t);
          return (
            <line key={i} x1={lx} y1={fy} x2={rx} y2={fy}
              stroke="#7a4818" strokeWidth={1} opacity={0.18}
              style={{ opacity: active ? 0.18 : 0, transition: tr(0.07) }}
            />
          );
        })}
        {/* Floor sheen */}
        <rect x={0} y={FLOOR_Y - 2} width={W} height={6}
          fill="#c89850" opacity={0.3} />

        {/* ─── WARM GLOW OVERLAY ─── */}
        <rect x={0} y={0} width={W} height={H}
          fill="url(#cgs-room-glow)"
          className="cgs-stove"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}
        />

        {/* ─── FAR WINDOW ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {/* Arch window */}
          <path
            d={`M ${FAR_WIN_X},${FAR_WIN_Y + FAR_WIN_H} L ${FAR_WIN_X},${FAR_WIN_ARCH_Y} Q ${FAR_WIN_X + FAR_WIN_W / 2},${FAR_WIN_Y - 10} ${FAR_WIN_X + FAR_WIN_W},${FAR_WIN_ARCH_Y} L ${FAR_WIN_X + FAR_WIN_W},${FAR_WIN_Y + FAR_WIN_H} Z`}
            fill="url(#cgs-window)"
          />
          <path
            d={`M ${FAR_WIN_X},${FAR_WIN_Y + FAR_WIN_H} L ${FAR_WIN_X},${FAR_WIN_ARCH_Y} Q ${FAR_WIN_X + FAR_WIN_W / 2},${FAR_WIN_Y - 10} ${FAR_WIN_X + FAR_WIN_W},${FAR_WIN_ARCH_Y} L ${FAR_WIN_X + FAR_WIN_W},${FAR_WIN_Y + FAR_WIN_H}`}
            fill="none" stroke="#5a3a18" strokeWidth={4}
          />
          {/* Muntin */}
          <line x1={FAR_WIN_X + FAR_WIN_W / 2} y1={FAR_WIN_ARCH_Y - 6}
            x2={FAR_WIN_X + FAR_WIN_W / 2} y2={FAR_WIN_Y + FAR_WIN_H}
            stroke="#5a3a18" strokeWidth={2.5} />
          <line x1={FAR_WIN_X + 6} y1={FAR_WIN_Y + FAR_WIN_H * 0.45}
            x2={FAR_WIN_X + FAR_WIN_W - 6} y2={FAR_WIN_Y + FAR_WIN_H * 0.45}
            stroke="#5a3a18" strokeWidth={2.5} />
          {/* Route 9 sign in window */}
          <rect x={FAR_WIN_X + 8} y={FAR_WIN_Y + FAR_WIN_H * 0.52} width={FAR_WIN_W - 16} height={28}
            fill="#1a3060" rx={2} opacity={0.9} />
          <text
            x={FAR_WIN_X + FAR_WIN_W / 2} y={FAR_WIN_Y + FAR_WIN_H * 0.52 + 18}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={10} fontWeight="700"
            fill="#c8a040" letterSpacing={2}
          >ROUTE 9 WEB CO.</text>
          {/* Window glow */}
          <ellipse cx={FAR_WIN_X + FAR_WIN_W / 2} cy={FAR_WIN_Y + FAR_WIN_H / 2}
            rx={FAR_WIN_W * 1.4} ry={FAR_WIN_H * 0.8}
            fill="#f8e880" opacity={0.06}
            filter="url(#cgs-blur)"
          />
        </g>

        {/* ─── FAR DOOR ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>
          <rect x={FAR_DOOR_X} y={FAR_DOOR_Y} width={FAR_DOOR_W} height={FAR_DOOR_H}
            fill="#3a2010" rx={2} />
          <rect x={FAR_DOOR_X + 4} y={FAR_DOOR_Y + 4} width={FAR_DOOR_W - 8} height={FAR_DOOR_H * 0.44}
            fill="#2a1808" rx={1} />
          <rect x={FAR_DOOR_X + 4} y={FAR_DOOR_Y + FAR_DOOR_H * 0.52} width={FAR_DOOR_W - 8} height={FAR_DOOR_H * 0.40}
            fill="#2a1808" rx={1} />
          <circle cx={FAR_DOOR_X + FAR_DOOR_W - 8} cy={FAR_DOOR_Y + FAR_DOOR_H / 2} r={3}
            fill="#c8a030" />
        </g>

        {/* ─── LEFT WALL SHELVES + GOODS ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}>
          {L_SHELVES.map((shelf, si) => (
            <rect key={si}
              x={shelf.x} y={shelf.y} width={shelf.w} height={8}
              fill="#6a4818"
            />
          ))}
          {/* Shelf back boards */}
          {L_SHELVES.map((shelf, si) => (
            <rect key={si}
              x={shelf.x} y={si === 0 ? CEIL_Y + 18 : L_SHELVES[si - 1]?.y ?? CEIL_Y + 18}
              width={4} height={shelf.y - (si === 0 ? CEIL_Y + 18 : L_SHELVES[si - 1]?.y ?? CEIL_Y + 18)}
              fill="#4a3010"
            />
          ))}
          {/* Shelf supports */}
          {L_SHELVES.map((shelf, si) => (
            [48, 112, 176, 240].map((ox, oi) => (
              <line key={`${si}-${oi}`}
                x1={shelf.x + ox} y1={shelf.y + 8}
                x2={shelf.x + ox - 6} y2={shelf.y + 28}
                stroke="#5a3818" strokeWidth={2}
              />
            ))
          ))}
          {/* Jars on shelf 1 */}
          {SHELF1_ITEMS.map(([ix, iy, iw, ih, ic, lbl], i) => (
            <g key={i}>
              <rect x={ix} y={iy - ih} width={iw} height={ih} fill={ic} rx={iw / 4} opacity={0.85} />
              <rect x={ix + 1} y={iy - ih - 4} width={iw - 2} height={6} fill="#3a2810" rx={1} />
              {iw >= 22 && (
                <text x={ix + iw / 2} y={iy - ih / 2 + 3}
                  textAnchor="middle"
                  fontFamily="'Georgia', serif"
                  fontSize={5} fill="#f0e8c0" opacity={0.7}
                >{lbl}</text>
              )}
            </g>
          ))}
          {/* Items on shelf 2 */}
          {SHELF2_ITEMS.map(([ix, iy, iw, ih, ic], i) => (
            <g key={i}>
              <rect x={ix} y={iy - ih} width={iw} height={ih} fill={ic} rx={3} opacity={0.85} />
              <rect x={ix + 1} y={iy - ih - 3} width={iw - 2} height={5} fill="#3a2810" rx={1} />
            </g>
          ))}
          {/* Items on shelf 3 */}
          {SHELF3_ITEMS.map(([ix, iy, iw, ih, ic], i) => (
            <g key={i}>
              <rect x={ix} y={iy - ih} width={iw} height={ih} fill={ic} rx={2} opacity={0.85} />
            </g>
          ))}
        </g>

        {/* ─── POT-BELLIED STOVE ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>
          {/* Glow halos */}
          <ellipse cx={STK_CX} cy={STK_CY} rx={120} ry={80}
            fill="url(#cgs-stove-glow)" filter="url(#cgs-blur)"
            className="cgs-stove"
          />
          {/* Stove pipe */}
          <line x1={PIPE_X1} y1={PIPE_Y1} x2={PIPE_X2} y2={PIPE_Y2}
            stroke="#2a2824" strokeWidth={12} strokeLinecap="round"
          />
          <rect x={PIPE_X2 - 4} y={PIPE_Y2 - 2} width={36} height={8}
            fill="#2a2824" rx={2} />
          {/* Stove body — three stacked ovals */}
          <ellipse cx={STK_CX} cy={STK_CY - STK_R_TOP - STK_R_MID + 4}
            rx={STK_R_TOP} ry={8} fill="#3a3a36" />
          <ellipse cx={STK_CX} cy={STK_CY}
            rx={STK_R_MID} ry={STK_R_MID}
            fill="url(#cgs-stove-body)" />
          {/* Firebox door */}
          <rect x={STK_CX - 14} y={STK_CY - 10} width={28} height={20}
            fill="#1a1816" rx={2} />
          <ellipse cx={STK_CX} cy={STK_CY - 2}
            rx={10} ry={7}
            fill="#ff5500" opacity={0.6}
            className="cgs-stove"
          />
          {/* Legs */}
          {[-STK_R_BOT + 8, 0, STK_R_BOT - 8].map((ox, i) => (
            <line key={i}
              x1={STK_CX + ox} y1={STK_CY + STK_R_MID - 4}
              x2={STK_CX + ox + (i === 0 ? -4 : i === 2 ? 4 : 0)} y2={STK_CY + STK_R_MID + STK_LEG_H}
              stroke="#2a2824" strokeWidth={5} strokeLinecap="round"
            />
          ))}
          {/* Heat rings on body */}
          {[-14, 0, 14].map((oy, i) => (
            <ellipse key={i}
              cx={STK_CX} cy={STK_CY + oy}
              rx={STK_R_MID - 2} ry={4}
              fill="none" stroke="#4a4844" strokeWidth={2} opacity={0.5}
            />
          ))}
          {/* Stove floor glow shadow */}
          <ellipse cx={STK_CX} cy={FLOOR_Y - 2}
            rx={80} ry={12}
            fill="#cc3300" opacity={0.12}
            className="cgs-stove"
          />
        </g>

        {/* ─── COUNTER ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}>
          {/* Counter top */}
          <rect x={CTR_X} y={CTR_Y} width={CTR_W} height={CTR_H}
            fill="url(#cgs-counter)" rx={2} />
          {/* Counter face */}
          <rect x={CTR_X + 4} y={CTR_Y + CTR_H} width={CTR_W - 8} height={CTR_LEG_H}
            fill="#4a2e10" />
          {/* Counter panel moldings */}
          {[48, 96, 144, 192].map((ox, i) => (
            <line key={i}
              x1={CTR_X + ox} y1={CTR_Y + CTR_H + 4}
              x2={CTR_X + ox} y2={CTR_Y + CTR_H + CTR_LEG_H - 4}
              stroke="#3a2008" strokeWidth={1} opacity={0.5}
            />
          ))}
          {/* Oil lamp on counter */}
          <ellipse cx={OL_X} cy={OL_Y + 24} rx={18} ry={14}
            fill="url(#cgs-lamp-glow)" filter="url(#cgs-blur-sm)"
            className="cgs-lamp"
          />
          <ellipse cx={OL_X} cy={OL_Y + 12} rx={9} ry={14} fill="#f8c040" className="cgs-lamp" />
          <ellipse cx={OL_X} cy={OL_Y + 22} rx={12} ry={6} fill="#c87820" opacity={0.8} />
          <rect x={OL_X - 7} y={OL_Y + 22} width={14} height={8} fill="#8a5020" rx={2} />
          {/* Lamp shade */}
          <path d={`M ${OL_X - 14},${OL_Y + 6} L ${OL_X - 9},${OL_Y - 8} L ${OL_X + 9},${OL_Y - 8} L ${OL_X + 14},${OL_Y + 6} Z`}
            fill="#2a1808" />

          {/* Cash register */}
          <rect x={REG_X} y={REG_Y} width={62} height={52}
            fill="#4a3818" rx={3} />
          {/* Register keys */}
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 5 }, (__, col) => (
              <rect key={`k${row}${col}`}
                x={REG_X + 6 + col * 10} y={REG_Y + 6 + row * 10}
                width={8} height={8}
                fill="#3a2a10" rx={1}
              />
            ))
          )}
          {/* Register drawer */}
          <rect x={REG_X + 2} y={REG_Y + 38} width={58} height={10}
            fill="#5a4020" rx={1} />
          <rect x={REG_X + 24} y={REG_Y + 40} width={14} height={6}
            fill="#c8a030" rx={1} />
          {/* Register top panel */}
          <rect x={REG_X - 4} y={REG_Y - 8} width={70} height={10}
            fill="#5a3818" rx={2} />
          <text x={REG_X + 31} y={REG_Y - 1}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={6} fill="#c8a030" letterSpacing={1}
          >NATIONAL</text>
        </g>

        {/* ─── DISPLAY CASE (right side) ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}>
          {/* Case top rail */}
          <rect x={DC_X} y={DC_TOP_Y} width={DC_W} height={DC_Y1 - DC_TOP_Y}
            fill="#5a3818" />
          {/* Glass face */}
          <rect x={DC_X} y={DC_Y1} width={DC_W} height={DC_Y2 - DC_Y1}
            fill="url(#cgs-glass)" />
          <rect x={DC_X} y={DC_Y1} width={DC_W} height={DC_Y2 - DC_Y1}
            fill="none" stroke="#6a4820" strokeWidth={3} />
          {/* Case dividers */}
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line key={i}
              x1={DC_X + DC_W * t} y1={DC_Y1}
              x2={DC_X + DC_W * t} y2={DC_Y2}
              stroke="#5a3818" strokeWidth={1.5}
            />
          ))}
          {/* Glass shelf inside case */}
          <line x1={DC_X + 2} y1={DC_Y1 + 56} x2={DC_X + DC_W - 2} y2={DC_Y1 + 56}
            stroke="#9ab8c0" strokeWidth={1.5} opacity={0.5}
          />
          {/* Items in case */}
          {DC_ITEMS.map(([ix, iy, ir, ic], i) => (
            <ellipse key={i} cx={ix + ir / 2} cy={iy} rx={ir / 2} ry={ir * 0.7}
              fill={ic} opacity={0.8}
            />
          ))}
          {/* GOODS label on case top */}
          <text x={DC_X + DC_W / 2} y={DC_TOP_Y + 16}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={11} fontWeight="700"
            fill="#f0e0a0" letterSpacing={3}
          >DRY GOODS &amp; SUNDRIES</text>
        </g>

        {/* ─── CALENDAR on right wall ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.25) }}>
          <rect x={CAL_X} y={CAL_Y} width={CAL_W} height={CAL_H}
            fill="#f0e8c0" rx={2} />
          <rect x={CAL_X} y={CAL_Y} width={CAL_W} height={20}
            fill="#c82010" rx={2} />
          <text x={CAL_X + CAL_W / 2} y={CAL_Y + 14}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={11} fontWeight="700"
            fill="#f0e8c0" letterSpacing={2}
          >OCTOBER 1892</text>
          {/* Grid of dates */}
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (__, col) => {
              const day = row * 7 + col + 1;
              if (day > 31) return null;
              return (
                <text key={`d${row}${col}`}
                  x={CAL_X + 8 + col * 14} y={CAL_Y + 34 + row * 12}
                  fontFamily="'Georgia', serif"
                  fontSize={7.5} fill={day === 17 ? "#c82010" : "#3a2810"}
                  fontWeight={day === 17 ? "700" : "400"}
                >{day}</text>
              );
            })
          )}
          {/* Tack at top */}
          <circle cx={CAL_X + CAL_W / 2} cy={CAL_Y - 4} r={3} fill="#b87020" />
        </g>

        {/* ─── CRACKER BARREL ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.28) }}>
          <ellipse cx={CRK_CX} cy={CRK_CY + CRK_H / 2} rx={CRK_W / 2} ry={8}
            fill="#3a2010" opacity={0.5}
          />
          <rect x={CRK_CX - CRK_W / 2} y={CRK_CY - CRK_H / 2} width={CRK_W} height={CRK_H}
            fill="#7a5020" rx={4}
          />
          {/* Stave lines */}
          {[-16, -6, 4, 14, 24].map((ox, i) => (
            <line key={i}
              x1={CRK_CX + ox} y1={CRK_CY - CRK_H / 2 + 4}
              x2={CRK_CX + ox} y2={CRK_CY + CRK_H / 2 - 4}
              stroke="#5a3810" strokeWidth={1.5} opacity={0.5}
            />
          ))}
          {/* Hoops */}
          {[CRK_CY - CRK_H * 0.3, CRK_CY, CRK_CY + CRK_H * 0.3].map((hy, i) => (
            <line key={i}
              x1={CRK_CX - CRK_W / 2 + 2} y1={hy}
              x2={CRK_CX + CRK_W / 2 - 2} y2={hy}
              stroke="#c89030" strokeWidth={3} opacity={0.8}
            />
          ))}
          {/* Open top */}
          <ellipse cx={CRK_CX} cy={CRK_CY - CRK_H / 2}
            rx={CRK_W / 2} ry={7}
            fill="#5a3810"
          />
          {/* "CRACKERS" label */}
          <text x={CRK_CX} y={CRK_CY + 3}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={8} fill="#c8a050" letterSpacing={1} opacity={0.75}
          >CRACKERS</text>
        </g>

        {/* ─── HANGING ITEMS FROM CEILING ─── */}
        {HANG_ITEMS.map((item, i) => (
          <g key={i}
            style={{ opacity: active ? 0.82 : 0, transition: tr(0.15 + i * 0.04) }}
          >
            <line x1={item.x} y1={CEIL_Y + 18} x2={item.x} y2={item.y}
              stroke="#5a3818" strokeWidth={1.5}
            />
            <rect x={item.x - item.w / 2} y={item.y} width={item.w} height={item.h}
              fill={item.color} rx={2} opacity={0.85}
            />
          </g>
        ))}

        {/* ─── DUST MOTES (atmosphere) ─── */}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i}
            cx={280 + i * 82} cy={168 + (i * 31) % 80}
            r={1.8}
            fill="#f8e8b0" opacity={0.12}
            className="cgs-dust"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}

        {/* ─── CAPTION ─── */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#a88840"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          ROUTE 9 GENERAL STORE · SHREWSBURY, MA · EST. 1892
        </text>
      </svg>
    </section>
  );
}
