"use client";

import Link from "next/link";
import { useState } from "react";
import { bankItems, type BankGroup } from "@/data/bank-items";
import { LEVELS, type Level } from "@/data/question-bank";

const LEVEL_COLOR: Record<Level, string> = {
  easy: "var(--state-got-it)",
  medium: "var(--state-learning)",
  hard: "var(--state-mastered)",
  tricky: "var(--state-revisit)",
};

const GROUPS: { id: BankGroup | "all"; label: string; blurb: string }[] = [
  { id: "tricks", label: "Tricks", blurb: "What real sites do, from the companies' own words." },
  { id: "foundations", label: "Foundations", blurb: "How the web renders, the ideas the tricks build on." },
  { id: "all", label: "All", blurb: "Tricks first, then foundations." },
];

function Pill({ on, color, onClick, children }: { on: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors"
      style={{ borderColor: on ? color : "var(--color-border)", color: on ? color : "var(--color-text-muted)" }}
    >
      {children}
    </button>
  );
}

/**
 * Filterable list of questions, from two places: the tricks (new) and the
 * foundations (the rendering questions). Each answer is a native <details> (no
 * state, keyboard and screen-reader support for free). Only the two filters
 * are React state. Within a group the data is already ordered easy to tricky,
 * and the filters keep that order.
 */
export function QuestionBank() {
  const [group, setGroup] = useState<BankGroup | "all">("tricks");
  const [level, setLevel] = useState<Level | "all">("all");

  const inGroup = group === "all" ? bankItems : bankItems.filter((q) => q.group === group);
  const shown = level === "all" ? inGroup : inGroup.filter((q) => q.level === level);
  const levelBlurb = LEVELS.find((l) => l.id === level)?.blurb;
  const groupBlurb = GROUPS.find((g) => g.id === group)?.blurb;

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Topic</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        {GROUPS.map((g) => (
          <Pill key={g.id} on={group === g.id} color="var(--state-learning)" onClick={() => setGroup(g.id)}>
            {g.label} <span className="opacity-70">{g.id === "all" ? bankItems.length : bankItems.filter((q) => q.group === g.id).length}</span>
          </Pill>
        ))}
      </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Level</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by difficulty">
        <Pill on={level === "all"} color="var(--state-learning)" onClick={() => setLevel("all")}>
          Any level
        </Pill>
        {LEVELS.map((l) => (
          <Pill key={l.id} on={level === l.id} color={LEVEL_COLOR[l.id]} onClick={() => setLevel(l.id)}>
            {l.label} <span className="opacity-70">{inGroup.filter((q) => q.level === l.id).length}</span>
          </Pill>
        ))}
      </div>
        <p className="mt-2 text-sm leading-snug text-[var(--color-text-muted)]">{levelBlurb ?? groupBlurb}</p>
        <p className="font-mono text-xs tracking-widest text-[var(--color-text-muted)]" aria-live="polite">
          {shown.length} shown
        </p>
      </aside>

      <ol className="flex min-w-0 flex-col gap-3">
        {shown.map((q, i) => (
          <li key={q.key}>
            <details
              className="group row-rise rounded-xl border border-l-4 border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50 transition-colors hover:bg-[var(--color-bg-elevated)] open:bg-[var(--color-bg-elevated)]"
              style={{ borderLeftColor: LEVEL_COLOR[q.level], ["--i" as string]: Math.min(i, 8) }}
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span className="mt-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-mono text-[11px] uppercase tracking-widest" style={{ color: LEVEL_COLOR[q.level] }}>
                    {q.level} · {q.label}
                  </span>
                  <span className="mt-1 block text-lg font-semibold leading-snug lg:text-xl text-[var(--color-text-primary)]">{q.question}</span>
                </span>
                <span aria-hidden className="mt-1 font-mono text-xs text-[var(--color-text-muted)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="grid gap-x-10 gap-y-2 border-t border-[var(--color-border)] px-5 pb-5 pt-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <p className="text-base leading-relaxed text-[var(--color-text-primary)] lg:text-lg">{q.answer}</p>
                <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Related topics</p>
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
                        className="text-base text-[var(--state-learning)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
                      >
                        {l.title} <span aria-hidden>↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link href={q.lesson.href} className="text-base text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-text-primary)]">
                      {q.lesson.title}
                    </Link>
                  </li>
                </ul>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
