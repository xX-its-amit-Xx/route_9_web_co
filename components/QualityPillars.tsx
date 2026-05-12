"use client";

import {
  Smartphone, Zap, MousePointerClick, MapPin, Accessibility, Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { PILLARS } from "@/lib/content";

const ICON_MAP = {
  Smartphone, Zap, MousePointerClick, MapPin, Accessibility, Wrench,
} as const;

export function QualityPillars() {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 border-t border-[rgba(212,104,42,0.1)]"
      style={{ background: "#110B07" }}
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D4682A] mb-3">
            How I build
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3E9D5] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Six things every site<br />gets right. No exceptions.
          </h2>
          <p className="mt-4 max-w-xl text-[#9B8C7D] text-lg">
            These aren&apos;t upsells. They&apos;re the baseline.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="reveal reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <TiltCard key={pillar.heading}>
                <article className="shine group h-full flex flex-col gap-4 p-6 rounded-2xl glass cursor-default hover:border-[rgba(212,104,42,0.3)] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.12)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-[#FEFBF5] transition-all duration-200">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[rgba(212,104,42,0.25)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#F3E9D5] mb-2"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {pillar.heading}
                    </h3>
                    <p className="text-sm text-[#9B8C7D] leading-relaxed">{pillar.body}</p>
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
