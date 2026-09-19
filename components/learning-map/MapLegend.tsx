import { STATUS_VISUALS } from "@/lib/node-visuals";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/progress";

export function MapLegend() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap gap-x-4 gap-y-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-3 py-2 backdrop-blur-sm">
      {STATUS_ORDER.map((status) => (
        <div key={status} className="flex items-center gap-1.5">
          <span
            className="text-sm leading-none"
            style={{ color: STATUS_VISUALS[status].color }}
          >
            {STATUS_VISUALS[status].glyph}
          </span>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            {STATUS_LABEL[status]}
          </span>
        </div>
      ))}
    </div>
  );
}
