import { STATUS_VISUALS } from "@/lib/node-visuals";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/progress";

/**
 * `inline` puts the legend in normal flow (used under the phone map); the
 * default floats it over the corner of the wide map. Floating a legend over a
 * small map covers nodes and collides with the panel, so phones use inline.
 */
export function MapLegend({ inline = false }: { inline?: boolean }) {
  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-3 py-2 ${
        inline ? "mt-3" : "pointer-events-none absolute bottom-8 left-6 z-10"
      }`}
    >
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
