"use client";

// BarnQuilt ───────────────────────────────────────────────────────────────────
//
// A New England barn quilt medallion — concentric nested squares and diamonds
// alternating at 45° in navy, deep red, cream, and forest green — on weathered
// barn board planks. Each ring reveals in staggered sequence on scroll.
// Placed between CoveredBridge and ShrewsburyClockTower.

import { useEffect, useRef, useState } from "react";

// ── Geometry ──────────────────────────────────────────────────────────────────

const QCX    = 720;   // quilt center x
const QCY    = 274;   // quilt center y
const QHALF  = 188;   // half-side of quilt square
const BORDER = 18;    // outer border strip width

const QX  = QCX - QHALF;                 // 532
const QY  = QCY - QHALF;                 // 86
const QW  = QHALF * 2;                   // 376
const QH  = QHALF * 2;                   // 376
const IQX = QX + BORDER;                 // 550
const IQY = QY + BORDER;                 // 104
const IQW = QW - BORDER * 2;             // 340
const IQH = QH - BORDER * 2;             // 340

// Medallion layers — outer to inner; each rendered on top of the previous.
// sq:true = axis-aligned square | sq:false = 45°-rotated diamond
const LAYERS: { sq: boolean; r: number; fill: string; delay: number }[] = [
  { sq: false, r: 160, fill: "#142048", delay: 0.10 }, // 1 — outer navy diamond
  { sq: true,  r: 112, fill: "#f0e8d0", delay: 0.22 }, // 2 — cream square
  { sq: false, r:  86, fill: "#b82010", delay: 0.36 }, // 3 — red diamond
  { sq: true,  r:  60, fill: "#142048", delay: 0.50 }, // 4 — navy square
  { sq: false, r:  46, fill: "#f0e8d0", delay: 0.64 }, // 5 — cream diamond
  { sq: true,  r:  30, fill: "#265c14", delay: 0.80 }, // 6 — forest-green square
  { sq: false, r:  16, fill: "#b82010", delay: 0.96 }, // 7 — red center diamond
];

// Stitching lines within the inner quilt area
const H_STITCH = Array.from(
  { length: Math.floor(IQH / 30) },
  (_, i) => IQY + 30 + i * 30
);
const V_STITCH = Array.from(
  { length: Math.floor(IQW / 30) },
  (_, i) => IQX + 30 + i * 30
);

// Batting tick marks (count along each border edge)
const TICK_COUNT   = 12;
const TICK_SPACING = IQW / (TICK_COUNT - 1);

// Barn plank colors — 20 planks, deterministic variation
const PLANK_COLS = [
  "#1e1610","#191208","#1d1510","#1a1208","#1c1408",
  "#191208","#1e1610","#1b1308","#1d1510","#191208",
  "#1e1610","#1a1208","#1c1408","#1b1308","#1e1610",
  "#1a1208","#1c1408","#191208","#1d1510","#1a1208",
];
const PLANK_W = 1440 / PLANK_COLS.length;

// ── Component ─────────────────────────────────────────────────────────────────

export function BarnQuilt() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.20 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.55s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{ background: "#0f0a05", overflow: "hidden", position: "relative" }}>

      {/* Header labels */}
      <div style={{
        position: "absolute", top: "2rem", left: 0, right: 0, zIndex: 10,
        textAlign: "center",
        opacity: active ? 1 : 0, transition: "opacity .5s ease .08s",
      }}>
        <p style={{
          fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(212,104,42,0.38)", fontFamily: "monospace", margin: "0 0 .3rem",
        }}>
          Route 9 Web Co. · Shrewsbury, MA · Est. 2024
        </p>
        <p style={{
          fontSize: "11px", letterSpacing: "0.06em",
          color: "rgba(243,233,213,0.2)",
          fontFamily: "var(--font-display,Georgia),Georgia,serif",
          fontStyle: "italic", margin: 0,
        }}>
          Woven from the same community we serve.
        </p>
      </div>

      <svg
        viewBox="0 0 1440 542"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="New England barn quilt medallion on weathered barn boards"
      >
        {/* ── BARN BOARDS ── */}
        {PLANK_COLS.map((col, i) => (
          <rect key={i} x={i * PLANK_W} y={0} width={PLANK_W + 1} height={542} fill={col}/>
        ))}
        {PLANK_COLS.map((_, i) => (
          <line key={i} x1={i * PLANK_W} y1={0} x2={i * PLANK_W} y2={542}
            stroke="rgba(0,0,0,.38)" strokeWidth="1.5"/>
        ))}
        {/* Horizontal wood grain */}
        {[42, 98, 148, 200, 252, 304, 356, 406, 456, 506].map(gy => (
          <line key={gy} x1={0} y1={gy} x2={1440} y2={gy}
            stroke="rgba(80,40,10,.04)" strokeWidth="1"/>
        ))}

        {/* ── HANGING HARDWARE ── */}
        {[588, 852].map(nx => (
          <g key={nx}>
            <line x1={nx} y1={QY - 22} x2={nx} y2={QY - 2}
              stroke="rgba(130,118,88,.55)" strokeWidth="2"/>
            <circle cx={nx} cy={QY - 24} r="4.5" fill="#7a7258"/>
            <circle cx={nx} cy={QY - 24} r="2"   fill="#aca888"/>
          </g>
        ))}
        {/* Hanging rope */}
        <path d={`M 588,${QY - 2} Q 720,${QY - 34} 852,${QY - 2}`}
          stroke="rgba(152,122,62,.42)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        {/* Rope drape shadow */}
        <path d={`M 588,${QY + 1} Q 720,${QY - 30} 852,${QY + 1}`}
          stroke="rgba(0,0,0,.22)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

        {/* ── QUILT DROP SHADOW ── */}
        <rect x={QX + 9} y={QY + 9} width={QW} height={QH} rx="2"
          fill="rgba(0,0,0,.65)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── QUILT BATTING BASE ── */}
        <rect x={QX} y={QY} width={QW} height={QH} rx="2" fill="#e6ddb8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ── NAVY OUTER BORDER ── */}
        <rect x={QX} y={QY} width={QW} height={QH} rx="2" fill="#142048"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>

        {/* Border label */}
        <text x={QCX} y={QY + BORDER / 2 + 4} textAnchor="middle"
          fill="rgba(240,220,160,.50)" fontSize="6.2"
          fontFamily="monospace" letterSpacing="2.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}>
          ROUTE 9 · SHREWSBURY · MA
        </text>

        {/* ── BORDER CORNER SQUARES (red accent) ── */}
        {([[QX, QY], [QX + QW - BORDER, QY], [QX, QY + QH - BORDER], [QX + QW - BORDER, QY + QH - BORDER]] as [number, number][]).map(([bx, by], i) => (
          <rect key={i} x={bx} y={by} width={BORDER} height={BORDER} fill="#b82010"
            style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        ))}

        {/* ── CREAM INNER QUILT FIELD ── */}
        <rect x={IQX} y={IQY} width={IQW} height={IQH} fill="#f0e8d0"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>

        {/* ── MEDALLION LAYERS ── */}
        {LAYERS.map((layer, i) =>
          layer.sq ? (
            <rect key={i}
              x={QCX - layer.r} y={QCY - layer.r}
              width={layer.r * 2} height={layer.r * 2}
              fill={layer.fill}
              style={{ opacity: active ? 1 : 0, transition: tr(layer.delay) }}
            />
          ) : (
            <polygon key={i}
              points={`${QCX},${QCY - layer.r} ${QCX + layer.r},${QCY} ${QCX},${QCY + layer.r} ${QCX - layer.r},${QCY}`}
              fill={layer.fill}
              style={{ opacity: active ? 1 : 0, transition: tr(layer.delay) }}
            />
          )
        )}

        {/* ── STITCHING GRID ── */}
        <g style={{ opacity: active ? 0.32 : 0, transition: tr(1.12) }}>
          {H_STITCH.map(y => (
            <line key={y} x1={IQX} y1={y} x2={IQX + IQW} y2={y}
              stroke="#e8dfc0" strokeWidth="0.6" strokeDasharray="4,4"/>
          ))}
          {V_STITCH.map(x => (
            <line key={x} x1={x} y1={IQY} x2={x} y2={IQY + IQH}
              stroke="#e8dfc0" strokeWidth="0.6" strokeDasharray="4,4"/>
          ))}
        </g>

        {/* ── BATTING EDGE TICKS ── */}
        <g style={{ opacity: active ? 0.40 : 0, transition: tr(1.22) }}>
          {/* Top & bottom edges */}
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const tx = IQX + i * TICK_SPACING;
            return (
              <g key={i}>
                <line x1={tx} y1={QY}          x2={tx} y2={QY + BORDER}      stroke="#e8dfc0" strokeWidth="0.7"/>
                <line x1={tx} y1={QY + QH - BORDER} x2={tx} y2={QY + QH}    stroke="#e8dfc0" strokeWidth="0.7"/>
              </g>
            );
          })}
          {/* Left & right edges */}
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const ty = IQY + i * (IQH / (TICK_COUNT - 1));
            return (
              <g key={i}>
                <line x1={QX}          y1={ty} x2={QX + BORDER}          y2={ty} stroke="#e8dfc0" strokeWidth="0.7"/>
                <line x1={QX + QW - BORDER} y1={ty} x2={QX + QW}         y2={ty} stroke="#e8dfc0" strokeWidth="0.7"/>
              </g>
            );
          })}
        </g>

        {/* ── BORDER INNER EDGE HIGHLIGHT ── */}
        <rect x={IQX} y={IQY} width={IQW} height={IQH}
          fill="none" stroke="rgba(240,220,160,.18)" strokeWidth="1"
          style={{ opacity: active ? 1 : 0, transition: tr(1.10) }}/>

        {/* ── QUILT OUTER EDGE HIGHLIGHT ── */}
        <rect x={QX + 1} y={QY + 1} width={QW - 2} height={QH - 2}
          fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1"
          rx="1.5"
          style={{ opacity: active ? 1 : 0, transition: tr(1.10) }}/>

        {/* ── GROUND CAPTION ── */}
        <text x={QCX} y={QY + QH + 34} textAnchor="middle"
          fill="rgba(243,233,213,.15)" fontSize="9.5"
          fontFamily="monospace" letterSpacing="2.2"
          style={{ opacity: active ? 1 : 0, transition: tr(1.40) }}>
          ROUTE 9 BARN QUILT · SHREWSBURY, MASSACHUSETTS
        </text>
      </svg>
    </div>
  );
}
