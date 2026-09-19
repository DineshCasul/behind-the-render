"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Hero } from "@/components/ui/Hero";
import { LearningMap } from "@/components/learning-map/LearningMap";

/**
 * Coordinates two scroll-driven effects between the hero and the map:
 *
 * 1. The hero dissolves (opacity + a small upward drift) as it scrolls
 *    past the top of the viewport, instead of just sliding out abruptly.
 * 2. Once the hero has mostly scrolled away, the map sheds its framed
 *    "card" look (max width, padding, rounded border) and expands to
 *    fill the full viewport width — it becomes the primary view instead
 *    of one section among several.
 *
 * Both need to share one scroll measurement, which is why they're
 * coordinated here rather than each managing its own — otherwise the
 * point at which the hero is "gone enough" for the map to expand would
 * have to be guessed independently in two places.
 */
export function ScrollExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // A discrete on/off switch for the map's layout, derived from the same
  // continuous scroll value — only setState when it actually flips, so
  // this doesn't re-render on every scroll pixel.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const shouldExpand = latest > 0.85;
    setExpanded((current) => (current === shouldExpand ? current : shouldExpand));
  });

  return (
    <>
      <motion.div
        ref={heroRef}
        style={reduceMotion ? undefined : { opacity: heroOpacity, y: heroY }}
      >
        <Hero />
      </motion.div>
      <LearningMap expanded={expanded} />
    </>
  );
}
