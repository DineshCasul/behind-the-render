import type { Metadata } from "next";
import Link from "next/link";
import { MarginShapes } from "@/components/ui/MarginShapes";
import { linkGroups } from "@/data/links";

export const metadata: Metadata = {
  title: "Links | Web Lore",
  description: "Where to find new engineering tricks: company engineering blogs, browser and framework blogs, and reading lists.",
};

/** The site name of a link, for the dim column: engineering.fb.com, not https://www.engineering.fb.com/. */
const host = (href: string) => new URL(href).hostname.replace(/^www\./, "");

export default function LinksPage() {
  return (
    <main className="relative fade-in mx-auto w-full max-w-5xl flex-1 px-5 py-12 lg:px-10">
      <MarginShapes seed="links" count={5} />
      <h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)]">Links</h1>
      <p className="read mt-3">
        Where new tricks come from. Most blogs have an RSS feed, so a feed reader is the easiest way to follow several of them. Anything added to this site
        is quoted from the company&apos;s own post; the lists at the end are only for finding more.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {linkGroups.map((g) => (
          <section key={g.id} aria-label={g.title}>
            <h2 className="text-[var(--state-learning)]">$ ls {g.id}/</h2>
            <p className="label mt-1 mb-3">
              # {g.title.toLowerCase()}. {g.blurb}
            </p>
            <ul>
              {g.items.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="group grid gap-x-4 py-1.5 sm:grid-cols-[16rem_1fr_auto]">
                    <span className="text-[var(--color-text-primary)] group-hover:text-[var(--state-learning)]">
                      <span className="text-[var(--color-text-muted)] group-hover:text-[var(--state-learning)]">&gt; </span>
                      {l.name} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]">{l.desc}</span>
                    <span className="text-[var(--color-text-muted)] sm:text-right">{host(l.href)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 flex flex-wrap gap-3">
        <Link href="/trick" className="btn">
          tricks →
        </Link>
        <Link href="/journey" className="btn">
          stories →
        </Link>
      </p>
    </main>
  );
}
