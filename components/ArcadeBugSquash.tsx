"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ARCADE } from "@/lib/content";

type Phase = "idle" | "playing" | "over" | "down";

type BugKind = "beetle" | "fly" | "spider";

type Bug = {
  id: number;
  cell: number;
  kind: BugKind;
  bornAt: number;
  ttl: number;
  hp: number;
};

type Fx = {
  id: number;
  cell: number;
  kind: BugKind;
  label: string;
  escaped?: boolean;
};

const GAME = ARCADE.games[1];
const CELLS = ["LOGO", "NAV", "HERO", "MENU", "PHOTOS", "HOURS", "MAP", "REVIEWS", "CALL"] as const;
const GAME_SECONDS = 25;

const KIND_META: Record<
  BugKind,
  { points: number; hp: number; ttlStart: number; ttlEnd: number; damage: number; name: string }
> = {
  beetle: { points: 1, hp: 1, ttlStart: 2100, ttlEnd: 1350, damage: 14, name: "beetle" },
  fly: { points: 2, hp: 1, ttlStart: 1500, ttlEnd: 900, damage: 18, name: "fly" },
  spider: { points: 5, hp: 2, ttlStart: 2700, ttlEnd: 2000, damage: 26, name: "boss spider" },
};

const GOO: Record<BugKind, string> = {
  beetle: "rgba(212,104,42,0.9)",
  fly: "rgba(154,166,74,0.9)",
  spider: "rgba(192,74,44,0.92)",
};

/* ── Tiny website-component mockups drawn per cell ─────────────────── */

const CREAM = "rgba(243,233,213,0.34)";
const DIM = "rgba(243,233,213,0.16)";
const ORANGE = "rgba(224,120,56,0.6)";

function CellArt({ label }: { label: (typeof CELLS)[number] }) {
  const common = { width: "100%", height: "100%" } as const;
  switch (label) {
    case "LOGO":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <circle cx="15" cy="22" r="8.5" fill="none" stroke={ORANGE} strokeWidth="2.5" />
          <circle cx="15" cy="22" r="3.2" fill={ORANGE} />
          <rect x="30" y="15" width="26" height="5" rx="2.5" fill={CREAM} />
          <rect x="30" y="25" width="17" height="4" rx="2" fill={DIM} />
        </svg>
      );
    case "NAV":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <rect x="4" y="19" width="10" height="5" rx="2.5" fill={CREAM} />
          <rect x="17" y="19" width="10" height="5" rx="2.5" fill={DIM} />
          <rect x="30" y="19" width="10" height="5" rx="2.5" fill={DIM} />
          <rect x="45" y="16.5" width="15" height="10" rx="5" fill={ORANGE} />
        </svg>
      );
    case "HERO":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <rect x="6" y="5" width="52" height="19" rx="3" fill={DIM} />
          <circle cx="16" cy="12" r="3" fill={ORANGE} />
          <path d="M10 24 L22 13 L32 21 L44 10 L58 24 Z" fill="rgba(243,233,213,0.22)" />
          <rect x="8" y="29" width="30" height="4.5" rx="2" fill={CREAM} />
          <rect x="8" y="37" width="18" height="3" rx="1.5" fill={DIM} />
          <rect x="43" y="30" width="15" height="9" rx="4" fill={ORANGE} />
        </svg>
      );
    case "MENU":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          {[9, 20, 31].map((y, i) => (
            <g key={y}>
              <rect x="6" y={y} width={20 - i * 3} height="4" rx="2" fill={i === 0 ? CREAM : DIM} />
              <line x1="30" y1={y + 2} x2="46" y2={y + 2} stroke={DIM} strokeWidth="1.5" strokeDasharray="1.5 3" />
              <rect x="49" y={y} width="9" height="4" rx="2" fill={ORANGE} opacity="0.8" />
            </g>
          ))}
        </svg>
      );
    case "PHOTOS":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <rect x="6" y="4" width="25" height="17" rx="2.5" fill={DIM} />
          <circle cx="13" cy="10" r="2.5" fill={ORANGE} />
          <path d="M8 20 L16 12 L23 18 L28 13 L31 17 L31 21 L8 21 Z" fill="rgba(243,233,213,0.24)" />
          <rect x="34" y="4" width="25" height="17" rx="2.5" fill="rgba(243,233,213,0.1)" />
          <rect x="6" y="24" width="25" height="16" rx="2.5" fill="rgba(243,233,213,0.1)" />
          <rect x="34" y="24" width="25" height="16" rx="2.5" fill={DIM} />
        </svg>
      );
    case "HOURS":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <circle cx="16" cy="22" r="10.5" fill="none" stroke={CREAM} strokeWidth="2" />
          <line x1="16" y1="22" x2="16" y2="15" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="22" x2="21.5" y2="24.5" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
          <rect x="33" y="14" width="24" height="4.5" rx="2" fill={CREAM} />
          <rect x="33" y="24" width="17" height="3.5" rx="1.5" fill={DIM} />
        </svg>
      );
    case "MAP":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <rect x="6" y="5" width="52" height="34" rx="3" fill="rgba(243,233,213,0.06)" stroke={DIM} strokeWidth="1.5" />
          <path d="M6 30 C 20 27, 28 15, 58 12" fill="none" stroke={CREAM} strokeWidth="2.5" />
          <path d="M22 5 L30 39" fill="none" stroke={DIM} strokeWidth="2" />
          <path d="M40 13 a5.5 5.5 0 1 1 0.01 0 M40 18.5 L40 27" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="13" r="2" fill={ORANGE} />
        </svg>
      );
    case "REVIEWS":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d="M5 0 L6.4 3.4 L10 3.7 L7.3 6.1 L8.1 9.7 L5 7.8 L1.9 9.7 L2.7 6.1 L0 3.7 L3.6 3.4 Z"
              transform={`translate(${7 + i * 10.5} 8) scale(0.95)`}
              fill={i < 4 ? ORANGE : DIM}
            />
          ))}
          <rect x="8" y="24" width="40" height="3.5" rx="1.5" fill={DIM} />
          <rect x="8" y="31" width="28" height="3.5" rx="1.5" fill={DIM} />
        </svg>
      );
    case "CALL":
      return (
        <svg viewBox="0 0 64 44" style={common} aria-hidden>
          <rect x="10" y="14" width="44" height="16" rx="8" fill={ORANGE} />
          <path
            d="M20 19.5 c-1 4 3 8 7 7 l0.7-2.4 -2.6-1.3 -1.3 1.2 c-1.2-0.7-2-1.5-2.5-2.7 l1.1-1.3 -1.2-2.5 Z"
            fill="rgba(28,18,9,0.85)"
          />
          <rect x="31" y="20" width="17" height="4" rx="2" fill="rgba(28,18,9,0.55)" />
        </svg>
      );
  }
}

/* ── Inline SVG bugs with personality ──────────────────────────────── */

/* Shared gradient defs, rendered once (SVG url() refs resolve document-wide). */
function BugDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <radialGradient id="bs-g-beetle" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#D98A4A" />
          <stop offset="45%" stopColor="#9C5322" />
          <stop offset="100%" stopColor="#4A2510" />
        </radialGradient>
        <radialGradient id="bs-g-fly" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9DBA6A" />
          <stop offset="50%" stopColor="#5A7038" />
          <stop offset="100%" stopColor="#28351A" />
        </radialGradient>
        <radialGradient id="bs-g-spider" cx="40%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#6E4526" />
          <stop offset="55%" stopColor="#3E2412" />
          <stop offset="100%" stopColor="#180D05" />
        </radialGradient>
        <linearGradient id="bs-g-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(243,233,213,0.85)" />
          <stop offset="100%" stopColor="rgba(243,233,213,0.15)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BeetleArt() {
  return (
    <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden>
      {/* legs */}
      <g className="bs-legs-l" stroke="#2E1808" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M15 20 L6 15" />
        <path d="M14 27 L4 27" />
        <path d="M15 34 L6 40" />
      </g>
      <g className="bs-legs-r" stroke="#2E1808" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M33 20 L42 15" />
        <path d="M34 27 L44 27" />
        <path d="M33 34 L42 40" />
      </g>
      {/* antennae */}
      <path d="M20 11 C18 7, 15 5, 12 5" stroke="#2E1808" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M28 11 C30 7, 33 5, 36 5" stroke="#2E1808" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* head */}
      <circle cx="24" cy="13" r="5.5" fill="#331B0A" />
      <circle cx="22" cy="12" r="1.1" fill="#F3E9D5" opacity="0.85" />
      <circle cx="26" cy="12" r="1.1" fill="#F3E9D5" opacity="0.85" />
      {/* shell */}
      <ellipse cx="24" cy="28" rx="11" ry="14" fill="url(#bs-g-beetle)" />
      <line x1="24" y1="15.5" x2="24" y2="41" stroke="#2A1506" strokeWidth="1.4" opacity="0.7" />
      <circle cx="19" cy="23" r="1.6" fill="#2A1506" opacity="0.6" />
      <circle cx="29.5" cy="26" r="1.4" fill="#2A1506" opacity="0.6" />
      <circle cx="20" cy="33" r="1.4" fill="#2A1506" opacity="0.6" />
      <circle cx="29" cy="34.5" r="1.2" fill="#2A1506" opacity="0.6" />
      {/* gloss */}
      <ellipse cx="19.5" cy="20" rx="3.6" ry="5.5" fill="#F3E9D5" opacity="0.22" transform="rotate(-18 19.5 20)" />
    </svg>
  );
}

function FlyArt() {
  return (
    <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden>
      {/* wings — blur-flap via opacity */}
      <g className="bs-wing-l">
        <ellipse cx="12" cy="17" rx="11" ry="6" fill="url(#bs-g-wing)" transform="rotate(-28 12 17)" />
      </g>
      <g className="bs-wing-r">
        <ellipse cx="36" cy="17" rx="11" ry="6" fill="url(#bs-g-wing)" transform="rotate(28 36 17)" />
      </g>
      {/* legs */}
      <g className="bs-legs-l" stroke="#1C2410" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M18 30 L11 36" />
        <path d="M20 33 L15 40" />
      </g>
      <g className="bs-legs-r" stroke="#1C2410" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M30 30 L37 36" />
        <path d="M28 33 L33 40" />
      </g>
      {/* body */}
      <ellipse cx="24" cy="27" rx="8.5" ry="11" fill="url(#bs-g-fly)" />
      <line x1="17" y1="24" x2="31" y2="24" stroke="#1C2410" strokeWidth="1" opacity="0.55" />
      <line x1="17.5" y1="29" x2="30.5" y2="29" stroke="#1C2410" strokeWidth="1" opacity="0.55" />
      <ellipse cx="20.5" cy="21.5" rx="2.6" ry="4" fill="#F3E9D5" opacity="0.22" transform="rotate(-16 20.5 21.5)" />
      {/* head + big red eyes */}
      <circle cx="24" cy="12.5" r="5" fill="#33421E" />
      <circle cx="20.8" cy="11.5" r="2.6" fill="#B63A2A" />
      <circle cx="27.2" cy="11.5" r="2.6" fill="#B63A2A" />
      <circle cx="20.2" cy="10.7" r="0.9" fill="#F3E9D5" opacity="0.8" />
      <circle cx="26.6" cy="10.7" r="0.9" fill="#F3E9D5" opacity="0.8" />
    </svg>
  );
}

function SpiderArt({ hurt }: { hurt: boolean }) {
  return (
    <svg viewBox="0 0 56 52" width="44" height="41" aria-hidden>
      {/* 8 legs */}
      <g className="bs-legs-l" stroke="#20120A" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M20 22 C 12 16, 8 10, 7 4" />
        <path d="M18 27 C 9 24, 4 20, 2 15" />
        <path d="M18 32 C 9 34, 4 38, 3 44" />
        <path d="M20 36 C 14 42, 11 46, 10 50" />
      </g>
      <g className="bs-legs-r" stroke="#20120A" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M36 22 C 44 16, 48 10, 49 4" />
        <path d="M38 27 C 47 24, 52 20, 54 15" />
        <path d="M38 32 C 47 34, 52 38, 53 44" />
        <path d="M36 36 C 42 42, 45 46, 46 50" />
      </g>
      {/* abdomen with hourglass marking */}
      <circle cx="28" cy="31" r="13" fill="url(#bs-g-spider)" />
      <path d="M28 22 L32 28 L28 33 L24 28 Z" fill="#E07838" opacity="0.9" />
      <path d="M28 33 L31 38 L28 41.5 L25 38 Z" fill="#E07838" opacity="0.75" />
      <ellipse cx="22.5" cy="24.5" rx="3.4" ry="5" fill="#F3E9D5" opacity="0.16" transform="rotate(-20 22.5 24.5)" />
      {/* cracks when hurt — one more tap */}
      {hurt && (
        <g stroke="#F3E9D5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M21 26 L26 30 L23 35" />
          <path d="M35 25 L31 30 L35 34" />
        </g>
      )}
      {/* cephalothorax + eyes */}
      <circle cx="28" cy="15" r="7" fill="#2A160A" />
      <circle cx="25" cy="13.5" r="1.7" fill={hurt ? "#FF5A3C" : "#C0452C"} />
      <circle cx="31" cy="13.5" r="1.7" fill={hurt ? "#FF5A3C" : "#C0452C"} />
      <circle cx="26" cy="17" r="1" fill={hurt ? "#FF5A3C" : "#C0452C"} opacity="0.85" />
      <circle cx="30" cy="17" r="1" fill={hurt ? "#FF5A3C" : "#C0452C"} opacity="0.85" />
      {/* fangs */}
      <path d="M25.5 21 L24.5 24 M30.5 21 L31.5 24" stroke="#F3E9D5" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function BugArt({ kind, hurt }: { kind: BugKind; hurt: boolean }) {
  if (kind === "beetle") return <BeetleArt />;
  if (kind === "fly") return <FlyArt />;
  return <SpiderArt hurt={hurt} />;
}

function SplatBurst({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" className="bs-splat" aria-hidden>
      <g fill={color}>
        <path d="M24 14 C 30 13, 35 17, 34 23 C 39 24, 39 30, 34 31 C 34 37, 28 39, 24 36 C 19 40, 12 37, 13 31 C 8 30, 8 23, 13 22 C 12 16, 18 13, 24 14 Z" />
        <circle cx="8" cy="12" r="2.6" />
        <circle cx="39" cy="9" r="2.1" />
        <circle cx="42" cy="34" r="2.8" />
        <circle cx="7" cy="36" r="2.2" />
        <circle cx="24" cy="4" r="1.8" />
        <circle cx="23" cy="43" r="1.7" />
        <circle cx="44" cy="21" r="1.5" />
        <circle cx="3" cy="24" r="1.5" />
      </g>
      <ellipse cx="20" cy="21" rx="4" ry="2.6" fill="#F3E9D5" opacity="0.3" />
    </svg>
  );
}

function pickKind(elapsed: number, alive: Bug[]): BugKind {
  const r = Math.random();
  const spiderOut = alive.some((b) => b.kind === "spider");
  if (elapsed > 6 && !spiderOut && r < 0.12) return "spider";
  if (r < 0.46) return "fly";
  return "beetle";
}

/* ── Component ──────────────────────────────────────────────────────── */

export function ArcadeBugSquash() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [fx, setFx] = useState<Fx[]>([]);
  const [score, setScore] = useState(0);
  const [squashed, setSquashed] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [health, setHealth] = useState(100);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState<number | null>(null);
  const [shakeTick, setShakeTick] = useState(0);

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const startedAt = useRef(0);
  const nextSpawnAt = useRef(0);
  const idCounter = useRef(0);
  const bugsRef = useRef<Bug[]>([]);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const streakRef = useRef(0);
  const lastPointerHit = useRef<{ id: number; at: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("r9-arcade-bugs-best");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    if (stored) setBest(parseInt(stored, 10));
    const timeouts = timeoutsRef.current;
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  const stopLoop = () => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
  };

  const later = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  };

  const jolt = () => setShakeTick((t) => t + 1);

  const finish = (kind: "over" | "down") => {
    stopLoop();
    bugsRef.current = [];
    setBugs([]);
    setPhase(kind);
    const s = scoreRef.current;
    setBest((prev) => {
      const next = prev === null ? s : Math.max(prev, s);
      localStorage.setItem("r9-arcade-bugs-best", String(next));
      return next;
    });
  };

  const start = () => {
    scoreRef.current = 0;
    healthRef.current = 100;
    streakRef.current = 0;
    bugsRef.current = [];
    setScore(0);
    setSquashed(0);
    setEscaped(0);
    setHealth(100);
    setStreak(0);
    setBestStreak(0);
    setBugs([]);
    setFx([]);
    setShakeTick(0);
    setTimeLeft(GAME_SECONDS);
    setPhase("playing");
    startedAt.current = 0; // set on the first tick — keeps impure clock reads inside the loop

    loopRef.current = setInterval(() => {
      const now = performance.now();
      if (startedAt.current === 0) {
        startedAt.current = now;
        nextSpawnAt.current = now + 500;
      }
      const elapsed = (now - startedAt.current) / 1000;
      const remaining = Math.max(0, GAME_SECONDS - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) { finish("over"); return; }

      // Expire bugs that outlived their ttl — they "escaped" and damage the site
      const alive: Bug[] = [];
      let expired = 0;
      let damage = 0;
      for (const b of bugsRef.current) {
        if (now - b.bornAt > b.ttl) {
          expired++;
          damage += KIND_META[b.kind].damage;
          const escFx: Fx = { id: b.id, cell: b.cell, kind: b.kind, label: "ESCAPED", escaped: true };
          setFx((f) => [...f, escFx]);
          later(() => setFx((f) => f.filter((x) => x.id !== escFx.id)), 700);
        } else alive.push(b);
      }
      if (expired > 0) {
        setEscaped((e) => e + expired);
        streakRef.current = 0;
        setStreak(0);
        healthRef.current = Math.max(0, healthRef.current - damage);
        setHealth(healthRef.current);
        jolt();
        if (healthRef.current <= 0) {
          bugsRef.current = alive;
          setBugs(alive);
          finish("down");
          return;
        }
      }

      // Spawn: interval shrinks 1050ms → 530ms; per-kind ttl also shrinks
      const progress = elapsed / GAME_SECONDS;
      if (now >= nextSpawnAt.current && alive.length < 3) {
        const occupied = new Set(alive.map((b) => b.cell));
        const free = CELLS.map((_, i) => i).filter((i) => !occupied.has(i));
        if (free.length > 0) {
          const cell = free[Math.floor(Math.random() * free.length)];
          const kind = pickKind(elapsed, alive);
          const meta = KIND_META[kind];
          alive.push({
            id: ++idCounter.current,
            cell,
            kind,
            bornAt: now,
            ttl: meta.ttlStart - progress * (meta.ttlStart - meta.ttlEnd),
            hp: meta.hp,
          });
        }
        nextSpawnAt.current = now + (1050 - progress * 520);
      }
      bugsRef.current = alive;
      setBugs(alive);
    }, 90);
  };

  // Keyboard (Enter/Space) fires click, not pointerdown; a pointer tap fires
  // BOTH. We record the pointerdown hit and ignore the synthetic click that
  // follows for the same bug — otherwise one tap would count twice (which
  // would instantly kill a 2-hp spider). `at` is the event's timeStamp, so
  // both events are compared on the same clock.
  const hit = (bug: Bug, via: "pointer" | "click", at: number) => {
    if (via === "pointer") {
      lastPointerHit.current = { id: bug.id, at };
    } else {
      const r = lastPointerHit.current;
      if (r && r.id === bug.id && at - r.at < 500) return; // duplicate of pointerdown
    }

    const live = bugsRef.current.find((b) => b.id === bug.id);
    if (!live) return; // already squashed or escaped

    if (live.hp > 1) {
      // Boss spider: first tap cracks it
      const updated = bugsRef.current.map((b) => (b.id === bug.id ? { ...b, hp: b.hp - 1 } : b));
      bugsRef.current = updated;
      setBugs(updated);
      jolt();
      return;
    }

    const meta = KIND_META[live.kind];
    streakRef.current += 1;
    const mult = streakRef.current >= 3 ? 2 : 1;
    const pts = meta.points * mult;
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setSquashed((c) => c + 1);
    setStreak(streakRef.current);
    setBestStreak((b) => Math.max(b, streakRef.current));

    const updated = bugsRef.current.filter((b) => b.id !== bug.id);
    bugsRef.current = updated;
    setBugs(updated);

    const splat: Fx = { id: live.id, cell: live.cell, kind: live.kind, label: `+${pts}` };
    setFx((f) => [...f, splat]);
    later(() => setFx((f) => f.filter((x) => x.id !== splat.id)), 650);
    jolt();
  };

  const verdict =
    phase === "down"
      ? "The bugs took the whole site offline. Customers saw an error page."
      : escaped === 0
        ? "Perfect defense. The health inspector is impressed."
        : escaped < 4
          ? "Solid work — but a few got through to your customers."
          : "The site's crawling. Good thing this was practice.";

  const healthColor = health > 55 ? "#8FBF6A" : health > 25 ? "#E0A038" : "#E0563C";
  const shakeClass = shakeTick === 0 ? "" : shakeTick % 2 ? "bs-shake-a" : "bs-shake-b";

  return (
    <div className="flex flex-col h-full">
      <BugDefs />

      {/* Status bar */}
      <div
        className="flex-shrink-0 rounded-t-xl px-3 pt-2 pb-1.5"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider" style={{ color: "rgba(243,233,213,0.55)" }}>
          <span>SCORE <span style={{ color: "#E07838" }}>{score}</span></span>
          <span aria-live="polite">{phase === "playing" ? `0:${String(timeLeft).padStart(2, "0")}` : "0:25"}</span>
          <span>ESCAPED <span style={{ color: escaped > 0 ? "#E0563C" : "rgba(243,233,213,0.55)" }}>{escaped}</span></span>
        </div>
        {/* Site Health */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[8px] font-bold tracking-[0.14em] flex-shrink-0" style={{ color: "rgba(243,233,213,0.4)" }}>
            SITE HEALTH
          </span>
          <div
            className="flex-1 h-[5px] rounded-full overflow-hidden"
            style={{ background: "rgba(0,0,0,0.45)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)" }}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={health}
            aria-label="Site health"
          >
            <div
              className={health <= 25 && phase === "playing" ? "bs-health-low" : ""}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
                background: `linear-gradient(90deg, ${healthColor}, ${healthColor}cc)`,
                transform: `scaleX(${health / 100})`,
                transformOrigin: "left center",
                transition: "transform 0.25s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="relative flex-1 p-3 overflow-hidden" style={{ background: "#15100A", minHeight: "280px" }}>
        {/* ambient glow behind the board */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(212,104,42,0.09), transparent 70%)" }}
          aria-hidden
        />

        {/* Combo flame badge */}
        {phase === "playing" && streak >= 3 && (
          <div
            className="bs-combo absolute top-1.5 right-2.5 z-[5] flex items-center gap-1 px-2 py-1 rounded-full pointer-events-none"
            style={{ background: "rgba(212,104,42,0.18)", border: "1px solid rgba(224,120,56,0.5)" }}
            aria-label={`Combo x2, streak ${streak}`}
          >
            <svg viewBox="0 0 12 14" width="10" height="12" aria-hidden>
              <path d="M6 0 C7 3, 10 4, 10 8 A4.2 4.2 0 0 1 1.8 8 C1.8 6, 3 5.4, 3.4 4 C4.6 5, 5 5.6, 5 7 C6.2 5.6, 5.4 2.4, 6 0 Z" fill="#E07838" />
              <path d="M6 6 C6.8 8, 8 8.4, 8 10.4 A2.1 2.1 0 0 1 3.9 10.4 C3.9 8.8, 5.4 8, 6 6 Z" fill="#F3E9D5" opacity="0.85" />
            </svg>
            <span className="text-[10px] font-extrabold" style={{ color: "#F0A060" }}>×2</span>
            <span className="text-[9px] font-bold" style={{ color: "rgba(243,233,213,0.6)" }}>{streak}</span>
          </div>
        )}

        {/* ── Idle screen ── */}
        {phase === "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6" style={{ background: "rgba(21,16,10,0.94)" }}>
            <div className="mb-1.5" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))" }} aria-hidden>
              <BeetleArt />
            </div>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "#F3E9D5" }}>
              Bugs are invading the website.
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(243,233,213,0.5)" }}>
              Squash them before they take the site down. 25 seconds. They get faster.
            </p>
            <div className="flex items-center gap-3 mb-4 text-[9px] font-bold tracking-wider" style={{ color: "rgba(243,233,213,0.45)" }}>
              <span>BEETLE <span style={{ color: "#E07838" }}>1pt</span></span>
              <span aria-hidden style={{ opacity: 0.35 }}>·</span>
              <span>FLY <span style={{ color: "#E07838" }}>2pt</span></span>
              <span aria-hidden style={{ opacity: 0.35 }}>·</span>
              <span>SPIDER <span style={{ color: "#E07838" }}>5pt</span> ×2 taps</span>
            </div>
            <button
              onClick={start}
              className="nav-cta-shimmer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#1C1209]"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4)",
              }}
            >
              <Play size={12} aria-hidden /> Start shift
            </button>
            {best !== null && (
              <p className="mt-4 text-[10px] tracking-widest uppercase" style={{ color: "rgba(243,233,213,0.3)" }}>
                Your best: <span style={{ color: "#E07838" }}>{best} pts</span>
              </p>
            )}
          </div>
        )}

        {/* ── End screens ── */}
        {(phase === "over" || phase === "down") && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 arcade-pop-in" style={{ background: "rgba(21,16,10,0.96)" }}>
            {phase === "down" ? (
              <div className="relative mb-1" aria-label="Site down">
                <p className="bs-glitch-r absolute inset-0 text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#E0563C" }} aria-hidden>
                  SITE DOWN
                </p>
                <p className="bs-glitch-c absolute inset-0 text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#6AAFBF" }} aria-hidden>
                  SITE DOWN
                </p>
                <p className="bs-glitch-m relative text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#F3E9D5" }}>
                  SITE DOWN
                </p>
              </div>
            ) : (
              <p className="text-3xl font-extrabold mb-0.5 text-gradient" style={{ fontFamily: "var(--font-display)" }}>
                {score} pts
              </p>
            )}

            <div className="flex items-center gap-4 mb-2 text-[10px] font-bold tracking-wider" style={{ color: "rgba(243,233,213,0.55)" }}>
              <span>SQUASHED <span style={{ color: "#E07838" }}>{squashed}</span></span>
              <span>ESCAPED <span style={{ color: escaped > 0 ? "#E0563C" : "#E07838" }}>{escaped}</span></span>
              <span>BEST COMBO <span style={{ color: "#E07838" }}>×{bestStreak}</span></span>
            </div>
            <p className="text-[11px] font-semibold mb-3" style={{ color: "rgba(243,233,213,0.65)" }}>
              {verdict}
            </p>
            <p
              className="text-[11px] leading-relaxed mb-4 max-w-[260px] text-left rounded-lg p-3"
              style={{ color: "rgba(243,233,213,0.6)", background: "rgba(212,104,42,0.07)", border: "1px solid rgba(212,104,42,0.18)" }}
            >
              {GAME.lesson}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={start}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: "rgba(243,233,213,0.08)", border: "1px solid rgba(243,233,213,0.15)", color: "#F3E9D5" }}
              >
                <RotateCcw size={12} aria-hidden /> Again
              </button>
              <a
                href="#contact"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("r9:contact-prefill", {
                      detail: { message: "Hi! I played Bug Squash — I'd rather you hold the flyswatter. Tell me about the care plan." },
                    })
                  );
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1209]"
                style={{
                  background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                  boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 3px 12px rgba(212,104,42,0.35)",
                }}
              >
                You take the swatter
              </a>
            </div>
          </div>
        )}

        {/* ── 3D website slab ── */}
        <div className="relative h-full" style={{ perspective: "900px" }} aria-hidden={phase !== "playing"}>
          {/* shake wrapper is separate from the tilt element so the jolt
              animation doesn't stomp the rotateX transform */}
          <div className={`h-full ${shakeClass}`}>
            <div
              className="h-full rounded-xl p-2"
              style={{
                transform: "rotateX(27deg) scale(1.05)",
                transformOrigin: "50% 62%",
                background:
                  "repeating-linear-gradient(0deg, transparent 0 17px, rgba(224,120,56,0.05) 17px 18px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(224,120,56,0.045) 23px 24px), linear-gradient(165deg, #2A1C0D 0%, #1E150A 55%, #171008 100%)",
                border: "1px solid rgba(224,120,56,0.22)",
                borderTop: "1px solid rgba(243,233,213,0.22)",
                borderBottom: "6px solid rgba(0,0,0,0.6)",
                boxShadow:
                  "0 22px 34px -14px rgba(0,0,0,0.85), 0 10px 0 -4px #0B0703, 0 11px 0 -4px rgba(224,120,56,0.14), inset 0 1px 0 rgba(243,233,213,0.08)",
              }}
            >
              <div className="grid grid-cols-3 gap-1.5 h-full">
                {CELLS.map((label, i) => {
                  const bug = bugs.find((b) => b.cell === i);
                  const cellFx = fx.find((s) => s.cell === i);
                  const hurt = !!bug && bug.hp < KIND_META[bug.kind].hp;
                  return (
                    <div
                      key={label}
                      className="relative rounded-lg overflow-hidden select-none"
                      style={{
                        background: bug
                          ? "linear-gradient(155deg, rgba(224,86,60,0.18), rgba(224,86,60,0.07) 55%, rgba(0,0,0,0.18))"
                          : "linear-gradient(155deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025) 55%, rgba(0,0,0,0.14))",
                        border: bug ? "1px solid rgba(224,86,60,0.5)" : "1px solid rgba(243,233,213,0.1)",
                        boxShadow: bug
                          ? "inset 0 1px 0 rgba(243,233,213,0.1), inset 0 -3px 4px rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.45), 0 0 10px rgba(224,86,60,0.25)"
                          : "inset 0 1px 0 rgba(243,233,213,0.12), inset 0 -3px 4px rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.45)",
                        minHeight: "56px",
                        transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      {/* mini website-component mockup */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-1.5 pt-1 pb-0.5 pointer-events-none">
                        <div className="w-full flex-1 min-h-0" style={{ opacity: bug ? 0.4 : 0.85 }}>
                          <CellArt label={label} />
                        </div>
                        <span className="text-[7px] font-bold tracking-[0.18em] leading-none pb-0.5" style={{ color: "rgba(243,233,213,0.3)" }}>
                          {label}
                        </span>
                      </div>

                      {bug && (
                        <button
                          onPointerDown={(e) => hit(bug, "pointer", e.timeStamp)}
                          // Keyboard (Enter/Space) fires click, not pointerdown;
                          // hit() ignores the duplicate click after a pointer tap.
                          onClick={(e) => hit(bug, "click", e.timeStamp)}
                          className="absolute inset-0 z-[2] flex items-center justify-center cursor-pointer"
                          aria-label={`Squash ${KIND_META[bug.kind].name} on ${label}${hurt ? " — one more tap" : ""}`}
                          style={{ touchAction: "manipulation" }}
                        >
                          <span className="bs-enter" style={{ display: "inline-block" }}>
                            <span
                              className={`bs-sway ${hurt ? "bs-hurt" : ""}`}
                              style={{ display: "inline-block", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.6))" }}
                            >
                              <BugArt kind={bug.kind} hurt={hurt} />
                            </span>
                          </span>
                        </button>
                      )}

                      {cellFx && (
                        <span className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none" aria-hidden>
                          {!cellFx.escaped && (
                            <>
                              {/* the squashed bug flattens before vanishing */}
                              <span className="bs-flat absolute" style={{ display: "inline-block" }}>
                                <BugArt kind={cellFx.kind} hurt={false} />
                              </span>
                              <SplatBurst color={GOO[cellFx.kind]} />
                            </>
                          )}
                          <span
                            className="bs-pop absolute text-[11px] font-extrabold tracking-wide"
                            style={{ color: cellFx.escaped ? "#E0563C" : "#FFD9A0", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
                          >
                            {cellFx.label}
                          </span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component-scoped animation styles. Animate transform/opacity only.
          The site's global prefers-reduced-motion kill-switch snaps these to
          their end states, leaving bugs fully visible and the game playable. */}
      <style>{`
        @keyframes bs-enter {
          0%   { opacity: 0; transform: scale(0.2, 0.35); }
          55%  { opacity: 1; transform: scale(1.22, 0.78); }
          80%  { transform: scale(0.92, 1.1); }
          100% { opacity: 1; transform: scale(1, 1); }
        }
        .bs-enter { animation: bs-enter 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both; }

        @keyframes bs-sway {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50%      { transform: rotate(6deg) translateY(-1.5px); }
        }
        .bs-sway { animation: bs-sway 0.55s ease-in-out infinite; }

        @keyframes bs-legs {
          from { transform: rotate(-6deg); }
          to   { transform: rotate(6deg); }
        }
        .bs-legs-l, .bs-legs-r {
          animation: bs-legs 0.22s ease-in-out infinite alternate;
          transform-box: fill-box;
        }
        .bs-legs-l { transform-origin: 85% 50%; }
        .bs-legs-r { transform-origin: 15% 50%; animation-delay: -0.11s; }
        .bs-hurt .bs-legs-l, .bs-hurt .bs-legs-r { animation-duration: 0.09s; }

        @keyframes bs-flap {
          from { opacity: 0.9; }
          to   { opacity: 0.22; }
        }
        .bs-wing-l, .bs-wing-r { animation: bs-flap 0.13s linear infinite alternate; }
        .bs-wing-r { animation-delay: -0.065s; }

        @keyframes bs-hurt-flash {
          0%, 100% { opacity: 1; }
          20%      { opacity: 0.3; }
          45%      { opacity: 1; }
          70%      { opacity: 0.45; }
        }
        .bs-hurt { animation: bs-hurt-flash 0.34s ease-out 1; }

        @keyframes bs-splat-burst {
          0%   { opacity: 1; transform: scale(0.25) rotate(-8deg); }
          55%  { opacity: 1; transform: scale(1.12) rotate(3deg); }
          100% { opacity: 0; transform: scale(1.3) rotate(3deg); }
        }
        .bs-splat { animation: bs-splat-burst 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes bs-flatten {
          0%   { opacity: 1; transform: translateY(0) scale(1, 1); }
          100% { opacity: 0; transform: translateY(7px) scale(1.25, 0.12); }
        }
        .bs-flat { animation: bs-flatten 0.3s ease-out both; }

        @keyframes bs-pop-up {
          0%   { opacity: 0; transform: translateY(5px) scale(0.6); }
          22%  { opacity: 1; transform: translateY(0) scale(1.08); }
          100% { opacity: 0; transform: translateY(-20px) scale(1); }
        }
        .bs-pop { animation: bs-pop-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* two identical shake keyframe sets so alternating classes restart it */
        @keyframes bs-shake-1 {
          0%, 100% { transform: translate(0, 0); }
          25%      { transform: translate(2.5px, -2px); }
          50%      { transform: translate(-2.5px, 1.5px); }
          75%      { transform: translate(1.5px, 2px); }
        }
        @keyframes bs-shake-2 {
          0%, 100% { transform: translate(0, 0); }
          25%      { transform: translate(-2.5px, -2px); }
          50%      { transform: translate(2.5px, 1.5px); }
          75%      { transform: translate(-1.5px, 2px); }
        }
        .bs-shake-a { animation: bs-shake-1 0.18s linear 1; }
        .bs-shake-b { animation: bs-shake-2 0.18s linear 1; }

        @keyframes bs-combo-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.12); }
        }
        .bs-combo { animation: bs-combo-pulse 0.7s ease-in-out infinite; }

        @keyframes bs-health-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        .bs-health-low { animation: bs-health-blink 0.55s ease-in-out infinite; }

        /* SITE DOWN glitch — offset color layers flicker via transform/opacity */
        @keyframes bs-glitch-red {
          0%, 100% { opacity: 0.5;  transform: translate(2px, 0); }
          28%      { opacity: 0.12; transform: translate(-2px, 1px); }
          55%      { opacity: 0.6;  transform: translate(3px, -1px); }
          80%      { opacity: 0.2;  transform: translate(-1px, 0); }
        }
        @keyframes bs-glitch-cyan {
          0%, 100% { opacity: 0.4;  transform: translate(-2px, 1px); }
          33%      { opacity: 0.65; transform: translate(2px, -1px); }
          60%      { opacity: 0.15; transform: translate(-3px, 0); }
          85%      { opacity: 0.5;  transform: translate(1px, 1px); }
        }
        @keyframes bs-glitch-main {
          0%, 88%, 100% { opacity: 1; }
          90%           { opacity: 0.55; }
          94%           { opacity: 0.85; }
        }
        .bs-glitch-r { animation: bs-glitch-red 1.1s steps(2, jump-none) infinite; }
        .bs-glitch-c { animation: bs-glitch-cyan 1.3s steps(2, jump-none) infinite; }
        .bs-glitch-m { animation: bs-glitch-main 1.7s step-end infinite; }
      `}</style>
    </div>
  );
}
