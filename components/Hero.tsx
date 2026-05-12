"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { SplitTextReveal } from "./SplitTextReveal";
import { MagneticButton } from "./MagneticButton";

// ── Route 9 highway shield — upgraded 3D version ─────────────────────────────
function Route9Graphic() {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="w-full h-full"
    >
      <defs>
        {/* Shield ambient fill */}
        <radialGradient id="shieldFill" cx="45%" cy="38%" r="62%">
          <stop offset="0%"   stopColor="rgba(230,120,50,0.18)" />
          <stop offset="50%"  stopColor="rgba(180,80,20,0.1)" />
          <stop offset="100%" stopColor="rgba(100,40,10,0.04)" />
        </radialGradient>

        {/* Border gradient — brighter at top-left like a lit surface */}
        <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,190,120,0.55)" />
          <stop offset="40%"  stopColor="rgba(212,104,42,0.4)" />
          <stop offset="100%" stopColor="rgba(140,60,15,0.15)" />
        </linearGradient>

        {/* "9" character gradient */}
        <linearGradient id="nineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(230,130,60,0.32)" />
          <stop offset="60%"  stopColor="rgba(180,75,20,0.18)" />
          <stop offset="100%" stopColor="rgba(100,40,8,0.08)" />
        </linearGradient>

        {/* Drop shadow + glow for the shield */}
        <filter id="shieldGlow" x="-20%" y="-10%" width="140%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur1" />
          <feFlood floodColor="rgba(212,104,42,0.5)" result="color1" />
          <feComposite in="color1" in2="blur1" operator="in" result="glow1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="blur2" />
          <feFlood floodColor="rgba(212,104,42,0.18)" result="color2" />
          <feComposite in="color2" in2="blur2" operator="in" result="glow2" />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ROUTE text glow */}
        <filter id="textGlow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Outer glow halo (ambient light) ── */}
      <ellipse
        cx="130" cy="165"
        rx="110" ry="135"
        fill="rgba(212,104,42,0.06)"
        filter="url(#shieldGlow)"
      />

      {/* ── Main shield shape ── */}
      <path
        d="M130 14 L246 56 L246 188 Q246 268 130 306 Q14 268 14 188 L14 56 Z"
        fill="url(#shieldFill)"
        stroke="url(#shieldBorder)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ── Top-left bevel highlight (simulates 3D lit edge) ── */}
      <path
        d="M130 14 L246 56"
        stroke="rgba(255,220,160,0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M130 14 L14 56"
        stroke="rgba(255,220,160,0.12)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ── Inner recessed border ── */}
      <path
        d="M130 32 L228 68 L228 186 Q228 256 130 288 Q32 256 32 186 L32 68 Z"
        stroke="rgba(212,104,42,0.1)"
        strokeWidth="1"
        fill="rgba(212,104,42,0.015)"
        strokeLinejoin="round"
      />

      {/* ── ROUTE lettering ── */}
      <text
        x="130" y="100"
        textAnchor="middle"
        fontFamily="var(--font-geist, monospace)"
        fontSize="17"
        fontWeight="700"
        letterSpacing="8"
        fill="rgba(212,104,42,0.65)"
        filter="url(#textGlow)"
      >
        ROUTE
      </text>

      {/* ── Big "9" — embossed feel ── */}
      <text
        x="133" y="216"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="152"
        fontWeight="400"
        fontStyle="italic"
        fill="url(#nineGrad)"
      >
        9
      </text>
      {/* Subtle shadow offset of the 9 */}
      <text
        x="135" y="218"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="152"
        fontWeight="400"
        fontStyle="italic"
        fill="rgba(80,30,5,0.08)"
        style={{ pointerEvents: "none" }}
      >
        9
      </text>

      {/* ── MA lettering ── */}
      <text
        x="130" y="251"
        textAnchor="middle"
        fontFamily="var(--font-geist, monospace)"
        fontSize="13"
        fontWeight="600"
        letterSpacing="7"
        fill="rgba(212,104,42,0.38)"
      >
        MA
      </text>

      {/* ── Decorative side ticks ── */}
      <line x1="14"  y1="82" x2="30"  y2="82" stroke="rgba(212,104,42,0.22)" strokeWidth="1.5" />
      <line x1="246" y1="82" x2="230" y2="82" stroke="rgba(212,104,42,0.22)" strokeWidth="1.5" />
      <line x1="14"  y1="87" x2="25"  y2="87" stroke="rgba(212,104,42,0.1)"  strokeWidth="1" />
      <line x1="246" y1="87" x2="235" y2="87" stroke="rgba(212,104,42,0.1)"  strokeWidth="1" />

      {/* ── Bottom shadow edge ── */}
      <path
        d="M60 290 Q130 310 200 290"
        stroke="rgba(212,104,42,0.12)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

// ── Winding road path ─────────────────────────────────────────────────────────
function RoadPath() {
  return (
    <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="w-full h-full">
      <path d="M-50 380 Q200 200 400 250 Q600 300 850 80" stroke="rgba(212,104,42,0.09)" strokeWidth="44" strokeLinecap="round" fill="none" />
      <path d="M-50 380 Q200 200 400 250 Q600 300 850 80" stroke="rgba(243,233,213,0.05)" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 14" fill="none" />
    </svg>
  );
}

export function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const blobsRef    = useRef<HTMLDivElement>(null);
  const roadRef     = useRef<HTMLDivElement>(null);
  const signRef     = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (blobsRef.current)   blobsRef.current.style.transform   = `translateY(${y * 0.12}px)`;
      if (roadRef.current)    roadRef.current.style.transform    = `translateY(${y * 0.22}px)`;
      if (signRef.current)    signRef.current.style.transform    = `translateY(${y * 0.07}px)`;
      if (contentRef.current) contentRef.current.style.transform = `translateY(${y * 0.035}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: "#0E0905" }}
      aria-label="Hero"
    >
      {/* ── Warm sun aura ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "30%",
          transform: "translate(-50%, -55%)",
          width: "min(75vw, 800px)",
          height: "min(75vw, 800px)",
          background: "radial-gradient(ellipse at 50% 50%, rgba(220,120,40,0.22) 0%, rgba(180,80,20,0.12) 30%, rgba(212,104,42,0.05) 55%, transparent 72%)",
          borderRadius: "50%",
          filter: "blur(4px)",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "30%",
          transform: "translate(-50%, -55%)",
          width: "min(50vw, 560px)",
          height: "min(50vw, 560px)",
          background: "radial-gradient(ellipse, rgba(240,140,60,0.1) 0%, transparent 65%)",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* ── Animated blobs ── */}
      <div ref={blobsRef} className="absolute inset-0 pointer-events-none will-change-transform" aria-hidden style={{ zIndex: 0 }}>
        <div className="blob-a absolute top-[-8%] right-[-6%] w-[44vw] h-[44vw] max-w-[620px] max-h-[620px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, #6B2A0E 0%, #D4682A 55%, transparent 100%)" }} />
        <div className="blob-b absolute bottom-[4%] left-[-10%] w-[38vw] h-[38vw] max-w-[520px] max-h-[520px] rounded-full opacity-12 blur-[110px]" style={{ background: "radial-gradient(circle, #D4682A 0%, #7A3010 60%, transparent 100%)" }} />
      </div>

      {/* ── Background photo texture ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=60"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.05, mixBlendMode: "luminosity" }}
          loading="eager"
        />
      </div>

      {/* ── Road path ── */}
      <div ref={roadRef} className="absolute inset-0 pointer-events-none will-change-transform" aria-hidden style={{ zIndex: 0 }}>
        <RoadPath />
      </div>

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" aria-hidden style={{ backgroundImage: "radial-gradient(circle, rgba(243,233,213,0.7) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />

      {/* ── Route 9 sign (parallax, more 3D) ── */}
      <div
        ref={signRef}
        className="absolute right-[-1%] top-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        aria-hidden
        style={{ width: "min(32vw, 380px)", zIndex: 2 }}
      >
        <Route9Graphic />
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full will-change-transform"
        style={{ zIndex: 3 }}
      >

        {/* ── Location badge — 3D metallic slab ── */}
        <div
          className="inline-flex items-center gap-2 mb-10 reveal"
          style={{
            transitionDelay: "100ms",
            padding: "7px 16px",
            borderRadius: "9999px",
            background: "linear-gradient(145deg, rgba(212,104,42,0.2) 0%, rgba(160,70,15,0.12) 60%, rgba(100,40,8,0.08) 100%)",
            border: "1px solid rgba(212,104,42,0.45)",
            boxShadow:
              "0 0 0 1px rgba(212,104,42,0.1), 0 2px 16px rgba(212,104,42,0.2), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,210,140,0.2), inset 0 -1px 0 rgba(0,0,0,0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <MapPin size={11} color="#D4682A" />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#D4682A",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            {HERO.label}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{
              background: "#D4682A",
              boxShadow: "0 0 8px rgba(212,104,42,0.9), 0 0 0 2px rgba(212,104,42,0.2)",
            }}
            aria-hidden
          />
        </div>

        {/* ── Headline — leading widened to prevent clipping ── */}
        <h1
          className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display)", lineHeight: 0.95 }}
        >
          <SplitTextReveal as="span" className="block text-[#F3E9D5]" delay={150} stagger={85} duration={950}>
            {HERO.headlineA}
          </SplitTextReveal>
          <SplitTextReveal as="span" className="block text-gradient italic" delay={350} stagger={85} duration={950}>
            {HERO.headlineB}
          </SplitTextReveal>
        </h1>

        {/* ── Subhead ── */}
        <p
          className="max-w-xl text-lg md:text-xl leading-relaxed mb-10 reveal"
          style={{ color: "rgba(243,233,213,0.65)", transitionDelay: "580ms" }}
        >
          {HERO.subhead}
        </p>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3 reveal" style={{ transitionDelay: "720ms" }}>
          <MagneticButton>
            <a
              href={HERO.ctaPrimary.href}
              className="glow-btn inline-flex items-center justify-center gap-2.5 px-8 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
              style={{
                height: "52px",
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 40%, #B04C18 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,104,42,0.5), 0 4px 16px rgba(212,104,42,0.5), 0 12px 40px rgba(212,104,42,0.2), inset 0 1.5px 0 rgba(255,220,160,0.22), inset 0 -1.5px 0 rgba(0,0,0,0.2)",
              }}
            >
              {HERO.ctaPrimary.text}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={HERO.ctaSecondary.href}
              className="inline-flex items-center justify-center px-8 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              style={{
                height: "52px",
                color: "#F3E9D5",
                background: "linear-gradient(145deg, rgba(243,233,213,0.09) 0%, rgba(243,233,213,0.04) 100%)",
                border: "1px solid rgba(243,233,213,0.2)",
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(243,233,213,0.12), inset 0 -1px 0 rgba(0,0,0,0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {HERO.ctaSecondary.text}
            </a>
          </MagneticButton>
        </div>

        {/* ── Shop proof strip ── */}
        <div className="flex items-center gap-3 mt-8 mb-1 reveal" style={{ transitionDelay: "860ms" }}>
          <div className="flex -space-x-2.5">
            {[
              "1517248135467-4c7edcad34c4",
              "1493857671505-72967e2e2760",
              "1585747860715-2ba37e788b70",
              "1509440159596-0249088772ff",
              "1472851294608-062f824d29cc",
            ].map((id, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#1C1209] overflow-hidden flex-shrink-0"
                style={{ zIndex: 5 - i }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(243,233,213,0.45)" }}>
            Restaurants, cafes, salons &amp; more along Route 9
          </p>
        </div>

        {/* ── Trust line ── */}
        <p className="mt-3 text-xs tracking-wide reveal" style={{ color: "rgba(243,233,213,0.35)", transitionDelay: "980ms" }}>
          No contracts · No lock-in · Free preview before you pay anything
        </p>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="relative mt-8 border-t border-[rgba(212,104,42,0.1)] pt-5 pb-5" style={{ zIndex: 3 }}>
        <Marquee items={WHO.businessTypes} />
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal"
        style={{ transitionDelay: "1100ms", zIndex: 3 }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(243,233,213,0.3)" }}>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(212,104,42,0.6)] to-transparent" />
      </div>
    </section>
  );
}
