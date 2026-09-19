"use client";

import { useCallback, useSyncExternalStore } from "react";
import { concepts } from "@/data/concepts";
import { readJSON, writeJSON } from "@/lib/storage";
import type { ConceptId, NodeStatus, ProgressState } from "@/lib/types";

const STORAGE_KEY = "rendering-lab:progress:v1";

export const STATUS_ORDER: NodeStatus[] = [
  "not-started",
  "learning",
  "got-it",
  "revisit",
  "mastered",
];

export const STATUS_LABEL: Record<NodeStatus, string> = {
  "not-started": "Not started",
  learning: "Learning",
  "got-it": "Got it",
  revisit: "Revisit",
  mastered: "Mastered",
};

function defaultProgress(): ProgressState {
  return Object.fromEntries(
    concepts.map((c) => [c.id, "not-started" as NodeStatus]),
  ) as ProgressState;
}

/**
 * A tiny external store: progress lives in this module (backed by
 * localStorage), not in any single component's React state. Multiple
 * components (the map, the panel) read the same snapshot and re-render
 * together when it changes — the same shape as Redux/Zustand, just small
 * enough to write by hand.
 *
 * `useSyncExternalStore` (not `useState` + `useEffect`) is what makes this
 * safe under SSR: `getServerSnapshot` always returns the all-"not-started"
 * default, so the server-rendered HTML and the client's first render agree.
 * The moment React hydrates, `getSnapshot` starts reading the real
 * localStorage value, and the map updates on the next tick — no manual
 * effect, no synchronous setState-during-render.
 */
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

// A single stable reference, computed once. `useSyncExternalStore` compares
// `getServerSnapshot()` across renders with `Object.is` — returning a fresh
// object each call (e.g. `defaultProgress()` inline) makes React think the
// snapshot changes on every render and re-render forever.
const SERVER_SNAPSHOT = defaultProgress();

function getSnapshot(): ProgressState {
  if (cache === null) {
    cache = readJSON(STORAGE_KEY, defaultProgress());
  }
  return cache;
}

function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function commit(next: ProgressState) {
  cache = next;
  writeJSON(STORAGE_KEY, next);
  for (const listener of listeners) listener();
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setStatus = useCallback((id: ConceptId, status: NodeStatus) => {
    commit({ ...getSnapshot(), [id]: status });
  }, []);

  const cycleStatus = useCallback((id: ConceptId) => {
    const current = getSnapshot();
    const nextIndex = (STATUS_ORDER.indexOf(current[id]) + 1) % STATUS_ORDER.length;
    commit({ ...current, [id]: STATUS_ORDER[nextIndex] });
  }, []);

  return { progress, setStatus, cycleStatus };
}
