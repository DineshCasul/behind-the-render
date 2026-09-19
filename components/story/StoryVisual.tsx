"use client";

import { useState } from "react";
import type { StoryVisualSpec } from "@/data/story";
import {
  CacheLayersDemo,
  CrawlerView,
  Diagnose,
  Freshness,
  Herd,
  JsSplit,
  PersonalLeak,
  RequestAnatomy,
  StrategyCompare,
  StreamingCompare,
} from "@/components/story/StoryVisualsMore";

/**
 * Small interactive demos that sit inside story steps. They are
 * deliberately qualitative: no milliseconds, because the scenario is
 * fictional and an invented number would look like a measurement. What they
 * show is the ORDER of events and what the fan can see or do at each point,
 * which is the part that is true of every real site.
 */

const box = "rounded-xl border border-[var(--color-border)] p-4";
const tag = "font-mono text-[10px] uppercase tracking-widest";

// ---------------------------------------------------------------------------
// 1. A fan's phone, scrubbed through time, for each rendering strategy
// ---------------------------------------------------------------------------

interface PhoneStage {
  caption: string;
  detail: string;
  showsContent: boolean;
  interactive: boolean;
}

const PHONE_STAGES: Record<"csr" | "ssr" | "ssg" | "isr", PhoneStage[]> = {
  csr: [
    { caption: "The HTML shell arrives", detail: "Almost empty: a container and a script tag.", showsContent: false, interactive: false },
    { caption: "JavaScript downloads and runs", detail: "Nothing to draw yet. A crawler that doesn't wait would stop here.", showsContent: false, interactive: false },
    { caption: "The browser asks for the show data", detail: "Still blank, or a loading spinner if you built one.", showsContent: false, interactive: false },
    { caption: "The page is drawn", detail: "Content and behavior arrive together, because the same JavaScript made both.", showsContent: true, interactive: true },
  ],
  ssr: [
    { caption: "The request crosses the ocean; the server builds the page", detail: "The fan waits with nothing on screen. Nothing has come back yet.", showsContent: false, interactive: false },
    { caption: "The finished HTML arrives", detail: "Content is visible right away, before any JavaScript.", showsContent: true, interactive: false },
    { caption: "JavaScript arrives and hydrates the page", detail: "Now the buttons work.", showsContent: true, interactive: true },
  ],
  ssg: [
    { caption: "A ready-made file is handed back", detail: "No page-building happens for this request. The file was made at build time.", showsContent: false, interactive: false },
    { caption: "The HTML arrives", detail: "Content is visible. It is as fresh as the last build, not as fresh as now.", showsContent: true, interactive: false },
    { caption: "JavaScript arrives and hydrates the page", detail: "Now the buttons work.", showsContent: true, interactive: true },
  ],
  isr: [
    { caption: "A cached, ready-made page is handed back", detail: "If it is due for a refresh, a rebuild starts in the background for the next visitor.", showsContent: false, interactive: false },
    { caption: "The HTML arrives", detail: "Content is visible, as fresh as the last rebuild.", showsContent: true, interactive: false },
    { caption: "JavaScript arrives and hydrates the page", detail: "Now the buttons work.", showsContent: true, interactive: true },
  ],
};

function Phone({ content, interactive, tapNote }: { content: boolean; interactive: boolean; tapNote: string | null }) {
  return (
    <div className="mx-auto w-44 shrink-0 rounded-[1.4rem] border-2 border-[var(--color-border)] bg-black/30 p-2">
      <div className="flex h-56 flex-col gap-2 rounded-[1rem] bg-[var(--color-background,#0b0d10)] p-3">
        {content ? (
          <>
            <p className="text-[11px] font-semibold text-[var(--color-text-primary)]">Aurora Tour: Tokyo</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Doors 19:00. Sale opens 09:00.</p>
            <div className="mt-1 grid grid-cols-5 gap-1" aria-hidden>
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="h-3 rounded-sm bg-[var(--color-border)]" />
              ))}
            </div>
            <span
              className="mt-auto rounded-md border px-2 py-1.5 text-center text-[10px] font-semibold"
              style={{
                borderColor: interactive ? "var(--state-got-it)" : "var(--color-border)",
                color: interactive ? "var(--state-got-it)" : "var(--color-text-muted)",
              }}
            >
              {tapNote ?? "Pick a seat"}
            </span>
          </>
        ) : (
          <p className="m-auto font-mono text-[10px] text-[var(--color-text-muted)]">(blank)</p>
        )}
      </div>
    </div>
  );
}

function PhoneTimeline({ strategy }: { strategy: keyof typeof PHONE_STAGES }) {
  const stages = PHONE_STAGES[strategy];
  const [i, setI] = useState(0);
  const stage = stages[i];
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: what does the fan see?</p>
      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <Phone content={stage.showsContent} interactive={stage.interactive} tapNote={null} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {i + 1}. {stage.caption}
          </p>
          <p className="mt-1 text-xs leading-snug text-[var(--color-text-muted)]">{stage.detail}</p>
          <p className="mt-2 text-xs text-[var(--color-text-primary)]">
            Can they see the page? <b>{stage.showsContent ? "Yes" : "No"}</b>. Does the button work?{" "}
            <b>{stage.interactive ? "Yes" : "No"}</b>.
          </p>
          <label className="mt-4 block">
            <span className={`${tag} text-[var(--color-text-muted)]`}>Move forward in time</span>
            <input
              type="range"
              min={0}
              max={stages.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--state-learning)]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Distance: why the server's location is a performance decision
// ---------------------------------------------------------------------------

function Distance() {
  const [near, setNear] = useState(false);
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: where does the page come from?</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Where the page is served from">
        {[
          { v: false, label: "One server in Virginia" },
          { v: true, label: "A copy of the page near the fan" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={near === o.v}
            onClick={() => setNear(o.v)}
            className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors"
            style={{
              borderColor: near === o.v ? "var(--state-learning)" : "var(--color-border)",
              color: near === o.v ? "var(--state-learning)" : "var(--color-text-muted)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <div className="flex justify-between font-mono text-[10px] text-[var(--color-text-muted)]">
          <span>Fan in Tokyo</span>
          <span>{near ? "Nearby copy" : "Virginia"}</span>
        </div>
        <div className="relative mt-1 h-2 rounded-full bg-[var(--color-border)]" aria-hidden>
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--state-learning)] transition-[width] duration-500"
            style={{ width: near ? "12%" : "100%" }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs leading-snug text-[var(--color-text-muted)]">
        {near
          ? "The request only travels a short way, and the response comes back the same short way. Building a page for every fan is still a separate problem, which is what caching is for."
          : "Every request makes the whole trip out and the whole trip back before the first byte of HTML can even start arriving. Faster code cannot speed up the speed of light."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Looks ready, feels dead: tap before and after hydration
// ---------------------------------------------------------------------------

function TapDemo() {
  const [hydrated, setHydrated] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [taps, setTaps] = useState(0);
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: tap the seat button</p>
      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <Phone content interactive={hydrated} tapNote={note} />
        <div className="flex-1">
          <button
            type="button"
            onClick={() => {
              setTaps((n) => n + 1);
              if (hydrated) setNote("Seat 14B held");
            }}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-left text-sm text-[var(--color-text-primary)] transition-colors hover:border-[var(--state-learning)]"
          >
            Tap &quot;Pick a seat&quot; on the phone
          </button>
          <p className="mt-2 min-h-[2.5rem] text-xs leading-snug text-[var(--color-text-muted)]" aria-live="polite">
            {hydrated
              ? "Hydrated: React has attached the click handlers, so the tap did something."
              : taps === 0
                ? "The HTML is on screen, but no JavaScript has run yet."
                : `Nothing happened (${taps} ${taps === 1 ? "tap" : "taps"}). The button is only a picture of a button until hydration finishes.`}
          </p>
          <button
            type="button"
            disabled={hydrated}
            onClick={() => setHydrated(true)}
            className="mt-3 w-full rounded-lg border border-[var(--state-got-it)] px-3 py-2.5 text-left text-sm text-[var(--state-got-it)] transition-opacity disabled:opacity-40"
          >
            {hydrated ? "JavaScript has arrived and hydrated the page" : "JavaScript finishes loading and hydrates the page"}
          </button>
          {hydrated && (
            <button
              type="button"
              onClick={() => {
                setHydrated(false);
                setNote(null);
                setTaps(0);
              }}
              className="mt-2 font-mono text-[11px] text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. 9:00:01: a crowd, with and without a cache
// ---------------------------------------------------------------------------

const FANS = 24;

function Crowd() {
  const [cached, setCached] = useState(false);
  const reaching = cached ? 1 : FANS;
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: everyone asks for the same page</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Caching on or off">
        {[
          { v: false, label: "No cache" },
          { v: true, label: "Cache in front of the server" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={cached === o.v}
            onClick={() => setCached(o.v)}
            className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors"
            style={{
              borderColor: cached === o.v ? "var(--state-learning)" : "var(--color-border)",
              color: cached === o.v ? "var(--state-learning)" : "var(--color-text-muted)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-1.5" aria-hidden>
        {Array.from({ length: FANS }).map((_, i) => (
          <span
            key={i}
            className="h-3 rounded-full transition-colors duration-300"
            style={{ background: !cached || i === 0 ? "var(--state-revisit)" : "var(--state-got-it)" }}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] text-[var(--color-text-muted)]">
        <span style={{ color: "var(--state-revisit)" }}>amber</span> = this request makes the server do the work,{" "}
        <span style={{ color: "var(--state-got-it)" }}>green</span> = answered from the cache
      </p>
      <p className="mt-3 text-sm text-[var(--color-text-primary)]">
        Requests the server had to work on: <b>{reaching}</b> of {FANS}
      </p>
      <p className="mt-1 text-xs leading-snug text-[var(--color-text-muted)]">
        {cached
          ? "The first request does the real work and its result is saved. Everyone after it gets the saved copy."
          : "Every fan triggers the same work again, at the same second."}{" "}
        (Illustrative: a real cache doesn&apos;t split requests this neatly, and some requests can arrive before the first
        result is saved.)
      </p>
    </div>
  );
}

export function StoryVisual({ spec }: { spec: StoryVisualSpec }) {
  switch (spec.kind) {
    case "phone":
      return <PhoneTimeline strategy={spec.strategy} />;
    case "distance":
      return <Distance />;
    case "tap":
      return <TapDemo />;
    case "crowd":
      return <Crowd />;
    case "crawler":
      return <CrawlerView />;
    case "compare":
      return <StrategyCompare />;
    case "anatomy":
      return <RequestAnatomy />;
    case "herd":
      return <Herd />;
    case "freshness":
      return <Freshness />;
    case "streaming":
      return <StreamingCompare />;
    case "jssplit":
      return <JsSplit />;
    case "layers":
      return <CacheLayersDemo />;
    case "leak":
      return <PersonalLeak />;
    case "diagnose":
      return <Diagnose />;
  }
}
