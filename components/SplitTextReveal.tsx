"use client";

import { useEffect, useRef, CSSProperties } from "react";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

type Props = {
  children: string;
  className?: string;
  as?: Tag;
  id?: string;
  delay?: number;       // base delay in ms
  stagger?: number;     // ms between each word
  duration?: number;    // ms per word
  once?: boolean;
  style?: CSSProperties;
};

export function SplitTextReveal({
  children,
  className = "",
  as: Tag = "div",
  id,
  delay = 0,
  stagger = 70,
  duration = 750,
  once = true,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const words = String(children).split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = el.querySelectorAll<HTMLSpanElement>(".word-inner");

    // Under reduced-motion: reveal words immediately; no observer needed
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((span) => span.classList.add("word-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          spans.forEach((span, i) => {
            span.style.transitionDelay = `${delay + i * stagger}ms`;
            span.style.transitionDuration = `${duration}ms`;
            span.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
            span.classList.add("word-visible");
          });
          if (once) observer.disconnect();
        } else if (!once) {
          spans.forEach((span) => {
            span.style.transitionDelay = "0ms";
            span.classList.remove("word-visible");
          });
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger, duration, once]);

  return (
    <Tag
      // @ts-expect-error ref polymorphism
      ref={ref}
      id={id}
      className={className}
      aria-label={children}
      style={style}
    >
      {words.map((word, i) => (
        // The space lives OUTSIDE word-clip (which has overflow:hidden) so
        // browsers can't collapse it. A text node between inline-blocks gives
        // natural inter-word spacing and still allows line-wrapping.
        <span key={i} style={{ display: "inline" }} aria-hidden="true">
          <span className="word-clip">
            <span className="word-inner">{word}</span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
