import { ArrowRight } from "lucide-react";
import { HERO } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background: subtle radial green tint + dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(27,107,62,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(27,107,62,0.05)_0%,transparent_50%)]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Decorative "9" — the visual anchor */}
      <div
        aria-hidden
        className="absolute right-[-0.1em] top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(16rem, 40vw, 36rem)",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--accent)",
          opacity: 0.045,
          letterSpacing: "-0.04em",
        }}
      >
        9
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-20 w-full">
        {/* Location label */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-medium text-muted tracking-wide mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
            aria-hidden
          />
          {HERO.label}
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6 text-fg"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          <span className="block">{HERO.headlineA}</span>
          <span className="block text-accent">{HERO.headlineB}</span>
        </h1>

        {/* Subhead */}
        <p className="max-w-xl text-lg md:text-xl text-muted leading-relaxed mb-10">
          {HERO.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={HERO.ctaPrimary.href}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-accent hover:bg-accent-hover text-accent-fg font-medium text-sm transition-all duration-150 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-px"
          >
            {HERO.ctaPrimary.text}
            <ArrowRight size={15} strokeWidth={2.5} />
          </a>
          <a
            href={HERO.ctaSecondary.href}
            className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-border bg-surface-raised hover:bg-surface hover:border-border text-fg font-medium text-sm transition-all duration-150 hover:-translate-y-px"
          >
            {HERO.ctaSecondary.text}
          </a>
        </div>

        {/* Social proof hint */}
        <p className="mt-10 text-xs text-muted-light">
          No contracts. No lock-in. Free preview before you pay anything.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-light"
        aria-hidden
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-border" />
      </div>
    </section>
  );
}
