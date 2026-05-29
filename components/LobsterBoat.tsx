"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const WL   = 340;   // waterline y
const HZ   = 282;   // horizon y
const SX   = 450;   // stern x
const BX   = 892;   // bow x

// Star positions — golden-ratio spaced across upper sky
const GR = (1 + Math.sqrt(5)) / 2;
const STARS = Array.from({ length: 28 }, (_, i) => [
  ((i * GR * 1000) % 1278) + 1,
  ((i * GR * 613)  % 168) + 8,
  0.8 + (i % 3) * 0.4,
]) as [number, number, number][];

// Buoys: x, y base, color pair, bob phase
const BUOYS = [
  { x: 185, y: WL+6,  c1: "#dc1818", c2: "#f8f8f8", ph: 0.0 },
  { x: 268, y: WL+11, c1: "#dc1818", c2: "#f8f8f8", ph: 1.3 },
  { x: 148, y: WL+4,  c1: "#1850d8", c2: "#f0d808", ph: 2.6 },
  { x: 338, y: WL+9,  c1: "#1850d8", c2: "#f0d808", ph: 0.7 },
  { x: 118, y: WL+15, c1: "#a010b8", c2: "#f8f8f8", ph: 1.9 },
  { x: 1028, y: WL+7,  c1: "#18a828", c2: "#ffffff", ph: 0.4 },
  { x: 1090, y: WL+11, c1: "#18a828", c2: "#ffffff", ph: 2.2 },
  { x: 1148, y: WL+5,  c1: "#e07818", c2: "#282878", ph: 3.5 },
  { x: 1200, y: WL+9,  c1: "#e07818", c2: "#282878", ph: 1.0 },
  { x: 1248, y: WL+4,  c1: "#dc1818", c2: "#f8f8f8", ph: 4.2 },
] as const;

// Seagulls: x, y, wing phase, scale
const GULLS = [
  { x: 192, y: 148, ph: 0.0, sc: 1.00 },
  { x: 332, y: 118, ph: 0.9, sc: 0.82 },
  { x: 508, y: 196, ph: 1.8, sc: 1.15 },
  { x: 642, y: 108, ph: 2.7, sc: 0.90 },
  { x: 778, y: 165, ph: 3.6, sc: 1.05 },
  { x: 925, y: 132, ph: 4.5, sc: 0.88 },
  { x: 1062, y: 182, ph: 5.4, sc: 1.10 },
  { x: 1196, y: 145, ph: 0.5, sc: 0.92 },
] as const;

// Wave bands
const WAVES = [
  { wy: WL+2,  wa: 3.5, sp: 0.58, ph: 0.0 },
  { wy: WL+22, wa: 5.0, sp: 0.68, ph: 1.1 },
  { wy: WL+48, wa: 6.5, sp: 0.80, ph: 2.3 },
  { wy: WL+78, wa: 8.0, sp: 0.92, ph: 3.5 },
  { wy: WL+115, wa: 9.5, sp: 1.05, ph: 4.7 },
] as const;

// Left headland treeline
const leftHead = (() => {
  let d = `M0,${HZ}`;
  for (let tx = 0; tx <= 310; tx += 18) {
    const ht = 14 + Math.sin(tx * 0.082) * 9 + Math.sin(tx * 0.190) * 5;
    d += ` L${tx},${HZ - ht}`;
  }
  for (let tx = 310; tx >= 0; tx -= 18) {
    const ht = 28 + Math.sin(tx * 0.058) * 16 + Math.sin(tx * 0.140) * 9;
    d += ` L${tx},${HZ - ht + 6}`;
  }
  return d + ` Z`;
})();

// Right distant bluffs
const rightBluffs = (() => {
  let d = `M1280,${HZ}`;
  for (let tx = 1280; tx >= 980; tx -= 18) {
    const ht = 8 + Math.sin(tx * 0.068) * 7 + Math.sin(tx * 0.162) * 4;
    d += ` L${tx},${HZ - ht}`;
  }
  for (let tx = 980; tx <= 1280; tx += 18) {
    const ht = 18 + Math.sin(tx * 0.050) * 12 + Math.sin(tx * 0.130) * 6;
    d += ` L${tx},${HZ - ht + 4}`;
  }
  return d + ` Z`;
})();

export function LobsterBoat() {
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
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  const boatBob  = Math.sin(phase * 0.82) * 2.4;
  const boatRock = Math.sin(phase * 0.78) * 0.55;
  const haulerRot = (phase * 155) % 360;
  const trapY    = WL + 18 - Math.sin(phase * 0.68) * 16;
  const trapRoll = Math.sin(phase * 1.05) * 7;
  const exhaustT = ((phase * 0.9) % (Math.PI * 2)) / (Math.PI * 2);
  const flagWave = Math.sin(phase * 3.8) * 6;

  // Deck y at a given x (sheer line)
  const deckY = (x: number) => {
    const t = (x - SX) / (BX - SX);
    return 296 - t * 14; // 296 at stern, 282 at bow
  };

  return (
    <section className="w-full overflow-hidden bg-[#0a1a30]">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ display: "block" }}
        aria-label="New England lobster boat at pre-dawn, hauling wire traps from the deep, colorful buoy field, seagulls, dramatic pre-dawn sky"
      >
        <defs>
          <linearGradient id="lb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#12103e" />
            <stop offset="38%"  stopColor="#18166a" />
            <stop offset="70%"  stopColor="#6a1858" />
            <stop offset="88%"  stopColor="#d84e18" />
            <stop offset="100%" stopColor="#f8b840" />
          </linearGradient>
          <linearGradient id="lb-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0a2448" />
            <stop offset="50%"  stopColor="#082038" />
            <stop offset="100%" stopColor="#060e20" />
          </linearGradient>
          <radialGradient id="lb-dawn" cx="50%" cy="100%" r="55%">
            <stop offset="0%"   stopColor="#f07028" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f07028" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lb-nav-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff3030" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff3030" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lb-nav-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#20ff60" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#20ff60" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={HZ} fill="url(#lb-sky)" />
        <rect x="0" y="0" width={W} height={HZ} fill="url(#lb-dawn)" />

        {/* Stars */}
        {STARS.map(([sx, sy, sr], si) => (
          <circle key={si} cx={sx} cy={sy} r={sr}
            fill="#ffffff"
            opacity={sy < 80 ? 0.75 : 0.45}
          />
        ))}

        {/* Venus — bright point near horizon */}
        <circle cx="880" cy="248" r="3.5" fill="#ffe8a0" opacity="0.95" />
        <circle cx="880" cy="248" r="8"   fill="#ffe8a0" opacity="0.20" />

        {/* Horizon glow streak */}
        <rect x="0" y={HZ - 4} width={W} height="8" fill="#f8c040" opacity="0.35" />
        <rect x="0" y={HZ - 2} width={W} height="4" fill="#f8e880" opacity="0.22" />

        {/* Headlands */}
        <path d={leftHead}   fill="#1a3818" opacity="0.90" />
        <path d={leftHead}   fill="#0a2010" opacity="0.50" transform="translate(8,5)" />
        <path d={rightBluffs} fill="#162e18" opacity="0.80" />

        {/* ── Water ── */}
        <rect x="0" y={HZ} width={W} height={H - HZ} fill="url(#lb-water)" />

        {/* Dawn reflection in water */}
        <rect x="0" y={HZ} width={W} height="60" fill="url(#lb-dawn)" opacity="0.4" />

        {/* Wave lines */}
        {WAVES.map((wb, wi) => {
          let d = `M0,${wb.wy}`;
          for (let wx = 0; wx <= W; wx += 16) {
            const wy = wb.wy + Math.sin(wx * 0.022 + phase * wb.sp + wb.ph) * wb.wa;
            d += ` L${wx},${wy}`;
          }
          return (
            <path key={wi} d={d} fill="none"
              stroke="#4898c8" strokeWidth="1.5"
              opacity={0.14 + wi * 0.02}
            />
          );
        })}

        {/* Boat wake (V-shape behind stern) */}
        <path
          d={`M${SX},${WL} Q${SX - 120},${WL + 8} ${SX - 280},${WL + 28}`}
          fill="none" stroke="#a0d8f0" strokeWidth="4" opacity="0.28"
        />
        <path
          d={`M${SX},${WL + 8} Q${SX - 110},${WL + 18} ${SX - 260},${WL + 42}`}
          fill="none" stroke="#a0d8f0" strokeWidth="3" opacity="0.18"
        />
        <path
          d={`M${SX},${WL} Q${SX - 100},${WL + 5} ${SX - 240},${WL + 18}`}
          fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.15"
        />

        {/* ── Buoys ── */}
        {BUOYS.map((bu, bui) => {
          const bob = Math.sin(phase * 1.5 + bu.ph) * 3.5;
          const tilt = Math.sin(phase * 1.2 + bu.ph) * 8;
          return (
            <g key={bui} transform={`translate(${bu.x},${bu.y + bob})`}>
              {/* Stick */}
              <line x1="0" y1="-22" x2={Math.sin(tilt * Math.PI / 180) * 4} y2="-2"
                stroke="#d0c8a8" strokeWidth="1.2" />
              {/* Top half of buoy (color 1) */}
              <path d="M-6,0 A6,8 0 0,1 6,0 Z" fill={bu.c1} />
              {/* Bottom half (color 2) */}
              <path d="M-6,0 A6,8 0 0,0 6,0 Z" fill={bu.c2} />
              {/* Outline */}
              <ellipse cx="0" cy="0" rx="6" ry="8" fill="none" stroke="#8898a8" strokeWidth="0.8" />
              {/* Warp going into water */}
              <line x1="0" y1="8" x2="0" y2="22" stroke="#d0c898" strokeWidth="0.8" opacity="0.5" />
            </g>
          );
        })}

        {/* ── Boat ── */}
        <g transform={`translate(0,${boatBob}) rotate(${boatRock},670,${WL})`}>

          {/* Below-waterline hull (red antifouling) */}
          <path
            d={`M${SX},${WL} L${BX - 2},${WL} Q${BX + 4},${WL + 12} ${BX - 4},${WL + 18} Q${(BX + SX) / 2},${WL + 24} ${SX + 18},${WL + 20} L${SX - 2},${WL + 12} Z`}
            fill="#8a1818"
          />

          {/* Boot stripe (white) */}
          <path
            d={`M${SX},${WL - 2} L${BX},${WL - 2} L${BX},${WL + 2} L${SX},${WL + 2} Z`}
            fill="#e8e8e0"
          />

          {/* Above-waterline hull (dark green) */}
          <path
            d={`M${SX},${deckY(SX)} L${BX - 18},${deckY(BX - 18)} Q${BX},${WL - 18} ${BX},${WL - 2} L${SX},${WL - 2} Z`}
            fill="#2a5830"
          />
          {/* Hull highlight */}
          <path
            d={`M${SX + 20},${deckY(SX + 20) + 4} L${BX - 30},${deckY(BX - 30) + 4} L${BX - 30},${deckY(BX - 30) + 8} L${SX + 20},${deckY(SX + 20) + 8} Z`}
            fill="#3a6840" opacity="0.6"
          />

          {/* Stern transom */}
          <rect x={SX - 14} y={deckY(SX)} width="14" height={WL - deckY(SX) + 2} rx="1" fill="#226030" />

          {/* Deck (dark gray non-slip) */}
          <path
            d={`M${SX},${deckY(SX)} L${BX - 18},${deckY(BX - 18)} L${BX - 18},${deckY(BX - 18) + 5} L${SX},${deckY(SX) + 5} Z`}
            fill="#3a3830"
          />
          {/* Deck planking lines */}
          {Array.from({ length: 6 }, (_, di) => {
            const dx = SX + 30 + di * 68;
            return (
              <line key={di}
                x1={dx} y1={deckY(dx) + 1}
                x2={dx} y2={deckY(dx) + 5}
                stroke="#2a2820" strokeWidth="1"
              />
            );
          })}

          {/* Gunwale (rail) */}
          <path
            d={`M${SX},${deckY(SX) - 2} L${BX - 18},${deckY(BX - 18) - 2}`}
            fill="none" stroke="#c8b870" strokeWidth="3" strokeLinecap="round"
          />

          {/* ── Trap stack at stern ── */}
          {[0, 1, 2].map(ti => {
            const tx2 = SX + 22, ty2 = deckY(SX + 22) - 26 - ti * 22;
            const tW = 58, tH = 20;
            return (
              <g key={ti}>
                <rect x={tx2} y={ty2} width={tW} height={tH} rx="2"
                  fill="none" stroke="#7a8848" strokeWidth="1.5" />
                {Array.from({ length: 6 }, (_, mi) => (
                  <line key={mi}
                    x1={tx2 + mi * (tW / 5)} y1={ty2}
                    x2={tx2 + mi * (tW / 5)} y2={ty2 + tH}
                    stroke="#7a8848" strokeWidth="0.7"
                  />
                ))}
                {Array.from({ length: 3 }, (_, mi) => (
                  <line key={mi}
                    x1={tx2} y1={ty2 + mi * (tH / 2)}
                    x2={tx2 + tW} y2={ty2 + mi * (tH / 2)}
                    stroke="#7a8848" strokeWidth="0.7"
                  />
                ))}
                {/* Rope handle */}
                <line x1={tx2 + tW * 0.3} y1={ty2}
                  x2={tx2 + tW * 0.7} y2={ty2 - 5}
                  stroke="#e8c870" strokeWidth="1.2" />
              </g>
            );
          })}

          {/* Bait barrels at stern */}
          <ellipse cx={SX + 100} cy={deckY(SX + 100) + 3} rx="14" ry="6" fill="#7a4820" />
          <rect x={SX + 86} y={deckY(SX + 100) - 22} width="28" height="28" rx="4" fill="#8a5828" />
          <rect x={SX + 84} y={deckY(SX + 100) - 24} width="32" height="4" rx="2" fill="#6a3818" />
          <line x1={SX + 88} y1={deckY(SX + 100) - 20} x2={SX + 88} y2={deckY(SX + 100) + 4}
            stroke="#5a2e10" strokeWidth="1.2" />
          <line x1={SX + 112} y1={deckY(SX + 100) - 20} x2={SX + 112} y2={deckY(SX + 100) + 4}
            stroke="#5a2e10" strokeWidth="1.2" />

          {/* ── Wheelhouse ── */}
          {(() => {
            const WHX = 590, WHW = 140, WHY = deckY(660), WHH = 68;
            const WHT = WHY - WHH;
            return (
              <g>
                {/* Body */}
                <rect x={WHX} y={WHT} width={WHW} height={WHH} rx="4" fill="#e8e8de" />
                {/* Roof crown */}
                <path d={`M${WHX - 2},${WHT} Q${WHX + WHW / 2},${WHT - 8} ${WHX + WHW + 2},${WHT} Z`}
                  fill="#d8d8cc" />
                {/* Windows port side (facing us) — 3 windows */}
                {[0, 1, 2].map(wi => (
                  <rect key={wi}
                    x={WHX + 12 + wi * 40} y={WHT + 12}
                    width="28" height="26" rx="3"
                    fill="#6090b8" stroke="#b8b8a8" strokeWidth="1.5"
                  />
                ))}
                {/* Cabin light in windows (warm glow) */}
                {[0, 1, 2].map(wi => (
                  <rect key={wi}
                    x={WHX + 14 + wi * 40} y={WHT + 14}
                    width="24" height="22" rx="2"
                    fill="#f8e070" opacity="0.25"
                  />
                ))}
                {/* Stern wall + door */}
                <rect x={WHX - 12} y={WHT + 6} width="12" height={WHH - 6} rx="2" fill="#d0d0c4" />
                <rect x={WHX - 10} y={WHT + 18} width="7" height={WHH - 24} rx="2" fill="#c0c0b4" stroke="#a0a090" strokeWidth="1" />
                {/* Porthole on stern wall */}
                <circle cx={WHX - 5} cy={WHT + 14} r="4" fill="#6090b8" stroke="#b8b090" strokeWidth="1" />

                {/* Radar arch */}
                <line x1={WHX + 10} y1={WHT} x2={WHX + 10} y2={WHT - 32}
                  stroke="#909090" strokeWidth="3" strokeLinecap="round" />
                <line x1={WHX + WHW - 10} y1={WHT} x2={WHX + WHW - 10} y2={WHT - 32}
                  stroke="#909090" strokeWidth="3" strokeLinecap="round" />
                <line x1={WHX + 10} y1={WHT - 32} x2={WHX + WHW - 10} y2={WHT - 32}
                  stroke="#909090" strokeWidth="2.5" strokeLinecap="round" />
                {/* Radar dome */}
                <ellipse cx={WHX + WHW / 2} cy={WHT - 32} rx="12" ry="7" fill="#c0c0b8" />
                {/* VHF antenna */}
                <line x1={WHX + WHW - 8} y1={WHT - 32} x2={WHX + WHW - 8} y2={WHT - 68}
                  stroke="#888880" strokeWidth="1.5" />

                {/* Exhaust stack */}
                <rect x={WHX + WHW + 4} y={WHT + 8} width="10" height="28" rx="3" fill="#606060" />
                <rect x={WHX + WHW + 2} y={WHT + 6} width="14" height="5" rx="2" fill="#484848" />

                {/* Navigation lights */}
                <circle cx={WHX - 6} cy={WHT + 4} r="5" fill="#ff2020" opacity="0.85" />
                <circle cx={WHX - 6} cy={WHT + 4} r="12" fill="url(#lb-nav-r)" />
                <circle cx={WHX + WHW + 6} cy={WHT + 4} r="5" fill="#20ff50" opacity="0.85" />
                <circle cx={WHX + WHW + 6} cy={WHT + 4} r="12" fill="url(#lb-nav-g)" />
              </g>
            );
          })()}

          {/* Exhaust puff */}
          {[0, 1, 2].map(ei => {
            const eAge = ((phase * 0.85 + ei * 0.9) % (Math.PI * 2)) / (Math.PI * 2);
            const epx = 740 + Math.sin(eAge * Math.PI * 3) * 5;
            const epy = deckY(660) - 68 - 8 - eAge * 42;
            const eo = eAge < 0.2 ? eAge / 0.2 : eAge > 0.7 ? 1 - (eAge - 0.7) / 0.3 : 1;
            const er = 4 + eAge * 14;
            return <circle key={ei} cx={epx} cy={epy} r={er} fill="#808878" opacity={eo * 0.42} />;
          })}

          {/* ── Hauler drum at stern ── */}
          <g transform={`translate(${SX + 14},${deckY(SX + 14) - 14})`}>
            {/* Post */}
            <rect x="-4" y="-28" width="8" height="28" rx="3" fill="#888878" />
            {/* Drum (spinning) */}
            <g transform={`rotate(${haulerRot})`}>
              <ellipse cx="0" cy="-30" rx="10" ry="10" fill="#707068" />
              <line x1="-10" y1="-30" x2="10" y2="-30" stroke="#505048" strokeWidth="2" />
              <line x1="0"   y1="-40" x2="0"  y2="-20" stroke="#505048" strokeWidth="2" />
            </g>
            {/* Warp going over drum and down */}
            <path
              d={`M0,-40 Q-8,${-40 + (WL - deckY(SX + 14) + 40) * 0.4} ${-(SX + 14 - (BX - SX) / 2 - SX) - 18},${WL - deckY(SX + 14) + 40 - 14}`}
              fill="none" stroke="#e8d8a0" strokeWidth="1.8" opacity="0.8"
            />
          </g>

          {/* ── Sternman (yellow oilskins) ── */}
          {(() => {
            const smX = SX + 42, smY = deckY(SX + 42);
            const armSwing = Math.sin(phase * 2.1) * 14;
            return (
              <g transform={`translate(${smX},${smY})`}>
                {/* Legs */}
                <rect x="-7"  y="-36" width="7" height="36" rx="3" fill="#d8b010" />
                <rect x="1"   y="-36" width="7" height="36" rx="3" fill="#d8b010" />
                {/* Boots */}
                <rect x="-9"  y="-4" width="10" height="7" rx="3" fill="#282820" />
                <rect x="0"   y="-4" width="10" height="7" rx="3" fill="#282820" />
                {/* Body */}
                <rect x="-12" y="-88" width="24" height="54" rx="6" fill="#e8c010" />
                {/* Arms working hauler */}
                <rect x="-20" y="-80" width="10" height="7" rx="3" fill="#e8c010"
                  transform={`rotate(${-30 + armSwing},-15,-77)`} />
                <rect x="10"  y="-80" width="10" height="7" rx="3" fill="#e8c010"
                  transform={`rotate(${30 - armSwing},15,-77)`} />
                {/* Head */}
                <circle cx="0" cy="-98" r="12" fill="#f8c890" />
                {/* Sou'wester hat */}
                <ellipse cx="0" cy="-106" rx="14" ry="4" fill="#d8a808" />
                <rect x="-10" y="-116" width="20" height="12" rx="6" fill="#d8a808" />
              </g>
            );
          })()}

          {/* American flag at stern */}
          {(() => {
            const fx = SX - 8, fy = deckY(SX) - 2;
            return (
              <g>
                <line x1={fx} y1={fy} x2={fx} y2={fy - 42} stroke="#d0c8a0" strokeWidth="1.5" />
                {/* Flag body */}
                <rect x={fx} y={fy - 42} width="28" height="18" fill="#c81818" />
                {/* White stripes */}
                {[1, 3, 5].map(si2 => (
                  <rect key={si2} x={fx} y={fy - 42 + si2 * 2.6} width="28" height="2"
                    fill="#f0f0f0" style={{ transform: `skewY(${flagWave * 0.4}deg)` }} />
                ))}
                {/* Blue canton */}
                <rect x={fx} y={fy - 42} width="12" height="8" fill="#1a2878" />
              </g>
            );
          })()}

        </g>

        {/* ── Trap being hauled (outside boat rock group — fixed in water) ── */}
        {(() => {
          const tx = SX - 5;
          const tW = 54, tH = 28;
          return (
            <g transform={`translate(${tx},${trapY + boatBob}) rotate(${trapRoll})`}>
              <rect x={-tW / 2} y={-tH / 2} width={tW} height={tH} rx="3"
                fill="none" stroke="#708858" strokeWidth="1.8" />
              {Array.from({ length: 6 }, (_, mi) => (
                <line key={mi}
                  x1={-tW / 2 + mi * (tW / 5)} y1={-tH / 2}
                  x2={-tW / 2 + mi * (tW / 5)} y2={tH / 2}
                  stroke="#708858" strokeWidth="0.8"
                />
              ))}
              {[0, 1, 2].map(mi => (
                <line key={mi}
                  x1={-tW / 2} y1={-tH / 2 + mi * (tH / 2)}
                  x2={tW / 2}  y2={-tH / 2 + mi * (tH / 2)}
                  stroke="#708858" strokeWidth="0.8"
                />
              ))}
              {/* Bait bag */}
              <ellipse cx="0" cy="0" rx="6" ry="5" fill="#f0d0a0" opacity="0.7" />
              {/* Seaweed drips */}
              <path d={`M-18,${tH / 2} Q-20,${tH / 2 + 8} -16,${tH / 2 + 14}`}
                fill="none" stroke="#488040" strokeWidth="1.5" />
              <path d={`M8,${tH / 2} Q10,${tH / 2 + 10} 6,${tH / 2 + 16}`}
                fill="none" stroke="#488040" strokeWidth="1.2" />
              {/* Water drips */}
              {[0, 1, 2].map(di => {
                const dAge = ((phase * 0.9 + di * 1.1) % (Math.PI * 2)) / (Math.PI * 2);
                const dY = tH / 2 + dAge * 20;
                const do2 = dAge < 0.15 ? dAge / 0.15 : 1 - dAge;
                return (
                  <circle key={di} cx={-12 + di * 14} cy={dY}
                    r="1.8" fill="#90d0f0" opacity={do2 * 0.7}
                  />
                );
              })}
            </g>
          );
        })()}

        {/* Warp line (connects hauler to trap, outside boat group) */}
        <path
          d={`M${SX + 14 + 0},${WL - 8 + boatBob} Q${SX + 5},${WL + 5} ${SX - 5},${trapY + boatBob - 14}`}
          fill="none" stroke="#e8d898" strokeWidth="1.8" opacity="0.75"
        />

        {/* ── Seagulls ── */}
        {GULLS.map((gu, gui) => {
          const flap = Math.sin(phase * 4.5 + gu.ph) * 5.5 * gu.sc;
          const glide = Math.sin(phase * 0.6 + gu.ph * 0.3) * 4;
          const gPath = `M${-16 * gu.sc},${flap} Q0,${-2 * gu.sc} ${16 * gu.sc},${flap}`;
          return (
            <path key={gui}
              d={gPath}
              transform={`translate(${gu.x + Math.sin(phase * 0.4 + gu.ph) * 8},${gu.y + glide})`}
              fill="none" stroke="#d8d8d0" strokeWidth={1.4 * gu.sc}
              strokeLinecap="round"
            />
          );
        })}

        {/* Caption */}
        <text x="640" y={H - 10} textAnchor="middle" fontSize="12" fill="#6898c0"
          fontFamily="Georgia,serif" opacity="0.65" letterSpacing="1">
          NEW ENGLAND LOBSTER FISHING · PRE-DAWN HAUL · MASSACHUSETTS COAST
        </text>
      </svg>
    </section>
  );
}
