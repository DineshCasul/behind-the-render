# Hydration Mismatches and `useSyncExternalStore`

## What is this?

**Hydration** (one of the site's own 12 concepts) is React attaching event
handlers and state to HTML that a server already rendered, instead of
rebuilding that HTML from scratch in the browser. A **hydration mismatch**
happens when the HTML React expects to find (based on what it would render
right now) doesn't match the HTML the server actually sent — React has to
throw away the mismatched part and re-render it client-side, which is a
correctness bug and a performance cost, not just a console warning.

`useSyncExternalStore` is a React hook built specifically to read from a
data source that lives outside React (localStorage, a WebSocket, another
state library) without causing that mismatch.

## Why are we using it?

Learning progress is stored in `localStorage`, which **only exists in the
browser**. The server has no `window`, so it cannot know a user has
already marked "SSR" as `mastered`. If the very first render tried to read
`localStorage` directly, the server would render one thing (nothing to
read, so defaults) and the client's first render — running the identical
component before hydration reconciles — would try to read the *real*
stored value and produce different HTML. React would flag a mismatch.

## What did we implement

`lib/progress.ts` is a small hand-written **external store**:

```ts
let cache: ProgressState | null = null;
const SERVER_SNAPSHOT = defaultProgress(); // computed once, reused forever

function getSnapshot() {
  if (cache === null) cache = readJSON(STORAGE_KEY, defaultProgress());
  return cache;
}
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // ...
}
```

`LearningMap` and `ConceptPanel` both call `useProgress()` and read the
same underlying store — there's no prop-drilling of progress state between
them.

## How does it work?

`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` takes
three functions:

- **`getServerSnapshot`** — used only during server rendering (and the
  client's very first render, before hydration is confirmed to match). It
  *must* return the same reference every time it's called with no new
  data, or React can't tell "nothing changed" from "this changed again" —
  that's exactly the bug this project hit and fixed (see [[00-build-log]]):
  calling `defaultProgress()` inline allocated a new object every call, so
  React's `Object.is` comparison saw a "new" value on every check and spun
  forever, logging *"The result of getServerSnapshot should be cached to
  avoid an infinite loop."*
- **`getSnapshot`** — used for every render *after* hydration; free to
  read the real `localStorage` value.
- **`subscribe`** — registers a callback that fires when the store
  changes, so React knows to re-render. Our `commit()` function calls
  every registered listener after writing a new value.

Because `getServerSnapshot` and the client's snapshot on first paint both
return the identical all-`"not-started"` default, the server HTML and the
client's first render always agree — no mismatch. Real progress appears
the instant hydration completes and `getSnapshot` starts being used.

## What happens at runtime

```
Server render:  useProgress() → getServerSnapshot() → all "not-started"
                  → HTML sent to browser matches this exactly
Browser paint:  identical HTML shown (no flash of different content)
Hydration:      React confirms client's first render == server's HTML ✓
                  → attaches event handlers (map is now interactive)
Next render:    useSyncExternalStore switches to getSnapshot()
                  → reads real localStorage → progress "pops in" if the
                    user had prior progress
```

## Why did we choose this approach?

The first version of this store used `useState` + a `useEffect` that
called `setProgress(readFromLocalStorage())` on mount. That *also* avoids
the SSR mismatch (the effect only runs in the browser, after the initial
render), but it failed a stricter lint rule
(`react-hooks/set-state-in-effect`): calling `setState` synchronously
inside an effect body causes an extra, avoidable render pass.
`useSyncExternalStore` exists precisely for "read a value that lives
outside React, and re-render when it changes" — using it instead of
`useState`+`useEffect` isn't just quieter for the linter, it's the
semantically correct tool.

## Alternatives

- **`useState` + `useEffect`** — works, but is the pattern the linter (and
  the React team) now steers people away from for exactly this "external
  source of truth" case.
- **A third-party store (Zustand, Jotai)** — would add a dependency for
  something 80 lines of `useSyncExternalStore` already does well, and the
  spec asks to avoid unnecessary dependencies.

## Interview questions

1. **Fundamentals:** What is a hydration mismatch, and why does React treat it as more than a cosmetic issue?
2. **Tricky:** Why must `getServerSnapshot` return a stable reference, but `getSnapshot` doesn't have the same restriction after hydration?
3. **Scenario:** A teammate "fixes" a hydration warning by wrapping the mismatched content in `{typeof window !== "undefined" && ...}`. What's the actual runtime behavior of that fix, and what's still broken?
4. **Senior:** Design the state layer for a feature where progress must also sync across two open browser tabs. What changes in `subscribe`, and what native browser API makes that possible?
5. **Debugging:** In production you see a brief flash where nodes marked "mastered" appear as "not started" for a fraction of a second before updating. Where in this architecture does that flash come from, and is it avoidable?

## Related concepts

[[Hydration]] · [[01-nextjs-app-router-boundaries]] · [[Server Components]] · [[SSR]]
