/**
 * What each site is about, and (for the five with the most first-party material)
 * how its pieces fit together. Keyed by site id (data/journey.ts).
 *
 * `intro` is shown as the first card of the walk. `flows` are shown when the walk
 * ends, as numbered steps; each step names the chapter whose quotes back it, and
 * the page lets you jump there. A flow step only says what that chapter's quotes
 * say. Where a company's post gives no single timeline, the flow's `note` says so.
 *
 * Voice: the same as the rest of the site. Dry, a little playful, and the jokes
 * never change a fact. No em dashes.
 */
export interface FlowStep {
  text: string;
  /** The chapter id whose quotes support this step (data/journey.ts, data/journey-more.ts, data/journey-deep.ts). */
  chapter: string;
}

export interface Flow {
  title: string;
  /** Said under the title when the source does not give this order itself. */
  note?: string;
  steps: FlowStep[];
}

export interface SiteOverview {
  intro: string;
  flows?: Flow[];
}

export const siteOverviews: Record<string, SiteOverview> = {
  youtube: {
    intro:
      "YouTube's web team wrote up three problems and their fixes: watch pages that took 4 to 6 seconds to paint their biggest element on some phones, a chain of requests that waited on each other, and a player that picked resolutions a device could not play smoothly. The numbers come from Google's own case studies.",
  },

  facebook: {
    intro:
      "Facebook.com launched in 2004 as a simple, server-rendered PHP website. In 2020 the team rebuilt it and wrote up how. This road follows that post in order: CSS, JavaScript, data, then navigation, all under two mantras. As little as possible, as early as possible. And engineering experience in service of user experience.",
    flows: [
      {
        title: "From request to interactive, the post's pieces in order",
        note: "The post does not give one timeline. This puts its pieces in the order they would apply.",
        steps: [
          { text: "A request arrives. Because Relay knows statically what data the page needs, the server can start preparing the data right away and download it in parallel with the code.", chapter: "facebook-preload" },
          { text: "Slow parts do not hold the page back: @defer streams sections of a response as they are ready, and each feed story is sent as soon as it is ready.", chapter: "facebook-stream" },
          { text: "Tier 1 JavaScript is the layout for the first paint, skeletons included.", chapter: "facebook-tiers" },
          { text: "Tier 2 is everything needed to fully render what is above the fold. Tier 3, like logging, only needs to arrive after display.", chapter: "facebook-tiers" },
          { text: "Throughout, the CSS is small: generated as atomic CSS at build time, with styles colocated with their components so they can be deleted together.", chapter: "facebook-styles" },
          { text: "Per-product budgets, experiment checks on the server and data-driven code keep the JavaScript from growing back.", chapter: "facebook-budget" },
          { text: "On the next click, hovering or focusing a link preloads, mousedown fetches, and code and data arrive in one round trip while the old page stays on screen.", chapter: "facebook-navigation" },
        ],
      },
    ],
  },

  wikipedia: {
    intro:
      "Wikimedia runs its own CDN, built from open source software, and has written about how it works. This road follows one read request through the caches, then looks at what broke, what replaced it, what stops a stampede on a cold page, and how the whole thing practises switching data centers.",
    flows: [
      {
        title: "A read request, start to finish",
        steps: [
          { text: "GeoDNS routes you to the point of presence geographically closest to you.", chapter: "wikipedia-path" },
          { text: "A load balancer picks a cache node by hashing your IP. If that node's in-memory Varnish has the page, the response goes straight back.", chapter: "wikipedia-path" },
          { text: "On a miss, the in-memory Varnish hashes the request URL to pick a node, and asks that node's on-disk Varnish.", chapter: "wikipedia-path" },
          { text: "Still a miss: the request goes to the next point of presence, encrypted, and finally to the origin.", chapter: "wikipedia-path" },
          { text: "On the way back, each cache keeps a copy if Cache-Control and similar headers allow it.", chapter: "wikipedia-path" },
          { text: "If a thousand people ask for an uncached page at once, one request goes to the application and everyone else waits for it.", chapter: "wikipedia-herd" },
          { text: "Around all this: the on-disk Varnish layer needed restarting twice a week, so it was replaced with Apache Traffic Server.", chapter: "wikipedia-limits" },
          { text: "And once a year, Wikimedia rehearses serving cache misses from the secondary data center.", chapter: "wikipedia-switchover" },
        ],
      },
    ],
  },

  github: {
    intro:
      "GitHub's posts here are about doing less. Removing a library without a rewrite. Drawing only the lines of a file you can actually see. Opening an issue from data already on your machine, and checking the server afterwards.",
  },

  "google-docs": {
    intro:
      "In 2021 Google announced that Docs would stop building documents out of HTML elements and draw them on a canvas instead. The announcement says why it did that, and what the change might break.",
  },

  uber: {
    intro:
      "Uber has two ideas here, and both are about cutting a big problem into pieces: a grid of hexagons for the map, and a ring that shares work between servers.",
  },

  figma: {
    intro:
      "Figma is a design tool that runs in the browser. Its engineers wrote about three problems: loading a big C++ product quickly with WebAssembly, keeping many people editing one file, and keeping layers in a shared order. This road covers all three, including the parts that did not go perfectly.",
    flows: [
      {
        title: "One edit, from your hand to everyone's screen",
        steps: [
          { text: "You open a file. Switching to WebAssembly made the editor load more than 3x faster.", chapter: "figma-load" },
          { text: "Your page connects over WebSockets to the server process for that document, and downloads a copy of it.", chapter: "figma-setup" },
          { text: "You change a property. Your screen shows the change immediately, without waiting for the server.", chapter: "figma-multiplayer" },
          { text: "The server keeps the last value any client sent for each property, and it defines the order of events.", chapter: "figma-multiplayer" },
          { text: "If you reorder a layer, only one value changes: its index, the average of its new neighbours.", chapter: "figma-order" },
          { text: "If you move it to a new parent, the server rejects any update that would cause a cycle. A client can briefly show the object removed until the server settles it.", chapter: "figma-tree" },
          { text: "Undo is tricky with other people around, so an undo modifies the redo history at the time of the undo.", chapter: "figma-undo" },
          { text: "If you go offline, the client downloads a fresh copy on return and reapplies your offline edits on top.", chapter: "figma-setup" },
        ],
      },
    ],
  },

  airbnb: {
    intro:
      "Airbnb open-sourced Hypernova, a service whose whole job is server-side rendering JavaScript views. The README explains how a request flows through it, and how the browser takes over after.",
  },

  twitter: {
    intro:
      "Twitter Lite was a progressive web app: 600KB over the wire, against 23.5MB of downloaded data to install the native Android app. The case study reports what that did to how people used it.",
  },

  discord: {
    intro:
      "Discord's engineers wrote about three problems: a cache the garbage collector had to scan, one busy channel that slowed a whole database, and the move to a new database. This road follows all three, in the order they connect.",
    flows: [
      {
        title: "A busy channel, and what protects the database",
        steps: [
          { text: "Messages are partitioned by channel, plus a bucket that is a static time window. All messages for one channel and bucket live together.", chapter: "discord-partition" },
          { text: "A server of a few friends sends orders of magnitude fewer messages than one with hundreds of thousands of people.", chapter: "discord-partition" },
          { text: "A hot partition frequently affected latency across the whole Cassandra cluster.", chapter: "discord-partition" },
          { text: "Data services now sit between the API and the database. Identical reads at the same moment become one database query.", chapter: "discord-shield" },
          { text: "Requests are routed by channel ID with consistent hashing, so a channel always reaches the same instance, which makes the coalescing work better.", chapter: "discord-shield" },
          { text: "It helped, but hot partitions still happened, so the messages moved to ScyllaDB.", chapter: "discord-shield" },
          { text: "The move: dual-write, a Rust migrator, compared reads, then the switch.", chapter: "discord-move" },
          { text: "Afterwards 177 Cassandra nodes became 72 ScyllaDB nodes, and tail latencies dropped.", chapter: "discord-move" },
        ],
      },
      {
        title: "The Read States cache",
        steps: [
          { text: "Read States kept a Least Recently Used cache. It was fast most of the time, with latency spikes every few minutes.", chapter: "discord-gc" },
          { text: "The cause: the garbage collector had to scan the entire cache.", chapter: "discord-gc" },
          { text: "A smaller cache had smaller spikes, but more database loads and a worse 99th percentile.", chapter: "discord-gc" },
          { text: "In Rust, an evicted entry is freed immediately. No spikes.", chapter: "discord-rust" },
          { text: "With no collector to feed, the cache could be raised to 8 million Read States.", chapter: "discord-rust" },
        ],
      },
    ],
  },

  notion: {
    intro:
      "Notion wrote two long posts: how it split one Postgres database into many, and how it made pages work offline. Both come down to the same skill: choosing what to keep together, and keeping track of why.",
    flows: [
      {
        title: "Splitting the database",
        steps: [
          { text: "Product usage outgrew the Postgres monolith. The inflection point: the VACUUM process began to stall.", chapter: "notion-when" },
          { text: "Notion chose application-level sharding: its own partitioning scheme, with queries routed from application logic.", chapter: "notion-when" },
          { text: "The partition key is the workspace ID, because each block belongs to exactly one workspace and users query within one.", chapter: "notion-shard" },
          { text: "480 logical shards across 32 physical databases. 480 divides by lots of numbers, so hosts can be added in small steps.", chapter: "notion-480" },
          { text: "All routing lives in the application: one source of truth from a workspace ID to a logical shard.", chapter: "notion-480" },
          { text: "The move: double-write through an audit log, backfill, verify with dark reads, switch over.", chapter: "notion-move" },
        ],
      },
      {
        title: "Keeping a page offline",
        steps: [
          { text: "Notion's SQLite cache was best effort. Offline mode needs a guarantee that a page is fully usable.", chapter: "notion-storage" },
          { text: "So it tracks the reasons each page is offline, not just whether it is.", chapter: "notion-offline" },
          { text: "A page is removed from the offline set only when the last reason disappears.", chapter: "notion-offline" },
          { text: "Pages stay fresh through push: the server emits a message on a channel for a page, and clients fetch the changes.", chapter: "notion-sync" },
          { text: "On reconnect, a client compares its last downloaded timestamp with the server's, and only fetches what is newer.", chapter: "notion-sync" },
        ],
      },
    ],
  },

  stripe: {
    intro:
      "Stripe wrote two posts about keeping an API dependable: how to make a retry safe, so a failed call never charges someone twice, and how to stop one noisy user from taking the whole API down. Both are about what happens when things go wrong, which is the only time anyone remembers them.",
  },

  cloudflare: {
    intro:
      "Cloudflare's post is about cold starts: the expensive first run of a Worker. Instead of making cold starts faster, it asked how to have fewer of them, and the answer is a consistent hash ring.",
  },
};
