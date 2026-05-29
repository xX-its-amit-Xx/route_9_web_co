"use client";

// WorkbenchTools ──────────────────────────────────────────────────────────────
//
// Six vintage hand tools labeled as web-development technologies:
// HTML=chisel, CSS=smoothing plane, JS=hammer, Next.js=speed square,
// TypeScript=caliper, Git=C-clamp. Tools spring up from their workbench
// slots on scroll reveal. Placed between About and MatchbookCollection.

import { useEffect, useRef, useState } from "react";
import React from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const BASY = 380; // workbench slot level (tool base y)

type ToolDef = {
  cx: number; id: string; tech: string;
  name: string; sub: string; accent: string; delay: number;
};

const TOOLS: ToolDef[] = [
  { cx:  115, id: "chisel",  tech: "HTML",    name: "The Chisel",   sub: "shapes structure",     accent: "#e25818", delay: 0.10 },
  { cx:  355, id: "plane",   tech: "CSS",     name: "The Plane",    sub: "smooths the surface",  accent: "#2272d8", delay: 0.22 },
  { cx:  595, id: "hammer",  tech: "JS",      name: "The Hammer",   sub: "drives action",        accent: "#d4b428", delay: 0.34 },
  { cx:  835, id: "square",  tech: "NEXT",    name: "The Square",   sub: "true alignment",       accent: "#e8e0cc", delay: 0.46 },
  { cx: 1075, id: "caliper", tech: "TS",      name: "The Caliper",  sub: "precision first",      accent: "#3a8adc", delay: 0.58 },
  { cx: 1315, id: "clamp",   tech: "GIT",     name: "The Clamp",    sub: "holds it together",    accent: "#c82020", delay: 0.70 },
];

// ── Tool art components ───────────────────────────────────────────────────────

function ArtChisel({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  return (
    <g>
      {/* Handle */}
      <rect x={cx-11} y={y0-76} width={22} height={76} rx={10} fill="#c88a48"/>
      <line x1={cx-4}  y1={y0-72} x2={cx-4}  y2={y0-8}  stroke="rgba(0,0,0,.10)" strokeWidth="1"/>
      <rect x={cx-13} y={y0-63} width={26} height={8}  rx={3} fill="#a07030"/>
      <rect x={cx-13} y={y0-43} width={26} height={8}  rx={3} fill="#a07030"/>
      <rect x={cx-13} y={y0-23} width={26} height={8}  rx={3} fill="#a07030"/>
      {/* Ferrule */}
      <rect x={cx-12} y={y0-88} width={24} height={14} rx={3} fill="#9a9080"/>
      <line x1={cx-10} y1={y0-83} x2={cx+10} y2={y0-83} stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
      {/* Blade body */}
      <rect x={cx-9} y={y0-192} width={18} height={104} fill="#cac4bc"/>
      <line x1={cx-3} y1={y0-188} x2={cx-3} y2={y0-130} stroke="rgba(255,255,255,.22)" strokeWidth="1.8"/>
      {/* Bevel */}
      <polygon points={`${cx-9},${y0-88} ${cx+9},${y0-88} ${cx+6},${y0-106} ${cx-6},${y0-106}`} fill="#b0aaa2"/>
      {/* Cutting edge */}
      <line x1={cx-9} y1={y0-88} x2={cx+9} y2={y0-88} stroke="#888070" strokeWidth="2.5"/>
    </g>
  );
}

function ArtPlane({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  return (
    <g>
      {/* Body */}
      <rect x={cx-28} y={y0-160} width={56} height={160} rx={4} fill="#5e5c50"/>
      <rect x={cx-28} y={y0-160} width={56} height={7}   rx={3} fill="rgba(255,255,255,.08)"/>
      {/* Blade slot */}
      <rect x={cx-8}  y={y0-125} width={16} height={80}  rx={2} fill="#38362e"/>
      {/* Blade iron peeking out top */}
      <rect x={cx-7}  y={y0-160} width={14} height={32}  rx={1} fill="#bab4aa"/>
      <line x1={cx-5} y1={y0-158} x2={cx-5} y2={y0-134} stroke="rgba(255,255,255,.22)" strokeWidth="1.5"/>
      {/* Frog seat */}
      <rect x={cx-10} y={y0-129} width={20} height={6}   rx={1} fill="#6a6858"/>
      {/* Front knob */}
      <ellipse cx={cx-20} cy={y0-138} rx={10} ry={15} fill="#9c8a5a"/>
      <ellipse cx={cx-20} cy={y0-146} rx={6}  ry={4}  fill="#b09868"/>
      {/* Rear tote arch */}
      <path d={`M ${cx+12},${y0-95} Q ${cx+34},${y0-82} ${cx+34},${y0-110} Q ${cx+34},${y0-138} ${cx+12},${y0-142}`}
        stroke="#9c8a5a" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Sole */}
      <rect x={cx-28} y={y0-12} width={56} height={12} rx={2} fill="#484640"/>
      {/* Body side highlight */}
      <rect x={cx-26} y={y0-152} width={7} height={138} rx={2} fill="rgba(255,255,255,.055)"/>
    </g>
  );
}

function ArtHammer({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  return (
    <g>
      {/* Handle */}
      <rect x={cx-9} y={y0-178} width={18} height={148} rx={8} fill="#c48c48"/>
      <line x1={cx-3} y1={y0-172} x2={cx-3} y2={y0-36}  stroke="rgba(0,0,0,.10)" strokeWidth="1"/>
      {/* End cap */}
      <ellipse cx={cx} cy={y0-30} rx={11} ry={6} fill="#b07a38"/>
      {/* Head */}
      <rect x={cx-42} y={y0-202} width={84} height={36} rx={5} fill="#8a8272"/>
      <rect x={cx-42} y={y0-202} width={84} height={8}  rx={4} fill="rgba(255,255,255,.10)"/>
      {/* Neck */}
      <rect x={cx-9}  y={y0-178} width={18} height={22} fill="#8a8272"/>
      {/* Poll face */}
      <rect x={cx+30} y={y0-202} width={12} height={36} rx={3} fill="#9a9280"/>
      {/* Claw (two tines) */}
      <path d={`M ${cx-30},${y0-202} Q ${cx-52},${y0-214} ${cx-56},${y0-234} Q ${cx-42},${y0-238} ${cx-36},${y0-224}`}
        fill="#7c7868"/>
      <path d={`M ${cx-30},${y0-188} Q ${cx-52},${y0-196} ${cx-56},${y0-216} Q ${cx-42},${y0-220} ${cx-36},${y0-208}`}
        fill="#726e5c"/>
      {/* Striking face */}
      <rect x={cx+40} y={y0-202} width={2} height={36} fill="rgba(255,255,255,.08)"/>
    </g>
  );
}

function ArtSquare({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  return (
    <g>
      {/* Triangle body (fill) */}
      <polygon points={`${cx-50},${y0} ${cx-50},${y0-110} ${cx+50},${y0}`} fill="#b0ac9c"/>
      {/* Inner bevel */}
      <polygon points={`${cx-45},${y0-4} ${cx-45},${y0-104} ${cx+42},${y0-4}`}
        fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
      {/* Bottom edge (fence) */}
      <rect x={cx-50} y={y0-7} width={100} height={7} rx={2} fill="#6a6858"/>
      {/* Left edge (body) */}
      <rect x={cx-57} y={y0-110} width={7} height={110} rx={2} fill="#6a6858"/>
      {/* Hypotenuse */}
      <line x1={cx+50} y1={y0} x2={cx-50} y2={y0-110}
        stroke="#8a8878" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Tick marks on bottom edge */}
      {[14, 28, 42, 56, 70, 84].map(dx => (
        <line key={dx}
          x1={cx-50+dx} y1={y0-7}
          x2={cx-50+dx} y2={y0-7-(dx % 28 === 0 ? 9 : 5)}
          stroke="#888270" strokeWidth="1"/>
      ))}
      {/* 90° corner square mark */}
      <path d={`M ${cx-50},${y0-14} L ${cx-36},${y0-14} L ${cx-36},${y0}`}
        stroke="rgba(255,255,255,.22)" strokeWidth="1" fill="none"/>
      {/* Surface highlight */}
      <polygon points={`${cx-48},${y0-2} ${cx-48},${y0-105} ${cx+43},${y0-2}`}
        fill="rgba(255,255,255,.04)"/>
    </g>
  );
}

function ArtCaliper({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  return (
    <g>
      {/* Main beam */}
      <rect x={cx-4} y={y0-182} width={8} height={192} rx={3} fill="#c8c2b8"/>
      <line x1={cx-2} y1={y0-180} x2={cx-2} y2={y0-6} stroke="rgba(255,255,255,.22)" strokeWidth="1.5"/>
      {/* Scale markings */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <line key={i}
          x1={cx+3}  y1={y0-168+i*17}
          x2={cx + (i % 5 === 0 ? 10 : 7)} y2={y0-168+i*17}
          stroke="#8a8878" strokeWidth={i % 5 === 0 ? 1.5 : 0.8}/>
      ))}
      {/* Fixed lower jaw */}
      <rect x={cx-20} y={y0-8}  width={40} height={18} rx={2} fill="#bcb6ac"/>
      <rect x={cx-20} y={y0+10} width={40} height={6}  rx={2} fill="#a8a29a"/>
      {/* Sliding upper jaw */}
      <rect x={cx-20} y={y0-112} width={40} height={18} rx={2} fill="#c8c2ba"/>
      <rect x={cx-20} y={y0-130} width={40} height={6}  rx={2} fill="#b4aea8"/>
      {/* Slider body */}
      <rect x={cx-14} y={y0-124} width={28} height={38} rx={2} fill="#aaaa9a"/>
      {/* Thumbscrew */}
      <rect x={cx+14} y={y0-110} width={14} height={15} rx={2} fill="#9a9888"/>
      <circle cx={cx+20} cy={y0-103} r={5.5} fill="#b2b09e"/>
      {/* Depth rod */}
      <rect x={cx-1} y={y0}  width={3}  height={28}  rx={1} fill="#b8b4ac"/>
    </g>
  );
}

function ArtClamp({ cx, y0 }: { cx: number; y0: number }): React.ReactElement {
  const FH = 124; // frame height
  const AW = 52;  // arm width
  return (
    <g>
      {/* Spine (back of C) */}
      <rect x={cx-30} y={y0-FH}  width={16} height={FH} rx={6} fill="#888068"/>
      <line x1={cx-24} y1={y0-FH+4} x2={cx-24} y2={y0-4} stroke="rgba(255,255,255,.10)" strokeWidth="2"/>
      {/* Top arm */}
      <rect x={cx-30} y={y0-FH}    width={AW} height={17} rx={5} fill="#9a9280"/>
      <rect x={cx-30} y={y0-FH}    width={AW} height={6}  rx={4} fill="rgba(255,255,255,.10)"/>
      {/* Bottom arm */}
      <rect x={cx-30} y={y0-17}    width={AW} height={17} rx={5} fill="#9a9280"/>
      {/* Screw shaft */}
      <rect x={cx+14} y={y0-FH+6}  width={12} height={FH-12} rx={5} fill="#7c7868"/>
      {/* Thread markings */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={i}
          x1={cx+14} y1={y0-FH+18+i*13}
          x2={cx+26} y2={y0-FH+18+i*13}
          stroke="#5a5848" strokeWidth="1.5"/>
      ))}
      {/* T-bar handle */}
      <rect x={cx+8} y={y0-FH+2} width={26} height={9} rx={3} fill="#b4ae96"/>
      {/* Swivel pad */}
      <ellipse cx={cx+20} cy={y0-8} rx={13} ry={8} fill="#a4a08a"/>
      <ellipse cx={cx+20} cy={y0-6} rx={8}  ry={4} fill="#b8b49e"/>
    </g>
  );
}

function getToolArt(id: string, cx: number, y0: number): React.ReactElement {
  if (id === "chisel")  return <ArtChisel  cx={cx} y0={y0}/>;
  if (id === "plane")   return <ArtPlane   cx={cx} y0={y0}/>;
  if (id === "hammer")  return <ArtHammer  cx={cx} y0={y0}/>;
  if (id === "square")  return <ArtSquare  cx={cx} y0={y0}/>;
  if (id === "caliper") return <ArtCaliper cx={cx} y0={y0}/>;
  return <ArtClamp cx={cx} y0={y0}/>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WorkbenchTools() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#0a0704 0%,#0e0904 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 484"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Craftsman's workbench with six labeled hand tools"
      >
        {/* ── SECTION LABEL ── */}
        <text x="720" y="26" textAnchor="middle"
          fill="rgba(212,104,42,.38)" fontSize="8.5"
          fontFamily="monospace" letterSpacing="3"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease .04s" }}>
          ROUTE 9 WEB CO. · THE CRAFTSMAN&apos;S TOOLKIT
        </text>
        <text x="720" y="44" textAnchor="middle"
          fill="rgba(243,233,213,.18)" fontSize="11"
          fontFamily="Georgia,serif" fontStyle="italic"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease .08s" }}>
          Every build crafted by hand. Every tool chosen with purpose.
        </text>

        {/* ── WORKBENCH SURFACE ── */}
        {/* Bench top wood planks */}
        {[0, 120, 240, 360, 480].map(py => (
          <rect key={py} x={0} y={BASY + py / 3} width={1440} height={40} rx={0}
            fill={py === 0 ? "#2e2010" : "#281c0e"} opacity={1 - py * 0.0006}/>
        ))}
        <rect x={0} y={BASY} width={1440} height={104} fill="#2a1c0e"/>
        {/* Wood grain lines */}
        {[8, 22, 38, 54, 68, 82, 96].map(gy => (
          <line key={gy} x1={0} y1={BASY + gy} x2={1440} y2={BASY + gy}
            stroke="rgba(80,40,8,.12)" strokeWidth="1"/>
        ))}
        {/* Bench top edge */}
        <rect x={0} y={BASY} width={1440} height={6} fill="#3a2a12"/>
        {/* Bench shadow below tools */}
        <rect x={0} y={BASY} width={1440} height={18}
          fill="rgba(0,0,0,.35)"/>

        {/* ── TOOL SLOTS ── */}
        {TOOLS.map(t => (
          <g key={t.cx}>
            <rect x={t.cx-4} y={BASY} width={8} height={32} rx={4} fill="rgba(0,0,0,.50)"/>
          </g>
        ))}

        {/* ── TOOLS ── */}
        {TOOLS.map(t => (
          <g key={t.cx} style={{
            transform: active ? "translateY(0px)" : "translateY(52px)",
            opacity: active ? 1 : 0,
            transition: active
              ? `transform 0.72s cubic-bezier(0.34,1.4,0.64,1) ${t.delay}s, opacity 0.38s ease ${t.delay}s`
              : "none",
          }}>
            {getToolArt(t.id, t.cx, BASY)}
          </g>
        ))}

        {/* ── LABELS ── */}
        {TOOLS.map(t => (
          <g key={t.cx} style={{ opacity: active ? 1 : 0, transition: `opacity .4s ease ${t.delay + 0.28}s` }}>
            {/* Accent underline */}
            <rect x={t.cx-22} y={BASY+22} width={44} height={2} rx={1} fill={t.accent} opacity={0.65}/>
            {/* Tech name */}
            <text x={t.cx} y={BASY+38} textAnchor="middle"
              fill={t.accent} fontSize="13"
              fontFamily="monospace" fontWeight="bold" letterSpacing="1.2">
              {t.tech}
            </text>
            {/* Tool name */}
            <text x={t.cx} y={BASY+54} textAnchor="middle"
              fill="rgba(243,228,198,.65)" fontSize="8.5"
              fontFamily="Georgia,serif" fontStyle="italic">
              {t.name}
            </text>
            {/* Subtitle */}
            <text x={t.cx} y={BASY+67} textAnchor="middle"
              fill="rgba(243,220,180,.30)" fontSize="7"
              fontFamily="monospace" letterSpacing="0.4">
              {t.sub}
            </text>
          </g>
        ))}

        {/* ── CAPTION ── */}
        <text x="720" y="472" textAnchor="middle"
          fill="rgba(243,233,213,.13)" fontSize="9"
          fontFamily="monospace" letterSpacing="1.8"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease 1.0s" }}>
          BUILT IN SHREWSBURY · SHIPPED TO THE WORLD
        </text>
      </svg>
    </div>
  );
}
