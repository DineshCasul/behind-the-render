import type { ConceptExamples } from "@/lib/types";

export const webFundamentalsExamples: Record<"http" | "browser-rendering" | "html-parsing", ConceptExamples> = {
  http: {
    whatIsThis: {
      title: "One request and the response it gets",
      snippets: [
        {
          lang: "http",
          caption: "What the browser sends",
          code: "GET /learn/ssr HTTP/1.1\nHost: example.com\nAccept: text/html",
        },
        {
          lang: "http",
          caption: "What the server sends back",
          code: "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nCache-Control: s-maxage=31536000\n\n<!DOCTYPE html>\n<html> ...the page... </html>",
        },
      ],
      notice: [
        "The first line says what is being asked (`GET /learn/ssr`) and, in the reply, how it went (`200 OK`).",
        "**Headers** are labelled extra information, one per line. Then a blank line, then the body.",
        "The page you see in the browser is just the body of that response.",
      ],
    },
    whyItExists: {
      title: "The server forgets you between requests",
      snippets: [
        {
          lang: "http",
          caption: "Without a cookie, the server can't tell who you are",
          code: "GET /account HTTP/1.1\nHost: shop.example\n\nHTTP/1.1 401 Unauthorized",
        },
        {
          lang: "http",
          caption: "So the browser sends a token again on every request",
          code: "GET /account HTTP/1.1\nHost: shop.example\nCookie: session=abc123\n\nHTTP/1.1 200 OK",
          mark: [3],
        },
      ],
      notice: [
        "Nothing links the two requests on the server's side: HTTP is **stateless**.",
        "That is on purpose: any server can answer any request, so it's easy to add more servers.",
        "Anything that must be remembered (being logged in) travels with each request, usually in a cookie.",
      ],
    },
    howItWorks: {
      title: "The steps before the first byte of the page",
      snippets: [
        {
          lang: "text",
          caption: "What happens when you visit https://example.com/",
          code: "1. DNS    example.com  ->  93.184.216.34\n2. TCP    connect to 93.184.216.34, port 443\n3. TLS    agree on encryption keys (the S in HTTPS)\n4. HTTP   send:     GET / HTTP/1.1 + headers\n5. HTTP   receive:  200 OK + headers + body",
        },
        {
          lang: "shell",
          caption: "See the reply's status and headers yourself (after npm run start)",
          code: "curl -I http://localhost:3000/learn/ssr",
          fromSite: true,
        },
      ],
      notice: [
        "Steps 1 to 3 each cost a round trip before any page content moves. That is where much of the waiting on a slow connection goes.",
        "Later requests to the same server reuse the connection, so they skip steps 1 to 3 (HTTP/2 goes further and shares one connection for many requests).",
        "`curl -I` prints only the status line and headers, which is often all you need when debugging.",
      ],
    },
    reactNext: {
      title: "fetch() is plain HTTP, and React isn't involved",
      snippets: [
        {
          lang: "ts",
          caption: "In the browser: React isn't involved, fetch does the HTTP",
          code: "const res = await fetch(\"/api/lessons\");   // sends GET /api/lessons\nif (!res.ok) throw new Error(String(res.status));   // 404, 500, ...\nconst lessons = await res.json();",
        },
      ],
      notice: [
        "React doesn't speak HTTP. Browser APIs like `fetch` (and the server-side code Next.js runs) do the talking.",
      ],
    },
  },

  "browser-rendering": {
    whatIsThis: {
      title: "From HTML and CSS to one painted box",
      snippets: [
        {
          lang: "html",
          code: "<p class=\"big\">Hello</p>\n<p class=\"hidden\">Secret</p>\n\n<style>\n  .big    { font-size: 40px; color: teal; }\n  .hidden { display: none; }\n</style>",
        },
      ],
      notice: [
        "Both paragraphs are in the **DOM**, because the DOM mirrors the HTML.",
        "Only the first is in the **render tree**: `display: none` removes the second from what gets drawn.",
        "Layout gives the first paragraph a size and position, then paint fills in the teal pixels.",
      ],
    },
    whyItExists: {
      title: "Why some animations are cheap and others aren't",
      snippets: [
        {
          lang: "css",
          code: "/* Expensive: changes layout, so positions are recalculated every frame */\n@keyframes slide-bad  { to { left: 300px; } }\n\n/* Cheap: the graphics card just moves an already-painted layer */\n@keyframes slide-good { to { transform: translateX(300px); } }",
        },
      ],
      notice: [
        "Both animations look identical on screen, but they make the browser do very different amounts of work.",
        "Changing `left` forces **layout** (and paint) again on every frame. Changing `transform` skips both.",
        "That is why the animations on this site only use `transform` and `opacity`.",
      ],
    },
    howItWorks: {
      title: "Which change re-runs which step",
      snippets: [
        {
          lang: "text",
          code: "HTML -> DOM ------\\\n                    +-> Render tree -> Layout -> Paint -> Composite\nCSS  -> CSSOM ----/\n\nChanging...        re-runs...\nwidth, top         Layout, Paint, Composite\ncolor              Paint, Composite\ntransform          Composite only",
        },
      ],
      notice: [
        "The pipeline only goes forward: a change re-enters at the step it affects and re-runs everything after it.",
        "The earlier in the pipeline you re-enter, the more work each frame costs. That's the whole reason for the \"transform and opacity\" advice.",
      ],
    },
    reactNext: {
      title: "How this site keeps its scroll animation smooth",
      snippets: [
        {
          lang: "tsx",
          caption: "components/home/ScrollExperience.tsx",
          fromSite: true,
          code: "const heroOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);\nconst heroScale = useTransform(scrollYProgress, [0, 0.32], [1, 1.2]);\n\n<motion.div\n  style={{ opacity: heroOpacity, scale: heroScale, willChange: \"transform, opacity\" }}\n>",
        },
      ],
      notice: [
        "React and Framer Motion only decide *what values to animate*. The browser's pipeline does the actual drawing.",
        "Only `opacity` and `scale` (a transform) change during scrolling, so the browser can skip layout and paint.",
        "`willChange` asks the browser to give these layers their own compositing layer ahead of time.",
      ],
    },
  },

  "html-parsing": {
    whatIsThis: {
      title: "Broken HTML still gets a predictable DOM",
      snippets: [
        { lang: "html", caption: "You write", code: "<p>One<p>Two" },
        { lang: "html", caption: "The DOM you get", code: "<p>One</p>\n<p>Two</p>" },
        { lang: "html", caption: "You write", code: "<table><div>x</div></table>" },
        { lang: "html", caption: "The DOM you get", code: "<div>x</div>\n<table></table>" },
      ],
      notice: [
        "A new `<p>` implicitly closes the previous one, so you get two paragraphs, not a nested pair.",
        "A `<div>` isn't allowed directly inside a `<table>`, so the parser moves it out, in front of the table.",
        "The rules for this are written into the HTML standard, so every browser repairs the same mistakes the same way.",
      ],
    },
    whyItExists: {
      title: "A script can make everything after it wait",
      snippets: [
        {
          lang: "html",
          code: "<p>Before</p>\n<script src=\"slow.js\"></script>   <!-- the parser stops here until it is downloaded and run -->\n<p>After</p>                     <!-- this paragraph isn't built until then -->",
          mark: [2],
        },
      ],
      notice: [
        "HTML can be parsed one piece at a time, but a plain `<script>` might change the page, so the parser has to wait for it.",
        "`async` and `defer` tell the browser the script doesn't need to block the rest of the page.",
      ],
    },
    howItWorks: {
      title: "From characters to a tree",
      snippets: [
        {
          lang: "text",
          code: "Input:   <p class=\"a\">Hi</p>\n\nTokens:  StartTag  p  (class=\"a\")\n         Characters  \"Hi\"      // simplified: the real tokenizer emits one per character\n         EndTag    p\n\nTree:    p.a\n           \"Hi\"",
        },
      ],
      notice: [
        "First the text is **tokenized** into tags and text. Then a second stage uses those tokens to build the tree.",
        "Both stages work on whatever has arrived so far, which is why a page can start appearing before it has finished downloading.",
      ],
    },
  },
};
