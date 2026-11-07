import Link from "next/link";
import { GroupedRoads, GroupedTricks } from "@/components/home/Grouped";
import { bankItems } from "@/data/bank-items";

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.4em] lg:text-xs text-[var(--state-learning)]";
const heading = "mt-3 text-balance font-serif text-3xl text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl";

/**
 * Everything under the hero: the roads and the tricks, each grouped, and the
 * question bank. All Server Component links, so the home page is static HTML.
 */
export function HomeSections() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 pb-24 pt-20">
      <section id="roads" className="scroll-rise scroll-mt-8">
        <p className={eyebrow}>Follow a click</p>
        <h2 className={heading}>Pick a site and walk its road</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed lg:text-lg text-[var(--color-text-muted)]">
          A short narrated walk through how a site works, in the company&apos;s own words. Every claim links to where it was said.
        </p>
        <div className="mt-8">
          <GroupedRoads limit={4} />
        </div>
      </section>

      <section id="tricks" className="scroll-rise mt-20 scroll-mt-8">
        <p className={eyebrow}>The tricks</p>
        <h2 className={heading}>What the best sites actually do</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed lg:text-lg text-[var(--color-text-muted)]">
          One idea each. A couple have a toy you can poke.
        </p>
        <div className="mt-8">
          <GroupedTricks limit={3} />
        </div>
      </section>

      <section className="mt-20 flex flex-wrap items-center gap-3">
        <Link href="/questions" className="btn-ghost btn-ghost-lg">
          Open the {bankItems.length}-question bank
        </Link>
      </section>
    </div>
  );
}
