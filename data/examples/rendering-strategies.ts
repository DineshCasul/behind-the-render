import type { ConceptExamples } from "@/lib/types";

export const renderingStrategiesExamples: Record<"csr" | "ssr" | "ssg" | "isr", ConceptExamples> = {
  csr: {
    whatIsThis: {
      title: "An empty page plus a script that fills it in",
      snippets: [
        {
          lang: "html",
          caption: "What the server sends",
          code: "<!doctype html>\n<html>\n  <body>\n    <div id=\"root\"></div>          <!-- empty: no content yet -->\n    <script src=\"/bundle.js\"></script>\n  </body>\n</html>",
          mark: [4],
        },
        {
          lang: "tsx",
          caption: "Inside bundle.js, running in the browser",
          code: "import { createRoot } from \"react-dom/client\";\n\ncreateRoot(document.getElementById(\"root\")!).render(<App />);",
        },
      ],
      notice: [
        "Until `bundle.js` has downloaded and run, the `#root` div is empty, so the visitor sees a blank page.",
        "`createRoot` builds the UI from scratch inside that empty div. There is nothing to reuse, so there is no hydration step.",
      ],
    },
    whyItExists: {
      title: "Moving between pages without reloading",
      snippets: [
        {
          lang: "tsx",
          code: "link.addEventListener(\"click\", async (event) => {\n  event.preventDefault();                        // no full page load\n  const data = await (await fetch(\"/api/page/2\")).json();\n  root.render(<Page data={data} />);             // swap the UI in place\n});",
        },
      ],
      notice: [
        "Only the data is fetched. The browser keeps the page, its JavaScript and any in-memory state, so moving around feels instant.",
        "That app-like feel was the reason this style became popular. The cost is the slow first load.",
      ],
    },
    reactNext: {
      title: "Choosing CSR for one widget in Next.js",
      snippets: [
        {
          lang: "tsx",
          code: "\"use client\";\nimport { useEffect, useState } from \"react\";\n\nexport function Widget() {\n  const [data, setData] = useState<{ name: string } | null>(null);\n\n  useEffect(() => {\n    fetch(\"/api/x\").then((r) => r.json()).then(setData);\n  }, []);\n\n  return data ? <p>{data.name}</p> : <p>Loading...</p>;\n}",
        },
      ],
      notice: [
        "The server still sends HTML for this component, but it only contains \"Loading...\": the fetch runs in the browser, after hydration.",
        "Next.js doesn't forbid CSR. It makes it a per-component choice instead of the whole app's only option.",
      ],
    },
  },

  ssr: {
    whatIsThis: {
      title: "The same page, sent as an empty shell versus finished HTML",
      snippets: [
        { lang: "html", caption: "CSR sends", code: "<div id=\"root\"></div>" },
        {
          lang: "html",
          caption: "SSR sends",
          code: "<div id=\"root\">\n  <h1>SSR</h1>\n  <p>Server-Side Rendering: the server builds HTML before sending it.</p>\n</div>",
        },
      ],
      notice: [
        "With SSR the content is already in the response, so it can be shown as soon as the HTML is parsed.",
        "You can check this on any page with View Source: if you can read the text there, the server sent it.",
      ],
    },
    howItWorks: {
      title: "A tiny hand-written SSR server",
      snippets: [
        {
          lang: "tsx",
          code: "import { renderToString } from \"react-dom/server\";\n\napp.get(\"/\", async (req, res) => {\n  const data = await getData();                    // runs on every request\n  const html = renderToString(<App data={data} />);\n  res.send(\n    \"<!doctype html><div id='root'>\" + html + \"</div>\" +\n    \"<script src='/bundle.js'></script>\"           // for hydration afterwards\n  );\n});",
        },
      ],
      notice: [
        "The render happens inside the request handler, so it runs again for every visitor.",
        "The same `<App />` also ships to the browser (`bundle.js`) so React can hydrate this HTML instead of rebuilding it.",
      ],
    },
    reactNext: {
      title: "In Next.js, using request data makes a page render per request",
      snippets: [
        {
          lang: "tsx",
          caption: "app/page.tsx",
          code: "import { cookies } from \"next/headers\";\n\nexport default async function Page() {\n  const theme = (await cookies()).get(\"theme\")?.value ?? \"light\";\n  return <h1>Theme: {theme}</h1>;\n}",
        },
      ],
      notice: [
        "Reading `cookies()` depends on who is asking, so Next.js can't prebuild this page: it renders on every request.",
        "None of this site's pages read cookies, headers or search params, which is why every page here is built once instead.",
      ],
    },
  },

  ssg: {
    whatIsThis: {
      title: "How this site prebuilds its 12 lesson pages",
      snippets: [
        {
          lang: "tsx",
          caption: "app/learn/[slug]/page.tsx",
          fromSite: true,
          code: "export function generateStaticParams() {\n  return concepts.map((concept) => ({ slug: concept.id }));\n}",
        },
        {
          lang: "text",
          caption: "What npm run build prints",
          fromSite: true,
          code: "  /learn/[slug]\n  ├ ● /learn/http\n  ├ ● /learn/browser-rendering\n  ├ ● /learn/html-parsing\n  └ ● [+9 more paths]\n\n●  (SSG)  prerendered as static HTML (uses generateStaticParams)",
        },
      ],
      notice: [
        "`generateStaticParams` lists every value the `[slug]` part can take, so Next.js can render each page once at build time.",
        "The `●` in the build output is the proof: those pages are static files, not code that runs per visit.",
      ],
    },
    whyItExists: {
      title: "The work saved by rendering once",
      snippets: [
        {
          lang: "text",
          code: "10,000 visits to the same page\n\nSSR:  10,000 renders  (one for every visit)\nSSG:       1 render   (at build time)",
        },
      ],
      notice: [
        "If every visitor gets identical output, rendering it again for each one is wasted work.",
        "The saving comes with a cost: the page is only as fresh as the last build.",
      ],
    },
  },

  isr: {
    whatIsThis: {
      title: "A static page with a refresh timer",
      snippets: [
        {
          lang: "tsx",
          code: "export const revalidate = 60;   // seconds",
        },
      ],
      notice: [
        "The page is still built ahead of time and served as a file, like SSG.",
        "The number says how old it may get before the next visit is allowed to trigger a fresh build in the background.",
      ],
    },
    howItWorks: {
      title: "Refreshing one page on demand",
      snippets: [
        {
          lang: "ts",
          code: "\"use server\";\nimport { revalidatePath } from \"next/cache\";\n\nexport async function publish() {\n  // ...save the change to your CMS or database...\n  revalidatePath(\"/learn/ssr\");   // next visit rebuilds this page\n}",
        },
      ],
      notice: [
        "Instead of waiting for a timer, the page is refreshed exactly when the content it shows changed.",
        "Timers are simple. On-demand refresh avoids showing stale content and avoids many pages refreshing at the same moment.",
      ],
    },
  },
};
