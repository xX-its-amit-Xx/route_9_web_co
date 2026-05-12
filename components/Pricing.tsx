"use client";

import { Check, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { PRICING, FOUNDING_OFFER } from "@/lib/content";

export function Pricing() {
  const headingRef = useScrollReveal();
  const cardsRef = useScrollReveal(0.05);
  const offerRef = useScrollReveal();

  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-label="Services and pricing"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            Services &amp; pricing
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Transparent pricing.<br />No surprises.
          </h2>
          <p className="mt-4 max-w-xl text-muted text-lg">
            A one-time build fee. A monthly care fee. That&apos;s the whole model.
            <span className="text-fg font-medium"> No mystery invoices.</span>
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="reveal reveal-stagger grid md:grid-cols-3 gap-5 mb-10"
        >
          {PRICING.map((tier) => (
            <TiltCard key={tier.name} intensity={tier.highlighted ? 5 : 7}>
              <article
                className={`relative flex flex-col h-full rounded-2xl p-7 border transition-all duration-200 ${
                  tier.highlighted
                    ? "bg-[#110B07] border-[rgba(212,104,42,0.3)] shadow-2xl shadow-[rgba(212,104,42,0.12)]"
                    : "bg-surface-raised border-border hover:border-accent/30 hover:shadow-lg"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4682A] text-[#110B07] text-xs font-bold">
                      <Sparkles size={11} />
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
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
                  <div className="flex items-end gap-1.5 mb-1">
                    <span
                      className={`text-4xl font-extrabold tracking-tight ${tier.highlighted ? "text-gradient" : "text-fg"}`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {tier.setup}
                    </span>
                    {tier.setup !== "Let's talk" && (
                      <span className={`text-sm mb-1.5 ${tier.highlighted ? "text-[#9B8C7D]" : "text-muted"}`}>
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
                <ul className="flex-1 space-y-2.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={`mt-0.5 flex-shrink-0 ${tier.highlighted ? "text-[#D4682A]" : "text-accent"}`}
                      />
                      <span className={tier.highlighted ? "text-[#F3E9D5]/85" : "text-fg"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className={`text-xs mb-5 ${tier.highlighted ? "text-[#9B8C7D]/60" : "text-muted-light"}`}>
                  <span className="font-semibold">Ideal for: </span>{tier.ideal}
                </p>

                <a
                  href="#contact"
                  className={`flex items-center justify-center h-11 rounded-xl font-semibold text-sm transition-all duration-150 hover:-translate-y-0.5 ${
                    tier.highlighted
                      ? "bg-[#D4682A] hover:bg-[#C05A20] text-[#110B07]"
                      : "bg-surface border border-border hover:border-accent/40 text-fg hover:shadow-sm"
                  }`}
                >
                  {tier.cta}
                </a>
              </article>
            </TiltCard>
          ))}
        </div>

        {/* Founding offer */}
        <div ref={offerRef} className="reveal">
          <div className="relative overflow-hidden rounded-2xl border border-[#D4682A]/20 bg-[#110B07] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, #D4682A 0%, transparent 50%)",
              }}
            />
            <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[#D4682A] text-[#110B07] text-xl select-none">
              ★
            </div>
            <div className="relative">
              <p className="font-bold text-[#F3E9D5] text-sm">{FOUNDING_OFFER.headline}</p>
              <p className="text-[#9B8C7D] text-sm mt-0.5">{FOUNDING_OFFER.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
