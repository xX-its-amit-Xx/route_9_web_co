"use client";

import { useState, useId } from "react";
import { Plus } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";
import { SplitTextReveal } from "./SplitTextReveal";
import { MaintenanceLog } from "./MaintenanceLog";
import { FAQ } from "@/lib/content";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const btnId = `faq-btn-${uid}`;
  const panelId = `faq-panel-${uid}`;
  return (
    <div className="border-b border-border-subtle last:border-0">
      {/* ARIA APG accordion pattern: wrap the button in a heading so
          screen-reader users can jump between FAQ questions via the
          heading list. The h3 itself is unstyled — the button keeps
          all visual treatment. */}
      <h3 className="m-0 font-normal text-base">
        <button
          id={btnId}
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-start justify-between w-full py-5 text-left gap-4 group"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span
            className="font-medium text-sm md:text-base transition-colors duration-150 group-hover:text-accent"
            style={{ color: open ? "var(--accent)" : "var(--fg)" }}
          >
            {q}
          </span>
          <span
            aria-hidden
            className="flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:text-accent"
            style={{
              color: open ? "var(--accent)" : "var(--muted)",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      {/* CSS grid trick for smooth height animation — no max-h guessing */}
      <div
        id={panelId}
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="pb-5 pr-8"
            style={{
              borderLeft: "2px solid",
              borderColor: open ? "rgba(212,104,42,0.45)" : "transparent",
              paddingLeft: "12px",
              marginLeft: "2px",
              transition: "border-color 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <p className="text-muted text-sm leading-relaxed">{a}</p>
          </div>
        </div>
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
    /* emerald-600 (#059669): 3.1:1 on cream (passes large-text AA), 5.7:1 on dark bg */
    color: "#059669",
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
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left */}
          <div ref={headingRef}>
            <div className="label-pill mb-4 reveal">Maintenance</div>
            <SplitTextReveal
              as="h2"
              id="faq-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              What&apos;s included after launch.
            </SplitTextReveal>
            <p className="text-muted leading-relaxed mb-8 reveal" style={{ transitionDelay: "200ms" }}>
              The monthly fee isn&apos;t a software subscription. It&apos;s a retainer on
              a person — one who already knows your site inside and out.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 gap-3">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div
                  className="group p-5 rounded-2xl border border-border transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(212,104,42,0.3)] shadow-[0_2px_8px_rgba(28,18,9,0.05),0_8px_24px_rgba(28,18,9,0.03),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_4px_24px_rgba(212,104,42,0.14),0_1px_0_rgba(255,220,160,0.06)_inset]"
                  style={{
                    background: "linear-gradient(160deg, var(--surface-raised) 0%, var(--surface) 100%)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-xl mb-3 transition-all duration-200 group-hover:scale-110"
                    style={{
                      background: `rgba(${stat.color === "#059669" ? "5,150,105" : "212,104,42"},0.1)`,
                      border: `1px solid rgba(${stat.color === "#059669" ? "5,150,105" : "212,104,42"},0.2)`,
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
                      <>{stat.prefix}<AnimatedCounter to={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} />{stat.suffix}</>
                    )}
                  </div>
                  <div className="text-xs text-muted font-medium">{stat.label}</div>
                </div>
                </div>
              ))}
            </div>

            {/* Vintage service-log card under the stats */}
            <div className="mt-10 reveal hidden lg:flex justify-start" style={{ transitionDelay: "500ms" }}>
              <MaintenanceLog />
            </div>
          </div>

          {/* Right: FAQ */}
          <div ref={faqRef}>
            {FAQ.map((item, i) => (
              <div key={item.q} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <FAQItem q={item.q} a={item.a} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
