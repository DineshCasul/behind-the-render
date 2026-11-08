import Link from "next/link";
import { ROAD_KINDS, TRICK_GROUPS } from "@/data/categories";
import { findChapter, journeys } from "@/data/journey";
import { tricks } from "@/data/tricks";

interface Row {
  href: string;
  title: string;
  desc: string;
  meta: string;
  group: string;
  /** A number worth remembering, shown under the title (tricks only). */
  stat?: string;
}

/** One `ls`-style line: a marker, the name, a one-line description, and a dim meta column. */
function Rows({ rows }: { rows: Row[] }) {
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.href}>
          <Link href={r.href} className="group grid gap-x-4 py-1.5 sm:grid-cols-[22rem_1fr_auto]">
            <span className="text-[var(--color-text-primary)] group-hover:text-[var(--state-learning)]">
              <span className="text-[var(--color-text-muted)] group-hover:text-[var(--state-learning)]">&gt; </span>
              {r.title}
              {r.stat && <span className="block pl-[1.2ch] text-sm text-[var(--state-got-it)]">{r.stat}</span>}
            </span>
            <span className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]">{r.desc}</span>
            <span className="text-[var(--color-text-muted)] sm:text-right">{r.meta}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Grouped({ groups, rows }: { groups: readonly { id: string; title: string }[]; rows: Row[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((g) => {
        const own = rows.filter((r) => r.group === g.id);
        if (own.length === 0) return null;
        return (
          <section key={g.id} aria-label={g.title}>
            <h2 className="label mb-1"># {g.title.toLowerCase()}</h2>
            <Rows rows={own} />
          </section>
        );
      })}
    </div>
  );
}

const siteRows: Row[] = journeys.map((j) => ({
  href: `/journey/${j.id}`,
  title: j.name,
  desc: j.blurb,
  meta: `${j.chapters.length} ${j.chapters.length === 1 ? "chapter" : "chapters"}`,
  group: j.kind,
}));

const trickRows: Row[] = tricks.map((t) => ({
  href: `/trick/${t.slug}`,
  title: t.title,
  desc: t.hook,
  meta: Array.from(new Set(t.chapters.map((id) => findChapter(id)?.road.name).filter(Boolean))).join(", "),
  group: t.group,
  stat: t.stat ? `${t.stat.value}` : undefined,
}));

export const SiteIndex = () => <Grouped groups={ROAD_KINDS} rows={siteRows} />;
export const TrickIndex = () => <Grouped groups={TRICK_GROUPS} rows={trickRows} />;
