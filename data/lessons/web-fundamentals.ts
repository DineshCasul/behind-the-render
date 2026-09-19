import type { Lesson } from "@/lib/types";

/**
 * Lessons for the WEB FUNDAMENTALS stage: HTTP, Browser Rendering,
 * HTML Parsing. These three exist independently of any framework,
 * React/Next.js get one short "connection" paragraph each, not equal
 * billing with the general concept.
 */
export const webFundamentalsLessons: Lesson[] = [
  {
    id: "http",
    whatIsThis:
      "**HTTP** is the ==request/response protocol== a browser and a server speak to exchange resources. A request is a method (GET, POST, ...), a URL, headers, and optionally a body; a response is a status code, headers, and a body.",
    whyItExists:
      "Early networked systems needed a way for any client to fetch a linked document from any server without the two having agreed on anything in advance beyond the protocol itself. HTTP solved that by being simple, text-based, and **stateless**, ==a server doesn't need to remember anything about you between requests to answer the next one==.",
    howItWorks:
      "The browser resolves the URL's domain to an IP address (DNS), opens a TCP connection (and negotiates TLS if it's HTTPS), then sends a request line plus headers plus an optional body. The server reads that, runs whatever logic it needs to, and writes back a status line, headers, and a body. Modern HTTP/2 and HTTP/3 keep this same request/response shape but multiplex many requests over fewer underlying connections to avoid one slow request blocking others.",
    runtime: [
      { actor: "browser", label: "Resolve + connect", detail: "DNS lookup, then TCP (+TLS) handshake to the server's IP." },
      { actor: "network", label: "Send request", detail: "Method, URL, headers, optional body travel to the server." },
      { actor: "server", label: "Handle request", detail: "Server-side code runs, produces a status + headers + body." },
      { actor: "network", label: "Send response", detail: "Response bytes travel back to the browser." },
      { actor: "browser", label: "Receive response", detail: "Browser now has bytes to parse, see HTML Parsing." },
    ],
    serverVsBrowser: {
      server: ["Parses the incoming request", "Runs application logic", "Writes the response"],
      network: ["Carries request/response bytes", "Where latency and packet loss live"],
      browser: ["Initiates the request (navigation, fetch, asset load)", "Waits, then hands the response to the next stage (parsing)"],
      jsRequired: "No: HTTP predates JavaScript by years and underlies every request a browser makes, JS or not.",
      hydrationTiming: "Not applicable here: hydration is a later, React-specific concept that only matters once HTML has already arrived over HTTP.",
      withoutJs: "The entire request/response cycle already happens with zero JavaScript, that's exactly why a plain server-rendered HTML page works with JS disabled.",
    },
    reactNextConnection:
      "React itself has no opinion on HTTP, `fetch` (a browser/Node API) does the talking. Next.js extends `fetch` with automatic request deduplication and caching, and Server Actions are, underneath, just HTTP requests the framework wires up for you.",
    whyUseIt: [
      "A universal protocol every browser and server already implements, no custom transport needed",
      "Statelessness makes servers trivially easy to scale horizontally",
      "Headers give you caching, compression, and content negotiation for free",
    ],
    tradeoffs: [
      { label: "Statelessness", note: "Simplifies scaling, but pushes session/auth state out to cookies, tokens, or a database, the protocol remembers nothing between requests." },
      { label: "HTTP/1.1 vs HTTP/2 vs HTTP/3", note: "1.1 head-of-line-blocks per connection; 2 multiplexes streams over one TCP connection; 3 moves to QUIC/UDP to avoid TCP-level blocking entirely." },
    ],
    misconceptions: [
      { claim: "HTTPS is a different protocol from HTTP.", reality: "HTTPS is HTTP carried over a TLS-encrypted connection, identical request/response semantics, encrypted transport." },
      { claim: "A 200 status means the page rendered correctly.", reality: "200 only means the server successfully returned the body you asked for, that body could be an error page, an empty shell, or broken HTML." },
    ],
  },
  {
    id: "browser-rendering",
    whatIsThis:
      "**Browser rendering** is the ==pipeline that turns received bytes into pixels on screen==: parse HTML into a DOM, parse CSS into a CSSOM, combine them into a render tree, compute layout (geometry), then paint and composite layers to the screen.",
    whyItExists:
      "A browser has to go from \"here are some bytes\" to \"here's a picture\" for arbitrary, malformed-tolerant documents, incrementally, and fast enough to feel responsive. That requirement, incremental, fault-tolerant, and performant, is why the pipeline is staged rather than one monolithic step.",
    howItWorks:
      "As HTML bytes arrive, the browser tokenizes and parses them into the DOM (see HTML Parsing). In parallel, any CSS is parsed into the CSSOM. The two are combined into a render tree (DOM nodes that actually produce visual output, minus `display: none` nodes). Layout computes the exact position and size of every render tree node. Paint records the actual pixels for each layer. Compositing combines layers, accelerated by the GPU for properties like `transform` and `opacity`, ==which is why those two are the animation properties of choice==.",
    runtime: [
      { actor: "network", label: "Bytes arrive", detail: "HTML (and linked CSS/JS) stream in over the HTTP connection." },
      { actor: "browser", label: "Parse → DOM + CSSOM", detail: "HTML becomes the DOM tree; CSS becomes the CSSOM tree." },
      { actor: "browser", label: "Render tree", detail: "DOM + CSSOM combine into the tree of nodes that will actually be drawn." },
      { actor: "browser", label: "Layout", detail: "Every visible node gets an exact position and size." },
      { actor: "browser", label: "Paint + composite", detail: "Pixels are recorded per layer and composited to the screen, GPU-accelerated where possible." },
    ],
    serverVsBrowser: {
      server: ["Nothing: this entire pipeline runs in the browser, regardless of how the HTML was produced"],
      network: ["Delivers the HTML/CSS/JS bytes the pipeline consumes"],
      browser: ["Parsing, style computation, layout, paint, and compositing, all of it"],
      jsRequired: "No: this pipeline runs identically whether the HTML came from a static file, an SSR response, or client-rendered JS output. JS can *trigger* re-layout/re-paint by mutating the DOM, but the pipeline itself doesn't need JS to exist.",
      hydrationTiming: "Not applicable to this pipeline directly, hydration is a separate, later step that only concerns React specifically re-attaching behavior to already-rendered DOM nodes.",
      withoutJs: "Rendering still fully happens: a JS-free HTML+CSS page paints exactly the same way a JS-heavy one does, up through this pipeline. What's missing without JS is anything that would have mutated the DOM afterward.",
    },
    reactNextConnection:
      "React doesn't replace this pipeline, it's a layer above it. React produces DOM mutations (creating/updating/removing real elements); the browser's rendering pipeline turns whatever DOM currently exists into pixels, whether React put it there or not. What React optimizes is *how few, how targeted* those mutations are (see React Rendering).",
    whyUseIt: [
      "Understanding this pipeline explains why `transform`/`opacity` animations are cheap and `width`/`top`/box-shadow-size animations are expensive",
      "Explains why large DOM trees or deep CSS selectors slow down style/layout computation regardless of framework",
    ],
    tradeoffs: [
      { label: "Reflow cost", note: "Any layout-affecting change (size, position, adding/removing DOM nodes) can force layout recalculation for the affected subtree, potentially the whole page." },
      { label: "Compositor-only properties", note: "`transform` and `opacity` can skip layout and paint entirely, running purely on the GPU compositor, the reason performance guidance keeps pointing back to these two properties." },
    ],
    misconceptions: [
      { claim: "React re-rendering a component re-runs this whole pipeline.", reality: "A React re-render that produces no DOM changes triggers none of this, the pipeline only reacts to actual DOM/CSSOM mutations, not to React's internal re-render." },
      { claim: "\"Rendering\" always means this browser pipeline.", reality: "In a React/Next.js context, \"rendering\" usually means \"producing markup/output\" (on a server or in memory), a different, earlier meaning of the word than the browser's paint pipeline. This project is careful to distinguish the two." },
    ],
  },
  {
    id: "html-parsing",
    whatIsThis:
      "**HTML parsing** is the browser reading HTML bytes top-to-bottom and ==building the DOM tree from them==, following a formally specified error-recovery algorithm, even badly malformed HTML gets a deterministic DOM, per spec.",
    whyItExists:
      "Real-world HTML on the web is often invalid, unclosed tags, wrong nesting, stray characters. Early browsers each recovered from errors differently, so pages rendered inconsistently. The HTML5 parsing algorithm exists specifically to ==make error recovery identical across every conforming browser==.",
    howItWorks:
      "A tokenizer reads raw bytes/characters and emits tokens (start tag, end tag, text, comment...). A tree construction stage consumes those tokens using a formal state machine (with rules like \"a `<table>` can't directly contain a `<div>`; if it appears there, move it\") to build the DOM incrementally. Crucially, this happens *while bytes are still arriving*, ==the browser doesn't wait for the whole document before starting to build DOM nodes==, which is what makes progressive rendering (and streaming) possible at all.",
    runtime: [
      { actor: "network", label: "Bytes stream in", detail: "HTML arrives in chunks, not all at once." },
      { actor: "browser", label: "Tokenize", detail: "Raw characters become tokens: tags, text, comments." },
      { actor: "browser", label: "Tree construction", detail: "Tokens build the DOM incrementally, per the HTML5 spec's error-recovery rules." },
      { actor: "browser", label: "Incremental rendering", detail: "The browser can render the DOM built so far before parsing finishes, a normal page (not just a 'streaming' one) already does this." },
    ],
    serverVsBrowser: {
      server: ["Nothing: parsing is purely a browser (client) responsibility, no matter where the HTML string was produced"],
      network: ["Delivers HTML in chunks, which is exactly what lets parsing start before the full response has arrived"],
      browser: ["Tokenizing and tree construction, incrementally, as bytes arrive"],
      jsRequired: "No: parsing HTML into a DOM has nothing to do with JavaScript. `<script>` tags parsed inline can pause the parser to fetch/execute JS (unless `async`/`defer`), which is a parsing *interaction* with JS, not a dependency on it.",
      hydrationTiming: "Not applicable directly: but this is the step that produces the DOM hydration will later attach to, which is exactly why a hydration mismatch is detected by diffing against what the parser actually built.",
      withoutJs: "Parsing completes fully and produces the same DOM whether or not JS ever runs afterward.",
    },
    reactNextConnection:
      "SSR/SSG output is, at the end of the day, just HTML text that goes through this exact same parser, there's no special \"React mode\" in the browser. Streaming SSR (Next.js's `<Suspense>` boundaries) works *because* this parser was always incremental; streaming didn't invent that capability, it exploited an existing one.",
    whyUseIt: [
      "Explains why placing `<script>` tags matters for perceived load time (a parser-blocking script delays everything after it)",
      "Explains why a server can flush HTML in chunks and have the browser usefully render each chunk as it lands",
    ],
    tradeoffs: [
      { label: "Parser-blocking scripts", note: "A synchronous `<script>` with no `async`/`defer` halts tree construction until it's fetched and run, `defer`/`async`/module scripts exist specifically to avoid this." },
      { label: "Malformed HTML", note: "The spec's error recovery guarantees consistency, not correctness, invalid nesting still often produces a DOM structure you didn't intend, even though it's now at least predictable." },
    ],
    misconceptions: [
      { claim: "The browser waits for the full HTML document before building any DOM.", reality: "It builds incrementally as bytes arrive, this is precisely the mechanism streaming SSR relies on, not a separate feature." },
      { claim: "Invalid HTML just fails to render.", reality: "The HTML5 parsing algorithm defines deterministic recovery for almost all malformed input, it renders *something* predictable, just maybe not what you intended." },
    ],
  },
];
