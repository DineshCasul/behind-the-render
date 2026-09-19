"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Concept, NodeStatus, ProgressState } from "@/lib/types";
import { conceptMap, categoryLabels } from "@/data/concepts";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/progress";
import { STATUS_VISUALS } from "@/lib/node-visuals";

interface ConceptPanelProps {
  concept: Concept | null;
  progress: ProgressState;
  onSetStatus: (id: Concept["id"], status: NodeStatus) => void;
  onClose: () => void;
}

export function ConceptPanel({ concept, progress, onSetStatus, onClose }: ConceptPanelProps) {
  return (
    <AnimatePresence>
      {concept && (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-4 top-4 z-30 w-[min(20rem,calc(100%-2rem))] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                {categoryLabels[concept.category]}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                {concept.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              ✕
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {concept.blurb}
          </p>

          {concept.prerequisites.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
                Prerequisites
              </p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {concept.prerequisites.map((id) => {
                  const prereq = conceptMap[id];
                  const prereqStatus = progress[id];
                  return (
                    <li key={id} className="flex items-center gap-1.5 text-xs text-[var(--color-text-primary)]">
                      <span style={{ color: STATUS_VISUALS[prereqStatus].color }}>
                        {STATUS_VISUALS[prereqStatus].glyph}
                      </span>
                      {prereq.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
              Mark progress
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {STATUS_ORDER.map((status) => {
                const active = progress[concept.id] === status;
                return (
                  <button
                    key={status}
                    onClick={() => onSetStatus(concept.id, status)}
                    className="rounded-full border px-2.5 py-1 text-[11px] transition-colors"
                    style={{
                      borderColor: STATUS_VISUALS[status].color,
                      color: active ? "#05070a" : STATUS_VISUALS[status].color,
                      backgroundColor: active ? STATUS_VISUALS[status].color : "transparent",
                    }}
                  >
                    {STATUS_LABEL[status]}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-[10px] italic text-[var(--color-text-muted)]">
            Full lesson content — deep dive, examples, interview questions — arrives in a later phase.
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
