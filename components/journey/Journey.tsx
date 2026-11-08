"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChapterVisual } from "@/components/journey/ChapterVisual";
import { AlternativesList } from "@/components/tricks/AlternativesList";
import { DocQuoteList } from "@/components/tricks/DocQuoteList";
import { Emph } from "@/components/ui/Emph";
import type { JourneyApp, Quiz } from "@/data/journey";
import type { SiteOverview } from "@/data/site-overviews";

/**
 * One site, walked chapter by chapter. The whole walk is flattened into a list
 * of "beats" (a guess-first question, a narration line, the chapter's source
 * card, the closing question), so "next" is just beat + 1. The only state is
 * which beat you are on. Narration on the left, the chapter's diagram on the
 * right (stacked on phones). Space and the arrow keys move on; the page scrolls
 * and selects normally.
 */

interface Beat {
  chapterIndex: number;
  lineIndex: number;
  kind: "overview" | "predict" | "line" | "example" | "docs" | "check";
  text: string;
}

export function Journey({
  app,
  toyTrick,
  trickTitles,
  overview,
}: {
  app: JourneyApp;
  toyTrick?: string;
  trickTitles?: Record<string, string>;
  overview?: SiteOverview;
}) {
  const chapters = app.chapters;
  // "Skim" drops the narration and guesses; only each chapter's source card (and the closing question) remain.
  const [skim, setSkim] = useState(false);

  const beats = useMemo<Beat[]>(() => {
    const out = chapters.flatMap((c, chapterIndex) => {
      const own: Beat[] = [];
      // The overview card comes first, ahead of chapter 1's own beats.
      if (!skim && overview && chapterIndex === 0) own.push({ chapterIndex, lineIndex: -1, kind: "overview", text: overview.intro });
      if (!skim && c.predict) own.push({ chapterIndex, lineIndex: 0, kind: "predict", text: "" });
      if (!skim) c.lines.forEach((text, lineIndex) => own.push({ chapterIndex, lineIndex, kind: "line", text }));
      // A concrete example (real HTTP, or code) is its own card between the narration and the sources.
      if (!skim && c.example) own.push({ chapterIndex, lineIndex: c.lines.length, kind: "example", text: "" });
      own.push({ chapterIndex, lineIndex: c.lines.length, kind: "docs", text: "" });
      return own;
    });
    if (app.check) out.push({ chapterIndex: chapters.length - 1, lineIndex: 0, kind: "check", text: "" });
    return out;
  }, [chapters, skim, app.check, overview]);

  // The first beat of each chapter, so a step in a flow can jump straight to it.
  const firstBeat = useMemo(() => {
    const map: Record<string, number> = {};
    beats.forEach((b, i) => {
      const id = chapters[b.chapterIndex]?.id;
      if (id && map[id] === undefined) map[id] = i;
    });
    return map;
  }, [beats, chapters]);

  const trickList = Object.entries(trickTitles ?? {});
  const sources = Array.from(new Map(chapters.flatMap((c) => c.docs).map((d) => [d.href, d])).values());

  const [beat, setBeat] = useState(0);
  // What the reader picked in each question, so going back shows it again.
  const [picks, setPicks] = useState<Record<string, number>>({});
  const ended = beat >= beats.length;
  const line = beats[Math.min(beat, beats.length - 1)];
  const chapterIndex = line.chapterIndex;
  const chapter = chapters[chapterIndex];
  const quiz: Quiz | undefined = line.kind === "predict" ? chapter.predict : line.kind === "check" ? app.check : undefined;
  const quizKey = line.kind === "check" ? "check" : `predict-${chapter.id}`;
  const visual = chapter.visual;
  // A guess-first question must not have its answer drawn next to it: wait until it is answered.
  const hideForGuess = line.kind === "predict" && picks[quizKey] === undefined;
  const showDiagram = !ended && Boolean(visual) && line.kind !== "check" && line.kind !== "overview" && !hideForGuess;
  const visualStep = line.kind === "predict" ? 0 : line.kind === "line" ? line.lineIndex : 99;

  const goTo = useCallback((next: number) => setBeat(Math.max(0, Math.min(beats.length, next))), [beats.length]);
  const step = useCallback((delta: number) => setBeat((b) => Math.max(0, Math.min(beats.length, b + delta))), [beats.length]);

  // New beat: scroll the text area back to the top.
  const scrollRef = useRef<HTMLDivElement>(null);
  // Braces matter: a recent Chromium returns a Promise from scrollTo(), and an effect that returns
  // something other than a function makes React crash on the next step (it treats it as a cleanup).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [beat]);

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

  return (
    <main aria-label={`Walkthrough: ${app.name}`} className="fixed inset-x-0 bottom-0 top-12 flex flex-col">
      <h1 className="sr-only">{app.name}</h1>

      {/* Top bar: back, the chapters as a row of steps, skim. */}
      <div className="flex items-center gap-4 border-b border-[var(--color-border)] px-5 py-2 text-sm lg:px-10">
        <Link href="/journey" className="label shrink-0 hover:text-[var(--color-text-primary)]">
          ← sites
        </Link>
        <span className="shrink-0 text-[var(--color-text-primary)]">{app.name}</span>
        <span className="flex-1" />
        <button
          type="button"
          className="btn shrink-0"
          aria-pressed={skim}
          onClick={() => {
            setSkim((v) => !v);
            setBeat(0);
          }}
          title="Skip the narration and show only the quotes from the sources"
        >
          skim
        </button>
      </div>

      <Progress
        chapters={chapters}
        beats={beats}
        beat={beat}
        ended={ended}
        onGo={goTo}
      />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={`mx-auto grid w-full grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-6 px-5 py-8 lg:px-10 lg:py-12 ${showDiagram ? "max-w-[1400px] lg:grid-cols-2 lg:items-start" : "max-w-3xl lg:py-20"}`}>
          {/* Narration, quiz or sources */}
          <div aria-live="polite" aria-atomic="true" className="min-h-[12rem] min-w-0">
            {ended ? (
              <div className="fade-in flex flex-col gap-4">
                <p className="text-[var(--state-got-it)]">$ done</p>
                {overview?.flows?.map((flow) => (
                  <div key={flow.title}>
                    <p className="label mb-1"># how it fits together: {flow.title.toLowerCase()}</p>
                    {flow.note && <p className="label mb-2 max-w-[65ch]">{flow.note}</p>}
                    <ol className="flex flex-col gap-2">
                      {flow.steps.map((s, i) => (
                        <li key={s.text} className="grid grid-cols-[2rem_1fr] text-base">
                          <span className="pt-0.5 tabular-nums text-[var(--state-learning)]">{i + 1}</span>
                          <span className="read !text-base">
                            {s.text}{" "}
                            {firstBeat[s.chapter] !== undefined && (
                              <button type="button" className="link whitespace-nowrap text-sm" onClick={() => goTo(firstBeat[s.chapter])}>
                                [{chapters.find((c) => c.id === s.chapter)?.title.toLowerCase()}]
                              </button>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                {trickList.length > 0 && (
                  <div>
                    <p className="label mb-2"># tricks from this site</p>
                    <ul className="flex flex-col gap-1 text-lg">
                      {trickList.map(([slug, title]) => (
                        <li key={slug}>
                          <Link href={`/trick/${slug}`} className="link">
                            {title} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="label mb-2"># every source on this road</p>
                  <ul className="flex flex-col gap-1">
                    {sources.map((d) => (
                      <li key={d.href}>
                        <a href={d.href} target="_blank" rel="noopener noreferrer" className="link text-[var(--state-got-it)]">
                          {d.source} ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3">
                  {toyTrick && (
                    <Link href={`/trick/${toyTrick}`} className="btn">
                      try the toy
                    </Link>
                  )}
                  <button type="button" className="btn" onClick={() => goTo(0)}>
                    again
                  </button>
                  <Link href="/journey" className="btn">
                    other sites
                  </Link>
                  <Link href="/trick" className="btn">
                    tricks
                  </Link>
                </div>
              </div>
            ) : (
              <div key={beat} className="fade-in flex flex-col gap-4">
                {line.kind === "overview" ? (
                  <p className="label"># {app.name.toLowerCase()}: what this road is about</p>
                ) : (
                  line.kind !== "check" && (
                    <p className="label">
                      # {chapterIndex + 1}. {chapter.title.toLowerCase()}
                      {chapter.trick && trickTitles?.[chapter.trick] ? ` · trick: ${trickTitles[chapter.trick].toLowerCase()}` : ""}
                    </p>
                  )
                )}
                {line.kind === "overview" ? (
                  <>
                    <p className="read-lg text-pretty font-[family-name:var(--font-read)] lg:!text-[1.5rem] lg:!leading-[1.5]">{line.text}</p>
                    {trickList.length > 0 && (
                      <p className="label max-w-[65ch]">
                        tricks on this road: {trickList.map(([, title]) => title.toLowerCase()).join(", ")}
                      </p>
                    )}
                  </>
                ) : line.kind === "example" && chapter.example ? (
                  <>
                    <p className="label"># example: {chapter.example.title.toLowerCase()}</p>
                    <pre className="overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
                      <code>{chapter.example.code}</code>
                    </pre>
                    <p className="label max-w-[65ch]">{chapter.example.note}</p>
                  </>
                ) : quiz ? (
                  <QuizBody label={line.kind === "predict" ? "guess first" : "check yourself"} quiz={quiz} picked={picks[quizKey]} onPick={(i) => setPicks((p) => ({ ...p, [quizKey]: i }))} />
                ) : line.kind === "docs" ? (
                  <>
                    <DocQuoteList quotes={chapter.docs} />
                    {chapter.note && <p className="label">{chapter.note}</p>}
                    {chapter.alternatives && chapter.alternatives.length > 0 && (
                      <>
                        <p className="label mt-2"># alternatives</p>
                        <AlternativesList alternatives={chapter.alternatives} />
                      </>
                    )}
                  </>
                ) : (
                  <p className="read-lg text-pretty font-[family-name:var(--font-read)] lg:!text-[1.75rem] lg:!leading-[1.45]">
                    <Emph text={line.text} />
                  </p>
                )}
              </div>
            )}
          </div>

          {showDiagram && visual && (
            <div className="sticky top-0 z-10 mx-auto w-full max-w-md bg-[var(--color-bg)] lg:top-6 lg:max-w-none lg:self-start">
              <ChapterVisual kind={visual} step={visualStep} />
            </div>
          )}
        </div>
      </div>

      {/* Controls: docked at the bottom so they never move. */}
      {!ended && (
        <div className="flex shrink-0 items-center gap-3 border-t border-[var(--color-border)] px-5 py-3 text-xs lg:px-10">
          <button type="button" className="btn" onClick={() => step(-1)} disabled={beat === 0} aria-label="Back">
            ←
          </button>
          <button type="button" className="btn" onClick={() => step(1)}>
            {beat === beats.length - 1 ? "finish" : "next"} →
          </button>
          <span className="label" aria-hidden>
            {beat + 1}/{beats.length}
          </span>
          <span className="label ml-auto hidden lg:block">space or → for next, ← for back</span>
        </div>
      )}

      {/* The whole narration as plain text, for screen readers. */}
      <section className="sr-only" aria-label="Full transcript">
        {overview && <p>{overview.intro}</p>}
        {overview?.flows?.map((f) => (
          <div key={f.title}>
            <h2>{f.title}</h2>
            <ol>
              {f.steps.map((s) => (
                <li key={s.text}>{s.text}</li>
              ))}
            </ol>
          </div>
        ))}
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
            {c.example && (
              <>
                <p>Example: {c.example.title}</p>
                <pre>{c.example.code}</pre>
                <p>{c.example.note}</p>
              </>
            )}
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
 * The progress bar: one segment per step of the walk, grouped by chapter. A
 * chapter's group is as wide as it has steps, so long chapters look long. Done
 * steps are green, the current step is blue, the rest are grey; every segment
 * is a button that jumps straight to that step. The current chapter's name is
 * shown above its group, and the others are named in the tooltip.
 */
function Progress({
  chapters,
  beats,
  beat,
  ended,
  onGo,
}: {
  chapters: { id: string; title: string }[];
  beats: Beat[];
  beat: number;
  ended: boolean;
  onGo: (beat: number) => void;
}) {
  const current = Math.min(beat, beats.length - 1);
  const currentChapter = beats[current].chapterIndex;
  return (
    <nav aria-label="Progress" className="border-b border-[var(--color-border)] px-5 pb-3 pt-2 lg:px-10">
      <div className="flex gap-3">
        {chapters.map((c, ci) => {
          const own = beats.map((b, i) => ({ b, i })).filter((x) => x.b.chapterIndex === ci);
          const active = ci === currentChapter && !ended;
          return (
            <div key={c.id} className="min-w-0" style={{ flexGrow: own.length, flexBasis: 0 }}>
              <p className={`mb-1 truncate text-xs ${active ? "text-[var(--state-learning)]" : "text-[var(--color-text-muted)]"}`}>
                <span className="sm:hidden">{ci + 1}</span>
                <span className="hidden sm:inline">
                  {ci + 1}. {c.title.toLowerCase()}
                </span>
              </p>
              <ol className="flex gap-[3px]">
                {own.map(({ b, i }) => {
                  const done = ended || i < current;
                  const now = !ended && i === current;
                  const kind = b.kind === "docs" ? "sources" : b.kind === "predict" ? "guess" : b.kind === "check" ? "check" : b.kind === "overview" ? "overview" : b.kind === "example" ? "example" : `line ${b.lineIndex + 1}`;
                  return (
                    <li key={i} className="flex-1">
                      <button
                        type="button"
                        onClick={() => onGo(i)}
                        aria-label={`${c.title}, ${kind}`}
                        aria-current={now ? "step" : undefined}
                        title={`${c.title}: ${kind}`}
                        className="block h-2 w-full transition-colors hover:opacity-80"
                        style={{ background: now ? "var(--state-learning)" : done ? "var(--state-got-it)" : "var(--color-border)" }}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/** A multiple-choice question. Picking locks it, marks the right answer (green) and shows why. */
function QuizBody({ label, quiz, picked, onPick }: { label: string; quiz: Quiz; picked: number | undefined; onPick: (i: number) => void }) {
  const answered = picked !== undefined;
  return (
    <>
      <p className="label"># {label}</p>
      <p className="read !text-[1.35rem] !text-[var(--color-text-primary)]">{quiz.question}</p>
      <div className="flex flex-col items-start gap-2" role="group" aria-label="Choices">
        {quiz.options.map((option, i) => {
          const isAnswer = i === quiz.answer;
          const color = !answered ? "var(--color-border)" : isAnswer ? "var(--state-got-it)" : i === picked ? "var(--state-revisit)" : "var(--color-border)";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => onPick(i)}
              className="border px-4 py-2 text-left font-[family-name:var(--font-read)] text-lg transition-colors enabled:hover:border-[var(--state-learning)] disabled:cursor-default"
              style={{ borderColor: color, opacity: answered && !isAnswer && i !== picked ? 0.4 : 1 }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p role="status" className="read">
          <span style={{ color: picked === quiz.answer ? "var(--state-got-it)" : "var(--state-revisit)" }}>{picked === quiz.answer ? "correct. " : "not quite. "}</span>
          {quiz.reveal}
        </p>
      )}
    </>
  );
}
