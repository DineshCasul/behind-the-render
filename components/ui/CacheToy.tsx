"use client";

import { useState } from "react";
import { Slider, Stats, ToyFrame } from "@/components/tricks/toy-ui";

const DIRECTIVES = [
  { id: "max-age", header: "Cache-Control: max-age=3600", label: "max-age=3600" },
  { id: "no-cache", header: "Cache-Control: no-cache", label: "no-cache" },
  { id: "no-store", header: "Cache-Control: no-store", label: "no-store" },
  { id: "private", header: "Cache-Control: private, max-age=3600", label: "private, max-age=3600" },
] as const;
type DirectiveId = (typeof DIRECTIVES)[number]["id"];

const CACHES = [
  { id: "browser", label: "your browser (a private cache)" },
  { id: "cdn", label: "a CDN (a shared cache)" },
] as const;
type CacheId = (typeof CACHES)[number]["id"];

const MAX_AGE = 3600;

/** What one cache does with the next request for this response, following MDN's rules. */
function verdict(directive: DirectiveId, cache: CacheId, ageSeconds: number) {
  if (directive === "no-store") {
    return { stored: "no", asks: "every time", back: "200, the full page", text: "no-store: no cache of any kind may store the response, so every request goes to the server." };
  }
  if (directive === "private" && cache === "cdn") {
    return { stored: "no", asks: "every time", back: "200, the full page", text: "private means the response may only be stored in a private cache. A shared cache like a CDN does not keep it, so the request goes on to the server." };
  }
  if (directive === "no-cache") {
    return { stored: "yes", asks: "every time", back: "304 if unchanged, 200 if changed", text: "no-cache does not mean do not cache. The response is stored, but it must be validated before each reuse: the cache sends If-None-Match, and a matching ETag gets a 304 with no body." };
  }
  if (ageSeconds < MAX_AGE) {
    return { stored: "yes", asks: "no", back: "nothing: answered from the cache", text: "Fresh: its age is below max-age, so the cache answers by itself and the server never hears about the request." };
  }
  return { stored: "yes", asks: "yes, once", back: "304 if unchanged, 200 if changed", text: "Stale: its age has passed max-age. The cache asks the server with If-None-Match. A 304 makes the stored copy fresh again; a 200 replaces it." };
}

/**
 * The caching toy: pick a Cache-Control value, pick which cache holds the response, drag the age
 * of the stored copy. It shows what that cache does on the next request. A model of the rules,
 * not a real cache.
 */
export function CacheToy() {
  const [directive, setDirective] = useState<DirectiveId>("max-age");
  const [cache, setCache] = useState<CacheId>("browser");
  const [age, setAge] = useState(600);

  const header = DIRECTIVES.find((d) => d.id === directive)!.header;
  const v = verdict(directive, cache, age);
  const ageMatters = directive === "max-age" || directive === "private";

  return (
    <ToyFrame
      title="what does this cache do?"
      note="A model of the rules MDN describes, not a real cache. A real one also considers Vary, Expires, heuristic caching and more, and different caches behave a little differently."
    >
      <div>
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">the response says</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Cache-Control value">
          {DIRECTIVES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={directive === d.id}
              onClick={() => setDirective(d.id)}
              className="border px-3 py-2 text-left font-mono text-sm transition-colors hover:border-[var(--state-learning)]"
              style={{ borderColor: directive === d.id ? "var(--state-learning)" : "var(--color-border)", color: directive === d.id ? "var(--state-learning)" : "var(--color-text-primary)" }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">the copy is held by</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Which cache">
          {CACHES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cache === c.id}
              onClick={() => setCache(c.id)}
              className="border px-3 py-2 text-left text-sm transition-colors hover:border-[var(--state-learning)]"
              style={{ borderColor: cache === c.id ? "var(--state-learning)" : "var(--color-border)", color: cache === c.id ? "var(--state-learning)" : "var(--color-text-primary)" }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Slider
        label="age of the stored copy"
        value={age}
        display={`${Math.round(age / 60)} min`}
        min={0}
        max={7200}
        step={60}
        hint={ageMatters ? "max-age=3600 is 60 minutes: below that the copy is fresh, above it is stale." : "Age does not matter for this value."}
        onChange={setAge}
      />

      <p className="border border-[var(--color-border)] px-4 py-2 font-mono text-sm text-[var(--color-text-primary)]">{header}</p>

      <p className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]" aria-live="polite">
        {v.text}
      </p>

      <Stats
        items={[
          { label: "does it store the copy?", value: v.stored, tone: v.stored === "yes" ? "good" : undefined },
          { label: "does it ask the server?", value: v.asks },
          { label: "what comes back", value: v.back },
        ]}
      />
    </ToyFrame>
  );
}
