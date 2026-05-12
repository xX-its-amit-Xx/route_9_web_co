"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";
import { SplitTextReveal } from "./SplitTextReveal";
import { FAQ } from "@/lib/content";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-medium text-fg text-sm md:text-base group-hover:text-accent transition-colors duration-150">
          {q}
        </span>
        <span className="flex-shrink-0 mt-0.5 text-muted group-hover:text-accent transition-colors duration-150">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-muted text-sm leading-relaxed pr-8">{a}</p>
      </div>
    </div>
  );
}

const STATS = [
  { label: "Response time", value: 2, suffix: " hrs", display: "≤2 hrs" },
  { label: "Uptime", value: 99, suffix: ".9%+", display: "99.9%+" },
  { label: "Contracts", value: 0, suffix: "", display: "Zero" },
  { label: "Ownership", value: 100, suffix: "%", display: "100%" },
] as const;

export function MaintenanceFAQ() {
  const headingRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const statsRef = useScrollReveal();

  return (
    <section
      id="maintenance"
      className="py-24 md:py-32 bg-surface border-t border-border-subtle"
      aria-label="Maintenance and support"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left */}
          <div ref={headingRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
              Maintenance
            </p>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              What&apos;s included after launch.
            </SplitTextReveal>
            <p className="text-muted leading-relaxed mb-8">
              The monthly fee isn&apos;t a software subscription. It&apos;s a retainer on
              a person — one who already knows your site inside and out.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="reveal reveal-stagger grid grid-cols-2 gap-3">
              {STATS.map(({ label, value, suffix }) => (
                <div
                  key={label}
                  className="group p-5 rounded-2xl border border-border bg-surface-raised hover:border-accent/40 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="text-3xl font-extrabold text-accent mb-1 group-hover:scale-105 transition-transform duration-200 inline-block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {label === "Uptime" ? (
                      <><AnimatedCounter to={value} />
                        <span>{suffix}</span></>
                    ) : label === "Response time" ? (
                      <>≤<AnimatedCounter to={value} />{suffix}</>
                    ) : label === "Contracts" ? (
                      "Zero"
                    ) : (
                      <><AnimatedCounter to={value} />{suffix}</>
                    )}
                  </div>
                  <div className="text-xs text-muted font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ */}
          <div ref={faqRef} className="reveal">
            {FAQ.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
