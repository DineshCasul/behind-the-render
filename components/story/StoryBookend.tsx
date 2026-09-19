"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { storyMap } from "@/data/story";

/**
 * Wraps a lesson with the story that sent the reader here. The link from a
 * story step carries `?story=<step id>`; without it (arriving from the map or
 * a search engine) both bookends render nothing, so the lesson stays exactly
 * as it was.
 *
 * `useSearchParams` in a statically generated page makes React skip
 * prerendering up to the nearest Suspense boundary, so the lesson page wraps
 * this in <Suspense>: the lesson itself is still prebuilt HTML, and only this
 * small strip appears after hydration. The value is also untrusted input
 * (anyone can type any URL), so it is only used as a key into `storyMap`,
 * never rendered directly.
 */
function useStoryStep() {
  const id = useSearchParams().get("story");
  return id ? storyMap[id] ?? null : null;
}

export function StoryBookendTop() {
  const step = useStoryStep();
  if (!step) return null;
  return (
    <aside
      aria-label="Where you came from in the story"
      className="mb-8 mt-8 rounded-lg border border-[var(--state-learning)] p-4"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)]">Why you are here</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
        In the story, at <b>{step.trail}</b>: {step.problem ?? step.aside}
      </p>
      <Link
        href={`/story/${step.id}`}
        className="mt-3 inline-block font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)] underline underline-offset-4"
      >
        ← Back to the story
      </Link>
    </aside>
  );
}

export function StoryBookendBottom() {
  const step = useStoryStep();
  if (!step) return null;
  // A step with options needs you to choose; one with a plain "next" moves on.
  const href = step.next ? `/story/${step.next.to}` : `/story/${step.id}`;
  const label = step.next ? step.next.label : "Back to your options";
  return (
    <aside
      aria-label="Continue the story"
      className="mt-12 rounded-lg border border-[var(--state-revisit)] p-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-revisit)]">
        Now we have another problem
      </p>
      {step.problem && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">{step.problem}</p>
      )}
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--state-revisit)] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--state-revisit)] transition-colors hover:bg-[var(--state-revisit)] hover:text-black"
      >
        {label} <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
