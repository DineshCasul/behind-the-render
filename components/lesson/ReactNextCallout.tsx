import { Prose } from "@/components/lesson/Prose";

export function ReactNextCallout({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-[var(--state-got-it)]/40 bg-[var(--state-got-it)]/[0.06] p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--state-got-it)]">
        React / Next.js connection
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
        <Prose text={text} />
      </p>
    </div>
  );
}
