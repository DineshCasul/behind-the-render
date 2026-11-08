import { ROAD_KINDS, TRICK_GROUPS } from "@/data/categories";
import { findChapter, journeys } from "@/data/journey";
import { trickKeywords } from "@/data/trick-keywords";
import { tricks } from "@/data/tricks";
import { Grouped, type Row } from "@/components/ui/Rows";
import { TrickBrowser, type SearchRow } from "@/components/ui/TrickBrowser";

const siteRows: Row[] = journeys.map((j) => ({
  href: `/journey/${j.id}`,
  title: j.name,
  desc: j.blurb,
  meta: `${j.chapters.length} ${j.chapters.length === 1 ? "chapter" : "chapters"}`,
  group: j.kind,
}));

const groupTitle = Object.fromEntries(TRICK_GROUPS.map((g) => [g.id, g.title]));

const trickRows: SearchRow[] = tricks.map((t) => {
  const meta = Array.from(new Set(t.chapters.map((id) => findChapter(id)?.road.name).filter(Boolean))).join(", ");
  return {
    href: `/trick/${t.slug}`,
    title: t.title,
    desc: t.hook,
    meta,
    group: t.group,
    stat: t.stat ? `${t.stat.value}` : undefined,
    // What the filter searches: everything a reader might type to find this trick.
    search: [t.title, t.hook, meta, groupTitle[t.group], ...(trickKeywords[t.slug] ?? [])].join(" ").toLowerCase(),
  };
});

export const SiteIndex = () => <Grouped groups={ROAD_KINDS} rows={siteRows} />;
export const TrickIndex = () => <TrickBrowser groups={TRICK_GROUPS} rows={trickRows} />;
