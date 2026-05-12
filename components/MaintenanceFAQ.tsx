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
  {
    label: "Response time",
    value: 2,
    suffix: " hrs",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6.5V10.5L12.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 4.5L18 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M16 2h2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    prefix: "≤",
    color: "#D4682A",
  },
  {
    label: "Uptime SLA",
    value: 99.9,
    suffix: "%+",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <path d="M3 11l4 4 10-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      </svg>
    ),
    prefix: "",
    color: "#10B981",
  },
  {
    label: "Contracts",
    value: 0,
    suffix: "",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <rect x="4" y="3" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 14l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="15" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M13.3 15.3l.6.6 1.1-1.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    prefix: "",
    displayText: "Zero",
    color: "#D4682A",
  },
  {
    label: "You own it",
    value: 100,
    suffix: "%",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
    prefix: "",
    color: "#D4682A",
  },
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
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(160deg, #FFFFFF 0%, #FDFAF7 100%)",
                    border: "1px solid #E8D9C4",
                    boxShadow: "0 2px 8px rgba(28,18,9,0.05), 0 8px 24px rgba(28,18,9,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-xl mb-3 transition-all duration-200 group-hover:scale-110"
                    style={{
                      background: `rgba(${stat.color === "#10B981" ? "16,185,129" : "212,104,42"},0.1)`,
                      border: `1px solid rgba(${stat.color === "#10B981" ? "16,185,129" : "212,104,42"},0.2)`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className="text-3xl font-extrabold mb-1 transition-transform duration-200 inline-block"
                    style={{ fontFamily: "var(--font-display)", color: stat.color }}
                  >
                    {"displayText" in stat && stat.displayText ? (
                      stat.displayText
                    ) : (
                      <>{stat.prefix}<AnimatedCounter to={stat.value} />{stat.suffix}</>
                    )}
                  </div>
                  <div className="text-xs text-muted font-medium">{stat.label}</div>
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
