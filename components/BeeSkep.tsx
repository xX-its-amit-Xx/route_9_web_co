"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const PHI = 137.508 * Math.PI / 180;

const SKEPS = [
  { x: 205 }, { x: 315 }, { x: 425 }, { x: 535 }, { x: 645 },
] as const;

const LANGS = [
  { x: 798 }, { x: 910 },
] as const;

const FENCE_XS: number[] = [];
for (let fx = 70; fx < 1230; fx += 90) FENCE_XS.push(fx);

const BLOSSOMS: [number, number][] = [
  [80,196],[92,178],[108,172],[124,184],[138,200],
  [64,214],[146,212],[72,226],[130,228],[100,204],
  [115,190],[87,210],[106,194],
];

const WFLS = [
  { x: 72,  y: GY-8,  c: "#f0c428", p: 5, s: 5 },
  { x: 108, y: GY-14, c: "#e0507a", p: 6, s: 4 },
  { x: 148, y: GY-5,  c: "#80c848", p: 5, s: 5 },
  { x: 182, y: GY-17, c: "#f0c428", p: 6, s: 6 },
  { x: 218, y: GY-4,  c: "#e0507a", p: 5, s: 4 },
  { x: 252, y: GY-11, c: "#c0a8e0", p: 6, s: 5 },
  { x: 288, y: GY-7,  c: "#f09038", p: 5, s: 4 },
  { x: 324, y: GY-15, c: "#f0c428", p: 5, s: 5 },
  { x: 360, y: GY-5,  c: "#e0507a", p: 6, s: 4 },
  { x: 396, y: GY-10, c: "#80c848", p: 5, s: 5 },
  { x: 432, y: GY-6,  c: "#f0c428", p: 6, s: 6 },
  { x: 468, y: GY-13, c: "#c0a8e0", p: 5, s: 4 },
  { x: 504, y: GY-4,  c: "#e0507a", p: 5, s: 5 },
  { x: 540, y: GY-9,  c: "#f0c428", p: 6, s: 5 },
  { x: 576, y: GY-14, c: "#f09038", p: 5, s: 4 },
  { x: 612, y: GY-5,  c: "#80c848", p: 6, s: 5 },
  { x: 648, y: GY-10, c: "#e0507a", p: 5, s: 6 },
  { x: 684, y: GY-3,  c: "#f0c428", p: 5, s: 4 },
  { x: 720, y: GY-13, c: "#c0a8e0", p: 6, s: 5 },
  { x: 756, y: GY-6,  c: "#e0507a", p: 5, s: 4 },
  { x: 792, y: GY-9,  c: "#f0c428", p: 5, s: 5 },
  { x: 828, y: GY-4,  c: "#80c848", p: 6, s: 4 },
  { x: 864, y: GY-15, c: "#f09038", p: 5, s: 5 },
  { x: 900, y: GY-7,  c: "#f0c428", p: 6, s: 6 },
  { x: 936, y: GY-3,  c: "#e0507a", p: 5, s: 4 },
  { x: 972, y: GY-11, c: "#c0a8e0", p: 5, s: 5 },
  { x: 1008, y: GY-6,  c: "#f0c428", p: 6, s: 4 },
  { x: 1044, y: GY-14, c: "#e0507a", p: 5, s: 5 },
  { x: 1080, y: GY-5,  c: "#80c848", p: 5, s: 6 },
  { x: 1116, y: GY-9,  c: "#f0c428", p: 6, s: 4 },
  { x: 1152, y: GY-4,  c: "#f09038", p: 5, s: 5 },
  { x: 1192, y: GY-12, c: "#e0507a", p: 6, s: 4 },
] as const;

const SPUFFS = [
  { ph: 0.00, sp: 1.20 }, { ph: 1.05, sp: 0.92 },
  { ph: 2.10, sp: 1.08 }, { ph: 3.15, sp: 0.98 },
] as const;

const HDROPS = [
  { xo: 0,  ph: 0.0, sp: 0.55 },
  { xo: 10, ph: 1.2, sp: 0.48 },
  { xo: -8, ph: 2.4, sp: 0.60 },
] as const;

interface BeeData { ocx: number; ocy: number; orx: number; ory: number; sp: number; ph: number; }
const BEES: BeeData[] = (() => {
  const arr: BeeData[] = [];
  for (let i = 0; i < 24; i++) {
    let ocx: number, ocy: number;
    if (i < 20) {
      const sk = SKEPS[i % 5];
      ocx = sk?.x ?? 420;
      ocy = GY - 82 - (i % 6) * 9;
    } else {
      const lg = LANGS[(i - 20) % 2];
      ocx = lg?.x ?? 854;
      ocy = GY - 95 - (i % 4) * 10;
    }
    const orx = 30 + (i % 5) * 9;
    const ory = orx * (0.30 + (i % 4) * 0.06);
    const sp = 0.85 + (i % 5) * 0.30;
    const ph = i * PHI;
    arr.push({ ocx, ocy, orx, ory, sp, ph });
  }
  return arr;
})();

const treeline = (() => {
  let d = `M0,304`;
  for (let tx = 0; tx <= 1280; tx += 28) {
    const th = 40 + Math.sin(tx * 0.029) * 20 + Math.sin(tx * 0.065) * 12;
    d += ` L${tx},${304 - th}`;
  }
  return d + ` L1280,312 L0,312 Z`;
})();

export function BeeSkep() {
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

  const keeperSway = Math.sin(phase * 0.82) * 2.2;
  const frameRock = Math.sin(phase * 1.18) * 4;
  const smokerJig = Math.sin(phase * 2.4) * 6;

  return (
    <section className="w-full overflow-hidden bg-[#d8eecc]">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ display: "block" }}
        aria-label="Shrewsbury Apiary — beekeeper tending straw skep hives, 24 bees orbiting in golden-angle spiral paths over a wildflower meadow"
      >
        <defs>
          <linearGradient id="bsk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5ab8e8" />
            <stop offset="65%"  stopColor="#b0d8f0" />
            <stop offset="100%" stopColor="#f4e8b8" />
          </linearGradient>
          <linearGradient id="bsk-meadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#88cc48" />
            <stop offset="100%" stopColor="#58a020" />
          </linearGradient>
          <linearGradient id="bsk-straw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#eecc6e" />
            <stop offset="100%" stopColor="#c89030" />
          </linearGradient>
          <linearGradient id="bsk-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4a050" />
            <stop offset="100%" stopColor="#a07828" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width={W} height="316" fill="url(#bsk-sky)" />

        {/* Sun */}
        <circle cx="968" cy="74" r="44" fill="#fce868" opacity="0.88" />
        <circle cx="968" cy="74" r="62" fill="#fce868" opacity="0.18" />
        <circle cx="968" cy="74" r="82" fill="#fce868" opacity="0.08" />
        {Array.from({ length: 10 }, (_, ri) => {
          const ang = ri * 36 * Math.PI / 180 + phase * 0.05;
          return (
            <line key={ri}
              x1={968 + Math.cos(ang) * 52} y1={74 + Math.sin(ang) * 52}
              x2={968 + Math.cos(ang) * 96} y2={74 + Math.sin(ang) * 96}
              stroke="#fce868" strokeWidth="2" opacity="0.22"
            />
          );
        })}

        {/* Treeline */}
        <path d={treeline} fill="#2e7020" opacity="0.60" />
        <path d={treeline} fill="#1e5010" opacity="0.28" transform="translate(20,10)" />

        {/* Meadow */}
        <rect x="0" y="304" width={W} height={H - 304} fill="url(#bsk-meadow)" />
        <rect x="0" y={GY + 8} width={W} height={H - GY - 8} fill="#489818" />

        {/* Apple tree (left, blooming) */}
        <rect x="90" y="244" width="16" height="86" rx="5" fill="#7a5428" />
        <line x1="98" y1="280" x2="55"  y2="228" stroke="#7a5428" strokeWidth="7" strokeLinecap="round" />
        <line x1="98" y1="264" x2="142" y2="216" stroke="#7a5428" strokeWidth="6" strokeLinecap="round" />
        <line x1="98" y1="254" x2="92"  y2="200" stroke="#7a5428" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="98"  cy="212" rx="70" ry="58" fill="#52a828" opacity="0.95" />
        <ellipse cx="58"  cy="228" rx="44" ry="38" fill="#489820" opacity="0.85" />
        <ellipse cx="142" cy="222" rx="46" ry="40" fill="#56aa28" opacity="0.85" />
        <ellipse cx="96"  cy="188" rx="54" ry="42" fill="#60b830" opacity="0.90" />
        {BLOSSOMS.map(([bx, by], bi) => (
          <g key={bi} transform={`translate(${bx},${by})`}>
            {[0,1,2,3,4].map(pi => {
              const ang = (pi / 5) * Math.PI * 2 - Math.PI / 2;
              return (
                <ellipse key={pi}
                  cx={Math.cos(ang) * 4.5} cy={Math.sin(ang) * 4.5}
                  rx="3.5" ry="1.8" fill="#fde2ea"
                  transform={`rotate(${(pi / 5) * 360})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="2" fill="#f8b090" />
          </g>
        ))}

        {/* Apiary sign */}
        <rect x="166" y="305" width="8" height="86" fill="#9a7040" />
        <rect x="155" y="302" width="136" height="30" rx="3" fill="#d0a860" stroke="#9a7040" strokeWidth="2" />
        <text x="223" y="320" textAnchor="middle" fontSize="10.5" fill="#5c3a10"
          fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.5">SHREWSBURY APIARY</text>
        <text x="223" y="330" textAnchor="middle" fontSize="9" fill="#5c3a10"
          fontFamily="Georgia,serif" letterSpacing="0.5">EST. 1898</text>

        {/* Split-rail fence */}
        {FENCE_XS.map((fx, fi) => (
          <g key={fi}>
            <rect x={fx - 5} y="336" width="10" height="54" rx="3" fill="#a87840" />
            {fi < FENCE_XS.length - 1 && (() => {
              const nx = FENCE_XS[fi + 1] ?? (fx + 90);
              return (
                <>
                  <line x1={fx + 5} y1="347" x2={nx - 5} y2="342"
                    stroke="#c89850" strokeWidth="5" strokeLinecap="round" />
                  <line x1={fx + 5} y1="364" x2={nx - 5} y2="359"
                    stroke="#c89850" strokeWidth="5" strokeLinecap="round" />
                </>
              );
            })()}
          </g>
        ))}

        {/* Wildflowers */}
        {WFLS.map((fl, fi) => (
          <g key={fi} transform={`translate(${fl.x},${fl.y})`}>
            <line x1="0" y1="0" x2="0" y2={fl.s * 2 + 6} stroke="#4a8020" strokeWidth="1.5" />
            {Array.from({ length: fl.p }, (_, pi) => {
              const ang = (pi / fl.p) * Math.PI * 2;
              return (
                <ellipse key={pi}
                  cx={Math.cos(ang) * fl.s} cy={Math.sin(ang) * fl.s}
                  rx={fl.s * 0.52} ry={fl.s * 0.24}
                  fill={fl.c}
                  transform={`rotate(${(pi / fl.p) * 360})`}
                  opacity="0.92"
                />
              );
            })}
            <circle cx="0" cy="0" r={fl.s * 0.36} fill={fl.p === 5 ? "#e8a018" : "#f0e040"} />
          </g>
        ))}

        {/* Straw skep hives */}
        {SKEPS.map((sk, si) => {
          const sx = sk.x;
          const baseY = GY - 12;
          const dH = 64, dW = 29;
          const platW = 64, platH = 10, legH = 26;
          return (
            <g key={si}>
              <rect x={sx - 20} y={baseY - platH - legH} width="6" height={legH} rx="2" fill="#885e28" />
              <rect x={sx + 14} y={baseY - platH - legH} width="6" height={legH} rx="2" fill="#885e28" />
              <rect x={sx - platW / 2} y={baseY - platH} width={platW} height={platH} rx="3" fill="url(#bsk-wood)" />
              <rect x={sx - platW / 2} y={baseY - platH} width={platW} height="3" rx="2" fill="#e0b858" opacity="0.5" />
              <path
                d={`M${sx - dW},${baseY - platH} Q${sx - dW * 1.15},${baseY - platH - dH * 0.55} ${sx},${baseY - platH - dH} Q${sx + dW * 1.15},${baseY - platH - dH * 0.55} ${sx + dW},${baseY - platH} Z`}
                fill="url(#bsk-straw)"
              />
              {Array.from({ length: 9 }, (_, li) => {
                const t = (li + 1) / 10;
                const yr = baseY - platH - dH * t;
                const xr = dW * (1 - t * 0.88);
                return (
                  <path key={li}
                    d={`M${sx - xr},${yr} Q${sx},${yr + 5 * (1 - t * 0.8)} ${sx + xr},${yr}`}
                    fill="none" stroke="#a87828" strokeWidth="1.2" opacity="0.52"
                  />
                );
              })}
              <ellipse cx={sx} cy={baseY - platH + 1} rx="7" ry="4.5" fill="#6a4818" />
              <ellipse cx={sx} cy={baseY - platH - dH + 3} rx="5" ry="4" fill="#d4a038" />
            </g>
          );
        })}

        {/* Langstroth box hives */}
        {LANGS.map((lg, li) => {
          const lx = lg.x;
          const baseY = GY - 10;
          const bCol = li === 0 ? "#d8b060" : "#70a8b0";
          const tCol = li === 0 ? "#c09840" : "#5888a0";
          return (
            <g key={li}>
              <rect x={lx - 38} y={baseY - 8} width="76" height="8" rx="2" fill="#906828" />
              <rect x={lx - 34} y={baseY - 82} width="68" height="74" rx="2" fill={bCol} stroke="#906828" strokeWidth="1.5" />
              {Array.from({ length: 9 }, (_, fi) => (
                <rect key={fi} x={lx - 28 + fi * 7} y={baseY - 82} width="4" height="5" rx="1" fill={tCol} />
              ))}
              <rect x={lx - 34} y={baseY - 122} width="68" height="40" rx="2"
                fill={li === 0 ? "#c8a048" : "#5898a8"} stroke="#906828" strokeWidth="1.5" />
              <rect x={lx - 36} y={baseY - 127} width="72" height="7" rx="1" fill="#a07828" />
              <rect x={lx - 38} y={baseY - 136} width="76" height="11" rx="2" fill="#807020" />
              <rect x={lx - 30} y={baseY - 8} width="60" height="5" rx="1" fill="#6a5018" />
            </g>
          );
        })}

        {/* Water trough */}
        <rect x="745" y={GY - 30} width="62" height="22" rx="5" fill="#8a6838" />
        <rect x="748" y={GY - 27} width="56" height="17" rx="3" fill="#70aacc" opacity="0.85" />
        <ellipse cx="776" cy={GY - 19} rx="20" ry="2.5" fill="#ffffff" opacity="0.32" />
        <rect x="749" y={GY - 8} width="7" height="10" rx="2" fill="#6a5028" />
        <rect x="800" y={GY - 8} width="7" height="10" rx="2" fill="#6a5028" />

        {/* Beekeeper */}
        {(() => {
          const bkX = 1068, bkY = GY;
          return (
            <g transform={`translate(${bkX},${bkY})`}>
              {/* Legs */}
              <rect x="-12" y="-42" width="10" height="42" rx="5" fill="#e8e8de"
                transform={`rotate(${keeperSway * 0.5},-7,-21)`} />
              <rect x="2" y="-42" width="10" height="42" rx="5" fill="#e8e8de"
                transform={`rotate(${-keeperSway * 0.5},7,-21)`} />
              {/* Boots */}
              <rect x="-14" y="-5" width="13" height="9" rx="4" fill="#382e1a" />
              <rect x="1"   y="-5" width="13" height="9" rx="4" fill="#382e1a" />
              {/* Body */}
              <rect x="-18" y="-108" width="36" height="68" rx="7" fill="#f2f2e8" />
              {/* Belt */}
              <rect x="-18" y="-46" width="36" height="7" fill="#c8a038" />
              {/* Left arm — smoker */}
              <rect x="-30" y="-98" width="14" height="9" rx="4" fill="#f2f2e8"
                transform={`rotate(${-20 + smokerJig * 0.4},-23,-93)`} />
              {/* Smoker tool */}
              <g transform={`translate(${-44 + smokerJig * 0.3},-98)`}>
                <rect x="-8" y="-16" width="16" height="22" rx="4" fill="#888878" />
                <rect x="-10" y="-3" width="20" height="9" rx="5" fill="#7a6028" />
                <rect x="-3" y="-24" width="6" height="10" rx="3" fill="#888878" />
              </g>
              {/* Right arm — frame */}
              <rect x="16" y="-98" width="14" height="9" rx="4" fill="#f2f2e8"
                transform={`rotate(20,23,-93)`} />
              {/* Honeycomb frame */}
              <g transform={`translate(50,-106) rotate(${frameRock})`}>
                <rect x="-22" y="-30" width="44" height="60" rx="3" fill="#c89038" />
                <rect x="-18" y="-26" width="36" height="52" rx="2" fill="#f0c040" />
                {Array.from({ length: 18 }, (_, hci) => {
                  const hcol = hci % 4;
                  const hrow = Math.floor(hci / 4);
                  const hcx = -12 + hcol * 9 + (hrow % 2) * 4.5;
                  const hcy = -20 + hrow * 10;
                  return (
                    <polygon key={hci}
                      points={Array.from({ length: 6 }, (_, a) => {
                        const ang = a * 60 * Math.PI / 180 - Math.PI / 2;
                        return `${hcx + Math.cos(ang) * 4},${hcy + Math.sin(ang) * 4}`;
                      }).join(" ")}
                      fill="#e8a020" stroke="#b87008" strokeWidth="0.8"
                    />
                  );
                })}
              </g>
              {/* Hat brim */}
              <ellipse cx="0" cy="-112" rx="26" ry="7" fill="#eaeade" />
              {/* Hat crown */}
              <rect x="-18" y="-148" width="36" height="38" rx="9" fill="#eaeade" />
              {/* Veil mesh horizontal */}
              {Array.from({ length: 9 }, (_, vi) => (
                <line key={`vh${vi}`}
                  x1="-18" y1={-148 + vi * 4.4}
                  x2="18"  y2={-148 + vi * 4.4}
                  stroke="#909080" strokeWidth="0.6" opacity="0.42"
                />
              ))}
              {/* Veil mesh vertical */}
              {Array.from({ length: 7 }, (_, vi) => (
                <line key={`vv${vi}`}
                  x1={-18 + vi * 6} y1="-148"
                  x2={-18 + vi * 6} y2="-110"
                  stroke="#909080" strokeWidth="0.6" opacity="0.42"
                />
              ))}
              {/* Hat top */}
              <ellipse cx="0" cy="-148" rx="18" ry="5" fill="#dadadc" />
            </g>
          );
        })()}

        {/* Smoker puffs */}
        {SPUFFS.map((sw, swi) => {
          const age = ((phase * sw.sp + sw.ph) % (Math.PI * 2)) / (Math.PI * 2);
          const smx = 1024 + Math.sin(age * Math.PI * 2.8) * 7;
          const smy = GY - 122 - age * 52;
          const sop = age < 0.22 ? age / 0.22 : age > 0.68 ? 1 - (age - 0.68) / 0.32 : 1;
          const smr = 4.5 + age * 14;
          return <circle key={swi} cx={smx} cy={smy} r={smr} fill="#ddd8ca" opacity={sop * 0.46} />;
        })}

        {/* Honey drops */}
        {HDROPS.map((hd, hdi) => {
          const age = ((phase * hd.sp + hd.ph) % (Math.PI * 2)) / (Math.PI * 2);
          const hdy = GY - 108 + age * 70;
          const hdop = age < 0.1 ? age / 0.1 : age > 0.75 ? 1 - (age - 0.75) / 0.25 : 1;
          return (
            <ellipse key={hdi} cx={1118 + hd.xo} cy={hdy}
              rx="3.5" ry="5.5" fill="#e09010" opacity={hdop * 0.82} />
          );
        })}

        {/* Bees — golden-angle orbit spread */}
        {BEES.map((bee, bi) => {
          const angle = phase * bee.sp + bee.ph;
          const bx = bee.ocx + Math.cos(angle) * bee.orx;
          const by = bee.ocy + Math.sin(angle) * bee.ory;
          const flip = Math.cos(angle) >= 0 ? 1 : -1;
          const wFlap = Math.sin(phase * 20 + bee.ph) * 3.2;
          return (
            <g key={bi} transform={`translate(${bx},${by}) scale(${flip},1)`}>
              <ellipse cx="-1" cy={-4.5 + wFlap} rx="7.5" ry="3.8" fill="#d8eef8" opacity="0.68" />
              <ellipse cx="3.5" cy={-3.5 + wFlap} rx="5.5" ry="2.8" fill="#d8eef8" opacity="0.68" />
              <ellipse cx="-2" cy="0" rx="5.5" ry="3.2" fill="#f2c018" />
              <line x1="-3.5" y1="-3.2" x2="-3.5" y2="3.2" stroke="#2a2008" strokeWidth="1.4" />
              <line x1="0"    y1="-3.2" x2="0"    y2="3.2" stroke="#2a2008" strokeWidth="1.2" />
              <circle cx="3" cy="-0.5" r="2.8" fill="#e0a010" />
              <circle cx="6" cy="-0.5" r="2.2" fill="#c88010" />
              <line x1="6" y1="-2.5" x2="9"  y2="-5.5" stroke="#2a2008" strokeWidth="0.9" />
              <line x1="6" y1="-2.5" x2="11" y2="-3.5" stroke="#2a2008" strokeWidth="0.9" />
              <circle cx="9"  cy="-5.5" r="1.1" fill="#2a2008" />
              <circle cx="11" cy="-3.5" r="1.1" fill="#2a2008" />
            </g>
          );
        })}

        {/* Caption */}
        <text x="640" y={H - 10} textAnchor="middle" fontSize="12" fill="#3a6018"
          fontFamily="Georgia,serif" opacity="0.65" letterSpacing="1">
          SHREWSBURY APIARY · EST. 1898 · ROUTE 9 CORRIDOR
        </text>
      </svg>
    </section>
  );
}
