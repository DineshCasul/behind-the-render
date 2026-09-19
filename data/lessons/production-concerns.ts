import type { Lesson } from "@/lib/types";

/** Lesson for the PRODUCTION CONCERNS stage: Caching. */
export const productionConcernsLessons: Lesson[] = [
  {
    id: "caching",
    whatIsThis:
      "**Caching** is ==storing the result of expensive work== (a rendered page, a database query, a computed value) so a future request for the same thing can reuse it instead of redoing the work, at layers ranging from the browser, to a CDN, to the server's own memory, to the database.",
    whyItExists:
      "Regenerating the same output over and over for identical requests wastes compute and adds latency for no benefit, caching exists to trade a small amount of staleness risk for a large amount of speed and reduced server load, whenever the same request would produce the same response.",
    howItWorks:
      "A request can be satisfied by any layer that already has a valid cached copy, checked roughly in order of proximity to the user: the browser's own HTTP cache (governed by `Cache-Control` headers), then a CDN edge cache (geographically close to the visitor), then the origin server's own cache (for example, a framework's cache of fetched data or of whole rendered pages), and only if none of those have it, the database itself. Each layer has its own invalidation rules, a `Cache-Control: max-age`, a CDN purge/tag invalidation, or a framework-level `revalidateTag`: and ==getting a fast response depends on hitting a cache as early (as close to the user) as possible==.",
    runtime: [
      { actor: "browser", label: "Check browser cache", detail: "If a valid cached response exists per Cache-Control headers, use it, no network request at all." },
      { actor: "network", label: "Request reaches CDN", detail: "If the browser cache misses, the request travels to the nearest CDN edge." },
      { actor: "server", label: "CDN cache check", detail: "If the CDN has a valid cached copy, it returns it directly, the origin server is never contacted." },
      { actor: "server", label: "Origin server cache check", detail: "On a CDN miss, the origin checks its own cache (e.g. a data cache) before doing real work." },
      { actor: "server", label: "Database (cache miss all the way through)", detail: "Only if every cache layer misses does the actual database/computation run." },
    ],
    serverVsBrowser: {
      server: ["Origin server, CDN edge, and database each maintain their own cache layer with independent invalidation"],
      network: ["A cache hit at any layer means the request travels a shorter distance, the fastest response is one that never reaches the origin at all"],
      browser: ["Maintains its own HTTP cache, checked before any network request is even made"],
      jsRequired: "No: caching is an HTTP/infrastructure-level concern that applies identically to JS-free static HTML and to a fully hydrated React app.",
      hydrationTiming: "Not directly related: caching affects *how a response was produced/retrieved*, not what happens to it once it reaches the browser. A cached SSR response still hydrates exactly like a freshly-rendered one.",
      withoutJs: "Fully unaffected: caching happens regardless of whether the eventual page uses any client-side JavaScript.",
    },
    reactNextConnection:
      "Next.js adds its own **server-side caching** on top of HTTP caching, and ==by default a `fetch` is not cached==: you opt in. Version 16 has two ways to do that. The earlier model caches individual requests (`fetch(url, { cache: 'force-cache' })`) or wraps other async work in `unstable_cache`. The newer **Cache Components** model (`cacheComponents: true` in the config) lets you mark a function or a whole component or page with the `use cache` directive. Either way, entries can be refreshed on demand with functions like `revalidateTag` and `revalidatePath`, the same on-demand idea ISR uses, because ISR *is* a form of caching applied to rendered page output.",
    whyUseIt: [
      "Dramatically reduces server load and response latency for repeat/identical requests",
      "Lets a CDN absorb traffic spikes without the origin server needing to scale to match",
      "Compounds with SSG/ISR: a statically generated page is, in a sense, a permanently cached render",
    ],
    tradeoffs: [
      { label: "Freshness vs speed", note: "Every cache is a bet that slightly-stale data is an acceptable price for speed, the right cache duration depends entirely on how often the underlying data actually changes and how much staleness the use case tolerates." },
      { label: "Invalidation complexity", note: "\"There are only two hard things in computer science: cache invalidation and naming things\" is a cliché for a reason, knowing exactly when to purge/revalidate each layer, correctly, is genuinely difficult to get right." },
      { label: "Debugging difficulty", note: "A bug that only reproduces \"in production, sometimes\" is a classic caching symptom, a stale cached response masking behavior that would look completely different on a fresh, uncached request." },
    ],
    misconceptions: [
      { claim: "If a page is slow in production but fast locally, caching probably isn't the cause.", reality: "It's one of the *first* things to suspect, locally there's usually no CDN/edge cache layer at all, so \"works fine locally\" and \"slow in prod\" is a very common caching-related symptom, not evidence against it." },
      { claim: "Caching is something you either 'have' or 'don't have'.", reality: "It's layered: a system can have a browser cache but no CDN cache, or a CDN cache but a cold origin data cache, \"is this cached\" is a question you have to ask per layer, not once for the whole system." },
    ],
    experiment: "cache-layers",
  },
];
