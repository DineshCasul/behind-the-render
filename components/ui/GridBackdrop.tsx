/**
 * Static (non-animated) grid + vignette background. A Server Component —
 * it renders no interactivity, so there is no reason to pay for a client
 * bundle here. Purely decorative divs behind the real content.
 */
export function GridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-vignette" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05070a]" />
    </div>
  );
}
