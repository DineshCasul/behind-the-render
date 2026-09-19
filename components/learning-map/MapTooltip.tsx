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

export function MapTooltip({ concept, status }: MapTooltipProps) {
  return (
    <AnimatePresence>
      {concept && status && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-3 text-left shadow-lg backdrop-blur-sm"
          style={{
            left: `${(concept.position.x / VIEW_WIDTH) * 100}%`,
            top: `${(concept.position.y / VIEW_HEIGHT) * 100 - 14}%`,
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
