# Web Lore

The engineering and algorithms inside real websites, quoted from the companies' own docs.

- `/trick` — one idea per page (what it is, the sources, alternatives, an interview angle, sometimes a toy)
- `/journey` — one site walked chapter by chapter, with diagrams and questions
- Content is plain TypeScript in `data/` (`tricks.ts`, `journey.ts`, `categories.ts`); no backend, no database

```bash
npm run dev
```

```bash
npm run verify:quotes   # fetches every source and checks each quote word for word
```
