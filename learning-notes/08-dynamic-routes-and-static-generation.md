# Dynamic Routes + `generateStaticParams`: SSG in This Codebase

## What is this?

A dynamic route (`app/learn/[slug]/page.tsx`) is a single page component that
serves many URLs (`/learn/http`, `/learn/ssr`, ...) by reading the matched
segment from `params`. `generateStaticParams` is the App Router API that
tells Next.js the *complete* list of values that segment can take, so it can
render every one of them **at build time** instead of per request.

## Why are we using it here?

Every lesson's content ([[03-modeling-a-dag-in-typescript|the same 12 concepts]])
is fixed, local TypeScript data — there is no user-specific or request-specific
input a lesson page needs. That's exactly the shape [[SSG]] is for: identical
output for every visitor, computed once. Using it here also means this
project can *demonstrate* SSG in its own source, not just describe it in a
lesson.

## What did we implement

`app/learn/[slug]/page.tsx` exports `generateStaticParams`, returning
`concepts.map(c => ({ slug: c.id }))` — the 12 known concept ids. The page
component itself is an `async function` that awaits `params` (a Promise, as
of Next.js 15+) and looks up the matching `Concept`/`Lesson`/questions from
`data/concepts.ts`, `data/lessons/`, `data/questions/`.

## How does it work?

At build time, Next.js calls `generateStaticParams`, gets back 12 param
objects, and renders the page component once per object — exactly like
calling the same function with 12 different arguments and saving each
result to its own file. No server code runs again for these routes at
request time; a matching request is served the pre-built file directly.

## What happens at runtime

```
next build
  ↓
generateStaticParams() → ["http", "browser-rendering", ..., "streaming"]
  ↓
For each slug: run LessonPage({ params: { slug } }) once
  ↓
Write result to a static HTML file (+ RSC payload)
  ↓
(later, in production) request for /learn/ssr
  ↓
Serve the pre-built file — no render logic executes now
```

Verified directly in this project's own `npm run build` output:

```
● /learn/http
● /learn/browser-rendering
● /learn/html-parsing
[+9 more paths]

●  (SSG)  prerendered as static HTML (uses generateStaticParams)
```

## Rendering behavior

- What runs on the server: the entire lesson page, but only once per
  concept, at build time — not per visitor.
- What runs in the browser: only the Client Component islands inside the
  page (`StatusPicker` via `LessonProgressControl`, the experiments, the
  interview accordion) — see [[01-nextjs-app-router-boundaries]].
- What gets sent over the network: a pre-built HTML file, identical for
  every visitor of a given lesson.
- Whether JavaScript is required: no, to read the lesson content — only
  for the interactive pieces.

## Why this approach?

The alternative — rendering each lesson per request (SSR) — would re-run
identical work for every visitor of every lesson, for content that never
changes between requests. There's no request-specific data here to justify
that cost.

## Alternatives

- **SSR without `generateStaticParams`** — Next.js would render `/learn/*`
  per request instead; correct but strictly more server work for
  identical output, with no benefit.
- **A single `/learn` page with client-side routing/state** — would avoid
  real URLs per lesson (no direct linking, no per-lesson metadata, no
  static generation at all) — a strictly worse fit here.

## Interview questions

1. **Fundamentals:** What does `generateStaticParams` need to return, and when does Next.js call it?
2. **Tricky:** If `generateStaticParams` returns 12 objects but a user requests a 13th, unlisted slug, what happens by default?
3. **Senior/Scenario:** Your dynamic route's data comes from a CMS that's updated hourly, not fixed at build time like this project's. What would you change about this exact pattern to keep pages fresh without full rebuilds?

## Related concepts

[[SSG]] · [[01-nextjs-app-router-boundaries]] · [[ISR]]
