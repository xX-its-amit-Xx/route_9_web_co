"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SplitTextReveal } from "./SplitTextReveal";
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
  const [paused, setPaused] = useState(false);

  const advance = useCallback(
    (dir: 1 | -1) => {
      setCurrent((c) => (c + dir + items.length) % items.length);
      setKey((k) => k + 1);
    },
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => advance(1), 5500);
    return () => clearInterval(id);
  }, [paused, advance, items.length]);

  const t = items[current];

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 overflow-hidden border-t border-[#E8D9C4] relative"
      style={{ background: "#FFF8F3" }}
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* New England maple branch watermark — top right */}
      <svg
        viewBox="0 0 320 280"
        fill="none"
        aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{ width: "min(320px, 45vw)", opacity: 0.045, transform: "rotate(12deg) translate(15%, -10%)" }}
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
        <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="label-pill mb-4 reveal">What clients say</div>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              Real shops. Real results.
            </SplitTextReveal>
            <p className="text-sm text-[#B0A090] mt-2 italic reveal" style={{ fontFamily: "var(--font-display)", transitionDelay: "300ms" }}>
              From Shrewsbury to Framingham, along Route 9.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 reveal" style={{ transitionDelay: "200ms" }}>
            <button
              onClick={() => advance(-1)}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E8D9C4] bg-white hover:border-[rgba(212,104,42,0.4)] hover:bg-[rgba(212,104,42,0.06)] text-[#7A6B5C] hover:text-[#D4682A] transition-all duration-150 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => advance(1)}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E8D9C4] bg-white hover:border-[rgba(212,104,42,0.4)] hover:bg-[rgba(212,104,42,0.06)] text-[#7A6B5C] hover:text-[#D4682A] transition-all duration-150 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Card */}
        <div
          key={key}
          className="testimonial-enter rounded-3xl p-8 md:p-12 max-w-3xl relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #FFFFFF 0%, #FDFAF7 100%)",
            border: "1px solid #E8D9C4",
            boxShadow:
              "0 2px 4px rgba(28,18,9,0.04), 0 8px 32px rgba(28,18,9,0.07), 0 32px 80px rgba(28,18,9,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
            borderLeft: "4px solid #D4682A",
          }}
        >
          {/* Giant decorative open-quote mark */}
          <div
            aria-hidden
            className="absolute top-4 left-6 select-none pointer-events-none"
            style={{
              fontSize: "160px",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "rgba(212,104,42,0.07)",
            }}
          >
            &ldquo;
          </div>

          {/* Business type photo (top-right accent) */}
          {SHOP_PHOTOS[t.business] && (
            <div className="absolute top-6 right-6 md:top-8 md:right-10 w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: "2px solid #E8D9C4", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
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
          <div className="flex gap-1 mb-6 relative">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-[#D4682A] text-[#D4682A]" />
            ))}
          </div>

          <blockquote
            className="relative text-xl md:text-2xl text-[#1C1209] font-medium leading-relaxed mb-8 italic pr-20"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-4 relative">
            <div
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
              <p className="font-semibold text-[#1C1209]" style={{ fontFamily: "var(--font-display)" }}>{t.author}</p>
              <p className="text-sm text-[#7A6B5C] flex items-center gap-1.5">
                {t.business}
                <span className="text-[#E8D9C4]">·</span>
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
        <div className="flex items-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setKey((k) => k + 1); }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-[#D4682A]"
                  : "w-1.5 bg-[rgba(212,104,42,0.3)] hover:bg-[rgba(212,104,42,0.5)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
