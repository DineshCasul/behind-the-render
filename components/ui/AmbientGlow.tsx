"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * One slow-drifting soft light source behind the whole page, the single
 * piece of "the lab has ambient life to it" motion, isolated in its own
 * client component so the rest of the backdrop can stay a Server Component.
 * Animates only `transform` (translate) and `opacity`, both compositor-only
 * properties (see learning-notes/06-animation-and-reduced-motion.md).
 */
export function AmbientGlow() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(94,203,240,0.10), transparent 70%)",
        filter: "blur(40px)",
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, 60, 0],
              y: [0, 40, 0],
              opacity: [0.6, 1, 0.6],
            }
      }
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
