import Link from "next/link";
import { RoadList } from "@/components/journey/RoadList";
import { TrickList } from "@/components/tricks/TrickList";
import { journeys } from "@/data/journey";
import { ROAD_KINDS, TRICK_GROUPS, type Group } from "@/data/categories";
import { tricks } from "@/data/tricks";

/** A group's heading: a coloured bar, its name and one line saying what it is. */
function GroupHeading({ group, total, shown, href }: { group: Group; total: number; shown: number; href: string }) {
  return (
    <div className="flex items-baseline gap-4 border-l-4 pl-4" style={{ borderColor: group.hue }}>
      <h3 className="font-serif text-xl lg:text-2xl" style={{ color: group.hue }}>
        {group.title}
      </h3>
      {group.blurb && <p className="hidden text-sm text-[var(--color-text-muted)] sm:block">{group.blurb}</p>}
      {shown < total && (
        <Link href={href} className="ml-auto shrink-0 font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
          All {total} →
        </Link>
      )}
    </div>
  );
}

/**
 * Items filed under their group, in the order they were added. `limit` caps
 * how many show per group (the home page uses it so it stays short however
 * much content there is); a group with nothing in it is not shown at all.
 */
function Groups<T>({
  groups,
  items,
  groupOf,
  idOf,
  limit,
  seeAll,
  render,
}: {
  groups: readonly Group[];
  items: T[];
  groupOf: (item: T) => string;
  idOf: (item: T) => string;
  limit?: number;
  seeAll: string;
  render: (ids: string[]) => React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((g) => {
        const ids = items.filter((i) => groupOf(i) === g.id).map(idOf);
        if (ids.length === 0) return null;
        const shown = limit ? ids.slice(0, limit) : ids;
        return (
          <section key={g.id} id={g.id} aria-label={g.title} className="scroll-mt-8">
            <GroupHeading group={g} total={ids.length} shown={shown.length} href={`${seeAll}#${g.id}`} />
            <div className="mt-3">{render(shown)}</div>
          </section>
        );
      })}
    </div>
  );
}

/** The roads, grouped by the kind of site. Server Component: just links. */
export function GroupedRoads({ limit }: { limit?: number }) {
  return (
    <Groups
      groups={ROAD_KINDS}
      items={journeys}
      groupOf={(j) => j.kind}
      idOf={(j) => j.id}
      limit={limit}
      seeAll="/journey"
      render={(ids) => <RoadList only={ids} columns={2} />}
    />
  );
}

/** The tricks, grouped by the problem they solve. */
export function GroupedTricks({ limit }: { limit?: number }) {
  return (
    <Groups
      groups={TRICK_GROUPS}
      items={tricks}
      groupOf={(t) => t.group}
      idOf={(t) => t.slug}
      limit={limit}
      seeAll="/trick"
      render={(ids) => <TrickList only={ids} columns={2} />}
    />
  );
}
