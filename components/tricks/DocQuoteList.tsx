import type { DocQuote } from "@/data/journey";

/** Verbatim quotes, each with a link to where it was said. */
export function DocQuoteList({ quotes }: { quotes: DocQuote[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {quotes.map((d) => (
        <li key={d.text} className="border-l-2 border-[var(--state-learning)]/60 pl-4">
          <blockquote className="read !text-[var(--color-text-primary)]">&ldquo;{d.text}&rdquo;</blockquote>
          <a href={d.href} target="_blank" rel="noopener noreferrer" className="link mt-2 inline-block text-sm text-[var(--state-got-it)]">
            {d.source} ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
