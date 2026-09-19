"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { OnOffControl } from "@/components/experiments/OnOffControl";

type LayerKey = "browser" | "cdn" | "server";

interface Layer {
  key: LayerKey;
  label: string;
  where: string;
  ms: number;
}

const LAYERS: Layer[] = [
  { key: "browser", label: "Browser cache", where: "On the visitor's own device. No network trip at all.", ms: 5 },
  { key: "cdn", label: "CDN edge cache", where: "A nearby server run by your CDN provider.", ms: 40 },
  { key: "server", label: "Server cache", where: "Your app server's own memory.", ms: 150 },
];
const DB = { label: "Database", where: "The real source. Slowest, so everything above exists to avoid it.", ms: 450 };

const STEP_DELAY_MS = 900;

/**
 * Mark which layers already hold a saved copy, send a request, and watch
 * it stop at the first layer that has one. Layers before it say "no copy,
 * pass it on"; layers after it are never touched.
 */
export function CacheLayersExperiment() {
  const reduceMotion = useReducedMotion();
  const [saved, setSaved] = useState<Record<LayerKey, boolean>>({ browser: false, cdn: true, server: true });
  // How many stages of the chain have been revealed so far (0 = nothing sent yet).
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const firstSaved = LAYERS.findIndex((l) => saved[l.key]);
  // Index of the stage that finally answers: a layer with a copy, else the database.
  const answeredAt = firstSaved === -1 ? LAYERS.length : firstSaved;

  function send() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (reduceMotion) {
      setRevealed(answeredAt + 1);
      return;
    }
    setRunning(true);
    setRevealed(1);
    let shown = 1;
    const tick = () => {
      if (shown >= answeredAt + 1) {
        setRunning(false);
        return;
      }
      shown += 1;
      setRevealed(shown);
      timeoutRef.current = setTimeout(tick, STEP_DELAY_MS);
    };
    timeoutRef.current = setTimeout(tick, STEP_DELAY_MS);
  }

  const stages = [...LAYERS.map((l) => ({ label: l.label, where: l.where, ms: l.ms })), DB];
  const done = revealed > answeredAt;
  const answerer = stages[answeredAt];

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
        Step 1: which layers already have a saved copy?
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {LAYERS.map((layer) => (
          <div
            key={layer.key}
            className="flex items-center justify-between gap-4 rounded-md border p-3 transition-colors"
            style={{ borderColor: saved[layer.key] ? "var(--state-got-it)" : "var(--color-border)" }}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{layer.label}</p>
              <p className="mt-0.5 text-xs leading-snug text-[var(--color-text-muted)]">{layer.where}</p>
            </div>
            <OnOffControl
              label={`${layer.label} has a saved copy`}
              value={saved[layer.key]}
              onChange={(v) => setSaved((prev) => ({ ...prev, [layer.key]: v }))}
              onLabel="Has copy"
              offLabel="Empty"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Step 2:</p>
        <button
          onClick={send}
          disabled={running}
          className="rounded-full border border-[var(--state-learning)] px-4 py-1.5 text-xs font-medium text-[var(--state-learning)] transition-colors hover:bg-[var(--state-learning)] hover:text-[#05070a] disabled:opacity-40"
        >
          Send a request
        </button>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
        Step 3: follow the request, nearest layer first
      </p>
      <ol className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-4">
        {stages.map((stage, i) => {
          const isDb = i === LAYERS.length;
          let status: "idle" | "miss" | "hit" | "skipped";
          if (revealed <= i) status = done ? "skipped" : "idle";
          else if (i < answeredAt) status = "miss";
          else status = "hit";
          if (revealed === 0) status = "idle";

          const color =
            status === "hit" ? (isDb ? "var(--state-revisit)" : "var(--state-got-it)") : status === "miss" ? "var(--color-text-muted)" : "var(--color-border)";
          const text =
            status === "hit"
              ? isDb ? "Nobody had a copy, so the real query runs here." : "Has a copy. Answers here."
              : status === "miss" ? "No copy. Passes it on."
              : status === "skipped" ? "Never reached."
              : "";

          return (
            <li
              key={stage.label}
              className="rounded-md border p-3 transition-colors duration-300"
              style={{ borderColor: color, opacity: status === "skipped" ? 0.45 : 1 }}
            >
              <p className="font-mono text-[10px] text-[var(--color-text-muted)]">{i + 1}</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{stage.label}</p>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-snug" style={{ color: status === "hit" ? color : "var(--color-text-muted)" }}>
                {text}
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-primary)]">
        {!revealed
          ? "Set some layers to Has copy above, then press Send a request."
          : !done
            ? "The request is travelling…"
            : firstSaved === -1
              ? `Every layer missed, so the request went all the way to the database. Roughly ${answerer.ms} ms.`
              : `${answerer.label} answered in roughly ${answerer.ms} ms. ${
                  answeredAt < LAYERS.length ? "Everything after it (including the database) was never touched." : ""
                }`}
      </p>
    </div>
  );
}
