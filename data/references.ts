import type { ConceptId } from "@/lib/types";

export type ReferenceKind = "docs" | "spec" | "deep-dive";

export interface Reference {
  /** A recognizable name for the page (close to its own title), so it can be searched for if the link ever breaks. */
  title: string;
  url: string;
  kind: ReferenceKind;
  /** Why this link is worth opening, in one sentence. */
  why: string;
}

/**
 * Every URL here was fetched and confirmed to load (following redirects,
 * using the final address) and its title read, on this date. Docs move
 * and change, especially framework docs, so this is a snapshot, not a
 * promise. Rule for editing: 2 to 4 links per concept, mostly first-party
 * sources (MDN, react.dev, nextjs.org, the specs), each with a reason.
 */
export const REFERENCES_CHECKED_ON = "2026-09-19";
export const REFERENCES_CHECKED_AGAINST = "Next.js 16.3.5 and React 19";

export const references: Record<ConceptId, Reference[]> = {
  http: [
    {
      title: "Overview of HTTP",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",
      kind: "docs",
      why: "The clearest walkthrough of the request/response model and the layers under it.",
    },
    {
      title: "HTTP messages",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages",
      kind: "docs",
      why: "The exact shape of a request and a response: start line, headers, body.",
    },
    {
      title: "RFC 9110: HTTP Semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
      kind: "spec",
      why: "The official definition. Go here when you need the precise rules for methods, status codes or headers.",
    },
  ],

  "browser-rendering": [
    {
      title: "Critical rendering path",
      url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path",
      kind: "docs",
      why: "The pipeline from bytes to pixels, step by step.",
    },
    {
      title: "Rendering performance",
      url: "https://web.dev/articles/rendering-performance",
      kind: "deep-dive",
      why: "How to reason about which frames are slow and why.",
    },
    {
      title: "Stick to Compositor-Only Properties and Manage Layer Count",
      url: "https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count",
      kind: "deep-dive",
      why: "Why transform and opacity are cheap to animate, from the Chrome team.",
    },
  ],

  "html-parsing": [
    {
      title: "Populating the page: how browsers work",
      url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work",
      kind: "docs",
      why: "How HTML becomes the DOM, including how scripts and styles interact with parsing.",
    },
    {
      title: "<script>: async and defer",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script",
      kind: "docs",
      why: "Exactly how each script attribute changes whether the parser has to wait.",
    },
    {
      title: "HTML Standard: Parsing HTML documents",
      url: "https://html.spec.whatwg.org/multipage/parsing.html",
      kind: "spec",
      why: "The official algorithm, including the error recovery every browser shares.",
    },
  ],

  csr: [
    {
      title: "Rendering on the Web",
      url: "https://web.dev/articles/rendering-on-the-web",
      kind: "deep-dive",
      why: "Compares client-side rendering, server rendering and static generation and their trade-offs.",
    },
    {
      title: "createRoot",
      url: "https://react.dev/reference/react-dom/client/createRoot",
      kind: "docs",
      why: "The React API that renders an app entirely in the browser.",
    },
  ],

  ssr: [
    {
      title: "Rendering on the Web",
      url: "https://web.dev/articles/rendering-on-the-web",
      kind: "deep-dive",
      why: "Where server rendering fits among the other strategies, and what it costs.",
    },
    {
      title: "renderToPipeableStream",
      url: "https://react.dev/reference/react-dom/server/renderToPipeableStream",
      kind: "docs",
      why: "The React API that renders a component tree to HTML on the server.",
    },
    {
      title: "Server and Client Components",
      url: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
      kind: "docs",
      why: "How Next.js decides what renders on the server and what runs in the browser.",
    },
  ],

  ssg: [
    {
      title: "generateStaticParams",
      url: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params",
      kind: "docs",
      why: "The Next.js function this very site uses to prebuild all its lesson pages.",
    },
    {
      title: "Rendering on the Web",
      url: "https://web.dev/articles/rendering-on-the-web",
      kind: "deep-dive",
      why: "Static rendering compared with the other options, including the build-time costs.",
    },
  ],

  isr: [
    {
      title: "ISR",
      url: "https://nextjs.org/docs/app/guides/incremental-static-regeneration",
      kind: "docs",
      why: "The official guide to incremental static regeneration in the App Router.",
    },
    {
      title: "revalidatePath",
      url: "https://nextjs.org/docs/app/api-reference/functions/revalidatePath",
      kind: "docs",
      why: "Refresh one page on demand, for example when a CMS says content changed.",
    },
    {
      title: "revalidateTag",
      url: "https://nextjs.org/docs/app/api-reference/functions/revalidateTag",
      kind: "docs",
      why: "Refresh everything that was tagged, rather than one path at a time.",
    },
    {
      title: "Keeping things fresh with stale-while-revalidate",
      url: "https://web.dev/articles/stale-while-revalidate",
      kind: "deep-dive",
      why: "The general caching idea ISR is built on, explained without any framework.",
    },
  ],

  "react-rendering": [
    {
      title: "Render and Commit",
      url: "https://react.dev/learn/render-and-commit",
      kind: "docs",
      why: "React's own explanation of what happens between a state change and the screen.",
    },
    {
      title: "Rendering Lists",
      url: "https://react.dev/learn/rendering-lists",
      kind: "docs",
      why: "Why keys exist and how React uses them to match items between renders.",
    },
    {
      title: "Preserving and Resetting State",
      url: "https://react.dev/learn/preserving-and-resetting-state",
      kind: "docs",
      why: "When React keeps a component's state across renders, and when it throws it away.",
    },
  ],

  hydration: [
    {
      title: "hydrateRoot",
      url: "https://react.dev/reference/react-dom/client/hydrateRoot",
      kind: "docs",
      why: "The React API that attaches to server-rendered HTML, including what counts as a mismatch.",
    },
    {
      title: "useSyncExternalStore",
      url: "https://react.dev/reference/react/useSyncExternalStore",
      kind: "docs",
      why: "The hook this site's progress store uses to avoid a hydration mismatch.",
    },
    {
      title: "Text content does not match server-rendered HTML",
      url: "https://nextjs.org/docs/messages/react-hydration-error",
      kind: "docs",
      why: "Next.js's guide to the common causes of a hydration error and how to fix them.",
    },
  ],

  "server-components": [
    {
      title: "Server Components",
      url: "https://react.dev/reference/rsc/server-components",
      kind: "docs",
      why: "React's own definition of what a Server Component is and can do.",
    },
    {
      title: "'use client' directive",
      url: "https://react.dev/reference/rsc/use-client",
      kind: "docs",
      why: "How the boundary between server and client code is drawn.",
    },
    {
      title: "Server and Client Components",
      url: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
      kind: "docs",
      why: "How the Next.js App Router applies this, and how to choose between the two.",
    },
  ],

  streaming: [
    {
      title: "<Suspense>",
      url: "https://react.dev/reference/react/Suspense",
      kind: "docs",
      why: "The React feature that marks where a page may show a placeholder and stream the rest in later.",
    },
    {
      title: "Streaming",
      url: "https://nextjs.org/docs/app/guides/streaming",
      kind: "docs",
      why: "How Next.js streams a page and how to structure it so the fast parts show first.",
    },
    {
      title: "loading.js",
      url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
      kind: "docs",
      why: "The file convention that gives a route an instant loading state while its data streams in.",
    },
    {
      title: "Transfer-Encoding header",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding",
      kind: "docs",
      why: "The HTTP mechanism that lets one response arrive in pieces.",
    },
  ],

  caching: [
    {
      title: "HTTP caching",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching",
      kind: "docs",
      why: "How browsers and shared caches decide what to keep and for how long.",
    },
    {
      title: "Prevent unnecessary network requests with the HTTP Cache",
      url: "https://web.dev/articles/http-cache",
      kind: "deep-dive",
      why: "A practical guide to choosing Cache-Control values for real assets.",
    },
    {
      title: "Caching (Next.js 16, Cache Components)",
      url: "https://nextjs.org/docs/app/getting-started/caching",
      kind: "docs",
      why: "The current Next.js caching model, using the use cache directive.",
    },
    {
      title: "Caching and Revalidating (Previous Model)",
      url: "https://nextjs.org/docs/app/guides/caching-without-cache-components",
      kind: "docs",
      why: "The model without Cache Components: opt-in fetch caching and unstable_cache. Next.js changed this in version 16, so both are linked.",
    },
  ],
  seo: [
    {
      title: "Understand JavaScript SEO Basics",
      url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      kind: "docs",
      why: "Google's own description of crawling, rendering and indexing, including why pre-rendering is still recommended.",
    },
    {
      title: "Dynamic Rendering as a workaround",
      url: "https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering",
      kind: "docs",
      why: "Why serving crawlers a separate version is described as a workaround, not a recommendation.",
    },
    {
      title: "Functions: generateMetadata",
      url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
      kind: "docs",
      why: "How Next.js sets titles, descriptions and canonical URLs per page.",
    },
    {
      title: "Metadata Files: sitemap.xml",
      url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap",
      kind: "docs",
      why: "Generating a sitemap so crawlers can discover every page.",
    },
  ],
  "js-main-thread": [
    {
      title: "JavaScript execution model",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model",
      kind: "docs",
      why: "MDN's explanation of the event loop and run-to-completion.",
    },
    {
      title: "Optimize long tasks",
      url: "https://web.dev/articles/optimize-long-tasks",
      kind: "docs",
      why: "Practical ways to break up long tasks, including yielding.",
    },
    {
      title: "Web Workers API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API",
      kind: "docs",
      why: "Running code on another thread, and what workers can't do.",
    },
    {
      title: "Long Animation Frames API",
      url: "https://developer.chrome.com/docs/web-platform/long-animation-frames",
      kind: "docs",
      why: "Attributing slow frames to the scripts that caused them.",
    },
  ],
  "web-vitals": [
    {
      title: "Web Vitals",
      url: "https://web.dev/articles/vitals",
      kind: "docs",
      why: "The definitions and recommended thresholds of Core Web Vitals.",
    },
    {
      title: "Optimize Interaction to Next Paint",
      url: "https://web.dev/articles/optimize-inp",
      kind: "docs",
      why: "How to find and fix slow interactions.",
    },
    {
      title: "Why lab and field data can be different",
      url: "https://web.dev/articles/lab-and-field-data-differences",
      kind: "docs",
      why: "Why a good lab score can sit next to poor real-user data.",
    },
    {
      title: "Functions: useReportWebVitals",
      url: "https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals",
      kind: "docs",
      why: "Reporting real-visitor metrics from a Next.js app.",
    },
  ],
  "client-components": [
    {
      title: "'use client' directive",
      url: "https://react.dev/reference/rsc/use-client",
      kind: "docs",
      why: "The official definition of the boundary and its serialization rules.",
    },
    {
      title: "Server and Client Components",
      url: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
      kind: "docs",
      why: "How Next.js splits work between server and client, and how first load and hydration fit in.",
    },
    {
      title: "Lazy Loading",
      url: "https://nextjs.org/docs/app/guides/lazy-loading",
      kind: "docs",
      why: "Loading a Client Component only when it's needed.",
    },
  ],
};
