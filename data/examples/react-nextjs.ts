import type { ConceptExamples } from "@/lib/types";

export const reactNextjsExamples: Record<"react-rendering" | "hydration" | "server-components", ConceptExamples> = {
  "react-rendering": {
    whatIsThis: {
      title: "One click, one re-render",
      snippets: [
        {
          lang: "tsx",
          code: "function Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}",
        },
      ],
      notice: [
        "Clicking calls `setN`, so React runs `Counter` again and gets a new description: a button showing 1 instead of 0.",
        "React compares it with the previous description and finds only the button's text changed, so that is the only thing it edits in the real page.",
      ],
    },
    whyItExists: {
      title: "Managing the page by hand versus describing it",
      snippets: [
        {
          lang: "ts",
          caption: "Imperative: you update every place that shows the value",
          code: "button.textContent = String(n + 1);\ncounterLabel.textContent = \"Clicked \" + (n + 1) + \" times\";\ndisabledNote.hidden = n + 1 < 10;",
        },
        {
          lang: "tsx",
          caption: "Declarative: describe the result, React does the edits",
          code: "<button>{n}</button>\n<p>Clicked {n} times</p>\n{n >= 10 && <p>That's plenty.</p>}",
        },
      ],
      notice: [
        "By hand, every new place that shows `n` is another line you have to remember to update.",
        "Describing the UI as a function of state means the page can't get out of sync with the data.",
      ],
    },
    howItWorks: {
      title: "Keys tell React which item is which",
      snippets: [
        {
          lang: "tsx",
          caption: "Good: the identity follows the item",
          code: "{items.map((item) => <Row key={item.id} item={item} />)}",
        },
        {
          lang: "tsx",
          caption: "Risky when the list can be reordered or filtered",
          code: "{items.map((item, i) => <Row key={i} item={item} />)}",
        },
      ],
      notice: [
        "React uses the key to decide \"this row now is the same row as before\". With the array index, the rows keep their positions but the items move, so React can attach the wrong row's state (like a half-typed input) to a different item.",
        "This is a correctness bug, not just a speed one.",
      ],
    },
  },

  hydration: {
    whatIsThis: {
      title: "HTML that looks right but does nothing, until React attaches to it",
      snippets: [
        { lang: "html", caption: "From the server", code: "<button>Like (0)</button>   <!-- looks fine, but no click handler is attached -->" },
        {
          lang: "tsx",
          caption: "In the browser, once the JavaScript has loaded",
          code: "hydrateRoot(document.getElementById(\"root\")!, <App />);   // attaches onClick to that button",
        },
      ],
      notice: [
        "Between those two moments the button is visible but dead. Clicking it does nothing.",
        "Hydration reuses the existing button. It doesn't create a new one.",
      ],
    },
    howItWorks: {
      title: "How a hydration mismatch happens",
      snippets: [
        {
          lang: "tsx",
          code: "function Clock() {\n  return <p>{new Date().toLocaleTimeString()}</p>;\n}\n// server renders 10:00:01, the browser's first render says 10:00:02  ->  mismatch",
          mark: [2],
        },
      ],
      notice: [
        "The server and the browser each render this component once, at slightly different moments, and get different output.",
        "Anything that can differ between the two (the time, `Math.random()`, `localStorage`) can't be read during the first render.",
      ],
    },
    reactNext: {
      title: "How this site avoids a mismatch for your saved progress",
      snippets: [
        {
          lang: "ts",
          caption: "lib/progress.ts",
          fromSite: true,
          code: "const SERVER_SNAPSHOT = defaultProgress();\n\nfunction getServerSnapshot() {\n  return SERVER_SNAPSHOT;      // the same object every time\n}\n\nconst progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);",
        },
      ],
      notice: [
        "The server can't read your browser's `localStorage`, so it renders every node as \"not started\".",
        "The browser's first render uses the same default, so nothing mismatches. Your real progress is read right after.",
        "It must be one stable object: an early version built a new one on every call and React warned about an infinite loop.",
      ],
    },
  },

  "server-components": {
    whatIsThis: {
      title: "A Server Component and a Client Component side by side",
      snippets: [
        {
          lang: "tsx",
          caption: "Server Component (the default): runs only on the server",
          code: "export default async function Page() {\n  const rows = await db.query(\"select * from lessons\");\n  return <ul>{rows.map((r) => <li key={r.id}>{r.title}</li>)}</ul>;\n}",
        },
        {
          lang: "tsx",
          caption: "Client Component: its code is sent to the browser",
          code: "\"use client\";\nimport { useState } from \"react\";\n\nexport function LikeButton() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Like ({n})</button>;\n}",
        },
      ],
      notice: [
        "The first can query a database directly because that code never reaches the browser.",
        "The second needs state and a click handler, so it has to run in the browser, and the `\"use client\"` line at the top says so.",
      ],
    },
    whyItExists: {
      title: "Heavy code that never reaches the visitor",
      snippets: [
        {
          lang: "tsx",
          code: "import { formatDate } from \"some-large-date-library\";   // big dependency\n\n// In a Server Component, this import is used on the server only.\n// The visitor downloads the finished text, not the library.\nexport default function Post({ post }) {\n  return <time>{formatDate(post.date)}</time>;\n}",
        },
      ],
      notice: [
        "In a Client Component the same import would be bundled and downloaded by every visitor.",
        "Parts of a page that never need to be interactive are the best candidates to stay on the server.",
      ],
    },
    howItWorks: {
      title: "Server components can render client components inside them",
      snippets: [
        {
          lang: "tsx",
          code: "// page.tsx is a Server Component\n<article>\n  <h1>{post.title}</h1>            {/* rendered on the server */}\n  <LikeButton postId={post.id} />  {/* a Client Component: hydrated in the browser */}\n</article>",
          mark: [4],
        },
      ],
      notice: [
        "The `<h1>` becomes plain HTML. Only the `LikeButton` ships JavaScript and gets hydrated.",
        "Props crossing from server to client have to be plain data (strings, numbers, objects), not functions.",
      ],
    },
  },
};
