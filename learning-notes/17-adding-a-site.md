# Adding a site or a trick (checklist)

## What is this?

The site is built to keep growing, and adding content means adding **data**, not editing pages. The lists, the counts, the grouping and the "jump to" row are all generated from the data, so no page names a particular site.

## Why is it built this way?

A hand-written list is right for ten items and wrong for thirty. The rule: anything that shows "all of X" is generated from the data, and the categories are a small closed set that the compiler checks.

## The steps

1. **Fetch the source first.** Only add a site when you can quote a first-party page: its own blog, docs or repo, or a case study Google published about it. Blocked hosts (Medium, DoorDash, the Netflix tech blog) are not worked around; ask for the text to be pasted instead.
2. **Write the chapters.** Put them in `data/journey-more.ts` (or `journey.ts`). A `JourneyChapter` has `lines` (the narration, short enough to read in one breath), `docs` (verbatim quotes with their link), optionally `alternatives`, a `predict` question (only when there is one clear number to guess), a `visual`, and `trick` (the slug of the trick it belongs to). Declare each source URL as a `const` at the top, because the quote checker reads those.
3. **Add the site** to `journeys` in `data/journey.ts`: `id`, `name`, `kind` (a group from `data/categories.ts`), `blurb`, `chapters`, and a closing `check` question.
4. **Add the trick** to `data/tricks.ts`: `slug`, `group`, `title`, `hook`, an optional `stat` (a number that appears in one of the verified quotes), `idea`, `chapters`, `related`, and an interview `question`. The trick does not repeat quotes; it reads them from its chapters.
5. **Add the extras** for the trick in `data/trick-extras.ts`: how it works (with a `versus`: what it is most often confused with), a code sketch, pitfalls (give a `fix` when the pitfall does not already say what to do), and where possible a "see it yourself" tip. These are general engineering and the page labels them so. Also give the trick's `question` a few `followUps`, and keep provenance notes out of the model answer itself.
6. **Verify the quotes:** `npm run verify:quotes`. It fetches every source and tests the exact wording: same capitals, same curly or straight quotes, same dashes. It must report `0 not found, 0 punctuation mismatches`.
7. **Check the build:** `npx tsc --noEmit`, `npm run lint`, `npm run build`. Then open the new pages on desktop and at 390px wide.

## What if the groups no longer fit?

Groups live in `data/categories.ts`: `ROAD_KINDS` and `TRICK_GROUPS`. Add an entry and TypeScript accepts it as a `kind` or `group`. A group with nothing in it is not shown. Because the names form a union type, a typo in a site's `kind` fails the build instead of silently hiding the site.

## Interview angle

*"How would you design a list page whose content will grow from 10 to 1,000 items?"* Generate it from data. Group it by a small fixed set of categories. Cap or paginate the preview and link to the full list. Later add search or filters. Keep the categories a closed type so the compiler catches mistakes.

## Related concepts

[[08-dynamic-routes-and-static-generation]] · [[Data-driven UI]] · [[Discriminated unions]]
