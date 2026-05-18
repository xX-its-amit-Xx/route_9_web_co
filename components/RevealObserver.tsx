"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal:not(.visible), .reveal-clip:not(.visible)";

// Watches all .reveal / .reveal-clip elements and adds "visible" when
// they enter the viewport. Uses a single long-lived IntersectionObserver;
// the MutationObserver only feeds genuinely NEW nodes into it, so there
// is no disconnect/recreate churn on every React render.
export function RevealObserver() {
  useEffect(() => {
    // CSS already forces opacity:1 / transform:none for reduced-motion users —
    // no need to run the observer at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -10px 0px" }
    );

    // Observe all elements already in the DOM
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => observer.observe(el));

    // Watch for new nodes — only observe genuinely added elements
    const mutation = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observer.observe(node as HTMLElement);
          node.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => observer.observe(el));
        }
      }
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
