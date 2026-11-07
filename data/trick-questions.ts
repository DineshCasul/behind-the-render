import { findChapter } from "@/data/journey";
import type { Level } from "@/data/question-bank";
import { trickMap, tricks } from "@/data/tricks";

/**
 * Interview questions for the tricks. Each trick has its own question on its
 * page (`Trick.question`); this file gives each one a difficulty and a list of
 * topics to look up next, and adds a second question per trick, so the question
 * bank can be built around the tricks.
 *
 * Answers stay inside what the company's own words support. Where an answer
 * adds general engineering knowledge, it says so in the text.
 */
export interface TrickBankQuestion {
  trick: string;
  level: Level;
  question: string;
  answer: string;
  /** Topic names to look up next. */
  related: string[];
  /** Extra sources for this one question, on top of the trick's own. */
  extra?: { title: string; url: string }[];
}

const PRIMARY: Record<string, { level: Level; related: string[] }> = {
  "request-batching": { level: "medium", related: ["Request waterfalls", "HTTP/2 multiplexing", "Batched APIs and GraphQL", "Data loaders"] },
  "field-data": { level: "medium", related: ["Lab versus field data", "Chrome UX Report", "Core Web Vitals thresholds", "Real user monitoring"] },
  "adaptive-bitrate": { level: "hard", related: ["Adaptive bitrate streaming", "Media Capabilities API", "Rebuffering", "Video codecs"] },
  "canvas-rendering": { level: "hard", related: ["Canvas versus SVG versus DOM", "The accessibility tree", "ARIA", "Browser extensions and the DOM"] },
  webassembly: { level: "medium", related: ["asm.js", "Compiling C++ for the browser", "WebAssembly versus JavaScript", "Streaming compilation"] },
  "server-rendering-service": { level: "hard", related: ["Server-side rendering", "Hydration", "Node rendering services", "Time to first byte"] },
  "service-worker-cache": { level: "medium", related: ["Service workers", "The Cache API", "App shell model", "Progressive web apps"] },
  "atomic-css": { level: "medium", related: ["Utility classes", "CSS specificity", "Critical CSS", "Build-time CSS extraction"] },
  "loading-tiers": { level: "medium", related: ["Code splitting", "Critical-path JavaScript", "Relay and GraphQL", "Streaming and Suspense"] },
  "layered-cache": { level: "hard", related: ["Varnish", "CDN and edge caching", "Cache hit ratio", "Cache invalidation"] },
  "gradual-migration": { level: "hard", related: ["Strangler fig pattern", "Lint rules as guardrails", "Bundle size budgets", "Native APIs versus libraries"] },
  "hexagon-grid": { level: "hard", related: ["Geospatial indexing", "Geohash and S2 cells", "k-ring neighbours", "Nearest-neighbour search"] },
};

const SECOND: TrickBankQuestion[] = [
  {
    trick: "request-batching",
    level: "easy",
    question: "What is a request waterfall?",
    answer:
      "A waterfall is requests that wait on each other: one finishes, then the next starts, so the user waits through all of them. The cost grows with the number of round trips in the chain. It is the shape YouTube's web team set out to cut, by working out the minimal set of components a view needs and batching them in a single network request.",
    related: ["Request waterfalls", "Round-trip time", "Critical request chains", "Prefetching"],
  },
  {
    trick: "field-data",
    level: "tricky",
    question: "A page passes Lighthouse. Can you say it passes Core Web Vitals?",
    answer:
      "Not yet. Lighthouse is a lab test: one controlled run on one device and network. A page can pass the lab and still fail for real people on real devices (general knowledge, not from the case study), which is why YouTube's web team reported its progress in field terms: 76% of its mobile website URLs passing Core Web Vitals thresholds in the field.",
    related: ["Lab versus field data", "Chrome UX Report", "Core Web Vitals", "Performance budgets"],
  },
  {
    trick: "adaptive-bitrate",
    level: "easy",
    question: "What does an adaptive bitrate algorithm do?",
    answer:
      "It chooses, automatically, which version of a video to play, for example which resolution, instead of using one fixed quality (general knowledge). In YouTube's case study the risk was that the algorithm could automatically select a resolution a device could not play smoothly, which the Media Capabilities API was used to prevent.",
    related: ["Adaptive bitrate streaming", "Media Capabilities API", "Rebuffering", "Video resolutions"],
  },
  {
    trick: "canvas-rendering",
    level: "tricky",
    question: "Google said screen reader compatibility would not be impacted by Docs moving to canvas rendering. Does that make a canvas UI accessible by default?",
    answer:
      "No. Google's statement is about Docs: compatibility with assistive technologies such as screen readers would not be impacted by the change. A canvas is a drawing surface with no element tree of its own, so accessibility has to be provided on purpose (general web knowledge, not from Google's post). Read the statement as a claim about Google's work, not a property of canvas.",
    related: ["The accessibility tree", "ARIA", "Canvas accessibility", "Screen readers"],
  },
  {
    trick: "webassembly",
    level: "easy",
    question: "What is WebAssembly?",
    answer:
      "According to Figma's post, a binary format for machine code, designed with browsers in mind and designed to be as fast as possible for the browser to parse. Figma used it to run its C++ code in the browser; before that, C++ could be run in the browser by cross-compiling it to asm.js, a subset of JavaScript.",
    related: ["asm.js", "Binary formats", "Compiling to the browser", "JavaScript engines"],
  },
  {
    trick: "server-rendering-service",
    level: "tricky",
    question: "Airbnb's Hypernova sends HTML back to your server. Is the page interactive when that HTML arrives?",
    answer:
      "No. The README says the Hypernova server computes the views into an HTML string and sends them back, and that on the browser JavaScript is used to progressively enhance the application and make it dynamic. Until that JavaScript runs, the HTML is a picture of the page. React's word for the second step is hydration.",
    related: ["Hydration", "Progressive enhancement", "Server-side rendering", "Time to interactive"],
  },
  {
    trick: "service-worker-cache",
    level: "easy",
    question: "What does the service worker do in Twitter Lite's PWA?",
    answer:
      "According to the web.dev case study, a service worker script caches additional resources, enabling fast navigation to other screens. Twitter reported a 65% increase in pages per session and a 75% increase in Tweets sent. Those are Twitter's numbers for its PWA in 2017.",
    related: ["Service workers", "The Cache API", "App shell model", "Offline-first"],
  },
  {
    trick: "atomic-css",
    level: "easy",
    question: "What is atomic CSS?",
    answer:
      "In Facebook's words, a style approach whose growth is proportional to the number of unique style declarations rather than to the number of styles and features you write. In its 2020 rebuild, the team generated atomic CSS at build time and reduced the CSS on the homepage by 80 percent.",
    related: ["Utility classes", "CSS specificity", "Build-time CSS", "Stylesheet size"],
  },
  {
    trick: "loading-tiers",
    level: "medium",
    question: "Facebook uses @defer in its data queries. What problem does it solve?",
    answer:
      "A slow part of a response does not have to hold back the rest: @defer enables different sections of the response to be streamed as soon as they are ready. Loading states, for example with React Suspense, let the page fill in as the sections arrive.",
    related: ["Streaming responses", "React Suspense", "Relay", "Skeleton screens"],
  },
  {
    trick: "layered-cache",
    level: "tricky",
    question: "Over 90% of Wikimedia's read requests are served by caches. Why can't you cache everything the same way?",
    answer:
      "Some responses are personal. MDN warns that if personalized contents are stored in a cache other than a private cache, other users may be able to retrieve them, which may cause unintentional information leakage. Wikimedia's post is about read requests and does not discuss logged-in users or cookies, so it is not evidence either way for how they are handled.",
    related: ["Private versus shared caches", "Cache-Control", "Vary header", "Cookies and caching"],
    extra: [{ title: "MDN: HTTP caching", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching" }],
  },
  {
    trick: "gradual-migration",
    level: "medium",
    question: "What does a lint rule add to a plan for removing a library?",
    answer:
      "It stops the problem growing while you fix it. GitHub tracked jQuery usage over time and used an ESLint plugin that would fail CI checks if anyone tried to use jQuery features, so new uses could not appear while the old ones were removed.",
    related: ["ESLint plugins", "CI checks", "Tracking migration progress", "Codemods"],
  },
  {
    trick: "hexagon-grid",
    level: "tricky",
    question: "You only search the rider's cell and its neighbours. Can that miss the nearest driver?",
    answer:
      "Yes. A driver just outside the searched cells can be closer than one inside them, so a grid lookup is a fast way to find candidates, not a guarantee. You choose the resolution and how many rings of neighbours to search, and you can widen the search when nothing is found (general geospatial reasoning, not from Uber's post). The toy on the hexagon trick page shows it happening.",
    related: ["Geospatial indexing", "k-ring neighbours", "Nearest-neighbour search", "Spatial join"],
  },
];

export const trickQuestions: TrickBankQuestion[] = [
  ...tricks.map((t) => ({
    trick: t.slug,
    level: PRIMARY[t.slug].level,
    question: t.question.q,
    answer: t.question.a,
    related: PRIMARY[t.slug].related,
  })),
  ...SECOND,
];

/** A trick's own sources: the link behind each quote in its journey chapters, once each. */
export function sourcesFor(slug: string): { title: string; url: string }[] {
  const seen = new Map<string, { title: string; url: string }>();
  for (const id of trickMap[slug].chapters) {
    for (const d of findChapter(id)?.chapter.docs ?? []) {
      if (!seen.has(d.href)) seen.set(d.href, { title: d.source, url: d.href });
    }
  }
  return [...seen.values()];
}
