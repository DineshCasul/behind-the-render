/** Fade and slide between steps; off for people who ask for reduced motion. */
export const T = "transition-all duration-700 motion-reduce:transition-none";
export const MONO = { fontFamily: "var(--font-mono)" } as const;

/**
 * The box every journey diagram sits in: a title, the drawing, a caption that
 * says what this step shows, and the note that the drawing is ours. The `role`
 * and label give screen readers the same sentence the caption shows.
 */
export function Frame({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={`${title}. ${caption}`} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-[0_14px_14px_-6px_var(--color-bg)] lg:bg-[var(--color-bg-elevated)]/90 lg:p-5 lg:shadow-none">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--state-learning)] lg:text-xs">{title}</p>
      <svg viewBox="0 0 340 220" className="mx-auto mt-2 block max-h-[24svh] w-full lg:max-h-none" aria-hidden>
        {children}
      </svg>
      <p className="mt-3 min-h-[3.2em] text-[13px] leading-snug text-[var(--color-text-primary)] lg:text-lg">{caption}</p>
      <p className="mt-2 text-[11px] leading-snug text-[var(--color-text-muted)] lg:text-xs">Illustration: the numbers come from the source, the drawing is ours.</p>
    </div>
  );
}

/** A small right-pointing arrow from (x1, y) to (x2, y). */
export function HArrow({ x1, x2, y, color = "var(--color-text-muted)" }: { x1: number; x2: number; y: number; color?: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 5} y2={y} stroke={color} strokeWidth={1.5} />
      <polygon points={`${x2},${y} ${x2 - 7},${y - 3.5} ${x2 - 7},${y + 3.5}`} fill={color} />
    </g>
  );
}
