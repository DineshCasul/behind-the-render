import { useId } from "react";

/** A labelled range input: label left, live value right, optional hint underneath. Every toy uses it so they line up. */
export function Slider({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  hint,
  onChange,
}: {
  label: string;
  value: number;
  display?: string;
  min: number;
  max: number;
  step?: number;
  hint?: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm text-[var(--color-text-muted)]">
        <span>{label}</span>
        <span className="tabular-nums text-[var(--color-text-primary)]">{display ?? value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--state-learning)]"
      />
      {hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}

/** The frame every toy sits in: a title line, the controls and stage, then the honest "what this is" note. */
export function ToyFrame({ title, children, note }: { title: string; children: React.ReactNode; note: string }) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <p className="label border-b border-[var(--color-border)] px-4 py-2"># toy: {title}</p>
      <div className="flex flex-col gap-5 p-4 sm:p-5">{children}</div>
      <p className="label border-t border-[var(--color-border)] px-4 py-3 leading-relaxed sm:px-5">{note}</p>
    </div>
  );
}

/** A grid of big numbers. `tone` colours the value: green good, red bad. */
export function Stats({ items }: { items: { label: string; value: string; tone?: "good" | "bad" }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3" aria-live="polite">
      {items.map((s) => (
        <div key={s.label} className="bg-[var(--color-bg)] px-3 py-2">
          <dt className="text-xs text-[var(--color-text-muted)]">{s.label}</dt>
          <dd className={`tabular-nums ${s.tone === "good" ? "text-[var(--state-got-it)]" : s.tone === "bad" ? "text-[var(--state-revisit)]" : "text-[var(--color-text-primary)]"}`}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Colour key, so the red / green / blue in a toy never has to be guessed. */
export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--color-text-muted)]">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
