"use client";

// Telegrapher ─────────────────────────────────────────────────────────────────
//
// Vintage telegraph station — Morse code prints dot-by-dot onto an animated
// paper tape spelling "ROUTE 9 WEB CO", while decoded characters materialise
// below. Brass key + sounder SVG illustration.
// Placed between FortuneTeller and Contact.

import { useEffect, useRef, useState } from "react";

// ── Morse timing (ms) ─────────────────────────────────────────────────────────

const DOT_DUR   = 90;
const DASH_DUR  = 130;
const EL_GAP    = 30;
const CHAR_GAP  = 80;
const WORD_GAP  = 160;

// ── Tape geometry (px) ────────────────────────────────────────────────────────

const DOT_W    = 10;
const DASH_W   = 26;
const EL_XGAP  = 8;
const CHAR_XGAP = 16;
const WORD_XGAP = 30;

// ── Types ─────────────────────────────────────────────────────────────────────

type MSym = { dash: boolean; x: number; delay: number };
type MChr = { ch: string; delay: number };

// ── Letter table: [character, morse-code] — empty pair = word break ───────────

const LETTER_CODES: [string, string][] = [
  ["R", ".-."], ["O", "---"], ["U", "..-"], ["T", "-"], ["E", "."],
  ["", ""],
  ["9", "----."],
  ["", ""],
  ["W", ".--"], ["E", "."], ["B", "-..."],
  ["", ""],
  ["C", "-.-."], ["O", "---"],
];

// ── Build the flat symbol + character-reveal arrays ───────────────────────────

function buildMorse(): { syms: MSym[]; chars: MChr[] } {
  const syms: MSym[]  = [];
  const chars: MChr[] = [];
  let x = 62, delay = 0;

  for (const [ch, code] of LETTER_CODES) {
    if (!code) {
      chars.push({ ch: " ", delay });
      x     += WORD_XGAP;
      delay += WORD_GAP;
      continue;
    }
    for (let i = 0; i < code.length; i++) {
      if (i > 0) { x += EL_XGAP; delay += EL_GAP; }
      const dash = code.charAt(i) === "-";
      syms.push({ dash, x, delay });
      x     += dash ? DASH_W : DOT_W;
      delay += dash ? DASH_DUR : DOT_DUR;
    }
    chars.push({ ch, delay: delay + 120 });
    x     += CHAR_XGAP;
    delay += CHAR_GAP;
  }

  return { syms, chars };
}

const { syms: SYMS, chars: CHARS } = buildMorse();

// ── Tape perforation x-positions ─────────────────────────────────────────────

const PERFS = Array.from({ length: 73 }, (_, i) => i * 20);

// ── Decoded text centering ────────────────────────────────────────────────────

const DECODED      = "ROUTE 9 WEB CO";
const CHAR_STEP    = 26;
const CHAR_X_START = 720 - (DECODED.length * CHAR_STEP) / 2;

// ── Component ─────────────────────────────────────────────────────────────────

export function Telegrapher() {
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

  const tr = (ms: number) =>
    active ? `opacity 0.18s ease ${ms / 1000}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#060e07 0%,#040808 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 524"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage telegraph machine printing Morse code for Route 9 Web Co"
      >
        <defs>
          <linearGradient id="tg-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5e3c20"/>
            <stop offset="100%" stopColor="#3c2210"/>
          </linearGradient>
          <linearGradient id="tg-arm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4aa4c"/>
            <stop offset="100%" stopColor="#a88030"/>
          </linearGradient>
          <radialGradient id="tg-knob" cx="33%" cy="28%" r="66%">
            <stop offset="0%"   stopColor="#e8c46a"/>
            <stop offset="100%" stopColor="#966a24"/>
          </radialGradient>
          <linearGradient id="tg-coil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3020"/>
            <stop offset="100%" stopColor="#221808"/>
          </linearGradient>
        </defs>

        {/* ── SECTION LABEL ── */}
        <text x="720" y="24" textAnchor="middle"
          fill="rgba(212,104,42,.38)" fontSize="8.5"
          fontFamily="monospace" letterSpacing="3.2"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease .04s" }}>
          INCOMING TRANSMISSION · ROUTE 9 WEB CO.
        </text>
        <text x="720" y="41" textAnchor="middle"
          fill="rgba(243,233,213,.18)" fontSize="10"
          fontFamily="Georgia,serif" fontStyle="italic"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease .08s" }}>
          Connect. Build. Launch. Repeat.
        </text>

        {/* ── TAPE REELS ── */}
        {[26, 1414].map(rx => (
          <g key={rx}>
            <circle cx={rx} cy="94" r="32" fill="#221e14" stroke="rgba(170,148,88,.22)" strokeWidth="1.5"/>
            <circle cx={rx} cy="94" r="20" fill="#181408" stroke="rgba(170,148,88,.18)" strokeWidth="1"/>
            <circle cx={rx} cy="94" r="7"  fill="#2a2418"/>
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={rx + 8 * Math.cos(a * Math.PI / 180)}
                y1={94 + 8 * Math.sin(a * Math.PI / 180)}
                x2={rx + 18 * Math.cos(a * Math.PI / 180)}
                y2={94 + 18 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(140,120,60,.28)" strokeWidth="1.5"/>
            ))}
          </g>
        ))}

        {/* ── PAPER TAPE ── */}
        <rect x="0" y="73" width="1440" height="42" fill="#f2eac8"/>
        <rect x="0" y="73" width="1440" height="4"  fill="rgba(0,0,0,.09)"/>
        <rect x="0" y="111" width="1440" height="4" fill="rgba(0,0,0,.09)"/>
        {/* Centre guide line */}
        <line x1="0" y1="94" x2="1440" y2="94"
          stroke="rgba(196,174,118,.20)" strokeWidth="0.6"/>
        {/* Perforations */}
        {PERFS.map(px => (
          <circle key={"t"+px} cx={px} cy="77"  r="2.4" fill="rgba(172,148,100,.42)"/>
        ))}
        {PERFS.map(px => (
          <circle key={"b"+px} cx={px} cy="111" r="2.4" fill="rgba(172,148,100,.42)"/>
        ))}

        {/* ── MORSE SYMBOLS ── */}
        {SYMS.map((s, i) => (
          s.dash ? (
            <rect key={i}
              x={s.x} y="88" width={DASH_W} height="12" rx="2"
              fill="#261c08"
              style={{ opacity: active ? 1 : 0, transition: tr(s.delay) }}/>
          ) : (
            <circle key={i}
              cx={s.x + DOT_W / 2} cy="94" r={DOT_W / 2 - 0.5}
              fill="#261c08"
              style={{ opacity: active ? 1 : 0, transition: tr(s.delay) }}/>
          )
        ))}

        {/* ── TELEGRAPH KEY ── */}
        {/* Mahogany base */}
        <rect x="526" y="378" width="260" height="68" rx="5" fill="url(#tg-base)"/>
        <rect x="526" y="378" width="260" height="12" rx="4" fill="rgba(130,85,42,.38)"/>
        <rect x="526" y="440" width="260" height="6"  rx="3" fill="rgba(0,0,0,.38)"/>
        {/* Rubber feet */}
        <ellipse cx="558" cy="448" rx="13" ry="4.5" fill="#140e06"/>
        <ellipse cx="754" cy="448" rx="13" ry="4.5" fill="#140e06"/>

        {/* Pivot column */}
        <rect x="616" y="338" width="16" height="42" rx="3" fill="#543818"/>
        <rect x="616" y="338" width="16" height="8"  rx="2" fill="rgba(180,130,58,.38)"/>

        {/* Key arm */}
        <rect x="534" y="338" width="232" height="16" rx="4" fill="url(#tg-arm)"/>
        <rect x="534" y="338" width="232" height="5"  rx="3" fill="rgba(255,255,255,.16)"/>
        <rect x="534" y="349" width="232" height="5"  rx="0" fill="rgba(0,0,0,.12)"/>

        {/* Key knob */}
        <circle cx="752" cy="346" r="26" fill="#8c6820"/>
        <circle cx="752" cy="346" r="22" fill="url(#tg-knob)"/>
        <circle cx="745" cy="339" r="9"  fill="rgba(255,255,255,.18)"/>
        <circle cx="752" cy="346" r="6"  fill="#7a5018"/>

        {/* Pivot screw */}
        <circle cx="624" cy="340" r="7.5" fill="#a08840"/>
        <line x1="621" y1="340" x2="627" y2="340" stroke="#6a5828" strokeWidth="1.5"/>
        <line x1="624" y1="337" x2="624" y2="343" stroke="#6a5828" strokeWidth="1.5"/>

        {/* Spring coil */}
        {[355, 361, 367, 373].map(sy => (
          <line key={sy} x1="600" y1={sy} x2="644" y2={sy}
            stroke="#8a7030" strokeWidth="2.5" strokeLinecap="round"/>
        ))}

        {/* Contact point */}
        <rect x="584" y="354" width="16" height="6" rx="1" fill="#9a9880"/>
        <rect x="588" y="360" width="8"  height="10" rx="1" fill="#8a9868"/>
        <circle cx="592" cy="364" r="5.5" fill="#a0b090"/>
        <line x1="589" y1="364" x2="595" y2="364" stroke="#5c6050" strokeWidth="1.5"/>
        <line x1="592" y1="361" x2="592" y2="367" stroke="#5c6050" strokeWidth="1.5"/>

        {/* Terminal posts */}
        {[548, 752].map(tx => (
          <g key={tx}>
            <circle cx={tx} cy="420" r="10" fill="#b09050"/>
            <circle cx={tx} cy="418" r="7"  fill="#c8a860"/>
            {[-2,0,2].map(dx => (
              <line key={dx} x1={tx+dx} y1="410" x2={tx+dx} y2="415"
                stroke="rgba(0,0,0,.30)" strokeWidth="1"/>
            ))}
          </g>
        ))}

        {/* Wires */}
        <path d="M 762,420 Q 900,434 1050,426 Q 1120,422 1160,418"
          stroke="#122010" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M 762,420 Q 900,434 1050,426 Q 1120,422 1160,418"
          stroke="#1e3018" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M 538,420 Q 460,434 420,444 Q 390,452 370,460"
          stroke="#122010" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M 538,420 Q 460,434 420,444 Q 390,452 370,460"
          stroke="#1e3018" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* ── SOUNDER ── */}
        <rect x="1050" y="396" width="188" height="52" rx="4" fill="#1e1a0c"/>
        <rect x="1050" y="396" width="188" height="8"  rx="3" fill="#2c2810"/>
        {/* Coil housing */}
        <rect x="1072" y="352" width="144" height="48" rx="4" fill="url(#tg-coil)"/>
        {/* Coil windings */}
        {[358, 364, 370, 376, 382, 388].map(wy => (
          <line key={wy} x1="1078" y1={wy} x2="1210" y2={wy}
            stroke="#7a6830" strokeWidth="1.8" opacity="0.60"/>
        ))}
        {/* Armature */}
        <rect x="1088" y="344" width="112" height="10" rx="2" fill="#9c9078"/>
        {/* Posts */}
        <rect x="1090" y="330" width="10" height="18" rx="2" fill="#b0a278"/>
        <rect x="1188" y="330" width="10" height="18" rx="2" fill="#b0a278"/>
        {/* Tension spring */}
        <path d="M 1144,344 L 1144,337 L 1148,333 L 1140,328 L 1148,323"
          stroke="#989080" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Sounder terminal */}
        <circle cx="1160" cy="418" r="9"  fill="#b09050"/>
        <circle cx="1160" cy="416" r="6"  fill="#c8a860"/>

        {/* ── RECV INDICATOR ── */}
        <circle cx="1144" cy="462" r="7"  fill="#0c2010"/>
        <circle cx="1144" cy="462" r="4.5" fill="#18a828"
          style={{ opacity: active ? 0.9 : 0.12, transition: active ? "opacity .2s ease 0s" : "none" }}/>
        <text x="1157" y="466" fill="rgba(80,200,70,.48)"
          fontSize="9" fontFamily="monospace" letterSpacing="0.4">RECV</text>

        {/* ── DECODED TEXT ── */}
        {CHARS.map((c, i) => (
          <text key={i}
            x={CHAR_X_START + i * CHAR_STEP}
            y="492"
            fill="rgba(160,240,120,.82)"
            fontSize="22"
            fontFamily='"Courier New",Courier,monospace'
            fontWeight="bold"
            style={{ opacity: active ? 1 : 0, transition: tr(c.delay) }}>
            {c.ch}
          </text>
        ))}

        {/* ── CAPTION ── */}
        <text x="720" y="514" textAnchor="middle"
          fill="rgba(243,233,213,.13)" fontSize="9"
          fontFamily="monospace" letterSpacing="1.8"
          style={{ opacity: active ? 1 : 0, transition: "opacity .5s ease 5.8s" }}>
          TRANSMISSION COMPLETE · SHREWSBURY, MASSACHUSETTS
        </text>
      </svg>
    </div>
  );
}
