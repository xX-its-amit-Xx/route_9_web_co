"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Check, Play, RotateCcw } from "lucide-react";
import { ARCADE } from "@/lib/content";

type Phase = "idle" | "building" | "graded";

type BlockKey = "name" | "call" | "menu" | "hours" | "gallery";

type Block = {
  key: BlockKey;
  label: string;
  emoji: string;
  why: string;
};

const GAME = ARCADE.games[2];

// The conversion-optimized order a hungry customer actually needs.
const IDEAL: BlockKey[] = ["name", "call", "menu", "hours", "gallery"];

const BLOCKS: Record<BlockKey, Block> = {
  name: {
    key: "name",
    label: "Shop name & photo",
    emoji: "🏪",
    why: "First: am I in the right place? Your name and storefront answer it in half a second.",
  },
  call: {
    key: "call",
    label: "Tap-to-call button",
    emoji: "📞",
    why: "Second: the #1 action, where a thumb can reach it without scrolling.",
  },
  menu: {
    key: "menu",
    label: "Menu & prices",
    emoji: "📋",
    why: "Third: hungry people want the menu before the glamour shots. Always.",
  },
  hours: {
    key: "hours",
    label: "Hours & directions",
    emoji: "🕐",
    why: "Fourth: 'are they open right now?' is the question that decides the visit.",
  },
  gallery: {
    key: "gallery",
    label: "Photo gallery",
    emoji: "📸",
    why: "Last: photos seal the deal — after the practical questions are answered.",
  },
};

function shuffled(): BlockKey[] {
  const arr = [...IDEAL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Never deal the deck already in perfect order
  if (arr.every((k, i) => k === IDEAL[i])) [arr[0], arr[1]] = [arr[1], arr[0]];
  return arr;
}

/* ── Confetti burst geometry (deterministic — no render-time randomness) ── */
const CONFETTI_COLORS = ["#E07838", "#F3E9D5", "#5CB85C", "#F0A060", "#C0392B"];
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: 10 + ((i * 89) % 78),
  top: 28 + ((i * 31) % 24),
  dx: ((i * 53) % 120) - 60,
  dy: ((i * 37) % 100) - 74,
  rz: ((i * 97) % 520) - 260,
  delay: (i % 6) * 45,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  round: i % 3 === 0,
}));

/* ── Shared SVG gradients (rendered once, referenced by every MiniArt) ── */
function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
      <defs>
        <linearGradient id="r9s-gOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EE8A44" />
          <stop offset="1" stopColor="#B05020" />
        </linearGradient>
        <linearGradient id="r9s-gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56381E" />
          <stop offset="1" stopColor="#2B1A0E" />
        </linearGradient>
        <linearGradient id="r9s-gCream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7EFDC" />
          <stop offset="1" stopColor="#E3D2AC" />
        </linearGradient>
        <linearGradient id="r9s-gPhoto" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A5330" />
          <stop offset="1" stopColor="#35220F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Miniature website-block art, one drawing per piece ── */
const ART: Record<BlockKey, ReactNode> = {
  name: (
    <g>
      <rect x="0" y="0" width="96" height="32" fill="url(#r9s-gSky)" />
      <rect x="0" y="13" width="96" height="19" fill="#31220F" />
      <rect x="0" y="13" width="96" height="1.2" fill="rgba(255,255,255,0.08)" />
      {/* hanging sign */}
      <rect x="28" y="1.6" width="40" height="6.2" rx="1.8" fill="#1D130A" stroke="#D4682A" strokeWidth="0.7" />
      <text x="48" y="6.4" textAnchor="middle" fontSize="4.2" fontWeight="700" letterSpacing="1.2" fill="#F0A060">
        LUIGI&apos;S
      </text>
      {/* striped awning with scallops */}
      <rect x="4" y="8.5" width="88" height="5.5" rx="1.4" fill="url(#r9s-gOrange)" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={8 + i * 10} cy={13.4} r={3} fill={i % 2 ? "#F3E9D5" : "#D4682A"} />
      ))}
      {/* glowing windows */}
      <rect x="9" y="17.5" width="22" height="10.5" rx="1.4" fill="#F5B865" opacity="0.9" />
      <rect x="65" y="17.5" width="22" height="10.5" rx="1.4" fill="#F5B865" opacity="0.9" />
      <line x1="20" y1="17.5" x2="20" y2="28" stroke="#31220F" strokeWidth="1" />
      <line x1="76" y1="17.5" x2="76" y2="28" stroke="#31220F" strokeWidth="1" />
      {/* door */}
      <rect x="41" y="16" width="14" height="16" rx="1.6" fill="#20150B" stroke="#D4682A" strokeWidth="0.8" />
      <rect x="43.5" y="18.5" width="9" height="6" rx="1" fill="#F5B865" opacity="0.55" />
      <circle cx="52.5" cy="26.5" r="0.9" fill="#E8B36A" />
    </g>
  ),
  call: (
    <g>
      <rect x="0" y="0" width="96" height="32" fill="#231710" />
      <rect x="7" y="6" width="82" height="20" rx="10" fill="url(#r9s-gOrange)" stroke="rgba(255,220,180,0.5)" strokeWidth="0.8" />
      <rect x="11" y="8" width="74" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" />
      <g transform="translate(15 10) scale(0.5)">
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
          fill="#25150A"
        />
      </g>
      <text x="55" y="19.6" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="1" fill="#25150A">
        CALL NOW
      </text>
    </g>
  ),
  menu: (
    <g>
      <rect x="0" y="0" width="96" height="32" fill="url(#r9s-gCream)" />
      <rect x="6" y="3" width="20" height="4" rx="2" fill="#B05020" />
      {([26, 30, 22] as const).map((w, i) => {
        const y0 = 10.5 + i * 7;
        return (
          <g key={i}>
            <circle cx="9" cy={y0 + 1.4} r="2.1" fill="#E8B36A" stroke="#B05020" strokeWidth="0.6" />
            <rect x="14" y={y0} width={w} height="2.8" rx="1.4" fill="#4A3520" />
            <line x1={16 + w} y1={y0 + 1.5} x2="73" y2={y0 + 1.5} stroke="#B89B6E" strokeWidth="1" strokeDasharray="1.4 2" />
            <rect x="76" y={y0 - 0.7} width="14" height="4.2" rx="2.1" fill="#D4682A" />
            <rect x="79" y={y0 + 0.7} width="8" height="1.2" rx="0.6" fill="#FFE9C4" />
          </g>
        );
      })}
    </g>
  ),
  hours: (
    <g>
      <rect x="0" y="0" width="96" height="32" fill="#231710" />
      {/* clock */}
      <circle cx="17" cy="16" r="9.5" fill="url(#r9s-gCream)" stroke="#D4682A" strokeWidth="1.4" />
      <circle cx="17" cy="7.6" r="0.7" fill="#B05020" />
      <circle cx="25.4" cy="16" r="0.7" fill="#B05020" />
      <circle cx="17" cy="24.4" r="0.7" fill="#B05020" />
      <circle cx="8.6" cy="16" r="0.7" fill="#B05020" />
      <line x1="17" y1="16" x2="17" y2="10.2" stroke="#3A2818" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="16" x2="21.6" y2="17.4" stroke="#3A2818" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="16" r="0.9" fill="#B05020" />
      {/* open chip + hour lines */}
      <rect x="32" y="6" width="27" height="7" rx="3.5" fill="rgba(92,184,92,0.16)" stroke="#5CB85C" strokeWidth="0.8" />
      <circle cx="36.5" cy="9.5" r="1.3" fill="#5CB85C" />
      <text x="49" y="11.4" textAnchor="middle" fontSize="4.6" fontWeight="800" letterSpacing="0.6" fill="#8FD98F">
        OPEN
      </text>
      <rect x="32" y="17" width="26" height="2.4" rx="1.2" fill="rgba(243,233,213,0.55)" />
      <rect x="32" y="21.5" width="19" height="2.4" rx="1.2" fill="rgba(243,233,213,0.32)" />
      {/* map pin */}
      <path
        d="M79 6.5c-4.1 0-7.4 3.3-7.4 7.4 0 5.5 7.4 12.6 7.4 12.6s7.4-7.1 7.4-12.6c0-4.1-3.3-7.4-7.4-7.4z"
        fill="url(#r9s-gOrange)"
        stroke="#FFD9B0"
        strokeWidth="0.7"
      />
      <circle cx="79" cy="13.8" r="2.7" fill="#F3E9D5" />
    </g>
  ),
  gallery: (
    <g>
      <rect x="0" y="0" width="96" height="32" fill="#231710" />
      {/* photo 1 — sunset ridge */}
      <rect x="4" y="4.5" width="27.5" height="23" rx="2" fill="url(#r9s-gPhoto)" />
      <circle cx="12" cy="11" r="2.6" fill="#F5C878" />
      <path d="M6 25 L13 15.5 L17.5 21 L22 13.5 L29.5 25 Z" fill="#241505" opacity="0.85" />
      <rect x="4" y="4.5" width="27.5" height="23" rx="2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
      {/* photo 2 — pizza */}
      <rect x="34.5" y="4.5" width="27" height="23" rx="2" fill="#3A2413" />
      <circle cx="48" cy="16" r="8" fill="#E8B36A" stroke="#B4571E" strokeWidth="2" />
      <circle cx="45.2" cy="13.6" r="1.4" fill="#B03A2A" />
      <circle cx="51" cy="14.6" r="1.4" fill="#B03A2A" />
      <circle cx="47.6" cy="19" r="1.4" fill="#B03A2A" />
      <rect x="34.5" y="4.5" width="27" height="23" rx="2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
      {/* photo 3 — espresso on the counter */}
      <rect x="65" y="4.5" width="27" height="23" rx="2" fill="url(#r9s-gPhoto)" />
      <rect x="65" y="21" width="27" height="6.5" rx="2" fill="#2A1A0C" />
      <rect x="74" y="13.5" width="8.5" height="8" rx="1.6" fill="#F3E9D5" />
      <path d="M82.5 15 h1.6 a2.2 2.2 0 0 1 0 4.4 h-1.6" fill="none" stroke="#F3E9D5" strokeWidth="1.2" />
      <path d="M76.5 12 c0-1.4 1.2-1.4 1.2-2.8 M79.8 12 c0-1.4 1.2-1.4 1.2-2.8" fill="none" stroke="rgba(243,233,213,0.6)" strokeWidth="0.9" strokeLinecap="round" />
      <rect x="65" y="4.5" width="27" height="23" rx="2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    </g>
  ),
};

function MiniArt({ k }: { k: BlockKey }) {
  return (
    <svg viewBox="0 0 96 32" className="block w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      {ART[k]}
    </svg>
  );
}

export function ArcadeStacker() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deck, setDeck] = useState<BlockKey[]>([]);
  const [placed, setPlaced] = useState<BlockKey[]>([]);
  const [best, setBest] = useState<number | null>(null);
  const [bump, setBump] = useState(0); // phone impact-nudge trigger
  const [revealed, setRevealed] = useState(0); // staggered grading reveal (0..5)
  const [showResult, setShowResult] = useState(false);
  const [shownScore, setShownScore] = useState(0); // count-up on the result panel
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("r9-arcade-stacker-best");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    if (stored) setBest(parseInt(stored, 10));
  }, []);

  const start = () => {
    setDeck(shuffled());
    setPlaced([]);
    setBump(0);
    setRevealed(0);
    setShowResult(false);
    setShownScore(0);
    setCelebrate(false);
    setPhase("building");
  };

  const place = (key: BlockKey) => {
    const nextPlaced = [...placed, key];
    setDeck((d) => d.filter((k) => k !== key));
    setPlaced(nextPlaced);
    setBump((b) => b + 1);
    if (nextPlaced.length === IDEAL.length) {
      setPhase("graded");
      const score = nextPlaced.filter((k, i) => k === IDEAL[i]).length;
      setBest((prev) => {
        const next = prev === null ? score : Math.max(prev, score);
        localStorage.setItem("r9-arcade-stacker-best", String(next));
        return next;
      });
    }
  };

  // Grading timeline: stamps thunk in one-by-one, then the result panel pops.
  useEffect(() => {
    if (phase !== "graded") return;
    const timers: number[] = [];
    for (let i = 0; i < IDEAL.length; i++) {
      timers.push(window.setTimeout(() => setRevealed(i + 1), 500 + i * 340));
    }
    const resultAt = 500 + IDEAL.length * 340 + 160;
    timers.push(window.setTimeout(() => setShowResult(true), resultAt));
    if (placed.every((k, i) => k === IDEAL[i])) {
      timers.push(window.setTimeout(() => setCelebrate(true), resultAt + 180));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, placed]);

  // Score counts up once the panel is visible.
  useEffect(() => {
    if (!showResult) return;
    const target = placed.filter((k, i) => k === IDEAL[i]).length;
    if (target === 0) return;
    let n = 0;
    const iv = window.setInterval(() => {
      n += 1;
      setShownScore(n);
      if (n >= target) window.clearInterval(iv);
    }, 120);
    return () => window.clearInterval(iv);
  }, [showResult, placed]);

  const score = placed.filter((k, i) => k === IDEAL[i]).length;
  const firstMiss = placed.findIndex((k, i) => k !== IDEAL[i]);
  const runningScore = placed.slice(0, revealed).filter((k, i) => k === IDEAL[i]).length;

  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes r9s-fly {
          0%   { opacity: 0; transform: translate(52px, -30px) rotate(6deg) scale(1.15, 1.15); }
          55%  { opacity: 1; transform: translate(0px, 3px) rotate(-1deg) scale(1.06, 0.85); }
          75%  { transform: translate(0px, -2px) rotate(0.6deg) scale(0.96, 1.07); }
          100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1, 1); }
        }
        .r9s-fly { animation: r9s-fly 0.42s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes r9s-nudge-a { 0%, 100% { transform: translateY(0) rotate(0); } 40% { transform: translateY(2.5px) rotate(0.5deg); } }
        @keyframes r9s-nudge-b { 0%, 100% { transform: translateY(0) rotate(0); } 40% { transform: translateY(2.5px) rotate(0.5deg); } }

        @keyframes r9s-stamp {
          0%   { opacity: 0; transform: rotate(-10deg) scale(2.3); }
          62%  { opacity: 1; transform: rotate(-10deg) scale(0.88); }
          82%  { transform: rotate(-10deg) scale(1.08); }
          100% { opacity: 1; transform: rotate(-10deg) scale(1); }
        }
        .r9s-stamp { animation: r9s-stamp 0.34s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes r9s-burst {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(0deg); }
          12%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1) rotate(var(--rz)); }
        }
        .r9s-confetti {
          position: absolute; width: 6px; height: 9px; pointer-events: none;
          animation: r9s-burst 1.05s cubic-bezier(0.18, 0.7, 0.4, 1) both;
        }

        @keyframes r9s-hired {
          0%   { opacity: 0; transform: translate(-50%, -50%) rotate(-7deg) scale(2.6); }
          55%  { opacity: 1; transform: translate(-50%, -50%) rotate(-7deg) scale(0.9); }
          75%  { transform: translate(-50%, -50%) rotate(-7deg) scale(1.07); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(-7deg) scale(1); }
        }
        .r9s-hired { animation: r9s-hired 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes r9s-thumbscroll {
          0%, 100% { transform: translateY(0); opacity: 0.85; }
          50%      { transform: translateY(-30px); opacity: 1; }
        }
        .r9s-thumb { animation: r9s-thumbscroll 1.7s ease-in-out 0.4s infinite; }

        .r9s-card { transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1); will-change: transform; }
        .r9s-card:hover { transform: perspective(400px) translateY(-3px) rotateX(8deg) rotateZ(-0.8deg) scale(1.035); }
        .r9s-card:active { transform: scale(0.95); }
        .r9s-card:focus-visible { outline: 2px solid #E07838; outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          .r9s-thumb, .r9s-confetti { display: none; }
          .r9s-fly, .r9s-stamp, .r9s-hired { animation: none; }
          .r9s-card { transition: none; }
        }
      `}</style>
      <ArtDefs />

      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-xl text-[10px] font-bold tracking-wider flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(243,233,213,0.55)" }}
      >
        <span>YOUR CUSTOMER IS HUNGRY</span>
        <span>{phase === "graded" ? `${showResult ? score : runningScore}/5` : `${placed.length}/5`}</span>
      </div>

      {/* Screen */}
      <div className="relative flex-1 p-3" style={{ background: "#15100A", minHeight: "280px" }}>
        {phase === "idle" && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6" style={{ background: "rgba(21,16,10,0.94)" }}>
            <p className="text-2xl mb-2" aria-hidden>🏗️</p>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "#F3E9D5" }}>
              Build a pizzeria&apos;s homepage.
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(243,233,213,0.5)" }}>
              Tap the five pieces in the order a hungry customer needs them — top of the page first.
            </p>
            <button
              onClick={start}
              className="nav-cta-shimmer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#1C1209]"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4)",
              }}
            >
              <Play size={12} aria-hidden /> Start building
            </button>
            {best !== null && (
              <p className="mt-4 text-[10px] tracking-widest uppercase" style={{ color: "rgba(243,233,213,0.3)" }}>
                Your best: <span style={{ color: "#E07838" }}>{best}/5</span>
              </p>
            )}
          </div>
        )}

        {/* Win celebration: confetti burst + HIRED! stamp over the phone */}
        {celebrate && (
          <div aria-hidden className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {CONFETTI.map((p, i) => (
              <span
                key={i}
                className="r9s-confetti"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  background: p.color,
                  borderRadius: p.round ? "50%" : "1.5px",
                  animationDelay: `${p.delay}ms`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--rz": `${p.rz}deg`,
                } as CSSProperties}
              />
            ))}
            <div
              className="r9s-hired absolute"
              style={{
                left: "26%",
                top: "42%",
                padding: "3px 14px",
                borderRadius: "8px",
                background: "linear-gradient(145deg, #E07838, #B05020)",
                border: "2px solid #F3E9D5",
                boxShadow: "0 6px 18px rgba(0,0,0,0.5), 0 0 26px rgba(212,104,42,0.55)",
                color: "#FFF4E2",
                fontFamily: "var(--font-display)",
                fontSize: "19px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              HIRED!
            </div>
          </div>
        )}

        <div className="flex gap-3 h-full">
          {/* ── The 3D phone ── */}
          <div className="relative flex-shrink-0 w-[46%]" style={{ perspective: "700px" }}>
            {/* soft ground shadow */}
            <div
              aria-hidden
              className="absolute left-1/2 -bottom-1 pointer-events-none"
              style={{
                width: "82%",
                height: "12px",
                transform: "translateX(-55%)",
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, transparent 68%)",
                filter: "blur(3px)",
              }}
            />
            <div className="relative h-full" style={{ transformStyle: "preserve-3d", transform: "rotateY(-9deg) rotateX(2.5deg)" }}>
              {/* left body edge (the side we see thanks to the rotateY) */}
              <div
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  left: "-4px",
                  top: "8px",
                  bottom: "10px",
                  width: "4.5px",
                  borderRadius: "5px 0 0 5px",
                  background: "linear-gradient(180deg, #52402C 0%, #241A10 40%, #171009 100%)",
                  boxShadow: "-2px 0 6px rgba(0,0,0,0.5)",
                }}
              />
              {/* phone body — nudges on each landing (parity trick re-triggers the keyframe) */}
              <div
                className="relative h-full rounded-[16px] p-[5px] pb-[7px] flex flex-col"
                style={{
                  background: "linear-gradient(155deg, #453626 0%, #2A1F14 35%, #1B130B 100%)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow:
                    "0 14px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18), inset -2px 0 4px rgba(0,0,0,0.45)",
                  animation: bump > 0 ? `${bump % 2 ? "r9s-nudge-a" : "r9s-nudge-b"} 0.32s ease-out 0.14s` : undefined,
                }}
              >
                {/* screen */}
                <div
                  className="relative flex-1 rounded-[12px] overflow-hidden flex flex-col"
                  style={{ background: "linear-gradient(170deg, #100B07 0%, #0B0704 100%)", border: "1px solid rgba(0,0,0,0.8)" }}
                >
                  {/* camera notch */}
                  <div
                    aria-hidden
                    className="absolute top-[3px] left-1/2 z-20 flex items-center justify-center"
                    style={{ transform: "translateX(-50%)", width: "34px", height: "7px", borderRadius: "4px", background: "#050302" }}
                  >
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#1E2A38", boxShadow: "0 0 2px rgba(90,140,200,0.8)" }} />
                  </div>

                  {/* stacked website blocks */}
                  <div className="relative z-0 flex-1 flex flex-col gap-1 px-1 pb-1 pt-3.5">
                    {placed.map((key, i) => {
                      const correct = key === IDEAL[i];
                      const isRevealed = phase === "graded" && revealed > i;
                      return (
                        <div
                          key={key}
                          className={`relative flex-1 min-h-0 rounded-[5px] overflow-hidden ${i === placed.length - 1 && revealed === 0 ? "r9s-fly" : ""}`}
                          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <MiniArt k={key} />
                          {isRevealed && (
                            <div
                              aria-hidden
                              className="absolute inset-0 rounded-[5px] pointer-events-none"
                              style={{ boxShadow: `inset 0 0 0 1.5px ${correct ? "rgba(105,190,105,0.9)" : "rgba(224,160,60,0.9)"}` }}
                            />
                          )}
                          {isRevealed &&
                            (correct ? (
                              <span
                                aria-hidden
                                className="r9s-stamp absolute top-0.5 right-1 z-10 inline-flex items-center justify-center w-5 h-5 rounded-full"
                                style={{ background: "#2E7D32", border: "1.5px solid #A5D6A7", color: "#EAF5EA", boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
                              >
                                <Check size={11} strokeWidth={3.5} />
                              </span>
                            ) : (
                              <span
                                aria-hidden
                                className="r9s-stamp absolute top-0.5 right-1 z-10 text-[7px] font-extrabold px-1.5 py-0.5 rounded"
                                style={{
                                  background: "#8A5A18",
                                  border: "1.5px solid #E0A03C",
                                  color: "#FFE9C4",
                                  letterSpacing: "0.08em",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                                }}
                              >
                                ↕ SWAP
                              </span>
                            ))}
                        </div>
                      );
                    })}
                    {Array.from({ length: IDEAL.length - placed.length }, (_, j) => {
                      const isNext = j === 0 && phase === "building";
                      return (
                        <div
                          key={`empty-${j}`}
                          className="flex-1 min-h-0 rounded-[5px] flex items-center justify-center"
                          style={{
                            border: isNext ? "1.5px dashed rgba(212,104,42,0.55)" : "1px dashed rgba(255,255,255,0.08)",
                            background: isNext ? "rgba(212,104,42,0.06)" : "transparent",
                          }}
                          aria-hidden
                        >
                          {isNext && (
                            <span className="text-[7px] font-bold tracking-widest" style={{ color: "rgba(212,104,42,0.7)" }}>
                              NEXT
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* screen lights up on a perfect build */}
                  <div
                    aria-hidden
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 50% 18%, rgba(240,170,90,0.28), transparent 70%)",
                      opacity: celebrate ? 1 : 0,
                      transition: "opacity 0.6s ease",
                    }}
                  />
                  {/* diagonal glass glare */}
                  <div
                    aria-hidden
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(112deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 24%, transparent 42%)" }}
                  />
                  {/* the happy customer's thumb, scrolling */}
                  {celebrate && (
                    <div aria-hidden className="r9s-thumb absolute bottom-2 right-1.5 z-20 text-sm" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}>
                      👆
                    </div>
                  )}
                </div>
                {/* home indicator */}
                <div aria-hidden className="mx-auto mt-[3px] w-8 h-[3px] rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.22)" }} />
              </div>
            </div>
          </div>

          {/* ── Deck / grading / results ── */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {phase === "building" &&
              deck.map((key) => (
                <button
                  key={key}
                  onClick={() => place(key)}
                  className="r9s-card flex items-center gap-2 rounded-lg p-1.5 pr-2 text-left"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.13)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    className="flex-shrink-0 w-16 rounded-md overflow-hidden"
                    style={{ height: "26px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 2px 5px rgba(0,0,0,0.4)" }}
                    aria-hidden
                  >
                    <MiniArt k={key} />
                  </span>
                  <span className="text-[9.5px] font-semibold leading-tight" style={{ color: "#F3E9D5" }}>
                    {BLOCKS[key].label}
                  </span>
                </button>
              ))}

            {phase === "graded" && !showResult && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1.5">
                <span className="text-lg" aria-hidden>🧐</span>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(243,233,213,0.45)" }}>
                  Customer checking…
                </p>
              </div>
            )}

            {phase === "graded" && showResult && (
              <div className="arcade-pop-in overflow-y-auto pr-0.5">
                <p className="text-xl font-extrabold mb-1 text-gradient" style={{ fontFamily: "var(--font-display)" }}>
                  {shownScore}/5{score === 5 && shownScore === 5 ? " — hired!" : ""}
                </p>
                <p className="text-[10px] leading-relaxed mb-2" style={{ color: "rgba(243,233,213,0.6)" }}>
                  {score === 5
                    ? "You already think like a designer. The order on the left is exactly how I build it."
                    : firstMiss >= 0
                      ? BLOCKS[IDEAL[firstMiss]].why
                      : ""}
                </p>
                <p
                  className="text-[10px] leading-relaxed mb-3 rounded-lg p-2.5"
                  style={{ color: "rgba(243,233,213,0.6)", background: "rgba(212,104,42,0.07)", border: "1px solid rgba(212,104,42,0.18)" }}
                >
                  {GAME.lesson}
                </p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={start}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold"
                    style={{ background: "rgba(243,233,213,0.08)", border: "1px solid rgba(243,233,213,0.15)", color: "#F3E9D5" }}
                  >
                    <RotateCcw size={10} aria-hidden /> Rebuild
                  </button>
                  <a
                    href="#contact"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("r9:contact-prefill", {
                          detail: { message: "Hi! I played Storefront Stacker — I'd like my site built in the right order." },
                        })
                      );
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-[10px] font-bold text-[#1C1209]"
                    style={{
                      background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                      boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 3px 12px rgba(212,104,42,0.35)",
                    }}
                  >
                    Build mine right
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
