import type { NextUp } from "@/data/next-up";

/**
 * "Learn this next": the harder ideas this concept leads to. Server
 * Component (static links, no JavaScript). External links open in a new
 * tab with `rel="noopener noreferrer"`, like ReferencesList.
 */
export function NextUpList({ items }: { items: NextUp[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-[var(--state-mastered)]">
        Learn this next
      </h3>
      <p className="mb-3 text-xs text-[var(--color-text-muted)]">
        Once this makes sense, these are the more advanced ideas worth learning.
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--state-mastered)]"
            >
              <span className="text-sm font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--state-mastered)]">
                {item.topic} <span aria-hidden>↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
              <span className="mt-1 block text-xs leading-snug text-[var(--color-text-muted)]">{item.why}</span>
              {item.caveat && (
                <span className="mt-1 block text-[11px] leading-snug text-[var(--state-revisit)]">Note: {item.caveat}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
