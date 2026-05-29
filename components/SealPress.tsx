"use client";

// SealPress ───────────────────────────────────────────────────────────────────
//
// Full-section animated scene: a brass die descends onto molten red wax,
// presses an impression, then lifts to reveal the Route 9 Web Co. R·9
// monogram. Letterpress ornamental frame appears last.
// Animation phases driven by IntersectionObserver + setTimeout:
//   1) wax pools   2) die descends   3) held pressed
//   4) die lifts + seal revealed     5) letterpress frame fades in
// Placed between Telegrapher and Contact.

import { useEffect, useRef, useState } from "react";

const CX = 720;   // seal center x
const CY = 330;   // seal center y (leaves room for die travel above)
const RING_TEXT = "ROUTE 9 WEB CO · SHREWSBURY MA ·";
const RING_R    = 68;

const CORNERS: [number, number][] = [
  [220,  54], [1220,  54],
  [220, 462], [1220, 462],
];

export function SealPress() {
  const [active, setActive] = useState(false);
  const [phase,  setPhase]  = useState(0);
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

  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPhase(1), 120);
    const t2 = setTimeout(() => setPhase(2), 720);
    const t3 = setTimeout(() => setPhase(3), 1780);
    const t4 = setTimeout(() => setPhase(4), 2580);
    const t5 = setTimeout(() => setPhase(5), 3300);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
    };
  }, [active]);

  // Die: SVG coords are "pressed" position. Off-screen = translateY(-430px).
  const dieTransform  = phase >= 2 && phase <= 3 ? "translateY(0px)" : "translateY(-430px)";
  const dieTransition = phase === 2 ? "transform 980ms cubic-bezier(.40,0,.20,1)"
                      : phase === 4 ? "transform 620ms cubic-bezier(.20,0,.80,1)"
                      : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#0d0a07 0%,#080604 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto", overflow: "hidden" }}
        role="img"
        aria-label="Brass die pressing Route 9 Web Co. wax seal monogram into red wax"
      >
        <defs>
          <radialGradient id="sp-wax" cx="38%" cy="32%" r="68%">
            <stop offset="0%"   stopColor="#cc1e1e"/>
            <stop offset="52%"  stopColor="#961010"/>
            <stop offset="100%" stopColor="#580808"/>
          </radialGradient>
          <radialGradient id="sp-wax-edge" cx="50%" cy="50%" r="50%">
            <stop offset="70%"  stopColor="rgba(0,0,0,0)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,.44)"/>
          </radialGradient>
          <linearGradient id="sp-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#dfc05a"/>
            <stop offset="42%"  stopColor="#c29828"/>
            <stop offset="100%" stopColor="#9c7418"/>
          </linearGradient>
          <linearGradient id="sp-handle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c08820"/>
            <stop offset="40%"  stopColor="#d6a630"/>
            <stop offset="100%" stopColor="#ae7818"/>
          </linearGradient>
          <radialGradient id="sp-knob" cx="32%" cy="26%" r="62%">
            <stop offset="0%"   stopColor="#e8c860"/>
            <stop offset="100%" stopColor="#826016"/>
          </radialGradient>
        </defs>

        {/* Table grain */}
        {[88, 184, 280, 376, 462].map(gy => (
          <line key={gy} x1="0" y1={gy} x2="1440" y2={gy}
            stroke="rgba(70,35,10,.04)" strokeWidth="1"/>
        ))}

        {/* ── LETTERPRESS FRAME (phase 5) ── */}
        <g style={{ opacity: phase >= 5 ? 1 : 0, transition: phase >= 5 ? "opacity 0.9s ease" : "none" }}>
          {/* Top double rule */}
          <line x1="220" y1="54" x2="1220" y2="54"
            stroke="rgba(196,156,72,.30)" strokeWidth="0.8"/>
          <line x1="220" y1="58" x2="1220" y2="58"
            stroke="rgba(196,156,72,.15)" strokeWidth="0.4"/>

          <text x={CX} y="44" textAnchor="middle"
            fill="rgba(196,156,72,.42)" fontSize="11"
            fontFamily="monospace" letterSpacing="5.5">
            ─  ROUTE 9 WEB CO.  ─
          </text>
          <text x={CX} y="72" textAnchor="middle"
            fill="rgba(186,148,66,.26)" fontSize="8.5"
            fontFamily="Georgia,serif" fontStyle="italic">
            Shrewsbury, Massachusetts · Est. 2024
          </text>

          {/* Bottom double rule */}
          <line x1="220" y1="462" x2="1220" y2="462"
            stroke="rgba(196,156,72,.30)" strokeWidth="0.8"/>
          <line x1="220" y1="458" x2="1220" y2="458"
            stroke="rgba(196,156,72,.14)" strokeWidth="0.4"/>
          <text x={CX} y="485" textAnchor="middle"
            fill="rgba(190,150,66,.26)" fontSize="8"
            fontFamily="monospace" letterSpacing="3.2">
            IMPRINT OF CRAFT · SEALED WITH INTENTION
          </text>
          <text x={CX} y="503" textAnchor="middle"
            fill="rgba(172,134,56,.18)" fontSize="8"
            fontFamily="Georgia,serif" fontStyle="italic">
            where every business deserves a front door on the internet
          </text>

          {/* Vertical side rules */}
          <line x1="220"  y1="54" x2="220"  y2="462"
            stroke="rgba(196,156,72,.15)" strokeWidth="0.6"/>
          <line x1="1220" y1="54" x2="1220" y2="462"
            stroke="rgba(196,156,72,.15)" strokeWidth="0.6"/>

          {/* Corner ornaments */}
          {CORNERS.map(([fx, fy], i) => (
            <g key={i}>
              <circle cx={fx} cy={fy} r="3.8" fill="rgba(196,156,72,.42)"/>
              <line x1={fx} y1={fy}
                x2={fx + (fx < 720 ? 36 : -36)} y2={fy}
                stroke="rgba(196,156,72,.38)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1={fx} y1={fy}
                x2={fx} y2={fy + (fy < 260 ? 36 : -36)}
                stroke="rgba(196,156,72,.38)" strokeWidth="1.2" strokeLinecap="round"/>
            </g>
          ))}
          <circle cx="220"  cy="260" r="2.5" fill="rgba(196,156,72,.26)"/>
          <circle cx="1220" cy="260" r="2.5" fill="rgba(196,156,72,.26)"/>
        </g>

        {/* ── WAX BLOB (phase 1: scale in) ── */}
        <g style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: phase >= 1 ? "scale(1)" : "scale(0)",
          transition: phase === 1 ? "transform 760ms cubic-bezier(.2,1.25,.4,1)" : "none",
        }}>
          <ellipse cx={CX} cy={CY} rx="118" ry="96" fill="url(#sp-wax)"/>
          <ellipse cx={CX} cy={CY} rx="118" ry="96" fill="url(#sp-wax-edge)"/>
          {/* Wax sheen highlight */}
          <ellipse cx={CX - 32} cy={CY - 24} rx="50" ry="36"
            fill="rgba(215,70,55,.20)"/>
        </g>

        {/* ── SEAL IMPRESSION (phase 4: fade in) ── */}
        <g style={{ opacity: phase >= 4 ? 1 : 0, transition: phase >= 4 ? "opacity 720ms ease" : "none" }}>
          {/* Impressed depth shadow */}
          <circle cx={CX} cy={CY} r="88" fill="rgba(0,0,0,.26)"/>
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r="83"
            fill="none" stroke="rgba(255,198,168,.40)" strokeWidth="2"/>
          {/* Inner dashed ring */}
          <circle cx={CX} cy={CY} r="73"
            fill="none" stroke="rgba(255,198,168,.22)" strokeWidth="0.9"
            strokeDasharray="3,3"/>

          {/* Circular ring text */}
          {Array.from(RING_TEXT).map((ch, i, arr) => {
            const angleDeg = (i / arr.length) * 360 - 90;
            const rad      = angleDeg * Math.PI / 180;
            const tx       = CX + RING_R * Math.cos(rad);
            const ty       = CY + RING_R * Math.sin(rad);
            return (
              <text key={i} x={tx} y={ty}
                transform={`rotate(${angleDeg + 90}, ${tx}, ${ty})`}
                textAnchor="middle" dominantBaseline="central"
                fill="rgba(255,210,178,.50)"
                fontSize="6.8" fontFamily="monospace">
                {ch}
              </text>
            );
          })}

          {/* Center monogram — R */}
          <text x={CX} y={CY - 6} textAnchor="middle"
            fill="rgba(255,222,192,.74)" fontSize="48"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" fontStyle="italic">
            R
          </text>
          {/* Divider rule */}
          <line x1={CX - 14} y1={CY + 12} x2={CX + 14} y2={CY + 12}
            stroke="rgba(255,205,172,.46)" strokeWidth="1.4"/>
          {/* 9 */}
          <text x={CX} y={CY + 34} textAnchor="middle"
            fill="rgba(255,218,188,.60)" fontSize="22"
            fontFamily="monospace" fontWeight="bold">
            9
          </text>

          {/* Cardinal ornament dots */}
          {[0, 90, 180, 270].map(deg => {
            const r2 = (deg - 90) * Math.PI / 180;
            return (
              <circle key={deg}
                cx={CX + 77 * Math.cos(r2)}
                cy={CY + 77 * Math.sin(r2)}
                r="2.2" fill="rgba(255,195,160,.38)"/>
            );
          })}
        </g>

        {/* ── BRASS DIE (translateY animation) ── */}
        {/* SVG positions = "pressed" state. translateY(-430px) = off-screen above. */}
        <g style={{ transform: dieTransform, transition: dieTransition }}>
          {/* Handle bar */}
          <rect x="706" y="10" width="28" height="146" rx="5"
            fill="url(#sp-handle)"/>
          <rect x="706" y="10" width="6"  height="146" rx="3"
            fill="rgba(255,255,255,.16)"/>
          {/* Knob */}
          <circle cx={CX} cy="-2" r="28" fill="#9a7018"/>
          <circle cx={CX} cy="-2" r="24" fill="url(#sp-knob)"/>
          <circle cx={CX - 8} cy="-10" r="10" fill="rgba(255,255,255,.20)"/>
          <circle cx={CX}     cy="-2"  r="7"  fill="#7e6018"/>
          {/* Bolt */}
          <rect x="706" y="152" width="28" height="10" rx="3" fill="#896018"/>
          {/* Die body */}
          <rect x="648" y="162" width="144" height="92" rx="4"
            fill="url(#sp-brass)"/>
          <rect x="648" y="162" width="144" height="14" rx="3"
            fill="rgba(255,255,255,.18)"/>
          <rect x="780" y="162" width="12"  height="92" rx="2"
            fill="rgba(0,0,0,.22)"/>
          {/* Die face plate */}
          <rect x="662" y="220" width="116" height="32" rx="2"
            fill="rgba(0,0,0,.28)"/>
          <text x={CX} y="241" textAnchor="middle"
            fill="rgba(158,118,38,.62)" fontSize="15"
            fontFamily="Georgia,serif" fontWeight="bold" fontStyle="italic"
            letterSpacing="2">
            R · 9
          </text>
        </g>

        {/* Caption */}
        <text x={CX} y="515" textAnchor="middle"
          fill="rgba(243,233,213,.08)" fontSize="9"
          fontFamily="monospace" letterSpacing="1.8"
          style={{ opacity: active ? 1 : 0, transition: active ? "opacity .5s ease 4.2s" : "none" }}>
          SEALED WITH CRAFT · ROUTE 9 WEB CO. · SHREWSBURY, MASSACHUSETTS
        </text>
      </svg>
    </div>
  );
}
