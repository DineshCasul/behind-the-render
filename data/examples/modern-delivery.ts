import type { ConceptExamples } from "@/lib/types";

export const modernDeliveryExamples: Record<"streaming", ConceptExamples> = {
  streaming: {
    whatIsThis: {
      title: "Marking the slow part of a page",
      snippets: [
        {
          lang: "tsx",
          code: "<Header />\n\n<Suspense fallback={<p>Loading recommendations...</p>}>\n  <Recommendations />   {/* slow: waits on a database */}\n</Suspense>\n\n<Footer />",
          mark: [3, 4, 5],
        },
        {
          lang: "tsx",
          caption: "The slow part is an ordinary async component",
          code: "async function Recommendations() {\n  const items = await getSlowRecommendations();   // takes 2.2 seconds\n  return <ul>{items.map((i) => <li key={i.id}>{i.title}</li>)}</ul>;\n}",
        },
      ],
      notice: [
        "Everything outside the `Suspense` can be sent immediately. The visitor sees the header and footer straight away.",
        "React can pause on the `await` and carry on with the rest of the page, then send the finished list as an extra piece.",
        "The fallback shows in the slow part's place, and the real content is sent later, into that same spot.",
      ],
    },
    reactNext: {
      title: "A loading.tsx wraps a whole route in Suspense for you",
      snippets: [
        {
          lang: "tsx",
          caption: "app/dashboard/loading.tsx",
          code: "export default function Loading() {\n  return <p>Loading dashboard...</p>;\n}",
        },
      ],
      notice: [
        "Next.js shows this file instantly while `app/dashboard/page.tsx` finishes its data fetching.",
        "This site has no `Suspense` or `loading.tsx`, because none of its data is slow. This is what you would reach for if it were.",
      ],
    },
  },
};
