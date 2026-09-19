"use client";

import { useEffect, useRef, useState } from "react";

interface MockBrowserProps {
  /** Can the visitor see the page content right now? */
  visible: boolean;
  /** Does clicking the button actually do something right now? */
  interactive: boolean;
  /** One plain sentence describing the current moment, shown under the window. */
  note: string;
  /** Shown instead of the page when nothing has been requested yet. */
  idle?: boolean;
}

function Light({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
      <span
        className="h-2 w-2 rounded-full transition-colors duration-300"
        style={{ backgroundColor: on ? "var(--state-got-it)" : "var(--color-border)" }}
      />
      <span style={{ color: on ? "var(--color-text-primary)" : undefined }}>{label}</span>
    </span>
  );
}

/**
 * A tiny fake browser window. The point is to make the abstract idea of
 * "visible" vs "interactive" tangible: two lights, and a real button you
 * can click. Clicking before the page is interactive shows *why* nothing
 * happened, which is the exact thing people misunderstand about hydration.
 */
export function MockBrowser({ visible, interactive, note, idle = false }: MockBrowserProps) {
  const [clicks, setClicks] = useState(0);
  const [missed, setMissed] = useState(false);
  const missTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (missTimer.current) clearTimeout(missTimer.current); }, []);

  function handleClick() {
    if (interactive) {
      setClicks((c) => c + 1);
      return;
    }
    setMissed(true);
    if (missTimer.current) clearTimeout(missTimer.current);
    missTimer.current = setTimeout(() => setMissed(false), 1800);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
          <span className="ml-2 rounded bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)]">
            example.com
          </span>
        </div>

        <div className="relative min-h-[8.5rem] p-4">
          {visible ? (
            <div className="flex flex-col gap-2">
              <div className="h-3 w-2/5 rounded bg-[var(--color-text-primary)]/70" />
              <div className="h-2 w-full rounded bg-[var(--color-text-muted)]/40" />
              <div className="h-2 w-4/5 rounded bg-[var(--color-text-muted)]/40" />
              <button
                onClick={handleClick}
                className="mt-2 w-fit rounded-md border px-3 py-1.5 text-xs transition-colors"
                style={{
                  borderColor: interactive ? "var(--state-got-it)" : "var(--color-border)",
                  color: interactive ? "var(--state-got-it)" : "var(--color-text-muted)",
                  cursor: interactive ? "pointer" : "not-allowed",
                }}
              >
                Like this page ({clicks})
              </button>
              {missed && (
                <p className="text-[11px] text-[var(--state-revisit)]">
                  Nothing happened: no click handler is attached yet.
                </p>
              )}
            </div>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
              {idle ? "Press Play to start" : "Blank page"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Light on={visible} label="Content visible" />
        <Light on={interactive} label="Clickable" />
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-primary)]">{note}</p>
    </div>
  );
}
