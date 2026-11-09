import type { TrickGroup } from "@/data/categories";

/**
 * Tricks: the named ideas behind how real websites work. Short on purpose: a
 * hook, two or three sentences, and (for some) a toy you can poke.
 *
 * A trick does not repeat its sources. It points at journey chapters
 * (`chapters`), and the quotes, links, alternatives and "which site" all come
 * from there (`data/journey.ts`), so a quote is only ever written down once.
 * The `idea` text only restates what those quotes say.
 *
 * `question` is one interview angle, written to stay inside what the
 * sources support and to flag where it is general engineering knowledge.
 */
interface Trick {
  slug: string;
  title: string;
  /** Which group of tricks it is listed under (see data/categories.ts). */
  group: TrickGroup;
  hook: string;
  /** One number worth remembering, taken from a verified quote for this trick. Shown big at the top of the page and on the lists. */
  stat?: { value: string; label: string };
  idea: string[];
  /** A poke-able toy for this trick, if there is one. Implemented in components/tricks. */
  toy?: "batching" | "nearby" | "ownership" | "ring";
  /** Journey chapter ids this trick is told in. */
  chapters: string[];
  /** Slugs of tricks worth reading next. */
  related: string[];
  question: {
    q: string;
    a: string;
    /** What an interviewer might ask next. Questions only, so nothing here needs a source. */
    followUps?: string[];
  };
}

export const tricks: Trick[] = [
  {
    slug: "request-batching",
    group: "faster",
    title: "Batch the Requests",
    hook: "Ten requests that wait on each other are ten waits.",
    stat: { value: "1 request", label: "a single network request for the minimal set of components a view needs" },
    idea: [
      "A waterfall is requests that wait on each other: one finishes, the next starts, and the user waits through all of them.",
      "YouTube's web team cut them by working out the minimal set of components a view needs, and batching them in a single network request.",
    ],
    toy: "batching",
    chapters: ["youtube-waterfall"],
    related: ["field-data"],
    question: {
      q: "A page makes six API calls when it loads and feels slow. Where do you start?",
      a: "Find out which calls depend on each other. Calls that don't can already run in parallel. A chain, where each call needs the previous answer, is a waterfall, and its cost is the number of round trips. Collapse the chain, for example by asking for the minimal set of data a view needs in one request, which is what YouTube's web team describes doing. Then measure again on a real device, not your laptop.",
      followUps: [
        "Which of the six calls could already run in parallel, and which cannot?",
        "What happens to the whole batch if one call fails?",
        "How would you cache a batched response?",
      ],
    },
  },
  {
    slug: "field-data",
    group: "faster",
    title: "Fix the Slowest Paint",
    hook: "Four to six seconds is a long time to stare at a watch page.",
    stat: { value: "76%", label: "of YouTube's mobile URLs passed Core Web Vitals, in the case study" },
    idea: [
      "YouTube's web team found Largest Contentful Paint clocking in at 4 to 6 seconds in some cases. They also tested what to show while the video loads: a solid black poster image showed the best results in user studies.",
      "They tracked the outcome in the field, on real devices. In the case study, 76% of YouTube's mobile website URLs passed Core Web Vitals thresholds. That is the figure they reported then, not today's.",
    ],
    chapters: ["youtube-paint", "youtube-waterfall"],
    related: ["request-batching", "adaptive-bitrate"],
    question: {
      q: "Lighthouse says the page is fast, but users say it's slow. What do you check?",
      a: "Lab data comes from one controlled test. Field data comes from real people on real devices and networks, and a page can pass in the lab and still fail in the field. Look at field data (the Chrome UX Report is one source) for the slow cases, then reproduce them. YouTube's team found some mobile watch pages with a Largest Contentful Paint of 4 to 6 seconds this way.",
      followUps: [
        "Why the 75th percentile, and not the average or the median?",
        "Your lab score is great but field data is poor. What would explain that?",
        "How would you collect and aggregate this without slowing the page down?",
        "You have a p75 for each of ten regions. Can you average them to get the global p75?",
      ],
    },
  },
  {
    slug: "adaptive-bitrate",
    group: "scale",
    title: "Don't Pick What the Device Can't Play",
    hook: "The best resolution is the one that doesn't stall.",
    stat: { value: "+7.1%", label: "time between rebuffers, for 0.4% lower resolution" },
    idea: [
      "YouTube used the Media Capabilities API to prevent its adaptive bitrate algorithm from automatically selecting resolutions that a device could not play smoothly.",
      "In the experiment, the mean time between rebuffers increased by 7.1%, while average resolution by video height only declined by 0.4%.",
    ],
    chapters: ["youtube-stream"],
    related: ["field-data"],
    question: {
      q: "Why would a player ever choose a lower resolution than the network allows?",
      a: "Because the network isn't the only limit: a device can struggle to play a resolution smoothly. If the player keeps choosing something the device can't handle, you get rebuffering. YouTube used the Media Capabilities API to stop its adaptive bitrate algorithm choosing those resolutions, and reported a 7.1% increase in mean time between rebuffers for a 0.4% decline in average resolution.",
      followUps: [
        "What stops the player flipping quality up and down every few seconds?",
        "Why does a player start at a low quality?",
        "What would you measure to decide that a change was an improvement?",
      ],
    },
  },
  {
    slug: "canvas-rendering",
    group: "native",
    title: "Paint It Yourself",
    hook: "HTML is one way to put a page on screen. A canvas is the other.",
    idea: [
      "Google announced that Docs would move from an HTML-based rendering approach to a canvas-based approach, to improve performance and consistency in how content appears across different platforms.",
      "The bill: some Chrome extensions rely on the way the backend of a Google Doc is structured and may not work as intended. Google said compatibility with assistive technologies such as screen readers would not be impacted.",
    ],
    chapters: ["docs-canvas", "docs-catch"],
    related: ["webassembly"],
    question: {
      q: "What do you give up when you render your UI to a canvas instead of HTML elements?",
      a: "Anything that relied on the page's structure. A canvas is a drawing surface, so there is no tree of elements for the browser, extensions or assistive technology to read unless you provide one. Google said extensions relying on how a Google Doc is structured might stop working as intended after the move, and that screen reader compatibility would not be impacted. Accessibility on a canvas is work you do on purpose.",
      followUps: [
        "How would you make a canvas app accessible?",
        "How do you know which shape the user clicked?",
        "When is the DOM still the better choice?",
      ],
    },
  },
  {
    slug: "webassembly",
    group: "native",
    title: "Ship Machine Code",
    hook: "Figma's editor is C++. The browser runs it.",
    stat: { value: "3x", label: "faster load after the switch to WebAssembly" },
    idea: [
      "Before WebAssembly, C++ code could be run in the browser by cross-compiling it to a subset of JavaScript known as asm.js. WebAssembly is a binary format for machine code, designed with browsers in mind and designed to be as fast as possible for the browser to parse.",
      "Figma reported that its load time improved by more than 3x after it switched to WebAssembly, regardless of document size.",
    ],
    chapters: ["figma-port", "figma-load", "figma-wasm-catch"],
    related: ["canvas-rendering"],
    question: {
      q: "Why was Figma's load time better with WebAssembly than with asm.js?",
      a: "Figma's post says the format was designed to be as fast as possible for the browser to parse, that WebAssembly parses around 20x faster than asm.js, and that it is trivial for browsers to cache the translation to native code. It reports a load time more than 3x better after the switch, regardless of document size. A takeaway for an interview: measure load time separately from steady-state speed, because a format can win at startup.",
      followUps: [
        "What kind of work benefits from WebAssembly, and what does not?",
        "What does a call between JavaScript and the module cost?",
        "How would you decide between shipping a module and optimising the JavaScript?",
      ],
    },
  },
  {
    slug: "server-rendering-service",
    group: "faster",
    title: "Rendering as a Service",
    hook: "Airbnb built a whole service just to render views on the server.",
    idea: [
      "Hypernova, Airbnb's open-source project, is a service for server-side rendering your JavaScript views. Your server uses a Hypernova client to submit an HTTP request to a Hypernova server, which computes the views into an HTML string and sends them back.",
      "In the browser, JavaScript is then used to progressively enhance the application and make it dynamic.",
    ],
    chapters: ["airbnb-fork", "airbnb-hollow-page"],
    related: [],
    question: {
      q: "What's the trade-off of putting server rendering in its own service?",
      a: "The web app makes an extra HTTP request to the renderer for every server-rendered page, and you now run and scale one more service. The README names the cost that matters most: generating pages on the server takes time, which can increase your page's TTFB. In exchange, rendering is separated from the main app. The request and response shape is what Hypernova describes: your server submits an HTTP request to a Hypernova server, which sends back HTML.",
      followUps: [
        "What is a hydration mismatch, and how would you cause one?",
        "What does server rendering cost on every request, and how would you reduce it?",
        "What does the user see between the first paint and hydration finishing?",
      ],
    },
  },
  {
    slug: "service-worker-cache",
    group: "native",
    title: "The App on the Device",
    hook: "Twitter Lite was 600KB over the wire. The Android app was 23.5MB.",
    stat: { value: "600KB vs 23.5MB", label: "the web app against the Android install" },
    idea: [
      "Twitter described its PWA as only 600KB over the wire, against 23.5MB of downloaded data needed to install the native Android app. A service worker script caches additional resources, enabling fast navigation to other screens.",
      "For the app as a whole, it reported a 65% increase in pages per session and a 75% increase in Tweets sent.",
    ],
    chapters: ["twitter-weight", "twitter-memory"],
    related: ["request-batching", "field-data"],
    question: {
      q: "What can a service worker do that a normal page can't?",
      a: "It is a script that sits between the page and the network and can cache resources, which is how Twitter Lite cached additional resources for fast navigation to other screens. Because it controls caching, you also have to plan how outdated files get replaced.",
      followUps: [
        "How do you ship an update to a site that a service worker has cached?",
        "Cache-first or network-first: which for the HTML, and which for images?",
        "What happens when the cache fills the device's storage?",
      ],
    },
  },
  {
    slug: "atomic-css",
    group: "faster",
    title: "Ship Less CSS",
    hook: "Facebook cut the CSS on its homepage by 80 percent.",
    stat: { value: "80%", label: "less CSS on the homepage" },
    idea: [
      "In its 2020 rebuild of Facebook.com, the team generated atomic CSS at build time and reduced the CSS on the homepage by 80 percent.",
      "The post explains why that works: atomic CSS has a logarithmic growth curve because it is proportional to the number of unique style declarations rather than to the number of styles and features the team writes.",
    ],
    chapters: ["facebook-weight", "facebook-styles"],
    related: ["loading-tiers"],
    question: {
      q: "Why can atomic CSS make a stylesheet smaller as an app grows?",
      a: "Facebook's post explains it: atomic CSS has a logarithmic growth curve because it is proportional to the number of unique style declarations rather than to the number of styles and features you write. In its 2020 rebuild the team generated atomic CSS at build time and reduced the CSS on the homepage by 80 percent.",
      followUps: [
        "Why does atomic CSS stop growing with the app?",
        "What goes wrong when two atomic classes set the same property?",
        "When would you not use atomic CSS?",
      ],
    },
  },
  {
    slug: "loading-tiers",
    group: "faster",
    title: "Load in Tiers",
    hook: "Not all JavaScript is equally urgent.",
    stat: { value: "3 tiers", label: "of JavaScript, split by urgency" },
    idea: [
      "Facebook split the JavaScript needed for the initial load into three tiers, using a declarative, statically analyzable API.",
      "It also streams slow data: with @defer, different sections of a response can be streamed as soon as they are ready. The idea is to load what the first paint needs first and let the rest follow.",
    ],
    chapters: ["facebook-tiers", "facebook-budget", "facebook-stream"],
    related: ["atomic-css", "request-batching"],
    question: {
      q: "How would you decide which JavaScript goes in the first load?",
      a: "Ask what the first paint and first interaction need, and load only that up front. Things that do not change what is on screen, like logging, can come later. Facebook describes splitting the JavaScript for the initial load into three tiers using a declarative, statically analyzable API.",
      followUps: [
        "How would you decide which code belongs in tier 1?",
        "What is the risk of loading tier 3 too early?",
        "How would you check that the tiers are working?",
      ],
    },
  },
  {
    slug: "layered-cache",
    group: "scale",
    title: "Two Layers of Memory",
    hook: "Over 90% of Wikimedia's read requests are served by its caches.",
    stat: { value: "90%+", label: "of read requests served by the caches" },
    idea: [
      "Wikimedia's post says that on a normal day over 90% of read requests are served by its caching solution. Each cache node ran Varnish twice: one in-memory instance for caching in RAM, and one instance for on-disk caching.",
      "If the request hits the in-memory cache, the HTTP response is sent back directly to the user.",
    ],
    chapters: ["wikipedia-edge", "wikipedia-layers", "wikipedia-limits"],
    related: ["service-worker-cache"],
    question: {
      q: "Why would a cache have both a RAM layer and a disk layer?",
      a: "RAM is fast but small, and disk is slower but holds much more, so a request that misses the fast layer can still be answered by the big one instead of reaching the origin. Wikimedia's post describes each cache node running one in-memory and one on-disk Varnish instance. A later post in the series is a useful caveat: it says the hit rate on the remote on-disk Varnish instances was very low, around 1%, and that it moved to Apache Traffic Server for on-disk caching.",
      followUps: [
        "How do you invalidate a copy that sits in several layers?",
        "Why not one big cache?",
        "What does a 90% hit rate mean for the other 10%?",
      ],
    },
  },
  {
    slug: "gradual-migration",
    group: "change",
    title: "Delete It Slowly",
    hook: "GitHub added jQuery in late 2007. In 2018 it announced it was gone.",
    stat: { value: "2007 → 2018", label: "from adding jQuery to announcing it was gone" },
    idea: [
      "GitHub.com pulled in jQuery 1.2.1 as a dependency in late 2007. Modern browsers later offered native equivalents, so the team could achieve everything it needed using standard browser APIs.",
      "It did not rewrite everything at once: it tracked jQuery usage over time, and a lint plugin would fail CI checks if anyone tried to use jQuery features. The expected prize was dropping a 30 kB dependency from its bundles.",
    ],
    chapters: ["github-library", "github-slow-burn"],
    related: ["loading-tiers", "migrate-live"],
    question: {
      q: "You want to remove a library that is used in thousands of places. What is the plan?",
      a: "Do not rewrite it in one go. Measure where it is used and track that number over time, stop new usage with a lint rule that fails CI, then chip away at the existing uses. That is the approach GitHub describes for jQuery: tracking usage and failing CI checks on new jQuery use.",
      followUps: [
        "How do you know when it is safe to delete the old code?",
        "How do you stop new uses of the old library from appearing?",
        "When is a full rewrite the better choice?",
      ],
    },
  },
  {
    slug: "migrate-live",
    group: "change",
    title: "Move It While It Runs",
    hook: "Migrate a database without switching the product off.",
    idea: [
      "Notion describes a general framework for a migration: double-write, backfill, verification, switch-over. Incoming writes get applied to both the old and new databases, the old data is migrated once double-writing has begun, the integrity of the new database is checked, and only then does the product switch to it.",
      "Both Notion and Discord checked before they switched. Notion used dark reads, which fetch data from both databases and compare it, and had the migration and the verification written by different people. Discord sent a small percentage of reads to both databases and compared the results.",
      "Both also kept the move cheap to finish or undo. Notion built and tested a reverse audit log in case it had to switch back. Discord rewrote its data migrator in Rust, which took the estimate from three months to nine days.",
    ],
    chapters: ["notion-move", "discord-move"],
    related: ["gradual-migration", "partition-key"],
    question: {
      q: "You need to move a live database to a new one with almost no downtime. What is your plan?",
      a: "In stages. First double-write, so every new write reaches both the old and the new database. Then backfill the old data, comparing record versions so an old copy never overwrites a newer write. Then verify before trusting it: read from both, compare, and log every difference, ideally with the checking written by someone other than the migration's author. Only then switch over, and keep a way back until I am sure. Notion describes this shape for its sharding move, and Discord dual-wrote and compared a small percentage of reads before it made ScyllaDB the primary database. The trade-off is that you run two systems for a while.",
      followUps: [
        "How do you stop a backfill from overwriting a newer write?",
        "What would you compare in a dark read, and what do you do on a mismatch?",
        "How do you decide when it is safe to flip the switch?",
        "How would you roll back after the switch?",
        "Why might built-in replication not be enough for the double-write?",
      ],
    },
  },
  {
    slug: "hexagon-grid",
    group: "scale",
    title: "Cut the Map into Hexagons",
    hook: "Uber turned the Earth into a grid of hexagons.",
    stat: { value: "1/7", label: "the area of a cell at each finer resolution" },
    idea: [
      "H3 is Uber's grid system: it divides areas of the Earth into hexagonal cells. Hexagons have only one distance between a hexagon centerpoint and its neighbors, and analysis on areas such as neighborhoods within a city is much more practical.",
      "It is hierarchical: each finer resolution has cells with one seventh the area of the coarser resolution.",
    ],
    toy: "nearby",
    chapters: ["uber-grid", "uber-zoom"],
    related: ["consistent-hashing"],
    question: {
      q: "How would you find the drivers near a rider without checking every driver?",
      a: "Put locations into grid cells, look up the rider's cell and the cells around it, and only work out exact distances for the drivers found there. Uber's H3 does the grid part with hexagons at several resolutions, and its post notes that hexagons have only one distance between a cell's centerpoint and its neighbors.",
      followUps: [
        "Why do neighbours matter when finding the nearest driver?",
        "How would you choose a resolution?",
        "What happens at the edge of a search ring?",
      ],
    },
  },
  {
    slug: "last-writer-wins",
    group: "sync",
    title: "Let the Server Pick the Winner",
    hook: "Figma looked at operational transforms and built something simpler.",
    idea: [
      "Figma's multiplayer servers keep track of the latest value any client has sent for a given property on a given object. Two people changing different properties never conflict.",
      "A conflict happens only when two clients change the same property of the same object. Then the document ends up with the last value that was sent to the server. Because the server is the central authority, it can define the order of events, so no timestamps are needed.",
      "The price: simultaneous editing of the same text value doesn't merge. Figma is a design tool, not a text editor.",
    ],
    chapters: ["figma-multiplayer", "figma-tree"],
    related: ["fractional-indexing", "ownership-reasons"],
    question: {
      q: "Two users edit the same field at the same time. How do you decide whose edit wins?",
      a: "Pick one rule and make it predictable. Figma's post describes last-writer-wins per property: the server defines the order and the last value it receives is the one that stays. The client shows its own pending change meanwhile so the screen doesn't flicker. Whether that is acceptable depends on the data: it's fine for a colour or a position, but it can't merge two people typing in one text field, which the post says Figma doesn't try to do.",
      followUps: [
        "Figma's post compares this to a last-writer-wins register from CRDT literature. What does the server being central let it skip?",
        "What happens to a user's own edit while it waits for the server to acknowledge it?",
        "Why can't it merge two people typing in the same text field?",
        "What would you change to support offline or peer-to-peer editing?",
      ],
    },
  },
  {
    slug: "fractional-indexing",
    group: "sync",
    title: "Put It Between",
    hook: "To move a layer, change one number.",
    stat: { value: "1 value", label: "edited to move a layer" },
    idea: [
      "Figma gives every object a number and sorts the children of a parent by it. To insert between two objects, it sets the new index to the average of the two on either side.",
      "Reordering then means editing a single value, however long the list is. Figma stores each index as a string and averages by string manipulation, so it can't run out of precision after lots of edits.",
      "Concurrent inserts can interleave, which would hurt a text editor but is usually fine for design layers, because new objects likely don't overlap.",
    ],
    chapters: ["figma-order"],
    related: ["last-writer-wins"],
    question: {
      q: "How would you let many people reorder a list at once without rewriting every item's position?",
      a: "Give each item a sortable key instead of an array position, and compute a new key between its neighbours when you insert. Figma's post describes averaging the two neighbouring indexes, using strings so precision never runs out. Moving an item is then one edit. The general trade-off, which the post also notes, is that concurrent inserts can interleave.",
      followUps: [
        "What goes wrong if you store positions as 0, 1, 2, and so on?",
        "What happens when two people insert into the same gap at once?",
        "What happens to a key after many inserts into one gap?",
      ],
    },
  },
  {
    slug: "virtual-list",
    group: "faster",
    title: "Draw Only What You See",
    hook: "A 27 second render dropped to under a second.",
    stat: { value: "27 s → <1 s", label: "initial render of a huge file" },
    idea: [
      "GitHub's first code view rendered every line, and performance scaled badly with the number of lines in the file.",
      "Virtualization looks at the scroll state of the page and decides what content to include in the DOM. Virtualizing the file content brought the 27 second initial render to under a second.",
      "It is not a cure-all. Without the whole file in the page, the browser's built-in find-in-file only found what was visible in the viewport, and GitHub treated losing it as a hard problem to solve.",
    ],
    chapters: ["github-virtual"],
    related: ["canvas-rendering", "local-first-navigation"],
    question: {
      q: "A page renders 20,000 rows and is unusably slow. What do you do, and what does it break?",
      a: "Render only the rows near the viewport and swap them as the user scrolls, which is what GitHub's post calls virtualization. What it can break is anything that relies on the whole content being in the DOM: the post's example is the browser's find-in-page, which only sees visible lines. Accessibility and text selection across the full document are the other usual casualties.",
      followUps: [
        "How do you handle rows of different heights?",
        "What does virtualization break for accessibility?",
        "When would pagination be the better choice?",
      ],
    },
  },
  {
    slug: "local-first-navigation",
    group: "faster",
    title: "Show It, Then Check It",
    hook: "GitHub made Issues feel instant without a faster server.",
    stat: { value: "4% → 22%", label: "of React navigations became instant" },
    idea: [
      "GitHub's approach was to shift work to the client and optimize perceived latency: render instantly from locally available data, then revalidate in the background.",
      "The cache lives in IndexedDB. After rollout, approximately 22% of React navigations became instant.",
      "The trade-off is controlled staleness, which GitHub measured. And since a cache only helps when it hits, the next goal was to make sure some usable data is already local by the time the user clicks.",
    ],
    chapters: ["github-instant"],
    related: ["service-worker-cache", "prefetch-before-click"],
    question: {
      q: "Your app's navigation feels slow even though the API is fast. What would you try?",
      a: "Remove the network from the path the user waits on: show cached data immediately and revalidate in the background, which GitHub's post calls render from local data then revalidate. Be ready to answer what happens when the data is stale. GitHub says staleness is the main tradeoff and measured it. A cache only helps on a hit, so it also matters how data gets there before the click, which is the idea behind prefetching.",
      followUps: [
        "How do you handle a stale view the user is about to act on?",
        "What is a good cache-hit ratio, and what do you do when it is low?",
        "What would you put in the cache key?",
      ],
    },
  },
  {
    slug: "prefetch-before-click",
    group: "faster",
    title: "Start Before the Click",
    hook: "Facebook starts loading when you hover.",
    stat: { value: "2 → 1", label: "network round trips for code and data" },
    idea: [
      "Meta's rebuilt Facebook.com kicks off fetches early, preloading on hover or focus, and fetching on mousedown.",
      "A traditional React and Relay app with lazy loaded routes needs two round trips, one for code and one for data. Facebook fetches code and data in parallel, in a single round trip.",
      "While the next page loads, React Suspense transitions keep rendering the previous route instead of showing a blank screen. The post says this is much less jarring and mimics standard browser behavior.",
    ],
    chapters: ["facebook-navigation", "facebook-routes"],
    related: ["local-first-navigation", "loading-tiers"],
    question: {
      q: "How do you make navigation in a single-page app feel instant?",
      a: "Start the work before the user finishes the click. Meta's post describes preloading on hover or focus, fetching code and data in parallel so there is one round trip instead of two, and keeping the previous page on screen until the next is ready. The risk is wasted bandwidth when a hover doesn't turn into a click, so you choose how eagerly to prefetch.",
      followUps: [
        "How would you prefetch on a touch device?",
        "When does prefetching make a site slower?",
        "Which URLs must never be prefetched?",
      ],
    },
  },
  {
    slug: "request-coalescing",
    group: "scale",
    title: "Stop the Stampede",
    hook: "A thousand requests for one cold page should cost one request.",
    stat: { value: "1 request", label: "sent to the application while every other client is put on hold" },
    idea: [
      "When many clients ask for the same page at the same moment and it isn't cached yet, a naive cache treats each request independently and sends them all to the application servers. For popular content the load can overwhelm the application.",
      "The better approach, as Wikimedia describes it: notice they are the same object, send one request to the application while putting all clients on hold, cache the object, and send the same response to everyone.",
      "Varnish does this by default, and calls it request coalescing. This problem is known as a cache stampede, or thundering herd.",
      "Discord's data services do the same in front of its database: if multiple users are requesting the same row at the same time, the database is only queried once. The first request spins up a worker task and later requests subscribe to it. Discord also routes by channel ID with consistent hashing, so requests for the same channel reach the same instance, which makes the coalescing more effective.",
    ],
    chapters: ["wikipedia-herd", "discord-shield"],
    related: ["layered-cache", "request-batching"],
    question: {
      q: "A cache entry expires and a thousand requests arrive in the same second. What happens, and how do you stop it?",
      a: "All thousand miss and hit the origin together: a cache stampede. Wikimedia's post describes the fix as request coalescing: send one request to the origin and make the others wait for its answer. The trade-off is that the waiting clients all depend on that one request, so it needs a timeout.",
      followUps: [
        "How is coalescing different from batching?",
        "What if the single request to the origin fails?",
        "How would you coalesce across several servers?",
      ],
    },
  },
  {
    slug: "consistent-hashing",
    group: "scale",
    title: "Hash Onto a Ring",
    hook: "Add a server and only a slice of the work moves.",
    stat: { value: "0.1% → 0.01%", label: "cold start rate on enterprise traffic" },
    idea: [
      "A naive way to assign work to servers is a hash table from an id to a server address. It works until servers come and go, and servers do: they crash, get rebooted and decommissioned.",
      "A consistent hash ring maps both the work and the servers onto a number line that wraps around. To find a Worker's home server, Cloudflare hashes its script and takes the first server on or after that position. If a server appears, only the Workers before it on the ring get re-homed. None of the others are disturbed.",
      "Uber's Ringpop uses the same idea to assign work across workers. Cloudflare used it to send requests to servers that already have the code loaded, and its enterprise cold start rate went from 0.1% to 0.01%.",
      "Wikimedia's cache design up to 2018 used consistent hashing twice. The load balancer picks a cache node by hashing the client IP, and the in-memory Varnish hashes the request URL to pick another node whose on-disk Varnish to ask.",
    ],
    toy: "ring",
    chapters: ["uber-ringpop", "cloudflare-ring", "wikipedia-path"],
    related: ["hexagon-grid", "partition-key"],
    question: {
      q: "Why use consistent hashing instead of hash(key) % number_of_servers?",
      a: "With a plain modulo, changing the number of servers changes the answer for almost every key, so almost everything moves. Cloudflare describes the same trouble with a hash table from script IDs to server addresses: servers crash, get rebooted and decommissioned, the table changes size, and the whole table has to be re-hashed. On its ring, when a server is added, only the Workers lying before it get re-homed.",
      followUps: [
        "What happens to the keys on a server that fails?",
        "Why do real rings give each server many points?",
        "How would you handle one extremely popular key?",
      ],
    },
  },
  {
    slug: "cache-vs-gc",
    group: "scale",
    title: "The Cache the Collector Scanned",
    hook: "Discord's service spiked every two minutes, and the cache was the cause.",
    stat: { value: "~2 min", label: "between latency spikes in the Go service" },
    idea: [
      "Discord's Go Read States service kept a Least Recently Used cache. It was fast most of the time, but every few minutes it saw large latency spikes.",
      "The spikes were huge not because there was a lot of memory to free, but because the garbage collector needed to scan the entire LRU cache to decide whether memory was still referenced. Shrinking the cache helped the spikes but raised 99th percentile latency, because more reads missed and went to the database.",
      "In the Rust version, an entry evicted from the cache is freed immediately, with no collector. Discord's load tests showed latency just as good as Go's, with no spikes. With no collector to feed, Discord raised the cache capacity to 8 million Read States.",
    ],
    chapters: ["discord-gc", "discord-rust"],
    related: ["layered-cache"],
    question: {
      q: "Your cache is large and your service has periodic latency spikes. What would you suspect?",
      a: "Per Discord's post, the garbage collector scanning a huge cache. They shrank the cache, which cut the spikes but hurt p99 because of cache misses, then moved to Rust where evicted entries are freed immediately. The takeaway is to look at what a runtime does with a big long-lived heap before blaming your own code.",
      followUps: [
        "How would you prove that the garbage collector is the cause?",
        "What are the trade-offs of shrinking the cache?",
        "What could you try before rewriting the service?",
      ],
    },
  },
  {
    slug: "hot-partition",
    group: "scale",
    title: "One Busy Channel",
    hook: "Partition by channel, then watch one channel melt a node.",
    idea: [
      "Discord partitions messages by the channel they're sent in, along with a bucket, which is a static time window. All messages for a channel and bucket are stored together.",
      "That has a pitfall: a server with a small group of friends sends orders of magnitude fewer messages than a server with hundreds of thousands of people. One channel and bucket that gets a lot of traffic is a hot partition, and Discord says it frequently affected latency across the whole database cluster.",
      "Moving to ScyllaDB didn't remove the problem. Hot partitions can still happen, so they also improved the systems upstream of the database to shield it.",
      "The shield is a layer of data services between the API and the database, with roughly one gRPC endpoint per database query and no business logic. Their big feature is request coalescing, and requests are routed by channel ID using consistent hashing, so all requests for one channel reach the same instance.",
    ],
    chapters: ["discord-cassandra", "discord-partition", "discord-shield"],
    related: ["partition-key", "request-coalescing"],
    question: {
      q: "You partition data by a natural key and one key gets far more traffic than the others. What now?",
      a: "That's a hot partition, and Discord's post says it can slow a whole cluster. A new database didn't fix it for them, so they put data services in front of the database. Those coalesce identical reads into one database query and route by channel ID with consistent hashing, so the same channel always reaches the same instance. Splitting the key further (Discord already adds a time bucket) is the other usual lever.",
      followUps: [
        "How would you detect a hot partition?",
        "How would you split a hot key?",
        "What protects the database from a hot read?",
      ],
    },
  },
  {
    slug: "partition-key",
    group: "scale",
    title: "Pick the Key That Keeps Data Together",
    hook: "Notion split its database by workspace, not by user.",
    stat: { value: "480 / 32", label: "logical shards across physical databases" },
    idea: [
      "Notion's data is trees of blocks that vary wildly in size, and one large enterprise customer generates more load than many personal workspaces combined.",
      "The partition key matters because distributed joins are expensive and transactions are typically limited to a single host. Each block belongs to exactly one workspace and users typically query within one, so Notion used the workspace ID, which avoids most cross-shard joins.",
      "They chose application-level sharding for control over the distribution, and settled on 480 logical shards evenly distributed across 32 physical databases.",
    ],
    chapters: ["notion-when", "notion-shard", "notion-480"],
    related: ["hot-partition", "consistent-hashing"],
    question: {
      q: "You're sharding a multi-tenant database. How do you choose the shard key?",
      a: "Notion's post gives the reasoning: pick a key that keeps related rows on one shard so queries avoid cross-shard joins, since distributed joins are expensive and transactions are usually limited to one host. For them that's the workspace ID. The post also separates 480 logical shards from 32 physical databases. It picked 480 because it is divisible by a lot of numbers, so hosts can be added or removed (32 to 40 to 48) while the shards stay evenly spread, where a power of 2 would force doubling the hosts. A single huge customer is still one key, which is the risk to name in an interview.",
      followUps: [
        "What would make workspace ID a bad partition key?",
        "How would you move a logical shard to a new database?",
        "How do you run a query across all workspaces?",
      ],
    },
  },
  {
    slug: "ownership-reasons",
    group: "sync",
    title: "Remember Why You Kept It",
    hook: "A page can be offline for several reasons. Delete it when the last one goes.",
    idea: [
      "Notion's Offline Mode needs a strong promise: a page you open offline is complete. Opening a page and seeing half the content missing would be worse than not opening it at all.",
      "Their first design was a single set of pages kept offline, added on toggle and removed on untoggle. It broke once pages could be offline for other reasons, such as automatic downloads or because a parent page was offline.",
      "So they track the reasons each page is offline, and only remove a page when the last reason disappears.",
    ],
    toy: "ownership",
    chapters: ["notion-storage", "notion-offline"],
    related: ["last-writer-wins", "service-worker-cache"],
    question: {
      q: "A cached item can be needed by several features. How do you decide when it is safe to delete?",
      a: "I wouldn't let individual features delete shared cached items. I'd keep a set of ownership reasons for each item. When a feature needs it, it registers its own, uniquely named reason, and when it no longer needs it, it releases only that one. The item becomes a candidate for eviction only when the set is empty. That gives independent ownership, prevents accidental deletion, and makes debugging easy, because I can see exactly why an item is still cached. For production I'd also think about lifecycle management, persisted state, concurrent updates and cascading parent-child dependencies. It is the same idea as reference counting, except that it records who owns the references rather than how many there are. Notion's post describes tracking the reasons a page is offline and removing it when the last reason disappears.",
      followUps: [
        "How is this different from traditional reference counting?",
        "What happens if a feature forgets to release its reason?",
        "How would you handle parent-child cache dependencies?",
        "How would you prevent eviction while another operation is adding a reason?",
        "How would you make this work across several browser tabs?",
      ],
    },
  },
  {
    slug: "idempotency-keys",
    group: "scale",
    title: "Charge It Only Once",
    hook: "A retry should never charge a customer twice.",
    idea: [
      "A call between two machines can fail before it starts, halfway through, or after the work is done but before the reply gets back. Stripe's post says any one of these leaves the client in an uncertain situation.",
      "Its answer is idempotency: an endpoint that can be called any number of times while guaranteeing that side effects only occur once. For something like a charge, the client generates a unique ID for the operation and sends it with the request. If it fails, the client retries with the same ID. If the work already happened, the server replies with a cached result of the successful operation.",
      "The retrying should be polite too. Stripe recommends exponential backoff, so clients are not hammering a downed server, plus random jitter so they do not all retry at once, which it calls the thundering herd problem.",
    ],
    chapters: ["stripe-idempotency"],
    related: ["rate-limiting", "migrate-live"],
    question: {
      q: "A client calls your payment API, the connection drops, and it does not know if the charge happened. How do you make retrying safe?",
      a: "Idempotency keys. The client generates a unique ID for the operation and sends it with the request, and it reuses the same ID on every retry. The server stores the outcome against that ID. If the work already happened, a retry just gets the saved result back instead of charging again. Stripe takes the key in an Idempotency-Key header on its mutating endpoints. I would also have the client back off exponentially with some random jitter, so a crowd of retries does not hit a struggling server all at once.",
      followUps: [
        "What do you do if two requests with the same key arrive at the same time?",
        "How long would you keep a key, and what does it cost to store them?",
        "What if a retry arrives with the same key but a different body?",
        "Which HTTP methods are already idempotent, and why does a charge still need a key?",
        "Why add jitter, and not only exponential backoff?",
      ],
    },
  },
  {
    slug: "rate-limiting",
    group: "scale",
    title: "Say No Politely",
    hook: "One noisy user should not take the API down for everyone.",
    stat: { value: "4", label: "kinds of limiter Stripe runs in production" },
    idea: [
      "Stripe separates two things. A rate limiter looks at the user who is making the request. A load shedder makes its decisions based on the whole state of the system, and drops low-priority traffic so the core keeps working.",
      "It runs four: a request rate limiter (each user gets N requests per second, with room to burst), a concurrent requests limiter (only so many requests in progress at once), a fleet usage load shedder (a share of the fleet is always kept for critical requests), and a worker utilization load shedder (the last line of defense, which sheds lower-priority traffic when workers back up).",
      "The mechanism is a token bucket kept in Redis. It also says how to launch one safely: fail open if the limiter itself breaks, keep a kill switch, and dark launch to watch the traffic it would block.",
    ],
    chapters: ["stripe-limits"],
    related: ["idempotency-keys", "request-coalescing"],
    question: {
      q: "How would you stop one customer from overwhelming your API?",
      a: "A rate limiter per customer, usually a token bucket: every request takes a token, tokens drip back in at a steady rate, and an empty bucket means the request is rejected with a 429. Allow a burst so a flash sale does not trip it. Then a second layer for emergencies, a load shedder that looks at the health of the whole system rather than one user, and drops low-priority traffic first so critical requests like charges keep working. I would build the per-user limiter first, put it behind a feature flag, make it fail open if the limiter breaks, and dark launch it so I can see who it would block before it blocks anyone.",
      followUps: [
        "Why fail open and not closed when the limiter breaks?",
        "Where would you keep the token buckets, and what happens when that store is slow?",
        "When would you return 429 and when 503?",
        "How is a rate limiter different from a load shedder?",
        "Why also limit concurrent requests, and not only requests per second?",
      ],
    },
  },
  {
    slug: "ngram-index",
    group: "scale",
    title: "Index the Substrings",
    hook: "Why not just grep? GitHub did the napkin math.",
    stat: { value: "96 s", label: "of 2,048 CPU cores to grep GitHub's code once, in GitHub's own napkin math" },
    idea: [
      "GitHub tried to answer \"why not just use grep?\" with numbers. Ripgrep manages about 0.6 GB per second per core, so even with all the code in memory and perfect parallelism it would saturate 2,048 CPU cores for 96 seconds to serve a single query.",
      "So it built an index: an ngram index, a special type of inverted index that is useful for looking up substrings of content. To search, it intersects the results of multiple lookups to find the documents where the string appears.",
      "Code search has its own needs: punctuation, no stemming, no stop words stripped, regular expressions. GitHub's post says that is why general text search products did not fit, and why it built its own engine, in Rust.",
    ],
    chapters: ["github-search"],
    related: ["partition-key", "request-coalescing"],
    question: {
      q: "How would you build a search that finds any substring in a huge pile of code, without scanning all of it?",
      a: "Pre-compute an index. Split every document into overlapping chunks of a few characters, say three, and map each chunk to the sorted list of documents that contain it. To search for a string, break it into the same chunks, look each one up, and intersect the lists. Only the documents that survive need a real check, for example against a regular expression. Scanning everything on each query does not scale: GitHub's napkin math for grep over its code came out at 96 seconds of 2,048 cores for one query. The lists can be bigger than memory, so I would read them lazily and stop once I have enough results.",
      followUps: [
        "Why trigrams and not single characters or whole words?",
        "How do you handle a query shorter than the chunk size?",
        "How would you spread the index across machines?",
        "How do you keep results consistent while new code is being indexed?",
        "Why not stem words or remove stop words for code?",
      ],
    },
  },
];

export const trickMap: Record<string, Trick> = Object.fromEntries(tricks.map((t) => [t.slug, t]));
