"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "@/lib/storage";

const KEY = "rendering-lab:story-journey:v1";
const EMPTY: readonly string[] = Object.freeze([]);

/**
 * The path a reader has walked through the story, in order ("How did I get
 * here?"). Same shape as lib/progress.ts: a tiny external store backed by
 * localStorage, read with `useSyncExternalStore` so the server render (an
 * empty trail) and the first client render agree. The array is replaced,
 * never mutated, because React compares snapshots by reference.
 */
let cache: readonly string[] | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): readonly string[] {
  if (cache === null) cache = readJSON<string[]>(KEY, []);
  return cache;
}
const getServerSnapshot = () => EMPTY;
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function commit(next: readonly string[]) {
  cache = next;
  writeJSON(KEY, next);
  for (const l of listeners) l();
}

export function useJourney() {
  const path = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** Arriving at a step you're already standing on (or refreshing) adds nothing. */
  const visit = useCallback((id: string, startsOver: boolean) => {
    const current = getSnapshot();
    if (startsOver) return commit([id]);
    if (current[current.length - 1] === id) return;
    // Going back to a step you've already been to trims the trail to it,
    // so the trail always reads as one path, not a log of every click.
    const at = current.indexOf(id);
    commit(at >= 0 ? current.slice(0, at + 1) : [...current, id]);
  }, []);

  return { path, visit };
}
