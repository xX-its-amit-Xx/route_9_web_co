"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Mail, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { TextScramble } from "./TextScramble";
import { Postcard } from "./Postcard";
import { RotaryPhone } from "./RotaryPhone";
import { ServiceBell } from "./ServiceBell";
import { VintageReceipt } from "./VintageReceipt";
import { SITE } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

const MSG_PLACEHOLDERS = [
  "Tell me about your business and what you're looking for...",
  "Can you build a site for my bakery on Route 9?",
  "What's the turnaround time for a new website?",
  "Do you work with restaurants and cafes?",
  "How much does monthly maintenance cost?",
  "I need to get online before the holiday season...",
];

export function Contact() {
  const headingRef = useScrollReveal();
  const formRef = useScrollReveal();

  const [fields, setFields] = useState({ name: "", shop: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [msgPlaceholder, setMsgPlaceholder] = useState(MSG_PLACEHOLDERS[0]);

  // Typewriter cycling placeholder for the message textarea
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let phraseIdx = 0;
    let charIdx = MSG_PLACEHOLDERS[0].length;
    let erasing = true;
    let timerId: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (erasing) {
        charIdx--;
        setMsgPlaceholder(MSG_PLACEHOLDERS[phraseIdx].slice(0, charIdx));
        if (charIdx <= 0) {
          erasing = false;
          phraseIdx = (phraseIdx + 1) % MSG_PLACEHOLDERS.length;
          timerId = setTimeout(tick, 480);
        } else {
          timerId = setTimeout(tick, 20);
        }
      } else {
        charIdx++;
        setMsgPlaceholder(MSG_PLACEHOLDERS[phraseIdx].slice(0, charIdx));
        if (charIdx >= MSG_PLACEHOLDERS[phraseIdx].length) {
          erasing = true;
          timerId = setTimeout(tick, 2400);
        } else {
          timerId = setTimeout(tick, 36);
        }
      }
    };
    timerId = setTimeout(tick, 3200);
    return () => clearTimeout(timerId);
  }, []);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to success heading when form submits successfully so keyboard
  // and screen-reader users don't lose their position when the form unmounts.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // Pre-fill the message field when a Pricing CTA (tier or founding offer)
  // is clicked, so the user lands here with context already filled in. Only
  // seeds an empty message — never overwrites what the user has typed.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (!message) return;
      setFields((prev) =>
        prev.message.trim() ? prev : { ...prev, message }
      );
    };
    window.addEventListener("r9:contact-prefill", onPrefill);
    return () => window.removeEventListener("r9:contact-prefill", onPrefill);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try emailing us directly.");
        return;
      }

      setStatus("success");
      setFields({ name: "", shop: "", email: "", message: "", website: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  const inputClass =
    "contact-field w-full h-11 px-4 rounded-xl border border-border bg-surface-raised text-fg text-sm placeholder:text-muted shadow-[0_1px_2px_rgba(28,18,9,0.04)] focus:outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <section
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="contact-heading"
    >
      {/* Lake Quinsigamond water ripple watermark */}
      <svg
        viewBox="0 0 500 340"
        fill="none"
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none"
        style={{ width: "min(460px, 52vw)", opacity: 0.035, transform: "translate(-14%, 22%)" }}
      >
        {/* lake-ripple-ellipses: SMIL <animate> bypasses CSS animation-duration,
            so this group is hidden via CSS under prefers-reduced-motion */}
        <g className="lake-ripple-ellipses">
          {[12, 34, 62, 96, 138, 188, 246, 312].map((r, i) => {
            const baseOpacity = Math.max(0, 1 - i * 0.1);
            const lowOpacity  = Math.max(0, baseOpacity * 0.35);
            return (
              <ellipse key={i} cx="250" cy="170" rx={r * 1.85} ry={r * 0.8}
                stroke="#D4682A" strokeWidth={i === 0 ? "2" : "1"}
                strokeOpacity={baseOpacity}
              >
                <animate
                  attributeName="stroke-opacity"
                  values={`${baseOpacity};${lowOpacity};${baseOpacity}`}
                  dur={`${2.8 + i * 0.28}s`}
                  begin={`${i * 0.22}s`}
                  repeatCount="indefinite"
                />
              </ellipse>
            );
          })}
        </g>
        <text x="250" y="175" textAnchor="middle" fontSize="10" fill="#D4682A"
          fontFamily="monospace" letterSpacing="0.14em" fontWeight="700">
          LAKE QUINSIGAMOND
        </text>
        <text x="250" y="190" textAnchor="middle" fontSize="7" fill="#D4682A"
          fontFamily="monospace" letterSpacing="0.1em" opacity="0.55">
          ROUTE 9 · SHREWSBURY MA
        </text>
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Postcard — click to flip between front art and message side */}
        <div className="flex justify-center mb-14 reveal">
          <Postcard />
        </div>

        {/* Invisible scroll target — "Get in touch" / "Let's talk" links land here */}
        <div id="contact" style={{ scrollMarginTop: "96px" }} />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={headingRef} className="relative">
            <div className="label-pill mb-4 reveal">Contact</div>
            <TextScramble
              as="h2"
              id="contact-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
              speed={3}
            >
              {"Let's talk about your shop."}
            </TextScramble>
            <p className="text-muted leading-relaxed mb-5 reveal" style={{ transitionDelay: "160ms" }}>
              Fill out the form and I&apos;ll reply within a few hours. Or text — fastest
              way to reach me, and I actually respond.
            </p>

            {/* Local trust badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-7 reveal"
              style={{
                background: "rgba(212,104,42,0.06)",
                border: "1px solid rgba(212,104,42,0.18)",
                transitionDelay: "240ms",
              }}
            >
              <svg viewBox="0 0 18 18" fill="none" className="w-3.5 h-3.5 flex-shrink-0 text-[#D4682A]" aria-hidden>
                <path d="M9 1.5C6.5 1.5 4.5 3.5 4.5 6c0 3.5 4.5 10.5 4.5 10.5s4.5-7 4.5-10.5c0-2.5-2-4.5-4.5-4.5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="9" cy="6" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-xs font-semibold text-accent">Shrewsbury, MA</span>
              <span className="text-accent/30">·</span>
              <span className="text-xs text-muted">Replies in ≤ 2 hrs</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" style={{ boxShadow: "0 0 6px rgba(212,104,42,0.4)" }} aria-hidden />
                <span className="text-xs text-muted">Usually less</span>
              </span>
            </div>

            <div className="space-y-4 reveal" style={{ transitionDelay: "320ms" }}>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 group">
                <div aria-hidden className="flex items-center justify-center w-11 h-11 rounded-xl border border-[rgba(212,104,42,0.14)] bg-[rgba(212,104,42,0.08)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(212,104,42,0.25)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted mb-0.5">Email</p>
                  <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-200">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {(SITE.phone as string) !== "PLACEHOLDER_PHONE" && (
                <>
                  {/* Vintage rotary phone — replaces the small "Call" link */}
                  <div className="mt-2 mb-2">
                    <RotaryPhone
                      phone={SITE.phone}
                      href={`tel:+1${SITE.phone.replace(/\D/g, "")}`}
                    />
                  </div>
                  <a href={`sms:+1${SITE.phone.replace(/\D/g, "")}`} className="flex items-center gap-3 group">
                    <div aria-hidden className="flex items-center justify-center w-11 h-11 rounded-xl border border-[rgba(212,104,42,0.14)] bg-[rgba(212,104,42,0.08)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(212,104,42,0.25)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-muted mb-0.5">Text (fastest)</p>
                      <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-200">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>

                  {/* Vintage service bell — click to "ring" + seeds the form */}
                  <div className="mt-4">
                    <ServiceBell />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className="reveal">
            {status === "success" ? (
              <div>
                {/* Visually-hidden focusable heading so screen-reader users
                    land on a real heading and hear the success state. The
                    receipt itself is the visual treatment. */}
                <h3
                  ref={successRef}
                  tabIndex={-1}
                  className="sr-only"
                  style={{ outline: "none" }}
                >
                  Message sent — thanks for reaching out. We&apos;ll reply within a few hours.
                </h3>
                <VintageReceipt onReset={() => setStatus("idle")} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-busy={status === "loading"} className="space-y-4">
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={fields.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-1.5">
                      Your name <span className="text-accent">*</span>
                    </label>
                    <input id="name" name="name" type="text" required autoComplete="name"
                      maxLength={120}
                      placeholder="Jane Smith" value={fields.name} onChange={handleChange}
                      disabled={status === "loading"}
                      className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="shop" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-1.5">
                      Shop name
                    </label>
                    <input id="shop" name="shop" type="text" autoComplete="organization"
                      maxLength={200}
                      placeholder="Smith's Pizzeria" value={fields.shop} onChange={handleChange}
                      disabled={status === "loading"}
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-1.5">
                    Email address <span className="text-accent">*</span>
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email"
                    maxLength={254}
                    placeholder="jane@smithspizzeria.com" value={fields.email} onChange={handleChange}
                    disabled={status === "loading"}
                    className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-1.5">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={5}
                    maxLength={5000}
                    placeholder={msgPlaceholder}
                    value={fields.message} onChange={handleChange}
                    disabled={status === "loading"}
                    className={`${inputClass} h-auto py-3 resize-none`} />
                </div>

                <div aria-live="polite" aria-atomic="true">
                  {status === "error" && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[rgba(212,104,42,0.08)] border border-[rgba(212,104,42,0.25)]">
                      <AlertCircle size={16} aria-hidden className="text-[#D4682A] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-fg">{errorMsg}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="nav-cta-shimmer flex items-center justify-center gap-2 w-full h-12 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-[#1C1209] text-sm font-bold transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_0_1px_rgba(212,104,42,0.4),0_4px_14px_rgba(212,104,42,0.32),inset_0_1px_0_rgba(255,220,160,0.2),inset_0_-1px_0_rgba(0,0,0,0.15)] hover:shadow-[0_0_0_1px_rgba(212,104,42,0.45),0_10px_28px_rgba(212,104,42,0.38),inset_0_1px_0_rgba(255,220,160,0.25),inset_0_-1px_0_rgba(0,0,0,0.15)]"
                  style={{
                    background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                  }}
                >
                  {status === "loading" ? (
                    <><Loader2 size={14} aria-hidden className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={14} strokeWidth={2.5} aria-hidden /> Send message</>
                  )}
                </button>

                <p className="text-xs text-center text-muted">
                  Prefer to just text?{" "}
                  {(SITE.phone as string) !== "PLACEHOLDER_PHONE" ? (
                    <a href={`sms:+1${SITE.phone.replace(/\D/g, "")}`} className="underline-grow text-accent font-medium">{SITE.phone}</a>
                  ) : (
                    <a href={`mailto:${SITE.email}`} className="underline-grow text-accent font-medium">{SITE.email}</a>
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
