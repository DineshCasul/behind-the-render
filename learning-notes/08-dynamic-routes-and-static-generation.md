# Dynamic Routes + `generateStaticParams`: Static Pages From Data

## What is this?

A dynamic route (`app/trick/[slug]/page.tsx`) is one page component that serves many URLs (`/trick/consistent-hashing`, `/trick/virtual-list`, ...). It reads the matched segment from `params`. `generateStaticParams` tells Next.js the complete list of values that segment can take, so every page is rendered **once, at build time**, instead of on each request.

## Why are we using it here?

All content is local TypeScript in `data/`. A trick page needs nothing from the visitor or the request: the output is identical for everyone. That is the shape static generation is for. The result is plain HTML on disk, served as fast as a file, and readable before any JavaScript runs.

## What did we implement?

- `app/trick/[slug]/page.tsx` and `app/journey/[app]/page.tsx` both export `generateStaticParams`, returning one `{ slug }` (or `{ app }`) per item in the data.
- `generateMetadata` runs for each one too, so every page has its own `<title>` and description.
- An unknown value calls `notFound()`, which renders the 404 page.
- Adding a trick means adding an object to `data/tricks.ts`. No route file changes; the next build produces the new page.

You can see it in the build output: `●` means "prerendered as static HTML (uses generateStaticParams)", and the list says how many paths were produced (`[+20 more paths]`).

## How does it work?

```
npm run build
  ↓
Next.js calls generateStaticParams()  →  [{slug:"request-batching"}, {slug:"field-data"}, ...]
  ↓
for each one: render the page component on the server  →  HTML
  ↓
write the files to .next/
  ↓
at request time: serve the file. The page component does not run.
```

## What happens at runtime?

- **Server:** nothing is rendered per request for these pages. The HTML already exists.
- **Browser:** receives finished HTML for the whole page: the title, the text, the quotes, the code. A visitor with JavaScript switched off can read it.
- **JavaScript is needed only for the interactive parts**, which are Client Components: `VisualStepper` (the diagram steps), the two toys, and the walkthrough `Journey`. Those are hydrated: React attaches event handlers to HTML that is already there.
- **A detail of this Next.js version:** `params` is a `Promise`, so the page does `const { slug } = await params`. Older tutorials show it as a plain object.

## Parent → child: where the boundary is

The page itself is a Server Component. It reads data and renders plain elements, so none of that code is sent to the browser. It imports a few Client Components (`"use client"`) and passes them plain props: a diagram `kind`, a list of quotes. Whatever a server component passes to a client component has to be serialisable, which is why the pages pass data and never functions.

## Why this approach?

The alternatives are rendering on every request, which costs server time to produce an identical page each time, or a client-rendered page that fetches the same data from an API, which adds a round trip and an empty first paint. For content that only changes when we edit the repo, build time is the right time.

## When this would be wrong

If a page depended on the user (a dashboard) or the data changed minute to minute, static output would be stale. Then you would render per request, regenerate on a schedule (incremental static regeneration), or fetch the changing part in the browser.

## Interview questions

1. **What does `generateStaticParams` do, and what does the build output tell you about it?** (It lists the values of a dynamic segment so each page is prerendered. `●` marks those routes.)
2. **A visitor requests a slug that was not in `generateStaticParams`. What happens?** (By default, `dynamicParams` is `true`, so the page is generated at request time; calling `notFound()` for an unknown value gives a 404. With `dynamicParams = false` it returns 404 without rendering.)
3. **Why can a statically generated page still contain interactive widgets?** (The HTML is static. Client Components inside it are hydrated in the browser.)
4. **Senior / scenario:** the marketing team wants a price on 5,000 static product pages, and it changes hourly. What are your options? (Regenerate on a schedule with ISR, or render the price client-side or on demand with a short cache. Weigh staleness against server cost and invalidation.)

## Related concepts

[[01-nextjs-app-router-boundaries]] · [[04-hydration-and-external-stores]] · [[Static generation]] · [[ISR]]
