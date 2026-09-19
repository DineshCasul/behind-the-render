export type ConceptId =
  | "http"
  | "browser-rendering"
  | "html-parsing"
  | "csr"
  | "ssr"
  | "ssg"
  | "isr"
  | "react-rendering"
  | "hydration"
  | "server-components"
  | "streaming"
  | "caching";

export type NodeStatus =
  | "not-started"
  | "learning"
  | "got-it"
  | "revisit"
  | "mastered";

export type ConceptCategory =
  | "foundation"
  | "strategy"
  | "react"
  | "optimization";

export interface Concept {
  id: ConceptId;
  title: string;
  /** One-sentence plain-English summary, used in the hover tooltip. */
  blurb: string;
  category: ConceptCategory;
  /** Concepts that should ideally be understood first. Informational only — nothing is locked. */
  prerequisites: ConceptId[];
  /** Position in the map's SVG coordinate space (1600x800 viewBox). */
  position: { x: number; y: number };
}

export type ProgressState = Record<ConceptId, NodeStatus>;
