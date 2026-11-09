import Link from "next/link";
import { LinkPending } from "@/components/ui/LinkPending";
import { WarmWalk } from "@/components/ui/WarmWalk";
import { featuredPool } from "@/app/featured";
import { FeaturedTrick } from "@/components/ui/FeaturedTrick";
import { journeys } from "@/data/journey";
import { tricks } from "@/data/tricks";

/** The fallback trick of the day changes once a day: the page is rebuilt at most every 24 hours (incremental static regeneration). */
export const revalidate = 86400;

/** One row: a marker, a one-word name, a short description. The same look as the lists elsewhere on the site. */
function Door({ href, name, desc, i }: { href: string; name: string; desc: string; i: number }) {
  return (
    <Link href={href} className="rise group grid gap-x-4 py-2 sm:grid-cols-[7rem_1fr]" style={{ "--i": i } as React.CSSProperties}>
      <span className="text-[var(--color-text-primary)] group-hover:text-[var(--state-learning)]">
        <span className="text-[var(--color-text-muted)] group-hover:text-[var(--state-learning)]">&gt; </span>
        {name}
      </span>
      <span className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]">
        {desc}
        <LinkPending />
      </span>
    </Link>
  );
}

export default function Home() {
  // The big number is picked in the browser (see FeaturedTrick); the trick of the day is the server's fallback.
  const pool = featuredPool();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 lg:px-10 lg:py-20">
      <h1 className="rise text-2xl sm:text-3xl text-[var(--color-text-primary)]" style={{ "--i": 0 } as React.CSSProperties}>Web Lore</h1>
      <p className="read rise mt-3" style={{ "--i": 1 } as React.CSSProperties}>
        How real websites work, in their own words. Every claim is quoted from the company&apos;s docs, with a link.
      </p>

      <FeaturedTrick items={pool.items} initial={pool.initial} />

      <WarmWalk />
      <nav aria-label="Browse" className="mt-14">
        <Door href="/basics" i={4} name="basics" desc="how a page gets built and cached, with real examples. Start here" />
        <Door href="/trick" i={5} name="tricks" desc={`${tricks.length} ideas, one page each`} />
        <Door href="/journey" i={6} name="stories" desc={`${journeys.length} companies, walked chapter by chapter`} />
        <Door href="/links" i={7} name="links" desc="where to find new tricks: company and browser blogs" />
      </nav>
    </main>
  );
}
