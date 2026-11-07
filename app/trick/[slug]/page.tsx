import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BatchingToy } from "@/components/tricks/BatchingToy";
import { NearbyToy } from "@/components/tricks/NearbyToy";
import { VisualStepper } from "@/components/tricks/VisualStepper";
import { DocQuoteList } from "@/components/tricks/DocQuoteList";
import { conceptMap } from "@/data/concepts";
import { findChapter, type Alternative } from "@/data/journey";
import { hueStyle } from "@/data/road-hues";
import { trickMap, tricks } from "@/data/tricks";

interface TrickPageProps {
  params: Promise<{ slug: string }>;
}

const label = "font-mono text-[11px] uppercase tracking-[0.3em] lg:text-xs";

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
  const hasMedia = visuals.length > 0 || Boolean(trick.toy);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10" style={hueStyle(roads[0]?.hue)}>
      <Link href="/trick" className="btn-ghost !px-3.5 !py-1.5">
        <span aria-hidden>←</span> All tricks
      </Link>

      <p className={`${label} mt-10 text-[var(--state-learning)]`}>A trick</p>
      <h1
        className="mt-3 text-balance font-serif text-4xl text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
        style={{ textShadow: "0 0 28px color-mix(in srgb, var(--state-learning) 55%, transparent)" }}
      >
        {trick.title}
      </h1>

      {/* The idea on the left, the drawing and the toy on the right (stacked on phones). */}
      <div className={`mt-8 grid gap-x-14 gap-y-10 ${hasMedia ? "lg:grid-cols-[5fr_6fr]" : "max-w-3xl"}`}>
        <div>
          <p className="text-pretty font-serif text-2xl leading-snug text-[var(--color-text-primary)] lg:text-4xl">{trick.hook}</p>
          <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-[var(--color-text-primary)] lg:text-xl">
            {trick.idea.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {hasMedia && (
          <div className="flex min-w-0 flex-col gap-10 lg:self-start">
            {visuals.length > 0 && (
              <section aria-label="See it">
                <p className={`${label} mb-3 text-[var(--state-learning)]`}>See it</p>
                <div className="flex flex-col gap-8">
                  {visuals.map((kind) => (
                    <VisualStepper key={kind} kind={kind} />
                  ))}
                </div>
              </section>
            )}
            {trick.toy && (
              <section aria-label="Try it">
                <p className={`${label} mb-3 text-[var(--state-got-it)]`}>Poke it</p>
                {trick.toy === "batching" ? <BatchingToy /> : <NearbyToy />}
              </section>
            )}
          </div>
        )}
      </div>

      {/* Sources and alternatives on the left; the interview angle and what to read next on the right. */}
      <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-label="Seen in the wild">
            <p className={`${label} text-[var(--state-learning)]`}>From the source</p>
            <ul className="mt-4 flex flex-col gap-8">
              {found.map(({ road, chapter }) => (
                <li key={chapter.id}>
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                    {road.name} · {chapter.title}
                  </p>
                  <div className="mt-3">
                    <DocQuoteList quotes={chapter.docs} />
                  </div>
                  {chapter.note && <p className="mt-3 text-sm leading-snug text-[var(--color-text-muted)]">{chapter.note}</p>}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex flex-wrap gap-3">
              {roads.map((r) => (
                <Link key={r.id} href={`/journey/${r.id}`} className="btn-ghost">
                  Follow {r.name}&apos;s road
                </Link>
              ))}
            </p>
          </section>

          {alternatives.length > 0 && (
            <section aria-label="Also worth knowing">
              <p className={`${label} text-[var(--state-revisit)]`}>Also worth knowing</p>
              <ul className="mt-3 flex flex-col gap-3 text-base leading-snug text-[var(--color-text-muted)] lg:text-lg">
                {alternatives.map((a) => (
                  <li key={a.name}>
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--color-text-primary)] underline underline-offset-4 hover:text-[var(--state-revisit)]"
                    >
                      {a.name} <span aria-hidden>↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>{" "}
                    {a.why}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-12">
          <section aria-label="Interview angle">
            <p className={`${label} text-[var(--state-learning)]`}>The interview angle</p>
            <p className="mt-3 font-serif text-2xl leading-snug text-[var(--color-text-primary)] lg:text-3xl">{trick.question.q}</p>
            <details className="group/fold mt-4 border-t border-[var(--color-border)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--state-learning)] [&::-webkit-details-marker]:hidden">
                Try answering first, then open this
                <span aria-hidden className="transition-transform group-open/fold:rotate-90">
                  ›
                </span>
              </summary>
              <p className="pb-2 text-lg leading-relaxed text-[var(--color-text-primary)]">{trick.question.a}</p>
            </details>
            <p className="mt-4">
              <Link href="/questions" className="font-mono text-xs uppercase tracking-widest text-[var(--state-learning)] underline underline-offset-4">
                More questions like this →
              </Link>
            </p>
          </section>

          <section aria-label="Foundations and related tricks">
            {trick.concepts.length > 0 && (
              <>
                <p className={`${label} text-[var(--color-text-muted)]`}>Foundations</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {trick.concepts.map((id) => (
                    <li key={id}>
                      <Link
                        href={`/learn/${id}`}
                        className="group block rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--state-got-it)]"
                      >
                        <span className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--state-got-it)] lg:text-lg">
                          {conceptMap[id].title} <span aria-hidden>↗</span>
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-[var(--color-text-muted)] lg:text-base">{conceptMap[id].blurb}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {trick.related.length > 0 && (
              <>
                <p className={`${label} mt-8 text-[var(--color-text-muted)]`}>Read next</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {trick.related.map((s) => (
                    <li key={s}>
                      <Link href={`/trick/${s}`} className="text-base text-[var(--state-learning)] underline underline-offset-4 lg:text-lg">
                        {trickMap[s].title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
