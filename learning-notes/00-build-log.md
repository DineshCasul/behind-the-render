# Build Log

## Glossary tooltips no longer run off the screen on phones

**Date:** 2026-09-20

- **Bug:** the hover/tap card for a hard word was centred on the word with a fixed 240px width, so a word near the left or right edge pushed the card off-screen. Measured on 1,041 tooltips across 8 lessons at 390, 360 and 320px wide: **559 were partly off-screen**.
- **Fix** (`components/lesson/Term.tsx`, now a Client Component): when the word gets hover or focus, measure the still-invisible card and shift it back inside the viewport (a CSS variable feeds the `transform`), and flip it below the word if there is no room above. Written straight to the element, not through React state, so there is no extra render and the correction lands before the card fades in. After: **0 of 1,041** off-screen (6 flipped below).
- Lesson: `visibility: hidden` elements still have layout, so you can measure them before showing them. And test a fix against the *old* code too: the same script found 559 problems before, which is what proves the test can see the bug.

## Story mode: an interactive demo in every step, and a design summary that uses your choices

**Date:** 2026-09-20

- **Every story step now has something to play with** (`StoryVisualsMore.tsx`, plus the earlier ones): what a crawler receives first; the four strategies checked against the story's requirements; **anatomy of one request** (distance and server work, separately); **many requests at once** (a small simulation: arrivals per tick against a server that can finish a fixed number, with and without a cache); **how wrong is each way of showing the seat count**; streaming vs waiting for everything; where `use client` goes and what ships; the cache layers (reusing the lesson experiment); **a shared cache leaking one fan's page to another**; and symptom to metric ("taps feel laggy" leads to INP).
- All numbers in the demos are invented units ("ticks", "fans", "units") and are labelled that way. They show order and shape, not measurements.
- **"Your run" replaced by "The design you built".** Options now remember what you picked (`OptionLink.tsx`, `useChoices` in `lib/story-journey.ts`). The last step lists each decision with the cost you accepted, adds "things to watch" that only appear when your combination of choices creates them (for example, a prebuilt page plus a per-request seat count), and has a **Copy as notes** button: the outline of an interview answer to "how would you render this page?".
- Stored choices are validated on read (stored data outlives the code that wrote it), and starting the story again clears them.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a queue grows without limit when arrivals exceed capacity, and why a cache changes the number of requests that reach the server rather than the speed of each.
2. Why personal data must never be in a shared cache entry (and that the fix is separating shared from personal, not turning caching off).
3. How choices in one part of a design (prebuilt pages) constrain another (per-request data).

## Polish round: buttons, scroll cue, a real hydration bug, and a sharper question bank

**Date:** 2026-09-20

- **Auto-scroll: removed, then brought back only where asked.** The home page no longer glides on its own. The story's "Or explore every concept" button (`/?to=map`) scrolls to the map, once, and nothing else does. A visible **"Explore the map" button** at the bottom of the hero does the same on demand. Shared logic lives in `lib/scroll-to-map.ts` (three layouts: phone flow, desktop pinned scene, desktop reduced-motion).
- **Buttons you could miss are now buttons**: a `.btn-ghost` style (visible border and text) for "Back to map" on lessons, the story footer, the map heading and a "Home" button beside the story trail; the hero has "Start the story" (filled, glowing) next to "Take the N-question challenge" (same size, outlined).
- **Real bug found and fixed: hydration mismatch when the visitor prefers reduced motion.** Framer's `useReducedMotion()` returns the true answer during the *first client render*, but the server (which can't know) rendered the animated tree, so the two trees differed. New hook `lib/use-prefers-reduced-motion.ts` uses `useSyncExternalStore` with a server snapshot of `false`, so React hydrates with the server's answer and then re-renders with the real one. All 11 components that read reduced motion use it now. My earlier tests missed this because they only listened to `console` errors, while React reports this as a `pageerror`.
- **Question bank revised**: 5 weaker questions replaced with more important ones (URL to pixels, `no-cache` vs `no-store`, improving LCP, request waterfalls, good LCP but poor INP, when CSR is still right). Every question now lists 3 or 4 **related topics** to look up. 52 questions.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a component whose *markup* depends on a browser-only fact (reduced motion, viewport) must hydrate with the server's assumption first, then update.
2. The difference between `console.error` and an uncaught `pageerror` in tests: a test that listens to one can hide the other.
3. Why `no-cache` does not mean "don't cache" (it means "always check before reuse").

## Removed the home page auto-scroll

**Date:** 2026-09-20

- Dropped the `?to=map` effect in `ScrollExperience.tsx` (the 3-second glide from the hero down to the map after "Back to map"), by request. "Back to map" links now go to `/` and the page opens at the top like any other visit. Also removes the code that cancelled the glide on wheel/touch/key input and the StrictMode workaround it needed.
- Lesson learned: an effect that moves the user's scroll position is a feature you pay for in edge cases (cancelling, StrictMode double runs, phone vs desktop layouts). Deleting it removed all of them.

## Question bank: 51 questions, easy to tricky, each with a source

**Date:** 2026-09-20

- New page `/questions` (`app/questions/page.tsx`, `components/questions/QuestionBank.tsx`, data in `data/question-bank.ts`): 12 easy, 14 medium, 12 hard, 13 tricky. Each has a short answer, one or two **learn-more links to first-party docs** (MDN, web.dev, react.dev, nextjs.org, Google Search Central) and a link to this site's lesson. Filter by difficulty; answers are native `<details>`, so they work with JavaScript off (all 51 are in the HTML).
- **Accuracy process:** every URL was fetched and confirmed to load; each answer's key claim was checked against the linked page's text with a script. That caught two mistakes in my first draft: the MDN "HTTP caching" guide does not document `s-maxage` (the Cache-Control reference does, so I linked that), and Next.js's hydration-error page lists time-dependent APIs like `Date()` but not "time zone or locale" (I had guessed that), so the answer now says only what the page says.
- Linked from the end of every story step and from the home page's map heading.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why "tricky" questions are the most useful: each one is a common misconception with a one-line correction.
2. A source is only worth linking if it actually says the thing: verify the claim against the page, not just that the URL loads.
3. Native `<details>` gives you an accessible accordion with no state and no JavaScript.

## Story mode, step F: story bookends on lessons + the map's new heading

**Date:** 2026-09-20

- **Bookends** (`components/story/StoryBookend.tsx`): story steps now link to lessons as `/learn/<id>?story=<step>`. A lesson opened that way shows "Why you are here" at the top (the step's problem, plus a link back) and "Now we have another problem" at the bottom (with the step's next button). Opened any other way, the lesson is exactly as before.
- **Why `Suspense`:** reading `?story=` needs `useSearchParams`, which in a prebuilt page makes React skip prerendering up to the nearest `<Suspense>`. Wrapping just the two small strips keeps the whole lesson prebuilt (the build still shows the lessons as SSG). The value is untrusted URL input, so it is only used as a key into the story data, never printed (a bogus value renders nothing).
- **Homepage map heading** ("Or explore every concept", `MapHeading.tsx`) on the phone, the reduced-motion layout, and as an overlay on the desktop scroll scene.
- **Phone audit** at 390 and 360 wide across all 15 story pages, the lesson bookends and the home page: no horizontal overflow. Fixed the top bookend touching the status pills.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why reading query strings in a statically generated page needs a Suspense boundary, and what it does to prerendering.
2. Why URL parameters are untrusted input even in a static site.
3. The difference between a page-level overflow (scrollWidth) and a single element sticking out (clipped or hidden decoration).

## Story mode, step E: more decisions, suggestions, a louder button, a full-screen phone hero

**Date:** 2026-09-19

- **Phone hero fills the screen** (`min-h-svh`, was 78svh, which let the top of the map peek in). `svh` is the *small* viewport height: it doesn't jump when the mobile browser's address bar hides. Verified at 390x844, 360x640 and an 820x1180 tablet: the map starts exactly at the fold.
- **"Start the story" is now the one filled, glowing button** (`components/ui/StartStoryButton.tsx`, `.cta-story` in globals.css). The pulsing ring is a pseudo-element animated with `transform` and `opacity` only, and is off for reduced motion.
- **Three more decisions** (the story has 14 steps now): how fresh the seat count must be (browser fetch, per-request server render, short shared cache), where the copies should live (browser, CDN, server) and how to handle the part that is only for one fan (personalization vs shared caches). Each option still has a pitch and a cost, and none is "the answer".
- **"Try it yourself" suggestions** on 8 steps: small experiments in Firefox DevTools or in this repo (View Source, the Network Timings "Waiting" phase, `npm run build` markers, `curl -I` for Cache-Control, the Performance panel).

### 🧠 Learning checkpoint

After this step, I should understand:

1. `100vh` vs `svh`/`dvh`/`lvh` on mobile, and why the small viewport unit is the safe one for "fill the first screen".
2. Personalization and shared caching pull against each other, because a shared copy must be identical for everyone.
3. Every cache location trades closeness to the fan against control over what is inside it.

## Story mode, step D: making the story interactive

**Date:** 2026-09-19

- Four small demos inside story steps (`components/story/StoryVisual.tsx`, chosen by a `visual` field on the step data): **scrub a fan's phone through time** for CSR, SSG and ISR (what can they see, does the button work); **distance** (a server in Virginia versus a copy near the fan); **tap before and after hydration** (the button really does nothing until you let "JavaScript finish loading"); **a crowd with and without a cache**. They show the *order* of events and what the fan can do, and use no invented timings.
- Scene paragraphs fade in one after another with a CSS animation (server-rendered, no JavaScript needed). The last step ends with a **recap** (`StoryRecap.tsx`): your path, and the branches not on it, each a link.
- Design rule kept: a demo has to teach something the text does not, or it does not ship.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why hydration is felt as "the button does nothing": the HTML is a picture until handlers are attached.
2. Why a cache changes the *number of requests that do real work*, not just how fast each is.
3. Why demos use no invented numbers when the scenario is fictional.

## Story mode, step C: the ticket-drop story (first version) + a saved-progress crash

**Date:** 2026-09-19

- **The story:** `data/story.ts` holds 11 steps (Aurora Tour, servers in Virginia, fans everywhere). Each step ends on a *problem* that the next concept solves; the decisions (where the HTML is built, how much runs in the browser) are options with a **pitch and a cost**, never a "best" answer. Pages are `/story/[step]`, prebuilt with `generateStaticParams`. `components/story/StoryStepView.tsx` (Server Component) renders the narrative and "under the hood" links into the existing lessons; `JourneyTrail.tsx` (Client Component) shows the path you walked, stored by `lib/story-journey.ts` with the same `useSyncExternalStore` pattern as progress. The hero has a "Start the story" button (desktop and phone).
- **Bug 1, the map layer swallowed clicks:** on desktop the invisible map layer sits above the hero in the DOM, so the new button could not be clicked. Fix: `pointer-events` follows scroll progress (`none` until the map starts appearing).
- **Bug 2, the "error on the top page" (reproduced, then fixed):** progress saved in your browser before the 4 new concepts existed had no entry for them, so the map read `undefined` and threw `Cannot read properties of undefined (reading 'color')`. A fresh browser never hit it, which is why my tests missed it. `lib/progress.ts` now merges saved progress over the defaults and drops unknown or invalid values. Rule: **stored data outlives your code, so never trust it to be complete.**
- Story copy is intentionally light and jokey ("the boring part", "the panic part"); numbers are avoided because the scenario is fictional.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Persisted state (localStorage) is a *schema you don't control*: adding a field to your model is a migration problem for every returning user.
2. A later element in the DOM covers earlier ones for pointer events even when it is fully transparent, unless `pointer-events` says otherwise.
3. Why the story is data (steps, options, trade-offs) rendered by one component, rather than eleven hand-built pages.

## Story mode, step B: "Learn this next" hints

**Date:** 2026-09-19

- `data/next-up.ts` gives every one of the 16 concepts one or two harder follow-on topics, each with a link, a one-sentence reason and (where support is limited) a caveat. Shown at the top of each lesson's "Go deeper" section by the new `components/lesson/NextUpList.tsx` (a Server Component: plain links, no JavaScript).
- All URLs were fetched and load. Speculation Rules, `scheduler.yield()`, `content-visibility` and the Long Animation Frames API carry a support caveat rather than being presented as universally safe. A Partial Prerendering link was dropped because it just redirected to the general caching page.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Every concept leads somewhere harder (HTTP to HTTP/3, hydration to selective hydration), and knowing that "next" topic is what separates using a tool from understanding it.
2. Why an API with limited browser support is a progressive enhancement, not a foundation.

## Story mode, step A — four new concepts (SEO, JS & Main Thread, Web Vitals, Client Components)

**Date:** 2026-09-19

- The site is becoming a **story-driven decision graph** (a concert ticket drop that keeps creating new problems). Before the story can exist, the concepts it needs must exist, so this step adds the four "Must" concepts as full lessons: 5 questions each, worked examples, verified references, honest "in this site" entries and 12 new glossary terms. The map now has 16 nodes (wide and portrait layouts re-laid out, checked in headless Edge).
- Facts were verified against primary docs first (web.dev Core Web Vitals thresholds, Google's JavaScript SEO docs, MDN, react.dev, nextjs.org). Anything I could not verify (for example a TTFB threshold) was left out rather than guessed.
- New files: `data/lessons/story-concepts.ts`, `data/questions/story-concepts.ts`, `data/examples/story-concepts.ts` (the stage files were left alone). `server-components` now has `client-components` as a prerequisite.
- **Gotcha worth knowing:** `examples`, `references` and `siteUsage` are `Record<ConceptId, ...>`, so TypeScript failed the build until every new id had an entry. `lessonMap` and `questionMap` are built with a cast, so a missing lesson would only crash at runtime. See note 15.

### 🧠 Learning checkpoint

After this step, I should understand:

1. A crawler gets the **response HTML** first and the JavaScript-rendered page later (a separate queue), which is why the rendering strategy affects search.
2. The main thread does scripts, layout and paint one task at a time, so any task over 50 ms delays input: that is what INP measures.
3. `"use client"` marks a module *and its imports* as browser code, but Client Components are still pre-rendered to HTML and then hydrated.

## Phase 2.5c — Section map died after reload/navigation

**Date:** 2026-09-19

- **Bug:** `LessonNav`'s effect cleanup cancelled the pending `requestAnimationFrame` but left `frame.current` non-null. React's dev mode runs cleanup + setup again on every fresh mount (reload, client-side navigation), so the second setup believed a frame was still pending and never scheduled another measurement: the sticky bar and section map stopped updating.
- **Fix:** reset `frame.current = null` in the cleanup. General rule: an effect's cleanup must undo *all* the state its setup created (the listener, the scheduled callback **and** the "is scheduled" flag), or a re-run starts from a corrupted state. This is the same class of problem as the `?to=map` auto-scroll effect that consumed its URL param on the first run.
- **Verified in a real browser this time** (headless Edge driven by a throwaway Playwright script kept outside the repo): the bar is hidden at the top and slides in after scrolling, the progress line grows with scroll, and the section map updates on a fresh load, after a reload while scrolled, after a client-side navigation, and at a narrow width (dot strip instead of the rail); no console errors. The lesson title now sits at the far right of the bar, which is full-width for that reason, and the bar background is solid so page text doesn't ghost through.

## Phase 2.5b — Map legend off-screen fix

**Date:** 2026-09-19

- **Cause:** the map SVG keeps a 2:1 shape, so in a wide-but-short window it is taller than the screen. The map's grid row was `auto`-sized, so it grew to fit the SVG and pushed the whole column (and the bottom-pinned legend) past the viewport.
- **Fix** (`LearningMap.tsx`): the grid row is now `grid-rows-[minmax(0,1fr)]` (capped at the container's height) and the SVG has `max-h-full`, so it shrinks to fit (its `viewBox` letterboxes it, so every node stays visible). The legend moved up (`bottom-8 left-6`) and lost its backdrop blur.
- Lesson: a percentage height only limits content if the *row* that contains it is also limited. `minmax(0, 1fr)` is the idiom for "this track may not grow past its container", where plain `1fr` (which has a `min-content` floor) or `auto` can.

## Phase 2.10 — Phone hero animation

**Date:** 2026-09-19

- `components/ui/HeroPhone.tsx` (used below 1024px; the desktop hero is unchanged): the title **resolves from a blur letter by letter** (like a request becoming pixels), one **scan line** sweeps down the hero, the rest fades in on a stagger, and a "Scroll to explore" cue nudges a few times. On scroll the content drifts, shrinks slightly and fades as the hero leaves.
- **CSS animations, not Framer `initial`**, so the server-rendered page is visible before any JavaScript runs (verified with JavaScript disabled: the title ends fully opaque). `backwards` fill (not `both`) so no leftover `filter` layer remains after the animation. Each animation runs once; reduced-motion users get none.
- **Blur only on load, never per scroll frame** (per-frame blur made the desktop scene stutter). Scroll uses `transform` and `opacity` only, with full 0 to 1 ranges (see 2.9 for why).
- Verified in headless Edge at 390px: frames at 300/700/1300/3200 ms, end state, scroll parallax values, reduced motion, JavaScript off.

## Phase 2.9 — Phone layout: a portrait map + a scroll-scene bug found on the way

**Date:** 2026-09-19

- **Audit first**: screenshots at 390px (headless Edge) showed the landscape map shrunk to a quarter of its size (labels ~3px), the detail panel squeezing the map into a sliver, the legend overlapping the panel, and a few polish issues. Lesson pages were mostly fine (no page-level horizontal overflow anywhere).
- **The graph is now vertical below 1024px** (`layout="tall"`): the same 12 nodes and edges, stacked top-to-bottom in a 360x1010 space (`mobilePosition` on each concept) so labels are full size. `MapNode`/`MapEdge` take explicit positions, edges curve vertically (`buildEdgePath(..., vertical)`), and one shared `MapGraph` renders both layouts. The detail panel becomes a **bottom sheet** (primary actions first via CSS `order`, topic hints always visible since touch has no hover), the legend sits in flow under the map, and there is no hover tooltip on touch.
- **CSS picks the layout, not JavaScript**: both are in the HTML and `lg:hidden` / `hidden lg:block` chooses one, so there is no hydration mismatch or flash. The pinned cinematic scene stays for desktop; phones and tablets get hero, then map, in normal flow. SVG `id`s (filters, gradients) are prefixed per layout: duplicates would resolve to the first match, and a gradient inside a `display: none` SVG doesn't render at all.
- Smaller fixes: opaque backing disc behind each node (edge lines showed through the middle), the terminal line wraps balanced, and the lesson stage breadcrumb is one line on phones.
- **Bug found while auditing (Chrome/Edge only, invisible in Firefox):** at the end of the desktop scroll scene the map faded back out and the hero came back. Cause: Chromium runs scroll-linked animations natively, and when the last keyframe isn't at 100% the browser invents one there from the element's original value, so opacity traced a triangle wave. Fix: give every animated value keyframes across the full 0 to 1 range (held flat at the ends). Measured before/after with stepped scrolling in headless Edge. My first guess (a listener to force the JavaScript path) was wrong and was reverted.
- Verified in headless Edge at 1400, 1024, 820 and 390px: the right map at each width, the desktop scene ends on the map, tapping a node opens the sheet and X closes it, no horizontal overflow, no console errors.

### 🧠 Learning checkpoint

1. Why a landscape diagram can't just be scaled down for phones, and how a second layout of the *same data* solves it without duplicating logic.
2. Why choosing a layout with CSS (two subtrees, one hidden) avoids the hydration mismatch that a JavaScript media-query branch would cause, and what it costs (duplicated DOM).
3. Why duplicate SVG ids are dangerous, and why gradients in `display: none` SVGs don't render.
4. How a native scroll-linked animation can differ from the JavaScript version at the ends of its range, and why testing in one browser isn't enough.

## Phase 2.8 — "Try it in your browser" activities

**Date:** 2026-09-19

- Collapsed **Try it** boxes (violet) under the section where they help, for the lessons where the browser itself is the best teacher: HTTP (Network headers and timing), Browser Rendering (edit `display: none` in the Inspector; a Performance recording), HTML Parsing (paste broken HTML into the Console), SSR (View Source, then turn JavaScript off), React Rendering (React DevTools "highlight updates"), Hydration (throttle the network and feel the gap), Caching (normal versus hard reload on a production build). Deliberately sparse: 8 activities across 7 lessons, only where doing it teaches something reading can't. Data in `data/browser-checks.ts`, rendered by `BrowserCheckBox.tsx` (native `<details>`, no JavaScript).
- **Firefox first-class**: steps name both browsers' panels and settings (Elements/Inspector, "Disable JavaScript" in Firefox's DevTools Settings versus Chrome's command menu, Network "Timings", the "cached" Transferred column). Firefox names were checked against Mozilla's DevTools docs; anything with no documented Firefox equivalent (the Performance flame chart) is badged "Chrome / Edge only". I only ran the steps in Edge, not Firefox.
- **Claims were run, not assumed**, in a real browser: the parser results, JavaScript-off rendering, and the hydration gap (content at 0.6s, buttons hydrated at 6.6s on a throttled connection). Measuring also **disproved one earlier claim**: scrolling the home scene causes ~11 layout passes and 200+ style recalculations per 2,000px, so "little or no layout work, mostly compositing" (in the browser-rendering "In this very site" text) was too strong. Corrected, and the Try it text says what really appears.

### 🧠 Learning checkpoint

1. Why measuring before writing a "you should see..." instruction matters (it caught an overclaim).
2. What each DevTools panel is for, and the Chrome/Edge to Firefox name mapping (Elements = Inspector, Sources = Debugger, Application = Storage).
3. Why a normal reload can reuse `immutable` files while a hard reload bypasses the cache.

## Phase 2.7 — Worked examples under the lesson sections

**Date:** 2026-09-19

- Under **What is this / Why does it exist / How does it work** and **React / Next.js connection**, lessons now have a collapsed **"Show an example"**: real code, HTTP messages, HTML, CSS or timelines, then a "What to notice" list. 35 examples in total, in `data/examples/{stage}.ts`, typed in `lib/types.ts`.
- **Pruned on purpose.** A first pass wrote 48; 13 were cut because they repeated something already on the page (a timeline that duplicates the runtime diagram or the experiment directly below, code already in the "In this very site" callout, two one-liners the "what" example already showed). `ConceptExamples` is `Partial<Record<...>>` so a section simply has no example when it wouldn't add anything.
- Snippets marked **From this site** are real code (checked against the repo); Next.js-specific syntax (`export const revalidate`, `dynamicParams`, `await cookies()`, `use cache` + `cacheComponents`, `loading`, `revalidatePath`) was checked against the current docs before writing.
- Built with the native `<details>` element (keyboard accessible, no JavaScript, stays a Server Component) and a tiny `CodeBlock` that dims comments and highlights chosen lines. **No syntax-highlighting library**: it would add client weight for a handful of short snippets. Ligatures are switched off in code blocks so `=>` and `->` show as typed.
- Verified in headless Edge: closed by default, opens by click and by keyboard, highlight/badge rendering, no console errors.

### 🧠 Learning checkpoint

1. Why `<details>/<summary>` is a good default for progressive disclosure (accessible, zero JS) and when you'd need a custom accordion instead.
2. Why an example that restates the text, the diagram, or the experiment next to it is noise, and how to decide what earns its place.
3. Why code samples should disable font ligatures.

## Phase 2.6 — Directional page slide for related topics

**Date:** 2026-09-19

- Related-topic chips now carry a direction: prerequisites get **←** and the new page slides in from the **left**; concepts that build on this one get **→** and slide in from the **right**. `RelatedConcepts` decides the direction from `concept.prerequisites`; `DirectionalLink` records it in `lib/nav-direction.ts` (a one-slot mailbox) just before Next.js navigates; `app/template.tsx` reads it on mount. Modified clicks (new tab, etc.) are ignored so a stale direction can't leak into a later navigation.
- **Bug found by testing in the browser:** lesson-to-lesson navigation didn't animate at all. A template only remounts when the route *segment* above it changes; `/learn/ssr` → `/learn/ssg` stays inside the same `learn` segment, so the template was reused and never replayed (the earlier fade only ever played for home → lesson). Fix: the animated wrapper (`PageEnter`) is keyed by `usePathname()`, so any path change remounts it.
- **Blank-flash bug fixed on the way:** the old template server-rendered the page at `opacity: 0` until JavaScript ran (blank flash on every hard reload; invisible without JS). The first mount of a session (the initial page load) now skips the animation; only in-app navigations animate.
- `overflow-x: clip` on the wrapper hides the sideways overhang during the slide without creating a scroll container (unlike `overflow-x: hidden`, which would break the sticky lesson bar).
- Verified in headless Edge: forward `x` 79 → 41 → 0, back −79 → −42 → 0, no horizontal scrollbar, sticky bar still works after navigating.

### 🧠 Learning checkpoint

1. When a Next.js template remounts (segment changes) and when it doesn't (same segment, new param), and why keying by pathname fixes it.
2. Why `overflow-x: clip` is safe next to `position: sticky` while `overflow-x: hidden` is not.
3. Why animating from `opacity: 0` on server-rendered content hurts SSR/SSG (invisible until hydration), and how to animate only client-side navigations.

## Phase 2.5 — Sticky lesson title + "where am I" map

**Date:** 2026-09-19

- `components/lesson/LessonNav.tsx` (client): once the big title scrolls away, a slim bar slides in with `← Map`, the concept title, the **current section name** and a **reading-progress line**. A section map shows where you are: a side rail ("On this page", numbered, active section highlighted) on screens 1320px and wider, and a strip of clickable dots inside the bar on narrower ones. Clicking jumps to the section (smooth scroll, instant for reduced motion) and updates the URL hash.
- **Sticky, not fixed**, on zero-height wrappers: a `position: fixed` bar inside the animated page wrapper would ride along with the transform and then snap (the background-jitter bug again), and the zero height means the bar appearing never shifts the layout.
- **Cheap on scroll**: progress is a Framer `scrollYProgress` motion value driving `scaleX` (no React re-render per frame); the active section is measured once per animation frame (`requestAnimationFrame` throttle) and React skips the render when it hasn't changed. Lint caught a synchronous `setState` in the effect, so the first measurement goes through the same rAF path.
- Section anchors got `scroll-mt-16` so headings land below the bar. Native smooth scrolling was deliberately *not* enabled globally, because it would turn the home page's per-frame `window.scrollTo` glide into a stutter.

### 🧠 Learning checkpoint

1. Why `position: sticky` (not `fixed`) is safe under a transformed ancestor, and how a zero-height sticky wrapper avoids layout shift.
2. How a scroll-spy decides the active section (last section whose top passed a reading line, plus a bottom-of-page special case), and why it's throttled with `requestAnimationFrame`.
3. Why a motion value can drive a visual (`scaleX`) without re-rendering React.

## Phase 2.4 — "Go deeper" references + a docs-accuracy fix

**Date:** 2026-09-19

- Every lesson ends with a **Go deeper** section (2 to 4 links, mostly MDN, react.dev, nextjs.org and the specs, each labelled Official docs / Specification / Deep dive with a one-line reason). Data in `data/references.ts`, rendered by `ReferencesList.tsx` (Server Component; external links use `target="_blank" rel="noopener noreferrer"` so the other site can't reach back through `window.opener`). Also a topic link in the map panel.
- **Every URL was fetched, not remembered**: status, redirects (two MDN pages had moved, so their new addresses are used) and page title, then all 34 were re-verified from the final file. The section states the date and versions they were checked against.
- **Found and fixed an out-of-date claim.** Checking the Next.js caching docs showed Next 16 has *two* caching models (Cache Components with `use cache`, and a "Previous Model" with opt-in `fetch` caching and `unstable_cache`), that **`fetch` is not cached by default**, and that the docs no longer use the names "Data Cache"/"Full Route Cache" that my caching lesson had used. The lesson text, the map-panel topic and the "In this very site" caching entry were corrected, and both docs pages are linked.

### 🧠 Learning checkpoint

1. Why framework-specific claims go stale (Next.js changed its caching model between major versions) and why a lesson should link to the source and state the version it was checked against.
2. What `rel="noopener noreferrer"` protects against on `target="_blank"` links.
3. Why verifying links means following redirects and reading the destination, not just getting a 200.

## Phase 2.3 — "In this very site"

**Date:** 2026-09-19

- Every lesson gets an **In this very site** section (before "Test yourself"; also a topic link in the map panel): a status badge (Used / Partly used / Not used here, on purpose), what the site does, the real files involved, and steps to verify it. Content in `data/site-usage.ts`, rendered by `SiteUsageCallout.tsx` (Server Component).
- Honesty rule: every claim was checked (greps of the code, searches of the built client chunks, `curl -I` against `next start`). SSR, ISR and streaming are marked *not used, and why*; caching is *partly* (platform headers, not our code); CSR is *partly* (the localStorage-driven progress overlay).
- `Prose` now renders inline `code` (backticks).
- Details: [[14-this-site-as-a-worked-example]].

### 🧠 Learning checkpoint

1. How to tell from `next build` output whether a route is static or per-request, and why that answers "are we using SSR?".
2. Why dev-server headers can't be used to reason about production caching.
3. Why "not used here, and why" teaches as much as "used here".

## Phase 2.2 — Clearer experiments, glossary hovers, topic hints, copy pass

**Date:** 2026-09-19

- **Experiments rewritten** to explain themselves: every one has a "what this shows" line and a "Try this" list (`ExperimentPanel.tsx`). SSR/CSR timelines and the Hydration toggle share a new `MockBrowser` (Content visible / Clickable lights; clicking too early explains why nothing happened). Streaming now compares "without" vs "with" streaming on a live clock. Cache layers puts the checkbox beside its label, adds per-layer explanations, and reports which layer answered and the rough time. Fixed a logic bug where JS-on/HTML-off (CSR) was shown as not clickable.
- **Glossary hovers**: `data/glossary.ts` + `Term.tsx`; `Prose` auto-wraps the first occurrence of each term per paragraph. Also applied to runtime step details and the server/browser lists.
- **Topic hints**: every "What you'll learn" item reveals a one-line meaning on hover/focus.
- **Copy pass**: em dashes removed from all source; "Interview questions" renamed **"Test yourself"** (heading, panel link, and the `#test-yourself` anchor).
- Global `cursor: pointer` for enabled buttons/switches (Tailwind v4 preflight resets buttons to the arrow cursor), `not-allowed` for disabled ones.
- Hover **vibration** on emphasized lesson text (`.vibrate-on-hover` in `globals.css`, applied by `Prose` to `**bold**` and `==highlight==`). It offsets with `position: relative` + `left/top` instead of `transform` because these are inline elements that wrap across lines: a transform needs `inline-block`, which would stop long highlights wrapping. Plays once per hover, disabled under `prefers-reduced-motion`.
- **Scroll-scene jitter fix** (`ScrollExperience.tsx`): the map used to flip from a padded card to full-bleed at 55% scroll (width/padding/corner changes under a 0.7s CSS transition, i.e. layout work *during* the scroll), and the hero's `filter: blur()` was recomputed every frame. Now the map is full-bleed from frame one (no state flip, no re-render mid-scroll), the hero blur is gone (scale + fade remain), and both layers get `will-change: transform, opacity`. Rule of thumb: scroll-linked effects should change only `transform`/`opacity`; anything that changes layout or needs a per-frame filter will stutter.
- Details: [[13-glossary-hovers-and-self-explaining-experiments]].

### 🧠 Learning checkpoint

1. Why regex alternatives must be sorted longest-first to prefer "layout shift" over "layout".
2. Why a floating tooltip inside a scroll container clips, and why the panel's hints reveal inline instead.
3. Why "visible" vs "interactive" is the core SSR/hydration idea, and how the mock browser makes it testable.

## Phase 2.1 — Route transitions + emphasis in lessons

**Date:** 2026-09-19

- Page transition is `app/template.tsx` (enter-only fade/rise, remounted per navigation). A first attempt — pathname-keyed `AnimatePresence mode="wait"` in the layout — blinked (the router swaps content immediately, so the exit phase left a gap) and was replaced.
- Map panel now has a concept-specific **"What you'll learn"** list; each topic deep-links to `/learn/<id>#<section>`. Section anchors are typed (`LessonSectionId` in `lib/types.ts`) so a topic can't point at a section that doesn't exist; `LessonSection` sets the `id` and `scroll-mt-8`. Topics live in `data/concepts.ts` (already in the homepage bundle) rather than being derived from `data/lessons/`, so the map doesn't pull all lesson content into its client JS. Trade-off: a topic can technically point at an `experiment` section for a lesson that has none — the type checks ids, not per-lesson presence (only the 5 concepts with experiments reference it).
- Lesson "← Back to map" now goes to `/?to=map`: home starts at the hero, then auto-glides down through the pinned scene to the map (`animate()` → `window.scrollTo`, cancelled by user input).
- `Prose` inline formatter (`**big bold**`, `==highlight==`, `*italic*`) now renders all lesson prose; key statements in all 12 lessons are marked. Highlight uses the existing cyan accent (not amber — amber already means "Revisit").
- Details: [[12-route-transitions-and-inline-emphasis]].

### 🧠 Learning checkpoint

1. Why a changing `key` triggers unmount/mount, and how `AnimatePresence` delays the unmount for an exit animation.
2. Why a capture group in a `split` regex preserves delimiters — the whole trick behind `Prose`.
3. Why a transformed ancestor affects `position: fixed` descendants.

## Phase 2 — Lesson system

**Date:** 2026-09-19

Built the full lesson/learning experience on top of Phase 1's map, per
`phase-2-instructions.md` (renamed from its literal on-disk filename,
`# The Rendering Project — Phase 2 I.txt`).

### What was implemented

- **Type system** (`lib/types.ts`): `PipelineStage` (the WEB FUNDAMENTALS →
  ... → PRODUCTION CONCERNS progression), `Lesson`, `RuntimeStep`,
  `ServerVsBrowser`, `Tradeoff`, `Misconception`, `ExperimentKind`,
  `InterviewQuestion`/`InterviewCategory`. `data/concepts.ts` gained one
  additive field per concept (`stage`) — nothing existing was restructured.
- **Content**, grouped by pipeline stage rather than one file per concept:
  `data/lessons/{web-fundamentals,rendering-strategies,react-nextjs,modern-delivery,production-concerns}.ts`
  and the matching `data/questions/*.ts` (5 interview questions per
  concept — one per category — a deliberate, disclosed scope decision
  short of the spec's eventual ~10, with the data shape making growth a
  content-only change). `data/lessons/index.ts` / `data/questions/index.ts`
  flatten these into `lessonMap`/`questionMap`.
- **Route**: `app/learn/[slug]/page.tsx`, a Server Component with
  `generateStaticParams` — confirmed via `npm run build` to actually
  statically prerender all 12 lessons (`● (SSG)` in the build output, not
  just "looks static"). See [[08-dynamic-routes-and-static-generation]].
- **Lesson components** (`components/lesson/`): `LessonHeader` (pipeline
  breadcrumb + status control), `LessonSection`, `RuntimeSequence` (a
  static, server-rendered step diagram — deliberately *not* a Client
  Component, since it has no interactivity), `ServerBrowserSplit`,
  `ReactNextCallout`, `TradeoffsGrid`, `MisconceptionsList`,
  `InterviewQuestions` (client, CSS-only accordion — no Framer Motion
  needed, see [[10-css-grid-accordion-without-js-height]]),
  `RelatedConcepts`, `ExperimentPanel` (dispatches on
  `lesson.experiment`, see [[09-content-as-data-discriminated-experiments]]).
- **Experiments** (`components/experiments/`): `StageTimelineExperiment`
  (reused for both the SSR and CSR "watch it happen" experiments the spec
  names explicitly), `HydrationToggleExperiment` (the three-switch demo,
  also named explicitly), `StreamingChunksExperiment`, `CacheLayersExperiment`.
  The other 7 concepts (HTTP, Browser Rendering, HTML Parsing, SSG, ISR,
  React Rendering, Server Components) rely on the static `RuntimeSequence`
  diagram for their "visualize" step rather than a bespoke interactive
  experiment — a deliberate scope line matching exactly the 5 experiments
  the spec calls out by name.
- **Phase 1 touch-ups** (minimal, as scoped): `StatusPicker` extracted from
  `ConceptPanel` and reused via `LessonProgressControl` on lesson pages
  (see [[11-extracting-shared-components]]); `ConceptPanel`'s placeholder
  text replaced with a real "Open full lesson →" link; `LearningMap`'s
  outer section got `id="map"` for the lesson page's "← Back to map" link.

### Bug caught during verification

`useReducedMotion()` from Framer Motion returns `boolean | null` (null
before mount, to avoid an SSR mismatch on the media query). Initializing
`StreamingChunksExperiment`'s `useState<boolean[]>` directly from that
value failed type-checking — fixed with `Boolean(reduceMotion)`. A small
instance of the same general lesson as [[04-hydration-and-external-stores]]:
anything that could differ between server and client needs an explicit,
typed default, not an assumption that the value is always a plain boolean.

### 🧠 Learning checkpoint

After this step, I should understand:

1. How a dynamic route (`[slug]`) becomes 12 separate static files at build time, and how to verify that actually happened rather than assuming it.
2. Why `RuntimeSequence` (no interactivity) stays a Server Component while `InterviewQuestions` and the experiments (real `useState`) must be Client Components — and why that boundary is drawn per-component, not per-page.
3. Why representing "which experiment a lesson uses" as a string tag, switched on in one place, is preferable to each lesson file importing a component directly.
4. When duplicating UI briefly (two call sites) is worth extracting immediately versus waiting for a third occurrence — and what made `StatusPicker` an "extract now" case.
5. How the `grid-template-rows: 0fr → 1fr` technique animates to a content-dependent height without any JavaScript measuring anything.

## Phase 1.2 — Tooltip clipping, scroll-driven layout, panel-as-layout

**Date:** 2026-09-19

Three more rounds of feedback:

- **Tooltip clipping at edge nodes.** `MapTooltip` centered itself on the
  hovered node with `-translate-x-1/2`; for nodes near the map's left/right
  edge (HTTP, Streaming) that pushed roughly half the tooltip past the
  container, which `overflow-hidden` then clipped. Fixed two ways: moved
  `overflow-hidden` off the outer wrapper onto an inner one that only
  clips the SVG (so tooltip/panel are never subject to it), and replaced
  the transform-based centering with a `clamp()`-based `left`/`top` — the
  tooltip still centers on the node everywhere in the middle of the map,
  but slides to stay fully inside a fixed 8px inset near the edges instead
  of overflowing.
- **Renamed again**, to **Behind the Render** (the user proposed it
  directly) — "Critical Path" is still mentioned in `CLAUDE.md`'s history
  note for continuity.
- **Scroll-driven layout** (`components/home/ScrollExperience.tsx`, new):
  the hero fades out (opacity + a small upward drift) as it scrolls past
  the top of the viewport, using `useScroll` targeted at the hero's own
  element rather than a raw window-scroll listener — the fade is tied to
  *that element's* scroll progress, not an arbitrary pixel threshold.
  Once the hero has mostly scrolled away, the map sheds its "card" look
  (max width, padding, rounded corners) and expands edge-to-edge. The
  discrete expand/collapse state is derived from the same continuous
  scroll value via `useMotionValueEvent`, only calling `setState` when it
  actually flips — not on every scroll pixel.
- **Concept panel stopped covering nodes.** It was `absolute right-4
  top-4`, which sat directly on top of Hydration/Server Components/
  Streaming (all positioned in the map's top-right). Restructured
  `LearningMap` as a CSS grid with the panel as a real second column
  (`grid-template-columns` transitions from `1fr 0rem` to `1fr 20rem`)
  instead of an overlay — opening the panel now shrinks the map's column
  and the SVG scales down with it (still `w-full`, same viewBox), so every
  node stays visible rather than being hidden underneath a floating card.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why `useScroll({ target, offset: ["start start", "end start"] })` produces a 0→1 progress value tied to one element's position, and how that differs from listening to `window.scroll` directly.
2. Why deriving a boolean from a continuous Framer Motion value with `useMotionValueEvent` (rather than `useTransform` + reading `.get()` in render) avoids unnecessary re-renders.
3. Why "shrink the layout" (CSS grid columns) is a more robust fix for "panel covers content" than "raise the z-index of the map" would have been.

## Phase 1.1 — Visual identity pass + hover bug fix

**Date:** 2026-09-19

Feedback after the first pass: hovering a node made it jump to the
top-left of the map, the name "The Rendering Lab" read as generic, and the
overall look (Geist font, flat single-vignette background) felt like a
default Next.js template rather than a distinct product.

- **Fixed the hover bug**: `MapNode.tsx` had both a raw `transform="translate(x,y)"`
  attribute and Framer Motion's `whileHover={{ scale }}` writing to
  `transform` on the same `<motion.g>`. Motion's generated transform
  replaced the translate outright on hover, snapping every node to the
  SVG origin. Fixed by nesting a plain positioning `<g>` around a
  `<motion.g>` that owns only the hover scale. Full writeup:
  [[07-transform-composition-bug]].
- **Renamed** the site to **Critical Path** (a real term from browser
  performance work) — updated `<title>`, the hero, and annotated
  `CLAUDE.md` §1 to record the change without rewriting the original spec.
- **Replaced Geist Sans/Mono** with **Space Grotesk** (headings/body) and
  **JetBrains Mono** (labels, node captions, the new terminal-style status
  line) — both self-hosted via `next/font/google`, chosen to move away
  from the default look every Next.js starter ships with.
- **Rebuilt the background system** (`app/globals.css`,
  `components/ui/GridBackdrop.tsx`, new `AmbientGlow.tsx`): two off-center
  color blooms instead of one centered vignette, a darkened edge, a faint
  SVG-noise grain layer, and one slow-drifting animated glow isolated into
  its own small client component so the rest of the backdrop stays a
  Server Component.
- Added `HudCorners.tsx` (static corner brackets) and `TerminalLine.tsx`
  (blinking-cursor status line) to the hero for an instrument-panel feel.

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why writing to the same CSS/SVG `transform` from two different sources doesn't merge — one write wins outright.
2. Why splitting "position" and "animated transform" onto two nested elements is the general fix for that class of bug, not just a one-off patch.
3. What `next/font/google`'s `variable` option actually generates, and why giving two different fonts colliding CSS variable names (`--font-mono` used by both Tailwind's theme and JetBrains Mono's injected variable) would have caused a silent bug.

## Phase 1 — Landing page + interactive knowledge map

**Date:** 2026-09-19

### What was implemented

- Project scaffolded with `create-next-app` (Next.js 16, App Router, TypeScript, Tailwind v4) at `C:\Programming\RenderingLab\rendering-lab`, following this machine's existing convention of keeping real project code under `C:\Programming\<Project>` rather than the Windows user profile.
- `framer-motion` added for animation (variants, `AnimatePresence`, `useReducedMotion`).
- Concept data for the 12 Phase 1 topics (`data/concepts.ts`): HTTP, Browser Rendering, HTML Parsing, CSR, SSR, SSG, ISR, React Rendering, Hydration, Server Components, Streaming, Caching — each with a title, one-sentence blurb, category, prerequisite list, and a hand-placed `{x, y}` position in a 1600×800 layout space.
- `lib/graph.ts` derives the edge list from each concept's `prerequisites` array (no separate hand-maintained edge file — one source of truth), plus a neighbor lookup for hover highlighting and a cubic-bezier path builder for curved connections.
- `lib/progress.ts` — a hand-written external store (`useSyncExternalStore`) backed by `localStorage`, holding a `NodeStatus` (`not-started` / `learning` / `got-it` / `revisit` / `mastered`) per concept.
- `components/learning-map/` — `LearningMap` (SVG orchestrator), `MapNode` (per-state glow/glyph/animation), `MapEdge` (gradient curve + travelling pulse dot via native SVG `<animateMotion>`), `MapTooltip` (hover), `ConceptPanel` (click-to-open status control), `MapLegend`.
- `components/ui/` — `Hero`, `GridBackdrop` (static grid + vignette, Server Component), `AmbientParticles` (drifting dots, deterministic positions so SSR/CSR output matches).
- Dark cinematic visual system in `app/globals.css`: a small fixed set of CSS custom properties for background/grid/text plus five state colors — no other accent hues anywhere in the UI.

### Key architectural decisions

- **State lives outside React components**, in a module-level store (`lib/progress.ts`), not lifted through props from `page.tsx`. Both the map and the concept panel read the same snapshot.
- **No lesson routes yet.** Clicking a node opens an in-map panel instead of navigating to `/learn/[slug]`, since lesson content doesn't exist yet. This still exercises the full 5-state progress model.
- **Positions are hand-placed, not force-directed.** A layout algorithm (e.g. d3-force) was deliberately skipped for 12 nodes — hand-tuned coordinates give more control over the "organic but readable" look the spec asks for, and avoid a dependency.

### Bug caught during manual verification

`useSyncExternalStore`'s `getServerSnapshot` was returning `defaultProgress()` called inline, which allocates a new object every call. React compares snapshots with `Object.is`, so a fresh object each render looks like "the value changed," which triggered a real "getServerSnapshot should be cached to avoid an infinite loop" warning in the dev server log during testing. Fixed by hoisting a single `SERVER_SNAPSHOT` constant computed once at module load. See [[04-hydration-and-external-stores]].

### Files of note

`data/concepts.ts`, `lib/graph.ts`, `lib/progress.ts`, `lib/node-visuals.ts`, `components/learning-map/*`, `app/globals.css`, `app/page.tsx`, `app/layout.tsx`.

---

### 🧠 Learning checkpoint

After this step, I should understand:

1. Why a click handler or `useState` forces a component to be a Client Component in the App Router, and why `GridBackdrop` didn't need `"use client"` but `MapNode` does.
2. Why reading `localStorage` directly during render would break server-rendering, and what `useSyncExternalStore`'s `getServerSnapshot` is actually for.
3. How an SVG cubic bezier path (`M x y C c1x c1y, c2x c2y, x y`) produces a curve, and how a `<linearGradient>` with `gradientUnits="userSpaceOnUse"` ties its colors to two node positions.
4. Why the edge list is *derived* from `concept.prerequisites` instead of being hand-authored separately, and what bug class that avoids.
