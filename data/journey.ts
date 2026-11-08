import type { RoadKind } from "@/data/categories";
import {
  webFingerprints,
  webFork,
  webHandover,
  webMemory,
  webPath,
  webRequest,
  webStale,
  webWhose,
} from "@/data/journey-web";
import {
  discordCassandra,
  discordMove,
  discordRust,
  discordShield,
  facebookBet,
  facebookBudget,
  facebookPreload,
  facebookRoutes,
  facebookStyles,
  figmaCatch,
  figmaObjects,
  figmaSetup,
  figmaTree,
  figmaUndo,
  notion480,
  notionMove,
  notionStorage,
  notionSync,
  notionWhen,
  wikipediaLimits,
  wikipediaPath,
  wikipediaSwitchover,
} from "@/data/journey-deep";
import {
  cloudflareRing,
  discordGc,
  discordPartition,
  facebookNavigation,
  figmaMultiplayer,
  figmaOrder,
  githubInstant,
  githubVirtual,
  notionOffline,
  notionShard,
  uberRingpop,
  wikipediaHerd,
} from "@/data/journey-more";

/**
 * The journeys, shown on the site as "sites": one company's engineering, told as
 * a short narrated walk of a few chapters. (The code says "road" and "journey";
 * the page says "site".)
 *
 * Voice: dry and a little playful. The jokes never get to change a fact. Every chapter ends with a "From the docs" card: sentences
 * copied word for word from the official source (checked 2026-11-07; the later chapters in journey-more.ts, 2026-11-08), each
 * with its link, so the narration can be checked at the source.
 *
 * Rules for editing this file:
 * - If you edit a quote, re-fetch the page and copy it again, do not reword it.
 *   Markup (code formatting, links) is stripped from quotes; the words are not.
 *   A leading or trailing "…" marks a quote cut out of a longer sentence.
 * - A company only gets a road when there is a first-party source to quote
 *   (its own docs, its own repo, or a case study Google published about it).
 *   Third-party commentary is not enough, which is why there is no Google Search
 *   road yet.
 * - Case studies are snapshots. Each app's `note` says what the numbers describe.
 *
 * Each string in `lines` is one subtitle, shown on its own until the reader
 * moves on. Keep them short enough to read in one breath.
 */

/** A sentence quoted verbatim from official documentation. */
export interface DocQuote {
  text: string;
  /** Short, human label for where it came from. */
  source: string;
  href: string;
}

/** A different tool that solves the same problem another way. */
export interface Alternative {
  name: string;
  /** One line, grounded in what that tool's own docs say. */
  why: string;
  href: string;
}

/**
 * A concrete example shown as its own card after a chapter's narration: real captured
 * HTTP, or a small piece of code. `note` always says where it came from and whether it is
 * real, trimmed or illustrative.
 */
export interface ChapterExample {
  title: string;
  code: string;
  note: string;
}

/** Which diagram sits beside a chapter's narration (components/journey/ChapterVisual.tsx). */
export type VisualKind =
  | "hexagons"
  | "hex-zoom"
  | "waterfall"
  | "cache-edge"
  | "cache-layers"
  | "lcp-timeline"
  | "playback"
  | "css-shrink"
  | "js-tiers"
  | "jquery-timeline"
  | "jquery-decline"
  | "wasm-port"
  | "wasm-load";

/** A multiple-choice question with its answer, used for "guess first" and "check yourself". */
export interface Quiz {
  question: string;
  options: string[];
  /** Index of the correct option in `options`. */
  answer: number;
  /** Shown after the reader picks, right or wrong. */
  reveal: string;
}

export interface JourneyChapter {
  id: string;
  /** The chapter's title card. */
  title: string;
  lines: string[];
  docs: DocQuote[];
  alternatives?: Alternative[];
  /** The short "trick" page that goes deeper on this chapter's idea (`/trick/<slug>`), if there is one. */
  trick?: string;
  /** What this chapter's facts describe, when that needs saying (a snapshot in time, an open-source project). */
  note?: string;
  /** A question to guess before the narration, where there is one clear number to guess. */
  predict?: Quiz;
  /** A diagram that advances with each subtitle of this chapter. */
  visual?: VisualKind;
  /** A concrete example (real HTTP, or code) shown as its own card after the narration. */
  example?: ChapterExample;
}

export interface JourneyApp {
  id: string;
  name: string;
  /** Which group of roads it is listed under (see data/categories.ts). */
  kind: RoadKind;
  /** One line for the sites list. */
  blurb: string;
  /** One closing question about the whole road. */
  check?: Quiz;
  chapters: JourneyChapter[];
}

// ---- Sources, reused across roads ----

const MDN_HTTP = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview";
const MDN_CRP = "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path";
const MDN_CACHE_CONTROL = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control";
const WEBDEV_RENDERING = "https://web.dev/articles/rendering-on-the-web";
const REACT_HYDRATE = "https://react.dev/reference/react-dom/client/hydrateRoot";
const NEXT_RSC = "https://nextjs.org/docs/app/getting-started/server-and-client-components";
const HYPERNOVA = "https://github.com/airbnb/hypernova";
const YOUTUBE_PAINT = "https://web.dev/case-studies/better-youtube-web-part1";
const YOUTUBE_MEDIA = "https://web.dev/case-studies/youtube-media-capabilities";
const DOCS_CANVAS = "https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html";
const FIGMA_WASM = "https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/";
const FACEBOOK_REBUILD = "https://engineering.fb.com/2020/05/08/web/facebook-redesign/";
const WIKIMEDIA_CDN = "https://diff.wikimedia.org/2020/10/14/wikimedias-cdn/";
const GITHUB_JQUERY = "https://github.blog/2018-09-06-removing-jquery-from-github-frontend/";
const UBER_H3 = "https://www.uber.com/us/en/blog/h3/";
const TWITTER_STUDY = "https://web.dev/case-studies/twitter";

const ASTRO: Alternative = {
  name: "Astro islands",
  why: "Renders every UI component to just HTML and CSS by default; only the interactive islands get hydrated.",
  href: "https://docs.astro.build/en/concepts/islands/",
};
const QWIK: Alternative = {
  name: "Qwik",
  why: "Does not hydrate. It pauses execution on the server and resumes it on the client.",
  href: "https://qwik.dev/docs/concepts/resumable/",
};
const PLAIN_HTTP_CACHING: Alternative = {
  name: "Plain HTTP caching",
  why: "Cache-Control: stale-while-revalidate lets a cache reuse a stale response while it revalidates. No framework needed.",
  href: MDN_CACHE_CONTROL,
};

const HYPERNOVA_NOTE =
  "Hypernova's README describes the open-source project. It is not a description of Airbnb's current setup.";
const YOUTUBE_NOTE =
  "Case studies Google published about YouTube's web app. The numbers describe the versions they measured, not today's.";
const DOCS_NOTE = "Google's May 2021 announcement. It says what changed and why, not how Docs works today.";
const FIGMA_NOTE = "A 2017 post by Figma's co-founder. The numbers describe that switch.";
const FACEBOOK_NOTE = "Meta's May 2020 post about rebuilding Facebook.com. It describes that rebuild, not today's site.";
const WIKIMEDIA_NOTE = "Wikimedia's own post about its CDN up to 2018. Their setup has changed since.";
const GITHUB_NOTE = "GitHub's 2018 post. It describes that migration, not today's code.";
const UBER_NOTE = "Uber's 2018 post introducing H3.";
const TWITTER_NOTE =
  "A 2017 case study, from when it was called Twitter Lite. The numbers are Twitter's own and describe that version.";

// ---- Chapters ----

const airbnbFork: JourneyChapter = {
  id: "airbnb-fork",
  trick: "server-rendering-service",
  note: HYPERNOVA_NOTE,
  title: "The Fork",
  lines: [
    "Airbnb built a service whose whole job is server-side rendering JavaScript views. They called it Hypernova.",
    "Here is how it works. Your web server sends a request to a Hypernova server. Hypernova computes the views into an HTML string and sends it back.",
    "So the rendering lives in its own service, and the web app just asks for HTML. The price of server rendering is time before the first byte.",
    "A hypernova is an exploding star. Airbnb named a rendering service after it. We respect that.",
  ],
  docs: [
    {
      text: "Hypernova server computes all the views into an HTML string and sends them back to the client.",
      source: "Airbnb: Hypernova README",
      href: HYPERNOVA,
    },
    {
      text: "generating pages on the server takes time, which can increase your page's TTFB.",
      source: "web.dev: Rendering on the Web",
      href: WEBDEV_RENDERING,
    },
  ],
  alternatives: [
    {
      name: "Next.js",
      why: "Server rendering built into the framework: by default, layouts and pages are Server Components, which render parts of your UI on the server.",
      href: NEXT_RSC,
    },
  ],
};

const airbnbHollowPage: JourneyChapter = {
  id: "airbnb-hollow-page",
  trick: "server-rendering-service",
  note: HYPERNOVA_NOTE,
  title: "The Hollow Page",
  lines: [
    "The HTML arrives from Hypernova. It looks like a page. It is a picture of a page.",
    "Then, on the browser, JavaScript is used to progressively enhance the application and make it dynamic. That is Hypernova's own description.",
    "React's word for it is hydration: attach to the HTML that exists, and take over managing the DOM inside it.",
  ],
  docs: [
    {
      text: "On the browser, JavaScript is used to progressively enhance the application and make it dynamic.",
      source: "Airbnb: Hypernova README",
      href: HYPERNOVA,
    },
    {
      text: "React will attach to the HTML that exists inside the domNode, and take over managing the DOM inside it.",
      source: "React: hydrateRoot",
      href: REACT_HYDRATE,
    },
  ],
  alternatives: [ASTRO, QWIK],
};

const youtubePaint: JourneyChapter = {
  id: "youtube-paint",
  visual: "lcp-timeline",
  predict: {
    "question": "On some mobile watch pages, how long did Largest Contentful Paint take?",
    "options": [
      "Under a second",
      "About 2 seconds",
      "4 to 6 seconds"
    ],
    "answer": 2,
    "reveal": "4 to 6 seconds in some cases, according to YouTube's web team."
  },
  trick: "field-data",
  title: "The Slow Paint",
  note: YOUTUBE_NOTE,
  lines: [
    "Largest Contentful Paint measures how long the biggest thing on screen takes to appear. YouTube's web team found it clocking in at 4 to 6 seconds in some cases.",
    "Four to six seconds, staring at a watch page. On a phone, that is a lifetime.",
    "They also tested what to show while the video loads. A solid black poster image showed the best results in user studies.",
  ],
  docs: [
    {
      text: "…Largest Contentful Paint (LCP) metric clocking in at 4-6 seconds in some cases.",
      source: "web.dev: Building a better web: A faster YouTube",
      href: YOUTUBE_PAINT,
    },
    {
      text: "Using a solid black poster image showed the best results in user studies.",
      source: "web.dev: Building a better web: A faster YouTube",
      href: YOUTUBE_PAINT,
    },
  ],
};

const youtubeWaterfall: JourneyChapter = {
  id: "youtube-waterfall",
  visual: "waterfall",
  predict: {
    "question": "What share of YouTube's mobile website URLs now pass Core Web Vitals thresholds, in the field?",
    "options": [
      "76%",
      "About a quarter",
      "Nearly all of them"
    ],
    "answer": 0,
    "reveal": "76%, according to the case study."
  },
  trick: "request-batching",
  title: "The Waterfall",
  note: YOUTUBE_NOTE,
  lines: [
    "A waterfall is requests that wait on each other: one finishes, the next starts, and the user waits through all of them.",
    "To cut them, the team determined the minimal set of components needed in a view and batched them in a single network request.",
    "They also moved the player to one top-level component that passes data down to its children.",
    "The result: 76% of YouTube's mobile website URLs now passing Core Web Vitals thresholds, in the field. On real phones, not on a developer's laptop.",
  ],
  docs: [
    {
      text: "…the team determined the minimal set of components needed in a view and batched them in a single network request.",
      source: "web.dev: Building a better web: A faster YouTube",
      href: YOUTUBE_PAINT,
    },
    {
      text: "…one top-level component that would pass down data to its children.",
      source: "web.dev: Building a better web: A faster YouTube",
      href: YOUTUBE_PAINT,
    },
    {
      text: "…76% of YouTube's mobile website URLs now passing Core Web Vitals metric thresholds in the field.",
      source: "web.dev: Building a better web: A faster YouTube",
      href: YOUTUBE_PAINT,
    },
  ],
};

const youtubeStream: JourneyChapter = {
  id: "youtube-stream",
  visual: "playback",
  predict: {
    "question": "With the Media Capabilities API, how much did average resolution drop?",
    "options": [
      "By about 20%",
      "It went up",
      "Only by 0.4%"
    ],
    "answer": 2,
    "reveal": "Only by 0.4%, while the mean time between rebuffers rose by 7.1%."
  },
  trick: "adaptive-bitrate",
  title: "The Stream",
  note: YOUTUBE_NOTE,
  lines: [
    "Then there is the video itself. YouTube used the Media Capabilities API so its adaptive bitrate algorithm would not automatically select resolutions a device could not play smoothly.",
    "In the experiment, the mean time between rebuffers increased by 7.1%.",
    "Average resolution by video height only declined by 0.4%. A tiny price for fewer stalls.",
  ],
  docs: [
    {
      text: "…prevent their adaptive bitrate algorithm from automatically selecting resolutions that a device could not play smoothly.",
      source: "web.dev: How YouTube improved video performance with the Media Capabilities API",
      href: YOUTUBE_MEDIA,
    },
    {
      text: "Users who were part of the experimental group collectively saw less frequent rebuffers (the mean time between rebuffers, or MTBR, increased by 7.1%) while the average resolution, measured by video height, served to the aggregate group only declined by 0.4%.",
      source: "web.dev: How YouTube improved video performance with the Media Capabilities API",
      href: YOUTUBE_MEDIA,
    },
  ],
};

const docsCanvas: JourneyChapter = {
  id: "docs-canvas",
  trick: "canvas-rendering",
  title: "The Canvas",
  note: DOCS_NOTE,
  lines: [
    "Google announced that Docs would change how it renders documents: from the current HTML-based rendering approach to a canvas-based approach.",
    "The stated goal: to improve performance and improve consistency in how content appears across different platforms.",
    "A canvas is a drawing surface for script. HTML elements are the other way to put a page on screen.",
  ],
  docs: [
    {
      text: "…from the current HTML-based rendering approach to a canvas-based approach…",
      source: "Google Workspace Updates: Docs will now use canvas based rendering",
      href: DOCS_CANVAS,
    },
    {
      text: "…to improve performance and improve consistency in how content appears across different platforms.",
      source: "Google Workspace Updates: Docs will now use canvas based rendering",
      href: DOCS_CANVAS,
    },
  ],
};

const docsCatch: JourneyChapter = {
  id: "docs-catch",
  trick: "canvas-rendering",
  title: "The Catch",
  note: DOCS_NOTE,
  lines: [
    "Every change has a bill. The post warns that some Chrome extensions rely on the way the backend of a Google Doc is structured, and may not work as intended.",
    "If your extension depended on the document's HTML structure, the ground moved under it.",
    "And accessibility? The post says compatibility with assistive technologies such as screen readers will not be impacted by the canvas-based rendering change.",
  ],
  docs: [
    {
      text: "Some Chrome extensions rely on the way the backend of a Google Doc is structured…",
      source: "Google Workspace Updates: Docs will now use canvas based rendering",
      href: DOCS_CANVAS,
    },
    {
      text: "…will not be impacted by the canvas-based rendering change.",
      source: "Google Workspace Updates: Docs will now use canvas based rendering",
      href: DOCS_CANVAS,
    },
  ],
};

const figmaPort: JourneyChapter = {
  id: "figma-port",
  visual: "wasm-port",
  trick: "webassembly",
  title: "The Port",
  note: FIGMA_NOTE,
  lines: [
    "Figma's product is written in C++. Before WebAssembly, C++ code could be run in the browser by cross-compiling it to a subset of JavaScript known as asm.js.",
    "WebAssembly is a binary format for machine code, designed with browsers in mind. The format was designed to be as fast as possible for the browser to parse.",
  ],
  docs: [
    {
      text: "Before WebAssembly, C++ code could be run in the browser by cross-compiling it to a subset of JavaScript known as asm.js.",
      source: "Figma: WebAssembly cut Figma's load time by 3x",
      href: FIGMA_WASM,
    },
    {
      text: "The format was designed to be as fast as possible for the browser to parse.",
      source: "Figma: WebAssembly cut Figma's load time by 3x",
      href: FIGMA_WASM,
    },
  ],
};

const figmaLoad: JourneyChapter = {
  id: "figma-load",
  visual: "wasm-load",
  trick: "webassembly",
  title: "The Load",
  note: FIGMA_NOTE,
  predict: {
    question: "How much did Figma's load time improve after switching to WebAssembly?",
    options: ["About 20%", "More than 3x", "About 50%"],
    answer: 1,
    reveal: "More than 3x, regardless of document size.",
  },
  lines: [
    "Figma's load time improved by more than 3x after the switch, regardless of document size.",
    "Same product. Different compile target. Three times faster to load.",
  ],
  docs: [
    {
      text: "As you can see, our load time improved by more than 3x after we switched to WebAssembly regardless of document size.",
      source: "Figma: WebAssembly cut Figma's load time by 3x",
      href: FIGMA_WASM,
    },
  ],
};

const twitterWeight: JourneyChapter = {
  id: "twitter-weight",
  predict: {
    "question": "How big was Twitter Lite over the wire?",
    "options": [
      "600KB",
      "6MB",
      "23.5MB"
    ],
    "answer": 0,
    "reveal": "600KB, against 23.5MB of downloaded data to install the native Android app."
  },
  trick: "service-worker-cache",
  note: TWITTER_NOTE,
  title: "The Weight",
  lines: [
    "Twitter Lite is a progressive web app. Installing the native Android app meant downloading 23.5MB. The PWA was 600KB over the wire.",
    "Twitter reported a 50% reduction in 99th percentile time-to-interactive latency.",
    "The 99th percentile is the slowest one load in a hundred. The unlucky ones. They counted those too.",
  ],
  docs: [
    {
      text: "…the PWA is only 600KB over the wire vs. 23.5MB of downloaded data needed to install the native Android app.",
      source: "web.dev: Twitter Lite case study",
      href: TWITTER_STUDY,
    },
    {
      text: "Twitter Lite users experience a 50% reduction in 99th percentile time-to-interactive latency and logged in users have a 30% reduction in average load time.",
      source: "web.dev: Twitter Lite case study",
      href: TWITTER_STUDY,
    },
  ],
  alternatives: [ASTRO],
};

const twitterMemory: JourneyChapter = {
  id: "twitter-memory",
  predict: {
    "question": "By how much did pages per session rise?",
    "options": [
      "15%",
      "165%",
      "65%"
    ],
    "answer": 2,
    "reveal": "A 65% increase in pages per session, and a 75% increase in Tweets sent."
  },
  trick: "service-worker-cache",
  note: TWITTER_NOTE,
  title: "The Memory",
  lines: [
    "A service worker script caches additional resources, enabling fast navigation to other screens.",
    "The numbers Twitter reported: a 65% increase in pages per session, and a 75% increase in Tweets sent.",
    "Faster screens, more of them, more Tweets. That is the whole argument for caring about this stuff.",
  ],
  docs: [
    {
      text: "A service worker script caches additional resources, enabling fast navigation to other screens.",
      source: "web.dev: Twitter Lite case study",
      href: TWITTER_STUDY,
    },
    {
      text: "65% increase in pages per session",
      source: "web.dev: Twitter Lite case study",
      href: TWITTER_STUDY,
    },
    {
      text: "75% increase in Tweets sent",
      source: "web.dev: Twitter Lite case study",
      href: TWITTER_STUDY,
    },
  ],
  alternatives: [PLAIN_HTTP_CACHING],
};

const facebookWeight: JourneyChapter = {
  id: "facebook-weight",
  visual: "css-shrink",
  predict: {
    "question": "By how much did Facebook cut the CSS on its homepage in the rebuild?",
    "options": [
      "20 percent",
      "80 percent",
      "50 percent"
    ],
    "answer": 1,
    "reveal": "By 80 percent, by changing how it writes and builds its styles."
  },
  trick: "atomic-css",
  title: "The Weight",
  note: FACEBOOK_NOTE,
  lines: [
    "In 2020 Facebook rebuilt the tech stack for the new Facebook.com. A full rewrite, because in their words it was the only way to achieve their goals for performance and sustainable future growth.",
    "First change: they reduced the CSS on the homepage by 80 percent, by changing how they write and build their styles.",
    "The trick was generating atomic CSS at build time. Atomic CSS has a logarithmic growth curve: it is proportional to the number of unique style declarations rather than to the number of styles and features you write.",
  ],
  docs: [
    {
      text: "we were loading more than 400 KB of compressed CSS (2 MB uncompressed) when loading the homepage",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "but only 10 percent of that was actually used for the initial render.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "…we knew it was the only way we’d be able to achieve our goals for performance and sustainable future growth.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "First, we reduced the CSS on the homepage by 80 percent by changing how we write and build our styles.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "We addressed this by generating atomic CSS at build time. Atomic CSS has a logarithmic growth curve because it’s proportional to the number of unique style declarations rather than to the number of styles and features we write.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "the new homepage downloads less than 20 percent of the CSS the old site downloaded.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
  ],
};

const facebookTiers: JourneyChapter = {
  id: "facebook-tiers",
  visual: "js-tiers",
  predict: {
    "question": "Into how many tiers did Facebook split the JavaScript for the initial load?",
    "options": [
      "Two",
      "Five",
      "Three"
    ],
    "answer": 2,
    "reveal": "Three, using a declarative, statically analyzable API."
  },
  trick: "loading-tiers",
  title: "The Tiers",
  note: FACEBOOK_NOTE,
  lines: [
    "Not all JavaScript is equally urgent.",
    "Facebook split the JavaScript needed for the initial load into three tiers, using a declarative, statically analyzable API.",
    "Tier 1 is the layout for the first paint, skeletons included. Tier 2 is everything needed to fully render the part you can see. Tier 3 is what is only needed after display, like logging.",
  ],
  docs: [
    {
      text: "We split the JavaScript needed for the initial load into three tiers, using a declarative, statically analyzable API.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "Tier 1 is the basic layout needed to display the first paint for the above-the-fold content, including UI skeletons for initial loading states.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "Tier 2 includes all the JavaScript needed to fully render all above-the-fold content.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "Tier 3 includes everything that is only needed after display",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "A 500 KB JavaScript page can become 50 KB in Tier 1, 150 KB in Tier 2, and 300 KB in Tier 3.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
  ],
};

const facebookStream: JourneyChapter = {
  id: "facebook-stream",
  title: "The Stream",
  note: FACEBOOK_NOTE,
  lines: [
    "Slow data should not hold the whole page back.",
    "Facebook uses @defer, which enables different sections of the response to be streamed as soon as they are ready.",
    "Paired with React Suspense for loading states, the page can come in from the top down.",
    "A feed works the same way. The number of stories is unknown, so each story is sent as soon as it is ready, one by one, with a single query.",
  ],
  docs: [
    {
      text: "This allows us to send each feed story as soon it’s ready, one by one, with just a single query operation.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
    {
      text: "…we use @defer, which enables different sections of the response to be streamed as soon as they’re ready.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FACEBOOK_REBUILD,
    },
  ],
};

const wikipediaEdge: JourneyChapter = {
  id: "wikipedia-edge",
  visual: "cache-edge",
  predict: {
    "question": "On a normal day, what share of Wikimedia's read requests are served by its caching solution?",
    "options": [
      "Roughly half",
      "Over 90%",
      "Exactly all of them"
    ],
    "answer": 1,
    "reveal": "Over 90%, according to Wikimedia's post."
  },
  trick: "layered-cache",
  title: "The Edge",
  note: WIKIMEDIA_NOTE,
  lines: [
    "Wikipedia is read by a lot of people, and most of them never touch a database.",
    "Wikimedia serves its content from 2 main data centers and 3 caching-only points of presence.",
    "On a normal day, over 90% of read requests are served by its caching solution.",
  ],
  docs: [
    {
      text: "Wikimedia serves its content from 2 main data centers (DC) and 3 caching-only points of presence (PoP).",
      source: "Wikimedia Diff: Wikimedia’s CDN up to 2018",
      href: WIKIMEDIA_CDN,
    },
    {
      text: "On a normal day over 90% of these read requests are served by our caching solution…",
      source: "Wikimedia Diff: Wikimedia’s CDN up to 2018",
      href: WIKIMEDIA_CDN,
    },
  ],
};

const wikipediaLayers: JourneyChapter = {
  id: "wikipedia-layers",
  visual: "cache-layers",
  trick: "layered-cache",
  title: "Two Layers",
  note: WIKIMEDIA_NOTE,
  lines: [
    "Each cache node ran Varnish twice: one in-memory instance for caching in RAM, and one for on-disk caching.",
    "If the request hits the in-memory cache, the HTTP response is sent back directly to the user.",
    "RAM is fast and small. Disk is slower and big. Two layers, two bets.",
  ],
  docs: [
    {
      text: "…one in-memory instance of Varnish for caching in RAM…",
      source: "Wikimedia Diff: Wikimedia’s CDN up to 2018",
      href: WIKIMEDIA_CDN,
    },
    {
      text: "…one instance of Varnish for on-disk caching.",
      source: "Wikimedia Diff: Wikimedia’s CDN up to 2018",
      href: WIKIMEDIA_CDN,
    },
    {
      text: "…the HTTP response is sent back directly to the user.",
      source: "Wikimedia Diff: Wikimedia’s CDN up to 2018",
      href: WIKIMEDIA_CDN,
    },
  ],
};

const githubLibrary: JourneyChapter = {
  id: "github-library",
  visual: "jquery-timeline",
  predict: {
    "question": "When did GitHub.com first pull in jQuery?",
    "options": [
      "Late 2007",
      "2012",
      "2015"
    ],
    "answer": 0,
    "reveal": "Late 2007, as jQuery 1.2.1."
  },
  trick: "gradual-migration",
  title: "The Library",
  note: GITHUB_NOTE,
  lines: [
    "GitHub.com pulled in jQuery 1.2.1 as a dependency in late 2007.",
    "Years later, the browsers had caught up. The team found it could achieve everything it needed using standard browser APIs.",
    "A library that was essential in 2007 can be dead weight later. The hard part is getting it out.",
  ],
  docs: [
    {
      text: "GitHub.com pulled in jQuery 1.2.1 as a dependency in late 2007.",
      source: "The GitHub Blog: Removing jQuery from GitHub.com frontend",
      href: GITHUB_JQUERY,
    },
    {
      text: "…achieve everything that we needed using standard browser APIs.",
      source: "The GitHub Blog: Removing jQuery from GitHub.com frontend",
      href: GITHUB_JQUERY,
    },
  ],
};

const githubSlowBurn: JourneyChapter = {
  id: "github-slow-burn",
  visual: "jquery-decline",
  predict: {
    "question": "How big was the dependency GitHub expected to drop from its bundles?",
    "options": [
      "3 kB",
      "300 kB",
      "30 kB"
    ],
    "answer": 2,
    "reveal": "About 30 kB."
  },
  trick: "gradual-migration",
  title: "The Slow Burn",
  note: GITHUB_NOTE,
  lines: [
    "They did not rewrite it in one go. They tracked jQuery usage over time.",
    "And a lint plugin would fail CI checks if anyone tried to use jQuery features. New uses stopped appearing, and the old ones were chipped away.",
    "The expected prize: eventually drop a 30 kB dependency from the packaged bundles.",
  ],
  docs: [
    {
      text: "…eslint-plugin-jquery which would fail CI checks if anyone tried to use jQuery features…",
      source: "The GitHub Blog: Removing jQuery from GitHub.com frontend",
      href: GITHUB_JQUERY,
    },
    {
      text: "…eventually drop a 30 kB dependency from our packaged bundles…",
      source: "The GitHub Blog: Removing jQuery from GitHub.com frontend",
      href: GITHUB_JQUERY,
    },
  ],
};

const uberGrid: JourneyChapter = {
  id: "uber-grid",
  visual: "hexagons",
  trick: "hexagon-grid",
  title: "The Grid",
  note: UBER_NOTE,
  lines: [
    "H3 is Uber's grid system: it divides areas of the Earth into hexagonal cells.",
    "Why hexagons? Hexagons have only one distance between a hexagon centerpoint and its neighbors. That keeps questions about \"nearby\" simple.",
    "And analysis on areas, such as neighborhoods within a city, is much more practical.",
  ],
  docs: [
    {
      text: "…hexagons have only one distance between a hexagon centerpoint and its neighbors…",
      source: "Uber Blog: H3: Uber’s Hexagonal Hierarchical Spatial Index",
      href: UBER_H3,
    },
    {
      text: "Analysis on areas, such as neighborhoods within a city, is much more practical.",
      source: "Uber Blog: H3: Uber’s Hexagonal Hierarchical Spatial Index",
      href: UBER_H3,
    },
  ],
};

const uberZoom: JourneyChapter = {
  id: "uber-zoom",
  visual: "hex-zoom",
  trick: "hexagon-grid",
  title: "The Zoom",
  note: UBER_NOTE,
  lines: [
    "H3 is hierarchical. Each finer resolution has cells with one seventh the area of the coarser resolution.",
    "So the same idea works for a whole city or for a single block: you just pick a resolution.",
  ],
  docs: [
    {
      text: "Each finer resolution has cells with one seventh the area of the coarser resolution.",
      source: "Uber Blog: H3: Uber’s Hexagonal Hierarchical Spatial Index",
      href: UBER_H3,
    },
  ],
};

const docsUsual: JourneyChapter = {
  id: "docs-usual",
  title: "The Usual Way",
  lines: [
    "You open a Google Doc. A page like this normally reaches your screen the way every web page does.",
    "The browser parses the HTML, converting the received bytes to the DOM tree.",
    "Then it builds the render tree, works out where everything goes, and paints.",
    "That is the usual way to put a page on screen. Hold that thought.",
  ],
  docs: [
    {
      text: "The browser then begins parsing the HTML, converting the received bytes to the DOM tree.",
      source: "MDN: Critical rendering path",
      href: MDN_CRP,
    },
    {
      text: "After the render tree is complete, layout occurs, defining the location and size of all the render tree elements.",
      source: "MDN: Critical rendering path",
      href: MDN_CRP,
    },
    {
      text: "Once complete, the page is rendered, or 'painted' on the screen.",
      source: "MDN: Critical rendering path",
      href: MDN_CRP,
    },
  ],
};

const airbnbShell: JourneyChapter = {
  id: "airbnb-shell",
  title: "The Shell",
  lines: [
    "You search for somewhere to stay on Airbnb. Your browser asks a server for the page.",
    "What comes back can be a finished page, or an empty shell. With client-side rendering, the browser builds the page itself, with JavaScript.",
    "Airbnb took the other path, and built a service for it.",
  ],
  docs: [
    {
      text: "The messages sent by the client are called requests and the messages sent by the server as an answer are called responses.",
      source: "MDN: Overview of HTTP",
      href: MDN_HTTP,
    },
    {
      text: "Client-side rendering means rendering pages directly in the browser with JavaScript.",
      source: "web.dev: Rendering on the Web",
      href: WEBDEV_RENDERING,
    },
  ],
};

export const journeys: JourneyApp[] = [
  {
    id: "web",
    kind: "start",
    name: "The web, in general",
    check: {
      question: "What can go wrong if a personalised page is stored in a shared cache?",
      options: [
        "The page loads more slowly",
        "Other users may be able to retrieve those contents",
        "The cache refuses to store it",
      ],
      answer: 1,
      reveal: "Other users may be able to retrieve personalised contents from a shared cache, which can leak information.",
    },
    blurb: "One click, with real HTTP examples: the request, the pixels, who builds the HTML, and who remembers the answer.",
    chapters: [webRequest, webPath, webFork, webHandover, webMemory, webFingerprints, webWhose, webStale],
  },
  {
    id: "youtube",
    kind: "feeds",
    name: "YouTube",
    check: {
      "question": "How did YouTube's web team cut the waterfalls?",
      "options": [
        "By removing the video poster",
        "By batching the minimal set of components a view needs into one network request",
        "By moving everything into one huge bundle"
      ],
      "answer": 1,
      "reveal": "They determined the minimal set of components needed in a view and batched them in a single network request."
    },
    blurb: "A 4 to 6 second paint, a batch of requests and a playback fix, from Google's own case studies.",
    chapters: [youtubePaint, youtubeWaterfall, youtubeStream],
  },
  {
    id: "facebook",
    kind: "feeds",
    name: "Facebook",
    check: {
      "question": "Why can atomic CSS stay small as a site grows?",
      "options": [
        "It is proportional to the number of unique style declarations",
        "It is only loaded on the homepage",
        "It deletes components nobody uses"
      ],
      "answer": 0,
      "reveal": "In Facebook's words, it is proportional to the number of unique style declarations rather than to the number of styles and features you write."
    },
    blurb: "The 2020 rebuild, start to finish: less CSS, JavaScript in three tiers with budgets, data fetched before the code, and loading before you click.",
    chapters: [
      facebookBet,
      facebookWeight,
      facebookStyles,
      facebookTiers,
      facebookBudget,
      facebookPreload,
      facebookStream,
      facebookRoutes,
      facebookNavigation,
    ],
  },
  {
    id: "wikipedia",
    kind: "knowledge",
    name: "Wikipedia",
    check: {
      "question": "Why did each cache node run Varnish twice?",
      "options": [
        "One instance for HTTP and one for HTTPS",
        "One in-memory instance and one on-disk instance",
        "One per data center"
      ],
      "answer": 1,
      "reveal": "One instance for caching in RAM and one for caching on disk."
    },
    blurb: "A read request through the caches, why the on-disk layer got replaced, what stops a stampede, and how the whole thing switches data centers.",
    chapters: [wikipediaEdge, wikipediaPath, wikipediaLayers, wikipediaLimits, wikipediaHerd, wikipediaSwitchover],
  },
  {
    id: "github",
    kind: "knowledge",
    name: "GitHub",
    check: {
      "question": "What kept new jQuery use from creeping back in?",
      "options": [
        "A weekly code review",
        "Deleting the library on day one",
        "A lint plugin that failed CI checks"
      ],
      "answer": 2,
      "reveal": "An ESLint plugin that would fail CI checks if anyone tried to use jQuery features."
    },
    blurb: "Removing a library without a rewrite, a code view that only draws what you see, and Issues that open from local data.",
    chapters: [githubLibrary, githubSlowBurn, githubVirtual, githubInstant],
  },
  {
    id: "google-docs",
    kind: "knowledge",
    name: "Google Docs",
    check: {
      "question": "What did Google say would not be impacted by the move to canvas rendering?",
      "options": [
        "Chrome extensions that rely on the document's structure",
        "Compatibility with assistive technologies such as screen readers",
        "Nothing: everything would change"
      ],
      "answer": 1,
      "reveal": "Compatibility with assistive technologies such as screen readers. Extensions that rely on how a Doc is structured might stop working as intended."
    },
    blurb: "When Docs stopped building documents out of HTML.",
    chapters: [docsUsual, docsCanvas, docsCatch],
  },
  {
    id: "uber",
    kind: "tools",
    name: "Uber",
    check: {
      "question": "Why did Uber choose hexagons for its grid?",
      "options": [
        "They tile the sphere with no exceptions",
        "They are the cheapest shape to draw",
        "Hexagons have only one distance between a centerpoint and its neighbors"
      ],
      "answer": 2,
      "reveal": "Hexagons have only one distance between a hexagon centerpoint and its neighbors."
    },
    blurb: "The hexagon grid that turns a map into something you can count, and the ring that shares work between servers.",
    chapters: [uberGrid, uberZoom, uberRingpop],
  },
  {
    id: "figma",
    kind: "tools",
    name: "Figma",
    check: {
      "question": "What did Figma say made WebAssembly quick to load?",
      "options": [
        "It removed the need for C++",
        "The format was designed to be as fast as possible for the browser to parse",
        "It used less memory than asm.js"
      ],
      "answer": 1,
      "reveal": "The format was designed to be as fast as possible for the browser to parse."
    },
    blurb: "WebAssembly for load speed (and its fine print), and the rules that keep many people editing one file: values, trees, order and undo.",
    chapters: [
      figmaPort,
      figmaLoad,
      figmaCatch,
      figmaSetup,
      figmaMultiplayer,
      figmaObjects,
      figmaTree,
      figmaOrder,
      figmaUndo,
    ],
  },
  {
    id: "airbnb",
    kind: "tools",
    name: "Airbnb",
    check: {
      "question": "When Hypernova's HTML arrives, what makes the page interactive?",
      "options": [
        "Nothing: it is interactive already",
        "The Hypernova server",
        "JavaScript in the browser, which progressively enhances it"
      ],
      "answer": 2,
      "reveal": "On the browser, JavaScript is used to progressively enhance the application and make it dynamic."
    },
    blurb: "The service Airbnb open-sourced to render JavaScript views on the server.",
    chapters: [airbnbShell, airbnbFork, airbnbHollowPage],
  },
  {
    id: "twitter",
    kind: "feeds",
    name: "Twitter Lite",
    check: {
      "question": "What does Twitter Lite's service worker do, per the case study?",
      "options": [
        "Caches additional resources for fast navigation to other screens",
        "Compresses every image",
        "Rewrites URLs to a CDN"
      ],
      "answer": 0,
      "reveal": "A service worker script caches additional resources, enabling fast navigation to other screens."
    },
    blurb: "A 600KB web app against a 23.5MB Android install.",
    chapters: [twitterWeight, twitterMemory],
  },
  {
    id: "discord",
    kind: "backend",
    name: "Discord",
    check: {
      question: "Why did making Discord's Go cache smaller trade one problem for another?",
      options: [
        "Smaller caches use more CPU",
        "The collector scanned less, but more requests missed the cache and hit the database",
        "A smaller cache cannot hold Read States at all",
      ],
      answer: 1,
      reveal: "The garbage collector had less to scan, but a smaller cache meant more database loads and a worse 99th percentile.",
    },
    blurb: "A cache the garbage collector had to scan, one busy channel that slowed a database, the services built to shield it, and the move to a new one.",
    chapters: [discordGc, discordRust, discordCassandra, discordPartition, discordShield, discordMove],
  },
  {
    id: "notion",
    kind: "backend",
    name: "Notion",
    check: {
      question: "Why did Notion pick workspace ID as its partition key?",
      options: [
        "It is the shortest ID",
        "Each block belongs to exactly one workspace, and people mostly query inside one, so most joins stay on one shard",
        "Workspaces are all the same size",
      ],
      answer: 1,
      reveal: "Rows stay together with the workspace they belong to, which avoids most cross-shard joins.",
    },
    blurb: "When and how to shard a database (the key, the 480, the move), and how to keep a page offline for the right reasons.",
    chapters: [notionWhen, notionShard, notion480, notionMove, notionStorage, notionOffline, notionSync],
  },
  {
    id: "cloudflare",
    kind: "backend",
    name: "Cloudflare",
    check: {
      question: "What does a consistent hash ring do when a server is added?",
      options: [
        "Every Worker is re-homed",
        "Only the Workers that lie before the new server on the ring are re-homed",
        "Nothing, new servers are ignored",
      ],
      answer: 1,
      reveal: "All the Workers that lie before it on the ring get re-homed, but none of the others are disturbed.",
    },
    blurb: "Fewer cold starts, by sending each request to a server that already has the code.",
    chapters: [cloudflareRing],
  },
];

export const journeyMap: Record<string, JourneyApp> = Object.fromEntries(journeys.map((j) => [j.id, j]));

/** A chapter by id, with the road it belongs to. Ids are unique, except the "request" opener every road shares. */
export function findChapter(id: string): { road: JourneyApp; chapter: JourneyChapter } | undefined {
  for (const road of journeys) {
    const chapter = road.chapters.find((c) => c.id === id);
    if (chapter) return { road, chapter };
  }
  return undefined;
}
