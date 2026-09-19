# Build Log

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
