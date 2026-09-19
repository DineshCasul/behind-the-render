import type { Lesson } from "@/lib/types";

/**
 * Lessons for the four concepts the story mode needed: SEO, JS & Main Thread,
 * Web Vitals and Client Components. They live together (not in the stage
 * files) because they were added as one batch; the concept data still says
 * which pipeline stage each belongs to.
 */
export const storyConceptLessons: Lesson[] = [
  {
    "id": "js-main-thread",
    "whatIsThis": "The browser runs your JavaScript, style calculation, layout and most painting on **one main thread**, ==one task at a time==. While a task is running, the browser can't respond to a click, a scroll or a keypress. Any task that takes longer than 50 milliseconds is called a **long task**.",
    "whyItExists": "A single thread keeps the page's model simple and safe: no two scripts can change the DOM at the same instant, so there are no locks and no races. That was fine when pages ran a little code. Today's apps ship a lot of JavaScript, and the cost of that design shows up as a performance problem: ==anything that runs for a long time blocks everything else==, including your taps.",
    "howItWorks": "JavaScript runs from the **event loop**. Tasks (a script, an event handler, a timer) wait in a queue; the main thread runs one to completion, may update the screen, then takes the next. Downloading a script costs little main-thread time, but parsing, compiling and running it does. Between tasks the browser gets a chance to handle input and paint, so the fix for long work is to ==split it up and give the thread back between the pieces==: with `scheduler.yield()` (Chromium and recent Firefox, not Safari, so keep a `setTimeout` fallback), or by moving the work to a Web Worker, which runs on another thread but can't touch the DOM.",
    "runtime": [
      {
        "actor": "browser",
        "label": "A task is queued",
        "detail": "A click, a timer or a script joins the task queue."
      },
      {
        "actor": "browser",
        "label": "The main thread runs it to completion",
        "detail": "Nothing else on the page can run until this task finishes."
      },
      {
        "actor": "browser",
        "label": "Input arrives during a long task",
        "detail": "A tap during a 300 ms task can't be handled yet: it waits in the queue."
      },
      {
        "actor": "browser",
        "label": "The task ends",
        "detail": "Now the browser handles the waiting tap and can paint the result."
      },
      {
        "actor": "browser",
        "label": "Yield between chunks",
        "detail": "Splitting the work lets the browser handle input between the pieces instead of only after all of it."
      }
    ],
    "serverVsBrowser": {
      "server": [
        "Nothing here: the main thread is a browser (client) constraint. Server code has its own concurrency model and never shares the visitor's main thread"
      ],
      "network": [
        "Delivers the JavaScript. A bigger bundle costs download time, and far more importantly, main-thread time to parse, compile and run on the visitor's device"
      ],
      "browser": [
        "One main thread for scripts, style, layout and paint (compositing can happen elsewhere)",
        "Web Workers add threads for computation, but with no DOM access"
      ],
      "jsRequired": "This lesson is about what JavaScript costs. With none of your own, there is no long script task, though the browser still uses the main thread for parsing and layout.",
      "hydrationTiming": "Hydration is a large chunk of main-thread work: React has to run your components and attach handlers before the page can respond. That is where a big bundle turns into a page that looks ready but doesn't react.",
      "withoutJs": "Rendering still uses the main thread, but there are no long script tasks, which is a big part of why plain HTML pages feel so responsive."
    },
    "reactNextConnection": "React renders on the main thread too, so a big render is a long task. React's **concurrent** features let it stay responsive: `useTransition` and `useDeferredValue` mark an update as ==interruptible, so a keypress can jump the queue==. The **React Compiler** (stable since version 1.0 in October 2025) memoizes for you and cuts unnecessary re-renders. Server Components help in a different way: work done on the server never lands on the visitor's main thread at all.",
    "whyUseIt": [
      "Explains why a page can look ready but ignore taps",
      "Gives you a concrete rule to aim for: keep every task under about 50 ms",
      "Shows why sending **less JavaScript** is a performance feature, not just a smaller download"
    ],
    "tradeoffs": [
      {
        "label": "Yielding adds overhead",
        "note": "Splitting work into pieces makes the total job slightly slower, in exchange for a page that stays responsive while it runs."
      },
      {
        "label": "Workers aren't free",
        "note": "A Web Worker keeps the main thread free, but data is copied between threads with `postMessage` and workers have no DOM access, so they suit computation, not UI updates."
      },
      {
        "label": "Fast devices hide the problem",
        "note": "A long task you can't see on a developer laptop can be several times longer on a mid-range phone, which is where most visitors are."
      }
    ],
    "misconceptions": [
      {
        "claim": "async/await runs code in parallel.",
        "reality": "It doesn't create threads. `await` lets *other* tasks run while a promise is pending, but ==CPU-heavy synchronous work inside an async function still blocks the main thread=="
      },
      {
        "claim": "If the JavaScript downloads quickly, it's cheap.",
        "reality": "Download time and main-thread time are different costs: a small download can still take a long time to parse, compile and run on a slow phone."
      }
    ]
  },
  {
    "id": "seo",
    "whatIsThis": "**SEO** (Search Engine Optimization) is making your pages easy for search engines to ==discover, render and understand==. A search engine visits your URLs with a **crawler**, reads what comes back, and decides what the page is about and whether to show it. For an engineer the important question is *what the crawler actually receives*: the HTML in the response, and whatever JavaScript it later manages to run.",
    "whyItExists": "A page nobody can find doesn't exist for most visitors. For public, content-driven pages (a product, an event, an article) search is one of the main ways people arrive. Crawlers aren't browsers: they fetch at enormous scale on a budget, so ==when your content shows up in the response affects whether and how quickly it's indexed==. That is why the choice between CSR, SSR and SSG is a business decision as well as a technical one.",
    "howItWorks": "Google processes a page in three phases: **crawling** (fetch the URL and parse the HTML), **rendering** (run the JavaScript in an up-to-date Chromium to see the final page) and **indexing**. Pages are queued for both crawling and rendering, so ==content that only exists after JavaScript runs has to wait for the rendering queue==. If the HTML in the response already contains the content (server-rendered or static), the crawler has it at the first step. Links must be real `<a href>` elements to be followed, status codes matter (a page that says \"not found\" but returns 200 confuses crawlers), and each page needs a unique title and description. Google itself notes that server-side or pre-rendering is still a great idea, partly because not all bots run JavaScript.",
    "runtime": [
      {
        "actor": "network",
        "label": "Crawler fetches the URL",
        "detail": "It usually sends no cookies and has no logged-in session."
      },
      {
        "actor": "server",
        "label": "Server responds with HTML",
        "detail": "A server-rendered or static page arrives with its content. A client-rendered one arrives as an empty shell."
      },
      {
        "actor": "browser",
        "label": "Crawler parses the HTML",
        "detail": "It reads the title, the text and the links, and queues newly found URLs."
      },
      {
        "actor": "browser",
        "label": "Page waits for rendering",
        "detail": "If the content needs JavaScript, the page joins a separate rendering queue and may wait."
      },
      {
        "actor": "browser",
        "label": "Rendering and indexing",
        "detail": "A headless Chromium runs the JavaScript, the final DOM is read, and the page is indexed."
      }
    ],
    "serverVsBrowser": {
      "server": [
        "Decides what HTML is in the response: full content or an empty shell",
        "Returns honest status codes (200, 301, 404)",
        "Serves the metadata: title, description, canonical URL, robots rules"
      ],
      "network": [
        "The crawler's request, often without cookies",
        "A crawl budget: only so many fetches per site, so slow responses cost you coverage"
      ],
      "browser": [
        "The crawler's rendering step (a headless Chromium at Google) runs your JavaScript later, separately from the first fetch",
        "Visitors' browsers have no effect on what gets indexed"
      ],
      "jsRequired": "Not for content that is already in the HTML. Google can run JavaScript, but that is a separate queued step, and not every crawler runs it at all.",
      "hydrationTiming": "Crawlers don't care about hydration: they read the HTML and, later, the rendered DOM. Whether buttons work has no effect on indexing.",
      "withoutJs": "A server-rendered or static page is fully readable. A client-rendered page shows a crawler only the app shell until (and unless) it gets rendered."
    },
    "reactNextConnection": "React doesn't decide SEO, your delivery strategy does. The Next.js App Router server-renders or statically generates pages by default, so ==content is in the initial HTML==, and it gives you the **Metadata API** (`metadata` and `generateMetadata`) for titles, descriptions, canonical and Open Graph tags, plus file conventions for `sitemap` and `robots`. A page that fetches all of its content in a client-side `useEffect` puts you back in the app-shell case.",
    "whyUseIt": [
      "Content is visible to crawlers on the **first fetch**, not after a queued render",
      "Faster pages help visitors and crawlers alike",
      "Controlled metadata gives you accurate titles and snippets in search results"
    ],
    "tradeoffs": [
      {
        "label": "Freshness versus cost",
        "note": "Server-rendering every request costs compute; static pages are cheap but only as fresh as the last build. SSR, SSG and ISR are three points on that line."
      },
      {
        "label": "Dynamic rendering is a workaround",
        "note": "Serving crawlers a different pre-rendered version than visitors get is documented by Google as a workaround, not a recommended solution: it adds complexity and resource cost."
      },
      {
        "label": "Not every page needs SEO",
        "note": "Pages behind a login (a dashboard) can't be indexed anyway. Effort spent on crawlability there buys nothing."
      }
    ],
    "misconceptions": [
      {
        "claim": "Google can't index JavaScript sites.",
        "reality": "Google renders JavaScript with an up-to-date Chromium, but ==rendering is a separate, queued step==, so content that needs it is seen later and less reliably than content already in the HTML."
      },
      {
        "claim": "You need SSR for good SEO.",
        "reality": "Server-rendered *or* statically generated HTML both put the content in the response. What matters is that the content is in the HTML the crawler fetches, not that a server rendered it on that request."
      }
    ]
  },
  {
    "id": "web-vitals",
    "whatIsThis": "**Web performance metrics** turn \"it feels fast\" into numbers you can measure and compare. The most important set is **Core Web Vitals**: ==LCP== (Largest Contentful Paint: when the main content appears), ==INP== (Interaction to Next Paint: how quickly the page responds to input) and ==CLS== (Cumulative Layout Shift: how much the layout jumps around).",
    "whyItExists": "Without shared definitions, \"fast\" means whatever the person speaking feels. Metrics give you a common language for trade-offs (does SSR help? does streaming?) and let you check the result on real devices. They exist as *several* numbers because no single one captures the experience: a page can show content instantly and still ignore your taps for two seconds.",
    "howItWorks": "Each metric measures a different moment. **LCP** is the render time of the largest image, text block or video in view, relative to when the visitor navigated. **INP** observes *all* interactions on a page (its predecessor, FID, only measured the first one) from input until the next paint. **CLS** adds up unexpected layout shifts. The recommended targets are an LCP within 2.5 seconds, an INP of 200 milliseconds or less and a CLS of 0.1 or less, measured at the **75th percentile** of page loads, split by mobile and desktop. Data comes in two kinds: ==**lab** data (a controlled run in DevTools or Lighthouse, good for debugging) and **field** data (real visitors, for example the Chrome UX Report, which is what actually counts)==.",
    "runtime": [
      {
        "actor": "server",
        "label": "Time to first byte (TTFB)",
        "detail": "The server, or a cache in front of it, starts sending the HTML. Everything else waits for this."
      },
      {
        "actor": "browser",
        "label": "First Contentful Paint (FCP)",
        "detail": "The first content appears. The recommended target is 1.8 seconds or less."
      },
      {
        "actor": "browser",
        "label": "Largest Contentful Paint (LCP)",
        "detail": "The largest image, text block or video in view is drawn. Target: 2.5 seconds or less."
      },
      {
        "actor": "react",
        "label": "A visitor taps (INP)",
        "detail": "Input, then your event handlers, then the next paint. Target: 200 ms or less."
      },
      {
        "actor": "browser",
        "label": "Content shifts (CLS)",
        "detail": "A late image or ad pushes text around. Target: a total of 0.1 or less."
      }
    ],
    "serverVsBrowser": {
      "server": [
        "Time to first byte: how quickly the server (or a cache in front of it) starts responding, which sets the floor for everything after it"
      ],
      "network": [
        "Distance, connection quality and payload size: how long the bytes take to arrive"
      ],
      "browser": [
        "Parsing, rendering and JavaScript execution: what determines LCP, INP and CLS, measured on the visitor's own device"
      ],
      "jsRequired": "Metrics exist for every page. How much JavaScript a page ships is one of the biggest influences on both LCP and INP.",
      "hydrationTiming": "Hydration runs on the main thread, so heavy hydration delays interactivity and can hurt INP even when the content looks ready.",
      "withoutJs": "LCP and CLS still exist, but INP barely does (there are almost no interactions), which is one reason static content pages tend to score well."
    },
    "reactNextConnection": "Next.js can hand you each metric from real visitors with the `useReportWebVitals` hook (from `next/web-vitals`, used in a Client Component), and the `web-vitals` library does the same anywhere. In React terms: ==Server Components and streaming mostly improve LCP and time to first byte==, less client JavaScript and cheaper hydration improve INP, and reserving space for images and loading states prevents layout shift.",
    "whyUseIt": [
      "Turns a vague feeling into a target you can regress against",
      "Lets you judge rendering strategies (SSR, SSG, streaming) by their effect on **real** visitors",
      "Exposes problems a single number would hide: slow loading, slow response and unstable layout are separate failures"
    ],
    "tradeoffs": [
      {
        "label": "Lab and field disagree",
        "note": "A controlled test uses one device and one network. Real visitors use thousands of combinations, so a good lab score can sit next to poor field data."
      },
      {
        "label": "Optimizing the metric, not the experience",
        "note": "A number can be improved in ways visitors don't feel (delaying the largest element, for instance). Treat the metrics as symptoms to investigate, not scores to game."
      },
      {
        "label": "The 75th percentile hides the tail",
        "note": "Passing at the 75th percentile still means a quarter of loads were slower than the target. Look at the distribution, not only the pass mark."
      }
    ],
    "misconceptions": [
      {
        "claim": "A perfect Lighthouse score means the site is fast for users.",
        "reality": "Lighthouse is a **lab** measurement on one simulated device. ==Field data from real visitors is what tells you whether people actually have a good experience==."
      },
      {
        "claim": "INP is just FID renamed.",
        "reality": "INP replaced FID as a Core Web Vital, but it measures more: it observes *all* interactions on a page and includes the time until the next paint, while FID only measured the delay before the first interaction was handled."
      }
    ]
  },
  {
    "id": "client-components",
    "whatIsThis": "A **Client Component** is a React component whose code ==is sent to the browser and can use state, effects and browser APIs==. In the App Router every component is a Server Component by default. You opt a file in with `\"use client\"` at the top, which marks that module **and everything it imports** as client code: a boundary between server and browser.",
    "whyItExists": "Some UI can't run on the server: a click handler, `useState`, `localStorage`, `window`. Once React had Server Components (code that stays on the server), it needed an explicit way to say \"this part has to run in the browser\". The boundary is that line. Drawing it deliberately keeps the interactive part small and everything else off the client bundle.",
    "howItWorks": "Client Components are still **rendered to HTML on the server** for the first load, then hydrated in the browser. The directive applies to the module *and its transitive imports*, so importing a large library into a Client Component ships that library to every visitor. Server Components can render Client Components and pass them props, but ==props crossing the boundary must be serializable== (strings, numbers, plain objects and similar), not functions or class instances. The way to keep the boundary small is to push it down the tree: make the interactive leaf (a button, a form) the Client Component and keep its parents on the server, passing server-rendered content through as `children`.",
    "runtime": [
      {
        "actor": "server",
        "label": "Server Components render",
        "detail": "The server runs the server part of the tree and leaves placeholders where Client Components go."
      },
      {
        "actor": "server",
        "label": "Client Components are pre-rendered",
        "detail": "Their first output is turned into HTML too, so the page arrives with content."
      },
      {
        "actor": "network",
        "label": "HTML and JavaScript are sent",
        "detail": "The HTML paints at once. The JavaScript for the Client Components downloads."
      },
      {
        "actor": "react",
        "label": "Client Components hydrate",
        "detail": "React attaches state and event handlers to the HTML that already exists."
      },
      {
        "actor": "browser",
        "label": "They keep running in the browser",
        "detail": "State updates and effects happen here, without asking the server."
      }
    ],
    "serverVsBrowser": {
      "server": [
        "Renders Server Components and pre-renders the first HTML of Client Components",
        "Sends a serialized description of the tree, with references to the client code"
      ],
      "network": [
        "Carries the JavaScript of every Client Component and everything it imports",
        "Server Component source never travels: only its output does"
      ],
      "browser": [
        "Hydrates Client Components, then runs their state, effects and event handlers",
        "Has access to `window`, `localStorage` and other browser APIs"
      ],
      "jsRequired": "The first HTML shows without JavaScript. Anything interactive in a Client Component needs its JavaScript to load and hydrate first.",
      "hydrationTiming": "Only Client Components hydrate. The more of your page you mark as client, the more there is to download and hydrate before the page responds.",
      "withoutJs": "The pre-rendered HTML of Client Components still displays, but nothing in them responds: no state, no handlers."
    },
    "reactNextConnection": "`\"use client\"` is part of React's Server Components model, and the Next.js App Router applies it by making **Server Components the default**, so you add the directive only where you need interactivity. Client Components and the server-rendered tree are used together to produce the first HTML. Tools like `next/dynamic` and `React.lazy` let you split a Client Component out of the main bundle so it loads only when needed.",
    "whyUseIt": [
      "Keeps interactivity (state, effects, browser APIs) where it has to be, and nothing more",
      "A small client boundary means **less JavaScript to download and hydrate**",
      "Makes it explicit which parts of the app run in the browser, which helps you reason about cost"
    ],
    "tradeoffs": [
      {
        "label": "The boundary spreads through imports",
        "note": "Everything a `\"use client\"` module imports also becomes client code, so one convenient import of a large library can quietly grow the bundle."
      },
      {
        "label": "Serializable props only",
        "note": "You can't pass a function from a Server Component to a Client Component as a prop. Data has to be plain, which shapes how you split components."
      },
      {
        "label": "More places to reason about",
        "note": "You now decide, per component, which side of the line it lives on. Drawing the line too high (a whole page marked client) throws away the benefit of Server Components."
      }
    ],
    "misconceptions": [
      {
        "claim": "Client Components only run in the browser.",
        "reality": "They are ==rendered to HTML on the server for the first load==, then hydrated. \"Client\" describes where they keep running and where their code ships, not where they render first."
      },
      {
        "claim": "Every component inside a Client Component must also say \"use client\".",
        "reality": "The directive marks the module and its imports as client code, so components it imports are client automatically. Components passed in as `children` from a Server Component can stay server components."
      }
    ]
  }
];
