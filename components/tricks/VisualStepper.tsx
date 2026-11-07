"use client";

import { useState } from "react";
import { ChapterVisual, VISUAL_STEPS } from "@/components/journey/ChapterVisual";
import type { VisualKind } from "@/data/journey";

/**
 * A journey diagram with Back and Next, for the trick pages. The journey shows
 * these beside the narration on wide screens only; this puts the same pictures
 * in the page, so phones get them too, and you can step at your own pace.
 */
export function VisualStepper({ kind }: { kind: VisualKind }) {
  const steps = VISUAL_STEPS[kind];
  const [step, setStep] = useState(0);

  return (
    <div className="max-w-md lg:max-w-none">
      <ChapterVisual kind={kind} step={step} />
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-30"
        >
          ← Back
        </button>
        <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
          Step {step + 1} of {steps}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps - 1, s + 1))}
          disabled={step === steps - 1}
          className="rounded-full border border-[var(--state-learning)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)] transition-colors hover:bg-[var(--state-learning)] hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--state-learning)]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
