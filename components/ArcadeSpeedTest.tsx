"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, RotateCcw, Zap } from "lucide-react";
import { ARCADE } from "@/lib/content";

type Phase = "idle" | "loading" | "ready" | "result" | "tooSoon";

const GAME = ARCADE.games[0];

function rating(ms: number): string {
  if (ms < 260) return "Lightning reflexes";
  if (ms < 400) return "Sharp — faster than most of Route 9";
  if (ms < 620) return "Solidly human";
  return "Checking your phone, were you?";
}

export function ArcadeSpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const readyAt = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("r9-arcade-speed-best");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    if (stored) setBest(parseInt(stored, 10));
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const start = () => {
    setMs(null);
    setPhase("loading");
    const delay = 1400 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      readyAt.current = performance.now();
      setPhase("ready");
    }, delay);
  };

  const clickedTooSoon = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("tooSoon");
  };

  const clickedCall = () => {
    const t = Math.round(performance.now() - readyAt.current);
    setMs(t);
    setPhase("result");
    setBest((prev) => {
      const next = prev === null ? t : Math.min(prev, t);
      localStorage.setItem("r9-arcade-speed-best", String(next));
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2 h-2 rounded-full" style={{ background: "#E0563C" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#E0A03C" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#5CB85C" }} />
        </span>
        <span
          className="flex-1 text-center text-[10px] rounded-md py-0.5 px-2 truncate"
          style={{ background: "rgba(0,0,0,0.35)", color: "rgba(243,233,213,0.45)", fontFamily: "monospace" }}
        >
          arturos-pizzeria.com
        </span>
      </div>

      {/* Screen */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-5 py-6 overflow-hidden"
        style={{ background: "#15100A", minHeight: "280px" }}
        onPointerDown={phase === "loading" ? clickedTooSoon : undefined}
      >
        {phase === "idle" && (
          <div className="text-center">
            <Zap size={26} className="mx-auto mb-3" style={{ color: "#D4682A" }} aria-hidden />
            <p className="text-sm font-semibold mb-1.5" style={{ color: "#F3E9D5" }}>
              A hungry customer just tapped your site.
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(243,233,213,0.5)" }}>
              The moment the page loads, hit <strong style={{ color: "#E07838" }}>Call Now</strong> —
              like your dinner depends on it.
            </p>
            <button
              onClick={start}
              className="nav-cta-shimmer px-6 py-2.5 rounded-xl text-xs font-bold text-[#1C1209]"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4)",
              }}
            >
              Load the page
            </button>
            {best !== null && (
              <p className="mt-4 text-[10px] tracking-widest uppercase" style={{ color: "rgba(243,233,213,0.3)" }}>
                Your best: <span style={{ color: "#E07838" }}>{best}ms</span>
              </p>
            )}
          </div>
        )}

        {phase === "loading" && (
          <div className="w-full max-w-[240px]" aria-label="Page loading">
            {/* Skeleton blocks */}
            <div className="h-7 rounded-md mb-3 arcade-skeleton" style={{ width: "70%" }} />
            <div className="h-16 rounded-md mb-3 arcade-skeleton" style={{ animationDelay: "0.15s" }} />
            <div className="h-3 rounded mb-2 arcade-skeleton" style={{ width: "90%", animationDelay: "0.3s" }} />
            <div className="h-3 rounded mb-5 arcade-skeleton" style={{ width: "60%", animationDelay: "0.45s" }} />
            <div className="flex items-center justify-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(212,104,42,0.7)", borderTopColor: "transparent", animation: "demo-spinner 0.8s linear infinite" }}
                aria-hidden
              />
              <span className="text-[10px]" style={{ color: "rgba(243,233,213,0.4)" }}>loading…</span>
            </div>
          </div>
        )}

        {phase === "ready" && (
          <div className="w-full max-w-[240px] text-center arcade-pop-in">
            <p className="text-lg font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: "#F3E9D5" }}>
              Arturo&apos;s Pizzeria
            </p>
            <p className="text-[10px] mb-3" style={{ color: "rgba(243,233,213,0.45)" }}>
              Wood-fired · Route 9 · Open till 10
            </p>
            <div
              className="h-14 rounded-lg mb-4 flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(145deg, #2A1508, #1C1209)", border: "1px solid rgba(212,104,42,0.2)" }}
              aria-hidden
            >
              🍕
            </div>
            <button
              onClick={clickedCall}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-[#1C1209]"
              style={{
                background: "linear-gradient(145deg, #F08040 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.5), 0 6px 24px rgba(212,104,42,0.55)",
                animation: "arcade-call-pulse 0.9s ease-in-out infinite",
              }}
            >
              <Phone size={14} aria-hidden /> Call Now
            </button>
          </div>
        )}

        {phase === "tooSoon" && (
          <div className="text-center arcade-pop-in">
            <p className="text-3xl mb-2" aria-hidden>😅</p>
            <p className="text-sm font-bold mb-1" style={{ color: "#F3E9D5" }}>Still loading!</p>
            <p className="text-xs mb-5 leading-relaxed" style={{ color: "rgba(243,233,213,0.5)" }}>
              You tapped a blank page. Your customers do that too — then they leave.
            </p>
            <button
              onClick={start}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold"
              style={{ background: "rgba(243,233,213,0.08)", border: "1px solid rgba(243,233,213,0.15)", color: "#F3E9D5" }}
            >
              <RotateCcw size={12} aria-hidden /> Try again
            </button>
          </div>
        )}

        {phase === "result" && ms !== null && (
          <div className="text-center arcade-pop-in w-full">
            <p
              className="text-4xl font-extrabold mb-0.5 text-gradient"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {ms}ms
            </p>
            <p className="text-[11px] font-semibold mb-3" style={{ color: "rgba(243,233,213,0.65)" }}>
              {rating(ms)}
              {best !== null && ms <= best && <span style={{ color: "#E07838" }}> · new best!</span>}
            </p>
            <p
              className="text-[11px] leading-relaxed mb-4 mx-auto max-w-[250px] text-left rounded-lg p-3"
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
                      detail: { message: "Hi! The 3-Second Test got me — I want a site that loads fast." },
                    })
                  );
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1209]"
                style={{
                  background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                  boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 3px 12px rgba(212,104,42,0.35)",
                }}
              >
                Make mine fast
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
