"use client";

import Link from "next/link";
import { useState } from "react";
import { useChoices, useJourney } from "@/lib/story-journey";
import { storyMap } from "@/data/story";

/** The decision steps, in story order. Each option's index is what the reader picked. */
const DECISIONS = ["who-builds-the-page", "how-much-js", "seat-freshness", "where-to-cache", "just-for-you"] as const;
const HTML_BRANCHES = ["path-csr", "path-ssr", "path-ssg", "path-isr"];

type Picks = Readonly<Record<string, number>>;

/**
 * Things worth watching, worked out from the combination of choices. Each rule
 * is a true statement about the trade-offs (see the lessons), and only fires
 * when the reader's choices actually create it, so the list is different for
 * different designs.
 */
function tensions(p: Picks): string[] {
  const out: string[] = [];
  const build = p["who-builds-the-page"]; // 0 CSR, 1 SSR, 2 SSG, 3 ISR
  const js = p["how-much-js"]; // 0 whole page client, 1 server by default
  const seat = p["seat-freshness"]; // 0 browser fetch, 1 server HTML per request, 2 short shared cache
  const where = p["where-to-cache"]; // 0 browser, 1 CDN, 2 server
  const personal = p["just-for-you"]; // 0 fill in browser, 1 per-fan server render, 2 split

  if (build === 0) out.push("Client rendering: a crawler's first response is an empty shell, and content waits for JavaScript. Check what search engines receive and watch LCP.");
  if ((build === 2 || build === 3) && seat === 1) out.push("Prebuilt pages (SSG, ISR) can't carry a value computed per request. To show the seat count from the server on every request, that page has to be rendered on demand, or the number has to come from the browser or a short shared cache.");
  if (build === 1 && where === 2) out.push("SSR with a cache only inside the server: the server does less work, but every request still travels all the way to it.");
  if (js === 0) out.push("Marking the whole page as client code ships and hydrates much more JavaScript. Watch INP, especially on mid-range phones.");
  if (seat === 0) out.push("A number fetched after load arrives late: reserve its space (layout shift) and decide what shows when JavaScript is off.");
  if (where === 0) out.push("Browser-cached copies can't be removed from the fan's device. You can only wait for them to expire.");
  if (personal === 1 && where === 1) out.push("Per-fan pages can't be shared from a CDN cache, so a CDN gives little benefit for those responses.");
  if (personal === 0 && js === 1) out.push("Personal parts filled in by the browser need a Client Component: keep that boundary small.");
  return out;
}

/**
 * End-of-story summary: the design the reader actually built, the costs they
 * accepted, what to watch out for, and a plain-text version to copy (useful as
 * the outline of an answer to "how would you render this page?"). Reads the
 * per-reader choices from localStorage, so it fills in after hydration.
 */
export function StoryRecap() {
  const { choices } = useChoices();
  const { path } = useJourney();
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  const made = DECISIONS.filter((id) => choices[id] !== undefined && storyMap[id]?.options?.[choices[id]]);
  const skipped = HTML_BRANCHES.filter((id) => !path.includes(id));
  const watch = tensions(choices);

  if (made.length === 0) {
    return (
      <section className="mt-10 rounded-xl border border-dashed border-[var(--color-border)] p-5" aria-label="Your design">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)]">Your design</p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          You haven&apos;t made any decisions on this run yet. Take the story from the start and this page will turn your
          choices into a design summary, with the trade-offs you accepted.
        </p>
        <Link href="/story/the-drop" className="btn-ghost mt-4">
          Start the story
        </Link>
      </section>
    );
  }

  const lines = made.map((id) => {
    const step = storyMap[id];
    const o = step.options![choices[id]];
    return { title: step.trail, label: o.label, cost: o.cost };
  });

  const copy = async () => {
    const text = [
      "My ticket-drop rendering design (Behind the Render)",
      "",
      ...lines.map((l, i) => `${i + 1}. ${l.title}: ${l.label}\n   Cost I accepted: ${l.cost}`),
      ...(watch.length ? ["", "Things to watch:", ...watch.map((w) => `- ${w}`)] : []),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-[var(--state-learning)] p-5" aria-label="Your design">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-learning)]">The design you built</p>
      <ol className="mt-4 flex flex-col gap-4">
        {lines.map((l, i) => (
          <li key={l.title} className="text-sm leading-snug">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              {i + 1}. {l.title}
            </span>
            <span className="mt-1 block font-semibold text-[var(--color-text-primary)]">{l.label}</span>
            <span className="mt-0.5 block text-[var(--color-text-muted)]">
              <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-revisit)]">You accepted </span>
              {l.cost}
            </span>
          </li>
        ))}
      </ol>

      {watch.length > 0 && (
        <>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[var(--state-revisit)]">Things to watch in this design</p>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-snug text-[var(--color-text-primary)]">
            {watch.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} className="btn-ghost">
          Copy as notes
        </button>
        <span aria-live="polite" className="text-xs text-[var(--color-text-muted)]">
          {copied === "done" ? "Copied. Paste it into your notes." : copied === "failed" ? "Couldn't copy from this browser. Select the text above instead." : ""}
        </span>
      </div>
      <p className="mt-4 text-xs leading-snug text-[var(--color-text-muted)]">
        This is also the outline of a good interview answer to &quot;how would you render this page?&quot;: what you chose,
        what it costs, and what you would watch.
      </p>

      {skipped.length > 0 && (
        <p className="mt-4 text-xs text-[var(--color-text-muted)]">
          Not on your path:{" "}
          {skipped.map((id, i) => (
            <span key={id}>
              {i > 0 && ", "}
              <Link href={`/story/${id}`} className="underline underline-offset-4 hover:text-[var(--color-text-primary)]">
                {storyMap[id].trail}
              </Link>
            </span>
          ))}
          . Try a different route and the design (and its costs) changes.
        </p>
      )}
    </section>
  );
}
