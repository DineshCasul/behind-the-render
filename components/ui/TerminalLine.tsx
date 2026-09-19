"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A single line of "instrument readout" text with a blinking cursor —
 * cheap way to reinforce the terminal/lab feel without a real typing
 * animation library. Cursor opacity is the only animated property.
 */
export function TerminalLine({ children }: { children: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <p className="relative font-mono text-xs text-[var(--color-text-muted)]">
      <span className="text-[var(--state-got-it)]">$</span> {children}
      <motion.span
        aria-hidden
        className="ml-0.5 inline-block h-3 w-[7px] translate-y-[1px] bg-[var(--state-got-it)]"
        animate={reduceMotion ? { opacity: 0.8 } : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
      />
    </p>
  );
}
