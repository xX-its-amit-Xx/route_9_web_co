"use client";

import { useState } from "react";
import { Send, Mail, Phone } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SITE } from "@/lib/content";

export function Contact() {
  const headingRef = useScrollReveal();
  const formRef = useScrollReveal();

  const [fields, setFields] = useState({
    name: "",
    shop: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Builds a mailto link — swap this handler for a serverless function + Resend later
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
    "w-full h-11 px-4 rounded-lg border border-border bg-surface-raised text-fg text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors duration-150";

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-surface border-t border-border-subtle"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: heading + contact info */}
          <div ref={headingRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
              Contact
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-4"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Let&apos;s talk about<br />your shop.
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              Fill out the form and I&apos;ll reply within a few hours. Or just text — it&apos;s
              the fastest way to reach me.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-light text-accent group-hover:bg-accent group-hover:text-accent-fg transition-colors duration-150">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Email</p>
                  <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-150">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {SITE.phone !== "PLACEHOLDER_PHONE" && (
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-light text-accent group-hover:bg-accent group-hover:text-accent-fg transition-colors duration-150">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-0.5">Phone / Text</p>
                    <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-150">
                      {SITE.phone}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className="reveal">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">
                    Your name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={fields.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="shop" className="block text-xs font-medium text-muted mb-1.5">
                    Shop name
                  </label>
                  <input
                    id="shop"
                    name="shop"
                    type="text"
                    autoComplete="organization"
                    placeholder="Smith's Pizzeria"
                    value={fields.shop}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
                  Email address <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@smithspizzeria.com"
                  value={fields.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-muted mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me a bit about your business and what you're looking for..."
                  value={fields.message}
                  onChange={handleChange}
                  className={`${inputClass} h-auto py-3 resize-none`}
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium transition-all duration-150 hover:-translate-y-px hover:shadow-md hover:shadow-accent/20"
              >
                <Send size={14} strokeWidth={2.5} />
                Send message
              </button>

              <p className="text-xs text-center text-muted-light">
                This opens your email client. Prefer to just text?{" "}
                {SITE.phone !== "PLACEHOLDER_PHONE" ? (
                  <a
                    href={`sms:${SITE.phone}`}
                    className="text-accent hover:underline"
                  >
                    {SITE.phone}
                  </a>
                ) : (
                  <span>Add your phone number in lib/content.ts</span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
