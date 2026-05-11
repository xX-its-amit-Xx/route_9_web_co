"use client";

import {
  Smartphone,
  Zap,
  MousePointerClick,
  MapPin,
  Accessibility,
  Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { PILLARS } from "@/lib/content";

const ICON_MAP = {
  Smartphone,
  Zap,
  MousePointerClick,
  MapPin,
  Accessibility,
  Wrench,
} as const;

export function QualityPillars() {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 bg-surface border-t border-border-subtle"
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            How I build
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Six things every site<br />gets right.
          </h2>
        </div>

        {/* Pillars grid */}
        <div
          ref={gridRef}
          className="reveal reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <article
                key={pillar.heading}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-surface-raised hover:border-accent/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-light text-accent group-hover:bg-accent group-hover:text-accent-fg transition-colors duration-200">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-fg mb-2 text-base">
                    {pillar.heading}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{pillar.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
