# GPU-Friendly Animation and `prefers-reduced-motion`

## What is this?

Not every CSS property animates the same way under the hood. Animating
`transform` and `opacity` only touches the compositor (a separate,
GPU-backed stage of the rendering pipeline) — the browser doesn't have to
re-run layout or repaint. Animating `width`, `top`, `left`, or box-shadow
size *does* trigger layout/paint on every frame, which is where visible
jank comes from.

`prefers-reduced-motion` is an OS-level accessibility setting a user
enables; `window.matchMedia('(prefers-reduced-motion: reduce)')` (which
Framer Motion's `useReducedMotion()` wraps) lets a site respect it.

## Why are we using it?

The spec is explicit: prefer `transform`/`opacity`, avoid layout-triggering
animation, and support `prefers-reduced-motion` — the project is meant to
*demonstrate* good performance practice, not just teach it.

## What did we implement

- Every animated value in `MapNode.tsx` and `AmbientParticles.tsx` is
  `opacity` or a `scale`/`y` `transform` (via Framer Motion's `animate`
  prop, which compiles to `transform`), never a layout-affecting property.
- `useReducedMotion()` is checked in `MapNode`, `MapEdge`, and
  `AmbientParticles`; when true, looping animations are replaced with a
  single static value instead of an animated one (see `MapNode`'s glow
  circle: `animate={visual.animated && !reduceMotion ? {...loop...} : {...static...}}`).
- The travelling pulse dot on completed edges (`MapEdge.tsx`) is skipped
  entirely (`isActive && !reduceMotion`) rather than just having its
  duration set to zero — a reduced-motion user gets no motion, not
  "instant" motion, which can still read as a flash.

## How does it work?

The compositor stage can transform and fade already-painted layers
independently of the main thread, at the display's refresh rate, without
asking layout/paint to run again. `transform: scale()`/`translate()` and
`opacity` are the two CSS properties the browser can hand off entirely to
that stage. Framer Motion's `animate`/`whileHover` props are built to
prefer exactly these properties.

## Why did we choose this approach?

A dozen nodes each animating a glow is a lot of concurrent animation if
done carelessly (e.g. animating `filter: blur()` radius directly, or box
shadow spread, both of which are expensive per frame). Keeping the blur
radius **fixed** (baked into the SVG `<filter>` once) and animating only
the glow circle's `opacity` gets the same "breathing" visual for a
fraction of the cost.

## Alternatives

- **CSS `@keyframes` instead of Framer Motion** — would work for the
  simple loops (glow pulse) but `AnimatePresence`'s exit animations (the
  concept panel sliding out) need JavaScript to delay unmounting until the
  exit animation finishes, which plain CSS can't coordinate with React's
  render lifecycle.

## Interview questions

1. **Fundamentals:** Name two CSS properties that only trigger compositing (not layout or paint), and two that trigger layout.
2. **Tricky:** Why does baking a blur radius into an SVG `<filter>` once, then animating only `opacity`, cost less than animating the blur radius directly?
3. **Scenario:** A designer asks for a node to visibly grow in size when "mastered." What's the performance-conscious way to implement "grow" versus the naive way?
4. **Senior:** How would you audit an existing page for reflow-triggering animations without a profiler open, just by reading the CSS/JS?
5. **Debugging:** A reduced-motion user reports the map still "flashes" briefly on hover even though loops are disabled — where would you look first, based on how this project structured the `reduceMotion` check?

## Related concepts

[[02-svg-as-a-ui-system]] · [[00-build-log]]
