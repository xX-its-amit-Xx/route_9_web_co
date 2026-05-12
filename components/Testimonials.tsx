"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SplitTextReveal } from "./SplitTextReveal";
import { TESTIMONIALS } from "@/lib/content";

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
      className="py-24 md:py-32 overflow-hidden border-t border-[rgba(212,104,42,0.1)]"
      style={{ background: "#1C1209" }}
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#D4682A] mb-3 reveal">
              What clients say
            </p>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3E9D5] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              Real shops. Real results.
            </SplitTextReveal>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 reveal" style={{ transitionDelay: "200ms" }}>
            <button
              onClick={() => advance(-1)}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(212,104,42,0.2)] bg-[rgba(212,104,42,0.06)] hover:border-[rgba(212,104,42,0.5)] hover:bg-[rgba(212,104,42,0.12)] text-[#9B8C7D] hover:text-[#F3E9D5] transition-all duration-150"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => advance(1)}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(212,104,42,0.2)] bg-[rgba(212,104,42,0.06)] hover:border-[rgba(212,104,42,0.5)] hover:bg-[rgba(212,104,42,0.12)] text-[#9B8C7D] hover:text-[#F3E9D5] transition-all duration-150"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Card */}
        <div
          key={key}
          className="testimonial-enter shine glass-warm rounded-3xl p-8 md:p-12 max-w-3xl"
        >
          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-[#D4682A] text-[#D4682A]" />
            ))}
          </div>

          <blockquote
            className="text-xl md:text-2xl text-[#F3E9D5] font-medium leading-relaxed mb-8 italic"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4682A] text-[#FEFBF5] font-bold text-sm flex-shrink-0">
              {t.initials}
            </div>
            <div>
              <p className="font-semibold text-[#F3E9D5]" style={{ fontFamily: "var(--font-display)" }}>{t.author}</p>
              <p className="text-sm text-[#9B8C7D]">
                {t.business} · {t.town}
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
                  : "w-1.5 bg-[rgba(212,104,42,0.2)] hover:bg-[rgba(212,104,42,0.4)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
