# Adding a concept: what the type system enforces (and what it doesn't)

## What is this?
A checklist for adding a new concept to the site, plus the reason each item exists.

## Why are we using it?
Adding four concepts at once showed that some data is checked at build time and some only fails at runtime.

## What did we implement?
`data/concepts.ts` (node, topics, prerequisites, two positions), `data/lessons/story-concepts.ts`, `data/questions/story-concepts.ts`, `data/examples/story-concepts.ts`, plus entries in `data/references.ts`, `data/site-usage.ts` and `data/glossary.ts`.

## How does it work?
Adding an id to the `ConceptId` union in `lib/types.ts` makes TypeScript check every `Record<ConceptId, ...>`:

```
ConceptId gets "seo"
  ├─ examples: Record<ConceptId, ...>     -> build error until added
  ├─ references: Record<ConceptId, ...>   -> build error until added
  ├─ siteUsage: Record<ConceptId, ...>    -> build error until added
  ├─ lessonMap (Object.fromEntries + cast) -> NO error; page crashes at runtime
  └─ questionMap (Partial + cast)          -> NO error; lesson shows no questions
```

`Object.fromEntries` returns a loose type, so the cast (`as Record<ConceptId, Lesson>`) tells TypeScript "trust me". That is convenient, but it turns a compile-time guarantee into a promise.

## What happens at runtime?
Lessons are pre-rendered by `generateStaticParams` at build time, so a missing lesson fails `npm run build` when its page is generated. That still catches it before deploy, just later than a type error.

## Why did we choose this approach?
Grouping content in a few files is easier to author than one file per concept. The cost is the loose types at the join point.

## Alternatives
Build the maps with a helper that takes `Lesson[]` and throws if any `ConceptId` is missing. That restores the guarantee with a few lines.

## Test yourself
1. Why does `Object.fromEntries` lose the key type, and what does a cast do about it?
2. Where would you catch a missing lesson in this project, and how early?
3. **Senior:** how would you make a missing question set a build error without changing the data shape?

## Related concepts
[[00-build-log]] · [[09-content-as-data-discriminated-experiments]]
