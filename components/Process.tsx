"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { SplitTextReveal } from "./SplitTextReveal";
import { PROCESS } from "@/lib/content";

export function Process() {
  const stepsRef = useScrollReveal(0.05);

  return (
    <section
      id="process"
      className="py-24 md:py-32 border-t border-[rgba(212,104,42,0.1)]"
      style={{ background: "#110B07" }}
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D4682A] mb-3 reveal">
            How it works
          </p>
          <SplitTextReveal
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3E9D5] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            stagger={80}
          >
            From handshake to live website in days.
          </SplitTextReveal>
          <p className="mt-4 max-w-xl text-[#9B8C7D] text-lg reveal" style={{ transitionDelay: "500ms" }}>
            Not weeks. Not months. Days. (Unless you need more time to think about it —
            that&apos;s fine too.)
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="reveal reveal-stagger grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROCESS.map((step, i) => (
            <article
              key={step.step}
              className="shine relative flex flex-col gap-5 p-6 rounded-2xl glass hover:border-[rgba(212,104,42,0.3)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[#D4682A] text-[#FEFBF5] font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.step}
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-[rgba(212,104,42,0.15)]" aria-hidden />
                )}
              </div>
              <div>
                <h3
                  className="font-bold text-[#F3E9D5] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.heading}
                </h3>
                <p className="text-sm text-[#9B8C7D] leading-relaxed">{step.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10 border-t border-[rgba(212,104,42,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[#9B8C7D] max-w-md reveal">
            Ready to see what your site could look like? The meeting is free. The preview is free. You only pay when you&apos;re happy.
          </p>
          <a
            href="#contact"
            className="reveal flex-shrink-0 inline-flex items-center h-12 px-7 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-[#FEFBF5] text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(212,104,42,0.3)]"
            style={{ transitionDelay: "100ms" }}
          >
            Book a free meeting
          </a>
        </div>
      </div>
    </section>
  );
}
