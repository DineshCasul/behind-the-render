"use client";

interface OnOffControlProps {
  value: boolean;
  onChange: (v: boolean) => void;
  /** Accessible name, e.g. "Server HTML". */
  label: string;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}

/**
 * A two-button segmented control (OFF | ON) with the state written out in
 * words. Replaces a sliding switch: a dark knob on a dark UI was nearly
 * invisible, and a bare switch doesn't say which side means what. Here the
 * active side is a solid, high-contrast fill and both options are always
 * readable, so the current state is never something you have to infer.
 */
export function OnOffControl({
  value,
  onChange,
  label,
  disabled,
  onLabel = "ON",
  offLabel = "OFF",
}: OnOffControlProps) {
  const base =
    "px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed";

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex shrink-0 overflow-hidden rounded-md border border-[var(--color-text-muted)]/50"
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={!value}
        onClick={() => onChange(false)}
        className={`${base} border-r border-[var(--color-text-muted)]/50`}
        style={{
          backgroundColor: !value ? "var(--color-text-muted)" : "transparent",
          color: !value ? "#05070a" : "var(--color-text-muted)",
        }}
      >
        {offLabel}
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={value}
        onClick={() => onChange(true)}
        className={base}
        style={{
          backgroundColor: value ? "var(--state-got-it)" : "transparent",
          color: value ? "#05070a" : "var(--color-text-muted)",
        }}
      >
        {onLabel}
      </button>
    </div>
  );
}
