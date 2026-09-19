/**
 * A hard word with a hover/focus card holding its plain-English meaning.
 * Pure CSS (Tailwind's named `group/term` variants): no state, no JS, so
 * it stays a Server Component and adds nothing to the client bundle.
 * `tabIndex={0}` makes it reachable by keyboard and tappable on phones,
 * where "hover" doesn't exist; focus shows the same card.
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
  return (
    <span
      tabIndex={0}
      className="vibrate-on-hover group/term relative cursor-help border-b border-dotted border-[var(--state-learning)]/70 outline-none focus-visible:border-solid"
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-40 mb-2 block w-60 -translate-x-1/2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 text-left text-xs font-normal not-italic leading-snug tracking-normal text-[var(--color-text-primary)] opacity-0 shadow-xl transition-opacity duration-150 group-hover/term:visible group-hover/term:opacity-100 group-focus/term:visible group-focus/term:opacity-100"
      >
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wide text-[var(--state-learning)]">
          {term}
        </span>
        {meaning}
      </span>
    </span>
  );
}
