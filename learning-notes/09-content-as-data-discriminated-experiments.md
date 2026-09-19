# Content-as-Data: Dispatching Experiments by a Discriminated Tag

## What is this?

Instead of each lesson's data file importing and referencing a specific
React component for its interactive experiment, a `Lesson` just carries a
string tag (`experiment?: "ssr-timeline" | "csr-timeline" | "hydration-toggle" | ...`).
One place — `ExperimentPanel.tsx` — switches on that tag to decide which
actual component to render.

## Why are we using it here?

`data/lessons/*.ts` are meant to be pure content — plain-English strings,
arrays, no JSX. If a lesson file imported `<HydrationToggleExperiment />`
directly, the data layer would depend on the component layer, which makes
the data harder to reason about in isolation (and would force every lesson
file to be a `.tsx` importing React, for no content-related reason).

## What did we implement

`lib/types.ts` defines `ExperimentKind` as a string union. Each lesson
(e.g. `hydration` in `data/lessons/react-nextjs.ts`) sets
`experiment: "hydration-toggle"`. `components/lesson/ExperimentPanel.tsx`
takes a `Lesson` and does a plain `switch` on `lesson.experiment`, returning
the matching component — `StageTimelineExperiment`, `HydrationToggleExperiment`,
`StreamingChunksExperiment`, or `CacheLayersExperiment`.

## How does it work?

This is the same pattern as a Redux action's `type` field, or a GraphQL
union's `__typename` — a plain string (or literal type) that lets code
elsewhere decide what to do, without the data itself needing to know about
that code. TypeScript's string-literal unions make this exhaustive-checkable:
adding a new `ExperimentKind` value without a matching `case` in the switch
is something a `default: return null` currently hides, but the type system
at least makes every valid tag visible in one place (`lib/types.ts`).

## Parent → Child relationship

`LessonPage` (server) reads `lesson.experiment` and passes the whole
`lesson` object to `ExperimentPanel` (also server-renderable — it does no
hooks itself, just a switch). `ExperimentPanel` renders whichever *client*
component matches. The Server → Server → Client chain here mirrors
[[01-nextjs-app-router-boundaries]]: the switch itself doesn't need to be a
Client Component, only the leaf experiments (which hold `useState`) do.

## Why this approach?

Two of the five experiment kinds (`ssr-timeline`, `csr-timeline`) reuse the
exact same `StageTimelineExperiment` component with different data
(`lesson.runtime`) — the tag-based dispatch makes that reuse a one-line
`case` addition rather than a new component.

## Alternatives

- **Store a component reference directly in the lesson data** (e.g.
  `experiment: HydrationToggleExperiment`) — works, but couples
  `data/lessons/*.ts` to `components/`, and makes lesson data files `.tsx`
  files that import React for no content-related reason.
- **A giant `if/else` chain per concept id instead of a shared tag** — would
  duplicate the "which experiment for which concept" mapping in two
  places (the lesson data *and* the dispatch logic) instead of one.

## Interview questions

1. **Fundamentals:** What's the benefit of a string-literal union (`"a" | "b"`) over a plain `string` type for something like `ExperimentKind`?
2. **Scenario:** You need to add a sixth experiment kind. Walk through every file that changes.
3. **Senior:** How would you make the `switch` in `ExperimentPanel` fail to compile (not just silently return `null`) if a new `ExperimentKind` is added without a matching case?

## Related concepts

[[01-nextjs-app-router-boundaries]] · [[03-modeling-a-dag-in-typescript]]
