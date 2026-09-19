# The Hover Bug: Two Things Writing to One `transform`

## What is this?

`transform` is a single CSS/SVG attribute, but many different pieces of
code often want to contribute to it — one part positions an element,
another part scales or rotates it on hover. If two independent sources
both write to `transform` directly, the second write **replaces** the
first; it doesn't merge with it.

## Why does this matter here?

`MapNode.tsx` positions each node with `transform="translate(x, y)"` — a
plain SVG attribute, computed once from the concept's data. Framer Motion
also writes to an element's `transform` whenever it animates `scale`,
`x`, `y`, or `rotate` via `animate`/`whileHover`. Both were targeting the
**same** `<motion.g>` element.

## What broke

```tsx
// Before — both on one element:
<motion.g
  transform={`translate(${x}, ${y})`}   // ← raw attribute
  whileHover={{ scale: 1.06 }}           // ← Framer Motion also owns `transform`
>
```

The moment `whileHover` activated, Framer Motion generated its own
`transform` value (something like `scale(1.06)`) and **overwrote** the
`translate(x, y)` attribute entirely — it has no way to know there was a
translate it should preserve, because it doesn't read existing attribute
values, it owns the property outright once it's animating it. Every node
snapped to `(0, 0)`, the SVG's own origin — which sits at the top-left of
the container, exactly matching the reported bug.

## The fix

Separate the two concerns onto two nested elements:

```tsx
<g transform={`translate(${x}, ${y})`}>      {/* positioning only, untouched by Motion */}
  <motion.g whileHover={{ scale: 1.06 }}>    {/* Motion owns transform here, freely */}
    {/* node visuals, all drawn relative to (0,0) — which is now the node's center */}
  </motion.g>
</g>
```

Because the outer `<g>` already translated the coordinate system, `(0, 0)`
inside the inner `<motion.g>` *is* the node's center — so Motion scaling
"around the origin" is now correct by construction, not by coincidence.

## The general principle

This isn't Framer-Motion-specific. The same failure mode happens with:

- CSS `transition: transform` combined with a JS library that also sets
  `element.style.transform`
- Two CSS classes both setting `transform` on the same element (the later
  one in the cascade wins outright, doesn't compose)

**The fix is always the same shape**: give each concern its own element in
the DOM, or compose the transforms into a single string yourself
(`transform: translate(...) scale(...)`) if you must keep one element —
Framer Motion supports this via a custom `transformTemplate` prop, which
was considered but rejected here in favor of the simpler nested-element
split.

## Interview questions

1. **Fundamentals:** If two CSS rules both set `transform` on the same element, do their values combine or does one win outright?
2. **Tricky:** Why did this bug make nodes jump specifically to the *top-left*, rather than somewhere random?
3. **Scenario:** You're animating a card that needs to both `translate` (drag) and `rotate` (tilt on hover) using a single animation library. How do you structure the transforms so both work together?
4. **Senior:** A teammate proposes fixing this kind of bug by wrapping the translate in `useEffect` and re-applying it after every animation frame. What's wrong with that approach compared to the nested-element fix?
5. **Debugging:** You inherit a codebase where a similarly-animated element "jumps" only on the *first* hover after page load, then behaves correctly afterward. What's a plausible cause distinct from this bug?

## Related concepts

[[02-svg-as-a-ui-system]] · [[06-animation-and-reduced-motion]]
