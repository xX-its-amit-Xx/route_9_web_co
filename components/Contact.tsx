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
    "w-full h-11 px-4 rounded-xl border border-[rgba(212,104,42,0.2)] bg-[rgba(243,233,213,0.05)] text-[#F3E9D5] text-sm placeholder:text-[#9B8C7D]/60 focus:outline-none focus:ring-2 focus:ring-[#D4682A]/30 focus:border-[#D4682A]/50 transition-colors duration-150";

  return (
    <section
      id="contact"
      className="py-24 md:py-32 border-t border-[rgba(212,104,42,0.1)]"
      style={{ background: "#110B07" }}
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={headingRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#D4682A] mb-3">
              Contact
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#F3E9D5] leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let&apos;s talk about<br />your shop.
            </h2>
            <p className="text-[#9B8C7D] leading-relaxed mb-8">
              Fill out the form and I&apos;ll reply within a few hours. Or text — fastest
              way to reach me, and I actually respond.
            </p>

            <div className="space-y-4">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-[#FEFBF5] transition-all duration-150">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-xs text-[#9B8C7D] mb-0.5">Email</p>
                  <p className="text-sm font-medium text-[#F3E9D5] group-hover:text-[#D4682A] transition-colors duration-150">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {SITE.phone !== "PLACEHOLDER_PHONE" && (
                <>
                  <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-[#FEFBF5] transition-all duration-150">
                      <Phone size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#9B8C7D] mb-0.5">Call</p>
                      <p className="text-sm font-medium text-[#F3E9D5] group-hover:text-[#D4682A] transition-colors duration-150">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>
                  <a href={`sms:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-[#FEFBF5] transition-all duration-150">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#9B8C7D] mb-0.5">Text (fastest)</p>
                      <p className="text-sm font-medium text-[#F3E9D5] group-hover:text-[#D4682A] transition-colors duration-150">
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
              <div className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl glass-warm">
                <div className="w-16 h-16 rounded-full bg-[rgba(212,104,42,0.15)] flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-[#D4682A]" />
                </div>
                <h3 className="text-xl font-bold text-[#F3E9D5] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Message sent!
                </h3>
                <p className="text-[#9B8C7D] text-sm leading-relaxed mb-6">
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
                    <label htmlFor="name" className="block text-xs font-medium text-[#9B8C7D] mb-1.5">
                      Your name <span className="text-[#D4682A]">*</span>
                    </label>
                    <input id="name" name="name" type="text" required autoComplete="name"
                      placeholder="Jane Smith" value={fields.name} onChange={handleChange}
                      className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="shop" className="block text-xs font-medium text-[#9B8C7D] mb-1.5">
                      Shop name
                    </label>
                    <input id="shop" name="shop" type="text" autoComplete="organization"
                      placeholder="Smith's Pizzeria" value={fields.shop} onChange={handleChange}
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#9B8C7D] mb-1.5">
                    Email address <span className="text-[#D4682A]">*</span>
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email"
                    placeholder="jane@smithspizzeria.com" value={fields.email} onChange={handleChange}
                    className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-[#9B8C7D] mb-1.5">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={5}
                    placeholder="Tell me about your business and what you're looking for..."
                    value={fields.message} onChange={handleChange}
                    className={`${inputClass} h-auto py-3 resize-none`} />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[rgba(212,104,42,0.1)] border border-[rgba(212,104,42,0.3)]">
                    <AlertCircle size={16} className="text-[#D4682A] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#F3E9D5]">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#D4682A] hover:bg-[#C05A20] disabled:opacity-60 disabled:cursor-not-allowed text-[#FEFBF5] text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(212,104,42,0.3)]"
                >
                  {status === "loading" ? (
                    <><Loader2 size={14} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={14} strokeWidth={2.5} /> Send message</>
                  )}
                </button>

                <p className="text-xs text-center text-[#9B8C7D]/60">
                  Prefer to just text?{" "}
                  {SITE.phone !== "PLACEHOLDER_PHONE" ? (
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
