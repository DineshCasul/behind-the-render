"use client";

import { useEffect, useRef, useState } from "react";
import type { RuntimeStep } from "@/lib/types";
import { MockBrowser } from "@/components/experiments/MockBrowser";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ACTOR_COLOR: Record<RuntimeStep["actor"], string> = {
  browser: "var(--state-learning)",
  network: "var(--color-text-muted)",
  server: "var(--state-mastered)",
  react: "var(--state-got-it)",
};

const ACTOR_LABEL: Record<RuntimeStep["actor"], string> = {
  browser: "Browser",
  network: "Network",
  server: "Server",
  react: "React",
};

const STEP_DELAY_MS = 1300;

/**
 * The SSR/CSR "watch it happen" experiment. Left: the ordered steps and
 * who performs each one. Right: a mock browser showing what the visitor
 * sees at exactly that step. Reuses `RuntimeStep[]`, the same data the
 * static runtime diagram renders, so the two can never disagree.
 */
export function StageTimelineExperiment({ steps }: { steps: RuntimeStep[] }) {
  const reduceMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  function play() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (reduceMotion) {
      setActiveIndex(steps.length - 1);
      return;
    }
    setPlaying(true);
    setActiveIndex(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= steps.length) {
        setPlaying(false);
        return;
      }
      setActiveIndex(i);
      timeoutRef.current = setTimeout(tick, STEP_DELAY_MS);
    };
    timeoutRef.current = setTimeout(tick, STEP_DELAY_MS);
  }

  const active = activeIndex >= 0 ? steps[activeIndex] : null;
  const sees = active?.userSees;

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          {playing ? "Playing… each step lasts a moment." : activeIndex >= 0 ? "Finished. Press Replay to watch again." : "Nothing has happened yet."}
        </p>
        <button
          onClick={play}
          disabled={playing}
          className="shrink-0 rounded-full border border-[var(--state-learning)] px-4 py-1.5 text-xs font-medium text-[var(--state-learning)] transition-colors hover:bg-[var(--state-learning)] hover:text-[#05070a] disabled:opacity-40"
        >
          {activeIndex >= 0 ? "Replay" : "Play"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[1.1fr_1fr]">
        <ol className="flex flex-col gap-1">
          {steps.map((step, i) => {
            const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
            const color = ACTOR_COLOR[step.actor];
            return (
              <li
                key={i}
                className="flex gap-3 rounded-md p-2 transition-colors duration-300"
                style={{ backgroundColor: state === "active" ? `color-mix(in srgb, ${color} 12%, transparent)` : "transparent" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] transition-colors duration-300"
                  style={{
                    borderColor: state === "pending" ? "var(--color-border)" : color,
                    color: state === "pending" ? "var(--color-text-muted)" : color,
                  }}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold transition-colors duration-300"
                      style={{ color: state === "pending" ? "var(--color-text-muted)" : "var(--color-text-primary)" }}
                    >
                      {step.label}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wide" style={{ color }}>
                      {ACTOR_LABEL[step.actor]}
                    </span>
                  </span>
                  {state === "active" && (
                    <span className="mt-0.5 block text-[11px] leading-snug text-[var(--color-text-muted)]">{step.detail}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
            What the visitor sees right now
          </p>
          <MockBrowser
            idle={activeIndex < 0}
            visible={sees?.visible ?? false}
            interactive={sees?.interactive ?? false}
            note={sees?.text ?? "Press Play, then watch this window."}
          />
        </div>
      </div>
    </div>
  );
}
