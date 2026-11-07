"use client";

import { useId, useState } from "react";

type Mode = "chain" | "batched";

const MODES: { id: Mode; label: string }[] = [
  { id: "chain", label: "One request each, in a chain" },
  { id: "batched", label: "One batched request" },
];

/**
 * The batching toy: drag two sliders and see how long a page waits.
 *
 * The numbers are yours, not a company's: a chain of requests costs
 * (how many) x (one round trip), and one batched request costs one round trip.
 * That is the whole model, and it says so underneath. Every request is drawn
 * as a bar on one shared time axis, so the two modes can be compared by eye.
 *
 * Bars are positioned with `transform: translateX(i * 100%)`: a percentage in
 * `translateX` is a percentage of the element's own width, and every bar is one
 * round trip wide, so request i simply starts i bars along. A transform is a
 * compositor-only property, so changing it never triggers layout.
 */
export function BatchingToy() {
  const uid = useId();
  const [count, setCount] = useState(6);
  const [rtt, setRtt] = useState(120);
  const [mode, setMode] = useState<Mode>("chain");

  const requests = mode === "chain" ? count : 1;
  const chainTotal = count * rtt;
  const total = requests * rtt;
  // Same axis in both modes, so switching mode shows the bar shrink instead of rescaling.
  const barWidth = 100 / count;

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-count`} className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>Things the page needs</span>
            <span className="text-[var(--color-text-primary)]">{count}</span>
          </label>
          <input
            id={`${uid}-count`}
            type="range"
            min={1}
            max={12}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--state-learning)]"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-rtt`} className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>One round trip</span>
            <span className="text-[var(--color-text-primary)]">{rtt} ms</span>
          </label>
          <input
            id={`${uid}-rtt`}
            type="range"
            min={20}
            max={400}
            step={10}
            value={rtt}
            onChange={(e) => setRtt(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--state-learning)]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="How the page asks for them">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className="rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors"
            style={{
              borderColor: mode === m.id ? "var(--state-learning)" : "var(--color-border)",
              color: mode === m.id ? "var(--state-learning)" : "var(--color-text-muted)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-1.5" aria-hidden>
        {Array.from({ length: requests }, (_, i) => (
          <div key={i} className="h-3 overflow-hidden rounded-sm bg-[var(--color-border)]/40">
            <div
              className="h-full rounded-sm transition-transform duration-500 motion-reduce:transition-none"
              style={{
                width: `${barWidth}%`,
                transform: `translateX(${i * 100}%)`,
                background: mode === "chain" ? "var(--state-revisit)" : "var(--state-got-it)",
              }}
            />
          </div>
        ))}
      </div>

      <p className="mt-5 font-mono text-sm text-[var(--color-text-primary)]" aria-live="polite">
        Everything has arrived after <span className="text-lg text-[var(--state-learning)]">{total} ms</span>
        <span className="block text-xs text-[var(--color-text-muted)]">
          Chain: {chainTotal} ms. Batched: {rtt} ms.
        </span>
      </p>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
        A toy, not YouTube&apos;s code. It assumes each request costs one round trip and can&apos;t start until the one
        before it has answered. Requests that don&apos;t depend on each other can already run in parallel, so batching
        helps most when they are chained.
      </p>
    </div>
  );
}
