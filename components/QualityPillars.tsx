"use client";

import {
  Smartphone, Zap, MousePointerClick, MapPin, Accessibility, Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { SplitTextReveal } from "./SplitTextReveal";
import { PILLARS } from "@/lib/content";

const ICON_MAP = {
  Smartphone, Zap, MousePointerClick, MapPin, Accessibility, Wrench,
} as const;

export function QualityPillars() {
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 border-t border-[#E8D9C4]"
      style={{ background: "#FFF8F3" }}
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="mb-14">
          <div className="label-pill mb-4 reveal">How I build</div>
          <SplitTextReveal
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            delay={0}
            stagger={70}
          >
            Six things every site gets right.
          </SplitTextReveal>
          <p className="mt-4 max-w-xl text-[#7A6B5C] text-lg reveal" style={{ transitionDelay: "400ms" }}>
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
                <article className="shine group card-light h-full flex flex-col gap-4 p-6 cursor-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-200">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[rgba(212,104,42,0.3)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#1C1209] mb-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {pillar.heading}
                    </h3>
                    <p className="text-sm text-[#7A6B5C] leading-relaxed">{pillar.body}</p>
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
