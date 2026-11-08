import { useId } from "react";
import { CssShrink, JqueryDecline, JqueryTimeline, JsTiers, LcpTimeline, Playback, WasmLoad, WasmPort } from "@/components/journey/ChapterVisualMore";
import { Frame, MONO, T } from "@/components/journey/visual-frame";
import type { VisualKind } from "@/data/journey";

/**
 * The animated diagrams beside the journey. Each one is a small SVG whose
 * look depends on `step`: the index of the subtitle the reader is on (0 for
 * the first line, and a large number once the chapter's source card is up, so
 * every diagram settles into its final state). Moving between steps only
 * fades and slides things (opacity and transform), so it is cheap.
 *
 * The drawings are illustrations. The only numbers shown are ones the sources
 * give (one seventh, 76%, over 90%, 2 data centers and 3 points of presence),
 * and the frame says so under every diagram.
 */

const SQ3 = Math.sqrt(3);
/** Corners of a pointy-top hexagon centred on (cx, cy). */
const hexPts = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
/** Centre of the cell at axial coordinates (q, r). */
const axial = (q: number, r: number, size: number) => ({ x: size * SQ3 * (q + r / 2), y: size * 1.5 * r });
/** Cell steps between the origin and (q, r). */
const hexDist = (q: number, r: number) => (Math.abs(q) + Math.abs(q + r) + Math.abs(r)) / 2;

/** How many steps each diagram has: one per subtitle of its chapter (the trick pages step through them). */
export const VISUAL_STEPS: Record<VisualKind, number> = {
  hexagons: 3,
  "hex-zoom": 2,
  waterfall: 4,
  "cache-edge": 3,
  "cache-layers": 3,
  "lcp-timeline": 3,
  playback: 3,
  "css-shrink": 3,
  "js-tiers": 3,
  "jquery-timeline": 3,
  "jquery-decline": 3,
  "wasm-port": 2,
  "wasm-load": 2,
};

export function ChapterVisual({ kind, step }: { kind: VisualKind; step: number }) {
  const s = Math.max(0, step);
  switch (kind) {
    case "hexagons":
      return <Hexagons step={s} />;
    case "hex-zoom":
      return <HexZoom step={s} />;
    case "waterfall":
      return <Waterfall step={s} />;
    case "cache-edge":
      return <CacheEdge step={s} />;
    case "cache-layers":
      return <CacheLayers step={s} />;
    case "lcp-timeline":
      return <LcpTimeline step={s} />;
    case "playback":
      return <Playback step={s} />;
    case "css-shrink":
      return <CssShrink step={s} />;
    case "js-tiers":
      return <JsTiers step={s} />;
    case "jquery-timeline":
      return <JqueryTimeline step={s} />;
    case "jquery-decline":
      return <JqueryDecline step={s} />;
    case "wasm-port":
      return <WasmPort step={s} />;
    case "wasm-load":
      return <WasmLoad step={s} />;
  }
}

// ---- Uber: the grid ----

function Hexagons({ step }: { step: number }) {
  const size = 19;
  const cells: { q: number; r: number; d: number; x: number; y: number }[] = [];
  for (let q = -3; q <= 3; q++) {
    for (let r = -3; r <= 3; r++) {
      const d = hexDist(q, r);
      if (d <= 3) cells.push({ q, r, d, ...axial(q, r, size) });
    }
  }
  const caption =
    step === 0
      ? "H3 divides areas of the Earth into hexagonal cells."
      : step === 1
        ? "From the middle of a cell, every neighbor is the same distance away."
        : "Group the cells to analyse an area, like a neighborhood within a city.";

  return (
    <Frame title="H3: hexagonal cells" caption={caption}>
      <g transform="translate(170 110)">
        {cells.map((c) => {
          const lit = step === 1 ? c.d <= 1 : step >= 2 ? c.d <= 2 : false;
          return (
            <polygon
              key={`${c.q},${c.r}`}
              points={hexPts(c.x, c.y, size - 1)}
              fill={step >= 2 ? "var(--state-got-it)" : "var(--state-learning)"}
              fillOpacity={lit ? 0.2 : 0}
              stroke="var(--state-learning)"
              strokeOpacity={lit ? 0.9 : 0.35}
              strokeWidth={1}
              className={T}
            />
          );
        })}
        {cells
          .filter((c) => c.d === 1)
          .map((c) => (
            <line key={`s${c.q},${c.r}`} x1={0} y1={0} x2={c.x} y2={c.y} stroke="var(--state-revisit)" strokeWidth={1.6} strokeOpacity={step === 1 ? 1 : 0} className={T} />
          ))}
        <circle r={3} fill="var(--state-revisit)" />
      </g>
    </Frame>
  );
}

// ---- Uber: one seventh the area ----

function HexZoom({ step }: { step: number }) {
  const clipId = `${useId().replace(/:/g, "")}-clip`;
  const R = 92;
  const level = step === 0 ? 1 : 2;
  const size = R / Math.sqrt(7) ** level;
  const n = Math.ceil(R / (size * 1.5)) + 2;
  const cells: { q: number; r: number; x: number; y: number }[] = [];
  for (let q = -n; q <= n; q++) {
    for (let r = -n; r <= n; r++) {
      const c = axial(q, r, size);
      if (Math.hypot(c.x, c.y) <= R * 1.15) cells.push({ q, r, ...c });
    }
  }
  const caption =
    step === 0
      ? "Resolution 1: each cell has one seventh the area, so about 7 of them cover the same ground."
      : "Resolution 2: one seventh again, so about 49 cover that ground. Pick the resolution that fits the question.";

  return (
    <Frame title="H3: one seventh the area" caption={caption}>
      <defs>
        <clipPath id={clipId}>
          <polygon points={hexPts(170, 108, R)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g key={level} className="journey-fade" transform="translate(170 108)">
          {cells.map((c) => (
            <polygon key={`${c.q},${c.r}`} points={hexPts(c.x, c.y, size - 0.8)} fill="var(--state-learning)" fillOpacity={0.08} stroke="var(--state-learning)" strokeOpacity={0.75} strokeWidth={1} />
          ))}
        </g>
      </g>
      <polygon points={hexPts(170, 108, R)} fill="none" stroke="var(--state-revisit)" strokeWidth={2} />
      <text x={170} y={214} textAnchor="middle" fontSize={11} fill="var(--color-text-muted)" style={MONO}>
        {`about ${7 ** level} cells for the same area`}
      </text>
    </Frame>
  );
}

// ---- YouTube: a waterfall, then one batch ----

function Waterfall({ step }: { step: number }) {
  const rows = 5;
  const barW = 42;
  const gap = 34;
  const batched = step >= 1;
  const caption =
    step === 0
      ? "A waterfall: requests that wait on each other. Each starts when the last one finishes."
      : step === 1
        ? "Batched: the minimal set of components a view needs, in a single network request."
        : step === 2
          ? "The player moved to one top-level component that passes data down to its children."
          : "The result: 76% of YouTube's mobile website URLs now pass Core Web Vitals thresholds, in the field.";

  return (
    <Frame title="Requests over time" caption={caption}>
      <text x={16} y={22} fontSize={10} fill="var(--color-text-muted)" style={MONO}>
        time →
      </text>
      {Array.from({ length: rows }, (_, i) => (
        <g key={i} className={T} style={{ transform: `translateX(${batched ? -i * gap : 0}px)`, opacity: batched && i > 0 ? 0 : 1 }}>
          <rect x={16 + i * gap} y={34 + i * 26} width={barW} height={14} rx={3} fill={batched ? "var(--state-got-it)" : "var(--state-revisit)"} className={T} />
        </g>
      ))}
      <text x={16 + barW + 8} y={45} fontSize={10} fill="var(--state-got-it)" style={{ ...MONO, transition: "opacity 0.7s", opacity: batched ? 1 : 0 }}>
        one request
      </text>

      <g className={T} style={{ opacity: step === 2 ? 1 : 0 }}>
        <rect x={243} y={36} width={46} height={18} rx={3} fill="none" stroke="var(--state-learning)" />
        <text x={266} y={48} textAnchor="middle" fontSize={8} fill="var(--state-learning)" style={MONO}>
          top-level
        </text>
        {[220, 266, 312].map((x) => (
          <g key={x}>
            <line x1={266} y1={54} x2={x} y2={100} stroke="var(--state-learning)" strokeOpacity={0.6} />
            <rect x={x - 20} y={100} width={40} height={16} rx={3} fill="none" stroke="var(--state-learning)" strokeOpacity={0.8} />
          </g>
        ))}
      </g>

      <g className={T} style={{ opacity: step >= 3 ? 1 : 0 }}>
        <text x={272} y={74} textAnchor="middle" fontSize={28} fill="var(--state-got-it)" style={MONO}>
          76%
        </text>
        <rect x={222} y={88} width={100} height={10} rx={5} fill="none" stroke="var(--color-border)" />
        <rect x={222} y={88} width={100} height={10} rx={5} fill="var(--state-got-it)" style={{ transformBox: "fill-box", transformOrigin: "left", transform: `scaleX(${step >= 3 ? 0.76 : 0})`, transition: "transform 0.9s" }} />
        <text x={272} y={116} textAnchor="middle" fontSize={8} fill="var(--color-text-muted)" style={MONO}>
          pass Core Web Vitals (field)
        </text>
      </g>
    </Frame>
  );
}

// ---- Wikipedia: the edge ----

function CacheEdge({ step }: { step: number }) {
  const caption =
    step === 0
      ? "Wikipedia is read by a lot of people, and most of them never touch a database."
      : step === 1
        ? "Wikimedia serves its content from 2 main data centers and 3 caching-only points of presence."
        : "On a normal day, over 90% of read requests are served by the caching solution.";

  return (
    <Frame title="Wikimedia's CDN, simplified" caption={caption}>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={24} cy={24 + i * 18} r={4} fill="var(--state-learning)" fillOpacity={0.85} />
      ))}
      <text x={24} y={172} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)" style={MONO}>
        readers
      </text>

      <g className={T} style={{ opacity: step >= 1 ? 1 : 0, transform: `translateX(${step >= 1 ? 0 : -14}px)` }}>
        {[40, 80, 120].map((y) => (
          <g key={y}>
            <rect x={100} y={y} width={76} height={26} rx={4} fill="none" stroke="var(--state-got-it)" />
            <text x={138} y={y + 16} textAnchor="middle" fontSize={8} fill="var(--state-got-it)" style={MONO}>
              caching PoP
            </text>
          </g>
        ))}
        {[56, 100].map((y) => (
          <g key={y}>
            <rect x={218} y={y} width={106} height={34} rx={4} fill="none" stroke="var(--state-revisit)" />
            <text x={271} y={y + 20} textAnchor="middle" fontSize={8} fill="var(--state-revisit)" style={MONO}>
              main data center
            </text>
          </g>
        ))}
      </g>

      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <text x={20} y={186} fontSize={9} fill="var(--color-text-muted)" style={MONO}>
          over 90% served by caches
        </text>
        <rect x={20} y={192} width={300} height={12} rx={6} fill="none" stroke="var(--color-border)" />
        <rect x={20} y={192} width={300} height={12} rx={6} fill="var(--state-got-it)" style={{ transformBox: "fill-box", transformOrigin: "left", transform: `scaleX(${step >= 2 ? 0.9 : 0})`, transition: "transform 0.9s" }} />
      </g>
    </Frame>
  );
}

// ---- Wikipedia: two layers ----

function CacheLayers({ step }: { step: number }) {
  const markerId = `${useId().replace(/:/g, "")}-arrow`;
  const caption =
    step === 0
      ? "Each cache node ran Varnish twice: one in-memory instance, and one for on-disk caching."
      : step === 1
        ? "If the request hits the in-memory cache, the response is sent back directly to the user."
        : "RAM is fast and small, disk is slower and big: two layers, two bets.";

  return (
    <Frame title="One cache node" caption={caption}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
        </marker>
      </defs>
      <circle cx={34} cy={110} r={10} fill="var(--state-learning)" fillOpacity={0.85} />
      <text x={34} y={136} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)" style={MONO}>
        reader
      </text>

      <rect x={110} y={44} width={120} height={48} rx={5} fill="var(--state-got-it)" fillOpacity={0.1} stroke="var(--state-got-it)" />
      <text x={170} y={64} textAnchor="middle" fontSize={10} fill="var(--state-got-it)" style={MONO}>
        Varnish, in memory
      </text>
      <text x={170} y={80} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)" style={{ ...MONO, transition: "opacity 0.7s", opacity: step >= 2 ? 1 : 0 }}>
        fast · small
      </text>

      <rect x={110} y={128} width={120} height={48} rx={5} fill="var(--state-revisit)" fillOpacity={0.08} stroke="var(--state-revisit)" />
      <text x={170} y={148} textAnchor="middle" fontSize={10} fill="var(--state-revisit)" style={MONO}>
        Varnish, on disk
      </text>
      <text x={170} y={164} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)" style={{ ...MONO, transition: "opacity 0.7s", opacity: step >= 2 ? 1 : 0 }}>
        slower · big
      </text>

      {/* a hit: out to the in-memory cache and straight back */}
      <g className={T} style={{ opacity: step === 1 ? 1 : 0 }}>
        <line x1={46} y1={104} x2={108} y2={76} stroke="var(--state-got-it)" strokeWidth={1.8} markerEnd={`url(#${markerId})`} />
        <line x1={108} y1={86} x2={46} y2={114} stroke="var(--state-got-it)" strokeWidth={1.8} strokeDasharray="4 3" markerEnd={`url(#${markerId})`} />
        <text x={70} y={50} fontSize={9} fill="var(--state-got-it)" style={MONO}>
          hit
        </text>
      </g>

      {/* a miss falls through to the disk layer, then on to the origin */}
      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <line x1={170} y1={94} x2={170} y2={126} stroke="var(--color-text-muted)" strokeDasharray="4 3" markerEnd={`url(#${markerId})`} />
        <text x={178} y={114} fontSize={9} fill="var(--color-text-muted)" style={MONO}>
          miss
        </text>
        <rect x={262} y={86} width={62} height={44} rx={5} fill="none" stroke="var(--color-text-muted)" strokeDasharray="4 3" />
        <text x={293} y={112} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)" style={MONO}>
          origin
        </text>
        <line x1={232} y1={152} x2={293} y2={132} stroke="var(--color-text-muted)" strokeDasharray="4 3" markerEnd={`url(#${markerId})`} />
      </g>
    </Frame>
  );
}
