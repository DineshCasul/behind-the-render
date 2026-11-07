import type { TrickGroup } from "@/data/categories";
import type { ConceptId } from "@/lib/types";

/**
 * Tricks: the named ideas behind how real websites work. Short on purpose: a
 * hook, two or three sentences, and (for some) a toy you can poke.
 *
 * A trick does not repeat its sources. It points at journey chapters
 * (`chapters`), and the quotes, links, alternatives and "which site" all come
 * from there (`data/journey.ts`), so a quote is only ever written down once.
 * The `idea` text only restates what those quotes say.
 *
 * `concepts` are the foundations (the older rendering lessons) a trick builds
 * on. `question` is one interview angle, written to stay inside what the
 * sources support and to flag where it is general engineering knowledge.
 */
export interface Trick {
  slug: string;
  title: string;
  /** Which group of tricks it is listed under (see data/categories.ts). */
  group: TrickGroup;
  /** A question this trick answers, lowercase, shown in the home page's terminal line. */
  curious: string;
  hook: string;
  idea: string[];
  /** A poke-able toy for this trick, if there is one. Implemented in components/tricks. */
  toy?: "batching" | "nearby";
  /** Journey chapter ids this trick is told in. */
  chapters: string[];
  concepts: ConceptId[];
  /** Slugs of tricks worth reading next. */
  related: string[];
  question: { q: string; a: string };
}

export const tricks: Trick[] = [
  {
    slug: "request-batching",
    group: "faster",
    curious: "why does one slow request hold up the whole page?",
    title: "Batch the Requests",
    hook: "Ten requests that wait on each other are ten waits.",
    idea: [
      "A waterfall is requests that wait on each other: one finishes, the next starts, and the user waits through all of them.",
      "YouTube's web team cut them by working out the minimal set of components a view needs, and batching them in a single network request.",
    ],
    toy: "batching",
    chapters: ["youtube-waterfall"],
    concepts: ["http"],
    related: ["field-data"],
    question: {
      q: "A page makes six API calls when it loads and feels slow. Where do you start?",
      a: "Find out which calls depend on each other. Calls that don't can already run in parallel. A chain, where each call needs the previous answer, is a waterfall, and its cost is the number of round trips. Collapse the chain, for example by asking for the minimal set of data a view needs in one request, which is what YouTube's web team describes doing. Then measure again on a real device, not your laptop.",
    },
  },
  {
    slug: "field-data",
    group: "faster",
    curious: "why do real users see a slower page than your laptop does?",
    title: "Fix the Slowest Paint",
    hook: "Four to six seconds is a long time to stare at a watch page.",
    idea: [
      "YouTube's web team found Largest Contentful Paint clocking in at 4 to 6 seconds in some cases. They also tested what to show while the video loads: a solid black poster image showed the best results in user studies.",
      "They tracked the outcome in the field, on real devices: 76% of YouTube's mobile website URLs now pass Core Web Vitals thresholds.",
    ],
    chapters: ["youtube-paint", "youtube-waterfall"],
    concepts: ["web-vitals"],
    related: ["request-batching", "adaptive-bitrate"],
    question: {
      q: "Lighthouse says the page is fast, but users say it's slow. What do you check?",
      a: "Lab data comes from one controlled test. Field data comes from real people on real devices and networks, and a page can pass in the lab and still fail in the field. Look at field data (the Chrome UX Report is one source) for the slow cases, then reproduce them. YouTube's team found some mobile watch pages with a Largest Contentful Paint of 4 to 6 seconds this way.",
    },
  },
  {
    slug: "adaptive-bitrate",
    group: "scale",
    curious: "how does a video keep playing on bad wifi?",
    title: "Don't Pick What the Device Can't Play",
    hook: "The best resolution is the one that doesn't stall.",
    idea: [
      "YouTube used the Media Capabilities API to prevent its adaptive bitrate algorithm from automatically selecting resolutions that a device could not play smoothly.",
      "In the experiment, the mean time between rebuffers increased by 7.1%, while average resolution by video height only declined by 0.4%.",
    ],
    chapters: ["youtube-stream"],
    concepts: ["web-vitals"],
    related: ["field-data"],
    question: {
      q: "Why would a player ever choose a lower resolution than the network allows?",
      a: "Because the network isn't the only limit: a device can struggle to play a resolution smoothly. If the player keeps choosing something the device can't handle, you get rebuffering. YouTube used the Media Capabilities API to stop its adaptive bitrate algorithm choosing those resolutions, and reported a 7.1% increase in mean time between rebuffers for a 0.4% decline in average resolution.",
    },
  },
  {
    slug: "canvas-rendering",
    group: "native",
    curious: "how can a doc editor draw its own text?",
    title: "Paint It Yourself",
    hook: "HTML is one way to put a page on screen. A canvas is the other.",
    idea: [
      "Google announced that Docs would move from an HTML-based rendering approach to a canvas-based approach, to improve performance and consistency in how content appears across different platforms.",
      "The bill: some Chrome extensions rely on the way the backend of a Google Doc is structured and may not work as intended. Google said compatibility with assistive technologies such as screen readers would not be impacted.",
    ],
    chapters: ["docs-canvas", "docs-catch"],
    concepts: ["browser-rendering", "html-parsing"],
    related: ["webassembly"],
    question: {
      q: "What do you give up when you render your UI to a canvas instead of HTML elements?",
      a: "Anything that relied on the page's structure. A canvas is a drawing surface, so there is no tree of elements for the browser, extensions or assistive technology to read unless you provide one (that part is general web knowledge, not from Google's post). Google said extensions relying on how a Google Doc is structured might stop working as intended after the move, and that screen reader compatibility would not be impacted. Accessibility on a canvas is work you do on purpose.",
    },
  },
  {
    slug: "webassembly",
    group: "native",
    curious: "how does a design tool written in C++ run in a browser?",
    title: "Ship Machine Code",
    hook: "Figma's editor is C++. The browser runs it.",
    idea: [
      "Before WebAssembly, C++ code could be run in the browser by cross-compiling it to a subset of JavaScript known as asm.js. WebAssembly is a binary format for machine code, designed with browsers in mind and designed to be as fast as possible for the browser to parse.",
      "Figma reported that its load time improved by more than 3x after it switched to WebAssembly, regardless of document size.",
    ],
    chapters: ["figma-port", "figma-load"],
    concepts: ["js-main-thread"],
    related: ["canvas-rendering"],
    question: {
      q: "Why was Figma's load time better with WebAssembly than with asm.js?",
      a: "Figma's post says the format was designed to be as fast as possible for the browser to parse, and reports a load time more than 3x better after the switch, regardless of document size. A takeaway for an interview: measure load time separately from steady-state speed, because a format can win at startup.",
    },
  },
  {
    slug: "server-rendering-service",
    group: "faster",
    curious: "why would you build a whole service just to render views?",
    title: "Rendering as a Service",
    hook: "Airbnb built a whole service just to render views on the server.",
    idea: [
      "Hypernova, Airbnb's open-source project, is a service for server-side rendering your JavaScript views. Your server uses a Hypernova client to submit an HTTP request to a Hypernova server, which computes the views into an HTML string and sends them back.",
      "In the browser, JavaScript is then used to progressively enhance the application and make it dynamic.",
    ],
    chapters: ["airbnb-fork", "airbnb-hollow-page"],
    concepts: ["ssr", "hydration"],
    related: [],
    question: {
      q: "What's the trade-off of putting server rendering in its own service?",
      a: "The web app makes an extra HTTP request to the renderer for every server-rendered page, and you now run and scale one more service. In exchange, rendering is separated from the main app. The request and response shape is what Hypernova describes: your server submits an HTTP request to a Hypernova server, which sends back HTML. The costs and benefits are general engineering reasoning, not claims from the README.",
    },
  },
  {
    slug: "service-worker-cache",
    group: "native",
    curious: "how does a website work with no signal?",
    title: "The App on the Device",
    hook: "Twitter Lite was 600KB over the wire. The Android app was 23.5MB.",
    idea: [
      "Twitter described its PWA as only 600KB over the wire, against 23.5MB of downloaded data needed to install the native Android app. A service worker script caches additional resources, enabling fast navigation to other screens.",
      "It reported a 65% increase in pages per session and a 75% increase in Tweets sent.",
    ],
    chapters: ["twitter-weight", "twitter-memory"],
    concepts: ["caching"],
    related: ["request-batching", "field-data"],
    question: {
      q: "What can a service worker do that a normal page can't?",
      a: "It is a script that sits between the page and the network and can cache resources, which is how Twitter Lite cached additional resources for fast navigation to other screens. Because it controls caching, you also have to plan how outdated files get replaced (general knowledge, not from the case study).",
    },
  },
  {
    slug: "atomic-css",
    group: "faster",
    curious: "how do you ship less CSS as the site grows?",
    title: "Ship Less CSS",
    hook: "Facebook cut the CSS on its homepage by 80 percent.",
    idea: [
      "In its 2020 rebuild of Facebook.com, the team generated atomic CSS at build time and reduced the CSS on the homepage by 80 percent.",
      "The post explains why that works: atomic CSS has a logarithmic growth curve because it is proportional to the number of unique style declarations rather than to the number of styles and features the team writes.",
    ],
    chapters: ["facebook-weight"],
    concepts: ["browser-rendering"],
    related: ["loading-tiers"],
    question: {
      q: "Why can atomic CSS make a stylesheet smaller as an app grows?",
      a: "Facebook's post explains it: atomic CSS has a logarithmic growth curve because it is proportional to the number of unique style declarations rather than to the number of styles and features you write. In its 2020 rebuild the team generated atomic CSS at build time and reduced the CSS on the homepage by 80 percent.",
    },
  },
  {
    slug: "loading-tiers",
    group: "faster",
    curious: "does all the JavaScript need to load at once?",
    title: "Load in Tiers",
    hook: "Not all JavaScript is equally urgent.",
    idea: [
      "Facebook split the JavaScript needed for the initial load into three tiers, using a declarative, statically analyzable API.",
      "It also streams slow data: with @defer, different sections of a response can be streamed as soon as they are ready. The reasoning, load what the first paint needs first and let the rest follow, is general engineering, not a quote.",
    ],
    chapters: ["facebook-tiers", "facebook-stream"],
    concepts: ["js-main-thread", "streaming"],
    related: ["atomic-css", "request-batching"],
    question: {
      q: "How would you decide which JavaScript goes in the first load?",
      a: "Ask what the first paint and first interaction need, and load only that up front. Things that do not change what is on screen, like logging, can come later. Facebook describes splitting the JavaScript for the initial load into three tiers using a declarative, statically analyzable API.",
    },
  },
  {
    slug: "layered-cache",
    group: "scale",
    curious: "how do you serve millions of readers without melting?",
    title: "Two Layers of Memory",
    hook: "Over 90% of Wikimedia's read requests are served by its caches.",
    idea: [
      "Wikimedia's post says that on a normal day over 90% of read requests are served by its caching solution. Each cache node ran Varnish twice: one in-memory instance for caching in RAM, and one instance for on-disk caching.",
      "If the request hits the in-memory cache, the HTTP response is sent back directly to the user.",
    ],
    chapters: ["wikipedia-edge", "wikipedia-layers"],
    concepts: ["caching"],
    related: ["service-worker-cache"],
    question: {
      q: "Why would a cache have both a RAM layer and a disk layer?",
      a: "RAM is fast but small, and disk is slower but holds much more, so a request that misses the fast layer can still be answered by the big one instead of reaching the origin (the speed and size trade-off is general knowledge). Wikimedia's post describes each cache node running one in-memory and one on-disk Varnish instance.",
    },
  },
  {
    slug: "gradual-migration",
    group: "change",
    curious: "how do you delete a library without breaking the site?",
    title: "Delete It Slowly",
    hook: "GitHub added jQuery in late 2007. In 2018 it announced it was gone.",
    idea: [
      "GitHub.com pulled in jQuery 1.2.1 as a dependency in late 2007. Modern browsers later offered native equivalents, so the team could achieve everything it needed using standard browser APIs.",
      "It did not rewrite everything at once: it tracked jQuery usage over time, and a lint plugin would fail CI checks if anyone tried to use jQuery features. The expected prize was dropping a 30 kB dependency from its bundles.",
    ],
    chapters: ["github-library", "github-slow-burn"],
    concepts: ["js-main-thread"],
    related: ["loading-tiers"],
    question: {
      q: "You want to remove a library that is used in thousands of places. What is the plan?",
      a: "Do not rewrite it in one go. Measure where it is used and track that number over time, stop new usage with a lint rule that fails CI, then chip away at the existing uses. That is the approach GitHub describes for jQuery: tracking usage and failing CI checks on new jQuery use.",
    },
  },
  {
    slug: "hexagon-grid",
    group: "scale",
    curious: "how does a map app know what is nearby?",
    title: "Cut the Map into Hexagons",
    hook: "Uber turned the Earth into a grid of hexagons.",
    idea: [
      "H3 is Uber's grid system: it divides areas of the Earth into hexagonal cells. Hexagons have only one distance between a hexagon centerpoint and its neighbors, and analysis on areas such as neighborhoods within a city is much more practical.",
      "It is hierarchical: each finer resolution has cells with one seventh the area of the coarser resolution.",
    ],
    toy: "nearby",
    chapters: ["uber-grid", "uber-zoom"],
    concepts: [],
    related: [],
    question: {
      q: "How would you find the drivers near a rider without checking every driver?",
      a: "Put locations into grid cells, look up the rider's cell and the cells around it, and only work out exact distances for the drivers found there. Uber's H3 does the grid part with hexagons at several resolutions, and its post notes that hexagons have only one distance between a cell's centerpoint and its neighbors. The lookup-then-refine approach is general geospatial indexing, not a quote.",
    },
  },
];

export const trickMap: Record<string, Trick> = Object.fromEntries(tricks.map((t) => [t.slug, t]));
