import type { CodeSnippet } from "@/lib/types";

/**
 * Splits a line into code and a trailing comment so comments can be dimmed.
 * Only `//` and `<!--` preceded by whitespace count, so URLs like
 * `https://example.com` are left alone. Deliberately not a real highlighter:
 * a syntax-highlighting library would add real JavaScript weight for what is
 * a handful of short snippets, and this is a Server Component that ships none.
 */
function renderLine(line: string): React.ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("<!--")) {
    return <span className="text-[var(--color-text-muted)]">{line}</span>;
  }
  const at = line.search(/\s(\/\/|<!--)\s/);
  if (at > 0) {
    return (
      <>
        {line.slice(0, at)}
        <span className="text-[var(--color-text-muted)]">{line.slice(at)}</span>
      </>
    );
  }
  return line;
}

export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const lines = snippet.code.split("\n");
  const marked = new Set(snippet.mark ?? []);

  return (
    <figure className="overflow-hidden rounded-md border border-[var(--color-border)]">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5">
        {snippet.caption && (
          <span className="text-xs text-[var(--color-text-primary)]">{snippet.caption}</span>
        )}
        <span className="ml-auto flex items-center gap-2">
          {snippet.fromSite && (
            <span className="rounded-full border border-[var(--state-got-it)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--state-got-it)]">
              From this site
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
            {snippet.lang}
          </span>
        </span>
      </figcaption>
      <pre className="overflow-x-auto bg-[var(--color-bg)]/60 py-3 font-mono [font-variant-ligatures:none] text-[12px] leading-relaxed text-[var(--color-text-primary)]">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className="block px-3"
              style={marked.has(i + 1) ? { backgroundColor: "color-mix(in srgb, var(--state-learning) 14%, transparent)" } : undefined}
            >
              {line === "" ? " " : renderLine(line)}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
