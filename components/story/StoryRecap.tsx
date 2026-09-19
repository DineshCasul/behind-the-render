"use client";

import Link from "next/link";
import { useJourney } from "@/lib/story-journey";
import { storyMap } from "@/data/story";

/** The four rendering-strategy branches, so the recap can say which were never tried. */
const BRANCHES = ["path-csr", "path-ssr", "path-ssg", "path-isr"];

/**
 * End-of-story recap: the path you took and the branches you skipped.
 * Reads the per-reader journey from localStorage, so it renders nothing
 * useful on the server and fills in after hydration.
 */
export function StoryRecap() {
  const { path } = useJourney();
  const skipped = BRANCHES.filter((id) => !path.includes(id));

  if (path.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-[var(--color-border)] p-5" aria-label="Your run">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)]">Your run</p>
      <p className="mt-2 text-sm text-[var(--color-text-primary)]">
        You visited {path.length} {path.length === 1 ? "scene" : "scenes"}:{" "}
        <span className="text-[var(--color-text-muted)]">{path.map((id) => storyMap[id]?.trail ?? id).join(" → ")}</span>
      </p>
      {skipped.length > 0 ? (
        <>
          <p className="mt-4 text-sm text-[var(--color-text-primary)]">
            Not on your current path: {skipped.length === 1 ? "this way" : "these ways"} of building the page. Each one
            creates a different problem:
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {skipped.map((id) => (
              <li key={id}>
                <Link
                  href={`/story/${id}`}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1.5 font-mono text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--state-learning)] hover:text-[var(--state-learning)]"
                >
                  {storyMap[id].trail}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-text-primary)]">
          Your path went through all four ways of building the page. That is the whole point: none of them wins everywhere.
        </p>
      )}
    </section>
  );
}
