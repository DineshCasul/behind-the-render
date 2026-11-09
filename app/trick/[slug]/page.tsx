import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BatchingToy } from "@/components/tricks/BatchingToy";
import { NearbyToy } from "@/components/tricks/NearbyToy";
import { OwnershipToy } from "@/components/tricks/OwnershipToy";
import { RingToy } from "@/components/tricks/RingToy";
import { VisualStepper } from "@/components/tricks/VisualStepper";
import { AlternativesList } from "@/components/tricks/AlternativesList";
import { DocQuoteList } from "@/components/tricks/DocQuoteList";
import { Emph } from "@/components/ui/Emph";
import { LinkPending } from "@/components/ui/LinkPending";
import { SectionMark } from "@/components/ui/SectionMark";
import { BackToTop } from "@/components/ui/BackToTop";
import { MarginShapes } from "@/components/ui/MarginShapes";
import { findChapter, type Alternative } from "@/data/journey";
import { trickExtras } from "@/data/trick-extras";
import { trickIntros } from "@/data/trick-intros";
import { trickReading } from "@/data/trick-reading";
import { trickMap, tricks } from "@/data/tricks";

interface TrickPageProps {
  params: Promise<{ slug: string }>;
}

/** The poke-able toy for each `toy` value in data/tricks.ts. */
const TOYS = { batching: BatchingToy, nearby: NearbyToy, ownership: OwnershipToy, ring: RingToy } as const;

/** Every trick is known ahead of time, so every page is prerendered at build time. */
export function generateStaticParams() {
  return tricks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TrickPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trick = trickMap[slug];
  if (!trick) return {};
  return { title: `${trick.title} | Web Lore`, description: trick.hook };
}

export default async function TrickPage({ params }: TrickPageProps) {
  const { slug } = await params;
  const trick = trickMap[slug];
  if (!trick) notFound();

  // Quotes, notes, alternatives and the road each trick belongs to all come from its journey chapters.
  const found = trick.chapters.flatMap((id) => {
    const hit = findChapter(id);
    return hit ? [hit] : [];
  });
  const alternatives = Array.from(
    new Map(found.flatMap(({ chapter }) => chapter.alternatives ?? []).map((a): [string, Alternative] => [a.name, a])).values(),
  );
  const roads = Array.from(new Map(found.map(({ road }) => [road.id, road])).values());
  // The journey's diagrams for this trick's chapters, once each, in order.
  const visuals = Array.from(new Set(found.flatMap(({ chapter }) => (chapter.visual ? [chapter.visual] : []))));
  const extras = trickExtras[slug];
  const intro = trickIntros[slug];
  const reading = trickReading[slug] ?? [];
  const Toy = trick.toy ? TOYS[trick.toy] : undefined;
  // "Uber and Cloudflare": used in headings and in the notes that say what is quoted and what is not.
  const names = roads.map((r) => r.name);
  const joined = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : (names[0] ?? "the company");

  // The page's sections, in order. Drives the "jump to" row so the page can be scanned before it is read.
  const jump = [
    visuals.length > 0 && ["see-it", "diagram"],
    trick.toy && ["try-it", "toy"],
    extras && ["how", "how it works"],
    extras && ["build", "code"],
    extras && ["wrong", "pitfalls"],
    ["sources", "sources"],
    ["interview", "interview"],
  ].filter(Boolean) as [string, string][];

  return (
    <main className="relative focus-dim fade-in mx-auto w-full max-w-4xl flex-1 px-5 py-10 lg:px-8">
      <MarginShapes seed={slug} count={9} />
      <Link href="/trick" className="label hover:text-[var(--color-text-primary)]">
        ← tricks
      </Link>

      <h1 className="mt-6 text-2xl leading-tight sm:text-3xl text-[var(--color-text-primary)]">{trick.title}</h1>
      <p className="read mt-3 !text-lg !text-[var(--color-text-primary)] sm:!text-xl">{trick.hook}</p>

      {trick.stat && (
        <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-2 border-[var(--state-got-it)] pl-4">
          <span className="text-2xl tabular-nums text-[var(--state-got-it)] sm:text-4xl">{trick.stat.value}</span>
          <span className="read !text-base !text-[var(--color-text-muted)]">{trick.stat.label}</span>
        </p>
      )}

      <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--color-text-muted)]">
        {jump.map(([id, name]) => (
          <a key={id} href={`#${id}`} className="hover:text-[var(--state-learning)]">
            {name}
          </a>
        ))}
      </nav>

      {intro && (
        <p className="read mt-10 border-l-2 border-[var(--color-border)] pl-4 !text-[var(--color-text-primary)]">{intro}</p>
      )}

      <div className={`${intro ? "mt-8" : "mt-10"} flex flex-col gap-5`}>
        {intro && <p className="label">what the source says</p>}
        {trick.idea.map((p) => (
          <p key={p} className="read">
            <Emph text={p} />
          </p>
        ))}
      </div>

      {visuals.length > 0 && (
        <section id="see-it" aria-label="See it" className="mt-16 scroll-mt-6">
          <h2 className="section-title">
<SectionMark seed="trick-1" />see it</h2>
          <div className="flex flex-col gap-10">
            {visuals.map((kind) => (
              <VisualStepper key={kind} kind={kind} />
            ))}
          </div>
        </section>
      )}

      {Toy && (
        <section id="try-it" aria-label="Try it" className="mt-16 scroll-mt-6">
          <h2 className="section-title">
<SectionMark seed="trick-2" />try it</h2>
          <Toy />
        </section>
      )}

      {extras && (
        <>
          <section id="how" aria-label="How it works" className="mt-16 scroll-mt-6">
            <h2 className="section-title">
<SectionMark seed="trick-3" />
              how it works <small>{extras.how.name}</small>
            </h2>
            <ol className="flex flex-col gap-4">
              {extras.how.steps.map((st, i) => (
                <li key={st} className="grid grid-cols-[2.25rem_1fr]">
                  <span className="pt-0.5 tabular-nums text-[var(--state-learning)]">{i + 1}</span>
                  <span className="read">
                    <Emph text={st} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="read mt-6 border-l-2 border-[var(--color-border)] pl-4 !text-base">
              <span className="font-mono text-sm text-[var(--state-got-it)]">cost </span>
              <Emph text={extras.how.cost} />
            </p>
            {extras.how.versus && (
              <p className="read mt-6">
                <span className="mb-1 block font-mono text-sm text-[var(--state-learning)]">how is it different from {extras.how.versus.name}?</span>
                <Emph text={extras.how.versus.difference} />
              </p>
            )}
            <p className="label mt-4">The principle is general engineering, not a claim by {joined}.</p>
          </section>

          <section id="build" aria-label="Build it" className="mt-16 scroll-mt-6">
            <h2 className="section-title">
<SectionMark seed="trick-4" />
              build it <small>{extras.code.title}</small>
            </h2>
            <pre className="overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-xs leading-relaxed sm:text-sm">
              <code>{extras.code.src}</code>
            </pre>
            <p className="label mt-3">A simplified teaching sketch, not source code from {joined}.</p>
            {reading.length > 0 && (
              <div className="mt-6">
                <p className="label mb-2"># read the real thing</p>
                <ul className="flex flex-col gap-4">
                  {reading.map((r) => (
                    <li key={r.href} className="read !text-base">
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="link text-[var(--state-got-it)]">
                        {r.by}: {r.title} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      <span className="mt-1 block text-[var(--color-text-muted)]">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section id="wrong" aria-label="Where it goes wrong" className="mt-16 scroll-mt-6">
            <h2 className="section-title">
<SectionMark seed="trick-5" />where it goes wrong</h2>
            <ul className="flex flex-col gap-4">
              {extras.pitfalls.map((x) => (
                <li key={x.text} className="grid grid-cols-[2.25rem_1fr]">
                  <span className="pt-0.5 text-[var(--state-revisit)]">!</span>
                  <span className="read">
                    <Emph text={x.text} />
                    {x.fix && (
                      <span className="mt-1 block">
                        <span className="font-mono text-sm text-[var(--state-got-it)]">fix </span>
                        {x.fix}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {extras.inspect && (
            <section aria-label="See it yourself" className="mt-16">
              <h2 className="section-title">
<SectionMark seed="trick-6" />see it yourself</h2>
              <p className="read grid grid-cols-[2.25rem_1fr]">
                <span className="font-mono text-[var(--state-learning)]">$</span>
                <span>{extras.inspect}</span>
              </p>
            </section>
          )}
        </>
      )}

      <section id="sources" aria-label="Sources" className="mt-16 scroll-mt-6">
        <h2 className="section-title">
<SectionMark seed="trick-7" />
          what {joined} {names.length > 1 ? "say" : "says"} <small>copied word for word, with the link</small>
        </h2>
        <ul className="flex flex-col gap-10">
          {found.map(({ road, chapter }) => (
            <li key={chapter.id}>
              <p className="mb-3 text-[var(--color-text-primary)]">
                {road.name} <span className="text-[var(--color-text-muted)]">/ {chapter.title}</span>
              </p>
              <DocQuoteList quotes={chapter.docs} grow />
              {chapter.note && <p className="label mt-3 max-w-[65ch]">{chapter.note}</p>}
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap gap-3">
          {roads.map((r) => (
            <Link key={r.id} href={`/journey/${r.id}`} className="btn">
              walk through {r.name} →<LinkPending />
            </Link>
          ))}
        </p>
      </section>

      {alternatives.length > 0 && (
        <section aria-label="Alternatives" className="mt-16">
          <h2 className="section-title">
<SectionMark seed="trick-8" />alternatives</h2>
          <AlternativesList alternatives={alternatives} />
        </section>
      )}

      <section id="interview" aria-label="Interview challenge" className="mt-16 scroll-mt-6">
        <h2 className="section-title">
<SectionMark seed="trick-9" />
          interview challenge <small>say your answer out loud first, then compare</small>
        </h2>
        <p className="read !text-lg !text-[var(--color-text-primary)] sm:!text-xl">{trick.question.q}</p>
        <details className="group mt-4">
          <summary className="btn inline-flex list-none [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">show a model answer</span>
            <span className="hidden group-open:inline">hide the answer</span>
          </summary>
          <p className="read mt-4 border-l-2 border-[var(--color-border)] pl-4">{trick.question.a}</p>
          <p className="label mt-2">Where the answer says what a company&apos;s post says, that comes from the source. The rest is general engineering reasoning.</p>
          {trick.question.followUps && (
            <div className="mt-6">
              <p className="label mb-2">follow-ups an interviewer might ask</p>
              <ul className="flex flex-col gap-2">
                {trick.question.followUps.map((f) => (
                  <li key={f} className="read grid grid-cols-[2.25rem_1fr]">
                    <span className="font-mono text-[var(--state-learning)]">?</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>
      </section>

      {trick.related.length > 0 && (
        <section aria-label="Related" className="mt-16">
          <h2 className="section-title">
<SectionMark seed="trick-10" />next</h2>
          <ul className="flex flex-col gap-1">
            {trick.related.map((s) => (
              <li key={s}>
                <Link href={`/trick/${s}`} className="link text-[var(--color-text-primary)]">
                  {trickMap[s].title} →<LinkPending />
                </Link>{" "}
                <span className="text-[var(--color-text-muted)]">{trickMap[s].hook}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <BackToTop />
    </main>
  );
}
