# When to Extract a Shared Component: `StatusPicker`

## What is this?

`StatusPicker` is the row of 5 status buttons (Not Started / Learning /
Got It / Revisit / Mastered). It used to be inline JSX inside
`ConceptPanel.tsx` only; Phase 2 pulled it out into
`components/lesson/StatusPicker.tsx` so both `ConceptPanel` (the map's
click-to-open panel) and the new lesson page (`LessonProgressControl`) can
use the identical control.

## Why are we using it here?

Phase 2 needed the exact same "pick one of 5 statuses" interaction on the
lesson page — copy-pasting the button markup a second time would work today,
but the moment one copy's styling or behavior needed a small fix (say, a
disabled state, or a new status color), it would be easy to update one copy
and forget the other.

## What did Claude implement

`components/lesson/StatusPicker.tsx` takes `conceptId`, `current`, and
`onSetStatus`, and renders the button row. `ConceptPanel.tsx` was edited to
render `<StatusPicker />` instead of its own inline version.
`LessonProgressControl.tsx` (new, client) wraps `useProgress()` +
`StatusPicker` together, so the lesson page itself can stay a Server
Component while still getting this one interactive control.

## How does it work?

No new mechanism here — this is a plain "lift shared UI into a component,
pass the differing bits as props" refactor. The interesting part is *when*
to do it, not *how*.

## Why this approach — the "rule of three" tradeoff

A common heuristic is "don't abstract until the third occurrence" (WET —
Write Everything Twice — over premature DRY). This project deliberately
extracted at the **second** occurrence instead, because:

- The two copies would be pixel-for-pixel behaviorally identical (same 5
  statuses, same visual encoding via `STATUS_VISUALS`) — there's no
  reason to expect them to diverge in a way that would make a shared
  component wrong for one call site.
- The two call sites are far apart in the codebase (`components/learning-map/`
  vs `components/lesson/`) — a future developer editing one has no strong
  visual cue that a sibling copy exists elsewhere to also update.

The general judgment call: extract early when duplication is *exact* and
*conceptually one thing* (there's only one correct way to render "the 5
progress states"); wait for a third occurrence when the copies are only
superficially similar and might reasonably diverge.

## Alternatives

- **Leave it duplicated until a third use case appears** — the textbook
  "rule of three." Reasonable in general, less so here given the two
  copies' distance in the codebase and their exact equivalence.
- **A render-prop or children-based API instead of a fixed component** —
  would add flexibility neither call site actually needs; premature
  generality for a control that only ever means one thing in this app.

## Interview questions

1. **Fundamentals:** What's the "rule of three" for deciding when to extract a shared component?
2. **Senior/Scenario:** Two components look identical today but represent conceptually different things (e.g., a "status" badge and a "priority" badge that happen to share styling by coincidence). Would you still extract a shared component? Why or why not?
3. **Debugging:** A shared component gets a new required prop added for one call site's needs. What's the risk to the *other* call site, and how would you guard against it?

## Related concepts

[[00-build-log]] · [[01-nextjs-app-router-boundaries]]
