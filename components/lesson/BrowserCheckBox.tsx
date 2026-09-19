import type { BrowserCheck } from "@/data/browser-checks";
import { Prose } from "@/components/lesson/Prose";

/**
 * A collapsed "try it yourself" activity that uses the browser as the
 * learning tool. Same native `<details>` approach as the worked examples:
 * accessible, no JavaScript, stays a Server Component. Violet marks it as
 * a different kind of thing from an example (cyan) or a warning (amber).
 */
export function BrowserCheckBox({ check }: { check: BrowserCheck }) {
  return (
    <details className="group mt-4 rounded-lg border border-[var(--color-border)] transition-colors open:border-[var(--state-mastered)]/50">
      <summary className="flex list-none items-center gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <span className="shrink-0 rounded-full border border-[var(--state-mastered)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--state-mastered)]">
          Try it
        </span>
        <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">{check.title}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] group-open:hidden">
          Show
        </span>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] group-open:inline">
          Hide
        </span>
      </summary>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
          <span className="rounded bg-[var(--color-bg-elevated)] px-2 py-0.5 font-mono">{check.tool}</span>
          {check.chromiumOnly && (
            <span className="rounded border border-[var(--state-revisit)] px-2 py-0.5 font-mono text-[var(--state-revisit)]">
              Chrome / Edge only
            </span>
          )}
        </div>

        {check.needs && (
          <p className="rounded-md border border-[var(--state-revisit)]/40 p-2 text-xs leading-relaxed text-[var(--color-text-primary)]">
            <span className="font-mono uppercase tracking-wide text-[var(--state-revisit)]">You need: </span>
            <Prose text={check.needs} />
          </p>
        )}

        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-xs leading-relaxed text-[var(--color-text-primary)]">
          {check.steps.map((step, i) => (
            <li key={i}>
              <Prose text={step} />
            </li>
          ))}
        </ol>

        <div className="rounded-md bg-[var(--color-bg-elevated)]/60 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-got-it)]">What you should see</p>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-xs leading-relaxed text-[var(--color-text-primary)]">
            {check.expect.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--state-got-it)]">✦</span>
                <span>
                  <Prose text={line} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {check.devtools && (
          <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
            Open DevTools with <kbd className="font-mono">F12</kbd> or <kbd className="font-mono">Ctrl+Shift+I</kbd>. Panel names differ a little: Chrome and
            Edge&apos;s <em>Elements</em> is Firefox&apos;s <em>Inspector</em>.
          </p>
        )}
      </div>
    </details>
  );
}
