# Tailwind v4's CSS-First Configuration

## What is this?

Tailwind CSS v4 moved configuration out of `tailwind.config.js` and into
CSS itself, via `@import "tailwindcss"` and an `@theme` block written
directly in a stylesheet.

## Why are we using it?

`create-next-app`'s current Next.js 16 template scaffolds Tailwind v4 by
default — there is no `tailwind.config.ts` in this project at all, which
surprises anyone expecting the v3 setup.

## What did we implement

`app/globals.css`:

```css
@import "tailwindcss";

:root {
  --color-bg: #05070a;
  --state-learning: #5ecbf0;
  /* ...design tokens... */
}

@theme inline {
  --color-background: var(--color-bg);
  --font-sans: var(--font-geist-sans);
}
```

The five node-state colors and the background/text tokens live as plain
CSS custom properties on `:root`, referenced directly in components
(`style={{ color: "var(--state-learning)" }}`) rather than exclusively
through Tailwind utility classes — since these colors are chosen
dynamically per node state at render time, not statically per class name.

## How does it work?

`@theme inline` maps a CSS variable to a Tailwind design token (here,
`--color-background` becomes usable as `bg-background`, and `--font-sans`
backs the `font-sans` utility). `inline` means the token is substituted
directly rather than indirected through another variable layer — relevant
mainly for how Tailwind generates the utility CSS, not something this
project's components need to reason about directly.

Plain `:root` custom properties (the `--state-*` colors) don't need an
`@theme` entry at all if they're only ever consumed via `var(--state-x)`
in inline styles or arbitrary-value classes like `bg-[var(--state-learning)]`
— `@theme` is only required to turn a token into a *named Tailwind
utility* (e.g. wanting a `bg-state-learning` class).

## Why did we choose this approach?

Node/edge colors are picked by a runtime lookup (`STATUS_VISUALS[status].color`),
not known at build time, so they can't be Tailwind utility classes anyway —
plain CSS variables consumed via inline `style` or `var(...)` in an
arbitrary-value class are the correct tool here, independent of which
Tailwind version is in use.

## Alternatives

- **Tailwind v3 `tailwind.config.js`** — the previous approach; would need
  downgrading a dependency the scaffolding tool chose deliberately.
  Not adopted, since v4 CSS-first config works fine and is what's actually
  installed (`"tailwindcss": "^4"` in `package.json`).
- **CSS-in-JS** (styled-components, emotion) — would let color values be
  fully dynamic in JS without any `var(--x)` indirection, at the cost of a
  runtime style-injection dependency the spec asks to avoid.

## Interview questions

1. **Fundamentals:** What's the practical difference between a Tailwind utility class and a plain CSS custom property, for a value that changes at runtime?
2. **Scenario:** You need a node's glow color to come from a value computed in JavaScript (not one of five fixed states). Why can't a Tailwind utility class do that directly, and what can?
3. **Senior:** Your team has both Tailwind v3 and v4 projects. What's the one-sentence summary you'd give a new hire about what changed and why it matters for onboarding?

## Related concepts

[[00-build-log]]
