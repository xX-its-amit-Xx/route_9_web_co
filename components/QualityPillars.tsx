"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { TextScramble } from "./TextScramble";
import { VinylRecord } from "./VinylRecord";
import { PILLARS } from "@/lib/content";

// ── Custom artisan SVG icons ──────────────────────────────────────────────────
// Rendered as dimensional mini-objects: enamel/brass gradient fills, one shared
// lighting model (key light upper-left), specular highlights, occlusion edges
// and soft contact shadows so the six read as a matched cast-metal set.

function IconMobile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <linearGradient id="qpi-mob-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A3018" />
          <stop offset="45%" stopColor="#241609" />
          <stop offset="100%" stopColor="#120A04" />
        </linearGradient>
        <linearGradient id="qpi-mob-scr" x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0%" stopColor="#F49A52" />
          <stop offset="50%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#8F3F12" />
        </linearGradient>
      </defs>
      {/* Soft contact shadow */}
      <ellipse cx="12" cy="22.6" rx="6.2" ry="0.9" fill="rgba(0,0,0,0.3)" />
      {/* Chassis */}
      <rect x="5.5" y="1.5" width="13" height="21" rx="2.6" fill="url(#qpi-mob-body)" />
      {/* Rim light (upper-left) + occlusion edge (lower-right) */}
      <rect x="5.8" y="1.8" width="12.4" height="20.4" rx="2.3" fill="none" stroke="rgba(255,225,170,0.32)" strokeWidth="0.5" />
      <path d="M6.1 5V18.5" stroke="rgba(255,235,190,0.3)" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M18 5V19" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" strokeLinecap="round" />
      {/* Speaker slot — recessed */}
      <rect x="10.2" y="2.9" width="3.6" height="0.9" rx="0.45" fill="rgba(0,0,0,0.6)" />
      <path d="M10.4 3.95H13.6" stroke="rgba(255,225,170,0.18)" strokeWidth="0.3" />
      {/* Screen — warm enamel glow */}
      <rect x="7.2" y="5.2" width="9.6" height="12.6" rx="0.9" fill="url(#qpi-mob-scr)" />
      <rect x="7.2" y="5.2" width="9.6" height="12.6" rx="0.9" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
      {/* Screen content — cream storefront */}
      <path d="M8.8 9.4L12 7.6L15.2 9.4" stroke="#FBF2DC" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="9.4" y="11" width="5.2" height="0.9" rx="0.45" fill="rgba(251,242,220,0.85)" />
      <rect x="9.4" y="12.9" width="3.6" height="0.9" rx="0.45" fill="rgba(251,242,220,0.55)" />
      <rect x="9.4" y="15" width="5.2" height="1.4" rx="0.7" fill="#1C1209" opacity="0.8" />
      {/* Glass glare sweep */}
      <path d="M7.6 5.6L11.4 5.6L8.6 17.4L7.6 17.4Z" fill="rgba(255,246,226,0.22)" />
      {/* Home button */}
      <circle cx="12" cy="20.1" r="1" fill="#0B0603" stroke="rgba(255,225,170,0.35)" strokeWidth="0.4" />
    </svg>
  );
}

function IconSpeed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <linearGradient id="qpi-spd-bolt" x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFDF9E" />
          <stop offset="32%" stopColor="#F0904A" />
          <stop offset="65%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#8F3F12" />
        </linearGradient>
      </defs>
      {/* Soft contact shadow */}
      <ellipse cx="11.5" cy="22.6" rx="4.6" ry="0.9" fill="rgba(0,0,0,0.28)" />
      {/* Cast shadow bolt (offset toward lower-right) */}
      <path d="M13.7 2.9L4.7 14.9h7l-1 8 10-12h-7z" fill="rgba(0,0,0,0.3)" />
      {/* Enamel bolt */}
      <path d="M13 2L4 14h7l-1 8 10-12h-7z" fill="url(#qpi-spd-bolt)" stroke="rgba(70,26,4,0.5)" strokeWidth="0.5" strokeLinejoin="round" />
      {/* Bevel — lit upper-left edge, shaded lower-right edge */}
      <path d="M12.6 2.9L4.9 13.2" stroke="rgba(255,244,214,0.8)" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M19.2 10.6L11 20.4" stroke="rgba(50,18,2,0.45)" strokeWidth="0.6" strokeLinecap="round" />
      {/* Specular core glint */}
      <path d="M11.9 4.6L7.2 10.9" stroke="rgba(255,250,232,0.55)" strokeWidth="1.1" strokeLinecap="round" />
      {/* Occlusion in the notch */}
      <path d="M11 14h-4" stroke="rgba(0,0,0,0.3)" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

function IconConvert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <linearGradient id="qpi-cnv-pan" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#4A3018" />
          <stop offset="100%" stopColor="#160D05" />
        </linearGradient>
        <linearGradient id="qpi-cnv-arr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFDF9E" />
          <stop offset="45%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#7E3810" />
        </linearGradient>
      </defs>
      {/* Soft contact shadow */}
      <ellipse cx="12" cy="22.4" rx="7.2" ry="0.9" fill="rgba(0,0,0,0.26)" />
      {/* Doorway bracket — dark ember metal */}
      <path d="M10 3H5.6C4.2 3 3 4.2 3 5.6V18.4C3 19.8 4.2 21 5.6 21H10" stroke="url(#qpi-cnv-pan)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* Bracket rim light */}
      <path d="M9.6 3.9H5.8C4.75 3.9 3.9 4.75 3.9 5.8V12" stroke="rgba(255,235,190,0.35)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      {/* Arrow cast shadow */}
      <path d="M7.4 11.5H14.6V8.9L21.4 12.6L14.6 16.3V13.7H7.4Z" fill="rgba(0,0,0,0.3)" />
      {/* Brass arrow */}
      <path d="M7 10.9H14.2V8.2L21 12L14.2 15.8V13.1H7Z" fill="url(#qpi-cnv-arr)" stroke="rgba(70,26,4,0.5)" strokeWidth="0.5" strokeLinejoin="round" />
      {/* Top-facet highlights */}
      <path d="M7.5 11.35H14.1" stroke="rgba(255,246,222,0.75)" strokeWidth="0.55" strokeLinecap="round" />
      <path d="M14.8 8.9L19.9 11.75" stroke="rgba(255,246,222,0.6)" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <radialGradient id="qpi-pin-body" cx="35%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#FFC488" />
          <stop offset="45%" stopColor="#E07838" />
          <stop offset="78%" stopColor="#B24E16" />
          <stop offset="100%" stopColor="#6E2E0C" />
        </radialGradient>
        <radialGradient id="qpi-pin-hole" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#3A2415" />
          <stop offset="100%" stopColor="#0B0603" />
        </radialGradient>
      </defs>
      {/* Contact shadow at the tip */}
      <ellipse cx="12.4" cy="22.5" rx="3.2" ry="0.8" fill="rgba(0,0,0,0.32)" />
      {/* Signal arcs — stay currentColor so the chip hover still tints them */}
      <path d="M20.5 4C21.8 5.8 22.5 8 22.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      <path d="M3.5 4C2.2 5.8 1.5 8 1.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      {/* Glossy enamel pin body */}
      <path d="M12 2C8.686 2 6 4.686 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.686 15.314 2 12 2Z" fill="url(#qpi-pin-body)" stroke="rgba(70,26,4,0.45)" strokeWidth="0.5" />
      {/* Rim light along the lit shoulder */}
      <path d="M7.1 9.6C6.6 6.4 8 3.6 11 3" stroke="rgba(255,242,214,0.55)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
      {/* Occlusion toward the tip */}
      <path d="M10 15.5C10.8 17.4 11.6 19 12 19.8" stroke="rgba(40,14,0,0.35)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Recessed hole with inset shading */}
      <circle cx="12" cy="8" r="2.5" fill="url(#qpi-pin-hole)" />
      <path d="M9.8 7.4A2.5 2.5 0 0 1 13 5.7" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <path d="M10.5 10A2.5 2.5 0 0 0 14.4 8.5" stroke="rgba(255,235,200,0.45)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      {/* Specular highlight */}
      <ellipse cx="9.7" cy="4.9" rx="1" ry="1.7" fill="rgba(255,248,228,0.55)" transform="rotate(-27 9.7 4.9)" />
    </svg>
  );
}

function IconAccessible() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <radialGradient id="qpi-acc-h1" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFC488" />
          <stop offset="55%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#8F3F12" />
        </radialGradient>
        <linearGradient id="qpi-acc-b1" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#F0904A" />
          <stop offset="100%" stopColor="#A84818" />
        </linearGradient>
        <radialGradient id="qpi-acc-h2" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#9B7040" />
          <stop offset="55%" stopColor="#5A3A1E" />
          <stop offset="100%" stopColor="#241206" />
        </radialGradient>
        <linearGradient id="qpi-acc-b2" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#7E5630" />
          <stop offset="100%" stopColor="#33200F" />
        </linearGradient>
      </defs>
      {/* Soft contact shadows */}
      <ellipse cx="8" cy="15.6" rx="4.6" ry="0.8" fill="rgba(0,0,0,0.26)" />
      <ellipse cx="17" cy="15.4" rx="3.6" ry="0.7" fill="rgba(0,0,0,0.2)" />
      {/* Primary figure — cast-shadow pass */}
      <g stroke="rgba(0,0,0,0.28)" strokeLinecap="round" transform="translate(0.45 0.5)">
        <path d="M8 8V14" strokeWidth="1.9" />
        <path d="M5.5 10.5L4 14.5" strokeWidth="1.6" />
        <path d="M10.5 10.5L12 14.5" strokeWidth="1.6" />
      </g>
      {/* Primary figure — enamel body */}
      <g stroke="url(#qpi-acc-b1)" strokeLinecap="round">
        <path d="M8 8V14" strokeWidth="1.9" />
        <path d="M5.5 10.5L4 14.5" strokeWidth="1.6" />
        <path d="M10.5 10.5L12 14.5" strokeWidth="1.6" />
      </g>
      {/* Rim light on the lit side */}
      <g stroke="rgba(255,242,214,0.55)" strokeLinecap="round">
        <path d="M7.55 8.4V13.4" strokeWidth="0.45" />
        <path d="M5.15 10.9L4 13.9" strokeWidth="0.4" />
      </g>
      {/* Primary head — glossy sphere */}
      <circle cx="8" cy="4" r="2.1" fill="url(#qpi-acc-h1)" stroke="rgba(70,26,4,0.4)" strokeWidth="0.4" />
      <ellipse cx="7.3" cy="3.2" rx="0.7" ry="0.5" fill="rgba(255,248,228,0.7)" transform="rotate(-25 7.3 3.2)" />
      {/* Secondary figure — dark bronze */}
      <g stroke="rgba(0,0,0,0.25)" strokeLinecap="round" transform="translate(0.4 0.45)">
        <path d="M17 9V13.5" strokeWidth="1.5" />
        <path d="M15 11L13.5 14.5" strokeWidth="1.2" />
        <path d="M19 11L20.5 14.5" strokeWidth="1.2" />
      </g>
      <g stroke="url(#qpi-acc-b2)" strokeLinecap="round">
        <path d="M17 9V13.5" strokeWidth="1.5" />
        <path d="M15 11L13.5 14.5" strokeWidth="1.2" />
        <path d="M19 11L20.5 14.5" strokeWidth="1.2" />
      </g>
      <path d="M16.6 9.4V12.9" stroke="rgba(255,235,195,0.4)" strokeWidth="0.4" strokeLinecap="round" />
      <circle cx="17" cy="5.5" r="1.6" fill="url(#qpi-acc-h2)" stroke="rgba(20,10,2,0.5)" strokeWidth="0.4" />
      <ellipse cx="16.5" cy="4.9" rx="0.5" ry="0.38" fill="rgba(255,240,210,0.55)" transform="rotate(-25 16.5 4.9)" />
    </svg>
  );
}

function IconMaintain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <defs>
        <linearGradient id="qpi-mnt-card" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FDF6E3" />
          <stop offset="100%" stopColor="#E2CFA6" />
        </linearGradient>
        <linearGradient id="qpi-mnt-hdr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0904A" />
          <stop offset="100%" stopColor="#B24E16" />
        </linearGradient>
        <linearGradient id="qpi-mnt-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFE0A0" />
          <stop offset="55%" stopColor="#B87A2E" />
          <stop offset="100%" stopColor="#6E4414" />
        </linearGradient>
      </defs>
      {/* Soft contact shadow */}
      <ellipse cx="12" cy="21.9" rx="8.4" ry="0.9" fill="rgba(0,0,0,0.28)" />
      {/* Card body — cream paper */}
      <rect x="3" y="5" width="18" height="16" rx="2" fill="url(#qpi-mnt-card)" stroke="rgba(70,36,12,0.45)" strokeWidth="0.5" />
      {/* Enamel header band */}
      <path d="M3 7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V10H3Z" fill="url(#qpi-mnt-hdr)" />
      <path d="M3.7 9.9H20.3" stroke="rgba(60,22,4,0.35)" strokeWidth="0.5" />
      <rect x="3.7" y="5.5" width="16.6" height="1" rx="0.5" fill="rgba(255,240,205,0.4)" />
      {/* Brass binder rings */}
      <rect x="7.1" y="2.7" width="1.7" height="4.4" rx="0.85" fill="url(#qpi-mnt-ring)" stroke="rgba(40,20,4,0.4)" strokeWidth="0.35" />
      <rect x="15.2" y="2.7" width="1.7" height="4.4" rx="0.85" fill="url(#qpi-mnt-ring)" stroke="rgba(40,20,4,0.4)" strokeWidth="0.35" />
      <path d="M7.5 3.2V6.4M15.6 3.2V6.4" stroke="rgba(255,244,214,0.6)" strokeWidth="0.35" strokeLinecap="round" />
      {/* Header drop occlusion onto the paper */}
      <path d="M3.6 10.5H20.4" stroke="rgba(70,36,12,0.14)" strokeWidth="0.8" />
      {/* Check — embossed enamel */}
      <path d="M8.4 15L11 17.6L15.7 12.9" stroke="rgba(70,36,12,0.22)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" transform="translate(0.35 0.45)" />
      <path d="M8.4 15L11 17.6L15.7 12.9" stroke="url(#qpi-mnt-hdr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.7 14.8L11 17.1L15.4 12.7" stroke="rgba(255,244,214,0.45)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Card edge rim light */}
      <path d="M3.5 19.5V7" stroke="rgba(255,250,235,0.5)" strokeWidth="0.4" strokeLinecap="round" />
    </svg>
  );
}

// ══════════════════════════════════════════════
// DEMO INFRASTRUCTURE COMPONENTS
// ══════════════════════════════════════════════

// Compositor-friendly replacements for demo keyframes that animated layout
// (width/top/left) or paint (box-shadow) properties on an infinite loop.
// Everything below is transform/opacity only.
const DEMO_PERF_CSS = `
@keyframes qp-bar-slow {
  0%        { transform: scaleX(0); }
  90%, 100% { transform: scaleX(0.62); }
}
@keyframes qp-bar-fast {
  0%        { transform: scaleX(0); }
  12%, 100% { transform: scaleX(1); }
}
@keyframes qp-cursor-wander {
  0%   { transform: translate(18%, 12%); }
  20%  { transform: translate(62%, 52%); }
  40%  { transform: translate(42%, 22%); }
  60%  { transform: translate(12%, 62%); }
  80%  { transform: translate(58%, 38%); }
  100% { transform: translate(18%, 12%); }
}
@keyframes qp-cursor-direct {
  0%       { transform: translate(10%, 82%); opacity: 0; }
  6%       { transform: translate(10%, 82%); opacity: 1; }
  55%, 76% { transform: translate(47%, 51%); opacity: 1; }
  88%      { transform: translate(47%, 51%); opacity: 0; }
  100%     { transform: translate(10%, 82%); opacity: 0; }
}
@keyframes qp-cursor-click {
  0%, 55%   { transform: scale(1); }
  62%       { transform: scale(0.6); }
  69%       { transform: scale(1.2); }
  76%, 100% { transform: scale(1); }
}
@keyframes qp-btn-click {
  0%, 54%   { transform: scale(1); }
  60%       { transform: scale(0.96); }
  67%       { transform: scale(1.04); }
  78%, 100% { transform: scale(1); }
}
@keyframes qp-focus-ring1 { 0%, 22% { opacity: 1; } 30%, 100% { opacity: 0; } }
@keyframes qp-focus-ring2 { 0%, 30% { opacity: 0; } 35%, 55% { opacity: 1; } 63%, 100% { opacity: 0; } }
@keyframes qp-focus-ring3 { 0%, 63% { opacity: 0; } 68%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }
`;

// rAF-throttled pillar-spotlight updater — one layout read + two style writes
// per frame per card (max), instead of on every mousemove event. Only runs
// while the pointer is over a card (React only attaches it there).
const spotFrames = new WeakMap<HTMLElement, number>();
function handleSpotMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  if (spotFrames.has(el)) return;
  const { clientX, clientY } = e;
  spotFrames.set(
    el,
    requestAnimationFrame(() => {
      spotFrames.delete(el);
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    })
  );
}

function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{
        background: "linear-gradient(175deg, #16100A 0%, #0D0905 55%, #100D08 100%)",
      }}
    >
      {/* Subtle dot matrix (premium display feel, not scanlines) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          zIndex: 0,
        }}
      />
      {/* Top gloss — simulates a real screen reflection */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.09) 75%, transparent 100%)",
          zIndex: 2,
        }}
      />
      {/* Side vignettes for depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, transparent 7%, transparent 93%, rgba(0,0,0,0.22) 100%)",
          zIndex: 1,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}

function DemoChrome({ url = "yoursite.com" }: { url?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 flex-shrink-0 relative overflow-hidden"
      style={{
        height: "28px",
        background: "linear-gradient(180deg, #2C1F14 0%, #1E1510 100%)",
        borderBottom: "1px solid rgba(0,0,0,0.55)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top gloss band */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)",
        }}
      />
      {/* macOS traffic lights — 3D sphere effect */}
      <div className="flex gap-1.5 flex-shrink-0 relative">
        {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
          <div
            key={i}
            className="w-[9px] h-[9px] rounded-full"
            style={{
              background: `radial-gradient(circle at 38% 32%, ${
                i === 0 ? "#FF9995" : i === 1 ? "#FFD875" : "#6FE88A"
              } 0%, ${color} 60%)`,
              boxShadow: `0 0 5px ${color}88, 0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)`,
            }}
          />
        ))}
      </div>
      {/* URL bar */}
      <div
        className="flex-1 flex items-center justify-center rounded-md overflow-hidden"
        style={{
          height: "16px",
          background: "rgba(0,0,0,0.32)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), inset 0 -0.5px 0 rgba(255,255,255,0.03)",
        }}
      >
        <span
          className="truncate px-2"
          style={{
            fontSize: "6.5px",
            color: "rgba(255,255,255,0.26)",
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}
        >
          {url}
        </span>
      </div>
    </div>
  );
}

function PanelBadge({ bad }: { bad?: boolean }) {
  return (
    <div
      className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-[3px]"
      style={{
        background: bad
          ? "linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(220,38,38,0.12) 100%)"
          : "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.12) 100%)",
        border: `1px solid ${bad ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.45)"}`,
        color: bad ? "#f87171" : "#34d399",
        fontSize: "6px",
        fontWeight: 700,
        letterSpacing: "0.07em",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: bad
          ? "0 2px 10px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,100,100,0.12)"
          : "0 2px 10px rgba(16,185,129,0.3), inset 0 1px 0 rgba(100,255,180,0.15)",
      }}
    >
      <span>{bad ? "✗" : "✓"}</span>
      <span>{bad ? "Before" : "After"}</span>
    </div>
  );
}

function VSDivider() {
  return (
    <div
      className="flex-shrink-0 relative flex items-center justify-center"
      style={{ width: "22px" }}
    >
      {/* Gradient divider line */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2"
        style={{
          width: "1px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(212,104,42,0.25) 25%, rgba(212,104,42,0.3) 50%, rgba(212,104,42,0.25) 75%, transparent 100%)",
        }}
      />
      {/* VS pill — more prominent */}
      <div
        className="relative flex items-center justify-center rounded-full z-10"
        style={{
          width: "20px",
          height: "20px",
          background: "linear-gradient(145deg, #E87C3E 0%, #D4682A 50%, #B85520 100%)",
          boxShadow: [
            "0 0 12px rgba(212,104,42,0.5)",
            "0 3px 10px rgba(0,0,0,0.6)",
            "inset 0 1.5px 0 rgba(255,220,140,0.3)",
            "inset 0 -1px 0 rgba(0,0,0,0.25)",
          ].join(", "),
          fontSize: "5px",
          color: "rgba(255,255,255,0.95)",
          fontWeight: 800,
          letterSpacing: "0.03em",
        }}
      >
        VS
      </div>
    </div>
  );
}

// Cursor SVG for ConvertDemo
function Cursor({ dark }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={{ width: "100%", height: "100%", filter: dark ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" : "none" }}>
      <path
        d="M3 2L3 11.5L5.8 9L7.8 14L9.2 13.4L7.2 8.5L11 8.5Z"
        fill={dark ? "#1C1209" : "#374151"}
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ══════════════════════════════════════════════
// DEMO 1 — MOBILE FIRST
// ══════════════════════════════════════════════
function MobileFirstDemo() {
  return (
    <DemoShell>
      <DemoChrome url="example-shop.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — desktop site crammed onto mobile */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F7F5F3" }}>
          <PanelBadge bad />
          <div className="absolute inset-0" style={{ paddingTop: "6px" }}>
            {/* Overflowing nav with horizontal wobble */}
            <div
              style={{
                width: "175%",
                height: "18px",
                background: "#1C1209",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                padding: "0 6px",
                animation: "demo-scroll-bad 5s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#FEBC2E", fontWeight: 700, whiteSpace: "nowrap", marginRight: "2px" }}>Shop</span>
              {["Home", "About", "Gallery", "Services", "Menu", "Pricing", "Contact"].map((t) => (
                <span key={t} style={{ fontSize: "4.5px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{t}</span>
              ))}
            </div>
            {/* Body overflowing */}
            <div
              style={{
                width: "160%",
                padding: "5px 6px 0",
                animation: "demo-scroll-bad 5s ease-in-out infinite 0.08s",
              }}
            >
              <div style={{ height: "6px", background: "#D1D5DB", borderRadius: "2px", marginBottom: "3px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "90%", marginBottom: "2px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "75%" }} />
            </div>
            {/* Horizontal scrollbar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "5px", background: "#E5E7EB" }}
            >
              <div style={{ height: "100%", width: "30%", marginLeft: "42%", background: "#9CA3AF", borderRadius: "2px" }} />
            </div>
          </div>
          {/* Red tint overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — mobile-first */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FBF8F4 0%, #F6F0E8 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col">
            {/* Compact hero image strip */}
            <div
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                height: "36px",
                background: "linear-gradient(135deg, #1C1209 0%, #2A1810 60%, #3A2215 100%)",
              }}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(212,104,42,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
              <div
                className="flex items-center justify-between"
                style={{ padding: "4px 6px 0", position: "relative", zIndex: 1 }}
              >
                <span style={{ fontSize: "7px", color: "#FEBC2E", fontWeight: 800 }}>✂ Fresh Cuts</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5px" }}>
                  <div style={{ width: "11px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                  <div style={{ width: "8px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                  <div style={{ width: "6px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                </div>
              </div>
              <div style={{ padding: "2px 6px 0", position: "relative", zIndex: 1, fontSize: "5px", color: "rgba(243,233,213,0.45)" }}>Shrewsbury, MA · Walk-ins welcome</div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1" style={{ padding: "5px 7px 6px" }}>
              <div style={{ height: "4px", background: "#D1D5DB", borderRadius: "2px", width: "100%", marginBottom: "2px" }} className="flex-shrink-0" />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "72%" }} className="flex-shrink-0" />
              {/* Big CTA */}
              <div
                className="mt-auto flex items-center justify-center flex-shrink-0"
                style={{
                  height: "22px",
                  background: "linear-gradient(135deg, #E07838 0%, #D4682A 45%, #C05A20 100%)",
                  borderRadius: "5px",
                  fontSize: "7px",
                  color: "white",
                  fontWeight: 700,
                  /* was: demo-btn-pulse — infinite box-shadow paint loop; static now */
                  boxShadow: "0 3px 10px rgba(212,104,42,0.5), inset 0 1.5px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.12)",
                }}
              >
                📅 Book Now →
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.02)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 2 — SPEED
// ══════════════════════════════════════════════
function SpeedDemo() {
  return (
    <DemoShell>
      <DemoChrome url="yoursite.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — slow */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px" }}>
            {/* URL bar with spinner */}
            <div
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", padding: "0 6px", marginBottom: "4px", border: "1px solid #E5E7EB" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  border: "1.5px solid #D1D5DB",
                  borderTopColor: "#9CA3AF",
                  flexShrink: 0,
                  animation: "demo-spinner 0.8s linear infinite",
                }}
              />
              <div style={{ flex: 1, height: "4px", background: "#E5E7EB", borderRadius: "2px" }} />
            </div>
            {/* Progress bar — slow */}
            <div
              className="flex-shrink-0"
              style={{ height: "2px", background: "#F3F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "5px" }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #f87171, #ef4444)",
                  borderRadius: "9999px",
                  width: "100%",
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  animation: "qp-bar-slow 5s ease-out infinite",
                }}
              />
            </div>
            {/* Skeleton content */}
            {[
              { w: "100%", h: 11 },
              { w: "72%", h: 6 },
              { w: "88%", h: 6 },
              { w: "100%", h: 28 },
            ].map(({ w, h }, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{
                  width: w,
                  height: `${h}px`,
                  background: "#E5E7EB",
                  borderRadius: "3px",
                  marginBottom: "4px",
                  animation: `demo-skeleton-pulse 1.5s ease-in-out infinite ${i * 0.08}s`,
                }}
              />
            ))}
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "7.5px", fontWeight: 700, color: "#f87171" }}
            >
              4.8s ⏳
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.035)" }} />
        </div>

        <VSDivider />

        {/* GOOD — instant */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FBF8F4 0%, #F5EFE7 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px" }}>
            {/* URL bar loaded */}
            <div
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", padding: "0 6px", marginBottom: "4px", border: "1px solid #E5E7EB" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#D1FAE5", fontSize: "5.5px", color: "#10B981", fontWeight: 700 }}
              >
                ✓
              </div>
              <div style={{ flex: 1, height: "4px", background: "#E5E7EB", borderRadius: "2px" }} />
            </div>
            {/* Progress bar — instant */}
            <div
              className="flex-shrink-0"
              style={{ height: "2px", background: "#F3F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "5px" }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                  borderRadius: "9999px",
                  width: "100%",
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  animation: "qp-bar-fast 5s ease-out infinite",
                }}
              />
            </div>
            {/* Content appears — richer real-site layout */}
            <div style={{ animation: "demo-content-appear 5s ease-out infinite" }}>
              {/* Hero strip */}
              <div
                style={{
                  height: "18px",
                  background: "linear-gradient(135deg, #1C1209 0%, #2E1A0E 60%, #3A2215 100%)",
                  borderRadius: "3px",
                  marginBottom: "3px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(212,104,42,0.35) 0%, transparent 55%)" }} />
                <div style={{ padding: "4px 5px", position: "relative", fontSize: "7px", fontWeight: 800, color: "#F3E9D5" }}>Fresh Cuts ✂</div>
              </div>
              <div style={{ height: "4px", background: "#D1D5DB", borderRadius: "2px", width: "72%", marginBottom: "3px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "88%", marginBottom: "4px" }} />
              {/* CTA */}
              <div
                style={{
                  height: "20px",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #E07838, #D4682A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "6.5px",
                  color: "white",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(212,104,42,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                Book Now →
              </div>
            </div>
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "7.5px", fontWeight: 700, color: "#10b981" }}
            >
              ⚡ 0.7s
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.02)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 3 — CONVERT
// ══════════════════════════════════════════════
function ConvertDemo() {
  return (
    <DemoShell>
      <DemoChrome url="shop-site.com/book" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — scattered CTAs, confused visitor */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0" style={{ padding: "7px 7px 5px" }}>
            <div style={{ height: "7px", background: "#374151", borderRadius: "2px", width: "65%", marginBottom: "4px" }} />
            <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "85%", marginBottom: "5px" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
              {["Call Us", "Menu", "About", "Gallery", "Book", "Info", "Reserve", "Map", "Hours"].map((t) => (
                <div
                  key={t}
                  style={{
                    fontSize: "4.5px",
                    padding: "2px 4px",
                    borderRadius: "2px",
                    background: "#F3F4F6",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          {/* Wandering cursor — full-panel wrapper animates transform (was
              top/left keyframes: layout every frame, forever) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10, transform: "translate(18%, 12%)", animation: "qp-cursor-wander 5.5s linear infinite" }}
          >
            <div className="absolute top-0 left-0" style={{ width: "14px", height: "14px" }}>
              <Cursor />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — single clear CTA with cursor that clicks */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FBF8F4 0%, #F5EFE7 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col">

            {/* Mini dark hero header */}
            <div
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                height: "44px",
                background: "linear-gradient(135deg, #1C1209 0%, #2E1A0E 55%, #3D2515 100%)",
              }}
            >
              {/* Warm ambient glow */}
              <div aria-hidden style={{
                position: "absolute",
                bottom: "-16px",
                right: "-4px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,104,42,0.5) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{ padding: "8px 8px 0", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "9px", fontWeight: 800, color: "#F3E9D5", letterSpacing: "0.015em" }}>Fresh Cuts</div>
                <div style={{ fontSize: "5px", color: "rgba(243,233,213,0.5)", marginTop: "2px" }}>Shrewsbury · Walk-ins welcome</div>
              </div>
            </div>

            {/* CTA body */}
            <div style={{ padding: "8px 7px 6px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "6px", fontWeight: 500 }}>
                Ready to book your next visit?
              </div>

              {/* Book Appointment button — reacts to cursor click */}
              <div
                className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                  height: "26px",
                  background: "linear-gradient(135deg, #E07838 0%, #D4682A 45%, #C05A20 100%)",
                  borderRadius: "5px",
                  fontSize: "7.5px",
                  color: "white",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  /* was: demo-btn-click (box-shadow + scale). Shadow is static
                     now; the press still reads via scale + ripple. */
                  boxShadow: "0 3px 12px rgba(212,104,42,0.45), inset 0 1.5px 0 rgba(255,255,255,0.22)",
                  animation: "qp-btn-click 4.5s ease-out infinite",
                }}
              >
                📅 Book Appointment →
                {/* Click ripple */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    width: "130%",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.45)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0)",
                    animation: "demo-click-ripple 4.5s ease-out infinite",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Social proof micro-line */}
              <div style={{ marginTop: "4px", fontSize: "5px", color: "#9CA3AF", textAlign: "center" }}>
                <span style={{ color: "#D97706" }}>★★★★★</span>
                <span style={{ fontWeight: 600, color: "#6B7280" }}> 4.9</span>
                <span> · 127 reviews</span>
              </div>
            </div>
          </div>

          {/* Cursor moves straight to button and clicks — wrapper translates
              (compositor), inner element scales for the click */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10, opacity: 0, transform: "translate(10%, 82%)", animation: "qp-cursor-direct 4.5s ease-in-out infinite" }}
          >
            <div
              className="absolute top-0 left-0"
              style={{ width: "14px", height: "14px", animation: "qp-cursor-click 4.5s ease-in-out infinite" }}
            >
              <Cursor dark />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.018)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 4 — LOCAL SEO
// ══════════════════════════════════════════════
function LocalSEODemo() {
  return (
    <DemoShell>
      <DemoChrome url="google.com/search" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — buried */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 6px 5px" }}>
            {/* Mini search bar */}
            <div
              className="flex items-center flex-shrink-0"
              style={{ height: "13px", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 7px", marginBottom: "5px" }}
            >
              <span style={{ fontSize: "4.5px", color: "#6B7280" }}>barber shop Shrewsbury MA</span>
            </div>
            {/* Competitor results */}
            {[
              { name: "City Cuts", addr: "Worcester" },
              { name: "Elite Hair Co.", addr: "Northboro" },
              { name: "Pro Style Salon", addr: "Westboro" },
              { name: "Modern Cuts", addr: "Marlboro" },
            ].map((r, i) => (
              <div key={r.name} className="flex-shrink-0" style={{ marginBottom: "4px" }}>
                <div style={{ fontSize: "6.5px", color: "#1a0dab", lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ fontSize: "5px", color: "#188038", lineHeight: 1.2 }}>{r.addr} · #{i + 1}</div>
              </div>
            ))}
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "5.5px", color: "#9CA3AF" }}
            >
              Your shop → Page 2
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — #1 ranking */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FEFCF9 0%, #FAF5ED 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 6px 5px" }}>
            {/* Mini search bar */}
            <div
              className="flex items-center flex-shrink-0"
              style={{ height: "13px", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 7px", marginBottom: "5px" }}
            >
              <span style={{ fontSize: "4.5px", color: "#6B7280" }}>barber shop Shrewsbury MA</span>
            </div>
            {/* YOUR shop at #1 */}
            <div
              className="flex-shrink-0"
              style={{
                borderRadius: "6px",
                padding: "5px 6px",
                marginBottom: "3px",
                border: "1.5px solid rgba(212,104,42,0.38)",
                background: "linear-gradient(135deg, rgba(212,104,42,0.1) 0%, rgba(212,104,42,0.04) 100%)",
                /* was: demo-result-glow — infinite background-color paint loop;
                   the static gradient + shadow already carry the highlight */
                boxShadow: "0 2px 10px rgba(212,104,42,0.18), 0 0 0 3px rgba(212,104,42,0.06), inset 0 1px 0 rgba(255,220,140,0.12)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "13px", height: "13px", borderRadius: "50%",
                    background: "linear-gradient(145deg, #E07838, #C05A20)",
                    fontSize: "6px", color: "white", fontWeight: 800,
                    boxShadow: "0 1px 4px rgba(212,104,42,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  1
                </div>
                <div style={{ fontSize: "7.5px", color: "#1a0dab", fontWeight: 700, lineHeight: 1.2 }}>Dave&apos;s Barbershop</div>
              </div>
              <div style={{ fontSize: "6.5px", color: "#D97706", paddingLeft: "16px", marginTop: "1.5px", letterSpacing: "0.02em" }}>★★★★★ <span style={{ fontWeight: 700 }}>4.9</span> <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(127)</span></div>
              <div style={{ fontSize: "5.5px", color: "#166534", paddingLeft: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px", marginTop: "1px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a", flexShrink: 0, display: "inline-block", boxShadow: "0 0 5px rgba(22,163,74,0.7)", animation: "demo-skeleton-pulse 1.3s ease-in-out infinite" }} />
                Open Now · Shrewsbury, MA
              </div>
            </div>
            {[
              { name: "City Cuts", addr: "Worcester" },
              { name: "Elite Hair Co.", addr: "Northboro" },
            ].map((r) => (
              <div key={r.name} className="flex-shrink-0" style={{ marginBottom: "3px" }}>
                <div style={{ fontSize: "6px", color: "#1a0dab" }}>{r.name}</div>
                <div style={{ fontSize: "4.5px", color: "#188038" }}>{r.addr}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 5 — ACCESSIBLE
// ══════════════════════════════════════════════
function AccessibleDemo() {
  return (
    <DemoShell>
      <DemoChrome url="book-appointment.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — no focus indicators */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#374151", marginBottom: "6px" }} className="flex-shrink-0">
              Book Appointment
            </div>
            {["Name", "Email", "Phone"].map((label) => (
              <div key={label} className="flex-shrink-0" style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "2px" }}>{label}</div>
                <div
                  style={{
                    height: "12px",
                    borderRadius: "3px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                  }}
                />
              </div>
            ))}
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{ height: "15px", borderRadius: "4px", background: "#D4682A", fontSize: "7px", color: "white", fontWeight: 700 }}
            >
              Send
            </div>
          </div>
          {/* Tab = nothing indicator */}
          <div
            className="absolute bottom-2 right-1.5 flex items-center gap-0.5 rounded"
            style={{ padding: "2px 4px", background: "#FEF2F2", border: "1px solid #FECACA" }}
          >
            <span style={{ fontSize: "5px", color: "#EF4444", fontWeight: 700 }}>⇥ Tab = nothing</span>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — animated focus rings */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FBF8F4 0%, #F5EFE7 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#374151", marginBottom: "6px" }} className="flex-shrink-0">
              Book Appointment
            </div>
            {(["Name", "Email", "Phone"] as const).map((label, i) => (
              <div key={label} className="flex-shrink-0" style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "2px" }}>{label}</div>
                <div
                  style={{
                    position: "relative",
                    height: "12px",
                    borderRadius: "3px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                  }}
                >
                  {/* Focus ring overlay — static shadow, opacity-only loop
                      (was: demo-focus-el* animating box-shadow + border-color) */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: "-1px",
                      borderRadius: "3px",
                      border: "1px solid rgba(59,130,246,0.5)",
                      boxShadow: "0 0 0 2px rgba(59,130,246,0.7)",
                      opacity: 0,
                      animation: `qp-focus-ring${i + 1} 4.2s ease-in-out infinite`,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{ height: "15px", borderRadius: "4px", background: "#D4682A", fontSize: "7px", color: "white", fontWeight: 700 }}
            >
              Send
            </div>
          </div>
          {/* Tab works indicator */}
          <div
            className="absolute bottom-2 right-1.5 flex items-center gap-0.5 rounded"
            style={{ padding: "2px 4px", background: "#EFF6FF", border: "1px solid #BFDBFE" }}
          >
            <span style={{ fontSize: "5px", color: "#3B82F6", fontWeight: 700 }}>⇥ Tab ✓ works</span>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 6 — MAINTAINABLE
// ══════════════════════════════════════════════
function MaintainableDemo() {
  return (
    <DemoShell>
      <DemoChrome url="tonysauto.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — stale content */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            {/* Stale warning */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{
                height: "13px",
                borderRadius: "3px",
                padding: "0 5px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                marginBottom: "5px",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#EF4444" }}>⚠ Last updated: 2019</span>
            </div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: "#1C1209" }} className="flex-shrink-0">Tony&apos;s Auto</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">Hours:</div>
            <div style={{ fontSize: "6px", color: "#6B7280", marginTop: "1px" }} className="flex-shrink-0">Mon–Fri: 9am–5pm</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">
              Specials: <span style={{ color: "#60A5FA", textDecoration: "underline" }}>specials2019.pdf</span>
            </div>
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{
                height: "12px",
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: "3px",
              }}
            >
              <span style={{ fontSize: "5px", color: "#9CA3AF" }}>&quot;Call to confirm hours&quot;</span>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — live update */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FBF8F4 0%, #F5EFE7 100%)" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            {/* Live indicator */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{
                height: "13px",
                borderRadius: "3px",
                padding: "0 5px",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.25)",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#10B981",
                  flexShrink: 0,
                  animation: "demo-skeleton-pulse 1.4s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "5.5px", color: "#10B981", fontWeight: 700 }}>Live · Updated today</span>
            </div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: "#1C1209" }} className="flex-shrink-0">Tony&apos;s Auto</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">Hours:</div>
            {/* Old text struck through */}
            <div
              className="flex-shrink-0"
              style={{ fontSize: "6px", marginTop: "1px", animation: "demo-text-strike 5s ease-in-out infinite" }}
            >
              Mon–Fri: 9am–5pm
            </div>
            {/* New text appears */}
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{
                fontSize: "6px",
                color: "#10B981",
                fontWeight: 700,
                animation: "demo-text-reveal 5s ease-in-out infinite",
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              Mon–Sat: 8am–6pm ✓
            </div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">
              Specials: <span style={{ color: "#D4682A", fontWeight: 700 }}>Oil Change $39 🔧</span>
            </div>
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{
                height: "12px",
                background: "linear-gradient(135deg, rgba(212,104,42,0.12), rgba(212,104,42,0.06))",
                border: "1px solid rgba(212,104,42,0.2)",
                borderRadius: "3px",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#D4682A", fontWeight: 700 }}>Book online — no calls needed</span>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ── Icon + Demo maps ──────────────────────────────────────────────────────────

type IconKey = (typeof PILLARS)[number]["icon"];

const ICON_MAP: Record<IconKey, React.FC> = {
  Smartphone:         IconMobile,
  Zap:                IconSpeed,
  MousePointerClick:  IconConvert,
  MapPin:             IconMapPin,
  Accessibility:      IconAccessible,
  Wrench:             IconMaintain,
};

const DEMO_MAP: Record<IconKey, React.FC> = {
  Smartphone:         MobileFirstDemo,
  Zap:                SpeedDemo,
  MousePointerClick:  ConvertDemo,
  MapPin:             LocalSEODemo,
  Accessibility:      AccessibleDemo,
  Wrench:             MaintainableDemo,
};

// ── Section ───────────────────────────────────────────────────────────────────

export function QualityPillars() {
  const headingRef = useScrollReveal();
  const gridRef    = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-a)" }}
      aria-labelledby="pillars-heading"
    >
      <style>{DEMO_PERF_CSS}</style>
      {/* Top-right warm glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-80px", right: "-80px",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(212,104,42,0.055) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Heading — with a spinning vinyl record off to the right */}
        <div ref={headingRef} className="mb-14 flex items-start gap-8">
          <div className="flex-1 min-w-0">
            <div className="label-pill mb-4 reveal">How I build</div>
            <TextScramble
              as="h2"
              id="pillars-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              speed={3}
            >
              Six things every site gets right.
            </TextScramble>
            <p
              className="mt-4 max-w-xl text-muted text-lg reveal"
              style={{ transitionDelay: "400ms" }}
            >
              These aren&apos;t upsells. They&apos;re the baseline.
            </p>
          </div>
          {/* Decorative vinyl record — spins on hover */}
          <div
            aria-hidden
            className="hidden xl:block flex-shrink-0 reveal"
            style={{ transitionDelay: "600ms" }}
          >
            <VinylRecord size={180} />
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {PILLARS.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon];
            const DemoComp = DEMO_MAP[pillar.icon];
            return (
              <div key={pillar.heading} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <TiltCard>
                <article
                  aria-labelledby={`pillar-${pillar.icon}`}
                  className="group card-light h-full flex flex-col cursor-default overflow-hidden relative"
                  style={{ isolation: "isolate" }}
                  onMouseMove={handleSpotMove}
                >
                  <div className="pillar-spotlight" aria-hidden />

                  {/* ── Animated demo area ── */}
                  <div
                    className="h-[182px] overflow-hidden flex-shrink-0 relative border-b border-border"
                    aria-hidden
                    style={{
                      boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <DemoComp />
                    {/* Subtle inner-shadow lip at the bottom edge */}
                    <div
                      aria-hidden
                      className="absolute bottom-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: "8px",
                        background:
                          "linear-gradient(180deg, transparent, rgba(0,0,0,0.07))",
                        zIndex: 30,
                      }}
                    />
                  </div>

                  {/* ── Card content ── */}
                  <div className="flex flex-col gap-3 p-5 md:p-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-accent bg-[rgba(212,104,42,0.08)] border border-[rgba(212,104,42,0.16)] shadow-[inset_0_1px_0_rgba(255,210,140,0.12)] group-hover:text-white group-hover:bg-accent group-hover:scale-105 group-hover:shadow-[0_3px_10px_rgba(212,104,42,0.3)] transition-[color,background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      >
                        <Icon />
                      </div>
                      <span
                        className="text-[11px] font-bold tabular-nums tracking-[0.12em] opacity-25 group-hover:opacity-60 transition-opacity duration-300 select-none"
                        style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontStyle: "italic" }}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3
                        id={`pillar-${pillar.icon}`}
                        className="font-bold text-fg text-lg tracking-tight mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {pillar.heading}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">{pillar.body}</p>
                    </div>
                  </div>

                </article>
              </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
