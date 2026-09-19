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

/**
 * Where a concept sits in the project's own conceptual progression
 * (see CLAUDE.md / phase-2 instructions): web fundamentals first, then
 * rendering strategies, then React/Next.js as the concrete implementation,
 * then delivery and production concerns. Drives the lesson page's
 * breadcrumb, separate from `ConceptCategory`, which is about the map's
 * visual grouping.
 */
export type PipelineStage =
  | "web-fundamentals"
  | "rendering-strategies"
  | "react-nextjs"
  | "modern-delivery"
  | "production-concerns";

/** The anchor ids of a lesson page's sections, typed so a topic link can't point at a section that doesn't exist. */
export type LessonSectionId =
  | "what-is-this"
  | "why-it-exists"
  | "how-it-works"
  | "runtime"
  | "server-vs-browser"
  | "react-next"
  | "why-use-it"
  | "tradeoffs"
  | "misconceptions"
  | "experiment"
  | "in-this-site"
  | "test-yourself"
  | "go-deeper"
  | "related";

/** A "you'll learn this" bullet in the map panel that deep-links into a lesson section. */
export interface LessonTopic {
  label: string;
  section: LessonSectionId;
  /** Plain-English meaning of the topic, revealed on hover/focus in the map panel. */
  hint: string;
}

export interface Concept {
  id: ConceptId;
  title: string;
  /** Concept-specific preview of what the lesson covers, shown in the map panel. */
  topics: LessonTopic[];
  /** One-sentence plain-English summary, used in the hover tooltip. */
  blurb: string;
  category: ConceptCategory;
  stage: PipelineStage;
  /** Concepts that should ideally be understood first. Informational only, nothing is locked. */
  prerequisites: ConceptId[];
  /** Position in the map's SVG coordinate space (1600x800 viewBox). */
  position: { x: number; y: number };
  /** Position in the portrait (phone) layout of the same graph (360x1010 viewBox). */
  mobilePosition: { x: number; y: number };
}

export type ProgressState = Record<ConceptId, NodeStatus>;

// ---------------------------------------------------------------------------
// Phase 2: lesson content
// ---------------------------------------------------------------------------

/** Which side of the network a runtime step happens on, drives color/grouping in RuntimeSequence. */
export type RuntimeActor = "browser" | "network" | "server" | "react";

export interface RuntimeStep {
  actor: RuntimeActor;
  label: string;
  detail: string;
  /** What the visitor would see and be able to do at this step (used by the timeline experiments). */
  userSees?: { text: string; visible: boolean; interactive: boolean };
}

export interface ServerVsBrowser {
  server: string[];
  network: string[];
  browser: string[];
  jsRequired: string;
  hydrationTiming: string;
  withoutJs: string;
}

export interface Tradeoff {
  label: string;
  note: string;
}

export interface Misconception {
  claim: string;
  reality: string;
}

/**
 * Which interactive experiment (if any) this concept's lesson embeds.
 * A discriminated tag, not a component reference, keeps `data/lessons`
 * free of JSX/component imports, and lets the lesson page own the switch
 * from tag to actual component.
 */
export type ExperimentKind =
  | "ssr-timeline"
  | "csr-timeline"
  | "hydration-toggle"
  | "streaming-chunks"
  | "cache-layers";

export interface Lesson {
  id: ConceptId;
  whatIsThis: string;
  whyItExists: string;
  howItWorks: string;
  runtime: RuntimeStep[];
  serverVsBrowser: ServerVsBrowser;
  /** How React and/or Next.js implements or relates to this concept, never "this IS React." */
  reactNextConnection: string;
  whyUseIt: string[];
  tradeoffs: Tradeoff[];
  misconceptions: Misconception[];
  experiment?: ExperimentKind;
}

export type InterviewCategory =
  | "fundamentals"
  | "tricky"
  | "scenario"
  | "senior"
  | "debugging";

export interface InterviewQuestion {
  category: InterviewCategory;
  question: string;
  answer: string;
  reasoning: string;
  example?: string;
  followUp: string;
}

// ---------------------------------------------------------------------------
// Worked examples (collapsed under the first three lesson sections, and the
// React/Next.js section)
// ---------------------------------------------------------------------------

export interface CodeSnippet {
  /** Label shown on the block: "tsx", "http", "html", "css", "text", "shell". */
  lang: string;
  code: string;
  caption?: string;
  /** 1-based line numbers to highlight. */
  mark?: number[];
  /** True when the snippet is real code from this website, not an illustration. */
  fromSite?: boolean;
}

export interface Example {
  title: string;
  snippets: CodeSnippet[];
  /** Plain-English points that connect the snippet back to the concept. */
  notice: string[];
}

export type ExampleSlot = "whatIsThis" | "whyItExists" | "howItWorks" | "reactNext";

/**
 * Optional per section on purpose: an example only earns its place if it adds
 * something the page doesn't already show (a timeline that repeats the runtime
 * diagram or the experiment right below it does not).
 */
export type ConceptExamples = Partial<Record<ExampleSlot, Example>>;
