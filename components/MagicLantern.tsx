"use client";

// MagicLantern ─────────────────────────────────────────────────────────────────
//
// Full-section Victorian magic lantern slide projection scene. A brass
// oil-lit projector on the left casts a warm trapezoid beam onto a sepia
// glass-plate screen that cycles through five Route 9 business types.
// Slide dissolve: opacity fades out (480ms), index advances, fades back in.
// Placed between Portfolio and LakeScene.

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Shape = "fork" | "hanger" | "wrench" | "key" | "leaf";
type Slide = { title: string; sub: string; desc: string; shape: Shape };

const SLIDES: Slide[] = [
  { title: "THE RESTAURATEUR", sub: "Menu · Hours · Reservations",  desc: "Bring your tables to the internet",  shape: "fork"   },
  { title: "THE BOUTIQUE",     sub: "Shop · Story · Style",          desc: "Your window to a wider world",       shape: "hanger" },
  { title: "THE TRADESPERSON", sub: "Services · Rates · Reviews",    desc: "Let your craft speak first",         shape: "wrench" },
  { title: "THE INNKEEPER",    sub: "Rooms · Rates · Booking",       desc: "Welcome guests before they arrive",  shape: "key"    },
  { title: "THE PROVISIONER",  sub: "Products · Community · Story",  desc: "Rooted locally, found anywhere",     shape: "leaf"   },
];

// Screen bounds and center
const SX1 = 660; const SX2 = 1200;
const SY1 = 158; const SY2 = 422;
const SCX = (SX1 + SX2) / 2;  // 930
const SCY = (SY1 + SY2) / 2;  // 290

// Ventilation slot Y positions on lantern body
const VENT_YS = [218, 246, 274, 302, 330, 358, 386, 414] as const;

// Film sprocket Y positions on screen edges
const SPROCKET_YS = [182, 222, 262, 302, 342, 382] as const;

function renderIcon(shape: Shape, cx: number, cy: number): ReactNode {
  const s = {
    stroke: "rgba(245,228,192,.60)" as const,
    strokeWidth: 3.4,
    strokeLinecap: "round" as const,
    fill: "none" as const,
  };
  switch (shape) {
    case "fork":
      return (
        <g {...s}>
          {([-28, -14, 0] as const).map((dx, i) => (
            <line key={i} x1={cx + dx} y1={cy - 38} x2={cx + dx} y2={cy + 22} />
          ))}
          <path d={`M ${cx-28} ${cy-18} Q ${cx-14} ${cy-8} ${cx} ${cy-18}`} />
          <line x1={cx + 16} y1={cy - 38} x2={cx + 16} y2={cy + 22} />
          <path d={`M ${cx+16} ${cy-38} Q ${cx+32} ${cy-22} ${cx+16} ${cy-4}`} />
        </g>
      );
    case "hanger":
      return (
        <g {...s}>
          <path d={`M ${cx} ${cy-38}
            C ${cx} ${cy-28} ${cx-8} ${cy-20} ${cx-8} ${cy-14}
            C ${cx-8} ${cy-4} ${cx-40} ${cy+10} ${cx-46} ${cy+26}
            L ${cx+46} ${cy+26}
            C ${cx+40} ${cy+10} ${cx+8} ${cy-4} ${cx+8} ${cy-14}
            C ${cx+8} ${cy-20} ${cx} ${cy-28} ${cx} ${cy-38}`} />
          <circle cx={cx} cy={cy - 40} r="5"
            fill="rgba(245,228,192,.30)" stroke="rgba(245,228,192,.60)" strokeWidth="2" />
        </g>
      );
    case "wrench":
      return (
        <g {...s}>
          <path d={`M ${cx-32} ${cy+32} L ${cx+12} ${cy-18}
            C ${cx+16} ${cy-28} ${cx+28} ${cy-34} ${cx+36} ${cy-26}
            C ${cx+44} ${cy-18} ${cx+38} ${cy-6} ${cx+28} ${cy-2}
            L ${cx-16} ${cy+48}
            C ${cx-22} ${cy+54} ${cx-32} ${cy+52} ${cx-38} ${cy+46}
            C ${cx-44} ${cy+40} ${cx-42} ${cy+28} ${cx-32} ${cy+32} Z`} />
        </g>
      );
    case "key":
      return (
        <g {...s}>
          <circle cx={cx - 16} cy={cy - 16} r="24" />
          <circle cx={cx - 16} cy={cy - 16} r="10" />
          <line x1={cx + 6}  y1={cy + 6}  x2={cx + 44} y2={cy + 44} />
          <line x1={cx + 26} y1={cy + 26} x2={cx + 26} y2={cy + 38} />
          <line x1={cx + 36} y1={cy + 36} x2={cx + 48} y2={cy + 36} />
        </g>
      );
    case "leaf":
      return (
        <g {...s}>
          <path d={`M ${cx} ${cy+40}
            C ${cx-44} ${cy+14} ${cx-54} ${cy-28} ${cx} ${cy-42}
            C ${cx+54} ${cy-28} ${cx+44} ${cy+14} ${cx} ${cy+40} Z`} />
          <line x1={cx} y1={cy - 42} x2={cx} y2={cy + 40} />
          <line x1={cx} y1={cy - 14} x2={cx + 26} y2={cy - 26} />
          <line x1={cx} y1={cy + 8}  x2={cx - 24} y2={cy - 2} />
          <line x1={cx} y1={cy + 24} x2={cx + 20} y2={cy + 12} />
        </g>
      );
    default:
      return <></>;
  }
}

export function MagicLantern() {
  const [active,     setActive]     = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visible,    setVisible]    = useState(true);
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

  useEffect(() => {
    if (!active) return;
    let tid: ReturnType<typeof setTimeout>;
    const advance = () => {
      setVisible(false);
      tid = setTimeout(() => {
        setSlideIndex(i => (i + 1) % SLIDES.length);
        setVisible(true);
      }, 500);
    };
    const iid = setInterval(advance, 3400);
    return () => { clearInterval(iid); clearTimeout(tid); };
  }, [active]);

  const tr = (d: number) => active ? `opacity 0.68s ease ${d}s` : "none";

  const slide = SLIDES[slideIndex % SLIDES.length];
  const title = slide?.title ?? "";
  const sub   = slide?.sub   ?? "";
  const desc  = slide?.desc  ?? "";
  const shape = (slide?.shape ?? "leaf") as Shape;

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#060810 0%,#040608 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <svg
        viewBox="0 0 1440 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage magic lantern projecting slides of Route 9 business types: restaurateur, boutique, tradesperson, innkeeper, provisioner"
      >
        <defs>
          <radialGradient id="ml-lamp" cx="52%" cy="38%" r="66%">
            <stop offset="0%"   stopColor="#fff4c4"/>
            <stop offset="48%"  stopColor="#e8a436"/>
            <stop offset="100%" stopColor="#7e5014"/>
          </radialGradient>
          <radialGradient id="ml-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,208,112,.22)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="ml-brass-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#dca834"/>
            <stop offset="42%"  stopColor="#b88224"/>
            <stop offset="100%" stopColor="#7e5214"/>
          </linearGradient>
          <linearGradient id="ml-brass-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#dca834"/>
            <stop offset="52%"  stopColor="#c89022"/>
            <stop offset="100%" stopColor="#8a6018"/>
          </linearGradient>
          <linearGradient id="ml-beam-wide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,220,116,.38)"/>
            <stop offset="100%" stopColor="rgba(255,220,116,.05)"/>
          </linearGradient>
          <linearGradient id="ml-beam-inner" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,198,78,.20)"/>
            <stop offset="100%" stopColor="rgba(255,198,78,0)"/>
          </linearGradient>
          <radialGradient id="ml-screen" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="rgba(255,250,226,.97)"/>
            <stop offset="72%"  stopColor="rgba(246,232,194,.90)"/>
            <stop offset="100%" stopColor="rgba(218,196,158,.80)"/>
          </radialGradient>
          <filter id="ml-glow"><feGaussianBlur stdDeviation="16"/></filter>
          <clipPath id="ml-clip">
            <rect x={SX1} y={SY1} width={SX2 - SX1} height={SY2 - SY1} rx="3"/>
          </clipPath>
        </defs>

        {/* ── AMBIENT WARM GLOW ── */}
        <ellipse cx="336" cy="290" rx="250" ry="210"
          fill="url(#ml-ambient)" filter="url(#ml-glow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── LIGHT BEAM (wide outer) ── */}
        <path d={`M 540 254 L 540 326 L ${SX2} ${SY2 + 36} L ${SX2} ${SY1 - 36} Z`}
          fill="url(#ml-beam-wide)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>
        {/* ── LIGHT BEAM (warm inner) ── */}
        <path d={`M 540 266 L 540 314 L ${SX1 + 24} ${SY2 - 24} L ${SX1 + 24} ${SY1 + 24} Z`}
          fill="url(#ml-beam-inner)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ══ LANTERN BODY ══ */}

        {/* Wooden base */}
        <rect x="192" y="432" width="214" height="20" rx="4"
          fill="#1c0c06"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <rect x="192" y="430" width="214" height="7" rx="3"
          fill="rgba(255,255,255,.06)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>

        {/* Legs */}
        <line x1="226" y1="432" x2="212" y2="452" stroke="#1c0c06" strokeWidth="9" strokeLinecap="round"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <line x1="372" y1="432" x2="386" y2="452" stroke="#1c0c06" strokeWidth="9" strokeLinecap="round"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>

        {/* Brass body box */}
        <rect x="198" y="188" width="218" height="244" rx="7"
          fill="url(#ml-brass-v)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>
        {/* Body top highlight */}
        <rect x="198" y="188" width="218" height="32" rx="6"
          fill="rgba(255,255,255,.15)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>
        {/* Body right-edge shadow */}
        <rect x="380" y="188" width="36" height="244" rx="5"
          fill="rgba(0,0,0,.22)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>

        {/* Ventilation slots */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          {VENT_YS.map((y, i) => (
            <line key={i} x1="210" y1={y} x2="378" y2={y}
              stroke="rgba(0,0,0,.17)" strokeWidth="1.1"/>
          ))}
        </g>

        {/* Oil lamp chamber */}
        <circle cx="296" cy="290" r="80"
          fill="#08060c"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>
        <circle cx="296" cy="290" r="80"
          fill="none" stroke="rgba(200,152,42,.54)" strokeWidth="3.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>
        <circle cx="296" cy="290" r="66"
          fill="url(#ml-lamp)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>
        {/* Flame */}
        <ellipse cx="296" cy="277" rx="7" ry="20"
          fill="rgba(255,252,220,.84)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}/>
        <ellipse cx="296" cy="271" rx="4.5" ry="11"
          fill="rgba(255,255,255,.64)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}/>

        {/* Chimney */}
        <rect x="280" y="116" width="32" height="74" rx="5"
          fill="url(#ml-brass-v)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <rect x="280" y="116" width="12" height="74"
          fill="rgba(255,255,255,.10)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <rect x="270" y="104" width="52" height="18" rx="4"
          fill="#b07c1c"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <ellipse cx="296" cy="104" rx="28" ry="7" fill="#9c6c12"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>

        {/* Lens barrel */}
        <rect x="414" y="246" width="80" height="88" rx="5"
          fill="url(#ml-brass-h)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <rect x="414" y="246" width="19" height="88"
          fill="rgba(255,255,255,.12)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        {[268, 290, 312].map((y, i) => (
          <line key={i} x1="414" y1={y} x2="494" y2={y}
            stroke="rgba(0,0,0,.17)" strokeWidth="1.5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        ))}

        {/* Front condenser lens */}
        <circle cx="494" cy="290" r="52" fill="#0a0e1c"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <circle cx="494" cy="290" r="52"
          fill="none" stroke="rgba(200,152,42,.72)" strokeWidth="6"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <circle cx="494" cy="290" r="42" fill="#0c1426"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <circle cx="494" cy="290" r="42"
          fill="none" stroke="rgba(200,152,42,.28)" strokeWidth="1.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <ellipse cx="480" cy="272" rx="16" ry="11"
          fill="rgba(148,196,255,.14)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        <ellipse cx="508" cy="308" rx="8" ry="5"
          fill="rgba(148,196,255,.09)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>

        {/* ══ PROJECTED SCREEN ══ */}
        <rect x={SX1} y={SY1} width={SX2 - SX1} height={SY2 - SY1} rx="4"
          fill="url(#ml-screen)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>
        <rect x={SX1} y={SY1} width={SX2 - SX1} height={SY2 - SY1} rx="4"
          fill="none" stroke="rgba(184,144,80,.40)" strokeWidth="2.2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ══ SLIDE CONTENT (dissolves with `visible`) ══ */}
        <g clipPath="url(#ml-clip)"
          style={{ opacity: visible && active ? 1 : 0, transition: "opacity 0.44s ease" }}>

          {renderIcon(shape, SCX, SCY - 40)}

          <text x={SCX} y={SCY + 42} textAnchor="middle"
            fill="rgba(74,40,8,.90)" fontSize="27"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3.8">
            {title}
          </text>

          <line x1={SCX - 84} y1={SCY + 52} x2={SCX + 84} y2={SCY + 52}
            stroke="rgba(100,58,16,.26)" strokeWidth="0.9"/>

          <text x={SCX} y={SCY + 74} textAnchor="middle"
            fill="rgba(92,54,16,.62)" fontSize="11.5"
            fontFamily="monospace" letterSpacing="2.8">
            {sub}
          </text>

          <text x={SCX} y={SCY + 96} textAnchor="middle"
            fill="rgba(80,46,12,.44)" fontSize="10.5"
            fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="0.6">
            {desc}
          </text>

          {/* Film sprocket holes */}
          {SPROCKET_YS.map((y, i) => (
            <rect key={`ls-${i}`} x={SX1 + 7} y={y} width={11} height={15} rx="2"
              fill="rgba(0,0,0,.09)"/>
          ))}
          {SPROCKET_YS.map((y, i) => (
            <rect key={`rs-${i}`} x={SX2 - 18} y={y} width={11} height={15} rx="2"
              fill="rgba(0,0,0,.09)"/>
          ))}
        </g>

        {/* ── SLIDE INDICATOR DOTS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.88) }}>
          {SLIDES.map((_, i) => (
            <circle key={i}
              cx={SCX + (i - 2) * 22}
              cy={SY2 + 28}
              r={i === slideIndex % SLIDES.length ? 5.5 : 3}
              fill={i === slideIndex % SLIDES.length
                ? "rgba(200,152,42,.84)"
                : "rgba(200,152,42,.28)"}/>
          ))}
        </g>

        {/* Section header */}
        <text x="340" y="88" textAnchor="middle"
          fill="rgba(200,152,42,.38)" fontSize="9"
          fontFamily="monospace" letterSpacing="4"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · PROJECTION ROOM
        </text>

        {/* Screen label */}
        <text x={SCX} y={SY1 - 14} textAnchor="middle"
          fill="rgba(200,152,42,.30)" fontSize="8.5"
          fontFamily="monospace" letterSpacing="3"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          WHO WE BUILD FOR
        </text>

        {/* Caption */}
        <text x="720" y="554" textAnchor="middle"
          fill="rgba(200,158,68,.20)" fontSize="9.5"
          fontFamily="Georgia,serif" fontStyle="italic"
          style={{ opacity: active ? 1 : 0, transition: tr(0.94) }}>
          Every business along Route 9 deserves a story worth projecting
        </text>
      </svg>
    </div>
  );
}
