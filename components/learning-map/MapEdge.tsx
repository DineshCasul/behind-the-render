"use client";

import { useReducedMotion } from "framer-motion";
import type { Concept, NodeStatus } from "@/lib/types";
import { buildEdgePath } from "@/lib/graph";
import { STATUS_VISUALS } from "@/lib/node-visuals";

interface MapEdgeProps {
  id: string;
  from: Concept;
  to: Concept;
  fromStatus: NodeStatus;
  toStatus: NodeStatus;
  emphasized: boolean;
  dimmed: boolean;
}

export function MapEdge({ id, from, to, fromStatus, toStatus, emphasized, dimmed }: MapEdgeProps) {
  const reduceMotion = useReducedMotion();
  const path = buildEdgePath(from.position, to.position);
  const fromColor = STATUS_VISUALS[fromStatus].color;
  const toColor = STATUS_VISUALS[toStatus].color;
  const gradientId = `edge-gradient-${id}`;
  const isActive = fromStatus !== "not-started" && toStatus !== "not-started";

  return (
    <g opacity={dimmed ? 0.15 : 1}>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={from.position.x}
          y1={from.position.y}
          x2={to.position.x}
          y2={to.position.y}
        >
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={emphasized ? 2.5 : 1.5}
        strokeOpacity={emphasized ? 0.9 : isActive ? 0.5 : 0.25}
      />

      {isActive && !reduceMotion && (
        <circle r={3} fill={toColor}>
          <animateMotion dur="3.5s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </g>
  );
}
