"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkPending } from "@/components/ui/LinkPending";

/** What the home page needs from a trick: the big number, the line under it, and where it links. */
export interface Featured {
  slug: string;
  title: string;
  hook: string;
  stat: string;
}

/**
 * The big green number on the home page. The page is pre-built, so the server cannot pick a different trick for
 * each visit; the browser does, once the page has loaded. Until then the block is invisible (it still holds its
 * place, so nothing jumps), then it fades in once with the chosen trick. The server's choice (`initial`, the
 * trick of the day) is what you get with JavaScript off, and the one a search engine reads.
 *
 * It avoids showing the same trick twice in a row within a tab, using sessionStorage if the browser allows it.
 */
export function FeaturedTrick({ items, initial }: { items: Featured[]; initial: number }) {
  const [index, setIndex] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Choosing in a timer callback, not straight in the effect, so React is not asked to re-render synchronously.
    // (A timer rather than requestAnimationFrame: frames are not delivered to background tabs.)
    const timer = setTimeout(() => {
      let last = -1;
      try {
        last = Number(sessionStorage.getItem("web-lore-featured") ?? -1);
      } catch {
        // Private windows can refuse storage; a repeat is harmless.
      }
      let next = Math.floor(Math.random() * items.length);
      if (items.length > 1 && next === last) next = (next + 1) % items.length;
      try {
        sessionStorage.setItem("web-lore-featured", String(next));
      } catch {}
      setIndex(next);
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [items.length]);

  const f = items[index];
  return (
    <>
      {/* With JavaScript off the block is never revealed by the effect, so reveal it here. */}
      <noscript>
        <style>{".featured-trick { opacity: 1 !important; }"}</style>
      </noscript>
      <Link
        href={`/trick/${f.slug}`}
        data-ready={ready}
        className={`featured-trick featured-bar group mt-14 block pl-4 transition-opacity duration-300 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <span className="block text-3xl tabular-nums text-[var(--state-got-it)] sm:text-5xl">{f.stat}</span>
        <span className="read mt-2 block min-h-[3.4em] !text-lg !text-[var(--color-text-primary)] sm:min-h-[1.7em] sm:!text-xl">{f.hook}</span>
        <span className="label mt-2 block group-hover:text-[var(--state-learning)]">
          {f.title.toLowerCase()} →<LinkPending />
        </span>
      </Link>
    </>
  );
}
