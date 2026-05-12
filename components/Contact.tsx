"use client";

import { useState } from "react";
import { Send, Mail, Phone, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SITE } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const headingRef = useScrollReveal();
  const formRef = useScrollReveal();

  const [fields, setFields] = useState({ name: "", shop: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    "w-full h-11 px-4 rounded-xl border border-[#E8D9C4] bg-white text-[#1C1209] text-sm placeholder:text-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#D4682A]/20 focus:border-[#D4682A]/60 transition-colors duration-150";

  return (
    <section
      id="contact"
      className="py-24 md:py-32 border-t border-[#E8D9C4] relative overflow-hidden"
      style={{ background: "#FEFBF5" }}
      aria-label="Contact"
    >
      {/* Lake Quinsigamond water ripple watermark */}
      <svg
        viewBox="0 0 500 340"
        fill="none"
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none"
        style={{ width: "min(460px, 52vw)", opacity: 0.035, transform: "translate(-14%, 22%)" }}
      >
        {[12, 34, 62, 96, 138, 188, 246, 312].map((r, i) => (
          <ellipse key={i} cx="250" cy="170" rx={r * 1.85} ry={r * 0.8}
            stroke="#D4682A" strokeWidth={i === 0 ? "2" : "1"}
            strokeOpacity={Math.max(0, 1 - i * 0.1)} />
        ))}
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
          <div ref={headingRef} className="reveal relative">
            <div className="label-pill mb-4">Contact</div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#1C1209] leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let&apos;s talk about<br />your shop.
            </h2>
            <p className="text-[#7A6B5C] leading-relaxed mb-5">
              Fill out the form and I&apos;ll reply within a few hours. Or text — fastest
              way to reach me, and I actually respond.
            </p>

            {/* Local trust badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-7"
              style={{
                background: "rgba(212,104,42,0.06)",
                border: "1px solid rgba(212,104,42,0.18)",
              }}
            >
              <svg viewBox="0 0 18 18" fill="none" className="w-3.5 h-3.5 flex-shrink-0 text-[#D4682A]" aria-hidden>
                <path d="M9 1.5C6.5 1.5 4.5 3.5 4.5 6c0 3.5 4.5 10.5 4.5 10.5s4.5-7 4.5-10.5c0-2.5-2-4.5-4.5-4.5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="9" cy="6" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-xs font-semibold text-[#D4682A]">Shrewsbury, MA</span>
              <span className="text-[#D4682A]/30">·</span>
              <span className="text-xs text-[#7A6B5C]">Replies in ≤ 2 hrs</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
                <span className="text-xs text-[#7A6B5C]">Usually less</span>
              </span>
            </div>

            <div className="space-y-4">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-xs text-[#B0A090] mb-0.5">Email</p>
                  <p className="text-sm font-medium text-[#1C1209] group-hover:text-[#D4682A] transition-colors duration-150">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {(SITE.phone as string) !== "PLACEHOLDER_PHONE" && (
                <>
                  <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                      <Phone size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#B0A090] mb-0.5">Call</p>
                      <p className="text-sm font-medium text-[#1C1209] group-hover:text-[#D4682A] transition-colors duration-150">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>
                  <a href={`sms:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-150 shadow-sm">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#B0A090] mb-0.5">Text (fastest)</p>
                      <p className="text-sm font-medium text-[#1C1209] group-hover:text-[#D4682A] transition-colors duration-150">
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
              <div className="flex flex-col items-center justify-center text-center py-16 px-8 card-light rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-[rgba(212,104,42,0.1)] flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-[#D4682A]" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1209] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Message sent!
                </h3>
                <p className="text-[#7A6B5C] text-sm leading-relaxed mb-6">
                  Thanks for reaching out. I&apos;ll get back to you within a few hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-[#D4682A] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    <label htmlFor="name" className="block text-xs font-medium text-[#7A6B5C] mb-1.5">
                      Your name <span className="text-[#D4682A]">*</span>
                    </label>
                    <input id="name" name="name" type="text" required autoComplete="name"
                      placeholder="Jane Smith" value={fields.name} onChange={handleChange}
                      className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="shop" className="block text-xs font-medium text-[#7A6B5C] mb-1.5">
                      Shop name
                    </label>
                    <input id="shop" name="shop" type="text" autoComplete="organization"
                      placeholder="Smith's Pizzeria" value={fields.shop} onChange={handleChange}
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#7A6B5C] mb-1.5">
                    Email address <span className="text-[#D4682A]">*</span>
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email"
                    placeholder="jane@smithspizzeria.com" value={fields.email} onChange={handleChange}
                    className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-[#7A6B5C] mb-1.5">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={5}
                    placeholder="Tell me about your business and what you're looking for..."
                    value={fields.message} onChange={handleChange}
                    className={`${inputClass} h-auto py-3 resize-none`} />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[rgba(212,104,42,0.08)] border border-[rgba(212,104,42,0.25)]">
                    <AlertCircle size={16} className="text-[#D4682A] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#1C1209]">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(212,104,42,0.3)]"
                >
                  {status === "loading" ? (
                    <><Loader2 size={14} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={14} strokeWidth={2.5} /> Send message</>
                  )}
                </button>

                <p className="text-xs text-center text-[#B0A090]">
                  Prefer to just text?{" "}
                  {(SITE.phone as string) !== "PLACEHOLDER_PHONE" ? (
                    <a href={`sms:${SITE.phone}`} className="text-[#D4682A] hover:underline">{SITE.phone}</a>
                  ) : (
                    <a href={`mailto:${SITE.email}`} className="text-[#D4682A] hover:underline">{SITE.email}</a>
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
