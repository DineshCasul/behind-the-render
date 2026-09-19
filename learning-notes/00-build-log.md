# Build Log

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
