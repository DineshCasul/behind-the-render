# This Site as a Worked Example ("In this very site")

## What is this?

Every lesson now ends with a section, **In this very site**, saying whether that concept is used by the website you're reading, where in the code, and how to check for yourself. Twelve concepts, each with a status: **Used**, **Partly used**, or **Not used here, on purpose**.

## Why are we using it here?

The project's goal is "understand it while it's built". The site already applies many of its own lessons (static generation, the Server/Client split, a real hydration bug), so pointing at them turns abstract explanations into something you can open and inspect. Marking the concepts it does *not* use is just as valuable: SSR, ISR and streaming are absent here because nothing on this site needs them, and knowing when not to reach for a technique is a senior-level skill.

## What did we implement

- `data/site-usage.ts`: one entry per concept (`status`, `headline`, `explanation`, `evidence` file paths, `verify` steps, `whyNot`, `notes`).
- `components/lesson/SiteUsageCallout.tsx`: a Server Component rendering it.
- `app/learn/[slug]/page.tsx`: a new `in-this-site` section before "Test yourself"; `ConceptPanel` got a matching topic link.
- `Prose` now renders `` `inline code` `` (and never scans it for glossary terms).

## How was it kept honest?

Each claim was checked against the real thing rather than assumed:

| Claim | How it was checked |
|---|---|
| Nothing is dynamic / no ISR / no streaming | `grep` for `Suspense`, `revalidate`, `cookies()`, `headers()`, `searchParams` in `app/`, `components/`, `lib/`: no results; `npm run build` marks every route static |
| Lesson text and the glossary never ship to the browser | searched the built `.next/static/chunks/*.js` for glossary/lesson strings: 0 hits, while text from client components (the caching experiment) *is* found |
| Caching headers | started `next start` and ran `curl -I`: pages `s-maxage=31536000` + `x-nextjs-cache: HIT`; hashed assets `immutable`; unknown slug returns 404 |

Two claims were **dropped** because they couldn't be verified (what the home page shows with JavaScript disabled). Also worth knowing: the dev server sends different caching headers than production, so header claims must be measured against `next start`.

One honest caveat is written into the Server Components entry itself: the concept data (including topic hints) *does* ship to the home page, because the client-side map panel needs it. "Server Component" doesn't mean "nothing of this reaches the browser", only that *that component's code* doesn't.

## Why this approach? / Alternatives

- **Per-lesson callouts** (chosen) keep the explanation next to the concept it belongs to.
- **One "how this site is built" page** would duplicate the learning notes and separate the evidence from the lesson; it could still be added later as an overview.
- **Generating the claims automatically** (e.g. scanning for `"use client"`) would never drift, but can't express "why not" or "how to verify".

## Interview questions

1. **Fundamentals:** How can you tell from `next build` output whether a route is static or rendered per request?
2. **Tricky:** Why is it wrong to measure production `Cache-Control` headers against the dev server?
3. **Senior/Scenario:** Your team lead asks "should this marketing site use SSR?" Using only what you can verify in the codebase and build output, how do you decide, and what evidence would change your answer?

## Related concepts

[[SSG]] · [[Server Components]] · [[Caching]] · [[08-dynamic-routes-and-static-generation]] · [[01-nextjs-app-router-boundaries]]
