# Build Log

Newest first. Each entry says what changed and what to understand after it.

## Depth pass: a review's suggestions, applied where they held up

A review of one page (the Notion offline page) listed improvements. Each was checked before applying; not all were taken.

**Applied to every trick page**

- A short "how is it different from X?" under each "how it works": the thing it is most often confused with (reference counting, a modulo, a lab run, pagination, ...).
- A real `fix` on the pitfalls that stated a problem without one (20 of them). Pitfalls that already said what to do were left alone, so pages did not grow.
- Follow-up questions an interviewer might ask, under each model answer.
- "from the source" became "what Notion says" (the company names for that page); "interview angle" became "interview challenge".
- Clearer disclaimers: the principle is general engineering, and the code is a simplified teaching sketch, not the company's source.
- Provenance asides ("this is general knowledge, not a quote") moved out of eleven model answers into one note under the answer, so each reads as something you could say.

**Applied to the ownership page in full:** the page is now `/trick/ownership-reasons`. The review was right that Notion's design is not plain reference counting: it records who owns a page, not how many references exist. The page now says so, uses the clearer code (a release that reports whether any owner is left), four sharper pitfalls, a fuller model answer, and an interactive toy (`OwnershipToy`).

**Added:** a hash ring toy for consistent hashing (`RingToy`, see [[18-consistent-hashing-ring]]).

**Declined:** capitalised headings (the terminal design uses lowercase on purpose), and the score.

**The quote checker got stricter.** The review suspected altered quotation marks. They were exact, but the checker could not have told: it ignored case, quote style and dashes. It now compares exactly and reports a `PUNCTUATION MISMATCH`. All 98 quotes pass the strict check, and the checker was tested against a deliberately wrong apostrophe and a changed capital.

### 🧠 Learning checkpoint

After this step, I should understand:

1. The difference between tracking how many references exist and tracking who owns them, and why the second is easier to debug.
2. Why a hash ring moves about 1/n of the keys when a server is added while a modulo moves most of them, and what the replica points are for (see [[18-consistent-hashing-ring]]).
3. Why a verifier that normalises away case and punctuation can pass a quote that is not the published wording.

---

## Cleanup: trimmed the old material, a quote checker that lives in the repo

**What changed**

- The "web in general" site lost its hydration and Server Components chapters. It is now three chapters (the request, the fork between client and server rendering, caching), with a new closing question about shared caches.
- Learning notes about removed features were deleted (02, 03, 09 to 16). Notes that teach a transferable idea were kept with a line saying the files they name may be gone (01, 04, 06, 07). Notes 08 (static generation) and 17 (adding a site or trick) were rewritten against the current code. The full old notes are in git history.
- The quote checker moved from a temp folder into the repo: `scripts/verify-quotes.mjs`, run with `npm run verify:quotes`. It reports a network error as a network error, retries, and falls back to a repo's raw README when GitHub's page returns a 504.
- `CLAUDE.md` was replaced with a short description of Web Lore and its rules. The block that `next dev` manages was left as it was.
- Shared UI: the walkthrough and the trick page now share `DocQuoteList` and `AlternativesList` instead of each having its own copy.

**Concepts introduced:** none new. This was removal and consolidation.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a verifier must distinguish "the quote is not on the page" from "the page did not load", and why treating both as failure hides real problems.
2. How to find dead code that the compiler cannot see: exports nobody imports, data fields nothing displays, comments describing code that no longer exists.
3. Why `dynamicParams` defaults to `true`, and what that means for a slug that was not prerendered (see [[08-dynamic-routes-and-static-generation]]).

---

## Readability pass

**What changed**

- One extra font, used for reading text only (`.read` in `app/globals.css`, IBM Plex Sans via `next/font`). Mono stays for the header, labels, lists, toys and code. Reasoning: long prose in monospace is slow to read, but the terminal look lives in the chrome, so only paragraphs, quotes and narration switch.
- `components/ui/Emph.tsx` bolds numbers that carry a unit ("27 second", "99.99%"), because scanning finds the number first. Plain string splitting, so it ships no JavaScript.
- Each trick can have a `stat` (data/tricks.ts): the one number to remember, shown big on the page and under the title in the lists. Each is a number already in a verified quote.
- Trick pages: stat, a "jump to" row, `.section-title` headings (a rule, a bright title, a muted subtitle), numbered steps, quote cards, a collapsed model answer.
- Diagram labels were sized for a narrower font; three diagrams had clipped or overlapping text (waterfall tree, cache edge, wasm port). Fixed by widening boxes. Rule of thumb: mono text is 0.6 x font size wide per character.
- Checked at 390px with DevTools device emulation (`Emulation.setDeviceMetricsOverride`): no page overflows horizontally. On Git Bash, set `MSYS_NO_PATHCONV=1` or a path like `/trick` is rewritten to `C:/Program Files/Git/trick`.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a design can be "terminal" in its chrome and still use a proportional font for paragraphs, and what line length and line height do for reading.
2. Why `String.split` with a capture group is a neat way to find and wrap matches in React without `dangerouslySetInnerHTML`.
3. Why SVG text inside fixed-size boxes breaks when the font changes, and how to estimate the width of monospace text.

---

## Content pass: layout, toys, progress bar, 11 new tricks, 3 new sites

**Layout and UI**

- Trick pages are one readable column (diagram, toy, how-it-works, code, pitfalls, sources). Diagrams are step-through with numbered markers; `components/tricks/toy-ui.tsx` gives both toys the same slider, frame, stats and legend.
- The batching toy now draws chain, parallel and batched on one shared time axis, with a "slowest piece" slider that shows batching's real downside.
- The journey progress bar has one segment per step, grouped by chapter, click to jump. A diagram no longer shows the answer next to its guess-first question.

**Content** (`data/journey-more.ts`, `data/tricks.ts`, `data/trick-extras.ts`)

- New tricks: last-writer-wins and fractional indexing (Figma), virtual list and local-first navigation (GitHub), prefetch before click (Facebook), request coalescing (Wikipedia), consistent hashing (Uber and Cloudflare), cache vs garbage collector and hot partition (Discord), partition key and reference counting (Notion). 23 tricks, 13 sites.
- Every quote is checked word for word against the live page by a script that fetches each source. All 101 quotes pass. The check caught nothing wrong in the old quotes; its only failures were its own bugs (HTML-encoded apostrophes, web.dev language redirect).
- Extras on each trick (how it works, build it, pitfalls, see it yourself) are labelled as general engineering, not company claims.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why last-writer-wins is enough for a design tool but not a text editor, and what a CRDT adds.
2. Why a consistent hash ring moves only about 1/n of the keys when a server is added, while hash(key) % n moves almost all.
3. What request coalescing does to a cache stampede, and what its failure mode is.
4. Why a partition key should match the field your queries already filter by.

---

## Redesign: terminal theme, fundamentals removed

**What changed**

- The site is now only about the tech inside real sites (`/trick`, `/journey`). The concept lessons, the knowledge map, the question bank, the experiments and the progress store were deleted, along with the data behind them.
- Visual system: black, white and grey, one monospace font, hairline borders, square corners, no glows, particles or page transitions. Red, green and blue appear only with a meaning (blue: link or focus, green: ok or correct, red: problem or wrong). The old CSS variable names (`--state-learning` etc.) were kept and remapped so the SVG diagrams recoloured without edits.
- `framer-motion` was removed. What remained was fades, and a CSS keyframe (`.fade-in`) does that with no JavaScript and no hydration dependency.
- `Journey.tsx` keeps the "beats" model (the walk flattened into a list, so next is beat + 1) but lost the animated road strip.

**Files of note:** `app/globals.css`, `app/layout.tsx`, `components/ui/Index.tsx`, `components/journey/Journey.tsx`, `app/trick/[slug]/page.tsx`.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a CSS animation is safer than a JS `initial={{opacity: 0}}` for first paint (the server HTML is never invisible).
2. Why remapping design tokens beats editing every component, and where that stops working.
3. Why a page that only reads static data can stay a Server Component, and which two components here still need `"use client"` and why.

---

## History before the redesign

Until 2026-11-08 this project was a learning site about web rendering (HTTP, CSR, SSR, SSG, ISR, hydration, Server Components, streaming, caching): an interactive knowledge map, sixteen lessons, a question bank, experiments and a progress store, built in phases, with a story mode and then a narrated journey. It was replaced by Web Lore, which is about the engineering inside real websites. The detailed per-phase entries are in git history. The notes that still teach something useful are [[01-nextjs-app-router-boundaries]], [[04-hydration-and-external-stores]], [[05-tailwind-v4-css-first-config]], [[06-animation-and-reduced-motion]], [[07-transform-composition-bug]] and [[08-dynamic-routes-and-static-generation]].
