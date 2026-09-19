import { AmbientGlow } from "@/components/ui/AmbientGlow";

/**
 * Layered backdrop: blueprint grid, two off-center color blooms, a
 * darkening edge, and a faint grain to keep gradients from looking flat.
 * All static (Server Component) except AmbientGlow, which isolates the
 * one bit of motion into its own small client boundary.
 */
export function GridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-grid opacity-70" />
      <AmbientGlow />
      <div className="absolute inset-0 bg-vignette" />
      <div className="absolute inset-0 bg-grain mix-blend-overlay" />
    </div>
  );
}
