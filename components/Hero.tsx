"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { HeroNoise } from "./HeroNoise";
import { CountUp } from "./CountUp";

const SHOP_NAME_SETS = [
  "Arturo's Pizzeria · Lake Shore Barbers · Town Common Bakery",
  "Fresh Bloom Florist · Route 9 Auto · Shrewsbury Framing Co.",
  "Main Street Café · Dave's Barbershop · Westboro Wine & Spirits",
  "The Pressed Bloom · Tony's Auto & Tire · Framingham Framing Co.",
  "Lake Quinsigamond Kayaks · Corner Deli · Shrewsbury Salon",
];

function CyclingShopNames() {
  const [idx, setIdx]     = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let innerTid: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setFading(true);
      innerTid = setTimeout(() => {
        setIdx((i) => (i + 1) % SHOP_NAME_SETS.length);
        setFading(false);
      }, 380);
    }, 3800);
    return () => { clearInterval(id); clearTimeout(innerTid); };
  }, []);

  return (
    <p
      aria-hidden="true"
      className="text-[10px] italic mb-3"
      style={{
        color: "rgba(243,233,213,0.2)",
        fontFamily: "var(--font-display)",
        lineHeight: 1.7,
        animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.88s both",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.38s ease",
        minHeight: "1.7em",
      }}
    >
      {SHOP_NAME_SETS[idx]}
    </p>
  );
}

// ── Real shop photo collage — editorial right column ──────────────────────────
function HeroPhotoCollage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const el = containerRef.current;
    if (!el) return;
    const hero = document.getElementById("hero");
    if (!hero) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId: number;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      cx = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      cy = ((e.clientY - r.top)   / r.height - 0.5) * 2;
    };
    const onLeave = () => { cx = 0; cy = 0; };

    const tick = () => {
      tx += (cx - tx) * 0.055;
      ty += (cy - ty) * 0.055;
      el.style.transform = `perspective(920px) rotateY(${tx * 7}deg) rotateX(${-ty * 4}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const photos = [
    { id: "1517248135467-4c7edcad34c4", label: "Restaurants", col: "1", row: "1 / -1", w: 600 },
    { id: "1585747860715-2ba37e788b70", label: "Barbershops",  col: "2", row: "1",     w: 400 },
    { id: "1554118811-1e0d58224f24",   label: "Cafés",        col: "2", row: "2",     w: 400 },
  ];

  return (
    <div ref={containerRef} className="relative" aria-hidden style={{ willChange: "transform" }}>
      {/* Deep ambient glow behind photos */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-60px",
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(180,80,18,0.28) 0%, rgba(100,40,8,0.10) 40%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* Photo grid */}
      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "10px",
          height: "clamp(380px, 48vw, 540px)",
          zIndex: 1,
        }}
      >
        {photos.map(({ id, label, col, row, w }, idx) => (
          <div
            key={id}
            className="relative overflow-hidden group"
            style={{
              gridColumn: col,
              gridRow: row,
              borderRadius: "18px",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5), 0 24px 72px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.45)",
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`}
              alt={label}
              loading="eager"
              fetchPriority={idx === 0 ? "high" : "auto"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            {/* Multi-stop vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,9,5,0.08) 0%, transparent 30%, rgba(14,9,5,0.65) 85%, rgba(14,9,5,0.82) 100%)",
              }}
            />
            {/* Subtle top gloss line */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
            />
            {/* Category label */}
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(243,233,213,0.7)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </div>
            {/* Hover ring */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{
                borderRadius: "18px",
                boxShadow: "inset 0 0 0 1.5px rgba(212,104,42,0.45)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Route 9 pill badge */}
      <div
        className="absolute"
        style={{
          top: "14px",
          right: "14px",
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 11px 5px 8px",
          borderRadius: "9999px",
          background: "linear-gradient(145deg, rgba(20,12,5,0.95), rgba(14,9,5,0.92))",
          border: "1px solid rgba(212,104,42,0.50)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 1px 0 rgba(255,200,100,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        }}
      >
        <MapPin size={9} color="#D4682A" />
        <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(212,104,42,0.92)", letterSpacing: "0.12em" }}>
          ROUTE 9
        </span>
        <span style={{ fontSize: "8px", color: "rgba(243,233,213,0.35)", fontFamily: "monospace" }}>MA</span>
      </div>

      {/* "Independent shops" floating badge */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "-14px",
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: "11px",
          background: "linear-gradient(145deg, #E07838 0%, #D4682A 50%, #C05A20 100%)",
          boxShadow:
            "0 8px 28px rgba(212,104,42,0.60), 0 2px 8px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,220,140,0.28), inset 0 -1.5px 0 rgba(0,0,0,0.2)",
          color: "white",
          fontSize: "9.5px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          animation: "float-subtle 4s ease-in-out infinite",
        }}
      >
        Independent shops · Shrewsbury &amp; beyond
      </div>
    </div>
  );
}

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const allowMotion = useRef(false);

  useEffect(() => {
    allowMotion.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const onScroll = () => {
      if (contentRef.current)
        contentRef.current.style.transform = `translateY(${window.scrollY * 0.03}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: "#0E0905" }}
      aria-labelledby="hero-heading"
    >
      {/* Left ambient glow — lights up the headline */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "15%",
          left: "-10%",
          width: "min(80vw, 700px)",
          height: "min(80vw, 700px)",
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(160,65,14,0.14) 0%, rgba(90,35,8,0.06) 50%, transparent 72%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      {/* Right ambient glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "25%",
          right: "-10%",
          width: "min(72vw, 720px)",
          height: "min(72vw, 720px)",
          background:
            "radial-gradient(ellipse at 65% 40%, rgba(140,60,12,0.18) 0%, rgba(80,32,6,0.07) 45%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Aurora layer A — slow drift, warm ochre-amber sweep */}
      <div
        aria-hidden
        className="absolute pointer-events-none hero-aurora-reduced"
        style={{
          top: "0%",
          left: "-20%",
          width: "90vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at 40% 60%, rgba(212,104,42,0.13) 0%, rgba(170,65,12,0.07) 38%, transparent 68%)",
          filter: "blur(48px)",
          animation: "hero-aurora-a 18s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      {/* Aurora layer B — counter-drift, deeper ember hue */}
      <div
        aria-hidden
        className="absolute pointer-events-none hero-aurora-reduced"
        style={{
          bottom: "0%",
          right: "-18%",
          width: "75vw",
          height: "65vh",
          background:
            "radial-gradient(ellipse at 58% 35%, rgba(180,72,16,0.12) 0%, rgba(120,48,10,0.06) 42%, transparent 70%)",
          filter: "blur(56px)",
          animation: "hero-aurora-b 24s ease-in-out infinite 3s",
          zIndex: 0,
        }}
      />

      {/* Fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, rgba(243,233,213,0.6) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          opacity: 0.028,
        }}
      />

      {/* Ambient floating ember particles */}
      {[
        { x: "11%",  y: "17%", s: 2, delay: "0s",   dur: "4.2s" },
        { x: "84%",  y: "24%", s: 1, delay: "0.8s", dur: "5.6s" },
        { x: "64%",  y: "71%", s: 3, delay: "1.5s", dur: "3.8s" },
        { x: "31%",  y: "54%", s: 1, delay: "2.2s", dur: "6.1s" },
        { x: "77%",  y: "39%", s: 2, delay: "0.4s", dur: "4.7s" },
        { x: "21%",  y: "81%", s: 1, delay: "3.1s", dur: "5.3s" },
        { x: "53%",  y: "14%", s: 2, delay: "1.1s", dur: "4.4s" },
        { x: "91%",  y: "63%", s: 1, delay: "2.8s", dur: "3.6s" },
        { x: "42%",  y: "34%", s: 3, delay: "0.6s", dur: "5.9s" },
        { x: "7%",   y: "47%", s: 1, delay: "1.9s", dur: "4.9s" },
        { x: "68%",  y: "88%", s: 2, delay: "3.5s", dur: "5.1s" },
        { x: "18%",  y: "92%", s: 1, delay: "0.2s", dur: "6.4s" },
      ].map((p, i) => (
        <div
          key={i}
          aria-hidden
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.s}px`,
            height: `${p.s}px`,
            "--delay": p.delay,
            "--dur": p.dur,
            zIndex: 1,
          } as React.CSSProperties}
        />
      ))}

      {/* Animated film-grain noise layer — canvas redraws at 14fps */}
      <HeroNoise />

      {/* Subtle shop background texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=60"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.035, mixBlendMode: "luminosity" }}
          loading="eager"
        />
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full will-change-transform"
        style={{ zIndex: 3 }}
      >
        <div className="grid lg:grid-cols-[1fr_0.88fr] gap-10 xl:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>

            {/* Location eyebrow pill — 3D glass */}
            <div
              className="inline-flex items-center gap-2 mb-9"
              style={{
                padding: "7px 16px 7px 13px",
                borderRadius: "9999px",
                background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                border: "1px solid rgba(255,255,255,0.11)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.2) inset",
                animation: "hero-line-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both",
              }}
            >
              <span aria-hidden style={{ display: "inline-flex", animation: "icon-bounce 0.6s cubic-bezier(0.22,1,0.36,1) 1.8s both" }}>
                <MapPin size={10} color="#D4682A" />
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(243,233,213,0.6)",
                  letterSpacing: "0.08em",
                }}
              >
                {HERO.label}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: "#D4682A", boxShadow: "0 0 6px rgba(212,104,42,0.9), 0 0 12px rgba(212,104,42,0.4)" }}
                aria-hidden
              />
            </div>

            {/* ── Headline ──
                lineHeight 1.08 gives italic descenders room (g, p, y).
                No overflow:hidden anywhere near these spans.          */}
            <h1
              id="hero-heading"
              className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6rem] xl:text-[6.5rem] tracking-tight mb-7"
              style={{
                fontFamily: "var(--font-display)",
                lineHeight: 1.08,
                paddingBottom: "0.04em",
              }}
            >
              <span
                className="block text-[#F3E9D5]"
                style={{
                  animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.12s both",
                  textShadow: "0 2px 40px rgba(212,104,42,0.12)",
                }}
              >
                {HERO.headlineA}
              </span>
              <span
                className="block text-gradient italic"
                style={{
                  animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.30s both",
                  paddingBottom: "0.06em",
                }}
              >
                {HERO.headlineB}
                {/* Typing cursor — blinks 5× after headline reveals, then hides */}
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "0.78em",
                    background: "#D4682A",
                    marginLeft: "5px",
                    verticalAlign: "middle",
                    borderRadius: "1px",
                    opacity: 0,
                    animation: "cursor-blink 0.65s step-end 5 1.35s forwards",
                  }}
                />
              </span>
            </h1>

            {/* Subhead */}
            <p
              className="max-w-xl text-lg md:text-xl leading-relaxed mb-10"
              style={{
                color: "rgba(243,233,213,0.60)",
                animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.48s both",
              }}
            >
              {HERO.subhead}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 mb-10"
              style={{
                animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.62s both",
              }}
            >
              {/* Primary CTA — 3D embossed orange with shimmer + magnetic */}
              <a
                href={HERO.ctaPrimary.href}
                className="nav-cta-shimmer inline-flex items-center justify-center gap-2.5 px-8 rounded-xl text-[#1C1209] font-semibold text-sm tracking-wide"
                style={{
                  height: "52px",
                  background: "linear-gradient(145deg, #F08040 0%, #D4682A 40%, #A84818 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(212,104,42,0.55), 0 2px 0 rgba(0,0,0,0.35) inset, 0 1.5px 0 rgba(255,220,160,0.25) inset, 0 6px 20px rgba(212,104,42,0.55), 0 16px 48px rgba(212,104,42,0.2)",
                  transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseMove={e => {
                  if (!allowMotion.current) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
                  const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
                  (e.currentTarget as HTMLElement).style.transform = `translate(${dx}px, ${dy}px) scale(1.018)`;
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(212,104,42,0.65), 0 2px 0 rgba(0,0,0,0.35) inset, 0 1.5px 0 rgba(255,220,160,0.3) inset, 0 8px 28px rgba(212,104,42,0.65), 0 24px 60px rgba(212,104,42,0.28)";
                }}
                onMouseLeave={e => {
                  if (!allowMotion.current) return;
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(212,104,42,0.55), 0 2px 0 rgba(0,0,0,0.35) inset, 0 1.5px 0 rgba(255,220,160,0.25) inset, 0 6px 20px rgba(212,104,42,0.55), 0 16px 48px rgba(212,104,42,0.2)";
                }}
              >
                {HERO.ctaPrimary.text}
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
              </a>

              {/* Secondary CTA — frosted glass */}
              <a
                href={HERO.ctaSecondary.href}
                className="inline-flex items-center justify-center px-8 rounded-xl font-medium text-sm tracking-wide"
                style={{
                  height: "52px",
                  color: "rgba(243,233,213,0.88)",
                  background: "linear-gradient(145deg, rgba(243,233,213,0.10) 0%, rgba(243,233,213,0.04) 100%)",
                  border: "1px solid rgba(243,233,213,0.15)",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.18) inset",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s cubic-bezier(0.22,1,0.36,1), border-color 0.18s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (allowMotion.current) el.style.transform = "translateY(-2px)";
                  el.style.borderColor = "rgba(243,233,213,0.28)";
                  el.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.2) inset";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "";
                  el.style.borderColor = "rgba(243,233,213,0.15)";
                  el.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.18) inset";
                }}
              >
                {HERO.ctaSecondary.text}
              </a>
            </div>

            {/* Availability status badge */}
            <div
              className="flex items-center gap-2.5 mb-7"
              style={{ animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.72s both" }}
            >
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                style={{
                  background: "rgba(22,163,74,0.10)",
                  border: "1px solid rgba(22,163,74,0.22)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                  style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }}
                  aria-hidden
                />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(134,239,172,0.9)", letterSpacing: "0.04em" }}>
                  Now accepting new clients
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "rgba(243,233,213,0.22)" }}>
                · Shrewsbury &amp; Route 9
              </span>
            </div>

            {/* Shop proof strip — avatar stack */}
            <div
              className="flex items-center gap-3 mb-3"
              style={{
                animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.78s both",
              }}
            >
              <div className="flex -space-x-2">
                {[
                  "1517248135467-4c7edcad34c4",
                  "1493857671505-72967e2e2760",
                  "1585747860715-2ba37e788b70",
                  "1509440159596-0249088772ff",
                  "1472851294608-062f824d29cc",
                ].map((id, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      border: "2px solid #110A06",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      zIndex: 5 - i,
                    }}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`}
                      alt=""
                      aria-hidden
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "rgba(243,233,213,0.55)" }}>
                Barbershops, bakeries, cafes &amp; restaurants along Route 9
              </p>
            </div>

            {/* Local shop names — cycling through Route 9 businesses */}
            <CyclingShopNames />

            {/* Mini stats row */}
            <dl
              className="flex items-center py-4 mb-1 border-t border-b border-[rgba(255,255,255,0.055)]"
              style={{ animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.90s both" }}
            >
              {[
                { val: "48hr", label: "Avg. launch" },
                { val: "Free", label: "Preview first" },
                { val: "Zero", label: "Lock-in" },
              ].flatMap(({ val, label }, i) => {
                const stat = (
                  <div key={label} className="flex flex-col" style={{ animation: `stat-pop 0.5s cubic-bezier(0.22,1,0.36,1) ${1.0 + i * 0.1}s both` }}>
                    <dt
                      className="font-extrabold leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 2.5vw, 24px)",
                        color: i === 1 ? "#D4682A" : "#F3E9D5",
                        fontStyle: i === 1 ? "italic" : "normal",
                      }}
                    >
                      {val === "48hr"
                        ? <CountUp to={48} suffix="hr" duration={1200} delay={200} />
                        : val}
                    </dt>
                    <dd className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(243,233,213,0.3)" }}>
                      {label}
                    </dd>
                  </div>
                );
                if (i === 0) return [stat];
                return [
                  <div
                    key={`sep-${i}`}
                    aria-hidden
                    className="self-stretch w-px mx-5 my-1"
                    style={{ background: "rgba(255,255,255,0.055)" }}
                  />,
                  stat,
                ];
              })}
            </dl>

            {/* Trust line — alpha tuned for WCAG AA contrast (~4.8:1) on #0E0905 bg */}
            <p
              className="text-xs tracking-wide"
              style={{
                color: "rgba(243,233,213,0.50)",
                animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.96s both",
              }}
            >
              No contracts · No lock-in · Free preview before you pay anything
            </p>
          </div>

          {/* ── Right: photo collage (desktop only) ── */}
          <div
            className="hidden lg:block"
            style={{
              animation: "hero-line-up 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both",
            }}
          >
            <HeroPhotoCollage />
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 3,
          animation: "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 1.1s both",
        }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(243,233,213,0.2)" }}>
          Scroll
        </span>
        {/* Animated mouse-scroll icon */}
        <svg viewBox="0 0 20 32" fill="none" width="20" height="32" aria-hidden>
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(212,104,42,0.38)" strokeWidth="1.3" />
          <line x1="10" y1="1" x2="10" y2="15" stroke="rgba(212,104,42,0.14)" strokeWidth="0.8" />
          <rect
            x="8" y="7" width="4" height="8" rx="2"
            fill="rgba(212,104,42,0.65)"
            className="scroll-dot-anim"
          />
        </svg>
      </div>

      {/* ── Marquee ticker ── */}
      <div
        className="relative mt-8 border-t pt-5 pb-5"
        style={{
          zIndex: 3,
          borderTopColor: "rgba(212,104,42,0.10)",
          background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(212,104,42,0.03))",
        }}
      >
        <Marquee items={WHO.businessTypes} />
      </div>

      {/* ── Organic wave transition to next section ── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 4, lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "56px", display: "block" }}
        >
          <path
            d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
            fill="var(--bg)"
            opacity="0.06"
          />
          <path
            d="M0,38 C240,18 480,54 720,38 C960,22 1200,50 1440,38 L1440,56 L0,56 Z"
            fill="var(--bg)"
            opacity="0.04"
          />
        </svg>
      </div>
    </section>
  );
}
