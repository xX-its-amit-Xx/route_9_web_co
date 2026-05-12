"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { SplitTextReveal } from "./SplitTextReveal";
import { MagneticButton } from "./MagneticButton";

// SVG: abstract Route 9 sign / road marker
function Route9Graphic() {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="w-full h-full"
    >
      {/* Shield outline */}
      <path
        d="M130 14 L246 56 L246 188 Q246 268 130 306 Q14 268 14 188 L14 56 Z"
        stroke="rgba(212,104,42,0.35)"
        strokeWidth="1.5"
        fill="rgba(212,104,42,0.04)"
        strokeLinejoin="round"
      />
      {/* Inner shield */}
      <path
        d="M130 32 L228 68 L228 186 Q228 256 130 288 Q32 256 32 186 L32 68 Z"
        stroke="rgba(212,104,42,0.15)"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      {/* ROUTE label */}
      <text
        x="130"
        y="102"
        textAnchor="middle"
        fontFamily="var(--font-geist, monospace)"
        fontSize="18"
        fontWeight="700"
        letterSpacing="6"
        fill="rgba(212,104,42,0.55)"
      >
        ROUTE
      </text>
      {/* Big "9" */}
      <text
        x="130"
        y="208"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="148"
        fontWeight="400"
        fontStyle="italic"
        fill="rgba(212,104,42,0.18)"
      >
        9
      </text>
      {/* MA label */}
      <text
        x="130"
        y="248"
        textAnchor="middle"
        fontFamily="var(--font-geist, monospace)"
        fontSize="13"
        fontWeight="600"
        letterSpacing="5"
        fill="rgba(212,104,42,0.35)"
      >
        MA
      </text>
      {/* Decorative corner ticks */}
      <line x1="14" y1="80" x2="28" y2="80" stroke="rgba(212,104,42,0.2)" strokeWidth="1" />
      <line x1="246" y1="80" x2="232" y2="80" stroke="rgba(212,104,42,0.2)" strokeWidth="1" />
      <line x1="14" y1="170" x2="28" y2="170" stroke="rgba(212,104,42,0.2)" strokeWidth="1" />
      <line x1="246" y1="170" x2="232" y2="170" stroke="rgba(212,104,42,0.2)" strokeWidth="1" />
    </svg>
  );
}

// Floating road path decoration
function RoadPath() {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="w-full h-full"
    >
      {/* Main winding road curve */}
      <path
        d="M-50 380 Q200 200 400 250 Q600 300 850 80"
        stroke="rgba(212,104,42,0.12)"
        strokeWidth="40"
        strokeLinecap="round"
        fill="none"
      />
      {/* Road center dashes */}
      <path
        d="M-50 380 Q200 200 400 250 Q600 300 850 80"
        stroke="rgba(243,233,213,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="20 16"
        fill="none"
      />
      {/* Subtle outer glow line */}
      <path
        d="M-50 380 Q200 200 400 250 Q600 300 850 80"
        stroke="rgba(212,104,42,0.05)"
        strokeWidth="80"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // blobs — slow
  const layer2Ref = useRef<HTMLDivElement>(null); // road path — medium
  const layer3Ref = useRef<HTMLDivElement>(null); // sign — faster
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (layer1Ref.current) layer1Ref.current.style.transform = `translateY(${y * 0.12}px)`;
      if (layer2Ref.current) layer2Ref.current.style.transform = `translateY(${y * 0.20}px)`;
      if (layer3Ref.current) layer3Ref.current.style.transform = `translateY(${y * 0.08}px)`;
      if (contentRef.current) contentRef.current.style.transform = `translateY(${y * 0.04}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: "#110B07" }}
      aria-label="Hero"
    >
      {/* ── Layer 1: slow-moving warm gradient orbs ── */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 pointer-events-none will-change-transform"
        aria-hidden
      >
        <div
          className="blob-a absolute top-[-10%] right-[-8%] w-[48vw] h-[48vw] max-w-[680px] max-h-[680px] rounded-full opacity-22 blur-[90px]"
          style={{ background: "radial-gradient(circle, #8B3A1A 0%, #D4682A 55%, transparent 100%)" }}
        />
        <div
          className="blob-b absolute bottom-[2%] left-[-14%] w-[42vw] h-[42vw] max-w-[580px] max-h-[580px] rounded-full opacity-14 blur-[110px]"
          style={{ background: "radial-gradient(circle, #D4682A 0%, #7A3010 60%, transparent 100%)" }}
        />
        <div
          className="blob-c absolute top-[30%] left-[20%] w-[28vw] h-[28vw] max-w-[400px] max-h-[400px] rounded-full opacity-8 blur-[80px]"
          style={{ background: "radial-gradient(circle, #F0A060 0%, transparent 100%)" }}
        />
      </div>

      {/* ── Layer 2: road path SVG ── */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 pointer-events-none will-change-transform opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0">
          <RoadPath />
        </div>
      </div>

      {/* ── Fine dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(243,233,213,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Layer 3: Route 9 sign (parallaxes faster) ── */}
      <div
        ref={layer3Ref}
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        aria-hidden
        style={{ width: "min(34vw, 400px)" }}
      >
        <Route9Graphic />
      </div>

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full will-change-transform"
      >
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,104,42,0.35)] bg-[rgba(212,104,42,0.1)] text-xs font-medium text-[#D4A070] tracking-wide mb-10 reveal">
          <MapPin size={11} className="text-[#D4682A]" />
          {HERO.label}
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A] flex-shrink-0 animate-pulse ml-1" aria-hidden />
        </div>

        {/* Headline — split word reveal */}
        <h1
          className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.9] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <SplitTextReveal
            as="span"
            className="block text-[#F3E9D5]"
            delay={200}
            stagger={90}
            duration={1000}
          >
            {HERO.headlineA}
          </SplitTextReveal>
          <SplitTextReveal
            as="span"
            className="block text-gradient italic"
            delay={400}
            stagger={90}
            duration={1000}
          >
            {HERO.headlineB}
          </SplitTextReveal>
        </h1>

        {/* Subhead */}
        <p
          className="max-w-xl text-lg md:text-xl text-[#9B8C7D] leading-relaxed mb-10 reveal"
          style={{ transitionDelay: "600ms" }}
        >
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 reveal" style={{ transitionDelay: "750ms" }}>
          <MagneticButton>
            <a
              href={HERO.ctaPrimary.href}
              className="glow-btn inline-flex items-center justify-center gap-2.5 px-8 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-[#FEFBF5] font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
              style={{ height: "52px", fontFamily: "var(--font-geist)" }}
            >
              {HERO.ctaPrimary.text}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={HERO.ctaSecondary.href}
              className="inline-flex items-center justify-center px-8 rounded-xl border border-[rgba(243,233,213,0.15)] bg-[rgba(243,233,213,0.05)] hover:bg-[rgba(243,233,213,0.09)] text-[#F3E9D5] font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
              style={{ height: "52px" }}
            >
              {HERO.ctaSecondary.text}
            </a>
          </MagneticButton>
        </div>

        {/* Trust line */}
        <p
          className="mt-8 text-xs text-[#9B8C7D]/50 tracking-wide reveal"
          style={{ transitionDelay: "900ms" }}
        >
          No contracts · No lock-in · Free preview before you pay anything
        </p>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="relative mt-8 border-t border-[rgba(212,104,42,0.1)] pt-6 pb-6">
        <Marquee items={WHO.businessTypes} />
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 reveal"
        style={{ transitionDelay: "1200ms" }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#9B8C7D]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#D4682A] to-transparent" />
      </div>
    </section>
  );
}
