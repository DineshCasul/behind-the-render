"use client";

import { useState } from "react";
import { ChapterVisual, VISUAL_STEPS } from "@/components/journey/ChapterVisual";
import type { VisualKind } from "@/data/journey";

/**
 * A journey diagram you step through yourself: back and next, plus a numbered
 * marker per step so you can jump straight to one. Keyboard left and right
 * work while the stepper has focus.
 */
export function VisualStepper({ kind }: { kind: VisualKind }) {
  const steps = VISUAL_STEPS[kind];
  const [step, setStep] = useState(0);
  const go = (n: number) => setStep(Math.max(0, Math.min(steps - 1, n)));

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(step + 1);
        else if (e.key === "ArrowLeft") go(step - 1);
        else return;
        e.preventDefault();
      }}
      aria-label="Diagram. Use the left and right arrow keys to step."
    >
      <ChapterVisual kind={kind} step={step} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step">
          ←
        </button>
        <ol className="flex gap-1.5" aria-label="Steps">
          {Array.from({ length: steps }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}`}
                aria-current={i === step ? "step" : undefined}
                className="h-8 w-8 border text-sm tabular-nums transition-colors"
                style={{
                  borderColor: i === step ? "var(--state-learning)" : "var(--color-border)",
                  color: i === step ? "var(--state-learning)" : i < step ? "var(--color-text-primary)" : "var(--color-text-muted)",
                }}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="btn" onClick={() => go(step + 1)} disabled={step === steps - 1} aria-label="Next step">
          →
        </button>
      </div>
    </div>
  );
}
