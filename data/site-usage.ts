import type { ConceptId } from "@/lib/types";

export type SiteUsageStatus = "used" | "partly" | "not-used";

export interface SiteUsage {
  status: SiteUsageStatus;
  /** One sentence: the honest answer to "does this site use the concept?" */
  headline: string;
  explanation: string;
  /** Real files in this repo where the concept shows up (or where it would). */
  evidence: { path: string; what: string }[];
  /** Concrete steps a reader can take to see it for themselves. */
  verify: string[];
  /** For "partly" and "not-used": why not, and when it would make sense. */
  whyNot?: string;
  /** Learning-notes files that explain how it was built. */
  notes?: string[];
}

/**
 * Where each concept appears in *this* website. Rule for editing this
 * file: every claim must be something you can verify in the code or the
 * build output. Where the site does not use a concept, say so and say
 * why: knowing when not to reach for a technique is part of the lesson.
 * (Claims about headers were checked against `next start`, not the dev
 * server, which sends different caching headers.)
 */
export const siteUsage: Record<ConceptId, SiteUsage> = {
  http: {
    status: "used",
    headline: "Every page in this site arrives over HTTP, including its errors.",
    explanation:
      "Loading a lesson is one GET request answered with a 200 status and an HTML body. Asking for a lesson that doesn't exist returns a real 404 status, because the lesson page calls `notFound()`.",
    evidence: [
      { path: "app/learn/[slug]/page.tsx", what: "notFound() makes the response a real HTTP 404, not just a page that says 'not found'" },
    ],
    verify: [
      "Open DevTools, go to the Network tab, reload /learn/ssr and click the first request. You'll see the method, the 200 status and the response headers.",
      "Visit /learn/nope and compare: the status is now 404.",
    ],
  },

  "browser-rendering": {
    status: "used",
    headline: "Every animation here is built around the rendering pipeline.",
    explanation:
      "The scroll scene, hover effects and page transition only animate `transform` and `opacity`, which the browser can hand to the GPU (compositing) without redoing layout or paint. When the scroll scene stuttered, the cause was layout changes and a per-frame blur, and removing both fixed it.",
    evidence: [
      { path: "components/home/ScrollExperience.tsx", what: "scroll-linked scale, tilt and fade, transform and opacity only, plus will-change" },
      { path: "app/globals.css", what: "the hover vibration, which uses small relative offsets on purpose (inline text can't take a transform)" },
    ],
    verify: [
      "DevTools > Performance (Chrome or Edge): record while scrolling the home page. Style recalculation is frequent, because animated values update every frame, but Layout entries are far fewer than frames (about 11 layout passes against 200+ style recalculations in a 2,000px scroll).",
    ],
    notes: ["06-animation-and-reduced-motion", "07-transform-composition-bug"],
  },

  "html-parsing": {
    status: "used",
    headline: "The browser parses this site's HTML incrementally, like any other page.",
    explanation:
      "Lesson pages are complete HTML documents, so the browser can build the DOM from them as the bytes arrive. Nothing blocks the parser: Next.js adds its scripts with `async`, so the content can be parsed and shown without waiting for JavaScript.",
    evidence: [
      { path: "(Next.js output)", what: "we don't customise parsing, we just don't get in its way: no synchronous scripts in the head" },
    ],
    verify: [
      "View Source (Ctrl+U) on any lesson. The lesson text is already in the HTML, before any JavaScript runs.",
      "Look at the script tags in that source: they carry `async`, so they don't stop the parser.",
    ],
  },

  csr: {
    status: "partly",
    headline: "No page is client-rendered, but one part of the UI is.",
    explanation:
      "Every route is delivered as prebuilt HTML, so this isn't a CSR app. But your saved progress lives in `localStorage`, which only exists in the browser, so the map's colours (not started, learning, mastered) are filled in on the client after the page loads. Until then it shows the default.",
    evidence: [
      { path: "lib/progress.ts", what: "progress is read from browser-only storage after the page has loaded" },
      { path: "components/experiments/", what: "the experiments only exist once JavaScript runs" },
    ],
    verify: [
      "Mark a concept as Learning, reload the home page, and watch the node change colour a moment after the page appears.",
    ],
    whyNot:
      "The lesson content doesn't need CSR: it's identical for every visitor, so there's no reason to make the browser build it. CSR is used only where the data can't exist anywhere else.",
    notes: ["04-hydration-and-external-stores"],
  },

  ssr: {
    status: "not-used",
    headline: "Nothing here is rendered per request.",
    explanation:
      "Every route is built once at build time, so no page needs a server to do work when a visitor arrives. (`npm run dev` renders on demand, but that's the development server, not the strategy.)",
    evidence: [
      { path: "app/learn/[slug]/page.tsx", what: "uses no cookies(), headers() or searchParams, the things that would force per-request rendering" },
    ],
    verify: [
      "Run `npm run build`. Every route in the list is marked static (○ or ●). A route rendered per request would be marked dynamic.",
    ],
    whyNot:
      "There's no visitor-specific data to put in the HTML: everyone gets the same lesson. SSR would spend server work on every request to produce identical output. You'd switch to it if lessons depended on who's logged in, or on data that changes on every request.",
  },

  ssg: {
    status: "used",
    headline: "All 12 lessons are generated at build time.",
    explanation:
      "The lesson route lists every concept id with `generateStaticParams`, so `next build` renders each lesson once into a static HTML file. The home page is prerendered the same way.",
    evidence: [
      { path: "app/learn/[slug]/page.tsx", what: "generateStaticParams returns all 12 concept ids" },
      { path: "app/page.tsx", what: "prerendered static content" },
    ],
    verify: [
      "Run `npm run build`: the 12 /learn/* routes show as ● (SSG) and / shows as ○ (Static).",
      "Then run `npm run start` and `curl -I localhost:3000/learn/ssr`. The header `x-nextjs-cache: HIT` says it came straight from a prebuilt file.",
    ],
    notes: ["08-dynamic-routes-and-static-generation"],
  },

  isr: {
    status: "not-used",
    headline: "No page here ever regenerates itself.",
    explanation:
      "The lesson text lives in TypeScript files in the repo, so it only changes when the code changes and the site is redeployed. No `revalidate` setting exists anywhere in the code.",
    evidence: [
      { path: "app/", what: "no revalidate export, no revalidatePath or revalidateTag calls" },
    ],
    verify: ["Search the app/, components/ and lib/ folders for `revalidate`. There are no results."],
    whyNot:
      "ISR earns its keep when content changes on its own schedule, such as lessons written in a CMS or edited by other people. Here a redeploy is the update mechanism, which is perfectly fine for 12 pages.",
  },

  "react-rendering": {
    status: "used",
    headline: "Hovering a node re-renders many components but changes very little on screen.",
    explanation:
      "The hovered-node state lives in `LearningMap`, so every hover re-runs the map and all its node components. Yet the page only changes the few rings and dimming that actually differ. That's 'a re-render is not a DOM change' in practice. Keys matter too: nodes are keyed by concept id and edges by edge id, so React matches them correctly between renders.",
    evidence: [
      { path: "components/learning-map/LearningMap.tsx", what: "the hover state, and the keys on nodes and edges" },
      { path: "components/learning-map/MapNode.tsx", what: "re-runs on every hover, but most renders produce identical output" },
    ],
    verify: [
      "Open React DevTools, start the Profiler, hover a few nodes, then stop. Many MapNode components rendered.",
      "Now watch the Elements panel while hovering: only a couple of ring circles and opacity values change, the rest of the SVG is untouched.",
    ],
    whyNot:
      "It would be easy to wrap MapNode in `memo` to skip the extra renders, but with 12 nodes the cost is negligible. You'd add it after measuring a real slowdown, not before.",
  },

  hydration: {
    status: "used",
    headline: "This site hit a real hydration bug, and fixed it.",
    explanation:
      "Your saved progress comes from `localStorage`, which the server can't read. Reading it during render would make the server's HTML and the browser's first render disagree. So the progress store returns a fixed default on the server and the real value after hydration. An early version created a new object on every call, and React warned about an infinite loop until the default was cached.",
    evidence: [
      { path: "lib/progress.ts", what: "getServerSnapshot returns one stable SERVER_SNAPSHOT, real progress is read after hydration" },
      { path: "components/lesson/LessonProgressControl.tsx", what: "a small client island that hydrates on every lesson page" },
    ],
    verify: [
      "Set a concept to Mastered and reload the home page. The node appears as not started for a moment, then updates: that's the swap after hydration.",
      "Keep the browser console open in dev: there is no hydration mismatch warning.",
    ],
    notes: ["04-hydration-and-external-stores"],
  },

  "server-components": {
    status: "used",
    headline: "Lesson pages are Server Components. Only the interactive parts are Client Components.",
    explanation:
      "The lesson page, its section components, the glossary and the lesson text run only on the server, so that code is never sent to your browser. Only parts that need state ship as JavaScript: the interview accordion, the experiments and the status buttons. Not everything stays server-side, though: the concept data behind the map (including the topic hints) does ship to the home page, because the map panel needs it.",
    evidence: [
      { path: "app/learn/[slug]/page.tsx", what: "a Server Component that renders the whole lesson" },
      { path: "components/lesson/Prose.tsx", what: "glossary matching runs on the server only" },
      { path: "components/lesson/InterviewQuestions.tsx", what: "'use client': needs state for the accordion" },
      { path: "components/experiments/", what: "'use client': interactive by nature" },
    ],
    verify: [
      "On the HTTP lesson, open DevTools and search the downloaded .js files for `phone book` (the DNS hover text). It's not in any script, only in the page's HTML.",
      "Search for `Every layer missed`, text from the caching experiment. That one is in a script, because the experiment has to run in the browser.",
    ],
    notes: ["01-nextjs-app-router-boundaries", "09-content-as-data-discriminated-experiments"],
  },

  streaming: {
    status: "not-used",
    headline: "There are no Suspense boundaries here, so nothing is streamed in pieces.",
    explanation:
      "There's no slow data: all lesson content is local and already built. No `<Suspense>` or `loading.tsx` exists in the project. The browser still parses HTML incrementally as it arrives, but the server isn't holding anything back to send later.",
    evidence: [
      { path: "app/, components/, lib/", what: "no Suspense boundary and no loading.tsx anywhere in the code" },
    ],
    verify: ["Search the app/, components/ and lib/ folders for `Suspense`. There are no results."],
    whyNot:
      "Streaming helps when one part of a page waits on something slow, like a database query. Nothing on this site does, which is why the lesson's streaming experiment is a simulation. If lessons came from a slow API, you'd wrap that part in Suspense with a skeleton.",
  },

  caching: {
    status: "partly",
    headline: "Caching is happening, but it's the platform doing it, not our code.",
    explanation:
      "In production, prebuilt pages are sent with `Cache-Control: s-maxage=31536000`, which tells a CDN it may keep them for a year, and Next.js serves them from its own cache (`x-nextjs-cache: HIT`). Hashed JS and CSS files are marked `immutable`, so the browser never re-downloads them. (Measured against `next start`; the dev server behaves differently.)",
    evidence: [
      { path: "lib/storage.ts", what: "localStorage for progress: a browser-side store, not an HTTP cache" },
    ],
    verify: [
      "Run `npm run build` then `npm run start`, and run `curl -I localhost:3000/learn/ssr`. Look at `Cache-Control` and `x-nextjs-cache`.",
      "Request one of the files under /_next/static/ the same way: `Cache-Control` is `public, max-age=31536000, immutable`.",
    ],
    whyNot:
      "We don't use Next.js's own caching (`fetch` with `force-cache`, `unstable_cache`, or the newer `use cache` directive) because there are no `fetch` calls: all data is imported from local files. It matters as soon as content comes from an API or a database.",
  },
};
