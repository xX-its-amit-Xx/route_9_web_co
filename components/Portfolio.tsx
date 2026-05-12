"use client";

import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
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
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Portfolio loading.<br />Quality already here.
          </h2>
          <p className="mt-4 max-w-xl text-muted text-lg">
            First clients are being onboarded now.{" "}
            <a href="#contact" className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent">
              Ask for a live preview
            </a>{" "}
            of what I&apos;d build for your shop — before you pay anything.
          </p>
        </div>

        <div
          ref={gridRef}
          className="reveal reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PORTFOLIO.map((item) => (
            <TiltCard key={item.label} intensity={6}>
              <article className="group flex flex-col rounded-2xl border border-border bg-surface-raised overflow-hidden hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
                {/* Placeholder gradient */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5" />
                  <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs font-semibold text-stone-500 tracking-wide">Preview coming</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div>
                    <h3 className="font-semibold text-fg text-sm">{item.label}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      disabled
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-light cursor-not-allowed"
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
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
