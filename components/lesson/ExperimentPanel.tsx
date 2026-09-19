import type { ExperimentKind, Lesson } from "@/lib/types";
import { Prose } from "@/components/lesson/Prose";
import { StageTimelineExperiment } from "@/components/experiments/StageTimelineExperiment";
import { HydrationToggleExperiment } from "@/components/experiments/HydrationToggleExperiment";
import { StreamingChunksExperiment } from "@/components/experiments/StreamingChunksExperiment";
import { CacheLayersExperiment } from "@/components/experiments/CacheLayersExperiment";

interface ExperimentCopy {
  title: string;
  /** One or two sentences: what is on screen, and what it is meant to show. */
  goal: string;
  /** Concrete things to do, in order, and what to notice. */
  tryThis: string[];
}

/**
 * The words around each experiment. Kept here (not inside each experiment
 * component) so every experiment gets the same "what am I looking at /
 * what should I try" header, and the copy sits in one place. Runs through
 * `Prose`, so glossary terms in it get hover meanings too.
 */
const COPY: Record<ExperimentKind, ExperimentCopy> = {
  "ssr-timeline": {
    title: "SSR: what does the visitor see, and when?",
    goal: "One page load, step by step. The window on the right shows what the visitor sees at each moment, and whether they could click anything yet.",
    tryThis: [
      "Press Play and watch the two lights under the window.",
      "Notice the gap: the content appears at step 4, but the page only becomes clickable at step 6. That gap is hydration.",
      "Then try the same experiment in the CSR lesson and compare when the first content appears.",
    ],
  },
  "csr-timeline": {
    title: "CSR: what does the visitor see, and when?",
    goal: "One page load, step by step. The window on the right shows what the visitor sees at each moment, and whether they could click anything yet.",
    tryThis: [
      "Press Play and watch steps 1 to 4: the window stays blank the whole time.",
      "Content only appears at step 5, after the JavaScript has downloaded and run.",
      "Notice that content and clickability arrive together. There is no in-between gap like in SSR.",
    ],
  },
  "hydration-toggle": {
    title: "Hydration: switch the ingredients on and off",
    goal: "A page is made of up to three ingredients. Flip them and the window shows what a visitor would get, including whether the button actually responds.",
    tryThis: [
      "Leave everything on, then turn Hydration off and click the button. It ignores you.",
      "Turn JavaScript off: the content stays, but nothing ever becomes clickable.",
      "Turn Server HTML off: the page starts blank and JavaScript builds it (that is CSR).",
    ],
  },
  "streaming-chunks": {
    title: "Streaming: the same page, loaded two ways",
    goal: "A page with four parts, one of them slow (a 2.2 second database query). Load it without streaming, then with streaming, and compare.",
    tryThis: [
      "Press Load WITHOUT streaming: the screen stays blank until the slowest part is ready.",
      "Press Load WITH streaming: the fast parts show up almost immediately.",
      "Compare the clock at the end. The total time is identical. What changes is when the visitor first sees something.",
    ],
  },
  "cache-layers": {
    title: "Caching: who answers the request?",
    goal: "A request asks each layer in turn, nearest to the visitor first, and the first one holding a saved copy answers it. You choose which layers have a copy.",
    tryThis: [
      "Set every layer to Empty and send: every layer misses, so the slow database does the work.",
      "Set only the CDN to Has copy: the request stops there and your server never hears about it.",
      "Set the browser cache to Has copy: it answers instantly, with no network trip at all.",
    ],
  },
};

function Experiment({ lesson }: { lesson: Lesson }) {
  switch (lesson.experiment) {
    case "ssr-timeline":
    case "csr-timeline":
      return <StageTimelineExperiment steps={lesson.runtime} />;
    case "hydration-toggle":
      return <HydrationToggleExperiment />;
    case "streaming-chunks":
      return <StreamingChunksExperiment />;
    case "cache-layers":
      return <CacheLayersExperiment />;
    default:
      return null;
  }
}

/**
 * Data (`lesson.experiment`, a string tag) in, framed experiment out. This
 * file needs no "use client": choosing copy and a component from a tag is
 * pure computation, and the framing text is static. Only the experiments
 * themselves, which hold interactive state, are Client Components.
 */
export function ExperimentPanel({ lesson }: { lesson: Lesson }) {
  if (!lesson.experiment) return null;
  const copy = COPY[lesson.experiment];

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{copy.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <Prose text={copy.goal} />
      </p>

      <div className="mt-3 rounded-lg bg-[var(--color-bg-elevated)]/60 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-learning)]">Try this</p>
        <ol className="mt-1.5 flex list-decimal flex-col gap-1 pl-5 text-xs leading-relaxed text-[var(--color-text-primary)]">
          {copy.tryThis.map((step, i) => (
            <li key={i}>
              <Prose text={step} />
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4">
        <Experiment lesson={lesson} />
      </div>
    </div>
  );
}
