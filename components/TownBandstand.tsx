"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY    = 460;
const HZ    = 292;   // horizon

// Bandstand geometry
const BCX   = 640;
const BFY   = GY - 62;    // 398 — platform floor y
const EAVE_Y = BFY - 86;  // 312 — column tops / eave
const PEAK_Y = GY - 215;  // 245 — roof peak
const BFLW  = 238;         // floor width
const EAVE_W = 300;        // eave overhang width

const COL_XS = [BCX - 90, BCX - 30, BCX + 30, BCX + 90] as const;

// Crowd figures: x, y-offset, scale, phase, parasol
const CROWD = [
  { x: 312, yo: -4, sc: 0.92, ph: 0.0, pa: true  },
  { x: 370, yo: -2, sc: 0.87, ph: 1.1, pa: false },
  { x: 428, yo: -5, sc: 0.94, ph: 2.2, pa: false },
  { x: 488, yo: -3, sc: 0.86, ph: 0.6, pa: true  },
  { x: 550, yo: -6, sc: 0.68, ph: 1.5, pa: false }, // child
  { x: 742, yo: -4, sc: 0.91, ph: 1.8, pa: false },
  { x: 802, yo: -2, sc: 0.86, ph: 3.0, pa: true  },
  { x: 860, yo: -5, sc: 0.93, ph: 0.4, pa: false },
  { x: 918, yo: -3, sc: 0.88, ph: 2.6, pa: false },
  { x: 978, yo: -6, sc: 0.70, ph: 2.8, pa: false }, // child
] as const;

// Musicians: xOffset, instrument (0=tuba, 1=trombone, 2=cornet, 3=clarinet, 4=snare)
const MUSICIANS = [
  { xo: -88, inst: 0 },
  { xo: -44, inst: 1 },
  { xo:   0, inst: 2 },
  { xo:  44, inst: 3 },
  { xo:  88, inst: 4 },
] as const;

// Music notes: xOffset, phase, speed, type (0=quarter, 1=eighth)
const NOTES = [
  { xo: -78, ph: 0.0, sp: 0.82, nt: 0 }, { xo: -38, ph: 1.0, sp: 0.90, nt: 1 },
  { xo:  12, ph: 2.0, sp: 0.85, nt: 0 }, { xo:  54, ph: 3.0, sp: 0.92, nt: 1 },
  { xo: -58, ph: 0.5, sp: 0.88, nt: 1 }, { xo:  78, ph: 1.5, sp: 0.86, nt: 0 },
  { xo: -18, ph: 2.5, sp: 0.83, nt: 0 }, { xo:  32, ph: 3.5, sp: 0.91, nt: 1 },
] as const;

// Gingerbread pendant drop x-positions along eave
const PENDANTS: number[] = [];
for (let px = BCX - EAVE_W / 2 + 10; px <= BCX + EAVE_W / 2 - 10; px += 15) {
  PENDANTS.push(px);
}

// Distant elm treeline
const treeline = (() => {
  let d = `M0,${HZ}`;
  for (let tx = 0; tx <= W; tx += 22) {
    const th = 30 + Math.sin(tx * 0.036) * 18 + Math.sin(tx * 0.078) * 10;
    d += ` L${tx},${HZ - th}`;
  }
  return d + ` L${W},${HZ} L0,${HZ} Z`;
})();

const CROWD_COLS = ["#2848a0","#3a6030","#a82830","#483878","#306028","#884428"] as const;

export function TownBandstand() {
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
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [vis]);

  const batonAngle = Math.sin(phase * 3.2) * 45 - 20;
  const flagWave   = Math.sin(phase * 4.0) * 8;
  const flagWave2  = Math.sin(phase * 5.5) * 5;

  return (
    <section className="w-full overflow-hidden bg-[#d8ecc8]">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ display: "block" }}
        aria-label="Shrewsbury Town Common Victorian bandstand — brass band summer concert, animated conductor, Victorian crowd with parasols"
      >
        <defs>
          <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a88c8" />
            <stop offset="42%"  stopColor="#78b8e0" />
            <stop offset="78%"  stopColor="#f8d070" />
            <stop offset="100%" stopColor="#f08030" />
          </linearGradient>
          <linearGradient id="tb-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#70b840" />
            <stop offset="100%" stopColor="#4c8a28" />
          </linearGradient>
          <linearGradient id="tb-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a4e28" />
            <stop offset="100%" stopColor="#1c3818" />
          </linearGradient>
          <radialGradient id="tb-sun" cx="72%" cy="15%" r="50%">
            <stop offset="0%"   stopColor="#fff8d0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#fff8d0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width={W} height={HZ + 22} fill="url(#tb-sky)" />
        <rect x="0" y="0" width={W} height={H}        fill="url(#tb-sun)" />

        {/* Clouds */}
        {[
          { x: 180, y: 90,  rx: 58, ry: 22 },
          { x: 420, y: 68,  rx: 44, ry: 16 },
          { x: 900, y: 82,  rx: 62, ry: 20 },
          { x: 1140,y: 100, rx: 50, ry: 18 },
        ].map((cl, ci) => (
          <g key={ci} opacity="0.82">
            <ellipse cx={cl.x}         cy={cl.y}      rx={cl.rx}           ry={cl.ry}      fill="#ffffff" />
            <ellipse cx={cl.x - cl.rx * 0.4} cy={cl.y - 6} rx={cl.rx * 0.65} ry={cl.ry * 0.85} fill="#f8f8f8" />
            <ellipse cx={cl.x + cl.rx * 0.4} cy={cl.y - 4} rx={cl.rx * 0.55} ry={cl.ry * 0.75} fill="#f8f8f8" />
          </g>
        ))}

        {/* Treeline */}
        <path d={treeline} fill="#286830" opacity="0.62" />
        <path d={treeline} fill="#1a5020" opacity="0.28" transform="translate(14,7)" />

        {/* Common grass */}
        <rect x="0" y={HZ + 10} width={W} height={H - HZ - 10} fill="url(#tb-grass)" />
        <rect x="0" y={GY}      width={W} height={H - GY}       fill="#4a8828" />

        {/* ── Left elm ── */}
        <rect x="195" y="265" width="18" height={GY - 265} rx="5" fill="#6a4420" />
        <ellipse cx="204" cy="242" rx="70" ry="64" fill="#2c6822" opacity="0.92" />
        <ellipse cx="168" cy="260" rx="48" ry="43" fill="#246018" opacity="0.80" />
        <ellipse cx="240" cy="254" rx="52" ry="46" fill="#327020" opacity="0.85" />
        <ellipse cx="202" cy="218" rx="56" ry="48" fill="#387820" opacity="0.90" />

        {/* ── Right elm ── */}
        <rect x="1067" y="268" width="18" height={GY - 268} rx="5" fill="#6a4420" />
        <ellipse cx="1076" cy="246" rx="70" ry="64" fill="#2c6822" opacity="0.92" />
        <ellipse cx="1040" cy="264" rx="48" ry="43" fill="#246018" opacity="0.80" />
        <ellipse cx="1112" cy="258" rx="52" ry="46" fill="#327020" opacity="0.85" />
        <ellipse cx="1074" cy="224" rx="56" ry="48" fill="#387820" opacity="0.90" />

        {/* ── Flag on pole ── */}
        <line x1="482" y1={GY} x2="482" y2={GY - 196}
          stroke="#c8b888" strokeWidth="3" strokeLinecap="round" />
        <circle cx="482" cy={GY - 198} r="4" fill="#e8b028" />
        {/* Flag */}
        <path
          d={`M482,${GY - 196} L482,${GY - 172} Q${518 + flagWave},${GY - 178} ${530 + flagWave2},${GY - 184} Q${518 + flagWave},${GY - 194} 482,${GY - 196} Z`}
          fill="#c81818"
        />
        {[0,1,2].map(si => (
          <path key={si}
            d={`M482,${GY - 193 + si * 7} Q${512 + flagWave},${GY - 190 + si * 7} ${525 + flagWave2},${GY - 187 + si * 7}`}
            fill="none" stroke="#f0f0f0" strokeWidth="2"
          />
        ))}
        <path
          d={`M482,${GY - 196} Q${496 + flagWave * 0.4},${GY - 186} ${494 + flagWave * 0.3},${GY - 180} L482,${GY - 180} Z`}
          fill="#1a2878"
        />

        {/* ── BANDSTAND ── */}

        {/* Platform base */}
        <rect x={BCX - BFLW / 2 - 8} y={BFY + 14} width={BFLW + 16} height="16" rx="4"
          fill="#d4ccaa" />
        {/* Steps */}
        <rect x={BCX - 56} y={BFY + 30} width="112" height="12" rx="2" fill="#ccc4a2" />
        <rect x={BCX - 46} y={BFY + 42} width="92"  height="12" rx="2" fill="#beb89a" />

        {/* Platform floor */}
        <rect x={BCX - BFLW / 2} y={BFY} width={BFLW} height="16" rx="3" fill="#eae2c8" />
        {Array.from({ length: 8 }, (_, fi) => (
          <line key={fi}
            x1={BCX - BFLW / 2 + 14 + fi * 28} y1={BFY}
            x2={BCX - BFLW / 2 + 14 + fi * 28} y2={BFY + 16}
            stroke="#d8d0aa" strokeWidth="1"
          />
        ))}

        {/* Railing */}
        <rect x={BCX - BFLW / 2 + 4} y={BFY - 24} width={BFLW - 8} height="5" rx="2"
          fill="#ecead8" />
        {Array.from({ length: 24 }, (_, bi) => (
          <rect key={bi}
            x={BCX - BFLW / 2 + 12 + bi * 9} y={BFY - 24}
            width="4" height="24" rx="1"
            fill="#eeecdc" opacity="0.82"
          />
        ))}

        {/* Back-wall shadow inside bandstand */}
        <rect x={BCX - BFLW / 2 + 18} y={EAVE_Y} width={BFLW - 36} height={BFY - EAVE_Y}
          fill="#383020" opacity="0.20" />

        {/* ── Musicians ── */}
        {MUSICIANS.map((mu, mi) => {
          const mx   = BCX + mu.xo;
          const sway = Math.sin(phase * 2.1 + mi * 0.85) * 2.8;
          return (
            <g key={mi} transform={`translate(${mx},${BFY}) rotate(${sway})`}>
              {/* Legs */}
              <rect x="-8"  y="-28" width="7" height="28" rx="3" fill="#181428" />
              <rect x="1"   y="-28" width="7" height="28" rx="3" fill="#181428" />
              {/* Body — dark jacket */}
              <rect x="-12" y="-72" width="24" height="46" rx="6" fill="#1e1838" />
              {/* Shirt front */}
              <rect x="-4"  y="-70" width="8" height="12" rx="2" fill="#eaeadc" />

              {/* Instrument */}
              {mu.inst === 0 && (
                <g>
                  {/* Tuba bell rings */}
                  <circle cx="-2" cy="-55" r="16" fill="none" stroke="#c89e28" strokeWidth="4" />
                  <circle cx="-2" cy="-55" r="11" fill="none" stroke="#c89e28" strokeWidth="2" />
                  <line x1="-2" y1="-39" x2="8" y2="-80" stroke="#c89e28" strokeWidth="3" />
                  <line x1="8"  y1="-80" x2="14" y2="-86" stroke="#c89e28" strokeWidth="2" />
                </g>
              )}
              {mu.inst === 1 && (
                <g>
                  {/* Trombone slide */}
                  <line x1="-6" y1="-70" x2={-32 + Math.sin(phase * 2.5 + mi) * 14} y2="-70"
                    stroke="#c89e28" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-6" y1="-63" x2={-32 + Math.sin(phase * 2.5 + mi) * 14} y2="-63"
                    stroke="#c89e28" strokeWidth="3" strokeLinecap="round" />
                  <rect x="-8" y="-74" width="5" height="15" rx="1" fill="#c89e28" />
                </g>
              )}
              {mu.inst === 2 && (
                <g>
                  {/* Cornet — looped bell */}
                  <path d="M-7,-70 Q2,-84 10,-70"
                    fill="none" stroke="#c89e28" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="10" cy="-70" r="8" fill="none" stroke="#c89e28" strokeWidth="3" />
                </g>
              )}
              {mu.inst === 3 && (
                <g>
                  {/* Clarinet — thin cylinder */}
                  <line x1="8" y1="-82" x2="10" y2="-42"
                    stroke="#6a4820" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="9"  cy="-64" r="3" fill="#a87030" />
                  <circle cx="9"  cy="-52" r="2.5" fill="#a87030" />
                </g>
              )}
              {mu.inst === 4 && (
                <g>
                  {/* Snare drum */}
                  <rect x="-13" y="-62" width="26" height="17" rx="3" fill="#eac870" />
                  <rect x="-13" y="-62" width="26" height="3"  rx="1" fill="#c8a850" />
                  <rect x="-13" y="-48" width="26" height="3"  rx="1" fill="#c8a850" />
                  {/* Sticks */}
                  <line x1="-6" y1="-62" x2="-20" y2="-80"
                    stroke="#c8a870" strokeWidth="2"
                    transform={`rotate(${Math.sin(phase * 4.8 + mi) * 16},-6,-62)`} />
                  <line x1="6"  y1="-62" x2="20"  y2="-80"
                    stroke="#c8a870" strokeWidth="2"
                    transform={`rotate(${-Math.sin(phase * 4.8 + mi) * 16},6,-62)`} />
                </g>
              )}

              {/* Head */}
              <circle cx="0" cy="-84" r="11" fill="#f0c890" />
              {/* Peaked cap */}
              <rect x="-9"  y="-100" width="18" height="14" rx="3" fill="#1c1632" />
              <rect x="-12" y="-88"  width="24" height="4"  rx="1" fill="#1c1632" />
              <rect x="-2"  y="-100" width="4"  height="3"  rx="1" fill="#c89e28" />
            </g>
          );
        })}

        {/* ── Columns ── */}
        {COL_XS.map((cx2, ci) => (
          <g key={ci}>
            <rect x={cx2 - 7} y={EAVE_Y} width="14" height={BFY - EAVE_Y} rx="5"
              fill="#eae6d4" />
            {/* Column flutes */}
            {[0, 1, 2].map(fi => (
              <line key={fi}
                x1={cx2 - 3 + fi * 3} y1={EAVE_Y + 6}
                x2={cx2 - 3 + fi * 3} y2={BFY - 8}
                stroke="#d8d4c0" strokeWidth="0.8" opacity="0.5"
              />
            ))}
            {/* Capital */}
            <rect x={cx2 - 11} y={EAVE_Y - 3} width="22" height="9" rx="2" fill="#dad6c4" />
            {/* Base */}
            <rect x={cx2 - 11} y={BFY - 8}    width="22" height="9" rx="2" fill="#dad6c4" />
          </g>
        ))}

        {/* ── Roof ── */}
        {/* Main cone */}
        <path
          d={`M${BCX - EAVE_W / 2},${EAVE_Y} L${BCX + EAVE_W / 2},${EAVE_Y} L${BCX},${PEAK_Y} Z`}
          fill="url(#tb-roof)"
        />
        {/* Shingle lines */}
        {Array.from({ length: 8 }, (_, ri) => {
          const t  = (ri + 1) / 9;
          const ry2 = EAVE_Y + (PEAK_Y - EAVE_Y) * t;
          const rw  = (EAVE_W / 2) * (1 - t);
          return (
            <line key={ri}
              x1={BCX - rw} y1={ry2}
              x2={BCX + rw} y2={ry2}
              stroke="#3c5a38" strokeWidth="1.2" opacity="0.55"
            />
          );
        })}
        {/* Roof highlight */}
        <path d={`M${BCX - EAVE_W / 2},${EAVE_Y} L${BCX},${PEAK_Y}`}
          fill="none" stroke="#4a7040" strokeWidth="2" opacity="0.55" />
        <path d={`M${BCX + EAVE_W / 2},${EAVE_Y} L${BCX},${PEAK_Y}`}
          fill="none" stroke="#1c3018" strokeWidth="2" opacity="0.35" />

        {/* Finial */}
        <line x1={BCX} y1={PEAK_Y} x2={BCX} y2={PEAK_Y - 26}
          stroke="#c89e28" strokeWidth="3" strokeLinecap="round" />
        <circle cx={BCX} cy={PEAK_Y - 28} r="5.5" fill="#e8b828" />
        <circle cx={BCX} cy={PEAK_Y - 28} r="3"   fill="#f8d040" />

        {/* ── Gingerbread trim ── */}
        {/* Red fascia board */}
        <rect x={BCX - EAVE_W / 2 - 3} y={EAVE_Y - 3} width={EAVE_W + 6} height="12" rx="2"
          fill="#c01820" />
        {/* Pendant drops */}
        {PENDANTS.map((px2, pi) => (
          <path key={pi}
            d={`M${px2 - 4},${EAVE_Y + 9} Q${px2},${EAVE_Y + 24} ${px2 + 4},${EAVE_Y + 9}`}
            fill="none" stroke="#c01820" strokeWidth="2.5"
          />
        ))}
        {/* White scalloped arches between columns */}
        {[0, 1, 2].map(ai => {
          const x1 = COL_XS[ai] ?? (BCX - 90 + ai * 60);
          const x2 = COL_XS[ai + 1] ?? (x1 + 60);
          const mx  = (x1 + x2) / 2;
          return (
            <path key={ai}
              d={`M${x1 + 7},${EAVE_Y + 10} Q${mx},${EAVE_Y + 40} ${x2 - 7},${EAVE_Y + 10}`}
              fill="none" stroke="#f0eedd" strokeWidth="2.8"
            />
          );
        })}

        {/* Bandstand sign */}
        <rect x={BCX - 88} y={EAVE_Y + 14} width="176" height="19" rx="3"
          fill="#c01820" opacity="0.88" />
        <text x={BCX} y={EAVE_Y + 27} textAnchor="middle" fontSize="10"
          fill="#f8f0d0" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.8">
          SHREWSBURY TOWN BAND
        </text>

        {/* ── Conductor ── */}
        {(() => {
          const cX = BCX + 6;
          const cY = GY;
          const shoulderX = cX + 12;
          const shoulderY = cY - 102;
          const armLen = 24;
          const btnLen = 42;
          const aRad = batonAngle * Math.PI / 180;
          const armX = shoulderX + Math.cos(aRad) * armLen;
          const armY = shoulderY + Math.sin(aRad) * armLen;
          const btnX = shoulderX + Math.cos(aRad) * (armLen + btnLen);
          const btnY = shoulderY + Math.sin(aRad) * (armLen + btnLen);
          return (
            <g>
              {/* Legs */}
              <rect x={cX - 9}  y={cY - 46} width="9" height="46" rx="4" fill="#18142e" />
              <rect x={cX + 1}  y={cY - 46} width="9" height="46" rx="4" fill="#18142e" />
              {/* Shoes */}
              <rect x={cX - 12} y={cY - 5} width="13" height="7" rx="3" fill="#100e1c" />
              <rect x={cX}      y={cY - 5} width="13" height="7" rx="3" fill="#100e1c" />
              {/* Tailcoat */}
              <rect x={cX - 14} y={cY - 112} width="28" height="68" rx="7" fill="#18142e" />
              {/* Shirt & bow tie */}
              <rect x={cX - 4}  y={cY - 110} width="8" height="16" rx="2" fill="#eeeedd" />
              <path d={`M${cX - 4},${cY - 100} L${cX},${cY - 97} L${cX + 4},${cY - 100} L${cX},${cY - 104} Z`}
                fill="#c01820" />
              {/* Tails */}
              <path d={`M${cX - 14},${cY - 46} L${cX - 22},${cY - 24} L${cX - 8},${cY - 46} Z`}
                fill="#12102a" />
              <path d={`M${cX + 14},${cY - 46} L${cX + 22},${cY - 24} L${cX + 8},${cY - 46} Z`}
                fill="#12102a" />
              {/* Left arm at side */}
              <rect x={cX - 24} y={cY - 107} width="11" height="8" rx="4" fill="#18142e"
                transform={`rotate(18,${cX - 19},${cY - 103})`} />
              {/* Right arm conducting */}
              <line x1={shoulderX} y1={shoulderY} x2={armX} y2={armY}
                stroke="#18142e" strokeWidth="9" strokeLinecap="round" />
              {/* Baton */}
              <line x1={armX} y1={armY} x2={btnX} y2={btnY}
                stroke="#e8d090" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={btnX} cy={btnY} r="3.5" fill="#f0d8a8" />
              {/* White glove */}
              <circle cx={armX} cy={armY} r="5.5" fill="#f0f0e8" />
              {/* Head */}
              <circle cx={cX} cy={cY - 124} r="14" fill="#f0c890" />
              {/* Top hat */}
              <rect x={cX - 9}  y={cY - 150} width="18" height="24" rx="2" fill="#100e1c" />
              <rect x={cX - 13} y={cY - 128} width="26" height="5"  rx="1" fill="#100e1c" />
              {/* Hat band */}
              <rect x={cX - 9}  y={cY - 132} width="18" height="4"  rx="1" fill="#c01820" />
            </g>
          );
        })()}

        {/* ── Crowd ── */}
        {CROWD.map((pe, pi) => {
          const sway = Math.sin(phase * 1.8 + pe.ph) * 2.5;
          const clap = Math.sin(phase * 3.5 + pe.ph) * 7;
          const cy2  = GY + pe.yo;
          const col  = CROWD_COLS[pi % 6] ?? "#2848a0";
          const skin = pi % 4 < 2 ? "#f0c890" : "#c89060";
          return (
            <g key={pi} transform={`translate(${pe.x},${cy2}) scale(${pe.sc}) rotate(${sway})`}>
              {/* Lower body */}
              {pi % 3 === 0 ? (
                <path d="M-11,-8 Q-15,6 -10,12 Q0,15 10,12 Q15,6 11,-8 Z"
                  fill={col} />
              ) : (
                <>
                  <rect x="-9" y="-10" width="7" height="18" rx="3" fill={col} />
                  <rect x="2"  y="-10" width="7" height="18" rx="3" fill={col} />
                </>
              )}
              {/* Body */}
              <rect x="-11" y="-62" width="22" height="54" rx="6" fill={col} />
              {/* Arms */}
              <rect x="-19" y="-58" width="10" height="7" rx="3" fill={col}
                transform={`rotate(${-clap * 0.5},-15,-55)`} />
              <rect x="9"   y="-58" width="10" height="7" rx="3" fill={col}
                transform={`rotate(${clap * 0.5},15,-55)`} />
              {/* Head */}
              <circle cx="0" cy="-74" r={pe.sc < 0.75 ? 11 : 10} fill={skin} />
              {/* Hat/bonnet */}
              {pi % 5 === 0 && <ellipse cx="0" cy="-82" rx="13" ry="5" fill={col} />}
              {pi % 5 === 1 && (
                <>
                  <rect x="-7" y="-90" width="14" height="14" rx="2" fill="#18142e" />
                  <rect x="-10" y="-78" width="20" height="4" rx="1" fill="#18142e" />
                </>
              )}
              {/* Parasol */}
              {pe.pa && (
                <g transform={`translate(14,-70) rotate(${-18 + sway})`}>
                  <line x1="0" y1="0" x2="0" y2="-30" stroke="#c8a838" strokeWidth="1.5" />
                  <path d="M-20,-30 Q0,-46 20,-30 Z" fill={col} opacity="0.82" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── Floating music notes ── */}
        {NOTES.map((nt, ni) => {
          const age = ((phase * nt.sp + nt.ph) % (Math.PI * 2)) / (Math.PI * 2);
          const nx  = BCX + nt.xo + Math.sin(age * Math.PI * 3 + nt.ph) * 11;
          const ny  = BFY - 16 - age * (BFY - PEAK_Y - 24);
          const no  = age < 0.18 ? age / 0.18 : age > 0.72 ? 1 - (age - 0.72) / 0.28 : 1;
          const rot = Math.sin(age * Math.PI * 2 + nt.ph) * 14;
          return (
            <g key={ni} transform={`translate(${nx},${ny}) rotate(${rot})`} opacity={no * 0.68}>
              <ellipse cx="0" cy="0" rx="5.5" ry="4" fill="#d07022" transform="rotate(-28)" />
              <line x1="4.5" y1="-1" x2="4.5" y2="-20" stroke="#d07022" strokeWidth="2" />
              {nt.nt === 1 && (
                <path d="M4.5,-20 Q15,-14 12,-5" fill="none" stroke="#d07022" strokeWidth="2" />
              )}
            </g>
          );
        })}

        {/* Bandstand ground shadow */}
        <ellipse cx={BCX + 20} cy={GY + 5} rx="130" ry="12"
          fill="#3a5818" opacity="0.22" />

        {/* Caption */}
        <text x="640" y={H - 10} textAnchor="middle" fontSize="12" fill="#2a4810"
          fontFamily="Georgia,serif" opacity="0.65" letterSpacing="1">
          SHREWSBURY TOWN COMMON · SUMMER BAND CONCERT · EST. 1872
        </text>
      </svg>
    </section>
  );
}
