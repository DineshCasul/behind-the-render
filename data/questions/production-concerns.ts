import type { ConceptId, InterviewQuestion } from "@/lib/types";

export const productionConcernsQuestions: Partial<Record<ConceptId, InterviewQuestion[]>> = {
  caching: [
    {
      category: "fundamentals",
      question: "Name the caching layers a request might pass through before reaching a database, in order.",
      answer: "Browser cache → CDN edge cache → origin server cache (e.g. a data cache) → database.",
      reasoning: "A cache hit at any layer short-circuits everything after it, the fastest response is one that never reaches the origin at all.",
      followUp: "Which layer would a `Cache-Control: no-store` header affect?",
    },
    {
      category: "tricky",
      question: "A page is fast locally but slow in production. Is caching a likely explanation, and why or why not?",
      answer: "Yes, it's one of the first things to suspect, a local dev environment typically has no CDN/edge cache layer at all, so 'fast locally, slow in prod' just as often means 'prod has a caching layer with a miss or misconfiguration' as it means an actual code performance issue.",
      reasoning: "The absence of caching locally makes local performance a poor predictor of production caching-layer behavior specifically.",
      followUp: "What would you check first to confirm or rule out caching as the cause?",
    },
    {
      category: "scenario",
      question: "After deploying a content fix, some users see the old content and some see the new content. What's a likely explanation?",
      answer: "A CDN with multiple edge locations, where cache invalidation hasn't propagated to every edge node yet, different users hitting different edges see different cache states temporarily.",
      reasoning: "CDN invalidation isn't always instantaneous or perfectly atomic across a globally distributed cache, this is a normal, expected transient state, not necessarily a bug.",
      followUp: "How would you distinguish this from a case where the deploy itself only partially succeeded?",
    },
    {
      category: "senior",
      question: "Why is cache invalidation considered one of the genuinely hard problems in computer science, beyond just 'set an expiry time'?",
      answer: "Because correctness requires knowing exactly when underlying data changed and invalidating precisely the cached entries affected, too aggressive and you lose caching's benefit constantly re-fetching; too conservative and users see stale data; and different layers (browser, CDN, app-level) each need their own invalidation signal, which can drift out of sync.",
      reasoning: "The difficulty isn't the mechanism (most systems support some form of invalidation), it's correctly reasoning about *when* and *what* to invalidate across a distributed set of independent caches.",
      followUp: "How does tag-based invalidation (like Next.js's `revalidateTag`) reduce this complexity compared to time-based expiry alone?",
    },
    {
      category: "debugging",
      question: "An API response includes a `Cache-Control: public, max-age=3600` header, but a client is clearly getting fresh data every request. What would you check?",
      answer: "Whether the request includes headers or query parameters that bust caching (like a cache-busting timestamp param), whether the client is sending `Cache-Control: no-cache` itself, or whether an intermediary (dev proxy, browser devtools 'disable cache' setting) is bypassing the cache entirely.",
      reasoning: "A correct `Cache-Control` response header is necessary but not sufficient, caching can be defeated at multiple points between server and eventual reuse.",
      followUp: "How would opening the network tab's cache-status column help distinguish these possibilities?",
    },
  ],
};
