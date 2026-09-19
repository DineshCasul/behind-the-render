"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CacheLayersExperiment } from "@/components/experiments/CacheLayersExperiment";

/**
 * More interactive demos for the story. Same rule as StoryVisual.tsx: they show
 * the ORDER of events and the SHAPE of a trade-off. Any number on screen is a
 * unit invented for the demo ("ticks", "fans", "units") and is labelled as
 * such, never as milliseconds or bytes.
 */

const box = "rounded-xl border border-[var(--color-border)] p-4";
const tag = "font-mono text-[10px] uppercase tracking-widest";
const note = "mt-3 text-xs leading-snug text-[var(--color-text-muted)]";

function Chips<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { v: T; label: string }[];
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.v)}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors"
          style={{
            borderColor: value === o.v ? "var(--state-learning)" : "var(--color-border)",
            color: value === o.v ? "var(--state-learning)" : "var(--color-text-muted)",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type Tone = "good" | "warn" | "bad";
const TONE: Record<Tone, string> = { good: "var(--state-got-it)", warn: "var(--state-revisit)", bad: "#f0707a" };

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ borderColor: TONE[tone], color: TONE[tone] }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// 1. What does a crawler receive? (the-drop)
// ---------------------------------------------------------------------------

export function CrawlerView() {
  const [builtBy, setBuiltBy] = useState<"browser" | "server">("browser");
  const browser = builtBy === "browser";
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: what does Google receive first?</p>
      <Chips
        label="Who builds the page"
        value={builtBy}
        onChange={setBuiltBy}
        options={[
          { v: "browser", label: "The browser builds it (CSR)" },
          { v: "server", label: "The server or build makes it (SSR, SSG, ISR)" },
        ]}
      />
      <pre className="mt-4 overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-[var(--color-text-primary)]">
        {browser
          ? `<body>\n  <div id="root"></div>\n  <script src="/app.js"></script>\n</body>`
          : `<body>\n  <h1>Aurora Tour: Tokyo</h1>\n  <p>Doors 19:00. Sale opens 09:00.</p>\n  <a href="/events/tokyo/seats">Pick seats</a>\n</body>`}
      </pre>
      <p className="mt-3 text-sm text-[var(--color-text-primary)]">
        Can it read the show from this response alone? <b>{browser ? "No" : "Yes"}</b>
      </p>
      <p className={note}>
        {browser
          ? "It has to wait for the page to be rendered, which Google does as a separate, queued step after it fetches the HTML. Your most important content waits in line."
          : "The title, text and links are already in the response, so nothing has to wait for JavaScript. (Real crawlers may still render the page later to see the final result.)"}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Compare the four strategies against THIS story's requirements
// ---------------------------------------------------------------------------

type Strategy = "csr" | "ssr" | "ssg" | "isr";
const REQS = ["Findable on Google", "Content appears quickly", "Seat data is live", "Cheap to serve at 9:00"] as const;
const VERDICTS: Record<Strategy, { tone: Tone; word: string; why: string }[]> = {
  csr: [
    { tone: "warn", word: "Later", why: "Content exists only after JavaScript runs, so it waits for Google's rendering step." },
    { tone: "bad", word: "Slow", why: "Nothing to show until the JavaScript has downloaded and run." },
    { tone: "good", word: "Easy", why: "The browser can ask for fresh data whenever it wants." },
    { tone: "good", word: "Cheap", why: "The server only hands out the same small shell and files." },
  ],
  ssr: [
    { tone: "good", word: "Yes", why: "The content is in the first response." },
    { tone: "warn", word: "Depends", why: "Fast if the server is quick and close; the fan waits while it builds the page." },
    { tone: "good", word: "Yes", why: "The page is built at request time, so it can use current data." },
    { tone: "bad", word: "Costly", why: "Every request makes the server do work, all at the same second." },
  ],
  ssg: [
    { tone: "good", word: "Yes", why: "The content is in the prebuilt HTML." },
    { tone: "good", word: "Fast", why: "A ready-made file is handed back, no page-building." },
    { tone: "bad", word: "Frozen", why: "The data is whatever it was at build time." },
    { tone: "good", word: "Cheapest", why: "Any CDN or static host can serve the files." },
  ],
  isr: [
    { tone: "good", word: "Yes", why: "The content is in the prebuilt HTML." },
    { tone: "good", word: "Fast", why: "Served from a cache like a static page." },
    { tone: "warn", word: "Delayed", why: "Fresh only as of the last rebuild, which you schedule or trigger." },
    { tone: "good", word: "Cheap", why: "Rebuilds happen occasionally, not once per fan." },
  ],
};

export function StrategyCompare() {
  const [s, setS] = useState<Strategy>("ssr");
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: check each option against the whiteboard</p>
      <Chips
        label="Rendering strategy"
        value={s}
        onChange={setS}
        options={[
          { v: "csr", label: "CSR" },
          { v: "ssr", label: "SSR" },
          { v: "ssg", label: "SSG" },
          { v: "isr", label: "ISR" },
        ]}
      />
      <ul className="mt-4 flex flex-col gap-3">
        {REQS.map((r, i) => {
          const v = VERDICTS[s][i];
          return (
            <li key={r} className="flex items-start gap-3">
              <Pill tone={v.tone}>{v.word}</Pill>
              <span className="text-sm leading-snug">
                <b className="text-[var(--color-text-primary)]">{r}.</b>{" "}
                <span className="text-[var(--color-text-muted)]">{v.why}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className={note}>
        Notice that no option is green all the way down. These verdicts are about this ticket drop, not a general ranking.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Anatomy of one request (path-ssr): where does the waiting come from?
// ---------------------------------------------------------------------------

export function RequestAnatomy() {
  const [far, setFar] = useState(true);
  const [heavy, setHeavy] = useState(true);
  const d = far ? 4 : 1; // relative units, not milliseconds
  const w = heavy ? 6 : 1;
  const parts = [
    { label: "Connect (look up the address, open the connection)", units: d, color: "var(--state-learning)", wait: true },
    { label: "Request travels to the server", units: d, color: "var(--state-learning)", wait: true },
    { label: "Server builds the HTML", units: w, color: "var(--state-revisit)", wait: true },
    { label: "First bytes travel back", units: d, color: "var(--state-learning)", wait: true },
    { label: "The rest of the HTML downloads", units: 2, color: "var(--state-got-it)", wait: false },
  ];
  const total = parts.reduce((n, p) => n + p.units, 0);
  const before = parts.filter((p) => p.wait).reduce((n, p) => n + p.units, 0);
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: where does the waiting come from?</p>
      <Chips label="Distance" value={far ? "far" : "near"} onChange={(v) => setFar(v === "far")} options={[{ v: "far", label: "Fan far from the server" }, { v: "near", label: "Fan close to the server" }]} />
      <Chips label="Server work" value={heavy ? "heavy" : "light"} onChange={(v) => setHeavy(v === "heavy")} options={[{ v: "heavy", label: "Server does a lot of work" }, { v: "light", label: "Server does almost none" }]} />
      <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full" aria-hidden>
        {parts.map((p) => (
          <div key={p.label} className="h-full transition-[flex-grow] duration-500" style={{ flexGrow: p.units, flexBasis: 0, background: p.color, opacity: p.wait ? 1 : 0.55, borderRight: "1px solid var(--background, #0b0d10)" }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-1 text-xs text-[var(--color-text-muted)]">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: p.color, opacity: p.wait ? 1 : 0.55 }} />
            {p.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-[var(--color-text-primary)]">
        Time spent before the first byte arrives: <b>{Math.round((before / total) * 100)}%</b> of this request
      </p>
      <p className={note}>
        Relative sizes, not milliseconds. Distance lengthens the connection, the trip out and the trip back. Server work
        sits in the middle of that. Fixing one leaves the other, which is why CDNs (distance) and caching (work) are
        different tools.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Many requests hit at once (nine-oh-one)
// ---------------------------------------------------------------------------

const CAPACITY = 4; // fans the server can finish per tick (illustrative)

export function Herd() {
  const [arrivals, setArrivals] = useState(8);
  const [cached, setCached] = useState(false);
  const [state, setState] = useState({ tick: 0, queue: 0, served: 0 });
  const [running, setRunning] = useState(false);

  const step = () =>
    setState((s) => {
      // With a cache, only the very first request has to make the server work.
      const toServer = cached ? (s.tick === 0 ? 1 : 0) : arrivals;
      const queue = s.queue + toServer;
      const done = Math.min(queue, CAPACITY);
      return { tick: s.tick + 1, queue: queue - done, served: s.served + done + (cached ? arrivals - toServer : 0) };
    });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 700);
    return () => clearInterval(id);
    // step reads the latest slider/toggle values through closure on each render
    // of this effect, so re-subscribe when they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, arrivals, cached]);

  const reset = () => {
    setRunning(false);
    setState({ tick: 0, queue: 0, served: 0 });
  };
  const overloaded = state.queue > CAPACITY * 2;

  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: what happens when many requests hit at once?</p>
      <Chips label="Cache" value={cached ? "on" : "off"} onChange={(v) => { setCached(v === "on"); reset(); }} options={[{ v: "off", label: "No cache: every request needs the server" }, { v: "on", label: "Cache in front of the server" }]} />
      <label className="mt-4 block">
        <span className={`${tag} text-[var(--color-text-muted)]`}>New fans arriving each tick: {arrivals}</span>
        <input type="range" min={1} max={12} value={arrivals} onChange={(e) => setArrivals(Number(e.target.value))} className="mt-2 w-full accent-[var(--state-learning)]" />
      </label>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">The server can finish {CAPACITY} fans per tick. (Units invented for the demo.)</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRunning((r) => !r)} className="btn-ghost">{running ? "Pause" : "Start the sale"}</button>
        <button type="button" onClick={step} className="btn-ghost">One tick</button>
        <button type="button" onClick={reset} className="font-mono text-[11px] text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-text-primary)]">Reset</button>
      </div>
      <div className="mt-4" aria-live="polite">
        <p className="text-sm text-[var(--color-text-primary)]">
          Tick <b>{state.tick}</b> · fans waiting in line: <b style={{ color: overloaded ? TONE.bad : undefined }}>{state.queue}</b> · fans served so far: <b>{state.served}</b>
        </p>
        <div className="mt-2 flex flex-wrap gap-1" aria-hidden>
          {Array.from({ length: Math.min(state.queue, 48) }).map((_, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: TONE.warn }} />
          ))}
        </div>
      </div>
      <p className={note}>
        {state.tick === 0
          ? "Press start. If more fans arrive each tick than the server can finish, the line grows every tick and never shrinks."
          : cached
            ? "Almost every request is answered from the cache, so the line stays empty. Only the first request had to make the server work."
            : arrivals > CAPACITY
              ? "More fans arrive than the server can finish, so the line grows without limit. Every new fan waits behind everyone already in it."
              : "Arrivals are within what the server can handle, so the line stays short. Raise the slider past the server's limit to see it break."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. How fresh is each way of showing the seat count? (seat-freshness)
// ---------------------------------------------------------------------------

const seatsAt = (t: number) => 100 - 3 * t; // the real count drops 3 per tick (illustrative)

export function Freshness() {
  const [now, setNow] = useState(14);
  const [opened, setOpened] = useState(4);
  const openedAt = Math.min(opened, now);
  const rows = [
    { label: "Fetched in the browser (refreshes every 3 ticks)", at: Math.floor(now / 3) * 3 },
    { label: "Built into the HTML when the page was opened", at: openedAt },
    { label: "Shared cache (refreshes every 5 ticks)", at: Math.floor(now / 5) * 5 },
  ];
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: how wrong is each number?</p>
      <label className="mt-3 block">
        <span className={`${tag} text-[var(--color-text-muted)]`}>Time now: tick {now}</span>
        <input type="range" min={0} max={30} value={now} onChange={(e) => setNow(Number(e.target.value))} className="mt-2 w-full accent-[var(--state-learning)]" />
      </label>
      <label className="mt-3 block">
        <span className={`${tag} text-[var(--color-text-muted)]`}>The fan opened the page at tick {openedAt}</span>
        <input type="range" min={0} max={30} value={opened} onChange={(e) => setOpened(Number(e.target.value))} className="mt-2 w-full accent-[var(--state-learning)]" />
      </label>
      <p className="mt-4 text-sm text-[var(--color-text-primary)]">
        Seats really left: <b>{seatsAt(now)}</b>
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {rows.map((r) => {
          const shown = seatsAt(r.at);
          const off = shown - seatsAt(now);
          return (
            <li key={r.label} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-[var(--color-text-muted)]">{r.label}</span>
              <span className="shrink-0 text-right">
                <b className="text-[var(--color-text-primary)]">{shown}</b>{" "}
                <span style={{ color: off === 0 ? TONE.good : TONE.warn }} className="font-mono text-[11px]">
                  {off === 0 ? "exact" : `+${off} too high`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className={note}>
        The page opened once and never refreshed drifts furthest. Refreshing more often shrinks the gap but costs more
        requests. The shared cache trades a bounded error for far fewer database hits. (Ticks and seat counts are
        invented for the demo.)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Streaming versus waiting for everything (the-slow-part)
// ---------------------------------------------------------------------------

const PARTS = [
  { name: "Show details", readyAt: 1 },
  { name: "Description and photos", readyAt: 2 },
  { name: "Live seat map (slow query)", readyAt: 8 },
];

export function StreamingCompare() {
  const [t, setT] = useState(3);
  const allReady = t >= 8;
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: send it all at once, or as it&apos;s ready?</p>
      <label className="mt-3 block">
        <span className={`${tag} text-[var(--color-text-muted)]`}>Time since the request: tick {t}</span>
        <input type="range" min={0} max={10} value={t} onChange={(e) => setT(Number(e.target.value))} className="mt-2 w-full accent-[var(--state-learning)]" />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Wait until everything is ready</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {PARTS.map((p) => (
              <li key={p.name} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-xs" style={{ color: allReady ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                {allReady ? p.name : "(blank)"}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Stream each part when ready</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {PARTS.map((p) => {
              const ready = t >= p.readyAt;
              return (
                <li key={p.name} className="rounded-md border px-3 py-2 text-xs" style={{ borderColor: ready ? "var(--state-got-it)" : "var(--color-border)", color: ready ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                  {ready ? p.name : `${p.name}: loading…`}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className={note}>
        Both finish at the same moment: the slow query takes as long as it takes. Streaming only changes what the fan can
        read while they wait. (Ticks are invented for the demo.)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. What ships to the browser? (how-much-js)
// ---------------------------------------------------------------------------

const WIDGETS = [
  { name: "Header and navigation", weight: 2, interactive: false },
  { name: "Show description", weight: 3, interactive: false },
  { name: "Photo gallery (static images)", weight: 4, interactive: false },
  { name: "Reviews list", weight: 3, interactive: false },
  { name: "Seat picker", weight: 6, interactive: true },
  { name: "Quantity stepper", weight: 2, interactive: true },
  { name: "Footer", weight: 1, interactive: false },
];

export function JsSplit() {
  const [whole, setWhole] = useState(true);
  const total = WIDGETS.reduce((n, w) => n + w.weight, 0);
  const ships = (w: (typeof WIDGETS)[number]) => whole || w.interactive;
  const shipped = WIDGETS.filter(ships).reduce((n, w) => n + w.weight, 0);
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: where do you put the boundary?</p>
      <Chips label="Where use client goes" value={whole ? "whole" : "leaves"} onChange={(v) => setWhole(v === "whole")} options={[{ v: "whole", label: "use client on the whole page" }, { v: "leaves", label: "use client only on the interactive parts" }]} />
      <ul className="mt-4 flex flex-col gap-1.5">
        {WIDGETS.map((w) => {
          const s = ships(w);
          return (
            <li key={w.name} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs" style={{ borderColor: s ? "var(--state-revisit)" : "var(--color-border)" }}>
              <span className="text-[var(--color-text-primary)]">
                {w.name}
                {w.interactive && <span className="ml-2 font-mono text-[10px] text-[var(--state-learning)]">needs state</span>}
              </span>
              <span className="shrink-0 font-mono text-[10px]" style={{ color: s ? "var(--state-revisit)" : "var(--state-got-it)" }}>
                {s ? "ships to the browser" : "stays on the server"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-[var(--color-text-primary)]">
        JavaScript to download and hydrate: <b>{shipped}</b> of {total} units
      </p>
      <p className={note}>
        The directive covers a file and everything it imports, so marking the page pulls in every widget below it, even
        the ones that never change. The seat picker and stepper need state, so they must be client code either way. Unit
        sizes are invented for the demo.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. The caches, reused from the lesson experiment (where-to-cache)
// ---------------------------------------------------------------------------

export function CacheLayersDemo() {
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: which copy answers the request?</p>
      <p className="mt-2 text-xs leading-snug text-[var(--color-text-muted)]">
        Mark which places already hold a copy, then send a request. It stops at the first place that has one. Times in this demo are illustrative, not measurements.
      </p>
      <div className="mt-4">
        <CacheLayersExperiment />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9. A shared cache and a personal page (just-for-you)
// ---------------------------------------------------------------------------

export function PersonalLeak() {
  const [mode, setMode] = useState<"leaky" | "split">("leaky");
  const leaky = mode === "leaky";
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: two fans, one shared cache</p>
      <Chips label="How the personal part is handled" value={mode} onChange={setMode} options={[{ v: "leaky", label: "Whole page, personal name included, is cached" }, { v: "split", label: "Shared page cached, personal part fetched per fan" }]} />
      <ol className="mt-4 flex flex-col gap-3 text-sm">
        <li className="rounded-lg border border-[var(--color-border)] p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">1. Yuki opens the page first</p>
          <p className="mt-1 text-[var(--color-text-primary)]">She sees: &quot;Welcome back, Yuki. You are number 4,812.&quot;</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{leaky ? "The cache saves this exact page." : "The cache saves only the shared part: no name, no number."}</p>
        </li>
        <li className="rounded-lg border p-3" style={{ borderColor: leaky ? TONE.bad : "var(--state-got-it)" }}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">2. Sam opens the same URL a moment later</p>
          <p className="mt-1 text-[var(--color-text-primary)]">
            {leaky ? <>He sees: &quot;Welcome back, <b style={{ color: TONE.bad }}>Yuki</b>. You are number <b style={{ color: TONE.bad }}>4,812</b>.&quot;</> : <>He sees the shared page, then his own line fills in: &quot;Welcome back, Sam.&quot;</>}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{leaky ? "The shared cache gave Sam Yuki's page. This is a real class of bug, and it is a privacy leak." : "Personal data never sat in a shared copy, so there is nothing to leak."}</p>
        </li>
      </ol>
      <p className={note}>
        The fix is not &quot;don&apos;t cache&quot;: it is deciding which parts are the same for everyone (cache those) and which are
        one person&apos;s (never put those in a shared copy).
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10. Symptom to metric (did-it-work)
// ---------------------------------------------------------------------------

const SYMPTOMS = [
  {
    id: "slow",
    label: "The page takes ages to show up",
    metric: "LCP (Largest Contentful Paint)",
    look: ["Time to first byte: server work, distance and whether a cache answered", "How early the biggest element is discovered and loaded", "Things that block rendering, such as large scripts or styles"],
    story: "This is where SSR, SSG, ISR and caching earn their keep.",
    lesson: "web-vitals",
  },
  {
    id: "laggy",
    label: "Taps feel laggy, or ignored",
    metric: "INP (Interaction to Next Paint)",
    look: ["Long tasks on the main thread (anything over 50 ms)", "Hydration still running when the fan taps", "Heavy event handlers or a big render after the tap"],
    story: "This is the \"looks ready, feels dead\" problem, and the reason to ship less JavaScript.",
    lesson: "js-main-thread",
  },
  {
    id: "jump",
    label: "Things jump around while loading",
    metric: "CLS (Cumulative Layout Shift)",
    look: ["Images or embeds without reserved space", "Content inserted above what the fan is reading", "A late-arriving number, like the seat count, pushing things down"],
    story: "The browser-fetched seat count is a classic cause: reserve its space in advance.",
    lesson: "web-vitals",
  },
];

export function Diagnose() {
  const [id, setId] = useState("slow");
  const s = SYMPTOMS.find((x) => x.id === id)!;
  return (
    <div className={box}>
      <p className={`${tag} text-[var(--state-learning)]`}>Try it: a fan complains. Where do you look?</p>
      <Chips label="What the fan says" value={id} onChange={setId} options={SYMPTOMS.map((x) => ({ v: x.id, label: x.label }))} />
      <p className="mt-4 text-sm text-[var(--color-text-primary)]">
        That is <b>{s.metric}</b>. Check:
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm leading-snug text-[var(--color-text-muted)]">
        {s.look.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className={note}>
        {s.story}{" "}
        <Link href={`/learn/${s.lesson}`} className="text-[var(--state-learning)] underline underline-offset-4">
          Open the lesson
        </Link>
      </p>
    </div>
  );
}
