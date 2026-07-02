"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useLenis } from "./SmoothScrollProvider";
import { SITE } from "@/lib/content";

const NAV_LINKS = [
  { label: "How I Build",       href: "#pillars", section: "pillars"  },
  { label: "Services & Pricing", href: "#pricing",  section: "pricing"  },
  { label: "Arcade",            href: "#arcade",   section: "arcade"   },
  { label: "Process",           href: "#process",  section: "process"  },
  { label: "About",             href: "#about",    section: "about"    },
] as const;

type Section = (typeof NAV_LINKS)[number]["section"];

export function Nav() {
  const lenis = useLenis();
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState<Section | null>(null);
  const [isDark, setIsDark]       = useState(true);
  const firstMobileLinkRef        = useRef<HTMLAnchorElement>(null);
  const hamburgerRef              = useRef<HTMLButtonElement>(null);

  // Scroll detection (rAF-throttled — at most one state check per frame)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 48);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Track dark/light mode (set by ThemeToggle on document.documentElement)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Escape key closes mobile menu and returns focus to hamburger button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first menu item when mobile menu opens
  useEffect(() => {
    if (open) firstMobileLinkRef.current?.focus();
  }, [open]);

  // Tab focus trap inside the mobile dialog (WCAG 2.4.3 — focus order
  // inside aria-modal must not escape to background content)
  useEffect(() => {
    if (!open) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = document.getElementById("mobile-nav");
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [open]);

  // Hide outside content from AT while the modal is open. aria-modal="true"
  // alone doesn't guarantee that screen readers stop exposing background
  // content — marking <main> and <footer> as aria-hidden enforces it.
  // Also lock body scroll so a swipe on the overlay doesn't shift the page
  // underneath.
  useEffect(() => {
    if (!open) return;
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("aria-hidden", "true");
    footer?.setAttribute("aria-hidden", "true");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      main?.removeAttribute("aria-hidden");
      footer?.removeAttribute("aria-hidden");
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keyboard shortcut: K → scroll to contact
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        setOpen(false);
        const contact = document.getElementById("contact");
        if (!contact) return;
        if (lenis) lenis.scrollTo(contact, { offset: -72, duration: 1.6 });
        else contact.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lenis]);

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

  const spawnCtaSparkles = useCallback((e: React.MouseEvent) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dist = 34 + Math.random() * 46;
      const size = 2.5 + Math.random() * 3.5;
      const hue = 18 + Math.random() * 18;
      const delay = Math.round(Math.random() * 70);
      el.style.cssText = [
        `position:fixed`,
        `left:${cx}px`,
        `top:${cy}px`,
        `width:${size}px`,
        `height:${size}px`,
        `border-radius:50%`,
        `background:hsl(${hue},90%,62%)`,
        `box-shadow:0 0 ${Math.ceil(size * 2)}px hsl(${hue},90%,62%)`,
        `pointer-events:none`,
        `z-index:99999`,
        `--tx:${(Math.cos(angle) * dist).toFixed(1)}px`,
        `--ty:${(Math.sin(angle) * dist).toFixed(1)}px`,
        `animation:sparkle-burst 0.65s cubic-bezier(0.22,0.5,0.36,1) ${delay}ms forwards`,
      ].join(";");
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 780 + delay);
    }
  }, []);

  const scrollToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  }, [lenis]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Scoped: 3D coin-flip on the R9 mark itself (hover the mark, not the
          whole link) — transform-only, so click/scroll-to-top and layout are
          untouched. Reverses smoothly on mouse-out. */}
      <style>{`
        .nav-logo-coin {
          transform: perspective(520px) rotateY(0deg);
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .nav-logo-coin:hover {
          transform: perspective(520px) rotateY(360deg) scale(1.04);
        }
      `}</style>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled || !isDark ? "nav-glass" : "bg-transparent"
        }`}
      >
        {/* Gradient glow line at bottom (scrolled only) */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-px pointer-events-none transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,104,42,0.22) 20%, rgba(212,104,42,0.45) 50%, rgba(212,104,42,0.22) 80%, transparent 100%)",
            opacity: scrolled ? 1 : 0,
          }}
        />

        <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <a
            href="#"
            onClick={scrollToTop}
            className="flex items-center gap-2.5 group select-none"
            aria-label="Back to top"
          >
            <span
              className="nav-logo-coin flex items-center justify-center w-9 h-9 rounded-xl text-white font-extrabold select-none"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "15px",
                letterSpacing: "0.02em",
                background: "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,104,42,0.45), 0 2px 6px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.30), 0 0 14px rgba(212,104,42,0.22), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.15)",
              }}
            >
              R9
            </span>
            <div className="hidden sm:flex flex-col leading-none gap-[1px] transition-opacity duration-200 group-hover:opacity-90">
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(243,233,213,0.48)" }}>Route 9</span>
              <span style={{ fontSize: "14px", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, color: "#F3E9D5", letterSpacing: "-0.01em" }}>Web</span>
            </div>
          </a>

          {/* ── Desktop nav links ── */}
          <ul role="list" className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href, section }) => {
              const isActive = active === section;
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-3.5 py-1.5 text-sm rounded-lg transition-[color,background-color,border-color] duration-200 border ${
                      isActive
                        ? ""
                        : "text-[rgba(243,233,213,0.48)] border-transparent hover:text-[rgba(243,233,213,0.82)] hover:bg-[rgba(243,233,213,0.07)] hover:border-[rgba(243,233,213,0.08)]"
                    }`}
                    style={isActive ? {
                      color: "#F3E9D5",
                      background: "linear-gradient(135deg, rgba(212,104,42,0.14) 0%, rgba(160,64,12,0.08) 100%)",
                      borderColor: "rgba(212,104,42,0.22)",
                      boxShadow: "inset 0 1px 0 rgba(255,210,140,0.08)",
                    } : undefined}
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

            {/* CTA with shimmer + live dot */}
            <a
              href="#contact"
              aria-keyshortcuts="k"
              onClick={spawnCtaSparkles}
              className="nav-cta-shimmer group hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-xl text-[#1C1209] text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, #D4682A 0%, #C05A20 55%, #B04C18 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,104,42,0.45), 0 4px 14px rgba(212,104,42,0.28), 0 1px 2px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
                letterSpacing: "0.025em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(255,220,140,0.9)", boxShadow: "0 0 4px rgba(255,200,80,0.6)" }}
                aria-hidden
              />
              Get in touch
              <kbd
                className="hidden lg:inline-flex items-center justify-center rounded text-[9px] font-bold opacity-0 group-hover:opacity-55 transition-opacity duration-200 pointer-events-none"
                style={{
                  padding: "1px 4px",
                  background: "rgba(28,18,9,0.12)",
                  border: "1px solid rgba(28,18,9,0.22)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.4,
                }}
                aria-hidden
              >
                K
              </kbd>
            </a>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[#9B8C7D] hover:text-[#F3E9D5] hover:bg-[rgba(243,233,213,0.08)] transition-colors duration-150"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-40 flex flex-col pt-20 px-6 md:hidden transition-opacity duration-250 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          // Background is 97% opaque — the old blur(28px) backdrop-filter was
          // visually invisible but forced a full-viewport re-blur while the
          // overlay faded. Dropped for a near-identical solid tint.
          background: "rgba(9,6,3,0.98)",
        }}
        aria-hidden={open ? undefined : true}
      >
        <ul role="list" className="flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href, section }, i) => {
            const isActive = active === section;
            return (
              <li key={href} className={open ? "nav-link-animate" : ""} style={{ animationDelay: `${i * 60}ms` }}>
                <a
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  href={href}
                  onClick={close}
                  tabIndex={open ? undefined : -1}
                  aria-current={isActive ? "page" : undefined}
                  className="flex items-center justify-between px-4 py-4 text-lg font-medium rounded-2xl transition-[color,background-color,border-color] duration-150"
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
            tabIndex={open ? undefined : -1}
            className="flex items-center justify-center h-12 w-full rounded-2xl text-[#1C1209] text-base font-bold transition-colors duration-150"
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
