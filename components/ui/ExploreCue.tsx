"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { scrollToMap } from "@/lib/scroll-to-map";

/**
 * "Explore the map" cue at the bottom of the hero. A real button, so it works
 * with tap, click and keyboard, and the scroll only happens because the visitor
 * asked for it (unlike the automatic glide this site used to do).
 *
 * The scrolling itself lives in lib/scroll-to-map.ts (three layouts to target).
 */
export function ExploreCue({ className = "" }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();

  const go = () => scrollToMap(reduceMotion);

  return (
    <button
      type="button"
      onClick={go}
      className={`group flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] ${className}`}
    >
      Explore the map
      <span aria-hidden className="cue-bob text-base leading-none text-[var(--state-learning)]">↓</span>
    </button>
  );
}
