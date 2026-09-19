# The Rendering Project — Phase 2 Instructions

## Context

Phase 1 is complete.

The landing page and interactive knowledge map are already implemented. Phase 2 is about turning the map into a real learning experience.

Before implementing anything, inspect the existing Phase 1 code and `learning-notes/` so the lesson system fits the existing architecture and visual language.

---

# Core Product Philosophy

This project is **not a React tutorial** and it is not intended to be a generic web-development documentation site.

The central question of the project is:

> **What actually happens between a web request and pixels on the screen?**

The project should teach modern web rendering from the underlying web/browser concepts upward, and then use React/Next.js as the primary concrete implementation.

The conceptual progression should be:

```text
WEB FUNDAMENTALS
        ↓
RENDERING STRATEGIES
        ↓
REACT / NEXT.JS IMPLEMENTATION
        ↓
MODERN DELIVERY
        ↓
PRODUCTION CONCERNS
```

React should be treated as a major practical example, not as the definition of web rendering.

---

# Important Content Rule

For every concept, distinguish between:

1. The general web/browser concept.
2. How React implements or interacts with that concept.
3. How Next.js implements or extends it.
4. What tradeoffs exist in real production systems.

For example:

### SSR

Do not teach:

> "SSR is what Next.js does."

Instead teach:

```text
What is server-side rendering?
        ↓
Why would a server generate HTML?
        ↓
What does the browser receive?
        ↓
How does the browser render it?
        ↓
Where does JavaScript enter?
        ↓
How does React hydrate it?
        ↓
How does Next.js implement this?
        ↓
What are the production tradeoffs?
```

Apply this principle throughout the project.

---

# Scope

Phase 2 should build the learning/lesson system for the initial concepts.

Initial concepts:

```text
HTTP
Browser Rendering
HTML Parsing
CSR
SSR
SSG
ISR
React Rendering
Hydration
Server Components
Streaming
Caching
```

Do not attempt to fully cover every advanced rendering topic yet.

The architecture should make it easy to add future concepts.

---

# Learning Experience

Each concept should follow this learning progression:

```text
LEARN
  ↓
VISUALIZE
  ↓
EXPERIMENT
  ↓
EXPLAIN
  ↓
INTERVIEW
  ↓
CONNECT
```

The user should not simply read documentation.

The lesson should help them build a mental model.

---

# Lesson Structure

Each concept page should contain appropriate sections such as:

### 1. What is this?

A concise plain-English explanation.

Assume the learner is an experienced frontend developer who may know the terminology but wants to understand what is actually happening underneath.

Avoid beginner-level filler.

---

### 2. Why does it exist?

Explain the problem that the technology/concept solves.

This is extremely important.

Do not begin with API syntax.

Start with:

> What problem were engineers trying to solve?

---

### 3. How does it work?

Explain the underlying mechanism.

Use diagrams, timelines, request flows, browser/server boundaries, and visual explanations whenever they improve understanding.

---

### 4. What happens at runtime?

Describe the actual sequence of events.

For example:

```text
Browser
  ↓
HTTP Request
  ↓
Server
  ↓
HTML Generation
  ↓
HTTP Response
  ↓
Browser Parsing
  ↓
DOM
  ↓
React Hydration
  ↓
Interactive UI
```

Use animated visualizations where appropriate.

---

### 5. Server vs Browser

Clearly identify:

* What runs on the server?
* What runs in the browser?
* What gets sent over the network?
* What JavaScript is required?
* When does rendering happen?
* When does hydration happen?
* What happens if JavaScript is disabled?

This distinction should be especially strong for SSR, Server Components, hydration, streaming, and Next.js concepts.

---

### 6. React / Next.js Connection

When relevant, explain:

> "Here is how React/Next.js implements or interacts with the broader concept."

Do not imply that React/Next.js is the only way to implement the concept.

---

### 7. Why would we use this?

Discuss practical use cases.

Examples:

* SEO
* initial rendering
* perceived performance
* reduced client work
* caching
* scalability
* personalization
* static content
* dynamic content

Avoid saying that a technique is universally "better."

Explain the tradeoffs.

---

### 8. Tradeoffs

Every major rendering strategy should discuss:

* performance
* server cost
* client JavaScript
* caching
* freshness
* complexity
* SEO
* scalability
* user experience

The goal is to develop engineering judgment.

---

### 9. Common Misconceptions

Include genuinely useful misconceptions.

Examples:

> SSR does not automatically mean faster websites.

> Server Components are not the same thing as SSR.

> Hydration is not the same thing as rendering HTML.

> SSG does not mean the application cannot have dynamic behavior.

> Streaming does not mean the browser receives one complete HTML document instantly.

Focus on misconceptions that commonly appear in senior interviews.

---

# Experiments

Experiments are a core part of the project.

Whenever a concept can be demonstrated visually, prefer an interactive experiment over a long textual explanation.

Examples:

## SSR

```text
REQUEST
   ↓
SERVER
   ↓
HTML
   ↓
BROWSER
   ↓
HYDRATION
   ↓
INTERACTIVE
```

Allow the user to observe each stage.

---

## CSR

```text
REQUEST
   ↓
HTML SHELL
   ↓
JAVASCRIPT
   ↓
REACT
   ↓
UI
```

---

## Hydration

Provide controls such as:

```text
Server HTML       [ON/OFF]
JavaScript        [ON/OFF]
Hydration         [ON/OFF]
```

Show visually what changes when each stage is enabled/disabled.

---

## Streaming

Show content arriving progressively instead of presenting it as one completed response.

---

## Caching

Visualize:

```text
Browser
   ↓
CDN
   ↓
Server
   ↓
Database
```

Then show which layers are hit depending on cache state.

---

# Interview Section

Every major concept should eventually contain approximately 10 interview questions.

Questions should not be trivial definition questions.

Use categories such as:

* Fundamentals
* Tricky
* Scenario
* Senior
* Debugging

Questions should test understanding and reasoning.

Examples:

### SSR

> Why doesn't SSR automatically make a page faster?

### Hydration

> What can cause a hydration mismatch, and why?

### React rendering

> If a parent component rerenders, does every child necessarily produce DOM changes?

### Caching

> A page is fast locally but slow in production. How would you determine whether caching is involved?

### Streaming

> When would streaming improve perceived performance without improving the total server computation time?

Include:

* answer
* reasoning
* example where useful
* follow-up question

The goal is interview preparation through understanding, not memorization.

---

# Concept Connections

Every lesson should show where the concept sits in the larger rendering model.

For example:

```text
HTTP
 ↓
Browser Rendering
 ↓
CSR / SSR / SSG / ISR
 ↓
React Rendering
 ↓
Hydration
 ↓
Server Components
 ↓
Streaming
 ↓
Caching
```

Allow users to navigate to related concepts.

The learning map remains the primary navigation system.

---

# Progress

The existing Phase 1 progress/status system should integrate with lessons.

Statuses:

```text
Not Started
Learning
Got It
Revisit
Mastered
```

Completing or interacting with a lesson should be able to update progress.

Do not turn the experience into a generic LMS.

The knowledge map should remain the primary visual representation of progress.

---

# Obsidian Learning System

This is extremely important.

The `learning-notes/` directory is not merely project documentation.

It is the developer's parallel learning system.

Whenever you implement something technically meaningful, identify the underlying engineering concept and create or update the appropriate Obsidian-compatible Markdown note.

Maintain:

```text
learning-notes/
├── 00-build-log.md
├── ...
```

---

# Learning Note Requirements

A meaningful note should include:

## What is this?

Plain-English explanation.

## Why are we using it here?

Connect the concept directly to this project.

## What did Claude implement?

Reference the actual project files/components.

## How does it work?

Explain the underlying mechanism rather than merely describing the code.

## What happens at runtime?

Use sequences or diagrams where helpful.

## Parent → Child relationship

Explain:

* who renders whom
* props
* state
* rerender behavior
* client/server boundaries

## Rendering behavior

Explain:

* server vs browser execution
* what gets rendered
* when it gets rendered
* what gets sent to the browser
* whether JavaScript is required
* hydration behavior where relevant

## Why this approach?

Explain the engineering reasoning and tradeoffs.

## Alternatives

Compare meaningful alternatives.

Examples:

```text
SVG vs Canvas vs WebGL
CSS animation vs Framer Motion
Server Component vs Client Component
```

## Interview Questions

Include 3–5 useful questions, including at least one senior/scenario question.

## Related Concepts

Use Obsidian wiki links:

```text
[[Hydration]]
[[React Rendering]]
[[Server Components]]
[[Streaming]]
```

Do not create learning notes for trivial JSX, obvious styling, variable renames, or insignificant implementation details.

---

# Build Log

Update:

```text
learning-notes/00-build-log.md
```

For each meaningful implementation step record:

* what was implemented
* important files
* concepts introduced
* architectural decisions
* learning checkpoint

Example:

```md
## Learning Checkpoint

After this step, I should understand:

1. How dynamic routes work.
2. How a lesson page is selected from a URL.
3. How the lesson component tree is constructed.
4. Which components run on the server.
5. Which components require client-side JavaScript.
6. Why interactive experiments require client-side behavior.
```

---

# Library / Framework Rule

Whenever introducing a framework feature or library, explain:

1. What problem does it solve?
2. What does it actually do?
3. Why do we need it here?
4. What could we do without it?
5. What are the performance implications?
6. What interview concepts does it introduce?

Do not add libraries simply because they are convenient.

Keep the project lightweight.

---

# Architecture

Inspect the Phase 1 architecture before deciding the final structure.

A possible direction is:

```text
app/
  page.tsx
  learn/
    [slug]/
      page.tsx

components/
  learning-map/
  lesson/
  experiments/
  ui/

data/
  concepts.ts
  lessons/
  questions/

lib/
  progress.ts
  storage.ts

learning-notes/
```

Do not blindly follow this structure if the existing Phase 1 architecture suggests a cleaner approach.

Avoid overengineering.

---

# Visual Direction

Phase 2 must inherit the visual identity established in Phase 1.

Do not turn the lesson pages into a generic documentation site.

The experience should still feel like:

* technical
* cinematic
* interactive
* experimental
* modern
* focused

Use the existing visual language rather than introducing a completely separate design system.

Interactive diagrams should feel like part of the same world as the knowledge map.

---

# Performance

Performance is itself part of the project's subject matter.

Avoid:

* unnecessary continuous animation
* excessive blur
* layout-triggering animations
* unnecessarily large dependencies
* huge client-side bundles
* rendering everything on the client without reason

Prefer:

* server rendering where appropriate
* transform/opacity animations
* lazy loading for heavy experiments
* client components only where interactivity requires them
* `prefers-reduced-motion`
* lightweight SVG/CSS visualizations where possible

The implementation should demonstrate good frontend engineering rather than merely talking about it.

---

# What NOT to Build Yet

Do not add:

* authentication
* database
* CMS
* admin panel
* backend services
* user accounts
* complicated gamification
* unnecessary state-management libraries
* dozens of dependencies
* every possible rendering technology

Local TypeScript data and localStorage are sufficient for now.

---

# Phase 2 Goal

By the end of Phase 2, the user should be able to:

1. Click a concept from the knowledge map.
2. Enter a polished lesson experience.
3. Understand the concept from fundamentals to implementation.
4. Visualize what happens at runtime.
5. Run an interactive experiment where appropriate.
6. Test themselves with interview questions.
7. Mark the concept's learning status.
8. Navigate to related concepts.
9. See their progress reflected in the knowledge map.
10. Read the corresponding Obsidian learning notes to understand how the application itself was built.

The end result should feel less like:

> "a documentation website"

and more like:

> **an interactive laboratory for understanding how the modern web renders applications.**

---

# Before Coding

First inspect:

* the existing Phase 1 implementation
* component structure
* data structure
* styling/design system
* progress implementation
* `learning-notes/`
* `00-build-log.md`

Then report:

### 1. Current architecture

What Phase 1 currently looks like.

### 2. Proposed Phase 2 architecture

Which components/files you intend to add or modify.

### 3. Content architecture

How concepts, lessons, experiments, questions, and relationships will be represented.

### 4. Technical concepts I will learn

List the important engineering concepts introduced by Phase 2.

### 5. What will NOT be changed

Explicitly identify stable Phase 1 pieces that should remain untouched.

Only then begin implementation.

Do not rewrite Phase 1 unnecessarily.
