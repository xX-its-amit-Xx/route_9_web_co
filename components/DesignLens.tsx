"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { useLenis } from "./SmoothScrollProvider";
import { DESIGN_LENS } from "@/lib/content";

type View = "intro" | "outro" | number | null;

type PinPos = { left: number; top: number; visible: boolean };

const NOTES = DESIGN_LENS.notes;

const META_BADGES: Record<number, { label: string; hint: string }> = {
  1: { label: "META", hint: "the site is the demo" },
  2: { label: "META²", hint: "the trick, explained mid-trick" },
  3: { label: "META³", hint: "the confession" },
};

export function DesignLens() {
  const lenis = useLenis();
  const [on, setOn] = useState(false);
  const [view, setView] = useState<View>("intro");
  const [pins, setPins] = useState<PinPos[]>([]);
  const rafRef = useRef<number>(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Blueprint class on <html> + continuous pin tracking while the lens is on.
  // A per-frame loop (12 getBoundingClientRect calls) keeps pins glued to
  // their sections through Lenis smooth-scroll without listener juggling.
  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("lens-on");

    const track = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPins(
        NOTES.map((note) => {
          const el = document.getElementById(note.target);
          if (!el) return { left: 0, top: 0, visible: false };
          const r = el.getBoundingClientRect();
          const visible = r.bottom > 130 && r.top < vh - 130;
          const left = Math.min(Math.max(r.right - 52, 16), vw - 52);
          const top = Math.min(Math.max(r.top + 22, 88), vh - 150);
          return { left, top, visible };
        })
      );
      rafRef.current = requestAnimationFrame(track);
    };
    rafRef.current = requestAnimationFrame(track);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOn(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.classList.remove("lens-on");
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [on]);

  const scrollToNote = useCallback(
    (idx: number) => {
      const el = document.getElementById(NOTES[idx].target);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -84, duration: 1.2 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis]
  );

  const goto = (idx: number) => {
    setView(idx);
    scrollToNote(idx);
  };

  const next = () => {
    if (view === "intro") goto(0);
    else if (typeof view === "number") {
      if (view >= NOTES.length - 1) setView("outro");
      else goto(view + 1);
    }
  };

  const prev = () => {
    if (view === "outro") goto(NOTES.length - 1);
    else if (typeof view === "number") {
      if (view === 0) setView("intro");
      else goto(view - 1);
    }
  };

  const toggle = () => {
    setOn((v) => {
      if (!v) setView("intro");
      return !v;
    });
  };

  const note = typeof view === "number" ? NOTES[view] : null;
  const badge = note ? META_BADGES[note.meta] : null;

  return (
    <>
      {/* ── Toggle — small pill centered at the bottom edge.
             Bottom-left belongs to the AI chat button, bottom-right to the
             floating CTA; bottom-center is clear of content and doesn't
             obstruct reading like the old side tab did. ── */}
      <button
        ref={toggleRef}
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn off the Design Lens" : "Turn on the Design Lens — see the design decisions behind this page"}
        className="fixed z-[75] inline-flex items-center gap-2 font-bold rounded-full"
        style={{
          left: "50%",
          bottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          padding: "8px 14px",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: on ? "#1C1209" : "rgba(243,233,213,0.82)",
          background: on
            ? "linear-gradient(145deg, #F0A060 0%, #D4682A 55%, #B05020 100%)"
            : "linear-gradient(145deg, rgba(36,24,16,0.9), rgba(20,12,6,0.88))",
          border: on ? "1px solid rgba(255,210,150,0.5)" : "1px solid rgba(212,104,42,0.35)",
          boxShadow: on
            ? "0 0 0 1px rgba(212,104,42,0.3), 0 4px 18px rgba(212,104,42,0.4), 0 1px 0 rgba(255,230,180,0.3) inset"
            : "0 4px 14px rgba(0,0,0,0.3), 0 1px 0 rgba(255,200,120,0.06) inset",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transition: "background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(-50%) translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(-50%)"; }}
      >
        <Search size={11} strokeWidth={2.5} aria-hidden />
        {DESIGN_LENS.toggleLabel}
        {!on && (
          <span
            aria-hidden
            className="flex items-center justify-center rounded-full font-extrabold"
            style={{
              width: "15px",
              height: "15px",
              fontSize: "8px",
              letterSpacing: "0",
              background: "#D4682A",
              color: "#110B07",
              boxShadow: "0 0 8px rgba(212,104,42,0.6)",
            }}
          >
            {NOTES.length}
          </span>
        )}
      </button>

      {on && (
        <>
          {/* ── Blueprint grid overlay ── */}
          <div
            aria-hidden
            className="fixed inset-0 z-[45] pointer-events-none lens-grid-fade"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,104,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,104,42,0.05) 1px, transparent 1px), linear-gradient(rgba(212,104,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(212,104,42,0.10) 1px, transparent 1px)",
              backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px",
              boxShadow: "inset 0 0 140px rgba(212,104,42,0.07)",
            }}
          />

          {/* ── Numbered pins ── */}
          {pins.map((p, i) =>
            p.visible ? (
              <button
                key={NOTES[i].target}
                onClick={() => setView(i)}
                aria-label={`Design note ${i + 1}: ${NOTES[i].title}`}
                className="fixed z-[55] w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold lens-pin-pop"
                style={{
                  left: p.left,
                  top: p.top,
                  color: "#110B07",
                  fontFamily: "var(--font-display)",
                  background:
                    view === i
                      ? "linear-gradient(145deg, #FFD9A0 0%, #F0A060 50%, #D4682A 100%)"
                      : "linear-gradient(145deg, #F0A060 0%, #D4682A 55%, #A84818 100%)",
                  border: "1.5px solid rgba(255,220,160,0.55)",
                  boxShadow:
                    view === i
                      ? "0 0 0 3px rgba(212,104,42,0.35), 0 4px 18px rgba(212,104,42,0.7), 0 1px 0 rgba(255,235,200,0.5) inset"
                      : "0 4px 14px rgba(0,0,0,0.5), 0 0 14px rgba(212,104,42,0.4), 0 1px 0 rgba(255,235,200,0.4) inset",
                  transition: "box-shadow 0.2s ease, background 0.2s ease",
                }}
              >
                {i + 1}
              </button>
            ) : null
          )}

          {/* ── Note card ── */}
          {view !== null && (
            <div
              role="dialog"
              aria-label="Design Lens note"
              className="fixed z-[75] lens-card-in"
              style={{
                left: "18px",
                right: "18px",
                bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
                maxWidth: "400px",
                marginInline: "auto",
                borderRadius: "16px",
                background: "linear-gradient(180deg, #FEFBF5 0%, #F5EDE0 100%)",
                border: "1px solid rgba(212,104,42,0.35)",
                boxShadow:
                  "0 0 0 1px rgba(28,18,9,0.06), 0 24px 64px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.9) inset",
                padding: "18px 18px 14px",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setView(null)}
                aria-label="Close note (lens stays on)"
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ color: "#7A6B5C", background: "rgba(28,18,9,0.05)" }}
              >
                <X size={13} strokeWidth={2.5} aria-hidden />
              </button>

              {view === "intro" && (
                <>
                  <p className="text-[10px] font-extrabold tracking-[0.2em] mb-2" style={{ color: "#A84818" }}>
                    THE HIDDEN CURRICULUM
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#1C1209" }}>
                    {DESIGN_LENS.intro}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goto(0)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#FEFBF5]"
                      style={{
                        background: "linear-gradient(145deg, #C05A20 0%, #A84818 60%, #8E3A0E 100%)",
                        boxShadow: "0 3px 12px rgba(168,72,24,0.4)",
                      }}
                    >
                      Start the tour
                    </button>
                    <button
                      onClick={() => setView(null)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                      style={{ color: "#1C1209", background: "rgba(28,18,9,0.06)", border: "1px solid rgba(28,18,9,0.12)" }}
                    >
                      Just browse the pins
                    </button>
                  </div>
                </>
              )}

              {view === "outro" && (
                <>
                  <p className="text-[10px] font-extrabold tracking-[0.2em] mb-2" style={{ color: "#A84818" }}>
                    META³ · THE CONFESSION
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#1C1209" }}>
                    {DESIGN_LENS.outro}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold"
                      style={{ color: "#1C1209", background: "rgba(28,18,9,0.06)", border: "1px solid rgba(28,18,9,0.12)" }}
                    >
                      <ArrowLeft size={12} aria-hidden /> Back
                    </button>
                    <a
                      href="#contact"
                      onClick={() => {
                        setOn(false);
                        window.dispatchEvent(
                          new CustomEvent("r9:contact-prefill", {
                            detail: { message: "Hi! I went through the whole Design Lens tour. Let's talk about my shop's site." },
                          })
                        );
                      }}
                      className="flex-1 inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-[#FEFBF5]"
                      style={{
                        background: "linear-gradient(145deg, #C05A20 0%, #A84818 60%, #8E3A0E 100%)",
                        boxShadow: "0 3px 12px rgba(168,72,24,0.4)",
                      }}
                    >
                      Put these tricks to work for my shop
                    </a>
                  </div>
                </>
              )}

              {note && badge && (
                <>
                  <div className="flex items-center gap-2 mb-2 pr-8">
                    <span
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(168,72,24,0.1)", color: "#A84818", border: "1px solid rgba(168,72,24,0.25)" }}
                      title={badge.hint}
                    >
                      {badge.label} · {badge.hint}
                    </span>
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: "#1C1209", fontFamily: "var(--font-display)" }}>
                    {(view as number) + 1}. {note.title}
                  </p>
                  <p className="text-[13px] leading-relaxed mb-3.5" style={{ color: "#5A4B3C" }}>
                    {note.body}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prev}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold"
                      style={{ color: "#1C1209", background: "rgba(28,18,9,0.06)", border: "1px solid rgba(28,18,9,0.12)" }}
                    >
                      <ArrowLeft size={11} aria-hidden /> Prev
                    </button>
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: "#B0A090" }}>
                      {(view as number) + 1} / {NOTES.length}
                    </span>
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold text-[#FEFBF5]"
                      style={{
                        background: "linear-gradient(145deg, #C05A20 0%, #A84818 60%, #8E3A0E 100%)",
                        boxShadow: "0 2px 8px rgba(168,72,24,0.35)",
                      }}
                    >
                      {(view as number) >= NOTES.length - 1 ? "The confession" : "Next"} <ArrowRight size={11} aria-hidden />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
