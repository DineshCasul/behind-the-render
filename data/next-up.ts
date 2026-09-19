import type { ConceptId } from "@/lib/types";

export interface NextUp {
  /** The advanced topic, named the way you'd search for it. */
  topic: string;
  /** "If you understand this concept, here is the harder idea it leads to, and why." */
  why: string;
  url: string;
  /** Set when browser support or the API itself is still moving, so nobody builds on it blindly. */
  caveat?: string;
}

/**
 * One or two harder topics per concept, each with a first-party link. Rule for
 * editing: every URL was fetched and loads (see `REFERENCES_CHECKED_ON` in
 * references.ts), and anything with limited browser support carries a caveat.
 */
export const nextUp: Record<ConceptId, NextUp[]> = {
  http: [
    { topic: "HTTP/2 and HTTP/3 (QUIC)", why: "The request model stays the same, but how requests share a connection changed a lot. It explains why old advice like bundling everything into one file is less absolute now.", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP" },
    { topic: "103 Early Hints", why: "Lets a server tell the browser which files to start fetching while it is still preparing the real response.", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103" },
  ],
  "browser-rendering": [
    { topic: "The critical rendering path", why: "The same pipeline, but focused on which steps block the first paint and how to shorten them.", url: "https://web.dev/articles/critical-rendering-path" },
    { topic: "CSS content-visibility", why: "Tells the browser it may skip rendering work for content that is off screen.", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility", caveat: "Check current browser support on the MDN page before relying on it." },
  ],
  "html-parsing": [
    { topic: "Speculation Rules (prefetch and prerender)", why: "Once you know how much work loading a page takes, you can ask the browser to do it before the visitor clicks.", url: "https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API", caveat: "Experimental with limited availability (Chromium-first). Treat it as a progressive enhancement." },
  ],
  csr: [
    { topic: "Code splitting and lazy loading", why: "The main cost of CSR is the JavaScript you must download before anything shows. Splitting it means loading only what the first screen needs.", url: "https://nextjs.org/docs/app/guides/lazy-loading" },
  ],
  ssr: [
    { topic: "Streaming server-rendered HTML", why: "SSR waits for the slowest data before sending anything. Streaming sends the ready parts first.", url: "https://nextjs.org/docs/app/guides/streaming" },
  ],
  ssg: [
    { topic: "Incremental Static Regeneration", why: "Static pages go stale at the next deploy. ISR is the answer when you have too many pages, or data that changes too often, to rebuild everything.", url: "https://nextjs.org/docs/app/guides/incremental-static-regeneration" },
  ],
  isr: [
    { topic: "Caching in the Next.js App Router", why: "ISR is one caching strategy among several. This is the current overview of how Next.js 16 lets you choose per page or per function.", url: "https://nextjs.org/docs/app/getting-started/caching" },
  ],
  "react-rendering": [
    { topic: "React Compiler", why: "Automatically avoids re-renders you would otherwise fix with memoization by hand.", url: "https://react.dev/learn/react-compiler" },
    { topic: "useDeferredValue", why: "Keeps typing responsive by letting an expensive part of the UI lag slightly behind.", url: "https://react.dev/reference/react/useDeferredValue" },
  ],
  hydration: [
    { topic: "Selective hydration with Suspense", why: "Hydration does not have to be all or nothing: parts of the page can hydrate independently, and the part a visitor interacts with first can jump the queue.", url: "https://react.dev/reference/react/Suspense" },
    { topic: "hydrateRoot", why: "The API that does the attaching. Reading its notes on mismatches makes hydration errors much easier to debug.", url: "https://react.dev/reference/react-dom/client/hydrateRoot" },
  ],
  "server-components": [
    { topic: "Fetching data in Server Components", why: "The reason Server Components matter in practice: data access next to the component, and how to avoid slow request chains.", url: "https://nextjs.org/docs/app/getting-started/fetching-data" },
    { topic: "The use API", why: "Lets a component read a promise or context, including a promise started on the server.", url: "https://react.dev/reference/react/use" },
  ],
  streaming: [
    { topic: "Suspense boundaries", why: "Streaming decides where the page can be sent in pieces; Suspense boundaries are where you draw those pieces.", url: "https://react.dev/reference/react/Suspense" },
  ],
  caching: [
    { topic: "HTTP caching (Cache-Control, validation, freshness)", why: "Every framework cache sits on top of these rules. Knowing them lets you reason about CDNs and browsers.", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching" },
  ],
  seo: [
    { topic: "Structured data", why: "Beyond a good title, markup that describes what a page is (an event, a product) can make search results richer.", url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
  ],
  "js-main-thread": [
    { topic: "scheduler.yield()", why: "The purpose-built way to give the main thread back in the middle of a long job.", url: "https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield", caveat: "Not available in every browser (Safari), so keep a setTimeout fallback." },
    { topic: "useTransition", why: "React's way to mark an update as interruptible, so input keeps priority.", url: "https://react.dev/reference/react/useTransition" },
  ],
  "web-vitals": [
    { topic: "Chrome UX Report (CrUX)", why: "Field data from real Chrome users for your site, without adding any code.", url: "https://developer.chrome.com/docs/crux" },
    { topic: "Long Animation Frames API", why: "Shows which scripts caused a slow frame, so a poor INP can be traced to a cause.", url: "https://developer.chrome.com/docs/web-platform/long-animation-frames", caveat: "Browser support is limited, so check the page before depending on it." },
  ],
  "client-components": [
    { topic: "Lazy loading Client Components", why: "A boundary keeps server code out of the bundle. Lazy loading also keeps client code you don't need yet out of the first load.", url: "https://nextjs.org/docs/app/guides/lazy-loading" },
  ],
};
