"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const TYPE_MS = 42;
const ERASE_MS = 16;
const HOLD_MS = 2600;
const GAP_MS = 350;

/**
 * A "terminal" line that types a question, holds it, erases it and types the
 * next one. It starts out showing the whole first question, both in the
 * server-rendered HTML and on the first client render, so hydration matches and
 * the page is never blank; the typing loop only begins after that. Reduced
 * motion gets the first question, still. The cursor blinks with a CSS keyframe
 * (`.caret` in globals.css), not a JavaScript loop. The box keeps a fixed
 * minimum height so the changing text never moves the page.
 */
export function TerminalLine({ lines }: { lines: string[] }) {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(lines[0]?.length ?? 0);

  useEffect(() => {
    if (reduceMotion || lines.length < 2) return;
    let timer: number;
    let i = 0;
    let n = lines[0].length;
    // hold -> erase -> (next line) type -> hold ...
    const tick = (phase: "hold" | "erase" | "type") => {
      if (phase === "hold") {
        timer = window.setTimeout(() => tick("erase"), HOLD_MS);
      } else if (phase === "erase") {
        n -= 1;
        setShown(Math.max(n, 0));
        if (n > 0) {
          timer = window.setTimeout(() => tick("erase"), ERASE_MS);
        } else {
          i = (i + 1) % lines.length;
          setIndex(i);
          timer = window.setTimeout(() => tick("type"), GAP_MS);
        }
      } else {
        n += 1;
        setShown(n);
        timer = window.setTimeout(() => tick(n < lines[i].length ? "type" : "hold"), TYPE_MS);
      }
    };
    tick("hold");
    return () => window.clearTimeout(timer);
  }, [reduceMotion, lines]);

  return (
    <p
      className="relative flex min-h-[2.75rem] items-start justify-center text-balance text-center font-mono text-xs text-[var(--color-text-muted)] sm:min-h-[1.5rem] sm:text-sm"
      aria-label={lines[index]}
    >
      <span aria-hidden>
        <span className="text-[var(--state-got-it)]">$</span> {lines[index].slice(0, shown)}
        <span className="caret ml-0.5 inline-block h-3 w-[7px] translate-y-[1px] bg-[var(--state-got-it)]" />
      </span>
    </p>
  );
}
