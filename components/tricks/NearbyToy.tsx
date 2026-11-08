"use client";

import { Legend, Slider, Stats, ToyFrame } from "@/components/tricks/toy-ui";
import { useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";

const W = 600;
const H = 400;
const DRIVERS = 60;
/** Hexagon radius at resolution 0, in map units. */
const BASE = 90;
/** Each finer resolution has cells with one seventh the area, so the radius shrinks by sqrt(7). */
const SHRINK = Math.sqrt(7);
const STEP = 15;

interface Pt {
  x: number;
  y: number;
}
interface Cell {
  q: number;
  r: number;
}

/** A small seeded random number generator, so "the same drivers" is repeatable and SSR-safe. */
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Hexagon grid maths (pointy-top, axial coordinates) ----

function cubeRound(qf: number, rf: number): Cell {
  const sf = -qf - rf;
  let q = Math.round(qf);
  let r = Math.round(rf);
  const s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  return { q, r };
}

/** Which cell a point falls in. */
function pointToCell(p: Pt, size: number): Cell {
  return cubeRound(((Math.sqrt(3) / 3) * p.x - p.y / 3) / size, ((2 / 3) * p.y) / size);
}

function cellCentre(c: Cell, size: number): Pt {
  return { x: size * Math.sqrt(3) * (c.q + c.r / 2), y: size * 1.5 * c.r };
}

/** How many cell steps apart two cells are. */
function cellDistance(a: Cell, b: Cell) {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

function hexPoints(centre: Pt, size: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${(centre.x + size * Math.cos(angle)).toFixed(1)},${(centre.y + size * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The "find nearby" toy: put drivers on a map, put a rider somewhere, and see
 * how searching only the rider's grid cell and its neighbours compares with
 * checking every driver.
 *
 * It copies two things from Uber's H3 post: cells are hexagons, and each finer
 * resolution has cells with one seventh the area. It is not H3 itself (H3 lives
 * on a sphere), and the "found it or missed it" check is the toy's own, so the
 * page says so underneath. Only the cells near the rider are drawn, which keeps
 * the SVG small even at the finest resolution.
 */
export function NearbyToy() {
  const [seed, setSeed] = useState(7);
  const [level, setLevel] = useState(1);
  const [rings, setRings] = useState(1);
  const [rider, setRider] = useState<Pt>({ x: 300, y: 200 });

  const drivers = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: DRIVERS }, (_, id) => ({ id, x: 20 + rand() * (W - 40), y: 20 + rand() * (H - 40) }));
  }, [seed]);

  const size = BASE / SHRINK ** level;
  const riderCell = pointToCell(rider, size);

  // Cells to draw: the searched ones, plus one ring around them for context.
  const cells: { key: string; centre: Pt; searched: boolean }[] = [];
  const span = rings + 1;
  for (let dq = -span; dq <= span; dq++) {
    for (let dr = -span; dr <= span; dr++) {
      const cell = { q: riderCell.q + dq, r: riderCell.r + dr };
      const d = cellDistance(cell, riderCell);
      if (d <= span) cells.push({ key: `${cell.q},${cell.r}`, centre: cellCentre(cell, size), searched: d <= rings });
    }
  }

  const candidates = drivers.filter((d) => cellDistance(pointToCell(d, size), riderCell) <= rings);
  const candidateIds = new Set(candidates.map((d) => d.id));
  const trueNearest = drivers.reduce((best, d) => (dist(d, rider) < dist(best, rider) ? d : best), drivers[0]);
  const found = candidates.reduce<typeof trueNearest | null>((best, d) => (!best || dist(d, rider) < dist(best, rider) ? d : best), null);
  const missed = found !== null && found.id !== trueNearest.id;

  const moveTo = (e: PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    setRider({ x: clamp(((e.clientX - box.left) / box.width) * W, 0, W), y: clamp(((e.clientY - box.top) / box.height) * H, 0, H) });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const move: Record<string, Pt> = { ArrowLeft: { x: -STEP, y: 0 }, ArrowRight: { x: STEP, y: 0 }, ArrowUp: { x: 0, y: -STEP }, ArrowDown: { x: 0, y: STEP } };
    const m = move[e.key];
    if (!m) return;
    e.preventDefault();
    setRider((r) => ({ x: clamp(r.x + m.x, 0, W), y: clamp(r.y + m.y, 0, H) }));
  };

  const cellsSearched = 1 + 3 * rings * (rings + 1);
  const result = found === null ? "no driver in range" : missed ? "missed the nearest" : "found the nearest";

  return (
    <ToyFrame
      title="find the nearest driver"
      note="A toy hex grid, not H3. It copies two things from Uber's post: cells are hexagons, and each finer resolution has cells with one seventh the area. The drivers, the rings and the found-or-missed check are this toy's own, to show why a grid lookup finds candidates quickly but is not a guarantee."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="Resolution" value={level} min={0} max={3} hint="Each step up: cells with one seventh the area." onChange={setLevel} />
        <Slider label="Rings of neighbours searched" value={rings} min={0} max={2} hint="0 is the rider's own cell only." onChange={setRings} />
      </div>

      {/* The map. Pointer or arrow keys move the rider. */}
      <div
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Map with 60 drivers and one rider. Click or drag to move the rider, or use the arrow keys."
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full cursor-crosshair touch-none border border-[var(--color-border)] bg-[var(--color-bg)]"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            moveTo(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) moveTo(e);
          }}
        >
          {cells.map((c) => (
            <polygon
              key={c.key}
              points={hexPoints(c.centre, size)}
              fill={c.searched ? "var(--state-learning)" : "none"}
              fillOpacity={c.searched ? 0.1 : 0}
              stroke="var(--state-learning)"
              strokeOpacity={c.searched ? 0.55 : 0.18}
              strokeWidth={1}
            />
          ))}

          {drivers.map((d) => (
            <circle key={d.id} cx={d.x} cy={d.y} r={candidateIds.has(d.id) ? 4.5 : 3} fill={candidateIds.has(d.id) ? "var(--state-got-it)" : "var(--color-text-muted)"} fillOpacity={candidateIds.has(d.id) ? 1 : 0.55} />
          ))}

          {missed && <line x1={rider.x} y1={rider.y} x2={trueNearest.x} y2={trueNearest.y} stroke="var(--state-revisit)" strokeWidth={1.5} strokeDasharray="5 4" />}
          {found && <line x1={rider.x} y1={rider.y} x2={found.x} y2={found.y} stroke="var(--state-got-it)" strokeWidth={2} />}

          <circle cx={rider.x} cy={rider.y} r={9} fill="none" stroke="var(--state-revisit)" strokeWidth={2} />
          <circle cx={rider.x} cy={rider.y} r={3.5} fill="var(--state-revisit)" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Legend
          items={[
            { color: "var(--state-revisit)", label: "rider (drag me)" },
            { color: "var(--state-learning)", label: "searched cells" },
            { color: "var(--state-got-it)", label: "candidate drivers" },
            { color: "var(--color-text-muted)", label: "never looked at" },
          ]}
        />
        <button type="button" onClick={() => setSeed((s) => s + 1)} className="btn">
          new drivers
        </button>
      </div>

      <Stats
        items={[
          { label: `cells searched (1 + 3·${rings}·${rings + 1})`, value: String(cellsSearched) },
          { label: "exact distances worked out", value: `${candidates.length} of ${DRIVERS}` },
          { label: "result", value: result, tone: found === null || missed ? "bad" : "good" },
        ]}
      />
      {missed && <p className="text-sm text-[var(--state-revisit)]">The true nearest driver (dashed line) is outside the searched cells. Raise the rings, or the resolution, and try again.</p>}
    </ToyFrame>
  );
}
