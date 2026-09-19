"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { clearNavDirection, peekNavDirection } from "@/lib/nav-direction";

// Counts page mounts in this browser session. The very first one is the
// initial page load, which must NOT animate: the server-rendered HTML is
// already the final page, and animating it from `opacity: 0` would render the
// whole site invisible until JavaScript runs (a blank flash on every reload).
let mountCount = 0;

const SLIDE_PX = 80;

/**
 * Plays the enter animation once each time it mounts. If the click that caused
 * the navigation recorded a direction (lib/nav-direction.ts) the page slides in
 * from that side; otherwise it fades and rises slightly. Enter-only on purpose:
 * holding the old page for an exit animation means fighting the router (see
 * learning-notes/12).
 */
function PageEnter({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  // Read once at mount, without consuming (React StrictMode runs initializers
  // twice in dev; a consuming read would give the second call nothing).
  const [start] = useState(() => ({ first: mountCount === 0, direction: peekNavDirection() }));

  useEffect(() => {
    mountCount += 1;
    clearNavDirection();
  }, []);

  const x = start.direction === "forward" ? SLIDE_PX : start.direction === "back" ? -SLIDE_PX : 0;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={start.first || reduceMotion ? false : { opacity: 0, x, y: x === 0 ? 10 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A template is only remounted when the route *segment* above it changes:
 * home → lesson does, but lesson → lesson (`/learn/ssr` → `/learn/ssg`) stays
 * inside the same `learn` segment, so the template is reused and would never
 * replay. Keying the animated wrapper by pathname remounts it on every path
 * change, so both kinds of navigation animate.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // overflow-x: clip (not hidden) hides the horizontal overhang while the
    // page is offset sideways, without creating a scroll container, so the
    // sticky lesson bar keeps working.
    <div className="flex flex-1 flex-col overflow-x-clip">
      <PageEnter key={pathname}>{children}</PageEnter>
    </div>
  );
}
