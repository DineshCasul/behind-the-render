import type { ConceptExamples } from "@/lib/types";

export const storyConceptExamples: Record<"seo" | "js-main-thread" | "web-vitals" | "client-components", ConceptExamples> = {
  "seo": {
    "whatIsThis": {
      "title": "What a crawler sees: the response, not the finished page",
      "snippets": [
        {
          "lang": "html",
          "caption": "Client-rendered page, as first fetched",
          "code": "<body>\n  <div id=\"root\"></div>\n  <script src=\"/app.js\"></script>\n</body>"
        },
        {
          "lang": "html",
          "caption": "Server-rendered or static page, as first fetched",
          "code": "<body>\n  <h1>Aurora Tour: Tokyo</h1>\n  <p>Doors 19:00. Tickets on sale 09:00.</p>\n  <a href=\"/events/tokyo\">Event details</a>\n</body>"
        }
      ],
      "notice": [
        "The first page has nothing to index until JavaScript runs. The second has its heading, text and a followable link straight away.",
        "In Firefox, View Page Source (Ctrl+U) shows this raw response. The Inspector shows the DOM *after* JavaScript ran, which is not what a crawler gets first."
      ]
    },
    "reactNext": {
      "title": "Metadata in the Next.js App Router",
      "snippets": [
        {
          "lang": "tsx",
          "caption": "app/events/[slug]/page.tsx (illustration)",
          "code": "export async function generateMetadata({ params }) {\n  const { slug } = await params;\n  const event = await getEvent(slug);\n  return {\n    title: event.name,\n    description: `Tickets for ${event.name}`,\n    alternates: { canonical: `/events/${slug}` },\n  };\n}",
          "mark": [
            2,
            3,
            4,
            5,
            6,
            7,
            8
          ]
        }
      ],
      "notice": [
        "The title and description are computed on the server per page and land in the HTML `<head>`, so a crawler reads them without running JavaScript.",
        "`canonical` tells search engines which URL is the main one when the same page can be reached several ways."
      ]
    }
  },
  "js-main-thread": {
    "howItWorks": {
      "title": "Giving the thread back between chunks",
      "snippets": [
        {
          "lang": "tsx",
          "caption": "Illustration: yielding while processing a big list",
          "code": "async function processAll(items) {\n  for (const item of items) {\n    processOne(item);\n    // let the browser handle input and paint\n    if (\"scheduler\" in globalThis && \"yield\" in scheduler) {\n      await scheduler.yield();\n    } else {\n      await new Promise((r) => setTimeout(r, 0));\n    }\n  }\n}",
          "mark": [
            5,
            6,
            7,
            8,
            9
          ]
        }
      ],
      "notice": [
        "Without the yield, this loop is one long task: a tap during it waits until the whole loop ends.",
        "Yielding after every single item adds overhead. Real code usually processes a batch of items, then yields, so the cost of yielding stays small compared to the work.",
        "`scheduler.yield()` isn't in Safari, hence the `setTimeout` fallback."
      ]
    }
  },
  "web-vitals": {
    "howItWorks": {
      "title": "Collecting field data with Next.js",
      "snippets": [
        {
          "lang": "tsx",
          "caption": "Illustration: a small Client Component",
          "code": "\"use client\";\nimport { useReportWebVitals } from \"next/web-vitals\";\n\nexport function WebVitals() {\n  useReportWebVitals((metric) => {\n    // metric.name is \"LCP\", \"INP\", \"CLS\", ...\n    navigator.sendBeacon(\"/analytics\", JSON.stringify(metric));\n  });\n  return null;\n}",
          "mark": [
            5,
            6,
            7,
            8,
            9
          ]
        }
      ],
      "notice": [
        "It has to be a Client Component: metrics are measured inside the visitor's browser.",
        "`sendBeacon` sends the data even if the page is being closed. You would need your own endpoint to receive it.",
        "The `web-vitals` library, maintained by the Google Chrome team, reports the same metrics outside Next.js."
      ]
    }
  },
  "client-components": {
    "whatIsThis": {
      "title": "A small client boundary inside a server page",
      "snippets": [
        {
          "lang": "tsx",
          "caption": "LikeButton.tsx: the only file that ships to the browser",
          "code": "\"use client\";\nimport { useState } from \"react\";\n\nexport function LikeButton() {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>{liked ? \"Liked\" : \"Like\"}</button>;\n}",
          "mark": [
            1
          ]
        },
        {
          "lang": "tsx",
          "caption": "page.tsx: a Server Component (no directive)",
          "code": "import { LikeButton } from \"./LikeButton\";\n\nexport default async function Page() {\n  const post = await getPost();\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <LikeButton />\n    </article>\n  );\n}"
        }
      ],
      "notice": [
        "The page fetches data and renders on the server. Only `LikeButton` and what it imports is sent as JavaScript.",
        "On first load the button is still in the server HTML, then it hydrates and starts responding to clicks."
      ]
    }
  }
};
