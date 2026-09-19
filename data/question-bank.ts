import type { ConceptId } from "@/lib/types";

/** Difficulty, easiest first. "tricky" questions look simple but have a catch. */
export type Level = "easy" | "medium" | "hard" | "tricky";

export const LEVELS: { id: Level; label: string; blurb: string }[] = [
  { id: "easy", label: "Easy", blurb: "Definitions you should be able to say out loud." },
  { id: "medium", label: "Medium", blurb: "How and why things work." },
  { id: "hard", label: "Hard", blurb: "Trade-offs and reasoning in real situations." },
  { id: "tricky", label: "Tricky", blurb: "Sounds right, but there is a catch." },
];

export interface BankQuestion {
  id: number;
  level: Level;
  concept: ConceptId;
  question: string;
  answer: string;
  /** 3 or 4 topic names to look up next: the ideas this question sits on top of. */
  related: string[];
  /** First-party sources that back the answer. Every URL was fetched and loads. */
  learnMore: { title: string; url: string }[];
}

export const questionBank: BankQuestion[] = [
  {
    "id": 1,
    "level": "easy",
    "concept": "http",
    "question": "What does a browser send and receive when you open a web page?",
    "answer": "It sends an HTTP request (a method such as GET, a path and headers) and receives a response (a status code, headers and usually a body). For a normal page, the body of that response is the HTML.",
    "related": [
      "HTTP methods",
      "Status codes",
      "Headers",
      "Request/response cycle"
    ],
    "learnMore": [
      {
        "title": "HTTP messages (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"
      },
      {
        "title": "Overview of HTTP (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
      }
    ]
  },
  {
    "id": 2,
    "level": "easy",
    "concept": "browser-rendering",
    "question": "What are the DOM and the CSSOM?",
    "answer": "The DOM is the browser's tree of elements, built from the HTML. The CSSOM is the equivalent tree built from the CSS rules. The browser combines them into a render tree of what will actually be drawn.",
    "related": [
      "Render tree",
      "HTML parsing",
      "CSS cascade",
      "Critical rendering path"
    ],
    "learnMore": [
      {
        "title": "Critical rendering path (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path"
      }
    ]
  },
  {
    "id": 3,
    "level": "easy",
    "concept": "browser-rendering",
    "question": "Roughly what steps happen between receiving HTML and seeing pixels?",
    "answer": "The browser parses the HTML and CSS, works out styles, calculates the layout (size and position of everything), paints the pixels and finally composites the painted layers into the picture on screen.",
    "related": [
      "Layout (reflow)",
      "Paint",
      "Compositing",
      "Critical rendering path"
    ],
    "learnMore": [
      {
        "title": "Critical rendering path (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path"
      },
      {
        "title": "Populating the page: how browsers work (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"
      }
    ]
  },
  {
    "id": 4,
    "level": "easy",
    "concept": "csr",
    "question": "What is client-side rendering, and what does the first HTML response look like?",
    "answer": "In CSR the browser builds the page by running JavaScript. The first HTML response is usually a nearly empty shell (a container element and script tags), and the content only appears after the JavaScript has downloaded and run.",
    "related": [
      "App shell",
      "JavaScript bundle",
      "First contentful paint",
      "SEO"
    ],
    "learnMore": [
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      }
    ]
  },
  {
    "id": 5,
    "level": "easy",
    "concept": "ssr",
    "question": "What is server-side rendering?",
    "answer": "The server runs the code that builds the UI for each request and sends back finished HTML, so the browser can show content before any JavaScript arrives.",
    "related": [
      "Time to first byte",
      "Hydration",
      "Server load",
      "Streaming"
    ],
    "learnMore": [
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      }
    ]
  },
  {
    "id": 6,
    "level": "easy",
    "concept": "ssg",
    "question": "What is static site generation, and when is the HTML produced?",
    "answer": "The HTML is produced once, at build time, and stored as files. Requests are then answered with those ready-made files, so no page is built per visitor.",
    "related": [
      "Build time",
      "CDN",
      "generateStaticParams",
      "Incremental regeneration"
    ],
    "learnMore": [
      {
        "title": "generateStaticParams (Next.js)",
        "url": "https://nextjs.org/docs/app/api-reference/functions/generate-static-params"
      },
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      }
    ]
  },
  {
    "id": 7,
    "level": "easy",
    "concept": "hydration",
    "question": "What is hydration?",
    "answer": "Hydration is React attaching event handlers and state to HTML that was already rendered on the server, so the page becomes interactive without being rebuilt from scratch.",
    "related": [
      "Event handlers",
      "Hydration mismatch",
      "Main thread",
      "Selective hydration"
    ],
    "learnMore": [
      {
        "title": "hydrateRoot (React)",
        "url": "https://react.dev/reference/react-dom/client/hydrateRoot"
      }
    ]
  },
  {
    "id": 8,
    "level": "easy",
    "concept": "web-vitals",
    "question": "Which three metrics make up the Core Web Vitals?",
    "answer": "Largest Contentful Paint (LCP, loading), Interaction to Next Paint (INP, responsiveness) and Cumulative Layout Shift (CLS, visual stability). INP replaced First Input Delay as the responsiveness metric.",
    "related": [
      "LCP",
      "INP",
      "CLS",
      "75th percentile"
    ],
    "learnMore": [
      {
        "title": "Web Vitals (web.dev)",
        "url": "https://web.dev/articles/vitals"
      }
    ]
  },
  {
    "id": 9,
    "level": "easy",
    "concept": "client-components",
    "question": "What does the \"use client\" directive do?",
    "answer": "It marks a module, and everything that module imports, as client code that ships to the browser. It is a boundary between server code and client code, not a label on a single component.",
    "related": [
      "Server/client boundary",
      "Bundle size",
      "Serialization",
      "Server Components"
    ],
    "learnMore": [
      {
        "title": "'use client' directive (React)",
        "url": "https://react.dev/reference/rsc/use-client"
      }
    ]
  },
  {
    "id": 10,
    "level": "easy",
    "concept": "server-components",
    "question": "Where do Server Components run, and is their code sent to the browser?",
    "answer": "They run on the server (at build time or per request). Their source code is not sent to the browser: only their rendered output is.",
    "related": [
      "RSC payload",
      "Zero client JavaScript",
      "Server-only code",
      "Data fetching"
    ],
    "learnMore": [
      {
        "title": "Server Components (React)",
        "url": "https://react.dev/reference/rsc/server-components"
      }
    ]
  },
  {
    "id": 11,
    "level": "medium",
    "concept": "html-parsing",
    "question": "What do the async and defer attributes on a script tag change?",
    "answer": "A normal script blocks HTML parsing while it downloads and runs. With defer, the script downloads in parallel and runs after the document is parsed, in order. With async, it downloads in parallel and runs as soon as it is ready, in no guaranteed order.",
    "related": [
      "Parser-blocking scripts",
      "Preload scanner",
      "DOMContentLoaded",
      "Render-blocking resources"
    ],
    "learnMore": [
      {
        "title": "The script element: async and defer (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script"
      }
    ]
  },
  {
    "id": 12,
    "level": "medium",
    "concept": "browser-rendering",
    "question": "Why is animating transform and opacity cheaper than animating width or top?",
    "answer": "Changing transform or opacity can be handled by the compositor without redoing layout or paint. Changing width or top forces the browser to recalculate layout, and usually repaint, on the main thread.",
    "related": [
      "Compositor thread",
      "Layout thrashing",
      "will-change",
      "60 fps rendering"
    ],
    "learnMore": [
      {
        "title": "Stick to compositor-only properties (web.dev)",
        "url": "https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count"
      }
    ]
  },
  {
    "id": 13,
    "level": "medium",
    "concept": "ssr",
    "question": "What is the practical difference between SSR and SSG?",
    "answer": "The moment the HTML is produced. SSG produces it once at build time and reuses it. SSR produces it for every request. So SSG is cheaper and faster to serve, and SSR can show data that is current at the moment of the request.",
    "related": [
      "Rendering strategies",
      "Time to first byte",
      "Build vs request time",
      "Data freshness"
    ],
    "learnMore": [
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      }
    ]
  },
  {
    "id": 14,
    "level": "medium",
    "concept": "isr",
    "question": "What does Incremental Static Regeneration do?",
    "answer": "It serves prebuilt static pages, but rebuilds them in the background after a time you set, or when you trigger it on demand. Visitors keep getting fast pages, and a newer version replaces the old one once it is ready.",
    "related": [
      "Revalidation",
      "On-demand revalidation",
      "Stale content",
      "CDN caching"
    ],
    "learnMore": [
      {
        "title": "Incremental Static Regeneration (Next.js)",
        "url": "https://nextjs.org/docs/app/guides/incremental-static-regeneration"
      }
    ]
  },
  {
    "id": 15,
    "level": "medium",
    "concept": "isr",
    "question": "What does stale-while-revalidate mean?",
    "answer": "A cache may answer immediately with a slightly old (stale) copy while it fetches a fresh one in the background for next time. The visitor gets speed now and freshness a moment later.",
    "related": [
      "Cache freshness",
      "Background revalidation",
      "CDN caching",
      "Perceived performance"
    ],
    "learnMore": [
      {
        "title": "Keeping things fresh with stale-while-revalidate (web.dev)",
        "url": "https://web.dev/articles/stale-while-revalidate"
      }
    ]
  },
  {
    "id": 16,
    "level": "medium",
    "concept": "hydration",
    "question": "Why can a server-rendered page look ready but ignore taps?",
    "answer": "The HTML is only a picture of the UI until the JavaScript has downloaded, run and attached the event handlers. Until hydration finishes there is nothing listening for the tap.",
    "related": [
      "Hydration",
      "Interaction to Next Paint",
      "Main thread",
      "JavaScript bundle size"
    ],
    "learnMore": [
      {
        "title": "hydrateRoot (React)",
        "url": "https://react.dev/reference/react-dom/client/hydrateRoot"
      }
    ]
  },
  {
    "id": 17,
    "level": "medium",
    "concept": "js-main-thread",
    "question": "What is a long task, and why does it matter?",
    "answer": "A long task is work that keeps the main thread busy for more than 50 milliseconds. While it runs, the browser can't respond to taps, clicks or scrolling, so the page feels frozen.",
    "related": [
      "Event loop",
      "INP",
      "scheduler.yield",
      "Web Workers"
    ],
    "learnMore": [
      {
        "title": "Optimize long tasks (web.dev)",
        "url": "https://web.dev/articles/optimize-long-tasks"
      }
    ]
  },
  {
    "id": 18,
    "level": "medium",
    "concept": "web-vitals",
    "question": "What is the difference between lab data and field data?",
    "answer": "Lab data comes from a controlled test on one device and network, which is good for debugging. Field data comes from real visitors on their own devices, which is what tells you what people actually experience. They often disagree.",
    "related": [
      "Lighthouse",
      "Chrome UX Report",
      "Real user monitoring",
      "Percentiles"
    ],
    "learnMore": [
      {
        "title": "Why lab and field data can be different (web.dev)",
        "url": "https://web.dev/articles/lab-and-field-data-differences"
      }
    ]
  },
  {
    "id": 19,
    "level": "medium",
    "concept": "seo",
    "question": "How does Google process a page that needs JavaScript to show its content?",
    "answer": "In three phases: crawling (fetching the HTML), rendering (running the JavaScript in a Chromium-based renderer) and indexing. Pages are queued for rendering, so content that only exists after JavaScript runs is seen later than content already in the HTML.",
    "related": [
      "Crawling and indexing",
      "Rendering queue",
      "Server-side rendering",
      "Crawl budget"
    ],
    "learnMore": [
      {
        "title": "Understand JavaScript SEO Basics (Google)",
        "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics"
      }
    ]
  },
  {
    "id": 20,
    "level": "medium",
    "concept": "client-components",
    "question": "What must props be when a Server Component passes them to a Client Component?",
    "answer": "Serializable: plain values such as strings, numbers, booleans, arrays and plain objects. Functions and class instances can't cross the boundary because they can't be turned into data for transfer.",
    "related": [
      "Serialization",
      "Server/client boundary",
      "Server Functions",
      "Composition (children)"
    ],
    "learnMore": [
      {
        "title": "'use client' directive (React)",
        "url": "https://react.dev/reference/rsc/use-client"
      }
    ]
  },
  {
    "id": 21,
    "level": "medium",
    "concept": "streaming",
    "question": "What is streaming, and how do Suspense boundaries relate to it?",
    "answer": "Streaming sends the parts of a page that are ready right away and the slower parts later, in the same response. A Suspense boundary marks a part that may be pending and shows a fallback until its content arrives.",
    "related": [
      "Suspense",
      "Progressive rendering",
      "Time to first byte",
      "loading.js"
    ],
    "learnMore": [
      {
        "title": "Streaming (Next.js)",
        "url": "https://nextjs.org/docs/app/guides/streaming"
      },
      {
        "title": "<Suspense> (React)",
        "url": "https://react.dev/reference/react/Suspense"
      }
    ]
  },
  {
    "id": 22,
    "level": "medium",
    "concept": "caching",
    "question": "What is the difference between max-age and s-maxage in Cache-Control?",
    "answer": "max-age sets how long a response counts as fresh for any cache, including the browser. s-maxage applies only to shared caches such as a CDN, and overrides max-age there.",
    "related": [
      "Cache-Control",
      "CDN caching",
      "Shared vs private caches",
      "Freshness lifetime"
    ],
    "learnMore": [
      {
        "title": "Cache-Control header (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control"
      }
    ]
  },
  {
    "id": 23,
    "level": "medium",
    "concept": "caching",
    "question": "In Next.js 16, is a fetch request cached by default?",
    "answer": "No. Caching is opt-in. Depending on the model you use, you turn it on with the use cache directive (Cache Components) or with options such as force-cache in the previous model.",
    "related": [
      "use cache directive",
      "Cache Components",
      "Revalidation",
      "Dynamic vs static rendering"
    ],
    "learnMore": [
      {
        "title": "Caching (Next.js)",
        "url": "https://nextjs.org/docs/app/getting-started/caching"
      }
    ]
  },
  {
    "id": 24,
    "level": "medium",
    "concept": "hydration",
    "question": "Why must the HTML from the server match what the client renders first?",
    "answer": "Hydration reuses the existing HTML instead of building it again. If the two differ (for example because of a date or a random number), React reports a hydration mismatch and may have to discard the server HTML and render again in the browser.",
    "related": [
      "Hydration mismatch",
      "Deterministic rendering",
      "useEffect",
      "Browser-only APIs"
    ],
    "learnMore": [
      {
        "title": "Text content does not match server-rendered HTML (Next.js)",
        "url": "https://nextjs.org/docs/messages/react-hydration-error"
      },
      {
        "title": "hydrateRoot (React)",
        "url": "https://react.dev/reference/react-dom/client/hydrateRoot"
      }
    ]
  },
  {
    "id": 25,
    "level": "medium",
    "concept": "http",
    "question": "What happens between typing a URL and seeing the page?",
    "answer": "The browser looks up the server's IP address (DNS), opens a connection (a TCP handshake, plus a TLS negotiation for HTTPS), sends an HTTP GET request and receives the HTML. It then parses the HTML, fetches the CSS, JavaScript and images it references, builds the DOM and CSSOM, and finally lays out, paints and composites the page.",
    "related": [
      "DNS",
      "TCP and TLS handshakes",
      "HTTP request/response",
      "Critical rendering path"
    ],
    "learnMore": [
      {
        "title": "Populating the page: how browsers work (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"
      },
      {
        "title": "Critical rendering path (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path"
      }
    ]
  },
  {
    "id": 26,
    "level": "medium",
    "concept": "csr",
    "question": "When is client-side rendering still a good choice?",
    "answer": "When the content doesn't need to be found by search engines or shown before JavaScript loads, and the app is highly interactive: dashboards behind a login, editors, internal tools. CSR is simple to host and to reason about. The costs are a slower first content and more JavaScript to download and run before the page is useful.",
    "related": [
      "SEO",
      "App shell",
      "Bundle size",
      "First contentful paint"
    ],
    "learnMore": [
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      },
      {
        "title": "Understand JavaScript SEO Basics (Google)",
        "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics"
      }
    ]
  },
  {
    "id": 27,
    "level": "hard",
    "concept": "web-vitals",
    "question": "A page moved from CSR to SSR. Which metrics would you expect to improve, and which could get worse?",
    "answer": "LCP usually improves because content is in the first response. Time to first byte can get worse because the server now does work before responding. INP can stay the same or get worse until hydration finishes, since the page looks ready before it can respond.",
    "related": [
      "TTFB",
      "LCP",
      "INP",
      "Hydration cost"
    ],
    "learnMore": [
      {
        "title": "Optimize Interaction to Next Paint (web.dev)",
        "url": "https://web.dev/articles/optimize-inp"
      },
      {
        "title": "Web Vitals (web.dev)",
        "url": "https://web.dev/articles/vitals"
      }
    ]
  },
  {
    "id": 28,
    "level": "hard",
    "concept": "client-components",
    "question": "Client Components are marked \"client\". Are they rendered on the server at all?",
    "answer": "Yes. On the first load they are pre-rendered to HTML on the server, then hydrated in the browser. \"Client\" describes where their code ships and keeps running, not the only place they render.",
    "related": [
      "Prerendering",
      "Hydration",
      "RSC payload",
      "Server/client boundary"
    ],
    "learnMore": [
      {
        "title": "Server and Client Components (Next.js)",
        "url": "https://nextjs.org/docs/app/getting-started/server-and-client-components"
      }
    ]
  },
  {
    "id": 29,
    "level": "hard",
    "concept": "client-components",
    "question": "Why is putting \"use client\" high in the component tree costly?",
    "answer": "The directive applies to the module and everything it imports, so the higher it sits the more code becomes client code. That code has to be downloaded and hydrated, which erases much of the benefit of Server Components. Push the boundary down to the interactive leaf instead.",
    "related": [
      "Bundle size",
      "Transitive imports",
      "Composition (children)",
      "Code splitting"
    ],
    "learnMore": [
      {
        "title": "'use client' directive (React)",
        "url": "https://react.dev/reference/rsc/use-client"
      }
    ]
  },
  {
    "id": 30,
    "level": "hard",
    "concept": "isr",
    "question": "You have 50,000 product pages whose data changes about once an hour. Which rendering approach would you weigh, and why?",
    "answer": "SSG alone means very long builds and hour-old pages until the next one. SSR builds every request, which costs server work at scale. ISR fits: serve prebuilt pages and revalidate them on a schedule (about hourly), or on demand when a product changes. The trade-off is that a visitor can see data up to the revalidation window old.",
    "related": [
      "Incremental Static Regeneration",
      "Build time",
      "On-demand revalidation",
      "Rendering strategies"
    ],
    "learnMore": [
      {
        "title": "Incremental Static Regeneration (Next.js)",
        "url": "https://nextjs.org/docs/app/guides/incremental-static-regeneration"
      },
      {
        "title": "Rendering on the Web (web.dev)",
        "url": "https://web.dev/articles/rendering-on-the-web"
      }
    ]
  },
  {
    "id": 31,
    "level": "hard",
    "concept": "react-rendering",
    "question": "What are React's render and commit phases?",
    "answer": "Render is React calling your components to work out what the UI should look like. Commit is React applying the resulting changes to the DOM. Rendering a component does not by itself mean the DOM changed.",
    "related": [
      "Reconciliation",
      "Virtual DOM",
      "Re-renders",
      "Strict Mode"
    ],
    "learnMore": [
      {
        "title": "Render and Commit (React)",
        "url": "https://react.dev/learn/render-and-commit"
      }
    ]
  },
  {
    "id": 32,
    "level": "hard",
    "concept": "react-rendering",
    "question": "Why do keys matter in a list?",
    "answer": "Keys tell React which item is which between renders. With stable keys, state and DOM stay attached to the right item when the list is reordered or filtered. With index keys or missing keys, state can end up attached to the wrong item.",
    "related": [
      "Reconciliation",
      "Component state",
      "List rendering",
      "Re-ordering"
    ],
    "learnMore": [
      {
        "title": "Rendering Lists (React)",
        "url": "https://react.dev/learn/rendering-lists"
      },
      {
        "title": "Preserving and Resetting State (React)",
        "url": "https://react.dev/learn/preserving-and-resetting-state"
      }
    ]
  },
  {
    "id": 33,
    "level": "hard",
    "concept": "hydration",
    "question": "Why is useSyncExternalStore a good fit for reading localStorage in a server-rendered app?",
    "answer": "It takes a separate getServerSnapshot, so the server render and the first client render use the same value and hydration matches. React then switches to the real stored value right after hydration, without a mismatch or a manual effect.",
    "related": [
      "Hydration",
      "External stores",
      "getServerSnapshot",
      "localStorage"
    ],
    "learnMore": [
      {
        "title": "useSyncExternalStore (React)",
        "url": "https://react.dev/reference/react/useSyncExternalStore"
      }
    ]
  },
  {
    "id": 34,
    "level": "hard",
    "concept": "seo",
    "question": "What does Google say about dynamic rendering (serving crawlers a pre-rendered version)?",
    "answer": "It describes it as a workaround, not a recommended solution, because it adds complexity and resource costs. Server-side rendering or pre-rendering is the better long-term approach.",
    "related": [
      "Server-side rendering",
      "Prerendering",
      "Cloaking risk",
      "Crawl budget"
    ],
    "learnMore": [
      {
        "title": "Dynamic Rendering as a workaround (Google)",
        "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering"
      }
    ]
  },
  {
    "id": 35,
    "level": "hard",
    "concept": "js-main-thread",
    "question": "How can you give the main thread back in the middle of a long job, and what is the browser-support caveat?",
    "answer": "Break the work into chunks and yield between them with scheduler.yield(), or move it to a Web Worker. scheduler.yield() is not available in every browser (notably Safari), so keep a setTimeout-based fallback.",
    "related": [
      "scheduler.yield",
      "Web Workers",
      "Long tasks",
      "Progressive enhancement"
    ],
    "learnMore": [
      {
        "title": "Optimize long tasks (web.dev)",
        "url": "https://web.dev/articles/optimize-long-tasks"
      },
      {
        "title": "Scheduler: yield() (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield"
      }
    ]
  },
  {
    "id": 36,
    "level": "hard",
    "concept": "server-components",
    "question": "SSR, Server Components, hydration and streaming are often mixed up. What does each one concern?",
    "answer": "SSR is about generating HTML on the server. Server Components are about where component code runs and how its output is sent. Hydration is about making server HTML interactive in the browser. Streaming is about delivering output progressively. They can be used together, but none implies the others.",
    "related": [
      "Server Components",
      "SSR",
      "Hydration",
      "Streaming"
    ],
    "learnMore": [
      {
        "title": "Server Components (React)",
        "url": "https://react.dev/reference/rsc/server-components"
      },
      {
        "title": "Server and Client Components (Next.js)",
        "url": "https://nextjs.org/docs/app/getting-started/server-and-client-components"
      }
    ]
  },
  {
    "id": 37,
    "level": "hard",
    "concept": "caching",
    "question": "Why can't a shared CDN cache safely hold a page that is personalized for one user?",
    "answer": "A shared cache serves the same stored copy to everyone who asks for that URL, so a personalized page could be shown to the wrong person. Personalized responses must be marked private or kept out of shared caches, and the shared part of the page separated from the personal part.",
    "related": [
      "Cache-Control: private",
      "Personalization",
      "Vary header",
      "Cache keys"
    ],
    "learnMore": [
      {
        "title": "Cache-Control header (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control"
      },
      {
        "title": "HTTP caching (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"
      }
    ]
  },
  {
    "id": 38,
    "level": "hard",
    "concept": "web-vitals",
    "question": "How would you improve a poor LCP on a server-rendered page?",
    "answer": "First find which part of LCP dominates: time to first byte, resource load delay, resource load duration or element render delay. Then target it: speed up the first byte (cache the page or serve it closer to the visitor), make sure the LCP resource is discoverable in the initial HTML and starts loading early (for example a preload with high fetch priority), reduce its size, and remove what blocks it from rendering.",
    "related": [
      "TTFB",
      "Preload and fetch priority",
      "Image optimization",
      "Render-blocking resources"
    ],
    "learnMore": [
      {
        "title": "Optimize Largest Contentful Paint (web.dev)",
        "url": "https://web.dev/articles/optimize-lcp"
      },
      {
        "title": "Web Vitals (web.dev)",
        "url": "https://web.dev/articles/vitals"
      }
    ]
  },
  {
    "id": 39,
    "level": "hard",
    "concept": "server-components",
    "question": "What is a request waterfall in data fetching, and how do you avoid it?",
    "answer": "A waterfall is when requests run one after another because each waits for the previous one, so every request adds a full round trip. In a component, two awaits in a row are sequential even if the requests are independent. Start independent requests together (for example with Promise.all), or preload data before blocking work.",
    "related": [
      "Promise.all",
      "Parallel data fetching",
      "Preloading data",
      "Suspense"
    ],
    "learnMore": [
      {
        "title": "Fetching Data (Next.js)",
        "url": "https://nextjs.org/docs/app/getting-started/fetching-data"
      }
    ]
  },
  {
    "id": 40,
    "level": "hard",
    "concept": "web-vitals",
    "question": "LCP is good but INP is poor. What do you suspect and what do you check?",
    "answer": "Content appears fast but interactions are slow, so suspect main-thread work: long tasks from heavy JavaScript, expensive event handlers, hydration still running, or slow rendering after the interaction. INP splits into input delay, processing duration and presentation delay, so record an interaction and see which part is largest.",
    "related": [
      "Long tasks",
      "Hydration cost",
      "Event handlers",
      "Input delay"
    ],
    "learnMore": [
      {
        "title": "Optimize Interaction to Next Paint (web.dev)",
        "url": "https://web.dev/articles/optimize-inp"
      },
      {
        "title": "Optimize long tasks (web.dev)",
        "url": "https://web.dev/articles/optimize-long-tasks"
      }
    ]
  },
  {
    "id": 41,
    "level": "tricky",
    "concept": "seo",
    "question": "True or false: Google can't index JavaScript sites.",
    "answer": "False. Google runs JavaScript with an up-to-date Chromium. But rendering is a separate, queued step after crawling, so content that needs JavaScript is seen later and less reliably than content already in the HTML. Not every crawler runs JavaScript at all.",
    "related": [
      "Rendering queue",
      "Server-side rendering",
      "Crawlers",
      "Dynamic rendering"
    ],
    "learnMore": [
      {
        "title": "Understand JavaScript SEO Basics (Google)",
        "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics"
      }
    ]
  },
  {
    "id": 42,
    "level": "tricky",
    "concept": "js-main-thread",
    "question": "True or false: async/await runs code in parallel.",
    "answer": "False. It doesn't create threads. await lets other tasks run while a promise is pending, but heavy synchronous work inside an async function still blocks the main thread.",
    "related": [
      "Event loop",
      "Promises",
      "Web Workers",
      "Blocking the main thread"
    ],
    "learnMore": [
      {
        "title": "JavaScript execution model (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model"
      }
    ]
  },
  {
    "id": 43,
    "level": "tricky",
    "concept": "web-vitals",
    "question": "True or false: a perfect Lighthouse score means real users have a fast experience.",
    "answer": "False. Lighthouse is a lab measurement on one simulated device. Real users on real devices and networks can have a very different experience, which only field data shows.",
    "related": [
      "Lab vs field data",
      "CrUX",
      "Real user monitoring",
      "Core Web Vitals"
    ],
    "learnMore": [
      {
        "title": "Why lab and field data can be different (web.dev)",
        "url": "https://web.dev/articles/lab-and-field-data-differences"
      }
    ]
  },
  {
    "id": 44,
    "level": "tricky",
    "concept": "ssr",
    "question": "True or false: with SSR, the page needs no JavaScript.",
    "answer": "False. SSR sends HTML with content, so the page can be read without JavaScript. But anything interactive needs JavaScript to hydrate it. A server-rendered page without JavaScript is readable, not interactive.",
    "related": [
      "Hydration",
      "Progressive enhancement",
      "Interactivity",
      "JavaScript bundle"
    ],
    "learnMore": [
      {
        "title": "hydrateRoot (React)",
        "url": "https://react.dev/reference/react-dom/client/hydrateRoot"
      }
    ]
  },
  {
    "id": 45,
    "level": "tricky",
    "concept": "server-components",
    "question": "True or false: Server Components are just SSR under a new name.",
    "answer": "False. SSR generates HTML on the server, and client components are server-rendered too. Server Components concern where component code runs and that its code never ships to the browser. They are separate ideas.",
    "related": [
      "SSR",
      "Server/client boundary",
      "RSC payload",
      "Zero client JavaScript"
    ],
    "learnMore": [
      {
        "title": "Server Components (React)",
        "url": "https://react.dev/reference/rsc/server-components"
      }
    ]
  },
  {
    "id": 46,
    "level": "tricky",
    "concept": "ssg",
    "question": "True or false: if every page is prebuilt, the site doesn't need a server.",
    "answer": "Partly true. Plain prebuilt files can be served by any static host or CDN. But features such as ISR revalidation, or a route that is not prebuilt, need a runtime that can rebuild or render pages.",
    "related": [
      "Static hosting",
      "ISR",
      "Serverless functions",
      "CDN"
    ],
    "learnMore": [
      {
        "title": "Incremental Static Regeneration (Next.js)",
        "url": "https://nextjs.org/docs/app/guides/incremental-static-regeneration"
      }
    ]
  },
  {
    "id": 47,
    "level": "tricky",
    "concept": "caching",
    "question": "A page is fast on your machine but slow in production. Is caching a likely cause?",
    "answer": "Yes, it is one of the first things to suspect. A local development setup usually has no CDN or shared cache layer at all, so \"fast locally\" says little about how caching behaves in production.",
    "related": [
      "CDN",
      "Cache layers",
      "Cache invalidation",
      "Environment parity"
    ],
    "learnMore": [
      {
        "title": "HTTP caching (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"
      }
    ]
  },
  {
    "id": 48,
    "level": "tricky",
    "concept": "client-components",
    "question": "True or false: Client Components only run in the browser.",
    "answer": "False. They are pre-rendered to HTML on the server for the first load and then hydrated. Only after that do they keep running in the browser.",
    "related": [
      "Prerendering",
      "Hydration",
      "Server/client boundary",
      "RSC payload"
    ],
    "learnMore": [
      {
        "title": "Server and Client Components (Next.js)",
        "url": "https://nextjs.org/docs/app/getting-started/server-and-client-components"
      }
    ]
  },
  {
    "id": 49,
    "level": "tricky",
    "concept": "web-vitals",
    "question": "True or false: INP is just FID renamed.",
    "answer": "False. INP replaced FID as a Core Web Vital, but it measures more: it observes interactions across the whole visit and includes the time until the next paint, while FID only measured the delay before the first interaction was handled.",
    "related": [
      "First Input Delay",
      "Interaction to Next Paint",
      "Responsiveness",
      "Core Web Vitals"
    ],
    "learnMore": [
      {
        "title": "Optimize Interaction to Next Paint (web.dev)",
        "url": "https://web.dev/articles/optimize-inp"
      },
      {
        "title": "Web Vitals (web.dev)",
        "url": "https://web.dev/articles/vitals"
      }
    ]
  },
  {
    "id": 50,
    "level": "tricky",
    "concept": "client-components",
    "question": "You get \"Functions cannot be passed directly to Client Components\". What is happening?",
    "answer": "A Server Component is passing a function as a prop across the server-client boundary. Props there must be serializable and functions are not. Move the logic into the Client Component, or use a Server Function where appropriate.",
    "related": [
      "Serialization",
      "Server Functions",
      "Server/client boundary",
      "Props"
    ],
    "learnMore": [
      {
        "title": "'use client' directive (React)",
        "url": "https://react.dev/reference/rsc/use-client"
      }
    ]
  },
  {
    "id": 51,
    "level": "tricky",
    "concept": "streaming",
    "question": "You wrap a slow part of the page in a Suspense boundary. Does the whole page finish loading sooner?",
    "answer": "Not necessarily. The slow data still takes as long as it takes. What changes is what the visitor can see meanwhile: the ready parts arrive first and a fallback shows for the slow part, so the page feels faster.",
    "related": [
      "Suspense",
      "Streaming",
      "Perceived performance",
      "loading.js"
    ],
    "learnMore": [
      {
        "title": "Streaming (Next.js)",
        "url": "https://nextjs.org/docs/app/guides/streaming"
      },
      {
        "title": "<Suspense> (React)",
        "url": "https://react.dev/reference/react/Suspense"
      }
    ]
  },
  {
    "id": 52,
    "level": "tricky",
    "concept": "caching",
    "question": "True or false: Cache-Control: no-cache means the response is never stored.",
    "answer": "False, and it is one of the most common caching mix-ups. no-cache allows a cache to store the response, but requires it to be validated with the origin server before each reuse. no-store is the directive that tells caches not to store the response at all.",
    "related": [
      "no-store",
      "Conditional requests (ETag)",
      "Shared vs private caches",
      "Revalidation"
    ],
    "learnMore": [
      {
        "title": "Cache-Control header (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control"
      }
    ]
  }
];
