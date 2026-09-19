# Modeling a Dependency Graph (DAG) in Plain TypeScript

## What is this?

The 12 rendering concepts and their prerequisite relationships form a
**directed acyclic graph (DAG)**: each concept is a node, each prerequisite
is a directed edge, and there are no cycles (nothing is a prerequisite of
itself, directly or transitively).

## Why are we using it?

The spec calls for prerequisites to be "visually represented" while
exploration stays free — that needs a real graph structure to derive
"what connects to what" and "what's related to this node I'm hovering,"
not just a flat list of 12 unrelated cards.

## What did we implement

- `data/concepts.ts` stores the graph **implicitly**: each `Concept` has a
  `prerequisites: ConceptId[]` field, not a separate list of edges.
- `lib/graph.ts` derives the actual `edges[]` array from that field once,
  at module load:

  ```ts
  export const edges: Edge[] = concepts.flatMap((concept) =>
    concept.prerequisites.map((prereqId) => ({
      id: `${prereqId}->${concept.id}`,
      from: prereqId,
      to: concept.id,
    })),
  );
  ```

- `getNeighbors(id)` does a single pass over `edges` to collect every node
  directly connected to `id` in either direction — this powers the
  "highlight related nodes, dim everything else" hover behavior.

## How does it work?

Keeping `prerequisites` as the single source of truth (rather than also
hand-maintaining a separate `edges.ts` file) means the graph can't go out
of sync with itself — there's exactly one place that says "SSR requires
HTML Parsing." `edges` is a *pure function* of `concepts`, recomputed once
when the module loads.

`getNeighbors` treats the graph as undirected for hover purposes
(prerequisite *and* dependent both count as "related") because the spec
asks to highlight both directions on hover — a strict directed-only
traversal would miss dependents.

## Rendering behavior

This is all plain TypeScript, evaluated at build/import time — no
component re-renders it, no state depends on it changing at runtime
(the graph's *shape* is fixed; only each node's `NodeStatus` changes).

## Why did we choose this approach?

For 12 nodes and ~13 edges, a graph library (e.g. `graphology`) would add
a dependency to do what a `.flatMap()` and a `Set` already do. The spec
also explicitly says "avoid unnecessary dependencies."

## Alternatives

- **Separate `prerequisites.ts` edge list** (as the spec's suggested file
  structure names it) — this was considered, but storing edges twice (once
  on the concept, once in a parallel file) invites the two to drift apart.
  Deriving one from the other keeps a single source of truth while still
  matching the spirit of the suggested architecture.
- **A real graph library** — worth it once the graph needs things this
  project doesn't yet: cycle detection, topological sort for a "suggested
  order" feature, shortest-path "how do I get from HTTP to Streaming."

## Interview questions

1. **Fundamentals:** What makes a graph a DAG specifically (as opposed to any graph)?
2. **Tricky:** Why does deriving `edges` from each concept's `prerequisites` array — instead of storing edges separately — reduce a whole class of bugs?
3. **Scenario:** Product wants a "recommended learning order" feature. What graph algorithm produces a valid order from this data, and what would break it if the data had a cycle?
4. **Senior:** How would you detect a cycle in `data/concepts.ts` and fail the build if two concepts end up depending on each other?
5. **Debugging:** `getNeighbors('http')` returns an empty set even though three concepts eventually depend on it — what's the actual bug (hint: think about direct vs. transitive)?

## Related concepts

[[02-svg-as-a-ui-system]] · [[00-build-log]]
