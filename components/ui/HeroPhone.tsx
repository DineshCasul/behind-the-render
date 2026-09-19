"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AmbientParticles } from "@/components/ui/AmbientParticles";
import { HudCorners } from "@/components/ui/HudCorners";
import { TerminalLine } from "@/components/ui/TerminalLine";

const TITLE = "Behind the Render";

/**
 * The hero for phones and tablets (the desktop hero is part of the pinned scroll
 * scene instead). Two layers of motion:
 *
 * 1. On load (pure CSS, see globals.css): each letter of the title resolves from a
 *    blur, a scan line sweeps down once, the rest fades in, and a cue nudges toward
 *    the map a few times.
 * 2. On scroll: the content drifts up slower than the page and fades as the hero
 *    leaves. Only `transform` and `opacity`, never a per-frame blur (that made the
 *    desktop scroll scene stutter), and every range runs the full 0 to 1 so
 *    Chrome's native scroll-linked path can't invent a keyframe at the end.
 */
export function HeroPhone() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.35, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // Letters get a running index so each one's delay follows the previous.
  let index = 0;
  const words = TITLE.split(" ");

  return (
    <section
      ref={ref}
      className="relative mx-2 flex min-h-[78svh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] px-6 text-center"
    >
      <AmbientParticles />
      <HudCorners />
      <div aria-hidden className="scan-once pointer-events-none absolute inset-0" />

      <motion.div
        className="relative flex flex-col items-center"
        style={reduceMotion ? undefined : { y, opacity, scale, willChange: "transform, opacity" }}
      >
        <p className="reveal-fade font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-learning)]" style={{ "--delay": "0.1s" } as React.CSSProperties}>
          01 / A developer laboratory
        </p>

        <h1
          aria-label={TITLE}
          className="text-glow mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-[var(--color-text-primary)]"
        >
          {words.map((word, wi) => (
            <span key={wi} aria-hidden>
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, ci) => (
                  <span key={ci} className="reveal-letter inline-block" style={{ "--i": index++ } as React.CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p className="reveal-fade mt-5 max-w-xs text-balance text-base text-[var(--color-text-muted)]" style={{ "--delay": "1.1s" } as React.CSSProperties}>
          Explore how the modern web turns a request into pixels.
        </p>

        <div className="reveal-fade relative mt-9" style={{ "--delay": "1.4s" } as React.CSSProperties}>
          <TerminalLine>tracing request → paint, one concept at a time_</TerminalLine>
        </div>
      </motion.div>

      <div
        aria-hidden
        className="reveal-fade absolute bottom-5 flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]"
        style={{ "--delay": "2s" } as React.CSSProperties}
      >
        Scroll to explore
        <span className="cue-bob text-base leading-none text-[var(--state-learning)]">↓</span>
      </div>
    </section>
  );
}
