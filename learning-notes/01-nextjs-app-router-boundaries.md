# Next.js App Router: Server/Client Component Boundaries

## What is this?

The App Router (`app/`) renders every component as a **Server Component by
default**. A component only becomes a **Client Component** — meaning its
code ships to the browser and it re-renders there — when the file starts
with `"use client"`.

## Why are we using it?

The Rendering Lab is *about* this exact distinction (it's one of the 12
Phase 1 concepts, [[React Rendering]] and [[Server Components]]), so the
project's own file structure had to model it correctly, not just describe
it in prose.

## What did we implement

- `app/layout.tsx`, `app/page.tsx`, `components/ui/GridBackdrop.tsx` have
  **no** `"use client"` — they render once on the server, produce HTML, and
  ship zero JavaScript for their own logic.
- `components/learning-map/LearningMap.tsx`, `MapNode.tsx`, `MapEdge.tsx`,
  `MapTooltip.tsx`, `ConceptPanel.tsx`, `MapLegend.tsx` (implicitly, via
  its parent), and `components/ui/AmbientParticles.tsx` and `Hero.tsx`
  (because it renders `AmbientParticles`) all start with `"use client"`.

## How does it work?

A component needs `"use client"` the moment it uses anything that only
exists in the browser or only makes sense per-interaction:

- `useState`, `useEffect`, `useSyncExternalStore` (state that changes after
  the page loads)
- event handlers (`onClick`, `onMouseEnter`) — these can't be serialized
  into static HTML, they need live JS listeners attached
- browser APIs (`window.localStorage`, `framer-motion`'s animation engine)

`"use client"` doesn't mean "this only renders in the browser." It still
renders once on the server for the initial HTML (see
[[04-hydration-and-external-stores]]) — it means "this component's code is
also sent to the browser so it can run there again."

## What happens at runtime

```
Request for "/"
      ↓
Next.js server renders the whole tree:
  RootLayout (server)
    → Home (server)
        → GridBackdrop (server, stays server-only)
        → Hero (client) ─┐
        → LearningMap (client) ─┤ rendered to HTML on the
             → MapNode × 12  ───┤ server too, PLUS their JS
             → MapEdge × 13  ───┤ is included in the page bundle
      ↓
Server sends HTML (all of it, including the client components'
first-render output) + a script tag for the client component code
      ↓
Browser paints the HTML immediately (no JS required to *see* the page)
      ↓
Browser downloads and runs the client bundle → hydration → onClick,
onMouseEnter, and the localStorage-backed progress store come alive
```

## Parent → Child relationship

`page.tsx` (server) renders `LearningMap` (client) as a regular child —
a Server Component can render a Client Component directly. It could
**not** go the other way (a Client Component importing and rendering a
Server Component directly) without passing it in as `children`/props,
because a client bundle has no server to execute that Server Component on.
This project never needed that pattern, but it's a common interview trap.

## Rendering behavior

- What runs on the server: the entire tree, once, per request (or once at
  build time — see [[Static Site Generation]]).
- What runs in the browser: only the Client Components, after hydration.
- Whether JavaScript is required: not to *see* the page — the server HTML
  is complete — but yes to hover/click/persist progress.

## Why did we choose this approach?

It's not a choice so much as reading the grain of the framework: mark a
component client only when it needs interactivity or browser state, and
push that boundary as far down the tree as possible. `GridBackdrop` is
purely decorative markup, so keeping it a Server Component means its (tiny)
cost never reaches the client bundle.

## Alternatives

- **Pages Router** (`pages/`) — everything is a client-rendered-by-default
  React tree unless you opt into `getServerSideProps`/`getStaticProps`.
  No per-component server/client split; coarser control.
- **Pure CSR (Create React App style)** — no server rendering at all; the
  whole "why is this a Client Component" question wouldn't exist because
  *everything* runs in the browser. See [[CSR]].

## Interview questions

1. **Fundamentals:** What's the default component type in the App Router, and what one line of code changes it?
2. **Tricky:** Does a `"use client"` component render on the server at all? If yes, when and why?
3. **Scenario:** You have a large chart library that's expensive to parse and only needed after a user clicks "Show details." Where does the `"use client"` boundary go, and why does that placement matter for bundle size?
4. **Senior:** A junior engineer marks the entire `app/page.tsx` as `"use client"` because one button inside needs an `onClick`. What breaks or degrades, and how would you refactor it?
5. **Debugging:** A component throws "You're importing a component that needs `useState`. This React hook only works in a client component" — walk through exactly what you'd check and fix.

## Related concepts

[[React Rendering]] · [[Server Components]] · [[04-hydration-and-external-stores]] · [[Hydration]]
