# Adding a new site (checklist)

## What is this?

The site is built to keep growing. Adding a website means adding **data**, not
editing pages. The pages group, count and colour themselves from the data, so
nothing on the home page, the pickers or the hero names a site.

## Why is it built this way?

An earlier hero listed every site as a pill. That worked for ten sites and would
have been wrong at thirty. The rule now: **anything that shows "all of X" is
generated from the data, and anything that must stay short is capped.**

## The steps

1. **Fetch the source first.** Only add a site when you can quote a first-party page
   (its own blog or docs, or a case study Google published). Check every quote word
   for word before it goes in (see the build log for the method).
2. **A road** in `data/journey.ts`: add a `JourneyApp` to `journeys`. Two fields do
   the filing: `kind` (which group: `start`, `feeds`, `knowledge`, `tools`) and
   `hue` (its accent colour; the whole road page takes it). Chapters hold the lines,
   the quotes (`docs`), the `alternatives`, and optionally a `visual` and a `predict`
   question.
3. **A trick** (if the site shows a named idea) in `data/tricks.ts`: add a `Trick`
   with a `group` (`faster`, `scale`, `native`, `change`) and `chapters` pointing at
   the road's chapter ids. The trick does not repeat quotes; it reads them from the
   chapters.
4. **A question** for the trick in `data/trick-questions.ts` (it flows into the
   question bank through `data/bank-items.ts`).
5. Run `npx tsc --noEmit`, `npx eslint app components data lib`, then `npx next build`.

That is all: the home page, `/journey`, `/trick`, the hero counts and the
Surprise me button pick it up by themselves.

## What if the groups no longer fit?

Groups live in `data/categories.ts`: `ROAD_KINDS` and `TRICK_GROUPS`. Add an entry
and TypeScript then accepts it as a `kind` or `group`. A group with nothing in it
is not shown. Because the group names are a union type, a typo in a road's `kind`
fails the build instead of silently losing the road.

## How the home page stays short

`GroupedRoads` and `GroupedTricks` take a `limit`. The home page passes 4 roads and
3 tricks per group and shows an "All N →" link into the full page whenever a group
has more. The full pages (`/journey`, `/trick`) pass no limit.

## Interview angle

*"How would you design a list page whose content will grow from 10 to 1,000 items?"*
Generate it from data; group by a small fixed set of categories; cap the preview and
link to the full list; later add search, pagination or filters (the question bank
already filters). Keep the categories as a closed type so the compiler catches a
mistake.

## Related concepts

[[Static generation]] · [[Data-driven UI]] · [[Discriminated unions]]
