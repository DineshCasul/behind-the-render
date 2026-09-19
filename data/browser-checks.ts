import type { ConceptId, LessonSectionId } from "@/lib/types";

export interface BrowserCheck {
  /** Which section it sits under. */
  section: Extract<LessonSectionId, "what-is-this" | "why-it-exists" | "how-it-works" | "react-next">;
  title: string;
  /** What you'll use: shown as a label, e.g. "View Source", "DevTools: Network". */
  tool: string;
  /** True when the steps use DevTools, so the shortcut and panel-name note is shown. */
  devtools?: boolean;
  /** True when a step only exists in Chrome and Edge (the Firefox equivalent isn't documented here). */
  chromiumOnly?: boolean;
  /** A prerequisite worth stating up front, e.g. a production build. */
  needs?: string;
  steps: string[];
  expect: string[];
}

/**
 * "Try it yourself" checks that use the browser as a learning tool: View
 * Source, DevTools, browser settings. Deliberately sparse: only where doing
 * it yourself teaches something reading can't. Every check works in Firefox
 * as well as Chrome/Edge unless marked `chromiumOnly`. The claims were run
 * in a real browser: the parser results, JavaScript-off rendering, the
 * layout count during scrolling, and the visible-versus-clickable gap on a
 * throttled connection (content at 0.6s, buttons hydrated at 6.6s).
 */
export const browserChecks: Partial<Record<ConceptId, BrowserCheck[]>> = {
  http: [
    {
      section: "how-it-works",
      title: "Read a real request and response",
      tool: "DevTools: Network",
      devtools: true,
      steps: [
        "Open DevTools and click the **Network** tab.",
        "Reload the page (Ctrl+R). Click the first entry in the list: it's the page itself.",
        "Open **Headers**: find the request method, the status code and the response headers.",
        "Open **Timing** (Firefox calls it **Timings**) to see time spent waiting for the server versus downloading.",
      ],
      expect: [
        "The status line and headers look just like the messages in the example above.",
        "On localhost there's almost no DNS or TLS time. On a real site those steps take a visible slice of the total.",
      ],
    },
  ],

  "browser-rendering": [
    {
      section: "what-is-this",
      title: "Take an element out of the render tree",
      tool: "DevTools: Elements / Inspector",
      devtools: true,
      steps: [
        "Right-click any paragraph on this page and choose **Inspect**.",
        "In the styles panel, click inside the empty block at the top (called `element` or `element.style`) and type `display: none`, then press Enter.",
        "Look at the page, then at the element tree. Untick the rule to bring the paragraph back.",
      ],
      expect: [
        "The paragraph vanishes from the page but stays in the element tree: it's still in the **DOM**, just not in the **render tree**.",
      ],
    },
    {
      section: "how-it-works",
      title: "See which pipeline steps scrolling costs",
      tool: "DevTools: Performance",
      devtools: true,
      chromiumOnly: true,
      steps: [
        "Open this site's **home page**, then DevTools, then the **Performance** tab.",
        "Click record, scroll down through the pinned scene, then stop recording.",
        "In the timeline, look for **Recalculate Style**, **Layout**, **Paint** and **Composite Layers**.",
      ],
      expect: [
        "Style recalculation is frequent, because animated values update every frame.",
        "**Layout** entries are far fewer than frames. Only `transform` and `opacity` move during the scroll, so most frames skip layout.",
      ],
    },
  ],

  "html-parsing": [
    {
      section: "what-is-this",
      title: "Feed the parser broken HTML yourself",
      tool: "DevTools: Console",
      devtools: true,
      steps: [
        "Open the **Console** tab. If it asks you to type `allow pasting` first, do that.",
        "Paste this and press Enter: `d = document.createElement(\"div\"); d.innerHTML = \"<p>One<p>Two\"; d.innerHTML`",
        "Now try this one: `d.innerHTML = \"<table><div>x</div></table>\"; d.innerHTML`",
      ],
      expect: [
        "The first prints `<p>One</p><p>Two</p>`: the parser closed the first paragraph for you.",
        "The second prints `<div>x</div><table></table>`: the `div` was moved out in front of the table. The same repairs as the example above, done by your own browser.",
      ],
    },
  ],

  ssr: [
    {
      section: "what-is-this",
      title: "See what the server really sent, then turn JavaScript off",
      tool: "View Source + DevTools",
      devtools: true,
      steps: [
        "Press **Ctrl+U** (View Source) on this page and search it (Ctrl+F) for a phrase from the text above. It's there: the server sent it as HTML.",
        "Turn JavaScript off. In Chrome or Edge: open DevTools, press Ctrl+Shift+P and run **Disable JavaScript**. In Firefox: open DevTools Settings and tick **Disable JavaScript**.",
        "Reload the page.",
        "Scroll to the experiment further down and try its buttons.",
      ],
      expect: [
        "All the lesson text is still there, because it never needed JavaScript to appear.",
        "The buttons and experiments do nothing, because interactivity is what JavaScript (hydration) adds.",
      ],
    },
  ],

  "react-rendering": [
    {
      section: "how-it-works",
      title: "Watch components re-render as you hover",
      tool: "React DevTools (browser extension)",
      devtools: true,
      needs: "The React DevTools extension (available for Chrome, Edge and Firefox), and this site running with `npm run dev`.",
      steps: [
        "Install React DevTools, then open this site's home page from the dev server.",
        "Open DevTools and its **Components** tab. In the extension's settings (gear icon), switch on the option to highlight updates when components render.",
        "Hover different nodes on the map and watch which parts of the page flash.",
      ],
      expect: [
        "Many node components flash on every hover: React re-ran them.",
        "Yet only a ring or two actually changes on screen. A re-render is not a DOM change.",
      ],
    },
  ],

  hydration: [
    {
      section: "why-it-exists",
      title: "Feel the gap between visible and clickable",
      tool: "DevTools: Network throttling",
      devtools: true,
      steps: [
        "Open DevTools, go to the **Network** tab and pick a slow throttling profile (for example **Slow 3G**; Firefox offers 3G options).",
        "Do a hard reload (**Ctrl+Shift+R**) of this page.",
        "As soon as the text appears, click one of the status buttons (Not started, Learning, ...) under the title. Keep trying every second.",
      ],
      expect: [
        "The text appears long before the buttons respond. In a test with a slow connection, content was visible at 0.6 seconds and the buttons only worked at 6.6 seconds.",
        "That gap is hydration: the HTML is there, but the JavaScript that attaches the click handlers is still arriving.",
      ],
    },
  ],

  caching: [
    {
      section: "how-it-works",
      title: "Watch the browser reuse a cached file",
      tool: "DevTools: Network",
      devtools: true,
      needs: "A production build: run `npm run build` and `npm run start`. The dev server sends different, uncacheable headers.",
      steps: [
        "Open DevTools, then the **Network** tab, and load this site from `npm run start`.",
        "Reload normally (Ctrl+R) and look at the size column for the JavaScript and CSS files. Chrome and Edge show **(disk cache)** or similar. Firefox shows **cached** in the Transferred column.",
        "Now hard reload (**Ctrl+Shift+R**), which bypasses the cache, and compare.",
      ],
      expect: [
        "On a normal reload, the hashed JavaScript and CSS files come from the cache (they're marked `immutable`), so they cost no download.",
        "After a hard reload they're fetched again, at full size.",
      ],
    },
  ],
};
