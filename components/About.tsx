"use client";

import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SplitTextReveal } from "./SplitTextReveal";
import { BrandSeal } from "./BrandSeal";
import { HandwrittenSignature } from "./HandwrittenSignature";
import { Matchbook } from "./Matchbook";
import { NewspaperClipping } from "./NewspaperClipping";
import { ABOUT, SITE } from "@/lib/content";

export function About() {
  const bodyRef   = useScrollReveal();
  const leftRef   = useScrollReveal();
  const photoRef  = useRef<HTMLImageElement>(null);
  const bannerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const onScroll = () => {
      const banner = bannerRef.current;
      const img    = photoRef.current;
      if (!banner || !img) return;
      const rect     = banner.getBoundingClientRect();
      const progress = -rect.top / (window.innerHeight + rect.height);
      img.style.transform = `scale(1.08) translateY(${progress * 28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Atmospheric street photo with matchbook artifact ── */}
        <div className="relative mb-14">
          <div ref={bannerRef} className="relative w-full h-44 md:h-60 rounded-3xl overflow-hidden reveal group">
            <img
              ref={photoRef}
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&auto=format&fit=crop&q=80"
              alt="A warm café along Route 9, Shrewsbury MA"
              loading="lazy"
              className="w-full h-full object-cover object-center"
              style={{ willChange: "transform", transform: "scale(1.08)" }}
            />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1209]/80 via-[#1C1209]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1209]/45 to-transparent" />
          {/* Text overlay */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <p className="text-white/45 text-[10px] tracking-[0.22em] uppercase mb-2 font-semibold">
              Route 9 · Shrewsbury, MA
            </p>
            <p
              className="text-white text-2xl md:text-3xl font-bold italic leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your neighborhood.<br />My backyard.
            </p>
            <p className="text-white/35 text-[11px] mt-2 tracking-wide">
              Lake Quinsigamond · Shrewsbury Center · Route 9
            </p>
          </div>
          {/* MA·9 badge */}
          <div
            className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-white/20"
            style={{
              background: "linear-gradient(145deg, #F08040 0%, #D4682A 45%, #A84818 100%)",
              boxShadow: "0 0 0 3px rgba(212,104,42,0.25), 0 8px 28px rgba(212,104,42,0.7), 0 16px 48px rgba(212,104,42,0.35), inset 0 2px 0 rgba(255,220,140,0.35), inset 0 -2px 0 rgba(0,0,0,0.25)",
            }}
            aria-hidden
          >
            <span className="text-[8px] font-bold text-white/80 tracking-widest leading-none">MA</span>
            <span
              className="text-2xl font-bold text-white italic leading-none"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              9
            </span>
          </div>
          </div>

          {/* Matchbook artifact — tucked into the bottom-left corner of
              the banner. Desktop only; would crowd narrow viewports. */}
          <div
            aria-hidden
            className="hidden md:block absolute pointer-events-none"
            style={{ left: "-12px", bottom: "-22px", zIndex: 2 }}
          >
            <Matchbook size={156} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={leftRef}>
            <div className="label-pill mb-4 reveal">About</div>
            <SplitTextReveal
              as="h2"
              id="about-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              Local work, done locally.
            </SplitTextReveal>

            {/* Animated wavy underline — draws on scroll */}
            <div className="reveal mb-6" style={{ transitionDelay: "500ms" }}>
              <svg viewBox="0 0 220 9" fill="none" className="w-[clamp(130px,40%,210px)]" aria-hidden>
                <path
                  className="draw-underline-path"
                  d="M2 5 Q30 2 58 5 Q86 8 114 5 Q142 2 170 5 Q198 8 218 5"
                  stroke="#D4682A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Quick stats */}
            <dl className="grid grid-cols-3 gap-3 mb-6 reveal" style={{ transitionDelay: "320ms" }}>
              {[
                { value: "< 2hr", label: "Avg reply time" },
                { value: "Days", label: "Not months" },
                { value: "MA-9", label: "Your neighbor" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center px-2 py-3 rounded-xl border transition-all duration-200 border-[rgba(212,104,42,0.12)] bg-[rgba(212,104,42,0.03)] hover:bg-[rgba(212,104,42,0.07)] hover:border-[rgba(212,104,42,0.22)] hover:shadow-[0_4px_16px_rgba(212,104,42,0.1)]"
                >
                  <dt
                    className="font-extrabold leading-none mb-1"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "18px", color: "#D4682A" }}
                  >
                    {value}
                  </dt>
                  <dd className="text-[9px] font-semibold tracking-wide uppercase text-muted" style={{ letterSpacing: "0.1em" }}>
                    {label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Route 9 sign element — now featuring the official brand seal */}
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface reveal float-after-reveal transition-all duration-200 hover:border-[rgba(212,104,42,0.28)] hover:shadow-[0_4px_20px_rgba(212,104,42,0.1)]" style={{ transitionDelay: "300ms" }}>
              <BrandSeal size={72} tilt={-8} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-fg" style={{ fontFamily: "var(--font-display)" }}>{SITE.name}</p>
                <p className="text-xs text-muted">{SITE.location} · Est. {SITE.founded}</p>
                <p className="text-xs text-muted mt-0.5">Serving Route 9 since day one</p>
              </div>
            </div>
          </div>

          {/* Right: body */}
          <div ref={bodyRef} className="space-y-5">
            {ABOUT.paragraphs.map((p, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <p className="text-muted leading-relaxed">{p}</p>
              </div>
            ))}

            {/* AI transparency */}
            <div
              className="reveal mt-6 p-5 rounded-2xl border border-border-subtle bg-surface"
              style={{ transitionDelay: `${ABOUT.paragraphs.length * 90}ms` }}
            >
              <p className="text-sm text-muted leading-relaxed italic" style={{ fontFamily: "var(--font-display)" }}>
                &ldquo;{ABOUT.aiNote}&rdquo;
              </p>
            </div>

            {(SITE.personalSite as string) !== "PLACEHOLDER_PERSONAL_SITE" && (
              <div className="reveal" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 1) * 90}ms` }}>
                <a
                  href={SITE.personalSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover underline-grow underline-offset-4 transition-colors duration-150"
                >
                  {ABOUT.moreLinkText}
                </a>
              </div>
            )}

            {/* Vintage newspaper clipping — fictional "press coverage" */}
            <div className="reveal mt-8" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 1.5) * 90}ms` }}>
              <NewspaperClipping />
            </div>

            {/* Hand-drawn ink signature — draws on when scrolled into view */}
            <div className="mt-8 reveal" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 2) * 90}ms` }}>
              <HandwrittenSignature />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
