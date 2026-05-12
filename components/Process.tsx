"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { SplitTextReveal } from "./SplitTextReveal";
import { PROCESS } from "@/lib/content";

// Custom artisan step illustrations
const STEP_ILLUSTRATIONS = [
  // Step 1: Handshake / Coffee meeting
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Coffee cup */}
      <rect x="18" y="22" width="16" height="13" rx="2" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" />
      <path d="M34 26h3a2 2 0 0 1 0 4h-3" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" />
      <path d="M18 35h16" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Steam */}
      <path d="M22 19c0-2 2-2 2-4" stroke="rgba(212,104,42,0.35)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M28 19c0-2 2-2 2-4" stroke="rgba(212,104,42,0.35)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  // Step 2: Screen / Preview
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Monitor */}
      <rect x="13" y="17" width="30" height="20" rx="2" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" />
      <path d="M21 37v3M35 37v3M18 40h20" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Screen content: layout lines */}
      <rect x="16" y="20" width="24" height="3" rx="0.75" fill="rgba(212,104,42,0.2)" />
      <rect x="16" y="25" width="14" height="2" rx="0.75" fill="rgba(212,104,42,0.15)" />
      <rect x="16" y="29" width="10" height="2" rx="0.75" fill="rgba(212,104,42,0.12)" />
    </svg>
  ),
  // Step 3: Rocket launch
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Rocket */}
      <path d="M28 12c0 0 8 6 8 16H20c0-10 8-16 8-16z" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 28v6l-4 4 4-10z" stroke="rgba(212,104,42,0.45)" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M36 28v6l4 4-4-10z" stroke="rgba(212,104,42,0.45)" strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="28" cy="24" r="3" stroke="rgba(212,104,42,0.5)" strokeWidth="1.25" />
      {/* Flame */}
      <path d="M24 34c1 3 2 5 4 6 2-1 3-3 4-6" stroke="rgba(212,104,42,0.4)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  // Step 4: Text message / phone
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Chat bubble */}
      <rect x="13" y="17" width="22" height="16" rx="3" stroke="rgba(212,104,42,0.6)" strokeWidth="1.5" />
      <path d="M16 38l2-5h-4l2 5z" fill="rgba(212,104,42,0.3)" stroke="rgba(212,104,42,0.5)" strokeWidth="1" strokeLinejoin="round" />
      {/* Lines */}
      <path d="M18 23h12M18 27h8" stroke="rgba(212,104,42,0.4)" strokeWidth="1.25" strokeLinecap="round" />
      {/* Small phone */}
      <rect x="33" y="26" width="10" height="15" rx="2" stroke="rgba(212,104,42,0.45)" strokeWidth="1.25" />
      <path d="M35 38h6" stroke="rgba(212,104,42,0.3)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
];

export function Process() {
  const stepsRef = useScrollReveal(0.05);

  return (
    <section
      id="process"
      className="py-24 md:py-32 border-t border-[#E8D9C4]"
      style={{ background: "#FEFBF5" }}
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="mb-14">
          <div className="label-pill mb-4 reveal">How it works</div>
          <SplitTextReveal
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            stagger={80}
          >
            From handshake to live website in days.
          </SplitTextReveal>
          <p
            className="mt-4 max-w-xl text-[#7A6B5C] text-lg reveal"
            style={{ transitionDelay: "500ms" }}
          >
            Not weeks. Not months. Days. (Unless you need more time to think about it —
            that&apos;s fine too.)
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="reveal reveal-stagger grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROCESS.map((step, i) => {
            const Illustration = STEP_ILLUSTRATIONS[i % STEP_ILLUSTRATIONS.length];
            return (
              <article
                key={step.step}
                className="shine card-light relative flex flex-col gap-4 p-6 group"
              >
                {/* Step illustration + connector */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0 w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                    <Illustration />
                    {/* Step number badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4682A] text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.step}
                    </div>
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div
                      className="hidden lg:block flex-1 h-px"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, rgba(212,104,42,0.25) 0px, rgba(212,104,42,0.25) 4px, transparent 4px, transparent 8px)",
                      }}
                      aria-hidden
                    />
                  )}
                </div>
                <div>
                  <h3
                    className="font-bold text-[#1C1209] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-sm text-[#7A6B5C] leading-relaxed">{step.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10 border-t border-[#E8D9C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[#7A6B5C] max-w-md reveal">
            Ready to see what your site could look like? The meeting is free. The preview is free. You only pay when you&apos;re happy.
          </p>
          <a
            href="#contact"
            className="reveal flex-shrink-0 inline-flex items-center h-12 px-7 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(212,104,42,0.3)]"
            style={{ transitionDelay: "100ms" }}
          >
            Book a free meeting
          </a>
        </div>
      </div>
    </section>
  );
}
