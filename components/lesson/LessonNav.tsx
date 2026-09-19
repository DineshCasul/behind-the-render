"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";

export interface NavSection {
  id: string;
  label: string;
}

/**
 * Two things that tell you where you are in a long lesson:
 *
 * 1. A slim bar that slides in once the big title has scrolled away, so the
 *    title (and current section) stays visible, with a reading-progress line.
 * 2. A "map" of the sections: a rail on wide screens, a strip of dots inside
 *    the bar on narrower ones. The active section follows your scroll.
 *
 * Positioning uses `position: sticky` on zero-height wrappers, not
 * `position: fixed`: the page-transition wrapper applies a transform while it
 * animates in, and a transformed ancestor becomes the containing block for
 * fixed descendants (they'd ride along, then snap). Sticky has no such
 * problem, and the zero height means the bar appearing never shifts layout.
 */
export function LessonNav({ title, sections }: { title: string; sections: NavSection[] }) {
  const reduceMotion = useReducedMotion();
  const [showBar, setShowBar] = useState(false);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const frame = useRef<number | null>(null);

  // Reading progress as a motion value: it drives `scaleX` directly, so
  // scrolling never triggers a React re-render for the progress line.
  const { scrollYProgress } = useScroll();

  const measure = useCallback(() => {
    frame.current = null;
    const header = document.getElementById("lesson-top");
    setShowBar(header ? header.getBoundingClientRect().bottom < 0 : window.scrollY > 200);

    // Active section = the last one whose top has passed the reading line.
    let current = sections[0]?.id ?? "";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= 140) current = s.id;
    }
    // Short final sections may never reach the reading line; at the very
    // bottom of the page, treat the last one as active.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1]?.id ?? current;
    }
    setActiveId(current); // React skips the render when the value is unchanged
  }, [sections]);

  useEffect(() => {
    // Throttle to one measurement per animation frame.
    const onScroll = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(measure);
    };
    onScroll(); // first measurement, scheduled for the next frame (no synchronous setState in the effect)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        // Reset the marker too. React (StrictMode, dev) runs effect cleanup and
        // setup again on every fresh mount, so a stale non-null value here made
        // the next setup think a frame was still pending, and it never scheduled
        // another measurement: the bar and map went dead after a reload or a
        // client-side navigation.
        frame.current = null;
      }
    };
  }, [measure]);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  const active = sections[activeIndex];

  return (
    <>
      {/* The slim top bar: zero-height sticky wrapper, panel absolutely positioned inside. */}
      <div className="sticky top-0 z-30 h-0">
        <div
          aria-hidden={!showBar}
          className="absolute inset-x-0 top-0 border-b border-[var(--color-border)] bg-[var(--color-bg)] transition-[transform,opacity] duration-300 ease-out"
          style={{
            transform: showBar ? "translateY(0)" : "translateY(-100%)",
            opacity: showBar ? 1 : 0,
            pointerEvents: showBar ? "auto" : "none",
          }}
        >
          {/* Full width (not the centred text column) so the title can sit at the true right edge. */}
          <div className="flex h-11 items-center gap-3 px-6 sm:px-8">
            <Link
              href="/?to=map"
              tabIndex={showBar ? 0 : -1}
              className="shrink-0 font-mono text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              ← Map
            </Link>
            {active && (
              <span className="hidden min-w-0 items-center gap-2 sm:flex">
                <span className="text-[var(--color-text-muted)]">/</span>
                <span className="truncate font-mono text-[11px] text-[var(--state-learning)]">{active.label}</span>
              </span>
            )}

            {/* Dot map for screens too narrow for the side rail. */}
            <div className="ml-auto flex shrink-0 items-center gap-1 min-[1320px]:hidden">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id)}
                  tabIndex={showBar ? 0 : -1}
                  title={s.label}
                  aria-label={`Jump to ${s.label}`}
                  aria-current={s.id === activeId ? "true" : undefined}
                  className="block h-3 w-2 rounded-full transition-colors sm:w-2.5"
                  style={{
                    backgroundColor:
                      s.id === activeId
                        ? "var(--state-learning)"
                        : i < activeIndex
                          ? "color-mix(in srgb, var(--state-learning) 45%, transparent)"
                          : "var(--color-border)",
                  }}
                />
              ))}
            </div>

            {/* The lesson title, pinned to the far right of the bar. */}
            <span className="ml-2 max-w-[45%] truncate text-right text-sm font-semibold text-[var(--color-text-primary)] min-[1320px]:ml-auto">
              {title}
            </span>
          </div>

          {/* Reading progress: a scaleX transform, so it never causes layout. */}
          <motion.div
            className="h-0.5 origin-left bg-[var(--state-learning)]"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>

      {/* The section map rail: only where there is room beside the centred column. */}
      <div className="sticky top-0 z-20 hidden h-0 min-[1320px]:block">
        <nav
          aria-label="On this page"
          className="absolute top-24 w-52"
          style={{ left: "calc(50% + 24rem + 1.5rem)" }}
        >
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            On this page
          </p>
          <ol className="flex flex-col border-l border-[var(--color-border)]">
            {sections.map((s, i) => {
              const isActive = s.id === activeId;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => go(e, s.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="-ml-px flex items-baseline gap-2 border-l-2 py-1 pl-3 text-xs transition-colors hover:text-[var(--color-text-primary)]"
                    style={{
                      borderColor: isActive ? "var(--state-learning)" : "transparent",
                      color: isActive ? "var(--state-learning)" : "var(--color-text-muted)",
                    }}
                  >
                    <span className="w-4 shrink-0 font-mono text-[10px] opacity-70">{i + 1}</span>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
