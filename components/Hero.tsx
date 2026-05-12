"use client";

import { ArrowRight } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { MagneticButton } from "./MagneticButton";
import { useEffect, useRef } from "react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const blobs = el.querySelectorAll<HTMLElement>(".parallax-slow");
    const onScroll = () => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = i % 2 === 0 ? 0.15 : -0.1;
        b.style.transform = `translateY(${y * speed}px)`;
      });
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
      {/* Warm gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="blob-a parallax-slow absolute top-[-8%] right-[-8%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full opacity-25 blur-[90px]"
          style={{ background: "radial-gradient(circle, #8B3A1A 0%, #D4682A 60%, transparent 100%)" }}
        />
        <div
          className="blob-b parallax-slow absolute bottom-[5%] left-[-12%] w-[40vw] h-[40vw] max-w-[560px] max-h-[560px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, #D4682A 0%, #7A3010 60%, transparent 100%)" }}
        />
        <div
          className="blob-c absolute top-[35%] left-[25%] w-[25vw] h-[25vw] max-w-[360px] max-h-[360px] rounded-full opacity-10 blur-[70px]"
          style={{ background: "radial-gradient(circle, #F0A060 0%, transparent 100%)" }}
        />
      </div>

      {/* Fine texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(243,233,213,0.5) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Decorative "9" */}
      <div
        aria-hidden
        className="absolute right-[-0.04em] top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(14rem, 38vw, 34rem)",
          fontWeight: 900,
          fontStyle: "italic",
          lineHeight: 1,
          color: "#D4682A",
          opacity: 0.05,
          letterSpacing: "-0.04em",
        }}
      >
        9
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,104,42,0.35)] bg-[rgba(212,104,42,0.1)] text-xs font-medium text-[#D4A070] tracking-wide mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D4682A] flex-shrink-0 animate-pulse"
            aria-hidden
          />
          {HERO.label}
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold tracking-tight leading-[0.92] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="block text-[#F3E9D5]">{HERO.headlineA}</span>
          <span className="block text-gradient italic">{HERO.headlineB}</span>
        </h1>

        {/* Subhead */}
        <p className="max-w-xl text-lg md:text-xl text-[#9B8C7D] leading-relaxed mb-10">
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <MagneticButton>
            <a
              href={HERO.ctaPrimary.href}
              className="glow-btn inline-flex items-center justify-center gap-2 px-8 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-[#FEFBF5] font-bold text-sm transition-all duration-150 hover:-translate-y-0.5"
              style={{ height: "52px" }}
            >
              {HERO.ctaPrimary.text}
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={HERO.ctaSecondary.href}
              className="inline-flex items-center justify-center px-8 rounded-xl border border-[rgba(243,233,213,0.18)] bg-[rgba(243,233,213,0.05)] hover:bg-[rgba(243,233,213,0.09)] text-[#F3E9D5] font-medium text-sm transition-all duration-150 hover:-translate-y-0.5"
              style={{ height: "52px" }}
            >
              {HERO.ctaSecondary.text}
            </a>
          </MagneticButton>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-[#9B8C7D]/60">
          No contracts · No lock-in · Free preview before you pay anything
        </p>
      </div>

      {/* Marquee — business types ticker */}
      <div className="relative mt-8 border-t border-[rgba(212,104,42,0.1)] pt-6 pb-6">
        <Marquee items={WHO.businessTypes} />
      </div>
    </section>
  );
}
