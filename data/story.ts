import type { ConceptId } from "@/lib/types";

/**
 * The story mode: a fictional ticket drop where every technical choice
 * creates the next problem. Nothing here is a "best practice" answer: each
 * option lists what it costs, because the honest answer to "which rendering
 * strategy?" is always "for what?".
 *
 * Every technical claim must agree with the matching lesson in
 * `data/lessons`. Numbers are avoided on purpose: the story is fictional, so
 * an invented "230 ms" would look like a measurement.
 */

export type StoryMood = "boring" | "interesting" | "panic" | "plot-twist";

export const MOOD: Record<StoryMood, { label: string; color: string }> = {
  boring: { label: "The boring part", color: "var(--color-text-muted)" },
  interesting: { label: "The genuinely interesting part", color: "var(--state-got-it)" },
  panic: { label: "The panic part", color: "var(--state-revisit)" },
  "plot-twist": { label: "Plot twist", color: "var(--state-mastered)" },
};

/** An interactive demo shown inside a step. Implemented in components/story/StoryVisual.tsx. */
export type StoryVisualSpec =
  | { kind: "phone"; strategy: "csr" | "ssr" | "ssg" | "isr" }
  | { kind: "distance" }
  | { kind: "tap" }
  | { kind: "crowd" };

export interface StoryOption {
  label: string;
  /** What you'd say in the meeting: the argument for this option. */
  pitch: string;
  /** What it costs. Every option has one. */
  cost: string;
  to: string;
}

export interface StoryStep {
  id: string;
  /** Short label for the journey trail. */
  trail: string;
  title: string;
  mood: StoryMood;
  /** A one-line aside in the voice of the narrator. */
  aside: string;
  scene: string[];
  visual?: StoryVisualSpec;
  /** The problem this step ends on: why the next concept has to exist. */
  problem?: string;
  /** Concepts that become relevant here, each with the reason they showed up now. */
  concepts: { id: ConceptId; why: string }[];
  options?: StoryOption[];
  /** For steps without a decision. */
  next?: { label: string; to: string };
  /** Concepts the story will need later that aren't lessons yet. Honest placeholders. */
  comingSoon?: { topic: string; why: string }[];
}

export const STORY_START = "the-drop";

export const storySteps: StoryStep[] = [
  {
    id: "the-drop",
    trail: "The drop",
    title: "Aurora Tour goes on sale at 9:00 sharp",
    mood: "boring",
    aside: "Yes, this is the requirements meeting. Stay with us, it gets loud fast.",
    scene: [
      "You are the frontend engineer for a ticketing site. Tomorrow at **9:00**, the band *Aurora* opens sales for their world tour. Fans in Tokyo, Lisbon and Lagos will all be pressing the same button at the same second. Your servers, for reasons of history and budget, live in one data center in **Virginia**.",
      "The requirements, as written on a whiteboard by someone who will not be on call: each show needs a page people can **find on Google**. The page should feel **instant**, even on a mid-range phone. The **seat picker** has to be interactive. And the seat counts have to be **true**, not \"true as of Tuesday\".",
      "Notice that nothing on that list says \"rendering strategy\". You will be choosing one anyway, by accident or on purpose.",
    ],
    problem: "Four requirements that quietly pull in different directions. Where does the HTML for a show page come from?",
    concepts: [
      { id: "seo", why: "\"Findable on Google\" is a requirement, so what a crawler receives matters." },
      { id: "web-vitals", why: "\"Instant\" needs a number, or it is just an opinion." },
    ],
    next: { label: "Decision time: who builds the page?", to: "who-builds-the-page" },
  },
  {
    id: "who-builds-the-page",
    trail: "Who builds the page?",
    title: "Decision 1: where does the HTML come from?",
    mood: "interesting",
    aside: "This is the choice half the industry argues about on the internet. It is more fun than it sounds.",
    scene: [
      "A fan asks for `/events/tokyo`. Something has to produce the HTML that comes back. There are four honest candidates, and **none of them is \"best\"**: each one moves the work to a different place and a different moment.",
      "Pick one. You can come back and try the others: the story will not judge you (the traffic on sale day will, but that is later).",
    ],
    concepts: [
      { id: "csr", why: "The browser builds the page from JavaScript." },
      { id: "ssr", why: "The server builds the page for every request." },
      { id: "ssg", why: "The page is built once, ahead of time." },
      { id: "isr", why: "Built ahead of time, then quietly rebuilt now and then." },
    ],
    options: [
      { label: "Client-side rendering (CSR)", pitch: "One small HTML shell, and the browser does the rest. Cheap to host, and the interactive parts come naturally.", cost: "A crawler and a fan on a slow phone both get an empty page first.", to: "path-csr" },
      { label: "Server-side rendering (SSR)", pitch: "The server builds fresh HTML for every request, so the content and the seat counts are in the response.", cost: "Every visitor costs server work, and the server is in Virginia.", to: "path-ssr" },
      { label: "Static generation (SSG)", pitch: "Build every show page once at deploy time and serve ready-made files. Very fast and cheap to serve.", cost: "The page is only as fresh as the last build.", to: "path-ssg" },
      { label: "Incremental static regeneration (ISR)", pitch: "Static speed, but pages get rebuilt in the background so they don't go stale for long.", cost: "Still not \"live\", and you have to decide how stale is acceptable.", to: "path-isr" },
    ],
  },
  {
    id: "path-csr",
    trail: "CSR",
    title: "You chose CSR: the empty room",
    mood: "interesting",
    aside: "The page is there. Technically. It just has not arrived yet.",
    scene: [
      "The response for `/events/tokyo` is nearly empty: a `<div id=\"root\"></div>` and a script tag. The fan's browser downloads the JavaScript, runs it, asks for the show data, and only then draws anything. On a fast laptop that feels fine. On a mid-range phone in a crowd at 9:00, it is a blank screen and a spinner.",
      "And Google? It renders JavaScript, but as a **separate, queued step** after it fetches your HTML. For a page that must be found, you have made your most important content wait in a line.",
    ],
    visual: { kind: "phone", strategy: "csr" },
    problem: "The first thing a visitor and a crawler receive is nothing. Can the server send something real?",
    concepts: [
      { id: "csr", why: "This is what you just chose." },
      { id: "seo", why: "The empty shell is what a crawler gets first." },
      { id: "js-main-thread", why: "All that JavaScript has to run on the phone's single main thread before anything appears." },
    ],
    next: { label: "Fine, let's see what the server can do", to: "path-ssr" },
  },
  {
    id: "path-ssr",
    trail: "SSR",
    title: "SSR: the server does the work (in Virginia)",
    mood: "panic",
    aside: "Geography, it turns out, is a performance problem.",
    scene: [
      "Now the response contains the real page: the show, the date, the seats. A crawler reads it at once, and a fan sees content before any JavaScript arrives. This is the version that feels right on the whiteboard.",
      "Then you remember where the server lives. Every request from Tokyo has to cross an ocean to Virginia and back **before the first byte of HTML**. And on sale day, every one of those requests also makes the server *work*, at the same second, for everyone.",
      "SSR solved \"what does the first response contain\". It also made the server the busiest character in the story.",
    ],
    visual: { kind: "distance" },
    problem: "Rendering per request is fresh but expensive, and the distance is built in. Do you really need to build this page for every fan?",
    concepts: [
      { id: "ssr", why: "This is what you just chose." },
      { id: "seo", why: "The content is in the first response, so a crawler sees it immediately." },
      { id: "web-vitals", why: "Slow time to first byte from far away hurts the loading metrics." },
    ],
    comingSoon: [
      { topic: "CDN and edge", why: "Where your code and your files physically live changes how far every request has to travel. A dedicated lesson is planned." },
    ],
    next: { label: "Could we build the page before anyone asks?", to: "path-ssg" },
  },
  {
    id: "path-ssg",
    trail: "SSG",
    title: "SSG: build them all in advance",
    mood: "boring",
    aside: "This is the boring option, and boring is a compliment on sale day.",
    scene: [
      "Every show page is built **once, at build time**, and the result is plain files that any CDN can hand out. No server work per fan. The page is in the response, so the crawler is happy. It is genuinely hard to beat for speed and cost.",
      "The catch is the word *build*. With thousands of show pages, a full build takes a while, and **deploy time** becomes a real event: you cannot ship a fix at 8:59 without rebuilding, and the page only knows what the data looked like when it was built.",
      "So what about the seat count? A build at 8:00 does not know how many seats are left at 9:00:01.",
    ],
    visual: { kind: "phone", strategy: "ssg" },
    problem: "Static pages are fast and cheap, but frozen at build time. Tickets sell out in seconds.",
    concepts: [
      { id: "ssg", why: "This is what you just chose." },
      { id: "caching", why: "A prebuilt page is a permanently cached render." },
    ],
    next: { label: "What if the pages could refresh themselves?", to: "path-isr" },
  },
  {
    id: "path-isr",
    trail: "ISR",
    title: "ISR: static, with a refresh",
    mood: "interesting",
    aside: "Cheating, but the good kind: you get to keep the speed.",
    scene: [
      "Pages are served from a cache like static ones, but after a set time (or when you tell it to) the next request triggers a rebuild in the background. The visitor still gets a fast page, and the next one gets a newer one. You can also refresh one show's page on demand when something important changes.",
      "It is a great fit for content that changes now and then: venue details, descriptions, the schedule. It is a poor fit for a number that changes every second.",
      "Which brings a useful insight: not every part of this page has the same freshness needs. The show description can be a day old. The seat count cannot.",
    ],
    visual: { kind: "phone", strategy: "isr" },
    problem: "Different parts of one page need different freshness. And whichever way the HTML arrives, the page still has to *do* something: the seat picker needs JavaScript.",
    concepts: [
      { id: "isr", why: "This is what you just chose." },
      { id: "caching", why: "ISR is caching applied to rendered pages." },
    ],
    next: { label: "The HTML arrived. Why can't I click anything?", to: "looks-ready-feels-dead" },
  },
  {
    id: "looks-ready-feels-dead",
    trail: "Looks ready, feels dead",
    title: "The page is there. The button is not.",
    mood: "plot-twist",
    aside: "A page that looks alive and isn't is one of the most frustrating things on the internet.",
    scene: [
      "Whichever strategy you picked, the server (or the build) sent HTML. A fan can *see* the seat picker. They tap a seat. **Nothing happens.** The HTML is just a picture of the UI until JavaScript downloads, runs, and attaches the click handlers to it. That attaching step is called **hydration**.",
      "And hydration is not free. React has to run your components in the browser to work out what the page is supposed to be, which happens on the **main thread**, the one thread that also handles taps and scrolling. If it is busy hydrating a huge page, the tap waits.",
      "This is exactly what the *responsiveness* metric measures, and it is why a page can look fast and feel slow.",
    ],
    visual: { kind: "tap" },
    problem: "Hydrating everything makes the browser do a lot of work, much of it for parts of the page that never needed to be interactive.",
    concepts: [
      { id: "hydration", why: "The HTML needs behavior attached before taps do anything." },
      { id: "js-main-thread", why: "Hydration runs on the same thread that handles input." },
      { id: "web-vitals", why: "INP is the number that catches this feeling." },
    ],
    next: { label: "Does the whole page really need JavaScript?", to: "how-much-js" },
  },
  {
    id: "how-much-js",
    trail: "How much JavaScript?",
    title: "Decision 2: what actually runs in the browser?",
    mood: "interesting",
    aside: "The single most useful question in modern React: does this piece need to be in the browser at all?",
    scene: [
      "Look at a show page honestly. The description, the venue, the date and the photos never change while you look at them. The **seat picker** and the **quantity stepper** do. If the whole page is one big client-side bundle, you pay to download and hydrate the parts that were never interactive.",
      "React's Server Components model answers this: components are server-only by default, and you mark only the interactive leaves with `\"use client\"`. The server components' code never ships to the browser at all.",
    ],
    concepts: [
      { id: "server-components", why: "Code that runs only on the server and never ships to the browser." },
      { id: "client-components", why: "The interactive leaves that do need the browser." },
    ],
    options: [
      { label: "Make the whole page a Client Component", pitch: "Simplest mental model: everything in one place, everything can use state.", cost: "The boundary spreads through imports, so most of the page ships and hydrates whether it needs to or not.", to: "the-slow-part" },
      { label: "Server by default, client only where needed", pitch: "Only the seat picker and stepper ship as JavaScript. Everything else stays on the server.", cost: "You now decide, per component, which side of the line it lives on, and props crossing it must be serializable.", to: "the-slow-part" },
    ],
  },
  {
    id: "the-slow-part",
    trail: "The slow part",
    title: "One slow query holds the whole page hostage",
    mood: "panic",
    aside: "Your entire page is waiting for one database call. It is a hostage situation.",
    scene: [
      "The page is mostly ready, but the **live seat map** needs a slow lookup. If the server waits for it before sending anything, every fan stares at a blank screen while one query finishes, even though most of the page was ready long ago.",
      "**Streaming** lets the server send the ready parts of the page immediately and fill in the slow part when its data arrives, with a placeholder in the meantime. The fan reads the show details while the seat map loads.",
      "Streaming, hydration and Server Components are three different ideas that people constantly blur together. Streaming is only about *when* pieces of output are delivered.",
    ],
    problem: "The page now arrives in pieces, but the server still does real work every time. On sale day, that work is multiplied by everyone.",
    concepts: [
      { id: "streaming", why: "Send what's ready, fill in what's slow." },
      { id: "server-components", why: "Where the slow data is fetched, right next to the component that needs it." },
    ],
    next: { label: "9:00:01. Everyone arrives at once.", to: "nine-oh-one" },
  },
  {
    id: "nine-oh-one",
    trail: "9:00:01",
    title: "9:00:01, and everybody is here",
    mood: "panic",
    aside: "This is the part where the interesting stuff becomes the essential stuff.",
    scene: [
      "Ten thousand fans ask for the same page in the same second. Ten thousand identical renders would be absurd. The whole point of **caching** is to do the expensive work once and reuse the result for everyone who asks for the same thing, at every layer: the browser, a CDN close to the fan, the server, the database.",
      "That is why the answer to \"which rendering strategy?\" is almost never one. The show description can be cached hard. The seat count needs to be fresh or nearly fresh. And the fan's own place in the queue is different for everyone, so it cannot be shared at all.",
      "That last idea, **personalization**, is the natural enemy of caching, and it is where a lot of real-world architecture gets interesting.",
    ],
    visual: { kind: "crowd" },
    problem: "You now have a design with several moving parts. How would you know it actually works for real fans?",
    concepts: [
      { id: "caching", why: "Do the expensive work once and reuse it, at the layer closest to the fan." },
      { id: "isr", why: "Rebuild popular pages in the background instead of on every request." },
    ],
    comingSoon: [
      { topic: "Personalization and caching", why: "How to serve one cached page to everyone while still showing each fan their own data. A dedicated lesson is planned." },
      { topic: "CDN and edge", why: "Serving the cached copy from a location near the fan instead of from Virginia." },
      { topic: "Data fetching and waterfalls", why: "Why a page that fetches things one after another is slower than it needs to be." },
    ],
    next: { label: "How would you know it worked?", to: "did-it-work" },
  },
  {
    id: "did-it-work",
    trail: "Did it work?",
    title: "How would you know?",
    mood: "interesting",
    aside: "\"It felt fast on my laptop\" is not a metric. Your laptop is not a fan in Lagos on a bad connection.",
    scene: [
      "You have made a lot of decisions. The honest way to check them is to measure what real visitors experience, not what your development machine does. That means the three Core Web Vitals (loading, responsiveness, stability), and the difference between **lab data** (a controlled test) and **field data** (real people on real devices).",
      "If the loading number is bad, look at time to first byte and the size of what you send. If responsiveness is bad, look for long tasks and heavy hydration on the main thread. If the layout jumps, look at what arrives late and pushes things around. Each symptom points back to a decision in this story.",
    ],
    concepts: [
      { id: "web-vitals", why: "The numbers that tell you whether the decisions worked, and for whom." },
      { id: "js-main-thread", why: "The place to look when responsiveness is the problem." },
    ],
    comingSoon: [
      { topic: "Measuring in practice: lab versus field", why: "How to set up real-user measurement and read it. A dedicated lesson is planned." },
      { topic: "Bundle size and code splitting", why: "Shipping only the JavaScript a page needs for its first screen." },
    ],
    next: { label: "Finish the story", to: "the-end" },
  },
  {
    id: "the-end",
    trail: "The end (for now)",
    title: "What you actually decided",
    mood: "boring",
    aside: "No confetti. Just an honest summary, which is rarer.",
    scene: [
      "You never picked \"the best\" strategy, because there isn't one. You decided **where** work happens (build, server, browser), **when** (ahead of time, per request, on demand) and **for whom** (everyone, or one fan). Each answer created the next problem, and each problem had a concept ready to explain it.",
      "That chain, *problem, concept, new problem*, is the thing worth keeping. It is also what an interviewer is really asking when they say \"walk me through how you'd render this page\".",
      "Go back and try a different path: choose SSG first, or make the whole page a Client Component, and see which problems appear.",
    ],
    concepts: [],
    next: { label: "Start over and take another path", to: "the-drop" },
  },
];

export const storyMap: Record<string, StoryStep> = Object.fromEntries(
  storySteps.map((s) => [s.id, s]),
);
