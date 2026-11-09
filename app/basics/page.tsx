import type { Metadata } from "next";
import Link from "next/link";
import { AlternativesList } from "@/components/tricks/AlternativesList";
import { DocQuoteList } from "@/components/tricks/DocQuoteList";
import { BlockingToy } from "@/components/ui/BlockingToy";
import { BackToTop } from "@/components/ui/BackToTop";
import { CacheToy } from "@/components/ui/CacheToy";
import { Fold } from "@/components/ui/Fold";
import { SectionMark } from "@/components/ui/SectionMark";
import { QuizCard } from "@/components/ui/QuizCard";
import { MarginShapes } from "@/components/ui/MarginShapes";
import { basics } from "@/data/journey-web";

export const metadata: Metadata = {
  title: "Basics | Web Lore",
  description: "One click, from the request to the cache, with real HTTP examples and the docs' own words.",
};

/** The toy that belongs to a section, if it has one. */
const TOYS: Record<string, React.ReactNode> = {
  "web-path": <BlockingToy />,
  "web-fingerprints": <CacheToy />,
};

export default function BasicsPage() {
  const titleOf = Object.fromEntries(basics.chapters.map((c) => [c.id, c.title.toLowerCase()]));

  return (
    <main className="relative focus-dim fade-in mx-auto w-full max-w-3xl flex-1 px-5 py-12 lg:px-10">
      <MarginShapes seed="basics" count={8} />
      <Link href="/" className="label hover:text-[var(--color-text-primary)]">
        ← home
      </Link>
      <h1 className="mt-6 text-2xl leading-tight sm:text-3xl text-[var(--color-text-primary)]">{basics.name}</h1>
      <p className="read mt-3">{basics.intro}</p>

      <section aria-label="The short version" className="mt-12">
        <h2 className="section-title">
<SectionMark seed="basics-1" />the short version</h2>
        <ol className="flex flex-col gap-3">
          {basics.steps.map((s, i) => (
            <li key={s.text} className="grid grid-cols-[2rem_1fr]">
              <span className="pt-0.5 tabular-nums text-[var(--state-learning)]">{i + 1}</span>
              <span className="read !text-base">
                {s.text}{" "}
                <a href={`#${s.chapter}`} className="link whitespace-nowrap text-sm">
                  [{titleOf[s.chapter]}]
                </a>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16">
        {basics.chapters.map((c, i) => {
          const toy = TOYS[c.id];
          // What opening the section gets you, in one line.
          const meta = [c.example && "1 example", toy && "1 toy", c.predict && "1 question", `${c.docs.length} quotes`].filter(Boolean).join(" · ");
          return (
            <Fold key={c.id} id={c.id} number={i + 1} title={c.title} blurb={basics.summaries[c.id]} meta={meta} defaultOpen={i === 0}>
              <div className="flex flex-col gap-4">
                {c.lines.map((l) => (
                  <p key={l} className="read">
                    {l}
                  </p>
                ))}
              </div>

              {c.example && (
                <div className="mt-8">
                  <p className="label mb-2"># example: {c.example.title.toLowerCase()}</p>
                  <pre className="overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-xs leading-relaxed sm:text-sm">
                    <code>{c.example.code}</code>
                  </pre>
                  <p className="label mt-3 max-w-[65ch]">{c.example.note}</p>
                </div>
              )}

              {toy && <div className="mt-8">{toy}</div>}

              {c.predict && <QuizCard label="guess first" quiz={c.predict} />}

              <details className="group/docs mt-8">
                <summary className="btn inline-flex list-none [&::-webkit-details-marker]:hidden">
                  <span className="group-open/docs:hidden">what the docs say ({c.docs.length})</span>
                  <span className="hidden group-open/docs:inline">hide the docs&apos; words</span>
                </summary>
                <div className="mt-4">
                  <DocQuoteList quotes={c.docs} grow />
                  {c.note && <p className="label mt-3 max-w-[65ch]">{c.note}</p>}
                </div>
              </details>

              {c.alternatives && c.alternatives.length > 0 && (
                <div className="mt-8">
                  <p className="label mb-3"># alternatives</p>
                  <AlternativesList alternatives={c.alternatives} />
                </div>
              )}
            </Fold>
          );
        })}
      </div>

      <section aria-label="Check yourself" className="mt-10 border-t border-[var(--color-border)] pt-5">
        <h2 className="text-[var(--color-text-primary)]">
          <span className="text-[var(--state-learning)]">## </span>check yourself
        </h2>
        <QuizCard label="one more" quiz={basics.check} />
      </section>

      <p className="mt-16 flex flex-wrap gap-3">
        <Link href="/trick" className="btn">
          tricks →
        </Link>
        <Link href="/journey" className="btn">
          stories →
        </Link>
      </p>
      <BackToTop />
    </main>
  );
}
