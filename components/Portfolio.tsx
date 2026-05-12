"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { PORTFOLIO } from "@/lib/content";
import { SplitTextReveal } from "./SplitTextReveal";

// SVG illustrations for each portfolio card placeholder
const CardIllustrations = [
  // Restaurant/food
  () => (
    <svg viewBox="0 0 300 200" fill="none" className="w-full h-full" aria-hidden>
      <rect width="300" height="200" fill="#1C1209" />
      <circle cx="150" cy="90" r="55" stroke="rgba(212,104,42,0.25)" strokeWidth="1.5" fill="rgba(212,104,42,0.05)" />
      <circle cx="150" cy="90" r="38" stroke="rgba(212,104,42,0.15)" strokeWidth="1" fill="none" />
      <path d="M128 90 Q150 65 172 90" stroke="rgba(212,104,42,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="150" y1="60" x2="150" y2="120" stroke="rgba(212,104,42,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="150" cy="90" r="6" fill="rgba(212,104,42,0.5)" />
      <text x="150" y="158" textAnchor="middle" fontSize="11" fontFamily="var(--font-geist)" fill="rgba(243,233,213,0.3)" letterSpacing="3">RESTAURANT</text>
    </svg>
  ),
  // Salon/Spa
  () => (
    <svg viewBox="0 0 300 200" fill="none" className="w-full h-full" aria-hidden>
      <rect width="300" height="200" fill="#1C1209" />
      <path d="M80 140 Q150 40 220 140" stroke="rgba(212,104,42,0.25)" strokeWidth="1.5" fill="rgba(212,104,42,0.05)" />
      <path d="M100 140 Q150 60 200 140" stroke="rgba(212,104,42,0.15)" strokeWidth="1" fill="none" />
      <circle cx="150" cy="95" r="20" stroke="rgba(212,104,42,0.4)" strokeWidth="1.5" fill="none" />
      <circle cx="150" cy="95" r="5" fill="rgba(212,104,42,0.5)" />
      <line x1="90" y1="150" x2="210" y2="150" stroke="rgba(212,104,42,0.15)" strokeWidth="1" />
      <text x="150" y="170" textAnchor="middle" fontSize="11" fontFamily="var(--font-geist)" fill="rgba(243,233,213,0.3)" letterSpacing="3">SALON &amp; SPA</text>
    </svg>
  ),
  // Retail shop
  () => (
    <svg viewBox="0 0 300 200" fill="none" className="w-full h-full" aria-hidden>
      <rect width="300" height="200" fill="#1C1209" />
      <rect x="90" y="60" width="120" height="85" rx="4" stroke="rgba(212,104,42,0.25)" strokeWidth="1.5" fill="rgba(212,104,42,0.04)" />
      <rect x="112" y="100" width="30" height="45" rx="2" stroke="rgba(212,104,42,0.3)" strokeWidth="1" fill="rgba(212,104,42,0.08)" />
      <rect x="158" y="100" width="30" height="45" rx="2" stroke="rgba(212,104,42,0.3)" strokeWidth="1" fill="rgba(212,104,42,0.08)" />
      <path d="M90 75 L150 52 L210 75" stroke="rgba(212,104,42,0.35)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <rect x="112" y="70" width="76" height="22" rx="2" fill="rgba(212,104,42,0.12)" />
      <text x="150" y="170" textAnchor="middle" fontSize="11" fontFamily="var(--font-geist)" fill="rgba(243,233,213,0.3)" letterSpacing="3">RETAIL SHOP</text>
    </svg>
  ),
];

export function Portfolio() {
  const headingRef = useScrollReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Load GSAP dynamically (client only)
    let cleanup: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const cards = track.querySelectorAll<HTMLElement>(".portfolio-card");
        if (cards.length === 0) return;

        const totalScroll = track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Subtle y-axis stagger on cards as they scroll into view
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: `top+=${i * 100} top`,
                toggleActions: "play none none none",
              },
            }
          );
        });

        cleanup = () => {
          tween.kill();
          ScrollTrigger.getAll().forEach((t) => {
            if (t.trigger === section) t.kill();
          });
        };
      });
    });

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="h-scroll-section"
      style={{ background: "#FEFBF5" }}
      aria-label="Recent work"
    >
      <div
        ref={trackRef}
        className="h-scroll-track items-stretch min-h-screen"
        style={{ padding: "0 48px" }}
      >
        {/* ── Heading card (first "card" is the section title) ── */}
        <div
          className="flex-shrink-0 flex flex-col justify-center pr-12 md:pr-20"
          style={{ width: "min(520px, 90vw)", paddingTop: "80px" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D4682A] mb-3 reveal">
            Recent work
          </p>
          <div ref={headingRef}>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1209] leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
              delay={100}
              stagger={80}
            >
              Portfolio loading.
            </SplitTextReveal>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4682A] italic leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
              delay={400}
              stagger={80}
            >
              Quality already here.
            </SplitTextReveal>
          </div>
          <p className="text-[#7A6B5C] leading-relaxed mb-6 reveal max-w-sm" style={{ transitionDelay: "300ms" }}>
            First clients are being onboarded now.{" "}
            <a href="#contact" className="text-[#D4682A] underline-grow">
              Ask for a live preview
            </a>{" "}
            of what I&apos;d build for your shop.
          </p>
          <div className="flex items-center gap-2 text-[#D4682A] text-sm font-medium reveal" style={{ transitionDelay: "400ms" }}>
            <span>Scroll to explore</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* ── Portfolio cards ── */}
        {PORTFOLIO.map((item, idx) => {
          const Illustration = CardIllustrations[idx % CardIllustrations.length];
          return (
            <article
              key={item.label}
              className="portfolio-card flex-shrink-0 flex flex-col rounded-2xl border border-[#E8D9C4] bg-white overflow-hidden hover:border-[#D4682A]/40 hover:shadow-2xl transition-all duration-500 group"
              style={{
                width: "min(340px, 82vw)",
                marginLeft: "24px",
                marginTop: "auto",
                marginBottom: "auto",
                height: "460px",
              }}
            >
              {/* Illustration area */}
              <div className="relative h-52 overflow-hidden flex-shrink-0 bg-[#110B07]">
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
                  <Illustration />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#110B07]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-[#D4682A]/20 backdrop-blur-sm border border-[#D4682A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-semibold text-[#F3E9D5] tracking-wide">Preview coming</span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6 gap-3">
                <div>
                  <h3
                    className="font-bold text-[#1C1209] text-lg mb-1 group-hover:text-[#D4682A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </h3>
                  <p className="text-xs text-[#7A6B5C] leading-relaxed">{item.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Custom Design", "Mobile First", "SEO Ready"].slice(0, 2 + (idx % 2)).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F5EDE0] text-[#7A6B5C] border border-[#E8D9C4]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  disabled
                  className="flex items-center gap-1.5 text-xs font-medium text-[#B0A090] cursor-not-allowed mt-2"
                >
                  <ExternalLink size={12} />
                  View Live
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-[#F5EDE0] text-[#B0A090] text-[10px] border border-[#E8D9C4]">
                    Soon
                  </span>
                </button>
              </div>
            </article>
          );
        })}

        {/* ── CTA card ── */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: "min(340px, 82vw)", marginLeft: "24px", paddingRight: "48px" }}
        >
          <div className="text-center">
            <p className="text-4xl mb-4" aria-hidden>✦</p>
            <p className="text-[#7A6B5C] text-sm mb-6 max-w-xs leading-relaxed">
              Want to be the first shop on Route 9 with a site like this?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] text-[#FEFBF5] text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(212,104,42,0.3)]"
            >
              Let&apos;s talk
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
