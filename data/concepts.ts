import type { Concept, PipelineStage } from "@/lib/types";

/**
 * The Phase 1 concept set. Positions are hand-placed in a 1600x800 SVG
 * coordinate space, laid out by dependency "layer" (longest path from a
 * root) so the map reads left-to-right as a flow, with the CSR/SSR/SSG/ISR
 * branch fanning out and rejoining at React Rendering.
 */
export const concepts: Concept[] = [
  {
    id: "http",
    title: "HTTP",
    blurb: "The request/response protocol that starts every page load.",
    topics: [
      { label: "Anatomy of a request and a response", section: "what-is-this", hint: "What the browser asks for (a method, a URL, headers) and what the server sends back (a status code, headers, a body)." },
      { label: "Why HTTP is stateless", section: "why-it-exists", hint: "The server forgets you after every request, so anything that must be remembered (like being logged in) has to be sent again each time." },
      { label: "Connections, TLS, and HTTP/2 multiplexing", section: "how-it-works", hint: "How the browser opens a secure connection, and how newer HTTP versions send many requests over one connection at once." },
      { label: "The request timeline", section: "runtime", hint: "The order of events from typing a URL to getting bytes back: look up the address, connect, ask, wait, receive." },
      { label: "HTTPS isn't a different protocol", section: "misconceptions", hint: "HTTPS is just normal HTTP sent through an encrypted tunnel. The requests and responses look the same." },
    ],
    category: "foundation",
    stage: "web-fundamentals",
    prerequisites: [],
    position: { x: 80, y: 400 },
    mobilePosition: { x: 180, y: 60 },
  },
  {
    id: "browser-rendering",
    title: "Browser Rendering",
    blurb: "How the browser turns a response into a pixel-painted page.",
    topics: [
      { label: "The pipeline: DOM, CSSOM, layout, paint, composite", section: "how-it-works", hint: "The five steps the browser runs to turn HTML and CSS into pixels, and what each one produces." },
      { label: "Bytes-to-pixels timeline", section: "runtime", hint: "Follow one page from raw downloaded bytes all the way to what you see on screen." },
      { label: "Why transform and opacity are cheap to animate", section: "tradeoffs", hint: "These two properties can be animated by the graphics card alone, skipping the slow layout and paint steps." },
      { label: "A React re-render isn't a browser re-render", section: "misconceptions", hint: "React running your component again is not the same as the browser redrawing the page. Often nothing on screen changes." },
    ],
    category: "foundation",
    stage: "web-fundamentals",
    prerequisites: ["http"],
    position: { x: 300, y: 400 },
    mobilePosition: { x: 180, y: 170 },
  },
  {
    id: "html-parsing",
    title: "HTML Parsing",
    blurb: "The browser reads HTML top to bottom, building the DOM as it goes.",
    topics: [
      { label: "Incremental parsing while bytes arrive", section: "how-it-works", hint: "The browser starts building the page while the HTML is still downloading, instead of waiting for all of it." },
      { label: "Bytes-to-DOM timeline", section: "runtime", hint: "How a stream of text characters becomes the tree of elements the browser works with." },
      { label: "What streaming SSR relies on", section: "react-next", hint: "Streaming only works because browsers already show HTML piece by piece as it arrives." },
      { label: "Parser-blocking scripts", section: "tradeoffs", hint: "A plain script tag makes the browser stop and wait, which delays everything after it." },
    ],
    category: "foundation",
    stage: "web-fundamentals",
    prerequisites: ["browser-rendering"],
    position: { x: 520, y: 400 },
    mobilePosition: { x: 180, y: 280 },
  },
  {
    id: "csr",
    title: "CSR",
    blurb: "Client-Side Rendering: the browser builds the UI with JavaScript after load.",
    topics: [
      { label: "What the server actually sends", section: "what-is-this", hint: "In CSR the first response is almost an empty page. JavaScript fills in the real content later." },
      { label: "Watch a CSR request play out", section: "experiment", hint: "An animation of the steps, showing exactly when the user finally sees content and when they can click." },
      { label: "Where JavaScript is required", section: "server-vs-browser", hint: "In CSR nothing shows without JavaScript. See exactly what runs on the server, network and browser." },
      { label: "SEO and time-to-content tradeoffs", section: "tradeoffs", hint: "CSR is simple to host, but the first content appears later and search engines may see an empty page." },
    ],
    category: "strategy",
    stage: "rendering-strategies",
    prerequisites: ["html-parsing"],
    position: { x: 740, y: 220 },
    mobilePosition: { x: 80, y: 400 },
  },
  {
    id: "ssr",
    title: "SSR",
    blurb: "Server-Side Rendering: the server builds HTML before sending it to the browser.",
    topics: [
      { label: "Why a server would generate HTML", section: "why-it-exists", hint: "So the browser gets real content right away instead of an empty page it has to fill in." },
      { label: "Watch an SSR request play out", section: "experiment", hint: "An animation of the steps, showing that content appears early but clicking works only after hydration." },
      { label: "Server vs. browser: who does what", section: "server-vs-browser", hint: "A clear split of what runs on the server, what travels over the network, and what runs in the browser." },
      { label: "How Next.js does SSR", section: "react-next", hint: "Next.js renders every page on the server by default, then hydrates it in the browser." },
      { label: "Why SSR isn't automatically faster", section: "misconceptions", hint: "SSR shows content sooner, but a slow server or slow data can make the whole page arrive later." },
    ],
    category: "strategy",
    stage: "rendering-strategies",
    prerequisites: ["html-parsing"],
    position: { x: 740, y: 560 },
    mobilePosition: { x: 280, y: 400 },
  },
  {
    id: "ssg",
    title: "SSG",
    blurb: "Static Site Generation: pages are rendered once, at build time.",
    topics: [
      { label: "Rendering once, at build time", section: "how-it-works", hint: "The page is built one time when you deploy, then the same finished file is handed to every visitor." },
      { label: "generateStaticParams in Next.js", section: "react-next", hint: "The Next.js function that lists every page to prebuild, such as one page per blog post." },
      { label: "Freshness and build-time tradeoffs", section: "tradeoffs", hint: "Static pages are very fast, but they only update when you rebuild, and huge sites take a long time to build." },
      { label: "Static HTML doesn't mean no dynamic behavior", section: "misconceptions", hint: "The starting HTML is fixed, but JavaScript can still fetch new data and react to clicks afterwards." },
    ],
    category: "strategy",
    stage: "rendering-strategies",
    prerequisites: ["ssr"],
    position: { x: 960, y: 460 },
    mobilePosition: { x: 300, y: 520 },
  },
  {
    id: "isr",
    title: "ISR",
    blurb: "Incremental Static Regeneration: static pages that quietly re-render on a schedule.",
    topics: [
      { label: "Stale-while-revalidate, step by step", section: "how-it-works", hint: "Serve the old copy instantly, rebuild a fresh one in the background, and use the fresh one next time." },
      { label: "Time-based vs. on-demand revalidation", section: "react-next", hint: "Refresh a page every N seconds, or refresh it exactly when something changes." },
      { label: "Regeneration cost and staleness tradeoffs", section: "tradeoffs", hint: "Visitors may briefly see slightly old content, and many pages refreshing at once can spike server load." },
      { label: "ISR vs. SSR-with-caching", section: "misconceptions", hint: "With ISR a visitor never waits for a rebuild. A plain cached SSR page can still make someone wait on a miss." },
    ],
    category: "strategy",
    stage: "rendering-strategies",
    prerequisites: ["ssr"],
    position: { x: 960, y: 680 },
    mobilePosition: { x: 190, y: 640 },
  },
  {
    id: "caching",
    title: "Caching",
    blurb: "Storing rendered output so future requests skip the expensive work.",
    topics: [
      { label: "Which cache layer answers a request", section: "experiment", hint: "Pick which layers already hold a saved copy, then see which one replies and which are never touched." },
      { label: "Browser, CDN, server, database", section: "how-it-works", hint: "The chain of places a request can be answered from, closest to the user first." },
      { label: "Caching in Next.js: opting in", section: "react-next", hint: "Next.js doesn't cache fetches by default. You opt in per request or with the newer \"use cache\" directive, and can refresh entries on demand." },
      { label: "Debugging \"fast locally, slow in production\"", section: "misconceptions", hint: "Your laptop has no CDN in front of it, so caching is a top suspect when production behaves differently." },
    ],
    category: "optimization",
    stage: "production-concerns",
    prerequisites: ["ssg", "isr"],
    position: { x: 1180, y: 570 },
    mobilePosition: { x: 280, y: 760 },
  },
  {
    id: "react-rendering",
    title: "React Rendering",
    blurb: "How React turns components into a tree, and re-renders it when state changes.",
    topics: [
      { label: "Render, reconcile, commit", section: "how-it-works", hint: "React's three steps: call your components, compare with last time, then apply only the differences to the page." },
      { label: "A re-render isn't necessarily a DOM change", section: "misconceptions", hint: "A component can run again and produce the same output, in which case React leaves the page untouched." },
      { label: "Where React runs: browser and server", section: "server-vs-browser", hint: "React can run in the browser to update the page, or on the server to produce HTML text." },
      { label: "Re-render cost and keys", section: "tradeoffs", hint: "Re-running many components costs time, and wrong list keys can make React reuse the wrong item." },
    ],
    category: "react",
    stage: "react-nextjs",
    prerequisites: ["csr", "ssr"],
    position: { x: 960, y: 220 },
    mobilePosition: { x: 80, y: 530 },
  },
  {
    id: "hydration",
    title: "Hydration",
    blurb: "Attaching React's event handlers and state onto server-rendered HTML.",
    topics: [
      { label: "Why server HTML alone is inert", section: "why-it-exists", hint: "HTML from the server looks right but has no click handlers yet, so nothing responds." },
      { label: "Toggle server HTML, JavaScript, and hydration", section: "experiment", hint: "Flip three switches and see what the visitor can see and click in each combination." },
      { label: "Hydration mismatches", section: "tradeoffs", hint: "When the server's HTML and React's first browser render disagree, React has to throw part of it away." },
      { label: "hydrateRoot in Next.js", section: "react-next", hint: "The React call that attaches to server HTML. Next.js runs it for you on every page that needs it." },
    ],
    category: "react",
    stage: "react-nextjs",
    prerequisites: ["react-rendering"],
    position: { x: 1180, y: 220 },
    mobilePosition: { x: 80, y: 660 },
  },
  {
    id: "server-components",
    title: "Server Components",
    blurb: "React components that run only on the server and never ship their code to the browser.",
    topics: [
      { label: "Where component code actually runs", section: "how-it-works", hint: "Server Components run only on the server. Their code is never downloaded by the browser." },
      { label: "What ships to the browser (and what doesn't)", section: "server-vs-browser", hint: "Only Client Components' code and the finished output are sent. Server Component source stays on the server." },
      { label: "Server Components vs. SSR", section: "misconceptions", hint: "SSR is about when HTML is made. Server Components are about where the component code runs." },
      { label: "The cost of the client boundary", section: "tradeoffs", hint: "Anything interactive must live in a Client Component, so you have to decide where that line goes." },
    ],
    category: "react",
    stage: "react-nextjs",
    prerequisites: ["hydration"],
    position: { x: 1400, y: 220 },
    mobilePosition: { x: 80, y: 790 },
  },
  {
    id: "streaming",
    title: "Streaming",
    blurb: "Sending rendered output to the browser in pieces, as it becomes ready.",
    topics: [
      { label: "Why the slowest query shouldn't block the page", section: "why-it-exists", hint: "Without streaming, one slow data fetch holds back the whole page, even parts that don't need it." },
      { label: "Watch a response arrive in chunks", section: "experiment", hint: "Compare a page that waits for everything with one that shows each part as soon as it's ready." },
      { label: "Suspense boundaries in React and Next.js", section: "react-next", hint: "Wrapping a slow part in Suspense tells React it may show a placeholder and stream that part in later." },
      { label: "Layout shift and buffering pitfalls", section: "tradeoffs", hint: "Late content can push the page around, and some hosting setups quietly turn streaming back into all-at-once." },
    ],
    category: "react",
    stage: "modern-delivery",
    prerequisites: ["server-components"],
    position: { x: 1520, y: 400 },
    mobilePosition: { x: 180, y: 920 },
  },
];

export const conceptMap: Record<string, Concept> = Object.fromEntries(
  concepts.map((c) => [c.id, c]),
);

export const categoryLabels: Record<Concept["category"], string> = {
  foundation: "Foundation",
  strategy: "Rendering Strategy",
  react: "React",
  optimization: "Optimization",
};

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  "web-fundamentals": "Web Fundamentals",
  "rendering-strategies": "Rendering Strategies",
  "react-nextjs": "React / Next.js",
  "modern-delivery": "Modern Delivery",
  "production-concerns": "Production Concerns",
};

export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  "web-fundamentals",
  "rendering-strategies",
  "react-nextjs",
  "modern-delivery",
  "production-concerns",
];
