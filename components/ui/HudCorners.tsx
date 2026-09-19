const CORNER_POSITIONS = [
  "left-4 top-4 border-l border-t",
  "right-4 top-4 border-r border-t",
  "left-4 bottom-4 border-l border-b",
  "right-4 bottom-4 border-r border-b",
] as const;

/**
 * Four faint corner brackets, like a targeting/instrument overlay. Purely
 * decorative, static (no motion, no client boundary needed).
 */
export function HudCorners() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {CORNER_POSITIONS.map((position) => (
        <div
          key={position}
          className={`absolute h-6 w-6 border-[var(--color-border)] ${position}`}
        />
      ))}
    </div>
  );
}
