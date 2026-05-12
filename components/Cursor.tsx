"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    // Non-null assertion safe here: we check before using
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    if (!dotRef.current || !ringRef.current) return;

    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animate() {
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    function onEnter() {
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.borderColor = "rgba(212,104,42,0.8)";
      dot.style.opacity = "0";
    }
    function onLeave() {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(212,104,42,0.5)";
      dot.style.opacity = "1";
    }
    function onLinkEnter() {
      ring.style.width = "64px";
      ring.style.height = "64px";
      ring.style.borderColor = "rgba(212,104,42,0.9)";
      ring.style.background = "rgba(212,104,42,0.08)";
      dot.style.opacity = "0";
    }
    function onLinkLeave() {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(212,104,42,0.5)";
      ring.style.background = "transparent";
      dot.style.opacity = "1";
    }

    const onMouseLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onMouseEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Track map of element → handlers so we can clean up
    const attached = new WeakMap<Element, { enter: () => void; leave: () => void }>();

    function attachListeners() {
      document.querySelectorAll("button, a, input, textarea, [role='button']").forEach((el) => {
        if (attached.has(el)) return; // skip already-attached
        const isLink = el.tagName === "A";
        const enter = isLink ? onLinkEnter : onEnter;
        const leave = isLink ? onLinkLeave : onLeave;
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        attached.set(el, { enter, leave });
      });
    }
    attachListeners();

    const mutation = new MutationObserver(attachListeners);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      mutation.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#D4682A",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1.5px solid rgba(212,104,42,0.5)",
          background: "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          transition:
            "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
