"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { WaxSeal } from "./WaxSeal";
import { ChalkboardSpecial } from "./ChalkboardSpecial";
import { PRICING, FOUNDING_OFFER } from "@/lib/content";

// rAF-throttled magnetic-CTA updater — one layout read + transform write per
// frame max (was: getBoundingClientRect on every mousemove event).
const magFrames = new WeakMap<HTMLElement, number>();

export function Pricing() {
  const headingRef = useScrollReveal();
  const cardsRef = useScrollReveal(0.05);
  const offerRef = useScrollReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const allowMotion = useRef(false);
  const URGENCY_MSGS = ["1 spot left", "Filling fast", "Claim yours"] as const;
  const [urgencyIdx, setUrgencyIdx] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    allowMotion.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Only tick the urgency rotator (and run the decorative infinite
  // animations) while the section is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setUrgencyIdx((i) => (i + 1) % URGENCY_MSGS.length), 4000);
    return () => clearInterval(id);
  }, [inView, URGENCY_MSGS.length]);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-14">
          <div className="label-pill mb-4 reveal">Services &amp; pricing</div>
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight reveal"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}
          >
            Transparent pricing.<br />No surprises.
          </h2>
          <p className="mt-4 max-w-xl text-muted text-lg reveal" style={{ transitionDelay: "220ms" }}>
            A one-time build fee. A monthly care fee. That&apos;s the whole model.
            <span className="text-fg font-medium"> No mystery invoices.</span>
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
        >
          {PRICING.map((tier, i) => (
            <div key={tier.name} className={`reveal${tier.highlighted ? " relative" : ""}`} style={{ transitionDelay: `${i * 110}ms` }}>
            {tier.highlighted && (
              /* Clipping wrapper: the conic layer must rotate INSIDE an
                 overflow-hidden ring, otherwise the rotating square's corners
                 (carrying the gradient wedge) sweep out from behind the card. */
              <div
                aria-hidden
                className="absolute pointer-events-none overflow-hidden"
                style={{ inset: "-2px", borderRadius: "18px", zIndex: 0 }}
              >
                <div
                  className="absolute"
                  style={{
                    inset: "-35%",
                    background: "conic-gradient(from 0deg, transparent 0%, transparent 36%, rgba(212,104,42,0.45) 47%, rgba(240,160,80,0.8) 52%, rgba(212,104,42,0.45) 57%, transparent 68%, transparent 100%)",
                    animation: "pro-ring-spin 5.2s linear infinite",
                    animationPlayState: inView ? "running" : "paused",
                  }}
                />
              </div>
            )}
            <div className={tier.highlighted ? "relative" : undefined} style={tier.highlighted ? { zIndex: 1 } : undefined}>
            <TiltCard intensity={tier.highlighted ? 5 : 7}>
              <article
                aria-labelledby={`tier-${tier.name}`}
                className={`relative flex flex-col h-full rounded-2xl p-7 border transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  tier.highlighted
                    ? "bg-[#1C1209] border-[rgba(212,104,42,0.38)]"
                    : "bg-surface-raised border-border shadow-[0_1px_2px_rgba(28,18,9,0.03),0_4px_14px_rgba(28,18,9,0.03)] hover:-translate-y-0.5 hover:border-[rgba(212,104,42,0.22)] hover:shadow-[0_1px_2px_rgba(28,18,9,0.04),0_8px_20px_rgba(28,18,9,0.06),0_24px_48px_rgba(28,18,9,0.05)]"
                }`}
                style={tier.highlighted ? {
                  boxShadow: "0 0 0 1px rgba(212,104,42,0.38), 0 8px 40px rgba(212,104,42,0.16), 0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(212,104,42,0.25)",
                  transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                } : undefined}
                onMouseEnter={tier.highlighted ? (e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(212,104,42,0.55), 0 12px 48px rgba(212,104,42,0.26), 0 40px 96px rgba(0,0,0,0.32), inset 0 1px 0 rgba(212,104,42,0.38)";
                } : undefined}
                onMouseLeave={tier.highlighted ? (e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(212,104,42,0.38), 0 8px 40px rgba(212,104,42,0.16), 0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(212,104,42,0.25)";
                } : undefined}
              >
                {/* Glowing top border strip on highlighted card */}
                {tier.highlighted && (
                  <div
                    aria-hidden
                    className="absolute top-0 left-6 right-6 h-px rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(212,104,42,0.8) 30%, rgba(240,160,90,0.9) 50%, rgba(212,104,42,0.8) 70%, transparent)",
                      boxShadow: "0 0 12px rgba(212,104,42,0.6)",
                    }}
                  />
                )}
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4682A] text-[#110B07] text-xs font-bold">
                      <Sparkles size={11} aria-hidden />
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    id={`tier-${tier.name}`}
                    className={`font-bold text-xl mb-1 ${tier.highlighted ? "text-[#F3E9D5]" : "text-fg"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tier.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${tier.highlighted ? "text-[#9B8C7D]" : "text-muted"}`}>
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-dashed" style={{
                  borderColor: tier.highlighted ? "rgba(212,104,42,0.15)" : undefined,
                }}>
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <span
                      className={`text-4xl font-bold tracking-tight leading-none ${tier.highlighted ? "text-gradient" : "text-fg"}`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {tier.setup}
                    </span>
                    {tier.setup !== "Let's talk" && (
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${tier.highlighted ? "text-[#9B8C7D]" : "text-muted"}`}>
                        one-time
                      </span>
                    )}
                  </div>
                  {tier.monthly && (
                    <p className={`text-sm font-medium ${tier.highlighted ? "text-[#D4682A]" : "text-accent"}`}>
                      then {tier.monthly}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul role="list" className="flex-1 space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm leading-snug"
                    >
                      <span
                        aria-hidden
                        className={`mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${
                          tier.highlighted
                            ? "bg-[rgba(212,104,42,0.14)] text-[#D4682A]"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        <Check size={11} strokeWidth={2.75} />
                      </span>
                      <span className={tier.highlighted ? "text-[#F3E9D5]/85" : "text-fg"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className={`text-xs leading-relaxed mb-5 ${tier.highlighted ? "text-[#9B8C7D]/60" : "text-muted"}`}>
                  <span className="font-semibold uppercase tracking-[0.12em] text-[10px]">Ideal for: </span>{tier.ideal}
                </p>

                <a
                  href="#contact"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("r9:contact-prefill", {
                        detail: { message: `Hi! I'm interested in the ${tier.name} tier.` },
                      })
                    );
                  }}
                  onMouseMove={(e) => {
                    if (!allowMotion.current) return;
                    const el = e.currentTarget as HTMLElement;
                    if (magFrames.has(el)) return;
                    const { clientX, clientY } = e;
                    magFrames.set(el, requestAnimationFrame(() => {
                      magFrames.delete(el);
                      const r = el.getBoundingClientRect();
                      const dx = (clientX - (r.left + r.width / 2)) * 0.22;
                      const dy = (clientY - (r.top + r.height / 2)) * 0.18;
                      el.style.transform = `translate(${dx}px, ${dy}px)`;
                    }));
                  }}
                  onMouseLeave={(e) => {
                    if (!allowMotion.current) return;
                    const el = e.currentTarget as HTMLElement;
                    const pending = magFrames.get(el);
                    if (pending !== undefined) {
                      cancelAnimationFrame(pending);
                      magFrames.delete(el);
                    }
                    el.style.transform = "";
                  }}
                  className={`flex items-center justify-center h-11 rounded-xl font-semibold text-sm transition-[box-shadow,border-color,background] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    tier.highlighted
                      ? "nav-cta-shimmer text-[#110B07]"
                      : "bg-surface border border-border hover:border-accent/40 text-fg hover:shadow-[0_2px_6px_rgba(28,18,9,0.06),0_6px_16px_rgba(28,18,9,0.05)]"
                  }`}
                  style={tier.highlighted ? {
                    background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                    boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 3px 12px rgba(212,104,42,0.35), 0 1px 0 rgba(255,220,160,0.18) inset, 0 -1px 0 rgba(0,0,0,0.12) inset",
                  } : undefined}
                >
                  {tier.cta}
                </a>
              </article>
            </TiltCard>
            </div>
            </div>
          ))}
        </div>

        {/* Hanging chalkboard "today's special" above the offer card */}
        <div className="flex justify-center mb-6 reveal">
          <ChalkboardSpecial />
        </div>

        {/* Founding offer */}
        <div ref={offerRef} className="reveal relative">
          {/* Wax seal — "sealed by the maker" — positioned in the top-right
              corner of the offer card. Decorative; conveys "official offer".
              Sized small + no ribbon tails so it doesn't clip into the CTA. */}
          <div
            aria-hidden
            className="hidden sm:block absolute pointer-events-none"
            style={{ top: "-18px", right: "16px", zIndex: 5 }}
          >
            <WaxSeal size={56} tilt={-12} withRibbon={false} />
          </div>

          <div
            className="relative overflow-hidden rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              background: "linear-gradient(145deg, #1C1209 0%, #2A1508 60%, #1C1209 100%)",
              border: "1px solid rgba(212,104,42,0.3)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 12px 40px rgba(0,0,0,0.14), 0 4px 28px rgba(212,104,42,0.08), 0 1px 0 rgba(212,104,42,0.08) inset",
            }}
          >
            {/* Warm glow orb — pulses */}
            <div
              aria-hidden
              className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(212,104,42,0.16) 0%, transparent 70%)",
                /* Resting state matches keyframe 0%/100% — so reduced-motion reversion
                   lands here instead of opacity:1 / transform:none */
                opacity: 0.18,
                transform: "translate(-30%, -30%)",
                animation: "pricing-glow-pulse 3.5s ease-in-out infinite",
                animationPlayState: inView ? "running" : "paused",
              }}
            />

            {/* Route 9 shield icon */}
            <div className="relative flex-shrink-0">
              <svg viewBox="0 0 52 64" fill="none" className="w-12 h-14" aria-hidden>
                <defs>
                  {/* Brass/metal edge — mirror bands running the diagonal */}
                  <linearGradient id="r9-shield-metal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#F0C078" />
                    <stop offset="26%"  stopColor="#D4682A" />
                    <stop offset="52%"  stopColor="#8A3E14" />
                    <stop offset="76%"  stopColor="#C9631F" />
                    <stop offset="100%" stopColor="#5E2208" />
                  </linearGradient>
                  {/* Recessed field — lit top, sinking into ember shadow */}
                  <linearGradient id="r9-shield-field" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(212,104,42,0.32)" />
                    <stop offset="45%"  stopColor="rgba(212,104,42,0.16)" />
                    <stop offset="100%" stopColor="rgba(94,34,8,0.34)" />
                  </linearGradient>
                  {/* Glass gloss — diagonal sheen sweeping across the face */}
                  <linearGradient id="r9-shield-gloss" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="rgba(255,236,200,0.28)" />
                    <stop offset="46%"  stopColor="rgba(255,236,200,0.1)" />
                    <stop offset="52%"  stopColor="rgba(255,236,200,0)" />
                    <stop offset="100%" stopColor="rgba(255,236,200,0)" />
                  </linearGradient>
                  <clipPath id="r9-shield-clip">
                    <path d="M26 3 L49 11 L49 38 Q49 54 26 61 Q3 54 3 38 L3 11 Z" />
                  </clipPath>
                </defs>
                {/* Shield body — recessed field inside a metallic edge */}
                <path d="M26 3 L49 11 L49 38 Q49 54 26 61 Q3 54 3 38 L3 11 Z"
                  fill="url(#r9-shield-field)" stroke="url(#r9-shield-metal)" strokeWidth="1.6" />
                {/* Emboss step — inner plateau: dark cut edge, then a light
                    anti-emboss kick offset toward the lower-right */}
                <g clipPath="url(#r9-shield-clip)">
                  <path d="M26 7 L45.5 13.8 L45.5 37 Q45.5 50.4 26 56.6 Q6.5 50.4 6.5 37 L6.5 13.8 Z"
                    fill="rgba(20,8,2,0.2)" stroke="rgba(20,8,2,0.4)" strokeWidth="0.8" />
                  <path d="M26 7 L45.5 13.8 L45.5 37 Q45.5 50.4 26 56.6 Q6.5 50.4 6.5 37 L6.5 13.8 Z"
                    transform="translate(0 0.9)"
                    fill="none" stroke="rgba(255,205,140,0.26)" strokeWidth="0.7" />
                  {/* Glass gloss diagonal across the upper-left face */}
                  <path d="M-4 6 L30 -6 L12 66 L-8 46 Z" fill="url(#r9-shield-gloss)" />
                </g>
                {/* Raised rim highlight — light raking the top edges */}
                <path d="M4.5 11.6 L26 4.2 L47.5 11.6" stroke="rgba(255,220,170,0.5)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                <path d="M26 3 L49 11" stroke="rgba(255,200,120,0.3)" strokeWidth="2" strokeLinecap="round" />
                {/* Rim light along the dark lower-left curve */}
                <path d="M5 40 Q6.5 51 17 56.5" stroke="rgba(255,180,110,0.22)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
                <text x="26" y="26" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(212,104,42,0.55)" fontFamily="monospace" letterSpacing="2">ROUTE</text>
                <text x="27" y="48" textAnchor="middle" fontSize="26" fontStyle="italic" fill="rgba(212,104,42,0.8)" fontFamily="Georgia, serif" fontWeight="400">9</text>
              </svg>
              {/* Glow behind shield */}
              <div aria-hidden className="absolute inset-0 blur-xl rounded-full" style={{ background: "rgba(212,104,42,0.16)" }} />
            </div>

            <div className="relative flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <p className="font-bold text-[#F3E9D5] text-sm" style={{ fontFamily: "var(--font-display)" }}>
                  {FOUNDING_OFFER.headline}
                </p>
                {/* Spots remaining — visual dot indicators */}
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] flex-shrink-0"
                  style={{
                    background: "rgba(212,104,42,0.14)",
                    border: "1px solid rgba(212,104,42,0.32)",
                    color: "#E07838",
                  }}
                >
                  {/* 2 taken, 1 open */}
                  <span className="flex items-center gap-0.5" aria-hidden>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A] opacity-60" />
                    <span className="w-1.5 h-1.5 rounded-full border border-[#D4682A]" style={{ background: "rgba(212,104,42,0.15)" }} />
                  </span>
                  <span
                    key={urgencyIdx}
                    style={{ animation: "urgency-swap 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {URGENCY_MSGS[urgencyIdx]}
                  </span>
                </span>
              </div>
              <p className="text-[#9B8C7D] text-sm leading-relaxed">{FOUNDING_OFFER.body}</p>
            </div>

            <a
              href="#contact"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("r9:contact-prefill", {
                    detail: { message: "Hi! I'd like to claim a founding-pricing spot." },
                  })
                );
              }}
              className="nav-cta-shimmer relative flex-shrink-0 inline-flex items-center h-10 px-5 rounded-xl text-[#1C1209] text-xs font-bold transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
              }}
            >
              Claim a spot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
