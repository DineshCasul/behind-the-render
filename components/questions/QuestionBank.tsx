"use client";

import Link from "next/link";
import { useState } from "react";
import { conceptMap } from "@/data/concepts";
import { LEVELS, questionBank, type Level } from "@/data/question-bank";

const LEVEL_COLOR: Record<Level, string> = {
  easy: "var(--state-got-it)",
  medium: "var(--state-learning)",
  hard: "var(--state-mastered)",
  tricky: "var(--state-revisit)",
};

/**
 * Filterable list of questions. Each answer is a native <details> (no state,
 * keyboard and screen-reader support for free). Only the level filter is
 * React state. Questions are ordered easy to tricky in the data, and the
 * filter keeps that order.
 */
export function QuestionBank() {
  const [level, setLevel] = useState<Level | "all">("all");
  const shown = level === "all" ? questionBank : questionBank.filter((q) => q.level === level);
  const active = LEVELS.find((l) => l.id === level);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by difficulty">
        {[{ id: "all" as const, label: "All", n: questionBank.length }, ...LEVELS.map((l) => ({ id: l.id, label: l.label, n: questionBank.filter((q) => q.level === l.id).length }))].map((f) => {
          const on = level === f.id;
          const color = f.id === "all" ? "var(--state-learning)" : LEVEL_COLOR[f.id];
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setLevel(f.id)}
              className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors"
              style={{ borderColor: on ? color : "var(--color-border)", color: on ? color : "var(--color-text-muted)" }}
            >
              {f.label} <span className="opacity-70">{f.n}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[1.25rem] text-xs text-[var(--color-text-muted)]">{active ? active.blurb : "Ordered from easiest to trickiest."}</p>

      <ol className="mt-6 flex flex-col gap-3">
        {shown.map((q) => (
          <li key={q.id}>
            <details className="group rounded-xl border border-[var(--color-border)] transition-colors open:border-[var(--state-learning)]">
              <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span className="mt-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">{String(q.id).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-widest" style={{ color: LEVEL_COLOR[q.level] }}>
                    {q.level} · {conceptMap[q.concept].title}
                  </span>
                  <span className="mt-1 block text-base font-semibold leading-snug text-[var(--color-text-primary)]">{q.question}</span>
                </span>
                <span aria-hidden className="mt-1 font-mono text-xs text-[var(--color-text-muted)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-[var(--color-border)] px-4 pb-4 pt-3">
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{q.answer}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Related topics</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {q.related.map((r) => (
                    <li key={r} className="rounded-full border border-[var(--color-border)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Learn more</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {q.learnMore.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--state-learning)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
                      >
                        {l.title} <span aria-hidden>↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/learn/${q.concept}`}
                      className="text-sm text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
                    >
                      This site&apos;s lesson: {conceptMap[q.concept].title}
                    </Link>
                  </li>
                </ul>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
