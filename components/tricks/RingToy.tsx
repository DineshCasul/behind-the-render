"use client";

import { useState } from "react";
import { Legend, Slider, Stats, ToyFrame } from "@/components/tricks/toy-ui";

const KEYS = 48;
const NAMES = "ABCDEFGH";
const R = 130;
const C = 180;
const TAU = Math.PI * 2;

/** FNV-1a followed by a final mix, so short similar names spread out around the ring. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

const angleOf = (h: number) => (h / 4294967296) * TAU - Math.PI / 2;
const at = (h: number, radius = R) => ({ x: C + radius * Math.cos(angleOf(h)), y: C + radius * Math.sin(angleOf(h)) });

interface Point {
  h: number;
  server: string;
}

function ringPoints(n: number, replicas: number): Point[] {
  const pts: Point[] = [];
  for (let s = 0; s < n; s++) for (let i = 0; i < replicas; i++) pts.push({ h: hash(NAMES[s] + "#" + i), server: NAMES[s] });
  return pts.sort((a, b) => a.h - b.h);
}

/** The first point at or after the key's position, wrapping around the end of the ring. */
const ownerOnRing = (pts: Point[], keyHash: number) => pts.find((p) => p.h >= keyHash) ?? pts[0];

/**
 * The hash ring toy. 48 keys sit on a ring; each belongs to the first server point
 * clockwise from it. Add or remove a server and the toy counts how many keys changed
 * owner on the ring, and how many would have changed with `hash(key) % servers`.
 * Only the keys that moved on the ring are drawn with a line to their new owner.
 */
export function RingToy() {
  const [{ n, prevN }, setN] = useState({ n: 4, prevN: 4 });
  const [replicas, setReplicas] = useState(8);

  const keyHashes = Array.from({ length: KEYS }, (_, i) => hash("key-" + i));
  const now = ringPoints(n, replicas);
  const before = ringPoints(prevN, replicas);

  const owners = keyHashes.map((h) => ownerOnRing(now, h));
  const moved = keyHashes.map((h, i) => ownerOnRing(before, h).server !== owners[i].server);
  const ringMoved = moved.filter(Boolean).length;
  const modMoved = keyHashes.filter((h) => NAMES[h % n] !== NAMES[h % prevN]).length;

  const load = NAMES.slice(0, n)
    .split("")
    .map((s) => owners.filter((o) => o.server === s).length);
  const spread = `${Math.min(...load)} to ${Math.max(...load)} keys per server`;

  const change = (delta: number) => setN(({ n: cur }) => ({ n: Math.max(2, Math.min(8, cur + delta)), prevN: cur }));

  return (
    <ToyFrame
      title="add a server, count the keys that move"
      note="A model: servers and keys are made-up names, hashed with a small non-cryptographic hash. The 'modulo' count is what hash(key) % number of servers would have done with the same keys."
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <Slider label="Points per server" value={replicas} min={1} max={30} hint="One point is uneven. More points smooth the spread." onChange={setReplicas} />
        <div className="flex items-center gap-2">
          <button type="button" className="btn" onClick={() => change(-1)} disabled={n <= 2}>
            remove a server
          </button>
          <button type="button" className="btn" onClick={() => change(1)} disabled={n >= 8}>
            add a server
          </button>
        </div>
      </div>

      <svg viewBox="0 0 360 360" className="mx-auto block w-full max-w-md" role="img" aria-label={`A hash ring with ${n} servers and ${KEYS} keys. ${ringMoved} keys moved owner on the last change.`}>
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-border)" strokeWidth={1.5} />
        {keyHashes.map((h, i) =>
          moved[i] ? <line key={"l" + i} x1={at(h).x} y1={at(h).y} x2={at(owners[i].h).x} y2={at(owners[i].h).y} stroke="var(--state-revisit)" strokeOpacity={0.6} /> : null,
        )}
        {now.map((p, i) => {
          const pos = at(p.h);
          const first = now.findIndex((q) => q.server === p.server) === i;
          return <rect key={"p" + i} x={pos.x - (first ? 4 : 2)} y={pos.y - (first ? 4 : 2)} width={first ? 8 : 4} height={first ? 8 : 4} fill="var(--state-got-it)" fillOpacity={first ? 1 : 0.55} />;
        })}
        {NAMES.slice(0, n)
          .split("")
          .map((s) => ({ s, h: now.find((q) => q.server === s)!.h }))
          .sort((x, y) => x.h - y.h)
          .map(({ s, h }, order) => {
            // alternate the distance by position around the ring, so neighbouring labels never share a radius
            const pos = at(h, R + 16 + (order % 2) * 14);
            return (
              <text key={"t" + s} x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={13} fill="var(--state-got-it)" style={{ fontFamily: "var(--font-mono)" }}>
                {s}
              </text>
            );
          })}
        {keyHashes.map((h, i) => (
          <circle key={"k" + i} cx={at(h).x} cy={at(h).y} r={moved[i] ? 4.5 : 3} fill={moved[i] ? "var(--state-revisit)" : "var(--color-text-muted)"} />
        ))}
        <text x={C} y={C - 4} textAnchor="middle" fontSize={26} fill="var(--color-text-primary)" style={{ fontFamily: "var(--font-mono)" }}>
          {n}
        </text>
        <text x={C} y={C + 16} textAnchor="middle" fontSize={11} fill="var(--color-text-muted)" style={{ fontFamily: "var(--font-mono)" }}>
          servers
        </text>
      </svg>

      <Legend
        items={[
          { color: "var(--state-got-it)", label: "server points (labelled A, B, ...)" },
          { color: "var(--color-text-muted)", label: "a key that stayed" },
          { color: "var(--state-revisit)", label: "a key that changed owner" },
        ]}
      />

      <Stats
        items={[
          { label: "keys moved on the ring", value: `${ringMoved} of ${KEYS}`, tone: "good" },
          { label: "keys moved by hash % servers", value: `${modMoved} of ${KEYS}`, tone: "bad" },
          { label: "load right now", value: spread },
        ]}
      />
      {prevN === n && <p className="label">Add or remove a server to see which keys move.</p>}
    </ToyFrame>
  );
}
