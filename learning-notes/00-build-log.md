# Build Log

Newest first. Each entry says what changed and what to understand after it.

## Accuracy review of all 27 tricks (2026-11-09)

Each trick was read against the verified quotes of its chapters, and every claim that no quote covered was checked against the live source page. Result: no quote was wrong (335 verified, 0 not found, 0 mismatches) but several sentences of narration went past what the quotes said. Fixed: 18 quotes added for true-but-unquoted claims (jQuery usage metrics, the 2-minute Go GC, Cloudflare's ring lookup, Notion's dark reads, Figma's flicker, GitHub's IndexedDB and 4.7% divergence, Facebook's "much less jarring", and others); a wrong "two tricks" line in the GitHub search chapter (the source's second decision is the delta-encoded tree, consistency is a separate promise); the 76% figure no longer presented as the result of batching alone; two stats that were not numbers in a quote (`many -> 1`, `N -> 1`) replaced; a provenance note removed from the canvas answer; several answers given the caveat or cost their source names (Wikimedia's 1% on-disk hit rate, Hypernova's TTFB cost).

Learning checkpoint: a quote proves a sentence exists, it does not prove the sentence next to it. The check that matters is "which quote supports this clause?"

---

## Stripe story, three new tricks, home opening (2026-11-09)

Added a Stripe story (`stripe-idempotency`, `stripe-limits`) and a GitHub chapter (`github-search`), all in `data/journey-api.ts`, and three tricks with one interview question each: `idempotency-keys`, `rate-limiting`, `ngram-index`. Now 27 tricks, 13 stories, 317 verified quotes (`verify:quotes`: 0 not found, 0 punctuation mismatches). The verifier's file list includes the new file. The tricks also got entries in `trick-extras.ts` (how, code, pitfalls), `trick-intros.ts`, `trick-keywords.ts`, `trick-reading.ts` (3 reading links, all fetched) and a Stripe intro in `site-overviews.ts`.

The home page now opens with a one-time rise: heading, line, and four rows fade up in order (`.rise`, `--i` sets the order), then the green bar by the big number draws downward once when the number is chosen (`.featured-bar`). Only opacity and transform move, and reduced motion turns both off. Nothing loops.

Checked: tsc, lint, build, screenshots of home, two trick pages and the Stripe story at 1280 and 390 wide, no sideways scroll. Not checked: the animation frame by frame (only that the end state renders).

Learning checkpoint: why an idempotency key is a made-up ID the server stores a result against, why a rate limiter and a load shedder are different (one looks at a user, one at the whole system), and why a trigram index is a filter that still needs a real check afterwards. Possible note: `learning-notes/` on idempotency keys.

---

## Scroll drawings (2026-11-09)

Two quiet effects that follow the scroll position, in CSS only (`app/globals.css`, section "Scroll drawings"; markup in `components/ui/ScrollShape.tsx`):

1. A brighter line draws itself left to right along the rule above each section as it scrolls into view (`.section-title`, and `.draw-rule` on the folded basics sections). It uses `animation-timeline: view()`.
2. Small outline shapes (cube, ring, diamond, triangle, square, plus) sit in the left and right margins of the long pages, each at a different height (`components/ui/MarginShapes.tsx`). Each one draws itself as it scrolls into view and turns a little as it passes, driven by its own view timeline (`view-timeline: --shape`, referenced by the path and the svg). Pages get 4 to 6 of them, in an order picked from the page's slug; hexagon-grid starts with the cube and consistent-hashing with the ring. Earlier versions were one small shape in the margin and then one huge faint one behind the text; the huge one looked bad, and scattered small ones work better.

They only show from 1280px wide, where the margins have room (checked: no sideways scroll and no overlap with the text at 1280 and 1440px). Where the browser has no scroll-driven animations, or the reader has asked for reduced motion, the rules are plain hairlines and the shapes are fully drawn and still. Nothing runs while you are not scrolling.

Three small touches were added to the same system. Quoted passages' blue bars grow from top to bottom as they scroll in (`.quote-bar`, opted into with `<DocQuoteList grow />` on the trick and basics pages only, because inside the site walks nothing scrolls and a bar could be stuck half-drawn). The margin shapes also drift, moving a little slower than the page, using the separate `translate` property so it does not fight their turning. And a "back to top" link (`components/ui/BackToTop.tsx`) fades in after the first fifth of the page, using opacity only; it works on phones too, and where scroll timelines are unsupported it simply stays visible.

Testing tip: a scroll-driven animation's value is only right after the browser has painted a frame, so a test that reads computed styles straight after `scrollTo` sees stale numbers. Wait for two animation frames first.

More shapes, reading focus and story taps. There are now 13 shape kinds (added hexagon, spiral, waves, chevrons, grid, asterisk, brackets) and a page gets 6 to 9 of them, spread evenly down its height and alternating sides, with the order picked from the page's slug and stepped by 5 so neighbours differ. Reading focus (`.focus-dim .read`, on the trick and basics pages): prose eases up to full brightness as it rises into view and eases down as it leaves the top; text in the upper part of the screen is never dimmed, and the floor is 60% so contrast stays above 4.5:1. And in the site walks on screens under 1024px, tapping the left third goes back and tapping the rest goes forward (`onTap` in `Journey.tsx`), but never when the tap lands on a link, button, answer, scrollable code, `summary` or `details`, or while text is selected, so nothing that already does something is hijacked. The bottom bar says "tap left / right" on small screens.

Phones and tablets (under 1280px, where the margin shapes do not fit) got their own versions. A small shape sits at the right end of each section heading (`components/ui/SectionMark.tsx`, `.section-mark`), drawing and turning as the heading scrolls in, with room reserved in the heading so it never touches the text. A 2px reading-progress line runs along the top edge and fills as you scroll (`.read-progress`, in the root layout; informational, so it also shows with reduced motion). In the site walks on small screens the "next" button is hidden, since tapping the right side does the same job, but it is kept in the page for keyboard and screen-reader users and shows again while focused (`.walk-next`). And the diagram now sits above the narration on small screens (`order-first lg:order-none`): every step scrolls the walk back to the top, so with the diagram below the text you had to scroll down after each tap to see what changed.

A cascade gotcha: custom CSS written outside any `@layer` (like `.btn`) beats Tailwind utilities, which live in a layer. `max-lg:sr-only` on a `.btn` therefore did nothing; the hiding rule had to be written as custom CSS with a higher-or-equal specificity selector.

Smaller text in the site walks on small screens, to cut scrolling now that the diagram stays on screen above the text. Under 1024px the narration is 1.2rem (it was 1.5rem), quote and body text 1rem, question text 1.1rem, and the diagram frame has a shorter drawing (21% of the screen height, was 24%) and a 14px caption; from 1024px up nothing changes (`.walk-compact` in `app/globals.css`, `visual-frame.tsx`). Measured by walking eight sites in headless Edge at 390x844: steps that needed scrolling went from 59 of 281 (21%) to 40 (14%); at 360x740 from 88 (31%) to 76 (27%). Every narration, question and diagram step now fits without scrolling at 390x844. What is left is the source cards, which list every quote word for word (the worst overflowed by about 1,180px).

Another cascade gotcha: a Tailwind `!important` utility (like `!text-[1.35rem]`) beats an unlayered `!important` rule, because important declarations reverse the layer order. To change such a size, change the utility (add `lg:` variants), not a custom override.

A slow first tap on a phone. Report: on the deployed site, in a new browser, tapping a site highlighted it and nothing happened for about 4 seconds. The server is not slow (production pages are about 310 KB cold, 0.1 s on a normal connection); the delay is the navigation. Next only switches pages after the next page's data has arrived, and then loads the walk's code as a second request, one after the other. Measured with an empty cache on a throttled phone: on slow 3G a tap right after load took 1.9 s to open the walk; once the page had had time to prefetch, 0.2 s. Three changes: a `loading…` indicator next to any link while its page is fetched (`components/ui/LinkPending.tsx`, using `useLinkStatus`; it appeared about 110 ms after the tap in tests; on list rows, home doors and the trick page links); a quiet warm-up that downloads the walk's code when the home and sites pages are idle (`components/ui/WarmWalk.tsx`), which dropped the tap-at-once case on slow 3G to 0.87 s in one test; and the walk text 2px smaller on small screens again (narration 1.075rem, body 0.875rem, question 0.975rem, answers and diagram captions smaller, the green source link under each quote 0.75rem). Steady scroll counts on a phone: 12% of steps at 390x844 (35 of 281 before the source-link change, 34 after), 24% at 360x740.

Test tip: in Git Bash, an argument starting with `/` (like `/trick/x`) is rewritten into a Windows path before node sees it. Set `MSYS_NO_PATHCONV=1` or the test silently loads nothing.

**One deliberate exception to the motion rule in CLAUDE.md** ("only opacity and transform"): drawing a line in SVG animates `stroke-dashoffset`, which is neither. The turning and the rule scaling are transform only.

How it was checked: in headless Edge, scrolling a trick page and reading the computed values: dash offset 1 at the top, 0.57 at 15%, 0 from 35%; rotation 0, 54, 126, about 216 and 360 degrees at the bottom; with reduced motion the shape stays at rotation 0, fully drawn.

### 🧠 Learning checkpoint

1. What a scroll timeline is: an animation whose progress is the scroll position instead of the clock, so it stops when you stop.
2. Why `pathLength="1"` makes a path easy to draw: dash length 1 is the whole path, whatever its real length.
3. Why a heading's own `view()` range was too short (about 40px) and had to be stretched with `cover 25%`.

---

## Basics page, tricks filter, caching toy (2026-11-09)

"The web, in general" left the sites list and became its own page, `/basics`, so the sites are all companies. A first version was one long scroll with only hidden answers, which was a wall of text. It now has clickable guess-first questions (`QuizCard`), a caching toy (`CacheToy`: pick a Cache-Control value and which cache holds the copy, drag the age, see what the cache does), and each section's quotes folded behind a button.

**Folded sections and a rendering toy.** Each of the eight sections now starts folded (`components/ui/Fold.tsx`, a native `<details>`), showing its title, a one-line description of what is inside and a count of its parts (examples, toys, questions, quotes). Only the first is open. A small effect opens a section when a link like `#web-memory` points at it, because browsers do not open a closed `<details>` for an id on the `<details>` itself. The page went from about 20,600px to about 3,900px tall on desktop. A second toy (`BlockingToy`) lets you change how a script loads (plain, `async`, `defer`) and how slow the stylesheet and script are, and shows when the first paint happens and what it waited for, using only what MDN states.

Bug worth remembering: two nested elements both called `group` made the inner button react to the outer section being open. Tailwind's named groups (`group/fold`, `group/docs`) fix it.

The tricks page has a one-line filter (`$ grep`). It matches every word you type against a trick's title, hook, companies, group and a hidden keyword list (`data/trick-keywords.ts`), so "crdt" or "cache lru" finds the right tricks even when the word is not in the title. Plain substring matching, no library. The row components moved to `components/ui/Rows.tsx` so the client-side filter can reuse them without pulling in the data files.

### 🧠 Learning checkpoint

1. Why a filter that only searches titles is weak: people search by concept, so the data needs synonyms.
2. Why the filter is a client component but its data is prepared on the server and passed in as props.
3. How a caching toy can stay honest: it models only what MDN states and says so in its note.

---

## Stories, links page, faster first tap (2026-11-09)

"Sites" is now **stories** everywhere a reader sees it: header, home row, the list page's title and heading, the back and "other stories" links in the walks, and the buttons on the basics, links and trick pages. "Sites" was ambiguous (the whole thing is a website about websites) and "stories" matches how the walk works: you tap through one company's chapters. The URL is still `/journey`, so no links break; a later move to `/stories` would need a permanent redirect in `next.config.ts`. Mentions of "the site" that mean this website, or a company's own site, were left alone. Tricks keep their name. The "links" item moved from the header to the fourth row on the home page.

Random big number on the home page (`components/ui/FeaturedTrick.tsx`, `featuredPool()` in `app/featured.ts`). The home page is pre-built, so the server cannot choose per visit; the browser picks a trick with a number once the page loads, and the block stays invisible until then (it keeps its place, so nothing jumps) and fades in once. The trick of the day is the server's choice and the fallback with JavaScript off (a `<noscript>` rule reveals it). It never shows the same trick twice in a row in a tab (sessionStorage). Tested in headless Edge: 24 fresh visits gave 14 different tricks, 20 reloads gave 0 immediate repeats, and the layout moved 4px while the block was still invisible. First version waited for `requestAnimationFrame` and never revealed in headless Edge; frames are also not delivered to background tabs, so a `setTimeout(0)` is used instead.

Smaller type on phones, on every page (under 768px, `app/globals.css` plus `sm:` variants where sizes are set): reading text 19px to 16px, page body 16px to 15px, labels 13px to 12px, code 14px to 12px, page headings 30px to 24px, the home stat and hooks one step down. Measured at 390px: the trick page went from 7,585px to 6,533px tall, the basics page from 4,948px to 4,469px, the links page from 4,923px to 4,550px; the home page now fits one screen. From 640px up and on desktop nothing changed. The stories keep their own, smaller sizes because `.walk-compact` is more specific. "links" is back in the header as well as on the home page.

New `/links` page (`data/links.ts`): company engineering blogs, browser and framework blogs, and reading lists, all checked to load, with each blog's feed read to see how often it posts. First-party blogs and third-party lists are kept in separate groups, and the page says the lists are for finding more, not sources.

Slow first tap on a phone: a `loading…` indicator next to a link while its page is fetched (`LinkPending`, using `useLinkStatus`), a quiet warm-up of the story code when the home and list pages are idle (`WarmWalk`), and the story text 2px smaller on small screens. A cold load of a production page is about 310 KB; the dev server sends about three times as much, which is why "stuck on first load" is mostly a dev-server effect.

## Minimal home page (2026-11-09)

The home page used to list all 24 tricks and 13 sites, which left a first-time visitor unsure what to click. It is now the title, one sentence, one big number as the hook, and two rows: tricks and sites. The full lists were already at `/trick` and `/journey`, so nothing was lost.

The big number is one trick's `stat`, picked by the day (`app/featured.ts`) and linking to that trick. The page uses `export const revalidate = 86400`, so Next.js rebuilds it at most once a day: the same stale-while-revalidate idea the web road teaches. The clock read lives in its own function because the lint rule `react-hooks/purity` forbids calling `Date.now()` while a component renders.

---

## "The web, in general" rebuilt with real examples (2026-11-09)

The old three chapters were thin and one claim (ISR as stale-while-revalidate) had no source. They are now eight chapters in `data/journey-web.ts`: the request, bytes to pixels, the fork (client, server, static, ISR), hydration, freshness and the 304, versioned files and no-cache vs no-store, private vs shared caches and Vary, and stale-while-revalidate. Sources are MDN, web.dev, React and Next.js; 61 new quotes, all verified.

**Examples.** A chapter can now carry an `example` card (`ChapterExample` in `data/journey.ts`, shown by `Journey.tsx` between the narration and the sources). The HTTP ones are real: captured with curl on 8 November 2026 from developer.mozilla.org and github.com, trimmed, and labelled as such. Code ones are labelled illustrative. The 304 was captured by sending a conditional request while the copy was still fresh, and the note says so.

**Layout bug found and fixed.** A wide code block on a phone made the walk's grid column wider than the screen, because a grid item will not shrink below its content unless it has `min-w-0`. The page-level overflow check missed it, because the overflow was inside the walk's own scroll area; the check now looks there too.

### 🧠 Learning checkpoint

1. Why `no-cache` does not mean "do not cache" (store, but validate before each reuse), and what `no-store` is for.
2. How a 304 works: the cache sends the stored ETag as `If-None-Match`, and the server answers with no body.
3. Why a grid or flex child needs `min-w-0` before `overflow-x: auto` can work inside it.

---

## Accuracy audit, trick intros and deep sites (2026-11-08)

**Accuracy audit.** Every trick was read against its sources. `verify:quotes` was already clean; the audit looked at what the quotes do not cover. Fixed: a stat (`4%` on the GitHub trick) that was not in any verified quote, a mislabelled "request coalescing" that was really batching, an answer that claimed more than the Notion post said, and the LCP reporting code on the field-data trick (a beacon on every candidate, no percentile edge case). A review pasted for trick 2 was checked against web.dev before anything was taken from it.

**Intros.** Every trick page now opens with an "ever wondered" paragraph for a reader who has never heard of the company (`data/trick-intros.ts`). Casual tone; only facts already in the trick's quotes.

**Deep sites.** Wikipedia, Facebook, Figma, Discord and Notion got 22 new chapters from their own posts (`data/journey-deep.ts`), a new trick (`migrate-live`), and extra quotes on existing chapters. Every site now has an overview card at the start (`data/site-overviews.ts`), and the five deep ones end with "how it fits together" flows whose steps jump back to the chapter that backs them. The quote checker now covers the new file and accepts quotes written on one line. 231 quotes, 0 not found.

**A real bug found while checking the flows.** In `Journey.tsx`, `useEffect(() => scrollRef.current?.scrollTo({ top: 0 }), [beat])` returned the value of `scrollTo()`. Current Chromium (157) returns a Promise from it, so React treated the Promise as a cleanup function and crashed on the first "next" ("i is not a function"). Every site walk was broken in a recent Chrome or Edge. The fix is braces around the effect body, so it returns nothing. Rule: an effect callback must return nothing or a function, so never use a bare arrow that returns a call.

**"Read the real thing".** Every trick's "build it" section now links to where the technique comes from (`data/trick-reading.ts`): the library, the official docs or the article that named the idea (for example Martin Fowler's Strangler Fig page for the GitHub jQuery trick). 28 links; each was fetched and checked to load and to mention what its note says. These are general-engineering references, not company claims, and the sketch is still labelled as not the company's code.

**Checked:** all five deep sites walked to the end in headless Edge, desktop and 390px, no sideways scroll, flows render and jump back to chapters. **Not done:** the Meta post is blocked to plain fetches, so its quotes came through the fetch agent (capped at 125 characters each).

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a quote verifier is not an accuracy check: it proves the wording is real, not that the narration or the stat built on it is right.
2. The live-migration pattern in [[19-live-database-migration]], and why 480 shards beats 512.
3. Why the flows say what the quotes say, and are labelled when the source gives no single timeline (Facebook).

---

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
