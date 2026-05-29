"use client";

import { useRef, useEffect } from "react";

// ── Neighborhood cork bulletin board ─────────────────────────────────────────
//
// Six paper notes pinned to a cork board (hand-drawn cork texture via SVG noise
// + fiber lines). Placed between About and Contact as an alternate testimonial
// display with local flavor.
//
// Layout:
//   - 3-column grid on desktop, 2 on tablet, 1 on mobile
//   - Each note: outer div receives cork-note-drop animation; inner div holds
//     static rotation. Two-div wrapper prevents animation overriding rotation.
//   - Pushpin SVG (no external assets, no conflicting defs IDs)
//   - Cork texture: SVG noise + fiber gradient layers over #C2844A base
//   - Wooden frame: layered box-shadow (10px brown → 14px dark frame edge)
//   - Tear-off dashed CTA strip at board bottom
//
// Static data only — no Math.random() — prevents SSR hydration mismatch.

type NoteBase = { id: string; bg: string; rotation: number; delay: string; pin: string };
type StickyNote   = NoteBase & { kind: "sticky";    title: string; body: string[] };
type QuoteNote    = NoteBase & { kind: "quote";      quote: string; attr: string };
type CheckNote    = NoteBase & { kind: "checklist";  title: string; checklist: string[] };
type CtaNote      = NoteBase & { kind: "cta";        title: string; body: string[]; cta: string };
type Note = StickyNote | QuoteNote | CheckNote | CtaNote;

const NOTES: Note[] = [
  {
    id: "n1", bg: "#FEF08A", rotation: -3.2, delay: "0s",    pin: "#DC2626",
    kind: "sticky",
    title: "FREE PREVIEW",
    body: ["No credit card.", "No contracts. Ever.", "See your site before\nyou spend a cent."],
  },
  {
    id: "n2", bg: "#FFFDF0", rotation:  1.8, delay: "0.09s", pin: "#16A34A",
    kind: "quote",
    quote: "“Our site went live in two days. The phone rang before the weekend was over.”",
    attr: "— Maria’s Route 9 Café",
  },
  {
    id: "n3", bg: "#F0FDF4", rotation: -0.8, delay: "0.18s", pin: "#2563EB",
    kind: "checklist",
    title: "WHAT YOU GET:",
    checklist: ["Site live in 48 hrs", "Mobile-first design", "Care plan from $79/mo", "You own everything"],
  },
  {
    id: "n4", bg: "#FEF3C7", rotation:  2.4, delay: "0.27s", pin: "#D97706",
    kind: "sticky",
    title: "ROUTE 9 WEB CO.",
    body: ["Shrewsbury, MA", "Websites for the shops\nthat make this town great."],
  },
  {
    id: "n5", bg: "#FFF1F2", rotation: -2.1, delay: "0.36s", pin: "#7C3AED",
    kind: "quote",
    quote: "“I update my own specials now. Never thought I’d say that about a website.”",
    attr: "— Pete, Route 9 Hardware",
  },
  {
    id: "n6", bg: "#F0F9FF", rotation:  1.1, delay: "0.45s", pin: "#DC2626",
    kind: "cta",
    title: "GOT A QUESTION?",
    body: ["Fill out the form below\nand we’ll reply within\none business day."],
    cta: "↓ Let’s Talk",
  },
];

// ── Pushpin SVG — no <defs> to avoid conflicting IDs when rendered multiple times
function Pushpin({ color }: { color: string }) {
  return (
    <svg
      width="20" height="26" viewBox="0 0 20 26" fill="none" aria-hidden
      style={{
        position: "absolute", top: "-11px", left: "50%",
        transform: "translateX(-50%)", zIndex: 10,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.40))",
      }}
    >
      {/* Shaft */}
      <line x1="10" y1="12" x2="10" y2="26" stroke="rgba(50,30,10,0.55)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pin head */}
      <circle cx="10" cy="8.5" r="8.5" fill={color} />
      {/* Edge shadow */}
      <circle cx="10" cy="8.5" r="8.5" fill="rgba(0,0,0,0.14)" />
      {/* Gloss highlight */}
      <ellipse cx="7.5" cy="5.5" rx="2.8" ry="1.8" fill="rgba(255,255,255,0.30)" />
      {/* Specular */}
      <circle cx="7" cy="4.8" r="1.0" fill="rgba(255,255,255,0.52)" />
    </svg>
  );
}

// ── Individual note card — manages its own scroll-reveal observer
function NoteCard({ note }: { note: Note }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const linedBg =
    note.kind === "quote"
      ? { backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.07) 23px, rgba(0,0,0,0.07) 24px)" }
      : {};

  return (
    <div
      ref={ref}
      className="cork-note"
      style={{ animationDelay: note.delay }}
    >
      {/* Inner div holds rotation — isolated from the drop animation on the outer div */}
      <div style={{ transform: `rotate(${note.rotation}deg)` }}>
        <div
          style={{
            position: "relative",
            background: note.bg,
            borderRadius: "2px",
            padding: "20px 16px 18px",
            boxShadow: [
              "0 4px 14px rgba(0,0,0,0.28)",
              "0 1px 3px rgba(0,0,0,0.18)",
              "inset 0 1px 0 rgba(255,255,255,0.80)",
            ].join(", "),
            minHeight: "128px",
            ...linedBg,
          }}
        >
          <Pushpin color={note.pin} />

          {/* ── Sticky ── */}
          {note.kind === "sticky" && (
            <>
              <p style={{
                fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.20em",
                color: "rgba(0,0,0,0.36)", textTransform: "uppercase", marginBottom: "9px",
              }}>
                {note.title}
              </p>
              {note.body.map((line, i) => (
                <p key={i} style={{
                  fontSize: "13px", lineHeight: 1.55, color: "rgba(0,0,0,0.72)",
                  fontFamily: "'Georgia', serif", whiteSpace: "pre-line", marginBottom: "4px",
                }}>
                  {line}
                </p>
              ))}
            </>
          )}

          {/* ── Quote ── */}
          {note.kind === "quote" && (
            <div style={{ paddingTop: "4px" }}>
              <div style={{ marginBottom: "7px" }}>
                {[0,1,2,3,4].map(i => (
                  <span key={i} style={{ color: "#D97706", fontSize: "12px", marginRight: "1px" }}>★</span>
                ))}
              </div>
              <p style={{
                fontSize: "12.5px", lineHeight: 1.6, color: "rgba(0,0,0,0.70)",
                fontFamily: "'Georgia', serif", fontStyle: "italic", marginBottom: "10px",
              }}>
                {note.quote}
              </p>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.44)", letterSpacing: "0.04em" }}>
                {note.attr}
              </p>
            </div>
          )}

          {/* ── Checklist ── */}
          {note.kind === "checklist" && (
            <>
              <p style={{
                fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.20em",
                color: "rgba(0,0,0,0.36)", textTransform: "uppercase", marginBottom: "10px",
              }}>
                {note.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {note.checklist.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "7px", marginBottom: "7px", alignItems: "flex-start" }}>
                    <span style={{ color: "#16A34A", fontWeight: 800, fontSize: "13px", flexShrink: 0, lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.70)", lineHeight: 1.4 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* ── CTA ── */}
          {note.kind === "cta" && (
            <>
              <p style={{
                fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.20em",
                color: "rgba(0,0,0,0.36)", textTransform: "uppercase", marginBottom: "9px",
              }}>
                {note.title}
              </p>
              {note.body.map((line, i) => (
                <p key={i} style={{
                  fontSize: "12.5px", lineHeight: 1.55, color: "rgba(0,0,0,0.70)",
                  fontFamily: "'Georgia', serif", whiteSpace: "pre-line", marginBottom: "2px",
                }}>
                  {line}
                </p>
              ))}
              <p style={{ marginTop: "12px", fontSize: "14px", fontWeight: 800, color: "#D4682A", letterSpacing: "0.04em" }}>
                {note.cta}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cork board section ────────────────────────────────────────────────────────
export function CorkBoard() {
  return (
    <section
      style={{ background: "var(--section-warm-a)", padding: "80px 0 96px" }}
      aria-label="Community feedback — what local businesses are saying"
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Label */}
        <div className="flex justify-center mb-4">
          <span className="label-pill">Community Board</span>
        </div>

        {/* Heading */}
        <h2
          className="text-center reveal"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(26px, 3.8vw, 38px)",
            fontWeight: 700,
            color: "var(--fg)",
            marginBottom: "44px",
            lineHeight: 1.25,
          }}
        >
          What locals are saying
        </h2>

        {/* ── Cork board ── */}
        <div
          role="presentation"
          style={{
            position: "relative",
            borderRadius: "5px",
            background: "#C2844A",
            padding: "44px 30px 34px",
            boxShadow: [
              "0 0 0 10px #8B5430",       /* wood frame face  */
              "0 0 0 14px #5E3410",       /* frame edge / lip */
              "0 20px 60px rgba(0,0,0,0.55)",
              "0 6px 20px rgba(0,0,0,0.32)",
              "inset 0 2px 8px rgba(0,0,0,0.22)",
            ].join(", "),
          }}
        >
          {/* ── Cork texture layer 1: SVG fractal noise ── */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cn)'/%3E%3C/svg%3E")`,
              backgroundSize: "160px 160px",
              opacity: 0.26,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />

          {/* ── Cork texture layer 2: horizontal fiber lines ── */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              backgroundImage: [
                "repeating-linear-gradient(89deg, rgba(110,55,6,0.15) 0px, rgba(110,55,6,0.15) 1px, transparent 1px, transparent 9px)",
                "repeating-linear-gradient(91deg, rgba(90,44,4,0.09) 0px, rgba(90,44,4,0.09) 1px, transparent 1px, transparent 13px)",
              ].join(", "),
              pointerEvents: "none",
            }}
          />

          {/* ── Notes grid ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ position: "relative", zIndex: 1 }}
          >
            {NOTES.map(note => <NoteCard key={note.id} note={note} />)}
          </div>

          {/* ── Tear-off CTA strip ── */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "16px",
              borderTop: "2px dashed rgba(255,255,255,0.32)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span aria-hidden style={{ fontSize: "13px", opacity: 0.55, display: "inline-block", transform: "scaleX(-1)" }}>✂</span>
            <p style={{
              fontSize: "10.5px",
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.60)",
              margin: 0,
            }}>
              TEAR OFF — FREE DESIGN PREVIEW — NO COMMITMENT
            </p>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.30)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.10em",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.24)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.50)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
              }}
            >
              Claim →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
