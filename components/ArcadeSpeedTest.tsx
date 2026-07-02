"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { ARCADE } from "@/lib/content";

type Phase = "idle" | "loading" | "ready" | "result" | "tooSoon";

const GAME = ARCADE.games[0];

function rating(ms: number): string {
  if (ms < 260) return "Lightning reflexes";
  if (ms < 400) return "Sharp — faster than most of Route 9";
  if (ms < 620) return "Solidly human";
  return "Checking your phone, were you?";
}

// Ember burst particles — deterministic fan-out, re-mounted each result.
const EMBERS = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  const dist = 58 + ((i * 37) % 42);
  return {
    tx: Math.round(Math.cos(a) * dist * 1.5),
    ty: Math.round(Math.sin(a) * dist - 34),
    rot: ((i * 53) % 200) - 100,
    delay: (i % 5) * 45,
    size: 4 + (i % 3) * 2,
    color: ["#F0A030", "#E07838", "#F3E9D5", "#FFD780"][i % 4],
    round: i % 2 === 0,
  };
});

const MARQUEE_BULBS = [0, 1, 2, 3, 4, 5, 6] as const;

export function ArcadeSpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [delay, setDelay] = useState(2400);
  const [served, setServed] = useState(0);
  const [walked, setWalked] = useState(0);
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
    setRound((r) => r + 1);
    const d = 1400 + Math.random() * 2000;
    setDelay(d);
    setPhase("loading");
    timerRef.current = setTimeout(() => {
      readyAt.current = performance.now();
      setPhase("ready");
    }, d);
  };

  const clickedTooSoon = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWalked((n) => n + 1);
    setPhase("tooSoon");
  };

  const clickedCall = () => {
    if (phase !== "ready") return;
    const t = Math.round(performance.now() - readyAt.current);
    setMs(t);
    setServed((n) => n + 1);
    setPhase("result");
    setBest((prev) => {
      const next = prev === null ? t : Math.min(prev, t);
      localStorage.setItem("r9-arcade-speed-best", String(next));
      return next;
    });
  };

  const customerVisible = phase !== "idle";
  const meterRunning = phase === "loading" || phase === "ready";

  return (
    <div className="relative flex flex-col h-full select-none" style={{ background: "#15100A", touchAction: "manipulation" }}>
      <style>{`
        @keyframes ast-flame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.92; }
          30%      { transform: scaleY(1.16) scaleX(0.92); opacity: 1; }
          62%      { transform: scaleY(0.86) scaleX(1.08); opacity: 0.78; }
        }
        @keyframes ast-glow {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.85; }
        }
        @keyframes ast-sway {
          0%, 100% { transform: rotate(-1.7deg); }
          50%      { transform: rotate(1.7deg); }
        }
        @keyframes ast-walk-in {
          0%   { transform: translateX(-120px); opacity: 0; }
          18%  { opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes ast-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes ast-drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        @keyframes ast-shimmer {
          from { transform: translateX(-130%); }
          to   { transform: translateX(330%); }
        }
        @keyframes ast-pop {
          0%   { transform: scale(0.9); opacity: 0; }
          70%  { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ast-flash {
          from { opacity: 0.95; }
          to   { opacity: 0; }
        }
        @keyframes ast-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes ast-jump {
          0%, 100% { transform: translateY(0); }
          22%      { transform: translateY(-15px); }
          44%      { transform: translateY(0); }
          62%      { transform: translateY(-7px); }
          80%      { transform: translateY(0); }
        }
        @keyframes ast-shake {
          0%, 100% { transform: rotate(0deg); }
          20%      { transform: rotate(-9deg); }
          40%      { transform: rotate(8deg); }
          60%      { transform: rotate(-6deg); }
          80%      { transform: rotate(4deg); }
        }
        @keyframes ast-armup {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-26deg); }
        }
        @keyframes ast-burst {
          from { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          to   { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.4); opacity: 0; }
        }
        @keyframes ast-bulb {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        .ast-entry-walk { animation: ast-walk-in 0.85s cubic-bezier(0.25, 0.8, 0.4, 1) both; }
        .ast-pose-bob   { animation: ast-bob 0.7s ease-in-out infinite 0.85s; }
        .ast-pose-jump  { animation: ast-jump 1s cubic-bezier(0.3, 0, 0.4, 1) both; }
        .ast-headshake  { animation: ast-shake 0.7s ease-in-out both; }
      `}</style>

      {/* ── Scoreboard HUD strip ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-3 py-1.5 flex-shrink-0 text-[9px] font-bold tracking-[0.18em] uppercase"
        style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(212,104,42,0.18)", color: "rgba(243,233,213,0.4)" }}
      >
        <span>
          Best{" "}
          <span style={{ color: "#E07838" }}>{best !== null ? `${best}ms` : "——"}</span>
        </span>
        <span>
          Served <span style={{ color: "#8CC868" }}>{served}</span>
          <span style={{ opacity: 0.5 }}> · </span>
          Walked <span style={{ color: "#E0563C" }}>{walked}</span>
        </span>
      </div>

      {/* ── Game world ───────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: "280px" }}>
        <span role="status" className="sr-only">
          {phase === "idle" && "Ready to play. Press Seat the customer to start."}
          {phase === "loading" && "The pizzeria page is loading. Wait for it."}
          {phase === "ready" && "Page loaded! Tap Call Now."}
          {phase === "result" && ms !== null && `You reacted in ${ms} milliseconds.`}
          {phase === "tooSoon" && "Too soon — the page was still loading."}
        </span>

        {/* Layered SVG pizzeria scene */}
        <svg
          viewBox="0 0 420 300"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="astWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#311B0C" />
              <stop offset="100%" stopColor="#1B0F06" />
            </linearGradient>
            <linearGradient id="astFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C2512" />
              <stop offset="100%" stopColor="#211205" />
            </linearGradient>
            <linearGradient id="astDome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A05E38" />
              <stop offset="55%" stopColor="#7A4224" />
              <stop offset="100%" stopColor="#5A2E16" />
            </linearGradient>
            <linearGradient id="astCounterTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8E5C2E" />
              <stop offset="100%" stopColor="#6A401C" />
            </linearGradient>
            <linearGradient id="astCounterFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#543014" />
              <stop offset="100%" stopColor="#3A1F0C" />
            </linearGradient>
            <radialGradient id="astOvenGlow" cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#FFB050" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#F07828" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#F07828" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="astRim" cx="0%" cy="55%" r="75%">
              <stop offset="0%" stopColor="#F08030" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#F08030" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="astVignette" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="62%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </radialGradient>
            <linearGradient id="astSign" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5A3416" />
              <stop offset="100%" stopColor="#41230C" />
            </linearGradient>
          </defs>

          {/* ── BACKGROUND: wall, brick hints, menu board, sign, lights ── */}
          <rect x="0" y="0" width="420" height="226" fill="url(#astWall)" />
          {[64, 96, 128, 160].map((y) => (
            <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#0F0803" strokeWidth="1" opacity="0.28" />
          ))}
          {[52, 210, 348].map((x, i) => (
            <line key={i} x1={x} y1={64} x2={x} y2={96} stroke="#0F0803" strokeWidth="1" opacity="0.22" />
          ))}

          {/* Chalk menu board (right wall, behind the phone) */}
          <g opacity="0.85">
            <rect x="300" y="58" width="96" height="72" rx="4" fill="#171009" stroke="#4A2E14" strokeWidth="3" />
            <text x="348" y="74" textAnchor="middle" fontSize="9" fill="#E8D8B8" opacity="0.75" fontFamily="var(--font-display)" fontStyle="italic">
              Menu
            </text>
            {[84, 94, 104, 114].map((y, i) => (
              <line key={y} x1="310" y1={y} x2={i % 2 === 0 ? 384 : 368} y2={y} stroke="#E8D8B8" strokeWidth="2" opacity="0.22" strokeLinecap="round" />
            ))}
          </g>

          {/* String lights draped across the top */}
          <path d="M0,14 Q105,34 210,18 Q315,4 420,26" fill="none" stroke="#0E0803" strokeWidth="1.5" opacity="0.8" />
          {[
            { x: 42, y: 22 }, { x: 118, y: 29 }, { x: 186, y: 21 }, { x: 262, y: 13 }, { x: 338, y: 15 }, { x: 400, y: 23 },
          ].map((b, i) => (
            <g key={i}>
              <circle cx={b.x} cy={b.y + 6} r="6" fill="#FFC878" opacity="0.14" />
              <circle
                cx={b.x} cy={b.y + 6} r="2.4" fill="#FFC878"
                style={i % 2 === 0 ? { animation: `ast-glow ${2.2 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` } : { opacity: 0.85 }}
              />
            </g>
          ))}

          {/* Hanging sign: ARTURO'S */}
          <g style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: "ast-sway 4.5s ease-in-out infinite" }}>
            <line x1="180" y1="16" x2="184" y2="42" stroke="#0E0803" strokeWidth="1.5" />
            <line x1="244" y1="14" x2="240" y2="42" stroke="#0E0803" strokeWidth="1.5" />
            <rect x="156" y="42" width="112" height="34" rx="5" fill="url(#astSign)" stroke="rgba(212,104,42,0.45)" strokeWidth="1" />
            <rect x="159" y="45" width="106" height="13" rx="3" fill="#F08030" opacity="0.08" />
            <text x="212" y="60" textAnchor="middle" fontSize="15" fontWeight="700" fill="#F3E9D5" fontFamily="var(--font-display)">
              Arturo&apos;s
            </text>
            <text x="212" y="71" textAnchor="middle" fontSize="6" letterSpacing="3" fill="#E8A060" opacity="0.85">
              PIZZERIA
            </text>
          </g>

          {/* ── MIDGROUND: wood-fired oven (left) ── */}
          <g>
            {/* chimney */}
            <rect x="80" y="58" width="30" height="40" fill="#4C2A14" />
            <rect x="76" y="54" width="38" height="8" rx="2" fill="#5C351A" />
            {/* dome */}
            <path d="M32,180 Q32,96 95,92 Q158,96 158,180 Z" fill="url(#astDome)" />
            <path d="M44,168 Q46,108 95,102" fill="none" stroke="#C88850" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
            <path d="M40,180 Q40,120 74,104" fill="none" stroke="#40200E" strokeWidth="1.2" opacity="0.5" />
            <path d="M150,180 Q150,120 116,104" fill="none" stroke="#40200E" strokeWidth="1.2" opacity="0.5" />
            {/* base */}
            <rect x="28" y="178" width="134" height="60" fill="#4E2C16" />
            <line x1="28" y1="196" x2="162" y2="196" stroke="#331A0A" strokeWidth="1.5" opacity="0.7" />
            <line x1="28" y1="216" x2="162" y2="216" stroke="#331A0A" strokeWidth="1.5" opacity="0.7" />
            {[58, 100, 138].map((x) => (
              <line key={x} x1={x} y1="196" x2={x} y2="216" stroke="#331A0A" strokeWidth="1.2" opacity="0.5" />
            ))}
            {/* mouth */}
            <path d="M58,180 Q58,126 95,124 Q132,126 132,180 Z" fill="#0A0401" />
            <path d="M58,180 Q58,126 95,124 Q132,126 132,180" fill="none" stroke="#2A1206" strokeWidth="3" />
            {/* flames (transform-origin at their base) */}
            <ellipse cx="95" cy="178" rx="32" ry="12" fill="url(#astOvenGlow)" style={{ animation: "ast-glow 1.6s ease-in-out infinite" }} />
            <path
              d="M74,178 Q70,158 82,146 Q84,160 88,164 Q90,150 95,142 Q100,152 102,162 Q106,154 108,148 Q118,160 114,178 Z"
              fill="#E05818"
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "ast-flame 0.9s ease-in-out infinite" }}
            />
            <path
              d="M82,178 Q80,162 90,152 Q92,164 95,166 Q98,158 101,152 Q110,162 106,178 Z"
              fill="#F08828"
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "ast-flame 0.7s ease-in-out 0.2s infinite" }}
            />
            <path
              d="M88,178 Q88,168 94,162 Q97,168 100,164 Q104,170 101,178 Z"
              fill="#FFC868"
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "ast-flame 0.55s ease-in-out 0.1s infinite" }}
            />
            {/* hearth lip + occlusion shadow */}
            <rect x="24" y="236" width="142" height="8" rx="2" fill="#3A2010" />
            <rect x="24" y="244" width="142" height="4" fill="#000" opacity="0.3" />
            {/* firewood stack */}
            <g>
              <circle cx="176" cy="232" r="6" fill="#5A3418" stroke="#3A2010" strokeWidth="1.5" />
              <circle cx="188" cy="232" r="6" fill="#684020" stroke="#3A2010" strokeWidth="1.5" />
              <circle cx="182" cy="222" r="6" fill="#5A3418" stroke="#3A2010" strokeWidth="1.5" />
              <circle cx="176" cy="232" r="2.2" fill="#8A5C30" />
              <circle cx="188" cy="232" r="2.2" fill="#8A5C30" />
              <circle cx="182" cy="222" r="2.2" fill="#8A5C30" />
            </g>
          </g>

          {/* ── MIDGROUND: counter with pizza (right) ── */}
          <g>
            <rect x="226" y="222" width="194" height="44" fill="url(#astCounterFront)" />
            {[268, 316, 364].map((x) => (
              <line key={x} x1={x} y1="224" x2={x} y2="266" stroke="#2A1608" strokeWidth="1.5" opacity="0.6" />
            ))}
            <rect x="220" y="208" width="200" height="16" rx="3" fill="url(#astCounterTop)" />
            <rect x="220" y="222" width="200" height="4" fill="#000" opacity="0.35" />
            <line x1="224" y1="213" x2="416" y2="213" stroke="#B07840" strokeWidth="1" opacity="0.4" />
            {/* pizza on a board */}
            <ellipse cx="262" cy="207" rx="26" ry="9" fill="#B07030" />
            <ellipse cx="262" cy="205" rx="24" ry="8" fill="#E8A860" />
            <ellipse cx="262" cy="205" rx="18" ry="6" fill="#D8542A" />
            <ellipse cx="262" cy="205" rx="15" ry="5" fill="#F0C060" />
            {[[-8, -1], [3, 1], [-2, 2], [8, -1]].map(([dx, dy], i) => (
              <circle key={i} cx={262 + dx} cy={205 + dy} r="1.8" fill="#A03020" />
            ))}
            {/* stacked pizza boxes */}
            <g>
              <rect x="366" y="196" width="42" height="7" rx="1.5" fill="#D8C09A" />
              <rect x="368" y="189" width="40" height="7" rx="1.5" fill="#E4CCA6" />
              <rect x="366" y="202" width="42" height="2" fill="#000" opacity="0.25" />
              <line x1="380" y1="192.5" x2="396" y2="192.5" stroke="#B05020" strokeWidth="1.5" opacity="0.7" />
            </g>
          </g>

          {/* ── FOREGROUND: floor, warm rim light, vignette ── */}
          <rect x="0" y="226" width="420" height="74" fill="url(#astFloor)" />
          <line x1="0" y1="226" x2="420" y2="226" stroke="#120A04" strokeWidth="2" opacity="0.7" />
          <line x1="0" y1="248" x2="420" y2="248" stroke="#120A04" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="274" x2="420" y2="274" stroke="#120A04" strokeWidth="1" opacity="0.22" />
          {[[-30, 60], [110, 150], [250, 262], [390, 366]].map(([a, b], i) => (
            <line key={i} x1={a} y1="300" x2={b} y2="226" stroke="#120A04" strokeWidth="1" opacity="0.18" />
          ))}
          {/* warm pool of oven light on the floor */}
          <ellipse cx="95" cy="252" rx="100" ry="18" fill="#F08030" opacity="0.14" style={{ animation: "ast-glow 1.8s ease-in-out infinite" }} />
          <rect x="0" y="0" width="240" height="300" fill="url(#astRim)" />

          {/* ── THE CUSTOMER ── */}
          {customerVisible && (
            <g transform="translate(178,0)">
              <ellipse cx="0" cy="288" rx="26" ry="6" fill="#000" opacity="0.4" />
              <g key={round} className="ast-entry-walk">
                <g className={phase === "loading" ? "ast-pose-bob" : phase === "result" ? "ast-pose-jump" : ""}>
                  {/* legs + shoes */}
                  <rect x="-12" y="256" width="9" height="28" rx="3.5" fill="#2A3038" />
                  <rect x="4" y="256" width="9" height="28" rx="3.5" fill="#232830" />
                  <rect x="-14" y="281" width="13" height="6" rx="3" fill="#181A20" />
                  <rect x="3" y="281" width="13" height="6" rx="3" fill="#181A20" />
                  {/* coat */}
                  <path d="M-17,260 L-17,218 Q-17,202 0,202 Q17,202 17,218 L17,260 Q0,267 -17,260 Z" fill="#3E5A6B" />
                  <path d="M6,204 Q17,206 17,218 L17,260 Q10,264 4,264 Z" fill="#000" opacity="0.18" />
                  <path d="M-16,222 Q-17,206 -6,203" fill="none" stroke="#F0A060" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
                  {/* scarf */}
                  <rect x="-13" y="203" width="26" height="8" rx="4" fill="#C05A28" />
                  <rect x="2" y="208" width="7" height="14" rx="3" fill="#B05020" />
                  {/* left arm hanging */}
                  <path d="M-13,218 Q-19,232 -16,244" fill="none" stroke="#35505F" strokeWidth="7" strokeLinecap="round" />
                  {/* right arm raised, holding a glowing phone */}
                  <g style={phase === "result" ? { transformBox: "fill-box", transformOrigin: "15% 85%", animation: "ast-armup 0.4s ease-out both" } : undefined}>
                    <path d="M11,216 Q24,210 29,197" fill="none" stroke="#46647A" strokeWidth="7" strokeLinecap="round" />
                    <circle cx="30" cy="194" r="4.5" fill="#E8B48C" />
                    <rect x="26" y="178" width="11" height="17" rx="2.5" fill="#14141C" />
                    <rect x="27.5" y="180" width="8" height="12" rx="1" fill={phase === "ready" || phase === "result" ? "#FFCF8E" : "#7FA8C8"} opacity="0.95" />
                    <circle cx="31.5" cy="186" r="9" fill={phase === "ready" || phase === "result" ? "#FFB050" : "#7FA8C8"} opacity="0.16" />
                  </g>
                  {/* head */}
                  <g className={phase === "tooSoon" ? "ast-headshake" : ""} style={{ transformBox: "fill-box", transformOrigin: "50% 92%" }}>
                    <circle cx="0" cy="188" r="15" fill="#E8B48C" />
                    <path d="M9,177 Q15,183 14,192 Q11,181 6,177 Z" fill="#000" opacity="0.1" />
                    <path d="M-14.5,183 Q-14,168 0,168 Q14,168 14.5,183 Z" fill="#B04838" />
                    <rect x="-15" y="180" width="30" height="4.5" rx="2.2" fill="#983828" />
                    <circle cx="-3" cy="190" r="1.7" fill="#2A1810" />
                    <circle cx="7" cy="190" r="1.7" fill="#2A1810" />
                    {phase === "result" ? (
                      <path d="M-3,196 Q2,201 7,196" fill="none" stroke="#7A4030" strokeWidth="1.6" strokeLinecap="round" />
                    ) : phase === "tooSoon" ? (
                      <path d="M-2,199 Q2,195.5 6,199" fill="none" stroke="#7A4030" strokeWidth="1.6" strokeLinecap="round" />
                    ) : (
                      <path d="M-1,197.5 L5,197.5" fill="none" stroke="#7A4030" strokeWidth="1.6" strokeLinecap="round" />
                    )}
                  </g>
                  {/* patience meter above head */}
                  {phase !== "result" && (
                    <g>
                      <rect x="-23" y="153" width="46" height="7" rx="3.5" fill="#0C0703" stroke="rgba(243,233,213,0.22)" strokeWidth="1" />
                      <rect
                        x="-20.5" y="155" width="41" height="3" rx="1.5" fill="#E07838"
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "0% 50%",
                          animation: `ast-drain ${Math.round(delay + 2600)}ms linear forwards`,
                          animationPlayState: meterRunning ? "running" : "paused",
                        }}
                      />
                    </g>
                  )}
                </g>
              </g>
            </g>
          )}

          {/* vignette on top of everything in-scene */}
          <rect x="0" y="0" width="420" height="300" fill="url(#astVignette)" pointerEvents="none" />
        </svg>

        {/* ── THE 3D PHONE (magnified view of the customer's screen) ────── */}
        <div className="absolute inset-y-0 right-[4%] z-10 flex items-center" style={{ perspective: "800px" }}>
          <div
            className="relative"
            style={{
              height: "min(76%, 234px)",
              aspectRatio: "0.58",
              transform: "rotateY(-14deg) rotateX(4deg)",
              transformStyle: "preserve-3d",
              background: "linear-gradient(150deg, #32343E 0%, #14151B 55%, #1E2028 100%)",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow: "0 18px 36px rgba(0,0,0,0.6), -6px 10px 24px rgba(0,0,0,0.45), 0 0 24px rgba(212,104,42,0.12)",
              padding: "5px",
            }}
          >
            {/* side buttons */}
            <span aria-hidden className="absolute rounded-full" style={{ left: "-2px", top: "22%", width: "2.5px", height: "12%", background: "#3A3C46" }} />
            <span aria-hidden className="absolute rounded-full" style={{ left: "-2px", top: "38%", width: "2.5px", height: "8%", background: "#3A3C46" }} />

            {/* screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[13px] flex flex-col" style={{ background: "#0D0906" }}>
              {/* mini URL bar */}
              <div className="flex items-center gap-1 px-1.5 py-1 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span aria-hidden className="w-1 h-1 rounded-full" style={{ background: "#E0563C" }} />
                <span
                  className="flex-1 text-center text-[7px] rounded-sm truncate"
                  style={{ background: "rgba(0,0,0,0.4)", color: "rgba(243,233,213,0.45)", fontFamily: "monospace" }}
                >
                  arturos-pizzeria.com
                </span>
              </div>

              {/* screen content */}
              <div className="relative flex-1 p-2 flex flex-col">
                {phase === "idle" && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[8px] text-center" style={{ color: "rgba(243,233,213,0.3)" }}>
                      waiting for a<br />hungry customer…
                    </p>
                  </div>
                )}

                {(phase === "loading" || phase === "tooSoon") && (
                  <div aria-hidden className="flex-1 flex flex-col">
                    {[
                      { h: "12px", w: "70%" },
                      { h: "34px", w: "100%" },
                      { h: "7px", w: "90%" },
                      { h: "7px", w: "60%" },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded mb-2"
                        style={{ height: b.h, width: b.w, background: "rgba(243,233,213,0.08)" }}
                      >
                        {phase === "loading" && (
                          <div
                            className="absolute inset-y-0 w-1/2"
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                              animation: `ast-shimmer 1.1s linear ${i * 0.12}s infinite`,
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <div className="mt-auto text-center">
                      {phase === "loading" ? (
                        <span className="text-[8px]" style={{ color: "rgba(243,233,213,0.4)" }}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: "#E07838", animation: "ast-glow 0.8s ease-in-out infinite" }} />
                          loading…
                        </span>
                      ) : (
                        <span
                          className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded"
                          style={{ color: "#F09080", background: "rgba(224,86,60,0.14)", border: "1px solid rgba(224,86,60,0.35)" }}
                        >
                          still loading!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {phase === "ready" && (
                  <div className="flex-1 flex flex-col" style={{ animation: "ast-pop 0.3s ease-out both" }}>
                    <p className="text-[11px] font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#F3E9D5" }}>
                      Arturo&apos;s Pizzeria
                    </p>
                    <p className="text-[7px] mb-1.5" style={{ color: "rgba(243,233,213,0.45)" }}>
                      Wood-fired · Route 9 · Open till 10
                    </p>
                    <div
                      className="rounded-md mb-2 flex-1 flex items-center justify-center"
                      style={{ background: "linear-gradient(145deg, #31180A, #1E1207)", border: "1px solid rgba(212,104,42,0.25)", minHeight: "30px" }}
                      aria-hidden
                    >
                      <svg viewBox="0 0 40 22" width="40" height="22">
                        <ellipse cx="20" cy="11" rx="17" ry="8.5" fill="#E8A860" />
                        <ellipse cx="20" cy="11" rx="13" ry="6.2" fill="#D8542A" />
                        <ellipse cx="20" cy="11" rx="10.5" ry="5" fill="#F0C060" />
                        <circle cx="15" cy="10" r="1.7" fill="#A03020" />
                        <circle cx="23" cy="13" r="1.7" fill="#A03020" />
                        <circle cx="24" cy="8.5" r="1.7" fill="#A03020" />
                      </svg>
                    </div>
                    <button
                      onPointerDown={clickedCall}
                      onClick={clickedCall}
                      className="w-full inline-flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-[#1C1209] cursor-pointer"
                      style={{
                        background: "linear-gradient(145deg, #F08040 0%, #D4682A 45%, #B05020 100%)",
                        boxShadow: "0 0 0 1px rgba(212,104,42,0.5), 0 4px 18px rgba(212,104,42,0.55)",
                        animation: "ast-pulse 0.85s ease-in-out infinite",
                      }}
                    >
                      <Phone size={10} aria-hidden /> CALL NOW
                    </button>
                  </div>
                )}

                {phase === "result" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ animation: "ast-pop 0.3s ease-out both" }}>
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full mb-1.5"
                      style={{ background: "rgba(140,200,104,0.15)", border: "1px solid rgba(140,200,104,0.4)" }}
                      aria-hidden
                    >
                      <Phone size={12} style={{ color: "#8CC868" }} />
                    </span>
                    <p className="text-[9px] font-bold" style={{ color: "#8CC868" }}>Calling Arturo&apos;s…</p>
                    <p className="text-[7px] mt-0.5" style={{ color: "rgba(243,233,213,0.4)" }}>dinner secured</p>
                  </div>
                )}

                {/* warm flash when the page pops in */}
                {phase === "ready" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 40%, rgba(255,195,110,0.95), rgba(240,128,48,0.55) 55%, transparent 85%)",
                      animation: "ast-flash 0.55s ease-out both",
                    }}
                  />
                )}
              </div>

              {/* screen glare */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-[13px]"
                style={{ background: "linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.13) 40%, rgba(255,255,255,0.03) 52%, transparent 58%)" }}
              />
            </div>
          </div>
        </div>

        {/* ── Too-soon catch layer (whole field is "the page") ──────────── */}
        {phase === "loading" && (
          <button
            onPointerDown={clickedTooSoon}
            aria-label="The page is still loading — wait for Call Now to appear"
            className="absolute inset-0 z-20 w-full h-full cursor-pointer"
            style={{ background: "transparent" }}
          />
        )}

        {/* ── IDLE overlay ──────────────────────────────────────────────── */}
        {phase === "idle" && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-5"
            style={{ background: "rgba(8,5,2,0.66)", backdropFilter: "blur(2px)" }}
          >
            <span
              className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2.5 px-2.5 py-1 rounded-full"
              style={{ color: "#E8A060", background: "rgba(212,104,42,0.12)", border: "1px solid rgba(212,104,42,0.3)" }}
            >
              Dinner rush · Level 1
            </span>
            <p className="text-base font-bold mb-1.5" style={{ fontFamily: "var(--font-display)", color: "#F3E9D5" }}>
              A hungry customer just walked in.
            </p>
            <p className="text-xs leading-relaxed mb-5 max-w-[260px]" style={{ color: "rgba(243,233,213,0.55)" }}>
              Their patience drains fast. The instant Arturo&apos;s page loads, smash{" "}
              <strong style={{ color: "#E07838" }}>Call Now</strong> — like your dinner depends on it.
            </p>
            <button
              onClick={start}
              className="nav-cta-shimmer px-6 py-2.5 rounded-xl text-xs font-bold text-[#1C1209] cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4)",
              }}
            >
              Seat the customer
            </button>
          </div>
        )}

        {/* ── TOO-SOON overlay (scene stays visible; customer shakes head) */}
        {phase === "tooSoon" && (
          <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-[300px] rounded-xl px-4 py-3 text-center"
              style={{
                background: "rgba(22,13,6,0.94)",
                border: "1px solid rgba(224,86,60,0.35)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                animation: "ast-pop 0.3s ease-out both",
              }}
            >
              <p className="text-sm font-bold mb-0.5" style={{ color: "#F3E9D5" }}>Still loading!</p>
              <p className="text-[10px] leading-relaxed mb-2.5" style={{ color: "rgba(243,233,213,0.55)" }}>
                You tapped a blank page. Your customers do that too — then they walk out.
              </p>
              <button
                onClick={start}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
                style={{ background: "rgba(243,233,213,0.08)", border: "1px solid rgba(243,233,213,0.15)", color: "#F3E9D5" }}
              >
                <RotateCcw size={11} aria-hidden /> Try again
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT overlay: scoreboard marquee panel + ember burst ────── */}
        {phase === "result" && ms !== null && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center px-3 py-2"
            style={{ background: "rgba(8,5,2,0.72)" }}
          >
            {/* ember / confetti burst */}
            <div aria-hidden className="absolute left-1/2 top-[38%] pointer-events-none">
              {EMBERS.map((e, i) => (
                <span
                  key={i}
                  className="absolute block"
                  style={{
                    width: `${e.size}px`,
                    height: `${e.size}px`,
                    marginLeft: `${-e.size / 2}px`,
                    marginTop: `${-e.size / 2}px`,
                    borderRadius: e.round ? "50%" : "1px",
                    background: e.color,
                    "--tx": `${e.tx}px`,
                    "--ty": `${e.ty}px`,
                    "--rot": `${e.rot}deg`,
                    animation: `ast-burst 0.9s cubic-bezier(0.15, 0.6, 0.4, 1) ${e.delay}ms both`,
                  } as CSSProperties}
                />
              ))}
            </div>

            <div
              className="relative w-full max-w-[290px] rounded-xl px-4 pt-3 pb-3.5 text-center"
              style={{
                background: "linear-gradient(180deg, #261507 0%, #170D05 100%)",
                border: "1px solid rgba(212,104,42,0.45)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 14px 40px rgba(0,0,0,0.6), 0 0 32px rgba(212,104,42,0.18)",
                animation: "ast-pop 0.35s ease-out both",
              }}
            >
              {/* marquee bulbs */}
              <div aria-hidden className="flex justify-center gap-2 mb-1.5">
                {MARQUEE_BULBS.map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#FFC878", animation: `ast-bulb 1.3s ease-in-out ${(i % 2) * 0.65}s infinite` }}
                  />
                ))}
              </div>
              <p className="text-[9px] font-bold tracking-[0.24em] uppercase mb-0.5" style={{ color: "rgba(243,233,213,0.4)" }}>
                Order placed in
              </p>
              <p className="text-4xl font-extrabold leading-none mb-1 text-gradient" style={{ fontFamily: "var(--font-display)" }}>
                {ms}ms
              </p>
              <p className="text-[10px] font-semibold mb-2" style={{ color: "rgba(243,233,213,0.65)" }}>
                {rating(ms)}
                {best !== null && ms <= best && <span style={{ color: "#E07838" }}> · new best!</span>}
              </p>
              <p
                className="text-[10px] leading-relaxed mb-3 text-left rounded-lg p-2.5"
                style={{ color: "rgba(243,233,213,0.6)", background: "rgba(212,104,42,0.07)", border: "1px solid rgba(212,104,42,0.18)" }}
              >
                {GAME.lesson}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={start}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
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
          </div>
        )}
      </div>
    </div>
  );
}
