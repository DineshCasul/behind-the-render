"use client";

import { useState } from "react";
import { Slider, Stats, ToyFrame } from "@/components/tricks/toy-ui";

const MODES = [
  { id: "plain", label: "<script src>", note: "plain" },
  { id: "async", label: "<script src async>", note: "async" },
  { id: "defer", label: "<script src defer>", note: "defer" },
] as const;
type Mode = (typeof MODES)[number]["id"];

/** Time to parse everything after the script tag, and how far into that the heading appears. Made-up numbers. */
const PARSE_REST = 120;
const HEADING_AT = 20;
/** The time axis ends here, so the bars keep their scale while you drag. */
const AXIS = 1800;

/** One bar on the timeline. `from` and `to` are in milliseconds; the axis maps them to a percentage of the width. */
function Bar({ label, from, to, tone }: { label: string; from: number; to: number; tone: "grey" | "red" }) {
  const pct = (ms: number) => `${Math.min(100, (ms / AXIS) * 100)}%`;
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-xs">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <div className="relative h-3 bg-[var(--color-bg)]">
        <div
          className="absolute inset-y-0"
          style={{ left: pct(from), width: pct(to - from), background: tone === "red" ? "var(--state-revisit)" : "var(--color-text-muted)", opacity: tone === "red" ? 0.85 : 0.6 }}
        />
      </div>
    </div>
  );
}

/**
 * The rendering toy: a tiny page with a stylesheet, a script and a heading. Change how the script is
 * loaded and how slow each file is, and see when the first paint happens and what it waited for.
 * It follows MDN's statements: CSS blocks rendering, a plain script halts parsing, async is fetched in
 * parallel and runs when available, defer runs after parsing. A model with made-up numbers.
 */
export function BlockingToy() {
  const [mode, setMode] = useState<Mode>("plain");
  const [cssMs, setCssMs] = useState(300);
  const [scriptMs, setScriptMs] = useState(900);

  // When does each thing happen? (All files start downloading at time 0.)
  const scriptRuns = mode === "defer" ? Math.max(scriptMs, PARSE_REST) : scriptMs;
  const stalled = mode === "plain" ? scriptMs : 0; // the parser sits on a plain script until it has run
  const headingAt = stalled + HEADING_AT;
  const parsedAt = stalled + PARSE_REST;
  const firstPaint = Math.max(cssMs, headingAt);
  const waitedFor = cssMs >= headingAt ? "the stylesheet (CSS blocks rendering)" : "the script (the parser was stuck on it, so the heading did not exist yet)";

  const markerLeft = `${Math.min(100, (firstPaint / AXIS) * 100)}%`;
  return (
    <ToyFrame
      title="when does the first paint happen?"
      note="A model built from MDN's statements, with made-up numbers. It ignores things real browsers also do, such as scanning ahead for files to download early and holding scripts back until pending stylesheets have loaded."
    >
      <div>
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">the script is loaded with</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="How the script is loaded">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className="border px-3 py-2 text-left font-mono text-sm transition-colors hover:border-[var(--state-learning)]"
              style={{ borderColor: mode === m.id ? "var(--state-learning)" : "var(--color-border)", color: mode === m.id ? "var(--state-learning)" : "var(--color-text-primary)" }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Slider label="stylesheet takes" value={cssMs} display={`${cssMs} ms`} min={0} max={1500} step={50} onChange={setCssMs} />
      <Slider label="script takes" value={scriptMs} display={`${scriptMs} ms`} min={0} max={1500} step={50} onChange={setScriptMs} />

      <div className="flex flex-col gap-2" role="img" aria-label={`Timeline: first paint at ${firstPaint} milliseconds`}>
        <Bar label="stylesheet" from={0} to={cssMs} tone="grey" />
        <Bar label="script download" from={0} to={scriptMs} tone="grey" />
        <Bar label="HTML parser stuck" from={0} to={stalled} tone="red" />
        <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-xs">
          <span className="text-[var(--color-text-muted)]">first paint</span>
          <div className="relative h-3 bg-[var(--color-bg)]">
            <div className="absolute inset-y-[-2px] w-[3px] bg-[var(--state-got-it)]" style={{ left: markerLeft }} />
          </div>
        </div>
        <div className="grid grid-cols-[7.5rem_1fr] gap-3 text-xs text-[var(--color-text-muted)]">
          <span />
          <span className="flex justify-between">
            <span>0</span>
            <span>{AXIS} ms</span>
          </span>
        </div>
      </div>

      <p className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]" aria-live="polite">
        The first paint waited for {waitedFor}.
        {mode === "defer" ? " A deferred script runs after the document has been parsed, so it never held the paint back." : ""}
        {mode === "async" ? " An async script is fetched in parallel and runs when it is available, so it does not hold up parsing." : ""}
      </p>

      <Stats
        items={[
          { label: "first paint at", value: `${firstPaint} ms`, tone: "good" },
          { label: "script runs at", value: `${scriptRuns} ms` },
          { label: "HTML parsed at", value: `${parsedAt} ms` },
        ]}
      />
    </ToyFrame>
  );
}
