import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonSection } from "@/components/lesson/LessonSection";
import { RuntimeSequence } from "@/components/lesson/RuntimeSequence";
import { ServerBrowserSplit } from "@/components/lesson/ServerBrowserSplit";
import { ReactNextCallout } from "@/components/lesson/ReactNextCallout";
import { TradeoffsGrid } from "@/components/lesson/TradeoffsGrid";
import { MisconceptionsList } from "@/components/lesson/MisconceptionsList";
import { ExperimentPanel } from "@/components/lesson/ExperimentPanel";
import { InterviewQuestions } from "@/components/lesson/InterviewQuestions";
import { RelatedConcepts } from "@/components/lesson/RelatedConcepts";
import { Prose } from "@/components/lesson/Prose";
import { SiteUsageCallout } from "@/components/lesson/SiteUsageCallout";
import { ReferencesList } from "@/components/lesson/ReferencesList";
import { LessonNav, type NavSection } from "@/components/lesson/LessonNav";
import { concepts, conceptMap } from "@/data/concepts";
import { getLesson } from "@/data/lessons";
import { getQuestions } from "@/data/questions";
import { siteUsage } from "@/data/site-usage";
import { references } from "@/data/references";
import { nextUp } from "@/data/next-up";
import { ChainIntro, ChainOutro } from "@/components/lesson/ChainLines";
import { StoryBookendBottom, StoryBookendTop } from "@/components/story/StoryBookend";
import { NextUpList } from "@/components/lesson/NextUpList";
import { examples as allExamples } from "@/data/examples";
import { ExampleBox } from "@/components/lesson/ExampleBox";
import { BrowserCheckBox } from "@/components/lesson/BrowserCheckBox";
import { browserChecks } from "@/data/browser-checks";
import { getNeighbors } from "@/lib/graph";
import type { ConceptId } from "@/lib/types";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Every concept id is known ahead of time (a fixed list in
 * data/concepts.ts), so every `/learn/*` page can be, and is, rendered
 * once at build time instead of per request. This is a live example of
 * Static Site Generation, one of the very concepts this project teaches:
 * `next build` actually produces one static HTML file per concept here, not one
 * server functions that run on every visit. Verify it yourself with
 * `npm run build` and look for "○ (Static)" next to each /learn/* route.
 */
export function generateStaticParams() {
  return concepts.map((concept) => ({ slug: concept.id }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = conceptMap[slug];
  if (!concept) return {};
  return {
    title: `${concept.title} | Behind the Render`,
    description: concept.blurb,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const concept = conceptMap[slug];
  if (!concept) notFound();

  const lesson = getLesson(concept.id);
  const questions = getQuestions(concept.id);
  const examples = allExamples[concept.id];
  // "Try it in your browser" activities, grouped by the section they sit under.
  const checksFor = (section: string) =>
    (browserChecks[concept.id] ?? []).filter((c) => c.section === section);
  const relatedIds = Array.from(getNeighbors(concept.id)) as ConceptId[];

  // Only sections that actually render on this page (the experiment and the
  // quiz are conditional), in page order. Short labels for the map.
  const navSections: NavSection[] = [
    { id: "what-is-this", label: "What is this?" },
    { id: "why-it-exists", label: "Why it exists" },
    { id: "how-it-works", label: "How it works" },
    { id: "runtime", label: "Runtime" },
    { id: "server-vs-browser", label: "Server vs. browser" },
    { id: "react-next", label: "React / Next.js" },
    { id: "why-use-it", label: "Why use it, and the cost" },
    { id: "misconceptions", label: "Misconceptions" },
    ...(lesson.experiment ? [{ id: "experiment", label: "Experiment" }] : []),
    { id: "in-this-site", label: "In this very site" },
    ...(questions.length > 0 ? [{ id: "test-yourself", label: "Test yourself" }] : []),
    { id: "go-deeper", label: "Go deeper" },
    { id: "related", label: "Related concepts" },
  ];

  return (
    <div className="relative flex flex-1 flex-col">
      <LessonNav title={concept.title} sections={navSections} />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-12 sm:px-8">
        <LessonHeader concept={concept} />

        <ChainIntro id={concept.id} />

        <Suspense fallback={null}>
          <StoryBookendTop />
        </Suspense>

        <LessonSection id="what-is-this" heading="1. What is this?">
          <p>
            <Prose text={lesson.whatIsThis} />
          </p>
          {examples.whatIsThis && <ExampleBox example={examples.whatIsThis} />}
          {checksFor("what-is-this").map((c) => <BrowserCheckBox key={c.title} check={c} />)}
        </LessonSection>

        <LessonSection id="why-it-exists" heading="2. Why does it exist?">
          <p>
            <Prose text={lesson.whyItExists} />
          </p>
          {examples.whyItExists && <ExampleBox example={examples.whyItExists} />}
          {checksFor("why-it-exists").map((c) => <BrowserCheckBox key={c.title} check={c} />)}
        </LessonSection>

        <LessonSection id="how-it-works" heading="3. How does it work?">
          <p>
            <Prose text={lesson.howItWorks} />
          </p>
          {examples.howItWorks && <ExampleBox example={examples.howItWorks} />}
          {checksFor("how-it-works").map((c) => <BrowserCheckBox key={c.title} check={c} />)}
        </LessonSection>

        <LessonSection id="runtime" heading="4. What happens at runtime?">
          <RuntimeSequence steps={lesson.runtime} />
        </LessonSection>

        <LessonSection id="server-vs-browser" heading="5. Server vs. browser">
          <ServerBrowserSplit data={lesson.serverVsBrowser} />
        </LessonSection>

        <LessonSection id="react-next" heading="6. React / Next.js connection">
          <ReactNextCallout text={lesson.reactNextConnection} />
          {examples.reactNext && <ExampleBox example={examples.reactNext} />}
          {checksFor("react-next").map((c) => <BrowserCheckBox key={c.title} check={c} />)}
        </LessonSection>

        {/* Benefits and costs are one decision, so they are one section. The inner
            #tradeoffs anchor keeps the map panel's topic links (`#tradeoffs`) working. */}
        <LessonSection id="why-use-it" heading="7. Why use it, and what it costs">
          <ul className="flex flex-col gap-2">
            {lesson.whyUseIt.map((reason, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-[var(--color-text-primary)]">
                <span className="text-[var(--state-got-it)]">✦</span>
                <span>
                  <Prose text={reason} />
                </span>
              </li>
            ))}
          </ul>
          <div id="tradeoffs" className="mt-6 scroll-mt-16">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--state-revisit)]">What it costs</h3>
            <div className="mt-3">
              <TradeoffsGrid tradeoffs={lesson.tradeoffs} />
            </div>
          </div>
        </LessonSection>

        <LessonSection id="misconceptions" heading="8. Common misconceptions">
          <MisconceptionsList items={lesson.misconceptions} />
        </LessonSection>

        {lesson.experiment && (
          <LessonSection id="experiment" heading="Experiment">
            <ExperimentPanel lesson={lesson} />
          </LessonSection>
        )}

        <LessonSection id="in-this-site" heading="In this very site">
          <SiteUsageCallout usage={siteUsage[concept.id]} />
        </LessonSection>

        {questions.length > 0 && (
          <LessonSection id="test-yourself" heading="Test yourself">
            <InterviewQuestions questions={questions} />
          </LessonSection>
        )}

        <LessonSection id="go-deeper" heading="Go deeper">
          <NextUpList items={nextUp[concept.id]} />
          <ReferencesList items={references[concept.id]} />
        </LessonSection>

        <LessonSection id="related" heading="Related concepts">
          <ChainOutro id={concept.id} />
          <RelatedConcepts currentId={concept.id} ids={relatedIds} />
        </LessonSection>

        <div className="mt-10">
          <Link href="/questions" className="btn-ghost">
            Practice with the question bank
          </Link>
        </div>

        <Suspense fallback={null}>
          <StoryBookendBottom />
        </Suspense>
      </main>
    </div>
  );
}
