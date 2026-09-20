import type { ConceptId } from "@/lib/types";

/**
 * How each concept connects to the others, in the same problem, concept, new
 * problem shape the story uses. Shown at the top of every lesson so no lesson
 * feels like an island.
 *
 * Two kinds of link, on purpose:
 * - `builtOn` and `leadsTo` are the map's own prerequisite edges and MUST match
 *   them (checked against the map's edges: same ids, both directions).
 * - `alsoTies` are the cross-links the map does not draw (for example
 *   Hydration and the main thread). They are what stops the map's tree shape
 *   from hiding how much the topics overlap.
 *
 * Every claim here must agree with the lessons, and none needs a number.
 */
export interface ConceptLink {
  id: ConceptId;
  note: string;
}

export interface Connection {
  /** Why this concept exists in the chain, in one or two sentences. */
  because: string;
  /** What this concept takes from each prerequisite. */
  builtOn: ConceptLink[];
  /** The problem this concept leaves open: the reason the next ones exist. */
  leaves: string;
  /** What builds on this concept, and why. */
  leadsTo: ConceptLink[];
  /** Related in ways the map does not draw. */
  alsoTies: ConceptLink[];
}

export const connections: Record<ConceptId, Connection> = {
  http: {
    because: "Everything on this site starts with one browser asking one server for one thing, so this is where the chain begins.",
    builtOn: [],
    leaves: "A response is just text. Something inside the browser still has to turn it into pixels.",
    leadsTo: [{ id: "browser-rendering", note: "The HTML in the response is what the browser turns into a page." }],
    alsoTies: [
      { id: "caching", note: "Caching is mostly HTTP headers, so the rules from this lesson reappear there." },
      { id: "seo", note: "A crawler is just another HTTP client, and it reads status codes too." },
    ],
  },
  "browser-rendering": {
    because: "Once HTML arrives, the browser runs a fixed pipeline to draw it. Every rendering strategy later is really a choice about what feeds this pipeline, and when.",
    builtOn: [{ id: "http", note: "The pipeline starts from the response body that the HTTP request brought back." }],
    leaves: "The pipeline needs something to work on, and HTML has to be read (parsed) before anything can be styled or drawn.",
    leadsTo: [
      { id: "html-parsing", note: "Reading the HTML is the first stage of the pipeline." },
      { id: "js-main-thread", note: "The pipeline and your JavaScript share one thread, which is where slowness comes from." },
    ],
    alsoTies: [
      { id: "web-vitals", note: "LCP and CLS are measurements of what this pipeline produces." },
      { id: "react-rendering", note: "React changes the DOM; this pipeline turns those changes into pixels." },
    ],
  },
  "html-parsing": {
    because: "The browser can only draw what it has understood, so it reads HTML first, as a stream. That detail is why servers, streaming and crawlers matter.",
    builtOn: [{ id: "browser-rendering", note: "Parsing is the first stage of the pipeline: text becomes the DOM." }],
    leaves: "The parser is happy with a nearly empty page or a full one. Who produces the HTML, and when, is the next question.",
    leadsTo: [
      { id: "csr", note: "The browser can build the HTML itself, with JavaScript." },
      { id: "ssr", note: "The server can produce full HTML for each request." },
      { id: "seo", note: "Crawlers read this same HTML first." },
    ],
    alsoTies: [
      { id: "streaming", note: "The parser reads incrementally, which is why HTML can be sent in pieces." },
      { id: "hydration", note: "Hydration attaches behavior to the DOM this parser built." },
    ],
  },
  csr: {
    because: "The first answer to \"who produces the HTML?\" is: nobody on the server. The browser builds everything with JavaScript.",
    builtOn: [{ id: "html-parsing", note: "The response is a nearly empty page the parser reads instantly; the real content arrives later." }],
    leaves: "Visitors and crawlers get an empty shell first, and everything waits for JavaScript. Could the server send something real?",
    leadsTo: [{ id: "react-rendering", note: "In CSR, React's rendering runs in its simplest form: entirely in the browser." }],
    alsoTies: [
      { id: "seo", note: "The empty first response is the search risk of CSR." },
      { id: "js-main-thread", note: "All that JavaScript runs on the phone's one main thread before anything appears." },
      { id: "web-vitals", note: "A large bundle can hurt LCP and INP." },
    ],
  },
  ssr: {
    because: "The second answer: the server builds the HTML for each request, so the very first response already contains content.",
    builtOn: [{ id: "html-parsing", note: "The browser parses server HTML like any other, and can start on it immediately." }],
    leaves: "The server now works for every request, and the HTML isn't interactive yet. Could some pages be built ahead of time? And who wakes the page up?",
    leadsTo: [
      { id: "ssg", note: "Build the page once, ahead of time, instead of on every request." },
      { id: "isr", note: "Rebuild those ahead-of-time pages in the background so they don't go stale." },
      { id: "react-rendering", note: "The server runs React's rendering to produce that HTML." },
    ],
    alsoTies: [
      { id: "seo", note: "Content in the first response is what crawlers want." },
      { id: "caching", note: "Work done on every request is exactly what caching exists to avoid." },
      { id: "hydration", note: "SSR HTML is only a picture until hydration attaches behavior." },
    ],
  },
  ssg: {
    because: "If a page is the same for everyone, why build it for every request? Build it once, ahead of time.",
    builtOn: [{ id: "ssr", note: "Same idea (real HTML in the response), produced at build time instead of per request." }],
    leaves: "The page is frozen at build time, and a very large site takes a long time to rebuild.",
    leadsTo: [{ id: "caching", note: "A prebuilt page is a saved result that never expires by itself." }],
    alsoTies: [
      { id: "isr", note: "ISR is SSG plus a refresh, for pages that must not stay frozen." },
      { id: "seo", note: "Prebuilt HTML is fully readable on the first request." },
    ],
  },
  isr: {
    because: "SSG is fast but stale, and SSR is fresh but costly. ISR keeps static speed and rebuilds pages in the background.",
    builtOn: [{ id: "ssr", note: "A regeneration is server-side rendering, done occasionally instead of for every visitor." }],
    leaves: "Everyone now shares a saved copy. How long do we keep it, and how do we throw it away when it's wrong?",
    leadsTo: [{ id: "caching", note: "ISR is caching applied to rendered pages." }],
    alsoTies: [
      { id: "ssg", note: "The same prebuilt files, with a refresh added." },
      { id: "seo", note: "Like SSG, the content is in the HTML a crawler receives." },
    ],
  },
  caching: {
    because: "SSG and ISR are both saved results. Caching is the general idea underneath them, at every layer from the browser to the database.",
    builtOn: [
      { id: "ssg", note: "A prebuilt page is a saved copy that never expires by itself." },
      { id: "isr", note: "A page with a refresh window is a saved copy with an expiry." },
    ],
    leaves: "Copies go stale, and a shared copy must never hold one person's data. Deciding what to share, where and for how long is the hard part (the ticket-drop story picks it up).",
    leadsTo: [],
    alsoTies: [
      { id: "http", note: "Cache-Control is an HTTP header, so this is HTTP applied." },
      { id: "web-vitals", note: "A cache hit shortens time to first byte, which feeds LCP." },
      { id: "ssr", note: "It is one way a server that renders per request can survive a traffic spike." },
    ],
  },
  "react-rendering": {
    because: "Both CSR and SSR need something that turns components into UI. React does that, and decides what changes on the page.",
    builtOn: [
      { id: "csr", note: "In the browser, React builds and updates the DOM itself." },
      { id: "ssr", note: "On the server, the same rendering produces the HTML." },
    ],
    leaves: "The server made the HTML, but React in the browser knows nothing about it yet. How does React take over HTML it didn't create?",
    leadsTo: [{ id: "hydration", note: "Hydration is React taking over server HTML without rebuilding it." }],
    alsoTies: [
      { id: "js-main-thread", note: "Rendering runs on the main thread, so a big render is a long task." },
      { id: "browser-rendering", note: "React changes the DOM; the browser's pipeline draws the result." },
    ],
  },
  hydration: {
    because: "Server HTML looks finished but does nothing. Hydration attaches state and event handlers so it works.",
    builtOn: [{ id: "react-rendering", note: "Hydration runs React's rendering in the browser and matches it to the HTML already there." }],
    leaves: "Hydrating everything costs JavaScript and main-thread time, even for parts that never change. Which parts need the browser at all?",
    leadsTo: [{ id: "client-components", note: "Only interactive parts need hydrating, and this is how you mark them." }],
    alsoTies: [
      { id: "js-main-thread", note: "Hydration runs on the main thread and can delay taps." },
      { id: "web-vitals", note: "That delay is what INP measures." },
      { id: "ssr", note: "Hydration is the second half of the SSR story." },
    ],
  },
  "client-components": {
    because: "Once you ask which parts need the browser, you need a way to say so: the client boundary.",
    builtOn: [{ id: "hydration", note: "Client Components are the parts that get hydrated." }],
    leaves: "Everything not marked stays on the server, which is a different kind of component with different rules.",
    leadsTo: [{ id: "server-components", note: "The rest of the tree can stay on the server and ship no JavaScript." }],
    alsoTies: [
      { id: "js-main-thread", note: "The smaller the client boundary, the less JavaScript there is to run and hydrate." },
      { id: "web-vitals", note: "Less client code helps INP." },
      { id: "ssr", note: "Client Components are still rendered to HTML on the server first." },
    ],
  },
  "server-components": {
    because: "If most of a page never changes, its code doesn't need to reach the browser at all.",
    builtOn: [{ id: "client-components", note: "Server Components are the default; the client boundary is where they hand over to the browser." }],
    leaves: "Server work can be slow, and one slow query can hold up the whole response. Could the ready parts go first?",
    leadsTo: [{ id: "streaming", note: "Send the ready parts of the page first, and the slow ones as they arrive." }],
    alsoTies: [
      { id: "ssr", note: "Easily confused with SSR: SSR is about generating HTML, Server Components are about where code runs." },
      { id: "caching", note: "Data fetched on the server is what you would cache." },
    ],
  },
  streaming: {
    because: "A slow part shouldn't hold the whole page hostage. Send what's ready, then the rest.",
    builtOn: [{ id: "server-components", note: "A slow part can be fetched next to its component, wrapped, and streamed on its own." }],
    leaves: "The page now arrives in pieces, so you need to check it really feels faster to real visitors. That means measuring it.",
    leadsTo: [],
    alsoTies: [
      { id: "web-vitals", note: "Streaming mainly changes how soon content appears, which LCP and time to first byte measure." },
      { id: "html-parsing", note: "It works because the browser's parser reads HTML as it arrives." },
      { id: "hydration", note: "With a streamed page, hydration can happen part by part." },
    ],
  },
  seo: {
    because: "A page nobody can find helps nobody. What a crawler receives first depends on who builds the HTML.",
    builtOn: [{ id: "html-parsing", note: "Crawlers read the same HTML the browser's parser reads." }],
    leaves: "Being found is only half of it: the page then has to feel fast, which needs measuring.",
    leadsTo: [],
    alsoTies: [
      { id: "csr", note: "An empty first response is the risk to watch." },
      { id: "ssr", note: "Content already in the first response removes that risk." },
      { id: "ssg", note: "Prebuilt pages are crawlable straight away." },
    ],
  },
  "js-main-thread": {
    because: "The rendering pipeline and your JavaScript share one thread. Anything slow on it delays everything, including taps.",
    builtOn: [{ id: "browser-rendering", note: "Layout and paint run on the same main thread as your scripts." }],
    leaves: "\"Slow\" needs numbers before you can improve it: what do we measure, and on whose device?",
    leadsTo: [{ id: "web-vitals", note: "Numbers for loading, responsiveness and stability." }],
    alsoTies: [
      { id: "hydration", note: "Hydration is one of the biggest jobs the main thread gets." },
      { id: "react-rendering", note: "A large React render is a long task." },
      { id: "client-components", note: "The client boundary decides how much JavaScript lands on this thread." },
    ],
  },
  "web-vitals": {
    because: "Every choice so far (where HTML is built, how much JavaScript ships, what is cached) moves a number. Web Vitals are those numbers.",
    builtOn: [{ id: "js-main-thread", note: "Long tasks on the main thread are what make INP poor." }],
    leaves: "A number tells you something is wrong, not what. You walk back through the chain: server, network, JavaScript, layout.",
    leadsTo: [],
    alsoTies: [
      { id: "ssr", note: "Server work and distance show up in time to first byte and LCP." },
      { id: "caching", note: "A cache hit is one of the biggest levers on time to first byte." },
      { id: "hydration", note: "Hydration cost shows up in INP." },
      { id: "streaming", note: "Streaming changes how soon content appears." },
    ],
  },
};
