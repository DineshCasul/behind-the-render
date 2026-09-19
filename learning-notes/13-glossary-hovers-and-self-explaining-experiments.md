# Glossary Hovers, Hint Reveals, and Self-Explaining Experiments

## What is this?

Three changes aimed at one problem: lessons used words and widgets that assumed you already understood them.

1. **Glossary hovers**: hard terms in lesson text get a dotted underline and a plain-English card.
2. **Topic hints**: every "What you'll learn" item in the map panel reveals a one-line meaning on hover.
3. **Experiment framing**: every experiment now says what it shows, gives a "Try this" list, and uses a mock browser with two lights (Content visible / Clickable).

## What did we implement

- `data/glossary.ts`: ~50 entries `{ term, match[], meaning }`.
- `components/lesson/Term.tsx`: the hover card. Pure CSS, a Server Component.
- `components/lesson/Prose.tsx`: now scans text for glossary terms.
- `LessonTopic.hint` (`lib/types.ts`, `data/concepts.ts`), revealed in `ConceptPanel.tsx`.
- `RuntimeStep.userSees` (`lib/types.ts`), authored for CSR and SSR steps, drives the timeline's mock browser.
- `components/experiments/MockBrowser.tsx` (shared), plus rewrites of all four experiments and a framing header in `ExperimentPanel.tsx`.

## How does it work?

**Term matching.** All spellings from the glossary are lowercased into a `Map`, then joined into one regex sorted **longest first**, so "layout shift" beats "layout" and "DOM mutations" beats "DOM" (regex alternation takes the first alternative that matches, not the longest). Boundaries use a lookbehind `(?<![\w-])` and lookahead `(?![\w])` so "edge" doesn't match inside "edges" or "knowledge". Only the **first occurrence per paragraph** is wrapped (a shared `Set` passed down the recursion, which also covers text inside `==highlights==`); underlining every "cache" would just be noise.

**The card is CSS, not state.** Tailwind's named group variants (`group/term`, `group-hover/term:`, `group-focus/term:`) show and hide the bubble. `tabIndex={0}` makes the term keyboard-reachable and tappable on phones, where hover doesn't exist. No JavaScript means it stays server-rendered and adds nothing to the client bundle.

**Why the topic hint is inline, not a floating tooltip.** The map panel is a scrolling column (`overflow-y-auto`), and an absolutely positioned bubble inside a scroll container gets clipped. Revealing the hint *inside* the link with the `grid-template-rows: 0fr → 1fr` trick ([[10-css-grid-accordion-without-js-height]]) can't be clipped. The interview accordion doesn't use glossary hovers for the same reason (its content sits inside an `overflow-hidden` wrapper, and a `<button>` can't contain focusable spans).

**Experiments that explain themselves.** The old timeline only lit up circles, which told you *that* something progressed but not *why it mattered*. The new version pairs each step with what the visitor sees, so the SSR "gap" (content visible at step 4, clickable at step 6) and CSR's "everything arrives together" are visible in the two lights rather than asserted in prose. Clicking the mock button before it's interactive shows "no click handler is attached yet": the misunderstanding about hydration, made tangible.

**Bugs fixed on the way.** The old hydration experiment treated "JavaScript on, Server HTML off" as *not interactive*, which is wrong: that's CSR, where React builds the page itself and it's visible and clickable together. The Hydration switch is now disabled (with a reason) when there's nothing to attach to. The old cache experiment right-aligned its checkboxes far from their labels; controls now sit on the left with the label and a one-line explanation beside them.

## Rendering behavior

Glossary matching and `Term` run on the server at build time (lessons are statically generated, [[08-dynamic-routes-and-static-generation]]). Only the experiments and `MockBrowser` are Client Components.

## Why this approach? / Alternatives

- **A tooltip library** (Radix, Floating UI): handles collision and flipping, but adds a dependency and client JS for what CSS does for a fixed-width card.
- **`title` attribute**: free, but unstyled, slow to appear, and invisible on touch.
- **Marking terms by hand in each string** (`{{term}}`): precise, but hundreds of edits and easy to forget; auto-matching keeps the content clean at the cost of occasional over-matching, which is why entries are whole-word and first-occurrence only.

Known limit: the card is centered above the term, so on very narrow screens a term at the edge can push it past the viewport.

## Interview questions

1. **Fundamentals:** In a regex alternation `a|ab`, which alternative wins on the input `"ab"`, and why does sorting alternatives longest-first fix that?
2. **Tricky:** Why can't a floating tooltip inside an `overflow-y: auto` container be trusted to appear fully, and what are two ways around it?
3. **Scenario:** A hover card must also work on a phone. What does `tabIndex={0}` plus a `:focus` variant give you, and what would you add for a more robust touch experience?
4. **Senior:** Why is "visible" versus "interactive" the most important distinction when teaching SSR and hydration, and how does the mock browser make it testable rather than just stated?

## Related concepts

[[Hydration]] · [[10-css-grid-accordion-without-js-height]] · [[12-route-transitions-and-inline-emphasis]] · [[01-nextjs-app-router-boundaries]]
