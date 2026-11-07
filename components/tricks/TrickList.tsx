import Link from "next/link";
import { findChapter } from "@/data/journey";
import { hueStyle } from "@/data/road-hues";
import { tricks } from "@/data/tricks";

/** The sites a trick is told in, by name, from its journey chapters. */
function sitesFor(chapterIds: string[]): string {
  const names = chapterIds.map((id) => findChapter(id)?.road.name).filter((n): n is string => Boolean(n));
  return Array.from(new Set(names)).join(", ");
}

/** The tricks, as hairline rows. Shared by the tricks index and the home page. */
export function TrickList({ columns = 1, only }: { columns?: 1 | 2; only?: string[] }) {
  return (
    <ul className={`border-b border-[var(--color-border)] ${columns === 2 ? "grid gap-x-12 md:grid-cols-2" : "flex flex-col"}`}>
      {tricks
        .filter((t) => !only || only.includes(t.slug))
        .map((t, i) => (
        <li key={t.slug} className="row-rise border-t border-[var(--color-border)]" style={{ ...hueStyle(findChapter(t.chapters[0])?.road.hue), ["--i" as string]: i }}>
          <Link href={`/trick/${t.slug}`} className="group flex items-start gap-4 py-5 lg:py-6">
            <span
              aria-hidden
              className="row-dot mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--state-learning)]/60 transition-all group-hover:bg-[var(--state-learning)] group-hover:shadow-[0_0_14px_var(--state-learning)]"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-2xl lg:text-3xl text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--state-learning)]">
                {t.title}
              </span>
              <span className="mt-1 block text-base lg:text-lg text-[var(--color-text-muted)]">{t.hook}</span>
              <span className="mt-2 block font-mono text-[11px] lg:text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                {sitesFor(t.chapters)}
                {t.toy ? " · has a toy" : ""}
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
