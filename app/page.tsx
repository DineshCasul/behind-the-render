import Link from "next/link";
import { featuredTrick } from "@/app/featured";
import { journeys } from "@/data/journey";
import { tricks } from "@/data/tricks";

/** The featured number changes once a day. The page is rebuilt at most every 24 hours (incremental static regeneration). */
export const revalidate = 86400;

/** One row: a marker, a one-word name, a short description. The same look as the lists elsewhere on the site. */
function Door({ href, name, desc }: { href: string; name: string; desc: string }) {
  return (
    <Link href={href} className="group grid gap-x-4 py-2 sm:grid-cols-[7rem_1fr]">
      <span className="text-[var(--color-text-primary)] group-hover:text-[var(--state-learning)]">
        <span className="text-[var(--color-text-muted)] group-hover:text-[var(--state-learning)]">&gt; </span>
        {name}
      </span>
      <span className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]">{desc}</span>
    </Link>
  );
}

export default function Home() {
  // One trick's big number is the hook, picked by the day (see featured.ts).
  const featured = featuredTrick();

  return (
    <main className="fade-in mx-auto w-full max-w-3xl flex-1 px-5 py-14 lg:px-10 lg:py-20">
      <h1 className="text-3xl text-[var(--color-text-primary)]">Web Lore</h1>
      <p className="read mt-3">
        How real websites work, in their own words. Every claim is quoted from the company&apos;s docs, with a link.
      </p>

      {featured.stat && (
        <Link href={`/trick/${featured.slug}`} className="group mt-14 block border-l-2 border-[var(--state-got-it)] pl-4">
          <span className="block text-4xl tabular-nums text-[var(--state-got-it)] sm:text-5xl">{featured.stat.value}</span>
          <span className="read mt-2 block !text-xl !text-[var(--color-text-primary)]">{featured.hook}</span>
          <span className="label mt-2 block group-hover:text-[var(--state-learning)]">{featured.title.toLowerCase()} →</span>
        </Link>
      )}

      <nav aria-label="Browse" className="mt-14">
        <Door href="/basics" name="basics" desc="how a page gets built and cached, with real examples. Start here" />
        <Door href="/trick" name="tricks" desc={`${tricks.length} ideas, one page each`} />
        <Door href="/journey" name="sites" desc={`${journeys.length} companies, walked chapter by chapter`} />
      </nav>
    </main>
  );
}
