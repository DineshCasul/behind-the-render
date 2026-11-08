"use client";

import { useId, useState } from "react";
import { Grouped, type Row } from "@/components/ui/Rows";

/** A row plus the lowercase text the filter searches (title, hook, companies, group and keywords). */
export type SearchRow = Row & { search: string };

/**
 * The tricks list with a one-line filter. Typing narrows the list live; every word you type
 * must match somewhere in a trick's title, hook, companies, group or keywords, so "cache lru"
 * finds tricks that mention both. Plain substring matching, no library. The rows arrive from
 * the server already prepared; this component only decides which ones to show.
 */
export function TrickBrowser({ groups, rows }: { groups: readonly { id: string; title: string }[]; rows: SearchRow[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = terms.length === 0 ? rows : rows.filter((r) => terms.every((t) => r.search.includes(t)));

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Filter tricks by concept, company or word
      </label>
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-2 focus-within:border-[var(--state-learning)]">
        <span aria-hidden className="text-[var(--state-learning)]">
          $ grep
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="cache, crdt, sharding, notion"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      <p className="label mt-2 mb-6" aria-live="polite">
        {terms.length === 0 ? `${rows.length} tricks` : `${shown.length} of ${rows.length}`}
      </p>

      {shown.length === 0 ? (
        <p className="read">
          No trick matches &ldquo;{query.trim()}&rdquo;. Try a company (youtube, discord) or a word like cache, migration or sharding.
        </p>
      ) : (
        <Grouped groups={groups} rows={shown} />
      )}
    </div>
  );
}
