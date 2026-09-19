import type { Example } from "@/lib/types";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { Prose } from "@/components/lesson/Prose";

/**
 * A collapsed-by-default worked example under a lesson section. Uses the
 * native `<details>` element: it is keyboard accessible, remembers nothing it
 * doesn't need to, and needs no JavaScript at all, so it stays a Server
 * Component and adds nothing to the client bundle.
 */
export function ExampleBox({ example }: { example: Example }) {
  return (
    <details className="group mt-4 rounded-lg border border-[var(--color-border)] transition-colors open:border-[var(--state-learning)]/50">
      <summary className="flex list-none items-center gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <span className="shrink-0 rounded-full border border-[var(--state-learning)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--state-learning)]">
          Example
        </span>
        <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">{example.title}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] group-open:hidden">
          Show
        </span>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] group-open:inline">
          Hide
        </span>
      </summary>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-3">
        {example.snippets.map((snippet, i) => (
          <CodeBlock key={i} snippet={snippet} />
        ))}
        <div className="rounded-md bg-[var(--color-bg-elevated)]/60 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-got-it)]">What to notice</p>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-xs leading-relaxed text-[var(--color-text-primary)]">
            {example.notice.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--state-got-it)]">✦</span>
                <span>
                  <Prose text={line} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
