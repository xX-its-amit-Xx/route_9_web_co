"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { PORTFOLIO } from "@/lib/content";
import { SplitTextReveal } from "./SplitTextReveal";
import { ProjectFolders } from "./ProjectFolders";

// Real Unsplash photos for each portfolio card
const PORTFOLIO_PHOTOS = [
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80",
];

export function Portfolio() {
  const headingRef = useScrollReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Mobile: native horizontal scroll handles layout — skip GSAP
    if (window.innerWidth < 1024) return;

    // Reduced motion: skip GSAP pinning; CSS fallback enables native scroll
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

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
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="portfolio-heading"
    >
      <div
        ref={trackRef}
        className="h-scroll-track items-stretch min-h-screen"
        style={{ padding: "0 48px" }}
      >
        {/* ── Heading card (first "card" is the section title) ── */}
        <div
          ref={headingRef}
          className="flex-shrink-0 flex flex-col justify-center pr-12 md:pr-20"
          style={{ width: "min(520px, 90vw)", paddingTop: "80px" }}
        >
          <div className="label-pill mb-4 reveal">Recent work</div>
          <SplitTextReveal
            as="h2"
            id="portfolio-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-fg leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
            delay={100}
            stagger={80}
          >
            Portfolio loading.
          </SplitTextReveal>
          <SplitTextReveal
            as="p"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4682A] italic leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
            delay={400}
            stagger={80}
          >
            Quality already here.
          </SplitTextReveal>
          <p className="text-muted leading-relaxed mb-6 reveal max-w-sm" style={{ transitionDelay: "300ms" }}>
            First clients are being onboarded now.{" "}
            <a href="#contact" className="text-accent underline-grow">
              Ask for a live preview
            </a>{" "}
            of what I&apos;d build for your shop.
          </p>
          <div className="flex items-center gap-2 text-accent text-sm font-medium reveal" style={{ transitionDelay: "400ms" }}>
            <span>Scroll to explore</span>
            <span aria-hidden style={{ display: "inline-flex", animation: "arrow-nudge 1.8s ease-in-out infinite" }}>
              <ArrowRight size={14} />
            </span>
          </div>

          {/* Stack of "in progress" project folders — visual cue that
              real client work is queued up behind the placeholder cards */}
          <div className="mt-10 reveal" style={{ transitionDelay: "550ms" }}>
            <ProjectFolders size={300} />
          </div>
        </div>

        {/* ── Portfolio cards ── */}
        {PORTFOLIO.map((item, idx) => {
          return (
            <article
              key={item.label}
              aria-labelledby={`portfolio-${idx}`}
              className="portfolio-card flex-shrink-0 flex flex-col rounded-2xl border border-border bg-surface-raised overflow-hidden hover:border-[rgba(212,104,42,0.4)] hover:shadow-2xl transition-all duration-500 group"
              style={{
                width: "min(340px, 82vw)",
                marginLeft: "24px",
                marginTop: "auto",
                marginBottom: "auto",
                height: "460px",
              }}
            >
              {/* Browser chrome + real photo */}
              <div className="h-52 flex flex-col overflow-hidden flex-shrink-0">
                {/* Chrome bar */}
                <div className="h-7 flex-shrink-0 bg-[#1C1209] flex items-center px-3 gap-1.5 border-b border-white/[0.04]">
                  <div className="flex gap-1.5" aria-hidden>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  <div className="ml-2 flex-1 h-4 rounded bg-white/[0.06] flex items-center px-2 overflow-hidden">
                    <span className="text-[8px] text-white/20 font-mono truncate">
                      route9web.com/preview
                    </span>
                  </div>
                </div>
                {/* Photo */}
                <div className="flex-1 relative overflow-hidden">
                  <img
                    src={PORTFOLIO_PHOTOS[idx % PORTFOLIO_PHOTOS.length]}
                    alt={item.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1209]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div aria-hidden="true" className="absolute bottom-3 left-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-2.5 py-1 rounded-full bg-[rgba(212,104,42,0.85)] backdrop-blur-sm text-[10px] font-semibold text-white tracking-wide">
                      Preview coming soon
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6 gap-3">
                <div>
                  <h3
                    id={`portfolio-${idx}`}
                    className="font-bold text-fg text-lg mb-1 group-hover:text-accent transition-colors duration-200"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Custom Design", "Mobile First", "SEO Ready"].slice(0, 2 + (idx % 2)).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface text-muted border border-border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  disabled
                  aria-disabled="true"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-light cursor-not-allowed mt-2"
                >
                  <ExternalLink size={12} aria-hidden />
                  View Live
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-surface text-muted-light text-[10px] border border-border-subtle">
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
            <p className="text-4xl mb-4 sparkle-icon" style={{ color: "#D4682A" }} aria-hidden>✦</p>
            <p className="text-muted text-sm mb-6 max-w-xs leading-relaxed">
              Want to be the first shop on Route 9 with a site like this?
            </p>
            <a
              href="#contact"
              className="nav-cta-shimmer inline-flex items-center gap-2 h-12 px-7 rounded-xl text-[#1C1209] text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 18px rgba(212,104,42,0.42), 0 1px 0 rgba(255,220,160,0.18) inset",
              }}
            >
              Let&apos;s talk
              <ArrowRight size={13} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
