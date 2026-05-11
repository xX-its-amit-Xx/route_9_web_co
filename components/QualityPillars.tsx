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
      className="py-24 md:py-32 bg-[#0D2118] border-t border-[rgba(77,201,112,0.08)]"
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#4DC970] mb-3">
            How I build
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F0E8D0] leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Six things every site<br />gets right. No exceptions.
          </h2>
          <p className="mt-4 max-w-xl text-[#87A891] text-lg">
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
                <article className="group h-full flex flex-col gap-4 p-6 rounded-2xl glass cursor-default hover:border-[rgba(77,201,112,0.3)] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(77,201,112,0.12)] text-[#4DC970] group-hover:bg-[#4DC970] group-hover:text-[#0D2118] transition-all duration-200">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[rgba(77,201,112,0.2)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4DC970]" />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#F0E8D0] mb-2"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      {pillar.heading}
                    </h3>
                    <p className="text-sm text-[#87A891] leading-relaxed">{pillar.body}</p>
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
