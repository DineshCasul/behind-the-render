# Build Log

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
