"use client";

import { useEffect } from "react";

// Watches ALL .reveal and .line-draw elements on the page
// and adds "visible" when they enter the viewport.
export function RevealObserver() {
  useEffect(() => {
    const observe = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        ".reveal:not(.visible), .reveal-clip:not(.visible), .line-draw:not(.visible)"
      );

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

      elements.forEach((el) => observer.observe(el));

      return observer;
    };

    // Initial run
    let observer = observe();

    // Re-run on DOM mutations (new elements added)
    const mutation = new MutationObserver(() => {
      observer.disconnect();
      observer = observe();
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
