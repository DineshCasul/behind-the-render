"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Chunk {
  label: string;
  note: string;
  arrivesAtMs: number;
  height: string;
}

const CHUNKS: Chunk[] = [
  { label: "Header", note: "Ready almost instantly", arrivesAtMs: 100, height: "h-11" },
  { label: "Navigation", note: "Ready almost instantly", arrivesAtMs: 250, height: "h-11" },
  { label: "Recommendations", note: "Slow: waits on a 2.2 second database query", arrivesAtMs: 2200, height: "h-20" },
  { label: "Footer", note: "Ready quickly", arrivesAtMs: 400, height: "h-11" },
];

const TOTAL_MS = Math.max(...CHUNKS.map((c) => c.arrivesAtMs));
const TICK_MS = 50;

const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

/**
 * The same page loaded two ways. Without streaming the server holds the
 * whole response until its slowest part is ready; with streaming each
 * part is sent the moment it is ready. The clock makes the difference
 * measurable: total time is identical, time-to-first-content is not.
 */
export function StreamingChunksExperiment() {
  const reduceMotion = useReducedMotion();
  const [streaming, setStreaming] = useState(true);
  const [elapsed, setElapsed] = useState<number | null>(null); // null = not started
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (interval.current) clearInterval(interval.current); }, []);

  function play(useStreaming: boolean) {
    if (interval.current) clearInterval(interval.current);
    setStreaming(useStreaming);
    if (reduceMotion) {
      setElapsed(TOTAL_MS);
      setRunning(false);
      return;
    }
    setElapsed(0);
    setRunning(true);
    let t = 0;
    interval.current = setInterval(() => {
      t += TICK_MS;
      setElapsed(Math.min(t, TOTAL_MS));
      if (t >= TOTAL_MS) {
        if (interval.current) clearInterval(interval.current);
        setRunning(false);
      }
    }, TICK_MS);
  }

  // Without streaming, everything is held back until the slowest part is done.
  const arrivalOf = (c: Chunk) => (streaming ? c.arrivesAtMs : TOTAL_MS);
  const firstContentAt = Math.min(...CHUNKS.map(arrivalOf));
  const started = elapsed !== null;
  const now = elapsed ?? 0;
  const firstSeen = started && now >= firstContentAt;
  const finished = started && now >= TOTAL_MS;

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => play(false)}
          disabled={running}
          className="rounded-full border border-[var(--state-revisit)] px-4 py-1.5 text-xs font-medium text-[var(--state-revisit)] transition-colors hover:bg-[var(--state-revisit)] hover:text-[#05070a] disabled:opacity-40"
        >
          Load WITHOUT streaming
        </button>
        <button
          onClick={() => play(true)}
          disabled={running}
          className="rounded-full border border-[var(--state-got-it)] px-4 py-1.5 text-xs font-medium text-[var(--state-got-it)] transition-colors hover:bg-[var(--state-got-it)] hover:text-[#05070a] disabled:opacity-40"
        >
          Load WITH streaming
        </button>
        <span className="ml-auto font-mono text-xs text-[var(--color-text-muted)]">
          Clock: <span className="text-[var(--color-text-primary)]">{fmt(now)}</span>
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {CHUNKS.map((chunk) => {
          const arrived = started && now >= arrivalOf(chunk);
          return (
            <div
              key={chunk.label}
              className={`${chunk.height} rounded-md border p-2 transition-colors duration-300`}
              style={{ borderColor: arrived ? "var(--state-got-it)" : "var(--color-border)" }}
            >
              {arrived ? (
                <p className="text-xs text-[var(--color-text-primary)]">
                  <span className="font-semibold">{chunk.label}</span> arrived at {fmt(arrivalOf(chunk))}
                </p>
              ) : (
                <div className="flex h-full flex-col justify-between">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold">{chunk.label}</span>: {started ? "waiting…" : chunk.note}
                  </p>
                  {running && <div className="h-1.5 animate-pulse rounded bg-[var(--color-bg-elevated)]" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-primary)]">
        {!started
          ? "Pick one of the two buttons to load the page."
          : !firstSeen
            ? "The visitor is still looking at a blank screen."
            : finished
              ? `Done at ${fmt(TOTAL_MS)}. The visitor first saw something at ${fmt(firstContentAt)}${streaming ? "" : " (they waited for the slowest part before seeing anything)"}. Total loading time is the same either way. Only when they first see content changes.`
              : `The visitor can already see content (first seen at ${fmt(firstContentAt)}) while the slow part is still loading.`}
      </p>
    </div>
  );
}
