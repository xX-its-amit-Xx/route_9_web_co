"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SITE } from "@/lib/content";

const NAV_LINKS = [
  { label: "How I Build",       href: "#pillars", section: "pillars"  },
  { label: "Services & Pricing", href: "#pricing",  section: "pricing"  },
  { label: "Process",           href: "#process",  section: "process"  },
  { label: "About",             href: "#about",    section: "about"    },
] as const;

type Section = (typeof NAV_LINKS)[number]["section"];

export function Nav() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState<Section | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map(({ section }) =>
      document.getElementById(section)
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as Section);
          }
        }
      },
      { threshold: 0.1, rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "nav-glass" : "bg-transparent"
        }`}
      >
        {/* Gradient glow line at bottom (scrolled only) */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-px pointer-events-none transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,104,42,0.35) 20%, rgba(212,104,42,0.65) 50%, rgba(212,104,42,0.35) 80%, transparent 100%)",
            opacity: scrolled ? 1 : 0,
          }}
        />

        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <a
            href="#"
            onClick={scrollToTop}
            className="flex items-center gap-2.5 group select-none"
            aria-label="Back to top"
          >
            <span
              className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-extrabold select-none transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "15px",
                letterSpacing: "0.02em",
                background: "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,104,42,0.55), 0 0 20px rgba(212,104,42,0.38), 0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.15)",
              }}
            >
              R9
            </span>
            <div className="hidden sm:flex flex-col leading-none gap-[1px] transition-opacity duration-200 group-hover:opacity-90">
              <span style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(243,233,213,0.48)" }}>Route 9</span>
              <span style={{ fontSize: "14px", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, color: "#F3E9D5", letterSpacing: "-0.01em" }}>Web</span>
            </div>
          </a>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href, section }) => {
              const isActive = active === section;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className="relative px-3.5 py-1.5 text-sm rounded-lg transition-all duration-250"
                    style={{
                      color: isActive ? "#F3E9D5" : "rgba(243,233,213,0.48)",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(212,104,42,0.18) 0%, rgba(160,64,12,0.1) 100%)"
                        : "transparent",
                      border: isActive ? "1px solid rgba(212,104,42,0.25)" : "1px solid transparent",
                      boxShadow: isActive
                        ? "0 1px 8px rgba(212,104,42,0.15), inset 0 1px 0 rgba(255,210,140,0.1)"
                        : "none",
                    }}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* CTA with shimmer */}
            <a
              href="#contact"
              className="nav-cta-shimmer hidden sm:inline-flex items-center h-9 px-5 rounded-xl text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
              style={{
                background:
                  "linear-gradient(135deg, #D4682A 0%, #C05A20 55%, #B04C18 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,104,42,0.45), 0 4px 16px rgba(212,104,42,0.38), 0 1px 2px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
                letterSpacing: "0.025em",
              }}
            >
              Get in touch
            </a>

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[#9B8C7D] hover:text-[#F3E9D5] hover:bg-[rgba(243,233,213,0.08)] transition-colors duration-150"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-40 flex flex-col pt-20 px-6 md:hidden transition-all duration-250 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(9,6,3,0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
        }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href, section }) => {
            const isActive = active === section;
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={close}
                  className="flex items-center justify-between px-4 py-4 text-lg font-medium rounded-2xl transition-all duration-150"
                  style={{
                    color: isActive ? "#D4682A" : "#F3E9D5",
                    background: isActive
                      ? "rgba(212,104,42,0.08)"
                      : "transparent",
                    borderLeft: isActive ? "2px solid #D4682A" : "2px solid transparent",
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "#D4682A" }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-[rgba(212,104,42,0.14)]">
          <a
            href="#contact"
            onClick={close}
            className="flex items-center justify-center h-12 w-full rounded-2xl text-white text-base font-bold transition-colors duration-150"
            style={{
              background:
                "linear-gradient(135deg, #D4682A 0%, #C05A20 100%)",
              boxShadow:
                "0 0 24px rgba(212,104,42,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            Get in touch
          </a>
        </div>
      </div>
    </>
  );
}
