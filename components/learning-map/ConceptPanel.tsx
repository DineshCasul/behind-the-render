"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Concept, NodeStatus, ProgressState } from "@/lib/types";
import { conceptMap, categoryLabels } from "@/data/concepts";
import { STATUS_VISUALS } from "@/lib/node-visuals";
import { StatusPicker } from "@/components/lesson/StatusPicker";

interface ConceptPanelProps {
  concept: Concept | null;
  progress: ProgressState;
  onSetStatus: (id: Concept["id"], status: NodeStatus) => void;
  onClose: () => void;
  /**
   * "column" is the desktop side panel (a grid column beside the map).
   * "sheet" is the phone version: a bottom sheet over the page, with topic hints
   * always visible because touch screens have no hover to reveal them.
   */
  variant?: "column" | "sheet";
}

export function ConceptPanel({ concept, progress, onSetStatus, onClose, variant = "column" }: ConceptPanelProps) {
  const sheet = variant === "sheet";
  return (
    <AnimatePresence>
      {concept && (
        // No positioning classes here, this fills whatever box its
        // parent grid column gives it (see LearningMap.tsx). Only opacity
        // is animated, so there's nothing to collide with that column's
        // own width transition.
        <motion.aside
          initial={sheet ? { opacity: 0, y: 60 } : { opacity: 0 }}
          animate={sheet ? { opacity: 1, y: 0 } : { opacity: 1 }}
          exit={sheet ? { opacity: 0, y: 60 } : { opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={
            sheet
              ? "fixed inset-x-0 bottom-0 z-40 flex max-h-[78vh] flex-col overflow-y-auto rounded-t-2xl border border-b-0 border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 pb-8 shadow-2xl"
              : "flex h-full w-80 flex-col overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-4 shadow-xl backdrop-blur-md"
          }
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

          {/* On the phone sheet the primary actions come first (CSS `order`), the long topic list last. */}
          <div className={`mt-4 ${sheet ? "order-5" : ""}`}>
            <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
              What you&apos;ll learn
            </p>
            <ul className="mt-1.5 flex flex-col">
              {[
                ...concept.topics,
                {
                  label: "In this very site",
                  section: "in-this-site" as const,
                  hint: "Where this exact concept shows up in the code of the website you're using, or why it deliberately doesn't. With ways to check for yourself.",
                },
                {
                  label: "Test yourself",
                  section: "test-yourself" as const,
                  hint: "Five questions on this topic, from basics to debugging scenarios, each with an answer and a follow-up.",
                },
                {
                  label: "Go deeper",
                  section: "go-deeper" as const,
                  hint: "Official docs, specifications and a few good articles on this topic, each with a one-line reason to open it.",
                },
              ].map((topic) => (
                <li key={topic.section + topic.label}>
                  <Link
                    href={`/learn/${concept.id}#${topic.section}`}
                    className="group block rounded px-1.5 py-1 text-xs text-[var(--color-text-primary)] transition-colors hover:bg-[var(--state-learning)]/10 hover:text-[var(--state-learning)] focus-visible:bg-[var(--state-learning)]/10 focus-visible:outline-none"
                  >
                    <span className="flex items-start gap-2">
                      <span className="mt-px text-[var(--state-learning)] opacity-60 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                      {topic.label}
                    </span>
                    {/*
                      The simple meaning of the topic, revealed on hover or
                      keyboard focus. A 0fr → 1fr grid row animates the
                      height without measuring, and lives inside the link
                      (not a floating tooltip) so the panel's scroll area
                      can't clip it.
                    */}
                    <span
                      className={`grid transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] ${
                        sheet ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pb-0.5 pl-5 pt-1 text-[11px] leading-snug text-[var(--color-text-muted)]">
                          {topic.hint}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {concept.prerequisites.length > 0 && (
            <div className={`mt-4 ${sheet ? "order-4" : ""}`}>
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

          <div className={`mt-4 ${sheet ? "order-3" : ""}`}>
            <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
              Mark progress
            </p>
            <div className="mt-1.5">
              <StatusPicker conceptId={concept.id} current={progress[concept.id]} onSetStatus={onSetStatus} />
            </div>
          </div>

          <Link
            href={`/learn/${concept.id}`}
            className={`mt-4 flex items-center justify-center gap-1.5 rounded-md border border-[var(--state-learning)] py-2 text-xs font-medium ${sheet ? "order-2" : ""} text-[var(--state-learning)] transition-colors hover:bg-[var(--state-learning)] hover:text-[#05070a]`}
          >
            Open full lesson →
          </Link>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
