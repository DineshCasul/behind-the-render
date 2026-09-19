"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe "does the visitor prefer reduced motion?". Framer's
 * `useReducedMotion` returns the real answer during the client's very first
 * render, so a component that renders a *different tree* for it gets a
 * hydration mismatch (the server, which can't know, rendered the animated
 * tree). `useSyncExternalStore` is told what to use on the server
 * (`false`), and React uses that value while hydrating, then re-renders with
 * the real one right after. Use this whenever the reduced-motion answer
 * changes the markup, not just an animation prop.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
