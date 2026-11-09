"use client";

import { useEffect, useRef } from "react";

/**
 * A section that starts folded: the heading, a one-line description of what is inside, and a small
 * summary of its parts (examples, toys, questions) stay visible; the rest opens on click.
 *
 * It is a native <details>, so it works without JavaScript and is keyboard accessible. The small
 * effect only makes links like #web-memory open the section they point to, because a browser does
 * not do that for an id on the <details> itself.
 */
export function Fold({
  id,
  number,
  title,
  blurb,
  meta,
  defaultOpen = false,
  children,
}: {
  id: string;
  number: number;
  title: string;
  blurb: string;
  meta: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openIfTarget = () => {
      if (window.location.hash === `#${id}` && ref.current) {
        ref.current.open = true;
        requestAnimationFrame(() => ref.current?.scrollIntoView());
      }
    };
    openIfTarget();
    window.addEventListener("hashchange", openIfTarget);
    return () => window.removeEventListener("hashchange", openIfTarget);
  }, [id]);

  return (
    <details ref={ref} id={id} open={defaultOpen} className="draw-rule group/fold scroll-mt-6 border-t border-[var(--color-border)]">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-[var(--color-text-primary)] group-hover/fold:text-[var(--state-learning)]">
            <span className="text-[var(--state-learning)]">## </span>
            {number}. {title.toLowerCase()}
          </span>
          <span className="read mt-1 block !text-base">{blurb}</span>
          <span className="label mt-1 block">{meta}</span>
        </span>
        <span aria-hidden className="shrink-0 pt-0.5 text-sm text-[var(--color-text-muted)] group-hover/fold:text-[var(--state-learning)]">
          <span className="group-open/fold:hidden">open +</span>
          <span className="hidden group-open/fold:inline">close −</span>
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
