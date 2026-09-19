"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Concept, NodeStatus } from "@/lib/types";
import { conceptMap, categoryLabels } from "@/data/concepts";
import { VIEW_WIDTH, VIEW_HEIGHT } from "@/lib/graph";
import { STATUS_LABEL } from "@/lib/progress";

interface MapTooltipProps {
  concept: Concept | null;
  status: NodeStatus | null;
}

// Tooltip is a fixed w-56 (224px) box. Centering it on the node with a
// -50% transform works fine in the middle of the map, but for nodes near
// an edge it pushes half the box outside the container. Rather than
// centering and clipping, `clamp()` computes the centered position as the
// *preferred* value but keeps it from crossing an 8px inset on either
// side — the tooltip slides to stay fully inside the map for edge nodes,
// and centers normally everywhere else. Note this also avoids stacking a
// second `transform` on an element Framer Motion is already animating
// (see learning-notes/07-transform-composition-bug.md) — `left`/`top` are
// plain layout properties, so there's nothing for Motion's own transform
// to collide with.
const TOOLTIP_WIDTH = 224;
const TOOLTIP_EST_HEIGHT = 150;
const EDGE_INSET = 8;

export function MapTooltip({ concept, status }: MapTooltipProps) {
  return (
    <AnimatePresence>
      {concept && status && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-20 w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-3 text-left shadow-lg backdrop-blur-sm"
          style={{
            left: `clamp(${EDGE_INSET}px, calc(${(concept.position.x / VIEW_WIDTH) * 100}% - ${TOOLTIP_WIDTH / 2}px), calc(100% - ${TOOLTIP_WIDTH + EDGE_INSET}px))`,
            top: `clamp(${EDGE_INSET}px, calc(${(concept.position.y / VIEW_HEIGHT) * 100}% - 14%), calc(100% - ${TOOLTIP_EST_HEIGHT + EDGE_INSET}px))`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
              {categoryLabels[concept.category]}
            </p>
            <p className="text-[10px] font-mono text-[var(--color-text-muted)]">
              {STATUS_LABEL[status]}
            </p>
          </div>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {concept.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {concept.blurb}
          </p>
          {concept.prerequisites.length > 0 && (
            <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
              Prerequisites:{" "}
              {concept.prerequisites.map((id) => conceptMap[id].title).join(" · ")}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
