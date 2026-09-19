/** Names the map as the second way in, so "Start the story" reads as the main one. */
export function MapHeading({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--state-learning)]">
        Or explore every concept
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">Tap any node. There is no required order.</p>
    </div>
  );
}
