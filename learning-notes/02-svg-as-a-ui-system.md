# SVG as a UI System (the Knowledge Map)

## What is this?

SVG (Scalable Vector Graphics) is an XML-based drawing language that's also
just... JSX. `<circle>`, `<path>`, `<text>` are real DOM elements you can
attach React event handlers and Framer Motion animations to, exactly like
`<div>`.

## Why are we using it?

The spec explicitly rules out "rectangular cards connected by lines" and
asks for glowing nodes, curved connections, and animated paths. That's a
drawing problem, and SVG is the CSS/Framer-Motion-compatible way to solve
it without reaching for WebGL/Three.js (which the spec also rules out for
something this simple — 2.5D, not a 3D engine).

## What did we implement

- `LearningMap.tsx` renders one `<svg viewBox="0 0 1600 800">` containing
  every edge and every node.
- `MapEdge.tsx` draws a cubic bezier `<path>` between two node centers,
  stroked with a per-edge `<linearGradient>`, plus a small `<circle>` that
  travels along the same path via the native `<animateMotion>` element.
- `MapNode.tsx` draws a blurred glow circle (via an SVG `<filter>` with
  `<feGaussianBlur>`), a solid circle, and centered `<text>` glyphs —
  all positioned with a single `transform="translate(x, y)"` on a `<g>`.

## How does it work?

**viewBox** defines a fixed internal coordinate system (`1600 × 800` units)
that SVG then scales to fit whatever pixel size the `<svg>` element is
rendered at — this is *why* the map is responsive for free: every child
element's coordinates are written once, in "map space," and the browser
handles the scaling.

**Cubic bezier paths** (`M x0 y0 C c1x c1y, c2x c2y, x1 y1`) draw a curve
from `(x0,y0)` to `(x1,y1)` that's pulled toward two control points,
`(c1x,c1y)` and `(c2x,c2y)`. `lib/graph.ts`'s `buildEdgePath` picks control
points offset horizontally from each endpoint — proportional to the
horizontal distance between nodes — which produces a smooth S-curve
regardless of how far apart or how vertically offset two nodes are.

**`<linearGradient gradientUnits="userSpaceOnUse">`** ties a gradient's
start/end colors to *map coordinates* (the two node positions) rather than
the bounding box of the shape using it — this is what makes each edge fade
between its two endpoint's state colors correctly no matter the curve's
shape.

**`<animateMotion path="...">`** is a native SVG animation: it moves its
parent element (the small dot) along an arbitrary path string, looped,
entirely outside of JavaScript's per-frame involvement — cheap, and it's
skipped entirely when `prefers-reduced-motion` is on.

## What happens at runtime

```
lib/graph.ts: edges[] (derived from concept.prerequisites)
      ↓
LearningMap.tsx maps edges → <MapEdge> and concepts → <MapNode>
      ↓
Each MapEdge computes its own <path d="..."> from the two connected
concepts' {x,y} positions
      ↓
Browser's SVG renderer paints the path stroked with its per-edge
gradient, then composites each node's blur-filtered glow circle
underneath its solid circle
```

## Why did we choose this approach?

SVG elements are real DOM nodes, so they compose with everything else in
the React/Tailwind/Framer Motion stack already in use — no new rendering
pipeline, no canvas-based hit-testing to reimplement for hover/click.

## Alternatives

- **HTML/CSS only** (absolutely positioned `<div>`s + `border-radius` for
  nodes, `clip-path` or skewed borders for "curves") — curved connections
  between arbitrary points are essentially impossible without SVG or
  canvas.
- **Canvas 2D** — faster for hundreds/thousands of elements, but loses
  per-element DOM semantics: no native `onClick` per node, no CSS
  transitions, manual hit-testing and accessibility work. Overkill for 12
  nodes.
- **Three.js/WebGL** — explicitly out of scope per the spec; would add a
  real 3D rendering pipeline for a fundamentally 2D diagram.

## Interview questions

1. **Fundamentals:** What does an SVG `viewBox` actually control, and how is it different from the element's `width`/`height` attributes?
2. **Tricky:** Why does `gradientUnits="userSpaceOnUse"` matter here — what would look wrong if it were left at the default (`objectBoundingBox`)?
3. **Scenario:** You need to render 5,000 animated nodes instead of 12. Would you keep this SVG approach? What would you change first?
4. **Senior:** How would you make this SVG graph accessible to a keyboard/screen-reader user — what's missing from a `<circle onClick>` compared to a real `<button>`?
5. **Debugging:** A `<linearGradient>` defined inside one `<MapEdge>` isn't rendering for that edge specifically, while others work — what's the most likely cause? (Hint: SVG `id` scoping.)

## Related concepts

[[03-modeling-a-dag-in-typescript]] · [[06-animation-and-reduced-motion]]
