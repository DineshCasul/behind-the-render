import type { ServerVsBrowser } from "@/lib/types";
import { Prose } from "@/components/lesson/Prose";

const COLUMN_COLOR = {
  server: "var(--state-mastered)",
  network: "var(--color-text-muted)",
  browser: "var(--state-learning)",
} as const;

export function ServerBrowserSplit({ data }: { data: ServerVsBrowser }) {
  const columns: Array<{ key: keyof typeof COLUMN_COLOR; title: string; items: string[] }> = [
    { key: "server", title: "Server", items: data.server },
    { key: "network", title: "Network", items: data.network },
    { key: "browser", title: "Browser", items: data.browser },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.key} className="rounded-lg border border-[var(--color-border)] p-3">
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: COLUMN_COLOR[col.key] }}>
              {col.title}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {col.items.map((item, i) => (
                <li key={i} className="text-xs leading-relaxed text-[var(--color-text-primary)]">
                  <Prose text={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { term: "JavaScript required?", detail: data.jsRequired },
          { term: "When does hydration happen?", detail: data.hydrationTiming },
          { term: "Without JavaScript?", detail: data.withoutJs },
        ].map(({ term, detail }) => (
          <div key={term} className="rounded-lg bg-[var(--color-bg-elevated)]/60 p-3">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{term}</dt>
            <dd className="mt-1 text-xs leading-relaxed text-[var(--color-text-primary)]"><Prose text={detail} /></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
