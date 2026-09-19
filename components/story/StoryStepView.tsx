import Link from "next/link";
import { Prose } from "@/components/lesson/Prose";
import { JourneyTrail } from "@/components/story/JourneyTrail";
import { StoryRecap } from "@/components/story/StoryRecap";
import { StoryVisual } from "@/components/story/StoryVisual";
import { conceptMap } from "@/data/concepts";
import { MOOD, STORY_START, storySteps, type StoryStep } from "@/data/story";

const LABELS = Object.fromEntries(storySteps.map((s) => [s.id, s.trail]));

const label = "font-mono text-[11px] uppercase tracking-widest";

/**
 * One page of the story. A Server Component: the narrative is static and
 * fully present in the HTML. Only the trail (per-reader, from localStorage)
 * is a Client Component.
 */
export function StoryStepView({ step }: { step: StoryStep }) {
  const mood = MOOD[step.mood];
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      <JourneyTrail currentId={step.id} isStart={step.id === STORY_START} labels={LABELS} />

      <p className={`${label} mt-10`} style={{ color: mood.color }}>
        {mood.label}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {step.title}
      </h1>
      <p className="mt-3 text-sm italic text-[var(--color-text-muted)]">{step.aside}</p>

      <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-[var(--color-text-primary)]">
        {step.scene.map((p, i) => (
          <p key={i} className="reveal-fade" style={{ "--delay": `${0.15 + i * 0.25}s` } as React.CSSProperties}>
            <Prose text={p} />
          </p>
        ))}
      </div>

      {step.visual && (
        <div className="mt-8">
          <StoryVisual spec={step.visual} />
        </div>
      )}

      {step.id === "the-end" && <StoryRecap />}

      {step.problem && (
        <div className="mt-8 rounded-lg border border-[var(--state-revisit)] p-4">
          <p className={`${label} text-[var(--state-revisit)]`}>The problem this creates</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">{step.problem}</p>
        </div>
      )}

      {step.options && (
        <section className="mt-10" aria-label="Your options">
          <p className={`${label} text-[var(--state-learning)]`}>Your options</p>
          <ul className="mt-3 flex flex-col gap-3">
            {step.options.map((o) => (
              <li key={o.label}>
                <Link
                  href={`/story/${o.to}`}
                  className="group block rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--state-learning)]"
                >
                  <span className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--state-learning)]">
                    {o.label} <span aria-hidden>→</span>
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-[var(--color-text-primary)]">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-got-it)]">Pitch </span>
                    {o.pitch}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-[var(--color-text-muted)]">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-revisit)]">Cost </span>
                    {o.cost}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step.next && (
        <Link
          href={`/story/${step.next.to}`}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--state-learning)] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--state-learning)] transition-colors hover:bg-[var(--state-learning)] hover:text-black"
        >
          {step.next.label} <span aria-hidden>→</span>
        </Link>
      )}

      {step.concepts.length > 0 && (
        <section className="mt-14" aria-label="Under the hood">
          <p className={`${label} text-[var(--color-text-muted)]`}>Under the hood: why these came up now</p>
          <ul className="mt-3 flex flex-col gap-2">
            {step.concepts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/learn/${c.id}`}
                  className="group block rounded-lg border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--state-got-it)]"
                >
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--state-got-it)]">
                    {conceptMap[c.id].title} <span aria-hidden>↗</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-[var(--color-text-muted)]">{c.why}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step.comingSoon && (
        <section className="mt-8" aria-label="Coming soon">
          <p className={`${label} text-[var(--color-text-muted)]`}>Not a lesson yet</p>
          <ul className="mt-3 flex flex-col gap-2">
            {step.comingSoon.map((c) => (
              <li key={c.topic} className="rounded-lg border border-dashed border-[var(--color-border)] p-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">{c.topic}</span>
                <span className="mt-0.5 block text-xs leading-snug text-[var(--color-text-muted)]">{c.why}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 text-xs text-[var(--color-text-muted)]">
        <Link href="/?to=map" className="underline underline-offset-4 hover:text-[var(--color-text-primary)]">
          Or explore every concept on the map
        </Link>
      </p>
    </div>
  );
}
