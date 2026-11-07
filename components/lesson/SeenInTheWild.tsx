import Link from "next/link";
import { DocQuoteList } from "@/components/tricks/DocQuoteList";
import type { JourneyApp, JourneyChapter } from "@/data/journey";

/**
 * "Seen in the wild": the real sites whose journey chapter is the short version
 * of this lesson's concept, with the verbatim quotes and links from that
 * chapter. Computed from the journey data, so there is nothing to keep in sync.
 */
export function SeenInTheWild({ entries }: { entries: { road: JourneyApp; chapter: JourneyChapter }[] }) {
  return (
    <ul className="flex flex-col gap-7">
      {entries.map(({ road, chapter }) => (
        <li key={chapter.id}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)]">
            <Link href={`/journey/${road.id}`} className="underline underline-offset-4">
              {road.name}
            </Link>{" "}
            · {chapter.title}
          </p>
          <div className="mt-3">
            <DocQuoteList quotes={chapter.docs} />
          </div>
          {chapter.note && <p className="mt-2 text-xs leading-snug text-[var(--color-text-muted)]">{chapter.note}</p>}
          {chapter.trick && (
            <Link
              href={`/trick/${chapter.trick}`}
              className="mt-2 inline-block font-mono text-[11px] uppercase tracking-widest text-[var(--state-got-it)] underline underline-offset-4"
            >
              The trick behind it →
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
