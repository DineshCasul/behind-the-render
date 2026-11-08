/**
 * The general-engineering side of each trick. Unlike `tricks.ts`, nothing here
 * is a claim about what a company did: it explains the underlying technique,
 * how to build a toy version, where it goes wrong, and how to spot it with
 * DevTools. The page labels it that way. Keyed by trick slug.
 */
interface TrickExtras {
  /** The algorithm or pattern underneath, in plain steps. */
  how: {
    name: string;
    steps: string[];
    cost: string;
    /** The thing this is most often confused with, and how it differs. Shown as a short callout. */
    versus?: { name: string; difference: string };
  };
  /** A small, original sketch of the technique. */
  code: { title: string; src: string };
  /** Where it goes wrong, or when not to use it. */
  /** Where it goes wrong. `fix` is only given when the pitfall does not already say what to do. */
  pitfalls: { text: string; fix?: string }[];
  /** How to see the idea yourself in the browser, if there is a way. */
  inspect?: string;
}

export const trickExtras: Record<string, TrickExtras> = {
  "request-batching": {
    how: {
      name: "Request coalescing (the DataLoader pattern)",
      steps: [
        "Several parts of the page ask for data in the same moment.",
        "Instead of sending each ask, collect them in a queue until the current tick of the event loop ends.",
        "Send one request carrying every id, then hand each caller its own piece of the answer.",
      ],
      cost: "Round trips drop from the number of calls to the length of the longest dependency chain.",
      versus: { name: "parallel requests", difference: "Parallel requests are independent calls sent at the same moment. Batching merges calls into one request. A chain, where each call needs the last answer, is what neither can fix, which is why finding the dependencies comes first." },
    },
    code: {
      title: "A 12-line batcher",
      src: `const queue: { id: string; resolve: (v: unknown) => void }[] = [];

export function load(id: string) {
  return new Promise((resolve) => {
    queue.push({ id, resolve });
    if (queue.length === 1) queueMicrotask(flush); // first ask schedules the flush
  });
}

async function flush() {
  const batch = queue.splice(0);
  const ids = batch.map((b) => b.id).join(",");
  const rows = await fetch(\`/api/items?ids=\${ids}\`).then((r) => r.json());
  batch.forEach((b) => b.resolve(rows[b.id]));
}`,
    },
    pitfalls: [
      { text: "One slow item holds up the whole batch, so the fastest piece now waits for the slowest.", fix: "Put the slow part in its own request, or stream it in after the rest." },
      { text: "Calls that depend on each other can't be merged: you need the first answer to know the second question." },
      { text: "A big combined response is harder to cache than several small ones.", fix: "Cache each item by its id inside the batch handler, instead of caching the combined response." },
    ],
    inspect: "Open DevTools, Network tab, and read the Waterfall column. A staircase of bars, each starting where the last ended, is a chain.",
  },

  "field-data": {
    how: {
      name: "Percentile over real-user measurements",
      steps: [
        "Measure the metric in each visitor's browser (here, Largest Contentful Paint).",
        "Collect the numbers and sort them.",
        "Report the 75th percentile, the value three quarters of visits beat, instead of the average.",
      ],
      cost: "Sorting is O(n log n); at scale, services keep histograms so they never sort the raw list.",
      versus: { name: "lab data", difference: "A lab run is one machine on one network under controlled conditions. Field data is measured on real visits, so it shows the whole spread, including the slow tail." },
    },
    code: {
      title: "Measure LCP in the browser",
      src: `new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const last = entries[entries.length - 1]; // the latest candidate wins
  navigator.sendBeacon("/rum", JSON.stringify({ lcp: last.startTime }));
}).observe({ type: "largest-contentful-paint", buffered: true });

// server side: the p75 of a list of samples
const p75 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.ceil(xs.length * 0.75) - 1];`,
    },
    pitfalls: [
      { text: "A lab run on your laptop is one fast machine on one good network; your users are not that." },
      { text: "An average hides the slow tail. A few terrible visits barely move it, but they are real people.", fix: "Report percentiles such as p75 and p95, not the mean." },
      { text: "The browser may report several LCP candidates while the page loads; only the last one counts." },
    ],
    inspect: "Paste a URL into PageSpeed Insights. It shows field data from real Chrome users above the lab test, when enough visits exist.",
  },

  "adaptive-bitrate": {
    how: {
      name: "Adaptive bitrate selection",
      steps: [
        "The video is cut into a few seconds per segment, and each segment exists at several resolutions.",
        "Before each segment, the player estimates download speed and checks how much video is buffered.",
        "It picks the highest rendition that should download in time, and ignores any the device can't decode smoothly.",
        "Repeat for every segment, so quality follows the network moment by moment.",
      ],
      cost: "One cheap decision per segment; the cost that matters is a wrong guess, which empties the buffer and stalls the video.",
      versus: { name: "a fixed quality", difference: "A fixed quality is a bet on the network. Adaptive bitrate decides again for every segment from measured speed and buffer, and a good player also checks what the device can decode." },
    },
    code: {
      title: "Pick a rendition",
      src: `interface Rendition { height: number; bitrate: number; playable: boolean }

function pick(renditions: Rendition[], bandwidth: number, bufferSec: number) {
  // be conservative when the buffer is thin
  const budget = bandwidth * (bufferSec < 5 ? 0.5 : 0.8);
  return renditions
    .filter((r) => r.playable && r.bitrate <= budget)
    .sort((a, b) => b.bitrate - a.bitrate)[0] ?? renditions[0];
}`,
    },
    pitfalls: [
      { text: "Reacting to every bandwidth wobble makes quality flicker up and down. Real players add hysteresis: switch up slowly, down quickly." },
      { text: "At the start there is no measurement yet, so players begin low and climb." },
      { text: "Network speed isn't the only limit. A device that can't decode a resolution smoothly will stutter even on fast Wi-Fi." },
    ],
    inspect: "On most video players, right-click and look for a stats overlay. It shows the current resolution and buffer health as they change.",
  },

  "canvas-rendering": {
    how: {
      name: "Immediate-mode drawing loop",
      steps: [
        "Keep your own model of the scene: a list of shapes, not DOM elements.",
        "When something changes, clear the canvas and draw every shape again.",
        "Run the redraw inside requestAnimationFrame so it lands once per frame.",
        "Hit-testing is yours too: on a click, loop over shapes and see which one contains the point.",
      ],
      cost: "O(shapes) per redraw. Big scenes cull what's off screen or redraw only the changed region.",
      versus: { name: "DOM rendering", difference: "With the DOM the browser keeps the scene and you describe changes. With a canvas you keep the scene and redraw it yourself, so you also own text, hit-testing and accessibility." },
    },
    code: {
      title: "A canvas that redraws on demand",
      src: `const ctx = canvas.getContext("2d")!;
const shapes = [{ x: 20, y: 20, w: 80, h: 50 }];
let dirty = true;

function frame() {
  if (dirty) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((s) => ctx.fillRect(s.x, s.y, s.w, s.h));
    dirty = false;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

canvas.onclick = (e) => {
  const hit = shapes.find((s) => e.offsetX >= s.x && e.offsetX <= s.x + s.w && e.offsetY >= s.y && e.offsetY <= s.y + s.h);
  // move or select \`hit\`, then set dirty = true
};`,
    },
    pitfalls: [
      { text: "You lose what the browser gives for free: text selection, find-in-page, and accessibility have to be rebuilt.", fix: "Overlay real DOM for text and controls where you can, and expose an accessible alternative for the rest." },
      { text: "Text layout, scrolling and focus are yours to write." },
      { text: "For ordinary documents and forms, the DOM is the right tool. Canvas pays off when you have thousands of moving objects." },
    ],
    inspect: "Inspect a canvas-based app in the Elements panel. You'll see one canvas element and nothing inside it, however much is drawn.",
  },

  webassembly: {
    how: {
      name: "Compile ahead of time, run as a binary",
      steps: [
        "Compile C++ (or Rust, or similar) to a .wasm binary instead of JavaScript.",
        "The browser downloads it, validates it and compiles it to machine code.",
        "JavaScript calls the module's exported functions; the module works on its own block of memory.",
      ],
      cost: "Fast inside the module; every call across the JavaScript-to-wasm boundary has overhead, so make fewer, bigger calls.",
      versus: { name: "asm.js", difference: "asm.js is a subset of JavaScript that the browser parses as text. WebAssembly is a binary format designed with browsers in mind and as fast as possible to parse." },
    },
    code: {
      title: "Load a module and call it",
      src: `const { instance } = await WebAssembly.instantiateStreaming(fetch("/engine.wasm"), {});
const { add } = instance.exports as { add(a: number, b: number): number };

console.log(add(2, 3)); // 5, computed by compiled code`,
    },
    pitfalls: [
      { text: "The module can't touch the DOM directly. It goes through JavaScript." },
      { text: "The binary is a download. A small tool in plain JavaScript is often lighter." },
      { text: "Chatty code that calls across the boundary in a tight loop can lose the speed it gained.", fix: "Move the whole hot loop into the module and cross the boundary once per frame, not once per item." },
    ],
    inspect: "Filter the Network tab by wasm to see the module's size and when it loads.",
  },

  "server-rendering-service": {
    how: {
      name: "Render to string, then hydrate",
      steps: [
        "The server runs the same component code and produces an HTML string.",
        "It sends that HTML, so the browser can paint content before any JavaScript arrives.",
        "The client downloads the JavaScript and hydrates: it attaches event handlers to the HTML that's already there.",
      ],
      cost: "Server CPU on every uncached request, in exchange for an earlier first paint.",
      versus: { name: "client-side rendering", difference: "Client-side rendering sends a shell and builds the page in the browser. Server rendering sends finished HTML first, and JavaScript then attaches behaviour to it, which is called hydration." },
    },
    code: {
      title: "Server-render a component",
      src: `import { renderToString } from "react-dom/server";
import express from "express";
import { App } from "./App";

express()
  .get("/", (req, res) => {
    const html = renderToString(<App />);
    res.send(\`<div id="root">\${html}</div><script src="/client.js"></script>\`);
  })
  .listen(3000);

// client.js: hydrateRoot(document.getElementById("root"), <App />)`,
    },
    pitfalls: [
      { text: "The server and the client must render the same thing, or hydration mismatches.", fix: "Render from the same data on both sides, and avoid values that differ between them, such as the current time." },
      { text: "HTML you can see isn't HTML you can use: until hydration finishes, buttons may not respond.", fix: "Keep the first interactions cheap to hydrate, and load heavy widgets later." },
      { text: "Rendering on every request costs servers; cache the result where the page allows it." },
    ],
    inspect: "Use View Source, not the Elements panel. If the content is in the source, the server rendered it. If you only see an empty root, the browser did.",
  },

  "service-worker-cache": {
    how: {
      name: "Cache strategies in a service worker",
      steps: [
        "A service worker sits between the page and the network and sees every request.",
        "Cache-first: answer from the cache, and go to the network only on a miss. Best for files that never change.",
        "Network-first: try the network, fall back to the cache. Best for fresh data.",
        "Stale-while-revalidate: answer from the cache now, refresh it in the background for next time.",
      ],
      cost: "Cache hits cost no network at all; the price is managing versions so users don't get stuck on old files.",
      versus: { name: "the HTTP cache", difference: "The HTTP cache is steered by response headers, and the browser decides. A service worker is code you write that decides, request by request, whether to answer from the cache or the network." },
    },
    code: {
      title: "Cache-first with a fallback",
      src: `self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then(
      (hit) =>
        hit ??
        fetch(event.request).then(async (res) => {
          const cache = await caches.open("v1");
          cache.put(event.request, res.clone()); // a response can be read once
          return res;
        }),
    ),
  );
});`,
    },
    pitfalls: [
      { text: "A bad cache strategy can pin users to an old version of your app.", fix: "Prefer network-first for the HTML document and cache-first for fingerprinted files." },
      { text: "Service workers only run on HTTPS (and localhost)." },
      { text: "Every cache needs a version and a clean-up step, or storage fills with dead files." },
    ],
    inspect: "DevTools, Application tab: Service Workers shows the worker's status, and Cache Storage lists exactly what it saved.",
  },

  "atomic-css": {
    how: {
      name: "Deduplicate to one class per declaration",
      steps: [
        "Break every style rule into single declarations such as color: red.",
        "Give each unique declaration one class, generated once.",
        "Every element that needs it reuses that class instead of adding another rule.",
      ],
      cost: "The stylesheet grows with the number of unique declarations, not with the number of components, so it flattens out as the app grows.",
      versus: { name: "component CSS", difference: "Component CSS grows with the number of components. Atomic CSS has one class per unique declaration, so it grows with the number of distinct declarations, which levels off." },
    },
    code: {
      title: "A tiny atomic CSS generator",
      src: `const rules = new Map<string, string>(); // declaration -> class name

export function atomic(style: Record<string, string>) {
  return Object.entries(style)
    .map(([prop, value]) => {
      const decl = \`\${prop}:\${value}\`;
      if (!rules.has(decl)) rules.set(decl, "c" + rules.size.toString(36));
      return rules.get(decl);
    })
    .join(" ");
}

atomic({ color: "red", margin: "0" }); // "c0 c1"
atomic({ color: "red", padding: "4px" }); // "c0 c2": color:red is reused`,
    },
    pitfalls: [
      { text: "Class lists on elements get long, and reading them in DevTools takes practice." },
      { text: "Order and specificity matter when two classes set the same property, so the tooling has to handle conflicts." },
      { text: "For a small site the saving is tiny. The idea pays off when the same declarations repeat thousands of times." },
    ],
    inspect: "Open the Coverage panel (Cmd/Ctrl+Shift+P, type coverage) and reload. It shows how much of each CSS file the page actually used.",
  },

  "loading-tiers": {
    how: {
      name: "Prioritised loading",
      steps: [
        "Sort code by urgency: what the first paint needs, what the visible part needs, and everything else.",
        "Load the first tier immediately.",
        "Load the later tiers when the browser is free or the user is about to need them.",
      ],
      cost: "Same total bytes; the win is that the urgent ones no longer wait in line behind the rest.",
      versus: { name: "splitting code by route", difference: "Route splitting loads code per page. Tiers split the code for one page by urgency: what the first paint needs, what a full render needs, and everything else." },
    },
    code: {
      title: "Load a late tier when the browser is idle",
      src: `// tier 1: in the main bundle, runs first.
renderAboveTheFold();

// tier 3: not needed to render anything, so it waits.
window.addEventListener("load", () => {
  const later = () => import("./analytics").then((m) => m.start());
  if ("requestIdleCallback" in window) requestIdleCallback(later);
  else setTimeout(later, 2000);
});`,
    },
    pitfalls: [
      { text: "Too many tiers create a waterfall of their own: each load discovers the next one.", fix: "Declare what is coming up front, for example with preload hints, so the next tier does not wait to be discovered." },
      { text: "Deferring something the user needs early shows up as a button that does nothing yet." },
      { text: "Keep tiers few and meaningful. Two or three is usually enough." },
    ],
    inspect: "In the Network tab, turn on the Priority column and sort by it. High-priority files should be the ones the first paint needs.",
  },

  "layered-cache": {
    how: {
      name: "Multi-level cache with LRU eviction",
      steps: [
        "A request checks the nearest, smallest cache first.",
        "On a miss it asks the next layer, and finally the origin; each layer keeps a copy on the way back.",
        "When a layer is full it evicts the least recently used entry (LRU).",
      ],
      cost: "Average latency is hit rate × fast time + miss rate × slow time. At 90% hits, 1 in 10 requests pays the full price.",
      versus: { name: "a single cache", difference: "One cache has to be both fast and large. Layers split the job: a small fast layer in memory, a large slower one on disk, and the origin behind both." },
    },
    code: {
      title: "An LRU cache in 12 lines",
      src: `class LRU<K, V> {
  private map = new Map<K, V>(); // a Map remembers insertion order
  constructor(private max: number) {}

  get(key: K) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value); // re-insert: now the most recent
    return value;
  }

  set(key: K, value: V) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value!); // oldest out
  }
}`,
    },
    pitfalls: [
      { text: "Invalidation is the hard part: when the data changes, every layer holding a copy must learn it.", fix: "Use short lifetimes, plus an explicit purge when something changes." },
      { text: "After a restart or a purge, every request misses at once and can overwhelm the origin (a cache stampede)." },
      { text: "Caching something personal in a shared layer can show one user's data to another.", fix: "Mark personalised responses private, and vary shared entries on whatever makes them different." },
    ],
    inspect: "Look at the response headers of any page: Cache-Control says how long it may be reused, and an Age header (where present) says how long it has sat in a cache.",
  },

  "gradual-migration": {
    how: {
      name: "The strangler pattern",
      steps: [
        "Put the new code next to the old instead of rewriting everything.",
        "Move one feature at a time to the new way, behind a thin adapter.",
        "Track what still uses the old code; when it reaches zero, delete it.",
      ],
      cost: "A rewrite is a risk paid all at once; this spreads it out, at the price of running two systems for a while.",
      versus: { name: "a rewrite", difference: "A rewrite swaps everything at once, and the risk arrives all at once. A gradual migration moves one feature at a time and keeps the old code running until nothing uses it." },
    },
    code: {
      title: "An adapter that lets old and new coexist",
      src: `// every call site uses this; only this file knows which engine runs.
import legacy from "./legacy-dom";
import modern from "./modern-dom";

const MIGRATED = new Set(["modal", "tabs"]); // grows as features move

export function enhance(feature: string, el: Element) {
  return (MIGRATED.has(feature) ? modern : legacy)(feature, el);
}`,
    },
    pitfalls: [
      { text: "The migration can stall halfway, leaving two ways to do everything forever." },
      { text: "Both libraries ship during the transition, so the page gets heavier before it gets lighter." },
      { text: "It needs a way to measure progress. Without a count of what's left, nobody knows when to delete." },
    ],
  },

  "hexagon-grid": {
    how: {
      name: "Spatial index with k-ring search",
      steps: [
        "Cut the map into cells and give every cell an id; a point maps to a cell in constant time.",
        "To find things nearby, take the cell and its neighbours out to k steps (a k-ring).",
        "Only those cells' contents are candidates. Work out exact distances for them alone.",
      ],
      cost: "A k-ring has 1 + 3k(k+1) cells, so the work depends on k, not on how many drivers exist worldwide.",
      versus: { name: "a square grid", difference: "In a square grid a cell's neighbours sit at two different distances: sides and corners. A hexagon has one distance to all six neighbours, which keeps questions about nearby simple." },
    },
    code: {
      title: "How many cells does a ring cover?",
      src: `// hexagons: 1 centre + 6 + 12 + 18 + ... for each ring out to k
const cellsInRing = (k: number) => 1 + 3 * k * (k + 1);

cellsInRing(1); // 7
cellsInRing(2); // 19
cellsInRing(3); // 37

// nearby(point, k): candidates = cellsInRing around cellOf(point), then sort by exact distance`,
    },
    pitfalls: [
      { text: "The nearest thing can sit just outside your ring, so you may need a bigger k, or a second pass.", fix: "Search one ring more than you think you need, then confirm with exact distances." },
      { text: "Cell size is a trade-off: small cells mean precise but many lookups; large cells mean few lookups but many candidates." },
      { text: "Any grid on a sphere has awkward spots. The cells have to bend somewhere." },
    ],
  },
  "last-writer-wins": {
    how: {
      name: "A last-writer-wins register per property",
      steps: [
        "Model the document as a two-level map: object id, then property, then one value.",
        "Every change is a tiny message: set this property of this object to this value.",
        "The server applies messages in the order it receives them, so the last one wins. It is the central authority, so it needs no timestamps.",
        "Each client shows its own unacknowledged change on screen, and ignores incoming server changes to that same property until the server confirms, so the value doesn't flicker.",
      ],
      cost: "Constant work per change. The price is that two edits to the same value never merge: one of them wins whole.",
      versus: { name: "operational transforms", difference: "OT transforms each edit against concurrent ones so that text can merge. Last-writer-wins keeps one value per property and lets the server pick the order. It is simpler, and it cannot merge two edits to one value." },
    },
    code: {
      title: "The server and client halves",
      src: `type Doc = Map<string, Map<string, unknown>>; // objectId -> property -> value

// server: the order messages arrive in IS the order of events
function onSet(doc: Doc, id: string, prop: string, value: unknown) {
  if (!doc.has(id)) doc.set(id, new Map());
  doc.get(id)!.set(prop, value); // last one wins
  broadcast({ id, prop, value });
}

// client: keep my unacknowledged changes on screen
const pending = new Map<string, unknown>(); // "id.prop" -> my value
function onServerSet(id: string, prop: string, value: unknown) {
  if (pending.has(id + "." + prop)) return; // mine is the better prediction
  render(id, prop, value);
}
function onAck(id: string, prop: string) {
  pending.delete(id + "." + prop);
}`,
    },
    pitfalls: [
      { text: "Two people typing into one text value will not merge. One of them wins and the other's keystrokes are gone.", fix: "For the few fields where people really type together, use a text-specific technique such as OT or a text CRDT." },
      { text: "It needs a central server to define the order. Peer-to-peer systems need real CRDTs or other tools." },
      { text: "Without the client-side pending map, a value flickers when an older acknowledged change briefly overwrites a newer unacknowledged one." },
    ],
    inspect: "Open one Figma file in two windows and change the same layer's colour in both at once. The document should settle on a single value, as the post describes.",
  },

  "fractional-indexing": {
    how: {
      name: "Order by a number between two neighbours",
      steps: [
        "Give each child a position: a fraction strictly between 0 and 1.",
        "The visible order is just the children sorted by position.",
        "To insert between two items, take the average of their positions.",
        "To move an item, change only its own position. Nothing else is rewritten.",
      ],
      cost: "O(1) edits per insert or move. Keys can grow longer as you keep inserting into the same gap.",
      versus: { name: "array positions", difference: "Array positions (0, 1, 2, ...) change for every item after an insert, so concurrent edits collide. A fractional key is stable: an insert gives a number only to the new item." },
    },
    code: {
      title: "Insert without renumbering",
      src: `// position is a number in (0, 1); children are sorted by it
const between = (a: number, b: number) => (a + b) / 2;

const items = [
  { id: "A", pos: 0.25 },
  { id: "B", pos: 0.5 },
];

items.push({ id: "C", pos: between(0.25, 0.5) }); // 0.375
items.sort((x, y) => x.pos - y.pos);              // A, C, B

// Plain doubles run out of precision after enough inserts into the same gap.
// That is why a real system stores the fraction as a string.`,
    },
    pitfalls: [
      { text: "Doubles run out of precision when many inserts land in one gap, so real systems use strings or arbitrary-precision fractions." },
      { text: "Two people inserting into the same gap at once can end up interleaved. Fine for design layers, bad for text.", fix: "If a run of inserts must stay together, use a scheme that preserves it. Otherwise accept the interleaving." },
      { text: "Keys grow as you keep inserting into the same gap, so long-lived lists may need occasional rebalancing." },
    ],
  },

  "virtual-list": {
    how: {
      name: "Windowing: render only what the viewport shows",
      steps: [
        "Compute which rows intersect the viewport from the scroll position.",
        "Render only those rows, plus a few extra above and below so scrolling feels smooth.",
        "Keep the scrollable area's total height honest with one tall spacer, so the scrollbar behaves.",
        "On scroll, recompute the range and swap rows in and out.",
      ],
      cost: "Work is proportional to the number of visible rows, not the total. A 10 line window costs the same for 100 rows or 100,000.",
      versus: { name: "pagination", difference: "Pagination splits content into pages the user has to click through. Virtualization keeps one continuous scroll but only draws the part you can see." },
    },
    code: {
      title: "The core of a virtual list",
      src: `const ROW = 20; // px, fixed height keeps the maths simple

function visibleRange(scrollTop: number, viewport: number, total: number, overscan = 5) {
  const first = Math.max(0, Math.floor(scrollTop / ROW) - overscan);
  const last = Math.min(total, Math.ceil((scrollTop + viewport) / ROW) + overscan);
  return { first, last };
}

// Render rows first..last, each absolutely positioned at top = index * ROW,
// inside a container whose height is total * ROW.`,
    },
    pitfalls: [
      { text: "Browser find-in-page only sees what is in the DOM, so most of the file becomes invisible to Ctrl+F.", fix: "Intercept find-in-page and search your own data, as some code editors do." },
      { text: "Rows with different heights make the maths harder: you need to measure or estimate them.", fix: "Measure rows once and remember the heights, or estimate and correct as they render." },
      { text: "Screen readers, text selection across rows, and anchors to lines far away all need extra work." },
    ],
    inspect: "Scroll a very long list while watching the Elements panel. If rows appear and disappear as you scroll, the list is virtualized.",
  },

  "local-first-navigation": {
    how: {
      name: "Stale-while-revalidate, in the client",
      steps: [
        "On navigation, look in a local store (here IndexedDB) for the data first.",
        "If it is there, render it immediately. It may be stale.",
        "Ask the server in the background for the fresh version.",
        "If it differs, update the screen. If not, nothing visibly happens.",
      ],
      cost: "A hit costs a local read. A miss costs the same as before. The price is that users may briefly see old data.",
      versus: { name: "plain HTTP caching", difference: "Cache-Control lets the browser or a CDN reuse a response. A client-side store such as IndexedDB lets the app itself render from data it kept, and decide when to refresh it." },
    },
    code: {
      title: "Render from cache, then revalidate",
      src: `async function load(key: string, render: (data: unknown) => void) {
  const cached = await idbGet(key); // from IndexedDB
  if (cached) render(cached);       // instant, maybe stale

  const fresh = await fetch("/api/" + key).then((r) => r.json());
  if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
    await idbSet(key, fresh);
    render(fresh);                  // reconcile when it changed
  }
}`,
    },
    pitfalls: [
      { text: "A cache only helps on a hit. If most navigations miss, you pay for the cache and still wait." },
      { text: "Users can see data change a moment after the page appears. Decide how much staleness you can accept, and measure it." },
      { text: "Browsers can clear local storage, so the app must work with an empty cache." },
    ],
    inspect: "DevTools, Application tab, IndexedDB: it lists the databases a site keeps locally. Reload a page you have seen before and watch the Network tab to see how much of it still goes out.",
  },

  "prefetch-before-click": {
    how: {
      name: "Eager prefetch with parallel code and data",
      steps: [
        "Listen for hover, focus and mousedown on a link: signs the user is about to go there.",
        "On the first sign, start fetching the next route's code and its data at the same time.",
        "By the time the click completes, some or all of it has already arrived.",
        "Keep the old page visible until the new one is ready, instead of blanking the screen.",
      ],
      cost: "Some wasted fetches when a hover doesn't turn into a click, in exchange for removing most of the wait.",
      versus: { name: "lazy loading", difference: "Lazy loading waits until something is needed. Prefetching starts on a sign of intent, so it is already there when it is needed." },
    },
    code: {
      title: "Warm a route on the first sign of intent",
      src: `const warmed = new Set<string>();

function warm(url: string) {
  if (warmed.has(url)) return;       // only once per link
  warmed.add(url);
  routeFor(url).loadCode();          // the JavaScript, e.g. import("./route")
  fetch("/api" + new URL(url, location.href).pathname); // the data, in parallel
}

for (const link of document.querySelectorAll("a[data-warm]")) {
  link.addEventListener("pointerenter", () => warm(link.href));
  link.addEventListener("focus", () => warm(link.href));
  link.addEventListener("mousedown", () => warm(link.href)); // last chance
}`,
    },
    pitfalls: [
      { text: "Touch screens have no hover, so you need a different signal, such as the link scrolling into view." },
      { text: "Prefetching spends the user's data and your server's capacity. Be careful on slow connections." },
      { text: "Never prefetch a URL whose GET changes something, such as a one-click unsubscribe link." },
    ],
    inspect: "Open the Network tab, hover over a link without clicking, and watch for requests. Sites that prefetch on hover show them before the click.",
  },

  "request-coalescing": {
    how: {
      name: "Collapse identical in-flight requests",
      steps: [
        "A request arrives for something that is not cached.",
        "Check whether someone is already fetching it. If so, wait for that result.",
        "If not, become the one fetcher: send a single request to the origin.",
        "When it answers, cache it and hand the same response to everyone who waited.",
      ],
      cost: "One origin request per object per miss, however many clients ask. Waiting clients depend on that single request.",
      versus: { name: "batching", difference: "Batching merges different requests into one. Coalescing merges identical requests, so a thousand identical ones become a single request to the origin." },
    },
    code: {
      title: "A request coalescer in a few lines",
      src: `const inflight = new Map<string, Promise<Response>>();

function coalescedFetch(url: string) {
  let p = inflight.get(url);
  if (!p) {
    p = fetch(url).finally(() => inflight.delete(url)); // one request for everyone
    inflight.set(url, p);
  }
  return p.then((r) => r.clone()); // each caller needs its own copy of the body
}`,
    },
    pitfalls: [
      { text: "If the single request fails or hangs, everyone waiting fails or hangs with it. Add a timeout." },
      { text: "Only coalesce requests that really want the same response. A personalised page must not be shared between users." },
      { text: "Coalescing handles the herd on a miss. It doesn't replace sizing your origin for the miss rate." },
    ],
    inspect: "Run curl -I against a popular page twice and compare the headers. A cache usually adds an Age header that shows how long the copy has been held.",
  },

  "consistent-hashing": {
    how: {
      name: "A hash ring with replica points",
      steps: [
        "Hash each server onto a ring, a number line that wraps around. Give each server many points to spread it out.",
        "To find the owner of a key, hash the key and walk clockwise to the first server point.",
        "When a server joins, it takes over only the keys between it and the previous point.",
        "When a server leaves, only its keys move to the next server on the ring.",
      ],
      cost: "A lookup is O(log n) with a sorted list of points. Adding or removing a server moves about 1/n of the keys, not nearly all of them.",
      versus: { name: "hash(key) % number of servers", difference: "With a modulo, changing the number of servers changes the answer for almost every key. On a ring, only the keys next to the change move." },
    },
    code: {
      title: "A small consistent hash ring",
      src: `function hash(s: string): number {
  let h = 2166136261; // FNV-1a, a tiny non-cryptographic hash
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

class Ring {
  private points: { at: number; server: string }[] = [];
  constructor(servers: string[], private replicas = 100) { servers.forEach((s) => this.add(s)); }

  add(server: string) {
    for (let i = 0; i < this.replicas; i++) this.points.push({ at: hash(server + "#" + i), server });
    this.points.sort((a, b) => a.at - b.at);
  }

  homeOf(key: string) {
    const h = hash(key);
    // first point at or after h; wrap to the start. (Use binary search for O(log n).)
    return (this.points.find((p) => p.at >= h) ?? this.points[0]).server;
  }
}`,
    },
    pitfalls: [
      { text: "With one point per server the spread is uneven. Replica points smooth it out." },
      { text: "A very popular key still lands on one server. The ring balances keys, not traffic.", fix: "Cache or replicate the hot keys separately. The ring alone will not spread them." },
      { text: "Everything that was on a failed server has to be rebuilt somewhere else: caches go cold, and state must be recoverable.", fix: "Replicate data to the next servers on the ring, or make the state rebuildable." },
    ],
  },

  "cache-vs-gc": {
    how: {
      name: "Why a big long-lived cache costs a tracing collector",
      steps: [
        "A tracing garbage collector decides what is free by walking what is still reachable.",
        "A cache with millions of live entries is millions of things to walk, even if almost none of them became garbage.",
        "So the pause grows with the size of the live heap, not with how much garbage you created.",
        "Evicting an entry doesn't free it at that moment. It becomes garbage, and waits for the next pass.",
      ],
      cost: "Pause time scales with the live data the collector must scan. A smaller cache scans faster and misses more.",
      versus: { name: "a memory leak", difference: "A leak makes memory grow without limit. Here nothing leaked: the collector had to scan a large, long-lived cache, so the pause grew with the size of the cache." },
    },
    code: {
      title: "Measure the pauses before you blame anything",
      src: `import { PerformanceObserver } from "node:perf_hooks";

new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    console.log("gc pause ms:", e.duration.toFixed(1));
  }
}).observe({ entryTypes: ["gc"] });

// then grow a big Map and watch what the pauses do`,
    },
    pitfalls: [
      { text: "Shrinking the cache cuts the pauses but raises misses. Discord's p99 got worse." },
      { text: "Rewriting in another language is rarely the first move. Measure whether the collector is really the cause." },
      { text: "Tuning the collector's trigger does nothing if it isn't the trigger that's firing, as Discord found." },
    ],
    inspect: "In Chrome's Performance panel, tick Memory and record while using a page. Garbage collections show up as drops in the JS heap graph.",
  },

  "hot-partition": {
    how: {
      name: "Partition key plus time bucket, and its weak spot",
      steps: [
        "Choose a partition key so related rows live together: here the channel, plus a time bucket.",
        "Reads for one channel and bucket hit one place, which is fast and cache-friendly.",
        "But partitions are not equal: a huge community fills its partition far faster than a small group.",
        "A partition with disproportionate traffic becomes a hot partition, and the node serving it falls behind.",
      ],
      cost: "Reads are cheap for balanced keys, but one hot key can slow every other request that node serves.",
      versus: { name: "an unbalanced cluster", difference: "An unbalanced cluster has uneven data. A hot partition is uneven traffic: one key gets far more reads and writes than the rest, even when the data is spread evenly." },
    },
    code: {
      title: "A partition key with a time bucket",
      src: `// The window size here is made up. Choosing it is part of the design.
const BUCKET_MS = 10 * 24 * 60 * 60 * 1000;

const bucketOf = (messageTimeMs: number) => Math.floor(messageTimeMs / BUCKET_MS);
const partitionKey = (channelId: string, messageTimeMs: number) =>
  channelId + ":" + bucketOf(messageTimeMs);

// All messages with the same partitionKey are stored together.`,
    },
    pitfalls: [
      { text: "A smaller bucket spreads a busy channel over more partitions, but makes reading across time touch more of them." },
      { text: "A better database doesn't remove hot keys. The traffic shape stays the same." },
      { text: "Shield the store: cache hot reads and coalesce duplicate requests before they reach the database." },
    ],
  },

  "partition-key": {
    how: {
      name: "Shard by the key your queries already use",
      steps: [
        "List the queries. Find the field almost every one filters by. Here, the workspace.",
        "Use it as the partition key, so everything a query needs sits on one shard.",
        "Split the key space into many logical shards, much more than you have machines.",
        "Map logical shards to physical databases. Moving a logical shard to a new machine doesn't change the key.",
      ],
      cost: "Queries inside one tenant stay on one shard. Cross-tenant queries and big tenants are the expensive cases.",
      versus: { name: "replication", difference: "Replication copies the same data to more machines for safety and read capacity. Partitioning splits different data across machines, so that no machine holds all of it." },
    },
    code: {
      title: "Route a workspace to a shard",
      src: `const LOGICAL = 480;  // Notion's numbers, as a worked example
const PHYSICAL = 32;  // 15 logical shards per database

function route(workspaceId: string) {
  const logical = hash(workspaceId) % LOGICAL; // stable for the life of the data
  const physical = Math.floor(logical / (LOGICAL / PHYSICAL));
  return { logical, physical }; // the second mapping can change without re-hashing
}`,
    },
    pitfalls: [
      { text: "A very large tenant is still one key. Sharding spreads tenants, not the inside of one.", fix: "Split a huge tenant further, for example with a secondary key." },
      { text: "Queries that span tenants now cross shards, which is slow and loses single-host transactions.", fix: "Keep cross-tenant queries rare, or run them against a copy such as a replica or a data lake." },
      { text: "Too few logical shards makes rebalancing coarse. Too many adds overhead. Choose with growth in mind." },
    ],
  },

  "ownership-reasons": {
    how: {
      name: "Reason-based ownership tracking",
      steps: [
        "For each cached item, store why it is kept: a set of reasons, each with a meaningful, namespaced name such as user-saved, parent:travel or auto-download.",
        "A feature that needs the item adds its own reason. A feature that no longer needs it removes only its own.",
        "Releasing a reason reports whether any owner is left.",
        "Only when the set is empty does the item become a candidate for eviction.",
      ],
      cost: "A small set per item. In return, no feature can delete something another feature still needs, and you can always ask why an item is still here.",
      versus: {
        name: "reference counting",
        difference:
          "Reference counting stores how many references exist. Reason-based tracking stores who owns them, which makes every owner easy to inspect, debug and release independently.",
      },
    },
    code: {
      title: "A simplified ownership tracker",
      src: `type PageId = string;
type Reason = string; // namespaced: "user-saved", "parent:travel", "auto-download"

const reasons = new Map<PageId, Set<Reason>>();

function keep(pageId: PageId, reason: Reason) {
  let owners = reasons.get(pageId);
  if (!owners) {
    owners = new Set();
    reasons.set(pageId, owners);
  }
  owners.add(reason);
}

// true means no tracked owner remains, so the page is a candidate for eviction.
// It does not by itself make deleting it safe.
function release(pageId: PageId, reason: Reason): boolean {
  const owners = reasons.get(pageId);
  if (!owners) return false;
  owners.delete(reason);
  if (owners.size > 0) return false;
  reasons.delete(pageId);
  return true;
}

keep("japan-guide", "user-saved");
keep("japan-guide", "parent:travel");
if (release("japan-guide", "user-saved")) evictFromDisk("japan-guide"); // not yet: parent:travel remains`,
    },
    pitfalls: [
      {
        text: "A feature adds a reason and never removes it, so the page stays cached forever.",
        fix: "Tie each reason to a lifecycle, such as the parent page or a subscription, so it is released automatically.",
      },
      {
        text: "Two features use the same reason string, and one releases the other's ownership.",
        fix: "Namespace the reasons, for example parent:travel or auto-download.",
      },
      {
        text: "A parent keeps a whole subtree offline. Removing the parent has to release its reason on every descendant.",
        fix: "Walk the subtree when the parent changes, and guard against dependency cycles.",
      },
      {
        text: "A new reason arrives while another operation is evicting the same page.",
        fix: "Make adding a reason and evicting atomic, or recheck the set at the moment of eviction.",
      },
    ],
  },
};
