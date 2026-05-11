"use client";

import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { PORTFOLIO } from "@/lib/content";

export function Portfolio() {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="portfolio"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-label="Recent work"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            Recent work
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            The portfolio is coming.<br />The quality isn&apos;t.
          </h2>
          <p className="mt-4 max-w-xl text-muted text-lg">
            First clients are being onboarded now. Check back soon for live work — or
            just ask for a preview of what I&apos;d build for your shop.
          </p>
        </div>

        {/* Portfolio grid */}
        <div
          ref={gridRef}
          className="reveal reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PORTFOLIO.map((item) => (
            <article
              key={item.label}
              className="group flex flex-col rounded-2xl border border-border bg-surface-raised overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-200"
            >
              {/* Placeholder image — gradient color block */}
              <div
                className={`h-44 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
              >
                <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80">
                  <span className="text-xs font-semibold text-stone-500 tracking-wide">
                    Preview coming
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <div>
                  <h3 className="font-semibold text-fg text-sm">{item.label}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <button
                    disabled
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-light cursor-not-allowed"
                    aria-label="Live site coming soon"
                  >
                    <ExternalLink size={12} />
                    View Live
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-surface text-muted-light text-[10px] border border-border">
                      Soon
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
