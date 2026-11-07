import Link from "next/link";
import { journeys } from "@/data/journey";
import { hueStyle } from "@/data/road-hues";

/**
 * The roads, as hairline rows (not cards), so it reads like a menu in a game.
 * Shared by the road chooser and the home page. A Server Component: just links.
 */
export function RoadList({ columns = 1, only }: { columns?: 1 | 2; only?: string[] }) {
  return (
    <ul className={`border-b border-[var(--color-border)] ${columns === 2 ? "grid gap-x-12 md:grid-cols-2" : "flex flex-col"}`}>
      {journeys
        .filter((j) => !only || only.includes(j.id))
        .map((j, i) => (
        <li key={j.id} className="row-rise border-t border-[var(--color-border)]" style={{ ...hueStyle(j.hue), ["--i" as string]: i }}>
          <Link href={`/journey/${j.id}`} className="group flex items-start gap-4 py-5 lg:py-6">
            <span
              aria-hidden
              className="row-dot mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--state-learning)]/60 transition-all group-hover:bg-[var(--state-learning)] group-hover:shadow-[0_0_14px_var(--state-learning)]"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-2xl lg:text-3xl text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--state-learning)]">
                {j.name}
              </span>
              <span className="mt-1 block text-base lg:text-lg text-[var(--color-text-muted)]">{j.blurb}</span>
              <span className="mt-2 block font-mono text-[11px] lg:text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                {j.chapters.length} chapters · {j.sources}
              </span>
            </span>
            <span aria-hidden className="mt-1.5 font-mono text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--state-learning)]">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
