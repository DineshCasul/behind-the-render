# An Arrow on an SVG Path, a Camera, and Motion Values

> [!warning] Partly superseded (2026-11-08)
> The journey page no longer has a curved SVG path or a camera. It now uses a split-screen layout with a slim road strip along the top. Motion values and `transform`-only animation (the second idea below) are still exactly how the strip's arrow and trail move. The `getPointAtLength` and camera sections describe the old stage, kept because the ideas are still good interview material. See the build log entry "Journey page: split screen".

## What is this?

The journey page (`/journey`) shows a glowing arrow travelling along a curved
path while the "camera" follows it. Three ideas make that work, and each is
useful far beyond this page:

1. **Asking an SVG path where a point is.** `path.getPointAtLength(d)` returns the
   x/y position `d` units along the path. Move `d` and you move along the curve.
2. **Motion values.** Framer Motion numbers that change every frame and write
   straight to the DOM, so React does not re-render.
3. **A camera as a CSS transform.** The scene is a big element; "moving the
   camera" means translating that element the opposite way.

## Why are we using it?

The old story was a wall of text with decisions. The journey is meant to feel
like a short cutscene: a few narrated lines, a glow moving through the chapters.
The motion has to be smooth on a phone, and the project is meant to show good
performance practice, so the way it is animated matters as much as the look.

## What did we implement?

- `lib/journey-path.ts`: `smoothPath()` (a curve through chosen points) and
  `distancesAlong()` (how far along the path each point is).
- `components/journey/Journey.tsx`: the stage (path, nodes, arrow, camera,
  subtitles, keyboard handling).
- `data/journey.ts`: the narration, as plain data.
- `app/journey/page.tsx`: a Server Component that passes the data in.

## How does it work?

### 1. The path through the nodes

SVG paths speak cubic Béziers: `C c1x c1y, c2x c2y, x y`. We want a curve that
passes *through* a handful of hand-placed points (one per chapter), so we convert a Catmull-Rom spline to
Béziers. For the piece from `p1` to `p2`:

```
c1 = p1 + (p2 - p0) / 6     leave p1 heading the way the curve was already going
c2 = p2 - (p3 - p1) / 6     arrive at p2 heading the way it keeps going
```

The neighbours `p0` and `p3` are what make the joins smooth instead of kinked.

### 2. Asking the path where a point is

`getPointAtLength(d)` goes from distance to position. We also need the reverse
(which distance is node 3 at?), and the browser has no function for that, so
`distancesAlong()` samples the path finely and picks the closest sample to each
node. The tangent (which way the arrow points) comes from two nearby samples:
the point slightly ahead minus the point slightly behind, passed to `atan2`.

### 3. Motion values instead of state

One number, `dist`, is "how far along the path the arrow is". Framer's
`animate(dist, target, { duration, ease })` tweens it. A listener
(`useMotionValueEvent`) turns each new `dist` into x, y and rotation, which are
also motion values, used as `style={{ x, y, rotate }}` on the arrow. A motion
value updates the element's style directly, so there are no React renders during
the animation. React state holds just one thing: which subtitle we're on.

### 4. The camera

The whole scene sits inside a wrapper `div` that is a few thousand pixels wide, much wider than the screen. To keep the
arrow in the middle of the screen the wrapper is translated by
`screenCentre - arrowPosition`. That translate goes through `useSpring`, so the
camera lags a little behind the arrow and settles, which is what makes it feel
filmed rather than glued on. A faint dot layer moves at a third of the speed
(`camX * 0.35`), which gives a cheap sense of depth (parallax).

## What happens at runtime?

```
Reader presses space
  ↓
setNav({ beat: beat + 1 })              React state: one re-render
  ↓
New chapter?  yes → animate(dist, nextNodeDistance)    motion value, no renders
  ↓                           ↓
 subtitle fades in      each frame: getPointAtLength → arrow x/y/rotate
 (delayed 1.1s)                     → camera spring follows → CSS transform
```

## Rendering behaviour

- **Server:** `/journey` is prerendered at build time (static). The title, the
  first subtitle, the whole transcript (hidden visually, readable by screen
  readers) and the chapter links are all in the HTML.
- **Browser:** after hydration, the component measures the path and the stage
  size, then fades the scene in. The SVG itself is drawn once. Only the camera
  wrapper (transform) and the arrow (transform) move. The lit trail is one SVG
  stroke whose dash length changes.
- **JavaScript is required** for the animation and the keyboard controls.
  Without it you still get the first frame and the full transcript.
- **Reduced motion:** the arrow jumps to the next node, the camera follows
  without the spring, there is no breathing halo, and text fades without moving.
  `usePrefersReducedMotion` is used (not Framer's hook) because the answer changes
  what is rendered, which would otherwise mismatch during hydration (see note 06).

## Why did we choose this approach?

- **Plain SVG and CSS, not Three.js.** A glowing path with a camera is a 2D
  problem. WebGL would add a large dependency, a canvas to make accessible and a
  battery cost for no gain. The spec asks for 2.5D without heavy 3D.
- **No scroll-jacking for the narration.** Click, tap, space and the arrow keys
  advance it, and the real `<button>`s make it work with a keyboard and screen
  reader. Taking over native scroll (as the home page's pinned scene does) is
  harder to make comfortable.
- **Glow without blur filters.** The lit path is three strokes of different
  widths and opacities instead of `filter: blur()`. Blurring something that
  repaints every frame is expensive; stacked strokes cost almost nothing.

## Alternatives

- **CSS `offset-path` + `offset-distance`:** moves an element along a path in
  pure CSS. Nice for a fixed animation, but we need to know the position (for the
  camera and the rotation), and `offset-distance` is not compositor-only.
- **GSAP `MotionPathPlugin`:** does this out of the box, at the price of a new
  dependency.
- **Canvas:** best when there are thousands of moving things. Here it would be
  one arrow.

## Interview questions

1. *(Fundamentals)* Why is animating `transform` smoother than animating `left`?
2. *(Tricky)* A motion value changes 60 times a second. Why doesn't the component
   re-render 60 times a second?
3. *(Scenario)* You need an element to follow a curved path and also face the
   direction it's travelling. How do you get both position and rotation from an
   SVG path?
4. *(Senior)* The animation drops frames on a low-end phone. Walk through how you
   would find out whether it's layout, paint or JavaScript, and what you'd change
   first.
5. *(Debugging)* The first frame looks fine on the server but the arrow flashes
   in the wrong place after hydration. What would you check?

## Related concepts

[[06-animation-and-reduced-motion]], [[02-svg-as-a-ui-system]],
[[07-transform-composition-bug]], [[Hydration]], [[React Render Cycle]]
