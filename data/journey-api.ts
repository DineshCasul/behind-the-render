import type { JourneyChapter } from "@/data/journey";

/**
 * The API chapters: Stripe's two engineering posts about keeping an API safe to retry and hard to overwhelm, and
 * one more GitHub chapter, on the search engine it built for code. Same rules as journey.ts: every `docs` quote is
 * copied word for word from the page it links to (npm run verify:quotes checks it), and the narration only restates
 * what those quotes say. A company's post is a snapshot, so each chapter carries its note.
 */

// ---- Sources ----

const STRIPE_IDEM = "https://stripe.com/blog/idempotency";
const STRIPE_RATE = "https://stripe.com/blog/rate-limiters";
const GITHUB_SEARCH = "https://github.blog/engineering/architecture-optimization/the-technology-behind-githubs-new-code-search/";

const NOTE = {
  stripeIdem: "Stripe's February 2017 post about idempotency. It describes the API and the advice then.",
  stripeRate: "Stripe's March 2017 post about rate limiters. The counts it quotes are for the month it was written.",
  githubSearch: "GitHub's February 2023 post about its code search. The sizes it quotes describe the beta then.",
} as const;

// ---- Stripe ----

export const stripeIdempotency: JourneyChapter = {
  id: "stripe-idempotency",
  trick: "idempotency-keys",
  title: "Charged Once",
  note: NOTE.stripeIdem,
  predict: {
    question: "A client sends a request to charge a customer. The server does the work, but the connection drops before the reply arrives. What does Stripe's server do when the client retries with the same idempotency key?",
    options: [
      "It charges again, because the first reply never arrived",
      "It replies with a cached result of the successful operation",
      "It rejects the retry as a duplicate and returns an error",
    ],
    answer: 1,
    reveal: "It replies with a cached result of the successful operation. The customer is charged only once.",
  },
  lines: [
    "You ask an API to charge a customer. The call can fail before it starts, in the middle, or after the work is done but before the reply gets back to you.",
    "In the last two cases you do not know what happened. Retrying might help, or it might charge someone twice. Neither option is relaxing.",
    "Stripe's first tool is idempotent endpoints: they can be called any number of times while guaranteeing that side effects only occur once. Some HTTP verbs already work like this.",
    "For a charge, that is not enough, so the client makes up a unique ID for the operation and sends it with the request. This is the idempotency key. Stripe takes it in an Idempotency-Key header.",
    "If something fails, the client retries with the same ID. If the work already happened, the server simply replies with a cached result.",
    "The second half is manners. Clients should back off exponentially, so they do not hammer a downed server, and add random jitter, so a crowd of clients does not retry in lockstep. That crowd has a name: thundering herd.",
  ],
  docs: [
    { text: "The call could succeed, but the connection break before the server can tell its client about it.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "Any one of these leaves the client that made the request in an uncertain situation.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "An example might be if we were designing an API endpoint to charge a customer money; accidentally calling it twice would lead to the customer being double-charged, which is very bad.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "When performing a request, a client generates a unique ID to identify just that operation and sends it up to the server along with the normal payload.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "If the client notices a failure, it retries the request with the same ID, and from there it’s up to the server to figure out what to do with it.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "On a response failure (i.e. the operation executed successfully, but the client couldn’t get the result), the server simply replies with a cached result of the successful operation.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "If the above Stripe request fails due to a network connection error, you can safely retry it with the same idempotency key, and the customer is charged only once.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "By backing off exponentially, we can ensure that clients aren’t hammering on a downed server and contributing to the problem.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
    { text: "We can address thundering herd by adding some amount of random “jitter” to each client’s wait time.", source: "Stripe Blog: Designing robust and predictable APIs with idempotency", href: STRIPE_IDEM },
  ],
};

export const stripeLimits: JourneyChapter = {
  id: "stripe-limits",
  trick: "rate-limiting",
  title: "Four Bouncers",
  note: NOTE.stripeRate,
  predict: {
    question: "How many different types of rate limiters and load shedders does Stripe say it runs in production?",
    options: ["2", "4", "12"],
    answer: 1,
    reveal: "4. The request rate limiter is the most important one, and the one Stripe recommends starting with.",
  },
  lines: [
    "One user sends a flood of requests, by accident or on purpose. Everyone else should not feel it. That is what rate limiting is for.",
    "Stripe makes a distinction. A rate limiter looks at the user. A load shedder looks at the state of the whole system, and drops low-priority requests so the core keeps working while the rest is on fire.",
    "It runs four. The request rate limiter caps each user at N requests per second, with a burst allowance for real-time events like a flash sale.",
    "The concurrent requests limiter caps how many requests a user can have in progress at once. It exists because slow, expensive endpoints make people retry, and retries make the slowness worse.",
    "Two load shedders follow. One reserves a share of the fleet for critical requests: reserve 20%, and non-critical traffic over its 80% gets a 503. The last one watches the workers and sheds the lowest priority first.",
    "For the mechanism, Stripe uses the token bucket algorithm, with a bucket per user. Take a token on each request, drip tokens back in slowly, and reject when the bucket is empty.",
    "Launching them is half the work: fail open if the limiter itself breaks, keep a kill switch, and dark launch each one to watch what it would block.",
  ],
  docs: [
    { text: "A load shedder makes its decisions based on the whole state of the system rather than the user who is making the request.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "At Stripe, we operate 4 different types of limiters in production.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "We recommend you start here if you want to improve the robustness of your API.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "This rate limiter restricts each user to N requests per second.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "After analyzing our traffic patterns, we added the ability to briefly burst above the cap for sudden spikes in usage during real-time events (e.g. a flash sale.)", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "Instead of “You can use our API 1000 times a second”, this rate limiter says “You can only have 20 API requests in progress at the same time”.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "If our reservation number is 20%, then any non-critical request over their 80% allocation would be rejected with status code 503.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "If your workers start getting backed up with requests, then this will shed lower-priority traffic.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "We use the token bucket algorithm to do rate limiting.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "If the bucket is empty, reject the request.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "Make sure that if there were bugs in the rate limiting code (or if Redis were to go down), requests wouldn’t be affected.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
    { text: "Dark launch each rate limiter to watch the traffic they would block.", source: "Stripe Blog: Scaling your API with rate limiters", href: STRIPE_RATE },
  ],
};

// ---- GitHub ----

export const githubSearch: JourneyChapter = {
  id: "github-search",
  trick: "ngram-index",
  title: "Why Not Just grep",
  note: NOTE.githubSearch,
  predict: {
    question: "GitHub did the napkin math for running ripgrep over all of its code for one query. About how long would 2,048 CPU cores be busy?",
    options: ["96 seconds", "9.6 seconds", "96 minutes"],
    answer: 0,
    reveal: "96 seconds, for a single query, and only that one query can run. That works out to 0.01 queries per second.",
  },
  lines: [
    "GitHub built its own search engine for code, from scratch, in Rust. It is called Blackbird. The general text search products it tried were a poor experience, slow to index and expensive to host.",
    "Code is not prose. People search for punctuation, they do not want stemming, they do not want stop words stripped, and they want regular expressions.",
    "The obvious answer is to just use grep. Ripgrep manages about 0.6 GB per second per core. On 115 TB, even with perfect parallelism, 2,048 cores would be busy for 96 seconds. One query at a time.",
    "So: build an index. A trigram index, the kind of inverted index that looks up substrings. Every three-character slice of every document points to a sorted list of the documents that contain it.",
    "To search, look up the slices of your query and intersect the lists. The lists are too big for memory, so they are read lazily, only far enough to produce the requested number of results.",
    "Indexing it all needed two tricks. Shard by Git blob object ID, which spreads documents evenly and avoids duplicates. And keep results consistent per commit, so a push in progress never shows up half done.",
  ],
  docs: [
    { text: "The short answer is that we built our own search engine from scratch, in Rust, specifically for the domain of code search.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "Searching code also has unique requirements: we want to search for punctuation (for example, a period or open parenthesis); we don’t want stemming; we don’t want stop words to be stripped from queries; and, we want to search with regular expressions.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "you can currently search almost 45 million repositories, representing 115 TB of code and 15.5 billion documents.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "ripgrep can run an exhaustive regular expression query on a 13 GB file cached in memory in 2.769 seconds, or about 0.6 GB/sec/core.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "we’re going to saturate 2,048 CPU cores for 96 seconds to serve a single query!", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "You can see where this is going: we need to build an index.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "For code search, we need a special type of inverted index called an ngram index, which is useful for looking up substrings of content.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "To perform a search, we intersect the results of multiple lookups to give us the list of documents where the string appears.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "That way we never have to keep entire posting lists in memory.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "Shard by Git blob object ID which gives us a nice way of evenly distributing documents between the shards while avoiding any duplication.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
    { text: "If you search a repository while your teammate is pushing code, your results shouldn’t include documents from the new commit until it has been fully processed by the system.", source: "GitHub Blog: The technology behind GitHub’s new code search", href: GITHUB_SEARCH },
  ],
};
