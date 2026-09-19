# Route Transitions (`key` + `AnimatePresence`) and Inline Emphasis Parsing

## What is this?

Two small mechanisms added together:

1. **`app/template.tsx`** — fades/slides page content in on navigation.
2. **`Prose`** — a tiny inline formatter turning `**bold**`, `==highlight==`, and `*italic*` markers in lesson strings into styled elements.

## Why are we using them here?

Clicking "Open full lesson" from the map previously swapped pages with no visual continuity. And lesson content is plain strings in `data/lessons/*.ts`; important statements needed emphasis without turning the data layer into JSX or adding a markdown dependency.

## What did we implement

- `app/template.tsx` (client) — enter-only transition, remounted per navigation.
- `ScrollExperience.tsx` — arriving via `/?to=map` (the lesson's "← Back to map" link) starts at the top, then glides to the map with Framer's `animate()` driving `window.scrollTo` (cancelled by wheel/touch/keys).
- `components/lesson/Prose.tsx` (server-safe, no hooks), used by `ReactNextCallout`, `MisconceptionsList`, `TradeoffsGrid`, and the lesson page's prose sections. Markers were added to the key statements in every lesson under `data/lessons/`.

## How does it work?

**Transition (final version):** `app/template.tsx` — unlike `layout.tsx`, which persists across navigations, a template is *re-created* when the route segment beneath it changes (not on every route change: see the fixes below). A `motion.div` inside it replays `initial` → `animate` (fade + 10px rise, or a sideways slide when a direction was recorded, 0.45s) each time it mounts. Only `opacity`/`transform` animate ([[06-animation-and-reduced-motion]]); reduced-motion users get no animation.

**Two later fixes to the template** (found by testing in a real browser): (1) a template only remounts when the route *segment* above it changes, so `/learn/ssr` → `/learn/ssg` (same `learn` segment) never replayed the animation; the animated wrapper is now keyed by `usePathname()`. (2) The first version server-rendered the page at `opacity: 0` until JavaScript ran, so a hard reload flashed blank; the first mount of a session now skips the animation. Related-topic links also pass a direction (`lib/nav-direction.ts`) so the page slides in from the left (prerequisite) or right (builds on this): see [[00-build-log]] Phase 2.6.

**What I tried first, and why it blinked:** a `usePathname()`-keyed `AnimatePresence mode="wait"` wrapper in the layout (exit old page, then enter new). In the App Router this is fragile: `mode="wait"` withholds the new page until the exit finishes (an empty gap = visible blink), and the exiting copy can re-render with the router's already-updated content. The router swaps page content immediately; an exit phase means fighting it. Enter-only via `template.tsx` has no exit to fight.

**Prose:** `text.split(/(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*)/g)` — wrapping the alternation in a capture group makes `split` keep the delimiters, so plain and marked segments alternate in the array. Each segment maps to a `<strong>`, `<mark>`, `<em>`, or a plain fragment. Highlight contents render recursively so italics can nest inside them.

## Rendering behavior

`Prose` runs on the server at build time (lessons are SSG — [[08-dynamic-routes-and-static-generation]]); the emphasis is baked into static HTML, zero client JS. `PageTransition` is the only client piece: it needs `usePathname` and animation state.

## Why this approach? / Alternatives

- Markdown library (`react-markdown`): far more than needed; adds bundle weight to a server-rendered page.
- Storing JSX in lesson data: couples content to components ([[09-content-as-data-discriminated-experiments]]).
- Next.js View Transitions / shared-element APIs: still experimental for App Router; the `key` + `AnimatePresence` pattern is simpler and well-understood.

**Bug hit: background jitter when the animation settled.** A `transform` on an ancestor makes it the containing block for `position: fixed` descendants. The fixed `GridBackdrop` was inside the animated template, so it rode along with the 10px rise, then snapped to the viewport when Framer Motion reset the transform to `none`. Fix: move `GridBackdrop` into `app/layout.tsx`, outside the animated subtree — it now persists across routes and never moves or re-fades. General rule: never put `position: fixed` elements under something you animate with `transform`, `filter`, or `perspective`.

**Auto-scroll gotcha:** React StrictMode runs effects twice in dev. The first version stripped `?to=map` from the URL immediately, so the second run found nothing to do — the param is now only stripped once the animation actually starts.

## Interview questions

1. **Fundamentals:** What's the difference between `layout.tsx` and `template.tsx` in the App Router, and when would you want each?
2. **Tricky:** Why does `String.split` with a regex containing a capture group return the separators too?
3. **Senior/Scenario:** Exit animations don't play on route change in your App Router app. What could be unmounting the old page before `AnimatePresence` can hold it?

## Related concepts

[[06-animation-and-reduced-motion]] · [[01-nextjs-app-router-boundaries]] · [[08-dynamic-routes-and-static-generation]]
