# Animating an Accordion's Height with Pure CSS (No JS Measurement)

## What is this?

`InterviewQuestions.tsx` expands/collapses each question's answer with a
smooth height transition, without ever calling `element.scrollHeight` or
using a library — a CSS-only technique using `grid-template-rows`.

## Why are we using it here?

CSS can't natively transition to/from `height: auto` (the browser needs to
know the start and end values to interpolate, and `auto` isn't a fixed
number) — the classic workaround is measuring `scrollHeight` in JavaScript
and animating to that pixel value. That works, but adds a `ResizeObserver`
or manual remeasurement for any content that could change size. The
`grid-template-rows` trick sidesteps needing to measure anything at all.

## What did we implement

Each question in `components/lesson/InterviewQuestions.tsx` renders:

```tsx
<div className="grid transition-[grid-template-rows] duration-300"
     style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
  <div className="overflow-hidden">
    <div>{/* actual answer content */}</div>
  </div>
</div>
```

## How does it work?

A CSS grid track defined in `fr` units *can* be transitioned, unlike
`height: auto`. A single-row grid with `grid-template-rows: 0fr` gives that
row zero height regardless of its content's actual size; `1fr` gives it
exactly as much height as its content needs (since it's the only row).
Transitioning between `0fr` and `1fr` therefore transitions between
"collapsed" and "exactly as tall as the content" — with the browser doing
all the layout math, no JS measurement needed. The `overflow-hidden` on the
inner wrapper clips the content while its row is still shrinking.

## Rendering behavior

This is a pure CSS transition — the browser's compositor/layout engine
handles it. `useState` in the same component only tracks *which* question
is open (a boolean per row is unnecessary — a single `openIndex` number is
enough since only one question opens at a time), triggering a React
re-render that changes one inline style value; the animation itself is not
driven by JavaScript on every frame.

## Why this approach?

The spec's own performance section prefers "lightweight SVG/CSS
visualizations where possible" over pulling in more Framer Motion usage for
something this self-contained — `grid-template-rows` needs zero JavaScript
per frame, versus a JS-measured height animation which needs a
`ResizeObserver` to stay correct if content reflows (e.g. from a browser
font-size change).

## Alternatives

- **Framer Motion's `AnimatePresence` + measured height** — used elsewhere
  in this project (the concept panel's fade, the map tooltip) for exit
  animations, which the CSS-only technique can't do on its own (a
  `display: none` element can't be transitioned without something keeping
  it mounted during the exit). Not needed here since content isn't being
  unmounted, just visually collapsed.
- **The native HTML `<details>`/`<summary>` element** — gets accordion
  behavior with zero JS at all, but its expand/collapse is not animatable
  in most browsers without extra CSS/JS workarounds of its own, and it's
  harder to style consistently with this project's card-based visual
  language.

## Interview questions

1. **Fundamentals:** Why can't CSS transition directly to `height: auto`?
2. **Tricky:** What does `overflow-hidden` on the inner wrapper actually prevent here, specifically during the collapsing (not expanding) transition?
3. **Senior/Scenario:** The interview answer content can include a variable amount of text, sometimes reflowing after a window resize while a question is open. Does this technique still work correctly in that case, and why?

## Related concepts

[[06-animation-and-reduced-motion]]
