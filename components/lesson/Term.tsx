"use client";

import { useRef } from "react";

/** Gap kept between the card and the screen edge, in px. */
const EDGE = 8;

/**
 * A hard word with a hover/focus card holding its plain-English meaning.
 * Showing and hiding is pure CSS (Tailwind's named `group/term` variants).
 * `tabIndex={0}` makes it reachable by keyboard and tappable on phones,
 * where "hover" doesn't exist; focus shows the same card.
 *
 * Placement needs a little JavaScript: the card is centred on the word, so a
 * word near the left or right edge of a phone screen would push it off-screen.
 * When the word gets hover or focus we measure the (still invisible, but
 * laid out) card and nudge it back inside the viewport, and flip it below the
 * word if there is no room above. We write to the element directly instead of
 * using React state so there is no extra render, and so the correction is
 * applied before the card fades in.
 */
export function Term({
  children,
  term,
  meaning,
}: {
  children: React.ReactNode;
  term: string;
  meaning: string;
}) {
  const tip = useRef<HTMLSpanElement>(null);

  const place = () => {
    const el = tip.current;
    if (!el) return;
    // Measure from a clean slate: undo any earlier correction first.
    el.style.setProperty("--shift", "0px");
    el.style.bottom = "";
    el.style.top = "";
    el.style.marginBottom = "";
    el.style.marginTop = "";

    let r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    let shift = 0;
    if (r.left < EDGE) shift = EDGE - r.left;
    else if (r.right > vw - EDGE) shift = vw - EDGE - r.right;
    if (shift !== 0) el.style.setProperty("--shift", `${Math.round(shift)}px`);

    // No room above the word: show the card below it instead.
    r = el.getBoundingClientRect();
    if (r.top < EDGE) {
      el.style.bottom = "auto";
      el.style.top = "100%";
      el.style.marginBottom = "0";
      el.style.marginTop = "0.5rem";
    }
  };

  return (
    <span
      tabIndex={0}
      onMouseEnter={place}
      onFocus={place}
      className="vibrate-on-hover group/term relative cursor-help border-b border-dotted border-[var(--state-learning)]/70 outline-none focus-visible:border-solid"
    >
      {children}
      <span
        ref={tip}
        role="tooltip"
        // Centre on the word, plus whatever correction `place` worked out.
        style={{ maxWidth: "calc(100vw - 16px)", transform: "translateX(calc(-50% + var(--shift, 0px)))" }}
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-40 mb-2 block w-60 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 text-left text-xs font-normal not-italic leading-snug tracking-normal text-[var(--color-text-primary)] opacity-0 shadow-xl transition-opacity duration-150 group-hover/term:visible group-hover/term:opacity-100 group-focus/term:visible group-focus/term:opacity-100"
      >
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wide text-[var(--state-learning)]">
          {term}
        </span>
        {meaning}
      </span>
    </span>
  );
}
