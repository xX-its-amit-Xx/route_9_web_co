"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SITE } from "@/lib/content";

const NAV_LINKS = [
  { label: "How I Build", href: "#pillars" },
  { label: "Services", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(13,33,24,0.92)] backdrop-blur-md border-b border-[rgba(77,201,112,0.1)] shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={close}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4DC970] text-[#0D2118] text-xs font-extrabold select-none"
              style={{ fontFamily: "var(--font-syne)" }}>
              R9
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#F0E8D0] hidden sm:block">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="px-3 py-1.5 text-sm text-[#87A891] hover:text-[#F0E8D0] rounded-lg hover:bg-[rgba(240,232,208,0.06)] transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center h-8 px-4 rounded-lg bg-[#4DC970] hover:bg-[#5EDA82] text-[#0D2118] text-xs font-bold transition-colors duration-150"
            >
              Get in touch
            </a>
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#87A891] hover:text-[#F0E8D0] hover:bg-[rgba(240,232,208,0.06)] transition-colors duration-150 ml-1"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0D2118]/97 backdrop-blur-sm flex flex-col pt-20 px-6 md:hidden transition-all duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={close}
                className="block px-3 py-3.5 text-lg font-medium text-[#F0E8D0] hover:text-[#4DC970] rounded-xl hover:bg-[rgba(77,201,112,0.08)] transition-colors duration-150"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-[rgba(77,201,112,0.1)]">
          <a
            href="#contact"
            onClick={close}
            className="flex items-center justify-center h-12 w-full rounded-xl bg-[#4DC970] hover:bg-[#5EDA82] text-[#0D2118] text-base font-bold transition-colors duration-150"
          >
            Get in touch
          </a>
        </div>
      </div>
    </>
  );
}
