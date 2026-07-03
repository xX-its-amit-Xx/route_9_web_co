"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { TextScramble } from "./TextScramble";
import { CountUp } from "./CountUp";
import { BarberPole } from "./BarberPole";
import { VintageStamps } from "./VintageStamps";
import { ShrewsburyMap } from "./ShrewsburyMap";
import { LandmarkBadge } from "./LandmarkBadge";
import { WHO } from "@/lib/content";

// ── Custom icons for the three reasons ───────────────────────────────────────

function IconSameDay() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      <circle cx="10" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 7.5V11.5L12.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 5.5L19 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 3h2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInPerson() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      {/* Left person */}
      <circle cx="6.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 16c0-3 1.8-5 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Right person */}
      <circle cx="15.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M19.5 16c0-3-1.8-5-4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Handshake */}
      <path d="M8 13.5l1.5-1 1 0.5 1-0.5 1.5 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Location pin above */}
      <path d="M11 2.5c1.1 0 2 .9 2 2 0 1.1-2 3-2 3S9 5.6 9 4.5c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function IconNeighborhood() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      {/* Map outline */}
      <path d="M3 5l5-2 6 2.5 5-2v14l-5 2-6-2.5-5 2V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="8" y1="3" x2="8" y2="17" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" />
      <line x1="14" y1="5.5" x2="14" y2="19" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" />
      {/* Route 9 shield on map */}
      <rect x="8.5" y="7.5" width="5" height="5.5" rx="1" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.9" />
      <text x="11" y="12" textAnchor="middle" fontSize="3.5" fill="currentColor" fontWeight="800">9</text>
    </svg>
  );
}

const REASON_ICONS = [IconSameDay, IconInPerson, IconNeighborhood];

// rAF-throttled cursor-spotlight updater — at most one style write + one
// getBoundingClientRect per frame per tile, instead of per mousemove event.
const spotFrames = new WeakMap<HTMLElement, number>();
function handleMosaicSpot(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  if (spotFrames.has(el)) return;
  const { clientX, clientY } = e;
  spotFrames.set(
    el,
    requestAnimationFrame(() => {
      spotFrames.delete(el);
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--spot-y", `${((clientY - r.top) / r.height) * 100}%`);
    })
  );
}

// Transform-based replacement for the old `road-car-travel` keyframes, which
// animated `left` (layout every frame, forever). The wrapper spans the full
// strip, so translateX(100%) === left:100%. Compositor-only.
const CAR_TRAVEL_CSS = `
@keyframes who-car-travel-x {
  0%   { transform: translateX(0);    opacity: 0; }
  4%   { transform: translateX(2%);   opacity: 0.85; }
  96%  { transform: translateX(100%); opacity: 0.85; }
  100% { transform: translateX(102%); opacity: 0; }
}
`;

// Bento mosaic: first item spans 2 cols × 2 rows, rest fill 3×3 grid.
// Bright, people-forward shots — owners and staff at work, not empty rooms.
const MOSAIC = [
  { id: "1757621788643-395dc581dc6d", label: "Restaurants & Pizzerias" }, // chef at the pizza oven
  { id: "1742863683169-07a6a7d5286a", label: "Cafes & Coffee" },          // barista greeting a customer
  { id: "1579005007697-75b2fe2c88e7", label: "Bakeries" },                // baker at the counter with fresh loaves
  { id: "1593702295094-aea22597af65", label: "Barbershops" },             // barber mid-cut in daylight
  { id: "1634449571010-02389ed0f9b0", label: "Salons & Spas" },           // stylist working with a client
  { id: "1742957464657-381bd6b3f054", label: "Specialty Retail" },        // smiling clerk at the register
];

export function WhoIWorkWith() {
  const leftRef  = useScrollReveal();
  const rightRef = useScrollReveal();

  return (
    <section
      id="who"
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="who-heading"
    >
      <style>{CAR_TRAVEL_CSS}</style>
      {/* Subtle warm glow top-right */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-80px",
          right: "-80px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212,104,42,0.06) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* Decorative barber pole "mounted" against the left wall of the
          section. Desktop only — would clutter mobile and overlap text. */}
      <div
        aria-hidden
        className="hidden xl:block absolute pointer-events-none"
        style={{ top: "120px", left: "16px", zIndex: 1 }}
      >
        <BarberPole height={300} />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-center">

          {/* ── Left: text ── */}
          <div ref={leftRef}>
            <div className="label-pill mb-4 reveal">Who I work with</div>

            <TextScramble
              as="h2"
              id="who-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
              speed={3}
            >
              {WHO.heading}
            </TextScramble>

            <p
              className="text-muted text-lg leading-relaxed mb-10 reveal max-w-md"
              style={{ transitionDelay: "300ms" }}
            >
              {WHO.subhead}
            </p>

            <div className="space-y-5 mb-10">
              {WHO.reasons.map(({ heading, body }, i) => {
                const Icon = REASON_ICONS[i % REASON_ICONS.length];
                return (
                  <div
                    key={heading}
                    className="flex gap-4 p-4 rounded-2xl reveal group transition-[opacity,transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-transparent hover:-translate-y-0.5 hover:bg-[rgba(212,104,42,0.04)] hover:border-[rgba(212,104,42,0.12)] hover:shadow-[0_1px_2px_rgba(28,18,9,0.04),0_8px_24px_rgba(28,18,9,0.06)]"
                    style={{ transitionDelay: `${420 + i * 110}ms` }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:bg-accent group-hover:text-white group-hover:shadow-[0_3px_10px_rgba(212,104,42,0.3)] text-accent bg-[rgba(212,104,42,0.08)] border border-[rgba(212,104,42,0.16)] shadow-[inset_0_1px_0_rgba(255,210,140,0.12)]"
                      aria-hidden
                    >
                      <Icon />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-fg text-[17px] tracking-tight mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {heading}
                      </h3>
                      <p className="text-muted leading-relaxed text-sm">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border-subtle pt-6 reveal" style={{ transitionDelay: "760ms" }}>
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted mb-4">
                Currently serving
              </p>
              {/* Mini Route 9 inline road strip */}
              <div className="relative flex items-center gap-0 mb-3 overflow-hidden">
                {/* Road line */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px" style={{ background: "repeating-linear-gradient(90deg, rgba(212,104,42,0.3) 0px, rgba(212,104,42,0.3) 6px, transparent 6px, transparent 10px)" }} aria-hidden />
                {/* Traveling car dot — full-width wrapper animates transform
                    (compositor-only) instead of the old `left` keyframes */}
                <div
                  aria-hidden
                  className="absolute pointer-events-none"
                  style={{
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 0,
                    /* Resting state matches keyframe 0% — off-screen left + invisible.
                       Under reduced-motion the animation reverts here instead of
                       transform:none / opacity:1 (visible dot stuck at start of strip). */
                    opacity: 0,
                    transform: "translateX(0)",
                    animation: "who-car-travel-x 8s linear infinite",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-5px",
                      transform: "translateY(-50%)",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#D4682A",
                      boxShadow: "0 0 6px rgba(212,104,42,0.8)",
                    }}
                  />
                </div>
                <div className="relative flex items-center justify-between w-full py-3">
                  {WHO.towns.map((town, i) => (
                    <div key={town} className="flex flex-col items-center gap-1.5 group cursor-default">
                      <span
                        className="relative flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                        style={{
                          width: town === "Shrewsbury" ? "14px" : "10px",
                          height: town === "Shrewsbury" ? "14px" : "10px",
                          background: town === "Shrewsbury" ? "#D4682A" : "var(--surface-raised)",
                          border: town === "Shrewsbury" ? "2px solid rgba(212,104,42,0.4)" : "1.5px solid var(--border)",
                          boxShadow: town === "Shrewsbury" ? "0 0 8px rgba(212,104,42,0.5)" : "0 1px 3px rgba(0,0,0,0.12)",
                          zIndex: 1,
                        }}
                        aria-hidden
                      >
                        {town === "Shrewsbury" && (
                          <span
                            className="dot-ping absolute inset-0 rounded-full"
                            style={{ background: "rgba(212,104,42,0.45)" }}
                            aria-hidden
                          />
                        )}
                      </span>
                      <span
                        className="text-center leading-tight transition-colors duration-200 group-hover:text-accent whitespace-nowrap"
                        style={{
                          fontSize: "10px",
                          fontWeight: town === "Shrewsbury" ? 700 : 600,
                          color: town === "Shrewsbury" ? "var(--accent)" : "var(--muted)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {town}
                        {i < WHO.towns.length - 1 && ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted italic" style={{ fontFamily: "var(--font-display)" }}>
                + anywhere nearby along Route 9 — just ask.
              </p>
            </div>

            {/* By-the-numbers stats — count up on scroll entry */}
            <dl
              className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border-subtle reveal"
              style={{ transitionDelay: "860ms" }}
            >
              {[
                { to: 48, suffix: "hr", label: "Avg. launch" },
                { to: 5,  suffix: "+",  label: "Route 9 towns" },
                { to: 100, suffix: "%", label: "On-time" },
              ].map(({ to, suffix, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-3 rounded-xl border border-[rgba(212,104,42,0.1)] bg-[rgba(212,104,42,0.03)] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[rgba(212,104,42,0.06)] hover:border-[rgba(212,104,42,0.2)] hover:shadow-[0_1px_2px_rgba(28,18,9,0.04),0_6px_16px_rgba(28,18,9,0.05)]"
                >
                  <dt
                    className="font-extrabold leading-none mb-1"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "20px", color: "var(--accent)" }}
                  >
                    <CountUp to={to} suffix={suffix} duration={1100} delay={150} />
                  </dt>
                  <dd className="text-[10px] font-semibold uppercase text-muted" style={{ letterSpacing: "0.12em" }}>
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right: bento photo mosaic ── */}
          <div ref={rightRef} className="reveal" style={{ transitionDelay: "180ms" }}>
            {/* Neighborhood label */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-semibold tracking-[0.16em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                Route 9 shops, Shrewsbury &amp; beyond
              </span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,104,42,0.2), transparent)" }} />
            </div>

            <div
              className="grid grid-cols-3 gap-2.5"
              style={{
                gridTemplateRows: "repeat(3, 1fr)",
                height: "clamp(340px, 55vw, 520px)",
              }}
            >
              {MOSAIC.map(({ id, label }, i) => (
                <div
                  key={label}
                  className={`relative overflow-hidden rounded-2xl group cursor-default${
                    i === 0 ? " col-span-2 row-span-2 shine" : ""
                  }`}
                  onMouseMove={handleMosaicSpot}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${id}?w=${i === 0 ? 500 : 280}&auto=format&fit=crop&q=80`}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Cursor spotlight */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{
                      background: "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.18) 0%, transparent 55%)",
                    }}
                  />
                  {/* Label — slides up from below on hover */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="overflow-hidden px-2.5 pb-2.5">
                      <span className="block text-[10px] font-semibold text-white/95 uppercase tracking-[0.08em] leading-tight translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {label}
                      </span>
                    </div>
                  </div>
                  {/* Resting hairline + hover accent ring */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 group-hover:ring-[#D4682A]/35 rounded-2xl transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] z-20" />
                </div>
              ))}
            </div>

            {/* Vintage postage-stamp strip — replaces the emoji strip with
                hand-drawn line-art "stamps" per trade */}
            <VintageStamps />

            <p className="text-xs text-muted mt-2 text-center italic" style={{ fontFamily: "var(--font-display)" }}>
              Not on the list? Every independent shop is welcome.
            </p>
          </div>

        </div>

        {/* Welcome mat — hand-drawn doorstep rug with Route 9 motif,
            flanked by two landmark keepsake medallions on md+ */}
        <div className="flex justify-center mt-14 mb-6 reveal" style={{ transitionDelay: "200ms" }}>
          <LandmarkBadge
            src="https://images.unsplash.com/photo-1533757879476-8f4a3cb1ae4b?w=240&auto=format&fit=crop&q=80"
            alt="Lake Quinsigamond at golden hour"
            caption="Lake Quinsig"
            size={78}
            tilt={-4}
            delay={120}
            className="hidden md:inline-block self-center mr-12"
          />
          <svg
            viewBox="0 0 320 90"
            fill="none"
            aria-hidden
            style={{
              width: "min(320px, 72%)",
              opacity: 0.72,
              // Lay the mat back onto the ground plane — true perspective
              // trapezoid via CSS 3D (static; no animation).
              transform: "perspective(520px) rotateX(16deg)",
              transformOrigin: "50% 100%",
            }}
          >
            <defs>
              {/* Soft elliptical contact shadow pooling under the mat */}
              <radialGradient id="who-mat-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="rgba(90,40,12,0.28)" />
                <stop offset="65%" stopColor="rgba(90,40,12,0.12)" />
                <stop offset="100%" stopColor="rgba(90,40,12,0)" />
              </radialGradient>
              {/* Mat face form — light hits the far (top) edge, the near
                  edge rolls into gentle shade */}
              <linearGradient id="who-mat-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(255,246,228,0.3)" />
                <stop offset="30%"  stopColor="rgba(255,246,228,0)" />
                <stop offset="80%"  stopColor="rgba(140,58,16,0)" />
                <stop offset="100%" stopColor="rgba(140,58,16,0.12)" />
              </linearGradient>
            </defs>
            {/* Ground contact shadow — under the mat + fringe */}
            <ellipse cx="160" cy="83" rx="152" ry="6.5" fill="url(#who-mat-shadow)" />
            {/* Outer mat frame */}
            <rect x="6" y="10" width="308" height="70" rx="7" fill="rgba(212,104,42,0.06)" stroke="rgba(212,104,42,0.32)" strokeWidth="1.5" />
            {/* Bound-edge highlight — light catching the top of the binding */}
            <rect x="7.6" y="11.6" width="304.8" height="66.8" rx="6" fill="none" stroke="rgba(255,246,228,0.5)" strokeWidth="0.9" />
            {/* Bound-edge underside shade along the near (bottom) edge */}
            <path d="M 12 79.2 H 308" stroke="rgba(140,58,16,0.28)" strokeWidth="1.1" strokeLinecap="round" />
            {/* Inner border bevel */}
            <rect x="12" y="16" width="296" height="58" rx="5" fill="none" stroke="rgba(212,104,42,0.13)" strokeWidth="1" />
            {/* Bevel occlusion just inside the inner border */}
            <rect x="13.2" y="17.2" width="293.6" height="55.6" rx="4.5" fill="none" stroke="rgba(140,58,16,0.09)" strokeWidth="1" />
            {/* Horizontal ribs — woven fiber texture, each rib modeled as a
                lit crown (highlight above) over an occluded groove (shadow) */}
            {[24, 32, 40, 48, 56, 64, 72].map((y) => (
              <g key={y}>
                {/* rib crown highlight */}
                <line x1="14" y1={y - 2} x2="306" y2={y - 2} stroke="rgba(255,246,228,0.4)" strokeWidth="1" />
                {/* rib body */}
                <line x1="14" y1={y} x2="306" y2={y} stroke="rgba(212,104,42,0.09)" strokeWidth="2.5" />
                {/* groove shadow tucked under the rib */}
                <line x1="14" y1={y + 1.7} x2="306" y2={y + 1.7} stroke="rgba(140,58,16,0.1)" strokeWidth="1" />
              </g>
            ))}
            {/* Mat face form shading over the ribs */}
            <rect x="6" y="10" width="308" height="70" rx="7" fill="url(#who-mat-face)" />
            {/* Left fringe */}
            {[0,1,2,3,4,5,6,7].map((i) => (
              <line key={i} x1={14 + i * 7} y1="10" x2={14 + i * 7} y2="2" stroke="rgba(212,104,42,0.3)" strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {/* Right fringe */}
            {[0,1,2,3,4,5,6,7].map((i) => (
              <line key={i} x1={254 + i * 7} y1="10" x2={254 + i * 7} y2="2" stroke="rgba(212,104,42,0.3)" strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {/* Bottom fringe */}
            {[0,1,2,3,4,5,6,7].map((i) => (
              <line key={i} x1={14 + i * 7} y1="80" x2={14 + i * 7} y2="88" stroke="rgba(212,104,42,0.28)" strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {[0,1,2,3,4,5,6,7].map((i) => (
              <line key={i} x1={254 + i * 7} y1="80" x2={254 + i * 7} y2="88" stroke="rgba(212,104,42,0.28)" strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {/* Corner diamond accent — top-left */}
            <path d="M20 28 L26 34 L20 40 L14 34 Z" fill="rgba(212,104,42,0.14)" stroke="rgba(212,104,42,0.35)" strokeWidth="0.8" />
            {/* Corner diamond accent — top-right */}
            <path d="M300 28 L306 34 L300 40 L294 34 Z" fill="rgba(212,104,42,0.14)" stroke="rgba(212,104,42,0.35)" strokeWidth="0.8" />
            {/* WELCOME text */}
            <text x="160" y="50" textAnchor="middle" fontSize="20" fill="rgba(212,104,42,0.7)"
              fontFamily="Georgia, serif" fontWeight="700" letterSpacing="0.32em">
              WELCOME
            </text>
            {/* Route 9 shield below text */}
            <g transform="translate(160 62)">
              <path d="M0 -6 L8 -3 L8 2 Q8 7 0 10 Q-8 7 -8 2 L-8 -3 Z"
                fill="rgba(212,104,42,0.1)" stroke="rgba(212,104,42,0.5)" strokeWidth="0.9" />
              <text x="0" y="4" textAnchor="middle" fontSize="6" fill="rgba(212,104,42,0.75)"
                fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700">9</text>
            </g>
          </svg>
          <LandmarkBadge
            src="https://images.unsplash.com/photo-1509290228487-f5ed6f220494?w=240&auto=format&fit=crop&q=80"
            alt="White-steeple church on a New England town common"
            caption="The Common"
            size={78}
            tilt={3}
            delay={220}
            className="hidden md:inline-block self-center ml-12"
          />
        </div>

        {/* Hand-drawn aerial map of the Route 9 corridor — sits below
            the two-column grid so it spans the section's full width */}
        <div className="mt-4 reveal">
          <ShrewsburyMap />
        </div>
      </div>
    </section>
  );
}
