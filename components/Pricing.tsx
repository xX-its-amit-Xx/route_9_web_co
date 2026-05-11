"use client";

import { Check } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
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
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Transparent pricing.<br />No surprises.
          </h2>
          <p className="mt-4 max-w-xl text-muted text-lg">
            A one-time fee to build, a monthly fee to keep it running. That&apos;s it.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          ref={cardsRef}
          className="reveal reveal-stagger grid md:grid-cols-3 gap-5 mb-10"
        >
          {PRICING.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl p-7 border transition-all duration-200 ${
                tier.highlighted
                  ? "bg-accent text-accent-fg border-accent shadow-xl shadow-accent/20"
                  : "bg-surface-raised border-border hover:border-accent/30 hover:shadow-sm"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-fg text-bg text-xs font-semibold tracking-wide">
                    Most popular
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className="mb-6">
                <h3
                  className={`font-bold text-xl mb-1 ${tier.highlighted ? "text-accent-fg" : "text-fg"}`}
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${tier.highlighted ? "text-accent-fg/75" : "text-muted"}`}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1.5 mb-1">
                  <span
                    className={`text-3xl font-extrabold tracking-tight ${tier.highlighted ? "text-accent-fg" : "text-fg"}`}
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {tier.setup}
                  </span>
                  {tier.setup !== "Let's talk" && (
                    <span
                      className={`text-sm mb-1 ${tier.highlighted ? "text-accent-fg/70" : "text-muted"}`}
                    >
                      one-time
                    </span>
                  )}
                </div>
                {tier.monthly && (
                  <p
                    className={`text-sm font-medium ${tier.highlighted ? "text-accent-fg/80" : "text-muted"}`}
                  >
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
                      className={`mt-0.5 flex-shrink-0 ${tier.highlighted ? "text-accent-fg/80" : "text-accent"}`}
                    />
                    <span
                      className={tier.highlighted ? "text-accent-fg/90" : "text-fg"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Ideal for */}
              <p
                className={`text-xs mb-5 ${tier.highlighted ? "text-accent-fg/60" : "text-muted-light"}`}
              >
                <span className="font-semibold">Ideal for: </span>
                {tier.ideal}
              </p>

              {/* CTA */}
              <a
                href="#contact"
                className={`flex items-center justify-center h-11 rounded-lg font-medium text-sm transition-all duration-150 ${
                  tier.highlighted
                    ? "bg-accent-fg text-accent hover:bg-accent-fg/90"
                    : "bg-surface border border-border hover:bg-surface hover:border-accent/40 text-fg"
                }`}
              >
                {tier.cta}
              </a>
            </article>
          ))}
        </div>

        {/* Founding offer */}
        <div ref={offerRef} className="reveal">
          <div className="rounded-2xl border border-accent/25 bg-accent-light p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-accent-fg font-bold text-sm select-none">
              ★
            </div>
            <div>
              <p className="font-semibold text-fg text-sm">{FOUNDING_OFFER.headline}</p>
              <p className="text-muted text-sm mt-0.5">{FOUNDING_OFFER.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
