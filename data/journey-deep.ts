import type { JourneyChapter } from "@/data/journey";

/**
 * The deep chapters: the second reading of the five companies whose own posts
 * cover the most ground (Wikimedia, Meta, Figma, Discord, Notion). Same rules as
 * journey.ts: every `docs` quote is copied word for word from the page it links
 * to (npm run verify:quotes checks it), and the narration only restates what
 * those quotes say. A company's post is a snapshot, so each chapter carries its note.
 */

// ---- Sources ----

const WM_CDN = "https://diff.wikimedia.org/2020/10/14/wikimedias-cdn/";
const WM_SWITCH = "https://diff.wikimedia.org/2020/12/17/wikimedias-cdn-datacenter-switchover/";
const FB_REBUILD = "https://engineering.fb.com/2020/05/08/web/facebook-redesign/";
const FIGMA_MP = "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/";
const FIGMA_WASM = "https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/";
const DISCORD_RUST = "https://discord.com/blog/why-discord-is-switching-from-go-to-rust";
const DISCORD_STORE = "https://discord.com/blog/how-discord-stores-trillions-of-messages";
const NOTION_SHARD = "https://www.notion.com/blog/sharding-postgres-at-notion";
const NOTION_OFFLINE = "https://www.notion.com/blog/how-we-made-notion-available-offline";

const NOTE = {
  wmCdn: "Wikimedia's own post about its CDN up to 2018. Their setup has changed since.",
  wmSwitch: "Wikimedia's December 2020 post, the last of a three-part series on its CDN. Their setup may have changed since.",
  fb: "Meta's May 2020 post about rebuilding Facebook.com. It describes that rebuild, not today's site.",
  figmaMp: "Figma's October 2019 post about its multiplayer system. It describes that design, not necessarily today's code.",
  figmaWasm: "A 2017 post by Figma's co-founder. The numbers and browser details describe that moment.",
  discordRust: "Discord's February 2020 post about one service, Read States. It describes that service and the Go it used then.",
  discordStore: "Discord's March 2023 post about storing messages. It describes their setup then.",
  notionShard: "Notion's October 2021 post about sharding. It describes that design.",
  notionOffline: "Notion's December 2025 post about Offline Mode. It describes that design.",
} as const;

// ---- Wikipedia ----

export const wikipediaPath: JourneyChapter = {
  id: "wikipedia-path",
  trick: "consistent-hashing",
  title: "The Long Way Home",
  note: NOTE.wmCdn,
  predict: {
    question: "In Wikimedia's cache design up to 2018, what does the load balancer hash to pick a cache node?",
    options: ["The client IP", "The request URL", "The time of day"],
    answer: 0,
    reveal: "The client IP. The request URL is hashed one step later, to pick the node whose on-disk cache to ask.",
  },
  lines: [
    "You ask for a Wikipedia page. Your request does not go straight to a database. It goes to the closest cache it can find.",
    "Step one is GeoDNS, which routes you to the point of presence geographically closest to you.",
    "Inside it, a load balancer picks a cache node with consistent hashing on your IP address. If that node's in-memory Varnish has the page, the answer goes straight back to you.",
    "If not, the in-memory Varnish hashes the request URL to pick another node in the same point of presence, and asks that node's on-disk Varnish.",
    "Still a miss? The request moves on to the next point of presence, and finally to the origin. Requests between points of presence are encrypted, to preserve the privacy of users.",
    "On the way back, every cache along the route keeps a copy if Cache-Control and similar headers allow it. Yes, the same headers from the first chapter. They get everywhere.",
  ],
  docs: [
    { text: "Users are routed via GeoDNS to the PoP geographically closest to them.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "The load balancer picks a cache node by applying consistent hashing to the client IP.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "The in-memory Varnish applies consistent hashing on the request URL to pick another cache node within the PoP (local backend) and sends the HTTP request to the on-disk Varnish instance of the node so chosen.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "To preserve the privacy of our users, HTTP requests between PoPs need to be sent encrypted.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "The response goes back through the CDN (getting stored in the caches it traverses if allowed by Cache-Control and similar response headers) and finally reaches the user.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
  ],
};

export const wikipediaLimits: JourneyChapter = {
  id: "wikipedia-limits",
  trick: "layered-cache",
  title: "The Cache That Needed Restarting",
  note: NOTE.wmCdn,
  predict: {
    question: "To keep the 503 errors down, how often did Wikimedia end up restarting Varnish?",
    options: ["Once a year", "Twice a week", "Every hour"],
    answer: 1,
    reveal: "Twice a week. Weekly was not enough.",
  },
  lines: [
    "The two-layer design served Wikimedia well for a while. Then the on-disk layer started misbehaving.",
    "First, the hit rate on the remote on-disk Varnish instances was very low, around 1%. That whole hop existed as a workaround for Varnish lacking TLS support.",
    "Second, after a few days of production use, a sizable number of requests would result in 503 errors. The only cure was restarting Varnish.",
    "So they added a cron job to restart it weekly. Not enough. They restarted it twice a week. Nothing says serious engineering like a cron job holding up an encyclopedia.",
    "The way out was Apache Traffic Server, which supports persistent on-disk storage reliably, and HTTPS in both directions.",
  ],
  docs: [
    { text: "Generally speaking, the hit rates on remote on-disk Varnish instances have always been very low (around 1%).", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "Step (3) as detailed earlier in this post was there simply as a workaround for lack of TLS support in Varnish and could be avoided using an HTTPS-capable caching proxy instead.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "a sizable number of requests would result in 503 errors, and normal operation could be resumed only by restarting Varnish.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "As a bandaid, we introduced a cron-job restarting Varnish on a weekly basis.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "Unfortunately, this frequency of restarts did not prove to be sufficient, and we had to resort to restarting Varnish twice a week to reduce the frequency of user-facing outages.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
    { text: "A migration to ATS would solve our two major pain points with Varnish: it supports persistent storage on-disk reliably, as well as incoming and outgoing HTTPS.", source: "Wikimedia Diff: Wikimedia’s CDN up to 2018", href: WM_CDN },
  ],
};

export const wikipediaSwitchover: JourneyChapter = {
  id: "wikipedia-switchover",
  title: "The Fire Drill",
  note: NOTE.wmSwitch,
  lines: [
    "Once a year, Wikimedia runs a test: all cache misses are served from the secondary data center in Texas instead of the primary in Virginia.",
    "The point is to be sure the wikis can still work, with minimal downtime, even if the primary data center fails catastrophically. All wikis go read-only while it happens.",
    "In 2018, with Varnish, the routing changes alone took 2 of the 7 minutes of read-only time. They needed several configuration commits, and commands run in the right order on the right servers.",
    "With Apache Traffic Server, which supports TLS and resolves DNS records at runtime, switching needs only a bunch of DNS changes.",
    "A system you rehearse once a year is a system you can trust. A system you only rehearse in a disaster is a surprise.",
  ],
  docs: [
    { text: "Once per year we perform a test during which all cache misses and generally uncacheable traffic are served from the secondary data center in Texas instead of the primary in Virginia.", source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover", href: WM_SWITCH },
    { text: "The test is done to ensure that, with minimal downtime, all the wikis can still function even in case of catastrophic failures in the primary DC.", source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover", href: WM_SWITCH },
    { text: "During the switchover, all wikis have to be set temporarily as read-only. The operations mentioned in this section took 2 of the 7 minutes of read-only time during the 2018 switchover.", source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover", href: WM_SWITCH },
    { text: "It resolves DNS records at runtime, so no commands must be executed on cache servers to change their origins", source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover", href: WM_SWITCH },
    { text: "Switching the primary data center now requires only a bunch of DNS changes: returning the IP address of the application servers in Texas instead of those in Virginia.", source: "Wikimedia Diff: Wikimedia’s CDN: datacenter switchover", href: WM_SWITCH },
  ],
};

// ---- Facebook ----

export const facebookBet: JourneyChapter = {
  id: "facebook-bet",
  title: "The Bet",
  note: NOTE.fb,
  lines: [
    "Facebook.com launched in 2004 as a simple, server-rendered PHP website.",
    "In 2020 the team rebuilt it from scratch, guided by two mantras.",
    "The first: as little as possible, as early as possible. The second: engineering experience in service of user experience.",
    "The rest of this road follows the post: CSS first, then JavaScript, then data, then navigation.",
  ],
  docs: [
    { text: "Facebook.com launched in 2004 as a simple, server-rendered PHP website.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "As little as possible, as early as possible.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "Engineering experience in service of user experience.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
  ],
};

export const facebookStyles: JourneyChapter = {
  id: "facebook-styles",
  trick: "atomic-css",
  title: "Styles That Delete Themselves",
  note: NOTE.fb,
  lines: [
    "Atomic CSS fixed the size. Facebook also changed where the styles live.",
    "Styles are colocated with the components that use them, so they can be deleted in tandem. They are split into separate bundles only at build time.",
    "Dark mode got the same attitude: CSS variables for theming. Toggling themes does not require reloading the page.",
    "Code you delete is code you never have to ship. It is the only free optimisation.",
  ],
  docs: [
    { text: "we colocate our styles with our components so they can be deleted in tandem", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "only split them into separate bundles at build time.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "so we have switched to CSS variables for theming.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "toggling different themes doesn’t require reloading the page", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
  ],
};

export const facebookBudget: JourneyChapter = {
  id: "facebook-budget",
  trick: "loading-tiers",
  title: "The Budget",
  note: NOTE.fb,
  lines: [
    "Splitting code is not enough if the code keeps growing. So Facebook introduced per-product JavaScript budgets.",
    "Size monitoring on merge requests shows regressions and improvements, and triggers alerts.",
    "Some code is only needed by some people. For an experiment, the server checks it and sends down only the required version of the code.",
    "Other code depends on the data: those dependencies are decided at runtime, based on which data is returned from the back end.",
  ],
  docs: [
    { text: "To manage this, we’ve introduced per-product JavaScript budgets.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "Size monitoring on merge requests displays size regressions/improvements and triggers customizable alerts.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "the server is able to check the experiment and send down only the required version of the code.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "These dependencies are decided at runtime, based on which data is returned from the back end.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
  ],
};

export const facebookPreload: JourneyChapter = {
  id: "facebook-preload",
  title: "Data Before the Code",
  note: NOTE.fb,
  lines: [
    "On the new site, all data fetching goes through GraphQL.",
    "And with Relay, Facebook knows statically what data a page needs.",
    "So when the request arrives, the server can immediately start preparing the data, and download it in parallel with the code the page needs.",
    "The usual order is code first, then data. This turns it into both at once.",
  ],
  docs: [
    { text: "ensure that all data-fetching goes through GraphQL.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "With Relay, we know statically what data the page needs.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "it can immediately start preparing the necessary data and download it in parallel with the required code.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
  ],
};

export const facebookRoutes: JourneyChapter = {
  id: "facebook-routes",
  trick: "prefetch-before-click",
  title: "The Route Map",
  note: NOTE.fb,
  lines: [
    "To fetch the right things early, the client needs to know what each route needs. That knowledge is a route map.",
    "For Facebook, the route map is too large to send all at once. So route definitions are added during the session, as new links are rendered.",
    "Then there are EntryPoints: files that wrap a code-split point and transform inputs into queries.",
    "They are what let code and data be fetched in parallel, in a single network round trip.",
  ],
  docs: [
    { text: "For Facebook, this route map is too large to send all at once.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "Instead, we dynamically add route definitions to the route map during the session, as new links are rendered.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "EntryPoints, which are files that wrap a code-split point and transform inputs into queries.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
    { text: "Code and data are fetched in parallel, allowing us to download these in a single network round trip.", source: "Engineering at Meta: Rebuilding our tech stack for the new Facebook.com", href: FB_REBUILD },
  ],
};

// ---- Figma ----

export const figmaCatch: JourneyChapter = {
  id: "figma-wasm-catch",
  trick: "webassembly",
  title: "The Fine Print",
  note: NOTE.figmaWasm,
  predict: {
    question: "When Figma wrote its 2017 post, in which browser did it actually use WebAssembly?",
    options: ["Chrome", "Firefox", "Both"],
    answer: 1,
    reveal: "Firefox only. Chrome did not cache its translated WebAssembly code, which made Figma's page load slower with WebAssembly than with asm.js.",
  },
  lines: [
    "Figma gives its reasons. WebAssembly parses around 20x faster than asm.js. And it is trivial for browsers to cache the translation to native code, so the second load is much quicker.",
    "Not everything improved. Figma hoped the download would shrink too. It did not shrink by much, especially after compression.",
    "And WebAssembly has a limit: it can only load and store numbers, so it calls out to JavaScript to do anything interesting, like create DOM nodes or make network connections.",
    "In 2017 there was a browser catch too. Chrome did not cache its translated WebAssembly code, so at the time of writing Figma only used WebAssembly in Firefox. A snapshot of 2017, not today's news.",
  ],
  docs: [
    { text: "WebAssembly parses around 20x faster than asm.js.", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
    { text: "It’s trivial for browsers to cache the translation of a WebAssembly module to native code.", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
    { text: "We were hoping that enabling WebAssembly would automatically improve download size too but it didn’t end up shrinking by much, especially after compression.", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
    { text: "Since it can only load and store numbers, it needs to call out to JavaScript code to do anything interesting (create DOM nodes, make network connections, etc.).", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
    { text: "Unlike Firefox, Chrome doesn’t cache its translated WebAssembly code.", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
    { text: "Figma actually only uses WebAssembly in Firefox.", source: "Figma: WebAssembly cut Figma's load time by 3x", href: FIGMA_WASM },
  ],
};

export const figmaSetup: JourneyChapter = {
  id: "figma-setup",
  title: "The Setup",
  note: NOTE.figmaMp,
  lines: [
    "Before the clever part, the plumbing. Figma clients are web pages that talk to a cluster of servers over WebSockets.",
    "The servers spin up a separate process for each multiplayer document. Everyone editing that document connects to the same one.",
    "A document is a tree of objects, similar to the HTML DOM.",
    "Go offline for as long as you like. When you come back, the client downloads a fresh copy of the document, reapplies your offline edits on top of it, and carries on over a new WebSocket connection.",
  ],
  docs: [
    { text: "We use a client/server architecture where Figma clients are web pages that talk with a cluster of servers over WebSockets.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Our servers currently spin up a separate process for each multiplayer document which everyone editing that document connects to.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Every Figma document is a tree of objects, similar to the HTML DOM.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Figma lets you go offline for an arbitrary amount of time and continue editing.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "When you come back online, the client downloads a fresh copy of the document, reapplies any offline edits on top of this latest state, and then continues syncing updates over a new WebSocket connection.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
  ],
};

export const figmaObjects: JourneyChapter = {
  id: "figma-objects",
  title: "Born Offline",
  note: NOTE.figmaMp,
  lines: [
    "Creating and removing objects are explicit actions. Writing a property to an object ID that does not exist does not make an object appear.",
    "When an object is deleted, the server forgets all of its properties. The data lives on in the undo buffer of the client that performed the delete. If you undo, your client puts it all back.",
    "New objects need unique IDs even offline, so the server cannot hand them out. Instead every client gets a unique client ID, and includes it in the IDs it creates.",
  ],
  docs: [
    { text: "Objects cannot automatically be brought into existence by writing a property to an unassigned object ID.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "A big difference from this model is that Figma doesn’t store any properties of deleted objects on the server.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "That data is instead stored in the undo buffer of the client that performed the delete.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "This can be easily accomplished by assigning every client a unique client ID and including that client ID as part of newly-created object IDs.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Note that we can’t solve this by having the server assign IDs to newly-created objects because object creation needs to be able to work offline.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
  ],
};

export const figmaTree: JourneyChapter = {
  id: "figma-tree",
  trick: "last-writer-wins",
  title: "The Tree Problem",
  note: NOTE.figmaMp,
  predict: {
    question: "One client makes A a child of B while another makes B a child of A. What does Figma's server do with the update that would cause a cycle?",
    options: ["Accepts both", "Rejects it", "Picks one at random"],
    answer: 1,
    reveal: "It rejects parent updates that would cause a cycle. Clients cannot reject server changes, so a client can briefly hold a cycle it does not know about yet.",
  },
  lines: [
    "Arranging objects into a tree that every client agrees on is, Figma says, the most complicated part of its multiplayer system.",
    "The hard case is reparenting: moving an object from one parent to another. The approach that worked: store a link to the parent as a property on the child.",
    "That creates a new risk. One client makes A a child of B while another makes B a child of A, and now each is the other's parent.",
    "The server rejects any parent update that would cause a cycle. But clients cannot reject changes from the server, so a client can briefly hold a cycle it does not know about yet.",
    "The fix is blunt: temporarily parent the two objects to each other and remove them from the tree until the server rejects the client's change. The object disappears for a moment. Figma called it a simple solution to a very rare, temporary problem, and left it there.",
    "One more rule: the parent link and the position among its siblings are stored as a single property, so they update atomically.",
  ],
  docs: [
    { text: "Arranging objects in an eventually-consistent tree structure is the most complicated part of our multiplayer system.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "The approach we settled on was to represent the parent-child relationship by storing a link to the parent as a property on the child.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Figma’s multiplayer servers reject parent property updates that would cause a cycle, so this issue can’t happen on the server.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Clients can’t reject changes from the server because the server is the ultimate authority on what the document looks like.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "Figma’s solution is to temporarily parent these objects to each other and remove them from the tree until the server rejects the client’s change and the object is reparented where it belongs.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "This solution isn’t great because the object temporarily disappears, but it’s a simple solution to a very rare temporary problem so we didn’t feel the need to try something more complicated here such as breaking these temporary cycles on the client.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "The important part to mention here is that the parent link and this position must both be stored as a single property so they update atomically.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
  ],
};

export const figmaUndo: JourneyChapter = {
  id: "figma-undo",
  title: "Undo, With Other People",
  note: NOTE.figmaMp,
  lines: [
    "Undo is easy alone. With other people it gets weird: if they edited what you edited, what should undo do?",
    "Figma settled on a principle: if you undo a lot, copy something, and redo back to the present, the document should not change.",
    "To get there, an undo modifies the redo history at the time of the undo. A redo modifies the undo history at the time of the redo.",
  ],
  docs: [
    { text: "Undo history has a natural definition for single-player mode, but undo in a multiplayer environment is inherently confusing.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "if you undo a lot, copy something, and redo back to the present (a common operation), the document should not change.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
    { text: "This is why in Figma an undo operation modifies redo history at the time of the undo, and likewise a redo operation modifies undo history at the time of the redo.", source: "Figma Blog: How Figma’s multiplayer technology works", href: FIGMA_MP },
  ],
};

// ---- Discord ----

export const discordRust: JourneyChapter = {
  id: "discord-rust",
  trick: "cache-vs-gc",
  title: "No Collector, Bigger Cache",
  note: NOTE.discordRust,
  lines: [
    "In the Rust version, when a Read State is evicted from the LRU cache it is freed immediately. Nothing waits for a collector.",
    "Load testing: the latency was just as good as Go's, with no spikes. After a bit of profiling, Rust beat Go on every performance metric.",
    "Then the part that closes the loop. With no garbage collector to feed, the cache could grow again. Discord raised its capacity to 8 million Read States.",
    "And a footnote worth reading: Discord does not think you should rewrite everything in Rust just because.",
  ],
  docs: [
    { text: "So in the Rust version of the Read States service, when a user’s Read State is evicted from the LRU cache it is immediately freed from memory.", source: "Discord Blog: Why Discord is switching from Go to Rust", href: DISCORD_RUST },
    { text: "we were able to beat Go on every single performance metric", source: "Discord Blog: Why Discord is switching from Go to Rust", href: DISCORD_RUST },
    { text: "After the service ran successfully for a few days, we decided it was time to re-raise the LRU cache capacity.", source: "Discord Blog: Why Discord is switching from Go to Rust", href: DISCORD_RUST },
    { text: "increased the cache capacity to 8 million Read States.", source: "Discord Blog: Why Discord is switching from Go to Rust", href: DISCORD_RUST },
    { text: "To be clear, we don’t think you should rewrite everything in rust just because.", source: "Discord Blog: Why Discord is switching from Go to Rust", href: DISCORD_RUST },
  ],
};

export const discordCassandra: JourneyChapter = {
  id: "discord-cassandra",
  trick: "hot-partition",
  title: "The Cassandra Years",
  note: NOTE.discordStore,
  lines: [
    "In 2017, Discord ran 12 Cassandra nodes, storing billions of messages. At the beginning of 2022, it had 177 nodes and trillions of messages.",
    "The cluster was high-toil: the on-call team was frequently paged, and latency was unpredictable.",
    "In Cassandra, reads are more expensive than writes. And the team spent a large amount of time tuning the JVM's garbage collector and heap settings, because GC pauses caused latency spikes. You may notice a theme.",
  ],
  docs: [
    { text: "In 2017, we ran 12 Cassandra nodes, storing billions of messages.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "At the beginning of 2022, it had 177 nodes with trillions of messages.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "In Cassandra, reads are more expensive than writes.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "We also spent a large amount of time tuning the JVM’s garbage collector and heap settings, because GC pauses would cause significant latency spikes.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
  ],
};

export const discordShield: JourneyChapter = {
  id: "discord-shield",
  trick: "request-coalescing",
  title: "The Shield",
  note: NOTE.discordStore,
  lines: [
    "Discord's answer to hot partitions starts in front of the database: data services, intermediary services that sit between the API and the database clusters.",
    "They contain roughly one gRPC endpoint per database query, and intentionally contain no business logic.",
    "Their big feature is request coalescing. If many users ask for the same row at the same time, the database is queried once. The first request starts a worker task, and the rest subscribe to it.",
    "Picture a big announcement that notifies @everyone: users open the app and read it, sending tons of traffic to the database. That used to risk a hot partition.",
    "Upstream, consistent hash-based routing sends requests to the data services. For messages the routing key is the channel ID, so all requests for the same channel reach the same instance, which makes coalescing work better.",
    "It helped a lot, but it did not solve everything. Hot partitions still showed up on Cassandra, just less often. What it bought was time to prepare the ScyllaDB cluster.",
  ],
  docs: [
    { text: "we wrote what we refer to as data services — intermediary services that sit between our API monolith and our database clusters.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "They contain roughly one gRPC endpoint per database query and intentionally contain no business logic.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "The big feature our data services provide is request coalescing.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "If multiple users are requesting the same row at the same time, we’ll only query the database once.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "The first user that makes a request causes a worker task to spin up in the service. Subsequent requests will check for the existence of that task and subscribe to it.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "Let’s imagine a big announcement on a large server that notifies @everyone: users are going to open the app and read the message, sending tons of traffic to the database.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "We implemented consistent hash-based routing to our data services to enable more effective coalescing.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "For messages, this is a channel ID, so all requests for the same channel go to the same instance of the service.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "These improvements help a lot, but they don’t solve all of our problems.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "It buys us some time so that we can prepare our new optimal ScyllaDB cluster and execute the migration.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
  ],
};

export const discordMove: JourneyChapter = {
  id: "discord-move",
  trick: "migrate-live",
  title: "The Big Move",
  note: NOTE.discordStore,
  predict: {
    question: "After the move, how many Cassandra nodes did Discord's messages database turn into how many ScyllaDB nodes?",
    options: ["177 into 72", "177 into 17", "72 into 177"],
    answer: 0,
    reveal: "177 Cassandra nodes became 72 ScyllaDB nodes, and each ScyllaDB node has 9 TB of disk, up from an average of 4 TB per Cassandra node.",
  },
  lines: [
    "The requirement: migrate trillions of messages with no downtime. Step one is to start dual-writing new data to both Cassandra and ScyllaDB.",
    "The first migrator, ScyllaDB's Spark migrator, gave an estimated time to completion of three months. Too slow.",
    "So the team rewrote the migrator in Rust, on top of its data service library. It reads token ranges from a database, checkpoints them locally via SQLite, and firehoses them into ScyllaDB. New estimate: nine days.",
    "It got to 99.9999% and stuck. The last token ranges contained gigantic ranges of tombstones that Cassandra had never compacted away. They compacted that range, and seconds later it was done.",
    "Before the switch, a small percentage of reads were sent to both databases and the results compared. Then they flipped the switch.",
    "The result: 177 Cassandra nodes became 72 ScyllaDB nodes, and fetching historical messages went from a p99 of 40-125ms to 15ms.",
  ],
  docs: [
    { text: "we need to migrate trillions of messages with no downtime, and we need to do it quickly", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "We begin dual-writing new data to Cassandra and ScyllaDB and concurrently begin to provision ScyllaDB’s Spark migrator.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "once we get it set up, we have an estimated time to completion: three months.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "It reads token ranges from a database, checkpoints them locally via SQLite, and then firehoses them into ScyllaDB.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "get a new estimate: nine days!", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "Our migrator is timing out reading the last few token ranges of data because they contain gigantic ranges of tombstones that were never compacted away in Cassandra.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "We performed automated data validation by sending a small percentage of reads to both databases and comparing results, and everything looked great.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "we’re going from running 177 Cassandra nodes to just 72 ScyllaDB nodes.", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
    { text: "fetching historical messages had a p99 of between 40-125ms on Cassandra, with ScyllaDB having a nice and chill 15ms p99 latency", source: "Discord Blog: How Discord Stores Trillions of Messages", href: DISCORD_STORE },
  ],
};

// ---- Notion ----

export const notionWhen: JourneyChapter = {
  id: "notion-when",
  trick: "partition-key",
  title: "When to Shard",
  note: NOTE.notionShard,
  lines: [
    "By mid-2020, product usage was going to surpass the abilities of the Postgres monolith that had served Notion through five years and four orders of magnitude of growth.",
    "The inflection point: the Postgres VACUUM process began to stall consistently, so the database could not reclaim disk space from dead tuples.",
    "Why not just buy a bigger server? Query performance and upkeep processes often begin to degrade well before a table reaches the maximum hardware-bound size.",
    "So they chose application-level sharding: their own partitioning scheme, with queries routed from application logic.",
  ],
  docs: [
    { text: "By mid-2020, it was clear that product usage would surpass the abilities of our trusty Postgres monolith, which had served us dutifully through five years and four orders of magnitude of growth.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "For us, the inflection point arrived when the Postgres VACUUM process began to stall consistently, preventing the database from reclaiming disk space from dead tuples.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Query performance and upkeep processes often begin to degrade well before a table reaches the maximum hardware-bound size", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "We decided to implement our own partitioning scheme and route queries from application logic, an approach known as application-level sharding.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
  ],
};

export const notion480: JourneyChapter = {
  id: "notion-480",
  trick: "partition-key",
  title: "Why 480",
  note: NOTE.notionShard,
  predict: {
    question: "Why did Notion pick 480 logical shards and not 512?",
    options: [
      "480 has many factors, so hosts can be added in small steps",
      "Postgres cannot handle more than 480 schemas",
      "It matched the number of workspaces at the time",
    ],
    answer: 0,
    reveal: "480 is divisible by a lot of numbers, which gives flexibility to add or remove hosts while keeping shards evenly spread. Any power of 2 would require doubling the hosts.",
  },
  lines: [
    "Notion had to pick numbers. It set an upper bound of 500 GB per table and 10 TB per physical database.",
    "It settled on 480 logical shards across 32 physical databases. An odd number, if you think computer science runs on powers of two.",
    "The point is that 480 is divisible by a lot of numbers. That gives flexibility to add or remove hosts while keeping the shards evenly spread. 32 hosts can become 40, then 48.",
    "With a power of 2, you would have to double the hosts every time. Pick values with a lot of factors.",
    "One more design choice: all routing lives in the application, so there is a single source of truth from a workspace ID to a logical shard.",
  ],
  docs: [
    { text: "To keep Postgres humming and preserve RDS replication guarantees, we set an upper bound of 500 GB per table and 10 TB per physical database.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "The point is, 480 is divisible by a lot of numbers — which provides flexibility to add or remove physical hosts while preserving uniform shard distribution.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "For example, in the future we could scale from 32 to 40 to 48 hosts, making incremental jumps each time.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Any power of 2 would require us to double the number of physical hosts to upscale.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Pick values with a lot of factors!", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "We wanted a single source of truth for routing from a workspace ID to a logical shard, so we opted to construct the tables separately and perform all routing in the application.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
  ],
};

export const notionMove: JourneyChapter = {
  id: "notion-move",
  trick: "migrate-live",
  title: "The Move",
  note: NOTE.notionShard,
  lines: [
    "To move to shards, Notion followed a general framework: double-write, backfill, verify, switch over.",
    "For double-writing, they chose an audit log and a catch-up script over logical replication, because replication struggled to keep up with the block table's write volume during the initial snapshot.",
    "For the backfill, any backfill worth its salt compares record versions before writing old data, and skips records with more recent updates.",
    "Verification included dark reads: fetch from both databases, compare, discard the sharded copy, and log the discrepancies. The migration and the verification were written by different people, so one mistake would not be in both.",
    "They also built and tested a reverse audit log, in case they had to switch back. In the end, they did not need it.",
    "The switch-over itself cost five minutes of scheduled maintenance. Looking back, Notion says the bottleneck was double-write throughput: the catch-up script had to finish before the switch.",
  ],
  docs: [
    { text: "Earlier this year, we took Notion down for five minutes of scheduled maintenance.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Double-write: Incoming writes get applied to both the old and new databases.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Backfill: Once double-writing has begun, migrate the old data to the new database.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Verification: Ensure the integrity of data in the new database.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Switch-over: Actually switch to the new database.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "We chose the audit log strategy over logical replication, since the latter struggled to keep up with block table write volume during the initial snapshot step.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Any backfill worth its salt should compare record versions before writing old data, skipping records with more recent updates.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Introducing dark reads increased API latency, but provided confidence that the switch-over would be seamless.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "As a precaution, the migration and verification logic were implemented by different people.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "In the end, we didn't need to revert, but it was an important piece of our contingency plan.", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
    { text: "Double-write throughput was the primary bottleneck in our final switch-over", source: "Notion Blog: Herding elephants: lessons learned from sharding Postgres at Notion", href: NOTION_SHARD },
  ],
};

export const notionStorage: JourneyChapter = {
  id: "notion-storage",
  trick: "ownership-reasons",
  title: "Best Effort Is Not Enough",
  note: NOTE.notionOffline,
  lines: [
    "For years, Notion has used SQLite to cache records locally and speed up page loads.",
    "That cache was best-effort: no guarantees about which records would be available, or for how long. Fine when you are online. If something is missing, ask the server.",
    "Offline mode needs a much stronger guarantee. A page has to be fully usable without a network connection, which means downloading every record the page depends on, and keeping them up to date.",
  ],
  docs: [
    { text: "For years, Notion has used SQLite to cache records locally and speed up page loads.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "This cache was best-effort: It didn't have guarantees about which records would be available or for how long.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "A page had to be fully usable without a network connection, which meant downloading every record that the page depends on and keeping those records up to date over time.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
  ],
};

export const notionSync: JourneyChapter = {
  id: "notion-sync",
  title: "Keeping It Fresh",
  note: NOTE.notionOffline,
  lines: [
    "A downloaded page has to stay fresh as other people edit it. No one wants to open all their pages before a flight just to get the latest versions.",
    "The first idea: clients periodically poll the server for each offline page. It worked in early testing, but would not scale to millions of users and devices.",
    "Instead, the server emits a message on a channel for a page whenever a batch of updates is applied. Clients subscribe to the channels of their offline pages, and fetch the latest changes when a message arrives.",
    "Coming back online, a client compares its lastDownloadedTimestamp for each page with the server's lastUpdatedTime, and only fetches pages where the server version is newer.",
  ],
  docs: [
    { text: "No one wants to open all their pages before a flight just to get the latest versions.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "One approach was to have clients periodically poll the server for each of their offline pages and download the latest versions. This worked in early testing but wouldn't scale to millions of users and devices.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "Instead, we wired up push-based updates into our existing page version snapshot system.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "Whenever a batch of updates is applied to a page, the server emits a message on a channel for that page.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "Each client tracks a lastDownloadedTimestamp for every offline page.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
    { text: "On reconnect, we compare that timestamp with the server's lastUpdatedTime and only fetch pages where the server version is newer.", source: "Notion Blog: How we made Notion available offline", href: NOTION_OFFLINE },
  ],
};
