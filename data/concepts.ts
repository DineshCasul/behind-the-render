import type { Concept } from "@/lib/types";

/**
 * The Phase 1 concept set. Positions are hand-placed in a 1600x800 SVG
 * coordinate space, laid out by dependency "layer" (longest path from a
 * root) so the map reads left-to-right as a flow, with the CSR/SSR/SSG/ISR
 * branch fanning out and rejoining at React Rendering.
 */
export const concepts: Concept[] = [
  {
    id: "http",
    title: "HTTP",
    blurb: "The request/response protocol that starts every page load.",
    category: "foundation",
    prerequisites: [],
    position: { x: 80, y: 400 },
  },
  {
    id: "browser-rendering",
    title: "Browser Rendering",
    blurb: "How the browser turns a response into a pixel-painted page.",
    category: "foundation",
    prerequisites: ["http"],
    position: { x: 300, y: 400 },
  },
  {
    id: "html-parsing",
    title: "HTML Parsing",
    blurb: "The browser reads HTML top to bottom, building the DOM as it goes.",
    category: "foundation",
    prerequisites: ["browser-rendering"],
    position: { x: 520, y: 400 },
  },
  {
    id: "csr",
    title: "CSR",
    blurb: "Client-Side Rendering: the browser builds the UI with JavaScript after load.",
    category: "strategy",
    prerequisites: ["html-parsing"],
    position: { x: 740, y: 220 },
  },
  {
    id: "ssr",
    title: "SSR",
    blurb: "Server-Side Rendering: the server builds HTML before sending it to the browser.",
    category: "strategy",
    prerequisites: ["html-parsing"],
    position: { x: 740, y: 560 },
  },
  {
    id: "ssg",
    title: "SSG",
    blurb: "Static Site Generation: pages are rendered once, at build time.",
    category: "strategy",
    prerequisites: ["ssr"],
    position: { x: 960, y: 460 },
  },
  {
    id: "isr",
    title: "ISR",
    blurb: "Incremental Static Regeneration: static pages that quietly re-render on a schedule.",
    category: "strategy",
    prerequisites: ["ssr"],
    position: { x: 960, y: 680 },
  },
  {
    id: "caching",
    title: "Caching",
    blurb: "Storing rendered output so future requests skip the expensive work.",
    category: "optimization",
    prerequisites: ["ssg", "isr"],
    position: { x: 1180, y: 570 },
  },
  {
    id: "react-rendering",
    title: "React Rendering",
    blurb: "How React turns components into a tree, and re-renders it when state changes.",
    category: "react",
    prerequisites: ["csr", "ssr"],
    position: { x: 960, y: 220 },
  },
  {
    id: "hydration",
    title: "Hydration",
    blurb: "Attaching React's event handlers and state onto server-rendered HTML.",
    category: "react",
    prerequisites: ["react-rendering"],
    position: { x: 1180, y: 220 },
  },
  {
    id: "server-components",
    title: "Server Components",
    blurb: "React components that run only on the server and never ship their code to the browser.",
    category: "react",
    prerequisites: ["hydration"],
    position: { x: 1400, y: 220 },
  },
  {
    id: "streaming",
    title: "Streaming",
    blurb: "Sending rendered output to the browser in pieces, as it becomes ready.",
    category: "react",
    prerequisites: ["server-components"],
    position: { x: 1520, y: 400 },
  },
];

export const conceptMap: Record<string, Concept> = Object.fromEntries(
  concepts.map((c) => [c.id, c]),
);

export const categoryLabels: Record<Concept["category"], string> = {
  foundation: "Foundation",
  strategy: "Rendering Strategy",
  react: "React",
  optimization: "Optimization",
};
