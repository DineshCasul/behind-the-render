"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Concept, NodeStatus } from "@/lib/types";
import { STATUS_VISUALS } from "@/lib/node-visuals";

const RADIUS = 34;

interface MapNodeProps {
  concept: Concept;
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
  status,
  emphasized,
  dimmed,
  selected,
  onHover,
  onSelect,
}: MapNodeProps) {
  const reduceMotion = useReducedMotion();
  const visual = STATUS_VISUALS[status];
  const { x, y } = concept.position;

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(concept.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(concept.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(concept.id)}
      tabIndex={0}
      role="button"
      aria-label={`${concept.title} — ${status.replace("-", " ")}`}
      className="cursor-pointer outline-none"
      animate={{ opacity: dimmed ? 0.3 : 1 }}
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.25 }}
    >
      {visual.glowOpacity > 0 && (
        <motion.circle
          r={RADIUS * 1.8}
          fill={visual.color}
          filter="url(#node-glow)"
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
        <circle r={RADIUS + 5} fill="none" stroke={visual.color} strokeWidth={1.5} strokeOpacity={0.8} />
      )}

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
  );
}
