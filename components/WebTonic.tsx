"use client";

// WebTonic ────────────────────────────────────────────────────────────────────
//
// Victorian apothecary label for "Route 9 Web Tonic" — ornate engraved
// botanical border, round-bottom flask illustration with wax-sealed stopper,
// and an ingredient list treating web technologies as medicinal compounds.
// Staggered scroll-reveal: borders → title → bottle → ingredients → fine print.
// Placed between Pricing and CashRegister.

import { useEffect, useRef, useState } from "react";

// Ingredient data: web techs as medicinal compounds
const INGREDIENTS: { name: string; dose: string; desc: string }[] = [
  { name: "HTML 5.0",           dose: "200mg",       desc: "Hypertext Markup · Structural Foundation" },
  { name: "CSS 3.0",            dose: "150mg",       desc: "Cascading Stylesheets · Visual Clarity"   },
  { name: "JavaScript ES2024",  dose: "100mg",       desc: "ECMAScript · Dynamic Interactivity"       },
  { name: "Next.js 16.0",       dose: "75mg",        desc: "React Framework · Server Rendering"       },
  { name: "TypeScript 5.0",     dose: "50mg",        desc: "Static Types · Error Prevention"          },
  { name: "Git (LTS)",          dose: "as directed", desc: "Version Control · Change Management"      },
];

// Corner ornament positions and rotations [x, y, rotateDeg]
const CORNERS: [number, number, number][] = [
  [246, 58,  0],
  [1194, 58, 90],
  [1194, 656, 180],
  [246, 656, 270],
];

export function WebTonic() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.55s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#0e0a05 0%,#0a0703 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Victorian apothecary label: Route 9 Web Tonic — ingredients include HTML, CSS, JavaScript, Next.js"
      >
        <defs>
          <linearGradient id="wt-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f0de"/>
            <stop offset="100%" stopColor="#ede0c4"/>
          </linearGradient>
          <linearGradient id="wt-bottle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(60,126,134,.70)"/>
            <stop offset="40%"  stopColor="rgba(82,152,160,.60)"/>
            <stop offset="100%" stopColor="rgba(50,112,122,.55)"/>
          </linearGradient>
          <radialGradient id="wt-bottle-body" cx="28%" cy="32%" r="68%">
            <stop offset="0%"   stopColor="rgba(110,175,182,.65)"/>
            <stop offset="100%" stopColor="rgba(44,108,118,.50)"/>
          </radialGradient>
          <filter id="wt-shadow" x="-3%" y="-3%" width="106%" height="106%">
            <feDropShadow dx="5" dy="7" stdDeviation="10" floodColor="rgba(0,0,0,.55)"/>
          </filter>
        </defs>

        {/* ── LABEL PAPER ── */}
        <rect x="208" y="24" width="1024" height="672" rx="4"
          fill="url(#wt-paper)" filter="url(#wt-shadow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>

        {/* ── BORDERS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>
          {/* Outer border */}
          <rect x="214" y="30"  width="1012" height="660" rx="3"
            fill="none" stroke="#3a2008" strokeWidth="2.8"/>
          {/* Second border */}
          <rect x="222" y="38"  width="996"  height="644" rx="2"
            fill="none" stroke="#3a2008" strokeWidth="1"/>
          {/* Inner dashed border */}
          <rect x="230" y="46"  width="980"  height="628" rx="1.5"
            fill="none" stroke="#5a3010" strokeWidth="0.7"
            strokeDasharray="5,4"/>
        </g>

        {/* ── BOTANICAL CORNER ORNAMENTS ── */}
        {CORNERS.map(([cx, cy, rot], i) => (
          <g key={i}
            transform={`translate(${cx},${cy}) rotate(${rot})`}
            style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}>
            {/* Horizontal vine */}
            <path d="M 0,0 Q 10,-4 22,0 Q 32,-3 46,0"
              stroke="rgba(55,26,8,.50)" strokeWidth="1.2" fill="none"/>
            {/* Vertical vine */}
            <path d="M 0,0 Q -4,10 0,22 Q -3,32 0,46"
              stroke="rgba(55,26,8,.50)" strokeWidth="1.2" fill="none"/>
            {/* Leaves on horizontal vine */}
            <ellipse cx="14" cy="-5" rx="6" ry="2.5"
              transform="rotate(-18,14,-5)" fill="rgba(55,26,8,.44)"/>
            <ellipse cx="34" cy="-4" rx="5" ry="2"
              transform="rotate(-12,34,-4)" fill="rgba(55,26,8,.40)"/>
            {/* Leaves on vertical vine */}
            <ellipse cx="-5" cy="14" rx="2.5" ry="6"
              transform="rotate(-18,-5,14)" fill="rgba(55,26,8,.44)"/>
            <ellipse cx="-4" cy="34" rx="2" ry="5"
              transform="rotate(-12,-4,34)" fill="rgba(55,26,8,.40)"/>
            {/* Corner berry */}
            <circle cx="0"  cy="0"  r="3.2" fill="rgba(55,26,8,.55)"/>
            {/* Vine berries */}
            <circle cx="23" cy="-1" r="1.8" fill="rgba(55,26,8,.42)"/>
            <circle cx="-1" cy="23" r="1.8" fill="rgba(55,26,8,.42)"/>
          </g>
        ))}

        {/* ── HEADER TEXT ── */}
        <text x="720" y="68" textAnchor="middle"
          fill="rgba(58,32,8,.42)" fontSize="8"
          fontFamily="monospace" letterSpacing="3"
          style={{ opacity: active ? 1 : 0, transition: tr(0.20) }}>
          SHREWSBURY, MASSACHUSETTS · ESTABLISHED 2024
        </text>

        {/* Top ornamental rule */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.24) }}>
          <line x1="248" y1="80" x2="640" y2="80"
            stroke="#3a2008" strokeWidth="0.7"/>
          <line x1="800" y1="80" x2="1192" y2="80"
            stroke="#3a2008" strokeWidth="0.7"/>
          <polygon points="720,75 727,80 720,85 713,80"
            fill="#8c4010"/>
          <polygon points="648,80 655,75 662,80 655,85"
            fill="rgba(58,32,8,.35)"/>
          <polygon points="778,80 785,75 792,80 785,85"
            fill="rgba(58,32,8,.35)"/>
        </g>

        {/* ── TITLE ── */}
        <text x="720" y="118" textAnchor="middle"
          fill="#8c2010" fontSize="30"
          fontFamily="Georgia,'Times New Roman',serif"
          fontWeight="bold" letterSpacing="14"
          style={{ opacity: active ? 1 : 0, transition: tr(0.28) }}>
          ROUTE 9
        </text>
        <text x="720" y="163" textAnchor="middle"
          fill="#1c0c04" fontSize="52"
          fontFamily="Georgia,'Times New Roman',serif"
          fontWeight="bold" letterSpacing="6"
          style={{ opacity: active ? 1 : 0, transition: tr(0.34) }}>
          WEB TONIC
        </text>

        {/* Sub-rule with diamonds */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.38) }}>
          <line x1="248" y1="178" x2="575" y2="178"
            stroke="#3a2008" strokeWidth="0.8"/>
          <line x1="865" y1="178" x2="1192" y2="178"
            stroke="#3a2008" strokeWidth="0.8"/>
          <polygon points="720,172 728,178 720,184 712,178" fill="#8c4010"/>
          <polygon points="583,178 589,173 595,178 589,183" fill="rgba(58,32,8,.28)"/>
          <polygon points="845,178 851,173 857,178 851,183" fill="rgba(58,32,8,.28)"/>
        </g>

        {/* Tagline */}
        <text x="720" y="196" textAnchor="middle"
          fill="rgba(58,32,8,.55)" fontSize="9"
          fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="0.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.40) }}>
          The Original Formula for Digital Success · Trusted by Small Businesses Since 2024
        </text>

        {/* Thin rule below tagline */}
        <line x1="248" y1="206" x2="1192" y2="206"
          stroke="#3a2008" strokeWidth="0.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.42) }}/>

        {/* ── APOTHECARY BOTTLE ILLUSTRATION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.46) }}>
          {/* Bottle shadow */}
          <ellipse cx="720" cy="400" rx="46" ry="9"
            fill="rgba(58,32,8,.18)"/>
          {/* Round flask body */}
          <ellipse cx="720" cy="335" rx="62" ry="64"
            fill="url(#wt-bottle-body)"/>
          {/* Neck */}
          <rect x="706" y="222" width="28" height="76" rx="7"
            fill="url(#wt-bottle)"/>
          {/* Neck ring at shoulder */}
          <ellipse cx="720" cy="298" rx="36" ry="7"
            fill="rgba(50,110,118,.65)"/>
          {/* Cork stopper */}
          <rect x="709" y="207" width="22" height="18" rx="3"
            fill="#9a7020"/>
          {/* Cork wax seal */}
          <ellipse cx="720" cy="207" rx="13" ry="4.5"
            fill="#8c1818"/>
          <ellipse cx="720" cy="207" rx="9"  ry="3"
            fill="#a82020"/>
          {/* Seal monogram */}
          <text x="720" y="210" textAnchor="middle"
            fill="rgba(240,180,120,.70)" fontSize="6"
            fontFamily="Georgia,serif" fontWeight="bold">R9</text>

          {/* Body label (stuck on the flask body) */}
          <rect x="694" y="302" width="52" height="64" rx="2"
            fill="#f5ecd6" opacity="0.94"/>
          {/* Label border */}
          <rect x="694" y="302" width="52" height="64" rx="2"
            fill="none" stroke="#3a2008" strokeWidth="0.8"/>
          {/* Label top stripe */}
          <rect x="694" y="302" width="52" height="9" rx="1"
            fill="rgba(100,20,20,.60)"/>
          {/* Label bottom stripe */}
          <rect x="694" y="357" width="52" height="9" rx="1"
            fill="rgba(100,20,20,.60)"/>
          {/* Label text */}
          <text x="720" y="320" textAnchor="middle"
            fill="#f5e8c0" fontSize="6" fontFamily="monospace" letterSpacing="0.8">ROUTE 9</text>
          <text x="720" y="335" textAnchor="middle"
            fill="#1c0c04" fontSize="8.5" fontFamily="Georgia,serif" fontWeight="bold">WEB</text>
          <text x="720" y="347" textAnchor="middle"
            fill="#1c0c04" fontSize="8.5" fontFamily="Georgia,serif" fontWeight="bold">TONIC</text>
          <text x="720" y="362" textAnchor="middle"
            fill="#f5e8c0" fontSize="5.5" fontFamily="monospace">1 FL. OZ.</text>

          {/* Glass highlights */}
          <path d="M 695,240 Q 692,300 694,388"
            stroke="rgba(255,255,255,.38)" strokeWidth="3.5"
            strokeLinecap="round" fill="none"/>
          <path d="M 700,240 Q 697,300 699,386"
            stroke="rgba(255,255,255,.14)" strokeWidth="1.5" fill="none"/>
          {/* Flask bottom highlight */}
          <ellipse cx="720" cy="392" rx="44" ry="6"
            fill="rgba(255,255,255,.08)"/>
        </g>

        {/* ── INGREDIENT SECTION ── */}

        {/* "ACTIVE INGREDIENTS" heading */}
        <text x="720" y="425" textAnchor="middle"
          fill="#3a2008" fontSize="11"
          fontFamily="monospace" letterSpacing="4"
          style={{ opacity: active ? 1 : 0, transition: tr(0.52) }}>
          ─  ACTIVE INGREDIENTS PER SERVING  ─
        </text>

        {/* Column divider */}
        <line x1="716" y1="432" x2="716" y2="558"
          stroke="#3a2008" strokeWidth="0.5" opacity="0.22"
          style={{ opacity: active ? 0.22 : 0, transition: tr(0.54) }}/>

        {/* Ingredient rows — two columns of three */}
        {INGREDIENTS.map((ing, i) => {
          const isLeft  = i < 3;
          const rowIdx  = i % 3;
          const xStart  = isLeft ? 248 : 730;
          const xEnd    = isLeft ? 706 : 1188;
          const nameY   = 450 + rowIdx * 37;

          return (
            <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.58 + i * 0.07) }}>
              {/* Ingredient name */}
              <text x={xStart} y={nameY}
                fill="#1c0804" fontSize="9.5"
                fontFamily="monospace" letterSpacing="0.4">
                {ing.name}
              </text>
              {/* Dosage (right-aligned) */}
              <text x={xEnd} y={nameY} textAnchor="end"
                fill="#1c0804" fontSize="9.5"
                fontFamily="monospace" letterSpacing="0.2">
                {ing.dose}
              </text>
              {/* Dotted leader line */}
              <line x1={xStart} y1={nameY + 3} x2={xEnd} y2={nameY + 3}
                stroke="#3a2008" strokeWidth="0.35"
                strokeDasharray="2,5" opacity="0.22"/>
              {/* Description */}
              <text x={xStart + 4} y={nameY + 16}
                fill="rgba(58,26,8,.50)" fontSize="7.5"
                fontFamily="Georgia,serif" fontStyle="italic">
                {ing.desc}
              </text>
            </g>
          );
        })}

        {/* ── BOTTOM SECTION ── */}

        {/* Bottom double rule */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(1.04) }}>
          <line x1="248" y1="566" x2="1192" y2="566"
            stroke="#3a2008" strokeWidth="0.8"/>
          <line x1="248" y1="570" x2="1192" y2="570"
            stroke="#3a2008" strokeWidth="0.3"/>
        </g>

        {/* Guarantee text */}
        <text x="720" y="586" textAnchor="middle"
          fill="rgba(58,26,8,.52)" fontSize="8.5"
          fontFamily="Georgia,serif" fontStyle="italic"
          style={{ opacity: active ? 1 : 0, transition: tr(1.06) }}>
          GUARANTEED ANALYSIS: Measurable results within 90 days or your investment returned
        </text>

        {/* Directions */}
        <text x="720" y="602" textAnchor="middle"
          fill="rgba(58,26,8,.38)" fontSize="7.5"
          fontFamily="monospace" letterSpacing="0.3"
          style={{ opacity: active ? 1 : 0, transition: tr(1.08) }}>
          DIRECTIONS: Apply one website to your business and observe daily. Repeat as growth demands.
        </text>

        {/* Fine print disclaimer */}
        <text x="720" y="618" textAnchor="middle"
          fill="rgba(58,26,8,.28)" fontSize="6.5"
          fontFamily="monospace"
          style={{ opacity: active ? 1 : 0, transition: tr(1.10) }}>
          *These statements have not been evaluated by the Chamber of Commerce. Not for internal use. Keep out of reach of competitors.
        </text>

        {/* Bottom rule */}
        <line x1="248" y1="628" x2="1192" y2="628"
          stroke="#3a2008" strokeWidth="0.6"
          style={{ opacity: active ? 1 : 0, transition: tr(1.11) }}/>

        {/* Manufacturer */}
        <text x="720" y="644" textAnchor="middle"
          fill="rgba(58,26,8,.46)" fontSize="8"
          fontFamily="monospace" letterSpacing="1.5"
          style={{ opacity: active ? 1 : 0, transition: tr(1.12) }}>
          MANUFACTURED BY ROUTE 9 WEB CO. · SHREWSBURY, MA 01545
        </text>

        {/* Net contents */}
        <text x="720" y="659" textAnchor="middle"
          fill="rgba(58,26,8,.30)" fontSize="7.5"
          fontFamily="Georgia,serif" fontStyle="italic"
          style={{ opacity: active ? 1 : 0, transition: tr(1.14) }}>
          Net Contents: One Complete Website · No Artificial Bloat · Locally Compounded
        </text>
      </svg>
    </div>
  );
}
