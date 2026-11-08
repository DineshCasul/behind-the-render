# Web Lore

An interactive, terminal-style reference to the engineering and algorithms inside real websites: how a page gets built, cached, kept in sync and scaled. Every claim is quoted from the company's own docs, with a link.

The owner is a frontend engineer preparing for senior interviews and moving toward full-stack. The project has two outputs: a polished site, and the owner's understanding of how it works. Build accordingly.

## What it is

- `/trick`: one idea per page. A big number, the idea, a diagram, sometimes a toy, how it works, a code sketch, pitfalls, the quoted sources, an interview angle.
- `/journey`: one company walked chapter by chapter, with guess-first questions. The page calls these "sites"; the code calls them roads and journeys.
- All content is plain TypeScript in `data/`: `tricks.ts`, `trick-extras.ts`, `journey.ts`, `journey-more.ts`, `categories.ts`.
- No backend, database, auth, CMS or admin panel.

## Content rules (the most important ones)

- Only first-party sources: a company's own docs, blog or repo, or a case study Google published about it. Third-party commentary is not enough.
- Quotes are copied word for word and never reworded. After ANY edit to a quote, run `npm run verify:quotes`. It fetches every source and tests the exact wording (same capitals, quote style and dashes); it must report 0 not found and 0 punctuation mismatches.
- Anything that is not from a source is general engineering knowledge and must be labelled so (that is what `trick-extras.ts` is).
- A trick's `stat` must be a number already present in one of its verified quotes.
- Model answers must read as something you could say aloud. Keep provenance notes ("this is general knowledge") out of the answer; the page adds one note under every answer.
- Medium-hosted posts, DoorDash and the Netflix tech blog refuse to be fetched. Do not work around that. Ask the owner to paste the text.
- No em dashes in copy. Light humour is welcome and never changes a fact.
- To add a site or a trick, follow `learning-notes/17-adding-a-site.md`.

## Design rules

- Terminal minimalism: black, white and grey. Red, green and blue only where they mean something (blue is focus and links, green is ok or a good number, red is a problem). Square corners, hairline borders, no glows, particles or gradients.
- Monospace (JetBrains Mono) for the chrome: header, labels, lists, toys, code. The sans (IBM Plex Sans, the `.read` class in `app/globals.css`) is only for text read in sentences. Do not spread it further.
- Motion is subtle and uses only `opacity` and `transform`. Respect `prefers-reduced-motion`. No continuous animation.
- After a UI change, look at screenshots of each page type on desktop and at 390px wide. No page may scroll sideways.

## Tech

Next.js (App Router), React, TypeScript, Tailwind v4 (CSS-first, the tokens are in `app/globals.css`). No runtime dependencies beyond next and react. Before adding a library, explain what problem it solves, what the alternative is, and what it costs.

## Working with the owner

- The owner learns while Claude builds. When a meaningful technical concept comes up, write an Obsidian-style note in `learning-notes/` (what it is, why it is used here, which files, how it works at runtime, what runs on the server and in the browser, a few interview questions, `[[links]]`). Log significant work in `learning-notes/00-build-log.md` with a "Learning checkpoint". Do not write notes for trivial things.
- Never `git commit` without asking first.
- Take time. Look at the page before and after changing it. Say plainly what was verified and what was not.

## Commands

`npm run dev`, `npm run build`, `npm run lint`, `npm run verify:quotes`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
