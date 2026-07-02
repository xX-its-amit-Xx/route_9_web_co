"use client";

import { useEffect, useState } from "react";
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

/** Miniature render of a website block inside the phone mockup */
function MiniBlock({ block, state }: { block: Block; state: "neutral" | "right" | "wrong" }) {
  const border =
    state === "right" ? "1px solid rgba(92,184,92,0.5)"
    : state === "wrong" ? "1px solid rgba(224,160,60,0.5)"
    : "1px solid rgba(255,255,255,0.09)";
  return (
    <div
      className="flex items-center gap-2 rounded-md px-2.5 py-2 stacker-drop"
      style={{
        background: block.key === "call"
          ? "linear-gradient(145deg, rgba(224,120,56,0.28), rgba(176,80,32,0.22))"
          : "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
        border,
      }}
    >
      <span className="text-sm leading-none" aria-hidden>{block.emoji}</span>
      <span className="text-[9px] font-semibold truncate" style={{ color: "rgba(243,233,213,0.75)" }}>
        {block.label}
      </span>
      {state === "right" && <Check size={10} strokeWidth={3} className="ml-auto flex-shrink-0" style={{ color: "#5CB85C" }} aria-hidden />}
      {state === "wrong" && <span className="ml-auto text-[8px] font-bold flex-shrink-0" style={{ color: "#E0A03C" }} aria-hidden>↕</span>}
    </div>
  );
}

export function ArcadeStacker() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deck, setDeck] = useState<BlockKey[]>([]);
  const [placed, setPlaced] = useState<BlockKey[]>([]);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("r9-arcade-stacker-best");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    if (stored) setBest(parseInt(stored, 10));
  }, []);

  const start = () => {
    setDeck(shuffled());
    setPlaced([]);
    setPhase("building");
  };

  const place = (key: BlockKey) => {
    const nextPlaced = [...placed, key];
    setDeck((d) => d.filter((k) => k !== key));
    setPlaced(nextPlaced);
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

  const score = placed.filter((k, i) => k === IDEAL[i]).length;
  const firstMiss = placed.findIndex((k, i) => k !== IDEAL[i]);

  return (
    <div className="flex flex-col h-full">
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-xl text-[10px] font-bold tracking-wider flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(243,233,213,0.55)" }}
      >
        <span>YOUR CUSTOMER IS HUNGRY</span>
        <span>{phase === "graded" ? `${score}/5` : `${placed.length}/5`}</span>
      </div>

      {/* Screen */}
      <div className="relative flex-1 p-3" style={{ background: "#15100A", minHeight: "280px" }}>
        {phase === "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6" style={{ background: "rgba(21,16,10,0.94)" }}>
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

        <div className="flex gap-3 h-full">
          {/* Phone mockup */}
          <div
            className="flex-shrink-0 w-[46%] rounded-xl p-1.5 flex flex-col"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
          >
            <div className="mx-auto mb-1 w-8 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} aria-hidden />
            <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
              {placed.map((key, i) => (
                <MiniBlock
                  key={key}
                  block={BLOCKS[key]}
                  state={phase === "graded" ? (key === IDEAL[i] ? "right" : "wrong") : "neutral"}
                />
              ))}
              {placed.length < 5 && phase === "building" && (
                <div
                  className="rounded-md flex items-center justify-center py-2"
                  style={{ border: "1px dashed rgba(212,104,42,0.35)", background: "rgba(212,104,42,0.04)" }}
                  aria-hidden
                >
                  <span className="text-[8px] font-bold tracking-widest" style={{ color: "rgba(212,104,42,0.6)" }}>
                    NEXT PIECE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Deck / results */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {phase === "building" && deck.map((key) => (
              <button
                key={key}
                onClick={() => place(key)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-left transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <span className="text-base leading-none" aria-hidden>{BLOCKS[key].emoji}</span>
                <span className="text-[10px] font-semibold" style={{ color: "#F3E9D5" }}>
                  {BLOCKS[key].label}
                </span>
              </button>
            ))}

            {phase === "graded" && (
              <div className="arcade-pop-in overflow-y-auto pr-0.5">
                <p className="text-xl font-extrabold mb-1 text-gradient" style={{ fontFamily: "var(--font-display)" }}>
                  {score}/5{score === 5 ? " — hired!" : ""}
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
