import type { Misconception } from "@/lib/types";
import { Prose } from "@/components/lesson/Prose";

export function MisconceptionsList({ items }: { items: Misconception[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((m, i) => (
        <div key={i} className="rounded-lg bg-[var(--color-bg-elevated)]/60 p-3">
          <p className="text-sm text-[var(--color-text-muted)] line-through decoration-[var(--state-revisit)]/60">
            {m.claim}
          </p>
          <p className="mt-1.5 text-sm text-[var(--color-text-primary)]">
            <span className="text-[var(--state-got-it)]">✦</span> <Prose text={m.reality} />
          </p>
        </div>
      ))}
    </div>
  );
}
