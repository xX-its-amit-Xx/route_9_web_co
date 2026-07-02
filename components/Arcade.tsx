"use client";

import { Gamepad2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { ArcadeSpeedTest } from "./ArcadeSpeedTest";
import { ArcadeBugSquash } from "./ArcadeBugSquash";
import { ArcadeStacker } from "./ArcadeStacker";
import { ARCADE } from "@/lib/content";

const GAME_COMPONENTS = {
  speed: ArcadeSpeedTest,
  bugs: ArcadeBugSquash,
  stacker: ArcadeStacker,
} as const;

function Cabinet({ game, index }: { game: (typeof ARCADE.games)[number]; index: number }) {
  const Game = GAME_COMPONENTS[game.key as keyof typeof GAME_COMPONENTS];
  return (
    <div className="reveal" style={{ transitionDelay: `${index * 130}ms` }}>
      <TiltCard intensity={3.5} className="h-full">
        <div
          className="relative flex flex-col h-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #241810 0%, #1A1008 55%, #15100A 100%)",
            border: "1px solid rgba(212,104,42,0.22)",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.4), 0 12px 40px rgba(0,0,0,0.5), 0 2px 0 rgba(255,200,120,0.06) inset, 0 -8px 24px rgba(0,0,0,0.35) inset",
          }}
        >
          {/* Marquee header */}
          <div
            className="relative px-4 pt-4 pb-3 text-center flex-shrink-0"
            style={{
              background: "linear-gradient(180deg, rgba(212,104,42,0.14) 0%, rgba(212,104,42,0.03) 100%)",
              borderBottom: "1px solid rgba(212,104,42,0.18)",
            }}
          >
            {/* Marquee glow */}
            <div
              aria-hidden
              className="absolute inset-x-8 top-0 h-8 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,104,42,0.28), transparent 70%)", filter: "blur(6px)" }}
            />
            <h3
              className="relative text-lg font-bold tracking-wide arcade-marquee-text"
              style={{ fontFamily: "var(--font-display)", color: "#F3E9D5" }}
            >
              {game.title}
            </h3>
            <p className="relative text-[10px] mt-0.5" style={{ color: "rgba(243,233,213,0.45)" }}>
              {game.tagline}
            </p>
          </div>

          {/* Screen bezel */}
          <div className="flex-1 p-3">
            <div
              className="h-full rounded-xl overflow-hidden flex flex-col"
              style={{
                border: "1px solid rgba(0,0,0,0.6)",
                boxShadow: "inset 0 2px 12px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <Game />
            </div>
          </div>

          {/* Control deck */}
          <div
            className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}
          >
            <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: "rgba(243,233,213,0.28)" }}>
              FREE PLAY · NO QUARTERS
            </span>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                color: "#E07838",
                background: "rgba(212,104,42,0.12)",
                border: "1px solid rgba(212,104,42,0.28)",
              }}
            >
              Lesson: {game.pillar}
            </span>
          </div>

          {/* Coin slot */}
          <div aria-hidden className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.55)", boxShadow: "0 1px 0 rgba(255,255,255,0.05)" }} />
        </div>
      </TiltCard>
    </div>
  );
}

export function Arcade() {
  const headingRef = useScrollReveal();
  const cabinetsRef = useScrollReveal(0.05);
  const footRef = useScrollReveal();
  const [headlineA, headlineB] = ARCADE.heading.split("\n");

  return (
    <section
      id="arcade"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#0E0905" }}
      aria-labelledby="arcade-heading"
    >
      {/* Ambient neon glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(90vw, 900px)",
          height: "420px",
          background: "radial-gradient(ellipse at 50% 30%, rgba(212,104,42,0.13) 0%, rgba(120,48,10,0.05) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Dot grid floor */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(212,104,42,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.05,
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-14 text-center">
          <div
            className="reveal inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: "1px solid rgba(212,104,42,0.3)",
              boxShadow: "0 0 20px rgba(212,104,42,0.15)",
            }}
          >
            <Gamepad2 size={12} style={{ color: "#D4682A" }} aria-hidden />
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: "rgba(243,233,213,0.6)" }}>
              {ARCADE.label}
            </span>
          </div>
          <h2
            id="arcade-heading"
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#F3E9D5", transitionDelay: "80ms" }}
          >
            {headlineA}
            <br />
            <span className="text-gradient italic">{headlineB}</span>
          </h2>
          <p
            className="reveal mx-auto max-w-2xl text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(243,233,213,0.55)", transitionDelay: "200ms" }}
          >
            {ARCADE.subhead}
          </p>
        </div>

        {/* Cabinets */}
        <div ref={cabinetsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 items-stretch">
          {ARCADE.games.map((game, i) => (
            <Cabinet key={game.key} game={game} index={i} />
          ))}
        </div>

        {/* Footnote — the wink */}
        <p
          ref={footRef}
          className="reveal mt-12 text-center text-sm italic mx-auto max-w-xl"
          style={{ color: "rgba(243,233,213,0.38)", fontFamily: "var(--font-display)" }}
        >
          {ARCADE.footnote}
        </p>
      </div>
    </section>
  );
}
