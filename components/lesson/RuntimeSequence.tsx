import type { RuntimeActor, RuntimeStep } from "@/lib/types";
import { Prose } from "@/components/lesson/Prose";

const ACTOR_COLOR: Record<RuntimeActor, string> = {
  browser: "var(--state-learning)",
  network: "var(--color-text-muted)",
  server: "var(--state-mastered)",
  react: "var(--state-got-it)",
};

const ACTOR_LABEL: Record<RuntimeActor, string> = {
  browser: "Browser",
  network: "Network",
  server: "Server",
  react: "React",
};

/**
 * A static, server-rendered step sequence, no interactivity here, so
 * unlike the experiments this stays a plain Server Component (no
 * "use client", no animation library). It's a direct example of the
 * project's own "server rendering where appropriate" performance rule:
 * this diagram never needs to change after paint, so there's nothing for
 * client-side JS to do here at all.
 */
export function RuntimeSequence({ steps }: { steps: RuntimeStep[] }) {
  return (
    <ol className="flex flex-col divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] sm:flex-row sm:divide-x sm:divide-y-0">
      {steps.map((step, i) => (
        <li
          key={i}
          className="flex-1 border-t-2 p-3 sm:border-l-2 sm:border-t-0"
          style={{ borderColor: ACTOR_COLOR[step.actor] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: ACTOR_COLOR[step.actor] }}>
            {i + 1}. {ACTOR_LABEL[step.actor]}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">{step.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]"><Prose text={step.detail} /></p>
        </li>
      ))}
    </ol>
  );
}
