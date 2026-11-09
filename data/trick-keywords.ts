/**
 * Search words for each trick, keyed by trick slug. They let the filter on /trick find a
 * concept by the name people actually use ("crdt", "cache stampede", "ssr") even when that
 * word is not in the trick's title or hook. These are search aids, not claims: they name the
 * technique and its common synonyms, and nothing here is shown on the page.
 */
export const trickKeywords: Record<string, string[]> = {
  "request-batching": ["waterfall", "batching", "dataloader", "graphql", "round trips", "network", "api calls", "parallel"],
  "field-data": ["lcp", "core web vitals", "cwv", "lighthouse", "rum", "real user monitoring", "percentile", "p75", "crux", "lab data", "performance"],
  "adaptive-bitrate": ["abr", "video", "streaming", "media capabilities", "rebuffer", "resolution", "dash", "player", "playback"],
  "canvas-rendering": ["canvas", "dom", "accessibility", "rendering", "screen reader", "hit testing", "requestanimationframe", "drawing"],
  webassembly: ["wasm", "c++", "asm.js", "load time", "binary", "compile", "native", "browser"],
  "server-rendering-service": ["ssr", "server side rendering", "hydration", "react", "html", "ttfb", "rendertostring", "first paint"],
  "service-worker-cache": ["pwa", "service worker", "offline", "cache api", "workbox", "install size", "progressive web app"],
  "atomic-css": ["css", "stylesheet", "atomic", "utility classes", "bundle size", "build time", "styles"],
  "loading-tiers": ["code splitting", "lazy loading", "javascript", "bundle", "priority", "preload", "idle", "performance budget", "defer"],
  "layered-cache": ["cache", "cdn", "varnish", "lru", "ram", "disk", "hit rate", "eviction", "edge", "memory"],
  "gradual-migration": ["migration", "refactor", "strangler fig", "jquery", "lint", "legacy", "rewrite", "deprecation", "ci"],
  "migrate-live": ["migration", "database", "double write", "dual write", "backfill", "dark reads", "shadow reads", "zero downtime", "cutover"],
  "hexagon-grid": ["h3", "geospatial", "maps", "grid", "nearest", "k-ring", "spatial index", "hexagon", "location"],
  "last-writer-wins": ["crdt", "multiplayer", "collaboration", "conflict resolution", "operational transform", "ot", "lww", "realtime", "sync", "websocket"],
  "fractional-indexing": ["ordering", "list", "reorder", "drag and drop", "crdt", "sort key", "collaboration", "layers"],
  "virtual-list": ["virtualization", "windowing", "react-window", "long list", "infinite scroll", "dom size", "performance", "find in page"],
  "local-first-navigation": ["indexeddb", "stale while revalidate", "swr", "optimistic", "cache", "instant navigation", "offline", "client cache"],
  "prefetch-before-click": ["prefetch", "preload", "hover", "navigation", "relay", "suspense", "routing", "code splitting", "round trips"],
  "request-coalescing": ["cache stampede", "thundering herd", "singleflight", "dogpile", "request collapse", "varnish", "dedupe", "deduplication"],
  "consistent-hashing": ["hash ring", "sharding", "load balancing", "distributed systems", "partitioning", "rebalancing", "modulo", "routing"],
  "cache-vs-gc": ["garbage collection", "gc", "go", "golang", "rust", "latency spikes", "p99", "memory", "lru", "pause"],
  "hot-partition": ["hot key", "hotspot", "cassandra", "scylladb", "sharding", "partitioning", "database", "skew", "partition key"],
  "partition-key": ["sharding", "postgres", "multi-tenant", "shard key", "partitioning", "logical shards", "database", "scaling", "workspace"],
  "idempotency-keys": ["idempotent", "idempotency", "retry", "retries", "exactly once", "payments", "backoff", "jitter", "thundering herd", "duplicate", "stripe"],
  "rate-limiting": ["rate limit", "rate limiter", "token bucket", "load shedding", "throttle", "throttling", "429", "503", "redis", "api", "abuse", "stripe"],
  "ngram-index": ["trigram", "ngram", "inverted index", "search", "full text search", "grep", "ripgrep", "elasticsearch", "posting list", "code search", "blackbird"],
  "ownership-reasons": ["reference counting", "refcount", "garbage collection", "cache eviction", "offline", "sqlite", "ownership", "lifecycle", "sync"],
};
