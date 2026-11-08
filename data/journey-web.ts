import type { Alternative, JourneyChapter, Quiz } from "@/data/journey";

/**
 * The basics: one click, followed from the request to the cache. Eight sections, each
 * with a concrete example. Shown as one readable page at /basics (app/basics/page.tsx),
 * not as a company walk.
 *
 * Sources are MDN, web.dev, React and Next.js (all first-party for what they describe).
 * Every `docs` quote is copied word for word from its page (npm run verify:quotes).
 *
 * The HTTP examples marked "real" were captured with curl on 8 November 2026 from the
 * sites named in each note, then trimmed to the headers that matter. A server may send
 * different headers today. Examples marked "illustrative" are written for this page.
 * No em dashes in narration; quotes keep the dashes of their source.
 */

// ---- Sources ----

const MDN_MESSAGES = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages";
const MDN_CRP = "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path";
const MDN_SCRIPT = "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script";
const MDN_CACHING = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching";
const MDN_CACHE_CONTROL = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control";
const WEBDEV_RENDERING = "https://web.dev/articles/rendering-on-the-web";
const REACT_HYDRATE = "https://react.dev/reference/react-dom/client/hydrateRoot";
const NEXT_ISR = "https://nextjs.org/docs/app/guides/incremental-static-regeneration";

const NOTE_HTTP = "MDN's guides to HTTP. They describe the protocol, not any one site.";
const NOTE_WEBDEV = "web.dev's article on rendering approaches, last updated January 2026. It describes trade-offs, not a ranking.";
const NOTE_NEXT = "Next.js's own guide to ISR. It describes Next.js, not every framework.";

const SVELTEKIT: Alternative = {
  name: "SvelteKit",
  why: "Pick prerender, SSR or client rendering page by page, and mix them across one app.",
  href: "https://svelte.dev/docs/kit/page-options",
};
const HTMX: Alternative = {
  name: "htmx",
  why: "On the server you typically respond with HTML, not JSON, and skip most of the client framework.",
  href: "https://htmx.org/docs/",
};

// ---- Chapters ----

export const webRequest: JourneyChapter = {
  id: "web-request",
  title: "The Request",
  note: NOTE_HTTP,
  lines: [
    "You click a link. Your browser sends a message to a server. That message is a request, and the server's answer is a response.",
    "Both have the same shape: a start line, some headers, an empty line, and sometimes a body. In HTTP/1.1 it is plain text, which is why you can read it.",
    "A request's start line says what you want: a method, a target and a protocol version. GET means: send me this resource.",
    "A response's start line says what happened: a protocol version, a status code and a reason phrase. 200 is success, 404 is not found, 302 is a redirect.",
    "The headers are metadata. A response says what it is (Content-Type) and how it may be cached (Cache-Control). Remember that second one. The last four sections are about it.",
    "The example below is a real response, captured with curl.",
  ],
  example: {
    title: "A request, and the response it got",
    code: `GET /en-US/ HTTP/1.1
Host: developer.mozilla.org
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 121727
Cache-Control: public, max-age=3600
ETag: "3b051d96cd8f7ee12110e82a83735516"
Last-Modified: Sun, 08 Nov 2026 01:01:05 GMT
Vary: Accept-Encoding
Age: 3155`,
    note: "The response headers are real: captured with curl -I from developer.mozilla.org on 8 November 2026 and trimmed to the ones that matter (curl -I sends a HEAD request, so no body came back). The request is simplified: a browser sends many more headers.",
  },
  docs: [
    { text: "HTTP messages are the mechanism used to exchange data between a server and a client in the HTTP protocol.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "There are two types of messages: requests sent by the client to trigger an action on the server, and responses, the answer that the server sends in response to a request.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "In HTTP protocol versions up to HTTP/2, messages are text-based, and are relatively straightforward to read and understand after you've familiarized yourself with the format.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "A start-line is a single line that describes the HTTP version along with the request method or the outcome of the request.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "For example, GET indicates that the client would like to receive a resource in return, and POST means that the client is sending data to a server.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "A numeric status code that indicates whether the request succeeded or failed.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "Common status codes are 200, 404, or 302.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
    { text: "You can see HTTP messages in a browser's Network tab in the developer tools, or if you print HTTP messages to the console using CLI tools such as curl, for example.", source: "MDN: HTTP messages", href: MDN_MESSAGES },
  ],
};

export const webPath: JourneyChapter = {
  id: "web-path",
  title: "From Bytes to Pixels",
  note: "MDN's pages on the critical rendering path and on the script element.",
  lines: [
    "The response arrives, and it is HTML. The browser starts parsing it, turning the bytes into a tree: the DOM.",
    "That is incremental. The browser does not wait for the whole page before it starts building.",
    "Whenever it meets a link to a stylesheet, script or image, it makes a request. Some requests are blocking: parsing of the rest of the HTML halts until that asset is handled.",
    "CSS gets stricter treatment. It is render blocking: the browser will not render the page until it has processed all the CSS, because later rules can overwrite earlier ones.",
    "With the DOM and the CSSOM done, the browser builds the render tree, which only holds visible content. An element with display: none, and everything inside it, is left out.",
    "Then layout works out the size and position of everything, and paint puts the pixels on the screen.",
    "Layout is not a one-off. Add nodes, change content or change a box model style, and layout happens again.",
    "The example below marks which lines of a tiny page do what.",
  ],
  example: {
    title: "A tiny page, annotated",
    code: `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="build.css">   <!-- render blocking: no painting until the CSS is processed -->
    <script src="app.js"></script>             <!-- blocking: parsing of the rest of the HTML waits for this -->
    <script src="stats.js" async></script>     <!-- async: fetched in parallel, runs as soon as it is available -->
    <script src="menu.js" defer></script>      <!-- defer: runs after the document has been parsed -->
  </head>
  <body>
    <h1>Hello</h1>                             <!-- in the DOM, and in the render tree -->
    <p style="display: none">Hidden</p>        <!-- in the DOM, not in the render tree -->
  </body>
</html>`,
    note: "Illustrative: a made-up page. Each comment restates what the MDN pages quoted below say. async and defer both avoid parser-blocking JavaScript; they differ in when the script runs.",
  },
  docs: [
    { text: "The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "The browser then begins parsing the HTML, converting the received bytes to the DOM tree.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "DOM construction is incremental.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "Some requests are blocking, which means the parsing of the rest of the HTML is halted until the imported asset is handled.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "CSS is render blocking: the browser blocks page rendering until it receives and processes all the CSS.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "CSS is render blocking because rules can be overwritten, so the content can't be rendered until the CSSOM is complete.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "The render tree only captures visible content.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "If there's a display: none; set on an element, neither it, nor any of its descendants, are in the render tree.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "Any time the render tree is modified, such as by added nodes, altered content, or updated box model styles on a node, layout occurs.", source: "MDN: Critical rendering path", href: MDN_CRP },
    { text: "This attribute allows the elimination of parser-blocking JavaScript where the browser would have to load and evaluate scripts before continuing to parse.", source: "MDN: <script>", href: MDN_SCRIPT },
    { text: "For classic scripts, if the async attribute is present, then the classic script will be fetched in parallel to parsing and evaluated as soon as it is available.", source: "MDN: <script>", href: MDN_SCRIPT },
    { text: "This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing DOMContentLoaded event.", source: "MDN: <script>", href: MDN_SCRIPT },
  ],
};

export const webFork: JourneyChapter = {
  id: "web-fork",
  title: "The Fork",
  note: `${NOTE_WEBDEV} ${NOTE_NEXT}`,
  predict: {
    question: "What is the main cost web.dev names for server-side rendering?",
    options: [
      "Generating pages on the server takes time, which can increase TTFB",
      "It cannot send any JavaScript to the browser",
      "It needs a separate HTML file for every possible URL",
    ],
    answer: 0,
    reveal: "Generating pages on the server takes time, which can increase the page's TTFB. The file-per-URL cost belongs to static rendering.",
  },
  lines: [
    "Now a question older than React: who wrote this HTML?",
    "Client-side rendering: the browser builds the page itself, with JavaScript. All logic, data fetching, templating and routing happen on the client.",
    "Server-side rendering: the server generates the full HTML in response to the navigation. The price is time. Generating pages on the server can increase your page's TTFB.",
    "Static rendering: the HTML is made at build time, usually one file per URL. TTFB is consistently fast. The price is that you need a file for every possible URL, which gets hard for sites with a huge number of unique pages.",
    "You do not have to pick one for the whole site. Netflix, for example, server-renders its relatively static landing pages while prefetching the JavaScript for interaction-heavy pages.",
    "Next.js adds a fourth option, Incremental Static Regeneration. After the time you set has passed, the next visitor still gets the cached, stale page immediately, while Next.js generates a fresh one in the background.",
    "Each option moves the work somewhere else and sends you the bill. The example below shows what actually lands in the browser for the first three.",
  ],
  example: {
    title: "What the browser receives",
    code: `<!-- Client-side rendering: a shell. Nothing to read until app.js has run. -->
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>

<!-- Server-side rendering: finished HTML, built on the server for this request. -->
<body>
  <div id="root">
    <h1>Your orders</h1>
    <ul><li>Order #1042</li></ul>
  </div>
  <script src="/app.js"></script>
</body>

<!-- Static rendering: finished HTML too, but built once at build time and served as a file. -->
<body>
  <h1>About us</h1>
  <p>We make things.</p>
</body>`,
    note: "Illustrative: made-up pages that show the shape of each approach. In practice a server-rendered page also carries the data and scripts it needs to come alive in the browser, which is section 4.",
  },
  docs: [
    { text: "Client-side rendering means rendering pages directly in the browser with JavaScript.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "All logic, data fetching, templating, and routing are handled on the client instead of on the server.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "Server-side rendering generates the full HTML for a page on the server in response to navigation.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "generating pages on the server takes time, which can increase your page's TTFB.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "Static rendering happens at build time.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "Generally, static rendering means producing a separate HTML file for each URL ahead of time.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "One of the downsides to static rendering is that it must generate individual HTML files for every possible URL.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "Netflix server-renders its relatively static landing pages, while prefetching the JavaScript for interaction-heavy pages…", source: "web.dev: Rendering on the Web (about Netflix)", href: WEBDEV_RENDERING },
    { text: "After an hour has passed, the next visitor will still receive the cached (stale) version of the page immediately for a fast response. Simultaneously, Next.js triggers regeneration of a fresh version in the background.", source: "Next.js: Incremental Static Regeneration", href: NEXT_ISR },
  ],
  alternatives: [SVELTEKIT, HTMX],
};

export const webHandover: JourneyChapter = {
  id: "web-handover",
  title: "Looks Ready, Is Not",
  note: NOTE_WEBDEV,
  predict: {
    question: "A server-rendered React page shows a button. You click it before the page's JavaScript has finished loading. What happens?",
    options: [
      "It works: the server handles the click",
      "Nothing: no click handler is attached yet",
      "The browser reloads the page",
    ],
    answer: 1,
    reveal: "Nothing yet. web.dev: such pages can appear to be loaded and interactive, but can't respond to input until the client-side scripts have run and event handlers are attached.",
  },
  lines: [
    "Server rendering has a catch. The HTML arrives and looks like a page. Buttons are drawn. Nothing is wired to them yet.",
    "Hydration is the fix. It runs client-side scripts to add application state and interactivity to the server-rendered HTML.",
    "In React's words: attach to the HTML that exists, and take over managing the DOM inside it.",
    "Until that finishes, web.dev warns, a page can look loaded and interactive but cannot actually respond to input until the scripts have run and the event handlers are attached.",
    "It can also mean doing the work twice. Most server-rendering solutions serialize the data the UI needs as script tags in the document, so the page carries its HTML and its data.",
    "Streaming softens it: server-side rendering can send HTML in chunks that the browser renders as they arrive.",
  ],
  example: {
    title: "Before and after hydration",
    code: `<!-- 1. From the server: a real button, drawn on screen. No handler is attached to it. -->
<div id="root"><button>Like (3)</button></div>
<script src="/client.js"></script>

// 2. client.js, once it has loaded and run: attach to the HTML that is already there
import { hydrateRoot } from "react-dom/client";
hydrateRoot(document.getElementById("root"), <App />);

// Between 1 and 2 the button looks ready and does nothing.
// After 2, React manages the DOM inside #root and the click works.`,
    note: "Illustrative sketch of the sequence the quotes below describe. hydrateRoot is React's API for attaching to server-rendered HTML.",
  },
  docs: [
    { text: "Running client-side scripts to add application state and interactivity to server-rendered HTML.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "React will attach to the HTML that exists inside the domNode, and take over managing the DOM inside it.", source: "React: hydrateRoot", href: REACT_HYDRATE },
    { text: "Server-side rendered pages can appear to be loaded and interactive, but can't actually respond to input until the client-side scripts for components are executed and event handlers have been attached.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "most server-side rendering solutions serialize the response from a UI's data dependencies as script tags in the document.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
    { text: "Streaming server-side rendering lets you send HTML in chunks that the browser can progressively render as it's received.", source: "web.dev: Rendering on the Web", href: WEBDEV_RENDERING },
  ],
};

export const webMemory: JourneyChapter = {
  id: "web-memory",
  title: "The Memory",
  note: NOTE_HTTP,
  predict: {
    question: "A cache holds a stale copy and asks the server whether it has changed. The server says it has not. What does it send back?",
    options: ["200 OK with the whole page again", "304 Not Modified, with no body", "204 No Content"],
    answer: 1,
    reveal: "304 Not Modified. There is no body, just a status code, so the transfer is tiny, and the stored copy becomes fresh again.",
  },
  lines: [
    "A thousand people ask for the same page. Do the work a thousand times and your server dies screaming.",
    "A reusable response saves the server from parsing and routing the request, restoring the session from the cookie, querying the database, and rendering the template. All of that, skipped.",
    "A stored response is either fresh or stale, decided by its age: the time since it was generated. Cache-Control: max-age=3600 means fresh for an hour.",
    "In the example: the response says max-age=3600, and the shared cache in front of it says Age: 3155. So it stays fresh for 3600 minus 3155, which is 445 more seconds.",
    "When it goes stale, a cache does not throw it away. It asks the server whether it changed. That is validation.",
    "The cache sends the ETag it stored back as If-None-Match. If the ETag still matches, the server answers 304 Not Modified, with no body. The stored copy is fresh again.",
    "The example shows a real 304. One honest note: I sent the conditional request while the copy was still fresh, to capture it. A browser normally only asks once a copy is stale, or when you reload.",
  ],
  example: {
    title: "Fresh, stale, and the 304",
    code: `# 1. The response from section 1
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600
ETag: "3b051d96cd8f7ee12110e82a83735516"
Age: 3155
#   fresh for 3600 - 3155 = 445 more seconds

# 2. When stale, the cache asks instead of downloading again
GET /en-US/ HTTP/1.1
Host: developer.mozilla.org
If-None-Match: "3b051d96cd8f7ee12110e82a83735516"

# 3. The server's answer (real). No body, just a status.
HTTP/1.1 304 Not Modified
Cache-Control: public, max-age=3600
ETag: "3b051d96cd8f7ee12110e82a83735516"
Age: 3155`,
    note: "Steps 1 and 3 are real headers, captured with curl on 8 November 2026 from developer.mozilla.org and trimmed. The request in step 2 is the simplified form of what a cache sends, here sent while the copy was still fresh.",
  },
  docs: [
    { text: "The HTTP cache stores a response associated with a request and reuses the stored response for subsequent requests.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Also, when a response is reusable, the origin server does not need to process the request — so it does not need to parse and route the request, restore the session based on the cookie, query the DB for results, or render the template engine.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Stored HTTP responses have two states: fresh and stale.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "In HTTP, age is the time elapsed since the response was generated.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "The client which receives that response will find it to be fresh for the remaining 518400 seconds, the difference between the response's max-age and Age.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Stale responses are not immediately discarded. HTTP has a mechanism to transform a stale response into a fresh one by asking the origin server.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "The server will return 304 Not Modified if the value of the ETag header it determines for the requested resource is the same as the If-None-Match value in the request.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Since this response only indicates \"no change\", there is no response body — there's just a status code — so the transfer size is extremely small.", source: "MDN: HTTP caching", href: MDN_CACHING },
  ],
};

export const webFingerprints: JourneyChapter = {
  id: "web-fingerprints",
  title: "One Year, Safely",
  note: NOTE_HTTP,
  predict: {
    question: "What does Cache-Control: no-cache mean?",
    options: [
      "Never store this response",
      "Store it, but check with the server before each reuse",
      "Store it for one year",
    ],
    answer: 1,
    reveal: "Store it, but validate before each reuse. The name misleads. If you mean \"do not store\", that is no-store.",
  },
  lines: [
    "The best things to cache are files that never change. The trouble: bundle.js does change, and if the versions of the JavaScript and CSS a client uses are out of sync, the display breaks.",
    "The fix is to change the URL every time the content changes. A cache tells resources apart by URL, so a new URL is a new resource.",
    "Put a version or a hash in the file name, and the file can be cached for a long time.",
    "The example has a real one. MDN's own stylesheet has a hash in its name and a max-age of 31536000 seconds. That is 365 days.",
    "The HTML that points at those files is the opposite: it changes. A common default for it is no-cache, which means check with the server before reusing.",
    "And no-cache does not mean do not cache. It means store it, but validate before each reuse. If you mean do not store, that is no-store.",
  ],
  example: {
    title: "A versioned file, cached for a year",
    code: `# 1. A real versioned file: the hash is part of the name
GET /static/client/styles-global.19cc0c980e463125.css
HTTP/1.1 200 OK
Content-Type: text/css
Cache-Control: public, max-age=31536000
ETag: "34e6024a2edf1bca097b0cbceb7ac033"
#   31536000 seconds = 365 days

# 2. A new build gives the file a new name, so the old copy is never asked for again
GET /static/client/styles-global.<a different hash>.css

# 3. The page that names the file is a different story
Cache-Control: no-cache
#   store it, but check with the server before each reuse`,
    note: "Step 1 is real: headers captured with curl -I from developer.mozilla.org on 8 November 2026 and trimmed. Steps 2 and 3 are illustrative of the pattern the quotes below describe. MDN's own HTML page, captured in section 1, uses max-age=3600 instead.",
  },
  docs: [
    { text: "Also, if the versions of JavaScript and CSS resources that a client uses are out of sync, the display will break.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "And for resources that do change, it is a common best practice to change the URL each time the content changes, so that the URL unit can be cached for a longer period.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Since the cache distinguishes resources from one another based on their URLs, the cache will not be reused again if the URL changes when a resource is updated.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "To ensure that by default the latest versions of resources will always be transferred, it's common practice to make the default Cache-Control value include no-cache:", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "The no-cache directive does not prevent the storing of responses but instead prevents the reuse of responses without revalidation.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "If you don't want a response stored in any cache, use no-store.", source: "MDN: HTTP caching", href: MDN_CACHING },
  ],
};

export const webWhose: JourneyChapter = {
  id: "web-whose",
  title: "Whose Copy Is It",
  note: NOTE_HTTP,
  lines: [
    "There are two kinds of cache. A private cache is tied to one client, typically your browser. A shared cache sits between the client and the server, like a CDN or a proxy, and reuses one response for many people.",
    "That is the danger. If a personalised response lands in a shared cache, other users may be able to retrieve it. The docs call it unintentional information leakage. In real life it reads like an incident report.",
    "The fix is a single word. Cache-Control: private stores the response only in a private cache.",
    "In the example: the home page of GitHub, captured logged out, says max-age=0, private, must-revalidate.",
    "A separate problem: the same URL can give different responses depending on a request header. Vary tells a cache which header to key on. MDN's example is Vary: Accept-Language, so the English and Japanese copies of one URL are cached separately.",
    "A cookie is not a Vary header. For personalised content, the docs say to use private instead of varying on the cookie.",
    "And when many identical requests reach a shared cache at the same moment, it forwards a single request to the origin and reuses the answer for all of them. MDN calls that request collapse. It is the stampede protection from the Wikipedia site.",
  ],
  example: {
    title: "Private, and Vary",
    code: `# Real (github.com home page, captured logged out):
# stored only by one client, and revalidated before each reuse
Cache-Control: max-age=0, private, must-revalidate

# Real (developer.mozilla.org): the stored copy depends on this request header
Vary: Accept-Encoding

# From MDN's docs: one URL, two languages, cached separately
Vary: Accept-Language
  https://example.com/index.html + Accept-Language: ja-JP  ->  one stored copy
  https://example.com/index.html + Accept-Language: en-US  ->  another`,
    note: "The first two are real headers, captured with curl -I on 8 November 2026 and trimmed (GitHub sends a much longer Vary list). The last block is MDN's own example, shown as a small table in their guide.",
  },
  docs: [
    { text: "In the HTTP Caching spec, there are two main types of caches: private caches and shared caches.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "A private cache is a cache tied to a specific client — typically a browser cache.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "The shared cache is located between the client and the server and can store responses that can be shared among users.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "On the other hand, if personalized contents are stored in a cache other than a private cache, then other users may be able to retrieve those contents — which may cause unintentional information leakage.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "If a response contains personalized content and you want to store the response only in the private cache, you must specify a private directive.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "That causes the cache to be keyed based on a composite of the response URL and the Accept-Language request header — rather than being based just on the response URL.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "For applications that employ cookies to prevent others from reusing cached personalized content, you should specify Cache-Control: private instead of specifying a cookie for Vary.", source: "MDN: HTTP caching", href: MDN_CACHING },
    { text: "Thus, if multiple identical requests arrive at a shared cache at the same time, the intermediate cache will forward a single request on behalf of itself to the origin, which can then reuse the result for all clients.", source: "MDN: HTTP caching", href: MDN_CACHING },
  ],
};

export const webStale: JourneyChapter = {
  id: "web-stale",
  title: "Stale on Purpose",
  note: `${NOTE_HTTP} ${NOTE_NEXT}`,
  lines: [
    "Sometimes the best answer is an old one, right now.",
    "stale-while-revalidate lets a cache reuse a stale response while it revalidates it in the background.",
    "Take Cache-Control: max-age=604800, stale-while-revalidate=86400. The response is fresh for 7 days. For the following day it is stale, but the cache may still serve it, as long as it revalidates in the background.",
    "That hides the cost of revalidation from the client: it appears that the response was always fresh during that period. If nobody asked in that window, the next request simply revalidates normally.",
    "Next.js's Incremental Static Regeneration is the same idea for pages: after the revalidate time the next visitor gets the cached, stale page at once while a fresh one is generated in the background. Its docs call that background regeneration stale-while-revalidate.",
    "The GitHub site shows the same trade in the browser: render from local data now, check with the server after.",
  ],
  example: {
    title: "MDN's example, as a timeline",
    code: `Cache-Control: max-age=604800, stale-while-revalidate=86400

  day 0 to 7    fresh   served from the cache, no questions asked
  day 7 to 8    stale   still served, and revalidated in the background
  after day 8           the next request revalidates normally`,
    note: "The header is MDN's own example. The timeline restates what the quotes below say, with 604800 seconds as 7 days and 86400 seconds as 1 day.",
  },
  docs: [
    { text: "The stale-while-revalidate response directive indicates that the cache could reuse a stale response while it revalidates it to a cache.", source: "MDN: Cache-Control", href: MDN_CACHE_CONTROL },
    { text: "After 7 days it becomes stale, but the cache is allowed to reuse it for any requests that are made in the following day (86400s), provided that they revalidate the response in the background.", source: "MDN: Cache-Control", href: MDN_CACHE_CONTROL },
    { text: "Revalidation will make the cache be fresh again, so it appears to clients that it was always fresh during that period — effectively hiding the latency penalty of revalidation from them.", source: "MDN: Cache-Control", href: MDN_CACHE_CONTROL },
    { text: "After an hour has passed, the next visitor will still receive the cached (stale) version of the page immediately for a fast response.", source: "Next.js: Incremental Static Regeneration", href: NEXT_ISR },
    { text: "Background regeneration (stale-while-revalidate) runs on the instance that receives the triggering request.", source: "Next.js: Incremental Static Regeneration", href: NEXT_ISR },
  ],
};

// ---- The page ----

/** What /basics shows: an intro, a short "how it fits together" list, then the eight sections in order. */
export const basics: {
  name: string;
  intro: string;
  /** One line per section, each linking to the section that backs it. */
  steps: { text: string; chapter: string }[];
  /** One line per section: what is inside it. Shown on the folded section's header, so a reader knows what opening it gets them. */
  summaries: Record<string, string>;
  /** A closing question about the whole page. */
  check: Quiz;
  chapters: JourneyChapter[];
} = {
  name: "How the web works",
  intro:
    "One click, followed from your finger to the screen, with real examples. A request leaves your browser, a server answers, and the browser turns the bytes into pixels. Then come the two questions every site on this website has to answer: who builds the HTML, and who remembers the answer? The HTTP examples were captured on 8 November 2026, so you can see what a header actually looks like.",
  steps: [
    { text: "You click. The browser sends a request (a start line, headers, maybe a body) and the server answers with a response that has a status code and headers.", chapter: "web-request" },
    { text: "The HTML arrives. The browser parses it into the DOM, building as the bytes come in. Stylesheets block rendering, and plain scripts can block parsing.", chapter: "web-path" },
    { text: "Who wrote that HTML decides the trade-off: the browser (client-side), the server on each request (server-side), or a build step (static).", chapter: "web-fork" },
    { text: "A server-rendered page can look ready before hydration has attached its handlers.", chapter: "web-handover" },
    { text: "Every response says how long it stays fresh, and a stale copy is revalidated with a conditional request that can end in a 304.", chapter: "web-memory" },
    { text: "Versioned file names make year-long caching safe. no-cache means validate first, and no-store means do not keep it at all.", chapter: "web-fingerprints" },
    { text: "A shared cache must never hold a personalised response: private and Vary decide whose copy is whose.", chapter: "web-whose" },
    { text: "And sometimes the best answer is a stale one, served now and refreshed in the background.", chapter: "web-stale" },
  ],
  summaries: {
    "web-request": "What a request and a response look like, with a real response captured from MDN.",
    "web-path": "How the browser turns HTML into pixels, and what holds it up. Try it: change how a script loads and watch the first paint.",
    "web-fork": "Client, server or static: who writes the HTML, and what each one actually sends to the browser.",
    "web-handover": "Why a server-rendered page can look ready and still ignore your click, and what hydration does about it.",
    "web-memory": "Fresh, stale and the 304: how a cache decides whether to ask the server, with real headers.",
    "web-fingerprints": "Why a file name can carry a hash, and what no-cache and no-store really mean. Try it: pick a header and see what a cache does.",
    "web-whose": "Private and shared caches, Vary, and how a personalised page can leak.",
    "web-stale": "Serving an old answer on purpose, then refreshing it in the background.",
  },
  check: {
    question: "What can go wrong if a personalised page is stored in a shared cache?",
    options: ["The page loads more slowly", "Other users may be able to retrieve those contents", "The cache refuses to store it"],
    answer: 1,
    reveal: "Other users may be able to retrieve personalised contents from a shared cache, which can leak information.",
  },
  chapters: [webRequest, webPath, webFork, webHandover, webMemory, webFingerprints, webWhose, webStale],
};
