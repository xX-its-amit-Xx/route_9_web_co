"use client";

import { useState } from "react";
import { Send, Mail, Phone, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SITE } from "@/lib/content";

export function Contact() {
  const headingRef = useScrollReveal();
  const formRef = useScrollReveal();

  const [fields, setFields] = useState({ name: "", shop: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Route 9 Web inquiry from ${fields.name}${fields.shop ? ` — ${fields.shop}` : ""}`
    );
    const body = encodeURIComponent(
      `Name: ${fields.name}\nShop: ${fields.shop}\nEmail: ${fields.email}\n\n${fields.message}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-[rgba(77,201,112,0.2)] bg-[rgba(240,232,208,0.05)] text-[#F0E8D0] text-sm placeholder:text-[#87A891]/60 focus:outline-none focus:ring-2 focus:ring-[#4DC970]/30 focus:border-[#4DC970]/50 transition-colors duration-150";

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-[#0D2118] border-t border-[rgba(77,201,112,0.08)]"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div ref={headingRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4DC970] mb-3">
              Contact
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#F0E8D0] leading-tight mb-4"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Let&apos;s talk about<br />your shop.
            </h2>
            <p className="text-[#87A891] leading-relaxed mb-8">
              Fill out the form and I&apos;ll reply within a few hours. Or text — fastest
              way to reach me, and I actually respond.
            </p>

            <div className="space-y-4">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(77,201,112,0.1)] text-[#4DC970] group-hover:bg-[#4DC970] group-hover:text-[#0D2118] transition-all duration-150">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-xs text-[#87A891] mb-0.5">Email</p>
                  <p className="text-sm font-medium text-[#F0E8D0] group-hover:text-[#4DC970] transition-colors duration-150">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {SITE.phone !== "PLACEHOLDER_PHONE" && (
                <>
                  <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(77,201,112,0.1)] text-[#4DC970] group-hover:bg-[#4DC970] group-hover:text-[#0D2118] transition-all duration-150">
                      <Phone size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#87A891] mb-0.5">Call</p>
                      <p className="text-sm font-medium text-[#F0E8D0] group-hover:text-[#4DC970] transition-colors duration-150">
                        {SITE.phone}
                      </p>
                    </div>
                  </a>
                  <a href={`sms:${SITE.phone}`} className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(77,201,112,0.1)] text-[#4DC970] group-hover:bg-[#4DC970] group-hover:text-[#0D2118] transition-all duration-150">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-[#87A891] mb-0.5">Text (fastest)</p>
                      <p className="text-sm font-medium text-[#F0E8D0] group-hover:text-[#4DC970] transition-colors duration-150">
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
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-[#87A891] mb-1.5">
                    Your name <span className="text-[#4DC970]">*</span>
                  </label>
                  <input id="name" name="name" type="text" required autoComplete="name"
                    placeholder="Jane Smith" value={fields.name} onChange={handleChange}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="shop" className="block text-xs font-medium text-[#87A891] mb-1.5">
                    Shop name
                  </label>
                  <input id="shop" name="shop" type="text" autoComplete="organization"
                    placeholder="Smith's Pizzeria" value={fields.shop} onChange={handleChange}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-[#87A891] mb-1.5">
                  Email address <span className="text-[#4DC970]">*</span>
                </label>
                <input id="email" name="email" type="email" required autoComplete="email"
                  placeholder="jane@smithspizzeria.com" value={fields.email} onChange={handleChange}
                  className={inputClass} />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-[#87A891] mb-1.5">
                  Message
                </label>
                <textarea id="message" name="message" rows={5}
                  placeholder="Tell me about your business and what you're looking for..."
                  value={fields.message} onChange={handleChange}
                  className={`${inputClass} h-auto py-3 resize-none`} />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#4DC970] hover:bg-[#5EDA82] text-[#0D2118] text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(77,201,112,0.3)]"
              >
                <Send size={14} strokeWidth={2.5} />
                Send message
              </button>

              <p className="text-xs text-center text-[#87A891]/60">
                Opens your email app. Prefer to just text?{" "}
                {SITE.phone !== "PLACEHOLDER_PHONE" ? (
                  <a href={`sms:${SITE.phone}`} className="text-[#4DC970] hover:underline">{SITE.phone}</a>
                ) : (
                  <span>Add phone in lib/content.ts</span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
