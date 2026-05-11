import { ArrowRight } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#0D2118]"
      aria-label="Hero"
    >
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="blob-a absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#1B6B3E] opacity-30 blur-[80px]"
        />
        <div
          className="blob-b absolute bottom-[10%] left-[-10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[#4DC970] opacity-10 blur-[100px]"
        />
        <div
          className="blob-c absolute top-[40%] left-[30%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full bg-[#2A9A56] opacity-15 blur-[60px]"
        />
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(77,201,112,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative "9" */}
      <div
        aria-hidden
        className="absolute right-[-0.05em] top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(14rem, 38vw, 34rem)",
          fontWeight: 800,
          lineHeight: 1,
          color: "#4DC970",
          opacity: 0.05,
          letterSpacing: "-0.04em",
        }}
      >
        9
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(77,201,112,0.3)] bg-[rgba(77,201,112,0.08)] text-xs font-medium text-[#87A891] tracking-wide mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#4DC970] flex-shrink-0 animate-pulse"
            aria-hidden
          />
          {HERO.label}
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-extrabold tracking-tight leading-[0.92] mb-6"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          <span className="block text-[#F0E8D0]">{HERO.headlineA}</span>
          <span className="block text-gradient">{HERO.headlineB}</span>
        </h1>

        {/* Subhead */}
        <p className="max-w-xl text-lg md:text-xl text-[#87A891] leading-relaxed mb-10">
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={HERO.ctaPrimary.href}
            className="glow-btn inline-flex items-center justify-center gap-2 h-13 px-7 rounded-xl bg-[#4DC970] hover:bg-[#5EDA82] text-[#0D2118] font-bold text-sm transition-all duration-150 hover:-translate-y-0.5"
            style={{ height: "52px" }}
          >
            {HERO.ctaPrimary.text}
            <ArrowRight size={15} strokeWidth={2.5} />
          </a>
          <a
            href={HERO.ctaSecondary.href}
            className="inline-flex items-center justify-center h-[52px] px-7 rounded-xl border border-[rgba(240,232,208,0.15)] bg-[rgba(240,232,208,0.06)] hover:bg-[rgba(240,232,208,0.1)] text-[#F0E8D0] font-medium text-sm transition-all duration-150 hover:-translate-y-0.5"
          >
            {HERO.ctaSecondary.text}
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-[#87A891]/60">
          No contracts · No lock-in · Free preview before you pay anything
        </p>
      </div>

      {/* Marquee — business types ticker */}
      <div className="relative mt-8 border-t border-[rgba(77,201,112,0.1)] pt-6 pb-6">
        <Marquee items={WHO.businessTypes} />
      </div>
    </section>
  );
}
