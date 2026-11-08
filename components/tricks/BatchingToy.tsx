"use client";

import { useState } from "react";
import { Legend, Slider, Stats, ToyFrame } from "@/components/tricks/toy-ui";

interface Bar {
  start: number;
  ms: number;
}

/**
 * One timeline: a thin bar per request on a time axis shared by every row.
 * A bar's width is its duration as a share of the axis; `translateX` as a
 * percentage is a percentage of the bar's own width, so `start / ms * 100%`
 * lands it at `start` on the axis. A transform is compositor-only, so dragging
 * a slider never triggers layout.
 */
function Timeline({ name, total, tone, bars, axis }: { name: string; total: number; tone: string; bars: Bar[]; axis: number }) {
  return (
    <div className="grid grid-cols-[5rem_1fr_5rem] items-center gap-3 sm:grid-cols-[7rem_1fr_6rem]">
      <span className="text-sm text-[var(--color-text-primary)]">{name}</span>
      <div className="flex flex-col gap-[3px]" aria-hidden>
        {bars.map((b, i) => (
          <div key={i} className="h-[7px] bg-[var(--color-border)]/50">
            <div
              className="h-full transition-transform duration-300 motion-reduce:transition-none"
              style={{ width: `${(b.ms / axis) * 100}%`, transform: `translateX(${(b.start / b.ms) * 100}%)`, background: tone }}
            />
          </div>
        ))}
      </div>
      <span className="text-right text-sm tabular-nums text-[var(--color-text-primary)]">{total} ms</span>
    </div>
  );
}

/**
 * The batching toy. It draws the three ways of asking for the same data on one
 * shared time axis, so you compare them by eye instead of toggling:
 *
 *   chain:    each call needs the previous answer  -> N x round trip
 *   parallel: the calls are independent            -> 1 round trip
 *   batched:  one request carrying all of them     -> 1 round trip
 *
 * "Slowest piece" is extra time for the one slow call. A chain still waits for
 * it, and parallel and batched both wait for it before everything has arrived.
 * That is the honest downside of batching, so the slider is there to show it.
 * The numbers are this toy's model, not a company's.
 */
export function BatchingToy() {
  const [count, setCount] = useState(6);
  const [rtt, setRtt] = useState(120);
  const [slow, setSlow] = useState(0);

  const chain = count * rtt + slow;
  const parallel = rtt + slow;
  const batched = rtt + slow;
  const axis = chain; // the longest total, so rows are directly comparable

  // The slow piece lengthens the last call in each mode by `slow`.
  const last = (i: number) => (i === count - 1 ? rtt + slow : rtt);
  const chainBars = Array.from({ length: count }, (_, i) => ({ start: i * rtt, ms: last(i) }));
  const parallelBars = Array.from({ length: count }, (_, i) => ({ start: 0, ms: last(i) }));
  const saved = chain - batched;

  return (
    <ToyFrame
      title="how long does the page wait?"
      note="A model, not a measurement: every call costs one round trip, and a chain can't start the next call until the previous one answers. Batching ties with parallel here. In real life it also saves per-request overhead and connection limits, which this toy doesn't model."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Slider label="Things the page needs" value={count} min={2} max={12} onChange={setCount} />
        <Slider label="One round trip" value={rtt} display={`${rtt} ms`} min={20} max={400} step={10} onChange={setRtt} />
        <Slider label="Slowest piece, extra" value={slow} display={`+${slow} ms`} min={0} max={600} step={20} hint="Batching waits for it." onChange={setSlow} />
      </div>

      <div className="flex flex-col gap-4">
        <Timeline name="chain" total={chain} tone="var(--state-revisit)" bars={chainBars} axis={axis} />
        <Timeline name="parallel" total={parallel} tone="var(--state-learning)" bars={parallelBars} axis={axis} />
        <Timeline name="batched" total={batched} tone="var(--state-got-it)" bars={[{ start: 0, ms: rtt + slow }]} axis={axis} />
      </div>
      <Legend
        items={[
          { color: "var(--state-revisit)", label: "chain: each call needs the last answer" },
          { color: "var(--state-learning)", label: "parallel: calls are independent" },
          { color: "var(--state-got-it)", label: "batched: one request" },
        ]}
      />

      <Stats
        items={[
          { label: "chain", value: `${count} × ${rtt}${slow ? ` + ${slow}` : ""} = ${chain} ms`, tone: "bad" },
          { label: "batched", value: `${rtt}${slow ? ` + ${slow}` : ""} = ${batched} ms`, tone: "good" },
          { label: "saved by batching", value: `${saved} ms (${Math.round((saved / chain) * 100)}%)` },
        ]}
      />
    </ToyFrame>
  );
}
