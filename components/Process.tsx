"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { PROCESS } from "@/lib/content";

export function Process() {
  const headingRef = useScrollReveal();
  const stepsRef = useScrollReveal(0.05);

  return (
    <section
      id="process"
      className="py-24 md:py-32 bg-surface border-t border-border-subtle"
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            How it works
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            From handshake to<br />live website in days.
          </h2>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="reveal reveal-stagger grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROCESS.map((step, i) => (
            <article key={step.step} className="relative flex flex-col gap-4">
              {/* Connector line (desktop only, between steps) */}
              {i < PROCESS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-5 left-full w-full h-px bg-border -translate-y-1/2 z-0"
                  style={{ left: "calc(100% - 0px)", width: "calc(100% + 20px)" }}
                  aria-hidden
                />
              )}

              <div className="flex items-center gap-3 relative z-10">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-accent bg-surface-raised text-accent font-bold text-sm flex-shrink-0"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {step.step}
                </div>
              </div>

              <div>
                <h3
                  className="font-semibold text-fg mb-2 text-base"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {step.heading}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA nudge */}
        <div className="mt-14 pt-10 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-muted max-w-md">
            Ready to see what your site could look like? The first meeting is free, and so is the preview.
          </p>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center h-11 px-6 rounded-lg bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium transition-all duration-150 hover:-translate-y-px hover:shadow-md hover:shadow-accent/20"
          >
            Book a free meeting
          </a>
        </div>
      </div>
    </section>
  );
}
