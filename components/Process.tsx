"use client";

import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TypewriterHeading } from "./TypewriterHeading";
import { MapleLeafFall } from "./MapleLeafFall";
import { VintageTypewriter } from "./VintageTypewriter";
import { LandmarkBadge } from "./LandmarkBadge";
import { PROCESS } from "@/lib/content";

// Custom artisan step illustrations — each modeled as a lit physical
// object: form gradients (light upper-left), specular highlights,
// occlusion at joins, and soft contact shadows. Static SVG only.
const STEP_ILLUSTRATIONS = [
  // Step 1: Handshake / Coffee meeting — glossy ceramic cup on a saucer
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <defs>
        {/* Ceramic body — light catches the upper-left of the glaze */}
        <linearGradient id="ps1-cup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F09355" />
          <stop offset="45%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#96431A" />
        </linearGradient>
        {/* Coffee surface */}
        <radialGradient id="ps1-coffee" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#6B3517" />
          <stop offset="100%" stopColor="#2A1408" />
        </radialGradient>
        {/* Saucer */}
        <linearGradient id="ps1-saucer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFD9AE" />
          <stop offset="100%" stopColor="#C9A26A" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Contact shadow under the saucer */}
      <ellipse cx="26.5" cy="38.6" rx="12" ry="2" fill="rgba(28,18,9,0.22)" />
      {/* Saucer */}
      <ellipse cx="26.5" cy="37" rx="11" ry="2.4" fill="url(#ps1-saucer)" stroke="rgba(150,67,26,0.5)" strokeWidth="0.6" />
      <ellipse cx="26.5" cy="36.6" rx="7.5" ry="1.5" fill="rgba(28,18,9,0.14)" />
      {/* Handle — shaded ring with inner highlight */}
      <path d="M34 26h3a2 2 0 0 1 0 4h-3" stroke="#96431A" strokeWidth="2.6" />
      <path d="M34 25.6h3a2.2 2.2 0 0 1 1.6 0.8" stroke="rgba(255,220,160,0.6)" strokeWidth="0.8" strokeLinecap="round" />
      {/* Occlusion where cup meets saucer */}
      <ellipse cx="26" cy="35" rx="7.2" ry="1.2" fill="rgba(28,18,9,0.3)" />
      {/* Cup body */}
      <rect x="18" y="22" width="16" height="13" rx="2" fill="url(#ps1-cup)" stroke="rgba(90,40,14,0.55)" strokeWidth="0.7" />
      {/* Glaze specular — long soft streak + hot dot */}
      <ellipse cx="21.6" cy="27.5" rx="1.5" ry="4.2" fill="rgba(255,240,214,0.4)" />
      <ellipse cx="21.3" cy="25" rx="0.7" ry="1.3" fill="rgba(255,250,235,0.75)" />
      {/* Rim light along the right edge */}
      <path d="M33.4 24v9" stroke="rgba(255,214,150,0.28)" strokeWidth="0.7" strokeLinecap="round" />
      {/* Coffee inside the rim */}
      <ellipse cx="26" cy="22.4" rx="7.2" ry="1.7" fill="url(#ps1-coffee)" stroke="rgba(255,230,180,0.35)" strokeWidth="0.5" />
      <ellipse cx="24" cy="22" rx="2.2" ry="0.5" fill="rgba(255,235,200,0.3)" />
      {/* Steam */}
      <path d="M22 19c0-2 2-2 2-4" stroke="rgba(212,104,42,0.35)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M28 19c0-2 2-2 2-4" stroke="rgba(212,104,42,0.35)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  // Step 2: Screen / Preview — glowing display with bezel + stand depth
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <defs>
        {/* Bezel — dark ember enamel */}
        <linearGradient id="ps2-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A3018" />
          <stop offset="55%" stopColor="#241408" />
          <stop offset="100%" stopColor="#140A04" />
        </linearGradient>
        {/* Screen glow — warm phosphor, brightest upper-left */}
        <radialGradient id="ps2-screen" cx="32%" cy="26%" r="95%">
          <stop offset="0%" stopColor="#5A3012" />
          <stop offset="55%" stopColor="#33190A" />
          <stop offset="100%" stopColor="#1C0E05" />
        </radialGradient>
        {/* Metal stand */}
        <linearGradient id="ps2-stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E6A3A" />
          <stop offset="100%" stopColor="#4A3018" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Contact shadow under the base */}
      <ellipse cx="28" cy="41" rx="11.5" ry="1.6" fill="rgba(28,18,9,0.22)" />
      {/* Stand neck + base */}
      <rect x="20" y="37" width="2.4" height="3.4" fill="url(#ps2-stand)" />
      <rect x="33.6" y="37" width="2.4" height="3.4" fill="url(#ps2-stand)" />
      <rect x="17" y="39.4" width="22" height="1.8" rx="0.9" fill="url(#ps2-stand)" stroke="rgba(28,14,4,0.4)" strokeWidth="0.4" />
      <path d="M18 39.7h9" stroke="rgba(255,225,170,0.35)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Occlusion where neck meets monitor */}
      <rect x="19.4" y="36.7" width="17.4" height="1" fill="rgba(0,0,0,0.35)" rx="0.5" />
      {/* Monitor bezel */}
      <rect x="13" y="17" width="30" height="20" rx="2" fill="url(#ps2-bezel)" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      {/* Bezel top-edge specular */}
      <path d="M15 18.1h26" stroke="rgba(255,228,170,0.3)" strokeWidth="0.6" strokeLinecap="round" />
      {/* Screen inset (recessed: dark lip above, light lip below) */}
      <rect x="15" y="19" width="26" height="16" rx="1" fill="url(#ps2-screen)" stroke="rgba(0,0,0,0.6)" strokeWidth="0.5" />
      <path d="M15.4 34.6h25.2" stroke="rgba(255,210,150,0.14)" strokeWidth="0.5" />
      {/* Screen content: glowing layout lines */}
      <rect x="17" y="21" width="22" height="3" rx="0.75" fill="rgba(240,150,80,0.55)" />
      <rect x="17" y="26" width="13" height="2" rx="0.75" fill="rgba(240,170,110,0.38)" />
      <rect x="17" y="30" width="9" height="2" rx="0.75" fill="rgba(240,180,130,0.28)" />
      {/* Glass reflection sweep */}
      <path d="M15 19 L24 19 L17 35 L15 35 Z" fill="rgba(255,240,214,0.07)" />
      <path d="M26 19 L29.5 19 L22.5 35 L19 35 Z" fill="rgba(255,240,214,0.045)" />
    </svg>
  ),
  // Step 3: Rocket launch — polished metal hull, banded, hot exhaust
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <defs>
        {/* Hull — cylindrical form, lit from the left */}
        <linearGradient id="ps3-hull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5A868" />
          <stop offset="38%" stopColor="#D4682A" />
          <stop offset="100%" stopColor="#7E3210" />
        </linearGradient>
        {/* Fins — in the hull's shadow */}
        <linearGradient id="ps3-fin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A84818" />
          <stop offset="100%" stopColor="#5A2410" />
        </linearGradient>
        {/* Porthole glass */}
        <radialGradient id="ps3-glass" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF4DC" />
          <stop offset="60%" stopColor="#E3B878" />
          <stop offset="100%" stopColor="#8E5A24" />
        </radialGradient>
        {/* Exhaust core */}
        <radialGradient id="ps3-flame" cx="50%" cy="15%" r="90%">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="45%" stopColor="#F09040" />
          <stop offset="100%" stopColor="rgba(212,104,42,0)" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Exhaust glow pool (soft, layered — no blur) */}
      <ellipse cx="28" cy="38" rx="8" ry="5" fill="rgba(240,144,64,0.14)" />
      <ellipse cx="28" cy="37" rx="5" ry="3.4" fill="rgba(255,190,110,0.18)" />
      {/* Fins — tucked behind the hull, rim-lit on outer edges */}
      <path d="M20 28v6l-4 4 4-10z" fill="url(#ps3-fin)" stroke="rgba(40,16,6,0.5)" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M36 28v6l4 4-4-10z" fill="url(#ps3-fin)" stroke="rgba(40,16,6,0.5)" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M20 28.6l-3.2 8" stroke="rgba(255,214,150,0.35)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Flame — outer sheath + hot core */}
      <path d="M23.5 30c0.5 5 2 8.5 4.5 10 2.5-1.5 4-5 4.5-10z" fill="url(#ps3-flame)" />
      <path d="M25.8 30c0.3 3.4 1 5.8 2.2 7 1.2-1.2 1.9-3.6 2.2-7z" fill="rgba(255,240,190,0.6)" />
      {/* Nozzle */}
      <path d="M24.5 28 L31.5 28 L30.5 30.2 L25.5 30.2 Z" fill="#3A1C0C" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" />
      <path d="M25.2 28.5h5.6" stroke="rgba(255,214,150,0.25)" strokeWidth="0.5" />
      {/* Hull */}
      <path d="M28 12c0 0 8 6 8 16H20c0-10 8-16 8-16z" fill="url(#ps3-hull)" stroke="rgba(70,28,10,0.55)" strokeWidth="0.7" strokeLinejoin="round" />
      {/* Metallic body bands — dark groove + light emboss line */}
      <path d="M21.6 20.5c4-1.6 8.8-1.6 12.8 0" stroke="rgba(60,24,8,0.4)" strokeWidth="0.7" fill="none" />
      <path d="M21.6 21.2c4-1.6 8.8-1.6 12.8 0" stroke="rgba(255,214,150,0.3)" strokeWidth="0.5" fill="none" />
      <path d="M20.3 26c4.8-1.2 10.6-1.2 15.4 0" stroke="rgba(60,24,8,0.4)" strokeWidth="0.7" fill="none" />
      <path d="M20.3 26.7c4.8-1.2 10.6-1.2 15.4 0" stroke="rgba(255,214,150,0.3)" strokeWidth="0.5" fill="none" />
      {/* Long specular down the lit side of the hull */}
      <path d="M25 14.5c-1.8 2.6-3.2 6-3.6 10" stroke="rgba(255,244,220,0.5)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Rim light on the shadow side */}
      <path d="M31.5 15.5c1.6 2.4 2.8 5.6 3.2 9.5" stroke="rgba(255,200,140,0.22)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      {/* Porthole — brass ring, glass dome, specular dot */}
      <circle cx="28" cy="24" r="3.4" fill="#5A2C10" />
      <circle cx="28" cy="24" r="3" fill="url(#ps3-glass)" stroke="rgba(255,224,160,0.5)" strokeWidth="0.5" />
      <circle cx="26.9" cy="23" r="0.8" fill="rgba(255,252,240,0.85)" />
    </svg>
  ),
  // Step 4: Text message / phone — paper-card bubble + deep-bezel phone
  () => (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className="w-full h-full">
      <defs>
        {/* Bubble — warm paper card */}
        <linearGradient id="ps4-bubble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBF1DA" />
          <stop offset="100%" stopColor="#E8D0A0" />
        </linearGradient>
        {/* Phone body — dark ember enamel */}
        <linearGradient id="ps4-phone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A3018" />
          <stop offset="55%" stopColor="#22120A" />
          <stop offset="100%" stopColor="#120904" />
        </linearGradient>
        {/* Phone screen glow */}
        <radialGradient id="ps4-glow" cx="35%" cy="25%" r="100%">
          <stop offset="0%" stopColor="#54290F" />
          <stop offset="100%" stopColor="#1C0E05" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="27" stroke="rgba(212,104,42,0.12)" strokeWidth="1" />
      {/* Bubble cast shadow */}
      <rect x="14" y="18.4" width="22" height="16" rx="3" fill="rgba(28,18,9,0.16)" />
      {/* Chat bubble — paper card with pressed border */}
      <rect x="13" y="17" width="22" height="16" rx="3" fill="url(#ps4-bubble)" stroke="rgba(150,67,26,0.5)" strokeWidth="0.7" />
      <path d="M15.5 18.2h17" stroke="rgba(255,252,240,0.7)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M15.5 31.9h17" stroke="rgba(120,60,20,0.18)" strokeWidth="0.6" strokeLinecap="round" />
      {/* Bubble tail — shaded fold */}
      <path d="M16 38l2-5h-4l2 5z" fill="#D8AE6E" stroke="rgba(150,67,26,0.5)" strokeWidth="0.7" strokeLinejoin="round" />
      <path d="M14.6 33.4l1.4 3.4" stroke="rgba(255,244,220,0.4)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Ink lines */}
      <path d="M18 23h12M18 27h8" stroke="rgba(150,60,20,0.55)" strokeWidth="1.25" strokeLinecap="round" />
      {/* Phone contact shadow */}
      <ellipse cx="38.5" cy="41.6" rx="5.6" ry="1.1" fill="rgba(28,18,9,0.25)" />
      {/* Phone body */}
      <rect x="33" y="26" width="10" height="15" rx="2" fill="url(#ps4-phone)" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
      {/* Bezel edge lights — left catches light, right falls off */}
      <path d="M33.6 27.6v11.8" stroke="rgba(255,225,170,0.3)" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M34.5 26.5h7" stroke="rgba(255,225,170,0.22)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Screen inset, glowing */}
      <rect x="34.3" y="27.6" width="7.4" height="10.4" rx="1" fill="url(#ps4-glow)" stroke="rgba(0,0,0,0.55)" strokeWidth="0.4" />
      {/* Tiny message bubbles on screen */}
      <rect x="35.4" y="29" width="4.2" height="1.8" rx="0.9" fill="rgba(240,150,80,0.5)" />
      <rect x="36.4" y="31.8" width="4.2" height="1.8" rx="0.9" fill="rgba(240,180,130,0.32)" />
      {/* Screen glass sweep */}
      <path d="M34.3 27.6 L37 27.6 L34.9 38 L34.3 38 Z" fill="rgba(255,240,214,0.08)" />
      {/* Home bar */}
      <path d="M36.2 39.6h3.6" stroke="rgba(255,214,150,0.4)" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  ),
];

// rAF-throttled step-spotlight updater — one layout read + two style writes
// per frame per card (max), instead of on every mousemove event.
const spotFrames = new WeakMap<HTMLElement, number>();
function handleSpotMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  if (spotFrames.has(el)) return;
  const { clientX, clientY } = e;
  spotFrames.set(
    el,
    requestAnimationFrame(() => {
      spotFrames.delete(el);
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    })
  );
}

export function Process() {
  const headingRef = useScrollReveal();
  const stepsRef = useScrollReveal(0.05);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const allowMag = useRef(false);
  const magFrame = useRef(0);

  useEffect(() => {
    allowMag.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const container = stepsRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const articles = container.querySelectorAll<HTMLElement>("article");
        if (!articles.length) return;
        gsap.fromTo(
          articles,
          { opacity: 0, scale: 0.92, rotation: -1.5, y: 28 },
          {
            opacity: 1, scale: 1, rotation: 0, y: 0,
            duration: 0.65, ease: "back.out(2)", stagger: 0.14,
            scrollTrigger: {
              trigger: container,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => { if (t.trigger === container) t.kill(); });
        };
      });
    });
    return () => cleanup?.();
  }, []);

  // Magnetic CTA — rAF-throttled so the layout read (getBoundingClientRect)
  // and transform write happen at most once per frame, not per mousemove.
  const handleMagMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el || !allowMag.current) return;
    if (magFrame.current) return;
    const { clientX, clientY } = e;
    magFrame.current = requestAnimationFrame(() => {
      magFrame.current = 0;
      const r = el.getBoundingClientRect();
      const x = (clientX - (r.left + r.width / 2)) * 0.25;
      const y = (clientY - (r.top + r.height / 2)) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.transition = "transform 0.1s ease-out, box-shadow 0.15s";
    });
  };

  const handleMagLeave = () => {
    const el = ctaRef.current;
    if (!el || !allowMag.current) return;
    if (magFrame.current) {
      cancelAnimationFrame(magFrame.current);
      magFrame.current = 0;
    }
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.15s";
  };

  return (
    <section
      id="process"
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="process-heading"
    >
      {/* Ambient falling maple leaves — New England autumn backdrop */}
      <MapleLeafFall />

      {/* Vintage typewriter floating in the section's top-right corner
          on xl screens — visually echoes the TypewriterHeading below */}
      <div
        aria-hidden
        className="hidden xl:block absolute pointer-events-none"
        style={{ top: "80px", right: "48px", zIndex: 1 }}
      >
        <VintageTypewriter size={220} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-14">
          <div className="label-pill mb-4 reveal">How it works</div>
          <TypewriterHeading
            as="h2"
            id="process-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            lines={["From handshake", "to live website in days."]}
            charDelay={36}
            lineGap={420}
          />
          <p
            className="mt-4 max-w-xl text-muted text-lg reveal"
            style={{ transitionDelay: "500ms" }}
          >
            Not weeks. Not months. Days. (Unless you need more time to think about it —
            that&apos;s fine too.)
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROCESS.map((step, i) => {
            const Illustration = STEP_ILLUSTRATIONS[i % STEP_ILLUSTRATIONS.length];
            const timeHints = ["~20 min", "2–3 days", "Same day", "Ongoing"];
            return (
              <div key={step.step} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <article
                aria-labelledby={`step-${step.step}`}
                className="shine card-light relative flex flex-col gap-4 p-6 group h-full"
                style={{ isolation: "isolate" }}
                onMouseMove={handleSpotMove}
              >
                <div className="step-spotlight" aria-hidden />
                {/* Time estimate chip — slides in on hover */}
                <div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 translate-y-1"
                  aria-hidden
                >
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                    style={{
                      background: "rgba(212,104,42,0.08)",
                      border: "1px solid rgba(212,104,42,0.2)",
                      color: "rgba(212,104,42,0.9)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {timeHints[i]}
                  </span>
                </div>
                {/* Step illustration + connector */}
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex-shrink-0 w-14 h-14 group-hover:scale-105 group-hover:rotate-[-3deg] transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-2xl group-hover:bg-[rgba(212,104,42,0.06)] group-hover:shadow-[0_4px_16px_rgba(212,104,42,0.14)]"
                  >
                    <Illustration />
                    {/* Step number badge — 3D sphere */}
                    <div
                      className="step-badge absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full text-[#1C1209] text-[11px] font-bold flex items-center justify-center"
                      style={{
                        fontFamily: "var(--font-display)",
                        background: "linear-gradient(145deg, #E07838 0%, #D4682A 50%, #B05020 100%)",
                        boxShadow: "0 2px 8px rgba(212,104,42,0.4), inset 0 1px 0 rgba(255,220,140,0.28), inset 0 -1px 0 rgba(0,0,0,0.2)",
                      }}
                    >
                      {step.step}
                    </div>
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div
                      className="hidden lg:block flex-1 h-px flow-line"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, rgba(212,104,42,0.38) 0px, rgba(212,104,42,0.38) 4px, transparent 4px, transparent 8px)",
                        backgroundSize: "12px 1px",
                      }}
                      aria-hidden
                    />
                  )}
                </div>
                <div>
                  <h3
                    id={`step-${step.step}`}
                    className="font-bold text-fg mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{step.body}</p>
                </div>
              </article>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <p className="text-muted reveal mb-2">
              Ready to see what your site could look like? The meeting is free. The preview is free. You only pay when you&apos;re happy.
            </p>
            {/* Local detail */}
            <p className="text-[11px] text-muted italic reveal" style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}>
              I can meet you at your shop on Route 9 — Shrewsbury Center, near the lake, wherever you are.
            </p>
          </div>
          {/* Route 9 keepsake medallion — sits in the CTA row's open middle
              on large screens; hidden below lg where the row stacks */}
          <LandmarkBadge
            src="https://images.unsplash.com/photo-1571415822965-c563f4535eaf?w=240&auto=format&fit=crop&q=80"
            alt="A two-lane road between orange autumn trees"
            caption="Route 9"
            size={84}
            tilt={4}
            delay={60}
            className="hidden lg:inline-block flex-shrink-0"
          />
          <div className="reveal flex-shrink-0" style={{ transitionDelay: "100ms" }}>
            <a
              ref={ctaRef}
              href="#contact"
              onMouseMove={handleMagMove}
              onMouseLeave={handleMagLeave}
              className="nav-cta-shimmer inline-flex items-center h-12 px-7 rounded-xl text-[#1C1209] text-sm font-semibold"
              style={{
                background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
                transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.15s",
              }}
            >
              Book a free meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
