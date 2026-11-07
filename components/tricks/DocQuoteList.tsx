import type { DocQuote } from "@/data/journey";

/** Verbatim quotes with their links. Shared by the trick pages and the lessons' "Seen in the wild". */
export function DocQuoteList({ quotes }: { quotes: DocQuote[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {quotes.map((d) => (
        <li key={d.text} className="border-l-2 border-[var(--state-learning)] pl-3">
          <blockquote className="font-serif text-lg italic lg:text-xl leading-snug text-[var(--color-text-primary)]">
            &ldquo;{d.text}&rdquo;
          </blockquote>
          <a
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-mono text-[11px] uppercase lg:text-xs tracking-widest text-[var(--state-got-it)] underline underline-offset-4"
          >
            {d.source} <span aria-hidden>↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
