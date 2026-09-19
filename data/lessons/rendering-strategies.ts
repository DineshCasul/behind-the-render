import type { Lesson } from "@/lib/types";

/**
 * Lessons for the RENDERING STRATEGIES stage: CSR, SSR, SSG, ISR. These
 * are decisions about *when and where HTML gets generated*, a concept
 * that predates React and applies to any framework. React/Next.js get a
 * dedicated paragraph each showing how they implement the idea, never
 * standing in for the idea itself.
 */
export const renderingStrategiesLessons: Lesson[] = [
  {
    id: "csr",
    whatIsThis:
      "**Client-Side Rendering**: the server sends a ==mostly-empty HTML shell==, and ==JavaScript running in the browser builds the actual UI== by writing to the DOM after the page loads.",
    whyItExists:
      "Once JavaScript could manipulate the DOM richly (and frameworks made that tractable), building highly interactive, app-like UIs entirely in the browser became attractive, the server just needed to hand out static assets and a data API, which simplified the server side enormously and made client apps feel more like native apps (no full page reloads between views).",
    howItWorks:
      "The server responds to the initial request with a near-empty HTML document (often just a `<div id=\"root\">` and script tags). The browser parses that shell, then downloads and executes the JavaScript bundle, which runs a framework's render function to construct the actual UI and inject it into the DOM. Any data the UI needs is typically fetched separately, after the JS has started running.",
    runtime: [
      { actor: "network", label: "Request", detail: "Browser requests the page.", userSees: { text: "Nothing yet. The browser is waiting for a response.", visible: false, interactive: false } },
      { actor: "server", label: "Return shell", detail: "Server returns near-empty HTML + script tags, no real content yet.", userSees: { text: "Still blank. The HTML shell has no real content in it.", visible: false, interactive: false } },
      { actor: "browser", label: "Parse shell", detail: "Browser renders the empty shell (often a blank page or a spinner).", userSees: { text: "A blank page (or a spinner). The shell is on screen but empty.", visible: false, interactive: false } },
      { actor: "network", label: "Download JS", detail: "Browser fetches the JavaScript bundle.", userSees: { text: "Still blank. The JavaScript bundle is downloading.", visible: false, interactive: false } },
      { actor: "react", label: "Render in browser", detail: "React runs entirely client-side and builds the DOM from scratch.", userSees: { text: "The content appears for the first time.", visible: true, interactive: false } },
      { actor: "browser", label: "Interactive UI", detail: "Once React has rendered, the page is both visible and interactive at the same moment.", userSees: { text: "Content is visible and clickable.", visible: true, interactive: true } },
    ],
    serverVsBrowser: {
      server: ["Serves static assets and (usually) a JSON API: no HTML generation for the actual content"],
      network: ["Carries the shell, then a separate JS bundle download, then data fetches, several round trips before content appears"],
      browser: ["Runs the entire rendering process: builds the DOM from JS, fetches data, paints the real UI"],
      jsRequired: "Yes, entirely: without JavaScript, the user sees the empty shell and nothing else.",
      hydrationTiming: "There's no hydration step in pure CSR, there's no server-rendered HTML to reconcile with, so React just renders from scratch directly into the empty container.",
      withoutJs: "The page is blank (or shows only whatever static fallback markup exists in the shell), CSR has no meaningful no-JS experience by construction.",
    },
    reactNextConnection:
      "Classic Create React App-style apps are the canonical CSR example: `ReactDOM.createRoot(...).render(<App />)` runs entirely in the browser. In Next.js, any component marked `\"use client\"` with no server-rendered HTML ancestor for its content (or a page fully opted out of SSR) behaves this way, Next.js doesn't forbid CSR, it just makes it an explicit choice rather than the only option.",
    whyUseIt: [
      "Simplest server infrastructure: a CDN for static files plus an API is enough",
      "Feels native for highly interactive, state-heavy apps (dashboards, editors) where most content requires a logged-in user anyway (so SEO of that content doesn't matter)",
      "No per-request server rendering cost, since the server does none",
    ],
    tradeoffs: [
      { label: "Time to first content", note: "Nothing meaningful appears until JS downloads, parses, executes, and fetches data, often the slowest path to \"something on screen\" of any strategy." },
      { label: "SEO", note: "Search crawlers that don't execute JS (or execute it with limits) may index an empty shell, a real concern for public, content-driven pages, much less so for behind-login apps." },
      { label: "Client JS cost", note: "All rendering logic ships to and runs on every visitor's device, including low-power ones." },
    ],
    misconceptions: [
      { claim: "CSR means the app has no server at all.", reality: "It still needs a server (or CDN) to serve the shell/JS/assets and usually a data API, \"client-side rendering\" describes where the *UI* is built, not whether a server exists." },
      { claim: "CSR is always the wrong choice now that SSR/SSG exist.", reality: "For apps where content is entirely personalized/behind auth and SEO doesn't apply, CSR's simpler infrastructure and lower server cost are genuine advantages, not just legacy baggage." },
    ],
    experiment: "csr-timeline",
  },
  {
    id: "ssr",
    whatIsThis:
      "**Server-Side Rendering**: the server runs the UI-generating code for *this specific request* and ==sends back a complete HTML document==, rather than a shell for the browser to fill in.",
    whyItExists:
      "CSR's biggest weaknesses: slow time-to-first-content and poor crawler visibility, motivated generating real markup on the server, per request, so the browser has something meaningful to paint immediately, before any JavaScript has even downloaded.",
    howItWorks:
      "On each request, the server runs the rendering logic (in a React context: calls the component tree's render functions on the server, via something like `renderToString`/`renderToPipeableStream`) using data available at request time, and sends the resulting HTML as the response body. The browser can parse and paint that HTML immediately. If the page also needs interactivity, the same JavaScript that would render the UI is *also* sent, so React can hydrate the existing HTML afterward.",
    runtime: [
      { actor: "network", label: "Request", detail: "Browser requests the page.", userSees: { text: "Nothing yet. The browser is waiting for a response.", visible: false, interactive: false } },
      { actor: "server", label: "Render on server", detail: "Server runs the render logic for this request, producing full HTML.", userSees: { text: "Nothing yet. The server is busy building the HTML.", visible: false, interactive: false } },
      { actor: "network", label: "Return HTML", detail: "Complete, content-filled HTML is sent back.", userSees: { text: "Nothing yet. The finished HTML is on its way.", visible: false, interactive: false } },
      { actor: "browser", label: "Parse + paint", detail: "Browser renders real content immediately, no JS required to see it.", userSees: { text: "The real content is visible, but buttons don't respond yet.", visible: true, interactive: false } },
      { actor: "react", label: "Hydrate", detail: "If the page ships JS, React attaches behavior to the existing HTML (see Hydration) rather than re-rendering it.", userSees: { text: "Content is visible. React is still attaching click handlers.", visible: true, interactive: false } },
      { actor: "browser", label: "Interactive UI", detail: "Page becomes interactive once hydration completes.", userSees: { text: "Content is visible and clickable.", visible: true, interactive: true } },
    ],
    serverVsBrowser: {
      server: ["Runs the render logic per request, using request-time data", "Produces the full HTML response"],
      network: ["Delivers complete HTML first; JS for hydration (if any) can arrive separately"],
      browser: ["Parses and paints the HTML immediately", "Later hydrates it, if JS is present, to add interactivity"],
      jsRequired: "No, to *see* content: the HTML is complete on arrival. Yes, if you want the page to become interactive (hydration needs JS).",
      hydrationTiming: "After the HTML has already been parsed and painted, hydration is a distinct, later step, not part of SSR itself (see Hydration for exactly what changes).",
      withoutJs: "The page displays fully and correctly, links, forms (via native submission), and any server-rendered content work. Anything requiring client-side interactivity (a counter, a modal toggle) simply won't respond to clicks.",
    },
    reactNextConnection:
      "React's `renderToString`/`renderToPipeableStream` APIs are what actually generate the HTML on the server. Next.js's App Router renders Server Components (and any Client Components in the tree) to HTML on the server by default for every route unless you explicitly opt into static generation or client-only rendering, SSR is Next.js's default posture, not a special mode you turn on.",
    whyUseIt: [
      "Fast, meaningful first paint: content is visible before any JS runs",
      "Crawlers see fully-formed HTML, no JS execution required for indexing",
      "Can personalize per-request (logged-in state, geolocation) while still sending real HTML",
    ],
    tradeoffs: [
      { label: "Server cost", note: "Every request re-runs render logic on the server, more CPU/memory per visitor than serving a pre-built static file." },
      { label: "Time to first byte", note: "The server can't respond until rendering finishes (or starts streaming): a slow data dependency in the render path delays the *entire* response, not just one component." },
      { label: "Interactivity delay", note: "The page looks ready before hydration completes, clicking too early can feel unresponsive (the classic 'why isn't this button working' complaint), see Hydration." },
    ],
    misconceptions: [
      { claim: "SSR automatically makes a page faster.", reality: "SSR improves **time to first content**, but ==if the server is slow (slow data fetch, cold start, overloaded), SSR can be slower overall than serving a cached static file==. \"Faster\" depends on which metric and which bottleneck." },
      { claim: "SSR means the whole page is always dynamic.", reality: "SSR just means rendering happens per-request, it says nothing about whether the underlying data actually changes between requests. That's what SSG/ISR optimize for when it doesn't." },
    ],
    experiment: "ssr-timeline",
  },
  {
    id: "ssg",
    whatIsThis:
      "**Static Site Generation**: the HTML for a page is ==rendered once, at build time==, and the resulting file is served identically to every visitor until the next build.",
    whyItExists:
      "For content that doesn't change per-request (marketing pages, blog posts, docs), re-running SSR's render logic on every single visit is wasted work, the output would be identical every time. SSG does that work exactly once and reuses the result indefinitely.",
    howItWorks:
      "During the build process, the framework runs the render logic for every known page/route ahead of time (often iterating over a known list of pages, e.g. via `generateStaticParams`) and writes each result to a static HTML file. In production, a web server or CDN just serves those pre-built files directly, no render logic runs per request at all.",
    runtime: [
      { actor: "server", label: "Build time: render once", detail: "For every known route, render logic runs once, producing a static HTML file." },
      { actor: "network", label: "Deploy", detail: "Static files are deployed, typically to a CDN close to users." },
      { actor: "network", label: "Request (any time later)", detail: "A visitor requests the page, potentially days after the build ran." },
      { actor: "server", label: "Serve pre-built file", detail: "No rendering happens now: the already-built HTML file is returned as-is." },
      { actor: "browser", label: "Parse + paint", detail: "Browser renders the (already old, unchanged) HTML immediately." },
    ],
    serverVsBrowser: {
      server: ["Renders once, at build time, not per request", "At request time, just serves a static file"],
      network: ["Static files are ideal CDN content, cacheable at the edge, close to every visitor"],
      browser: ["Parses and paints the pre-built HTML", "Hydrates afterward if the page ships JS for interactivity"],
      jsRequired: "No, to see content: it's fully-formed static HTML. JS is still needed for any client-side interactivity, same as SSR.",
      hydrationTiming: "Identical to SSR's hydration timing, the only difference SSG makes is *when* the HTML was generated (build time vs request time), not what happens to it in the browser.",
      withoutJs: "Full content displays correctly: SSG output is just HTML, indistinguishable from SSR output once it reaches the browser.",
    },
    reactNextConnection:
      "In Next.js's App Router, a route is statically generated by default when it has no dynamic, per-request data dependency, `generateStaticParams` tells Next.js the full set of param values to pre-render (e.g. every blog post slug) at build time. This project's own `/learn/[slug]` lesson pages are generated exactly this way, see learning-notes for the specific implementation.",
    whyUseIt: [
      "Zero per-request server cost: you're serving a file, not running code",
      "Extremely cacheable at the CDN edge, often the fastest possible time-to-first-byte",
      "Build-time rendering can catch certain errors before any user ever sees them",
    ],
    tradeoffs: [
      { label: "Freshness", note: "Content is only as current as the last build, a typo fix or price change requires a full rebuild+redeploy to appear (unless paired with ISR)." },
      { label: "Build time", note: "Sites with many pages (tens of thousands) can have long, costly builds if every page must be pre-rendered up front." },
      { label: "Per-user personalization", note: "A statically generated page can't embed request-specific data (like \"logged in as X\") directly in the HTML, that has to be layered on client-side after the fact." },
    ],
    misconceptions: [
      { claim: "SSG means the site can't have any dynamic behavior.", reality: "The *HTML* is static, but client-side JS can still fetch fresh data, handle forms, and be fully interactive after load, SSG is about how the initial markup was produced, not a ban on dynamism." },
      { claim: "SSG and \"a static site\" (plain HTML files with no framework) are the same thing.", reality: "SSG usually still ships a full framework and hydrates into a fully interactive React app, the generation method is static, but the runtime is not necessarily simple." },
    ],
  },
  {
    id: "isr",
    whatIsThis:
      "**Incremental Static Regeneration**: pages are served as static files (like SSG), but ==the framework can quietly re-render and swap in a fresh version in the background==, on a schedule or on demand, without a full site rebuild.",
    whyItExists:
      "SSG's freshness problem: needing a full rebuild for any content change, doesn't scale to sites with thousands of pages that each change occasionally (e-commerce inventory, news). ISR gets SSG's serving speed while letting individual pages refresh independently.",
    howItWorks:
      "A page is generated statically, same as SSG, but tagged with a revalidation window (e.g. \"stale after 60 seconds\") or an on-demand trigger. When a request arrives for a stale page, ==the *previously built* static version is still served immediately (so the visitor never waits)==, while the framework regenerates that one page's HTML in the background. Once regeneration finishes, subsequent requests get the fresh version, this pattern is often called stale-while-revalidate.",
    runtime: [
      { actor: "server", label: "Initial build", detail: "Page is generated statically, like SSG, with a revalidation window set." },
      { actor: "network", label: "Request (within window)", detail: "Visitor gets the existing static file instantly, no regeneration triggered." },
      { actor: "network", label: "Request (after window expires)", detail: "Visitor still gets the existing (now 'stale') file instantly..." },
      { actor: "server", label: "Background regeneration", detail: "...while the server regenerates that page's HTML in the background, not blocking the response." },
      { actor: "server", label: "Swap", detail: "The freshly regenerated file replaces the old one for all future requests." },
    ],
    serverVsBrowser: {
      server: ["Regenerates individual pages in the background on a schedule or trigger", "Still serves pre-built static files for the actual response"],
      network: ["Same as SSG for any given request, the visitor is never blocked on regeneration"],
      browser: ["Parses and paints whichever version (possibly momentarily stale) it received, identical to SSG/SSR from the browser's point of view"],
      jsRequired: "No, to see content: same as SSG/SSR, it's fully-formed HTML on arrival.",
      hydrationTiming: "Identical to SSR/SSG: ISR only changes *when a page's HTML gets regenerated on the server*, nothing about what happens in the browser.",
      withoutJs: "Full content displays correctly, same as SSG/SSR, the visitor simply might be looking at a version up to `revalidate` seconds old.",
    },
    reactNextConnection:
      "Next.js implements this via a `revalidate` option (time-based) or `revalidatePath`/`revalidateTag` (on-demand, e.g. triggered from a CMS webhook after content changes). There's no equivalent concept in vanilla React, ISR is a Next.js (framework/infrastructure) feature layered on top of the general static-then-refresh idea, not something React itself provides.",
    whyUseIt: [
      "Combines SSG's serving speed with content freshness, without full rebuilds",
      "Scales to large sites (product catalogs, article archives) where rebuilding everything per change is impractical",
      "On-demand revalidation lets a CMS push \"this changed, refresh it\" without waiting for a schedule",
    ],
    tradeoffs: [
      { label: "Momentary staleness", note: "Some visitors will see slightly outdated content within the revalidation window, a real tradeoff for pages where every visitor must see the exact latest data (use SSR instead there)." },
      { label: "Regeneration cost concentration", note: "If many pages go stale simultaneously (e.g. all at midnight), regeneration load spikes, timing/staggering revalidation windows matters at scale." },
      { label: "Infrastructure dependency", note: "ISR requires a hosting platform that supports it (persistent, addressable page cache with background regeneration), it doesn't work the same way on a plain static file host." },
    ],
    misconceptions: [
      { claim: "ISR means the page re-renders on every single request.", reality: "The opposite: it renders as rarely as possible, only when the revalidation window has passed or an on-demand trigger fires, and even then only in the background while stale content keeps serving." },
      { claim: "ISR is just SSR with caching.", reality: "SSR-with-caching would still risk a slow/failed render blocking a request when the cache misses. ISR's defining trait is that a visitor is *never* blocked waiting for regeneration, they always get an immediate response, stale or fresh." },
    ],
  },
];
