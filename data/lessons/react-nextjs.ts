import type { Lesson } from "@/lib/types";

/**
 * Lessons for the REACT / NEXT.JS stage: React Rendering, Hydration,
 * Server Components. This is the one stage where React genuinely is the
 * subject (not just an example), but even here, each lesson opens with
 * the general problem before describing React's specific answer to it.
 */
export const reactNextjsLessons: Lesson[] = [
  {
    id: "react-rendering",
    whatIsThis:
      "**React rendering** is the process of ==calling your component functions to produce a description of UI== (a tree of React elements), then figuring out the minimal set of real DOM changes needed to match that description, a process called reconciliation, using a diffing algorithm sometimes called \"the virtual DOM.\"",
    whyItExists:
      "Directly mutating the DOM by hand to keep it in sync with changing application state gets unmanageable fast, you end up hand-writing \"if this changed, update that specific element\" logic everywhere. React lets you instead describe *what the UI should look like right now* as a function of state, and handles figuring out the actual DOM edits for you.",
    howItWorks:
      "When state changes, React calls the affected component function(s) again, producing a new element tree. It diffs that new tree against the previous one (comparing element types and, within lists, `key`s) to compute the minimal set of DOM mutations, then applies just those mutations. Critically: ==a component re-rendering (its function running again) does not necessarily mean the DOM changes==, if the output is identical, React skips touching the DOM at all.",
    runtime: [
      { actor: "react", label: "State changes", detail: "`setState`/a hook update schedules a re-render." },
      { actor: "react", label: "Re-render", detail: "Affected component functions run again, producing a new element tree." },
      { actor: "react", label: "Reconcile (diff)", detail: "New tree is compared against the previous one." },
      { actor: "browser", label: "Commit DOM mutations", detail: "Only the actual differences are written to the real DOM." },
      { actor: "browser", label: "Browser re-renders (if needed)", detail: "If any DOM actually changed, the browser's own rendering pipeline (layout/paint) reacts: see Browser Rendering." },
    ],
    serverVsBrowser: {
      server: ["Can also run this exact render process to produce an HTML string instead of DOM mutations, that's what SSR is"],
      network: ["Not directly involved: this is a computation, not a transfer"],
      browser: ["Runs the render function(s), diffs the trees, commits real DOM mutations, then the browser's own pipeline reacts to whatever actually changed"],
      jsRequired: "Yes, for this specific mechanism, reconciliation is a JavaScript-side computation. (The *output* of a render, if it happened on the server, can reach the browser as plain HTML needing no JS to display.)",
      hydrationTiming: "Rendering and hydration are different operations entirely, rendering produces an element tree from scratch or via re-render; hydration reuses existing DOM instead of creating it. See Hydration.",
      withoutJs: "Without JS, React can't run in the browser at all, no re-renders happen. This is exactly why SSR exists: to get *a* render's output to the browser via plain HTML, independent of whether React can execute there.",
    },
    reactNextConnection:
      "This lesson *is* React's own mechanism, by definition, Next.js doesn't change how reconciliation works, it changes *where and when* React's render function gets called (on the server per request for SSR, once at build time for SSG, etc., see Rendering Strategies).",
    whyUseIt: [
      "Lets you write UI as a function of state, instead of hand-managing DOM mutations",
      "Reconciliation means most updates only touch the small part of the DOM that actually changed",
    ],
    tradeoffs: [
      { label: "Re-render frequency", note: "A parent re-rendering by default re-renders every child function too (even if the child's actual output doesn't change), `memo`/`useMemo` exist to opt specific subtrees out of that when profiling shows it matters." },
      { label: "Key mismanagement", note: "Wrong or missing `key`s in a list can make the diffing algorithm reuse the wrong DOM node for the wrong item, a subtle, hard-to-spot correctness bug, not just a performance one." },
    ],
    misconceptions: [
      { claim: "If a parent component rerenders, every child necessarily produces DOM changes.", reality: "A child's function re-running (\"rendering\") and the DOM actually changing are separate events, if a child's output is identical, reconciliation commits zero DOM mutations for it, even though the function ran again." },
      { claim: "\"Virtual DOM\" means React keeps a full copy of the DOM in memory for performance.", reality: "The \"virtual DOM\" is really just the plain JS element tree render functions return, its value isn't raw speed (a hand-optimized direct-DOM approach can be faster), it's the programming model of describing UI declaratively." },
    ],
  },
  {
    id: "hydration",
    whatIsThis:
      "**Hydration** is ==React attaching its event listeners and internal state to HTML that already exists in the DOM==, rather than creating that DOM from scratch, so a server-rendered (or statically generated) page becomes interactive.",
    whyItExists:
      "SSR/SSG solve \"get meaningful content on screen fast,\" but that HTML on its own has no click handlers, no state, nothing, it's **inert**. Hydration exists to ==bridge that gap==: reuse the DOM that's already there (don't throw it away and rebuild it, that would be wasteful and cause a visible flash) while wiring up the interactivity a full React app needs.",
    howItWorks:
      "React walks the existing DOM and the component tree *at the same time*, matching each element it expects to render against the DOM node already sitting there, and attaching event listeners and internal fiber state to it. It does not create new DOM nodes for anything that already matches. If what React expects to render doesn't match what's actually in the DOM (a hydration mismatch), React logs a warning and falls back to re-rendering the mismatched part client-side, discarding and replacing that piece of server HTML.",
    runtime: [
      { actor: "network", label: "HTML + JS arrive", detail: "Server-rendered HTML is already visible; the JS bundle for hydration downloads (often after, or in parallel)." },
      { actor: "browser", label: "Parse HTML", detail: "Static, non-interactive content is already visible to the user at this point." },
      { actor: "react", label: "Walk DOM + component tree together", detail: "React matches existing DOM nodes to what it would have rendered." },
      { actor: "react", label: "Attach listeners + state", detail: "No new DOM is created for matching nodes, just behavior is wired on." },
      { actor: "browser", label: "Interactive UI", detail: "Clicks, inputs, and state updates now work." },
    ],
    serverVsBrowser: {
      server: ["Produced the original HTML (via SSR/SSG) that hydration will attach to, server involvement ends before hydration begins"],
      network: ["Delivers the hydration JS bundle, which can be a meaningful delay after HTML is already visible"],
      browser: ["Does 100% of the hydration work, matching, attaching, and (on mismatch) re-rendering"],
      jsRequired: "Yes: hydration is fundamentally a JavaScript operation. Without JS, the server-rendered HTML remains visible and mostly usable (links, native form submission) but never becomes React-interactive.",
      hydrationTiming: "This *is* the hydration step, it happens after HTML is parsed/painted and after the JS bundle has downloaded and executed, which is why there's often a visible gap between \"looks done\" and \"actually responds to clicks.\"",
      withoutJs: "The server-rendered HTML stays exactly as it was sent, visible, but nothing hydration would have added (event handlers, client state) ever attaches.",
    },
    reactNextConnection:
      "`hydrateRoot` is React's actual API for this (as opposed to `createRoot`, used for rendering from scratch with no existing DOM). Next.js calls `hydrateRoot` automatically for every SSR/SSG page that ships client JS, you don't write this call yourself in a typical Next.js app, but it's exactly what's running.",
    whyUseIt: [
      "Avoids re-fetching/re-rendering everything client-side just to attach interactivity, you keep SSR's fast first paint *and* get a fully interactive app",
      "Lets content be visible and (partially) usable before JS has even finished downloading",
    ],
    tradeoffs: [
      { label: "Interactivity delay", note: "There's a real window where the page looks ready but isn't yet interactive, clicking during it can silently do nothing, a common source of \"the button doesn't work\" bug reports." },
      { label: "Hydration mismatches", note: "Anything that renders differently on the server vs. the client's first render (using `Date.now()`, `Math.random()`, or reading `localStorage` directly during render) breaks the assumption hydration depends on, see learning-notes/04 for a real example this project hit." },
      { label: "Bundle size directly gates interactivity", note: "A larger JS bundle means a longer wait before hydration can even start, this is precisely the problem Server Components target." },
    ],
    misconceptions: [
      { claim: "Hydration is the same thing as rendering HTML.", reality: "Rendering HTML (SSR) produces markup; hydration is a separate, later step that attaches behavior to markup that already exists, a page can be server-rendered and never hydrated (if no JS ships) or hydrated without ever having been server-rendered (a `createRoot` CSR app has no hydration step at all)." },
      { claim: "A hydration mismatch always means broken markup.", reality: "It often means the server and the client's first render simply disagreed about what to output (a non-deterministic value used during render), the markup itself can be perfectly valid HTML on both sides, just different HTML." },
    ],
    experiment: "hydration-toggle",
  },
  {
    id: "server-components",
    whatIsThis:
      "**Server Components** are React components that ==execute exclusively on the server==, whose output (already-rendered UI + serialized data) is sent to the client, ==their component code never ships to the browser at all==, and they carry no client-side JavaScript or state of their own.",
    whyItExists:
      "SSR solves \"send real HTML for first paint,\" but if the app is built entirely from Client Components, the *code* for the entire UI still has to ship to the browser for hydration, even for parts that never actually need to be interactive (a footer, a blog post's static prose, a product description). Server Components exist to let large parts of an app skip that cost entirely: ==if a component never needs interactivity, its code simply never needs to reach the browser==.",
    howItWorks:
      "A Server Component runs on the server (once per request, or once at build time for statically-generated routes) and its rendered output is serialized into a special format the client runtime can reconstruct into UI, alongside any Client Components' locations left as placeholders. Because Server Components never run in the browser, they can safely do things Client Components can't cleanly do, read from a database directly, use server-only secrets, import large libraries with zero client bundle cost, since none of that code is ever sent client-side. Client Components (marked `\"use client\"`) can be nested inside Server Components and are the only place `useState`, event handlers, and browser-only APIs are allowed.",
    runtime: [
      { actor: "server", label: "Render Server Components", detail: "Server Component tree executes on the server, can read data sources directly." },
      { actor: "server", label: "Serialize output", detail: "Rendered output + any Client Component boundaries are serialized for transport." },
      { actor: "network", label: "Send to browser", detail: "Only Client Components' code (and the serialized Server Component output) crosses the network, never Server Component source." },
      { actor: "browser", label: "Reconstruct UI", detail: "Client runtime rebuilds the UI from the serialized payload." },
      { actor: "react", label: "Hydrate Client Components only", detail: "Only the Client Component portions need hydration, Server Component output is already inert, correct HTML/UI with nothing to attach." },
    ],
    serverVsBrowser: {
      server: ["Executes Server Component functions entirely", "Can access databases, secrets, and server-only libraries directly, with zero client bundle cost"],
      network: ["Carries Server Components' serialized *output*, never their source code", "Carries Client Components' code, since that must run in the browser"],
      browser: ["Runs and hydrates only Client Components", "Never executes, and never even downloads, Server Component code"],
      jsRequired: "No JS is needed to see a Server Component's output, it's already rendered. JS is only needed for whatever Client Components exist alongside it.",
      hydrationTiming: "Server Components are never hydrated, there's no client-side version of them to reconcile against. Only Client Components in the tree go through hydration, and only their code needs to download first.",
      withoutJs: "Server Component output displays fully and correctly. Any Client Components in the tree remain visible (their server-rendered fallback/output still exists) but non-interactive, same as any Client Component without JS.",
    },
    reactNextConnection:
      "Server Components are a React feature (part of React's own component model, RSC, \"React Server Components\"), not a Next.js invention. Next.js's App Router made them the *default* for every component unless explicitly marked `\"use client\"`: that default is a Next.js/framework decision layered on top of a capability React itself defines.",
    whyUseIt: [
      "Shrinks the client JavaScript bundle by excluding any component that never needs interactivity",
      "Lets components safely do server-only work (direct database access, secrets) without an extra API layer",
      "Reduces the amount of code that needs hydrating, which can speed up time-to-interactive",
    ],
    tradeoffs: [
      { label: "No client-side state or effects", note: "Server Components genuinely cannot use `useState`, `useEffect`, or event handlers: any interactivity has to be pushed down into a nested Client Component, which requires deliberately drawing that boundary." },
      { label: "Mental model shift", note: "\"Which components run where\" becomes an explicit architectural decision instead of \"everything runs in the browser\": a real learning curve for teams used to pure CSR/SSR-without-RSC apps." },
      { label: "Ecosystem maturity", note: "Not every library or pattern has caught up to the Server/Client Component split yet, some client-only libraries need an explicit Client Component wrapper to use inside a Server Component tree." },
    ],
    misconceptions: [
      { claim: "Server Components are the same thing as SSR.", reality: "SSR is about *when HTML gets generated* (per request) and applies to Client Components too (they get server-rendered for first paint, then hydrated). Server Components are about *where component code executes and whether it ships to the client at all*, a Client Component is still typically SSR'd; a Server Component is never sent to the client as code, full stop." },
      { claim: "Using Server Components means the page has no interactivity.", reality: "Server and Client Components compose freely in the same tree, a page is almost always a mix, with interactivity concentrated in specific, deliberately-marked Client Component leaves or subtrees." },
    ],
  },
];
