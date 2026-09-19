"use client";

import { useState } from "react";
import type { InterviewCategory, InterviewQuestion } from "@/lib/types";

const CATEGORY_COLOR: Record<InterviewCategory, string> = {
  fundamentals: "var(--state-learning)",
  tricky: "var(--state-revisit)",
  scenario: "var(--state-got-it)",
  senior: "var(--state-mastered)",
  debugging: "var(--state-not-started)",
};

/**
 * An accordion with no animation library: each item is a CSS grid whose
 * `grid-template-rows` transitions between `0fr` and `1fr`, with the real
 * content in an `overflow-hidden` child, a well-known pattern for
 * animating to/from "auto" height using only CSS transitions, no JS
 * height measurement and no Framer Motion needed for something this
 * simple.
 */
export function InterviewQuestions({ questions }: { questions: InterviewQuestion[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {questions.map((q, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="rounded-lg border border-[var(--color-border)]">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 p-3 text-left"
            >
              <span
                className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                style={{ borderColor: CATEGORY_COLOR[q.category], color: CATEGORY_COLOR[q.category] }}
              >
                {q.category}
              </span>
              <span className="flex-1 text-sm text-[var(--color-text-primary)]">{q.question}</span>
              <span className="shrink-0 text-[var(--color-text-muted)]">{open ? "−" : "+"}</span>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2 border-t border-[var(--color-border)] p-3 text-sm">
                  <p className="text-[var(--color-text-primary)]">{q.answer}</p>
                  <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                    <span className="font-mono uppercase tracking-wide text-[var(--state-got-it)]">Why: </span>
                    {q.reasoning}
                  </p>
                  {q.example && (
                    <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                      <span className="font-mono uppercase tracking-wide text-[var(--state-learning)]">Example: </span>
                      {q.example}
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                    <span className="font-mono uppercase tracking-wide text-[var(--state-mastered)]">Follow-up: </span>
                    {q.followUp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
