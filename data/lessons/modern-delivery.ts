import type { Lesson } from "@/lib/types";

/** Lesson for the MODERN DELIVERY stage: Streaming. */
export const modernDeliveryLessons: Lesson[] = [
  {
    id: "streaming",
    whatIsThis:
      "**Streaming** is ==sending a response to the browser in pieces, as each piece becomes ready==, instead of waiting for the entire response to finish before sending any of it.",
    whyItExists:
      "In a normal SSR response, the server can't send anything until the *slowest* piece of data the page needs has resolved, ==one slow database query blocks the entire page==, even the parts that had nothing to do with it. Streaming exists to decouple \"the whole page is ready\" from \"the browser can start showing something.\"",
    howItWorks:
      "The server sends HTTP response bytes in chunks over time rather than one complete write. For a page with a slow data-dependent section, the server can send the fast, ready parts of the HTML immediately, leave a placeholder (a loading state) where the slow part will go, and send the slow part's real markup in a later chunk once it resolves, the browser's HTML parser, being inherently incremental (see HTML Parsing), just keeps building the DOM as more chunks arrive, and can swap the placeholder for real content in place.",
    runtime: [
      { actor: "network", label: "Request", detail: "Browser requests the page." },
      { actor: "server", label: "Render fast parts", detail: "Server renders whatever doesn't depend on slow data immediately." },
      { actor: "network", label: "Send first chunk", detail: "Fast content + placeholders for slow sections go out right away." },
      { actor: "browser", label: "Parse + paint chunk 1", detail: "Visible content appears: including loading states for pending sections." },
      { actor: "server", label: "Resolve slow data", detail: "Server finishes the slow work (e.g. a slow query) in the background." },
      { actor: "network", label: "Send later chunk", detail: "Real markup for the previously-placeholder section streams in." },
      { actor: "browser", label: "Swap in place", detail: "Browser replaces the placeholder with real content, no full re-render of the page." },
    ],
    serverVsBrowser: {
      server: ["Renders and sends response chunks as each becomes ready, rather than buffering the entire response"],
      network: ["Delivers a single HTTP response, but as multiple chunks over time instead of one write"],
      browser: ["Incrementally parses and paints each chunk as it arrives, no special \"streaming mode\", this is the same incremental parser HTML Parsing describes"],
      jsRequired: "No, for the visible streaming effect itself, it's server + HTTP + the browser's ordinary incremental HTML parser. JS is still needed if the eventually-streamed-in content includes interactive Client Components that need hydrating.",
      hydrationTiming: "Each streamed-in chunk can be hydrated as it arrives and its JS is available, streaming and hydration can happen concurrently, chunk by chunk, rather than one all-at-once hydration pass.",
      withoutJs: "The streamed HTML still displays progressively and correctly, placeholders get swapped for real content by the server-driven stream regardless of JS. Only client-side interactivity within the streamed content requires JS, same as any other SSR content.",
    },
    reactNextConnection:
      "React's `renderToPipeableStream` (server) and `<Suspense>` (marking \"this part can stream in later\") are the actual mechanism, a component tree wrapped in `<Suspense fallback={...}>` tells React exactly where a streaming boundary goes. Next.js's App Router wires this up automatically per route: wrapping a slow, data-dependent section of a dynamically rendered route in `<Suspense>` is enough to get a streaming boundary, no manual pipe/stream code required. (A route that is fully prerendered at build time has nothing to stream at request time.)",
    whyUseIt: [
      "Lets fast content appear immediately even when one part of the page is slow, instead of the slowest part gating everything",
      "Improves perceived performance without necessarily reducing total server computation time, the *total* work is the same, but the user sees *something* sooner",
      "Avoids all-or-nothing loading spinners for pages with mixed-speed data sources",
    ],
    tradeoffs: [
      { label: "Layout shift risk", note: "Content swapping in after a placeholder can shift layout if the placeholder's size doesn't match the real content, reserving space for the expected content avoids this." },
      { label: "Ordering complexity", note: "Deciding which sections stream first (and design placeholders for each) is an explicit design decision per page, not something that happens automatically just by using SSR." },
      { label: "Infrastructure requirements", note: "Streaming requires a hosting/proxy setup that actually forwards chunked responses rather than buffering the whole thing, some serverless or proxy configurations buffer by default and silently defeat streaming's benefit." },
    ],
    misconceptions: [
      { claim: "Streaming means the browser receives one complete HTML document, just faster.", reality: "It receives genuinely separate chunks over time, arriving as multiple writes to the same HTTP response, the browser is rendering an incomplete document that later gets completed in place, not a fast-but-whole document." },
      { claim: "Streaming always reduces total load time.", reality: "It improves *when the user first sees something useful* (perceived performance): the slow query still takes exactly as long to finish; streaming just stops it from blocking everything else." },
    ],
    experiment: "streaming-chunks",
  },
];
