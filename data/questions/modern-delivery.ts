import type { ConceptId, InterviewQuestion } from "@/lib/types";

export const modernDeliveryQuestions: Partial<Record<ConceptId, InterviewQuestion[]>> = {
  streaming: [
    {
      category: "fundamentals",
      question: "Does the browser receive one complete HTML document during streaming, just delivered faster?",
      answer: "No: it receives genuinely separate chunks over time as multiple writes to the same HTTP response; the browser renders an incomplete document that gets completed in place as later chunks arrive.",
      reasoning: "This distinction matters because it means the browser's incremental HTML parser is doing real work with a genuinely partial document, not receiving a fast-but-whole one.",
      followUp: "What existing browser capability makes this possible without any special 'streaming mode'?",
    },
    {
      category: "tricky",
      question: "When would streaming improve perceived performance without improving the total server computation time?",
      answer: "Whenever the total work needed is unchanged, but a slow section no longer blocks the fast sections from being shown first, the user sees meaningful content sooner even though the server did exactly the same amount of total work as it would have unstreamed.",
      reasoning: "Streaming is a perceived-performance technique, not a total-work-reduction technique, it changes *when* the user sees results, not how much work produces them.",
      followUp: "Is there a scenario where streaming could make total server computation time worse, not just unchanged?",
    },
    {
      category: "scenario",
      question: "A product page has a fast-loading header and a slow-loading recommendations section. How would you structure this with streaming in mind?",
      answer: "Wrap the recommendations section in a `<Suspense>` boundary with a placeholder/skeleton, so the header and rest of the page can stream in and be usable immediately while recommendations load and stream in afterward.",
      reasoning: "Isolating exactly the slow, non-critical part behind its own boundary is what lets the rest of the page avoid waiting on it.",
      followUp: "What would happen if you accidentally wrapped the entire page in a single Suspense boundary instead?",
    },
    {
      category: "senior",
      question: "What infrastructure assumption does streaming depend on that can silently defeat it in production?",
      answer: "That the hosting platform, proxy, and any CDN in front of the app actually forward response chunks as they arrive rather than buffering the entire response before sending it onward, some serverless platforms or proxy configurations buffer by default.",
      reasoning: "Streaming is implemented correctly at the framework/server level but its benefit can be silently erased by an intermediary that turns it back into an all-at-once response.",
      followUp: "How would you verify, from the browser's network tab, whether a response is actually arriving in chunks?",
    },
    {
      category: "debugging",
      question: "A streamed section's placeholder is replaced by real content, but the page visibly jumps when it happens. What's the cause and fix?",
      answer: "The placeholder's dimensions don't match the real content's dimensions, so swapping one for the other shifts everything below it, reserving space (a skeleton sized to match expected content) fixes this.",
      reasoning: "Streaming doesn't inherently cause layout shift, an under-sized placeholder does, the same as any other late-arriving content would.",
      followUp: "How does this relate to Cumulative Layout Shift as a performance metric?",
    },
  ],
};
