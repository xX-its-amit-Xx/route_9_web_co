"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { SplitTextReveal } from "./SplitTextReveal";
import { PILLARS } from "@/lib/content";

// ── Custom artisan SVG icons (hand-crafted, on-brand) ──────────────────────

function IconMobile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <rect x="5.5" y="1.5" width="13" height="21" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5.5" y1="4.5" x2="18.5" y2="4.5" stroke="currentColor" strokeWidth="0.75" />
      <line x1="5.5" y1="19.5" x2="18.5" y2="19.5" stroke="currentColor" strokeWidth="0.75" />
      {/* Storefront inside screen */}
      <rect x="7.5" y="6.5" width="9" height="10.5" rx="0.75" stroke="currentColor" strokeWidth="1" />
      <path d="M7.5 9.5L12 7.5L16.5 9.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <rect x="10" y="12" width="1.75" height="2.75" rx="0.25" stroke="currentColor" strokeWidth="0.75" />
      <rect x="12.5" y="12" width="1.75" height="2.75" rx="0.25" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function IconSpeed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 10-12h-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconConvert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      {/* Door frame */}
      <path
        d="M10 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrow entering */}
      <path
        d="M14 7L21 12L14 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path
        d="M12 2C8.686 2 6 4.686 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.686 15.314 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      {/* Signal arcs */}
      <path d="M20.5 4C21.8 5.8 22.5 8 22.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M3.5 4C2.2 5.8 1.5 8 1.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconAccessible() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      {/* Taller figure */}
      <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 10.5L4 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.5 10.5L12 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      {/* Shorter figure */}
      <circle cx="17" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M17 9V13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M15 11L13.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M19 11L20.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconMaintain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      {/* Calendar body */}
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Checkmark */}
      <path
        d="M8 14.5L11 17.5L16 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type IconKey = (typeof PILLARS)[number]["icon"];

const ICON_MAP: Record<IconKey, React.FC> = {
  Smartphone: IconMobile,
  Zap: IconSpeed,
  MousePointerClick: IconConvert,
  MapPin: IconMapPin,
  Accessibility: IconAccessible,
  Wrench: IconMaintain,
};

export function QualityPillars() {
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 border-t border-[#E8D9C4]"
      style={{ background: "#FFF8F3" }}
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="mb-14">
          <div className="label-pill mb-4 reveal">How I build</div>
          <SplitTextReveal
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            delay={0}
            stagger={70}
          >
            Six things every site gets right.
          </SplitTextReveal>
          <p
            className="mt-4 max-w-xl text-[#7A6B5C] text-lg reveal"
            style={{ transitionDelay: "400ms" }}
          >
            These aren&apos;t upsells. They&apos;re the baseline.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="reveal reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <TiltCard key={pillar.heading}>
                <article className="shine group card-light h-full flex flex-col gap-4 p-6 cursor-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-200">
                      <Icon />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[rgba(212,104,42,0.3)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#1C1209] mb-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {pillar.heading}
                    </h3>
                    <p className="text-sm text-[#7A6B5C] leading-relaxed">{pillar.body}</p>
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
