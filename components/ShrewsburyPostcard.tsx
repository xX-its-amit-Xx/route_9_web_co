"use client";

// ShrewsburyPostcard ──────────────────────────────────────────────────────────
//
// Vintage illustrated postcard — Lake Quinsigamond autumn scene,
// "Greetings from SHREWSBURY" lettering, perforated Route 9 postage stamp,
// and a rubber postmark that stamps down on scroll.
// Placed between Typewriter and ShrewsburyGazette.

import { useEffect, useRef, useState } from "react";

// Autumn tree canopy data: [cx, cy, rx, ry, fill]
const LEFT_TREES: [number, number, number, number, string][] = [
  [338, 185, 46, 32, "#d4580a"],
  [306, 190, 36, 26, "#c04e08"],
  [374, 190, 34, 24, "#b84008"],
  [396, 188, 40, 28, "#e06c1c"],
  [420, 186, 32, 22, "#d04c0c"],
  [446, 190, 36, 26, "#c85818"],
  [468, 188, 30, 21, "#b83c0c"],
  [488, 192, 38, 27, "#d86418"],
  [510, 188, 32, 22, "#c04008"],
];

const RIGHT_TREES: [number, number, number, number, string][] = [
  [984, 186, 42, 30, "#d4580a"],
  [1012, 190, 36, 26, "#c05818"],
  [1036, 188, 40, 28, "#e07018"],
  [1062, 192, 32, 22, "#b84c0c"],
  [1086, 188, 38, 27, "#d06418"],
  [1110, 190, 34, 24, "#c04808"],
  [1132, 192, 36, 26, "#d86c1a"],
];

const LEFT_TRUNKS  = [316, 356, 398, 436, 476];
const RIGHT_TRUNKS = [990, 1030, 1070, 1110];
const REED_XS      = [296, 309, 322, 335, 1088, 1102, 1116, 1128];
const SHIMMER_YS   = [191, 200, 210, 220, 230, 240, 250];

export function ShrewsburyPostcard() {
  const [active,  setActive]  = useState(false);
  const [stamped, setStamped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setActive(true);
          obs.disconnect();
          setTimeout(() => setStamped(true), 2400);
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.6s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#1a1208 0%,#120c06 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage illustrated postcard: Greetings from Shrewsbury, Massachusetts"
      >
        <defs>
          <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b0ccdf"/>
            <stop offset="100%" stopColor="#daeaf6"/>
          </linearGradient>
          <linearGradient id="pc-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5090b8"/>
            <stop offset="45%"  stopColor="#72aac8"/>
            <stop offset="100%" stopColor="#4278a0"/>
          </linearGradient>
          <linearGradient id="pc-card" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f0d8"/>
            <stop offset="100%" stopColor="#f0e5c4"/>
          </linearGradient>
          <filter id="pc-drop" x="-4%" y="-4%" width="108%" height="108%">
            <feDropShadow dx="6" dy="8" stdDeviation="11" floodColor="rgba(0,0,0,.58)"/>
          </filter>
        </defs>

        {/* Table grain */}
        {[100, 200, 310, 420].map(gy => (
          <line key={gy} x1="0" y1={gy} x2="1440" y2={gy}
            stroke="rgba(80,40,10,.04)" strokeWidth="1"/>
        ))}

        {/* ── POSTCARD — rotated −2° ── */}
        <g
          transform="rotate(-2, 720, 285)"
          filter="url(#pc-drop)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}
        >
          {/* Card paper */}
          <rect x="270" y="30" width="900" height="510" rx="3" fill="url(#pc-card)"/>

          {/* Outer red border */}
          <rect x="277" y="37" width="886" height="496" rx="2"
            fill="none" stroke="#a01818" strokeWidth="4.5"/>
          {/* Inner red rule */}
          <rect x="291" y="51" width="858" height="468" rx="1"
            fill="none" stroke="#a01818" strokeWidth="1.2"/>

          {/* ── SKY ── */}
          <rect x="292" y="52" width="856" height="208" fill="url(#pc-sky)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.20) }}/>

          {/* Far hills */}
          <path d="M 292,180 Q 430,148 570,163 Q 680,148 780,158 Q 880,146 990,156 Q 1070,148 1148,158 L 1148,208 L 292,208 Z"
            fill="#a0be94"
            style={{ opacity: active ? 0.62 : 0, transition: tr(0.28) }}/>
          <path d="M 292,198 Q 390,174 500,185 Q 600,172 700,180 Q 800,168 900,178 Q 1000,170 1080,178 Q 1120,174 1148,178 L 1148,210 L 292,210 Z"
            fill="#8aae7c"
            style={{ opacity: active ? 0.58 : 0, transition: tr(0.33) }}/>

          {/* ── LAKE QUINSIGAMOND ── */}
          <rect x="292" y="182" width="856" height="75" fill="url(#pc-water)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.38) }}/>
          {SHIMMER_YS.map((wy, i) => (
            <line key={wy}
              x1={292 + i * 9} y1={wy} x2={1000 + i * 18} y2={wy}
              stroke="rgba(200,230,255,.20)" strokeWidth="0.9"
              style={{ opacity: active ? 1 : 0, transition: tr(0.44 + i * 0.02) }}/>
          ))}

          {/* ── LEFT BANK AUTUMN TREES ── */}
          {LEFT_TREES.map(([cx, cy, rx, ry, fill], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill}
              style={{ opacity: active ? 0.88 : 0, transition: tr(0.32 + i * 0.03) }}/>
          ))}
          {LEFT_TRUNKS.map((tx, i) => (
            <rect key={i} x={tx - 2} y={196} width="4" height="18" rx="1" fill="#5a2c0c"
              style={{ opacity: active ? 0.55 : 0, transition: tr(0.50 + i * 0.02) }}/>
          ))}

          {/* ── RIGHT BANK AUTUMN TREES ── */}
          {RIGHT_TREES.map(([cx, cy, rx, ry, fill], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill}
              style={{ opacity: active ? 0.88 : 0, transition: tr(0.34 + i * 0.03) }}/>
          ))}
          {RIGHT_TRUNKS.map((tx, i) => (
            <rect key={i} x={tx - 2} y={196} width="4" height="18" rx="1" fill="#5a2c0c"
              style={{ opacity: active ? 0.55 : 0, transition: tr(0.52 + i * 0.02) }}/>
          ))}

          {/* ── ROWBOAT ── */}
          <g style={{ opacity: active ? 1 : 0, transition: tr(0.65) }}>
            <path d="M 845,237 Q 860,232 884,232 Q 908,232 922,237 Q 924,243 884,246 Q 844,243 845,237 Z"
              fill="#8b4513"/>
            <path d="M 848,237 Q 884,241 920,237"
              stroke="#6b3010" strokeWidth="1.2" fill="none"/>
            <line x1="863" y1="234" x2="850" y2="225" stroke="#7a3c12" strokeWidth="1.5"/>
            <line x1="902" y1="234" x2="916" y2="225" stroke="#7a3c12" strokeWidth="1.5"/>
            <ellipse cx="884" cy="231" rx="5" ry="4" fill="#3a2810"/>
            <rect x="880" y="230" width="8" height="8" rx="1" fill="#4a3018"/>
          </g>
          {/* Boat reflection */}
          <ellipse cx="884" cy="252" rx="30" ry="4" fill="rgba(55,90,125,.22)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.68) }}/>

          {/* ── FOREGROUND REEDS ── */}
          {REED_XS.map((rx, i) => (
            <g key={i}>
              <line x1={rx} y1={257} x2={rx - 2} y2={242}
                stroke="#4a7828" strokeWidth="1.5" strokeLinecap="round"/>
              <ellipse cx={rx - 2} cy={239} rx="2.2" ry="5" fill="#5a6c28"/>
            </g>
          ))}

          {/* ── DIVIDER ── */}
          <line x1="292" y1="257" x2="1148" y2="257"
            stroke="#a01818" strokeWidth="1.5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.52) }}/>

          {/* Lake caption */}
          <text x="720" y="273" textAnchor="middle"
            fill="rgba(88,40,10,.40)" fontSize="8"
            fontFamily="monospace" letterSpacing="2.5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.57) }}>
            LAKE QUINSIGAMOND · SHREWSBURY, MASSACHUSETTS
          </text>

          {/* ── "Greetings from" ── */}
          <text x="720" y="313" textAnchor="middle"
            fill="#8c4010" fontSize="21"
            fontFamily="Georgia,serif" fontStyle="italic"
            style={{ opacity: active ? 1 : 0, transition: tr(0.62) }}>
            Greetings from
          </text>

          {/* ── "SHREWSBURY" ── */}
          <text x="720" y="382" textAnchor="middle"
            fill="#8c1212" fontSize="74"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.72) }}>
            SHREWSBURY
          </text>

          {/* ── "Massachusetts" ── */}
          <text x="720" y="416" textAnchor="middle"
            fill="#2c2858" fontSize="25"
            fontFamily="Georgia,serif" fontStyle="italic"
            style={{ opacity: active ? 1 : 0, transition: tr(0.86) }}>
            Massachusetts
          </text>

          {/* Flanking rules */}
          <line x1="378" y1="397" x2="553" y2="397"
            stroke="rgba(138,18,18,.30)" strokeWidth="1.5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.78) }}/>
          <line x1="887" y1="397" x2="1062" y2="397"
            stroke="rgba(138,18,18,.30)" strokeWidth="1.5"
            style={{ opacity: active ? 1 : 0, transition: tr(0.78) }}/>
          <polygon points="553,397 560,390 567,397 560,404"
            fill="rgba(138,18,18,.33)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.80) }}/>
          <polygon points="873,397 880,390 887,397 880,404"
            fill="rgba(138,18,18,.33)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.80) }}/>

          {/* ── Bottom strip ── */}
          <line x1="292" y1="443" x2="1148" y2="443"
            stroke="rgba(160,24,24,.20)" strokeWidth="0.8"
            style={{ opacity: active ? 1 : 0, transition: tr(0.90) }}/>
          <text x="720" y="464" textAnchor="middle"
            fill="rgba(108,68,28,.30)" fontSize="9.5"
            fontFamily="monospace" letterSpacing="2.2"
            style={{ opacity: active ? 1 : 0, transition: tr(0.93) }}>
            ROUTE 9 WEB CO. · LOCALLY CRAFTED · PROFESSIONALLY DELIVERED
          </text>
          <text x="720" y="485" textAnchor="middle"
            fill="rgba(78,44,16,.20)" fontSize="9"
            fontFamily="Georgia,serif" fontStyle="italic"
            style={{ opacity: active ? 1 : 0, transition: tr(0.97) }}>
            where every business deserves a front door on the internet
          </text>

          {/* ── POSTAGE STAMP ── */}
          <g style={{ opacity: active ? 1 : 0, transition: tr(1.05) }}>
            {/* Perforated backing */}
            <rect x="1043" y="57" width="92" height="110" rx="2" fill="#ede5c0"/>
            <rect x="1043" y="57" width="92" height="110" rx="2"
              fill="none" stroke="#ccc070" strokeWidth="5" strokeDasharray="5,3"/>
            {/* Stamp illustration frame */}
            <rect x="1054" y="68" width="70" height="74" rx="1" fill="#c0dae8"/>
            {/* Sky */}
            <rect x="1054" y="68" width="70" height="36" fill="#9cc4de"/>
            {/* Ground */}
            <rect x="1054" y="104" width="70" height="38" fill="#84b45c"/>
            {/* Diner */}
            <rect x="1070" y="88" width="38" height="28" rx="1" fill="#e8deb8"/>
            <path d="M 1065,90 L 1075,80 L 1103,80 L 1113,90 Z" fill="#b43418"/>
            <rect x="1077" y="84" width="20" height="7" rx="1" fill="#f0d830"/>
            <text x="1087" y="90" textAnchor="middle"
              fill="#600c0c" fontSize="4" fontFamily="monospace">R9</text>
            {/* Road in front */}
            <rect x="1054" y="116" width="70" height="6" rx="0" fill="#9a9070"/>
            {/* Denomination */}
            <text x="1089" y="133" textAnchor="middle"
              fill="#4e3c18" fontSize="12" fontFamily="Georgia,serif" fontWeight="bold">
              3¢
            </text>
            <text x="1089" y="146" textAnchor="middle"
              fill="#3e2c10" fontSize="5.5" fontFamily="monospace" letterSpacing="0.5">
              U.S.POSTAGE
            </text>
          </g>

          {/* ── POSTMARK (stamps down after 2.4 s) ── */}
          <g style={{
            opacity: stamped ? 0.64 : 0,
            transition: stamped ? "opacity 0.18s ease 0s" : "none",
          }}>
            <circle cx="1062" cy="106" r="54"
              fill="none" stroke="rgba(155,18,18,.72)" strokeWidth="2.8"/>
            <circle cx="1062" cy="106" r="44"
              fill="none" stroke="rgba(155,18,18,.50)" strokeWidth="1.2"/>
            {/* Wavy cancel lines */}
            {[83, 92, 101, 110, 119, 128].map(ly => (
              <path key={ly}
                d={`M 1014,${ly} Q 1038,${ly - 3} 1062,${ly} Q 1086,${ly + 3} 1110,${ly}`}
                stroke="rgba(155,18,18,.55)" strokeWidth="1.5" fill="none"/>
            ))}
            <text x="1062" y="62" textAnchor="middle"
              fill="rgba(155,18,18,.72)" fontSize="7"
              fontFamily="monospace" letterSpacing="2.5">SHREWSBURY</text>
            <text x="1062" y="110" textAnchor="middle"
              fill="rgba(155,18,18,.55)" fontSize="7"
              fontFamily="monospace" letterSpacing="1.5">MASS.</text>
            <text x="1062" y="152" textAnchor="middle"
              fill="rgba(155,18,18,.62)" fontSize="7"
              fontFamily="monospace" letterSpacing="1.8">OCT 12 1954</text>
          </g>
        </g>

        {/* ── SECTION CAPTION ── */}
        <text x="720" y="549" textAnchor="middle"
          fill="rgba(243,233,213,.10)" fontSize="9"
          fontFamily="monospace" letterSpacing="1.8"
          style={{ opacity: active ? 1 : 0, transition: tr(1.20) }}>
          A POSTCARD FROM THE ROUTE 9 CORRIDOR · SHREWSBURY, MASSACHUSETTS
        </text>
      </svg>
    </div>
  );
}
