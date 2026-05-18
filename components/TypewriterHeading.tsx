"use client";

import { useEffect, useRef, useState, ElementType, CSSProperties } from "react";

type Props = {
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Each entry types out on its own line, with a "carriage return" between. */
  lines: readonly string[];
  /** Milliseconds per character. */
  charDelay?: number;
  /** Pause between lines (after the carriage return ding). */
  lineGap?: number;
};

/**
 * Typewriter heading — types a heading out character-by-character when
 * scrolled into view, with a blinking caret and a tiny "DING!" speech
 * bubble at the end of each line (the carriage-return bell).
 *
 * Under prefers-reduced-motion the whole heading renders instantly with
 * no caret animation.
 *
 * The aria-label on the wrapper carries the full sentence so screen
 * readers announce the whole thing immediately (rather than letter-by-
 * letter as the typed text builds up).
 */
export function TypewriterHeading({
  as: Tag = "h2",
  id,
  className = "",
  style,
  lines,
  charDelay = 32,
  lineGap = 380,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [typedLines, setTypedLines] = useState<string[]>(() => lines.map(() => ""));
  const [dingLine, setDingLine] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const fullText = lines.join(" ");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Reduced-motion: render the finished heading right away.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedLines([...lines]);
      setDone(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        obs.disconnect();

        let li = 0;
        let ci = 0;
        let timer: ReturnType<typeof setTimeout>;

        const step = () => {
          if (li >= lines.length) {
            setDone(true);
            return;
          }
          const target = lines[li];
          if (ci < target.length) {
            ci += 1;
            setTypedLines((prev) => {
              const next = [...prev];
              next[li] = target.slice(0, ci);
              return next;
            });
            timer = setTimeout(step, charDelay);
          } else {
            // End-of-line: ding!
            setDingLine(li);
            timer = setTimeout(() => {
              setDingLine(null);
              li += 1;
              ci = 0;
              step();
            }, lineGap);
          }
        };

        timer = setTimeout(step, 220);
        return () => clearTimeout(timer);
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lines, charDelay, lineGap]);

  // The styled <Tag> below carries the visual styling. We keep the
  // accessible name on the wrapper so AT announces the full heading
  // immediately — the per-character chunks are aria-hidden.
  return (
    <div ref={wrapRef} aria-label={fullText} role="heading" aria-level={2}>
      <Tag
        id={id}
        className={`typewriter-heading ${className}`}
        style={style}
        aria-hidden="true"
      >
        {typedLines.map((typed, i) => {
          const isCurrent = !done && typed.length < lines[i].length && (i === 0 || typedLines[i - 1] === lines[i - 1]);
          const isLast = i === lines.length - 1;
          return (
            <span key={i} className="block relative">
              {typed}
              {isCurrent && (
                <span className="tw-caret" aria-hidden>|</span>
              )}
              {!isCurrent && done && isLast && (
                <span className="tw-caret tw-caret-done" aria-hidden>|</span>
              )}
              {dingLine === i && (
                <span
                  aria-hidden
                  className="tw-ding"
                  style={{
                    position: "absolute",
                    top: "-0.6em",
                    right: "-1.6em",
                    fontSize: "0.28em",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#FFE0A0",
                    padding: "0.35em 0.7em",
                    borderRadius: "9999px",
                    background: "linear-gradient(145deg, #D4682A, #A84818)",
                    boxShadow: "0 0.4em 1em rgba(212,104,42,0.55)",
                    whiteSpace: "nowrap",
                  }}
                >
                  DING!
                </span>
              )}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
