"use client";

import { useRef, useEffect } from "react";

// ── Route 9 Postage Stamp Collection ─────────────────────────────────────────
//
// Five vintage postage stamps for Route 9 business types, each with:
//   - SVG perforation holes at border edges (fill="var(--bg)" punches out
//     circles against the section background in both light + dark mode)
//   - Hand-illustrated scene inside (pizza, coffee cup, scissors, nut+bolt, book)
//   - Denomination area + "ROUTE 9 · SHREWSBURY MA" country text
//   - Tilted resting state via CSS custom property --stamp-tilt
//   - Postmark cancellation overlay that fades in on hover
//   - Staggered entrance: parent IntersectionObserver adds .stamp-visible to all
//     stamps; animationDelay staggers the landing effect
//
// Two-div wrapper: outer .stamp-wrapper handles hover scale/postmark reveal;
// inner .postage-stamp handles the entrance animation (which includes rotation
// via the --stamp-tilt CSS var so fill-mode:both locks the correct final state).
//
// Section background = var(--bg) so perforation circles blend in.

const SW = 116;   // stamp width
const SH = 150;   // stamp height
const PR = 3.5;   // perforation radius

// Perforation dot positions along each edge
const H_PERFS = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 111] as const;
const V_PERFS = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145] as const;

function Perforations() {
  return (
    <>
      {H_PERFS.map(x => (
        <g key={`h${x}`}>
          <circle cx={x} cy={0}  r={PR} fill="var(--bg)" />
          <circle cx={x} cy={SH} r={PR} fill="var(--bg)" />
        </g>
      ))}
      {V_PERFS.map(y => (
        <g key={`v${y}`}>
          <circle cx={0}  cy={y} r={PR} fill="var(--bg)" />
          <circle cx={SW} cy={y} r={PR} fill="var(--bg)" />
        </g>
      ))}
    </>
  );
}

// ── Five stamp illustrations ─────────────────────────────────────────────────
// Each renders within a 92×88 coordinate space (translate applied by parent).

function PizzaScene() {
  return (
    <>
      <circle cx="46" cy="52" r="36" fill="rgba(255,255,255,0.10)" />
      {/* Slice triangle */}
      <path d="M46,14 L10,80 L82,80 Z" fill="rgba(255,220,140,0.52)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" />
      {/* Crust (thick arc) */}
      <path d="M12,78 Q46,94 80,78" stroke="rgba(255,195,100,0.72)" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Cheese blobs */}
      <circle cx="36" cy="58" r="6.5" fill="rgba(255,255,255,0.52)" />
      <circle cx="53" cy="50" r="5.5" fill="rgba(255,255,255,0.46)" />
      <circle cx="44" cy="70" r="4.5" fill="rgba(255,255,255,0.40)" />
      {/* Pepperoni */}
      <circle cx="38" cy="56" r="4" fill="rgba(200,55,55,0.62)" />
      <circle cx="55" cy="48" r="3.5" fill="rgba(200,55,55,0.58)" />
      {/* Steam */}
      <path d="M34,8 Q30,2 34,-4" stroke="rgba(255,255,255,0.44)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M46,6 Q42,0 46,-6" stroke="rgba(255,255,255,0.36)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  );
}

function CoffeeScene() {
  return (
    <>
      {/* Cup body */}
      <path d="M20,44 L25,86 L67,86 L72,44 Z" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      {/* Rim ellipse */}
      <ellipse cx="46" cy="44" rx="26" ry="7" fill="rgba(255,255,255,0.48)" />
      {/* Handle */}
      <path d="M72,54 Q88,54 88,66 Q88,80 72,80" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Saucer */}
      <ellipse cx="46" cy="88" rx="30" ry="6" fill="rgba(255,255,255,0.20)" />
      {/* Steam wisps */}
      <path d="M32,30 Q28,24 32,18 Q36,12 32,6" stroke="rgba(255,255,255,0.48)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M46,28 Q42,22 46,16 Q50,10 46,4" stroke="rgba(255,255,255,0.40)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M60,32 Q56,26 60,20 Q64,14 60,8" stroke="rgba(255,255,255,0.34)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  );
}

function ScissorsScene() {
  return (
    <>
      {/* Top blade (rotated +28° around pivot at 46,46) */}
      <rect x="12" y="43" width="54" height="5" rx="2.5" fill="rgba(255,255,255,0.68)" transform="rotate(-28 46 46)" />
      {/* Bottom blade */}
      <rect x="12" y="43" width="54" height="5" rx="2.5" fill="rgba(255,255,255,0.58)" transform="rotate(28 46 46)" />
      {/* Handle rings — positions derived from rotated blade ends near x=12 */}
      <circle cx="16" cy="33" r="10" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="3" />
      <circle cx="16" cy="60" r="10" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
      {/* Pivot screw */}
      <circle cx="46" cy="46" r="5" fill="rgba(255,255,255,0.82)" />
      <circle cx="46" cy="46" r="2" fill="rgba(0,0,0,0.30)" />
      {/* Blade tips */}
      <circle cx="76" cy="38" r="3" fill="rgba(255,255,255,0.50)" />
      <circle cx="76" cy="54" r="3" fill="rgba(255,255,255,0.42)" />
    </>
  );
}

function HardwareScene() {
  return (
    <>
      {/* Hex nut */}
      <polygon points="46,10 64,20 64,40 46,50 28,40 28,20" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.62)" strokeWidth="2" />
      <polygon points="46,16 60,24 60,36 46,44 32,36 32,24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.30)" strokeWidth="1" />
      {/* Center hole */}
      <circle cx="46" cy="30" r="9" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5" />
      {/* Bolt shaft */}
      <rect x="40" y="50" width="12" height="36" rx="5" fill="rgba(255,255,255,0.45)" />
      {/* Thread lines */}
      <line x1="40" y1="58" x2="52" y2="58" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <line x1="40" y1="65" x2="52" y2="65" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <line x1="40" y1="72" x2="52" y2="72" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      {/* Sparkle stars */}
      <text x="76" y="22" fontSize="10" fill="rgba(255,255,255,0.55)" textAnchor="middle">✦</text>
      <text x="16" y="42" fontSize="8"  fill="rgba(255,255,255,0.40)" textAnchor="middle">✦</text>
    </>
  );
}

function BookScene() {
  return (
    <>
      {/* Left page */}
      <path d="M10,18 Q10,12 18,12 L46,14 L46,84 Q36,80 18,84 Q10,82 10,76 Z" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5" />
      {/* Right page */}
      <path d="M82,18 Q82,12 74,12 L46,14 L46,84 Q56,80 74,84 Q82,82 82,76 Z" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      {/* Spine */}
      <line x1="46" y1="14" x2="46" y2="84" stroke="rgba(255,255,255,0.72)" strokeWidth="2.5" />
      {/* Text lines — left page */}
      <line x1="16" y1="28" x2="42" y2="27" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="36" x2="42" y2="35" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="44" x2="42" y2="43" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="52" x2="38" y2="51" stroke="rgba(255,255,255,0.26)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="60" x2="42" y2="59" stroke="rgba(255,255,255,0.24)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="68" x2="34" y2="67" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Text lines — right page */}
      <line x1="50" y1="27" x2="78" y2="28" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="35" x2="78" y2="36" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="43" x2="78" y2="44" stroke="rgba(255,255,255,0.26)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="51" x2="74" y2="52" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="59" x2="78" y2="60" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Bookmark ribbon */}
      <path d="M64,12 L64,34 L59,27 L54,34 L54,12 Z" fill="rgba(255,140,140,0.55)" />
    </>
  );
}

const SCENES = [PizzaScene, CoffeeScene, ScissorsScene, HardwareScene, BookScene];

type StampData = {
  id: string;
  label: string;
  denom: string;
  bg: string;
  delay: string;
  tilt: number;
};

const STAMPS: StampData[] = [
  { id: "s1", label: "PIZZERIA",  denom: "ROUTE 9",    bg: "#8C1C1C", delay: "0s",    tilt: -2.5 },
  { id: "s2", label: "CAFÉ",      denom: "SHREWSBURY", bg: "#7C4518", delay: "0.09s", tilt:  1.8 },
  { id: "s3", label: "BARBER",    denom: "LOCAL",      bg: "#1A3560", delay: "0.18s", tilt: -1.2 },
  { id: "s4", label: "HARDWARE",  denom: "MA",         bg: "#1B4D30", delay: "0.27s", tilt:  2.1 },
  { id: "s5", label: "BOOKSHOP",  denom: "EST. 1847",  bg: "#4A2060", delay: "0.36s", tilt: -0.8 },
];

// ── Postmark cancellation overlay ─────────────────────────────────────────────
function Postmark() {
  return (
    <svg
      viewBox={`0 0 ${SW} ${SH}`}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0, transition: "opacity 0.28s ease", pointerEvents: "none",
      }}
      className="stamp-postmark"
      aria-hidden
    >
      {/* Cancellation wavy lines */}
      {[40, 52, 64, 76, 88].map(y => (
        <path
          key={y}
          d={`M8,${y} Q20,${y - 5} 32,${y} Q44,${y + 5} 56,${y} Q68,${y - 5} 80,${y} Q92,${y + 5} 108,${y}`}
          stroke="rgba(160,25,25,0.62)"
          strokeWidth="1.8"
          fill="none"
        />
      ))}
      {/* Cancellation circle */}
      <circle cx={SW / 2} cy={SH / 2} r="38" fill="none" stroke="rgba(160,25,25,0.70)" strokeWidth="2.2" />
      <text
        x={SW / 2} y={SH / 2 - 6}
        textAnchor="middle"
        fontSize="6.5"
        fontFamily="'Courier New', monospace"
        fontWeight="700"
        letterSpacing="0.18em"
        fill="rgba(160,25,25,0.75)"
      >
        ROUTE 9 WEB CO.
      </text>
      <text
        x={SW / 2} y={SH / 2 + 6}
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="'Courier New', monospace"
        fontWeight="700"
        letterSpacing="0.14em"
        fill="rgba(160,25,25,0.65)"
      >
        SHREWSBURY · MA
      </text>
    </svg>
  );
}

// ── Single stamp ──────────────────────────────────────────────────────────────
function Stamp({ stamp, Scene }: { stamp: StampData; Scene: () => React.JSX.Element }) {
  return (
    /* Outer wrapper: hover scale + postmark reveal */
    <div
      className="stamp-wrapper"
      style={{ position: "relative", cursor: "default", isolation: "isolate" }}
    >
      {/* Inner: entrance animation (includes --stamp-tilt in keyframe) */}
      <div
        className="postage-stamp"
        style={Object.assign(
          { animationDelay: stamp.delay },
          { "--stamp-tilt": `${stamp.tilt}deg` }
        ) as React.CSSProperties}
      >
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          width={SW}
          height={SH}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stamp background */}
          <rect width={SW} height={SH} rx="2" fill={stamp.bg} />

          {/* Inner white frame margin */}
          <rect x="11" y="11" width={SW - 22} height={SH - 22} fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" rx="1" />

          {/* Illustration scene (92×88 area at translate 12,14) */}
          <g transform="translate(12, 14)">
            <Scene />
          </g>

          {/* Denomination area */}
          <rect x="12" y="112" width={SW - 24} height="26" rx="1" fill="rgba(0,0,0,0.18)" />
          <text
            x={SW / 2} y="124"
            textAnchor="middle"
            fontSize="9"
            fontFamily="'Courier New', Courier, monospace"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="rgba(255,255,255,0.80)"
          >
            {stamp.label}
          </text>
          <text
            x={SW / 2} y="133"
            textAnchor="middle"
            fontSize="6"
            fontFamily="'Courier New', Courier, monospace"
            fontWeight="700"
            letterSpacing="0.16em"
            fill="rgba(255,255,255,0.50)"
          >
            {stamp.denom} · SHREWSBURY MA
          </text>

          {/* Perforations (circles punched out using section bg color) */}
          <Perforations />
        </svg>
      </div>

      {/* Postmark — fades in on hover via CSS sibling selector */}
      <Postmark />
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function PostageStamps() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const stamps = el.querySelectorAll<HTMLElement>(".postage-stamp");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stamps.forEach(s => s.classList.add("stamp-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stamps.forEach(s => s.classList.add("stamp-visible"));
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "var(--bg)", padding: "72px 0 80px" }}
      aria-label="Route 9 businesses — we build sites for every shop on the corridor"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Label */}
        <div className="flex justify-center mb-4">
          <span className="label-pill">Who We Serve</span>
        </div>

        {/* Heading */}
        <h2
          className="text-center reveal"
          style={{
            fontSize: "clamp(22px, 3.5vw, 34px)",
            fontWeight: 800,
            color: "var(--fg)",
            marginBottom: "8px",
            lineHeight: 1.25,
          }}
        >
          Every shop on Route 9
        </h2>
        <p
          className="text-center reveal"
          style={{
            fontSize: "15px",
            color: "var(--muted)",
            marginBottom: "48px",
            maxWidth: "420px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Pizza joints, barbers, hardware stores, bookshops, cafés —
          if you&rsquo;re on Route 9, we&rsquo;ve got a site for you.
        </p>

        {/* ── Stamp row ── */}
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: "20px" }}
        >
          {STAMPS.map((stamp, i) => (
            <Stamp key={stamp.id} stamp={stamp} Scene={SCENES[i]} />
          ))}
        </div>

        {/* Caption */}
        <p
          style={{
            textAlign: "center",
            marginTop: "32px",
            fontSize: "11.5px",
            color: "var(--muted-light)",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Hover to cancel &nbsp;·&nbsp; Route 9 Web Co. Collection · 2024
        </p>
      </div>
    </section>
  );
}
