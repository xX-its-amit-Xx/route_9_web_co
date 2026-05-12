"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { SplitTextReveal } from "./SplitTextReveal";
import { MagneticButton } from "./MagneticButton";

// Inline SVG: Route 9 highway shield
function Route9Graphic() {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="w-full h-full"
    >
      <path
        d="M130 14 L246 56 L246 188 Q246 268 130 306 Q14 268 14 188 L14 56 Z"
        stroke="rgba(212,104,42,0.3)"
        strokeWidth="1.5"
        fill="rgba(212,104,42,0.04)"
        strokeLinejoin="round"
      />
      <path
        d="M130 32 L228 68 L228 186 Q228 256 130 288 Q32 256 32 186 L32 68 Z"
        stroke="rgba(212,104,42,0.12)"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <text x="130" y="100" textAnchor="middle" fontFamily="var(--font-geist, monospace)" fontSize="17" fontWeight="700" letterSpacing="7" fill="rgba(212,104,42,0.5)">ROUTE</text>
      <text x="130" y="208" textAnchor="middle" fontFamily="var(--font-display)" fontSize="145" fontWeight="400" fontStyle="italic" fill="rgba(212,104,42,0.15)">9</text>
      <text x="130" y="248" textAnchor="middle" fontFamily="var(--font-geist, monospace)" fontSize="13" fontWeight="600" letterSpacing="6" fill="rgba(212,104,42,0.3)">MA</text>
      <line x1="14" y1="80" x2="28" y2="80" stroke="rgba(212,104,42,0.18)" strokeWidth="1" />
      <line x1="246" y1="80" x2="232" y2="80" stroke="rgba(212,104,42,0.18)" strokeWidth="1" />
    </svg>
  );
}

// Winding road path
function RoadPath() {
  return (
    <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="w-full h-full">
      <path d="M-50 380 Q200 200 400 250 Q600 300 850 80" stroke="rgba(212,104,42,0.09)" strokeWidth="44" strokeLinecap="round" fill="none" />
      <path d="M-50 380 Q200 200 400 250 Q600 300 850 80" stroke="rgba(243,233,213,0.06)" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 14" fill="none" />
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (blobsRef.current) blobsRef.current.style.transform = `translateY(${y * 0.12}px)`;
      if (roadRef.current) roadRef.current.style.transform = `translateY(${y * 0.22}px)`;
      if (signRef.current) signRef.current.style.transform = `translateY(${y * 0.07}px)`;
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
      {/* ── WARM SUN AURA (the "human" moment — a sunrise behind the text) ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "30%",
          transform: "translate(-50%, -55%)",
          width: "min(75vw, 800px)",
          height: "min(75vw, 800px)",
          background: "radial-gradient(ellipse at 50% 50%, rgba(220,120,40,0.22) 0%, rgba(180,80,20,0.12) 30%, rgba(212,104,42,0.05) 55%, transparent 72%)",
          borderRadius: "50%",
          filter: "blur(4px)",
          zIndex: 1,
        }}
      />
      {/* Second softer ring */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "30%",
          transform: "translate(-50%, -55%)",
          width: "min(50vw, 560px)",
          height: "min(50vw, 560px)",
          background: "radial-gradient(ellipse, rgba(240,140,60,0.1) 0%, transparent 65%)",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* ── Animated blobs (subtle, behind the aura) ── */}
      <div ref={blobsRef} className="absolute inset-0 pointer-events-none will-change-transform" aria-hidden style={{ zIndex: 0 }}>
        <div className="blob-a absolute top-[-8%] right-[-6%] w-[44vw] h-[44vw] max-w-[620px] max-h-[620px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, #6B2A0E 0%, #D4682A 55%, transparent 100%)" }} />
        <div className="blob-b absolute bottom-[4%] left-[-10%] w-[38vw] h-[38vw] max-w-[520px] max-h-[520px] rounded-full opacity-12 blur-[110px]" style={{ background: "radial-gradient(circle, #D4682A 0%, #7A3010 60%, transparent 100%)" }} />
      </div>

      {/* ── Background photo texture (very subtle — adds real-world depth) ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=60"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.055, mixBlendMode: "luminosity" }}
          loading="eager"
        />
      </div>

      {/* ── Road path ── */}
      <div ref={roadRef} className="absolute inset-0 pointer-events-none will-change-transform" aria-hidden style={{ zIndex: 0 }}>
        <RoadPath />
      </div>

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden style={{ backgroundImage: "radial-gradient(circle, rgba(243,233,213,0.7) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />

      {/* ── Route 9 sign (parallaxes gently) ── */}
      <div ref={signRef} className="absolute right-[-1%] top-1/2 -translate-y-1/2 pointer-events-none will-change-transform" aria-hidden style={{ width: "min(32vw, 380px)", zIndex: 2 }}>
        <Route9Graphic />
      </div>

      {/* ── Main content ── */}
      <div ref={contentRef} className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full will-change-transform" style={{ zIndex: 3 }}>

        {/* Location badge */}
        <div className="label-pill mb-10 reveal" style={{ transitionDelay: "100ms" }}>
          <MapPin size={10} />
          {HERO.label}
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A] animate-pulse" aria-hidden />
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.9] tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <SplitTextReveal as="span" className="block text-[#F3E9D5]" delay={150} stagger={85} duration={950}>
            {HERO.headlineA}
          </SplitTextReveal>
          <SplitTextReveal as="span" className="block text-gradient italic" delay={350} stagger={85} duration={950}>
            {HERO.headlineB}
          </SplitTextReveal>
        </h1>

        {/* Subhead */}
        <p className="max-w-xl text-lg md:text-xl leading-relaxed mb-10 reveal" style={{ color: "rgba(243,233,213,0.65)", transitionDelay: "580ms" }}>
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 reveal" style={{ transitionDelay: "720ms" }}>
          <MagneticButton>
            <a
              href={HERO.ctaPrimary.href}
              className="glow-btn inline-flex items-center justify-center gap-2.5 px-8 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
              style={{ height: "52px" }}
            >
              {HERO.ctaPrimary.text}
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={HERO.ctaSecondary.href}
              className="inline-flex items-center justify-center px-8 rounded-xl border text-[#F3E9D5] font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
              style={{ height: "52px", borderColor: "rgba(243,233,213,0.18)", background: "rgba(243,233,213,0.06)" }}
            >
              {HERO.ctaSecondary.text}
            </a>
          </MagneticButton>
        </div>

        {/* Shop proof strip */}
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

        {/* Trust line */}
        <p className="mt-3 text-xs tracking-wide reveal" style={{ color: "rgba(243,233,213,0.35)", transitionDelay: "980ms" }}>
          No contracts · No lock-in · Free preview before you pay anything
        </p>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="relative mt-8 border-t border-[rgba(212,104,42,0.1)] pt-5 pb-5" style={{ zIndex: 3 }}>
        <Marquee items={WHO.businessTypes} />
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal" style={{ transitionDelay: "1100ms", zIndex: 3 }} aria-hidden>
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(243,233,213,0.3)" }}>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(212,104,42,0.6)] to-transparent" />
      </div>
    </section>
  );
}
