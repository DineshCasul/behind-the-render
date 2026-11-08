import type { Alternative } from "@/data/journey";

/** Other ways to solve the same problem, each linked to that tool's own docs. Shared by the trick pages and the walkthroughs. */
export function AlternativesList({ alternatives }: { alternatives: Alternative[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {alternatives.map((a) => (
        <li key={a.name} className="read">
          <a href={a.href} target="_blank" rel="noopener noreferrer" className="link font-medium text-[var(--color-text-primary)]">
            {a.name} ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          {a.why}
        </li>
      ))}
    </ul>
  );
}
