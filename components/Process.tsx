"use client";

import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TypewriterHeading } from "./TypewriterHeading";
import { MapleLeafFall } from "./MapleLeafFall";
import { VintageTypewriter } from "./VintageTypewriter";
import { LandmarkBadge } from "./LandmarkBadge";
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

// rAF-throttled step-spotlight updater — one layout read + two style writes
// per frame per card (max), instead of on every mousemove event.
const spotFrames = new WeakMap<HTMLElement, number>();
function handleSpotMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  if (spotFrames.has(el)) return;
  const { clientX, clientY } = e;
  spotFrames.set(
    el,
    requestAnimationFrame(() => {
      spotFrames.delete(el);
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    })
  );
}

export function Process() {
  const headingRef = useScrollReveal();
  const stepsRef = useScrollReveal(0.05);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const allowMag = useRef(false);
  const magFrame = useRef(0);

  useEffect(() => {
    allowMag.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const container = stepsRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const articles = container.querySelectorAll<HTMLElement>("article");
        if (!articles.length) return;
        gsap.fromTo(
          articles,
          { opacity: 0, scale: 0.92, rotation: -1.5, y: 28 },
          {
            opacity: 1, scale: 1, rotation: 0, y: 0,
            duration: 0.65, ease: "back.out(2)", stagger: 0.14,
            scrollTrigger: {
              trigger: container,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => { if (t.trigger === container) t.kill(); });
        };
      });
    });
    return () => cleanup?.();
  }, []);

  // Magnetic CTA — rAF-throttled so the layout read (getBoundingClientRect)
  // and transform write happen at most once per frame, not per mousemove.
  const handleMagMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el || !allowMag.current) return;
    if (magFrame.current) return;
    const { clientX, clientY } = e;
    magFrame.current = requestAnimationFrame(() => {
      magFrame.current = 0;
      const r = el.getBoundingClientRect();
      const x = (clientX - (r.left + r.width / 2)) * 0.25;
      const y = (clientY - (r.top + r.height / 2)) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.transition = "transform 0.1s ease-out, box-shadow 0.15s";
    });
  };

  const handleMagLeave = () => {
    const el = ctaRef.current;
    if (!el || !allowMag.current) return;
    if (magFrame.current) {
      cancelAnimationFrame(magFrame.current);
      magFrame.current = 0;
    }
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.15s";
  };

  return (
    <section
      id="process"
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="process-heading"
    >
      {/* Ambient falling maple leaves — New England autumn backdrop */}
      <MapleLeafFall />

      {/* Vintage typewriter floating in the section's top-right corner
          on xl screens — visually echoes the TypewriterHeading below */}
      <div
        aria-hidden
        className="hidden xl:block absolute pointer-events-none"
        style={{ top: "80px", right: "48px", zIndex: 1 }}
      >
        <VintageTypewriter size={220} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-14">
          <div className="label-pill mb-4 reveal">How it works</div>
          <TypewriterHeading
            as="h2"
            id="process-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            lines={["From handshake", "to live website in days."]}
            charDelay={36}
            lineGap={420}
          />
          <p
            className="mt-4 max-w-xl text-muted text-lg reveal"
            style={{ transitionDelay: "500ms" }}
          >
            Not weeks. Not months. Days. (Unless you need more time to think about it —
            that&apos;s fine too.)
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROCESS.map((step, i) => {
            const Illustration = STEP_ILLUSTRATIONS[i % STEP_ILLUSTRATIONS.length];
            const timeHints = ["~20 min", "2–3 days", "Same day", "Ongoing"];
            return (
              <div key={step.step} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <article
                aria-labelledby={`step-${step.step}`}
                className="shine card-light relative flex flex-col gap-4 p-6 group h-full"
                style={{ isolation: "isolate" }}
                onMouseMove={handleSpotMove}
              >
                <div className="step-spotlight" aria-hidden />
                {/* Time estimate chip — slides in on hover */}
                <div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 translate-y-1"
                  aria-hidden
                >
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                    style={{
                      background: "rgba(212,104,42,0.08)",
                      border: "1px solid rgba(212,104,42,0.2)",
                      color: "rgba(212,104,42,0.9)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {timeHints[i]}
                  </span>
                </div>
                {/* Step illustration + connector */}
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex-shrink-0 w-14 h-14 group-hover:scale-105 group-hover:rotate-[-3deg] transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-2xl group-hover:bg-[rgba(212,104,42,0.06)] group-hover:shadow-[0_4px_16px_rgba(212,104,42,0.14)]"
                  >
                    <Illustration />
                    {/* Step number badge — 3D sphere */}
                    <div
                      className="step-badge absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full text-[#1C1209] text-[11px] font-bold flex items-center justify-center"
                      style={{
                        fontFamily: "var(--font-display)",
                        background: "linear-gradient(145deg, #E07838 0%, #D4682A 50%, #B05020 100%)",
                        boxShadow: "0 2px 8px rgba(212,104,42,0.4), inset 0 1px 0 rgba(255,220,140,0.28), inset 0 -1px 0 rgba(0,0,0,0.2)",
                      }}
                    >
                      {step.step}
                    </div>
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div
                      className="hidden lg:block flex-1 h-px flow-line"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, rgba(212,104,42,0.38) 0px, rgba(212,104,42,0.38) 4px, transparent 4px, transparent 8px)",
                        backgroundSize: "12px 1px",
                      }}
                      aria-hidden
                    />
                  )}
                </div>
                <div>
                  <h3
                    id={`step-${step.step}`}
                    className="font-bold text-fg mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{step.body}</p>
                </div>
              </article>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <p className="text-muted reveal mb-2">
              Ready to see what your site could look like? The meeting is free. The preview is free. You only pay when you&apos;re happy.
            </p>
            {/* Local detail */}
            <p className="text-[11px] text-muted italic reveal" style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}>
              I can meet you at your shop on Route 9 — Shrewsbury Center, near the lake, wherever you are.
            </p>
          </div>
          {/* Route 9 keepsake medallion — sits in the CTA row's open middle
              on large screens; hidden below lg where the row stacks */}
          <LandmarkBadge
            src="https://images.unsplash.com/photo-1571415822965-c563f4535eaf?w=240&auto=format&fit=crop&q=80"
            alt="A two-lane road between orange autumn trees"
            caption="Route 9"
            size={84}
            tilt={4}
            delay={60}
            className="hidden lg:inline-block flex-shrink-0"
          />
          <div className="reveal flex-shrink-0" style={{ transitionDelay: "100ms" }}>
            <a
              ref={ctaRef}
              href="#contact"
              onMouseMove={handleMagMove}
              onMouseLeave={handleMagLeave}
              className="nav-cta-shimmer inline-flex items-center h-12 px-7 rounded-xl text-[#1C1209] text-sm font-semibold"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
                transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.15s",
              }}
            >
              Book a free meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
