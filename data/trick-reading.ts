/**
 * "Read the real thing": for each trick, where the general technique behind its
 * "build it" sketch comes from, so a reader can go and look at real code or the
 * original explanation. Keyed by trick slug.
 *
 * These are not claims by the company a trick is about (that is what the quotes
 * are for). They are general-engineering references: official docs, a standard
 * library, or the article that named the idea. Each link was fetched and checked
 * to load and to mention what its note says it covers. Notes only say what the
 * page contains. No em dashes.
 */
export interface Reading {
  title: string;
  by: string;
  href: string;
  note: string;
}

export const trickReading: Record<string, Reading[]> = {
  "request-batching": [
    {
      title: "DataLoader",
      by: "GraphQL (open source)",
      href: "https://github.com/graphql/dataloader",
      note: "The best-known library for this idea. Its README explains how loads that happen in a single frame of execution (one tick of the event loop) are collected and sent as one batch, and how it caches results.",
    },
  ],

  "field-data": [
    {
      title: "Largest Contentful Paint (LCP)",
      by: "web.dev",
      href: "https://web.dev/articles/lcp",
      note: "What LCP measures, the 2.5 second 'good' target at the 75th percentile, and how to measure it in the browser with PerformanceObserver.",
    },
    {
      title: "web-vitals",
      by: "GoogleChrome (open source)",
      href: "https://github.com/GoogleChrome/web-vitals",
      note: "A small library that measures LCP and the other Core Web Vitals in real users' browsers. Read its source to compare with the sketch above.",
    },
  ],

  "adaptive-bitrate": [
    {
      title: "Media Capabilities API",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Media_Capabilities_API",
      note: "The browser API for asking whether a device can decode and play a stream smoothly, which is the check the sketch's 'playable' flag stands for.",
    },
    {
      title: "dash.js",
      by: "DASH Industry Forum (open source)",
      href: "https://github.com/Dash-Industry-Forum/dash.js",
      note: "An open-source MPEG-DASH player. Its source includes adaptive bitrate selection, so you can read how a real player chooses a rendition.",
    },
  ],

  "canvas-rendering": [
    {
      title: "Optimizing canvas",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas",
      note: "MDN's tips for fast canvas drawing, such as pre-rendering to an offscreen canvas, using layered canvases and avoiding needless state changes.",
    },
  ],

  webassembly: [
    {
      title: "Loading and running WebAssembly code",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running",
      note: "How to fetch a .wasm file and instantiate it from JavaScript, including WebAssembly.instantiateStreaming, which the sketch uses.",
    },
  ],

  "server-rendering-service": [
    {
      title: "renderToString",
      by: "React",
      href: "https://react.dev/reference/react-dom/server/renderToString",
      note: "React's reference for turning a component into an HTML string on the server, the technique in the sketch. It also covers the streaming alternatives and how hydration picks the page up in the browser.",
    },
  ],

  "service-worker-cache": [
    {
      title: "Caching strategies overview",
      by: "Workbox, Chrome for Developers",
      href: "https://developer.chrome.com/docs/workbox/caching-strategies-overview",
      note: "Cache first, network first and stale-while-revalidate explained side by side, with when to use each. Workbox is the library most service workers use instead of hand-written fetch handlers.",
    },
  ],

  "atomic-css": [
    {
      title: "StyleX",
      by: "Meta (open source)",
      href: "https://stylexjs.com/docs/learn/",
      note: "Meta's open-source styling system, which compiles styles to atomic CSS at build time. The Facebook post does not name the library, so treat this as a public implementation of the idea, not as Facebook.com's code.",
    },
  ],

  "loading-tiers": [
    {
      title: "requestIdleCallback",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback",
      note: "The browser API behind the sketch's 'wait until the browser is idle' tier, including its timeout option for work that must not wait forever.",
    },
  ],

  "layered-cache": [
    {
      title: "HTTP caching",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching",
      note: "How Cache-Control and shared and private caches work. This is the machinery that CDN layers like Wikimedia's rely on.",
    },
    {
      title: "Map",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      note: "Why the LRU sketch works: a JavaScript Map remembers the insertion order of its keys, so the first key is always the oldest.",
    },
  ],

  "gradual-migration": [
    {
      title: "Strangler Fig",
      by: "Martin Fowler",
      href: "https://martinfowler.com/bliki/StranglerFigApplication.html",
      note: "Where the name comes from: strangler figs he saw in Queensland in 2001, and the idea of replacing a legacy system gradually instead of in one rewrite. The article explains the idea and has no code. GitHub's post does not use the term; the sketch is one common way to apply it.",
    },
  ],

  "migrate-live": [
    {
      title: "Online migrations at scale",
      by: "Stripe",
      href: "https://stripe.com/blog/online-migrations",
      note: "Stripe's own write-up of moving data live: dual writing, backfilling, switching the read and write paths, and deleting the old data. A third company describing the same shape as Notion and Discord.",
    },
  ],

  "hexagon-grid": [
    {
      title: "H3 documentation",
      by: "H3 (open source, from Uber)",
      href: "https://h3geo.org/docs/",
      note: "The official docs: how cells and resolutions work, and the functions for finding neighbours, which is the k-ring step in the sketch.",
    },
  ],

  "last-writer-wins": [
    {
      title: "Conflict-free replicated data type",
      by: "Wikipedia",
      href: "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type",
      note: "Describes the last-writer-wins register and the other CRDT types. Figma's post says its design was inspired by CRDTs, and compares its approach to a last-writer-wins register.",
    },
    {
      title: "crdt.tech",
      by: "The CRDT community",
      href: "https://crdt.tech/",
      note: "A hub of papers, talks and implementations about CRDTs, for when you want more than a single register.",
    },
  ],

  "fractional-indexing": [
    {
      title: "fractional-indexing",
      by: "Rocicorp (open source)",
      href: "https://github.com/rocicorp/fractional-indexing",
      note: "A JavaScript implementation of fractional indexing with string keys. Its README shows how a key is generated between two neighbours, which is what the sketch does with plain numbers.",
    },
  ],

  "virtual-list": [
    {
      title: "Virtualize large lists with react-window",
      by: "web.dev",
      href: "https://web.dev/articles/virtualize-long-lists-react-window",
      note: "Why rendering only the visible rows helps, and how the react-window library does it. Read the library to see the windowing maths from the sketch in production form.",
    },
  ],

  "local-first-navigation": [
    {
      title: "Keeping things fresh with stale-while-revalidate",
      by: "web.dev",
      href: "https://web.dev/articles/stale-while-revalidate",
      note: "The HTTP-level version of the same idea: serve the cached copy now and refresh it in the background. Useful to compare with a client-side store like IndexedDB.",
    },
  ],

  "prefetch-before-click": [
    {
      title: "Speculative loading",
      by: "MDN",
      href: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Speculative_loading",
      note: "The browser's own tools for prefetching and prerendering pages ahead of a click, and the trade-offs of each.",
    },
  ],

  "request-coalescing": [
    {
      title: "singleflight",
      by: "Go (golang.org/x/sync)",
      href: "https://pkg.go.dev/golang.org/x/sync/singleflight",
      note: "A small Go package that suppresses duplicate function calls: only one runs while the others wait for its result. Request coalescing in library form.",
    },
  ],

  "consistent-hashing": [
    {
      title: "Consistent hashing",
      by: "Wikipedia",
      href: "https://en.wikipedia.org/wiki/Consistent_hashing",
      note: "An overview of the idea, which it traces to Karger et al. in 1997, with the common variants.",
    },
  ],

  "cache-vs-gc": [
    {
      title: "A guide to the Go garbage collector",
      by: "The Go team",
      href: "https://go.dev/doc/gc-guide",
      note: "Go's own guide to how its collector works and why its cost depends on the live heap, which is the effect Discord ran into.",
    },
  ],

  "hot-partition": [
    {
      title: "Designing partition keys to distribute your workload evenly",
      by: "AWS, DynamoDB docs",
      href: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html",
      note: "AWS's guidance on choosing a partition key so requests spread uniformly. DynamoDB is a different database from the ones in the Discord post, but the idea carries over.",
    },
  ],

  "partition-key": [
    {
      title: "Choosing a distribution column",
      by: "Citus docs",
      href: "https://docs.citusdata.com/en/stable/sharding/data_modeling.html",
      note: "How a sharded Postgres picks the column that decides where rows live, and how that keeps related rows together. Notion's post says it considered Citus before building its own application-level sharding.",
    },
  ],

  "ownership-reasons": [
    {
      title: "Rc<T>, the reference counted smart pointer",
      by: "The Rust Book",
      href: "https://doc.rust-lang.org/book/ch15-04-rc.html",
      note: "How reference counting works: a value is kept while it has owners and dropped when the count reaches zero. Notion's design records who the owners are, not just how many.",
    },
  ],
};
