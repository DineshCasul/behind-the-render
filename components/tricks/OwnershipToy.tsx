"use client";

import { useState } from "react";
import { Stats, ToyFrame } from "@/components/tricks/toy-ui";

const REASONS = [
  { id: "user-saved", label: "the user saved it" },
  { id: "parent:travel", label: "its parent page is offline" },
  { id: "auto-download", label: "an automatic download kept it" },
] as const;

/**
 * The ownership toy: one page, three reasons it can be kept offline. Toggle a reason
 * to add or release it. The page becomes a candidate for eviction only when the set
 * is empty, and the toy shows what a plain counter would have told you instead.
 *
 * `release` mirrors the sketch on the page: it returns true when no owner remains.
 */
export function OwnershipToy() {
  const [owners, setOwners] = useState<Set<string>>(new Set(REASONS.map((r) => r.id)));
  const [last, setLast] = useState("All three reasons hold the page. Release one at a time.");

  const toggle = (id: string, label: string) => {
    const next = new Set(owners);
    if (next.has(id)) {
      next.delete(id);
      setLast(
        next.size === 0
          ? `Released ${id}: no owner left, release() returned true. The page is a candidate for eviction.`
          : `Released ${id} (${label}). ${next.size} ${next.size === 1 ? "reason remains" : "reasons remain"}, so the page stays.`,
      );
    } else {
      next.add(id);
      setLast(`Added ${id}: ${label}. The page is held again.`);
    }
    setOwners(next);
  };

  const kept = owners.size > 0;

  return (
    <ToyFrame
      title="who owns this page?"
      note="A model of the idea, not Notion's code. A true result from release() means no tracked owner remains. In a real app you would still handle persistence, concurrent updates and eviction failures before deleting anything."
    >
      <div className={`border px-4 py-3 ${kept ? "border-[var(--state-got-it)]" : "border-[var(--state-revisit)]"}`}>
        <p className="font-mono text-sm text-[var(--color-text-muted)]">page: japan-guide</p>
        <p className={`text-lg ${kept ? "text-[var(--state-got-it)]" : "text-[var(--state-revisit)]"}`}>
          {kept ? "kept offline" : "no owner left: evictable"}
        </p>
      </div>

      <div className="flex flex-col gap-2" role="group" aria-label="Reasons the page is kept">
        {REASONS.map((r) => {
          const held = owners.has(r.id);
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={held}
              onClick={() => toggle(r.id, r.label)}
              className="flex items-center justify-between gap-4 border px-4 py-2 text-left transition-colors hover:border-[var(--state-learning)]"
              style={{ borderColor: held ? "var(--state-got-it)" : "var(--color-border)" }}
            >
              <span>
                <span className="block font-mono text-sm text-[var(--color-text-primary)]">{r.id}</span>
                <span className="block font-[family-name:var(--font-read)] text-sm text-[var(--color-text-muted)]">{r.label}</span>
              </span>
              <span className="font-mono text-xs" style={{ color: held ? "var(--state-got-it)" : "var(--color-text-muted)" }}>
                {held ? "held · click to release" : "released · click to add"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="font-[family-name:var(--font-read)] text-[var(--color-text-body)]" aria-live="polite">
        {last}
      </p>

      <Stats
        items={[
          { label: "owners (the set)", value: owners.size ? [...owners].join(", ") : "{ }", tone: kept ? "good" : "bad" },
          { label: "a plain counter would say", value: String(owners.size) },
          { label: "which one can tell you why?", value: "only the set" },
        ]}
      />
    </ToyFrame>
  );
}
