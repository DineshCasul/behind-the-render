"use client";

import { useEffect } from "react";

/**
 * Quietly fetches the code for the story walks once the page is idle, so tapping a story does not have to download
 * it first. Without this, a tap fetches the next page's data and only then the walk's code, one after the other;
 * on a slow connection that is an extra round trip. Renders nothing.
 */
export function WarmWalk() {
  useEffect(() => {
    const warm = () => void import("@/components/journey/Journey");
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }
    // Older browsers (Safari before 2023) have no idle callback: just wait a moment.
    const handle = setTimeout(warm, 1500);
    return () => clearTimeout(handle);
  }, []);
  return null;
}
