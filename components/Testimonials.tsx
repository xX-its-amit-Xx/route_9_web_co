"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TextScramble } from "./TextScramble";
import { PolaroidPinboard } from "./PolaroidPinboard";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TESTIMONIALS } from "@/lib/content";

// Maps business names → Unsplash photo IDs
const SHOP_PHOTOS: Record<string, string> = {
  "Westborough Bakery":     "1509440159596-0249088772ff",
  "Dave's Barbershop":      "1585747860715-2ba37e788b70",
  "The Pressed Bloom":      "1522337360788-8b13dee7a37e",
  "Framingham Framing Co.": "1472851294608-062f824d29cc",
  "Tony's Auto & Tire":     "1517248135467-4c7edcad34c4",
};

export function Testimonials() {
  const items = TESTIMONIALS;
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const mapleRef = useRef<SVGSVGElement>(null);
  const sectionInView = useRef(false);
  const allowMotion = useRef(false);
  const headingRef = useScrollReveal();

  useEffect(() => {
    allowMotion.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const el = mapleRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const progress = -rect.top / (window.innerHeight + rect.height);
      el.style.transform = `translateY(${progress * 40}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const advance = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setCurrent((c) => (c + d + items.length) % items.length);
      setKey((k) => k + 1);
    },
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => advance(1), 5500);
    return () => clearInterval(id);
  }, [paused, advance, items.length]);

  // Track section visibility — arrow keys only fire when testimonials are in view
  useEffect(() => {
    const section = document.getElementById("testimonials");
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => { sectionInView.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation — Arrow keys advance/retreat slides (skip when typing or off-screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionInView.current) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === "ArrowRight") advance(1);
      else if (e.key === "ArrowLeft") advance(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
    setPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 6) isDragging.current = true;
    if (allowMotion.current) {
      const tilt = Math.max(-9, Math.min(9, delta * 0.065));
      (e.currentTarget as HTMLElement).style.transform = `perspective(900px) rotateY(${tilt}deg)`;
      (e.currentTarget as HTMLElement).style.transition = "transform 0.08s ease-out";
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (isDragging.current && Math.abs(delta) > 44) {
      advance(delta < 0 ? 1 : -1 as 1 | -1);
    }
    dragStartX.current = null;
    isDragging.current = false;
    setPaused(false);
    if (allowMotion.current) {
      (e.currentTarget as HTMLElement).style.transform = "";
      (e.currentTarget as HTMLElement).style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    }
  };

  const t = items[current];

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 overflow-hidden border-t border-border-subtle relative"
      style={{ background: "var(--section-warm-a)" }}
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* New England maple branch watermark — top right, scroll parallax */}
      <svg
        ref={mapleRef}
        viewBox="0 0 320 280"
        fill="none"
        aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{
          width: "min(320px, 45vw)",
          opacity: 0.045,
          /* Resting state matches keyframe 0%/100% so reduced-motion reversion
             lands at the intended diagonal position instead of transform:none */
          transform: "rotate(12deg) translate(15%, -10%)",
          transformOrigin: "bottom center",
          willChange: "transform",
          animation: "sway-gentle 9s ease-in-out infinite",
        }}
      >
        {/* Main trunk */}
        <path d="M160 280 C160 240 155 200 158 160 C161 120 155 80 160 40" stroke="#D4682A" strokeWidth="4" strokeLinecap="round" />
        {/* Left branches */}
        <path d="M158 160 C140 145 115 138 90 130" stroke="#D4682A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M158 130 C135 118 108 108 82 95" stroke="#D4682A" strokeWidth="2" strokeLinecap="round" />
        <path d="M90 130 C78 118 65 110 50 100" stroke="#D4682A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M82 95 C68 85 54 76 38 68" stroke="#D4682A" strokeWidth="1.2" strokeLinecap="round" />
        {/* Right branches */}
        <path d="M159 160 C178 148 202 140 228 134" stroke="#D4682A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M158 125 C180 112 205 102 232 96" stroke="#D4682A" strokeWidth="2" strokeLinecap="round" />
        <path d="M228 134 C240 122 252 112 268 104" stroke="#D4682A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M232 96 C248 84 262 74 278 66" stroke="#D4682A" strokeWidth="1.2" strokeLinecap="round" />
        {/* Small twigs */}
        <path d="M50 100 C44 92 36 88 26 80" stroke="#D4682A" strokeWidth="1" strokeLinecap="round" />
        <path d="M38 68 C32 58 24 52 14 46" stroke="#D4682A" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M268 104 C276 94 284 88 294 80" stroke="#D4682A" strokeWidth="1" strokeLinecap="round" />
        <path d="M278 66 C286 56 292 50 302 44" stroke="#D4682A" strokeWidth="0.8" strokeLinecap="round" />
        {/* Upper branches */}
        <path d="M160 80 C145 68 128 58 112 48" stroke="#D4682A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M160 80 C175 68 190 56 206 46" stroke="#D4682A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M112 48 C102 40 90 34 76 26" stroke="#D4682A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M206 46 C218 38 230 30 244 22" stroke="#D4682A" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="label-pill mb-4 reveal">What clients say</div>
            <TextScramble
              as="h2"
              id="testimonials-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              speed={3}
            >
              Real shops. Real results.
            </TextScramble>
            <p className="text-sm text-muted mt-2 italic reveal" style={{ fontFamily: "var(--font-display)", transitionDelay: "300ms" }}>
              From Shrewsbury to Framingham, along Route 9.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 reveal" style={{ transitionDelay: "200ms" }}>
            {/* Slide counter — visual only; sr-only live region announces changes */}
            <div
              className="flex items-baseline gap-0.5 mr-1 select-none"
              aria-hidden="true"
            >
              <span
                className="font-bold tabular-nums"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "20px", color: "#D4682A", lineHeight: 1 }}
              >
                {String(current + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "10px", color: "#D4B090", fontWeight: 600, letterSpacing: "0.06em", alignSelf: "flex-end", marginBottom: "2px" }}>
                &thinsp;/&thinsp;{String(items.length).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={() => advance(-1)}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface-raised hover:border-[rgba(212,104,42,0.4)] hover:bg-[rgba(212,104,42,0.06)] text-muted hover:text-accent transition-all duration-150 shadow-sm"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              onClick={() => advance(1)}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface-raised hover:border-[rgba(212,104,42,0.4)] hover:bg-[rgba(212,104,42,0.06)] text-muted hover:text-accent transition-all duration-150 shadow-sm"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Decorative pinboard of Route 9 scenes above the carousel */}
        <div className="mb-12 reveal">
          <PolaroidPinboard />
        </div>

        {/* Stable sr-only live region — content updates in-place so AT reliably
            announces new testimonials even when the visual card is remounted */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {t.quote} — {t.author}, {t.business}, {t.town}
        </p>

        {/* Visual card — keyed for animation; no live region needed here */}
        <div
          key={key}
          className={`group ${dir === 1 ? "testimonial-enter" : "testimonial-enter-left"} rounded-3xl p-8 md:p-12 max-w-3xl relative overflow-hidden select-none`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            background: "linear-gradient(160deg, var(--surface-raised) 0%, var(--surface) 60%, var(--surface) 100%)",
            border: "1px solid var(--border)",
            cursor: "grab",
            touchAction: "pan-y",
            boxShadow:
              "0 2px 4px rgba(28,18,9,0.04), 0 8px 32px rgba(28,18,9,0.09), 0 32px 80px rgba(28,18,9,0.06), 0 64px 120px rgba(212,104,42,0.04), inset 0 1px 0 var(--card-inset-top), inset 0 -1px 0 rgba(212,104,42,0.06)",
            borderLeft: "4px solid #D4682A",
          }}
        >
          {/* Route 9 shield letterhead watermark — fades in on hover */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{ zIndex: 0 }}
          >
            <svg viewBox="0 0 120 148" fill="none" style={{ width: "210px", height: "auto" }}>
              <path d="M60 6 L114 26 L114 88 Q114 128 60 142 Q6 128 6 88 L6 26 Z"
                fill="rgba(212,104,42,0.038)" stroke="rgba(212,104,42,0.045)" strokeWidth="1.5" />
              <text x="60" y="68" textAnchor="middle" fontSize="11" fill="rgba(212,104,42,0.042)"
                fontFamily="monospace" fontWeight="700" letterSpacing="3">ROUTE</text>
              <text x="62" y="112" textAnchor="middle" fontSize="56" fontStyle="italic"
                fill="rgba(212,104,42,0.048)" fontFamily="Georgia, serif" fontWeight="400">9</text>
            </svg>
          </div>

          {/* Warm glow behind quote */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: "-20px",
              left: "-20px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(212,104,42,0.06) 0%, transparent 70%)",
            }}
          />
          {/* Auto-advance progress bar */}
          <div aria-hidden className="testimonial-progress-track absolute bottom-0 left-0 right-0 h-[3px] rounded-b-3xl overflow-hidden">
            <div
              key={`pb-${key}`}
              style={{
                height: "100%",
                width: "100%",
                background: "linear-gradient(90deg, #D4682A, #F08040)",
                transformOrigin: "left center",
                animation: "testimonial-progress 5.5s linear forwards",
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </div>

          {/* Giant decorative open-quote mark — animates in on each slide change */}
          <div
            key={`q-${key}`}
            aria-hidden
            className="absolute top-4 left-6 select-none pointer-events-none"
            style={{
              fontSize: "160px",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "rgba(212,104,42,0.07)",
              animation: "quote-pop 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          >
            &ldquo;
          </div>

          {/* Business type photo (top-right accent) */}
          {SHOP_PHOTOS[t.business] && (
            <div aria-hidden className="absolute top-6 right-6 md:top-8 md:right-10 w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: "2px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            >
              <img
                src={`https://images.unsplash.com/photo-${SHOP_PHOTOS[t.business]}?w=120&auto=format&fit=crop&q=80`}
                alt={t.business}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Stars */}
          <div className="flex gap-1 mb-6 relative" role="img" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`${key}-star-${i}`}
                size={16}
                aria-hidden
                className="fill-[#D4682A] text-[#D4682A]"
                style={{ animation: `star-pop 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 65}ms both` }}
              />
            ))}
          </div>

          <blockquote
            className="relative text-xl md:text-2xl text-fg font-medium leading-relaxed mb-8 italic pr-20"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-4 relative">
            <div
              aria-hidden
              className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 50%, #C05A20 100%)",
                boxShadow: "0 2px 8px rgba(212,104,42,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
              }}
            >
              {t.initials}
            </div>
            <div>
              <p className="font-semibold text-fg" style={{ fontFamily: "var(--font-display)" }}>{t.author}</p>
              <p className="text-sm text-muted flex items-center gap-1.5">
                {t.business}
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#D4682A]" fill="none" aria-hidden>
                    <path d="M5 1C3.6 1 2.5 2.1 2.5 3.5 2.5 5.5 5 9 5 9s2.5-3.5 2.5-5.5C7.5 2.1 6.4 1 5 1z" fill="currentColor" fillOpacity="0.7" />
                  </svg>
                  {t.town}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center mt-8" style={{ gap: "2px" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); setKey((k) => k + 1); }}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className="flex items-center justify-center p-[9px]"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-[#D4682A]"
                    : "w-1.5 bg-[rgba(212,104,42,0.3)] hover:bg-[rgba(212,104,42,0.5)]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
