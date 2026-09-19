"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * A handful of slow-drifting dots behind the hero/map, for ambient depth.
 *
 * Positions are derived from the particle's index with sine/cosine, not
 * `Math.random()`. This component renders on the server first (React
 * always renders once before hydrating), then again in the browser,
 * `Math.random()` would produce different values each time and React
 * would flag a hydration mismatch. A deterministic formula produces the
 * same "random-looking" layout on both.
 */
const PARTICLE_COUNT = 28;

function seededParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = i * 137.5; // golden-angle spread, avoids visible grid patterns
    const radius = (i / count) * 48 + 2;
    return {
      left: 50 + radius * Math.cos((angle * Math.PI) / 180),
      top: 50 + radius * Math.sin((angle * Math.PI) / 180) * 0.6,
      size: 1.5 + (i % 3),
      duration: 14 + (i % 7) * 2,
      delay: (i % 5) * -1.3,
    };
  });
}

export function AmbientParticles() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(() => seededParticles(PARTICLE_COUNT), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[var(--state-learning)] opacity-30"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -18, 0],
                  opacity: [0.15, 0.4, 0.15],
                }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
