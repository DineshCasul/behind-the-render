import type { Tradeoff } from "@/lib/types";
import { Prose } from "@/components/lesson/Prose";

export function TradeoffsGrid({ tradeoffs }: { tradeoffs: Tradeoff[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tradeoffs.map((t) => (
        <div key={t.label} className="rounded-lg border border-[var(--state-revisit)]/30 p-3">
          <p className="text-sm font-semibold text-[var(--state-revisit)]">{t.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]"><Prose text={t.note} /></p>
        </div>
      ))}
    </div>
  );
}
