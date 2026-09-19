import Link from "next/link";
import type { Concept } from "@/lib/types";
import { categoryLabels, PIPELINE_STAGE_LABEL, PIPELINE_STAGE_ORDER } from "@/data/concepts";
import { LessonProgressControl } from "@/components/lesson/LessonProgressControl";

export function LessonHeader({ concept }: { concept: Concept }) {
  return (
    <header id="lesson-top">
      <Link
        href="/?to=map"
        className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        ← Back to map
      </Link>

      {/* Phones: just where this lesson sits, on one line. The full five-stage chain wrapped onto three lines. */}
      <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] sm:hidden">
        Stage {PIPELINE_STAGE_ORDER.indexOf(concept.stage) + 1} of {PIPELINE_STAGE_ORDER.length}:{" "}
        <span className="text-[var(--state-learning)]">{PIPELINE_STAGE_LABEL[concept.stage]}</span>
      </p>

      <nav className="mt-4 hidden flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] sm:flex">
        {PIPELINE_STAGE_ORDER.map((stage, i) => (
          <span key={stage} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>→</span>}
            <span className={stage === concept.stage ? "text-[var(--state-learning)]" : undefined}>
              {PIPELINE_STAGE_LABEL[stage]}
            </span>
          </span>
        ))}
      </nav>

      <p className="mt-4 font-mono text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
        {categoryLabels[concept.category]}
      </p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
        {concept.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)]">{concept.blurb}</p>

      <div className="mt-5">
        <LessonProgressControl conceptId={concept.id} />
      </div>
    </header>
  );
}
