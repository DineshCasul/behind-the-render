"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "@/lib/storage";

const PATH_KEY = "rendering-lab:story-journey:v1";
const CHOICES_KEY = "rendering-lab:story-choices:v1";
const EMPTY_PATH: readonly string[] = Object.freeze([]);
const EMPTY_CHOICES: Readonly<Record<string, number>> = Object.freeze({});

/**
 * What a reader did in the story: the PATH they walked ("How did I get
 * here?") and the CHOICES they made at each decision (step id to the index of
 * the option they took), which the last step turns into a design summary.
 *
 * Same shape as lib/progress.ts: tiny external stores backed by localStorage,
 * read with `useSyncExternalStore` so the server render (empty) and the first
 * client render agree. Values are replaced, never mutated, because React
 * compares snapshots by reference. Stored data is never trusted to be
 * well-formed (it outlives the code that wrote it), so it is validated on read.
 */
let pathCache: readonly string[] | null = null;
let choicesCache: Readonly<Record<string, number>> | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function readPath(): readonly string[] {
  if (pathCache === null) {
    const raw = readJSON<unknown>(PATH_KEY, []);
    pathCache = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
  }
  return pathCache;
}

function readChoices(): Readonly<Record<string, number>> {
  if (choicesCache === null) {
    const raw = readJSON<unknown>(CHOICES_KEY, {});
    const clean: Record<string, number> = {};
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      for (const [k, v] of Object.entries(raw)) if (Number.isInteger(v) && (v as number) >= 0) clean[k] = v as number;
    }
    choicesCache = clean;
  }
  return choicesCache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function commitPath(next: readonly string[]) {
  pathCache = next;
  writeJSON(PATH_KEY, next);
  notify();
}

function commitChoices(next: Readonly<Record<string, number>>) {
  choicesCache = next;
  writeJSON(CHOICES_KEY, next);
  notify();
}

export function useJourney() {
  const path = useSyncExternalStore(subscribe, readPath, () => EMPTY_PATH);

  /** Arriving at a step you're already standing on (or refreshing) adds nothing. */
  const visit = useCallback((id: string, startsOver: boolean) => {
    const current = readPath();
    if (startsOver) {
      commitChoices({});
      return commitPath([id]);
    }
    if (current[current.length - 1] === id) return;
    // Going back to a step you've already been to trims the trail to it,
    // so the trail always reads as one path, not a log of every click.
    const at = current.indexOf(id);
    commitPath(at >= 0 ? current.slice(0, at + 1) : [...current, id]);
  }, []);

  return { path, visit };
}

export function useChoices() {
  const choices = useSyncExternalStore(subscribe, readChoices, () => EMPTY_CHOICES);
  const choose = useCallback((stepId: string, optionIndex: number) => {
    commitChoices({ ...readChoices(), [stepId]: optionIndex });
  }, []);
  return { choices, choose };
}
