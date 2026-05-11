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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-md border-b border-border-subtle shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={close}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-accent text-accent-fg text-xs font-bold font-display tracking-tight select-none">
              R9
            </span>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="px-3 py-1.5 text-sm text-muted hover:text-fg rounded-md hover:bg-surface transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: theme toggle + CTA */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center h-8 px-4 rounded-md bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium transition-colors duration-150"
            >
              Get in touch
            </a>
            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-fg hover:bg-surface transition-colors duration-150 ml-1"
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
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-sm flex flex-col pt-20 px-6 md:hidden transition-all duration-200 ${
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
                className="block px-3 py-3 text-lg font-medium text-fg hover:text-accent rounded-lg hover:bg-surface transition-colors duration-150"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-border">
          <a
            href="#contact"
            onClick={close}
            className="flex items-center justify-center h-12 w-full rounded-lg bg-accent hover:bg-accent-hover text-accent-fg text-base font-medium transition-colors duration-150"
          >
            Get in touch
          </a>
        </div>
      </div>
    </>
  );
}
