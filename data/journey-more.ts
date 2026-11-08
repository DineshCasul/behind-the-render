import type { Alternative, JourneyChapter } from "@/data/journey";

/**
 * Chapters added in the second content pass. Same rules as journey.ts: every
 * `docs` quote is copied word for word from the page it links to (checked by
 * fetching the page and testing each quote), and the narration only restates
 * what those quotes say. A leading or trailing "…" marks a quote cut from a
 * longer sentence.
 */

// ---- Sources ----

const FIGMA_MP = "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/";
const FIGMA_ORDER = "https://www.figma.com/blog/realtime-editing-of-ordered-sequences/";
const GH_CODE = "https://github.blog/engineering/architecture-optimization/crafting-a-better-faster-code-view/";
const GH_ISSUES = "https://github.blog/engineering/architecture-optimization/from-latency-to-instant-modernizing-github-issues-navigation-performance/";
const FB_REBUILD = "https://engineering.fb.com/2020/05/08/web/facebook-redesign/";
const WM_HERD = "https://diff.wikimedia.org/2020/12/17/wikimedias-cdn-datacenter-switchover/";
const UBER_RINGPOP = "https://www.uber.com/us/en/blog/ringpop-open-source-nodejs-library/";
const CF_SHARD = "https://blog.cloudflare.com/eliminating-cold-starts-2-shard-and-conquer/";
const DISCORD_RUST = "https://discord.com/blog/why-discord-is-switching-from-go-to-rust";
const DISCORD_STORE = "https://discord.com/blog/how-discord-stores-trillions-of-messages";
const NOTION_SHARD = "https://www.notion.com/blog/sharding-postgres-at-notion";
const NOTION_OFFLINE = "https://www.notion.com/blog/how-we-made-notion-available-offline";

const NOTES = {
  figmaMp: "Figma's October 2019 post about its multiplayer system. It describes that design, not necessarily today's code.",
  figmaOrder: "Figma's March 2017 post about ordering objects in multiplayer.",
  ghCode: "GitHub's June 2023 post about the code view. The numbers describe that work.",
  ghIssues: "GitHub's May 2026 post about Issues navigation. The numbers are GitHub's own and describe the rollout they measured.",
  fb: "Meta's May 2020 post about rebuilding Facebook.com. It describes that rebuild, not today's site.",
  wmHerd: "Wikimedia's December 2020 post, the last of a three-part series on its CDN. Their setup may have changed since.",
  ringpop: "Uber's February 2016 post introducing Ringpop. Ringpop has since been archived, but the idea it uses is still everywhere.",
  cf: "Cloudflare's September 2025 post about Workers. The percentages are Cloudflare's own and describe enterprise traffic after the rollout.",
  discordRust: "Discord's February 2020 post about one service, Read States. It describes that service and the Go it used then.",
  discordStore: "Discord's March 2023 post about storing messages. It describes their setup then.",
  notionShard: "Notion's October 2021 post about sharding. It describes that design.",
  notionOffline: "Notion's December 2025 post about Offline Mode. It describes that design.",
} as const;

const SWR_HTTP: Alternative = {
  name: "Plain HTTP caching",
  why: "Cache-Control: stale-while-revalidate lets a cache reuse a stale response while it revalidates. No client-side database needed.",
  href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control",
};

// ---- Figma ----

export const figmaMultiplayer: JourneyChapter = {
  id: "figma-multiplayer",
  trick: "last-writer-wins",
  title: "Who Wrote Last",
  note: NOTES.figmaMp,
  predict: {
    question: "In Figma, one person edits a text value from B to AB while another edits it from B to BC at the same moment. What ends up in the document?",
    options: ["ABC, both edits merged", "Either AB or BC, never ABC", "An error, and the edit is lost"],
    answer: 1,
    reveal: "Each property holds one value that a client sent. The server picks the order, so one edit wins whole.",
  },
  lines: [
    "Google Docs made operational transforms the famous way to do multiplayer. Figma looked at them and said no thanks.",
    "Their reason: OTs were unnecessarily complex for their problem space. So they built something simpler.",
    "A document is a two-level map: each object has properties, and each property has one value.",
    "The server keeps the latest value any client sent for each property. Change different properties and nothing conflicts.",
    "Change the same property on the same object, and the document just ends up with the last value the server saw.",
    "That is why simultaneous typing in one text value does not merge. Figma is a design tool, not a text editor, and they are fine with that.",
  ],
  docs: [
    {
      text: "A conflict happens when two clients change the same property on the same object, in which case the document will just end up with the last value that was sent to the server.",
      source: "Figma Blog: How Figma’s multiplayer technology works",
      href: FIGMA_MP,
    },
    {
      text: "This approach is similar to a last-writer-wins register in CRDT literature except we don’t need a timestamp because the server can define the order of events.",
      source: "Figma Blog: How Figma’s multiplayer technology works",
      href: FIGMA_MP,
    },
    {
      text: "If the text value is B and someone changes it to AB at the same time as someone else changes it to BC, the end result will be either AB or BC but never ABC.",
      source: "Figma Blog: How Figma’s multiplayer technology works",
      href: FIGMA_MP,
    },
    {
      text: "Since Figma is centralized (our server is the central authority), we can simplify our system by removing this extra overhead and benefit from a faster and leaner implementation.",
      source: "Figma Blog: How Figma’s multiplayer technology works",
      href: FIGMA_MP,
    },
  ],
};

export const figmaOrder: JourneyChapter = {
  id: "figma-order",
  trick: "fractional-indexing",
  title: "Between Two Layers",
  note: NOTES.figmaOrder,
  lines: [
    "Layers have an order. Two people drag layers at the same time. How do you keep one agreed order?",
    "OT can do it, but Figma found it overkill: they did not need enormous sequences, and they did not need to avoid interleaving.",
    "Their trick is old and database-friendly: give every object a number, and sort the children by it.",
    "To insert between two objects, set the new index to the average of the two on either side.",
    "Reordering is then one edit to one value, no matter how many layers there are.",
  ],
  docs: [
    {
      text: "To insert between two objects, just set the index for the new object to the average index of the two objects on either side.",
      source: "Figma Blog: Realtime Editing of Ordered Sequences",
      href: FIGMA_ORDER,
    },
    {
      text: "Reordering an object only involves editing a single value",
      source: "Figma Blog: Realtime Editing of Ordered Sequences",
      href: FIGMA_ORDER,
    },
    {
      text: "We use arbitrary-precision fractions instead of 64-bit doubles so that we can’t run out of precision after lots of edits.",
      source: "Figma Blog: Realtime Editing of Ordered Sequences",
      href: FIGMA_ORDER,
    },
    {
      text: "Each index is stored as a string and averaging is done using string manipulation to retain precision.",
      source: "Figma Blog: Realtime Editing of Ordered Sequences",
      href: FIGMA_ORDER,
    },
    {
      text: "Interleaving concurrently inserted elements in a design is usually fine because the new objects likely don’t overlap.",
      source: "Figma Blog: Realtime Editing of Ordered Sequences",
      href: FIGMA_ORDER,
    },
  ],
};

// ---- GitHub ----

export const githubVirtual: JourneyChapter = {
  id: "github-virtual",
  trick: "virtual-list",
  title: "Only the Visible Lines",
  note: NOTES.ghCode,
  predict: {
    question: "GitHub's first, dead-simple code view rendered every line. For one huge 18,000-line file, roughly how long did the initial render take?",
    options: ["About 2 seconds", "About 27 seconds", "About 3 minutes"],
    answer: 1,
    reveal: "The post calls it the 27 second initial render. Virtualizing got it under a second.",
  },
  lines: [
    "GitHub built the code view the natural way first: take the advice that premature optimization is the root of all evil.",
    "It worked, until it did not. Performance scaled badly with the number of lines in the file.",
    "Their answer is called virtualization: look at the scroll position, and only put the visible lines in the DOM.",
    "That 27 second initial render dropped to under a second.",
    "And then the interesting bit: virtualization is not a cure-all. The browser's find-in-file only sees what is on the page.",
  ],
  docs: [
    {
      text: "Virtualization is a performance optimization technique that examines the scroll state of the page to determine what content to include in the DOM.",
      source: "The GitHub Blog: Crafting a better, faster code view",
      href: GH_CODE,
    },
    {
      text: "Remember that 27 second initial render? Virtualizing the file content gets that time down to under a second, and that number does not increase substantially even if we artificially remove our file size limit and pull in hundreds of megabytes of text.",
      source: "The GitHub Blog: Crafting a better, faster code view",
      href: GH_CODE,
    },
    {
      text: "Unfortunately, virtualization is not a cure-all.",
      source: "The GitHub Blog: Crafting a better, faster code view",
      href: GH_CODE,
    },
    {
      text: "The biggest problem was that without the entire text of the file on the page at once, the browser’s built-in find-in-file only surfaced results that are visible in the viewport.",
      source: "The GitHub Blog: Crafting a better, faster code view",
      href: GH_CODE,
    },
  ],
};

export const githubInstant: JourneyChapter = {
  id: "github-instant",
  trick: "local-first-navigation",
  title: "Instant From Local",
  note: NOTES.ghIssues,
  alternatives: [SWR_HTTP],
  predict: {
    question: "After GitHub rolled out its IndexedDB cache for Issues, what share of React navigations became instant? (It was 4% before.)",
    options: ["About 10%", "About 22%", "About 60%"],
    answer: 1,
    reveal: "Roughly 22%, up from 4%. A cache-hit ratio of about one third is why it was not higher.",
  },
  lines: [
    "Faster servers were not the plan. The plan was to change what the user waits for.",
    "Render instantly from locally available data, then revalidate in the background.",
    "That is stale-while-revalidate, with the cache in the browser's IndexedDB instead of a CDN.",
    "It is not free. The price is staleness, which GitHub measured and decided was an acceptable envelope.",
    "And since only about a third of navigations hit the cache, the next goal changed: have some usable data local by the time the user clicks.",
  ],
  docs: [
    {
      text: "Our approach was to shift work to the client and optimize perceived latency: render instantly from locally available data, then revalidate in the background.",
      source: "The GitHub Blog: From latency to instant",
      href: GH_ISSUES,
    },
    {
      text: "…approximately 22% of React navigations became instant…",
      source: "The GitHub Blog: From latency to instant",
      href: GH_ISSUES,
    },
    {
      text: "The main tradeoff is controlled staleness.",
      source: "The GitHub Blog: From latency to instant",
      href: GH_ISSUES,
    },
    {
      text: "Instead of trying to make prefetched data always fresh, we optimized for a cheaper and more scalable condition: make sure some usable data is already local by the time the user clicks.",
      source: "The GitHub Blog: From latency to instant",
      href: GH_ISSUES,
    },
  ],
};

// ---- Facebook ----

export const facebookNavigation: JourneyChapter = {
  id: "facebook-navigation",
  trick: "prefetch-before-click",
  title: "Before the Click",
  note: NOTES.fb,
  lines: [
    "A click is slow for one reason: nothing started until you did it.",
    "So Facebook starts early. It kicks off fetches when you hover or focus a link, and fetches on mousedown.",
    "A typical lazy-loaded React and Relay app needs two round trips: one for the code, then one for the data.",
    "Facebook fetches code and data in parallel, in a single round trip.",
    "And while the next page loads, the old one stays on screen instead of a blank flash. Much less jarring.",
  ],
  docs: [
    {
      text: "We kick off fetches early, preloading on hover or focus, and fetching on mousedown.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FB_REBUILD,
    },
    {
      text: "A “traditional” React/Relay app with lazy loaded routes results in two round trips.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FB_REBUILD,
    },
    {
      text: "Code and data are fetched in parallel, allowing us to download these in a single network round trip.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FB_REBUILD,
    },
    {
      text: "To provide a more fluid experience than just showing a blank screen when navigating, we use React Suspense transitions to continue rendering the previous route until the next route is either fully rendered or suspends into a “good” loading state with UI skeletons for the next page.",
      source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com",
      href: FB_REBUILD,
    },
  ],
};

// ---- Wikipedia ----

export const wikipediaHerd: JourneyChapter = {
  id: "wikipedia-herd",
  trick: "request-coalescing",
  title: "The Herd",
  note: NOTES.wmHerd,
  lines: [
    "A popular page is not cached yet. A thousand people ask for it in the same second. What happens?",
    "A naive cache treats them independently, finds a miss every time, and sends every single request to the application servers.",
    "That sort of issue is known as a cache stampede, or the thundering herd.",
    "The better approach: realise they all want the same object, send one request, and put everyone else on hold.",
    "Varnish does this by default. It is called request coalescing.",
  ],
  docs: [
    {
      text: "A naive HTTP caching software would consider all such requests independently, perform multiple cache lookups, find that the object is not in cache and send each and every request to the application servers; for particularly popular content, the resulting load can overwhelm the application.",
      source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover",
      href: WM_HERD,
    },
    {
      text: "A better approach consists of realizing that the multiple concurrent requests are really for the same object, sending one single request to the application while putting all clients on hold, caching the object, and finally sending the same cached response to all clients.",
      source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover",
      href: WM_HERD,
    },
    {
      text: "This is exactly the approach followed by Varnish by default, a technique known as request coalescing in Varnish terminology.",
      source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover",
      href: WM_HERD,
    },
  ],
};

// ---- Uber ----

export const uberRingpop: JourneyChapter = {
  id: "uber-ringpop",
  trick: "consistent-hashing",
  title: "The Ring",
  note: NOTES.ringpop,
  lines: [
    "Uber had many copies of the same app, running as independent workers. They wanted them to cooperate.",
    "So Ringpop gave them three things: a way to discover each other and detect failures, a way to divide the work, and a way to forward a request to whoever owns it.",
    "Dividing the work is done with consistent hashing.",
    "Their ring uses FarmHash for hashing, a red-black tree for the ring, and a uniform number of replica points per node.",
  ],
  docs: [
    {
      text: "Ringpop 1) uses FarmHash as its hashing function, 2) uses a red-black tree for its ring, and 3) adds a uniform number of replica points per node.",
      source: "Uber Blog: How Ringpop from Uber Engineering Helps Distribute Your Application",
      href: UBER_RINGPOP,
    },
    {
      text: "Consistent hashing to assign work across the workers.",
      source: "Uber Blog: How Ringpop from Uber Engineering Helps Distribute Your Application",
      href: UBER_RINGPOP,
    },
    {
      text: "A membership protocol that allows independent workers to discover each other and detect failures ( SWIM ).",
      source: "Uber Blog: How Ringpop from Uber Engineering Helps Distribute Your Application",
      href: UBER_RINGPOP,
    },
  ],
};

// ---- Cloudflare ----

export const cloudflareRing: JourneyChapter = {
  id: "cloudflare-ring",
  trick: "consistent-hashing",
  title: "Find Home",
  note: NOTES.cf,
  predict: {
    question: "After Cloudflare started routing each Worker to a home server, enterprise traffic went from 99.9% warm requests to 99.99%. How much did the cold start rate fall?",
    options: ["About 2x", "About 10x", "About 100x"],
    answer: 1,
    reveal: "0.1% of requests became 0.01%, a 10x decrease.",
  },
  lines: [
    "A cold start is the expensive part of a Worker's life: fetch the code, compile it, run it, then answer.",
    "Cloudflare used to hide it behind the TLS handshake. Workers got bigger, and the trick stopped being enough.",
    "So they asked a different question: not how to make cold starts faster, but how to have fewer of them.",
    "The answer: send each request to a server that already has the Worker loaded.",
    "To pick that server, they borrowed the cache's trick: a consistent hash ring.",
    "When a server joins or leaves, only the Workers just before it on the ring get re-homed. The rest are left alone.",
  ],
  docs: [
    {
      text: "To look up the home server of a Worker, first we hash its script, and then we find where it lies on the ring.",
      source: "Cloudflare Blog: Eliminating Cold Starts 2: shard and conquer",
      href: CF_SHARD,
    },
    {
      text: "If a new server appears for some reason, all the Workers that lie before it on the ring get re-homed, but none of the other Workers are disturbed.",
      source: "Cloudflare Blog: Eliminating Cold Starts 2: shard and conquer",
      href: CF_SHARD,
    },
    {
      text: "A naive sharding implementation might use a classic hash table mapping Worker script IDs to server addresses.",
      source: "Cloudflare Blog: Eliminating Cold Starts 2: shard and conquer",
      href: CF_SHARD,
    },
    {
      text: "Conversely, this means that the cold start rate went from 0.1% to 0.01% of requests, a 10x decrease.",
      source: "Cloudflare Blog: Eliminating Cold Starts 2: shard and conquer",
      href: CF_SHARD,
    },
  ],
};

// ---- Discord ----

export const discordGc: JourneyChapter = {
  id: "discord-gc",
  trick: "cache-vs-gc",
  title: "The Two-Minute Spike",
  note: NOTES.discordRust,
  predict: {
    question: "Discord's Go Read States service was fast most of the time. How often did the large latency spikes show up?",
    options: ["Roughly every 2 seconds", "Roughly every 2 minutes", "Roughly every 2 hours"],
    answer: 1,
    reveal: "Roughly every 2 minutes. Go forces a garbage collection run at least that often.",
  },
  lines: [
    "Read States tracks which channels and messages you have read. It is in the hot path: every connection, every message sent, every message read.",
    "The Go version had a Least Recently Used cache of them, and it was fast most of the time. Then, every couple of minutes, a latency spike.",
    "They suspected the garbage collector. Tuning it did nothing, because they were not allocating fast enough to trigger it more often.",
    "The real cause: the collector had to scan the entire LRU cache to decide what was still referenced.",
    "A smaller cache scanned faster, but then more requests missed and went to the database. The 99th percentile got worse.",
    "In the Rust rewrite, an evicted entry is freed immediately. No collector, no spikes.",
  ],
  docs: [
    {
      text: "It was fast most of the time, but every few minutes we saw large latency spikes that were bad for user experience.",
      source: "Discord Blog: Why Discord is switching from Go to Rust",
      href: DISCORD_RUST,
    },
    {
      text: "…the spikes were huge not because of a massive amount of ready-to-free memory, but because the garbage collector needed to scan the entire LRU cache in order to determine if the memory was truly free from references.",
      source: "Discord Blog: Why Discord is switching from Go to Rust",
      href: DISCORD_RUST,
    },
    {
      text: "Unfortunately, the trade off of making the LRU cache smaller resulted in higher 99th latency times.",
      source: "Discord Blog: Why Discord is switching from Go to Rust",
      href: DISCORD_RUST,
    },
    {
      text: "The latency of the Rust version was just as good as Go’s and had no latency spikes!",
      source: "Discord Blog: Why Discord is switching from Go to Rust",
      href: DISCORD_RUST,
    },
  ],
};

export const discordPartition: JourneyChapter = {
  id: "discord-partition",
  trick: "hot-partition",
  title: "The Busy Channel",
  note: NOTES.discordStore,
  lines: [
    "Discord stores messages in a database partitioned by channel, plus a bucket, which is a static time window.",
    "Every ID is a Snowflake, so messages sort by time. All messages for a channel and bucket live together.",
    "The catch: a small group of friends sends orders of magnitude fewer messages than a server with hundreds of thousands of people.",
    "One busy channel and bucket becomes a hot partition, and the node serving it falls behind.",
    "Moving to a new database did not remove the problem. Hot partitions can still happen, so they also improved the systems upstream of it.",
  ],
  docs: [
    {
      text: "We partition our messages by the channel they’re sent in, along with a bucket, which is a static time window.",
      source: "Discord Blog: How Discord Stores Trillions of Messages",
      href: DISCORD_STORE,
    },
    {
      text: "Within this partitioning lies a potential performance pitfall: a server with just a small group of friends tends to send orders of magnitude fewer messages than a server with hundreds of thousands of people.",
      source: "Discord Blog: How Discord Stores Trillions of Messages",
      href: DISCORD_STORE,
    },
    {
      text: "When we encountered a hot partition, it frequently affected latency across our entire database cluster.",
      source: "Discord Blog: How Discord Stores Trillions of Messages",
      href: DISCORD_STORE,
    },
    {
      text: "Hot partitions can still be a thing in ScyllaDB, and so we also wanted to invest in improving our systems upstream of the database to help shield and facilitate better database performance.",
      source: "Discord Blog: How Discord Stores Trillions of Messages",
      href: DISCORD_STORE,
    },
  ],
};

// ---- Notion ----

export const notionShard: JourneyChapter = {
  id: "notion-shard",
  trick: "partition-key",
  title: "The Right Key",
  note: NOTES.notionShard,
  predict: {
    question: "Notion split its Postgres data across many databases. Which key decides where a row lives?",
    options: ["The user's ID", "The workspace ID", "The page's creation date"],
    answer: 1,
    reveal: "Workspace ID. Each block belongs to exactly one workspace, and people mostly query inside one.",
  },
  lines: [
    "Notion's data is blocks, in trees that vary wildly in size. One big enterprise customer can generate more load than many personal workspaces combined.",
    "They chose application-level sharding: their own partitioning, their own routing, so they control the distribution.",
    "The key matters. Distributed joins are expensive, and transactions are typically limited to a single host.",
    "Every block belongs to exactly one workspace, and people mostly query within one. So the partition key is the workspace ID.",
    "Then the numbers: 480 logical shards evenly spread across 32 physical databases.",
  ],
  docs: [
    {
      text: "A single large enterprise customer, for instance, generates more load than many average personal workspaces combined.",
      source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion",
      href: NOTION_SHARD,
    },
    {
      text: "The choice of partition key also depends on application structure, since distributed joins are expensive and transactionality guarantees are typically limited to a single host.",
      source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion",
      href: NOTION_SHARD,
    },
    {
      text: "Since users typically query data within a single workspace at a time, we avoid most cross-shard joins.",
      source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion",
      href: NOTION_SHARD,
    },
    {
      text: "After crunching the numbers, we settled on an architecture consisting of 480 logical shards evenly distributed across 32 physical databases.",
      source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion",
      href: NOTION_SHARD,
    },
  ],
};

export const notionOffline: JourneyChapter = {
  id: "notion-offline",
  trick: "ownership-reasons",
  title: "Why It Is Offline",
  note: NOTES.notionOffline,
  lines: [
    "Offline mode needs a promise: a page you open offline is complete, not half-missing.",
    "Their first idea was one set of pages to keep, adding a page when you toggle it on and removing it when you toggle it off.",
    "It broke once pages could be kept for other reasons: automatic downloads, or because a parent page was offline.",
    "So they track the reason each page is offline, not just whether it is.",
    "A page leaves the offline set only when its last reason disappears.",
  ],
  docs: [
    {
      text: "Opening a page and seeing half the content “missing” would be a worse user experience than not being able to open it at all, and make conflict-resolution less predictable.",
      source: "Notion Blog: How we made Notion available offline",
      href: NOTION_OFFLINE,
    },
    {
      text: "Our solution was to maintain a forest of offline page trees that track the reasons that each page is being kept available offline.",
      source: "Notion Blog: How we made Notion available offline",
      href: NOTION_OFFLINE,
    },
    {
      text: "We should only remove a page from the offline set when the last reason disappears",
      source: "Notion Blog: How we made Notion available offline",
      href: NOTION_OFFLINE,
    },
  ],
};
