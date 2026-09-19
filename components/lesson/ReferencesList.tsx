import type { Reference, ReferenceKind } from "@/data/references";
import { REFERENCES_CHECKED_AGAINST, REFERENCES_CHECKED_ON } from "@/data/references";

const KIND: Record<ReferenceKind, { label: string; color: string }> = {
  docs: { label: "Official docs", color: "var(--state-got-it)" },
  spec: { label: "Specification", color: "var(--state-mastered)" },
  "deep-dive": { label: "Deep dive", color: "var(--state-learning)" },
};

/**
 * Outbound links open in a new tab with `rel="noopener noreferrer"` so the
 * other site can't reach back into this one via `window.opener`. Server
 * Component: static links, no JavaScript needed.
 */
export function ReferencesList({ items }: { items: Reference[] }) {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {items.map((ref) => {
          const { label, color } = KIND[ref.kind];
          const host = new URL(ref.url).hostname.replace(/^www\./, "");
          return (
            <li key={ref.url}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--state-learning)]"
              >
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                    style={{ borderColor: color, color }}
                  >
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--state-learning)]">
                    {ref.title} <span aria-hidden>↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{host}</span>
                </span>
                <span className="mt-1 block text-xs leading-snug text-[var(--color-text-muted)]">{ref.why}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        Links checked on {REFERENCES_CHECKED_ON} against {REFERENCES_CHECKED_AGAINST}. Docs move and change, so if a link
        breaks, search for its title.
      </p>
    </div>
  );
}
