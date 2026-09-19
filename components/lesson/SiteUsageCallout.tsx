import type { SiteUsage, SiteUsageStatus } from "@/data/site-usage";
import { Prose } from "@/components/lesson/Prose";

const STATUS: Record<SiteUsageStatus, { label: string; color: string }> = {
  used: { label: "Used in this site", color: "var(--state-got-it)" },
  partly: { label: "Partly used", color: "var(--state-revisit)" },
  "not-used": { label: "Not used here, on purpose", color: "var(--color-text-muted)" },
};

/**
 * "Where does this show up in the site you're reading?" Honest by design:
 * a concept the site doesn't use gets a "Not used here" badge and the
 * reason, rather than a stretched claim. A Server Component, like the
 * rest of the lesson: it's static text, so it ships no JavaScript.
 */
export function SiteUsageCallout({ usage }: { usage: SiteUsage }) {
  const { label, color } = STATUS[usage.status];

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}>
      <span
        className="inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
        style={{ borderColor: color, color }}
      >
        {label}
      </span>
      <h3 className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{usage.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
        <Prose text={usage.explanation} />
      </p>

      {usage.whyNot && (
        <p className="mt-3 rounded-md bg-[var(--color-bg-elevated)]/60 p-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
          <span className="font-mono uppercase tracking-wide text-[var(--state-revisit)]">
            {usage.status === "not-used" ? "Why not, and when you would: " : "Why only partly: "}
          </span>
          <Prose text={usage.whyNot} />
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Where in the code</p>
          <ul className="mt-1.5 flex flex-col gap-2">
            {usage.evidence.map((e) => (
              <li key={e.path} className="text-xs leading-snug text-[var(--color-text-muted)]">
                <code className="rounded bg-[var(--color-bg-elevated)] px-1 py-0.5 font-mono text-[11px] text-[var(--state-learning)]">
                  {e.path}
                </code>
                <span className="mt-0.5 block">{e.what}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Check it yourself</p>
          <ol className="mt-1.5 flex list-decimal flex-col gap-2 pl-4 text-xs leading-relaxed text-[var(--color-text-primary)]">
            {usage.verify.map((step, i) => (
              <li key={i}>
                <Prose text={step} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      {usage.notes && usage.notes.length > 0 && (
        <p className="mt-4 text-[11px] text-[var(--color-text-muted)]">
          Read how it was built:{" "}
          {usage.notes.map((n, i) => (
            <span key={n}>
              {i > 0 && ", "}
              <code className="font-mono">learning-notes/{n}.md</code>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
