The Rendering Lab

Build a polished, interactive learning website for Modern Web Rendering.

The purpose is two things:

Build an impressive frontend project.

Help me deeply understand the concepts being used while the project is being built.

I am a frontend engineer preparing for senior-level interviews and moving toward full-stack development.



1\. The Product

The website is called:

The Rendering Lab

> Renamed during Phase 1 (2026-09-19) to **Behind the Render** — the original name read as generic. (Briefly renamed to "Critical Path" first, then changed again per direct request.) See learning-notes/00-build-log.md. The rest of this spec's product description, concepts, and requirements are unaffected — only the display name changed.

Tagline:

Explore how the modern web turns a request into pixels.

This is an interactive learning environment, NOT a documentation website.

It should feel like a:

technical laboratory

interactive knowledge map

developer experiment environment

cinematic/futuristic interface

Avoid making it look like:

a generic SaaS dashboard

a Notion clone

a collection of cards

a traditional online course



2\. Main Subject

The main subject is:

Modern Web Rendering

Topics will eventually include:

HTTP

Browser request lifecycle

HTML parsing

Browser rendering

CSR

SSR

SSG

ISR

React rendering

Reconciliation

Hydration

Server Components

Client Components

Streaming

Suspense

Data fetching

Caching

Performance

Deployment

Full-stack request lifecycle

SSR is an important central concept, but the website should teach the surrounding concepts needed to understand it properly.



3\. Learning Map

The homepage should be dominated by an interactive knowledge map.

Do NOT use simple rectangular cards connected by lines.

Use a visual system based on:

glowing nodes

curved connections

subtle depth

animated paths

particles

ambient movement

hover effects

parallax

progressive activation

The map represents relationships between concepts.

For example:

HTTP

&#x20; ↓

Browser Rendering

&#x20; ↓

Rendering Strategies

&#x20;├── CSR

&#x20;├── SSR

&#x20;├── SSG

&#x20;└── ISR

&#x20;      ↓

React Rendering

&#x20;      ↓

Hydration

&#x20;      ↓

Server Components

&#x20;      ↓

Streaming



The actual layout can be more organic and visually interesting.

Users must be able to click ANY concept.

Do not force a linear course.

Prerequisites should be visually represented, but exploration should remain free.



4\. Progress Should Change the World

Learning progress should not just appear as:

37% complete

Instead, the knowledge map should gradually become more alive.

For example:

Not started:

○ SSR



After learning:

✦ SSR



Connections can illuminate.

Subtle pulses can travel through completed paths.

The overall map should feel like knowledge is being activated.



5\. Node States

Support:

Not Started

Learning

Got It

Revisit

Mastered

Do not rely only on status badges.

The visual appearance of the node itself should communicate its state.



6\. Hover Interaction

When hovering a node:

emphasize the node

highlight related nodes

highlight prerequisite/dependent connections

slightly dim unrelated concepts

show a compact tooltip

animate relevant connections

Example:

SSR



Server renders HTML before

sending it to the browser.



Prerequisites:

HTTP · Browser Rendering



Keep tooltips compact.



7\. Visual Style

Preferred direction:

Dark cinematic + futuristic technical + developer laboratory

Use:

dark background

subtle grid

restrained accent colors

luminous nodes

subtle particles

strong typography

depth

elegant shadows

minimal borders

Avoid:

excessive neon

rainbow colors

excessive gradients

excessive glassmorphism

giant rounded cards

visual clutter

The website should look sophisticated.



8\. 3D / Depth

Do NOT turn the entire site into a heavy 3D/WebGL application.

Prefer a 2.5D effect:

perspective

depth

parallax

layered elements

shadows

subtle movement

Use SVG/CSS/Framer Motion where possible.

Only use Three.js/WebGL when it provides a meaningful benefit.

Performance matters.



9\. Animation Philosophy

Animations are an important part of the experience.

Useful animations include:

node activation

connection pulses

particles

hover transitions

SVG path animations

subtle parallax

spring transitions

rendering/data packets moving through the graph

But avoid unnecessary continuous animation.

Prefer GPU-friendly properties such as:

transform

opacity

Avoid animations that constantly trigger layout/reflow.

Support:

prefers-reduced-motion

The project itself should demonstrate good frontend performance practices.



10\. Experiments

A major feature of the website will be interactive experiments.

The user should be able to observe concepts rather than simply read about them.

For example:

SSR Experiment

REQUEST

&#x20;  ↓

SERVER

&#x20;  ↓

HTML

&#x20;  ↓

BROWSER

&#x20;  ↓

HYDRATION

&#x20;  ↓

INTERACTIVE UI



Animate each stage.

CSR Experiment

REQUEST

&#x20;  ↓

HTML SHELL

&#x20;  ↓

JAVASCRIPT

&#x20;  ↓

REACT

&#x20;  ↓

UI



Hydration Experiment

Allow the user to toggle:

Server HTML    ON

JavaScript     OFF

Hydration      OFF



Then progressively enable them and visualize what changes.

Eventually create experiments for:

SSR vs CSR

SSG vs SSR

ISR

Hydration

Streaming

Server vs Client Components

Caching



11\. Learning Content

Each concept should eventually contain:

Simple explanation

Explain it clearly in plain English.

Deep dive

Explain:

how it works

why it exists

trade-offs

implementation details

when to use it

when not to use it

Real-world usage

Explain where developers actually encounter it.

Example

Show a practical example.

Common misconceptions

Explain mistakes developers commonly make.

Experiment

Give the user something interactive to observe.

Interview questions

Approximately 10 questions per concept.

Categories:

Fundamentals

Tricky

Scenario

Senior

Debugging

Questions should include:

answer

reasoning

example

follow-up question

Avoid generic textbook questions.



12\. Important Conceptual Distinctions

Teach these carefully.

Do NOT treat the following as synonyms:

SSR

Server Components

Hydration

Streaming

Explain their relationship and differences.

For example:

SSR concerns generating HTML on the server.

Server Components concern where React components execute and how component output/data is handled.

Hydration concerns making server-rendered UI interactive in the browser.

Streaming concerns progressively delivering rendered output.



13\. Progress / Replayability

Eventually include:

progress map

revisit queue

weak areas

random challenge

predict-the-rendering challenge

mock interview mode

Optional:

XP

achievements

streaks

Do not over-gamify the application.

The knowledge map itself should provide most of the progression.



14\. Technology

Use:

Next.js

TypeScript

Tailwind CSS

Framer Motion where useful

SVG where practical

local TypeScript data initially

localStorage for progress

Avoid unnecessary dependencies.

Do not introduce:

authentication

database

CMS

admin panel

backend

unless there is a compelling reason later.



15\. Architecture

Keep presentation and learning data separate.

A reasonable structure is:

app/

&#x20; page.tsx

&#x20; learn/

&#x20;   \[slug]/

&#x20;     page.tsx



components/

&#x20; learning-map/

&#x20; lesson/

&#x20; experiments/

&#x20; ui/



data/

&#x20; concepts.ts

&#x20; prerequisites.ts

&#x20; lessons/

&#x20; questions/



lib/

&#x20; progress.ts

&#x20; storage.ts



learning-notes/



Adapt this if a better architecture makes sense.

Do not over-engineer.



16\. Parallel Learning System

This is VERY important.

I want to learn while Claude builds.

Whenever a meaningful technical concept is introduced, create an Obsidian-compatible Markdown note inside:

learning-notes/



These are learning notes, NOT merely project documentation.

For example:

learning-notes/

├── 00-build-log.md

├── 01-nextjs-routing.md

├── 02-react-component-tree.md

├── 03-server-client-boundary.md

├── 04-nextjs-rendering.md

├── 05-hydration.md

├── 06-svg-rendering.md

└── ...



Do not create every note upfront.

Create them when the corresponding implementation happens.



17\. Learning Note Format

Each meaningful concept note should explain:

What is this?

Simple explanation.

Why are we using it?

Explain its role in this project.

What did we implement?

Mention the relevant files/components.

How does it work?

Explain the actual underlying technology.

What happens at runtime?

Use diagrams when useful.

Example:

Browser

&#x20; ↓

Request

&#x20; ↓

Next.js Router

&#x20; ↓

Server Component

&#x20; ↓

Rendered output

&#x20; ↓

Browser



Parent → Child relationship

When relevant, explain:

who renders whom

how props flow

where state lives

what causes rerenders

what does not rerender

server/client boundaries

Rendering behavior

When relevant, explicitly explain:

what runs on the server

what runs in the browser

what gets rendered

when rendering happens

what gets sent over the network

whether JavaScript is required

whether hydration happens

Why did we choose this approach?

Explain the engineering reasoning and trade-offs.

Alternatives

Explain relevant alternatives briefly.

Interview questions

Add 3–5 questions related to the concept.

At least one should be senior/scenario based.

Related concepts

Use Obsidian links:

\[\[Hydration]]

\[\[React Render Cycle]]

\[\[Next.js Rendering]]





18\. Build Log

Maintain:

learning-notes/00-build-log.md



Record:

what was implemented

important files

concepts introduced

architectural decisions

After significant work, add:

🧠 Learning checkpoint



After this step, I should understand:



1\. ...

2\. ...

3\. ...





19\. Don't Document Trivial Things

Do not create learning notes for:

basic JSX

simple Tailwind classes

variable renaming

trivial utility functions

obvious styling

Only document concepts that have genuine learning value.



20\. Important Engineering Rule

Whenever you introduce a library or framework feature, explain:

what problem it solves

what it does

why we need it

what we could do without it

performance implications

relevant interview concepts

I should never look at a library in the codebase and think:

"Claude just added this. I have no idea why."



21\. Development Strategy

Do NOT build the entire application immediately.

Start with Phase 1 only.

Phase 1

Build the landing page and interactive learning map.

Use approximately 12 concepts:

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



Implement:

visual identity

hero

interactive map

nodes

connections

hover behavior

progress states

activation animations

basic responsive behavior

Use local mock data.

Do NOT build all lesson pages yet.

Do NOT create dozens of files unnecessarily.

First make the core experience beautiful.



22\. First Development Response

Before writing code:

Inspect the existing repository.

Briefly explain the visual architecture you plan to use.

Explain the major technical concepts Phase 1 will introduce.

Explain what you will deliberately NOT build yet.

Then implement Phase 1.

Do not ask me unnecessary questions.

Make sensible engineering decisions yourself.



23\. Most Important Principle

The project has two outputs:

The software

A beautiful, technically impressive interactive learning platform.

My understanding

I should gradually understand:

code → component tree → rendering → browser behavior → architecture → performance → interview knowledge

The goal is NOT:

"Claude built a cool website."

The goal is:

"Claude helped me build a cool website, and now I understand how it works."

Build accordingly.




<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
