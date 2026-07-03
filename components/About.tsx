"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TextScramble } from "./TextScramble";
import { BrandSeal } from "./BrandSeal";
import { HandwrittenSignature } from "./HandwrittenSignature";
import { Matchbook } from "./Matchbook";
import { NewspaperClipping } from "./NewspaperClipping";
import { Mailcarrier } from "./Mailcarrier";
import { LandmarkBadge } from "./LandmarkBadge";
import { ABOUT, SITE } from "@/lib/content";

export function About() {
  const bodyRef   = useScrollReveal();
  const leftRef   = useScrollReveal();
  const photoRef  = useRef<HTMLImageElement>(null);
  const bannerRef = useScrollReveal<HTMLDivElement>();

  // Banner parallax — rAF-throttled (one pending frame max) so scroll events
  // never trigger more than one layout read + style write per frame.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const banner = bannerRef.current;
      const img    = photoRef.current;
      if (!banner || !img) return;
      const rect     = banner.getBoundingClientRect();
      const progress = -rect.top / (window.innerHeight + rect.height);
      img.style.transform = `scale(1.08) translateY(${progress * 28}px)`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Atmospheric street photo with matchbook artifact ── */}
        <div className="relative mb-14">
          <div ref={bannerRef} className="relative w-full h-44 md:h-60 rounded-3xl overflow-hidden reveal group">
            <img
              ref={photoRef}
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&auto=format&fit=crop&q=80"
              alt="A warm café along Route 9, Shrewsbury MA"
              loading="lazy"
              className="w-full h-full object-cover object-center"
              style={{ willChange: "transform", transform: "scale(1.08)" }}
            />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1209]/80 via-[#1C1209]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1209]/45 to-transparent" />
          {/* Text overlay */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <p className="text-white/45 text-[10px] tracking-[0.22em] uppercase mb-2 font-semibold">
              Route 9 · Shrewsbury, MA
            </p>
            <p
              className="text-white text-2xl md:text-3xl font-bold italic leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your neighborhood.<br />My backyard.
            </p>
            <p className="text-white/35 text-[11px] mt-2 tracking-wide">
              Lake Quinsigamond · Shrewsbury Center · Route 9
            </p>
          </div>
          {/* MA·9 badge — embossed medallion: raised outer rim, recessed
              center dish, metallic thread edge stitched inside the rim */}
          <div
            className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-white/20"
            style={{
              background:
                "radial-gradient(circle at 34% 28%, #F08040 0%, #D4682A 52%, #96431A 100%)",
              boxShadow:
                "0 0 0 3px rgba(212,104,42,0.2), 0 8px 24px rgba(212,104,42,0.45), 0 16px 40px rgba(212,104,42,0.2), inset 0 2px 1px rgba(255,220,140,0.45), inset 0 -2px 2px rgba(0,0,0,0.3), inset 0 0 10px 2px rgba(0,0,0,0.22)",
            }}
            aria-hidden
          >
            {/* Metallic thread edge + recessed center dish */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[3px] rounded-full"
              style={{
                border: "1px dashed rgba(255,228,160,0.6)",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.28), inset 0 -1px 1px rgba(255,220,140,0.28), 0 1px 0 rgba(255,230,170,0.3)",
              }}
            />
            {/* Rim specular — light kisses the upper-left of the raised edge */}
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                top: "3px",
                left: "8px",
                width: "22px",
                height: "9px",
                transform: "rotate(-24deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(255,244,214,0.55) 0%, rgba(255,244,214,0) 70%)",
              }}
            />
            <span className="text-[8px] font-bold text-white/80 tracking-widest leading-none">MA</span>
            <span
              className="text-2xl font-bold text-white italic leading-none"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              9
            </span>
          </div>
          </div>

          {/* Matchbook artifact — peeks below the banner's bottom-left corner.
              Kept small so it doesn't crowd the headline text overlay. */}
          <div
            aria-hidden
            className="hidden md:block absolute pointer-events-none"
            style={{ left: "12px", bottom: "-36px", zIndex: 2 }}
          >
            <Matchbook size={88} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={leftRef}>
            <div className="label-pill mb-4 reveal">About</div>
            <TextScramble
              as="h2"
              id="about-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
              speed={3}
            >
              Local work, done locally.
            </TextScramble>

            {/* Animated wavy underline — draws on scroll */}
            <div className="reveal mb-6" style={{ transitionDelay: "500ms" }}>
              <svg viewBox="0 0 220 9" fill="none" className="w-[clamp(130px,40%,210px)]" aria-hidden>
                <path
                  className="draw-underline-path"
                  d="M2 5 Q30 2 58 5 Q86 8 114 5 Q142 2 170 5 Q198 8 218 5"
                  stroke="#D4682A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Quick stats */}
            <dl className="grid grid-cols-3 gap-3 mb-6 reveal" style={{ transitionDelay: "320ms" }}>
              {[
                { value: "< 2hr", label: "Avg reply time" },
                { value: "Days", label: "Not months" },
                { value: "MA-9", label: "Your neighbor" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center px-2 py-3 rounded-xl border transition-[background-color,border-color,box-shadow] duration-200 border-[rgba(212,104,42,0.12)] bg-[rgba(212,104,42,0.03)] hover:bg-[rgba(212,104,42,0.07)] hover:border-[rgba(212,104,42,0.22)] hover:shadow-[0_4px_16px_rgba(212,104,42,0.1)]"
                >
                  <dt
                    className="font-extrabold leading-none mb-1"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "18px", color: "var(--accent)" }}
                  >
                    {value}
                  </dt>
                  <dd className="text-[9px] font-semibold tracking-wide uppercase text-muted" style={{ letterSpacing: "0.1em" }}>
                    {label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Route 9 sign element — now featuring the official brand seal */}
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface reveal float-after-reveal transition-[opacity,transform,border-color,box-shadow] duration-200 hover:border-[rgba(212,104,42,0.28)] hover:shadow-[0_4px_20px_rgba(212,104,42,0.1)]" style={{ transitionDelay: "300ms" }}>
              <BrandSeal size={72} tilt={-8} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-fg" style={{ fontFamily: "var(--font-display)" }}>{SITE.name}</p>
                <p className="text-xs text-muted">{SITE.location} · Est. {SITE.founded}</p>
                <p className="text-xs text-muted mt-0.5">Serving Route 9 since day one</p>
              </div>
            </div>

            {/* Studio desk illustration — pencil, mug, sticky, ruler */}
            <div className="mt-6 reveal" style={{ transitionDelay: "420ms" }}>
              <svg
                viewBox="0 0 220 130"
                fill="none"
                aria-hidden
                style={{
                  width: "min(220px, 80%)",
                  animation: "float-subtle 6s ease-in-out 1.8s infinite",
                  opacity: 0.82,
                }}
              >
                {/* Desk surface */}
                <rect x="8" y="104" width="204" height="4" rx="2" fill="rgba(212,104,42,0.12)" stroke="rgba(212,104,42,0.22)" strokeWidth="1" />

                {/* Ruler — horizontal, bottom-left */}
                <rect x="10" y="92" width="88" height="11" rx="1.5" fill="rgba(212,104,42,0.06)" stroke="rgba(212,104,42,0.38)" strokeWidth="1" />
                {[0,8,16,24,32,40,48,56,64,72,80].map((x, i) => (
                  <line key={i} x1={14+x} y1="92" x2={14+x} y2={i % 5 === 0 ? "97" : "95"} stroke="rgba(212,104,42,0.45)" strokeWidth="0.8" />
                ))}
                <text x="16" y="101" fontSize="5" fill="rgba(212,104,42,0.35)" fontFamily="monospace">cm</text>

                {/* Coffee mug — right side */}
                <rect x="162" y="72" width="28" height="30" rx="3" fill="rgba(212,104,42,0.08)" stroke="rgba(212,104,42,0.55)" strokeWidth="1.4" />
                <path d="M190 80 Q200 80 200 87 Q200 94 190 94" stroke="rgba(212,104,42,0.45)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <rect x="165" y="72" width="22" height="5" rx="1.5" fill="rgba(212,104,42,0.12)" />
                {/* Steam */}
                <path d="M170 68 Q172 63 170 58" stroke="rgba(212,104,42,0.28)" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M176 66 Q178 61 176 56" stroke="rgba(212,104,42,0.22)" strokeWidth="1" strokeLinecap="round" />
                <path d="M182 68 Q184 63 182 58" stroke="rgba(212,104,42,0.18)" strokeWidth="0.9" strokeLinecap="round" />

                {/* Sticky note — center */}
                <rect x="96" y="60" width="52" height="42" rx="2" fill="rgba(212,104,42,0.09)" stroke="rgba(212,104,42,0.32)" strokeWidth="1" />
                {/* Folded corner */}
                <path d="M136 60 L148 60 L136 72 Z" fill="rgba(212,104,42,0.18)" />
                <text x="122" y="80" textAnchor="middle" fontSize="8" fill="rgba(212,104,42,0.7)" fontFamily="monospace" fontWeight="700" letterSpacing="0.04em">ROUTE</text>
                <text x="122" y="92" textAnchor="middle" fontSize="13" fill="rgba(212,104,42,0.8)" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="400">9</text>

                {/* Pencil — angled across desk */}
                <g transform="rotate(-22, 60, 88)">
                  <rect x="20" y="84" width="66" height="7" rx="1" fill="rgba(212,104,42,0.09)" stroke="rgba(212,104,42,0.45)" strokeWidth="1" />
                  {/* Eraser tip */}
                  <rect x="82" y="84" width="9" height="7" rx="1" fill="rgba(212,104,42,0.22)" stroke="rgba(212,104,42,0.45)" strokeWidth="1" />
                  {/* Point */}
                  <path d="M20 84 L14 87.5 L20 91" fill="rgba(212,104,42,0.35)" stroke="rgba(212,104,42,0.5)" strokeWidth="0.8" strokeLinejoin="round" />
                  {/* Pencil grip band */}
                  <rect x="76" y="84" width="4" height="7" fill="rgba(212,104,42,0.15)" />
                  {/* Pencil shine */}
                  <line x1="24" y1="86" x2="74" y2="86" stroke="rgba(255,220,160,0.18)" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Small eraser block — loose on desk */}
                <rect x="58" y="90" width="18" height="10" rx="1.5" fill="rgba(212,104,42,0.08)" stroke="rgba(212,104,42,0.32)" strokeWidth="1" />
                <text x="67" y="98" textAnchor="middle" fontSize="4.5" fill="rgba(212,104,42,0.4)" fontFamily="monospace" fontWeight="700">ERASER</text>
              </svg>
            </div>

            {/* Polaroid snapshot — where the work actually happens */}
            <figure
              className="mt-8 reveal inline-block m-0"
              style={{ transitionDelay: "520ms" }}
            >
              <div
                className="bg-white p-2.5 pb-3 rounded-lg rotate-[-2.5deg] hover:rotate-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(28,18,9,0.06), 0 10px 28px rgba(28,18,9,0.12), 0 28px 56px rgba(212,104,42,0.08)",
                }}
              >
                <div className="w-56 sm:w-64 aspect-[4/3] rounded-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1759435194622-22924891c367?w=600&auto=format&fit=crop&q=80"
                    alt="Working on a laptop at a sunny café counter — a typical Route 9 workday"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption
                  className="text-[11px] text-muted italic mt-2 text-center"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Most sites get built from a café stool on Route 9.
                </figcaption>
              </div>
            </figure>
          </div>

          {/* Right: body */}
          <div ref={bodyRef} className="space-y-5">
            {/* Otis the mailcarrier — friendly brand mascot. Floats
                inline-right with a wraparound so the paragraphs flow
                around him on wider screens; hides on mobile where the
                wrap would crowd the text. */}
            <div className="hidden md:block float-right ml-5 mb-3 reveal">
              <Mailcarrier size={160} />
            </div>

            {ABOUT.paragraphs.map((p, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <p className="text-muted leading-relaxed max-w-[65ch]">{p}</p>
              </div>
            ))}

            {/* AI transparency — quiet editorial aside */}
            <aside
              className="reveal mt-6 pl-5 py-1 max-w-[65ch]"
              style={{
                transitionDelay: `${ABOUT.paragraphs.length * 90}ms`,
                borderLeft: "2px solid rgba(212,104,42,0.35)",
              }}
            >
              <p className="text-sm text-muted leading-relaxed italic" style={{ fontFamily: "var(--font-display)" }}>
                &ldquo;{ABOUT.aiNote}&rdquo;
              </p>
            </aside>

            {(SITE.personalSite as string) !== "PLACEHOLDER_PERSONAL_SITE" && (
              <div className="reveal" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 1) * 90}ms` }}>
                <a
                  href={SITE.personalSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover underline-grow underline-offset-4 transition-colors duration-300"
                >
                  {ABOUT.moreLinkText}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            )}

            {/* Vintage newspaper clipping — fictional "press coverage" */}
            <div className="reveal mt-8" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 1.5) * 90}ms` }}>
              <NewspaperClipping />
            </div>

            {/* Main Street keepsake medallion — a little framed snapshot of
                the neighborhood, pinned above the sign-off */}
            <LandmarkBadge
              src="https://images.unsplash.com/photo-1782556987577-8f6efdfdf9f3?w=240&auto=format&fit=crop&q=80"
              alt="A quaint New England main street with a church steeple"
              caption="Main St"
              size={88}
              tilt={-3}
              delay={(ABOUT.paragraphs.length + 2) * 90}
              className="hidden md:inline-block mt-6 ml-1"
            />

            {/* Hand-drawn ink signature — draws on when scrolled into view */}
            <div className="mt-8 reveal" style={{ transitionDelay: `${(ABOUT.paragraphs.length + 2) * 90}ms` }}>
              <HandwrittenSignature />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
