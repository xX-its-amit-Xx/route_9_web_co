"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Mail, Phone, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SITE } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const headingRef = useScrollReveal();
  const formRef = useScrollReveal();

  const [fields, setFields] = useState({ name: "", shop: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to success heading when form submits successfully so keyboard
  // and screen-reader users don't lose their position when the form unmounts.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

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
    "contact-field w-full h-11 px-4 rounded-xl border border-border bg-surface-raised text-fg text-sm placeholder:text-muted focus:outline-none transition-all duration-200";

  return (
    <section
      id="contact"
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
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={headingRef} className="relative">
            <div className="label-pill mb-4 reveal">Contact</div>
            <h2
              id="contact-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-4 reveal"
              style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}
            >
              Let&apos;s talk about<br />your shop.
            </h2>
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
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A] animate-pulse" aria-hidden />
                <span className="text-xs text-muted">Usually less</span>
              </span>
            </div>

            <div className="space-y-4 reveal" style={{ transitionDelay: "320ms" }}>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 group">
                <div aria-hidden className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Email</p>
                  <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-150">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {(SITE.phone as string) !== "PLACEHOLDER_PHONE" && (
                <>
                  <a href={`tel:+1${SITE.phone.replace(/\D/g, "")}`} className="flex items-center gap-3 group">
                    <div aria-hidden className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                      <Phone size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-0.5">Call</p>
                      <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-150">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>
                  <a href={`sms:+1${SITE.phone.replace(/\D/g, "")}`} className="flex items-center gap-3 group">
                    <div aria-hidden className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-0.5">Text (fastest)</p>
                      <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-150">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className="reveal">
            {status === "success" ? (
              <div role="status" className="flex flex-col items-center justify-center text-center py-16 px-8 card-light rounded-2xl">
                <div className="w-16 h-16 flex items-center justify-center mb-4 relative">
                  {/* Sparkle burst particles */}
                  {[
                    { tx: "0px",    ty: "-32px", delay: "0.9s",  color: "#D4682A" },
                    { tx: "23px",   ty: "-23px", delay: "0.97s", color: "rgba(255,190,60,0.9)" },
                    { tx: "32px",   ty: "0px",   delay: "0.93s", color: "#D4682A" },
                    { tx: "23px",   ty: "23px",  delay: "1.0s",  color: "rgba(255,190,60,0.9)" },
                    { tx: "0px",    ty: "32px",  delay: "0.87s", color: "#D4682A" },
                    { tx: "-23px",  ty: "23px",  delay: "0.95s", color: "rgba(255,190,60,0.9)" },
                    { tx: "-32px",  ty: "0px",   delay: "0.91s", color: "#D4682A" },
                    { tx: "-23px",  ty: "-23px", delay: "1.02s", color: "rgba(255,190,60,0.9)" },
                  ].map(({ tx, ty, delay, color }, i) => (
                    <span
                      key={i}
                      aria-hidden
                      style={{
                        position: "absolute",
                        width: i % 2 === 0 ? "5px" : "4px",
                        height: i % 2 === 0 ? "5px" : "4px",
                        borderRadius: "50%",
                        background: color,
                        top: "50%",
                        left: "50%",
                        marginTop: "-2.5px",
                        marginLeft: "-2.5px",
                        "--tx": tx,
                        "--ty": ty,
                        animation: `sparkle-burst 0.65s ease-out ${delay} forwards`,
                        opacity: 0,
                      } as React.CSSProperties}
                    />
                  ))}
                  <svg viewBox="0 0 48 48" fill="none" width="64" height="64" aria-hidden>
                    {/* Background circle fill */}
                    <circle cx="24" cy="24" r="22" fill="rgba(212,104,42,0.08)" />
                    {/* Animated draw-on ring */}
                    <circle
                      cx="24" cy="24" r="22"
                      stroke="#D4682A"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeDasharray="138"
                      strokeDashoffset="138"
                      style={{ animation: "draw-circle 0.55s ease-out 0.05s forwards", transformOrigin: "24px 24px", transform: "rotate(-90deg)" }}
                    />
                    {/* Animated draw-on checkmark */}
                    <path
                      d="M14 24L21 31L34 17"
                      stroke="#D4682A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="30"
                      strokeDashoffset="30"
                      style={{ animation: "draw-check 0.42s ease-out 0.58s forwards" }}
                    />
                  </svg>
                </div>
                <h3 ref={successRef} tabIndex={-1} className="text-xl font-bold text-fg mb-2 outline-none" style={{ fontFamily: "var(--font-display)" }}>
                  Message sent!
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  Thanks for reaching out. I&apos;ll get back to you within a few hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-accent hover:underline"
                >
                  Send another message
                </button>
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
                    <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">
                      Your name <span className="text-accent">*</span>
                    </label>
                    <input id="name" name="name" type="text" required autoComplete="name"
                      placeholder="Jane Smith" value={fields.name} onChange={handleChange}
                      disabled={status === "loading"}
                      className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="shop" className="block text-xs font-medium text-muted mb-1.5">
                      Shop name
                    </label>
                    <input id="shop" name="shop" type="text" autoComplete="organization"
                      placeholder="Smith's Pizzeria" value={fields.shop} onChange={handleChange}
                      disabled={status === "loading"}
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
                    Email address <span className="text-accent">*</span>
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email"
                    placeholder="jane@smithspizzeria.com" value={fields.email} onChange={handleChange}
                    disabled={status === "loading"}
                    className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted mb-1.5">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={5}
                    placeholder="Tell me about your business and what you're looking for..."
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
                  className="nav-cta-shimmer flex items-center justify-center gap-2 w-full h-12 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed text-[#1C1209] text-sm font-bold transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                    boxShadow: "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.4), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
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
                    <a href={`sms:+1${SITE.phone.replace(/\D/g, "")}`} className="text-accent hover:underline">{SITE.phone}</a>
                  ) : (
                    <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">{SITE.email}</a>
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
