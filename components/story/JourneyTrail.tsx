"use client";

import { useEffect } from "react";
import { useJourney } from "@/lib/story-journey";

/**
 * "Where am I, and how did I get here?" The trail is the path this reader
 * has walked (kept in localStorage), so it differs per reader and is empty
 * in the server-rendered HTML. It also records the current step: an effect
 * is right here because it synchronizes with an external system
 * (localStorage), not because we're computing anything to render.
 */
export function JourneyTrail({
  currentId,
  isStart,
  labels,
}: {
  currentId: string;
  isStart: boolean;
  labels: Record<string, string>;
}) {
  const { path, visit } = useJourney();

  useEffect(() => {
    visit(currentId, isStart);
  }, [currentId, isStart, visit]);

  // Before the effect has run (and on the server) the trail is just "here".
  const shown = path.includes(currentId) ? path : [...path, currentId];

  return (
    <nav aria-label="Your path through the story" className="overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-2 font-mono text-[11px]">
        {shown.map((id, i) => {
          const here = id === currentId;
          return (
            <li key={id} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-[var(--color-text-muted)]">/</span>}
              {here ? (
                <span aria-current="step" className="rounded-full border border-[var(--state-learning)] px-2.5 py-1 text-[var(--state-learning)]">
                  {labels[id] ?? id}
                </span>
              ) : (
                <a href={`/story/${id}`} className="text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text-primary)] hover:underline">
                  {labels[id] ?? id}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
