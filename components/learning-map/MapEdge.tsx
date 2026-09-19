"use client";

import type { NodeStatus } from "@/lib/types";
import { buildEdgePath } from "@/lib/graph";
import { STATUS_VISUALS } from "@/lib/node-visuals";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface MapEdgeProps {
  id: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  /** Curve along the vertical axis (portrait layout) instead of the horizontal one. */
  vertical?: boolean;
  /** Keeps gradient ids unique when two maps (wide + portrait) exist in the same page. */
  idPrefix?: string;
  fromStatus: NodeStatus;
  toStatus: NodeStatus;
  emphasized: boolean;
  dimmed: boolean;
}

export function MapEdge({
  id,
  fromPos,
  toPos,
  vertical = false,
  idPrefix = "",
  fromStatus,
  toStatus,
  emphasized,
  dimmed,
}: MapEdgeProps) {
  const reduceMotion = usePrefersReducedMotion();
  const path = buildEdgePath(fromPos, toPos, vertical);
  const fromColor = STATUS_VISUALS[fromStatus].color;
  const toColor = STATUS_VISUALS[toStatus].color;
  const gradientId = `${idPrefix}edge-gradient-${id}`;
  const isActive = fromStatus !== "not-started" && toStatus !== "not-started";

  return (
    <g opacity={dimmed ? 0.15 : 1}>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
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
