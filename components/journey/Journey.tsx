"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { ChapterVisual } from "@/components/journey/ChapterVisual";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { hueStyle } from "@/data/road-hues";
import type { JourneyApp, Quiz } from "@/data/journey";

/**
 * The journey page. On wide screens it is split in two: the narration, quiz or
 * source card on the left in large type, and the chapter's diagram on the right.
 * On phones the same pieces stack in one column. Across the top, a slim "road"
 * shows the chapters as nodes with a glowing arrow that travels between them.
 *
 * What moves, and how, so it stays smooth:
 *
 * - The arrow's position and the lit trail behind it are Framer Motion *motion
 *   values*: numbers that update every frame and write straight to the DOM with
 *   no React render. They only drive `transform` (a translate and a scale), so
 *   the browser can move them on the GPU without any layout work.
 * - React state only changes when the reader moves to another beat.
 * - There is no scroll-jacking and no click-anywhere-to-advance: the page scrolls
 *   normally, text can be selected, and Continue, space and the arrow keys move on.
 */

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
/** How long the new chapter's text waits for the arrow to get there. */
const ARRIVAL_DELAY = 0.7;
/** The road runs from 6% to 94% of the strip, so the end labels have room. */
const EDGE = 0.06;
const SPAN = 0.88;

interface Beat {
  chapterIndex: number;
  lineIndex: number;
  /** A guess-first question, a subtitle line, the chapter's "from the docs" card, or the road's closing question. */
  kind: "predict" | "line" | "docs" | "check";
  text: string;
  /** The first beat of its chapter. */
  isFirst: boolean;
}

export function Journey({
  app,
  toyTrick,
  trickTitles,
}: {
  app: JourneyApp;
  toyTrick?: string;
  trickTitles?: Record<string, string>;
}) {
  const chapters = app.chapters;
  const reduceMotion = usePrefersReducedMotion();

  // "Skim" drops the narration and the guesses and keeps only each chapter's source card (and the closing question).
  const [skim, setSkim] = useState(false);

  // Every beat in the journey, flattened, so "next" is just beat + 1.
  const beats = useMemo<Beat[]>(() => {
    const out = chapters.flatMap((c, chapterIndex) => {
      const own: Beat[] = [];
      if (!skim && c.predict) own.push({ chapterIndex, lineIndex: 0, kind: "predict", text: "", isFirst: false });
      if (!skim) c.lines.forEach((text, lineIndex) => own.push({ chapterIndex, lineIndex, kind: "line", text, isFirst: false }));
      own.push({ chapterIndex, lineIndex: c.lines.length, kind: "docs", text: "", isFirst: false });
      own[0] = { ...own[0], isFirst: true };
      return own;
    });
    if (app.check) out.push({ chapterIndex: chapters.length - 1, lineIndex: 0, kind: "check", text: "", isFirst: false });
    return out;
  }, [chapters, skim, app.check]);
  const firstBeatOf = useMemo(() => chapters.map((_, ci) => beats.findIndex((b) => b.chapterIndex === ci)), [chapters, beats]);

  // The only React state: which beat we're on, and how long to hold the next text back while the arrow travels.
  // `beat === beats.length` is the end card.
  const [nav, setNav] = useState({ beat: 0, delay: 0 });
  // What the reader picked in each guess-first or closing question, so going back shows it again.
  const [picks, setPicks] = useState<Record<string, number>>({});
  const ended = nav.beat >= beats.length;
  const line = beats[Math.min(nav.beat, beats.length - 1)];
  const chapterIndex = line.chapterIndex;
  const chapter = chapters[chapterIndex];
  const quiz: Quiz | undefined = line.kind === "predict" ? chapter.predict : line.kind === "check" ? app.check : undefined;
  const quizKey = line.kind === "check" ? "check" : `predict-${chapter.id}`;
  const toggleSkim = () => {
    setSkim((v) => !v);
    setNav({ beat: 0, delay: 0 });
  };
  // The diagram beside the narration: which one, and how far along its chapter we are.
  const visual = chapter.visual;
  const showDiagram = !ended && Boolean(visual) && line.kind !== "check";
  const visualStep = line.kind === "predict" ? 0 : line.kind === "line" ? line.lineIndex : 99;
  const showTitle = !ended && line.kind !== "check";

  const goTo = useCallback(
    (resolve: (current: number) => number) => {
      setNav((prev) => {
        const next = Math.max(0, Math.min(beats.length, resolve(prev.beat)));
        if (next === prev.beat) return prev;
        const chapterOf = (b: number) => beats[Math.min(b, beats.length - 1)].chapterIndex;
        const moved = chapterOf(next) !== chapterOf(prev.beat);
        return { beat: next, delay: moved && !reduceMotion ? ARRIVAL_DELAY : 0 };
      });
    },
    [beats, reduceMotion],
  );
  const step = useCallback((delta: number) => goTo((b) => b + delta), [goTo]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lastChapter = useRef(chapterIndex);
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    // New chapter: back to the top, to see its title. Same chapter: on a phone the diagram is pinned
    // at the top of the scroll area, so only pull the text back to just under it, never above it.
    const chapterChanged = lastChapter.current !== chapterIndex;
    lastChapter.current = chapterIndex;
    const isPhone = !window.matchMedia("(min-width: 1024px)").matches;
    if (chapterChanged || !isPhone) {
      box.scrollTo({ top: 0 });
      return;
    }
    const title = titleRef.current;
    const pinAt = title ? title.getBoundingClientRect().bottom - box.getBoundingClientRect().top + box.scrollTop : 0;
    if (box.scrollTop > pinAt) box.scrollTo({ top: pinAt });
  }, [nav.beat, chapterIndex]);

  // Where the arrow is along the road, in chapters (0 is the first node). Moves without re-rendering React.
  const progress = useMotionValue(0);
  useEffect(() => {
    if (reduceMotion) {
      progress.set(chapterIndex);
      return;
    }
    const controls = animate(progress, chapterIndex, { duration: 0.9, ease: [0.45, 0, 0.15, 1] });
    return () => controls.stop();
  }, [chapterIndex, reduceMotion, progress]);

  // Keyboard: space, enter and the arrow keys. Focused buttons and links keep their own keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest("a, button, summary, input, textarea")) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const textEnter = { opacity: 0, y: reduceMotion ? 0 : 10 };
  const split = showDiagram && Boolean(visual);

  return (
    <main aria-label={`The journey: ${app.name}`} className="relative flex h-svh flex-col" style={hueStyle(app.hue)}>
      <h1 className="sr-only">Web Lore: the journey, {app.name}</h1>

      {/* Top bar: back to the roads, the road itself, and skim. */}
      <header className="flex items-center gap-3 px-5 pb-1 pt-4 lg:gap-6 lg:px-10">
        <Link href="/journey" className="btn-ghost shrink-0 !px-3.5 !py-1.5">
          <span aria-hidden>←</span> Roads
        </Link>
        <RoadStrip chapters={chapters} current={chapterIndex} progress={progress} onGo={(i) => goTo(() => firstBeatOf[i])} />
        <button
          type="button"
          aria-pressed={skim}
          onClick={toggleSkim}
          title="Skip the narration and show only the quotes from the sources"
          className="shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors"
          style={{ borderColor: skim ? "var(--state-learning)" : "var(--color-border)", color: skim ? "var(--state-learning)" : "var(--color-text-muted)" }}
        >
          Skim
        </button>
      </header>

      {/* The middle scrolls on its own; the top bar and the controls below stay put. */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      {/* The page itself: one column, or two when a diagram is showing. */}
      <div
        className={`mx-auto grid w-full content-start gap-x-14 gap-y-4 px-5 pb-12 pt-4 lg:gap-y-8 lg:px-10 lg:pt-10 ${
          split ? "max-w-[1500px] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : "max-w-3xl"
        }`}
      >
        {/* The chapter's name */}
        <div ref={titleRef} className="lg:col-start-1 lg:row-start-1">
          <AnimatePresence mode="wait">
            {showTitle && (
              <motion.div
                key={chapter.id}
                initial={textEnter}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: nav.delay } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--state-learning)]">
                  {app.name} · Chapter {ROMAN[chapterIndex]}
                </p>
                <h2
                  className="mt-2 font-serif text-3xl uppercase tracking-[0.1em] text-[var(--color-text-primary)] sm:mt-3 sm:text-4xl lg:text-5xl"
                  style={{ textShadow: "0 0 28px color-mix(in srgb, var(--state-learning) 55%, transparent)" }}
                >
                  {chapter.title}
                </h2>
                {chapter.trick && trickTitles?.[chapter.trick] && (
                  <p className="mt-2 hidden font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-got-it)] sm:mt-3 sm:block">The trick: {trickTitles[chapter.trick]}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The diagram: on phones it is pinned at the top of the scroll area while the text scrolls under it, so the drawing and Continue are always both in view; on wide screens it takes the right column. */}
        {split && visual && (
          <motion.div
            key={chapter.id}
            className="sticky top-0 z-10 mx-auto w-full max-w-md lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-start"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: nav.delay + 0.1 } }}
          >
            <ChapterVisual kind={visual} step={visualStep} />
          </motion.div>
        )}

        {/* Narration, quiz or sources, and the controls */}
        <div className="flex flex-col gap-8 pb-6 lg:col-start-1 lg:row-start-2">
          <div aria-live="polite" aria-atomic="true" className="min-h-[12rem] w-full">
            <AnimatePresence mode="wait">
              {ended ? (
                <motion.div
                  key="end"
                  className="flex flex-col gap-6"
                  initial={textEnter}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <p className="font-serif text-4xl text-[var(--color-text-primary)] lg:text-5xl" style={{ textShadow: "0 0 24px color-mix(in srgb, var(--state-learning) 55%, transparent)" }}>
                    You know the road.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {toyTrick && (
                      <Link href={`/trick/${toyTrick}`} className="btn-ghost btn-ghost-lg">
                        Poke the toy
                      </Link>
                    )}
                    <button type="button" className="btn-ghost btn-ghost-lg" onClick={() => goTo(() => 0)}>
                      Walk it again
                    </button>
                    <Link href="/journey" className="btn-ghost btn-ghost-lg">
                      Follow another click
                    </Link>
                    <Link href="/trick" className="btn-ghost btn-ghost-lg">
                      Browse the tricks
                    </Link>
                    <Link href="/questions" className="btn-ghost btn-ghost-lg">
                      Take the challenge
                    </Link>
                  </div>
                </motion.div>
              ) : quiz ? (
                <motion.div
                  key={nav.beat}
                  className="flex w-full flex-col gap-4"
                  initial={textEnter}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: nav.delay } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <QuizBody
                    label={line.kind === "predict" ? "Guess first" : "Check yourself"}
                    quiz={quiz}
                    picked={picks[quizKey]}
                    onPick={(i) => setPicks((p) => ({ ...p, [quizKey]: i }))}
                  />
                </motion.div>
              ) : line.kind === "docs" ? (
                <motion.div
                  key={nav.beat}
                  className="flex w-full flex-col gap-4"
                  initial={textEnter}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-learning)]">From the docs</p>
                  <ul className="flex flex-col gap-4">
                    {chapter.docs.map((d) => (
                      <li key={d.text} className="border-l-2 border-[var(--state-learning)] pl-4">
                        <blockquote className="font-serif text-lg italic leading-snug text-[var(--color-text-primary)] lg:text-xl">&ldquo;{d.text}&rdquo;</blockquote>
                        <a
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-block font-mono text-[11px] uppercase tracking-widest text-[var(--state-got-it)] underline underline-offset-4"
                        >
                          {d.source} <span aria-hidden>↗</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  {chapter.note && <p className="text-xs leading-snug text-[var(--color-text-muted)]">{chapter.note}</p>}
                  {chapter.alternatives && chapter.alternatives.length > 0 && (
                    <>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-revisit)]">Also worth knowing</p>
                      <ul className="flex flex-col gap-2 text-sm leading-snug text-[var(--color-text-muted)] lg:text-base">
                        {chapter.alternatives.map((a) => (
                          <li key={a.name}>
                            <a
                              href={a.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[var(--color-text-primary)] underline underline-offset-4 hover:text-[var(--state-revisit)]"
                            >
                              {a.name} <span aria-hidden>↗</span>
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>{" "}
                            {a.why}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key={nav.beat}
                  className="text-pretty font-serif text-2xl leading-snug text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl"
                  initial={textEnter}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: nav.delay } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  {line.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      </div>

      {/* The controls: docked at the bottom so they never move, however long the text is. */}
      {!ended && (
        <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-5 py-3 lg:px-10 lg:py-4">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} disabled={nav.beat === 0} aria-label="Back" className="btn-step-back">
                <span aria-hidden>←</span>
              </button>
              <button type="button" onClick={() => step(1)} className="btn-primary">
                {nav.beat === beats.length - 1 ? "Finish" : "Continue"} <span aria-hidden className="btn-primary-arrow">→</span>
              </button>
              <span className="ml-1 font-mono text-xs tracking-widest text-[var(--color-text-muted)]" aria-hidden>
                {nav.beat + 1} / {beats.length}
              </span>
            </div>
            <div className="flex items-center gap-6">
              {line.kind === "docs" && (chapter.trick || chapter.concept) && (
                <Link href={chapter.trick ? `/trick/${chapter.trick}` : `/learn/${chapter.concept ?? ""}`} className="btn-side">
                  <span className="hidden text-[var(--color-text-muted)] sm:block">Want the short version of this idea?</span>
                  <span className="text-[var(--state-got-it)]">{chapter.trick ? "Read the trick" : "Read the full lesson"} →</span>
                </Link>
              )}
              <p className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] lg:flex">
                <kbd className="kbd">Space</kbd> or <kbd className="kbd">→</kbd>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* The whole narration as plain text, for screen readers and anything that can't see the animation. */}
      <section className="sr-only" aria-label="Full transcript">
        {chapters.map((c) => (
          <div key={c.id}>
            <h2>{c.title}</h2>
            {c.predict && (
              <p>
                Guess first: {c.predict.question} Answer: {c.predict.options[c.predict.answer]}. {c.predict.reveal}
              </p>
            )}
            {c.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            {c.docs.map((d) => (
              <p key={d.text}>
                From the docs: &ldquo;{d.text}&rdquo; ({d.source})
              </p>
            ))}
          </div>
        ))}
        {app.check && (
          <p>
            Check yourself: {app.check.question} Answer: {app.check.options[app.check.answer]}. {app.check.reveal}
          </p>
        )}
      </section>
    </main>
  );
}

/**
 * The road across the top: one node per chapter (each a button that jumps there),
 * a dotted line between them, a lit trail up to the arrow, and the glowing arrow.
 *
 * The arrow is moved with `transform: translateX` and the trail is grown with
 * `transform: scaleX` (from its left edge), both driven by the same motion value,
 * so travelling between chapters never touches layout. Their pixel width comes
 * from a ResizeObserver, so the road stays correct when the window changes.
 */
function RoadStrip({
  chapters,
  current,
  progress,
  onGo,
}: {
  chapters: { id: string; title: string }[];
  current: number;
  progress: MotionValue<number>;
  onGo: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => width.set(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  const last = Math.max(1, chapters.length - 1);
  const trail = useTransform(() => progress.get() / last);
  const arrowX = useTransform(() => width.get() * (EDGE + SPAN * (progress.get() / last)));
  const shown = useTransform(() => (width.get() > 0 ? 1 : 0));

  return (
    <div ref={ref} className="relative h-16 min-w-0 flex-1">
      <div className="absolute top-[18px] border-t border-dotted border-[var(--color-text-muted)]/60" style={{ left: `${EDGE * 100}%`, right: `${EDGE * 100}%` }} />
      <motion.div
        aria-hidden
        className="absolute top-[16px] h-1 origin-left rounded-full bg-[var(--state-learning)]"
        style={{ left: `${EDGE * 100}%`, width: `${SPAN * 100}%`, scaleX: trail, boxShadow: "0 0 10px color-mix(in srgb, var(--state-learning) 75%, transparent)" }}
      />

      {chapters.map((c, i) => {
        const state = i < current ? "done" : i === current ? "now" : "todo";
        const color = state === "now" ? "var(--state-learning)" : state === "done" ? "var(--state-got-it)" : "var(--state-not-started)";
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onGo(i)}
            aria-label={`Go to chapter ${ROMAN[i]}: ${c.title}`}
            aria-current={i === current ? "step" : undefined}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center pt-3"
            style={{ left: `${(EDGE + SPAN * (i / last)) * 100}%` }}
          >
            <span
              className="block h-3 w-3 rounded-full border-2 transition-colors duration-500"
              style={{ borderColor: color, background: state === "todo" ? "var(--color-bg)" : color }}
            />
            <span
              className="mt-2 hidden max-w-[9rem] truncate font-mono text-[11px] uppercase tracking-widest transition-colors duration-500 sm:block"
              style={{ color }}
            >
              {c.title}
            </span>
          </button>
        );
      })}

      <motion.div aria-hidden className="pointer-events-none absolute left-0 top-[18px] h-8 w-8" style={{ x: arrowX, marginLeft: -16, marginTop: -16, opacity: shown }}>
        <div className="halo-breathe absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--state-learning) 60%, transparent), transparent 68%)" }} />
        <svg viewBox="-20 -20 40 40" className="absolute inset-0">
          <path d="M-13 -11 L15 0 L-13 11 L-6 0 Z" fill="var(--state-learning)" style={{ filter: "drop-shadow(0 0 6px var(--state-learning))" }} />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * A multiple-choice question for the journey. Pick an option and it locks, marks
 * the right one, and shows why. Real <button>s, so it works with keyboard and
 * screen readers; the page-wide space and arrow keys step over buttons on purpose.
 */
function QuizBody({ label, quiz, picked, onPick }: { label: string; quiz: Quiz; picked: number | undefined; onPick: (i: number) => void }) {
  const answered = picked !== undefined;
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-revisit)]">{label}</p>
      <p className="text-pretty font-serif text-2xl leading-snug text-[var(--color-text-primary)] lg:text-3xl">{quiz.question}</p>
      <div className="flex flex-col items-start gap-2.5" role="group" aria-label="Choices">
        {quiz.options.map((option, i) => {
          const isAnswer = i === quiz.answer;
          const color = !answered ? "var(--color-border)" : isAnswer ? "var(--state-got-it)" : i === picked ? "var(--state-revisit)" : "var(--color-border)";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => onPick(i)}
              className="rounded-2xl border px-5 py-2.5 text-left text-base text-[var(--color-text-primary)] transition-colors enabled:hover:border-[var(--state-learning)] disabled:cursor-default"
              style={{ borderColor: color, opacity: answered && !isAnswer && i !== picked ? 0.45 : 1 }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p role="status" className="max-w-xl text-base leading-snug text-[var(--color-text-primary)]">
          <span style={{ color: picked === quiz.answer ? "var(--state-got-it)" : "var(--state-revisit)" }}>{picked === quiz.answer ? "Yes. " : "Not quite. "}</span>
          {quiz.reveal}
        </p>
      )}
    </>
  );
}
