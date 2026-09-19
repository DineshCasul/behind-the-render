import { cache, Fragment } from "react";
import { glossary } from "@/data/glossary";
import { Term } from "@/components/lesson/Term";

/**
 * A tiny inline formatter for lesson prose:
 *   **phrase**   bigger, bolder inline phrase ("read this word")
 *   ==sentence== highlighted statement ("this whole point matters")
 *   *phrase*     italics
 *   `code`       inline code (never scanned for glossary terms)
 * plus automatic glossary hovers: hard terms from `data/glossary.ts` get a
 * dotted underline and a plain-English card. Two limits keep this from
 * turning into noise: first occurrence per paragraph only, and at most
 * MAX_PER_PAGE underlines of the same term on one page (a lesson about
 * caching would otherwise underline "cache" 22 times). The page-wide count
 * lives in a per-request `cache()`: every Prose on the page shares it, and
 * each page render starts fresh.
 *
 * No markdown library, lesson content is a handful of plain-English
 * paragraphs authored in `data/lessons/*.ts`, so a regex split covers
 * everything actually needed. Highlight contents are rendered recursively
 * (so italics and terms work inside them) sharing one `seen` set.
 */

/** Underlines of one term allowed on a single page. Two: the first explains it, the second helps a reader who jumped in mid-page. */
const MAX_PER_PAGE = 2;

/** term -> underlines so far on this page render. `cache` gives one Map per server render. */
const pageTermCounts = cache(() => new Map<string, number>());

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// spelling (lowercased) -> entry, plus one regex over all spellings.
// Longest spellings first so "layout shift" wins over "layout" and
// "DOM mutations" wins over "DOM".
const spellingToEntry = new Map<string, (typeof glossary)[number]>();
for (const entry of glossary) {
  for (const spelling of entry.match) spellingToEntry.set(spelling.toLowerCase(), entry);
}
const TERM_RE = new RegExp(
  `(?<![\\w-])(${[...spellingToEntry.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})(?![\\w])`,
  "gi",
);

function withTerms(text: string, seen: Set<string>, keyPrefix: string) {
  const out: React.ReactNode[] = [];
  const onPage = pageTermCounts();
  let last = 0;
  for (const m of text.matchAll(TERM_RE)) {
    const entry = spellingToEntry.get(m[1].toLowerCase())!;
    if (seen.has(entry.term)) continue;
    const used = onPage.get(entry.term) ?? 0;
    if (used >= MAX_PER_PAGE) continue;
    seen.add(entry.term);
    onPage.set(entry.term, used + 1);
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Term key={`${keyPrefix}-${m.index}`} term={entry.term} meaning={entry.meaning}>
        {m[1]}
      </Term>,
    );
    last = m.index + m[1].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function render(text: string, seen: Set<string>, keyPrefix = "p"): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*)/g).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-[var(--color-bg-elevated)] px-1 py-0.5 font-mono text-[0.85em] text-[var(--color-text-primary)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="vibrate-on-hover text-[1.15em] font-bold text-[var(--color-text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark
          key={key}
          className="vibrate-on-hover rounded bg-[var(--state-learning)]/15 px-1 py-0.5 font-medium text-[var(--state-learning)]"
        >
          {render(part.slice(2, -2), seen, key)}
        </mark>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{withTerms(part, seen, key)}</Fragment>;
  });
}

export function Prose({ text }: { text: string }) {
  return <>{render(text, new Set())}</>;
}
