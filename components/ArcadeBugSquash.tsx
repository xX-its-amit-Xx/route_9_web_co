"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ARCADE } from "@/lib/content";

type Phase = "idle" | "playing" | "over";

type Bug = {
  id: number;
  cell: number;
  bornAt: number;
  ttl: number;
};

type Splat = { id: number; cell: number };

const GAME = ARCADE.games[1];
const CELLS = ["LOGO", "NAV", "HERO", "MENU", "PHOTOS", "HOURS", "MAP", "REVIEWS", "CALL"] as const;
const GAME_SECONDS = 25;

export function ArcadeBugSquash() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [splats, setSplats] = useState<Splat[]>([]);
  const [score, setScore] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState<number | null>(null);

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const nextSpawnAt = useRef(0);
  const idCounter = useRef(0);
  const bugsRef = useRef<Bug[]>([]);

  useEffect(() => {
    bugsRef.current = bugs;
  }, [bugs]);

  useEffect(() => {
    const stored = localStorage.getItem("r9-arcade-bugs-best");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    if (stored) setBest(parseInt(stored, 10));
    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, []);

  const stopLoop = () => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
  };

  const start = () => {
    setScore(0);
    setEscaped(0);
    setBugs([]);
    setSplats([]);
    setTimeLeft(GAME_SECONDS);
    setPhase("playing");
    startedAt.current = performance.now();
    nextSpawnAt.current = performance.now() + 500;

    loopRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - startedAt.current) / 1000;
      const remaining = Math.max(0, GAME_SECONDS - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        stopLoop();
        setBugs([]);
        setPhase("over");
        setScore((s) => {
          setBest((prev) => {
            const next = prev === null ? s : Math.max(prev, s);
            localStorage.setItem("r9-arcade-bugs-best", String(next));
            return next;
          });
          return s;
        });
        return;
      }

      // Expire bugs that outlived their ttl — they "escaped"
      const alive: Bug[] = [];
      let expired = 0;
      for (const b of bugsRef.current) {
        if (now - b.bornAt > b.ttl) expired++;
        else alive.push(b);
      }
      if (expired > 0) setEscaped((e) => e + expired);

      // Spawn: interval shrinks 1100ms → 550ms, bugs live 1600ms → 950ms
      const progress = elapsed / GAME_SECONDS;
      if (now >= nextSpawnAt.current && alive.length < 3) {
        const occupied = new Set(alive.map((b) => b.cell));
        const free = CELLS.map((_, i) => i).filter((i) => !occupied.has(i));
        if (free.length > 0) {
          const cell = free[Math.floor(Math.random() * free.length)];
          alive.push({
            id: ++idCounter.current,
            cell,
            bornAt: now,
            ttl: 1600 - progress * 650,
          });
        }
        nextSpawnAt.current = now + (1100 - progress * 550);
      }
      setBugs(alive);
    }, 90);
  };

  const squash = (bug: Bug) => {
    setBugs((prev) => {
      if (!prev.some((b) => b.id === bug.id)) return prev; // already gone
      setScore((s) => s + 1);
      setSplats((sp) => [...sp, { id: bug.id, cell: bug.cell }]);
      setTimeout(() => {
        setSplats((sp) => sp.filter((s) => s.id !== bug.id));
      }, 380);
      return prev.filter((b) => b.id !== bug.id);
    });
  };

  const verdict =
    escaped === 0
      ? "Perfect defense. The health inspector is impressed."
      : escaped < 4
        ? "Solid work — but a few got through to your customers."
        : "The site's crawling. Good thing this was practice.";

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-xl text-[10px] font-bold tracking-wider flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(243,233,213,0.55)" }}
      >
        <span>SQUASHED <span style={{ color: "#E07838" }}>{score}</span></span>
        <span aria-live="polite">{phase === "playing" ? `0:${String(timeLeft).padStart(2, "0")}` : "0:25"}</span>
        <span>ESCAPED <span style={{ color: escaped > 0 ? "#E0563C" : "rgba(243,233,213,0.55)" }}>{escaped}</span></span>
      </div>

      {/* Screen */}
      <div className="relative flex-1 p-3" style={{ background: "#15100A", minHeight: "280px" }}>
        {phase === "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6" style={{ background: "rgba(21,16,10,0.94)" }}>
            <p className="text-2xl mb-2" aria-hidden>🪰</p>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "#F3E9D5" }}>
              Bugs are invading the website.
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(243,233,213,0.5)" }}>
              Squash them before they reach your customers. 25 seconds. They get faster.
            </p>
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
                Your best: <span style={{ color: "#E07838" }}>{best} squashed</span>
              </p>
            )}
          </div>
        )}

        {phase === "over" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 arcade-pop-in" style={{ background: "rgba(21,16,10,0.96)" }}>
            <p className="text-3xl font-extrabold mb-0.5 text-gradient" style={{ fontFamily: "var(--font-display)" }}>
              {score} squashed
            </p>
            <p className="text-[11px] font-semibold mb-3" style={{ color: "rgba(243,233,213,0.65)" }}>
              {escaped} escaped · {verdict}
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

        {/* Website grid */}
        <div className="grid grid-cols-3 gap-2 h-full" aria-hidden={phase !== "playing"}>
          {CELLS.map((label, i) => {
            const bug = bugs.find((b) => b.cell === i);
            const splat = splats.find((s) => s.cell === i);
            return (
              <div
                key={label}
                className="relative rounded-lg flex items-center justify-center overflow-hidden select-none"
                style={{
                  background: bug
                    ? "rgba(224,86,60,0.12)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
                  border: bug ? "1px solid rgba(224,86,60,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  minHeight: "56px",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
              >
                <span className="text-[8px] font-bold tracking-[0.18em]" style={{ color: "rgba(243,233,213,0.28)" }}>
                  {label}
                </span>

                {bug && (
                  <button
                    onPointerDown={() => squash(bug)}
                    // Keyboard (Enter/Space) fires click, not pointerdown; squash()
                    // ignores the duplicate when both fire for a pointer tap.
                    onClick={() => squash(bug)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    aria-label={`Squash bug on ${label}`}
                    style={{ touchAction: "manipulation" }}
                  >
                    <span
                      className="text-xl arcade-bug-wiggle"
                      style={{ display: "inline-block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
                      aria-hidden
                    >
                      🐛
                    </span>
                  </button>
                )}

                {splat && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                    <svg viewBox="0 0 40 40" width="38" height="38" className="arcade-splat">
                      <g fill="rgba(212,104,42,0.85)">
                        <circle cx="20" cy="20" r="7" />
                        <circle cx="9" cy="14" r="2.4" />
                        <circle cx="31" cy="12" r="2" />
                        <circle cx="30" cy="29" r="2.6" />
                        <circle cx="10" cy="30" r="2" />
                        <circle cx="21" cy="6" r="1.8" />
                        <circle cx="20" cy="34" r="1.6" />
                      </g>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
