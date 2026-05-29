"use client";

import { useRef, useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";

type Props = {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  id?: string;
  delay?: number;
  speed?: number;
};

export function TextScramble({
  children,
  className,
  style,
  as: Tag = "span",
  id,
  delay = 0,
  speed = 2,
}: Props) {
  const [display, setDisplay] = useState(children);
  const revealedRef = useRef(false);
  const spanRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || revealedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || revealedRef.current) return;
        revealedRef.current = true;
        observer.disconnect();

        const text = children;
        let frame = 0;
        const totalFrames = speed * text.length + 8;

        const tick = () => {
          const resolved = Math.floor((frame / (speed * text.length)) * text.length);
          let output = "";

          for (let i = 0; i < text.length; i++) {
            if (text[i] === " " || text[i] === "\n" || text[i] === "\t") {
              output += text[i];
              continue;
            }
            if (i < resolved) {
              output += text[i];
            } else {
              output += CHARS[(frame * (i + 1) * 7) % CHARS.length];
            }
          }

          setDisplay(output);
          frame++;

          if (frame <= totalFrames) {
            frameRef.current = requestAnimationFrame(tick);
          } else {
            setDisplay(text);
          }
        };

        const tid = setTimeout(() => {
          frameRef.current = requestAnimationFrame(tick);
        }, delay);

        return () => clearTimeout(tid);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [children, delay, speed]);

  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={spanRef} id={id} className={className} style={style} aria-label={children}>
      <span aria-hidden>{display}</span>
    </Tag>
  );
}
