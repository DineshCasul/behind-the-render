"use client";

import { motion } from "framer-motion";
import type { Concept, NodeStatus } from "@/lib/types";
import { STATUS_VISUALS } from "@/lib/node-visuals";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const RADIUS = 34;

interface MapNodeProps {
  concept: Concept;
  /** Where to draw this node: the wide layout and the portrait layout use different coordinates. */
  position: { x: number; y: number };
  /** id of the blur <filter> for this SVG (unique per SVG, since a phone and a desktop map can coexist in the DOM). */
  glowId: string;
  status: NodeStatus;
  /** true when this node is hovered directly or is a neighbor of the hovered node */
  emphasized: boolean;
  /** true when some other node is emphasized and this one isn't */
  dimmed: boolean;
  selected: boolean;
  onHover: (id: Concept["id"] | null) => void;
  onSelect: (id: Concept["id"]) => void;
}

export function MapNode({
  concept,
  position,
  glowId,
  status,
  emphasized,
  dimmed,
  selected,
  onHover,
  onSelect,
}: MapNodeProps) {
  const reduceMotion = usePrefersReducedMotion();
  const visual = STATUS_VISUALS[status];
  const { x, y } = position;

  return (
    // Plain, non-animated <g> owns positioning. Framer Motion writes its
    // own `transform` (scale, etc.) onto whatever element it's attached
    // to, if that same element also carried `transform="translate(x,y)"`,
    // Motion's generated transform replaces it outright the moment a
    // `whileHover`/`animate` transform kicks in, snapping the node to the
    // SVG's (0,0) origin. Nesting a motion.g *inside* the positioned <g>
    // keeps "where" and "how it moves" as separate concerns, the inner
    // group's own local origin is already the node's center, so scaling
    // around (0,0) there is exactly "scale in place."
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        onMouseEnter={() => onHover(concept.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(concept.id)}
        onBlur={() => onHover(null)}
        onClick={() => onSelect(concept.id)}
        tabIndex={0}
        role="button"
        aria-label={`${concept.title}, ${status.replace("-", " ")}`}
        className="cursor-pointer outline-none"
        animate={{ opacity: dimmed ? 0.3 : 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.25 }}
      >
      {visual.glowOpacity > 0 && (
        <motion.circle
          r={RADIUS * 1.8}
          fill={visual.color}
          filter={`url(#${glowId})`}
          animate={
            visual.animated && !reduceMotion
              ? { opacity: [visual.glowOpacity * 0.6, visual.glowOpacity, visual.glowOpacity * 0.6] }
              : { opacity: visual.glowOpacity }
          }
          transition={{ duration: 2.6, repeat: visual.animated && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
        />
      )}

      {selected && (
        <circle
          r={RADIUS + 8}
          fill="none"
          stroke={visual.color}
          strokeWidth={1}
          strokeOpacity={0.6}
          strokeDasharray="2 4"
        />
      )}

      {emphasized && (
        <>
          {/*
            A status-colored ring alone was hard to see on a muted
            "not-started" (gray) node: the ring is the same dull color
            as the node it's supposedly emphasizing. Using a fixed accent
            color for "you're looking at this" (independent of the
            node's own status color) plus a soft translucent halo behind
            it makes the emphasis legible regardless of the node's state.
          */}
          <circle r={RADIUS + 16} fill="var(--state-learning)" fillOpacity={0.1} />
          <circle
            r={RADIUS + 6}
            fill="none"
            stroke="var(--state-learning)"
            strokeWidth={2}
            strokeOpacity={0.9}
          />
        </>
      )}

      {/* Opaque backing: edges run to node centres, and without this the line shows through the disc. */}
      <circle r={RADIUS} fill="var(--color-bg)" />

      <circle
        r={RADIUS}
        fill={visual.color}
        fillOpacity={visual.fillOpacity}
        stroke={visual.color}
        strokeWidth={1.5}
        strokeOpacity={0.85}
      />

      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={20}
        fill={visual.color}
      >
        {visual.glyph}
      </text>

      <text
        textAnchor="middle"
        y={RADIUS + 22}
        fontSize={13}
        fontFamily="var(--font-mono)"
        fill="var(--color-text-primary)"
      >
        {concept.title}
      </text>
      </motion.g>
    </g>
  );
}
